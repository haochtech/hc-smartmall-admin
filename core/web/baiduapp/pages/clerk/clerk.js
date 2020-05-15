var api = require("../../api.js"), app = getApp();

Page({
    data: {
        order: null,
        getGoodsTotalPrice: function() {
            return this.data.order.total_price;
        }
    },
    onLoad: function(e) {
        app.pageOnLoad(this, e);
        var o = this, t = "";
        if ("undefined" == typeof my) t = e.scene; else if (null !== app.query) {
            var r = app.query;
            app.query = null, t = r.order_no;
        }
        o.setData({
            store: swan.getStorageSync("store"),
            user_info: swan.getStorageSync("user_info")
        }), swan.showLoading({
            title: "正在加载"
        }), app.request({
            url: api.order.clerk_detail,
            data: {
                order_no: t
            },
            success: function(e) {
                0 == e.code ? o.setData({
                    order: e.data
                }) : swan.showModal({
                    title: "警告！",
                    showCancel: !1,
                    content: e.msg,
                    confirmText: "确认",
                    success: function(e) {
                        e.confirm && swan.redirectTo({
                            url: "/pages/index/index"
                        });
                    }
                });
            },
            complete: function() {
                swan.hideLoading();
            }
        });
    },
    clerk: function(e) {
        var o = this;
        swan.showModal({
            title: "提示",
            content: "是否确认核销？",
            success: function(e) {
                e.confirm ? (swan.showLoading({
                    title: "正在加载"
                }), app.request({
                    url: api.order.clerk,
                    data: {
                        order_no: o.data.order.order_no
                    },
                    success: function(e) {
                        0 == e.code ? swan.redirectTo({
                            url: "/pages/user/user"
                        }) : swan.showModal({
                            title: "警告！",
                            showCancel: !1,
                            content: e.msg,
                            confirmText: "确认",
                            success: function(e) {
                                e.confirm && swan.redirectTo({
                                    url: "/pages/index/index"
                                });
                            }
                        });
                    },
                    complete: function() {
                        swan.hideLoading();
                    }
                })) : e.cancel;
            }
        });
    }
});