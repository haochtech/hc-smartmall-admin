var api = require("../../api.js"), app = getApp();

Page({
    data: {
        address_list: null
    },
    onLoad: function(a) {
        app.pageOnLoad(this, a);
    },
    onReady: function() {},
    onShow: function() {
        app.pageOnShow(this);
        var e = this;
        swan.showNavigationBarLoading(), app.request({
            url: api.user.address_list,
            success: function(a) {
                swan.hideNavigationBarLoading(), 0 == a.code && e.setData({
                    address_list: a.data.list
                });
            }
        });
    },
    pickAddress: function(a) {
        var e = a.currentTarget.dataset.index, s = this.data.address_list[e];
        swan.setStorageSync("picker_address", s), swan.navigateBack();
    },
    getWechatAddress: function(a) {
        swan.chooseAddress({
            success: function(a) {
                "chooseAddress:ok" == a.errMsg && (swan.showLoading(), app.request({
                    url: api.user.add_wechat_address,
                    method: "post",
                    data: {
                        national_code: a.nationalCode,
                        name: a.userName,
                        mobile: a.telNumber,
                        detail: a.detailInfo,
                        province_name: a.provinceName,
                        city_name: a.cityName,
                        county_name: a.countyName
                    },
                    success: function(a) {
                        1 != a.code ? 0 == a.code && (swan.setStorageSync("picker_address", a.data), swan.navigateBack()) : swan.showModal({
                            title: "提示",
                            content: a.msg,
                            showCancel: !1
                        });
                    },
                    complete: function() {
                        swan.hideLoading();
                    }
                }));
            }
        });
    }
});