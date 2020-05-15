<?php

/**

 * Created by IntelliJ IDEA.

 * User: luwei

 * Date: 2017/7/1

 * Time: 16:52

 */



namespace app\modules\api\models;

use app\models\Share;
use app\models\Option;
use app\models\baidu\MpConfig;
use app\models\User;
use Curl\Curl;
use app\hejiang\ApiResponse;
use app\modules\mch\models\Model;

class BdLoginForm extends ApiModel

{

    public $wechat_app;

    public $user_info;

    public $session_key;

    public $iv;

    public $ciphertext;

    public $store_id;

    public $openid;



    public function rules()

    {

        return [

            [['wechat_app', 'session_key', 'iv', 'ciphertext'], 'required'],

        ];

    }

    public function baidulogin()
    {

        $setting = Option::get('baidu_mp_config', $this->store_id);

        if (!$this->validate())
            return $this->errorResponse; 

        if ($this->openid && $this->openid!='undefined') {

            $data = array();

            $data['openid'] = $this->openid;

        } else {

            $plaintext = $this->decrypt($this->ciphertext, $this->iv, $setting->app_key, $this->session_key);

            $data = json_decode($plaintext, true);

        }

            $user = User::findOne(['wechat_open_id' => $data['openid'], 'store_id' => $this->store_id]);

            if (!$user) {

                $user = new User();

                $user->type = 1;

                $user->username = $data['openid'];

                $user->password = \Yii::$app->security->generatePasswordHash(\Yii::$app->security->generateRandomString(), 5);

                $user->auth_key = \Yii::$app->security->generateRandomString();

                $user->access_token = \Yii::$app->security->generateRandomString();

                $user->addtime = time();

                $user->is_delete = 0;

                $user->wechat_open_id = $data['openid'];

                $user->wechat_union_id = isset($data['unionId']) ? $data['unionId'] : '';

                $user->nickname = preg_replace('/[\xf0-\xf7].{3}/', '', $data['nickname']);

                $user->avatar_url = $data['headimgurl'] ? $data['headimgurl'] : \Yii::$app->request->hostInfo . \Yii::$app->request->baseUrl . '/statics/images/avatar.png';

                $user->store_id = $this->store_id;

                $user->platform = 2; // 百度

                $user->save();

                $same_user = User::find()->select('id')->where([

                    'AND',

                    [

                        'store_id' => $this->store_id,

                        'wechat_open_id' => $data['openid'],

                        'is_delete' => 0,

                    ],

                    ['<', 'id', $user->id],

                ])->one();

                if ($same_user) {

                    $user->delete();

                    $user = null;

                    $user = $same_user;

                }

            } else {

                $user_info = json_decode($this->user_info);
                
                $user->nickname = preg_replace('/[\xf0-\xf7].{3}/', '', $user_info->nickName);

                $user->avatar_url = $user_info->avatarUrl;

                $user->save();

            }

            $share = Share::findOne(['user_id' => $user->parent_id]);

            $share_user = User::findOne(['id' => $share->user_id]);

            $data = array(

                'access_token' => $user->access_token,

                'wechat_open_id'=> $user->wechat_open_id,

                'nickname' => $user->nickname,

                'avatar_url' => $user->avatar_url,

                'is_distributor' => $user->is_distributor ? $user->is_distributor : 0,

                'parent' => $share->id ? ($share->name ? $share->name : $share_user->nickname) : '总店',

                'id' => $user->id,

                'is_clerk' => $user->is_clerk === null ? 0 : $user->is_clerk,

                'integral' => $user->integral === null ? 0 : $user->integral,

                'money' => $user->money === null ? 0 : $user->money,

                'errCode' => 0,

            );

            return new ApiResponse(0, 'success', $data);

    }



    /**
     * 数据解密：低版本使用mcrypt库（PHP < 5.3.0），高版本使用openssl库（PHP >= 5.3.0）。
     *
     * @param string $ciphertext    待解密数据，返回的内容中的data字段
     * @param string $iv            加密向量，返回的内容中的iv字段
     * @param string $app_key       创建小程序时生成的app_key
     * @param string $session_key   登录的code换得的
     * @return string | false
     */
    private function decrypt($ciphertext, $iv, $app_key, $session_key) {
        $session_key = base64_decode($session_key);
        $iv = base64_decode($iv);
        $ciphertext = base64_decode($ciphertext);

        $plaintext = false;
        if (function_exists("openssl_decrypt")) {
            $plaintext = openssl_decrypt($ciphertext, "AES-192-CBC", $session_key, OPENSSL_RAW_DATA | OPENSSL_ZERO_PADDING, $iv);
        } else {
            $td = mcrypt_module_open(MCRYPT_RIJNDAEL_128, null, MCRYPT_MODE_CBC, null);
            mcrypt_generic_init($td, $session_key, $iv);
            $plaintext = mdecrypt_generic($td, $ciphertext);
            mcrypt_generic_deinit($td);
            mcrypt_module_close($td);
        }
        if ($plaintext == false) {
            return false;
        }

        // trim pkcs#7 padding
        $pad = ord(substr($plaintext, -1));
        $pad = ($pad < 1 || $pad > 32) ? 0 : $pad;
        $plaintext = substr($plaintext, 0, strlen($plaintext) - $pad);

        // trim header
        $plaintext = substr($plaintext, 16);
        // get content length
        $unpack = unpack("Nlen/", substr($plaintext, 0, 4));
        // get content
        $content = substr($plaintext, 4, $unpack['len']);
        // get app_key
        $app_key_decode = substr($plaintext, $unpack['len'] + 4);
        
        return $app_key == $app_key_decode ? $content : false;
    }

}

