<?php
/**
 * link: http://www.zjhejiang.com/
 * copyright: Copyright (c) 2018 浙江禾匠信息科技有限公司
 * author: wxf
 */

$urlManager = Yii::$app->urlManager;
$this->title = '销售报表';
$this->params['active_nav_group'] = 0;

?>

<style>

</style>

<div class="panel mb-3">
    <div class="panel-header"><?= $this->title ?></div>
    <div class="panel-body ml-2">
        <div flex="dir:left">
            <div class="ml-3 mr-4">
                <div class="form-group row">
                    <div>
                        <label class="col-form-label">日期：</label>
                    </div>
                    <div>
                        <div class="input-group">
                            <input class="form-control" id="date_start" name="date_start"
                                   autocomplete="off"
                                   value="<?= isset($_GET['date_start']) ? trim($_GET['date_start']) : '' ?>">
                            <span class="input-group-btn">
                                <a class="btn btn-secondary" id="show_date_start" href="javascript:">
                                    <span class="iconfont icon-daterange"></span>
                                </a>
                            </span>
                            <span class="middle-center input-group-addon" style="padding:0 4px">至</span>
                            <input class="form-control" id="date_end" name="date_end"
                                   autocomplete="off"
                                   value="<?= isset($_GET['date_end']) ? trim($_GET['date_end']) : '' ?>">
                            <span class="input-group-btn">
                                <a class="btn btn-secondary" id="show_date_end" href="javascript:">
                                    <span class="iconfont icon-daterange"></span>
                                </a>
                            </span>
                        </div>
                    </div>
                    <div class="middle-center">
                        <a href="javascript:" class="new-day btn btn-primary ml-3" data-index="7">近7天</a>
                        <a href="javascript:" class="new-day btn btn-primary ml-2" data-index="30">近30天</a>
                    </div>
                </div>
            </div>
        </div>
        <div class="mb-3 clearfix">
                <div class="dropdown float-left">
                    <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton"
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <?= $_GET['status'] == 2 ? '按销售额' : '按销量' ?>
                    </button>
                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton"
                         style="max-height: 200px;overflow-y: auto">
                        <a class="dropdown-item"
                           href="<?= $urlManager->createUrl(array_merge(['mch/mch/index/report-forms'], $_GET, ['status' => 1])) ?>">按销量</a>
                        <a class="dropdown-item"
                           href="<?= $urlManager->createUrl(array_merge(['mch/mch/index/report-forms'], $_GET, ['status' => 2])) ?>">按销售额</a>
                    </div>
                </div>
                <div class="dropdown float-left ml-2">
                    <button class="btn btn-secondary dropdown-toggle" type="button"
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <?= isset($_GET['shop_name']) ? $_GET['shop_name'] : '全部店铺' ?>
                    </button>
                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton"
                         style="max-height: 200px;overflow-y: auto">
                        <a class="dropdown-item" href="<?= $urlManager->createUrl(['mch/mch/goods/goods']) ?>">全部店铺</a>
                        <?php foreach ($cat_list as $index => $value) : ?>
                            <a class="dropdown-item"
                               href="<?= $urlManager->createUrl(array_merge(['mch/mch/goods/goods'], $_GET, ['shop_name' => $value])) ?>"><?= $value ?></a>
                        <?php endforeach; ?>
                    </div>
                </div>
                <div class="float-left mb-3" style="margin-left: 10rem;">
                    <form method="get">
                        <?php $_s = ['keyword'] ?>
                        <?php foreach ($_GET as $_gi => $_gv) :
                            if (in_array($_gi, $_s)) {
                                continue;
                            } ?>
                            <input type="hidden" name="<?= $_gi ?>" value="<?= $_gv ?>">
                        <?php endforeach; ?>

                        <div class="input-group">
                                <input class="form-control" placeholder="商品名" name="keyword"
                                       value="<?= isset($_GET['keyword']) ? trim($_GET['keyword']) : null ?>">
                            <span class="input-group-btn">
                            <button class="btn btn-primary ml-3">搜索</button>
                            </span>
                            <a class="btn btn-secondary export-btn ml-3"
                               href="javascript:">批量导出</a>
                        </div>
                    </form>
                </div>
        </div>
        <table class="table table-hover table-bordered bg-white">
            <thead>
            <tr>
                <th class="text-center">排行</th>
                <th>店铺名</th>
                <th>商品名称</th>
                <th>销量</th>
                <th>销售额</th>
            </tr>
            </thead>
            <col style="width: 10%;">
            <col style="width: 10%;">
            <col style="width: 60%;">
            <col style="width: 10%;">
            <col style="width: 10%;">
            <tbody>
            <?php foreach ($list as $index => $value) : ?>
                <tr>
                    <td class="data <?= ($index + 1 + ($pagination->page * $pagination->limit)) <= 3 ? 'active' : '' ?>"><?= $index + 1 + ($pagination->page * $pagination->limit) ?></td>
                    <td>
                        <div flex="cross:center">
                            <div class="ellipsis"><?= $value['goods'] ?></div>
                        </div>
                    </td>
                    <td>
                        <div flex="dir:left box:first">
                            <div style="height: 2rem;">
                                <div class="goods-pic"
                                     style="background-image: url('<?= $value['cover_pic'] ?>');"></div>
                            </div>
                            <div flex="cross:center">
                                <div class="ellipsis"><?= $value['name'] ?></div>
                            </div>
                        </div>
                    </td>
                    <td class="nowrap"><?= $value['sales_volume'] ?></td>
                    <td class="nowrap"><?= $value['sales_price'] ?></td>
                </tr>
            <?php endforeach; ?>
            </tbody>
        </table>

    </div>
</div>