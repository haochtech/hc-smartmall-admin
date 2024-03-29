var api = require("../../../api.js"),
    app = getApp();
Page({
    data: {
        status: 1,
        show_menu: !1,
        order_list: [],
        no_orders: !1,
        no_more_orders: !1
    },
    onLoad: function(t) {
        app.pageOnLoad(this);
        var e = this;
        e.setData({
            status: parseInt(t.status || 1),
            loading_more: !0
        }), e.loadOrderList(function() {
            e.setData({
                loading_more: !1
            })
        })
    },
    onReady: function() {
        app.pageOnReady(this)
    },
    onShow: function() {
        app.pageOnShow(this)
    },
    onHide: function() {
        app.pageOnHide(this)
    },
    onUnload: function() {
        app.pageOnUnload(this)
    },
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {},
    showMenu: function(t) {
        this.setData({
            show_menu: !this.data.show_menu
        })
    },
    loadOrderList: function(t) {
        var e = this,
            a = e.data.status,
            o = (e.data.current_page || 0) + 1,
            s = e.data.keyword || "";
        app.request({
            url: api.mch.order.list,
            data: {
                status: a,
                page: o,
                keyword: s
            },
            success: function(t) {
                0 == t.code && (1 != o || t.data.list && t.data.list.length || e.setData({
                    no_orders: !0
                }), t.data.list && t.data.list.length ? (e.data.order_list = e.data.order_list || [], e.data.order_list = e.data.order_list.concat(t.data.list), e.setData({
                    order_list: e.data.order_list,
                    current_page: o
                })) : e.setData({
                    no_more_orders: !0
                }))
            },
            complete: function() {
                "function" == typeof t && t()
            }
        })
    },
    showSendModal: function(t) {
        this.setData({
            show_send_modal: !0,
            send_type: "express",
            order_index: t.currentTarget.dataset.index
        })
    },
    hideSendModal: function() {
        this.setData({
            show_send_modal: !1
        })
    },
    switchSendType: function(t) {
        var e = t.currentTarget.dataset.type;
        this.setData({
            send_type: e
        })
    },
    sendSubmit: function() {
        var e = this;
        if ("express" == e.data.send_type) return e.hideSendModal(), void swan.navigateTo({
            url: "/mch/m/order-send/order-send?id=" + e.data.order_list[e.data.order_index].id
        });
        swan.showModal({
            title: "提示",
            content: "无需物流方式订单将直接标记成已发货，确认操作？",
            success: function(t) {
                t.confirm && (swan.showLoading({
                    title: "正在提交",
                    mask: !0
                }), app.request({
                    url: api.mch.order.send,
                    method: "post",
                    data: {
                        send_type: "none",
                        order_id: e.data.order_list[e.data.order_index].id
                    },
                    success: function(e) {
                        swan.showModal({
                            title: "提示",
                            content: e.msg,
                            success: function(t) {
                                t.confirm && 0 == e.code && swan.redirectTo({
                                    url: "/mch/m/order/order?status=2"
                                })
                            }
                        })
                    },
                    complete: function() {
                        swan.hideLoading({
                            title: "正在提交",
                            mask: !0
                        })
                    }
                }))
            }
        })
    },
    showPicList: function(t) {
        swan.previewImage({
            urls: this.data.order_list[t.currentTarget.dataset.index].pic_list,
            current: this.data.order_list[t.currentTarget.dataset.index].pic_list[t.currentTarget.dataset.pindex]
        })
    },
    refundPass: function(t) {
        var e = this,
            a = t.currentTarget.dataset.index,
            o = e.data.order_list[a].id,
            s = e.data.order_list[a].type;
        swan.showModal({
            title: "提示",
            content: "确认同意" + (1 == s ? "退款？资金将原路返回！" : "换货？"),
            success: function(t) {
                t.confirm && (swan.showLoading({
                    title: "正在处理",
                    mask: !0
                }), app.request({
                    url: api.mch.order.refund,
                    method: "post",
                    data: {
                        id: o,
                        action: "pass"
                    },
                    success: function(t) {
                        swan.showModal({
                            title: "提示",
                            content: t.msg,
                            showCancel: !1,
                            success: function(t) {
                                swan.redirectTo({
                                    url: "/" + e.route + "?" + getApp().utils.objectToUrlParams(e.options)
                                })
                            }
                        })
                    },
                    complete: function() {
                        swan.hideLoading()
                    }
                }))
            }
        })
    },
    refundDeny: function(t) {
        var e = this,
            a = t.currentTarget.dataset.index,
            o = e.data.order_list[a].id;
        e.data.order_list[a].type;
        swan.showModal({
            title: "提示",
            content: "确认拒绝？",
            success: function(t) {
                t.confirm && (swan.showLoading({
                    title: "正在处理",
                    mask: !0
                }), app.request({
                    url: api.mch.order.refund,
                    method: "post",
                    data: {
                        id: o,
                        action: "deny"
                    },
                    success: function(t) {
                        swan.showModal({
                            title: "提示",
                            content: t.msg,
                            showCancel: !1,
                            success: function(t) {
                                swan.redirectTo({
                                    url: "/" + e.route + "?" + getApp().utils.objectToUrlParams(e.options)
                                })
                            }
                        })
                    },
                    complete: function() {
                        swan.hideLoading()
                    }
                }))
            }
        })
    }
});