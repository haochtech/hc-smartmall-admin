<?php
/**
 * Created by IntelliJ IDEA.
 * User: luwei
 * Date: 2017/8/10
 * Time: 9:06
 */

namespace app\modules\mch\models;

use app\models\Goods;
use app\models\MiaoshaGoods;
use app\models\Model;
use app\models\MsGoods;
use app\models\MsOrder;
use app\models\MsOrderRefund;
use app\models\MsWechatTplMsgSender;
use app\models\Order;
use app\models\OrderDetail;
use app\models\OrderRefund;
use app\models\PtGoods;
use app\models\PtNoticeSender;
use app\models\PtOrder;
use app\models\PtOrderDetail;
use app\models\PtOrderRefund;
use app\models\User;
use app\models\UserAccountLog;
use app\models\WechatTplMsgSender;
use app\models\Register;
use app\utils\Refund;

/**
 * 售后订单结果处理
 */
class OrderRefundForm extends MchModel
{
    public $store_id;
    public $order_refund_id;
    public $type;
    public $action;
    public $address_id;
    public $refund_price;
    public $refund;//是否退款
    public $orderType; //退款订单类型

    const MS = 'miaosha';
    const PT = 'pintuan';

    public function rules()
    {
        return [
            [['store_id', 'order_refund_id', 'type', 'action'], 'required'],
            [['refund', 'orderType'], 'safe'],
            [['refund_price',], 'number', 'min' => 0.01,],
            [['address_id'], 'integer'],
        ];
    }

    public function attributeLabels()
    {
        return [
            'refund_price' => '退款金额',
            'orderType' => '订单类型'
        ];
    }

    public function save()
    {
        if (!$this->validate()) {
            return $this->errorResponse;
        }

        //区分插件订单
        if ($this->orderType === 'miaosha') {
            $query = MsOrderRefund::find();
        } else if ($this->orderType === 'pintuan') {
            $query = PtOrderRefund::find();
        } else {
            $query = OrderRefund::find();
        }

        $order_refund = $query->where([
            'id' => $this->order_refund_id,
            'store_id' => $this->store_id,
            'is_delete' => Model::IS_DELETE_FALSE,
        ])->one();

        if (!$order_refund) {
            return [
                'code' => 1,
                'msg' => '售后订单不存在，请刷新页面'
            ];
        }
        if ($order_refund->status != 0) {
            return [
                'code' => 1,
                'msg' => '售后订单已经处理过了，请刷新页面',
                'id' => $order_refund->id,
            ];
        }

        if ($this->type == 1) {
            return $this->submit1($order_refund);
        }
        if ($this->type == 2) {
            return $this->submit2($order_refund);
        }
    }

