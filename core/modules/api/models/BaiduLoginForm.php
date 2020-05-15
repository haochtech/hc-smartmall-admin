<?php
/**
 * Created by IntelliJ IDEA.
 * User: luwei
 * Date: 2017/7/1
 * Time: 16:52
 */

namespace app\modules\api\models;

use app\models\Option;
use app\models\baidu\MpConfig;
use app\models\User;
use app\modules\mch\models\Model;
use Curl\Curl;
use app\hejiang\ApiResponse;

class BaiduLoginForm extends Model
{
    public $wechat_app;
    public $code;

    public $store_id;

    public function rules()
    {
        return [
            [['wechat_app', 'code',], 'required'],
        ];
    }

    //***************************
    //  获取sessionkey 接口
    //***************************
    public function getsessionkey(){
        $setting = Option::get('baidu_mp_config', $this->store_id);  

        if (!$this->validate())
            return $this->errorResponse;

        if (!$setting->app_key || !$setting->app_secret) {
            return new ApiResponse(1, '秘钥配置出错.');
        }

        $get_token_url = 'https://openapi.baidu.com/nalogin/getSessionKeyByCode?code='.$this->code.'&client_id='.$setting->app_key.'&sk='.$setting->app_secret;
        $curl = new Curl();
        $curl->setOpt(CURLOPT_SSL_VERIFYPEER, false);
        $curl->get($get_token_url);
        $res = $curl->response;
        $res = json_decode($res, true);
        if ($res['openid'] && $res['session_key']) {
            return new ApiResponse(0, 'success.',$res); 
        } else {
            return new ApiResponse(1, json_encode($res));
        }
    }

    public function login()
    {
        $setting = Option::get('baidu_mp_config', $this->store_id);

        if (!$this->validate())
            return $this->getModelError(); 

        $plaintext = decrypt($this->encrypted_data, $this->iv, $setting->app_key, $this->session_key);
    return new ApiResponse(1, json_encode($plaintext));
        $user = User::findOne(['wechat_open_id' => $plaintext['openid'], 'store_id' => $this->store_id]);
        if (!$user) {
            //授权获取用户信息
            $access_token = $res->alipay_system_oauth_token_response->access_token;
            $userinfos = $this->getUserInfo($access_token,$ac);
            $user_id = $userinfos->alipay_user_info_share_response->user_id;
            if (!$userinfos || !$user_id) {
                return new ApiResponse(1, '获取用户信息失败!'.$userinfos->alipay_user_info_share_response->user_id,$userinfos); 
            }

            $user = new User();
            $user->type = 1;
            $user->username = $user_id;
            $user->password = \Yii::$app->security->generatePasswordHash(\Yii::$app->security->generateRandomString());
            $user->auth_key = \Yii::$app->security->generateRandomString();
            $user->access_token = \Yii::$app->security->generateRandomString();
            $user->addtime = time();
            $user->is_delete = 0;
            $user->wechat_open_id = $user_id;
            $user->wechat_union_id = isset($data['unionId']) ? $data['unionId'] : '';
            $user->login_type = 2;
            $user->nickname = preg_replace('/[\xf0-\xf7].{3}/', '', $userinfos->alipay_user_info_share_response->nick_name);
            $user->avatar_url = $userinfos->alipay_user_info_share_response->avatar;
            $user->store_id = $this->store_id;
            $user->save();
            $same_user = User::find()->select('id')->where([
                'AND',
                [
                    'store_id' => $this->store_id,
                    'wechat_open_id' => $user_id,
                    'is_delete' => 0,
                ],
                ['<', 'id', $user->id],
            ])->one();

            if ($same_user) {
                $user->delete();
                $user = null;
                $user = $same_user;
            }
        }

        $share = Share::findOne(['user_id' => $user->parent_id]);
        $share_user = User::findOne(['id' => $share->user_id]);
        return [
            'code' => 0,
            'msg' => 'success',
            'data' => (object)[
                'access_token' => $user->access_token,
                'nickname' => $user->nickname,
                'avatar_url' => $user->avatar_url,
                'is_distributor' => $user->is_distributor ? $user->is_distributor : 0,
                'parent' => $share->id ? ($share->name ? $share->name : $share_user->nickname) : '总店',
                'id' => $user->id,
                'is_clerk' => $user->is_clerk,
                'integral' => $user->integral,
            ],
        ];
    }

}