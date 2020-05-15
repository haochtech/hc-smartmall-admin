var api = require("../../api.js"), app = getApp();

Page({
    data: {
        order: null,
        getGoodsTotalPrice: function() {
            return this.data.order.total_price;
        }
    },
    onLoad: function(t) {
        app.pageOnLoad(this, t);
        var a = this;
        a.setData({
            store: swan.getStorageSync("store")
        }), swan.showLoading({
            title: "正在加载"
        }), app.request({
            url: api.order.detail,
            data: {
                order_id: t.id
            },
            success: function(t) {
                0 == t.code && a.setData({
                    order: t.data
                });
            },
            complete: function() {
                swan.hideLoading();
            }
        });
    },
    copyText: function(t) {
        var a = t.currentTarget.dataset.text;
        swan.setClipboardData({
            data: a,
            success: function() {
                swan.showToast({
                    title: "已复制"
                });
            }
        });
    },
    location: function() {
        var t = this.data.order.shop;
        swan.openLocation({
            latitude: parseFloat(t.latitude),
            longitude: parseFloat(t.longitude),
            address: t.address,
            name: t.name
        });
    }
});