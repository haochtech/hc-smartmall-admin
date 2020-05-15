var api = require("../../api.js"),
    area_picker = require("../../area-picker/area-picker.js"),
    app = getApp();

Page({
    data: {
        name: "",
        mobile: "",
        details: "",
        district: null,
        customItem: '全部',
        regionData: [],
    },

    inputName: function (e) {
        this.setData({
            name: e.detail.value,
        });
    },
    inputMobile: function (e) {
        this.setData({
            mobile: e.detail.value,
        });
    },
    inputDetail: function (e) {
        this.setData({
            details: e.detail.value,
        });
    },

    regionChange: function (e) {
        this.setData({
            regionData: e.detail.value,
        });

        console.log('picker-time changed，值为', e.detail.value)
    },

    onLoad: function (a) {

        app.pageOnLoad(this, a);

        var t = this;
        t.getDistrictData(function (a) {
            area_picker.init({
                page: t,
                data: a
            });
        }), t.setData({
            address_id: a.id
        }), a.id && (swan.showLoading({
            title: "正在加载",
            mask: !0
        }), app.request({
            url: api.user.address_detail,
            data: {
                id: a.id
            },
            success: function (a) {
                swan.hideLoading(), 0 == a.code && t.setData(a.data);
            }
        }));
    },

    getDistrictData: function (t) {
        var i = swan.getStorageSync("district");
        console.log(i)

        if (!i) return
        swan.showLoading({
            title: "正在加载",
            mask: !0
        }),
            void app.request({
                url: api.default.district,
                success: function (a) {
                    console.log(a)
                    swan.hideLoading(), 0 == a.code && (i = a.data, swan.setStorageSync("district", i),
                        t(i));
                }
            });
        t(i);
    },


    onAreaPickerConfirm: function (a) {
        this.setData({
            district: {
                province: {
                    id: a[0].id,
                    name: a[0].name
                },
                city: {
                    id: a[1].id,
                    name: a[1].name
                },
                district: {
                    id: a[2].id,
                    name: a[2].name
                }
            }
        });
    },


    saveAddress: function () {
        var a = this;
        if (!/^([0-9]{6,12})$/.test(a.data.mobile) && !/^(\d{3,4}-\d{6,9})$/.test(a.data.mobile) && !/^\+?\d[\d -]{8,12}\d/.test(a.data.mobile)) return swan.showToast({
            title: "联系电话格式不正确",
            image: "/images/icon-warning.png"
        }), !1;

        swan.showLoading({
            title: "正在保存",
            mask: !0
        });
        var t = a.data.regionData;
        console.log(t)
        app.request({
            url: api.user.wechat_district,
            data: {
                //nationalCode: "510000",
                province_name: t[0],
                city_name: t[1],
                county_name: t[2]
            },
            success: function (res) {
                console.log(res);
                if(res.code!=0) {
                    swan.showToast({
                        title: res.msg,
                        image: "/images/icon-warning.png"
                    });
                    return false;
                }
                app.request({
                    url: api.user.address_save,
                    data: {
                        address_id: a.data.address_id || "",
                        name: a.data.name,
                        mobile: a.data.mobile,
                        province_id: res.data.district.province.id,
                        city_id: res.data.district.city.id,
                        district_id: res.data.district.district.id,
                        detail: a.data.details
                    },
                    success: function (a) {
                        swan.hideLoading(), 0 == a.code && swan.showModal({
                            title: "提示",
                            content: a.msg,
                            showCancel: !1,
                            success: function (a) {
                                a.confirm && swan.navigateBack();
                            }
                        }), 1 == a.code && swan.showToast({
                            title: a.msg,
                            image: "/images/icon-warning.png"
                        });
                    },

                });
            }
        })
    },
    // inputBlur: function (a) {
    //     var t = '{"' + a.currentTarget.dataset.name + '":"' + a.detail.value + '"}';
    //     this.setData(JSON.parse(t));
    // },


    getWechatAddress: function (a) {
        var i = this;
        swan.chooseAddress({
            success: function (t) {
                "chooseAddress:ok" == t.errMsg && (swan.showLoading(), app.request({
                    url: api.user.wechat_district,
                    data: {
                        national_code: t.nationalCode,
                        province_name: t.provinceName,
                        city_name: t.cityName,
                        county_name: t.countyName
                    },
                    success: function (a) {

                        1 == a.code && swan.showModal({
                            title: "提示",
                            content: a.msg,
                            showCancel: !1
                        }), i.setData({
                            name: t.userName || "",
                            mobile: t.telNumber || "",
                            detail: t.detailInfo || "",
                            district: a.data.district
                        });
                    },
                    complete: function () {
                        swan.hideLoading();
                    }
                }));
            }
        });
    },
    onReady: function () { },
    onShow: function () {
        app.pageOnShow(this);
    }
});