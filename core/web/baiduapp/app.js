var hj = swan,

    page = require("./utils/page.js"),
    request = require("./utils/request.js"),

    utils = require("./utils/utils.js"),
    order_pay = require("./commons/order-pay/order-pay.js"),
    uploader = require("./utils/uploader");
// login = require("./utils/login.js");
var api = require("./api.js");

var _app = App({
    is_on_launch: !0,
    onShowData: null,
    _version: "2.8.7",
    query: null,

    onLaunch: function (e) {

        this.setApi(),
            api = this.api,
            this.getNavigationBarColor(),
            this.getStoreData(),
            this.getCatList();
        //console.log(api);
        //this.checkSession();
        var access_token = swan.getStorageSync('access_token');
        if(!access_token || access_token=='undefined') {
            this.login();
        }
    },

    checkSession: function () {
        var o = this;
        swan.checkSession({
            success: function (res) {
                console.log(res);
            },
            fail: function (err) {
                console.log('登录态无效');
                o.login();
            }
        });
    },

    // 授权
    login: function (n) {
        var o = this;
        swan.login({
            success: function (e) {
                var t = e.code;
                console.log(t);
                swan.request({
                    url: api.passport.get_key,
                    data: {
                        code: t,
                    },
                    success: function (e) {
                        console.log(e);
                        if (0 == e.data.code) {
                            swan.setStorageSync('session_key', e.data.data.session_key);
                            swan.setStorageSync('openid', e.data.data.openid);
                            o.getauth(e.data.data.session_key);
                        } else {
                            swan.showModal({
                                title: "提示",
                                content: '授权key获取失败.',
                                showCancel: !1
                            });
                        }
                    }
                });
            },
            fail: function (e) { }
        });
    },

    getUserInfo: function (session_key) {
        console.log(session_key);
        swan.getUserInfo({
            success: function (res) {
                console.log(res);
                swan.request({
                    url: api.passport.login,
                    data: {
                        ciphertext: res.data,
                        iv: res.iv,
                        session_key: session_key,
                        user_info: JSON.stringify(res.userInfo),
                        openid: swan.getStorageSync('openid'),
                    },
                    success: function (e) {
                        console.log(e);
                        if (0 == e.data.code) {
                            swan.setStorageSync("access_token", e.data.data.access_token),
                                swan.setStorageSync("user_info", e.data.data);
                            var t = swan.getStorageSync("login_pre_page");
                            swan.showToast({
                                title: '登录成功.',
                            });
                            setTimeout(function(){
                                t && t.route || swan.redirectTo({
                                    url: "/pages/index/index"
                                });
                                var n = 0;
                                (n = t.options && t.options.user_id ? t.options.user_id : t.options && t.options.scene ? t.options.scene : swan.getStorageSync("parent_id")) && 0 != n && getApp().bindParent({
                                    parent_id: n
                                }),
                                swan.redirectTo({
                                    url: "/" + t.route + "?" + getApp().utils.objectToUrlParams(t.options)
                                });
                            },1000);
                        } else swan.showModal({
                            title: "提示",
                            content: e.msg,
                            showCancel: !1
                        });
                    },
                    complete: function () {
                        swan.hideLoading();
                    },
                    fail: function (a) {
                        console.log(a)
                    }
                });
            },

            fail: function (a) {
                console.log(a)
            }
        });
    },

    getauth: function (t) {
        var i = this;
        swan.authorize({
            scope: 'scope.userInfo',
            success: function (res) {
                // 用户已经同意智能小程序使用定位功能
                console.log(res)
                i.getUserInfo(t);
            }
        });
    },


    onShow: function (e) {
        e.scene && (this.onShowData = e),
            e && e.query && (this.query = e.query);
    },

    getStoreData: function () {
        var t = this;
        this.request({
            url: api.default.store,
            success: function (e) {
                console.log(e)
                0 == e.code && (swan.setStorageSync("store", e.data.store),
                    swan.setStorageSync("store_name", e.data.store_name),
                    swan.setStorageSync("show_customer_service", e.data.show_customer_service),
                    swan.setStorageSync("contact_tel", e.data.contact_tel),
                    swan.setStorageSync("share_setting", e.data.share_setting),
                    swan.permission_list = e.data.permission_list,
                    swan.setStorageSync("wxapp_img", e.data.wxapp_img),
                    swan.setStorageSync("wx_bar_title", e.data.wx_bar_title));
            },

            complete: function () { }
        });
    },

    getCatList: function () {
        var i = this;
        this.request({
            url: api.default.cat_list,
            success: function (e) {
                if (0 == e.code) {
                    var t = e.data.list || [];
                    i.hj.setStorageSync("cat_list", t);
                }
            }
        });
    },


    saveFormId: function (e) {
        this.request({
            url: api.user.save_form_id,
            data: {
                form_id: e
            }
        });
    },

    loginBindParent: function (e) {
        // if ("" == this.hj.getStorageSync("access_token")) return !0;
        this.bindParent(e);
    },

    bindParent: function (e) {
        var t = this;
        if ("undefined" != e.parent_id && 0 != e.parent_id) {

            var i = swan.getStorageSync("user_info");

            if (0 < swan.getStorageSync("share_setting").level) 0 != e.parent_id && t.request({
                url: api.share.bind_parent,
                data: {
                    parent_id: e.parent_id
                },
                success: function (e) {
                    0 == e.code && (i.parent = e.data, t.hj.setStorageSync("user_info", i));
                }
            });

        }
    },


    shareSendCoupon: function (i) {
        var a = this;
        a.hj.showLoading({
            mask: !0
        }), i.hideGetCoupon || (i.hideGetCoupon = function (e) {
            var t = e.currentTarget.dataset.url || !1;
            i.setData({
                get_coupon_list: null
            }), t && a.hj.navigateTo({
                url: t
            });
        }), this.request({
            url: api.coupon.share_send,
            success: function (e) {
                0 == e.code && i.setData({
                    get_coupon_list: e.data.list
                });
            },
            complete: function () {
                a.hj.hideLoading();
            }
        });
    },

    setApi: function () {
        var a = this.siteInfo.siteroot;
        a = a.replace("app/index.php", ""),
            a += "addons/zxshop_mall/core/web/index.php?store_id=-1&r=api/",
            console.log(a)
        this.api = function e(t) {
            for (var i in t) "string" == typeof t[i] ? t[i] = t[i].replace("{$_api_root}", a) : t[i] = e(t[i]);
            return t;

        }(this.api);

        var e = this.api.default.index,
            t = e.substr(0, e.indexOf("/index.php")); 
        this.webRoot = t;
    },

    webRoot: null,
    siteInfo: require("./siteinfo.js"),
    currentPage: null,

    pageOnLoad: function (e, t) {
        this.page.onLoad(e, t);
        console.log('这是页面路径' + e.route)
    },
    pageOnReady: function (e) {
        this.page.onReady(e);
    },
    pageOnShow: function (e) {
        this.page.onShow(e);
    },
    pageOnHide: function (e) {
        this.page.onHide(e);
    },
    pageOnUnload: function (e) {
        this.page.onUnload(e);
    },

    getNavigationBarColor: function () {
        var t = this;
        t.request({
            url: api.default.navigation_bar_color,
            success: function (e) {
                // 0 == e.code && (t.hj.setStorageSync("_navigation_bar_color", e.data), t.setNavigationBarColor());
            }
        });
    },

    setNavigationBarColor: function () {
        var e = this.hj.getStorageSync("_navigation_bar_color");
        e && this.hj.setNavigationBarColor(e);
    },

    loginNoRefreshPage: ["pages/index/index", "mch/shop/shop"],

    navigatorClick: function (e, t) {

        var i = e.currentTarget.dataset.open_type;


        if ("redirect" == i) return !0;

        if ("wxapp" == i) {
            var a = e.currentTarget.dataset.path;
            console.log(a)
            "/" != a.substr(0, 1) && (a = "/" + a), this.hj.navigateToMiniProgram({
                appId: e.currentTarget.dataset.appid,
                path: a,
                complete: function (e) { }
            });
        }
        if ("tel" == i) {
            var n = e.currentTarget.dataset.tel;
            this.hj.makePhoneCall({
                phoneNumber: n
            });
        }
        return !1;
    },

    hj: hj,
    page: page,
    request: request,
    api: api,
    utils: utils,
    order_pay: order_pay,
    uploader: uploader,
    // login: login,
    setRequire: function () {
        this.hj = require("./hj.js"),
            this.request = require("./utils/request.js"), this.page = require("./utils/page.js"),
            this.api = require("./api.js"), this.utils = require("./utils/utils.js"), this.order_pay = require("./commons/order-pay/order-pay.js"),
            this.uploader = require("./utils/uploader");
        //  this.login = require("./utils/login.js");
    },
    getPlatform: function () {
        return "undefined" != typeof my ? "my" : "undefined" != typeof wx ? "wx" : null;
    }
});

"undefined" != typeof my && (_app.setRequire(), _app.setApi());