<?php
/**
 * @link:http://www.zjhejiang.com/
 * @copyright: Copyright (c) 2018 浙江禾匠信息科技有限公司
 *
 * Created by PhpStorm.
 * User: 风哀伤
 * Date: 2018/7/16
 * Time: 13:51
 */

namespace app\modules\api\controllers\bargain;


use app\hejiang\ApiResponse;
use app\modules\api\models\bargain\GoodsForm;
use app\modules\api\models\bargain\IndexForm;

class DefaultController extends Controller
{
    public function actionIndex()
    {
        $form = new IndexForm();
        $form->store = $this->store;
        $form->attributes = \Yii::$app->request->get();
        $res = $form->search();
        return $res;
    }

    public function actionGoods()
    {
        $form = new GoodsForm();
        $form->attributes = \Yii::$app->request->get();
        $form->store = $this->store;
        $form->user = \Yii::$app->user->identity;
        return $form->search();
    }

    public function actionSetting()
    {
        $form = new IndexForm();
        $form->store = $this->store;
        return $form->getSetting();
    }

    public function actionGoodsUser()
    {
        $form = new GoodsForm();
        $form->attributes = \Yii::$app->request->get();
        $form->limit = 3;
        $form->store = $this->store;
        $form->user = \Yii::$app->user->identity;
        return new ApiResponse(0,'',[
            'bargain_info'=>$form->getUserInfo()
        ]);
    }
}