<?php
/**
 * Created by IntelliJ IDEA.
 * User: luwei
 * Date: 2017/12/28
 * Time: 15:53
 */
$this->title = '基础信息';
?>
<div class="panel mb-3">
    <div class="panel-header">基础配置</div>
    <div class="panel-body">

        <form class="auto-form" method="post">
            <div class="form-group row">
                <div class="form-group-label col-sm-2 text-right">
                    <label class="col-form-label required">小程序AppId</label>
                </div>
                <div class="col-sm-6">
                    <input class="form-control" value="<?= $model->app_id ?>" name="app_id">
                </div>
            </div>
            <div class="form-group row">
                <div class="form-group-label col-sm-2 text-right">
                    <label class="col-form-label required">小程序AppKey</label>
                </div>
                <div class="col-sm-6">
                    <input class="form-control" value="<?= $model->app_key ?>" name="app_key">
                </div>
            </div>
            <div class="form-group row">
                <div class="form-group-label col-sm-2 text-right">
                    <label class="col-form-label required">小程序AppSecret</label>
                </div>
                <div class="col-sm-6">
                    <div class="input-hide">
                        <input class="form-control" value="<?= $model->app_secret ?>" name="app_secret">
                        <div class="tip-block">已隐藏内容，点击查看或编辑</div>
                    </div>
                    <div class="text-danger">注：若开发平台支付尚未配置，以下选项请设置0</div>
                </div>
            </div>
            <div class="form-group row">
                <div class="form-group-label col-sm-2 text-right">
                    <label class="col-form-label required">支付凭证dealID</label>
                </div>
                <div class="col-sm-6">
                    <input class="form-control" value="<?= $model->deal_id ?>" name="deal_id">
                </div>
            </div>
            <div class="form-group row">
                <div class="form-group-label col-sm-2 text-right">
                    <label class="col-form-label required">平台公钥</label>
                </div>
                <div class="col-sm-6">
                    <div class="input-hide">
                        <textarea rows="5" class="form-control secret-content" name="public_key"><?= $model->public_key ?></textarea>
                        <div class="tip-block">已隐藏内容，点击查看或编辑</div>
                    </div>
                </div>
            </div>
            <div class="form-group row">
                <div class="form-group-label col-sm-2 text-right">
                    <label class="col-form-label required">开发平台APP KEY</label>
                </div>
                <div class="col-sm-6">
                    <input class="form-control" value="<?= $model->public_app_key ?>" name="public_app_key">
                </div>
            </div>
            <div class="form-group row">
                <div class="form-group-label col-sm-2 text-right">
                    <label class="col-form-label">百度支付rsa_private_key.pem</label>
                </div>
                <div class="col-sm-6">
                    <div class="input-hide">
                        <textarea rows="5" class="form-control secret-content" name="rsa_private_key"><?= $model->rsa_private_key ?></textarea>
                        <div class="tip-block">已隐藏内容，点击查看或编辑</div>
                    </div>
                    <div class="fs-sm text-muted">使用文本编辑器打开rsa_private_key.pem文件，将文件的全部内容复制进来</div>
                </div>
            </div>
            <div class="form-group row">
                <div class="form-group-label col-sm-2 text-right">
                    <label class="col-form-label">百度支付rsa_public_key.pem</label>
                </div>
                <div class="col-sm-6">
                    <div class="input-hide">
                        <textarea rows="5" class="form-control secret-content" name="rsa_public_key"><?= $model->rsa_public_key ?></textarea>
                        <div class="tip-block">已隐藏内容，点击查看或编辑</div>
                    </div>
                    <div class="fs-sm text-muted">使用文本编辑器打开rsa_public_key.pem文件，将文件的全部内容复制进来</div>
                </div>
            </div>

            <div class="form-group row">
                <div class="form-group-label col-sm-2 text-right">
                </div>
                <div class="col-sm-6">
                    <a class="btn btn-primary auto-form-btn" href="javascript:">保存</a>
                </div>
            </div>
        </form>

    </div>
</div>
