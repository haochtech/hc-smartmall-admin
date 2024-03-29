var api = require("../../api.js"), app = getApp(), longitude = "", latitude = "", util = require("../../utils/utils.js"), loadingImg = !1;

Page({
    data: {
        total_price: 0,
        address: null,
        express_price: 0,
        content: "",
        offline: 0,
        express_price_1: 0,
        name: "",
        mobile: "",
        integral_radio: 1,
        new_total_price: 0,
        show_card: !1,
        payment: -1,
        show_payment: !1,
        pond_id: !1,
        scratch_id: !1
    },
    onLoad: function(t) {
        app.pageOnLoad(this, t);
        var a = this, e = util.formatData(new Date());
        swan.removeStorageSync("input_data"), t.pond_id && a.setData({
            pond_id: t.pond_id
        }), t.scratch_id && a.setData({
            scratch_id: t.scratch_id
        }), a.setData({
            options: t,
            store: swan.getStorageSync("store"),
            time: e
        });
    },
    bindkeyinput: function(t) {
        var a = t.currentTarget.dataset.mchIndex;
        -1 == a ? this.setData({
            content: t.detail.value
        }) : (this.data.mch_list[a] && (this.data.mch_list[a].content = t.detail.value), 
        this.setData({
            mch_list: this.data.mch_list
        }));
    },
    KeyName: function(t) {
        this.setData({
            name: t.detail.value
        });
    },
    KeyMobile: function(t) {
        this.setData({
            mobile: t.detail.value
        });
    },
    getOffline: function(t) {
        var a = this.data.express_price, e = this.data.express_price_1;
        1 == t.currentTarget.dataset.index ? this.setData({
            offline: 1,
            express_price: 0,
            express_price_1: a,
            is_area: 0
        }) : this.setData({
            offline: 0,
            express_price: e
        }), this.getPrice();
    },
    dingwei: function() {
        var a = this;
        swan.chooseLocation({
            success: function(t) {
                longitude = t.longitude, latitude = t.latitude, a.setData({
                    location: t.address
                });
            },
            fail: function(t) {
                app.getauth({
                    content: "需要获取您的地理位置授权，请到小程序设置中打开授权",
                    success: function(t) {
                        t && (t.authSetting["scope.userLocation"] ? a.dingwei() : swan.showToast({
                            title: "您取消了授权",
                            image: "/images/icon-warning.png"
                        }));
                    }
                });
            }
        });
    },
    orderSubmit: function(t) {
        var a = this, e = a.data.offline, i = {};
        if (0 == e) {
            if (1 == a.data.is_area) return void swan.showToast({
                title: "所选地区无货",
                image: "/images/icon-warning.png"
            });
            if (!a.data.address || !a.data.address.id) return void swan.showToast({
                title: "请选择收货地址",
                image: "/images/icon-warning.png"
            });
            i.address_id = a.data.address.id;
        } else {
            if (i.address_name = a.data.name, i.address_mobile = a.data.mobile, !a.data.shop.id) return void swan.showModal({
                title: "警告",
                content: "请选择门店",
                showCancel: !1
            });
            if (i.shop_id = a.data.shop.id, !i.address_name || null == i.address_name) return void a.showToast({
                title: "请填写联系人",
                image: "/images/icon-warning.png"
            });
            if (!i.address_mobile || null == i.address_mobile) return void a.showToast({
                title: "请填写联系方式",
                image: "/images/icon-warning.png"
            });
            if (!/^\+?\d[\d -]{8,12}\d/.test(i.address_mobile)) return void swan.showModal({
                title: "提示",
                content: "手机号格式不正确",
                showCancel: !1
            });
        }
        i.offline = e;
        var s = a.data.form;
        if (1 == s.is_form && a.data.goods_list && a.data.goods_list.length) {
            var d = s.list;
            for (var o in d) if ("date" == d[o].type && (d[o].default = d[o].default ? d[o].default : a.data.time), 
            "time" == d[o].type && (d[o].default = d[o].default ? d[o].default : "00:00"), 1 == d[o].required) if ("radio" == d[o].type || "checkboxc" == d[o].type) {
                var n = !1;
                for (var r in d[o].default_list) 1 == d[o].default_list[r].is_selected && (n = !0);
                if (!n) return swan.showModal({
                    title: "提示",
                    content: "请填写" + s.name + "，加‘*’为必填项",
                    showCancel: !1
                }), !1;
            } else if (!d[o].default || null == d[o].default) return swan.showModal({
                title: "提示",
                content: "请填写" + s.name + "，加‘*’为必填项",
                showCancel: !1
            }), !1;
        }
        if (0 < a.data.pond_id) {
            if (0 < a.data.express_price && -1 == a.data.payment) return a.setData({
                show_payment: !0
            }), !1;
        } else if (0 < a.data.scratch_id) {
            if (0 < a.data.express_price && -1 == a.data.payment) return a.setData({
                show_payment: !0
            }), !1;
        } else if (-1 == a.data.payment) return a.setData({
            show_payment: !0
        }), !1;
        if (i.form = JSON.stringify(s), a.data.cart_id_list && (i.cart_id_list = JSON.stringify(a.data.cart_id_list)), 
        a.data.mch_list && a.data.mch_list.length) {
            var c = [];
            for (var o in a.data.mch_list) if (a.data.mch_list[o].cart_id_list) {
                var l = {
                    id: a.data.mch_list[o].id,
                    cart_id_list: a.data.mch_list[o].cart_id_list
                };
                a.data.mch_list[o].content && (l.content = a.data.mch_list[o].content), c.push(l);
            }
            c.length ? i.mch_list = JSON.stringify(c) : i.mch_list = "";
        }
        a.data.goods_info && (i.goods_info = JSON.stringify(a.data.goods_info)), a.data.picker_coupon && (i.user_coupon_id = a.data.picker_coupon.user_coupon_id), 
        a.data.content && (i.content = a.data.content), a.data.cart_list && (i.cart_list = JSON.stringify(a.data.cart_list)), 
        1 == a.data.integral_radio ? i.use_integral = 1 : i.use_integral = 2, a.data.goods_list && a.data.goods_list.length || !a.data.mch_list || 1 != a.data.mch_list.length || (i.content = a.data.mch_list[0].content ? a.data.mch_list[0].content : ""), 
        i.payment = a.data.payment, i.formId = t.detail.formId, i.pond_id = a.data.pond_id, 
        i.scratch_id = a.data.scratch_id, i.pond_id ? a.order_submit(i, "pond") : i.scratch_id ? a.order_submit(i, "scratch") : a.order_submit(i, "s");
    },
    onReady: function() {},
    onShow: function(t) {
        if (!getApp().onShowData || !getApp().onShowData.scene || 1034 != getApp().onShowData.scene && "pay" != getApp().onShowData.scene) if (loadingImg) loadingImg = !1; else {
            getCurrentPages();
            app.pageOnShow(this);
            var a = this, e = swan.getStorageSync("picker_address");
            if (e) {
                a.data.is_area_city_id;
                var i = {};
                i.address = e, i.name = e.name, i.mobile = e.mobile, swan.removeStorageSync("picker_address"), 
                a.setData(i), a.getInputData();
            }
            a.getOrderData(a.data.options);
        }
    },
    getOrderData: function(t) {
        var n = this, a = {}, e = "";
        if (n.data.address && n.data.address.id && (e = n.data.address.id), a.address_id = e, 
        a.longitude = longitude, a.latitude = latitude, swan.showLoading({
            title: "正在加载",
            mask: !0
        }), t.cart_list) {
            JSON.parse(t.cart_list);
            a.cart_list = t.cart_list;
        }
        if (t.cart_id_list) {
            var i = JSON.parse(t.cart_id_list);
            a.cart_id_list = i;
        }
        if (t.mch_list) {
            var s = JSON.parse(t.mch_list);
            a.mch_list = s;
        }
        t.goods_info && (a.goods_info = t.goods_info), t.bargain_order_id && (a.bargain_order_id = t.bargain_order_id), 
        app.request({
            url: api.order.submit_preview,
            data: a,
            success: function(t) {
                if (swan.hideLoading(), 0 == t.code) {
                    var a = swan.getStorageSync("input_data");
                    swan.removeStorageSync("input_data");
                    var e = [], i = t.data.coupon_list;
                    for (var s in i) null != i[s] && e.push(i[s]);
                    var d = t.data.shop_list, o = {};
                    d && 1 == d.length && (o = d[0]), t.data.is_shop && (o = t.data.is_shop), a || (1 < (a = {
                        shop: o,
                        address: t.data.address || null,
                        name: t.data.address ? t.data.address.name : "",
                        mobile: t.data.address ? t.data.address.mobile : "",
                        pay_type_list: t.data.pay_type_list,
                        form: t.data.form
                    }).pay_type_list.length ? a.payment = -1 : a.payment = a.pay_type_list[0].payment), 
                    a.total_price = t.data.total_price || 0, a.goods_list = t.data.list || null, a.express_price = parseFloat(t.data.express_price), 
                    a.coupon_list = i, a.shop_list = d, a.send_type = t.data.send_type, a.level = t.data.level, 
                    a.new_total_price = t.data.total_price || 0, a.integral = t.data.integral, a.goods_card_list = t.data.goods_card_list || [], 
                    a.is_payment = t.data.is_payment, a.mch_list = t.data.mch_list || null, a.is_area_city_id = t.data.is_area_city_id, 
                    a.pay_type_list = t.data.pay_type_list, a.offer_rule = t.data.offer_rule, a.is_area = t.data.is_area, 
                    n.setData(a), n.getInputData(), t.data.goods_info && n.setData({
                        goods_info: t.data.goods_info
                    }), t.data.cart_id_list && n.setData({
                        cart_id_list: t.data.cart_id_list
                    }), t.data.cart_list && n.setData({
                        cart_list: t.data.cart_list
                    }), 1 == t.data.send_type && n.setData({
                        offline: 0
                    }), 2 == t.data.send_type && n.setData({
                        offline: 1
                    }), n.getPrice();
                }
                1 == t.code && swan.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    confirmText: "返回",
                    success: function(t) {
                        t.confirm && swan.navigateBack({
                            delta: 1
                        });
                    }
                });
            }
        });
    },
    copyText: function(t) {
        var a = t.currentTarget.dataset.text;
        a && swan.setClipboardData({
            data: a,
            success: function() {
                page.showToast({
                    title: "已复制内容"
                });
            },
            fail: function() {
                page.showToast({
                    title: "复制失败",
                    image: "/images/icon-warning.png"
                });
            }
        });
    },
    showCouponPicker: function() {
        this.getInputData(), this.data.coupon_list && 0 < this.data.coupon_list.length && this.setData({
            show_coupon_picker: !0
        });
    },
    pickCoupon: function(t) {
        var a = t.currentTarget.dataset.index, e = swan.getStorageSync("input_data");
        swan.removeStorageSync("input_data"), e.picker_coupon = "-1" != a && -1 != a && this.data.coupon_list[a], 
        e.show_coupon_picker = !1, this.setData(e), this.getPrice();
    },
    numSub: function(t, a, e) {
        return 100;
    },
    showShop: function(t) {
        var a = this;
        a.getInputData(), a.dingwei(), a.data.shop_list && 1 <= a.data.shop_list.length && a.setData({
            show_shop: !0
        });
    },
    pickShop: function(t) {
        var a = t.currentTarget.dataset.index, e = swan.getStorageSync("input_data");
        swan.removeStorageSync("input_data"), e.shop = "-1" != a && -1 != a && this.data.shop_list[a], 
        e.show_shop = !1, this.setData(e), this.getPrice();
    },
    integralSwitchChange: function(t) {
        0 != t.detail.value ? this.setData({
            integral_radio: 1
        }) : this.setData({
            integral_radio: 2
        }), this.getPrice();
    },
    integration: function(t) {
        var a = this.data.integral.integration;
        swan.showModal({
            title: "积分使用规则",
            content: a,
            showCancel: !1,
            confirmText: "我知道了",
            confirmColor: "#ff4544",
            success: function(t) {
                t.confirm;
            }
        });
    },
    getPrice: function() {
        var t = this, a = t.data.total_price, e = t.data.express_price, i = t.data.picker_coupon, s = t.data.integral, d = t.data.integral_radio, o = t.data.level, n = t.data.offline;
        if (t.data.goods_list && 0 < t.data.goods_list.length && (i && (a -= i.sub_price), 
        s && 1 == d && (a -= parseFloat(s.forehead)), o && (a = a * o.discount / 10), a <= .01 && (a = .01), 
        0 == n && (a += e)), t.data.mch_list && t.data.mch_list.length) for (var r in t.data.mch_list) a += t.data.mch_list[r].total_price + t.data.mch_list[r].express_price;
        t.setData({
            new_total_price: parseFloat(a.toFixed(2))
        });
    },
    cardDel: function() {
        this.setData({
            show_card: !1
        }), swan.redirectTo({
            url: "/pages/order/order?status=1"
        });
    },
    cardTo: function() {
        this.setData({
            show_card: !1
        }), swan.redirectTo({
            url: "/pages/card/card"
        });
    },
    formInput: function(t) {
        var a = t.currentTarget.dataset.index, e = this.data.form, i = e.list;
        i[a].default = t.detail.value, e.list = i, this.setData({
            form: e
        });
    },
    selectForm: function(t) {
        var a = t.currentTarget.dataset.index, e = t.currentTarget.dataset.k, i = this.data.form, s = i.list;
        if ("radio" == s[a].type) {
            var d = s[a].default_list;
            for (var o in d) o == e ? d[e].is_selected = 1 : d[o].is_selected = 0;
            s[a].default_list = d;
        }
        "checkbox" == s[a].type && (1 == (d = s[a].default_list)[e].is_selected ? d[e].is_selected = 0 : d[e].is_selected = 1, 
        s[a].default_list = d);
        i.list = s, this.setData({
            form: i
        });
    },
    showPayment: function() {
        this.setData({
            show_payment: !0
        });
    },
    payPicker: function(t) {
        var a = t.currentTarget.dataset.index;
        this.setData({
            payment: a,
            show_payment: !1
        });
    },
    payClose: function() {
        this.setData({
            show_payment: !1
        });
    },
    getInputData: function() {
        var t = this, a = {
            address: t.data.address,
            content: t.data.content,
            name: t.data.name,
            mobile: t.data.mobile,
            integral_radio: t.data.integral_radio,
            payment: t.data.payment,
            shop: t.data.shop,
            form: t.data.form,
            picker_coupon: t.data.picker_coupon
        };
        swan.setStorageSync("input_data", a);
    },
    onHide: function() {
        app.pageOnHide(this);
        this.getInputData();
    },
    onUnload: function() {
        app.pageOnUnload(this), swan.removeStorageSync("input_data");
    },
    uploadImg: function(t) {
        var a = this, e = t.currentTarget.dataset.index, i = a.data.form;
        loadingImg = !0, app.uploader.upload({
            start: function() {
                swan.showLoading({
                    title: "正在上传",
                    mask: !0
                });
            },
            success: function(t) {
                0 == t.code ? (i.list[e].default = t.data.url, a.setData({
                    form: i
                })) : a.showToast({
                    title: t.msg
                });
            },
            error: function(t) {
                a.showToast({
                    title: t
                });
            },
            complete: function() {
                swan.hideLoading();
            }
        });
    }
});