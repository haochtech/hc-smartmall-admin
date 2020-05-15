function makeMap(e) {
    for (var t = {}, r = e.split(","), s = 0; s < r.length; s++) t[r[s]] = !0;
    return t
}
function q(e) {
    return '"' + e + '"'
}
function removeDOCTYPE(e) {
    return e.replace(/<\?xml.*\?>\n/, "").replace(/<.*!doctype.*\>\n/, "").replace(/<.*!DOCTYPE.*\>\n/, "")
}


function html2json(e, t) {
    e = removeDOCTYPE(e), e = wxDiscode.strDiscode(e);
    var r = [],
        s = {
            node: t,
            nodes: [],
            images: [],
            imageUrls: []
        }, a = 0;
    return HTMLParser(e, {
        start: function(e, o, n) {
            var i = {
                node: "element",
                tag: e
            };
            if (0 === r.length ? (i.index = a.toString(), a += 1) : (void 0 === (u = r[0]).nodes && (u.nodes = []), i.index = u.index + "." + u.nodes.length), block[e] ? i.tagType = "block" : inline[e] ? i.tagType = "inline" : closeSelf[e] && (i.tagType = "closeSelf"), 0 !== o.length && (i.attr = o.reduce(function(e, t) {
                var r = t.name,
                    s = t.value;
                return "class" == r && (console.dir(s), i.classStr = s), "style" == r && (i.styleStr = s), s.match(/ /) && (s = s.split(" ")), e[r] ? Array.isArray(e[r]) ? e[r].push(s) : e[r] = [e[r], s] : e[r] = s, e
            }, {})), "img" === i.tag) {
               
                i.imgIndex = s.images.length, i.attr = i.attr || {};
                var l = i.attr.src || null;

                l && "" == l[0] && l.splice(0, 1), l = wxDiscode.urlToHttpUrl(l, __placeImgeUrlHttps),

                  console.log(l)
                  
                  var hj = l.replace("=webp&wxfrom=5&wx_lazy=1",'');
               
                  i.attr.src = hj,
               
                  i.from = t, s.images.push(i), 
                    s.imageUrls.push(hj)
            }



            if ("font" === i.tag) {
                var d = ["x-small", "small", "medium", "large", "x-large", "xx-large", "-webkit-xxx-large"],
                    c = {
                        color: "color",
                        face: "font-family",
                        size: "font-size"
                    };
                i.attr.style || (i.attr.style = []), i.styleStr || (i.styleStr = "");
                for (var m in c) if (i.attr[m]) {
                    var p = "size" === m ? d[i.attr[m] - 1] : i.attr[m];
                    i.attr.style.push(c[m]), i.attr.style.push(p), i.styleStr += c[m] + ": " + p + ";"
                }
            }
            if ("source" === i.tag && (s.source = i.attr.src), n) {
                var u = r[0] || s;
                void 0 === u.nodes && (u.nodes = []), u.nodes.push(i)
            } else r.unshift(i)
        },
        end: function(e) {
            var t = r.shift();
            if (t.tag !== e && console.error("invalid state: mismatch end tag"), "video" === t.tag && s.source && (t.attr.src = s.source, delete result.source), 0 === r.length) s.nodes.push(t);
            else {
                var a = r[0];
                void 0 === a.nodes && (a.nodes = []), a.nodes.push(t)
            }
        },
        chars: function(e) {
            var t = {
                node: "text",
                text: e,
                textArray: transEmojiStr(e)
            };
            if (0 === r.length) s.nodes.push(t);
            else {
                var a = r[0];
                void 0 === a.nodes && (a.nodes = []), t.index = a.index + "." + a.nodes.length, a.nodes.push(t)
            }
        },
        comment: function(e) {}
    }), s
}
function transEmojiStr(e) {
    var t = [];
    if (0 == __emojisReg.length || !__emojis) return (n = {}).node = "text", n.text = e, s = [n];
    e = e.replace(/\[([^\[\]]+)\]/g, ":$1:");
    for (var r = new RegExp("[:]"), s = e.split(r), a = 0; a < s.length; a++) {
        var o = s[a],
            n = {};
        __emojis[o] ? (n.node = "element", n.tag = "emoji", n.text = __emojis[o], n.baseSrc = __emojisBaseSrc) : (n.node = "text", n.text = o), t.push(n)
    }
    return t
}
function emojisInit() {
    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "",
        t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "/wxParse/emojis/",
        r = arguments[2];
    __emojisReg = e, __emojisBaseSrc = t, __emojis = r
}
var __placeImgeUrlHttps = "https",
    __emojisReg = "",
    __emojisBaseSrc = "",
    __emojis = {}, wxDiscode = require("./wxDiscode.js"),
    HTMLParser = require("./htmlparser.js"),
    empty = makeMap("area,base,basefont,br,col,frame,hr,img,input,link,meta,param,embed,command,keygen,source,track,wbr"),
    block = makeMap("br,a,code,address,article,applet,aside,audio,blockquote,button,canvas,center,dd,del,dir,div,dl,dt,fieldset,figcaption,figure,footer,form,frameset,h1,h2,h3,h4,h5,h6,header,hgroup,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,output,p,pre,section,script,table,tbody,td,tfoot,th,thead,tr,ul,video"),
    inline = makeMap("abbr,acronym,applet,b,basefont,bdo,big,button,cite,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var"),
    closeSelf = makeMap("colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr"),
    fillAttrs = makeMap("checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected"),
    special = makeMap("wxxxcode-style,script,style,view,scroll-view,block");
module.exports = {
    html2json: html2json,
    emojisInit: emojisInit
};