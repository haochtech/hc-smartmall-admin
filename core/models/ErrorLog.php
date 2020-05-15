<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "{{%error_log}}".
 *
 * @property integer $id
 * @property integer $store_id
 * @property string $order_sn
 * @property integer $refund_type
 * @property string $reason
 * @property integer $addtime
 */
class ErrorLog extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return '{{%error_log}}';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['store_id', 'refund_type', 'addtime'], 'integer'],
            [['order_sn','reason'], 'string'],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'store_id' => 'Store ID',
            'refund_type' => '退款类型 1拼团订单 2预约订单 ',
            'order_sn' => '订单号',
            'reason' => '错误描述',
            'addtime' => 'Addtime',
        ];
    }
}
