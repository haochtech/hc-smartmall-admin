var api = require("../../api.js"), utils = require("../../utils.js"), app = getApp(), videoContext = "", setIntval = null, WxParse = require("../../wxParse/wxParse.js"), userIntval = null, scrollIntval = null, is_loading = !1;

Page({
    data: {
        hide: "hide",
        time_list: {
            day: 0,
            hour: "00",
            minute: "00",
            second: "00"
        },
        p: 1,
        user_index: 0,
        show_content: !1
    },
    onLoad: function(t) {
        app.pageOnLoad(this);
        var a = decodeURIComponent(t.scene);
        if (null != a) {
            var e = utils.scene_decode(a);
            e.gid && (t.goods_id = e.gid);
        }
        console.log(t), this.getGoods(t.goods_id);
    },
    getGoods: function(t) {
        var e = this;
        swan.showLoading({
            title: "加载中"
        }), app.request({
            url: api.bargain.goods,
            data: {
                goods_id: t,
                page: 1
            },
            success: function(t) {
                if (0 == t.code) {
                    var a = t.data.goods.detail;
                      

                    var myrich = a;
                    myrich = myrich.replace(/\<img/gi, '<img style="width:100%;height:auto" ')
                    
                     e.setData(t.data),
                      e.setData({
                        myrich:myrich,
                        reset_time: e.data.goods.reset_time,
                        time_list: e.setTimeList(t.data.goods.reset_time),
                        p: 1
                    }),
                    
                    
                     e.setTimeOver(), t.data.bargain_info && e.getUserTime();
                } else swan.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && swan.navigateBack({
                            delta: -1
                        });
                    }
                });
            },
            complete: function(t) {
                swan.hideLoading();
            }
        });
    },
    onReady: function() {
        app.pageOnReady(this);
    },
    onShow: function() {
        app.pageOnShow(this);
    },
    onHide: function() {
        app.pageOnHide(this);
    },
    onUnload: function() {
        app.pageOnUnload(this), clearInterval(setIntval), setIntval = null, clearInterval(userIntval), 
        userIntval = null, clearInterval(scrollIntval), scrollIntval = null;
    },
    play: function(t) {
        var a = t.target.dataset.url;
        this.setData({
            url: a,
            hide: "",
            show: !0
        }), (videoContext = swan.createVideoContext("video")).play();
    },
    close: function(t) {
        if ("video" == t.target.id) return !0;
        this.setData({
            hide: "hide",
            show: !1
        }), videoContext.pause();
    },
    onGoodsImageClick: function(t) {
        var a = [], e = t.currentTarget.dataset.index;
        for (var i in this.data.goods.pic_list) a.push(this.data.goods.pic_list[i].pic_url);
        swan.previewImage({
            urls: a,
            current: a[e]
        });
    },
    hide: function(t) {
        0 == t.detail.current ? this.setData({
            img_hide: ""
        }) : this.setData({
            img_hide: "hide"
        });
    },
    setTimeOver: function() {
        var e = this;
        setIntval = setInterval(function() {
            e.data.resset_time <= 0 && clearInterval(setIntval);
            var t = e.data.reset_time - 1, a = e.setTimeList(t);
            e.setData({
                reset_time: t,
                time_list: a
            });
        }, 1e3);
    },
    orderSubmit: function() {
        var a = this;
        swan.showLoading({
            title: "加载中"
        }), app.request({
            url: api.bargain.bargain_submit,
            method: "POST",
            data: {
                goods_id: a.data.goods.id
            },
            success: function(t) {
                0 == t.code ? swan.redirectTo({
                    url: "/bargain/activity/activity?order_id=" + t.data.order_id
                }) : a.showToast({
                    title: t.msg
                });
            },
            complete: function(t) {
                swan.hideLoading();
            }
        });
    },
    buyNow: function() {
        var t = [], a = [], e = this.data.bargain_info;
        e && (a.push({
            bargain_order_id: e.order_id
        }), t.push({
            mch_id: 0,
            goods_list: a
        }), swan.redirectTo({
            url: "/pages/new-order-submit/new-order-submit?mch_list=" + JSON.stringify(t)
        }));
    },
    getUserTime: function() {
        var a = this;
        userIntval = setInterval(function() {
            a.loadData();
        }, 1e3), scrollIntval = setInterval(function() {
            var t = a.data.user_index;
            3 < a.data.bargain_info.bargain_info.length - t ? t += 3 : t = 0, a.setData({
                user_index: t
            });
        }, 3e3);
    },
    loadData: function() {
        var i = this, n = i.data.p;
        is_loading || (is_loading = !0, app.request({
            url: api.bargain.goods_user,
            data: {
                page: n + 1,
                goods_id: i.data.goods.id
            },
            success: function(t) {
                if (0 == t.code) {
                    var a = i.data.bargain_info.bargain_info, e = t.data.bargain_info;
                    0 == e.bargain_info.length && (clearInterval(userIntval), userIntval = null), e.bargain_info = a.concat(e.bargain_info), 
                    i.setData({
                        bargain_info: e,
                        p: n + 1
                    });
                } else i.showToast({
                    title: t.msg
                });
            },
            complete: function() {
                is_loading = !1;
            }
        }));
    },
    contentClose: function() {
        this.setData({
            show_content: !1
        });
    },
    contentOpen: function() {
        this.setData({
            show_content: !0
        });
    },
    onShareAppMessage: function() {
        return {
            path: "/bargain/list/list?goods_id=" + this.data.goods.id + "&user_id=" + this.data.__user_info.id,
            success: function(t) {}
        };
    }
});