var api = require("../../../api.js"),
    app = getApp();
Page({
    data: {},
    onLoad: function(t) {
        app.pageOnLoad(this);
        var e = this;
        e.setData({
            id: t.id || 0
        }), swan.showLoading({
            title: "加载中",
            mask: !0
        }), app.request({
            url: api.mch.order.refund_detail,
            data: {
                id: e.data.id
            },
            success: function(t) {
                0 == t.code && e.setData(t.data), 1 == t.code && swan.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1
                })
            },
            complete: function(t) {
                swan.hideLoading()
            }
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
    showPicList: function(t) {
        swan.previewImage({
            urls: this.data.pic_list,
            current: this.data.pic_list[t.currentTarget.dataset.pindex]
        })
    },
    refundPass: function(t) {
        var e = this,
            a = e.data.id,
            o = e.data.type;
        swan.showModal({
            title: "提示",
            content: "确认同意" + (1 == o ? "退款？资金将原路返回！" : "换货？"),
            success: function(t) {
                t.confirm && (swan.showLoading({
                    title: "正在处理",
                    mask: !0
                }), app.request({
                    url: api.mch.order.refund,
                    method: "post",
                    data: {
                        id: a,
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
            a = e.data.id;
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
                        id: a,
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