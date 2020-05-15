function HTMLParser(e, t) {
    function a(e, a) {
        if (a) {
            a = a.toLowerCase();
            for (r = i.length - 1; r >= 0 && i[r] != a; r--);
        } else var r = 0;
        if (r >= 0) {
            for (var s = i.length - 1; s >= r; s--) t.end && t.end(i[s]);
            i.length = r
        }
    }
    var r, s, n, i = [],
        l = e;
    for (i.last = function() {
        return this[this.length - 1]
    }; e;) {
        if (s = !0, i.last() && special[i.last()]) e = e.replace(new RegExp("([\\s\\S]*?)</" + i.last() + "[^>]*>"), function(e, a) {
            return a = a.replace(/<!--([\s\S]*?)-->|<!\[CDATA\[([\s\S]*?)]]>/g, "$1$2"), t.chars && t.chars(a), ""
        }), a(0, i.last());
        else if (0 == e.indexOf("\x3c!--") ? (r = e.indexOf("--\x3e")) >= 0 && (t.comment && t.comment(e.substring(4, r)), e = e.substring(r + 3), s = !1) : 0 == e.indexOf("</") ? (n = e.match(endTag)) && (e = e.substring(n[0].length), n[0].replace(endTag, a), s = !1) : 0 == e.indexOf("<") && (n = e.match(startTag)) && (e = e.substring(n[0].length), n[0].replace(startTag, function(e, r, s, n) {
            if (r = r.toLowerCase(), block[r]) for (; i.last() && inline[i.last()];) a(0, i.last());
            if (closeSelf[r] && i.last() == r && a(0, r), (n = empty[r] || !! n) || i.push(r), t.start) {
                var l = [];
                s.replace(attr, function(e, t) {
                    var a = arguments[2] ? arguments[2] : arguments[3] ? arguments[3] : arguments[4] ? arguments[4] : fillAttrs[t] ? t : "";
                    l.push({
                        name: t,
                        value: a,
                        escaped: a.replace(/(^|[^\\])"/g, '$1\\"')
                    })
                }), t.start && t.start(r, l, n)
            }
        }), s = !1), s) {
            r = e.indexOf("<");
            for (var o = ""; 0 === r;) o += "<", r = (e = e.substring(1)).indexOf("<");
            o += r < 0 ? e : e.substring(0, r), e = r < 0 ? "" : e.substring(r), t.chars && t.chars(o)
        }
        if (e == l) throw "Parse Error: " + e;
        l = e
    }
    a()
}
function makeMap(e) {
    for (var t = {}, a = e.split(","), r = 0; r < a.length; r++) t[a[r]] = !0;
    return t
}
var startTag = /^<([-A-Za-z0-9_]+)((?:\s+[a-zA-Z_:][-a-zA-Z0-9_:.]*(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/,
    endTag = /^<\/([-A-Za-z0-9_]+)[^>]*>/,
    attr = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g,
    empty = makeMap("area,base,basefont,br,col,frame,hr,img,input,link,meta,param,embed,command,keygen,source,track,wbr"),
    block = makeMap("a,address,code,article,applet,aside,audio,blockquote,button,canvas,center,dd,del,dir,div,dl,dt,fieldset,figcaption,figure,footer,form,frameset,h1,h2,h3,h4,h5,h6,header,hgroup,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,output,p,pre,section,script,table,tbody,td,tfoot,th,thead,tr,ul,video"),
    inline = makeMap("abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var"),
    closeSelf = makeMap("colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr"),
    fillAttrs = makeMap("checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected"),
    special = makeMap("wxxxcode-style,script,style,view,scroll-view,block");
module.exports = HTMLParser;