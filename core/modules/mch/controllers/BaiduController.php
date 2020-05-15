<?php
/**
 * @copyright ©2018 浙江禾匠信息科技
 * @author Lu Wei
 * @link http://www.zjhejiang.com/
 * Created by IntelliJ IDEA
 * Date Time: 2018/8/3 9:51
 */


namespace app\modules\mch\controllers;

use app\models\baidu\MpConfig;
use app\models\baidu\TplMsgForm;
use Comodojo\Zip\Zip;
use yii\web\Response;

class BaiduController extends Controller
{
    //小程序配置
    public function actionMpConfig()
    {
        $form = MpConfig::get($this->store->id);
        if (\Yii::$app->request->isPost) {
            $form = new MpConfig();
            $form->attributes = \Yii::$app->request->post();
            $form->rsa_private_key = \Yii::$app->request->post('rsa_private_key');
            $form->rsa_public_key = \Yii::$app->request->post('rsa_public_key');
            $form->store_id = $this->store->id;
            return $form->save();
        } else {
            return $this->render('mp-config', [
                'model' => $form,
            ]);
        }
    }

    /**
     * 模版消息
     */
    public function actionTemplateMsg()
    {

        $form = TplMsgForm::get($this->store->id);
        if (\Yii::$app->request->isPost) {
            $tpl = new TplMsgForm();
            $tpl->store_id = $this->store->id;
            $tpl->attributes = \Yii::$app->request->post();
            return $tpl->save();
        } else {
            $newData = [];
            foreach ($form as $k => $item) {
                if (in_array($k, ['pay_tpl', 'refund_tpl', 'send_tpl', 'revoke_tpl'])) {
                    $newData['store'][$k] = $item;
                }
                if (in_array($k, ['cash_fail_tpl', 'cash_success_tpl', 'apply_tpl'])) {
                    $newData['share'][$k] = $item;
                }
                if (in_array($k, ['pt_fail_notice', 'pt_success_notice'])) {
                    $newData['pintuan'][$k] = $item;
                }
                if (in_array($k, ['yy_refund_notice', 'yy_success_notice'])) {
                    $newData['book'][$k] = $item;
                }
                if (in_array($k, ['mch_tpl_1', 'mch_tpl_2'])) {
                    $newData['mch'][$k] = $item;
                }
                if (in_array($k, ['tpl_msg_id'])) {
                    $newData['fxhb'][$k] = $item;
                }
            }

            // 根据插件权限显示
            $plugin = $this->getUserAuth();
            // 有模板消息功能的插件
            $tplMsgPlugin = ['store', 'share', 'pintuan', 'book', 'mch', 'fxhb'];
            // 这里是为了防止数据库没有相应插件的数据，导致前端不显示
            foreach ($plugin as $item) {
                if (in_array($item, $tplMsgPlugin)) {
                    foreach ($newData as $k => $v) {
                        if ($k != $item) {
                            $newData[$item]['is_show'] = true;
                        }
                    }
                }
            }

            foreach ($newData as $k => $item) {
                if (in_array($k, $plugin) || $k == 'store') {
                    $newData[$k]['is_show'] = true;
                } else {
                    $newData[$k]['is_show'] = false;
                }
            }

            return $this->render('template-msg', [
                'model' => $newData,
            ]);
        }
    }

    /**
     * 发布小程序
     *
     * @return void
     */
    public function actionPublish()
    {
        return $this->render('publish');
    }

    /**
     * 下载前端包
     *
     * @return void
     */
    public function actionDownload()

    {

        $entryUri = str_replace('http://', 'https://', \Yii::$app->request->hostInfo . \Yii::$app->request->baseUrl . '/index.php?store_id=' . $this->store->id . '&r=api/'); // API 入口

        $alipayDir = \Yii::$app->basePath . '/web/baiduapp'; // 配置支付宝前端包目录

        $apiJsPath = $alipayDir . '/api.js'; // api.js 路径

        $apiJsTplPath = $alipayDir . '/api.tpl.js'; // api.tpl.js 路径

        $siteinfoPath = $alipayDir . '/siteinfo.js'; // siteinfo.js 路径

        $siteinfo = <<<EOF

var siteinfo = {
    name: "智能小程序",
    uniacid: "{$this->store->acid}",
    acid: "{$this->store->acid}",
    multiid: "0",
    version: "2.7.6",
    siteroot: "https://zx-app.cn/app/index.php",
    design_method: "3"
};

module.exports = siteinfo;

EOF;

        // siteinfo.js内容

        $lockFile = sys_get_temp_dir() . '/hejiang-alipay-publish-lock'; // 锁文件，保证独占

        $zipFile = sys_get_temp_dir() . '/hejiang-alipay-publish-archive'; // 打包文件



        $lock = fopen($lockFile, 'w+');

        flock($lock, LOCK_EX);

        // --- 打包逻辑开始 ---
        $apiJsTpl = file_get_contents($apiJsTplPath);
        $apiJs = str_replace('{$_api_root}', $entryUri, $apiJsTpl);
        file_put_contents($apiJsPath, $apiJs);

        file_put_contents($siteinfoPath, $siteinfo);

        if (is_file($zipFile)) {

            unlink($zipFile);

        }

        $zip = Zip::create($zipFile);

        $zip->add($alipayDir, true);

        $zip->close();



        // --- 打包逻辑结束 ---

        flock($lock, LOCK_UN);

        fclose($lock);

        return \Yii::$app->response->sendFile($zipFile, 'baidu-app.zip');

    }

}