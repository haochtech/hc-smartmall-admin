function objectToUrlParams(e, t) {
    var n = "";
    for (var o in e) n += "&" + o + "=" + (t ? encodeURIComponent(e[o]) : e[o]);
    return n.substr(1);
}

var hj = null;


module.exports = hj;