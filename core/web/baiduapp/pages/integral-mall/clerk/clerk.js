var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
    return typeof e;
} : function(e) {
    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
}, api = require("../../../api.js"), app = getApp();

Page({
    data: {},
    onLoad: function(e) {
        getApp().pageOnLoad(this, e);
        var t = this;
        if (e.scene) ; else if (e.type) {
            t.setData({
                type: e.type,
                status: 1
            });
            var o = e.id;
        } else {
            o = e.id;
            t.setData({
                status: 1,
                type: ""
            });
        }
        if (void 0 === ("undefined" == typeof my ? "undefined" : _typeof(my))) {
            o = e.scene;
            t.setData({
                type: ""
            });
        } else if (t.setData({
            type: ""
        }), null !== app.query) {
            var n = app.query;
            app.query = null;
            o = n.order_no;
        }
        o && (t.setData({
            order_id: o
        }), swan.showLoading({
            title: "正在加载",
            mask: !0
        }), app.request({
            url: api.integral.clerk_order_details,
            data: {
                id: o,
                type: t.data.type
            },
            success: function(e) {
                0 == e.code ? t.setData({
                    order_info: e.data
                }) : swan.showModal({
                    title: "提示",
                    content: e.msg,
                    showCancel: !1,
                    success: function(e) {
                        e.confirm && swan.redirectTo({
                            url: "/pages/integral-mall/order/order?status=2"
                        });
                    }
                });
            },
            complete: function() {
                swan.hideLoading();
            }
        }));
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {
        var e = this, t = "/pages/pt/group/details?oid=" + e.data.order_info.order_id;
        return {
            title: e.data.order_info.goods_list[0].name,
            path: t,
            imageUrl: e.data.order_info.goods_list[0].goods_pic,
            success: function(e) {}
        };
    },
    clerkOrder: function(e) {
        var t = this;
        swan.showModal({
            title: "提示",
            content: "是否确认核销？",
            success: function(e) {
                e.confirm ? (swan.showLoading({
                    title: "正在加载"
                }), app.request({
                    url: api.integral.clerk,
                    data: {
                        order_id: t.data.order_id
                    },
                    success: function(e) {
                        0 == e.code ? swan.showModal({
                            showCancel: !1,
                            content: e.msg,
                            confirmText: "确认",
                            success: function(e) {
                                e.confirm && swan.redirectTo({
                                    url: "/pages/index/index"
                                });
                            }
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
    },
    copyText: function(e) {
        var t = e.currentTarget.dataset.text;
        swan.setClipboardData({
            data: t,
            success: function() {
                swan.showToast({
                    title: "已复制"
                });
            }
        });
    }
});