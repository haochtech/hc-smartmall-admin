var api = require("../../../api.js"), app = getApp(), is_no_more = !1, is_loading = !1, p = 2;

Page({
    data: {
        hide: 1,
        qrcode: ""
    },
    go_list: function (t) {
        var status = t.currentTarget.dataset.status;
        swan.redirectTo({
            url: '/pages/book/order/order?status='+status,
        });
    },
    onLoad: function(t) {
        app.pageOnLoad(this, t);
        is_loading = is_no_more = !1, p = 2, this.loadOrderList(t.status || -1);
    },
    onReady: function() {},
    onShow: function() {
        app.pageOnShow(this);
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {
        var a = this;
        is_loading || is_no_more || (is_loading = !0, app.request({
            url: api.book.order_list,
            method: "post",
            data: {
                status: a.data.status,
                page: p
            },
            success: function(t) {
                if (0 == t.code) {
                    var e = a.data.order_list.concat(t.data.list);
                    a.setData({
                        order_list: e,
                        pay_type_list: t.data.pay_type_list
                    }), 0 == t.data.list.length && (is_no_more = !0);
                }
                p++;
            },
            complete: function() {
                is_loading = !1;
            }
        }));
    },
    onShareAppMessage: function() {},
    loadOrderList: function(t) {
        null == t && (t = -1);
        var e = this;
        e.setData({
            status: t
        }), swan.showLoading({
            title: "正在加载",
            mask: !0
        }), app.request({
            url: api.book.order_list,
            method: "post",
            data: {
                status: e.data.status
            },
            success: function(t) {
                0 == t.code && e.setData({
                    order_list: t.data.list,
                    pay_type_list: t.data.pay_type_list
                }), e.setData({
                    show_no_data_tip: 0 == e.data.order_list.length
                });
            },
            complete: function() {
                swan.hideLoading();
            }
        });
    },
    orderCancel: function(t) {
        swan.showLoading({
            title: "正在加载",
            mask: !0
        });
        var e = t.currentTarget.dataset.id;
        app.request({
            url: api.book.order_cancel,
            method: "post",
            data: {
                id: e
            },
            success: function(t) {
                0 == t.code && swan.redirectTo({
                    url: "/pages/book/order/order?status=0"
                });
            },
            complete: function() {
                swan.hideLoading();
            }
        });
    },

    goToDetails: function(t) {
        swan.navigateTo({
            url: "/pages/book/order/details?oid=" + t.currentTarget.dataset.id
        });
    },
    orderQrcode: function(t) {
        var e = this, a = t.target.dataset.index;
        swan.showModal({
            title: '核销提示',
            content: '请到对应门店出示订单号，交予店员核销！'
        });
        return false;
        swan.showLoading({
            title: "正在加载",
            mask: !0
        }), e.data.order_list[a].offline_qrcode ? (e.setData({
            hide: 0,
            qrcode: e.data.order_list[a].offline_qrcode
        }), swan.hideLoading()) : app.request({
            url: api.book.get_qrcode,
            method: "post",
            data: {
                order_no: e.data.order_list[a].order_no
            },
            success: function(t) {
                0 == t.code ? e.setData({
                    hide: 0,
                    qrcode: t.data.url
                }) : swan.showModal({
                    title: "提示",
                    content: t.msg
                });
            },
            complete: function() {
                swan.hideLoading();
            }
        });
    },
    hide: function(t) {
        this.setData({
            hide: 1
        });
    },
    applyRefund: function(t) {
        var e = t.target.dataset.id;
        swan.showLoading({
            title: "正在加载",
            mask: !0
        }), app.request({
            url: api.book.apply_refund,
            method: "post",
            data: {
                order_id: e
            },
            success: function(t) {
                0 == t.code ? swan.showModal({
                    title: "提示",
                    content: "申请退款成功",
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && swan.redirectTo({
                            url: "/pages/book/order/order?status=3"
                        });
                    }
                }) : swan.showModal({
                    title: "提示",
                    content: t.msg
                });
            },
            complete: function() {
                swan.hideLoading();
            }
        });
    },
    comment: function(t) {
        swan.navigateTo({
            url: "/pages/book/order-comment/order-comment?id=" + t.target.dataset.id,
        });
    }
});