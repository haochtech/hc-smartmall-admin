var api = require("../../api.js"), app = getApp();

Page({
    data: {
        total_price: 0,
        price: 0,
        cash_price: 0,
        total_cash: 0,
        team_count: 0,
        order_money: 0
    },
    onLoad: function(t) {
        app.pageOnLoad(this, t);
        this.setData({
            custom: swan.getStorageSync("custom")
        });
    },
    onReady: function() {},
    onShow: function() {
        app.pageOnShow(this);
        var t = this, e = swan.getStorageSync("share_setting"), a = t.data.__user_info;
        t.setData({
            share_setting: e
        }), a && 1 == a.is_distributor ? t.checkUser() : t.loadData();
    },
    checkUser: function() {
        var e = this;
        swan.showLoading({
            title: "正在加载",
            mask: !0
        }), app.request({
            url: api.share.get_info,
            success: function(t) {
                0 == t.code && (e.setData({
                    total_price: t.data.price.total_price,
                    price: t.data.price.price,
                    cash_price: t.data.price.cash_price,
                    total_cash: t.data.price.total_cash,
                    team_count: t.data.team_count,
                    order_money: t.data.order_money,
                    custom: t.data.custom,
                    order_money_un: t.data.order_money_un
                }), swan.setStorageSync("custom", t.data.custom), e.loadData()), 1 == t.code && (__user_info.is_distributor = t.data.is_distributor, 
                e.setData({
                    __user_info: __user_info
                }), swan.setStorageSync("user_info", __user_info));
            },
            complete: function() {
                swan.hideLoading();
            }
        });
    },
    loadData: function() {
        var a = this;
        swan.showLoading({
            title: "正在加载",
            mask: !0
        }), app.request({
            url: api.share.index,
            success: function(t) {
                if (0 == t.code) {
                    if (t.data.share_setting) var e = t.data.share_setting; else e = t.data;
                    swan.setStorageSync("share_setting", e), a.setData({
                        share_setting: e
                    });
                }
            },
            complete: function() {
                swan.hideLoading();
            }
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    apply: function(e) {
        var a = swan.getStorageSync("share_setting"), o = swan.getStorageSync("user_info");
        1 == a.share_condition ? swan.navigateTo({
            url: "/pages/add-share/index"
        }) : 0 != a.share_condition && 2 != a.share_condition || (0 == o.is_distributor ? swan.showModal({
            title: "申请成为分销商",
            content: "是否申请？",
            success: function(t) {
                t.confirm && (swan.showLoading({
                    title: "正在加载",
                    mask: !0
                }), app.request({
                    url: api.share.join,
                    method: "POST",
                    data: {
                        form_id: e.detail.formId
                    },
                    success: function(t) {
                        0 == t.code && (0 == a.share_condition ? (o.is_distributor = 2, swan.navigateTo({
                            url: "/pages/add-share/index"
                        })) : (o.is_distributor = 1, swan.redirectTo({
                            url: "/pages/share/index"
                        })), swan.setStorageSync("user_info", o));
                    },
                    complete: function() {
                        swan.hideLoading();
                    }
                }));
            }
        }) : swan.navigateTo({
            url: "/pages/add-share/index"
        }));
    }
});