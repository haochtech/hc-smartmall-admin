var api = require("../../api.js"), app = getApp();

Page({
    data: {},
    onLoad: function(t) {
        if (app.pageOnLoad(this, t), t.inId) var a = {
            order_id: t.inId,
            type: "IN"
        }; else a = {
            order_id: t.id,
            type: "mall"
        };
        this.loadData(a);
    },
    loadData: function(t) {
        var a = this;
        swan.showLoading({
            title: "正在加载"
        }), app.request({
            url: api.order.express_detail,
            data: t,
            success: function(t) {
                swan.hideLoading(), 0 == t.code && a.setData({
                    data: t.data
                }), 1 == t.code && swan.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && swan.navigateBack();
                    }
                });
            }
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    copyText: function(t) {
        var a = t.currentTarget.dataset.text;
        swan.setClipboardData({
            data: a,
            success: function() {
                swan.showToast({
                    title: "已复制"
                });
            }
        });
    }
});