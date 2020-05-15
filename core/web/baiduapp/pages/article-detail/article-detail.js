var api = require("../../api.js"), app = getApp(), WxParse = require("../../wxParse/wxParse.js");

Page({
    data: {},
    onLoad: function(t) {
        app.pageOnLoad(this, t);
        var a = this;
        app.request({
            url: api.default.article_detail,
            data: {
                id: t.id
            },
            success: function(t) {
                console.log(t);
                if(0 == t.code) {
                    swan.setNavigationBarTitle({
                        title: t.data.title,
                    });
                    var myrich = t.data.content;
                    myrich = myrich.replace(/\<img/gi, '<img style="width:100%;height:auto" ')
                    a.setData({
                        myrich: myrich,
                    })
                }
                1 == t.code && swan.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    confirm: function(t) {
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
    onReachBottom: function() {}
});