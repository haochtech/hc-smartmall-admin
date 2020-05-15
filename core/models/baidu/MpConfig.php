<?php
/**
 * @copyright ©2018 浙江禾匠信息科技
 * @author Lu Wei
 * @link http://www.zjhejiang.com/
 * Created by IntelliJ IDEA
 * Date Time: 2018/8/3 11:49
 */

namespace app\models\baidu;

use app\models\Option;
use app\modules\mch\models\MchModel;

class MpConfig extends MchModel
{
    public $store_id;

    public $app_id;
    public $app_key;
    public $app_secret;
    public $deal_id;
    public $public_key;
    public $public_app_key;
    public $rsa_private_key;
    public $rsa_public_key;

    const OPTION_KEY = 'baidu_mp_config';

    public function rules()
    {
        return [
            [['app_id','app_key', 'deal_id', 'app_secret','public_key','public_app_key'], 'trim'],
            [['app_key'], 'required'],
        ];
    }

    public function attributeLabels()
    {
        return [
            'app_id' => '小程序AppId',
            'app_key' => '小程序AppKey',
            'app_secret' => '小程序AppSecret',
            'deal_id' => 'dealID',
            'public_key' => '平台公钥',
            'public_app_key' => '开发平台APP key',
            'rsa_private_key' => '支付私钥',
            'rsa_public_key' => '支付公钥',
        ];
    }

    public function save()
    {
        if (!$this->validate()) {
            return $this->getErrorResponse();
        }
        $data = $this->attributes;
        $data['rsa_private_key'] = $this->rsa_private_key;
        $data['rsa_public_key'] = $this->rsa_public_key;
        unset($data['store_id']);
        Option::set(self::OPTION_KEY, $data, $this->store_id);
        return [
            'code' => 0,
            'msg' => '保存成功。',
        ];
    }

    /**
     * 根据 Store Id 获取其配置实例
     *
     * @param string|int $storeId
     * @return static
     */
    public static function get($storeId)
    {
        $instance = new static();
        $instance->store_id = $storeId;

        $data = Option::get(self::OPTION_KEY, $storeId);
        if ($data != null) {
            $instance->attributes = (array)$data;
        }

        return $data;
    }

}
