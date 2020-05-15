module.exports = function (o) {

    o.data || (o.data = {});

    // var a = swan.getStorageSync('access_token');

        o.data.access_token = swan.getStorageSync('access_token'),

        o.data._uniacid = this.siteInfo.uniacid,
        o.data._acid = this.siteInfo.acid,
        o.data._version = this._version,
        o.data._platform = "swan",
                        
        console.log(swan.getStorageSync('access_token')+'aaaa');

    swan.request({
        url: o.url,
        header: o.header || {
            "content-type": "application/x-www-form-urlencoded"
        },
        data: o.data || {},
        method: o.method || "GET",
        dataType: o.dataType || "json",
        success: function (a) {
            console.log(a)
            // if (-1 == a.data.code) {
            //     var e = getCurrentPages(), t = e[e.length - 1];
            //     t ? "pages/login/login" != t.route ? getApp().login() : console.log("Login Page Do Not Login") : getApp().login();
            // } else -2 == a.data.code ? swan.redirectTo({
            //     url: "/pages/store-disabled/store-disabled"
            // }) : o.success &&

            o.success(a.data);

        },

        fail: function (a) {

            console.warn("--- request fail >>>"),
                console.warn("--- " + o.url + " ---"),
                console.warn(a),
                console.warn("<<< request fail ---");
            var e = getApp();

            e.is_on_launch ? (e.is_on_launch = !1,

                swan.showModal({
                    title: "网络请求出错",
                    content: a.errMsg || "",
                    showCancel: !1,
                    success: function (a) {
                        a.confirm && o.fail && o.fail(a);
                    }
                })) : (swan.showToast({
                    title: a.errMsg,
                    image: "/images/icon-warning.png"
                }), o.fail && o.fail(a));
        },

        complete: function (e) {
            console.log(e)

            // if (200 != e.statusCode && e.data.code && 500 == e.data.code) {
            //     var a = e.data.data.message;
            //     swan.showModal({
            //         title: "系统错误",
            //         content: a + ";\r\n请将错误内容复制发送给我们，以便进行问题追踪。",
            //         cancelText: "关闭",
            //         confirmText: "复制",
            //         success: function (a) {
            //             a.confirm && swan.setClipboardData({
            //                 data: JSON.stringify({
            //                     data: e.data.data,
            //                     object: o
            //                 })
            //             });
            //         }
            //     });
            // }
            o.complete && o.complete(e);

        }
    });
};