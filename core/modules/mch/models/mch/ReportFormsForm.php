<?php
/**
 * link: http://www.zjhejiang.com/
 * copyright: Copyright (c) 2018 浙江禾匠信息科技有限公司
 * author: wxf
 */

namespace app\modules\mch\models\mch;

use app\models\common\admin\order\CommonOrderStatistics;
use app\models\Model;
use app\models\Order;
use app\modules\mch\models\MchModel;
use app\models\Mch;

class ReportFormsForm extends MchModel
{
    public function search()
    {
        $data = [
            'panel_4' => [
                'order_goods_data' => $this->getDaysOrderGoodsData(7),
                'order_goods_price_data' => $this->getDaysOrderGoodsPriceData(7),
            ],
            'panel_6' => $this->orderStatistics(),
        ];

        $data['panel_4']['date'] = [];
        foreach ($data['panel_4']['order_goods_data']['list'] as $item) {
            $data['panel_4']['date'][] = $item['date'];
        }

        return [
            'code' => 0,
            'data' => $data
        ];
    }



    public function orderStatistics()
    {
        $list = Mch::find()->where(['is_delete' => Model::IS_DELETE_FALSE, 'store_id' => $this->getCurrentStoreId()])
            ->with(['order' => function ($query) {
                $query->andWhere(['is_pay' => Order::IS_PAY_TRUE]);
            }])->all();

        $newData = [];
        foreach ($list as $item) {
            $arr = [];
            $arr['order_count'] = count($item->order);
            $arr['name'] = $item->name;
            $arr['logo'] = $item->logo;

            $money = 0;
            foreach ($item->order as $item2) {
                $money += $item2->pay_price;
            }
            $arr['money'] = $money;
            $newData[] = $arr;
        }

        return $newData;
    }

    /**
     * 获取n日内每日销量
     */
    public function getDaysOrderGoodsData($days = 7)
    {
        $list = [];
        $data = [];
        for ($i = 0; $i < $days; $i++) {
            $startTime = strtotime(date('Y-m-d 00:00:00') . ' -' . $i . ' days');
            $endTime = strtotime(date('Y-m-d 23:59:59') . ' -' . $i . ' days');
            $date = date('m-d', $startTime);
            $common = new CommonOrderStatistics();
            $val = $common->getOrderGoodsCount($startTime, $endTime, -1);

            $list[] = [
                'date' => $date,
                'val' => $val,
                'start_time' => date('Y-m-d H:i:s', $startTime),
                'end_time' => date('Y-m-d H:i:s', $endTime),
            ];
            $data[] = $val;
        }

        return [
            'list' => array_reverse($list),
            'data' => array_reverse($data),
        ];
    }


    /**
     * 获取n日内每日成交额（已付款）
     */
    public function getDaysOrderGoodsPriceData($days = 7)
    {
        $list = [];
        $data = [];
        for ($i = 0; $i < $days; $i++) {
            $startTime = strtotime(date('Y-m-d 00:00:00') . ' -' . $i . ' days');
            $endTime = strtotime(date('Y-m-d 23:59:59') . ' -' . $i . ' days');
            $date = date('m-d', $startTime);
            $common = new CommonOrderStatistics();
            $orderPriceCount = $common->getOrderPriceCount($startTime, $endTime, -1);
            $list[] = [
                'date' => $date,
                'val' => $orderPriceCount,
                'start_time' => date('Y-m-d H:i:s', $startTime),
                'end_time' => date('Y-m-d H:i:s', $endTime),
            ];
            $data[] = $orderPriceCount;
        }

        return [
            'list' => array_reverse($list),
            'data' => array_reverse($data),
        ];
    }
}