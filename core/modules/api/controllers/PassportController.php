<?php
/**
 * Created by IntelliJ IDEA.
 * User: luwei
 * Date: 2017/6/24
 * Time: 22:31
 */

namespace app\modules\api\controllers;

use app\models\User;
use app\modules\api\models\LoginForm;
use app\modules\api\models\BaiduLoginForm;
use app\modules\api\models\BdLoginForm;

class PassportController extends Controller
{
    public function actionLogin()
    {
        $form = new LoginForm();
        $form->attributes = \Yii::$app->request->post();
        $form->wechat_app = $this->wechat_app;
        $form->store_id = $this->store->id;
        if(\Yii::$app->fromAlipayApp()) {
            return $form->loginAlipay();
        } else {
            return $form->login();
        }
    }

    public function actionGetSessionkey()
    {
        $form = new BaiduLoginForm();
        $form->code = \Yii::$app->request->get('code');
        $form->wechat_app = $this->wechat_app;
        $form->store_id = $this->store->id;
        return $form->getsessionkey();
    }

    public function actionBaiduLogin()
    {
        $form = new BdLoginForm();
        $form->ciphertext = \Yii::$app->request->get('ciphertext');
        $form->iv = \Yii::$app->request->get('iv');
        $form->session_key = \Yii::$app->request->get('session_key');
        $form->user_info = \Yii::$app->request->get('user_info');
        $form->openid = \Yii::$app->request->get('openid');
        $form->wechat_app = $this->wechat_app;
        $form->store_id = $this->store->id;
        return $form->baidulogin();
    }

    public function actionNewBaiduLogin()
    {
        $form = new BdLoginForm();
        $form->ciphertext = \Yii::$app->request->post('ciphertext');
        $form->iv = \Yii::$app->request->post('iv');
        $form->session_key = \Yii::$app->request->post('session_key');
        $form->user_info = \Yii::$app->request->post('user_info');
        $form->wechat_app = $this->wechat_app;
        $form->store_id = $this->store->id;
        return $form->baidulogin();
    }
}