    /**
     * 统一处理退货退款
     * 商城|秒杀|拼团
     * @param $order_refund
     * @return \app\hejiang\ValidationErrorResponse|array
     */
    private function submit1($order_refund)
    {
        //区分插件订单
        if ($this->orderType === self::MS) {
            $order = MsOrder::findOne($order_refund->order_id);
        } else if ($this->orderType === self::PT) {
            $order = PtOrder::findOne($order_refund->order_id);
        } else {
            $order = Order::findOne($order_refund->order_id);
        }

        if ($this->action == 1) {//同意
            if ($this->refund != 1) {
                //仅同意，还未退款
                if ($this->refund_price) {
                    if ($this->refund_price > $order_refund->refund_price) {
                        return [
                            'code' => 1,
                            'msg' => '退款金额不能大于' . $order_refund->refund_price,
                        ];
                    }
                    $order_refund->refund_price = $this->refund_price;
                }
                if (!$this->address_id) {
                    return [
                        'code' => 1,
                        'msg' => '退货地址不能为空',
                    ];
                };
                $order_refund->address_id = $this->address_id;
                $order_refund->is_agree = 1;
                $order_refund->save();
                return [
                    'code' => 0,
                    'msg' => '已同意退货。',
                ];
            } else {
                //已同意，退款操作
                $order_refund->status = 1;
                $order_refund->response_time = time();
                if ($order_refund->refund_price > 0 && $order->pay_type == 1) {
                    $res = Refund::refund($order, $order_refund->order_refund_no, $order_refund->refund_price);
                    if ($res !== true) {
                        return $res;
                    }
                }

                // ==================库存恢复==================

                if ($this->orderType === self::MS) {

                    //秒杀商品总库存恢复
                    $goods = MsGoods::findOne($order->goods_id);
                    $attr_id_list = [];
                    foreach (json_decode($order->attr) as $item) {
                        array_push($attr_id_list, $item->attr_id);
                    }
                    $goods->numAdd($attr_id_list, $order->num);
                    //秒杀订单所属秒杀时间段库存恢复
                    $miaosha_goods = MiaoshaGoods::findOne([
                        'goods_id' => $order->goods_id,
                        'start_time' => intval(date('H', $order->addtime)),
                        'open_date' => date('Y-m-d', $order->addtime),
                    ]);
                    $attr_id_list = [];
                    foreach (json_decode($order->attr) as $item) {
                        array_push($attr_id_list, $item->attr_id);
                    }
                    $miaosha_goods->numAdd($attr_id_list, $order->num);

                } else if ($this->orderType === self::PT) {

                    // 拼团订单恢复库存
                    $order_detail = PtOrderDetail::findOne(['order_id' => $order->id, 'is_delete' => 0]);
                    $goods = PtGoods::findOne(['id' => $order_detail->goods_id]);
                    $attr_id_list = [];
                    foreach (json_decode($order_detail->attr) as $item) {
                        array_push($attr_id_list, $item->attr_id);
                    }
                    $goods->numAdd($attr_id_list, $order_detail->num);

                } else {

                    // 商城商品总库存恢复
                    $order_detail_list = OrderDetail::find()->where(['order_id' => $order->id, 'is_delete' => 0])->all();

                    foreach ($order_detail_list as $order_detail) {
                        $goods = Goods::findOne($order_detail->goods_id);
                        $attr_id_list = [];
                        foreach (json_decode($order_detail->attr) as $item) {
                            array_push($attr_id_list, $item->attr_id);
                        }
                        $goods->numAdd($attr_id_list, $order_detail->num);
                    }
                }


                // ==================用户积分恢复==================

                $user = User::findOne(['id' => $order->user_id]);
                $integral = isset($order->integral) ? json_decode($order->integral)->forehead_integral : 0;
                if ($integral > 0) {
                    $user->integral += $integral;
                    $register = new Register();
                    $register->store_id = $this->store_id;
                    $register->user_id = $user->id;
                    $register->register_time = '..';
                    $register->addtime = time();
                    $register->continuation = 0;
                    $register->integral = $integral;
                    $register->order_id = $order->id;

                    // 区分订单类型
                    if ($this->orderType === self::MS) {
                        $register->type = 13;
                        $register->save();

                    } else if ($this->orderType === self::PT) {

                    } else {
                        $register->type = 9;
                        $register->save();

                    }
                }

                // ==================退款操作==================

                if ($order_refund->refund_price > 0 && $order->pay_type == 3) {
                    $user->money += floatval($order_refund->refund_price);
                    $log = new UserAccountLog();
                    $log->user_id = $user->id;
                    $log->price = $order_refund->refund_price;
                    $log->type = 1;
                    $log->order_id = $order->id;
                    $log->addtime = time();

                    if ($this->orderType === self::MS) {
                        // 秒杀退款
                        $log->desc = "秒杀售后订单退款：退款订单号（{$order_refund->order_refund_no}）";
                        $log->order_type = 5;

                    } else if ($this->orderType === self::PT) {
                        // 拼团退款
                        $log->desc = "拼团售后订单退款：退款订单号（{$order_refund->order_refund_no}）}";
                        $log->order_type = 6;

                    } else {
                        // 商城退款
                        $log->desc = " 商城售后订单退款：退款订单号（{$order_refund->order_refund_no}）";
                        $log->order_type = 4;

                    }

                    $log->save();
                    if (!$user->save()) {
                        return $this->getErrorResponse($user);
                    }
                }

                // 退款成功发送模版消息
                if ($order_refund->save()) {
                    if ($this->orderType === self::MS) {
                        $msg_sender = new MsWechatTplMsgSender($this->store_id, $order->id, $this->getWechat());
                        $msg_sender->refundMsg($order_refund->refund_price, $order_refund->desc, '退款已完成');

                    } else if ($this->orderType === self::PT) {
                        $notice = new PtNoticeSender($this->getWechat(), $this->store_id);
                        $notice->refundMsg($order->id, $order_refund->refund_price, $order_refund->desc, '退款已完成');

                    } else {
                        $msg_sender = new WechatTplMsgSender($this->store_id, $order->id, $this->getWechat());
                        $msg_sender->refundMsg($order_refund->refund_price, $order_refund->desc, '退款已完成');

                    }

                    return [
                        'code' => 0,
                        'msg' => '处理成功，已完成退款退货。',
                    ];
                }

                return $this->getErrorResponse($order_refund);
            }
        }
        if ($this->action == 2) {//拒绝
            $order_refund->status = 3;
            $order_refund->response_time = time();
            if ($order_refund->save()) {

                if ($this->orderType === self::MS) {
                    $msg_sender = new MsWechatTplMsgSender($this->store_id, $order_refund->order_id, $this->getWechat());
                    $msg_sender->refundMsg('0.00', $order_refund->desc, '卖家拒绝了您的退货请求');

                } else if ($this->orderType === self::PT) {
                    $msg_sender = new PtNoticeSender($this->getWechat(), $this->store_id);
                    $msg_sender->refundMsg($order->id, '0.00', $order_refund->desc, '卖家拒绝了您的退货请求');

                } else {
                    $msg_sender = new WechatTplMsgSender($this->store_id, $order_refund->order_id, $this->getWechat());
                    $msg_sender->refundMsg('0.00', $order_refund->desc, '卖家拒绝了您的退货请求');

                }

                return [
                    'code' => 0,
                    'msg' => '处理成功，已拒绝该退货退款订单。',
                ];
            }
            return $this->getErrorResponse($order_refund);
        }
    }

