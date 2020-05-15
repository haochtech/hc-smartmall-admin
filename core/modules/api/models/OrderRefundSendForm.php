<?php
/**
 * @copyright ©2018 浙江禾匠信息科技
 * @author Lu Wei
 * @link http://www.zjhejiang.com/
 * Created by IntelliJ IDEA
 * Date Time: 2018/6/23 17:36
 */


namespace app\modules\api\models;

use app\models\MsOrderRefund;
use app\models\OrderRefund;
use app\models\PtOrderRefund;

class OrderRefundSendForm extends ApiModel
{
    public $order_refund_id;
    public $user_id;
    public $express;
    public $express_no;
    public $orderType;

    public function rules()
    {
        return [
            [['express', 'express_no', 'orderType'], 'trim'],
            [['order_refund_id', 'express', 'express_no'], 'required'],
        ];
    }

    public function attributeLabels()
    {
        return [
            'express' => '快递公司',
            'express_no' => '快递单号',
        ];
    }

    public function save()
    {
        if (!$this->validate()) {
            return $this->getErrorResponse();
        }

        if ($this->orderType === 'miaosha') {
            $query = MsOrderRefund::find();
        } else if ($this->orderType === 'pintuan') {
            $query = PtOrderRefund::find();
        } else {
            $query = OrderRefund::find();
        }

        $order_refund = $query->where([
            'id' => $this->order_refund_id,
            'user_id' => $this->user_id,
        ])->one();

        if (!$order_refund) {
            return [
                'code' => 1,
                'msg' => '售后订单不存在。',
            ];
        }
        $order_refund->is_user_send = 1;
        $order_refund->user_send_express = $this->express;
        $order_refund->user_send_express_no = $this->express_no;
        if ($order_refund->save()) {
            return [
                'code' => 0,
                'msg' => '发货成功。',
            ];
        } else {
            return $this->getErrorResponse($order_refund);
        }
    }
}