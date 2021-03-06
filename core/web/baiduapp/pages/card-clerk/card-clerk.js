var api = require("../../api.js"), app = getApp();

Page({
    data: {},
    onLoad: function(e) {
        app.pageOnLoad(this, e);
        var n = swan.getStorageSync("user_info");
        this.setData({
            store: swan.getStorageSync("store"),
            user_info: n
        });
        var o = "";
        if ("undefined" == typeof my) o = decodeURIComponent(e.scene); else if (null !== app.query) {
            var t = app.query;
            app.query = null, o = t.user_card_id;
        }
        swan.showModal({
            title: "提示",
            content: "是否核销？",
            success: function(e) {
                e.confirm ? (swan.showLoading({
                    title: "核销中"
                }), app.request({
                    url: api.user.card_clerk,
                    data: {
                        user_card_id: o
                    },
                    success: function(e) {
                        swan.showModal({
                            title: "提示",
                            content: e.msg,
                            showCancel: !1,
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
                })) : e.cancel && swan.redirectTo({
                    url: "/pages/index/index"
                });
            }
        });
    },
    onReady: function() {},
    onShow: function() {
        app.pageOnShow(this);
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {}
});