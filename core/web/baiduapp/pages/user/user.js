var api = require("../../api.js"), app = getApp();

Page({
    data: {
        contact_tel: "",
        show_customer_service: 0
    },
    onLoad: function(a) {
        app.pageOnLoad(this, a);
    },

    loadData: function(a) {
        var e = this;
        e.setData({
            store: swan.getStorageSync("store")
        }), 
      
        app.request({
            url: api.user.index,
            success: function(n) {
                console.log(n);
                swan.hideLoading();
                if (0 == n.code) {
                    if ("my" == e.data.__platform) n.data.menus.forEach(function(a, e, t) {
                        "bangding" === a.id && n.data.menus.splice(e, 1, 0);
                    });
                    e.setData(n.data), swan.setStorageSync("pages_user_user", n.data), swan.setStorageSync("share_setting", n.data.share_setting), 
                    swan.setStorageSync("user_info", n.data.user_info);
                } else if(-1 == n.code) {
                    swan.showModal({
                        title: '授权过期提示',
                        content: '会员授权信息已过期，请重新授权登录',
                        confirmText: '重新授权',
                        success: function(res) {
                            if(res.confirm) {
                                e.login();
                            }
                        }
                    });
                }
            }
        });
    },
    onReady: function() {},
    onShow: function() {
        app.pageOnShow(this);
        var e = this;
        var access_token = swan.getStorageSync('access_token');
        if(!access_token || access_token=='undefined') {
            e.login();
            return ;
        }
        swan.showLoading({
            title: '加载中..'
        });
        setTimeout(function(){
            e.loadData();
        },2000);
    },
    callTel: function(a) {
        var e = a.currentTarget.dataset.tel;
        swan.makePhoneCall({
            phoneNumber: e
        });
    },
    apply: function(e) {
        var t = swan.getStorageSync("share_setting"), n = swan.getStorageSync("user_info");
        1 == t.share_condition ? swan.navigateTo({
            url: "/pages/add-share/index"
        }) : 0 != t.share_condition && 2 != t.share_condition || (0 == n.is_distributor ? swan.showModal({
            title: "申请成为分销商",
            content: "是否申请？",
            success: function(a) {
                a.confirm && (swan.showLoading({
                    title: "正在加载",
                    mask: !0
                }), app.request({
                    url: api.share.join,
                    method: "POST",
                    data: {
                        form_id: e.detail.formId
                    },
                    success: function(a) {
                        0 == a.code && (0 == t.share_condition ? (n.is_distributor = 2, swan.navigateTo({
                            url: "/pages/add-share/index"
                        })) : (n.is_distributor = 1, swan.navigateTo({
                            url: "/pages/share/index"
                        })), swan.setStorageSync("user_info", n));
                    },
                    complete: function() {
                        swan.hideLoading();
                    }
                }));
            }
        }) : swan.navigateTo({
            url: "/pages/add-share/index"
        }));
    },
    verify: function(a) {
        swan.scanCode({
            onlyFromCamera: !1,
            success: function(a) {
                swan.navigateTo({
                    url: "/" + a.path
                });
            },
            fail: function(a) {
                swan.showToast({
                    title: "失败"
                });
            }
        });
    },
    member: function() {
        swan.navigateTo({
            url: "/pages/member/member"
        });
    },
    integral_mall: function(a) {
        var e, t;
        app.permission_list && app.permission_list.length && (e = app.permission_list, t = "integralmall", 
        -1 != ("," + e.join(",") + ",").indexOf("," + t + ",")) && swan.navigateTo({
            url: "/pages/integral-mall/index/index"
        });
    },

    // 授权
    login: function (n) {
        swan.showLoading({
            title: '登录中..'
        });
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
                            //o.getUserInfo(e.data.data.session_key);
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
            fail: function (e) {
                swan.showModal({
                    title: "提示",
                    content: '网络异常，请重新加载页面.',
                    showCancel: !1
                });
             }
        });
    },

    getUserInfo: function (session_key) {
        swan.getUserInfo({
            success: function (res) {
                console.log(res);
                swan.showModal({
                    title: "提示",
                    content: 'getUserInfo:success',
                    showCancel: !1
                });
                swan.request({
                    url: api.passport.login,
                    data: {
                        ciphertext: res.data,
                        iv: res.iv,
                        session_key: session_key,
                        user_info: res.userInfo,
                        openid: swan.getStorageSync('openid'),
                    },
                    success: function (e) {
                        swan.showModal({
                                title: "提示",
                                content: '3.'+e.data.code+',msg：'+e.data.msg,
                                showCancel: !1
                            });
                        console.log(e);    
                        if (0 == e.data.code) {
                            swan.setStorageSync("access_token", e.data.data.access_token);
                            swan.setStorageSync("user_info", e.data.data);
                            var t = swan.getStorageSync("login_pre_page");
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
                        } else swan.showModal({
                            title: "提示",
                            content: e.data.msg,
                            showCancel: !1
                        });
                    },
                    complete: function () {
                        swan.hideLoading();
                    }
                });
            }
        });
    },

    getauth: function (t) {
        var i = this;
        swan.authorize({
            scope: 'scope.userInfo',
            success: function (res) {
                // 用户已经同意智能小程序使用定位功能
                //console.log(res)
                i.getUserInfo(t);
            }
        });
    },
});