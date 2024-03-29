var api = require("../../../api.js"), app = getApp(), WxParse = require("../../../wxParse/wxParse.js");

Page({
    data: {
        tab_detail: "active",
        tab_comment: "",

    },
    onLoad: function (t) {
        getApp().pageOnLoad(this, t);
        var a = this;
        t.integral && a.setData({
            user_integral: t.integral
        }), t.goods_id && (a.setData({
            id: t.goods_id
        }), a.getGoods());
    },
    getGoods: function () {
        var r = this;
        swan.showLoading({
            title: "正在加载",
            mask: !0
        }), app.request({
            url: api.integral.goods_info,
            data: {
                id: r.data.id
            },
            success: function (t) {
                if (0 == t.code) {
                    var a = t.data.goods.detail;
                              var myrich = a;

                    myrich = myrich.replace(/\<img/gi, '<img style="width:100%;height:auto" ')
                     swan.setNavigationBarTitle({
                        title: t.data.goods.name
                    }), r.setData({
                        myrich:myrich,
                        goods: t.data.goods,
                        attr_group_list: t.data.attr_group_list
                    });
                } else swan.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    success: function (t) {
                        t.confirm && swan.navigateTo({
                            url: "/pages/integral-mall/index/index"
                        });
                    }
                });
            },
            complete: function (t) {
                setTimeout(function () {
                    swan.hideLoading();
                }, 500);
            }
        });
    },
    showAttrPicker: function () {
        this.setData({
            show_attr_picker: !0
        });
    },
    hideAttrPicker: function () {
        this.setData({
            show_attr_picker: !1
        });
    },
    attrClick: function (t) {
        var a = this, r = t.target.dataset.groupId, i = t.target.dataset.id, e = a.data.attr_group_list;
        for (var o in e) if (e[o].attr_group_id == r) for (var n in e[o].attr_list) e[o].attr_list[n].attr_id == i ? e[o].attr_list[n].checked = !0 : e[o].attr_list[n].checked = !1;
        a.setData({
            attr_group_list: e
        });
        var s = [];
        for (var o in e) {
            for (var n in e[o].attr_list) if (e[o].attr_list[n].checked) {
                var _ = {
                    attr_id: e[o].attr_list[n].attr_id,
                    attr_name: e[o].attr_list[n].attr_name
                };
                s.push(_);
            }
        }
        var d = a.data.goods, g = d.attr, l = 0, c = 0;
        for (var u in g) JSON.stringify(g[u].attr_list) == JSON.stringify(s) && (l = 0 < parseFloat(g[u].price) ? g[u].price : d.price,
            c = 0 < parseInt(g[u].integral) ? g[u].integral : d.integral, a.setData({
                attr_integral: c,
                attr_num: g[u].num,
                attr_price: l,
                status: "attr"
            }));
    },
    showShareModal: function () {
        this.setData({
            share_modal_active: "active",
            no_scroll: !0
        });
    },
    shareModalClose: function () {
        this.setData({
            share_modal_active: "",
            no_scroll: !1
        });
    },
    exchangeGoods: function () {
        var t = this;
        if (!t.data.show_attr_picker) return t.setData({
            show_attr_picker: !0
        }), !0;
        var a = t.data.attr_group_list, r = [];
        for (var i in a) {
            var e = !1;
            for (var o in a[i].attr_list) if (a[i].attr_list[o].checked) {
                e = {
                    attr_id: a[i].attr_list[o].attr_id,
                    attr_name: a[i].attr_list[o].attr_name
                };
                break;
            }
            if (!e) return swan.showToast({
                title: "请选择" + a[i].attr_group_name,
                image: "/images/icon-warning.png"
            }), !0;
            r.push({
                attr_group_id: a[i].attr_group_id,
                attr_group_name: a[i].attr_group_name,
                attr_id: e.attr_id,
                attr_name: e.attr_name
            });
        }
        var n = t.data.user_integral, s = t.data.attr_integral, _ = t.data.attr_num;
        if (parseInt(n) < parseInt(s)) return swan.showToast({
            title: "积分不足!",
            image: "/images/icon-warning.png"
        }), !0;
        if (_ <= 0) return swan.showToast({
            title: "商品库存不足!",
            image: "/images/icon-warning.png"
        }), !0;
        var d = t.data.goods, g = t.data.attr_price;
        s = t.data.attr_integral;
        t.setData({
            show_attr_picker: !1
        }), swan.navigateTo({
            url: "/pages/integral-mall/order-submit/index?goods_info=" + JSON.stringify({
                goods_id: d.id,
                attr: r,
                attr_price: g,
                attr_integral: s
            })
        });
    },
    onReady: function () { },
    onShow: function () { },
    onHide: function () { },
    onUnload: function () { },
    onPullDownRefresh: function () { },
    onReachBottom: function () { }
});