    /**
     * 统一处理换货
     * 商城|秒杀|拼团
     * @param $order_refund
     * @return \app\hejiang\ValidationErrorResponse|array
     */
    private function submit2($order_refund)
    {
        if ($this->action == 1) {//同意
            $order_refund->status = 2;
            if (!$this->address_id) {
                return [
                    'code' => 1,
                    'msg' => '退货地址不能为空',
                ];
            };
            $order_refund->address_id = $this->address_id;
            $order_refund->response_time = time();
            if ($order_refund->save()) {
                if ($this->orderType === self::MS) {
                    $msg_sender = new MsWechatTplMsgSender($this->store_id, $order_refund->order_id, $this->getWechat());
                    $msg_sender->refundMsg('0.00', $order_refund->desc, '卖家已同意换货，换货无退款金额');

                } else if ($this->orderType === self::PT) {
                    $msg_sender = new PtNoticeSender($this->getWechat(), $this->store_id);
                    $msg_sender->refundMsg($order_refund->order_id, '0.00', $order_refund->desc, '卖家已同意换货，换货无退款金额');

                } else {
                    $msg_sender = new WechatTplMsgSender($this->store_id, $order_refund->order_id, $this->getWechat());
                    $msg_sender->refundMsg('0.00', $order_refund->desc, '卖家已同意换货，换货无退款金额');

                }

                return [
                    'code' => 0,
                    'msg' => '处理成功，已同意换货。',
                ];
            }
            return $this->getErrorResponse($order_refund);
        }
        if ($this->action == 2) {//拒绝
            $order_refund->status = 3;
            $order_refund->response_time = time();
            if ($order_refund->save()) {
                if ($this->orderType === self::MS) {
                    $msg_sender = new MsWechatTplMsgSender($this->store_id, $order_refund->order_id, $this->getWechat());
                    $msg_sender->refundMsg('0.00', $order_refund->desc, '卖家已拒绝您的换货请求');

                } else if ($this->orderType === self::PT) {
                    $msg_sender = new PtNoticeSender($this->getWechat(), $this->store_id);
                    $msg_sender->refundMsg($order_refund->order_id, '0.00', $order_refund->desc, '卖家已拒绝您的换货请求');

                } else {
                    $msg_sender = new WechatTplMsgSender($this->store_id, $order_refund->order_id, $this->getWechat());
                    $msg_sender->refundMsg('0.00', $order_refund->desc, '卖家已拒绝您的换货请求');

                }

                return [
                    'code' => 0,
                    'msg' => '处理成功，已拒绝换货请求。',
                ];
            }
            return $this->getErrorResponse($order_refund);
        }
    }
}
