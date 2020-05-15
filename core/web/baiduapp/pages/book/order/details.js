var api = require("../../../api.js"), utils = require("../../../utils.js"), app = getApp();

Page({
    data: {
        hide: 1,
        qrcode: ""
    },
    onLoad: function(o) {
        app.pageOnLoad(this, o), this.getOrderDetails(o);
    },
    onReady: function() {},
    onShow: function() {
        app.pageOnShow(this);
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {},
    getOrderDetails: function(o) {
        var e = o.oid, t = this;
        swan.showLoading({
            title: "正在加载",
            mask: !0
        }), app.request({
            url: api.book.order_details,
            method: "post",
            data: {
                id: e
            },
            success: function(o) {
                0 == o.code ? t.setData({
                    attr: JSON.parse(o.data.attr),
                    goods: o.data
                }) : swan.showModal({
                    title: "提示",
                    content: o.msg,
                    showCancel: !1,
                    success: function(o) {
                        o.confirm && swan.redirectTo({
                            url: "/pages/book/order/order?status=1"
                        });
                    }
                });
            },
            complete: function(o) {
                setTimeout(function() {
                    swan.hideLoading();
                }, 1e3);
            }
        });
    },
    goToGoodsDetails: function(o) {
        swan.redirectTo({
            url: "/pages/book/details/details?id=" + this.data.goods.goods_id
        });
    },
    orderCancel: function(o) {
        swan.showLoading({
            title: "正在加载",
            mask: !0
        });
        var e = o.currentTarget.dataset.id;
        app.request({
            url: api.book.order_cancel,
            method: "post",
            data: {
                id: e
            },
            success: function(o) {
                0 == o.code && swan.redirectTo({
                    url: "/pages/book/order/order?status=0"
                });
            },
            complete: function() {
                swan.hideLoading();
            }
        });
    },
    GoToPay: function(o) {
        swan.showLoading({
            title: "正在提交",
            mask: !0
        }), app.request({
            url: api.book.order_pay,
            method: "post",
            data: {
                id: o.currentTarget.dataset.id
            },
            complete: function() {
                swan.hideLoading();
            },
            success: function(o) {
                0 == o.code && swan.requestPayment({
                    _res: o,
                    timeStamp: o.data.timeStamp,
                    nonceStr: o.data.nonceStr,
                    package: o.data.package,
                    signType: o.data.signType,
                    paySign: o.data.paySign,
                    success: function(o) {},
                    fail: function(o) {},
                    complete: function(o) {
                        "requestPayment:fail" != o.errMsg && "requestPayment:fail cancel" != o.errMsg ? swan.redirectTo({
                            url: "/pages/book/order/order?status=1"
                        }) : swan.showModal({
                            title: "提示",
                            content: "订单尚未支付",
                            showCancel: !1,
                            confirmText: "确认",
                            success: function(o) {
                                o.confirm && swan.redirectTo({
                                    url: "/pages/book/order/order?status=0"
                                });
                            }
                        });
                    }
                }), 1 == o.code && swan.showToast({
                    title: o.msg,
                    image: "/images/icon-warning.png"
                });
            }
        });
    },
    goToShopList: function(o) {
        swan.redirectTo({
            url: "/pages/book/shop/shop?ids=" + this.data.goods.shop_id
        });
    },
    orderQrcode: function(o) {
        var e = this;
        o.target.dataset.index;
        swan.showModal({
            title: '核销提示',
            content: '请到对应门店出示订单号，交予店员核销！'
        });
        return false;
        swan.showLoading({
            title: "正在加载",
            mask: !0
        }), e.data.goods.offline_qrcode ? (e.setData({
            hide: 0,
            qrcode: e.data.goods.offline_qrcode
        }), swan.hideLoading()) : app.request({
            url: api.book.get_qrcode,
            data: {
                order_no: e.data.goods.order_no
            },
            success: function(o) {
                0 == o.code ? e.setData({
                    hide: 0,
                    qrcode: o.data.url
                }) : swan.showModal({
                    title: "提示",
                    content: o.msg
                });
            },
            complete: function() {
                swan.hideLoading();
            }
        });
    },
    hide: function(o) {
        this.setData({
            hide: 1
        });
    },
    comment: function(o) {
        swan.navigateTo({
            url: "/pages/book/order-comment/order-comment?id=" + o.target.dataset.id,
        });
    }
});