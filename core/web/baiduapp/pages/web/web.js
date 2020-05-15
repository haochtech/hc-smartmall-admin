var app = getApp();

Page({
    data: {
        url: ""
    },
    onLoad: function(n) {
        app.pageOnLoad(this, n), swan.canIUse("web-view") ? this.setData({
            url: decodeURIComponent(n.url)
        }) : swan.showModal({
            title: "提示",
            content: "您的版本过低，无法打开本页面，请升级至最新版。",
            showCancel: !1,
            success: function(n) {
                n.confirm && swan.navigateBack({
                    delta: 1
                });
            }
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onShareAppMessage: function(n) {
        return {
            path: "pages/web/web?url=" + encodeURIComponent(n.webViewUrl)
        };
    }
});