<?php

use yii\helpers\Url;

/**
 * @link http://www.zjhejiang.com/
 * @copyright Copyright (c) 2018 浙江禾匠信息科技有限公司
 * @author Lu Wei
 * Created by IntelliJ IDEA.
 * User: luwei
 * Date: 2017/12/28
 * Time: 15:53
 */
/** @var \app\models\alipay\MpConfig $model */
defined('YII_ENV') or exit('Access Denied');
$this->title = '小程序发布';
?>
<div class="panel mb-3">
    <div class="panel-header"><?= $this->title ?></div>
    <div class="panel-body">
        <ul>
            <li>下载前端包（点击这里：<a href="<?= Url::to(['baidu/download']) ?>">下载</a>），并解压。</li>
            <li>下载百度智能小程序开发者工具（点击这里：<a target="_blank" href="https://smartprogram.baidu.com/docs/develop/devtools/show_sur/">下载</a>）</li>
            <li>安装开发者工具后，用它打开解压后的前端包目录，点击右上角登录，使用百度APP扫码登录。</li>
            <li>点击发布按钮，确认版本后开始上传，点击上传日志按钮可以查看详细信息。</li>
            <li>稍等提示上传成功，打开<a href="https://smartprogram.baidu.com/mappconsole/main/login" target="_blank">百度智能小程序平台</a>。</li>
            <li>点击查看，进入到小程序详情页面。找到刚刚上传的版本，点击提交审核即可。</li>
        </ul>
    </div>
</div>

