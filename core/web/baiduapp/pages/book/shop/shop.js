var api = require("../../../api.js"), utils = require("../../../utils.js"), app = getApp(), is_loading = !1, is_no_more = !1;

Page({
    data: {
        page: 1,
        page_count: 1,
        longitude: "",
        latitude: "",
        score: [ 1, 2, 3, 4, 5 ],
        keyword: ""
    },
    onLoad: function(t) {
        app.pageOnLoad(this, t);
        var a = this;
        a.setData({
            ids: t.ids
        }), swan.getLocation({
            success: function(t) {
                a.setData({
                    longitude: t.longitude,
                    latitude: t.latitude
                });
            },
            complete: function() {
                a.loadData();
            }
        });
    },
    onReady: function() {},
    onShow: function() {
        app.pageOnShow(this);
    },
    loadData: function() {
        var a = this;
        swan.showLoading({
            title: "加载中"
        }), app.request({
            url: api.book.shop_list,
            method: "POST",
            data: {
                longitude: a.data.longitude,
                latitude: a.data.latitude,
                ids: a.data.ids
            },
            success: function(t) {
                console.log(t);
                0 == t.code && a.setData(t.data);
            },
            fail: function(t) {},
            complete: function() {
                swan.hideLoading();
            }
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {
        var a = this;
        a.setData({
            keyword: "",
            page: 1
        }), swan.getLocation({
            success: function(t) {
                a.setData({
                    longitude: t.longitude,
                    latitude: t.latitude
                });
            },
            complete: function() {
                a.loadData(), swan.stopPullDownRefresh();
            }
        });
    },
    onReachBottom: function() {
        var t = this;
        t.data.page >= t.data.page_count || t.loadMoreData();
    },
    loadMoreData: function() {
        var e = this, o = e.data.page;
        is_loading || (is_loading = !0, swan.showLoading({
            title: "加载中"
        }), app.request({
            url: api.book.shop_list,
            method: "POST",
            data: {
                page: o,
                longitude: e.data.longitude,
                latitude: e.data.latitude,
                ids: e.data.ids
            },
            success: function(t) {
                if (0 == t.code) {
                    var a = e.data.list.concat(t.data.list);
                    e.setData({
                        list: a,
                        page_count: t.data.page_count,
                        row_count: t.data.row_count,
                        page: o + 1
                    });
                }
            },
            complete: function() {
                swan.hideLoading(), is_loading = !1;
            }
        }));
    },
    goto: function(a) {
        var e = this;
        swan.getSetting({
            success: function(t) {
                t.authSetting["scope.userLocation"] ? e.location(a) : app.getauth({
                    content: "需要获取您的地理位置授权，请到小程序设置中打开授权！",
                    cancel: !1,
                    success: function(t) {
                        t.authSetting["scope.userLocation"] && e.location(a);
                    }
                });
            }
        });
    },
    location: function(t) {
        var a = t.currentTarget.dataset.index, e = this.data.list;
        swan.openLocation({
            latitude: parseFloat(e[a].latitude),
            longitude: parseFloat(e[a].longitude),
            name: e[a].name,
            address: e[a].address
        });
    },
    inputFocus: function(t) {
        this.setData({
            show: !0
        });
    },
    inputBlur: function(t) {
        this.setData({
            show: !1
        });
    },
    inputConfirm: function(t) {
        this.search();
    },
    input: function(t) {
        this.setData({
            keyword: t.detail.value
        });
    },
    search: function(t) {
        var a = this;
        swan.showLoading({
            title: "搜索中"
        }), app.request({
            url: api.book.shop_list,
            method: "POST",
            data: {
                keyword: a.data.keyword,
                longitude: a.data.longitude,
                latitude: a.data.latitude,
                ids: a.data.ids
            },
            success: function(t) {
                0 == t.code && a.setData(t.data);
            },
            complete: function() {
                swan.hideLoading();
            }
        });
    },
    go: function(t) {
        var a = t.currentTarget.dataset.index, e = this.data.list;
        swan.navigateTo({
            url: "/pages/shop-detail/shop-detail?shop_id=" + e[a].id
        });
    },
    navigatorClick: function(t) {
        var a = t.currentTarget.dataset.open_type, e = t.currentTarget.dataset.url;
        return "wxapp" != a || ((e = function(t) {
            var a = /([^&=]+)=([\w\W]*?)(&|$|#)/g, e = /^[^\?]+\?([\w\W]+)$/.exec(t), o = {};
            if (e && e[1]) for (var i, n = e[1]; null != (i = a.exec(n)); ) o[i[1]] = i[2];
            return o;
        }(e)).path = e.path ? decodeURIComponent(e.path) : "", swan.navigateToMiniProgram({
            appId: e.appId,
            path: e.path,
            complete: function(t) {}
        }), !1);
    },
    onShareAppMessage: function(t) {}
});