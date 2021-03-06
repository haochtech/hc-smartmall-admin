var api = require("../../../api.js"), app = getApp();

Page({
    data: {},
    onLoad: function(e) {
        app.pageOnLoad(this, e);
    },
    onReady: function() {},
    onShow: function() {
        app.pageOnShow(this);
        this.loadOrderDetails();
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {
        var e = this, o = "/pages/pt/group/details?oid=" + e.data.order_info.order_id;
        return {
            title: e.data.order_info.goods_list[0].name,
            path: o,
            imageUrl: e.data.order_info.goods_list[0].goods_pic,
            success: function(e) {}
        };
    },
    loadOrderDetails: function() {
        var o = this, e = "";
        if ("undefined" == typeof my) e = o.options.scene; else if (null !== app.query) {
            var t = app.query;
            app.query = null, e = t.order_id;
        }
        swan.showLoading({
            title: "正在加载",
            mask: !0
        }), app.request({
            url: api.group.order.clerk_order_details,
            data: {
                id: e
            },
            success: function(e) {
                0 == e.code ? (3 != e.data.status && o.countDownRun(e.data.limit_time_ms), o.setData({
                    order_info: e.data,
                    limit_time: e.data.limit_time
                })) : swan.showModal({
                    title: "提示",
                    content: e.msg,
                    showCancel: !1,
                    success: function(e) {
                        e.confirm && swan.redirectTo({
                            url: "/pages/pt/order/order"
                        });
                    }
                });
            },
            complete: function() {
                swan.hideLoading();
            }
        });
    },
    copyText: function(e) {
        var o = e.currentTarget.dataset.text;
        swan.setClipboardData({
            data: o,
            success: function() {
                swan.showToast({
                    title: "已复制"
                });
            }
        });
    },
    clerkOrder: function(e) {
        var o = this;
        swan.showModal({
            title: "提示",
            content: "是否确认核销？",
            success: function(e) {
                e.confirm ? (swan.showLoading({
                    title: "正在加载"
                }), app.request({
                    url: api.group.order.clerk,
                    data: {
                        order_id: o.data.order_info.order_id
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
    },
    location: function() {
        var e = this.data.order_info.shop;
        swan.openLocation({
            latitude: parseFloat(e.latitude),
            longitude: parseFloat(e.longitude),
            address: e.address,
            name: e.name
        });
    }
});