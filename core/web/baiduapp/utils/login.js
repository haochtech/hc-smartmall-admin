module.exports = function(e) {
    var t = getCurrentPages();
    if (t.length) {
        var o = t[t.length - 1];
        if (o && "pages/login/login" != o.route) if ("undefined" != typeof my) {
            var g = swan.getStorageSync("last_page_options"), n = {
                route: t[t.length - 1].route,
                options: g || {}
            };
            swan.setStorageSync("login_pre_page", n);
        } else swan.setStorageSync("login_pre_page", o);
    }
    swan.redirectTo({
        url: "/pages/login/login"
    });
};