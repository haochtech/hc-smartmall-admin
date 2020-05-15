var api = require("../../api.js"), app = getApp(), is_loading_more = !1, is_no_more = !1;

Page({
    data: {
        cat_id: "",
        page: 1,
        // cat_list: [],
        goods_list: [],
        sort: 0,
        sort_type: -1,
        quick_icon: !0
    },
    onLoad: function (t) {
        app.pageOnLoad(this, t), this.loadData(t);
    },
    loadData: function (t) {
        var a = swan.getStorageSync("cat_list"), i = "";
        if (t.cat_id) for (var o in a) {
            var e = !1;
            for (var s in a[o].id == t.cat_id && (a[o].checked = !0, 0 < a[o].list.length && (i = "height-bar")),
                a[o].list) a[o].list[s].id == t.cat_id && (e = a[o].list[s].checked = !0, i = "height-bar");
            e && (a[o].checked = !0);
        }
        if (t.goods_id) var d = t.goods_id;
        this.setData({
            cat_list: a,
            cat_id: t.cat_id || "",
            height_bar: i,
            goods_id: d || ""
        }), this.reloadGoodsList();
    },
    catClick: function (t) {
        var a = this, i = "", o = t.currentTarget.dataset.index, e = a.data.cat_list;
        for (var s in e) {
            for (var d in e[s].list) e[s].list[d].checked = !1;
            s == o ? (e[s].checked = !0, i = e[s].id) : e[s].checked = !1;
        }
        var r = "";
        0 < e[o].list.length && (r = "height-bar"), a.setData({
            cat_list: e,
            cat_id: i,
            height_bar: r
        }), a.reloadGoodsList();
    },
    quickNavigation: function () {
        this.setData({
            quick_icon: !this.data.quick_icon
        });
        this.data.store;
        var t = swan.createAnimation({
            duration: 300,
            timingFunction: "ease-out"
        });
        this.data.quick_icon ? t.opacity(0).step() : t.translateY(-55).opacity(1).step(),
            this.setData({
                animationPlus: t.export()
            });
    },
    subCatClick: function (t) {
        var a = this, i = "", o = t.currentTarget.dataset.index, e = t.currentTarget.dataset.parentIndex, s = a.data.cat_list;
        for (var d in s) for (var r in s[d].list) d == e && r == o ? (s[d].list[r].checked = !0,
            i = s[d].list[r].id) : s[d].list[r].checked = !1;
        a.setData({
            cat_list: s,
            cat_id: i
        }), a.reloadGoodsList();
    },
    allClick: function () {
        var t = this, a = t.data.cat_list;
        for (var i in a) {
            for (var o in a[i].list) a[i].list[o].checked = !1;
            a[i].checked = !1;
        }
        t.setData({
            cat_list: a,
            cat_id: "",
            height_bar: ""
        }), t.reloadGoodsList();
    },
    reloadGoodsList: function () {
        var a = this;
        is_no_more = !1, a.setData({
            page: 1,
            goods_list: [],
            show_no_data_tip: !1
        });
        var t = a.data.cat_id || "", i = a.data.page || 1;
        app.request({
            url: api.default.goods_list,
            data: {
                cat_id: t,
                page: i,
                sort: a.data.sort,
                sort_type: a.data.sort_type,
                goods_id: a.data.goods_id
            },
            success: function (t) {
                0 == t.code && (0 == t.data.list.length && (is_no_more = !0), a.setData({
                    page: i + 1
                }), a.setData({
                    goods_list: t.data.list
                })), a.setData({
                    show_no_data_tip: 0 == a.data.goods_list.length
                });
            },
            complete: function () { }
        });
    },
    loadMoreGoodsList: function () {
        var i = this;
        if (!is_loading_more) {
            i.setData({
                show_loading_bar: !0
            }), is_loading_more = !0;
            var t = i.data.cat_id || "", o = i.data.page || 2, a = i.data.goods_id;
            app.request({
                url: api.default.goods_list,
                data: {
                    page: o,
                    cat_id: t,
                    sort: i.data.sort,
                    sort_type: i.data.sort_type,
                    goods_id: a
                },
                success: function (t) {
                    0 == t.data.list.length && (is_no_more = !0);
                    var a = i.data.goods_list.concat(t.data.list);
                    i.setData({
                        goods_list: a,
                        page: o + 1
                    });
                },
                complete: function () {
                    is_loading_more = !1, i.setData({
                        show_loading_bar: !1
                    });
                }
            });
        }
    },
    onReachBottom: function () {
        is_no_more || this.loadMoreGoodsList();
    },
    onShow: function (t) {
        app.pageOnShow(this);
        var a = this;
        if (swan.getStorageSync("list_page_reload")) {
            var i = swan.getStorageSync("list_page_options");
            swan.removeStorageSync("list_page_options"), swan.removeStorageSync("list_page_reload");
            var o = i.cat_id || "";
            a.setData({
                cat_id: o
            });
            var e = a.data.cat_list;
            for (var s in e) {
                var d = !1;
                for (var r in e[s].list) e[s].list[r].id == o ? d = e[s].list[r].checked = !0 : e[s].list[r].checked = !1;
                d || o == e[s].id ? (e[s].checked = !0, e[s].list && 0 < e[s].list.length && a.setData({
                    height_bar: "height-bar"
                })) : e[s].checked = !1;
            }
            a.setData({
                cat_list: e
            }), a.reloadGoodsList();
        }
    },


    sortClick: function (e) {
        var page = this;

        console.log(e)
        console.log(e)
        var sort = e.currentTarget.dataset.sort;

        // var default_sort_type = e.currentTarget.dataset.p;

    var default_sort_type = e.currentTarget.dataset.p == undefined ? -1 : e.currentTarget.dataset.p;

        var sort_type = page.data.sort_type;

        console.log(page.data.sort_type)

        if (page.data.sort == sort) {
            if (default_sort_type == -1) {
                return;
            }
            if (page.data.sort_type == -1) {

                sort_type = default_sort_type;

            } else {
                sort_type = (sort_type == 0 ? 1 : 0);
            }
        } else {
            sort_type = default_sort_type;
        }

        page.setData({
            sort: sort,
            sort_type: sort_type,
        });
        page.reloadGoodsList();
    },





    onReady: function () { },
    onHide: function () { },
    onUnload: function () { },
    onShareAppMessage: function (t) {
        return {
            path: "/pages/list/list?user_id=" + swan.getStorageSync("user_info").id,
            success: function (t) { }
        };
    },
    onPullDownRefresh: function () { }
});