if (window.dhx && (window.dhx_legacy = dhx, delete window.dhx),
	function(t, e) {
    	"object" == typeof exports && "object" == typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define([], e) : "object" == typeof exports ? exports.dhx = e() : t.dhx = e()
	}(window, function() {
    return n = {},
    o.m = i = [function(t, o, n) {
        "use strict";
        (function(t) {
            Object.defineProperty(o, "__esModule", {
                value: !0
            });
            var e = n(63);
            function i(i) {
                function e(t) {
                    var e = t.el.offsetHeight
                      , t = t.el.offsetWidth;
                    i(t, e)
                }
                var n = window.ResizeObserver;
                return n ? o.el("div.dhx-resize-observer", {
                    _hooks: {
                        didInsert: function(t) {
                            new n(function() {
                                return e(t)
                            }
                            ).observe(t.el)
                        }
                    }
                }) : o.el("iframe.dhx-resize-observer", {
                    _hooks: {
                        didInsert: function(t) {
                            t.el.contentWindow.onresize = function() {
                                return e(t)
                            }
                            ,
                            e(t)
                        }
                    }
                })
            }
            o.el = e.defineElement,
            o.sv = e.defineSvgElement,
            o.view = e.defineView,
            o.create = e.createView,
            o.inject = e.injectView,
            o.KEYED_LIST = e.KEYED_LIST,
            o.disableHelp = function() {
                e.DEVMODE.mutations = !1,
                e.DEVMODE.warnings = !1,
                e.DEVMODE.verbose = !1,
                e.DEVMODE.UNKEYED_INPUT = !1
            }
            ,
            o.resizer = i,
            o.resizeHandler = function(t, e) {
                return o.create({
                    render: function() {
                        return i(e)
                    }
                }).mount(t)
            }
            ,
            o.awaitRedraw = function() {
                return new t(function(t) {
                    requestAnimationFrame(function() {
                        t()
                    })
                }
                )
            }
        }
        ).call(this, n(6))
    }
    , function(t, e, i) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var n = i(2)
          , o = (new Date).valueOf();
        e.uid = function() {
            return "u" + o++
        }
        ,
        e.extend = function t(e, i, n) {
            if (void 0 === n && (n = !0),
            i)
                for (var o in i) {
                    var r = i[o]
                      , s = e[o];
                    void 0 === r ? delete e[o] : !n || "object" != typeof s || s instanceof Date || s instanceof Array ? e[o] = r : t(s, r)
                }
            return e
        }
        ,
        e.copy = function(t, e) {
            var i, n = {};
            for (i in t)
                e && i.startsWith("$") || (n[i] = t[i]);
            return n
        }
        ,
        e.naturalSort = function(t) {
            return t.sort(function(t, e) {
                return "string" == typeof t ? t.localeCompare(e) : t - e
            })
        }
        ,
        e.findIndex = function(t, e) {
            for (var i = t.length, n = 0; n < i; n++)
                if (e(t[n]))
                    return n;
            return -1
        }
        ,
        e.isEqualString = function(t, e) {
            if (t.length > e.length)
                return !1;
            for (var i = 0; i < t.length; i++)
                if (t[i].toLowerCase() !== e[i].toLowerCase())
                    return !1;
            return !0
        }
        ,
        e.singleOuterClick = function(e) {
            var i = function(t) {
                e(t) && document.removeEventListener("click", i)
            };
            document.addEventListener("click", i)
        }
        ,
        e.detectWidgetClick = function(e, i) {
            function t(t) {
                return i(n.locate(t, "dhx_widget_id") === e)
            }
            return document.addEventListener("click", t),
            function() {
                return document.removeEventListener("click", t)
            }
        }
        ,
        e.unwrapBox = function(t) {
            return Array.isArray(t) ? t[0] : t
        }
        ,
        e.wrapBox = function(t) {
            return Array.isArray(t) ? t : [t]
        }
        ,
        e.isDefined = function(t) {
            return null != t
        }
        ,
        e.range = function(t, e) {
            if (e < t)
                return [];
            for (var i = []; t <= e; )
                i.push(t++);
            return i
        }
        ,
        e.isNumeric = function(t) {
            return !isNaN(t - parseFloat(t))
        }
        ,
        e.downloadFile = function(t, e, i) {
            void 0 === i && (i = "text/plain");
            var n, o, i = new Blob([t],{
                type: i
            });
            window.navigator.msSaveOrOpenBlob ? window.navigator.msSaveOrOpenBlob(i, e) : (n = document.createElement("a"),
            o = URL.createObjectURL(i),
            n.href = o,
            n.download = e,
            document.body.appendChild(n),
            n.click(),
            setTimeout(function() {
                document.body.removeChild(n),
                window.URL.revokeObjectURL(o)
            }, 0))
        }
        ,
        e.debounce = function(o, r, s) {
            var a;
            return function() {
                for (var t = this, e = [], i = 0; i < arguments.length; i++)
                    e[i] = arguments[i];
                var n = s && !a;
                clearTimeout(a),
                a = setTimeout(function() {
                    a = null,
                    s || o.apply(t, e)
                }, r),
                n && o.apply(this, e)
            }
        }
        ,
        e.compare = function t(e, i) {
            for (var n in e) {
                if (e.hasOwnProperty(n) !== i.hasOwnProperty(n))
                    return !1;
                switch (typeof e[n]) {
                case "object":
                    if (!t(e[n], i[n]))
                        return !1;
                    break;
                case "function":
                    if (void 0 === i[n] || "compare" !== n && e[n].toString() !== i[n].toString())
                        return !1;
                    break;
                default:
                    if (e[n] !== i[n])
                        return !1
                }
            }
            for (var n in i)
                if (void 0 === e[n])
                    return !1;
            return !0
        }
        ,
        e.isType = function(t) {
            return ((Object.prototype.toString.call(t).match(/^\[object (\S+?)\]$/) || [])[1] || "undefined").toLowerCase()
        }
        ,
        e.isEmptyObj = function(t) {
            for (var e in t)
                return !1;
            return !0
        }
        ,
        e.sign = function(t) {
            return 0 === (t = +t) || isNaN(t) ? t : 0 < t ? 1 : -1
        }
    }
    , function(t, e, i) {
        "use strict";
        var c = this && this.__assign || function() {
            return (c = Object.assign || function(t) {
                for (var e, i = 1, n = arguments.length; i < n; i++)
                    for (var o in e = arguments[i])
                        Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
                return t
            }
            ).apply(this, arguments)
        }
        ;
        function n(t, e, i) {
            for (void 0 === e && (e = "dhx_id"),
            void 0 === i && (i = "target"),
            t instanceof Event && (t = t[i]); t; ) {
                if (t.getAttribute && t.getAttribute(e))
                    return t;
                t = t.parentNode
            }
        }
        Object.defineProperty(e, "__esModule", {
            value: !0
        }),
        e.toNode = function(t) {
            return "string" == typeof t ? document.getElementById(t) || document.querySelector(t) || document.body : t || document.body
        }
        ,
        e.eventHandler = function(s, a) {
            var l = Object.keys(a);
            return function(t) {
                for (var e = s(t), i = t.target; i; ) {
                    var n = i.getAttribute && i.getAttribute("class") || "";
                    if (n.length)
                        for (var o = n.split(" "), r = 0; r < l.length; r++)
                            if (o.includes(l[r]))
                                return a[l[r]](t, e);
                    i = i.parentNode
                }
                return !0
            }
        }
        ,
        e.locateNode = n,
        e.locate = function(t, e) {
            return void 0 === e && (e = "dhx_id"),
            (t = n(t, e)) ? t.getAttribute(e) : ""
        }
        ,
        e.locateNodeByClassName = function(t, e) {
            for (t instanceof Event && (t = t.target); t; ) {
                if (e) {
                    if (t.classList && t.classList.contains(e))
                        return t
                } else if (t.getAttribute && t.getAttribute("dhx_id"))
                    return t;
                t = t.parentNode
            }
        }
        ,
        e.getBox = function(t) {
            var e = t.getBoundingClientRect()
              , i = document.body
              , n = window.pageYOffset || i.scrollTop
              , t = window.pageXOffset || i.scrollLeft;
            return {
                top: e.top + n,
                left: e.left + t,
                right: i.offsetWidth - e.right,
                bottom: i.offsetHeight - e.bottom,
                width: e.right - e.left,
                height: e.bottom - e.top
            }
        }
        ;
        var o = -1;
        function r(t) {
            t = t.getBoundingClientRect();
            return {
                left: t.left + window.pageXOffset,
                right: t.right + window.pageXOffset,
                top: t.top + window.pageYOffset,
                bottom: t.bottom + window.pageYOffset
            }
        }
        function u() {
            return {
                rightBorder: window.pageXOffset + window.innerWidth,
                bottomBorder: window.pageYOffset + window.innerHeight
            }
        }
        function l(t, e) {
            var i, n, o, r = u(), s = r.rightBorder, a = r.bottomBorder - t.bottom - e.height, l = t.top - e.height;
            if ("bottom" === e.mode ? 0 <= a ? i = t.bottom : 0 <= l && (i = l) : 0 <= l ? i = l : 0 <= a && (i = t.bottom),
            a < 0 && l < 0) {
                if (e.auto)
                    return d(t, c(c({}, e), {
                        mode: "right",
                        auto: !1
                    }));
                i = l < a ? t.bottom : l
            }
            return {
                left: e.centering ? (n = t,
                o = e.width,
                r = s,
                a = (o - (n.right - n.left)) / 2,
                l = n.left - a,
                a = n.right + a,
                0 <= l && a <= r ? l : l < 0 ? 0 : r - o) : (s = s - t.left - e.width,
                e = t.right - e.width,
                0 <= s || !(0 <= e) && s < e ? t.left : e),
                top: i
            }
        }
        function d(t, e) {
            var i, n, o = u(), r = o.rightBorder, s = o.bottomBorder, a = r - t.right - e.width, o = t.left - e.width;
            if ("right" === e.mode ? 0 <= a ? n = t.right : 0 <= o && (n = o) : 0 <= o ? n = o : 0 <= a && (n = t.right),
            o < 0 && a < 0) {
                if (e.auto)
                    return l(t, c(c({}, e), {
                        mode: "bottom",
                        auto: !1
                    }));
                n = a < o ? o : t.right
            }
            return {
                left: n,
                top: e.centering ? (a = t,
                i = e.height,
                o = r,
                n = (i - (a.bottom - a.top)) / 2,
                r = a.top - n,
                n = a.bottom + n,
                0 <= r && n <= o ? r : r < 0 ? 0 : o - i) : (i = t.bottom - e.height,
                !(0 <= (e = s - t.top - e.height)) && (0 < i || e < i) ? i : t.top)
            }
        }
        function s(t, e) {
            var i = ("bottom" === e.mode || "top" === e.mode ? l : d)(t, e)
              , t = i.left
              , i = i.top;
            return {
                left: Math.round(t) + "px",
                top: Math.round(i) + "px",
                minWidth: Math.round(e.width) + "px",
                position: "absolute"
            }
        }
        e.getScrollbarWidth = function() {
            if (-1 < o)
                return o;
            var t = document.createElement("div");
            return document.body.appendChild(t),
            t.style.cssText = "position: absolute;left: -99999px;overflow:scroll;width: 100px;height: 100px;",
            o = t.offsetWidth - t.clientWidth,
            document.body.removeChild(t),
            o
        }
        ,
        e.isIE = function() {
            var t = window.navigator.userAgent;
            return t.includes("MSIE ") || t.includes("Trident/")
        }
        ,
        e.getRealPosition = r,
        e.calculatePosition = s,
        e.fitPosition = function(t, e) {
            return s(r(t), e)
        }
        ,
        e.getStrSize = function(t, e) {
            e = c({
                fontSize: "14px",
                fontFamily: "Arial",
                lineHeight: "14px",
                fontWeight: "normal",
                fontStyle: "normal"
            }, e);
            var i = document.createElement("span")
              , n = e.fontSize
              , o = e.fontFamily
              , r = e.lineHeight
              , s = e.fontWeight
              , e = e.fontStyle;
            return i.style.fontSize = n,
            i.style.fontFamily = o,
            i.style.lineHeight = r,
            i.style.fontWeight = s,
            i.style.fontStyle = e,
            i.style.display = "inline-flex",
            i.innerText = t,
            document.body.appendChild(i),
            e = i.offsetWidth,
            t = i.clientHeight,
            document.body.removeChild(i),
            {
                width: e,
                height: t
            }
        }
        ,
        e.getPageCss = function() {
            for (var t = [], e = 0; e < document.styleSheets.length; e++)
                for (var i = document.styleSheets[e], n = ("cssRules"in i ? i.cssRules : i.rules), o = 0; o < n.length; o++) {
                    var r = n[o];
                    "cssText"in r ? t.push(r.cssText) : t.push(r.selectorText + " {\n" + r.style.cssText + "\n}\n")
                }
            return t.join("\n")
        }
    }
    , function(t, i, e) {
        "use strict";
        function n(t) {
            for (var e in t)
                i.hasOwnProperty(e) || (i[e] = t[e])
        }
        Object.defineProperty(i, "__esModule", {
            value: !0
        }),
        n(e(4)),
        n(e(23)),
        n(e(50)),
        n(e(51)),
        n(e(10)),
        n(e(53)),
        n(e(7)),
        n(e(26)),
        n(e(25)),
        n(e(54)),
        n(e(24)),
        n(e(15))
    }
    , function(t, e, i) {
        "use strict";
        var n;
        Object.defineProperty(e, "__esModule", {
            value: !0
        }),
        (n = e.TreeFilterType || (e.TreeFilterType = {})).all = "all",
        n.level = "level",
        n.leafs = "leafs",
        (n = e.DataEvents || (e.DataEvents = {})).afterAdd = "afteradd",
        n.beforeAdd = "beforeadd",
        n.removeAll = "removeall",
        n.beforeRemove = "beforeremove",
        n.afterRemove = "afterremove",
        n.change = "change",
        n.load = "load",
        n.loadError = "loaderror",
        n.beforeLazyLoad = "beforelazyload",
        n.afterLazyLoad = "afterlazyload",
        (n = e.DragEvents || (e.DragEvents = {})).beforeDrag = "beforeDrag",
        n.dragStart = "dragStart",
        n.dragOut = "dragOut",
        n.dragIn = "dragIn",
        n.canDrop = "canDrop",
        n.cancelDrop = "cancelDrop",
        n.beforeDrop = "beforeDrop",
        n.afterDrop = "afterDrop",
        n.afterDrag = "afterDrag",
        (e = e.DataDriver || (e.DataDriver = {})).json = "json",
        e.csv = "csv",
        e.xml = "xml"
    }
    , function(t, e, i) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var n = (o.prototype.on = function(t, e, i) {
            t = t.toLowerCase();
            this.events[t] = this.events[t] || [],
            this.events[t].push({
                callback: e,
                context: i || this.context
            })
        }
        ,
        o.prototype.detach = function(t, e) {
            var t = t.toLowerCase()
              , i = this.events[t];
            if (e && i && i.length)
                for (var n = i.length - 1; 0 <= n; n--)
                    i[n].context === e && i.splice(n, 1);
            else
                this.events[t] = []
        }
        ,
        o.prototype.fire = function(t, e) {
            void 0 === e && (e = []);
            t = t.toLowerCase();
            return !this.events[t] || !this.events[t].map(function(t) {
                return t.callback.apply(t.context, e)
            }).includes(!1)
        }
        ,
        o.prototype.clear = function() {
            this.events = {}
        }
        ,
        o);
        function o(t) {
            this.events = {},
            this.context = t || this
        }
        e.EventSystem = n,
        e.EventsMixin = function(t) {
            var e = new n(t = t || {});
            t.detachEvent = e.detach.bind(e),
            t.attachEvent = e.on.bind(e),
            t.callEvent = e.fire.bind(e)
        }
    }
    , function(t, e, i) {
        (function(o, r) {
            !function() {
                var e = 1
                  , i = {}
                  , n = !1;
                function u(t) {
                    o.setImmediate ? r(t) : o.importScripts ? setTimeout(t) : (i[++e] = t,
                    o.postMessage(e, "*"))
                }
                function d(t) {
                    "use strict";
                    if ("function" != typeof t && null != t)
                        throw TypeError();
                    if ("object" != typeof this || this && this.then)
                        throw TypeError();
                    var e, i, n = this, r = 0, s = 0, o = [];
                    (n.promise = n).resolve = function(t) {
                        return e = n.fn,
                        i = n.er,
                        r || (s = t,
                        r = 1,
                        u(c)),
                        n
                    }
                    ,
                    n.reject = function(t) {
                        return e = n.fn,
                        i = n.er,
                        r || (s = t,
                        r = 2,
                        u(c)),
                        n
                    }
                    ,
                    n._d = 1,
                    n.then = function(t, e) {
                        if (1 != this._d)
                            throw TypeError();
                        var i = new d;
                        return i.fn = t,
                        i.er = e,
                        3 == r ? i.resolve(s) : 4 == r ? i.reject(s) : o.push(i),
                        i
                    }
                    ,
                    n.catch = function(t) {
                        return n.then(null, t)
                    }
                    ;
                    var a = function(t) {
                        r = t || 4,
                        o.map(function(t) {
                            3 == r && t.resolve(s) || t.reject(s)
                        })
                    };
                    try {
                        "function" == typeof t && t(n.resolve, n.reject)
                    } catch (t) {
                        n.reject(t)
                    }
                    return n;
                    function l(t, e, i, n) {
                        if (2 == r)
                            return n();
                        if ("object" != typeof s && "function" != typeof s || "function" != typeof t)
                            n();
                        else
                            try {
                                var o = 0;
                                t.call(s, function(t) {
                                    o++ || (s = t,
                                    e())
                                }, function(t) {
                                    o++ || (s = t,
                                    i())
                                })
                            } catch (t) {
                                s = t,
                                i()
                            }
                    }
                    function c() {
                        var t;
                        try {
                            t = s && s.then
                        } catch (t) {
                            return s = t,
                            r = 2,
                            c()
                        }
                        l(t, function() {
                            r = 1,
                            c()
                        }, function() {
                            r = 2,
                            c()
                        }, function() {
                            try {
                                1 == r && "function" == typeof e ? s = e(s) : 2 == r && "function" == typeof i && (s = i(s),
                                r = 1)
                            } catch (t) {
                                return s = t,
                                a()
                            }
                            s == n ? (s = TypeError(),
                            a()) : l(t, function() {
                                a(3)
                            }, a, function() {
                                a(1 == r && 3)
                            })
                        })
                    }
                }
                (o = this).setImmediate || o.addEventListener("message", function(t) {
                    if (t.source == o)
                        if (n)
                            u(i[t.data]);
                        else {
                            n = !0;
                            try {
                                i[t.data]()
                            } catch (t) {}
                            delete i[t.data],
                            n = !1
                        }
                }),
                d.resolve = function(e) {
                    if (1 != this._d)
                        throw TypeError();
                    return e instanceof d ? e : new d(function(t) {
                        t(e)
                    }
                    )
                }
                ,
                d.reject = function(i) {
                    if (1 != this._d)
                        throw TypeError();
                    return new d(function(t, e) {
                        e(i)
                    }
                    )
                }
                ,
                d.all = function(n) {
                    if (1 != this._d)
                        throw TypeError();
                    if (!(n instanceof Array))
                        return d.reject(TypeError());
                    var o = new d;
                    return function i(t, e) {
                        return e ? o.resolve(e) : t ? o.reject(t) : (0 == n.reduce(function(t, e) {
                            return e && e.then ? t + 1 : t
                        }, 0) && o.resolve(n),
                        void n.map(function(t, e) {
                            t && t.then && t.then(function(t) {
                                return n[e] = t,
                                i(),
                                t
                            }, i)
                        }))
                    }(),
                    o
                }
                ,
                d.race = function(n) {
                    if (1 != this._d)
                        throw TypeError();
                    if (!(n instanceof Array))
                        return d.reject(TypeError());
                    if (0 == n.length)
                        return new d;
                    var o = new d;
                    return function i(t, e) {
                        return e ? o.resolve(e) : t ? o.reject(t) : (0 == n.reduce(function(t, e) {
                            return e && e.then ? t + 1 : t
                        }, 0) && o.resolve(n),
                        void n.map(function(t, e) {
                            t && t.then && t.then(function(t) {
                                i(null, t)
                            }, i)
                        }))
                    }(),
                    o
                }
                ,
                d._d = 1,
                t.exports = d
            }()
        }
        ).call(this, i(14), i(44).setImmediate)
    }
    , function(t, e, i) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var n = i(10)
          , o = i(24);
        e.isEqualObj = function(t, e) {
            for (var i in t)
                if (t[i] !== e[i])
                    return !1;
            return !0
        }
        ,
        e.naturalCompare = function(t, e) {
            if (isNaN(t) || isNaN(e)) {
                var n = []
                  , o = [];
                for (t.replace(/(\d+)|(\D+)/g, function(t, e, i) {
                    n.push([e || 1 / 0, i || ""])
                }),
                e.replace(/(\d+)|(\D+)/g, function(t, e, i) {
                    o.push([e || 1 / 0, i || ""])
                }); n.length && o.length; ) {
                    var i = n.shift()
                      , r = o.shift()
                      , r = i[0] - r[0] || i[1].localeCompare(r[1]);
                    if (r)
                        return r
                }
                return n.length - o.length
            }
            return t - e
        }
        ,
        e.findByConf = function(t, e) {
            if ("function" == typeof e) {
                if (e.call(this, t))
                    return t
            } else if (e.by && e.match && t[e.by] === e.match)
                return t
        }
        ,
        e.isDebug = function() {
            var t = window.dhx;
            if (void 0 !== t)
                return void 0 !== t.debug && t.debug
        }
        ,
        e.dhxWarning = function(t) {
            console.warn(t)
        }
        ,
        e.dhxError = function(t) {
            throw new Error(t)
        }
        ,
        e.toProxy = function(t) {
            var e = typeof t;
            return "string" == e ? new n.DataProxy(t) : "object" == e ? t : void 0
        }
        ,
        e.toDataDriver = function(t) {
            if ("string" == typeof t) {
                var e = window.dhx
                  , e = e && e.dataDrivers || o.dataDrivers;
                if (e[t])
                    return new e[t];
                console.warn("Incorrect data driver type:", t),
                console.warn("Available types:", JSON.stringify(Object.keys(e)))
            } else if ("object" == typeof t)
                return t
        }
        ,
        e.copyWithoutInner = function(t, e) {
            var i, n = {};
            for (i in t)
                i.startsWith("$") || e && e[i] || (n[i] = t[i]);
            return n
        }
        ,
        e.isTreeCollection = function(t) {
            return Boolean(t.getRoot)
        }
        ,
        e.hasJsonOrArrayStructure = function(t) {
            if ("object" == typeof t)
                return !0;
            if ("string" != typeof t)
                return !1;
            try {
                var e = JSON.parse(t);
                return "[object Object]" === Object.prototype.toString.call(e) || Array.isArray(e)
            } catch (t) {
                return !1
            }
        }
    }
    , function(t, e, i) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var n = i(1)
          , o = i(2)
          , i = (r.prototype.mount = function(t, e) {
            e && (this._view = e),
            t && this._view && this._view.mount && (this._container = o.toNode(t),
            this._container.tagName ? this._view.mount(this._container) : this._container.attach && this._container.attach(this))
        }
        ,
        r.prototype.unmount = function() {
            var t = this.getRootView();
            t && t.node && (t.unmount(),
            this._view = null)
        }
        ,
        r.prototype.getRootView = function() {
            return this._view
        }
        ,
        r.prototype.getRootNode = function() {
            return this._view && this._view.node && this._view.node.el
        }
        ,
        r.prototype.paint = function() {
            this._view && (this._view.node || this._container) && (this._doNotRepaint = !1,
            this._view.redraw())
        }
        ,
        r);
        function r(t, e) {
            this._uid = n.uid(),
            this.config = e || {}
        }
        e.View = i,
        e.toViewLike = function(e) {
            return {
                getRootView: function() {
                    return e
                },
                paint: function() {
                    return e.node && e.redraw()
                },
                mount: function(t) {
                    return e.mount(t)
                }
            }
        }
    }
    , function(t, e, i) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        e.default = {
            dragAndDrop: "파일이나 폴더를",
            or: " ",
            grid: "그리드 형태로 표시",
            list: "리스트 형태로 표시",
            browse: "파일 탐색창 열기",
            filesOrFoldersHere: "여기에 끌어 오시기 바랍니다.",
            cancel: "취소",
            clearAll: "전체 파일 삭제",
            clearAllSelected: "선택된 파일 삭제",
            clear: "삭제",
            add: "파일 추가",
            upload: "업로드",
            download: "다운로드",
            error: "에러",
            byte: "B",
            kilobyte: "KB",
            megabyte: "MB",
            gigabyte: "GB"
        }
    }
    , function(t, e, i) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var n = i(15)
          , i = (o.prototype.updateUrl = function(t, e) {
            for (var i in void 0 === e && (e = {}),
            this._url = this.url = t || this._url,
            this.url += "?",
            e)
                this.config[i] = e[i],
                this.url += i + "=" + encodeURIComponent(e[i]) + "&";
            this.url = this.url.slice(0, -1)
        }
        ,
        o.prototype.load = function() {
            return n.ajax.get(this.url, null, {
                responseType: "text"
            })
        }
        ,
        o.prototype.save = function(t, e) {
            switch (e) {
            case "delete":
                return n.ajax.delete(this.url, t);
            case "update":
            case "insert":
            default:
                return n.ajax.post(this.url, t)
            }
        }
        ,
        o);
        function o(t, e) {
            this.url = this._url = t,
            this.config = e
        }
        e.DataProxy = i
    }
    , function(t, e, i) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var a = i(0);
        e.getCount = function(t, e, i) {
            var n = {
                danger: " dhx_navbar-count--color_danger",
                secondary: " dhx_navbar-count--color_secondary",
                primary: " dhx_navbar-count--color_primary",
                success: " dhx_navbar-count--color_success"
            }[t.countColor] || " dhx_navbar-count--color_danger";
            return a.el(".dhx_navbar-count", {
                class: e + n + (!i && 99 < parseInt(t.count, 10) ? " dhx_navbar-count--overlimit" : "")
            }, i && 99 < parseInt(t.count, 10) ? "99+" : t.count)
        }
        ,
        e.getIcon = function(t, e) {
            return void 0 === t && (t = ""),
            t.startsWith("dxi") && (t = "dxi " + t),
            a.el("span", {
                class: "dhx_" + e + "__icon " + t
            })
        }
        ;
        e.navbarComponentMixin = function(t, e, i, n) {
            var o, r, s = (o = t,
            s = r = "",
            s = (r = i ? "dhx_menu-item" : "dhx_" + o + "__item") + ((i = e).css ? " " + i.css : ""),
            "spacer" !== i.type && "separator" !== i.type || (s += " " + r + "--" + i.type),
            "button" !== i.type || "sidebar" !== o || i.icon || (s += " dhx_navbar-item--colapse_hidden"),
            s), t = "ribbon" === t && ("navItem" === e.type || "imageButton" === e.type);
            return a.el("li", {
                _key: e.id,
                class: s + (e.icon && !e.value && t ? " dhx_ribbon__item--icon" : "") + (e.src && !e.value && t ? " dhx_ribbon__item--icon" : "") + (e.size && t ? " dhx_ribbon__item--" + e.size : ""),
                ".innerHTML": "customHTML" === e.type ? e.html : void 0,
                dhx_id: "customHTML" === e.type ? e.id : void 0
            }, "customHTML" !== e.type ? [n] : void 0)
        }
        ,
        e.getNavbarButtonCSS = function(t, e) {
            var i = t.color
              , n = t.size
              , o = t.view
              , r = t.full
              , s = t.icon
              , a = t.circle
              , l = t.loading
              , c = t.value
              , t = t.active;
            return ({
                danger: " dhx_button--color_danger",
                secondary: " dhx_button--color_secondary",
                primary: " dhx_button--color_primary",
                success: " dhx_button--color_success"
            }[i] || " dhx_button--color_primary") + ({
                small: " dhx_button--size_small",
                medium: " dhx_button--size_medium"
            }[n] || " dhx_button--size_medium") + ({
                flat: " dhx_button--view_flat",
                link: " dhx_button--view_link"
            }[o] || " dhx_button--view_flat") + (r ? " dhx_button--width_full" : "") + (a ? " dhx_button--circle" : "") + (l ? " dhx_button--loading" : "") + (t ? " dhx_button--active" : "") + (s && !c ? " dhx_button--icon" : "")
        }
    }
    , function(t, e, i) {
        "use strict";
        var n;
        Object.defineProperty(e, "__esModule", {
            value: !0
        }),
        (n = e.UploaderEvents || (e.UploaderEvents = {})).uploadBegin = "uploadbegin",
        n.beforeUploadFile = "beforeuploadfile",
        n.uploadFile = "uploadfile",
        n.uploadFail = "uploadfail",
        n.uploadComplete = "uploadcomplete",
        n.uploadProgress = "uploadprogress",
        (e.ProgressBarEvents || (e.ProgressBarEvents = {})).cancel = "cancel",
        (n = e.FileStatus || (e.FileStatus = {})).queue = "queue",
        n.uploaded = "uploaded",
        n.failed = "failed",
        n.inprogress = "inprogress",
        (e = e.VaultMode || (e.VaultMode = {})).grid = "grid",
        e.list = "list"
    }
    , function(t, e, i) {
        "use strict";
        var n;
        Object.defineProperty(e, "__esModule", {
            value: !0
        }),
        (n = e.LayoutEvents || (e.LayoutEvents = {})).beforeShow = "beforeShow",
        n.afterShow = "afterShow",
        n.beforeHide = "beforeHide",
        n.afterHide = "afterHide",
        n.beforeResizeStart = "beforeResizeStart",
        n.resize = "resize",
        n.afterResizeEnd = "afterResizeEnd",
        n.beforeAdd = "beforeAdd",
        n.afterAdd = "afterAdd",
        n.beforeRemove = "beforeRemove",
        n.afterRemove = "afterRemove",
        n.beforeCollapse = "beforeCollapse",
        n.afterCollapse = "afterCollapse",
        n.beforeExpand = "beforeExpand",
        n.afterExpand = "afterExpand",
        (e = e.resizeMode || (e.resizeMode = {}))[e.unknown = 0] = "unknown",
        e[e.percents = 1] = "percents",
        e[e.pixels = 2] = "pixels",
        e[e.mixedpx1 = 3] = "mixedpx1",
        e[e.mixedpx2 = 4] = "mixedpx2",
        e[e.mixedperc1 = 5] = "mixedperc1",
        e[e.mixedperc2 = 6] = "mixedperc2"
    }
    , function(t, e) {
        var i = function() {
            return this
        }();
        try {
            i = i || new Function("return this")()
        } catch (t) {
            "object" == typeof window && (i = window)
        }
        t.exports = i
    }
    , function(t, e, i) {
        "use strict";
        (function(c) {
            Object.defineProperty(e, "__esModule", {
                value: !0
            });
            var u = i(4)
              , d = i(7);
            function h(t) {
                return t ? t.includes("json") ? "json" : t.includes("xml") ? "xml" : "text" : "text"
            }
            function n(o, r, s, t, a) {
                var n, l = t || {};
                return a && (l.Accept = "application/" + a),
                "GET" !== s && (l["Content-Type"] = l["Content-Type"] || "application/json"),
                "GET" === s && ((t = r && "object" == typeof r ? (n = r,
                Object.keys(n).reduce(function(t, e) {
                    var i = "object" == typeof n[e] ? JSON.stringify(n[e]) : n[e];
                    return t.push(e + "=" + encodeURIComponent(i)),
                    t
                }, []).join("&")) : r && "string" == typeof r ? r : "") && (o += o.includes("?") ? "&" : "?",
                o += t),
                r = null),
                window.fetch ? window.fetch(o, {
                    method: s,
                    body: r ? JSON.stringify(r) : null,
                    headers: l
                }).then(function(e) {
                    if (!e.ok)
                        return e.text().then(function(t) {
                            return c.reject({
                                status: e.status,
                                statusText: e.statusText,
                                message: t
                            })
                        });
                    var t = a || h(e.headers.get("Content-Type"));
                    if ("raw" === t)
                        return {
                            headers: Object.fromEntries(e.headers.entries()),
                            url: e.url,
                            body: e.body
                        };
                    if (204 !== e.status)
                        switch (t) {
                        case "json":
                            return e.json();
                        case "xml":
                            var i = d.toDataDriver(u.DataDriver.xml);
                            return i ? e.text().then(function(t) {
                                return i.toJsonObject(t)
                            }) : e.text();
                        default:
                            return e.text()
                        }
                }) : new c(function(t, e) {
                    var i, n = new XMLHttpRequest;
                    for (i in n.onload = function() {
                        200 <= n.status && n.status < 300 ? ("raw" === a && t({
                            url: n.responseURL,
                            headers: n.getAllResponseHeaders().trim().split(/[\r\n]+/).reduce(function(t, e) {
                                e = e.split(": ");
                                return t[e[0]] = e[1],
                                t
                            }, {}),
                            body: n.response
                        }),
                        204 === n.status ? t() : t(function(t, e) {
                            switch (e) {
                            case "json":
                                return JSON.parse(t);
                            case "text":
                                return t;
                            case "xml":
                                e = d.toDataDriver(u.DataDriver.xml);
                                return e ? e.toJsonObject(t) : {
                                    parseError: "Incorrect data driver type: 'xml'"
                                };
                            default:
                                return t
                            }
                        }(n.responseText, a || h(n.getResponseHeader("Content-Type"))))) : e({
                            status: n.status,
                            statusText: n.statusText
                        })
                    }
                    ,
                    n.onerror = function() {
                        e({
                            status: n.status,
                            statusText: n.statusText,
                            message: n.responseText
                        })
                    }
                    ,
                    n.open(s, o),
                    l)
                        n.setRequestHeader(i, l[i]);
                    switch (s) {
                    case "POST":
                    case "DELETE":
                    case "PUT":
                        n.send(void 0 !== r ? JSON.stringify(r) : "");
                        break;
                    case "GET":
                    default:
                        n.send()
                    }
                }
                )
            }
            e.ajax = {
                get: function(t, e, i) {
                    return n(t, e, "GET", i && i.headers, void 0 !== i ? i.responseType : void 0)
                },
                post: function(t, e, i) {
                    return n(t, e, "POST", i && i.headers, void 0 !== i ? i.responseType : void 0)
                },
                put: function(t, e, i) {
                    return n(t, e, "PUT", i && i.headers, void 0 !== i ? i.responseType : void 0)
                },
                delete: function(t, e, i) {
                    return n(t, e, "DELETE", i && i.headers, void 0 !== i ? i.responseType : void 0)
                }
            }
        }
        ).call(this, i(6))
    }
    , function(t, i, e) {
        "use strict";
        function n(t) {
            for (var e in t)
                i.hasOwnProperty(e) || (i[e] = t[e])
        }
        Object.defineProperty(i, "__esModule", {
            value: !0
        }),
        n(e(55)),
        n(e(56)),
        n(e(57)),
        n(e(58)),
        n(e(17))
    }
    , function(t, e, i) {
        "use strict";
        var n;
        Object.defineProperty(e, "__esModule", {
            value: !0
        }),
        (n = e.RealPosition || (e.RealPosition = {})).left = "left",
        n.right = "right",
        n.top = "top",
        n.bottom = "bottom",
        n.center = "center",
        (n = e.Position || (e.Position = {})).right = "right",
        n.bottom = "bottom",
        n.center = "center",
        (e = e.MessageContainerPosition || (e.MessageContainerPosition = {})).topLeft = "top-left",
        e.topRight = "top-right",
        e.bottomLeft = "bottom-left",
        e.bottomRight = "bottom-right"
    }
    , function(t, o, e) {
        "use strict";
        Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var s = e(2);
        function a(t) {
            for (var e = t.toLowerCase().match(/\w+/g), i = 0, n = "", o = 0; o < e.length; o++) {
                var r = e[o];
                "ctrl" === r ? i += 4 : "shift" === r ? i += 2 : "alt" === r ? i += 1 : n = r
            }
            return i + n
        }
        i.prototype.addHotKey = function(t, e, i) {
            t = a(t);
            this._keysStorage[t] || (this._keysStorage[t] = []),
            this._keysStorage[t].push({
                handler: e,
                scope: i
            })
        }
        ,
        i.prototype.removeHotKey = function(t, e) {
            var i = this._keysStorage;
            if (t && delete i[n = a(t)],
            e)
                for (var n in i) {
                    for (var o = [], r = 0; r < i[n].length; r++)
                        i[n][r].scope === e && o.push(r);
                    if (i[n].length === o.length)
                        delete i[n];
                    else
                        for (r = o.length - 1; 0 <= r; r--)
                            i[n].splice(o[r], 1)
                }
        }
        ,
        i.prototype.exist = function(t) {
            t = a(t);
            return !!this._keysStorage[t]
        }
        ,
        e = i;
        function i() {
            var r = this;
            this._keysStorage = {},
            document.addEventListener("keydown", function(t) {
                var e = (t.ctrlKey || t.metaKey ? 4 : 0) + (t.shiftKey ? 2 : 0) + (t.altKey ? 1 : 0)
                  , i = 48 <= t.which && t.which <= 57 || 65 <= t.which && t.which <= 90 ? String.fromCharCode(t.which) : 32 !== t.which || s.isIE() ? t.key : t.code
                  , i = e + (i && i.toLowerCase())
                  , n = r._keysStorage[i];
                if (n)
                    for (var o = 0; o < n.length; o++)
                        n[o].handler(t)
            })
        }
        o.keyManager = new e,
        o.addHotkeys = function(t, i) {
            var e, n = new Date;
            for (e in t)
                o.keyManager.addHotKey(e, function(e) {
                    return function(t) {
                        i && !1 === i() || e(t)
                    }
                }(t[e]), n);
            return function() {
                return o.keyManager.removeHotKey(void 0, n)
            }
        }
    }
    , function(t, e, i) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        i = i(3);
        e.DataEvents = i.DataEvents,
        (e = e.NavigationBarEvents || (e.NavigationBarEvents = {})).inputCreated = "inputCreated",
        e.click = "click",
        e.openMenu = "openmenu",
        e.beforeHide = "beforeHide",
        e.afterHide = "afterHide",
        e.inputFocus = "inputfocus",
        e.inputBlur = "inputblur"
    }
    , function(t, e, i) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        }),
        (e = e.ListEvents || (e.ListEvents = {})).click = "click",
        e.doubleClick = "doubleclick",
        e.focusChange = "focuschange",
        e.beforeEditStart = "beforeEditStart",
        e.afterEditStart = "afterEditStart",
        e.beforeEditEnd = "beforeEditEnd",
        e.afterEditEnd = "afterEditEnd",
        e.itemRightClick = "itemRightClick",
        e.itemMouseOver = "itemMouseOver",
        e.contextmenu = "contextmenu"
    }
    , function(t, e, i) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        }),
        (e = e.DataViewEvents || (e.DataViewEvents = {})).click = "click",
        e.doubleClick = "doubleclick",
        e.focusChange = "focuschange",
        e.beforeEditStart = "beforeEditStart",
        e.afterEditStart = "afterEditStart",
        e.beforeEditEnd = "beforeEditEnd",
        e.afterEditEnd = "afterEditEnd",
        e.itemRightClick = "itemRightClick",
        e.itemMouseOver = "itemMouseOver",
        e.contextmenu = "contextmenu"
    }
    , function(t, e, i) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var n = i(1)
          , i = (o.prototype.update = function() {
            this._styleCont.innerHTML !== this._generateCss() && (document.head.appendChild(this._styleCont),
            this._styleCont.innerHTML = this._generateCss())
        }
        ,
        o.prototype.remove = function(t) {
            delete this._classes[t],
            this.update()
        }
        ,
        o.prototype.add = function(t, e, i) {
            void 0 === i && (i = !1);
            var n = this._toCssString(t)
              , t = this._findSameClassId(n);
            return t && e && e !== t ? (this._classes[e] = this._classes[t],
            e) : t || this._addNewClass(n, e, i)
        }
        ,
        o.prototype.get = function(t) {
            if (this._classes[t]) {
                for (var e = {}, i = 0, n = this._classes[t].split(";"); i < n.length; i++) {
                    var o = n[i];
                    o && (e[(o = o.split(":"))[0]] = o[1])
                }
                return e
            }
            return null
        }
        ,
        o.prototype._findSameClassId = function(t) {
            for (var e in this._classes)
                if (t === this._classes[e])
                    return e;
            return null
        }
        ,
        o.prototype._addNewClass = function(t, e, i) {
            e = e || "dhx_generated_class_" + n.uid();
            return this._classes[e] = t, i || this.update(), e;
        	//return "";
        }
        ,
        o.prototype._toCssString = function(t) {
            var e, i = "";
            for (e in t) {
                var n = t[e];
                i += e.replace(/[A-Z]{1}/g, function(t) {
                    return "-" + t.toLowerCase()
                }) + ":" + n + ";"
            }
            return i
        }
        ,
        o.prototype._generateCss = function() {
            var t, e = "";
            for (t in this._classes) {
                e += "." + t + "{" + this._classes[t] + "}\n"
            }
            return e
        }
        ,
        o);
        function o() {
            this._classes = {};
            var t = document.createElement("style");
            t.id = "dhx_generated_styles",
            this._styleCont = document.head.appendChild(t)
        }
        e.CssManager = i,
        e.cssManager = new i
    }
    , function(t, e, i) {
        "use strict";
        var s = this && this.__assign || function() {
            return (s = Object.assign || function(t) {
                for (var e, i = 1, n = arguments.length; i < n; i++)
                    for (var o in e = arguments[i])
                        Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
                return t
            }
            ).apply(this, arguments)
        }
        ;
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var n = i(5)
          , o = i(43)
          , r = i(49)
          , a = i(10)
          , l = i(7)
          , c = i(4)
          , p = i(1)
          , i = (u.prototype.add = function(t, i) {
            var n = this;
            if (this.events.fire(c.DataEvents.beforeAdd, [t]))
                return Array.isArray(t) ? t.map(function(t, e) {
                    return 0 !== e && (i += 1),
                    n._add(t, i)
                }) : this._add(t, i)
        }
        ,
        u.prototype.remove = function(t) {
            var e = this;
            t && (t instanceof Array ? t.map(function(t) {
                e._remove(t)
            }) : this._remove(t))
        }
        ,
        u.prototype.removeAll = function() {
            this._removeAll(),
            this.events.fire(c.DataEvents.removeAll),
            this.events.fire(c.DataEvents.change)
        }
        ,
        u.prototype.exists = function(t) {
            return !!this._pull[t]
        }
        ,
        u.prototype.getNearId = function(t) {
            if (!this._pull[t])
                return this._order[0].id || ""
        }
        ,
        u.prototype.getItem = function(t) {
            return this._pull[t]
        }
        ,
        u.prototype.update = function(t, e, i) {
            var n = this.getItem(t);
            n ? l.isEqualObj(e, n) || (e.id && t !== e.id ? (l.dhxWarning("this method doesn't allow change id"),
            l.isDebug()) : (e.parent && n.parent && e.parent !== n.parent && this.move(t, -1, this, e.parent),
            p.extend(this._pull[t], e, !1),
            this.config.update && this.config.update(this._pull[t]),
            i || this._onChange("update", t, this._pull[t]))) : l.dhxWarning("item not found")
        }
        ,
        u.prototype.getIndex = function(e) {
            if (!e)
                return -1;
            var t = p.findIndex(this._order, function(t) {
                return t.id.toString() === e.toString()
            });
            return this._pull[e] && 0 <= t ? t : void 0
        }
        ,
        u.prototype.getId = function(t) {
            if (this._order[t])
                return this._order[t].id
        }
        ,
        u.prototype.getLength = function() {
            return this._order.length
        }
        ,
        u.prototype.isDataLoaded = function(t, e) {
            return void 0 === t && (t = 0),
            void 0 === e && (e = this._order.length),
            p.isNumeric(t) && p.isNumeric(e) ? 0 === this._order.slice(t, e).filter(function(t) {
                return t.$empty
            }).length : !this.find(function(t) {
                return t.$empty
            })
        }
        ,
        u.prototype.filter = function(t, e) {
            this.isDataLoaded() ? ((e = p.extend({
                add: !1,
                multiple: !0
            }, e)).add || (this._order = this._initOrder || this._order,
            this._initOrder = null),
            this._filters = this._filters || {},
            e.multiple && t || (this._filters = {}),
            t && ("function" == typeof t ? this._filters._ = {
                match: "_",
                compare: t
            } : t.match ? (t.compare = t.compare || function(t, e) {
                return t === e
            }
            ,
            this._filters[t.by] = t) : delete this._filters[t.by],
            this._applyFilters()),
            this.events.fire(c.DataEvents.change)) : l.dhxWarning("the method doesn't work with lazyLoad")
        }
        ,
        u.prototype.find = function(t) {
            for (var e in this._pull) {
                var i = l.findByConf(this._pull[e], t);
                if (i)
                    return i
            }
            return null
        }
        ,
        u.prototype.findAll = function(t) {
            var e, i = [];
            for (e in this._pull) {
                var n = l.findByConf(this._pull[e], t);
                n && i.push(n)
            }
            return i
        }
        ,
        u.prototype.sort = function(t) {
            if (this.isDataLoaded()) {
                if (t)
                    this._sort.sort(this._order, t),
                    this._initOrder && this._initOrder.length && this._sort.sort(this._initOrder, t);
                else {
                    for (var e in this._order = [],
                    this._pull)
                        this._order.push(this._pull[e]);
                    this._applyFilters()
                }
                this.events.fire(c.DataEvents.change)
            } else
                l.dhxWarning("the method doesn't work with lazyLoad")
        }
        ,
        u.prototype.copy = function(t, i, n, o) {
            var r = this;
            return t instanceof Array ? t.map(function(t, e) {
                return r._copy(t, i, n, o, e)
            }) : this._copy(t, i, n, o)
        }
        ,
        u.prototype.move = function(t, i, n, o) {
            var r = this;
            return t instanceof Array ? t.map(function(t, e) {
                return r._move(t, i, n, o, e)
            }) : this._move(t, i, n, o)
        }
        ,
        u.prototype.forEach = function(t) {
            for (var e = 0; e < this._order.length; e++)
                t.call(this, this._order[e], e, this._order)
        }
        ,
        u.prototype.load = function(t, e) {
            return "string" == typeof t && (this.dataProxy = t = new a.DataProxy(t)),
            this.dataProxy = t,
            this._loader.load(t, e)
        }
        ,
        u.prototype.parse = function(t, e) {
            return this._removeAll(),
            this._loader.parse(t, e)
        }
        ,
        u.prototype.$parse = function(t) {
            var e = this.config.approximate;
            e && (t = this._approximate(t, e.value, e.maxNum)),
            this._parse_data(t),
            this.events.fire(c.DataEvents.change, ["load"]),
            this.events.fire(c.DataEvents.load)
        }
        ,
        u.prototype.save = function(t) {
            this._loader.save(t)
        }
        ,
        u.prototype.changeId = function(t, e, i) {
            var n;
            void 0 === e && (e = p.uid()),
            i || this.isDataLoaded() ? (n = this.getItem(t)) ? (n.id = e,
            p.extend(this._pull[t], n),
            this._pull[e] = this._pull[t],
            i || this._onChange("update", e, this._pull[e]),
            delete this._pull[t]) : l.dhxWarning("item not found") : l.dhxWarning("the method doesn't work with lazyLoad")
        }
        ,
        u.prototype.isSaved = function() {
            return !this._changes.order.length
        }
        ,
        u.prototype.map = function(t) {
            for (var e = [], i = 0; i < this._order.length; i++)
                e.push(t.call(this, this._order[i], i, this._order));
            return e
        }
        ,
        u.prototype.mapRange = function(t, e, i) {
            t < 0 && (t = 0),
            e > this._order.length - 1 && (e = this._order.length - 1);
            for (var n = this._order.slice(t, e), o = [], r = t; r <= e; r++)
                o.push(i.call(this, this._order[r], r, n));
            return o
        }
        ,
        u.prototype.reduce = function(t, e) {
            for (var i = 0; i < this._order.length; i++)
                e = t.call(this, e, this._order[i], i);
            return e
        }
        ,
        u.prototype.serialize = function(t) {
            void 0 === t && (t = c.DataDriver.json);
            var e = this.map(function(t) {
                var e = s({}, t);
                return Object.keys(e).forEach(function(t) {
                    t.startsWith("$") && delete e[t]
                }),
                e
            })
              , t = l.toDataDriver(t);
            if (t)
                return t.serialize(e)
        }
        ,
        u.prototype.getInitialData = function() {
            return this._initOrder
        }
        ,
        u.prototype._add = function(t, e) {
            if (this.isDataLoaded()) {
                e = this._addCore(t, e);
                return this._onChange("add", t.id, t),
                this.events.fire(c.DataEvents.afterAdd, [t]),
                e
            }
            l.dhxWarning("the method doesn't work with lazyLoad")
        }
        ,
        u.prototype._remove = function(t) {
            if (this.isDataLoaded()) {
                var e = this._pull[t];
                if (e) {
                    if (!this.events.fire(c.DataEvents.beforeRemove, [e]))
                        return;
                    this._removeCore(e.id),
                    this._onChange("remove", t, e)
                }
                this.events.fire(c.DataEvents.afterRemove, [e])
            } else
                l.dhxWarning("the method doesn't work with lazyLoad")
        }
        ,
        u.prototype._copy = function(t, e, i, n, o) {
            if (this.isDataLoaded()) {
                if (!this.exists(t))
                    return null;
                var r = p.uid();
                return (o && (e = -1 === e ? -1 : e + o),
                i) ? i instanceof u || !n ? i.exists(t) ? (i.add(s(s({}, l.copyWithoutInner(this.getItem(t))), {
                    id: r
                }), e),
                r) : (i.add(l.copyWithoutInner(this.getItem(t)), e),
                t) : void i.add(l.copyWithoutInner(this.getItem(t)), e) : (this.add(s(s({}, l.copyWithoutInner(this.getItem(t))), {
                    id: r
                }), e),
                r)
            }
            l.dhxWarning("the method doesn't work with lazyLoad")
        }
        ,
        u.prototype._move = function(t, e, i, n, o) {
            if (this.isDataLoaded()) {
                if (o && (e = -1 === e ? -1 : e + o),
                i && i !== this && this.exists(t)) {
                    var r = p.copy(this.getItem(t), !0);
                    return i.exists(t) && (r.id = p.uid()),
                    n && (r.parent = n),
                    i.add(r, e),
                    this.remove(t),
                    r.id
                }
                if (this.getIndex(t) === e)
                    return null;
                r = this._order.splice(this.getIndex(t), 1)[0];
                return -1 === e && (e = this._order.length),
                this._order.splice(e, 0, r),
                this.events.fire(c.DataEvents.change, [t, "update", this.getItem(t)]),
                t
            }
            l.dhxWarning("the method doesn't work with lazyLoad")
        }
        ,
        u.prototype._removeAll = function() {
            this._pull = {},
            this._order = [],
            this._changes.order = [],
            this._initOrder = null
        }
        ,
        u.prototype._addCore = function(t, e) {
            return this.config.init && (t = this.config.init(t)),
            t.id = t.id ? t.id.toString() : p.uid(),
            this._pull[t.id] && console.log("Item already exist"), // l.dhxError("Item already exist"),
            this._initOrder && this._initOrder.length && this._addToOrder(this._initOrder, t, e),
            this._addToOrder(this._order, t, e),
            t.id
        }
        ,
        u.prototype._removeCore = function(e) {
            0 <= this.getIndex(e) && (this._order = this._order.filter(function(t) {
                return t.id !== e
            }),
            delete this._pull[e]),
            this._initOrder && this._initOrder.length && (this._initOrder = this._initOrder.filter(function(t) {
                return t.id !== e
            }))
        }
        ,
        u.prototype._parse_data = function(t) {
            var e = this._order.length;
            this.config.prep && (t = this.config.prep(t));
            for (var i = 0, n = t; i < n.length; i++) {
                var o = n[i];
                this.config.init && (o = this.config.init(o)),
                o.id = o.id || 0 === o.id ? o.id : p.uid(),
                this._pull[o.id] = o,
                this._order[e++] = o
            }
        }
        ,
        u.prototype._approximate = function(t, e, i) {
            for (var n = t.length, o = e.length, r = Math.floor(n / i), s = Array(Math.ceil(n / r)), a = 0, l = 0; l < n; l += r) {
                for (var c = p.copy(t[l]), u = Math.min(n, l + r), d = 0; d < o; d++) {
                    for (var h = 0, f = l; f < u; f++)
                        h += t[f][e[d]];
                    c[e[d]] = h / (u - l)
                }
                s[a++] = c
            }
            return s
        }
        ,
        u.prototype._onChange = function(t, e, i) {
            for (var n = 0, o = this._changes.order; n < o.length; n++) {
                var r = o[n];
                if (r.id === e && !r.saving)
                    return r.error && (r.error = !1),
                    r = s(s({}, r), {
                        obj: i,
                        status: t
                    }),
                    void this.events.fire(c.DataEvents.change, [e, t, i])
            }
            this._changes.order.push({
                id: e,
                status: t,
                obj: s({}, i),
                saving: !1
            }),
            this.events.fire(c.DataEvents.change, [e, t, i])
        }
        ,
        u.prototype._addToOrder = function(t, e, i) {
            0 <= i && t[i] ? (this._pull[e.id] = e,
            t.splice(i, 0, e)) : (this._pull[e.id] = e,
            t.push(e))
        }
        ,
        u.prototype._applyFilters = function() {
            var t, i = this;
            this._filters && Object.keys(this._filters).length && (t = this._order.filter(function(e) {
                return Object.keys(i._filters).every(function(t) {
                    return e[t] ? i._filters[t].compare(e[t], i._filters[t].match, e) : i._filters[t].compare(e)
                })
            }),
            this._initOrder || (this._initOrder = this._order),
            this._order = t)
        }
        ,
        u);
        function u(t, e) {
            this.config = t || {},
            this._order = [],
            this._pull = {},
            this._changes = {
                order: []
            },
            this._initOrder = null,
            this._sort = new r.Sort,
            this._loader = new o.Loader(this,this._changes),
            this.events = e || new n.EventSystem(this),
            this.events.on(c.DataEvents.loadError, function(t) {
                "string" != typeof t ? l.dhxError(t) : l.dhxWarning(t)
            })
        }
        e.DataCollection = i
    }
    , function(t, e, i) {
        "use strict";
        var n = this && this.__assign || function() {
            return (n = Object.assign || function(t) {
                for (var e, i = 1, n = arguments.length; i < n; i++)
                    for (var o in e = arguments[i])
                        Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
                return t
            }
            ).apply(this, arguments)
        }
        ;
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var o = i(25)
          , r = i(26)
          , i = i(47);
        e.dataDrivers = {
            json: o.JsonDriver,
            csv: r.CsvDriver
        },
        e.dataDriversPro = n(n({}, e.dataDrivers), {
            xml: i.XMLDriver
        })
    }
    , function(t, e, i) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var n = (o.prototype.toJsonArray = function(t) {
            return this.getRows(t)
        }
        ,
        o.prototype.serialize = function(t) {
            return t
        }
        ,
        o.prototype.getFields = function(t) {
            return t
        }
        ,
        o.prototype.getRows = function(t) {
            return "string" == typeof t ? JSON.parse(t) : t
        }
        ,
        o);
        function o() {}
        e.JsonDriver = n
    }
    , function(t, e, i) {
        "use strict";
        var n = this && this.__assign || function() {
            return (n = Object.assign || function(t) {
                for (var e, i = 1, n = arguments.length; i < n; i++)
                    for (var o in e = arguments[i])
                        Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
                return t
            }
            ).apply(this, arguments)
        }
        ;
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var o = (r.prototype.getFields = function(t, e) {
            for (var i = t.trim().split(this.config.columnDelimiter), n = {}, o = 0; o < i.length; o++)
                n[e ? e[o] : o + 1] = isNaN(Number(i[o])) ? i[o] : parseFloat(i[o]);
            return n
        }
        ,
        r.prototype.getRows = function(t) {
            return t.trim().split(this.config.rowDelimiter)
        }
        ,
        r.prototype.toJsonArray = function(t) {
            var e = this
              , i = this.getRows(t)
              , n = this.config.names;
            return this.config.skipHeader && (t = i.splice(0, this.config.skipHeader),
            this.config.nameByHeader && (n = t[0].trim().split(this.config.columnDelimiter))),
            i.map(function(t) {
                return e.getFields(t, n)
            })
        }
        ,
        r.prototype.serialize = function(t, e) {
            var i = t[0] ? Object.keys(t[0]).filter(function(t) {
                return !t.startsWith("$")
            }).join(this.config.columnDelimiter) : ""
              , t = this._serialize(t);
            return e ? t : i + t
        }
        ,
        r.prototype._serialize = function(t) {
            var o = this;
            return t.reduce(function(t, n) {
                var e = Object.keys(n).reduce(function(t, e, i) {
                    return e.startsWith("$") || "items" === e ? t : "" + t + n[e] + (i === n.length - 1 ? "" : o.config.columnDelimiter)
                }, "");
                return n.items ? t + (t ? "\n" : "") + e + o._serialize(n.items) : "" + t + (t ? o.config.rowDelimiter : "") + e
            }, "")
        }
        ,
        r);
        function r(t) {
            this.config = n(n({}, {
                skipHeader: 0,
                nameByHeader: !1,
                rowDelimiter: "\n",
                columnDelimiter: ","
            }), t),
            this.config.nameByHeader && (this.config.skipHeader = 1)
        }
        e.CsvDriver = o
    }
    , function(t, e, i) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        }),
        (e = e.SelectionEvents || (e.SelectionEvents = {})).beforeUnSelect = "beforeunselect",
        e.afterUnSelect = "afterunselect",
        e.beforeSelect = "beforeselect",
        e.afterSelect = "afterselect",
        e.beforeEnable = "beforeEnable",
        e.beforeDisable = "beforeDisable",
        e.afterEnable = "afterEnable",
        e.afterDisable = "afterDisable"
    }
    , function(t, e, i) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        e.default = {
            apply: "apply",
            reject: "reject"
        }
    }
    , function(t, e, i) {
        "use strict";
        function n(t) {
            var e = document.activeElement;
            e.classList.contains("dhx_alert__confirm-reject") || e.classList.contains("dhx_alert__confirm-aply") || t.preventDefault()
        }
        Object.defineProperty(e, "__esModule", {
            value: !0
        }),
        e.blockScreen = function(t) {
            var e = document.createElement("div");
            return e.className = "dhx_alert__overlay " + (t || ""),
            document.body.appendChild(e),
            document.addEventListener("keydown", n),
            function() {
                document.body.removeChild(e),
                document.removeEventListener("keydown", n)
            }
        }
    }
    , function(t, i, e) {
        "use strict";
        function n(t) {
            for (var e in t)
                i.hasOwnProperty(e) || (i[e] = t[e])
        }
        Object.defineProperty(i, "__esModule", {
            value: !0
        }),
        n(e(67)),
        n(e(68)),
        n(e(19))
    }
    , function(t, e, i) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var n = i(9)
          , o = ["byte", "kilobyte", "megabyte", "gigabyte"];
        e.getBasis = function(t, e) {
            return void 0 === t && (t = 0),
            void 0 === e && (e = 0),
            t < 1024 ? t + " " + n.default[o[e]] : this.getBasis(Math.round(t / 1024), e + 1)
        }
        ;
        var r;
        function s(t) {
            return {
                extension: t.name.split(".").pop() || "none",
                mime: t.file ? t.file.type : ""
            }
        }
        function a(t, e) {
            switch (t) {
            case "jpg":
            case "jpeg":
            case "gif":
            case "png":
            case "bmp":
            case "tiff":
            case "pcx":
            case "svg":
            case "ico":
                return r.image;
            case "avi":
            case "mpg":
            case "mpeg":
            case "rm":
            case "move":
            case "mov":
            case "mkv":
            case "flv":
            case "f4v":
            case "mp4":
            case "3gp":
            case "wmv":
            case "webm":
            case "vob":
                return r.video;
            case "rar":
            case "zip":
            case "tar":
            case "tgz":
            case "arj":
            case "gzip":
            case "bzip2":
            case "7z":
            case "ace":
            case "apk":
            case "deb":
            case "zipx":
            case "cab":
            case "tar-gz":
            case "rpm":
            case "xar":
                return r.archive;
            case "xlr":
            case "xls":
            case "xlsm":
            case "xlsx":
            case "ods":
            case "csv":
            case "tsv":
                return r.table;
            case "doc":
            case "docx":
            case "docm":
            case "dot":
            case "dotx":
            case "odt":
            case "wpd":
            case "wps":
            case "pages":
                return r.document;
            case "wav":
            case "aiff":
            case "au":
            case "mp3":
            case "aac":
            case "wma":
            case "ogg":
            case "flac":
            case "ape":
            case "wv":
            case "m4a":
            case "mid":
            case "midi":
                return r.audio;
            case "pot":
            case "potm":
            case "potx":
            case "pps":
            case "ppsm":
            case "ppsx":
            case "ppt":
            case "pptx":
            case "pptm":
            case "odp":
                return r.presentation;
            case "html":
            case "htm":
            case "eml":
                return r.web;
            case "exe":
                return r.application;
            case "dmg":
                return r.apple;
            case "pdf":
            case "ps":
            case "eps":
                return r.pdf;
            case "psd":
                return r.psd;
            case "txt":
            case "djvu":
            case "nfo":
            case "xml":
                return r.text;
            default:
                switch (e.split("/")[0]) {
                case "image":
                    return r.image;
                case "audio":
                    return r.audio;
                case "video":
                    return r.video;
                default:
                    return r.other
                }
            }
        }
        e.truncateWord = function(t, e) {
            if (void 0 === e && (e = 13),
            t.length <= e)
                return t;
            var i, n = t.lastIndexOf(".");
            return (-1 === n ? (i = t.substr(t.length - 4),
            t.substr(0, e - 7)) : (n = n - 3,
            i = t.substr(n),
            t.substr(0, e - (t.length - n)))) + "..." + i
        }
        ,
        e.calculateCover = function(t) {
            var e, i, n, o = t.width, r = t.height, o = 1 < (t = o / r) ? (e = i = r,
            n = (o - i) / 2,
            0) : t < 1 ? (n = 0,
            (r - (e = i = o)) / 2) : (i = e = o,
            n = 0);
            return {
                sx: n,
                sy: o,
                sWidth: i,
                sHeight: e,
                dx: 0,
                dy: 0
            }
        }
        ,
        (i = r = e.FileType || (e.FileType = {})).image = "image",
        i.video = "video",
        i.archive = "archive",
        i.table = "table",
        i.document = "document",
        i.presentation = "presentation",
        i.application = "application",
        i.web = "web",
        i.apple = "apple",
        i.pdf = "pdf",
        i.psd = "psd",
        i.audio = "audio",
        i.other = "other",
        i.text = "text",
        e.getFileType = a,
        e.getFileClassName = function(t) {
            var e = s(t)
              , t = e.mime;
            return a(e = e.extension, t) + " extension-" + e
        }
        ,
        e.isImage = function(t) {
            var e = s(t)
              , t = e.mime;
            return a(e.extension, t) === r.image
        }
        ,
        e.removeItem = function(t, e) {
            t.exists(e) && (t.update(e, {
                $toRemove: !0
            }),
            setTimeout(function() {
                t.update(e, {
                    $toRemove: !1
                }, !0),
                t.remove(e)
            }, 200))
        }
    }
    , function(t, i, e) {
        "use strict";
        function n(t) {
            for (var e in t)
                i.hasOwnProperty(e) || (i[e] = t[e])
        }
        Object.defineProperty(i, "__esModule", {
            value: !0
        }),
        n(e(85)),
        n(e(33)),
        n(e(20))
    }
    , function(t, e, i) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var s = i(27)
          , n = i(3)
          , i = (o.prototype.getId = function() {
            return this.config.multiselection ? this._selected : this._selected[0]
        }
        ,
        o.prototype.getItem = function() {
            var e = this;
            if (this._selected.length) {
                var t = this._selected.map(function(t) {
                    return e._data.getItem(t)
                });
                return this.config.multiselection ? t : t[0]
            }
            return null
        }
        ,
        o.prototype.contains = function(t) {
            if (!this._disable)
                return t ? this._selected.includes(t) : 0 < this._selected.length
        }
        ,
        o.prototype.remove = function(t) {
            var e = this;
            if (!this._disable)
                return t ? this._unselectItem(t) : (this._selected.forEach(function(t) {
                    return e._unselectItem(t)
                }),
                !0)
        }
        ,
        o.prototype.add = function(t, e, i, n) {
            var o, r = this.config.multiselection;
            this._disable || !this._data.exists(t) || !r && this._selected.includes(t) || (r || this.remove(),
            o = n ? null : !this.events.fire(s.SelectionEvents.beforeSelect, [t]),
            !this._selected.includes(t) && o || (r ? this._addMulti(t, e, i, n) : this._addSingle(t, e, n)))
        }
        ,
        o.prototype.enable = function() {
            this.events.fire(s.SelectionEvents.beforeEnable, []) && (this._disable = !1,
            this.events.fire(s.SelectionEvents.afterEnable, []))
        }
        ,
        o.prototype.disable = function() {
            this.events.fire(s.SelectionEvents.beforeDisable, []) && (this.remove(),
            this._disable = !0,
            this.events.fire(s.SelectionEvents.afterDisable, []))
        }
        ,
        o.prototype.isDisabled = function() {
            return this._disable
        }
        ,
        o.prototype._addMulti = function(t, e, i, n) {
            var o = this._data.getIndex(t);
            "click" !== this.config.multiselection && !0 !== this.config.multiselection || (i ? (this._addWithShift(o),
            this.events.fire(s.SelectionEvents.afterSelect, [t])) : (this._isSelected(t) ? this._unselectItem(t) : this._selectItem(t, n),
            this._lastSelectedIndex = this._data.getIndex(this._selected[this._selected.length - 1]),
            this._lastShiftSelectedIndexes = [])),
            "ctrlClick" === this.config.multiselection && (i || e || (this.remove(),
            this._isSelected(t) ? this._unselectItem(t) : this._selectItem(t, n),
            this._lastSelectedIndex = this._data.getIndex(this._selected[this._selected.length - 1]),
            this._lastShiftSelectedIndexes = []),
            i && (this._addWithShift(o),
            this.events.fire(s.SelectionEvents.afterSelect, [t])),
            e && (this._isSelected(t) ? this._unselectItem(t) : this._selectItem(t, n),
            this._lastSelectedIndex = this._data.getIndex(this._selected[this._selected.length - 1]),
            this._lastShiftSelectedIndexes = []))
        }
        ,
        o.prototype._addWithShift = function(i) {
            var n = this;
            i >= this._lastSelectedIndex && (this._data.map(function(t, e) {
                n._lastShiftSelectedIndexes.includes(e) && (t.$selected = !1,
                n._selected = n._selected.filter(function(t) {
                    return t !== n._data.getId(e)
                }),
                n._lastShiftSelectedIndexes = n._lastShiftSelectedIndexes.filter(function(t) {
                    return t !== e && t !== n._lastSelectedIndex
                }))
            }),
            this._data.map(function(t, e) {
                e >= n._lastSelectedIndex && e <= i && (t.$selected = !0,
                n._selected.includes(t.id) || n._selected.push(t.id),
                e !== n._lastSelectedIndex && (n._lastShiftSelectedIndexes.includes(e) || n._lastShiftSelectedIndexes.push(e)))
            })),
            i <= this._lastSelectedIndex && (this._data.map(function(t, e) {
                n._lastShiftSelectedIndexes.includes(e) && (t.$selected = !1,
                n._selected = n._selected.filter(function(t) {
                    return t !== n._data.getId(e)
                }),
                n._lastShiftSelectedIndexes = n._lastShiftSelectedIndexes.filter(function(t) {
                    return t !== e && t !== n._lastSelectedIndex
                }))
            }),
            this._data.map(function(t, e) {
                e <= n._lastSelectedIndex && i <= e && (t.$selected = !0,
                n._selected.includes(t.id) || n._selected.push(t.id),
                e !== n._lastSelectedIndex && (n._lastShiftSelectedIndexes.includes(e) || n._lastShiftSelectedIndexes.push(e)))
            }))
        }
        ,
        o.prototype._addSingle = function(t, e, i) {
            this.remove(),
            (this.config && "ctrlClick" !== this.config.multiselection || e) && this._selectItem(t, i)
        }
        ,
        o.prototype._isSelected = function(t) {
            return this._selected.includes(t)
        }
        ,
        o.prototype._selectItem = function(t, e) {
            this._selected.push(t),
            this._data.update(t, {
                $selected: !0
            }, e),
            this._lastSelectedIndex = this._data.getIndex(t),
            e || this.events.fire(s.SelectionEvents.afterSelect, [t])
        }
        ,
        o.prototype._unselectItem = function(e) {
            return !!this.events.fire(s.SelectionEvents.beforeUnSelect, [e]) && (this._selected = this._selected.filter(function(t) {
                return t !== e
            }),
            this.events.fire(s.SelectionEvents.afterUnSelect, [e]),
            this._data.exists(e) && this._data.update(e, {
                $selected: !1
            }),
            !0)
        }
        ,
        o);
        function o(t, e) {
            var i = this;
            this._disable = !1,
            this.config = t,
            this.events = e.events,
            this._data = e,
            this._disable = this.config.disable,
            this._selected = [],
            this._lastShiftSelectedIndexes = [],
            this._data.events.on(n.DataEvents.removeAll, function() {
                i._selected = []
            }),
            "string" == typeof this.config.multiselection && (["click", "ctrlClick"].includes(this.config.multiselection) || (this.config.multiselection = !1)),
            this._data.events.on(n.DataEvents.afterRemove, function(t) {
                i.remove(t && t.id),
                i.config.multiselection && 0 !== i.getId().length ? i._lastSelectedIndex = i._data.getIndex(i._selected[i._selected.length - 1]) : (t = i._data.getId(i._lastSelectedIndex)) && t === i._selected[0] ? i.add(t) : t || i._data.getLength() - i._lastSelectedIndex != 0 ? t && !i._selected.length && i.add(t) : (t = i._data.getId(i._data.getLength() - 1)) && i.add(t)
            })
        }
        e.Selection = i
    }
    , function(t, e, i) {
        i(35),
        i(36),
        i(37),
        i(38),
        i(39),
        t.exports = i(41)
    }
    , function(t, e) {
        Object.values = Object.values ? Object.values : function(e) {
            var t = Object.prototype.toString.call(e);
            if (null == e)
                throw new TypeError("Cannot convert undefined or null to object");
            if (~["[object String]", "[object Object]", "[object Array]", "[object Function]"].indexOf(t)) {
                if (Object.keys)
                    return Object.keys(e).map(function(t) {
                        return e[t]
                    });
                var i, n = [];
                for (i in e)
                    e.hasOwnProperty(i) && n.push(e[i]);
                return n
            }
            return []
        }
    }
    , function(t, e) {
        Array.prototype.includes || Object.defineProperty(Array.prototype, "includes", {
            value: function(t, e) {
                if (null == this)
                    throw new TypeError('"this" is null or not defined');
                var i = Object(this)
                  , n = i.length >>> 0;
                if (0 == n)
                    return !1;
                var o, r, e = 0 | e, s = Math.max(0 <= e ? e : n - Math.abs(e), 0);
                for (; s < n; ) {
                    if ((o = i[s]) === (r = t) || "number" == typeof o && "number" == typeof r && isNaN(o) && isNaN(r))
                        return !0;
                    s++
                }
                return !1
            },
            configurable: !0,
            writable: !0
        }),
        Array.prototype.find || Object.defineProperty(Array.prototype, "find", {
            value: function(t) {
                if (null == this)
                    throw new TypeError('"this" is null or not defined');
                var e = Object(this)
                  , i = e.length >>> 0;
                if ("function" != typeof t)
                    throw new TypeError("predicate must be a function");
                for (var n = arguments[1], o = 0; o < i; ) {
                    var r = e[o];
                    if (t.call(n, r, o, e))
                        return r;
                    o++
                }
            },
            configurable: !0,
            writable: !0
        }),
        Array.prototype.findIndex || (Array.prototype.findIndex = function(t) {
            if (null == this)
                throw new TypeError("Array.prototype.findIndex called on null or undefined");
            if ("function" != typeof t)
                throw new TypeError("predicate must be a function");
            for (var e, i = Object(this), n = i.length >>> 0, o = arguments[1], r = 0; r < n; r++)
                if (e = i[r],
                t.call(o, e, r, i))
                    return r;
            return -1
        }
        )
    }
    , function(t, e) {
        String.prototype.includes || (String.prototype.includes = function(t, e) {
            "use strict";
            return "number" != typeof e && (e = 0),
            !(e + t.length > this.length) && -1 !== this.indexOf(t, e)
        }
        ),
        String.prototype.startsWith || Object.defineProperty(String.prototype, "startsWith", {
            enumerable: !1,
            configurable: !0,
            writable: !0,
            value: function(t, e) {
                return e = e || 0,
                this.indexOf(t, e) === e
            }
        }),
        String.prototype.padStart || (String.prototype.padStart = function(t, e) {
            return t >>= 0,
            e = String(e || " "),
            this.length > t ? String(this) : ((t -= this.length) > e.length && (e += e.repeat(t / e.length)),
            e.slice(0, t) + String(this))
        }
        )
    }
    , function(t, e) {
        var i;
        Element && !Element.prototype.matches && ((i = Element.prototype).matches = i.matchesSelector || i.mozMatchesSelector || i.msMatchesSelector || i.oMatchesSelector || i.webkitMatchesSelector),
        "classList"in SVGElement.prototype || Object.defineProperty(SVGElement.prototype, "classList", {
            get: function() {
                var i = this;
                return {
                    contains: function(t) {
                        return -1 !== i.className.baseVal.split(" ").indexOf(t)
                    },
                    add: function(t) {
                        return i.setAttribute("class", i.getAttribute("class") + " " + t)
                    },
                    remove: function(t) {
                        var e = i.getAttribute("class").replace(new RegExp("(\\s|^)".concat(t, "(\\s|$)"),"g"), "$2");
                        i.classList.contains(t) && i.setAttribute("class", e)
                    },
                    toggle: function(t) {
                        this.contains(t) ? this.remove(t) : this.add(t)
                    }
                }
            },
            configurable: !0
        })
    }
    , function(t, e, i) {
        "use strict";
        i.r(e);
        var o = i(22)
          , e = i(40)
          , r = ["aG9zdG5hbWU=", "aW5jbHVkZXM=", "ZGh0bWx4LmNvbQ==", "ZGh0bWx4LnJ1", "ZGh0bWx4Y29kZS5jb20=", "d2ViaXhjb2RlLmNvbQ==", "b25sb2Fk", "Y3JlYXRlRWxlbWVudA==", "ZGl2", "YWRkRXZlbnRMaXN0ZW5lcg==", "Y2xpY2s=", "Ym9keQ==", "cmVtb3ZlQ2hpbGQ=", "b3Blbg==", "aHR0cHM6Ly9kaHRtbHguY29tL2RvY3MvcHJvZHVjdHMvZGh0bWx4VmF1bHQvZG93bmxvYWQuc2h0bWw=", "X2JsYW5r", "ZGlzcGxheQ==", "YmxvY2sgIWltcG9ydGFudA==", "YmFja2dyb3VuZA==", "I2ZmNTI1MiAhaW1wb3J0YW50", "Y29sb3I=", "d2hpdGUgIWltcG9ydGFudA==", "cGFkZGluZw==", "MTJweA==", "cG9zaXRpb24=", "YWJzb2x1dGUgIWltcG9ydGFudA==", "bWF4V2lkdGg=", "MjYwcHg=", "dG9w", "MiUgIWltcG9ydGFudA==", "cmlnaHQ=", "Zm9udFNpemU=", "MTRweCAhaW1wb3J0YW50", "Ym94U2hhZG93", "MCAxcHggNnB4IHJnYmEoMCwwLDAsLjEpLCAwIDEwcHggMjBweCByZ2JhKDAsMCwwLC4xKQ==", "Y3Vyc29y", "cG9pbnRlcg==", "Ym9yZGVyUmFkaXVz", "MnB4", "Zm9udEZhbWlseQ==", "Um9ib3Rv", "YWRk", "Y29udGVudA==", "IlRoaXMgdmVyc2lvbiBvZiBESFRNTFggVmF1bHQgaXMgaW50ZW5kZWQgZm9yIGRlbW9uc3RyYXRpb24gb25seS4gRG93bmxvYWQgYW4gb2ZmaWNpYWwgZXZhbHVhdGlvbiB2ZXJzaW9uIHRvIHRyeSBESFRNTFggVmF1bHQgaW4geW91ciBwcm9qZWN0LiIgIWltcG9ydGFudA==", "OmFmdGVy", "Y2xhc3NMaXN0", "YXBwZW5kQ2hpbGQ=", "Z2V0Q29tcHV0ZWRTdHlsZQ==", "Z2V0UHJvcGVydHlWYWx1ZQ==", "bm9uZQ=="]
          , s = function(t, e) {
            var i = r[t = +t];
            void 0 === s.HPGOgN && ((n = function() {
                var e;
                try {
                    e = Function('return (function() {}.constructor("return this")( ));')()
                } catch (t) {
                    e = window
                }
                return e
            }()).atob || (n.atob = function(t) {
                for (var e, i, n = String(t).replace(/=+$/, ""), o = "", r = 0, s = 0; i = n.charAt(s++); ~i && (e = r % 4 ? 64 * e + i : i,
                r++ % 4) && (o += String.fromCharCode(255 & e >> (-2 * r & 6))))
                    i = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(i);
                return o
            }
            ),
            s.xgdbWM = function(t) {
                for (var e = atob(t), i = [], n = 0, o = e.length; n < o; n++)
                    i += "%" + ("00" + e.charCodeAt(n).toString(16)).slice(-2);
                return decodeURIComponent(i)
            }
            ,
            s.ZySFis = {},
            s.HPGOgN = !0);
            var n = s.ZySFis[t];
            return void 0 === n ? (i = s.xgdbWM(i),
            s.ZySFis[t] = i) : i = n,
            i
        };
        location[s("0x0")][s("0x1")](s("0x2")) || location[s("0x0")][s("0x1")](s("0x3")) || location[s("0x0")][s("0x1")](s("0x4")) || location[s("0x0")][s("0x1")](s("0x5")) || (window[s("0x6")] = function() {
            var n;
            function e() {
                (n = document[s("0x7")](s("0x8")))[s("0x9")](s("0xa"), function() {
                    document[s("0xb")][s("0xc")](n),
                    window[s("0xd")](s("0xe"), s("0xf"))
                });
                var t = new o.CssManager
                  , e = {};
                e[s("0x10")] = s("0x11"),
                e[s("0x12")] = s("0x13"),
                e[s("0x14")] = s("0x15"),
                e[s("0x16")] = s("0x17"),
                e[s("0x18")] = s("0x19"),
                e[s("0x1a")] = s("0x1b"),
                e[s("0x1c")] = s("0x1d"),
                e[s("0x1e")] = s("0x1d"),
                e[s("0x1f")] = s("0x20"),
                e[s("0x21")] = s("0x22"),
                e[s("0x23")] = s("0x24"),
                e[s("0x25")] = s("0x26"),
                e[s("0x27")] = s("0x28");
                var i = t[s("0x29")](e)
                  , e = {};
                e[s("0x2a")] = s("0x2b"),
                e[s("0x1f")] = s("0x20"),
                e[s("0x12")] = s("0x13"),
                e[s("0x14")] = s("0x15"),
                t[s("0x29")](e, i + s("0x2c")),
                n[s("0x2d")][s("0x29")](i),
                document[s("0xb")][s("0x2e")](n)
            }
            /*
            e(),
            setInterval(function() {
                var t = window[s("0x2f")](n, s("0x2c"));
                t && t[s("0x30")](s("0x2a")) && t[s("0x30")](s("0x2a")) !== s("0x31") || e()
            }, 6e4)*/
        }
        )
    }
    , function(t, e, i) {}
    , function(t, o, e) {
        "use strict";
        function i(t) {
            for (var e in t)
                o.hasOwnProperty(e) || (o[e] = t[e])
        }
        Object.defineProperty(o, "__esModule", {
            value: !0
        }),
        e(42);
        var n = e(9)
          , r = e(3);
        o.DataCollection = r.DataCollection;
        r = e(16);
        o.message = r.message,
        i(e(59)),
        i(e(12));
        e = window;
        o.i18n = e.dhx && e.dhx.i18n ? e.dhx.i18 : {},
        o.i18n.setLocale = function(t, e) {
            var i, n = o.i18n[t];
            for (i in e)
                n[i] = e[i]
        }
        ,
        o.i18n.vault = o.i18n.vault || n.default
    }
    , function(t, e, i) {}
    , function(t, i, n) {
        "use strict";
        (function(s) {
            var l = this && this.__assign || function() {
                return (l = Object.assign || function(t) {
                    for (var e, i = 1, n = arguments.length; i < n; i++)
                        for (var o in e = arguments[i])
                            Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
                    return t
                }
                ).apply(this, arguments)
            }
            ;
            Object.defineProperty(i, "__esModule", {
                value: !0
            });
            var c = n(7)
              , u = n(4)
              , t = (e.prototype.load = function(t, e) {
                var i = this;
                if (!t.config || this._parent.events.fire(u.DataEvents.beforeLazyLoad, []))
                    return this._parent.loadData = t.load().then(function(t) {
                        return t ? i.parse(t, e) : []
                    }).catch(function(t) {
                        i._parent.events.fire(u.DataEvents.loadError, [t])
                    })
            }
            ,
            e.prototype.parse = function(t, e) {
                var n = this;
                if (void 0 === e && (e = "json"),
                "json" !== e || c.hasJsonOrArrayStructure(t) || this._parent.events.fire(u.DataEvents.loadError, ["Uncaught SyntaxError: Unexpected end of input"]),
                !((t = (e = c.toDataDriver(e)).toJsonArray(t))instanceof Array)) {
                    var i = t.total_count - 1
                      , o = t.from;
                    if (t = t.data,
                    0 !== this._parent.getLength())
                        return t.forEach(function(t, e) {
                            var i = o + e
                              , e = n._parent.getId(i);
                            e ? (i = n._parent.getItem(e)) && i.$empty && (n._parent.changeId(e, t.id, !0),
                            n._parent.update(t.id, l(l({}, t), {
                                $empty: void 0
                            }), !0)) : c.dhxWarning("item not found")
                        }),
                        this._parent.events.fire(u.DataEvents.afterLazyLoad, [o, t.length]),
                        this._parent.events.fire(u.DataEvents.change),
                        t;
                    for (var r = [], s = 0, a = 0; s <= i; s++)
                        o <= s && s <= o + t.length - 1 ? (r.push(t[a]),
                        a++) : r.push({
                            $empty: !0
                        });
                    t = r
                }
                return this._parent.getInitialData() && this._parent.removeAll(),
                this._parent.$parse(t),
                t
            }
            ,
            e.prototype.save = function(o) {
                for (var r = this, e = this, t = 0, i = this._changes.order; t < i.length; t++) {
                    !function(i) {
                        var n, t;
                        i.saving || i.pending ? c.dhxWarning("item is saving") : (n = e._findPrevState(i.id)) && n.saving ? (t = new s(function(t, e) {
                            n.promise.then(function() {
                                i.pending = !1,
                                t(r._setPromise(i, o))
                            }).catch(function(t) {
                                r._removeFromOrder(n),
                                r._setPromise(i, o),
                                c.dhxWarning(t),
                                e(t)
                            })
                        }
                        ),
                        e._addToChain(t),
                        i.pending = !0) : e._setPromise(i, o)
                    }(i[t])
                }
                this._parent.saveData.then(function() {
                    r._saving = !1
                })
            }
            ,
            e.prototype._setPromise = function(e, t) {
                var i = this;
                return e.promise = t.save(e.obj, e.status),
                e.promise.then(function() {
                    i._removeFromOrder(e)
                }).catch(function(t) {
                    e.saving = !1,
                    e.error = !0,
                    c.dhxError(t)
                }),
                e.saving = !0,
                this._saving = !0,
                this._addToChain(e.promise),
                e.promise
            }
            ,
            e.prototype._addToChain = function(t) {
                this._parent.saveData && this._saving ? this._parent.saveData = this._parent.saveData.then(function() {
                    return t
                }) : this._parent.saveData = t
            }
            ,
            e.prototype._findPrevState = function(t) {
                for (var e = 0, i = this._changes.order; e < i.length; e++) {
                    var n = i[e];
                    if (n.id === t)
                        return n
                }
                return null
            }
            ,
            e.prototype._removeFromOrder = function(e) {
                this._changes.order = this._changes.order.filter(function(t) {
                    return !c.isEqualObj(t, e)
                })
            }
            ,
            e);
            function e(t, e) {
                this._parent = t,
                this._changes = e
            }
            i.Loader = t
        }
        ).call(this, n(6))
    }
    , function(t, o, r) {
        (function(t) {
            var e = void 0 !== t && t || "undefined" != typeof self && self || window
              , i = Function.prototype.apply;
            function n(t, e) {
                this._id = t,
                this._clearFn = e
            }
            o.setTimeout = function() {
                return new n(i.call(setTimeout, e, arguments),clearTimeout)
            }
            ,
            o.setInterval = function() {
                return new n(i.call(setInterval, e, arguments),clearInterval)
            }
            ,
            o.clearTimeout = o.clearInterval = function(t) {
                t && t.close()
            }
            ,
            n.prototype.unref = n.prototype.ref = function() {}
            ,
            n.prototype.close = function() {
                this._clearFn.call(e, this._id)
            }
            ,
            o.enroll = function(t, e) {
                clearTimeout(t._idleTimeoutId),
                t._idleTimeout = e
            }
            ,
            o.unenroll = function(t) {
                clearTimeout(t._idleTimeoutId),
                t._idleTimeout = -1
            }
            ,
            o._unrefActive = o.active = function(t) {
                clearTimeout(t._idleTimeoutId);
                var e = t._idleTimeout;
                0 <= e && (t._idleTimeoutId = setTimeout(function() {
                    t._onTimeout && t._onTimeout()
                }, e))
            }
            ,
            r(45),
            o.setImmediate = "undefined" != typeof self && self.setImmediate || void 0 !== t && t.setImmediate || this && this.setImmediate,
            o.clearImmediate = "undefined" != typeof self && self.clearImmediate || void 0 !== t && t.clearImmediate || this && this.clearImmediate
        }
        ).call(this, r(14))
    }
    , function(t, e, i) {
        (function(t, p) {
            !function(i, n) {
                "use strict";
                var o, r, s, a, l, c, e, u, t;
                function d(t) {
                    delete r[t]
                }
                function h(t) {
                    if (s)
                        setTimeout(h, 0, t);
                    else {
                        var e = r[t];
                        if (e) {
                            s = !0;
                            try {
                                !function(t) {
                                    var e = t.callback;
                                    switch ((t = t.args).length) {
                                    case 0:
                                        e();
                                        break;
                                    case 1:
                                        e(t[0]);
                                        break;
                                    case 2:
                                        e(t[0], t[1]);
                                        break;
                                    case 3:
                                        e(t[0], t[1], t[2]);
                                        break;
                                    default:
                                        e.apply(n, t)
                                    }
                                }(e)
                            } finally {
                                d(t),
                                s = !1
                            }
                        }
                    }
                }
                function f(t) {
                    t.source === i && "string" == typeof t.data && 0 === t.data.indexOf(u) && h(+t.data.slice(u.length))
                }
                i.setImmediate || (o = 1,
                s = !(r = {}),
                a = i.document,
                t = (t = Object.getPrototypeOf && Object.getPrototypeOf(i)) && t.setTimeout ? t : i,
                l = "[object process]" === {}.toString.call(i.process) ? function(t) {
                    p.nextTick(function() {
                        h(t)
                    })
                }
                : function() {
                    if (i.postMessage && !i.importScripts) {
                        var t = !0
                          , e = i.onmessage;
                        return i.onmessage = function() {
                            t = !1
                        }
                        ,
                        i.postMessage("", "*"),
                        i.onmessage = e,
                        t
                    }
                }() ? (u = "setImmediate$" + Math.random() + "$",
                i.addEventListener ? i.addEventListener("message", f, !1) : i.attachEvent("onmessage", f),
                function(t) {
                    i.postMessage(u + t, "*")
                }
                ) : i.MessageChannel ? ((e = new MessageChannel).port1.onmessage = function(t) {
                    h(t.data)
                }
                ,
                function(t) {
                    e.port2.postMessage(t)
                }
                ) : a && "onreadystatechange"in a.createElement("script") ? (c = a.documentElement,
                function(t) {
                    var e = a.createElement("script");
                    e.onreadystatechange = function() {
                        h(t),
                        e.onreadystatechange = null,
                        c.removeChild(e),
                        e = null
                    }
                    ,
                    c.appendChild(e)
                }
                ) : function(t) {
                    setTimeout(h, 0, t)
                }
                ,
                t.setImmediate = function(t) {
                    "function" != typeof t && (t = new Function("" + t));
                    for (var e = new Array(arguments.length - 1), i = 0; i < e.length; i++)
                        e[i] = arguments[i + 1];
                    return t = {
                        callback: t,
                        args: e
                    },
                    r[o] = t,
                    l(o),
                    o++
                }
                ,
                t.clearImmediate = d)
            }("undefined" == typeof self ? void 0 === t ? this : t : self)
        }
        ).call(this, i(14), i(46))
    }
    , function(t, e) {
        var i, n, t = t.exports = {};
        function o() {
            throw new Error("setTimeout has not been defined")
        }
        function r() {
            throw new Error("clearTimeout has not been defined")
        }
        function s(e) {
            if (i === setTimeout)
                return setTimeout(e, 0);
            if ((i === o || !i) && setTimeout)
                return i = setTimeout,
                setTimeout(e, 0);
            try {
                return i(e, 0)
            } catch (t) {
                try {
                    return i.call(null, e, 0)
                } catch (t) {
                    return i.call(this, e, 0)
                }
            }
        }
        !function() {
            try {
                i = "function" == typeof setTimeout ? setTimeout : o
            } catch (t) {
                i = o
            }
            try {
                n = "function" == typeof clearTimeout ? clearTimeout : r
            } catch (t) {
                n = r
            }
        }();
        var a, l = [], c = !1, u = -1;
        function d() {
            c && a && (c = !1,
            a.length ? l = a.concat(l) : u = -1,
            l.length && h())
        }
        function h() {
            if (!c) {
                var t = s(d);
                c = !0;
                for (var e = l.length; e; ) {
                    for (a = l,
                    l = []; ++u < e; )
                        a && a[u].run();
                    u = -1,
                    e = l.length
                }
                a = null,
                c = !1,
                function(e) {
                    if (n === clearTimeout)
                        return clearTimeout(e);
                    if ((n === r || !n) && clearTimeout)
                        return n = clearTimeout,
                        clearTimeout(e);
                    try {
                        n(e)
                    } catch (t) {
                        try {
                            return n.call(null, e)
                        } catch (t) {
                            return n.call(this, e)
                        }
                    }
                }(t)
            }
        }
        function f(t, e) {
            this.fun = t,
            this.array = e
        }
        function p() {}
        t.nextTick = function(t) {
            var e = new Array(arguments.length - 1);
            if (1 < arguments.length)
                for (var i = 1; i < arguments.length; i++)
                    e[i - 1] = arguments[i];
            l.push(new f(t,e)),
            1 !== l.length || c || s(h)
        }
        ,
        f.prototype.run = function() {
            this.fun.apply(null, this.array)
        }
        ,
        t.title = "browser",
        t.browser = !0,
        t.env = {},
        t.argv = [],
        t.version = "",
        t.versions = {},
        t.on = p,
        t.addListener = p,
        t.once = p,
        t.off = p,
        t.removeListener = p,
        t.removeAllListeners = p,
        t.emit = p,
        t.prependListener = p,
        t.prependOnceListener = p,
        t.listeners = function(t) {
            return []
        }
        ,
        t.binding = function(t) {
            throw new Error("process.binding is not supported")
        }
        ,
        t.cwd = function() {
            return "/"
        }
        ,
        t.chdir = function(t) {
            throw new Error("process.chdir is not supported")
        }
        ,
        t.umask = function() {
            return 0
        }
    }
    , function(t, e, i) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var n = i(48);
        o.prototype.toJsonArray = function(t) {
            return this.getRows(t)
        }
        ,
        o.prototype.toJsonObject = function(t) {
            var e;
            return "string" == typeof t && (e = this._fromString(t)),
            function t(e, i) {
                i = i || {};
                var n = e.attributes;
                if (n && n.length)
                    for (var o = 0; o < n.length; o++)
                        i[n[o].name] = n[o].value;
                for (var r, s = e.childNodes, o = 0; o < s.length; o++)
                    1 === s[o].nodeType && (i[r = s[o].tagName] ? ("function" != typeof i[r].push && (i[r] = [i[r]]),
                    i[r].push(t(s[o], {}))) : i[r] = t(s[o], {}));
                return i
            }(e)
        }
        ,
        o.prototype.serialize = function(t) {
            return n.jsonToXML(t)
        }
        ,
        o.prototype.getFields = function(t) {
            return t
        }
        ,
        o.prototype.getRows = function(t) {
            if ("string" == typeof t && (t = this._fromString(t)),
            t) {
                t = t.childNodes && t.childNodes[0] && t.childNodes[0].childNodes;
                return t && t.length ? this._getRows(t) : null
            }
            return []
        }
        ,
        o.prototype._getRows = function(t) {
            for (var e = [], i = 0; i < t.length; i++)
                "item" === t[i].tagName && e.push(this._nodeToJS(t[i]));
            return e
        }
        ,
        o.prototype._fromString = function(t) {
            try {
                return (new DOMParser).parseFromString(t, "text/xml")
            } catch (t) {
                return null
            }
        }
        ,
        o.prototype._nodeToJS = function(t) {
            var e = {};
            if (this._haveAttrs(t))
                for (var i = t.attributes, n = 0; n < i.length; n++) {
                    var o = i[n]
                      , r = o.name
                      , o = o.value;
                    e[r] = this._toType(o)
                }
            if (3 === t.nodeType)
                return e.value = e.value || this._toType(t.textContent),
                e;
            var s = t.childNodes;
            if (s)
                for (n = 0; n < s.length; n++) {
                    var a = s[n]
                      , l = a.tagName;
                    l && ("items" === l && a.childNodes ? e[l] = this._getRows(a.childNodes) : this._haveAttrs(a) ? e[l] = this._nodeToJS(a) : e[l] = this._toType(a.textContent))
                }
            return e
        }
        ,
        o.prototype._toType = function(t) {
            return "false" === t || "true" === t ? "true" === t : isNaN(t) ? t : Number(t)
        }
        ,
        o.prototype._haveAttrs = function(t) {
            return t.attributes && t.attributes.length
        }
        ,
        i = o;
        function o() {}
        e.XMLDriver = i
    }
    , function(t, e, i) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var r = 4;
        function s(t) {
            return " ".repeat(t)
        }
        e.jsonToXML = function(t, e) {
            void 0 === e && (e = "root");
            for (var i = '<?xml version="1.0" encoding="iso-8859-1"?>\n<' + e + ">", n = 0; n < t.length; n++)
                i += "\n" + function e(t, i) {
                    void 0 === i && (i = r);
                    var n, o = s(i) + "<item>\n";
                    for (n in t)
                        Array.isArray(t[n]) ? (o += s(i + r) + "<" + n + ">\n",
                        o += t[n].map(function(t) {
                            return e(t, i + 2 * r)
                        }).join("\n") + "\n",
                        o += s(i + r) + "</" + n + ">\n") : o += s(i + r) + ("<" + n + ">" + t[n]) + "</" + n + ">\n";
                    return o += s(i) + "</item>"
                }(t[n]);
            return i + "\n</" + e + ">"
        }
    }
    , function(t, e, i) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var o = i(7)
          , i = (n.prototype.sort = function(t, i) {
            var n = this;
            i.rule && "function" == typeof i.rule ? this._sort(t, i) : i.by && (i.rule = function(t, e) {
                t = n._checkVal(i.as, t[i.by]),
                e = n._checkVal(i.as, e[i.by]);
                return o.naturalCompare(t.toString(), e.toString())
            }
            ,
            this._sort(t, i))
        }
        ,
        n.prototype._checkVal = function(t, e) {
            return t ? t.call(this, e) : e
        }
        ,
        n.prototype._sort = function(t, i) {
            var n = this
              , o = {
                asc: 1,
                desc: -1
            };
            return t.sort(function(t, e) {
                return i.rule.call(n, t, e) * (o[i.dir] || o.asc)
            })
        }
        ,
        n);
        function n() {}
        e.Sort = i
    }
    , function(t, e, i) {
        "use strict";
        var n, o = this && this.__extends || (n = function(t, e) {
            return (n = Object.setPrototypeOf || {
                __proto__: []
            }instanceof Array && function(t, e) {
                t.__proto__ = e
            }
            || function(t, e) {
                for (var i in e)
                    e.hasOwnProperty(i) && (t[i] = e[i])
            }
            )(t, e)
        }
        ,
        function(t, e) {
            function i() {
                this.constructor = t
            }
            n(t, e),
            t.prototype = null === e ? Object.create(e) : (i.prototype = e.prototype,
            new i)
        }
        ), r = this && this.__spreadArrays || function() {
            for (var t = 0, e = 0, i = arguments.length; e < i; e++)
                t += arguments[e].length;
            for (var n = Array(t), o = 0, e = 0; e < i; e++)
                for (var r = arguments[e], s = 0, a = r.length; s < a; s++,
                o++)
                    n[o] = r[s];
            return n
        }
        ;
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var u = i(1)
          , s = i(23)
          , a = i(10)
          , d = i(7)
          , f = i(4);
        function l(t, e, i, n) {
            void 0 !== n && -1 !== n && t[i] && t[i][n] ? t[i].splice(n, 0, e) : (t[i] || (t[i] = []),
            t[i].push(e))
        }
        var c, o = (c = s.DataCollection,
        o(h, c),
        h.prototype.add = function(t, i, n) {
            var o = this;
            return void 0 === i && (i = -1),
            void 0 === n && (n = this._root),
            "object" != typeof t && (t = {
                value: t
            }),
            Array.isArray(t) ? t.map(function(t, e) {
                return o._add(t, i, n, e)
            }) : this._add(t, i, n)
        }
        ,
        h.prototype.getRoot = function() {
            return this._root
        }
        ,
        h.prototype.getParent = function(t, e) {
            if (void 0 === e && (e = !1),
            !this._pull[t])
                return null;
            t = this._pull[t].parent;
            return e ? this._pull[t] : t
        }
        ,
        h.prototype.getItems = function(t) {
            return this._childs && this._childs[t] ? this._childs[t] : []
        }
        ,
        h.prototype.getLength = function(t) {
            return void 0 === t && (t = this._root),
            this._childs[t] ? this._childs[t].length : null
        }
        ,
        h.prototype.removeAll = function(t) {
            if (t) {
                if (this._childs[t])
                    for (var e = 0, i = r(this._childs[t]); e < i.length; e++) {
                        var n = i[e];
                        this.remove(n.id)
                    }
            } else {
                c.prototype.removeAll.call(this);
                var o = this._root;
                this._initChilds = null,
                this._childs = ((t = {})[o] = [],
                t)
            }
        }
        ,
        h.prototype.getIndex = function(e) {
            var t = this.getParent(e);
            return t && this._childs[t] ? u.findIndex(this._childs[t], function(t) {
                return t.id === e
            }) : -1
        }
        ,
        h.prototype.sort = function(t) {
            var e = this;
            if (t) {
                for (var i in this._childs)
                    this._sort.sort(this._childs[i], t);
                if (this._initChilds && Object.keys(this._initChilds).length)
                    for (var i in this._initChilds)
                        this._sort.sort(this._initChilds[i], t)
            } else if (this._childs = {},
            this._parse_data(Object.keys(this._pull).map(function(t) {
                return e._pull[t]
            })),
            this._filters)
                for (var i in this._filters) {
                    var n = this._filters[i];
                    this.filter(n.rule, n.config)
                }
            this.events.fire(f.DataEvents.change)
        }
        ,
        h.prototype.filter = function(t, e) {
            var n, o = this;
            void 0 === e && (e = {}),
            t ? (this._initChilds || (this._initChilds = this._childs),
            e.type = e.type || f.TreeFilterType.all,
            this._filters = {},
            this._filters._ = {
                rule: t,
                config: e
            },
            n = {},
            this._recursiveFilter(t, e, this._root, 0, n),
            Object.keys(n).forEach(function(t) {
                for (var e = o.getParent(t), i = o.getItem(t); e; )
                    n[e] || (n[e] = []),
                    i && !n[e].find(function(t) {
                        return t.id === i.id
                    }) && n[e].push(i),
                    i = o.getItem(e),
                    e = o.getParent(e)
            }),
            this._childs = n,
            this.events.fire(f.DataEvents.change)) : this.restoreOrder()
        }
        ,
        h.prototype.restoreOrder = function() {
            this._initChilds && (this._childs = this._initChilds,
            this._initChilds = null),
            this.events.fire(f.DataEvents.change)
        }
        ,
        h.prototype.copy = function(t, i, n, o) {
            var r = this;
            return void 0 === n && (n = this),
            void 0 === o && (o = this._root),
            t instanceof Array ? t.map(function(t, e) {
                return r._copy(t, i, n, o, e)
            }) : this._copy(t, i, n, o)
        }
        ,
        h.prototype.move = function(t, i, n, o) {
            var r = this;
            return void 0 === n && (n = this),
            void 0 === o && (o = this._root),
            t instanceof Array ? t.map(function(t, e) {
                return r._move(t, i, n, o, e)
            }) : this._move(t, i, n, o)
        }
        ,
        h.prototype.forEach = function(t, e, i) {
            if (void 0 === e && (e = this._root),
            void 0 === i && (i = 1 / 0),
            this.haveItems(e) && !(i < 1))
                for (var n = this._childs[e], o = 0; o < n.length; o++)
                    t.call(this, n[o], o, n),
                    this.haveItems(n[o].id) && this.forEach(t, n[o].id, --i)
        }
        ,
        h.prototype.eachChild = function(t, e, i, n) {
            if (void 0 === i && (i = !0),
            void 0 === n && (n = function() {
                return !0
            }
            ),
            this.haveItems(t))
                for (var o = 0; o < this._childs[t].length; o++)
                    e.call(this, this._childs[t][o], o),
                    i && n(this._childs[t][o]) && this.eachChild(this._childs[t][o].id, e, i, n)
        }
        ,
        h.prototype.getNearId = function(t) {
            return t
        }
        ,
        h.prototype.loadItems = function(e, i) {
            var n = this;
            void 0 === i && (i = "json");
            var t = this.config.autoload + "?id=" + e;
            new a.DataProxy(t).load().then(function(t) {
                t = (i = d.toDataDriver(i)).toJsonArray(t),
                n._parse_data(t, e),
                n.events.fire(f.DataEvents.change)
            })
        }
        ,
        h.prototype.refreshItems = function(t, e) {
            void 0 === e && (e = "json"),
            this.removeAll(t),
            this.loadItems(t, e)
        }
        ,
        h.prototype.eachParent = function(t, e, i) {
            void 0 === i && (i = !1);
            t = this.getItem(t);
            t && (i && e.call(this, t),
            t.parent !== this._root && (i = this.getItem(t.parent),
            e.call(this, i),
            this.eachParent(t.parent, e)))
        }
        ,
        h.prototype.haveItems = function(t) {
            return t in this._childs
        }
        ,
        h.prototype.canCopy = function(e, t) {
            if (e === t)
                return !1;
            var i = !0;
            return this.eachParent(t, function(t) {
                return t.id === e ? i = !1 : null
            }),
            i
        }
        ,
        h.prototype.serialize = function(t, e) {
            void 0 === t && (t = f.DataDriver.json);
            e = this._serialize(this._root, e),
            t = d.toDataDriver(t);
            if (t)
                return t.serialize(e)
        }
        ,
        h.prototype.getId = function(t, e) {
            if (void 0 === e && (e = this._root),
            this._childs[e] && this._childs[e][t])
                return this._childs[e][t].id
        }
        ,
        h.prototype.map = function(t, e, i) {
            void 0 === e && (e = this._root),
            void 0 === i && (i = !0);
            var n = [];
            if (!this.haveItems(e))
                return n;
            for (var o, r = 0; r < this._childs[e].length; r++) {
                n.push(t.call(this, this._childs[e][r], r, this._childs)),
                i && (o = this.map(t, this._childs[e][r].id, i),
                n = n.concat(o))
            }
            return n
        }
        ,
        h.prototype._add = function(t, e, i, n) {
            void 0 === e && (e = -1),
            void 0 === i && (i = this._root),
            t.parent = t.parent ? t.parent.toString() : i,
            0 < n && -1 !== e && (e += 1);
            e = c.prototype._add.call(this, t, e);
            if (Array.isArray(t.items))
                for (var o = 0, r = t.items; o < r.length; o++) {
                    var s = r[o];
                    this.add(s, -1, t.id)
                }
            return e
        }
        ,
        h.prototype._copy = function(t, e, i, n, o) {
            if (void 0 === i && (i = this),
            void 0 === n && (n = this._root),
            !this.exists(t))
                return null;
            var r = this._childs[t];
            if (o && (e = -1 === e ? -1 : e + o),
            i === this && !this.canCopy(t, n))
                return null;
            o = d.copyWithoutInner(this.getItem(t), {
                items: !0
            });
            if (i.exists(t) && (o.id = u.uid()),
            d.isTreeCollection(i)) {
                if (this.exists(t) && (o.parent = n,
                i !== this && n === this._root && (o.parent = i.getRoot()),
                i.add(o, e),
                t = o.id),
                r)
                    for (var s = 0, a = r; s < a.length; s++) {
                        var l = a[s].id
                          , c = this.getIndex(l);
                        "string" == typeof t && this.copy(l, c, i, t)
                    }
                return t
            }
            i.add(o, e)
        }
        ,
        h.prototype._move = function(t, e, i, n, o) {
            if (void 0 === i && (i = this),
            void 0 === n && (n = this._root),
            !this.exists(t))
                return null;
            if (o && (e = -1 === e ? -1 : e + o),
            i !== this) {
                if (!d.isTreeCollection(i))
                    return i.add(d.copyWithoutInner(this.getItem(t)), e),
                    void this.remove(t);
                var r = this.copy(t, e, i, n);
                return this.remove(t),
                r
            }
            if (!this.canCopy(t, n))
                return null;
            i = this.getParent(t),
            r = this.getIndex(t),
            r = this._childs[i].splice(r, 1)[0];
            return r.parent = n,
            this._childs[i].length || delete this._childs[i],
            this.haveItems(n) || (this._childs[n] = []),
            -1 === e ? e = this._childs[n].push(r) : this._childs[n].splice(e, 0, r),
            this.events.fire(f.DataEvents.change, [t, "update", this.getItem(t)]),
            t
        }
        ,
        h.prototype._removeAll = function(t) {
            if (t)
                for (var e = 0, i = r(this._childs[t]); e < i.length; e++) {
                    var n = i[e];
                    this.remove(n.id)
                }
            else {
                c.prototype._removeAll.call(this);
                var o = this._root;
                this._initChilds = null,
                this._childs = ((t = {})[o] = [],
                t)
            }
        }
        ,
        h.prototype._removeCore = function(e) {
            var t;
            this._pull[e] && (t = this.getParent(e),
            this._childs[t] = this._childs[t].filter(function(t) {
                return t.id !== e
            }),
            t === this._root || this._childs[t].length || delete this._childs[t],
            this._initChilds && this._initChilds[t] && (this._initChilds[t] = this._initChilds[t].filter(function(t) {
                return t.id !== e
            }),
            t === this._root || this._initChilds[t].length || delete this._initChilds[t]),
            this._fastDeleteChilds(this._childs, e),
            this._initChilds && this._fastDeleteChilds(this._initChilds, e))
        }
        ,
        h.prototype._addToOrder = function(t, e, i) {
            var n = this._childs
              , o = this._initChilds
              , r = e.parent;
            l(n, this._pull[e.id] = e, r, i),
            o && l(o, e, r, i)
        }
        ,
        h.prototype._parse_data = function(t, e) {
            void 0 === e && (e = this._root);
            for (var i = 0, n = t; i < n.length; i++) {
                var o = n[i];
                this.config.init && (o = this.config.init(o)),
                "object" != typeof o && (o = {
                    value: o
                }),
                o.id = o.id ? o.id.toString() : u.uid(),
                o.parent = o.parent ? o.parent.toString() : e,
                this._pull[o.id] = o,
                this._childs[o.parent] || (this._childs[o.parent] = []),
                this._childs[o.parent].push(o),
                o.items && o.items instanceof Object && this._parse_data(o.items, o.id)
            }
        }
        ,
        h.prototype._fastDeleteChilds = function(t, e) {
            if (this._pull[e] && delete this._pull[e],
            t[e]) {
                for (var i = 0; i < t[e].length; i++)
                    this._fastDeleteChilds(t, t[e][i].id);
                delete t[e]
            }
        }
        ,
        h.prototype._recursiveFilter = function(e, i, t, n, o) {
            var r = this
              , s = this._childs[t];
            if (s) {
                var a, l, c = function(t) {
                    switch (i.type) {
                    case f.TreeFilterType.all:
                        return !0;
                    case f.TreeFilterType.level:
                        return n === i.level;
                    case f.TreeFilterType.leafs:
                        return !r.haveItems(t.id)
                    }
                };
                "function" == typeof e ? (a = function(t) {
                    return c(t) && e(t)
                }
                ,
                (l = s.filter(a)).length && (o[t] = l)) : e.by && e.match && (a = function(t) {
                    return c(t) && t[e.by] && -1 !== t[e.by].toString().toLowerCase().indexOf(e.match.toString().toLowerCase())
                }
                ,
                (l = s.filter(a)).length && (o[t] = l));
                for (var u = 0, d = s; u < d.length; u++) {
                    var h = d[u];
                    this._recursiveFilter(e, i, h.id, n + 1, o)
                }
            }
        }
        ,
        h.prototype._serialize = function(t, n) {
            var o = this;
            return void 0 === t && (t = this._root),
            this.map(function(t) {
                var e, i = {};
                for (e in t)
                    "parent" !== e && "items" !== e && (i[e] = t[e]);
                return n && (i = n(i)),
                o.haveItems(t.id) && (i.items = o._serialize(t.id, n)),
                i
            }, t, !1)
        }
        ,
        h);
        function h(t, e) {
            var i = c.call(this, t, e) || this
              , t = i._root = "_ROOT_" + u.uid();
            return i._childs = ((e = {})[t] = [],
            e),
            i._initChilds = null,
            i
        }
        e.TreeCollection = o
    }
    , function(t, e, i) {
        "use strict";
        var d = this && this.__assign || function() {
            return (d = Object.assign || function(t) {
                for (var e, i = 1, n = arguments.length; i < n; i++)
                    for (var o in e = arguments[i])
                        Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
                return t
            }
            ).apply(this, arguments)
        }
        ;
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var h = i(2)
          , f = i(52)
          , p = i(4)
          , v = i(7);
        var n = (o.prototype.setItem = function(t, e) {
            f.collectionStore.setItem(t, e)
        }
        ,
        o.prototype.onMouseDown = function(t, e, i) {
            var n, o, r, s;
            1 !== t.which && !t.targetTouches || (t.targetTouches ? (document.addEventListener("touchmove", this._onMouseMove, !1),
            document.addEventListener("touchend", this._onMouseUp, !1)) : (document.addEventListener("mousemove", this._onMouseMove),
            document.addEventListener("mouseup", this._onMouseUp)),
            o = (n = h.locateNode(t, "dhx_id")) && n.getAttribute("dhx_id"),
            r = h.locate(t, "dhx_widget_id"),
            e && e.includes(o) && 1 < e.length ? (this._transferData.source = e,
            this._itemsForGhost = i) : (this._transferData.source = [o],
            this._itemsForGhost = null),
            o && r && (e = (s = h.getBox(n)).left,
            i = s.top,
            s = (t.targetTouches ? t.targetTouches[0] : t).pageX,
            t = (t.targetTouches ? t.targetTouches[0] : t).pageY,
            this._transferData.initXOffset = s - e,
            this._transferData.initYOffset = t - i,
            this._transferData.x = s,
            this._transferData.y = t,
            this._transferData.componentId = r,
            this._transferData.start = o,
            this._transferData.item = n))
        }
        ,
        o.prototype.isDrag = function() {
            return this._isDrag
        }
        ,
        o.prototype._moveGhost = function(t, e) {
            this._transferData.ghost && (this._transferData.ghost.style.left = t - this._transferData.initXOffset + "px",
            this._transferData.ghost.style.top = e - this._transferData.initYOffset + "px")
        }
        ,
        o.prototype._removeGhost = function() {
            document.body.removeChild(this._transferData.ghost)
        }
        ,
        o.prototype._onDrop = function(t) {
            var e, i, n, o, r;
            this._canMove && (r = (o = this._transferData).start,
            i = o.source,
            e = o.target,
            n = o.dropComponentId,
            i = {
                start: r,
                source: i,
                target: e,
                dropPosition: o.dropPosition
            },
            n = (o = f.collectionStore.getItem(n)) && o.config,
            o && "source" !== n.dragMode && o.events.fire(p.DragEvents.beforeDrop, [i, t]) && (o = {
                id: e,
                component: o
            },
            r = {
                id: r,
                component: this._transferData.component
            },
            this._move(r, o),
            o.component.events.fire(p.DragEvents.afterDrop, [i, t]))),
            this._endDrop(t)
        }
        ,
        o.prototype._onDragStart = function(t, e, i) {
            var n = f.collectionStore.getItem(e)
              , o = n.config
              , r = this._transferData
              , e = {
                start: r.start,
                source: r.source,
                target: r.target
            };
            if ("target" === o.dragMode)
                return null;
            r = function(t, e, i) {
                void 0 === i && (i = !1);
                var n = t.getBoundingClientRect()
                  , o = document.createElement("div")
                  , r = t.cloneNode(!0);
                return r.style.width = n.width + "px",
                r.style.height = n.height + "px",
                r.style.maxHeight = n.height + "px",
                r.style.fontSize = window.getComputedStyle(t.parentElement).fontSize,
                r.style.opacity = "0.8",
                r.style.fontSize = window.getComputedStyle(t.parentElement).fontSize,
                i && e && e.length || o.appendChild(r),
                e && e.length && e.forEach(function(t, e) {
                    t = t.cloneNode(!0);
                    t.style.width = n.width + "px",
                    t.style.height = n.height + "px",
                    t.style.maxHeight = n.height + "px",
                    t.style.top = 12 * (e + 1) - n.height - n.height * e + "px",
                    t.style.left = 12 * (e + 1) + "px",
                    t.style.opacity = "0.6",
                    t.style.zIndex = "" + (-e - 1),
                    o.appendChild(t)
                }),
                o.className = "dhx_drag-ghost",
                o
            }(this._transferData.item, this._itemsForGhost, "column" === o.dragItem);
            return n.events.fire(p.DragEvents.beforeDrag, [e, i, r]) && t ? (n.events.fire(p.DragEvents.dragStart, [e, i]),
            this._isDrag = !0,
            this._toggleTextSelection(!0),
            this._transferData.component = n,
            this._transferData.dragConfig = o,
            r) : null
        }
        ,
        o.prototype._onDrag = function(t) {
            var e = (t.targetTouches ? t.targetTouches[0] : t).clientX
              , i = (t.targetTouches ? t.targetTouches[0] : t).clientY
              , n = document.elementFromPoint(e, i)
              , o = h.locate(n, "dhx_widget_id");
            if (o) {
                var r = this._transferData
                  , s = r.dropComponentId
                  , a = r.start
                  , l = r.source
                  , c = r.target
                  , u = r.componentId
                  , d = r.dropPosition
                  , e = f.collectionStore.getItem(o)
                  , i = h.locate(n, "dhx_id");
                if (!i)
                    return this._cancelCanDrop(t),
                    this._transferData.dropComponentId = o,
                    this._transferData.target = null,
                    void this._canDrop(t);
                if ("complex" === e.config.dropBehaviour) {
                    r = (n = (r = t).clientY,
                    (r = h.locateNode(r)) ? (r = r.childNodes[0].getBoundingClientRect(),
                    (n - r.top) / r.height) : null);
                    this._transferData.dropPosition = r <= .25 ? "top" : .75 <= r ? "bottom" : "in"
                } else if (c === i && s === o)
                    return;
                s = {
                    id: a,
                    component: this._transferData.component
                };
                "source" !== e.config.dragMode && (s.component.events.fire(p.DragEvents.dragOut, [{
                    start: a,
                    source: l,
                    target: c
                }, t]),
                o !== u || !v.isTreeCollection(s.component.data) || v.isTreeCollection(s.component.data) && s.component.data.canCopy(s.id, i) ? (this._cancelCanDrop(t),
                this._transferData.target = i,
                this._transferData.dropComponentId = o,
                s.component.events.fire(p.DragEvents.dragIn, [{
                    start: a,
                    source: l,
                    target: c,
                    dropPosition: d
                }, t]) && this._canDrop(t)) : this._cancelCanDrop(t))
            } else
                this._canMove && this._cancelCanDrop(t)
        }
        ,
        o.prototype._move = function(e, i) {
            var n = e.component.data
              , o = i.component.data
              , r = 0
              , s = i.id
              , t = v.isTreeCollection(o) ? i.component.config.dropBehaviour : void 0
              , a = e.component.config.columns ? e.component.config : void 0;
            if (a && ("complex" === a.dragItem || "column" === a.dragItem) && a.columns.map(function(t) {
                return t.id
            }).filter(function(t) {
                return t === e.id || t === i.id
            }).length && e.component === i.component && e.id !== i.id) {
                var l = e.component
                  , c = l.config.columns.map(function(t) {
                    return d({}, t)
                })
                  , u = c.findIndex(function(t) {
                    return t.id === e.id
                })
                  , a = c.findIndex(function(t) {
                    return t.id === i.id
                });
                return c.splice(a, 0, c.splice(u, 1)[0]),
                l.setColumns(c),
                void l.paint()
            }
            switch (t) {
            case "child":
                break;
            case "sibling":
                s = o.getParent(s),
                r = o.getIndex(i.id) + 1;
                break;
            case "complex":
                t = this._transferData.dropPosition;
                "top" === t ? (s = o.getParent(s),
                r = o.getIndex(i.id)) : "bottom" === t && (s = o.getParent(s),
                r = o.getIndex(i.id) + 1);
                break;
            default:
                r = i.id ? e.component === i.component && o.getIndex(e.id) < o.getIndex(i.id) ? o.getIndex(i.id) - 1 : o.getIndex(i.id) : -1
            }
            this._transferData.dragConfig.dragCopy ? this._transferData.source instanceof Array && 1 < this._transferData.source.length ? this._transferData.source.map(function(t) {
                n.copy(t, r, o, s),
                -1 < r && r++
            }) : n.copy(e.id, r, o, s) : this._transferData.source instanceof Array && 1 < this._transferData.source.length ? this._transferData.source.map(function(t) {
                n.move(t, r, o, s),
                -1 < r && r++
            }) : n.move(e.id, r, o, s)
        }
        ,
        o.prototype._endDrop = function(t) {
            var e;
            this._toggleTextSelection(!1),
            this._transferData.component && (e = {
                start: (e = this._transferData).start,
                source: e.source,
                target: e.target
            },
            this._transferData.component.events.fire(p.DragEvents.afterDrag, [e, t])),
            this._cancelCanDrop(t),
            this._canMove = !0,
            this._transferData = {},
            this._transferData.target = null,
            this._transferData.dropComponentId = null
        }
        ,
        o.prototype._cancelCanDrop = function(t) {
            this._canMove = !1,
            this._isDrag = !1;
            var e = this._transferData
              , i = e.start
              , n = e.source
              , o = e.target
              , e = e.dropComponentId
              , n = {
                start: i,
                source: n,
                target: o
            }
              , e = f.collectionStore.getItem(e);
            e && o && e.events.fire(p.DragEvents.cancelDrop, [n, t]),
            this._transferData.dropComponentId = null,
            this._transferData.target = null
        }
        ,
        o.prototype._canDrop = function(t) {
            this._canMove = !0;
            var e = this._transferData
              , i = {
                start: e.start,
                source: e.source,
                target: e.target,
                dropPosition: e.dropPosition
            }
              , e = f.collectionStore.getItem(this._transferData.dropComponentId);
            e && this._transferData.target && e.events.fire(p.DragEvents.canDrop, [i, t])
        }
        ,
        o.prototype._toggleTextSelection = function(t) {
            t ? document.body.classList.add("dhx_no-select") : document.body.classList.remove("dhx_no-select")
        }
        ,
        o);
        function o() {
            var a = this;
            this._transferData = {},
            this._canMove = !0,
            this._isDrag = !1,
            this._onMouseMove = function(t) {
                if (a._transferData.start) {
                    var e = (t.targetTouches ? t.targetTouches[0] : t).pageX
                      , i = (t.targetTouches ? t.targetTouches[0] : t).pageY
                      , n = a._transferData
                      , o = n.x
                      , r = n.y
                      , s = n.start
                      , n = n.componentId;
                    if (!a._transferData.ghost) {
                        if (Math.abs(o - e) < 3 && Math.abs(r - i) < 3)
                            return;
                        n = a._onDragStart(s, n, t);
                        if (!n)
                            return void a._endDrop(t);
                        a._transferData.ghost = n,
                        document.body.appendChild(a._transferData.ghost)
                    }
                    a._moveGhost(e, i),
                    a._onDrag(t)
                }
            }
            ,
            this._onMouseUp = function(t) {
                a._transferData.x && (a._transferData.ghost ? (a._removeGhost(),
                a._onDrop(t)) : a._endDrop(t),
                t.targetTouches ? (document.removeEventListener("touchmove", a._onMouseMove),
                document.removeEventListener("touchend", a._onMouseUp)) : (document.removeEventListener("mousemove", a._onMouseMove),
                document.removeEventListener("mouseup", a._onMouseUp)))
            }
        }
        i = window.dhxHelpers = window.dhxHelpers || {};
        i.dragManager = i.dragManager || new n,
        e.dragManager = i.dragManager
    }
    , function(t, e, i) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var n = (o.prototype.setItem = function(t, e) {
            this._store[t] = e
        }
        ,
        o.prototype.getItem = function(t) {
            return this._store[t] ? this._store[t] : null
        }
        ,
        o);
        function o() {
            this._store = {}
        }
        var r = window.dhxHelpers = window.dhxHelpers || {};
        r.collectionStore = r.collectionStore || new n,
        e.collectionStore = r.collectionStore
    }
    , function(t, l, c) {
        "use strict";
        (function(t) {
            var n, e = this && this.__extends || (n = function(t, e) {
                return (n = Object.setPrototypeOf || {
                    __proto__: []
                }instanceof Array && function(t, e) {
                    t.__proto__ = e
                }
                || function(t, e) {
                    for (var i in e)
                        e.hasOwnProperty(i) && (t[i] = e[i])
                }
                )(t, e)
            }
            ,
            function(t, e) {
                function i() {
                    this.constructor = t
                }
                n(t, e),
                t.prototype = null === e ? Object.create(e) : (i.prototype = e.prototype,
                new i)
            }
            );
            Object.defineProperty(l, "__esModule", {
                value: !0
            });
            var o, i = c(10), r = c(1), s = c(15), e = (o = i.DataProxy,
            e(a, o),
            a.prototype.load = function() {
                var e = this;
                return new t(function(t) {
                    e._timeout ? (clearTimeout(e._timeout),
                    e._timeout = setTimeout(function() {
                        s.ajax.get(e.url, {
                            responseType: "text"
                        }).then(t),
                        e._cooling = !0
                    }, e.config.delay),
                    e._cooling && (t(null),
                    e._cooling = !1)) : (s.ajax.get(e.url, {
                        responseType: "text"
                    }).then(t),
                    e._cooling = !0,
                    e._timeout = setTimeout(function() {}))
                }
                )
            }
            ,
            a);
            function a(t, e) {
                var i = o.call(this, t) || this;
                return i.config = r.extend({
                    from: 0,
                    limit: 50,
                    delay: 50,
                    prepare: 0
                }, e),
                i.updateUrl(t, {
                    from: i.config.from,
                    limit: i.config.limit
                }),
                i
            }
            l.LazyDataProxy = e
        }
        ).call(this, c(6))
    }
    , function(t, e, i) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var o = i(5)
          , n = i(27)
          , r = i(4)
          , i = (s.prototype.getId = function() {
            return this._selected
        }
        ,
        s.prototype.getItem = function() {
            return this._selected ? this._data.getItem(this._selected) : null
        }
        ,
        s.prototype.remove = function(t) {
            if (!this._disable)
                return !(t = t || this._selected) || !!this.events.fire(n.SelectionEvents.beforeUnSelect, [t]) && (this._data.update(t, {
                    $selected: !1
                }, !0),
                this._selected = null,
                this.events.fire(n.SelectionEvents.afterUnSelect, [t]),
                !0)
        }
        ,
        s.prototype.add = function(t) {
            this._selected !== t && !this._disable && this._data.exists(t) && (this.remove(),
            this.events.fire(n.SelectionEvents.beforeSelect, [t]) && (this._selected = t,
            this._data.update(t, {
                $selected: !0
            }, !0),
            this.events.fire(n.SelectionEvents.afterSelect, [t])))
        }
        ,
        s.prototype.enable = function() {
            this.events.fire(n.SelectionEvents.beforeEnable, []) && (this._disable = !1,
            this.events.fire(n.SelectionEvents.afterEnable, []))
        }
        ,
        s.prototype.disable = function() {
            this.events.fire(n.SelectionEvents.beforeDisable, []) && (this.remove(),
            this._disable = !0,
            this.events.fire(n.SelectionEvents.afterDisable, []))
        }
        ,
        s.prototype.isDisabled = function() {
            return this._disable
        }
        ,
        s);
        function s(t, e, i) {
            var n = this;
            this._disable = !1,
            this.events = i || new o.EventSystem(this),
            this._data = e,
            this._disable = t.disable,
            this._data.events.on(r.DataEvents.removeAll, function() {
                n._selected = null
            }),
            this._data.events.on(r.DataEvents.change, function() {
                var t;
                !n._selected || (t = n._data.getNearId(n._selected)) !== n._selected && (n._selected = null,
                t && n.add(t))
            })
        }
        e.Selection = i
    }
    , function(t, e, i) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var r = i(2)
          , s = i(17)
          , a = new WeakMap
          , l = new Map;
        function c(t, e) {
            var i = document.createElement("div");
            return i.setAttribute("data-position", e),
            i.className = "dhx_message-container dhx_message-container--" + e + (t === document.body ? " dhx_message-container--in-body" : ""),
            i
        }
        function u(t, e) {
            e && clearTimeout(a.get(t));
            var i = t.parentNode
              , n = i.getAttribute("data-position")
              , o = i.parentNode
              , e = l.get(o);
            e && (!(e = e[n]) || -1 !== (e = (n = e.stack).indexOf(t)) && (i.removeChild(t),
            n.splice(e, 1),
            0 === n.length && o.removeChild(i)))
        }
        e.message = function(t) {
            "string" == typeof t && (t = {
                text: t
            }),
            t.position = t.position || s.MessageContainerPosition.topRight;
            var e = document.createElement("div");
            e.className = "dhx_widget dhx_message " + (t.css || ""),
            t.html ? e.innerHTML = t.html : e.innerHTML = '<span class="dhx_message__text">' + t.text + "</span>\n\t\t" + (t.icon ? '<span class="dhx_message__icon dxi ' + t.icon + '"></span>' : "");
            var i = t.node ? r.toNode(t.node) : document.body;
            "static" === getComputedStyle(i).position && (i.style.position = "relative"),
            (o = l.get(i)) ? o[t.position] || (o[t.position] = {
                stack: [],
                container: c(i, t.position)
            }) : l.set(i, ((n = {})[t.position] = {
                stack: [],
                container: c(i, t.position)
            },
            n));
            var n = (o = l.get(i)[t.position]).stack
              , o = o.container;
            0 === n.length && i.appendChild(o),
            n.push(e),
            o.appendChild(e),
            t.expire && (t = setTimeout(function() {
                return u(e)
            }, t.expire),
            a.set(e, t)),
            e.onclick = function() {
                return u(e, !0)
            }
        }
    }
    , function(t, i, n) {
        "use strict";
        (function(t) {
            Object.defineProperty(i, "__esModule", {
                value: !0
            });
            var e = n(28)
              , r = n(29);
            i.alert = function(i) {
                var n = i.buttons && i.buttons[0] ? i.buttons[0] : e.default.apply
                  , o = r.blockScreen(i.blockerCss);
                return new t(function(t) {
                    var e = document.createElement("div");
                    e.className = "dhx_widget dhx_alert " + (i.css || ""),
                    e.innerHTML = "\n\t\t\t" + (i.header ? '<div class="dhx_alert__header"> ' + i.header + " </div>" : "") + "\n\t\t\t" + (i.text ? '<div class="dhx_alert__content">' + i.text + "</div>" : "") + '\n\t\t\t<div class="dhx_alert__footer ' + (i.buttonsAlignment ? "dhx_alert__footer--" + i.buttonsAlignment : "") + '">\n\t\t\t\t<button class="dhx_alert__apply-button dhx_button dhx_button--view_flat dhx_button--color_primary dhx_button--size_medium">' + n + "</button>\n\t\t\t</div>",
                    document.body.appendChild(e),
                    e.querySelector(".dhx_alert__apply-button").focus(),
                    e.querySelector("button").addEventListener("click", function() {
                        o(),
                        document.body.removeChild(e),
                        t(!0)
                    })
                }
                )
            }
        }
        ).call(this, n(6))
    }
    , function(t, o, r) {
        "use strict";
        (function(e) {
            Object.defineProperty(o, "__esModule", {
                value: !0
            });
            var i = r(28)
              , n = r(29);
            o.confirm = function(t) {
                var o = t.buttons && t.buttons[0] ? t.buttons[0] : i.default.apply
                  , r = t.buttons && t.buttons[1] ? t.buttons[1] : i.default.reject
                  , s = n.blockScreen(t.blockerCss);
                return new e(function(e) {
                    var i = document.createElement("div")
                      , n = function(t) {
                        "BUTTON" === t.target.tagName && (t = t.target.classList.contains("dhx_alert__confirm-aply"),
                        s(),
                        i.removeEventListener("click", n),
                        document.body.removeChild(i),
                        e(t))
                    };
                    i.className = "dhx_widget dhx_alert dhx_alert--confirm" + (t.css ? " " + t.css : ""),
                    i.innerHTML = "\n\t\t" + (t.header ? '<div class="dhx_alert__header"> ' + t.header + " </div>" : "") + "\n\t\t" + (t.text ? '<div class="dhx_alert__content">' + t.text + "</div>" : "") + '\n\t\t\t<div class="dhx_alert__footer ' + (t.buttonsAlignment ? "dhx_alert__footer--" + t.buttonsAlignment : "") + '">\n\t\t\t\t<button class="dhx_alert__confirm-aply dhx_button dhx_button--view_link dhx_button--color_primary dhx_button--size_medium">' + o + '</button>\n\t\t\t\t<button class="dhx_alert__confirm-reject dhx_button dhx_button--view_flat dhx_button--color_primary dhx_button--size_medium">' + r + "</button>\n\t\t\t</div>",
                    document.body.appendChild(i),
                    i.querySelector(".dhx_alert__confirm-reject").focus(),
                    i.addEventListener("click", n)
                }
                )
            }
        }
        ).call(this, r(6))
    }
    , function(t, e, i) {
        "use strict";
        var n = this && this.__assign || function() {
            return (n = Object.assign || function(t) {
                for (var e, i = 1, n = arguments.length; i < n; i++)
                    for (var o in e = arguments[i])
                        Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
                return t
            }
            ).apply(this, arguments)
        }
        ;
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var o = i(2)
          , c = i(17)
          , u = 750
          , d = 200;
        function r(t, e, i, n) {
            var o, r, s;
            switch (e) {
            case c.Position.center:
                return (r = t.left + window.pageXOffset + (t.width - i) / 2) + 8 < window.pageXOffset && (r = t.left + window.pageXOffset),
                {
                    left: r,
                    top: s = t.top + window.pageYOffset + (t.height - n) / 2,
                    pos: o = c.RealPosition.center
                };
            case c.Position.right:
                return o = c.RealPosition.right,
                (r = t.right + window.pageXOffset) + i + 8 > window.innerWidth + window.pageXOffset && (r = window.pageXOffset + t.left - i,
                o = c.RealPosition.left),
                {
                    left: r,
                    top: s = window.pageYOffset + t.top + (t.height - n) / 2,
                    pos: o
                };
            case c.Position.bottom:
            default:
                return (r = window.pageXOffset + t.left + (t.width - i) / 2) + i > window.innerWidth + window.pageXOffset ? r = window.innerWidth + window.pageXOffset - i : r < 0 && (r = 0),
                o = c.RealPosition.bottom,
                (s = window.pageYOffset + t.bottom) + n + 8 > window.innerHeight + window.pageYOffset && (s = window.pageYOffset + t.top - n,
                o = c.RealPosition.top),
                {
                    left: r,
                    top: s,
                    pos: o
                }
            }
        }
        e.findPosition = r;
        var h = document.createElement("div")
          , s = document.createElement("span");
        s.className = "dhx_tooltip__text",
        h.appendChild(s),
        h.style.position = "absolute";
        var f, p = null, v = !1, _ = null, g = null;
        function m(t, e, i, n, o) {
            void 0 === o && (o = !1);
            t = t.getBoundingClientRect();
            s.textContent = e,
            document.body.appendChild(h),
            h.className = "dhx_widget dhx_tooltip2" + (o ? " dhx_tooltip--forced" : "");
            e = h.getBoundingClientRect(),
            t = r(t, i, e.width, e.height),
            i = t.left,
            e = t.top,
            t = t.pos;
            switch (t) {
            case c.RealPosition.bottom:
            case c.RealPosition.top:
            case c.RealPosition.left:
            case c.RealPosition.right:
            case c.RealPosition.center:
                h.style.left = i + "px",
                h.style.top = e + "px"
            }
            h.className += " dhx_tooltip--" + t + " " + (n || ""),
            v = !0,
            o || setTimeout(function() {
                h.className += " dhx_tooltip--animate"
            })
        }
        function a(e, t, i) {
            var n = i.force
              , o = i.showDelay
              , r = i.hideDelay
              , s = i.position
              , a = i.css;
            n || (g = setTimeout(function() {
                m(e, t, s || c.Position.bottom, a)
            }, o || u));
            var l = function() {
                var t;
                v && (t = r,
                p && (_ = setTimeout(function() {
                    document.body.removeChild(h),
                    v = !1,
                    _ = null
                }, t || d))),
                clearTimeout(g),
                e.removeEventListener("mouseleave", l),
                e.removeEventListener("blur", l),
                document.removeEventListener("mousedown", l),
                f = p = null
            };
            n && m(e, t, s, a, n),
            e.addEventListener("mouseleave", l),
            e.addEventListener("blur", l),
            document.addEventListener("mousedown", l),
            f = l
        }
        function l(t, e) {
            var i = o.toNode(e.node);
            i !== p && (f && (f(),
            f = null),
            p = i,
            _ ? (clearTimeout(_),
            _ = null,
            a(i, t, n(n({}, e), {
                force: !0
            }))) : a(i, t, e))
        }
        function y(t) {
            t = o.locateNode(t, "dhx_tooltip_text");
            t && l(t.getAttribute("dhx_tooltip_text"), {
                position: t.getAttribute("dhx_tooltip_position") || c.Position.bottom,
                node: t
            })
        }
        e.tooltip = l,
        e.enableTooltip = function() {
            document.addEventListener("mousemove", y)
        }
        ,
        e.disableTooltip = function() {
            document.removeEventListener("mousemove", y)
        }
    }
    , function(t, e, i) {
        "use strict";
        var n, o = this && this.__extends || (n = function(t, e) {
            return (n = Object.setPrototypeOf || {
                __proto__: []
            }instanceof Array && function(t, e) {
                t.__proto__ = e
            }
            || function(t, e) {
                for (var i in e)
                    e.hasOwnProperty(i) && (t[i] = e[i])
            }
            )(t, e)
        }
        ,
        function(t, e) {
            function i() {
                this.constructor = t
            }
            n(t, e),
            t.prototype = null === e ? Object.create(e) : (i.prototype = e.prototype,
            new i)
        }
        ), r = this && this.__spreadArrays || function() {
            for (var t = 0, e = 0, i = arguments.length; e < i; e++)
                t += arguments[e].length;
            for (var n = Array(t), o = 0, e = 0; e < i; e++)
                for (var r = arguments[e], s = 0, a = r.length; s < a; s++,
                o++)
                    n[o] = r[s];
            return n
        }
        ;
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var s, a = i(1), l = i(5), c = i(8), u = i(3), d = i(60), h = i(65), f = i(9), p = i(12), v = i(79), _ = i(80), g = i(31), m = i(81), y = i(82), x = i(83), b = i(32), w = i(0), o = (s = c.View,
        o(I, s),
        I.prototype.destructor = function() {
            this.toolbar.destructor(),
            this._readStack.stop(),
            this.uploader.unlinkDropArea(),
            this.uploader.abort(),
            this.unmount()
        }
        ,
        I.prototype.getRootView = function() {
            return this._layout.getRootView()
        }
        ,
        I.prototype.paint = function() {
            var t = this._canDrop || !this.data.getLength();
            this._activeView = t ? this._emptyField : this.config.mode === p.VaultMode.grid || this.toolbar && this.toolbar.getState().mode === p.VaultMode.grid ? this.grid : this.list,
            this._layout.getCell("vault").attach(this._activeView)
        }
        ,
        I.prototype._initUI = function(t) {
            var e = this._layout = new d.Layout(t,{
                css: "dhx_vault",
                rows: [{
                    id: "toolbar",
                    css: "dhx_vault--toolbar",
                    height: "content"
                }, {
                    id: "vault",
                    css: "dhx_vault--container"
                }],
                on: this._getDragEvents()
            });
            this._initToolbar(),
            e.getCell("toolbar").attach(this.toolbar),
            this._initEmpty(),
            this._initList(),
            this._initGrid(t),
            this.config.toolbar || e.getCell("toolbar").hide(),
            this.paint()
        }
        ,
        I.prototype._initList = function() {
            var t = "ontouchstart"in document.documentElement;
            this.list = new b.List(null,{
                data: this.data,
                dragMode: "both",
                multiselection: t || "ctrlClick",
                template: _.listTemplate,
                eventHandlers: _.getContainersEvents(this.data),
                keyNavigation: !0
            })
        }
        ,
        I.prototype._initGrid = function(t) {
            var e = "ontouchstart"in document.documentElement;
            this.grid = new x.DataView(null,{
                gap: 8,
                itemsInRow: 4,
                dragMode: "both",
                multiselection: e || "ctrlClick",
                data: this.data,
                template: _.gridTemplate,
                eventHandlers: _.getContainersEvents(this.data),
                keyNavigation: !0
            }),
            this.grid.selection = this.list.selection,
            t && ("string" == typeof t && (t = document.getElementById(t)),
            this.grid.config.itemsInRow = Math.floor(t.offsetWidth / 100))
        }
        ,
        I.prototype._initToolbar = function() {
            this.toolbar = new h.Toolbar(null,{
                css: "vault-toolbar"
            }),
            this.toolbar.data.parse([{
                id: "add",
                tooltip: f.default.add,
                type: "navItem",
                css: "dhx_toolbar-button--circle dhx_toolbar-button--icon",
                icon: "dxi dxi-plus"
            }, {
                id: "mode-separator",
                type: "separator"
            }, {
                id: "list",
                tooltip: f.default.list,
                type: "navItem",
                css: "dhx_toolbar-button--circle dhx_toolbar-button--icon",
                icon: "dxi dxi-view-sequential",
                active: this.config.mode === p.VaultMode.list,
                group: "mode"
            }, {
                id: "grid",
                tooltip: f.default.grid,
                type: "navItem",
                css: "dhx_toolbar-button--circle dhx_toolbar-button--icon",
                icon: "dxi dxi-view-grid",
                active: this.config.mode === p.VaultMode.grid,
                group: "mode"
            }, {
                id: "upload-separator",
                type: "separator"
            }, {
                id: "upload",
                tooltip: f.default.upload,
                type: "navItem",
                css: "dhx_toolbar-button--circle dhx_toolbar-button--icon",
                icon: "dxi dxi-vault"
            }, {
                id: "spacer",
                type: "spacer"
            }, {
                id: "remove-all",
                tooltip: f.default.clearAll,
                type: "navItem",
                css: "dhx_toolbar-button--circle dhx_toolbar-button--icon",
                icon: "dxi dxi-delete-forever"
            }]),
            this.config.modeControls || this.toolbar.hide(["mode-separator", "list", "grid", "upload-separator"]),
            this._hideAdditionalButtons()
        }
        ,
        I.prototype._initEmpty = function() {
            var t = this;
            return this._emptyField = c.toViewLike(w.create({
                render: function() {
                    return w.el(".dhx-dropable-area.drop-files-here", [w.el(".dhx-big-icon-block", [w.el(".dxi.dxi-vault")]), !t._canDrop && w.el(".drop-area-bold-text", f.default.dragAndDrop), !t._canDrop && w.el(".drop-area-bold-text", f.default.filesOrFoldersHere), !t._canDrop && w.el(".drop-area-light-text", f.default.or), !t._canDrop && w.el("button.dhx_button.dhx_button--view_flat.dhx_btn--small.dhx_button--color_primary.dhx_button--size_small.dhx_button--view_flat_h40",
                   		{
	                        onclick: function() {
	                            return t.uploader.selectFile()
                        }
                    }, f.default.browse)])
                }
            }))
        }
        ,
        I.prototype._changeUI = function(t) {
            this.config.mode = t,
            this._activeView = t === p.VaultMode.grid ? this.grid : this.list,
            this.data.getLength() && this.paint()
        }
        ,
        I.prototype._initEvents = function() {
            var i = this;
            this.data.events.on(u.DataEvents.change, function() {
                i.data.getLength() ? i._showAdditionalButtons() : i._hideAdditionalButtons(),
                i.config.downloadURL && i.data.forEach(function(t) {
                    t.downloadURL || (t.downloadURL = i.config.downloadURL)
                }),
                i.paint()
            }),
            this.events.on(p.UploaderEvents.uploadBegin, function() {
                i.config.toolbar && i._layout.getCell("toolbar").attach(i._progressBar)
            }),
            this.events.on(p.UploaderEvents.uploadComplete, function() {
                i.config.toolbar && i._layout.getCell("toolbar").attach(i.toolbar)
            }),
            this.toolbar.events.on(h.NavigationBarEvents.click, function(t) {
                switch (t) {
                case "add":
                    i.uploader.selectFile();
                    break;
                case "remove-all":
                    var e;
                    i.data.getLength() && ((e = i._activeView.selection.getItem()) && 0 < e.length ? e.forEach(function(t) {
                        g.removeItem(i.data, t.id)
                    }) : i.data.removeAll());
                    break;
                case "list":
                case "grid":
                    i._changeUI(t);
                    break;
                case "upload":
                    i.uploader.send()
                }
            }),
            this.events.on(p.ProgressBarEvents.cancel, function() {
                i.uploader.abort(),
                i.paint()
            })
        }
        ,
        I.prototype._getDragEvents = function() {
            var o = this
              , r = {
                left: null,
                top: null,
                width: null,
                height: null
            };
            return {
                dragleave: function(t) {
                    o._canDrop && (t.pageX > r.left + r.width - 1 || t.pageX < r.left || t.pageY > r.top + r.height - 1 || t.pageY < r.top) && (o._canDrop = !1,
                    o.config.toolbar && o._layout.getCell("toolbar").show(),
                    o._layout.config.css = "dhx_vault",
                    o.paint())
                },
                dragenter: function(t) {
                    if (t.preventDefault(),
                    !o.uploader.isActive && !o._canDrop) {
                        for (var e = 0, i = t.dataTransfer.types; e < i.length; e++) {
                            var n = i[e];
                            if ("Files" !== n && "application/x-moz-file" !== n)
                                return void (o._canDrop = !1)
                        }
                        o._canDrop = !0;
                        t = o.getRootView().node.el.getBoundingClientRect();
                        r.left = t.left + window.pageXOffset,
                        r.top = t.top + window.pageYOffset,
                        r.width = t.width,
                        r.height = t.height,
                        o._canDrop = !0,
                        o.config.toolbar && o._layout.getCell("toolbar").hide(),
                        o._layout.config.css = "dhx_vault dhx-dragin " + (o._canDrop ? " drop-here" : ""),
                        o.paint()
                    }
                },
                dragover: function(t) {
                    t.preventDefault()
                },
                drop: function(t) {
                    t.preventDefault(),
                    o._canDrop && (t = t.dataTransfer,
                    o.uploader.parseFiles(t),
                    o._canDrop = !1,
                    o.config.toolbar && o._layout.getCell("toolbar").show(),
                    o._layout.config.css = "dhx_vault",
                    o.paint())
                }
            }
        }
        ,
        I.prototype._hideAdditionalButtons = function() {
            var e = this
              , t = ["upload", this.config.modeControls ? "upload-separator" : ""];
            r(["mode-separator", "list", "grid"], t, ["remove-all"]).forEach(function(t) {
                e.toolbar.data.getItem(t) && !e.toolbar.data.getItem(t).hidden && e.toolbar.hide(t)
            })
        }
        ,
        I.prototype._showAdditionalButtons = function() {
            var e = this
              , t = this.config.modeControls ? ["mode-separator", "list", "grid"] : []
              , i = this.uploader.config.autosend ? [] : ["upload", this.config.modeControls ? "upload-separator" : ""]
              , i = r(t, i, ["remove-all"]);
            this.toolbar.data.update("remove-all", {
                tooltip: this._activeView.selection && this._activeView.selection.getItem() ? f.default.clearAllSelected : f.default.clearAll
            }),
            i.forEach(function(t) {
                e.toolbar.data.getItem(t) && e.toolbar.data.getItem(t).hidden && e.toolbar.show(t)
            })
        }
        ,
        I);
        function I(t, e) {
            void 0 === e && (e = {});
            var n = s.call(this, null, a.extend({
                mode: p.VaultMode.list,
                modeControls: !0,
                toolbar: !0,
                updateFromResponse: !0,
                scaleFactor: 4,
                customScroll: !0,
                uploader: {},
                progressBar: {}
            }, e)) || this;
            return n.config.toolbar || (n.config.uploader.autosend = !0),
            e.data ? (n.data = e.data,
            n.events = e.data.events,
            n.events.context = n) : (n.events = new l.EventSystem(n),
            n.data = new u.DataCollection({},n.events)),
            n.data.config.init = function(t) {
                return t.status = t.status || p.FileStatus.uploaded,
                t.file ? (t.size = t.file.size,
                t.name = t.file.name) : (t.size = t.size || 0,
                t.name = t.name || ""),
                t.file && g.isImage(t) && n._readStack.add(t, n.uploader.config.autosend),
                t
            }
            ,
            n._readStack = new y.ReadStackPreview(n.data),
            n.uploader = new v.Uploader(n.config.uploader,n.data,n.events),
            n._progressBar = new m.ProgressBar(n.events,n.config.progressBar),
            n.events.on(p.UploaderEvents.uploadProgress, function(t, e, i) {
                return n._progressBar.setState(t, {
                    current: e,
                    total: i
                })
            }),
            n._initUI(t),
            n._initEvents(),
            n
        }
        e.Vault = o
    }
    , function(t, i, e) {
        "use strict";
        function n(t) {
            for (var e in t)
                i.hasOwnProperty(e) || (i[e] = t[e])
        }
        Object.defineProperty(i, "__esModule", {
            value: !0
        }),
        n(e(61)),
        n(e(13))
    }
    , function(t, e, i) {
        "use strict";
        var n, o = this && this.__extends || (n = function(t, e) {
            return (n = Object.setPrototypeOf || {
                __proto__: []
            }instanceof Array && function(t, e) {
                t.__proto__ = e
            }
            || function(t, e) {
                for (var i in e)
                    e.hasOwnProperty(i) && (t[i] = e[i])
            }
            )(t, e)
        }
        ,
        function(t, e) {
            function i() {
                this.constructor = t
            }
            n(t, e),
            t.prototype = null === e ? Object.create(e) : (i.prototype = e.prototype,
            new i)
        }
        );
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var r, s = i(62), a = i(13), l = i(0), o = (r = s.Cell,
        o(c, r),
        c.prototype.toVDOM = function() {
            if (this._isViewLayout) {
                var t = [this.getCell(this.config.activeView).toVDOM()];
                return r.prototype.toVDOM.call(this, t)
            }
            var e = [];
            return this._cells.forEach(function(t) {
                t = t.toVDOM();
                Array.isArray(t) ? e = e.concat(t) : e.push(t)
            }),
            r.prototype.toVDOM.call(this, e)
        }
        ,
        c.prototype.removeCell = function(e) {
            if (this.events.fire(a.LayoutEvents.beforeRemove, [e])) {
                var t = this.config.parent || this;
                if (t !== this)
                    return t.removeCell(e);
                t = this.getCell(e);
                t && (t = t.getParent(),
                delete this._all[e],
                t._cells = t._cells.filter(function(t) {
                    return t.id !== e
                }),
                t.paint()),
                this.events.fire(a.LayoutEvents.afterRemove, [e])
            }
        }
        ,
        c.prototype.addCell = function(t, e) {
            var i;
            void 0 === e && (e = -1),
            this.events.fire(a.LayoutEvents.beforeAdd, [t.id]) && (i = this._createCell(t),
            e < 0 && (e = this._cells.length + e + 1),
            this._cells.splice(e, 0, i),
            this.paint(),
            this.events.fire(a.LayoutEvents.afterAdd, [t.id]))
        }
        ,
        c.prototype.getId = function(t) {
            return t < 0 && (t = this._cells.length + t),
            this._cells[t] ? this._cells[t].id : void 0
        }
        ,
        c.prototype.getRefs = function(t) {
            return this._root.getRootView().refs[t]
        }
        ,
        c.prototype.getCell = function(t) {
            return this._root._all[t]
        }
        ,
        c.prototype.forEach = function(t, e, i) {
            if (void 0 === i && (i = 1 / 0),
            this._haveCells(e) && !(i < 1))
                for (var n = (e ? this._root._all[e] : this._root)._cells, o = 0; o < n.length; o++) {
                    var r = n[o];
                    t.call(this, r, o, n),
                    this._haveCells(r.id) && r.forEach(t, r.id, --i)
                }
        }
        ,
        c.prototype.cell = function(t) {
            return this.getCell(t)
        }
        ,
        c.prototype._getCss = function(t) {
            var e = this._xLayout ? "dhx_layout-columns" : "dhx_layout-rows"
              , i = this.config.align ? " " + e + "--" + this.config.align : "";
            if (t)
                return e + " dhx_layout-cell" + (this.config.align ? " dhx_layout-cell--" + this.config.align : "");
            var n = this.config.parent ? r.prototype._getCss.call(this) : "dhx_widget dhx_layout"
              , t = this.config.parent ? "" : " dhx_layout-cell";
            return n + (this.config.full ? t : " " + e) + i
        }
        ,
        c.prototype._parseConfig = function() {
            var e = this
              , t = this.config
              , i = t.rows || t.cols || t.views || [];
            this._xLayout = !t.rows,
            this._cells = i.map(function(t) {
                return e._createCell(t)
            })
        }
        ,
        c.prototype._createCell = function(t) {
            t = t.rows || t.cols || t.views ? (!t.type && this._root.config.type && (t.type = this._root.config.type),
            t.parent = this._root,
            new c(this,t)) : new s.Cell(this,t);
            return this._root._all[t.id] = t
        }
        ,
        c.prototype._haveCells = function(t) {
            if (t) {
                t = this._root._all[t];
                return t._cells && 0 < t._cells.length
            }
            return 0 < Object.keys(this._all).length
        }
        ,
        c);
        function c(t, e) {
            var i = r.call(this, t, e) || this;
            return i._root = i.config.parent || i,
            i._all = {},
            i._parseConfig(),
            i.config.activeTab && (i.config.activeView = i.config.activeTab),
            i.config.views && (i.config.activeView = i.config.activeView || i._cells[0].id,
            i._isViewLayout = !0),
            e.parent || (e = l.create({
                render: function() {
                    return i.toVDOM()
                }
            }, i),
            i.mount(t, e)),
            i
        }
        e.Layout = o
    }
    , function(t, e, i) {
        "use strict";
        var n, o = this && this.__extends || (n = function(t, e) {
            return (n = Object.setPrototypeOf || {
                __proto__: []
            }instanceof Array && function(t, e) {
                t.__proto__ = e
            }
            || function(t, e) {
                for (var i in e)
                    e.hasOwnProperty(i) && (t[i] = e[i])
            }
            )(t, e)
        }
        ,
        function(t, e) {
            function i() {
                this.constructor = t
            }
            n(t, e),
            t.prototype = null === e ? Object.create(e) : (i.prototype = e.prototype,
            new i)
        }
        ), c = this && this.__assign || function() {
            return (c = Object.assign || function(t) {
                for (var e, i = 1, n = arguments.length; i < n; i++)
                    for (var o in e = arguments[i])
                        Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
                return t
            }
            ).apply(this, arguments)
        }
        ;
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var r, g = i(1), u = i(0), s = i(8), l = i(13), d = i(64), a = i(5), h = i(22), o = (r = s.View,
        o(f, r),
        f.prototype.paint = function() {
            var t;
            this.isVisible() && ((t = this.getRootView()) ? t.redraw() : this._parent.paint())
        }
        ,
        f.prototype.isVisible = function() {
            if (!this._parent)
                return !(!this._container || !this._container.tagName) || Boolean(this.getRootNode());
            var t = this._parent.config.activeView;
            return (!t || t === this.id) && (!this.config.hidden && (!this._parent || this._parent.isVisible()))
        }
        ,
        f.prototype.hide = function() {
            this.events.fire(l.LayoutEvents.beforeHide, [this.id]) && (this.config.hidden = !0,
            this._parent && this._parent.paint && this._parent.paint(),
            this.events.fire(l.LayoutEvents.afterHide, [this.id]))
        }
        ,
        f.prototype.show = function() {
            this.events.fire(l.LayoutEvents.beforeShow, [this.id]) && (this._parent && this._parent.config && void 0 !== this._parent.config.activeView ? this._parent.config.activeView = this.id : this.config.hidden = !1,
            this._parent && !this._parent.isVisible() && this._parent.show(),
            this.paint(),
            this.events.fire(l.LayoutEvents.afterShow, [this.id]))
        }
        ,
        f.prototype.expand = function() {
            this.events.fire(l.LayoutEvents.beforeExpand, [this.id]) && (this.config.collapsed = !1,
            this.events.fire(l.LayoutEvents.afterExpand, [this.id]),
            this.paint())
        }
        ,
        f.prototype.collapse = function() {
            this.events.fire(l.LayoutEvents.beforeCollapse, [this.id]) && (this.config.collapsed = !0,
            this.events.fire(l.LayoutEvents.afterCollapse, [this.id]),
            this.paint())
        }
        ,
        f.prototype.toggle = function() {
            this.config.collapsed ? this.expand() : this.collapse()
        }
        ,
        f.prototype.getParent = function() {
            return this._parent
        }
        ,
        f.prototype.destructor = function() {
            this.config = null,
            this.unmount()
        }
        ,
        f.prototype.getWidget = function() {
            return this._ui
        }
        ,
        f.prototype.getCellView = function() {
            return this._parent && this._parent.getRefs(this._uid)
        }
        ,
        f.prototype.attach = function(t, e) {
            return this.config.html = null,
            "object" == typeof t ? this._ui = t : "string" == typeof t ? this._ui = new window.dhx[t](null,e) : "function" == typeof t && (t.prototype instanceof s.View ? this._ui = new t(null,e) : this._ui = {
                getRootView: function() {
                    return t(e)
                }
            }),
            this.paint(),
            this._ui
        }
        ,
        f.prototype.attachHTML = function(t) {
            this.config.html = t,
            this.paint()
        }
        ,
        f.prototype.toVDOM = function(t) {
            if (null === this.config && (this.config = {}),
            !this.config.hidden) {
                var e = this._calculateStyle()
                  , i = g.isDefined(this.config.padding) ? isNaN(Number(this.config.padding)) ? {
                    padding: this.config.padding
                } : {
                    padding: this.config.padding + "px"
                } : ""
                  , n = this.config.full || this.config.html ? e : c(c({}, e), i)
                  , o = this._cssManager.add(n)
                  , r = this._ui ? ((l = this._ui.getRootView()).render && (l = u.inject(l)),
                [l]) : t || null
                  , e = !this.config.resizable || this._isLastCell() || this.config.collapsed ? null : u.el(".dhx_layout-resizer." + (this._isXDirection() ? "dhx_layout-resizer--x" : "dhx_layout-resizer--y"), c(c({}, this._resizerHandlers), {
                    _ref: "resizer_" + this._uid
                }), [u.el("span.dhx_layout-resizer__icon", {
                    class: "dxi " + (this._isXDirection() ? "dxi-dots-vertical" : "dxi-dots-horizontal")
                })])
                  , s = {};
                if (this.config.on)
                    for (var a in this.config.on)
                        s["on" + a] = this.config.on[a];
                var l = ""
                  , t = this.config.cols || this.config.rows;
                if (this.config.type && t)
                    switch (this.config.type) {
                    case "line":
                        l = " dhx_layout-line";
                        break;
                    case "wide":
                        l = " dhx_layout-wide";
                        break;
                    case "space":
                        l = " dhx_layout-space"
                    }
                r = u.el("div", c(c(((t = {
                    _key: this._uid,
                    _ref: this._uid
                })["aria-labelledby"] = this.config.id ? "tab-content-" + this.config.id : null,
                t), s), {
                    class: this._getCss(!1) + (this.config.css ? " " + this.config.css : "") + (n ? " " + o : "") + (this.config.collapsed ? " dhx_layout-cell--collapsed" : "") + (this.config.resizable ? " dhx_layout-cell--resizable" : "") + (this.config.type ? l : "")
                }), this.config.full ? [u.el("div", {
                    tabindex: this.config.collapsable ? "0" : "-1",
                    class: "dhx_layout-cell-header" + (this._isXDirection() ? " dhx_layout-cell-header--col" : " dhx_layout-cell-header--row") + (this.config.collapsable ? " dhx_layout-cell-header--collapseble" : "") + (this.config.collapsed ? " dhx_layout-cell-header--collapsed" : "") + (((this.getParent() || {}).config || {}).isAccordion ? " dhx_layout-cell-header--accordion" : ""),
                    style: {
                        height: this.config.headerHeight
                    },
                    onclick: this._handlers.toggle,
                    onkeydown: this._handlers.enterCollapse
                }, [this.config.headerIcon && u.el("span.dhx_layout-cell-header__icon", {
                    class: this.config.headerIcon
                }), this.config.headerImage && u.el(".dhx_layout-cell-header__image-wrapper", [u.el("img", {
                    src: this.config.headerImage,
                    class: "dhx_layout-cell-header__image"
                })]), this.config.header && u.el("h3.dhx_layout-cell-header__title", this.config.header), this.config.collapsable ? u.el("div.dhx_layout-cell-header__collapse-icon", {
                    class: this._getCollapseIcon()
                }) : u.el("div.dhx_layout-cell-header__collapse-icon", {
                    class: "dxi dxi-empty"
                })]), this.config.collapsed ? null : u.el("div", {
                    style: c(c({}, i), {
                        height: "calc(100% - " + (this.config.headerHeight || 37) + "px)"
                    }),
                    ".innerHTML": this.config.html,
                    class: this._getCss(!0) + " dhx_layout-cell-content"
                }, r)] : this.config.html && !r ? [u.el(".dhx_layout-cell-content", {
                    ".innerHTML": this.config.html,
                    style: i
                })] : r);
                return e ? [r, e] : r
            }
        }
        ,
        f.prototype._getCss = function(t) {
            return "dhx_layout-cell"
        }
        ,
        f.prototype._initHandlers = function() {
            function e(t) {
                if (s.isActive && s.mode !== l.resizeMode.unknown) {
                    var e = (t.targetTouches ? t.targetTouches[0] : t).clientX
                      , t = (t.targetTouches ? t.targetTouches[0] : t).clientY
                      , e = s.xLayout ? e - s.range.min + window.pageXOffset : t - s.range.min + window.pageYOffset
                      , t = s.xLayout ? "width" : "height";
                    switch (e < 0 ? e = s.resizerLength / 2 : e > s.size && (e = s.size - s.resizerLength),
                    s.mode) {
                    case l.resizeMode.pixels:
                        r.config[t] = e - s.resizerLength / 2 + "px",
                        s.nextCell.config[t] = s.size - e - s.resizerLength / 2 + "px";
                        break;
                    case l.resizeMode.mixedpx1:
                        r.config[t] = e - s.resizerLength / 2 + "px";
                        break;
                    case l.resizeMode.mixedpx2:
                        s.nextCell.config[t] = s.size - e - s.resizerLength / 2 + "px";
                        break;
                    case l.resizeMode.percents:
                        r.config[t] = e / s.size * s.percentsum + "%",
                        s.nextCell.config[t] = (s.size - e) / s.size * s.percentsum + "%";
                        break;
                    case l.resizeMode.mixedperc1:
                        r.config[t] = e / s.size * s.percentsum + "%";
                        break;
                    case l.resizeMode.mixedperc2:
                        s.nextCell.config[t] = (s.size - e) / s.size * s.percentsum + "%"
                    }
                    r.paint(),
                    r.events.fire(l.LayoutEvents.resize, [r.id])
                }
            }
            function i(t) {
                var e, i, n, o;
                t.targetTouches && t.preventDefault(),
                3 !== t.which && (s.isActive && a(t),
                r.events.fire(l.LayoutEvents.beforeResizeStart, [r.id]) && (document.body.classList.add("dhx_no-select--resize"),
                i = r.getCellView(),
                n = (e = r._getNextCell()).getCellView(),
                t = r._getResizerView(),
                i = i.el.getBoundingClientRect(),
                t = t.el.getBoundingClientRect(),
                n = n.el.getBoundingClientRect(),
                s.xLayout = r._isXDirection(),
                s.left = i.left + window.pageXOffset,
                s.top = i.top + window.pageYOffset,
                s.margin = d.getMarginSize(r.getParent().config, s.xLayout),
                s.range = d.getBlockRange(i, n, s.xLayout),
                s.size = s.range.max - s.range.min - s.margin,
                s.isActive = !0,
                s.nextCell = e,
                s.resizerLength = s.xLayout ? t.width : t.height,
                s.mode = d.getResizeMode(s.xLayout, r.config, e.config),
                s.mode === l.resizeMode.percents && (o = s.xLayout ? "width" : "height",
                s.percentsum = parseFloat(r.config[o].slice(0, -1)) + parseFloat(e.config[o].slice(0, -1))),
                s.mode === l.resizeMode.mixedperc1 && (o = s.xLayout ? "width" : "height",
                s.percentsum = 1 / (i[o] / (s.size - s.resizerLength)) * parseFloat(r.config[o].slice(0, -1))),
                s.mode === l.resizeMode.mixedperc2 && (o = s.xLayout ? "width" : "height",
                s.percentsum = 1 / (n[o] / (s.size - s.resizerLength)) * parseFloat(e.config[o]))))
            }
            var r = this
              , s = {
                left: null,
                top: null,
                isActive: !(this._handlers = {
                    enterCollapse: function(t) {
                        13 === t.keyCode && r._handlers.toggle()
                    },
                    collapse: function() {
                        r.config.collapsable && r.collapse()
                    },
                    expand: function() {
                        r.config.collapsable && r.expand()
                    },
                    toggle: function() {
                        r.config.collapsable && r.toggle()
                    }
                }),
                range: null,
                xLayout: null,
                nextCell: null,
                size: null,
                resizerLength: null,
                mode: null,
                percentsum: null,
                margin: null
            }
              , a = function(t) {
                s.isActive = !1,
                document.body.classList.remove("dhx_no-select--resize"),
                t.targetTouches ? (document.removeEventListener("touchend", a),
                document.removeEventListener("touchmove", e)) : (document.removeEventListener("mouseup", a),
                document.removeEventListener("mousemove", e)),
                r.events.fire(l.LayoutEvents.afterResizeEnd, [r.id])
            };
            this._resizerHandlers = {
                onmousedown: function(t) {
                    i(t),
                    document.addEventListener("mouseup", a),
                    document.addEventListener("mousemove", e)
                },
                ontouchstart: function(t) {
                    i(t),
                    document.addEventListener("touchend", a),
                    document.addEventListener("touchmove", e)
                },
                ondragstart: function(t) {
                    return t.preventDefault()
                }
            }
        }
        ,
        f.prototype._getCollapseIcon = function() {
            return this._isXDirection() && this.config.collapsed ? "dxi dxi-chevron-right" : this._isXDirection() && !this.config.collapsed ? "dxi dxi-chevron-left" : !this._isXDirection() && this.config.collapsed ? "dxi dxi-chevron-up" : this._isXDirection() || this.config.collapsed ? void 0 : "dxi dxi-chevron-down"
        }
        ,
        f.prototype._isLastCell = function() {
            var t = this._parent;
            return t && t._cells.indexOf(this) === t._cells.length - 1
        }
        ,
        f.prototype._getNextCell = function() {
            var t = this._parent
              , e = t._cells.indexOf(this);
            return t._cells[e + 1]
        }
        ,
        f.prototype._getResizerView = function() {
            return this._parent.getRefs("resizer_" + this._uid)
        }
        ,
        f.prototype._isXDirection = function() {
            return this._parent && this._parent._xLayout
        }
        ,
        f.prototype._calculateStyle = function() {
            var t = this.config;
            if (t) {
                var e = {}
                  , i = !1
                  , n = !1;
                isNaN(Number(t.width)) || (t.width = t.width + "px"),
                isNaN(Number(t.height)) || (t.height = t.height + "px"),
                isNaN(Number(t.minWidth)) || (t.minWidth = t.minWidth + "px"),
                isNaN(Number(t.minHeight)) || (t.minHeight = t.minHeight + "px"),
                isNaN(Number(t.maxWidth)) || (t.maxWidth = t.maxWidth + "px"),
                isNaN(Number(t.maxHeight)) || (t.maxHeight = t.maxHeight + "px"),
                "content" === t.width && (i = !0),
                "content" === t.height && (n = !0);
                var o = t.width
                  , r = t.height
                  , s = t.cols
                  , a = t.rows
                  , l = t.minWidth
                  , c = t.minHeight
                  , u = t.maxWidth
                  , d = t.maxHeight
                  , h = t.gravity
                  , f = t.collapsed
                  , p = -1 === g.sign(h) ? 0 : h;
                "boolean" == typeof h && (p = h ? 1 : 0);
                var v = "boolean" == typeof h ? !h : -1 === g.sign(h);
                this._isXDirection() ? (o || void 0 === h && (l || u)) && (v = !0) : (r || void 0 === h && (c || d)) && (v = !0);
                var _, v = v ? 0 : p || 1, p = this._isXDirection() ? "x" : "y";
                return void 0 !== l && (e.minWidth = l),
                void 0 !== c && (e.minHeight = c),
                void 0 !== u && (e.maxWidth = u),
                void 0 !== d && (e.maxHeight = d),
                void 0 === this._parent && (p = !0),
                void 0 !== o && "content" !== o ? e.width = o : !0 === p ? e.width = "100%" : "x" === p && (i ? e.flex = "0 0 auto" : (_ = this._isXDirection() ? "1px" : "auto",
                e.flex = v + " " + (s || a ? "0 " + _ : "1 auto"))),
                void 0 !== r && "content" !== r ? e.height = r : !0 === p ? e.height = "100%" : "y" === p && (n ? e.flex = "0 0 auto" : (_ = this._isXDirection() ? "auto" : "1px",
                e.flex = v + " " + (s || a ? "0 " + _ : "1 auto"))),
                !0 === p && void 0 === t.width && void 0 === t.height && (e.flex = v + " 1 auto"),
                f && (this._isXDirection() ? e.width = "auto" : e.height = "auto",
                e.flex = "0 0 auto"),
                e
            }
        }
        ,
        f);
        function f(t, e) {
            e = r.call(this, t, e) || this;
            return e._disabled = [],
            t && t.isVisible && (e._parent = t),
            e._parent && e._parent.events ? e.events = e._parent.events : e.events = new a.EventSystem(e),
            e._cssManager = new h.CssManager,
            e.config.full = void 0 === e.config.full ? Boolean(e.config.header || e.config.collapsable || e.config.headerHeight || e.config.headerIcon || e.config.headerImage) : e.config.full,
            e._initHandlers(),
            e.id = e.config.id || g.uid(),
            e
        }
        e.Cell = o
    }
    , function(t, e, i) {
        /**
* Copyright (c) 2017, Leon Sorokin
* All rights reserved. (MIT Licensed)
*
* domvm.js (DOM ViewModel)
* A thin, fast, dependency-free vdom view layer
* @preserve https://github.com/leeoniya/domvm (v3.2.6, micro build)
*/
        t.exports = function() {
            "use strict";
            var S = 1, l = 2, C = 3, O = 4, M = 5, t = typeof window !== "undefined", e, r = (t ? window : {}).requestAnimationFrame, c = {};
            function i() {}
            var p = Array.isArray;
            function u(t) {
                return t != null
            }
            function s(t) {
                return t != null && t.constructor === Object
            }
            function o(t, e, i, n) {
                t.splice.apply(t, [i, n].concat(e))
            }
            function a(t) {
                var e = typeof t;
                return e === "string" || e === "number"
            }
            function d(t) {
                return typeof t === "function"
            }
            function h(t) {
                return typeof t === "object" && d(t.then)
            }
            function f(t) {
                var e = arguments;
                for (var i = 1; i < e.length; i++) {
                    for (var n in e[i]) {
                        t[n] = e[i][n]
                    }
                }
                return t
            }
            function v(t, e, i) {
                var n;
                while (n = e.shift()) {
                    if (e.length === 0) {
                        t[n] = i
                    } else {
                        t[n] = t = t[n] || {}
                    }
                }
            }
            function _(t, e) {
                var i = [];
                for (var n = e; n < t.length; n++) {
                    i.push(t[n])
                }
                return i
            }
            function g(t, e) {
                for (var i in t) {
                    if (t[i] !== e[i]) {
                        return false
                    }
                }
                return true
            }
            function m(t, e) {
                var i = t.length;
                if (e.length !== i) {
                    return false
                }
                for (var n = 0; n < i; n++) {
                    if (t[n] !== e[n]) {
                        return false
                    }
                }
                return true
            }
            function y(t) {
                if (!r) {
                    return t
                }
                var e, i, n;
                function o() {
                    e = 0;
                    t.apply(i, n)
                }
                return function() {
                    i = this;
                    n = arguments;
                    if (!e) {
                        e = r(o)
                    }
                }
            }
            function x(t, e, i) {
                return function() {
                    return t.apply(i, e)
                }
            }
            function b(t) {
                var e = t.slice();
                var i = [];
                i.push(0);
                var n;
                var o;
                for (var r = 0, s = t.length; r < s; ++r) {
                    var a = i[i.length - 1];
                    if (t[a] < t[r]) {
                        e[r] = a;
                        i.push(r);
                        continue
                    }
                    n = 0;
                    o = i.length - 1;
                    while (n < o) {
                        var l = (n + o) / 2 | 0;
                        if (t[i[l]] < t[r]) {
                            n = l + 1
                        } else {
                            o = l
                        }
                    }
                    if (t[r] < t[i[n]]) {
                        if (n > 0) {
                            e[r] = i[n - 1]
                        }
                        i[n] = r
                    }
                }
                n = i.length;
                o = i[n - 1];
                while (n-- > 0) {
                    i[n] = o;
                    o = e[o]
                }
                return i
            }
            function w(t, e) {
                var i = 0;
                var n = e.length - 1;
                var o;
                var r = n <= 2147483647 ? true : false;
                if (r) {
                    while (i <= n) {
                        o = i + n >> 1;
                        if (e[o] === t) {
                            return o
                        } else {
                            if (e[o] < t) {
                                i = o + 1
                            } else {
                                n = o - 1
                            }
                        }
                    }
                } else {
                    while (i <= n) {
                        o = Math.floor((i + n) / 2);
                        if (e[o] === t) {
                            return o
                        } else {
                            if (e[o] < t) {
                                i = o + 1
                            } else {
                                n = o - 1
                            }
                        }
                    }
                }
                return i == e.length ? null : i
            }
            function I(t) {
                return t[0] === "o" && t[1] === "n"
            }
            function E(t) {
                return t[0] === "_"
            }
            function k(t) {
                return t === "style"
            }
            function D(t) {
                t && t.el && t.el.offsetHeight
            }
            function T(t) {
                return t.node != null && t.node.el != null
            }
            function L(t, e) {
                switch (e) {
                case "value":
                case "checked":
                case "selected":
                    return true
                }
                return false
            }
            function P(t) {
                t = t || c;
                while (t.vm == null && t.parent) {
                    t = t.parent
                }
                return t.vm
            }
            function j() {}
            var n = j.prototype = {
                constructor: j,
                type: null,
                vm: null,
                key: null,
                ref: null,
                data: null,
                hooks: null,
                ns: null,
                el: null,
                tag: null,
                attrs: null,
                body: null,
                flags: 0,
                _class: null,
                _diff: null,
                _dead: false,
                _lis: false,
                idx: null,
                parent: null
            };
            function A(t) {
                var e = new j;
                e.type = l;
                e.body = t;
                return e
            }
            var R = {}
              , H = /\[(\w+)(?:=(\w+))?\]/g;
            function N(t) {
                {
                    var e = R[t];
                    if (e == null) {
                        var i, n, o, r;
                        R[t] = e = {
                            tag: (i = t.match(/^[-\w]+/)) ? i[0] : "div",
                            id: (n = t.match(/#([-\w]+)/)) ? n[1] : null,
                            class: (o = t.match(/\.([-\w.]+)/)) ? o[1].replace(/\./g, " ") : null,
                            attrs: null
                        };
                        while (r = H.exec(t)) {
                            if (e.attrs == null) {
                                e.attrs = {}
                            }
                            e.attrs[r[1]] = r[2] || ""
                        }
                    }
                    return e
                }
            }
            var F = 1
              , z = 2
              , V = 4
              , B = 8;
            function W(t, e, i, n) {
                var o = new j;
                o.type = S;
                if (u(n)) {
                    o.flags = n
                }
                o.attrs = e;
                var r = N(t);
                o.tag = r.tag;
                if (r.id || r.class || r.attrs) {
                    var s = o.attrs || {};
                    if (r.id && !u(s.id)) {
                        s.id = r.id
                    }
                    if (r.class) {
                        o._class = r.class;
                        s.class = r.class + (u(s.class) ? " " + s.class : "")
                    }
                    if (r.attrs) {
                        for (var a in r.attrs) {
                            if (!u(s[a])) {
                                s[a] = r.attrs[a]
                            }
                        }
                    }
                    o.attrs = s
                }
                var l = o.attrs;
                if (u(l)) {
                    if (u(l._key)) {
                        o.key = l._key
                    }
                    if (u(l._ref)) {
                        o.ref = l._ref
                    }
                    if (u(l._hooks)) {
                        o.hooks = l._hooks
                    }
                    if (u(l._data)) {
                        o.data = l._data
                    }
                    if (u(l._flags)) {
                        o.flags = l._flags
                    }
                    if (!u(o.key)) {
                        if (u(o.ref)) {
                            o.key = o.ref
                        } else if (u(l.id)) {
                            o.key = l.id
                        } else if (u(l.name)) {
                            o.key = l.name + (l.type === "radio" || l.type === "checkbox" ? l.value : "")
                        }
                    }
                }
                if (i != null) {
                    o.body = i
                }
                return o
            }
            function U(t, e, i) {
                var n = ["refs"].concat(e.split("."));
                v(t, n, i)
            }
            function $(t) {
                while (t = t.parent) {
                    t.flags |= F
                }
            }
            function G(t, e, i, n) {
                if (t.type === M || t.type === O) {
                    return
                }
                t.parent = e;
                t.idx = i;
                t.vm = n;
                if (t.ref != null) {
                    U(P(t), t.ref, t)
                }
                var o = t.hooks
                  , r = n && n.hooks;
                if (o && (o.willRemove || o.didRemove) || r && (r.willUnmount || r.didUnmount)) {
                    $(t)
                }
                if (p(t.body)) {
                    X(t)
                } else {}
            }
            function X(t) {
                var e = t.body;
                for (var i = 0; i < e.length; i++) {
                    var n = e[i];
                    if (n === false || n == null) {
                        e.splice(i--, 1)
                    } else if (p(n)) {
                        o(e, n, i--, 1)
                    } else {
                        if (n.type == null) {
                            e[i] = n = A("" + n)
                        }
                        if (n.type === l) {
                            if (n.body == null || n.body === "") {
                                e.splice(i--, 1)
                            } else if (i > 0 && e[i - 1].type === l) {
                                e[i - 1].body += n.body;
                                e.splice(i--, 1)
                            } else {
                                G(n, t, i, null)
                            }
                        } else {
                            G(n, t, i, null)
                        }
                    }
                }
            }
            var Y = {
                animationIterationCount: true,
                boxFlex: true,
                boxFlexGroup: true,
                boxOrdinalGroup: true,
                columnCount: true,
                flex: true,
                flexGrow: true,
                flexPositive: true,
                flexShrink: true,
                flexNegative: true,
                flexOrder: true,
                gridRow: true,
                gridColumn: true,
                order: true,
                lineClamp: true,
                borderImageOutset: true,
                borderImageSlice: true,
                borderImageWidth: true,
                fontWeight: true,
                lineHeight: true,
                opacity: true,
                orphans: true,
                tabSize: true,
                widows: true,
                zIndex: true,
                zoom: true,
                fillOpacity: true,
                floodOpacity: true,
                stopOpacity: true,
                strokeDasharray: true,
                strokeDashoffset: true,
                strokeMiterlimit: true,
                strokeOpacity: true,
                strokeWidth: true
            };
            function Z(t, e) {
                {
                    return !isNaN(e) && !Y[t] ? e + "px" : e
                }
            }
            function J(t, e) {
                var i = (t.attrs || c).style;
                var n = e ? (e.attrs || c).style : null;
                if (i == null || a(i)) {
                    t.el.style.cssText = i
                } else {
                    for (var o in i) {
                        var r = i[o];
                        if (n == null || r != null && r !== n[o]) {
                            t.el.style[o] = Z(o, r)
                        }
                    }
                    if (n) {
                        for (var s in n) {
                            if (i[s] == null) {
                                t.el.style[s] = ""
                            }
                        }
                    }
                }
            }
            var q = [];
            function K(t, e, i, n, o) {
                if (t != null) {
                    var r = i.hooks[e];
                    if (r) {
                        if (e[0] === "d" && e[1] === "i" && e[2] === "d") {
                            o ? D(i.parent) && r(i, n) : q.push([r, i, n])
                        } else {
                            return r(i, n)
                        }
                    }
                }
            }
            function Q(t) {
                if (q.length) {
                    D(t.node);
                    var e;
                    while (e = q.shift()) {
                        e[0](e[1], e[2])
                    }
                }
            }
            var tt = t ? document : null;
            function et(t) {
                while (t._node == null) {
                    t = t.parentNode
                }
                return t._node
            }
            function it(t, e) {
                if (e != null) {
                    return tt.createElementNS(e, t)
                }
                return tt.createElement(t)
            }
            function nt(t) {
                return tt.createTextNode(t)
            }
            function ot(t) {
                return tt.createComment(t)
            }
            function rt(t) {
                return t.nextSibling
            }
            function st(t) {
                return t.previousSibling
            }
            function at(t) {
                var e = t.vm;
                var i = e != null && K(e.hooks, "willUnmount", e, e.data);
                var n = K(t.hooks, "willRemove", t);
                if ((t.flags & F) === F && p(t.body)) {
                    for (var o = 0; o < t.body.length; o++) {
                        at(t.body[o])
                    }
                }
                return i || n
            }
            function lt(t, e, i) {
                var n = e._node
                  , o = n.vm;
                if (p(n.body)) {
                    if ((n.flags & F) === F) {
                        for (var r = 0; r < n.body.length; r++) {
                            lt(e, n.body[r].el)
                        }
                    } else {
                        ut(n)
                    }
                }
                delete e._node;
                t.removeChild(e);
                K(n.hooks, "didRemove", n, null, i);
                if (o != null) {
                    K(o.hooks, "didUnmount", o, o.data, i);
                    o.node = null
                }
            }
            function ct(t, e) {
                var i = e._node;
                if (i._dead) {
                    return
                }
                var n = at(i);
                if (n != null && h(n)) {
                    i._dead = true;
                    n.then(x(lt, [t, e, true]))
                } else {
                    lt(t, e)
                }
            }
            function ut(t) {
                var e = t.body;
                for (var i = 0; i < e.length; i++) {
                    var n = e[i];
                    delete n.el._node;
                    if (n.vm != null) {
                        n.vm.node = null
                    }
                    if (p(n.body)) {
                        ut(n)
                    }
                }
            }
            function dt(t) {
                var e = t.el;
                if ((t.flags & F) === 0) {
                    p(t.body) && ut(t);
                    e.textContent = null
                } else {
                    var i = e.firstChild;
                    do {
                        var n = rt(i);
                        ct(e, i)
                    } while (i = n)
                }
            }
            function ht(t, e, i) {
                var n = e._node
                  , o = e.parentNode != null;
                var r = e === i || !o ? n.vm : null;
                if (r != null) {
                    K(r.hooks, "willMount", r, r.data)
                }
                K(n.hooks, o ? "willReinsert" : "willInsert", n);
                t.insertBefore(e, i);
                K(n.hooks, o ? "didReinsert" : "didInsert", n);
                if (r != null) {
                    K(r.hooks, "didMount", r, r.data)
                }
            }
            function ft(t, e, i) {
                ht(t, e, i ? rt(i) : null)
            }
            var pt = {};
            function vt(t) {
                f(pt, t)
            }
            function _t(t) {
                var e = this
                  , i = e
                  , n = _(arguments, 1).concat(i, i.data);
                do {
                    var o = e.onemit
                      , o = o ? o[t] : null;
                    if (o) {
                        o.apply(e, n);
                        break
                    }
                } while (e = e.parent());
                if (pt[t])
                    pt[t].apply(e, n)
            }
            var gt = i;
            function mt(t) {
                gt = t.onevent || gt;
                {
                    if (t.onemit) {
                        vt(t.onemit)
                    }
                }
            }
            function yt(t, e, i) {
                t[e] = i
            }
            function xt(t, e, i, n, o) {
                var r = t.apply(o, e.concat([i, n, o, o.data]));
                o.onevent(i, n, o, o.data, e);
                gt.call(null, i, n, o, o.data, e);
                if (r === false) {
                    i.preventDefault();
                    i.stopPropagation()
                }
            }
            function bt(t) {
                var e = et(t.target);
                var i = P(e);
                var n = t.currentTarget._node.attrs["on" + t.type], o, r;
                if (p(n)) {
                    o = n[0];
                    r = n.slice(1);
                    xt(o, r, t, e, i)
                } else {
                    for (var s in n) {
                        if (t.target.matches(s)) {
                            var a = n[s];
                            if (p(a)) {
                                o = a[0];
                                r = a.slice(1)
                            } else {
                                o = a;
                                r = []
                            }
                            xt(o, r, t, e, i)
                        }
                    }
                }
            }
            function wt(t, e, i, n) {
                if (i === n) {
                    return
                }
                var o = t.el;
                if (i == null || d(i)) {
                    yt(o, e, i)
                } else if (n == null) {
                    yt(o, e, bt)
                }
            }
            function It(t, e, i) {
                if (e[0] === ".") {
                    e = e.substr(1);
                    i = true
                }
                if (i) {
                    t.el[e] = ""
                } else {
                    t.el.removeAttribute(e)
                }
            }
            function Et(t, e, i, n, o) {
                var r = t.el;
                if (i == null) {
                    !o && It(t, e, false)
                } else if (t.ns != null) {
                    r.setAttribute(e, i)
                } else if (e === "class") {
                    r.className = i
                } else if (e === "id" || typeof i === "boolean" || n) {
                    r[e] = i
                } else if (e[0] === ".") {
                    r[e.substr(1)] = i
                } else {
                    r.setAttribute(e, i)
                }
            }
            function kt(t, e, i) {
                var n = t.attrs || c;
                var o = e.attrs || c;
                if (n === o) {} else {
                    for (var r in n) {
                        var s = n[r];
                        var a = L(t.tag, r);
                        var l = a ? t.el[r] : o[r];
                        if (s === l) {} else if (k(r)) {
                            J(t, e)
                        } else if (E(r)) {} else if (I(r)) {
                            wt(t, r, s, l)
                        } else {
                            Et(t, r, s, a, i)
                        }
                    }
                    for (var r in o) {
                        !(r in n) && !E(r) && It(t, r, L(t.tag, r) || I(r))
                    }
                }
            }
            function Dt(t, e, i, n) {
                if (t.type === O) {
                    e = t.data;
                    i = t.key;
                    n = t.opts;
                    t = t.view
                }
                return new Gt(t,e,i,n)
            }
            function St(t) {
                for (var e = 0; e < t.body.length; e++) {
                    var i = t.body[e];
                    var n = i.type;
                    if (n <= C) {
                        ht(t.el, Ct(i))
                    } else if (n === O) {
                        var o = Dt(i.view, i.data, i.key, i.opts)._redraw(t, e, false);
                        n = o.node.type;
                        ht(t.el, Ct(o.node))
                    } else if (n === M) {
                        var o = i.vm;
                        o._redraw(t, e);
                        n = o.node.type;
                        ht(t.el, o.node.el)
                    }
                }
            }
            function Ct(t, e) {
                if (t.el == null) {
                    if (t.type === S) {
                        t.el = e || it(t.tag, t.ns);
                        if (t.attrs != null) {
                            kt(t, c, true)
                        }
                        if ((t.flags & B) === B) {
                            t.body.body(t)
                        }
                        if (p(t.body)) {
                            St(t)
                        } else if (t.body != null && t.body !== "") {
                            t.el.textContent = t.body
                        }
                    } else if (t.type === l) {
                        t.el = e || nt(t.body)
                    } else if (t.type === C) {
                        t.el = e || ot(t.body)
                    }
                }
                t.el._node = t;
                return t.el
            }
            function Ot(t, e) {
                return e[t.idx + 1]
            }
            function Mt(t, e) {
                return e[t.idx - 1]
            }
            function Tt(t) {
                return t.parent
            }
            window.lisMove = At;
            var Lt = 1
              , Pt = 2;
            function jt(l, c, u, d, h, f, p, v) {
                return function(t, e, i, n, o, r) {
                    var s, a;
                    if (n[d] != null) {
                        if ((s = n[d]._node) == null) {
                            n[d] = l(n[d]);
                            return
                        }
                        if (Tt(s) !== t) {
                            a = l(n[d]);
                            s.vm != null ? s.vm.unmount(true) : ct(e, n[d]);
                            n[d] = a;
                            return
                        }
                    }
                    if (n[h] == o) {
                        return Pt
                    } else if (n[h].el == null) {
                        u(e, Ct(n[h]), n[d]);
                        n[h] = c(n[h], i)
                    } else if (n[h].el === n[d]) {
                        n[h] = c(n[h], i);
                        n[d] = l(n[d])
                    } else if (!r && s === n[p]) {
                        a = n[d];
                        n[d] = l(a);
                        v(e, a, n[f]);
                        n[f] = a
                    } else {
                        if (r && n[d] != null) {
                            return At(l, c, u, d, h, e, i, s, n)
                        }
                        return Lt
                    }
                }
            }
            function At(t, e, i, n, o, r, s, a, l) {
                if (a._lis) {
                    i(r, l[o].el, l[n]);
                    l[o] = e(l[o], s)
                } else {
                    var c = w(a.idx, l.tombs);
                    a._lis = true;
                    var u = t(l[n]);
                    i(r, l[n], c != null ? s[l.tombs[c]].el : c);
                    if (c == null) {
                        l.tombs.push(a.idx)
                    } else {
                        l.tombs.splice(c, 0, a.idx)
                    }
                    l[n] = u
                }
            }
            var Rt = jt(rt, Ot, ht, "lftSib", "lftNode", "rgtSib", "rgtNode", ft)
              , Ht = jt(st, Mt, ft, "rgtSib", "rgtNode", "lftSib", "lftNode", ht);
            function Nt(t, e) {
                var i = e.body
                  , n = t.el
                  , o = t.body
                  , r = {
                    lftNode: o[0],
                    rgtNode: o[o.length - 1],
                    lftSib: (i[0] || c).el,
                    rgtSib: (i[i.length - 1] || c).el
                };
                t: while (1) {
                    while (1) {
                        var s = Rt(t, n, o, r, null, false);
                        if (s === Lt) {
                            break
                        }
                        if (s === Pt) {
                            break t
                        }
                    }
                    while (1) {
                        var a = Ht(t, n, o, r, r.lftNode, false);
                        if (a === Lt) {
                            break
                        }
                        if (a === Pt) {
                            break t
                        }
                    }
                    Ft(t, n, o, r);
                    break
                }
            }
            function Ft(t, e, i, n) {
                var o = Array.prototype.slice.call(e.childNodes);
                var r = [];
                for (var s = 0; s < o.length; s++) {
                    var a = o[s]._node;
                    if (a.parent === t) {
                        r.push(a.idx)
                    }
                }
                var l = b(r).map(function(t) {
                    return r[t]
                });
                for (var c = 0; c < l.length; c++) {
                    i[l[c]]._lis = true
                }
                n.tombs = l;
                while (1) {
                    var u = Rt(t, e, i, n, null, true);
                    if (u === Pt) {
                        break
                    }
                }
            }
            function zt(t) {
                return t.el._node.parent !== t.parent
            }
            function Vt(t, e, i) {
                return e[i]
            }
            function Bt(t, e, i) {
                for (; i < e.length; i++) {
                    var n = e[i];
                    if (n.vm != null) {
                        if (t.type === O && n.vm.view === t.view && n.vm.key === t.key || t.type === M && n.vm === t.vm) {
                            return n
                        }
                    } else if (!zt(n) && t.tag === n.tag && t.type === n.type && t.key === n.key && (t.flags & ~F) === (n.flags & ~F)) {
                        return n
                    }
                }
                return null
            }
            function Wt(t, e, i) {
                return e[e._keys[t.key]]
            }
            function Ut(t, e) {
                K(e.hooks, "willRecycle", e, t);
                var i = t.el = e.el;
                var n = e.body;
                var o = t.body;
                i._node = t;
                if (t.type === l && o !== n) {
                    i.nodeValue = o;
                    return
                }
                if (t.attrs != null || e.attrs != null) {
                    kt(t, e, false)
                }
                var r = p(n);
                var s = p(o);
                var a = (t.flags & B) === B;
                if (r) {
                    if (s || a) {
                        $t(t, e)
                    } else if (o !== n) {
                        if (o != null) {
                            i.textContent = o
                        } else {
                            dt(e)
                        }
                    }
                } else {
                    if (s) {
                        dt(e);
                        St(t)
                    } else if (o !== n) {
                        if (i.firstChild) {
                            i.firstChild.nodeValue = o
                        } else {
                            i.textContent = o
                        }
                    }
                }
                K(e.hooks, "didRecycle", e, t)
            }
            function $t(t, e) {
                var i = t.body
                  , n = i.length
                  , o = e.body
                  , r = o.length
                  , s = (t.flags & B) === B
                  , a = (t.flags & z) === z
                  , l = (t.flags & V) === V
                  , c = !a && t.type === S
                  , u = true
                  , d = l ? Wt : a || s ? Vt : Bt;
                if (l) {
                    var h = {};
                    for (var f = 0; f < o.length; f++) {
                        h[o[f].key] = f
                    }
                    o._keys = h
                }
                if (c && n === 0) {
                    dt(e);
                    if (s) {
                        t.body = []
                    }
                    return
                }
                var p, v, _, g = 0, m = false, y = 0;
                if (s) {
                    var x = {
                        key: null
                    };
                    var b = Array(n)
                }
                for (var f = 0; f < n; f++) {
                    if (s) {
                        var w = false;
                        var I = null;
                        if (u) {
                            if (l) {
                                x.key = i.key(f)
                            }
                            p = d(x, o, y)
                        }
                        if (p != null) {
                            _ = p.idx;
                            I = i.diff(f, p);
                            if (I === true) {
                                v = p;
                                v.parent = t;
                                v.idx = f;
                                v._lis = false
                            } else {
                                w = true
                            }
                        } else {
                            w = true
                        }
                        if (w) {
                            v = i.tpl(f);
                            G(v, t, f);
                            v._diff = I != null ? I : i.diff(f);
                            if (p != null) {
                                Ut(v, p)
                            }
                        } else {}
                        b[f] = v
                    } else {
                        var v = i[f];
                        var E = v.type;
                        if (E <= C) {
                            if (p = u && d(v, o, y)) {
                                Ut(v, p);
                                _ = p.idx
                            }
                        } else if (E === O) {
                            if (p = u && d(v, o, y)) {
                                _ = p.idx;
                                var k = p.vm._update(v.data, t, f)
                            } else {
                                var k = Dt(v.view, v.data, v.key, v.opts)._redraw(t, f, false)
                            }
                            E = k.node.type
                        } else if (E === M) {
                            var D = T(v.vm);
                            var k = v.vm._update(v.data, t, f, D);
                            E = k.node.type
                        }
                    }
                    if (!l && p != null) {
                        if (_ === y) {
                            y++;
                            if (y === r && n > r) {
                                p = null;
                                u = false
                            }
                        } else {
                            m = true
                        }
                        if (r > 100 && m && ++g % 10 === 0) {
                            while (y < r && zt(o[y])) {
                                y++
                            }
                        }
                    }
                }
                if (s) {
                    t.body = b
                }
                c && Nt(t, e)
            }
            function Gt(t, e, i, n) {
                var o = this;
                o.view = t;
                o.data = e;
                o.key = i;
                if (n) {
                    o.opts = n;
                    o.config(n)
                }
                var r = s(t) ? t : t.call(o, o, e, i, n);
                if (d(r)) {
                    o.render = r
                } else {
                    o.render = r.render;
                    o.config(r)
                }
                o._redrawAsync = y(function(t) {
                    return o.redraw(true)
                });
                o._updateAsync = y(function(t) {
                    return o.update(t, true)
                });
                o.init && o.init.call(o, o, o.data, o.key, n)
            }
            var Xt = Gt.prototype = {
                constructor: Gt,
                _diff: null,
                init: null,
                view: null,
                key: null,
                data: null,
                state: null,
                api: null,
                opts: null,
                node: null,
                hooks: null,
                onevent: i,
                refs: null,
                render: null,
                mount: Yt,
                unmount: Zt,
                config: function(t) {
                    var e = this;
                    if (t.init) {
                        e.init = t.init
                    }
                    if (t.diff) {
                        e.diff = t.diff
                    }
                    if (t.onevent) {
                        e.onevent = t.onevent
                    }
                    if (t.hooks) {
                        e.hooks = f(e.hooks || {}, t.hooks)
                    }
                    {
                        if (t.onemit) {
                            e.onemit = f(e.onemit || {}, t.onemit)
                        }
                    }
                },
                parent: function() {
                    return P(this.node.parent)
                },
                root: function() {
                    var t = this.node;
                    while (t.parent) {
                        t = t.parent
                    }
                    return t.vm
                },
                redraw: function(t) {
                    var e = this;
                    t ? e._redraw(null, null, T(e)) : e._redrawAsync();
                    return e
                },
                update: function(t, e) {
                    var i = this;
                    e ? i._update(t, null, null, T(i)) : i._updateAsync(t);
                    return i
                },
                _update: Kt,
                _redraw: qt,
                _redrawAsync: null,
                _updateAsync: null
            };
            function Yt(t, e) {
                var i = this;
                if (e) {
                    dt({
                        el: t,
                        flags: 0
                    });
                    i._redraw(null, null, false);
                    if (t.nodeName.toLowerCase() !== i.node.tag) {
                        Ct(i.node);
                        ht(t.parentNode, i.node.el, t);
                        t.parentNode.removeChild(t)
                    } else {
                        ht(t.parentNode, Ct(i.node, t), t)
                    }
                } else {
                    i._redraw(null, null);
                    if (t) {
                        ht(t, i.node.el)
                    }
                }
                if (t) {
                    Q(i)
                }
                return i
            }
            function Zt(t) {
                var e = this;
                var i = e.node;
                var n = i.el.parentNode;
                ct(n, i.el);
                if (!t) {
                    Q(e)
                }
            }
            function Jt(t, e, i, n) {
                if (i != null) {
                    i.body[n] = e;
                    e.idx = n;
                    e.parent = i;
                    e._lis = false
                }
                return t
            }
            function qt(t, e, i) {
                var n = t == null;
                var o = this;
                var r = o.node && o.node.el && o.node.el.parentNode;
                var s = o.node, a, l;
                if (o.diff != null) {
                    a = o._diff;
                    o._diff = l = o.diff(o, o.data);
                    if (s != null) {
                        var c = p(a) ? m : g;
                        var u = a === l || c(a, l);
                        if (u) {
                            return Jt(o, s, t, e)
                        }
                    }
                }
                r && K(o.hooks, "willRedraw", o, o.data);
                var d = o.render.call(o, o, o.data, a, l);
                if (d === s) {
                    return Jt(o, s, t, e)
                }
                o.refs = null;
                if (o.key != null && d.key !== o.key) {
                    d.key = o.key
                }
                o.node = d;
                if (t) {
                    G(d, t, e, o);
                    t.body[e] = d
                } else if (s && s.parent) {
                    G(d, s.parent, s.idx, o);
                    s.parent.body[s.idx] = d
                } else {
                    G(d, null, null, o)
                }
                if (i !== false) {
                    if (s) {
                        if (s.tag !== d.tag || s.key !== d.key) {
                            s.vm = d.vm = null;
                            var h = s.el.parentNode;
                            var f = rt(s.el);
                            ct(h, s.el);
                            ht(h, Ct(d), f);
                            s.el = d.el;
                            d.vm = o
                        } else {
                            Ut(d, s)
                        }
                    } else {
                        Ct(d)
                    }
                }
                r && K(o.hooks, "didRedraw", o, o.data);
                if (n && r) {
                    Q(o)
                }
                return o
            }
            function Kt(t, e, i, n) {
                var o = this;
                if (t != null) {
                    if (o.data !== t) {
                        K(o.hooks, "willUpdate", o, t);
                        o.data = t
                    }
                }
                return o._redraw(e, i, n)
            }
            function Qt(t, e, i, n) {
                var o, r;
                if (i == null) {
                    if (s(e)) {
                        o = e
                    } else {
                        r = e
                    }
                } else {
                    o = e;
                    r = i
                }
                return W(t, o, r, n)
            }
            var te = "http://www.w3.org/2000/svg";
            function ee(t, e, i, n) {
                var o = Qt(t, e, i, n);
                o.ns = te;
                return o
            }
            function ie(t) {
                var e = new j;
                e.type = C;
                e.body = t;
                return e
            }
            function ne(t, e, i, n) {
                this.view = t;
                this.data = e;
                this.key = i;
                this.opts = n
            }
            function oe(t, e, i, n) {
                return new ne(t,e,i,n)
            }
            function re(t) {
                this.vm = t
            }
            function se(t) {
                return new re(t)
            }
            function ae(t) {
                var e = new j;
                e.type = S;
                e.el = e.key = t;
                return e
            }
            function le(r, s) {
                var o = r.length;
                var a = {
                    items: r,
                    length: o,
                    key: function(t) {
                        return s.key(r[t], t)
                    },
                    diff: function(t, e) {
                        var i = s.diff(r[t], t);
                        if (e == null) {
                            return i
                        }
                        var n = e._diff;
                        var o = i === n || p(n) ? m(i, n) : g(i, n);
                        return o || i
                    },
                    tpl: function(t) {
                        return s.tpl(r[t], t)
                    },
                    map: function(t) {
                        s.tpl = t;
                        return a
                    },
                    body: function(t) {
                        var e = Array(o);
                        for (var i = 0; i < o; i++) {
                            var n = a.tpl(i);
                            n._diff = a.diff(i);
                            e[i] = n;
                            G(n, t, i)
                        }
                        t.body = e
                    }
                };
                return a
            }
            ne.prototype = {
                constructor: ne,
                type: O,
                view: null,
                data: null,
                key: null,
                opts: null
            },
            re.prototype = {
                constructor: re,
                type: M,
                vm: null
            };
            var ce = {
                config: mt,
                ViewModel: Gt,
                VNode: j,
                createView: Dt,
                defineElement: Qt,
                defineSvgElement: ee,
                defineText: A,
                defineComment: ie,
                defineView: oe,
                injectView: se,
                injectElement: ae,
                lazyList: le,
                FIXED_BODY: z,
                DEEP_REMOVE: F,
                KEYED_LIST: V,
                LAZY_LIST: B
            };
            function ue(t, e) {
                !function(t, e, i) {
                    {
                        var n, o;
                        null != e.type ? null == t.vm && (G(e, t.parent, t.idx, null),
                        Ut(t.parent.body[t.idx] = e, t),
                        i && D(e),
                        Q(P(e))) : ((n = Object.create(t)).attrs = f({}, t.attrs),
                        o = f(t.attrs, e),
                        null != t._class && (e = o.class,
                        o.class = null != e && "" !== e ? t._class + " " + e : t._class),
                        kt(t, n),
                        i && D(t))
                    }
                }(this, t, e)
            }
            function de(t, e, i) {
                if (null != e.type)
                    null == t.vm && (G(e, t.parent, t.idx, null),
                    Ut(t.parent.body[t.idx] = e, t),
                    i && D(e),
                    Q(P(e)));
                else {
                    var n = Object.create(t);
                    (n = Object.create(t)).attrs = f({}, t.attrs);
                    var o = f(t.attrs, e), s;
                    null != t._class && (e = o.class,
                    o.class = null != e && "" !== e ? t._class + " " + e : t._class),
                    kt(t, n),
                    i && D(t)
                }
            }
            function he(t, e) {
                var i = t.body;
                if (p(i)) {
                    for (var n = 0; n < i.length; n++) {
                        var o = i[n];
                        if (o.vm != null) {
                            e.push(o.vm)
                        } else {
                            he(o, e)
                        }
                    }
                }
                return e
            }
            function fe(t) {
                var e = arguments;
                var i = e.length;
                var n, o;
                if (i > 1) {
                    var r = 1;
                    if (s(e[1])) {
                        o = e[1];
                        r = 2
                    }
                    if (i === r + 1 && (a(e[r]) || p(e[r]) || o && (o._flags & B) === B)) {
                        n = e[r]
                    } else {
                        n = _(e, r)
                    }
                }
                return W(t, o, n)
            }
            function pe() {
                var t = fe.apply(null, arguments);
                return t.ns = te,
                t
            }
            return n.patch = function(t, e) {
                !function(t, e, i) {
                    {
                        var n, o;
                        null != e.type ? null == t.vm && (G(e, t.parent, t.idx, null),
                        Ut(t.parent.body[t.idx] = e, t),
                        i && D(e),
                        Q(P(e))) : ((n = Object.create(t)).attrs = f({}, t.attrs),
                        o = f(t.attrs, e),
                        null != t._class && (e = o.class,
                        o.class = null != e && "" !== e ? t._class + " " + e : t._class),
                        kt(t, n),
                        i && D(t))
                    }
                }(this, t, e)
            }
            ,
            Xt.emit = function(t) {
                var e = this
                  , i = e
                  , n = _(arguments, 1).concat(i, i.data);
                do {
                    var o = e.onemit
                      , o = o ? o[t] : null;
                    if (o) {
                        o.apply(e, n);
                        break
                    }
                } while (e = e.parent());
                pt[t] && pt[t].apply(e, n)
            }
            ,
            Xt.onemit = null,
            Xt.body = function() {
                return function t(e, i) {
                    var n = e.body;
                    if (p(n))
                        for (var o = 0; o < n.length; o++) {
                            var r = n[o];
                            null != r.vm ? i.push(r.vm) : t(r, i)
                        }
                    return i
                }(this.node, [])
            }
            ,
            ce.defineElementSpread = fe,
            ce.defineSvgElementSpread = function() {
                var t = fe.apply(null, arguments);
                return t.ns = te,
                t
            }
            ,
            ce
        }()
    }
    , function(t, e, i) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var r = i(13);
        e.getResizeMode = function(t, e, i) {
            var n = e[o = t ? "width" : "height"] && e[o].includes("%")
              , t = i[o] && i[o].includes("%")
              , e = e[o] && e[o].includes("px")
              , o = i[o] && i[o].includes("px");
            return n && t ? r.resizeMode.percents : e && o ? r.resizeMode.pixels : e && !o ? r.resizeMode.mixedpx1 : o && !e ? r.resizeMode.mixedpx2 : n ? r.resizeMode.mixedperc1 : t ? r.resizeMode.mixedperc2 : r.resizeMode.unknown
        }
        ,
        e.getBlockRange = function(t, e, i) {
            return void 0 === i && (i = !0),
            i ? {
                min: t.left + window.pageXOffset,
                max: e.right + window.pageXOffset
            } : {
                min: t.top + window.pageYOffset,
                max: e.bottom + window.pageYOffset
            }
        }
        ,
        e.getMarginSize = function(t, e) {
            return t && ("space" === t.type || "wide" === t.type && e) ? 10 : 0
        }
    }
    , function(t, i, e) {
        "use strict";
        function n(t) {
            for (var e in t)
                i.hasOwnProperty(e) || (i[e] = t[e])
        }
        Object.defineProperty(i, "__esModule", {
            value: !0
        }),
        n(e(66)),
        n(e(78))
    }
    , function(t, e, i) {
        "use strict";
        var n, o = this && this.__extends || (n = function(t, e) {
            return (n = Object.setPrototypeOf || {
                __proto__: []
            }instanceof Array && function(t, e) {
                t.__proto__ = e
            }
            || function(t, e) {
                for (var i in e)
                    e.hasOwnProperty(i) && (t[i] = e[i])
            }
            )(t, e)
        }
        ,
        function(t, e) {
            function i() {
                this.constructor = t
            }
            n(t, e),
            t.prototype = null === e ? Object.create(e) : (i.prototype = e.prototype,
            new i)
        }
        );
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var r, s = i(1), a = i(0), l = i(2), c = i(30), u = i(16), o = (r = c.Navbar,
        o(d, r),
        d.prototype.getState = function() {
            var t, e = {};
            for (t in this.data.eachChild(this.data.getRoot(), function(t) {
                t.twoState && !t.group ? e[t.id] = t.active : "input" !== t.type && "selectButton" !== t.type || (e[t.id] = t.value)
            }, !1),
            this._groups)
                this._groups[t].active && (e[t] = this._groups[t].active);
            return e
        }
        ,
        d.prototype.setState = function(t) {
            for (var e in t) {
                var i;
                this._groups && this._groups[e] ? this._groups[e].active && (this.data.update(this._groups[e].active, {
                    active: !1
                }),
                this._groups[e].active = t[e],
                this.data.update(t[e], {
                    active: !0
                })) : "input" === (i = this.data.getItem(e)).type || "selectButton" === i.type ? this.data.update(e, {
                    value: t[e]
                }) : this.data.update(e, {
                    active: t[e]
                })
            }
        }
        ,
        d.prototype._customHandlers = function() {
            var i = this;
            return {
                input: function(t) {
                    var e = l.locate(t);
                    i.data.update(e, {
                        value: t.target.value
                    })
                },
                tooltip: function(t) {
                    var e = l.locateNode(t);
                    e && (t = e.getAttribute("dhx_id"),
                    (t = i.data.getItem(t)).tooltip && u.tooltip(t.tooltip, {
                        node: e,
                        position: u.Position.bottom
                    }))
                }
            }
        }
        ,
        d.prototype._getFactory = function() {
            return c.createFactory({
                widget: this,
                defaultType: "navItem",
                allowedTypes: ["button", "customHTMLButton", "imageButton", "input", "selectButton", "separator", "spacer", "title", "navItem", "menuItem", "customHTML"],
                widgetName: "toolbar"
            })
        }
        ,
        d.prototype._draw = function() {
            var i = this;
            return a.el("nav.dhx_widget.dhx_toolbar", {
                class: this.config.css ? this.config.css : ""
            }, [a.el("ul.dhx_navbar.dhx_navbar--horizontal", {
                dhx_widget_id: this._uid,
                tabindex: 0,
                onclick: this._handlers.onclick,
                onmousedown: this._handlers.onmousedown,
                oninput: this._handlers.input,
                onmouseover: this._handlers.tooltip,
                _hooks: {
                    didInsert: function(t) {
                        t.el.addEventListener("keyup", function(t) {
                            var e;
                            9 !== t.which || (e = l.locateNode(document.activeElement)) && (t = e.getAttribute("dhx_id"),
                            (t = i.data.getItem(t)).tooltip && u.tooltip(t.tooltip, {
                                node: e,
                                position: u.Position.bottom,
                                force: !0
                            }))
                        }, !0)
                    }
                }
            }, this.data.map(function(t) {
                return i._factory(t)
            }, this.data.getRoot(), !1))])
        }
        ,
        d.prototype._getMode = function(t, e) {
            return t.id === e ? "bottom" : "right"
        }
        ,
        d.prototype._close = function(t) {
            this._activePosition = null,
            this._currentRoot = null,
            r.prototype._close.call(this, t)
        }
        ,
        d.prototype._setRoot = function(t) {
            this.data.getParent(t) === this.data.getRoot() && (this._currentRoot = t)
        }
        ,
        d);
        function d(t, e) {
            var i = r.call(this, t, s.extend({
                navigationType: "click"
            }, e)) || this;
            i._currentRoot = null;
            return i.mount(t, a.create({
                render: function() {
                    return i._draw()
                }
            })),
            i
        }
        e.Toolbar = o
    }
    , function(t, e, i) {
        "use strict";
        var n, o = this && this.__extends || (n = function(t, e) {
            return (n = Object.setPrototypeOf || {
                __proto__: []
            }instanceof Array && function(t, e) {
                t.__proto__ = e
            }
            || function(t, e) {
                for (var i in e)
                    e.hasOwnProperty(i) && (t[i] = e[i])
            }
            )(t, e)
        }
        ,
        function(t, e) {
            function i() {
                this.constructor = t
            }
            n(t, e),
            t.prototype = null === e ? Object.create(e) : (i.prototype = e.prototype,
            new i)
        }
        ), r = this && this.__assign || function() {
            return (r = Object.assign || function(t) {
                for (var e, i = 1, n = arguments.length; i < n; i++)
                    for (var o in e = arguments[i])
                        Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
                return t
            }
            ).apply(this, arguments)
        }
        ;
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var s = i(1)
          , c = i(0)
          , a = i(5)
          , u = i(2)
          , l = i(18)
          , d = i(8)
          , h = i(3)
          , f = i(19);
        var p, o = (p = d.View,
        o(v, p),
        v.prototype.paint = function() {
            p.prototype.paint.call(this),
            this._vpopups.redraw()
        }
        ,
        v.prototype.disable = function(t) {
            this._setProp(t, "disabled", !0)
        }
        ,
        v.prototype.enable = function(t) {
            this._setProp(t, "disabled", !1)
        }
        ,
        v.prototype.isDisabled = function(t) {
            t = this.data.getItem(t);
            if (t)
                return t.disabled || !1
        }
        ,
        v.prototype.show = function(t) {
            this._setProp(t, "hidden", !1)
        }
        ,
        v.prototype.hide = function(t) {
            this._setProp(t, "hidden", !0)
        }
        ,
        v.prototype.destructor = function() {
            this.unmount(),
            l.keyManager.removeHotKey(null, this),
            this._vpopups.unmount()
        }
        ,
        v.prototype.select = function(t, e) {
            var i = this;
            if (void 0 === e && (e = !0),
            !t)
                throw new Error("Function argument cannot be empty, for more info check documentation https://docs.dhtmlx.com");
            e && this.unselect(),
            this.data.update(t, {
                active: !0
            }),
            this.data.eachParent(t, function(t) {
                i.data.update(t.id, {
                    active: !0
                })
            })
        }
        ,
        v.prototype.unselect = function(t) {
            var e = this;
            t ? (this.data.update(t, {
                active: !1
            }),
            this.data.eachChild(t, function(t) {
                e.data.update(t.id, {
                    active: !1
                })
            })) : this.data.forEach(function(t) {
                e.data.update(t.id, {
                    active: !1
                })
            })
        }
        ,
        v.prototype.isSelected = function(t) {
            if (t && this.data.getItem(t))
                return !!this.data.getItem(t).active
        }
        ,
        v.prototype.getSelected = function() {
            var e = [];
            return this.data.forEach(function(t) {
                t.active && e.push(t.id)
            }),
            e
        }
        ,
        v.prototype._customHandlers = function() {
            return {}
        }
        ,
        v.prototype._close = function(t) {
            var e = this;
            this._popupActive && this.events.fire(f.NavigationBarEvents.beforeHide, [this._activeMenu, t]) && (this._activeParents && this._activeParents.forEach(function(t) {
                return e.data.exists(t) && e.data.update(t, {
                    $activeParent: !1
                })
            }),
            "click" === this.config.navigationType && (this._isActive = !1),
            clearTimeout(this._currentTimeout),
            this._popupActive = !1,
            this._activeMenu = null,
            this.events.fire(f.NavigationBarEvents.afterHide, [t]),
            this.paint())
        }
        ,
        v.prototype._init = function() {
            var t = this;
            this._vpopups = c.create({
                render: function() {
                    return c.el("div", {
                        dhx_widget_id: t._uid,
                        class: (t._isContextMenu ? " dhx_context-menu" : "") + " " + (t.config.css ? t.config.css.split(" ").map(function(t) {
                            return t + "--context-menu"
                        }).join(" ") : ""),
                        onmousemove: t._handlers.onmousemove,
                        onmouseleave: t._handlers.onmouseleave,
                        onclick: t._handlers.onclick,
                        onmousedown: t._handlers.onmousedown
                    }, t._drawPopups())
                }
            }),
            this._vpopups.mount(document.body)
        }
        ,
        v.prototype._initHandlers = function() {
            var a = this;
            this._isActive = "click" !== this.config.navigationType,
            this._handlers = r({
                onmousemove: function(t) {
                    var e, i;
                    !a._isActive || (i = u.locateNode(t)) && (e = i.getAttribute("dhx_id"),
                    a._activeMenu !== e && (a.data.haveItems(e) && (i = u.getRealPosition(i),
                    a.data.update(e, {
                        $position: i
                    }, !1)),
                    a._activeItemChange(e, t)))
                },
                onmouseleave: function(t) {
                    var e;
                    "click" !== a.config.navigationType && (a._popupActive && ((e = u.locateNode(t, "dhx_id", "relatedTarget")) ? (e = e.getAttribute("dhx_id"),
                    a.data.getItem(e) || a._close(t)) : a._close(t)),
                    a._activeItemChange(null, t))
                },
                onclick: function(t) {
                    var e = u.locateNode(t);
                    if (e) {
                        var i = e.getAttribute("dhx_id")
                          , n = a.data.getItem(i);
                        if (!n.multiClick)
                            if (a.data.haveItems(i))
                                i !== a._currentRoot && (a._isActive || (a._isActive = !0),
                                a._setRoot(i),
                                e = u.getRealPosition(e),
                                a.data.update(i, {
                                    $position: e
                                }, !1),
                                a._activeItemChange(i, t));
                            else
                                switch (n.type) {
                                case "input":
                                case "title":
                                    break;
                                case "menuItem":
                                case "selectButton":
                                    a._onMenuItemClick(i, t);
                                    break;
                                case "imageButton":
                                case "button":
                                case "customButton":
                                case "customHTML":
                                case "navItem":
                                    n.twoState && a.data.update(n.id, {
                                        active: !n.active
                                    }),
                                    a.events.fire(f.NavigationBarEvents.click, [i, t]),
                                    a._close(t);
                                    break;
                                default:
                                    a._close(t)
                                }
                    }
                },
                onmousedown: function(t) {
                    var e, i, n, o, r, s = u.locateNode(t);
                    s && (e = s.getAttribute("dhx_id"),
                    a.data.getItem(e).multiClick && (i = 365,
                    r = function() {
                        clearTimeout(n),
                        document.removeEventListener("mouseup", r)
                    }
                    ,
                    (o = function() {
                        a.events.fire(f.NavigationBarEvents.click, [e, t]),
                        50 < i && (i -= 55),
                        n = setTimeout(o, i)
                    }
                    )(),
                    document.addEventListener("mouseup", r)))
                }
            }, this._customHandlers())
        }
        ,
        v.prototype._initEvents = function() {
            var n = this
              , t = null;
            this.data.events.on(f.DataEvents.change, function() {
                n.paint(),
                t && clearTimeout(t),
                t = setTimeout(function() {
                    var i = {};
                    n.data.eachChild(n.data.getRoot(), function(t) {
                        var e;
                        t.group && (t.twoState = !0,
                        (e = i)[(t = t).group] ? (t.active && (e[t.group].active = t.id),
                        e[t.group].elements.push(t.id)) : e[t.group] = {
                            active: t.active ? t.id : null,
                            elements: [t.id]
                        })
                    }, !0),
                    n._groups = i,
                    n._resetHotkeys(),
                    t = null,
                    n.paint()
                }, 100)
            }),
            this.events.on(f.NavigationBarEvents.click, function(t) {
                var e = n.data.getItem(t)
                  , t = n.data.getItem(e.parent);
                t && "selectButton" === t.type && n.data.update(e.parent, {
                    value: e.value,
                    icon: e.icon
                }),
                e.group && ((t = n._groups[e.group]).active && n.data.update(t.active, {
                    active: !1
                }),
                t.active = e.id,
                n.data.update(e.id, {
                    active: !0
                }))
            }),
            this._customInitEvents()
        }
        ,
        v.prototype._getMode = function(t, e, i) {
            return void 0 === i && (i = !1),
            t.parent === e ? "bottom" : "right"
        }
        ,
        v.prototype._drawMenuItems = function(t, e) {
            var i = this;
            return void 0 === e && (e = !0),
            this.data.map(function(t) {
                return i._factory(t, e)
            }, t, !1)
        }
        ,
        v.prototype._setRoot = function(t) {}
        ,
        v.prototype._getParents = function(t, e) {
            var i = []
              , n = !1
              , o = this.data.getItem(t)
              , o = o && o.disabled;
            return this.data.eachParent(t, function(t) {
                t.id === e ? (i.push(t.id),
                n = !0) : n || i.push(t.id)
            }, !o),
            this._isContextMenu && this._activePosition && i.push(e),
            i
        }
        ,
        v.prototype._listenOuterClick = function() {
            this._documentHaveListener || (document.addEventListener("click", this._documentClick, !0),
            this._documentHaveListener = !0)
        }
        ,
        v.prototype._customInitEvents = function() {}
        ,
        v.prototype._drawPopups = function() {
            var a = this
              , t = this._activeMenu;
            if (!this._isContextMenu && !t)
                return null;
            var l = this._currentRoot;
            if (this._isContextMenu && !this._activePosition)
                return null;
            t = this._getParents(t, l);
            return (this._activeParents = t).forEach(function(t) {
                return a.data.exists(t) && a.data.update(t, {
                    $activeParent: !0
                }, !1)
            }),
            t.map(function(r) {
                if (!a.data.haveItems(r))
                    return null;
                var s = a.data.getItem(r) || a._rootItem;
                return a._popupActive = !0,
                c.el("ul", {
                    class: "dhx_widget dhx_menu" + (a.config.menuCss ? " " + a.config.menuCss : ""),
                    _key: r,
                    _hooks: {
                        didInsert: function(t) {
                            var e = t.el.getBoundingClientRect()
                              , i = e.width
                              , n = e.height
                              , o = a._isContextMenu && a._activePosition && r === l ? a._activePosition : s.$position
                              , e = a._getMode(s, l, o === a._activePosition)
                              , n = u.calculatePosition(o, {
                                mode: e,
                                width: i,
                                height: n
                            });
                            s.$style = n,
                            t.patch({
                                style: n
                            })
                        },
                        didRecycle: function(t, e) {
                            var i, n;
                            a._isContextMenu && a._activePosition && r === l && (i = (n = e.el.getBoundingClientRect()).width,
                            n = n.height,
                            n = u.calculatePosition(a._activePosition, {
                                mode: a._getMode(s, l, !0),
                                width: i,
                                height: n
                            }),
                            s.$style = n,
                            e.patch({
                                style: n
                            }))
                        }
                    },
                    tabindex: 0,
                    style: s.$style || {
                        position: "absolute"
                    }
                }, a._drawMenuItems(r))
            }).reverse()
        }
        ,
        v.prototype._onMenuItemClick = function(t, e) {
            var i = this.data.getItem(t);
            i.disabled || (i.twoState && this.data.update(i.id, {
                active: !i.active
            }),
            this.events.fire(f.NavigationBarEvents.click, [t, e]),
            this._close(e))
        }
        ,
        v.prototype._activeItemChange = function(t, e) {
            var i, n = this;
            this._activeParents && (i = this._getParents(t, this._currentRoot),
            this._activeParents.forEach(function(t) {
                n.data.exists(t) && !i.includes(t) && n.data.update(t, {
                    $activeParent: !1
                }, !1)
            })),
            t && !this._documentHaveListener && this._listenOuterClick(),
            t && this.data.haveItems(t) ? (this._activeMenu === t && this._popupActive || this.events.fire(f.NavigationBarEvents.openMenu, [t]),
            this._activeMenu = t,
            clearTimeout(this._currentTimeout),
            this.paint()) : (clearTimeout(this._currentTimeout),
            this._currentTimeout = setTimeout(function() {
                return n.paint()
            }, 400))
        }
        ,
        v.prototype._resetHotkeys = function() {
            var e = this;
            l.keyManager.removeHotKey(null, this),
            this.data.map(function(t) {
                t.hotkey && l.keyManager.addHotKey(t.hotkey, function() {
                    return e._onMenuItemClick(t.id, null)
                }, e)
            })
        }
        ,
        v.prototype._setProp = function(t, e, i) {
            var n = this;
            Array.isArray(t) ? t.forEach(function(t) {
                return n.data.update(t, ((t = {})[e] = i,
                t))
            }) : this.data.update(t, ((t = {})[e] = i,
            t))
        }
        ,
        v);
        function v(t, e) {
            var n = p.call(this, t, s.extend({}, e)) || this;
            return n._isContextMenu = !1,
            n._documentHaveListener = !1,
            n._rootItem = {},
            !Array.isArray(n.config.data) && n.config.data && n.config.data.events ? (n.data = n.config.data,
            n.events = n.data.events,
            n.events.context = n) : (n.events = new a.EventSystem(n),
            n.data = new h.TreeCollection({},n.events)),
            n._documentClick = function(t) {
                var e, i;
                n._documentHaveListener && (e = u.locateNode(t),
                i = "ontouchstart"in window || navigator.msMaxTouchPoints,
                document.removeEventListener("click", n._documentClick),
                n._documentHaveListener = !1,
                (!i || e) && n._isContextMenu || n._close(t))
            }
            ,
            n._currentRoot = n.data.getRoot(),
            n._factory = n._getFactory(),
            n._initHandlers(),
            n._init(),
            n._initEvents(),
            Array.isArray(n.config.data) && n.data.parse(n.config.data),
            n
        }
        e.Navbar = o
    }
    , function(t, e, i) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var d = i(69)
          , h = i(70)
          , f = i(71)
          , p = i(72)
          , v = i(73)
          , _ = i(74)
          , g = i(75)
          , m = i(76)
          , y = i(77)
          , x = i(11);
        e.createFactory = function(t) {
            for (var n = t.defaultType, e = t.allowedTypes, o = t.widgetName, t = t.widget, r = new Set, i = 0, s = e; i < s.length; i++) {
                var a = s[i];
                r.add(a)
            }
            var l = t.config
              , c = t.events
              , u = t.data;
            return function(t, e) {
                if (t.hidden)
                    return null;
                if (!(t.type && "button" !== t.type && "navItem" !== t.type && "menuItem" !== t.type || t.value || t.icon || t.html))
                    return null;
                t.type = t.type || n,
                r && !r.has(t.type) && (t.type = n),
                "imageButton" === t.type && "ribbon" !== o && (t.active = !1),
                e && "spacer" !== t.type && "separator" !== t.type && "customHTML" !== t.type && (t.type = "menuItem"),
                u.haveItems(t.id) && function(t, e, i) {
                    switch (t) {
                    case "sidebar":
                    case "context-menu":
                        e.$openIcon = "right";
                        break;
                    case "toolbar":
                        e.parent === i.getRoot() ? e.$openIcon = "right" : e.$openIcon = "bottom";
                        break;
                    case "menu":
                        e.parent !== this.data.getRoot() && (e.$openIcon = "right");
                        break;
                    case "ribbon":
                        i = i.getItem(e.parent);
                        i && "block" !== e.type && ("block" === i.type ? e.$openIcon = "bottom" : e.$openIcon = "right")
                    }
                }(o, t, u),
                "toolbar" === o && t.items && t.items.forEach(function(t) {
                    t.type || (t.type = "menuItem")
                });
                var i = "customHTML" !== t.type && function(t, e, i, n) {
                    switch (t.type) {
                    case "navItem":
                    case "selectButton":
                        return h.navItem(t, i, n.collapsed);
                    case "button":
                        return d.button(t, i);
                    case "title":
                        return y.title(t, i);
                    case "separator":
                        return g.separator(t, i);
                    case "spacer":
                        return m.spacer(t, i);
                    case "input":
                        return v.input(t, e, i);
                    case "imageButton":
                        return p.imageButton(t, i);
                    case "menuItem":
                        return _.menuItem(t, i, n.asMenuItem);
                    case "customHTMLButton":
                        return f.customHTMLButton(t, i, n.asMenuItem);
                    case "block":
                    default:
                        throw new Error("unknown item type " + t.type)
                    }
                }(t, c, o, {
                    asMenuItem: e,
                    collapsed: "sidebar" !== o || l.collapsed
                });
                return x.navbarComponentMixin(o, t, e, i)
            }
        }
    }
    , function(t, e, i) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var o = i(0)
          , r = i(11);
        e.button = function(t, e) {
            var i = t.icon && !t.value
              , n = i ? " dhx_navbar-count--absolute" : " dhx_navbar-count--button-inline";
            return o.el("button.dhx_button", {
                class: r.getNavbarButtonCSS(t, e),
                dhx_id: t.id,
                disabled: t.disabled,
                type: "button"
            }, [t.icon ? r.getIcon(t.icon, "button") : null, t.html ? o.el("div.dhx_button__text", {
                ".innerHTML": t.html
            }) : t.value && o.el("span.dhx_button__text", t.value), 0 < t.count && r.getCount(t, n, i), t.value && t.$openIcon ? o.el("span.dhx_button__icon.dhx_button__icon--menu.dxi.dxi-menu-right") : null, t.loading && o.el("span.dhx_button__loading", [o.el("span.dhx_button__loading-icon.dxi.dxi-loading")])])
        }
    }
    , function(t, e, i) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var n = i(0)
          , o = i(11);
        e.navItem = function(t, e, i) {
            return e = " dhx_" + e + "-button",
            n.el("button", {
                class: "dhx_button" + e + (t.active || t.$activeParent ? e + "--active" : "") + (t.disabled ? e + "--disabled" : "") + (t.$openIcon ? e + "--select" : "") + (t.circle ? e + "--circle" : "") + (t.size ? " " + e + "--" + t.size : "") + (!t.value && t.icon ? e + "--icon" : "") + (t.css ? " " + t.css : ""),
                dhx_id: t.id,
                disabled: t.disabled,
                type: "button"
            }, [t.icon && n.el("span", {
                class: t.icon + e + "__icon"
            }), t.html && n.el("div", {
                class: e.trim() + "__html",
                ".innerHTML": t.html
            }), !t.html && t.value && n.el("span", {
                class: e.trim() + "__text"
            }, t.value), 0 < t.count && o.getCount(t, e + "__count", i), t.$openIcon && n.el("span.dxi.dxi-menu-right", {
                class: e + "__caret"
            })])
        }
    }
    , function(t, e, i) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var n = i(0);
        e.customHTMLButton = function(t, e, i) {
            return i = i ? " dhx_button dhx_menu-button" : " dhx_button dhx_nav-menu-button",
            n.el("button", {
                class: "dhx_custom-button" + i + (t.$activeParent ? i + "--active" : ""),
                dhx_id: t.id,
                type: "button",
                ".innerHTML": t.html
            }, t.html ? "" : t.value)
        }
    }
    , function(t, e, i) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var n = i(0)
          , o = i(11);
        e.imageButton = function(t, e) {
            var i = "dhx_" + e + "-button-image"
              , e = "ribbon" === e;
            return n.el("button.dhx_button", {
                class: i + (t.size ? " " + i + "--" + t.size : "") + (!t.value && t.src ? " " + i + "--icon" : "") + (e && t.$openIcon ? " " + i + "--select" : "") + (t.active ? " " + i + "--active" : ""),
                dhx_id: t.id,
                type: "button"
            }, [e && t.value && t.$openIcon && n.el("span.dxi.dxi-menu-right", {
                class: i + "__caret"
            }), t.html ? n.el("div", {
                class: i + "__text",
                ".innerHTML": t.html
            }) : t.value && n.el("span", {
                class: i + "__text"
            }, t.value), t.src && n.el("span", {
                class: i + "__image",
                style: {
                    backgroundImage: "url(" + t.src + ")"
                }
            }), 0 < t.count && o.getCount(t, i + "__count", !0)])
        }
    }
    , function(t, e, i) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var n = i(0)
          , o = i(19);
        function r(t, e) {
            t.fire(o.NavigationBarEvents.inputBlur, [e])
        }
        function s(t, e) {
            t.fire(o.NavigationBarEvents.inputFocus, [e])
        }
        e.input = function(e, i, t) {
            return n.el(".dhx_form-group.dhx_form-group--no-message-holder.dhx_form-group--label_sr.dhx_" + t + "__input", {
                style: {
                    width: e.width ? e.width : "200px"
                }
            }, [n.el("label.dhx_label", {
                for: e.id
            }, e.label), n.el(".dhx_input__wrapper", [n.el("input.dhx_input", {
                placeholder: e.placeholder,
                class: e.icon ? "dhx_input--icon-padding" : "",
                value: e.value,
                onblur: [r, i, e.id],
                onfocus: [s, i, e.id],
                dhx_id: e.id,
                _hooks: {
                    didInsert: function(t) {
                        i && i.fire(o.NavigationBarEvents.inputCreated, [e.id, t.el])
                    }
                },
                _key: e.id
            }), e.icon ? n.el(".dhx_input__icon", {
                class: e.icon
            }) : null])])
        }
    }
    , function(t, e, i) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var o = i(0)
          , r = i(11);
        e.menuItem = function(t, e, i) {
            var n = i ? " dhx_menu-button" : " dhx_nav-menu-button";
            return o.el("button", {
                class: "dhx_button" + n + (t.disabled ? n + "--disabled" : "") + (t.active || t.$activeParent ? n + "--active" : ""),
                disabled: t.disabled,
                dhx_id: t.id,
                type: "button"
            }, i ? [t.icon || t.value || t.html ? o.el("span.dhx_menu-button__block.dhx_menu-button__block--left", [t.icon && o.el("span.dhx_menu-button__icon", {
                class: t.icon
            }), t.html ? o.el("div.dhx_menu-button__text", {
                ".innerHTML": t.html
            }) : t.value && o.el("span.dhx_menu-button__text", t.value)]) : null, 0 < t.count || t.hotkey || t.items ? o.el("span.dhx_menu-button__block.dhx_menu-button__block--right", [0 < t.count && r.getCount(t, " dhx_menu-button__count", !1), t.hotkey && o.el("span.dhx_menu-button__hotkey", t.hotkey), t.items && o.el("span.dhx_menu-button__caret.dxi.dxi-menu-right")]) : null] : [t.icon && o.el("span.dhx_menu-button__icon", {
                class: t.icon
            }), t.html ? o.el("div.dhx_menu-button__text", {
                ".innerHTML": t.html
            }) : t.value && o.el("span.dhx_nav-menu-button__text", t.value)])
        }
    }
    , function(t, e, i) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        }),
        e.separator = function(t, e) {
            return null
        }
    }
    , function(t, e, i) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        }),
        e.spacer = function(t, e) {
            return null
        }
    }
    , function(t, e, i) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var n = i(0);
        e.title = function(t, e) {
            return n.el("span", {
                class: "dhx_navbar-title dhx_navbar-title--" + e,
                ".innerHTML": t.html
            }, t.html ? null : t.value)
        }
    }
    , function(t, e, i) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        i = i(30);
        e.NavigationBarEvents = i.NavigationBarEvents
    }
    , function(t, i, a) {
        "use strict";
        (function(r) {
            Object.defineProperty(i, "__esModule", {
                value: !0
            });
            var n = a(1)
              , o = a(2)
              , s = a(3)
              , c = a(12)
              , t = (e.prototype.selectFile = function() {
                this._fileInput.click()
            }
            ,
            e.prototype.linkDropArea = function(t) {
                function e(t) {
                    return t.preventDefault()
                }
                var i = this
                  , n = o.toNode(t)
                  , t = function(t) {
                    t.preventDefault(),
                    i.parseFiles(t.dataTransfer)
                };
                n.addEventListener("dragover", e),
                n.addEventListener("drop", t),
                this._dropAreas.set(n, {
                    dragover: e,
                    drop: t
                })
            }
            ,
            e.prototype.unlinkDropArea = function(t) {
                var i = this;
                t ? (t = o.toNode(t),
                this._unlinkDropArea(t),
                this._dropAreas.delete(t)) : (this._dropAreas.forEach(function(t, e) {
                    i._unlinkDropArea(e)
                }),
                this._dropAreas.clear())
            }
            ,
            e.prototype.parseFiles = function(t) {
                if (t.items && t.items[0] && t.items[0].webkitGetAsEntry)
                    this._parseAsWebkitEntry(t.items);
                else {
                    for (var e = t.files, i = 0; i < e.length; i++)
                        this._addFile(e[i]);
                    this.config.autosend && this.send()
                }
            }
            ,
            e.prototype.send = function(t) {
                var e = this;
                if (!this._uploadInfo || !this.isActive) {
                    var i = this.data.findAll(function(t) {
                        return t.status === c.FileStatus.queue || t.status === c.FileStatus.failed
                    }).filter(function(t) {
                        return e.events.fire(c.UploaderEvents.beforeUploadFile, [t])
                    });
                    if (i.length)
                        if (this.isActive = !0,
                        this._uploadInfo = {
                            files: i,
                            count: i.length,
                            size: i.reduce(function(t, e) {
                                return t + e.file.size
                            }, 0)
                        },
                        this.events.fire(c.UploaderEvents.uploadBegin, [i]),
                        this.events.fire(c.UploaderEvents.uploadProgress, [0, 0, this._uploadInfo.size]),
                        this.config.singleRequest)
                            this._xhrSend(i, t);
                        else {
                        	// added
                        	i.sort(function(a,b) {
                        		return a.size < b.size ? -1 : a.size > b.size ? 1 : 0;
                        	});
                            for (var n = 0, o = i; n < o.length; n++) {
                                var r = o[n];
                                this._xhrSend([r], t, n)
                            }
                        }
                }
            }
            ,
            e.prototype.abort = function(t) {
                if (t) {
                    t = this.data.getItem(t);
                    t && t.request && 4 !== t.request.readyState && t.request.abort()
                } else if (this._uploadInfo && this._uploadInfo.files)
                    for (var e = 0, i = this._uploadInfo.files; e < i.length; e++) {
                        var n = i[e];
                        this.abort(n.id)
                    }
            }
            ,
            e.prototype._unlinkDropArea = function(t) {
                var e, i = this._dropAreas.get(t);
                i && (e = i.dragover,
                i = i.drop,
                t.removeEventListener("dragover", e),
                t.removeEventListener("drop", i))
            }
            ,
            e.prototype._initEvents = function() {
                var i = this;
                this._fileInput.addEventListener("change", function() {
                    for (var t = i._fileInput.files, e = 0; e < t.length; e++)
                        i._addFile(t[e]);
                    i.config.autosend && i.send(),
                    i._fileInput.value = null
                })
            }
            ,
            e.prototype._xhrSend = function(a, t, idx) {
                for (var l = this, t = this._createFormData(a, t), r = new XMLHttpRequest, e = this.config.headerParams, i = 0, n = a; i < n.length; i++) {
                    var o = n[i];
                    this.data.update(o.id, {
                        request: r,
                        status: c.FileStatus.inprogress,
                        progress: 0
                    })
                }
                if (r.open("POST", this.config.target), e)
                    for (var s in e)
                        r.setRequestHeader(s, e[s]);

                r.upload.onprogress = function(t) {
                    for (var e = 0, i = a; e < i.length; e++) {
                        var n = i[e];
                        l.data.update(n.id, {
                            progress: t.loaded / t.total,
                            status: c.FileStatus.inprogress
                        })
                    }
                    var o = l._uploadInfo.files.reduce(function(t, e) {
                        return t + e.size * e.progress
                    }, 0) || 0
                      , r = l._uploadInfo.size
                      , s = o / l._uploadInfo.size * 100 || 0;
                    l.events.fire(c.UploaderEvents.uploadProgress, [s, o, r])
                }
                ,
                r.onloadend = function() {
                    l._uploadInfo.count = l.config.singleRequest ? 0 : l._uploadInfo.count - 1;
                    for (var t = 200 === r.status ? c.FileStatus.uploaded : c.FileStatus.failed, e = 200 === r.status && r.response ? JSON.parse(r.response) : null, i = 0, n = a; i < n.length; i++) {
                    	e && (e.result !== '0') && (e = null, t = c.FileStatus.failed); // added

                        var o = n[i];
                        l.data.update(o.id, {
                            status: t
                        }),
                        t === c.FileStatus.uploaded ?
                        	(
                        		l.config.updateFromResponse &&
                        		e &&
                        		(l.config.singleRequest && e[o.id] ?
                        						l.data.update(o.id, e[o.id]) : l.config.singleRequest || l.data.update(o.id, e)),
                        		l.events.fire(c.UploaderEvents.uploadFile, [o, e])
                        	)
                        	:
                        	l.events.fire(c.UploaderEvents.uploadFail, [o])
                    }
                    0 === l._uploadInfo.count && (l.isActive = !1,
                    l.events.fire(c.UploaderEvents.uploadComplete, [l._uploadInfo.files]))
                }
                ,
                setTimeout(function() {
                	r.send(t);
                }, 100*idx);
                //r.send(t)
            }
            ,
            e.prototype._parseAsWebkitEntry = function(t) {
                for (var e = this, i = [], n = 0; n < t.length; n++) {
                    var o = t[n].webkitGetAsEntry();
                    i.push(this._traverseFileTree(o))
                }
                r.all(i).then(function() {
                    e.config.autosend && e.send()
                })
            }
            ,
            e.prototype._createFormData = function(t, e) {
                var i = this.config.fieldName
                  , n = new FormData
                  , o = this.config.params;
                if (e)
                    for (var r in e)
                        n.append(r, e[r]);
                if (o)
                    for (var r in o)
                        n.append(r, o[r]);
                for (var s = 1 < t.length ? "[]" : "", a = 0, l = t; a < l.length; a++) {
                    var c = l[a];
                    //n.append(i + s, c.file, c.file.name),
                    (c.rename ? n.append(i + s, c.file, c.rename) : n.append(i + s, c.file, c.file.name)),
                    n.append(i + "_fullname" + s, c.path + c.file.name),
                    n.append(i + "_id" + s, c.id)
                }
                return n
            }
            ,
            e.prototype._addFile = function(t, e) {
                void 0 === e && (e = "");
                e = {
                    id: n.uid(),
                    file: t,
                    progress: 0,
                    status: c.FileStatus.queue,
                    src: null,
                    path: e
                };
                this.data.add(e)
            }
            ,
            e.prototype._traverseFileTree = function(t) {
                var n = this;
                return new r(function(r) {
                    var s = 0
                      , a = function(t, e) {
                        var i, o;
                        t.isFile ? (s++,
                        t.file(function(t) {
                            s--,
                            n._addFile(t, e),
                            0 === s && r()
                        })) : t.isDirectory && (i = t.createReader(),
                        i = i,
                        o = e + t.name + "/",
                        s++,
                        i.readEntries(function(t) {
                            s--;
                            for (var e = 0, i = t; e < i.length; e++) {
                                var n = i[e];
                                a(n, o)
                            }
                            0 === s && r()
                        }))
                    };
                    a(t, "")
                }
                )
            }
            ,
            e);
            function e(t, e, i) {
                void 0 === t && (t = {}),
                this.config = n.extend({
                    autosend: !0,
                    updateFromResponse: !0,
                    fieldName: "file"
                }, t),
                this.data = e || new s.DataCollection,
                this.events = i || this.data.events,
                this.isActive = !1,
                this._fileInput = document.createElement("input"),
                this._fileInput.type = "file",
                this._fileInput.multiple = !0,
                this._initEvents(),
                this._dropAreas = new Map
            }
            i.Uploader = t
        }
        ).call(this, a(6))
    }
    , function(t, e, i) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var n = i(2)
          , o = i(16)
          , l = i(31)
          , c = i(12)
          , u = i(9);
        e.gridTemplate = function(t) {
            var e = t.status === c.FileStatus.inprogress
              , i = t.status === c.FileStatus.failed
              , n = t.status !== c.FileStatus.uploaded
              , o = "dhx_dataview-item--file__";
            switch (t.status) {
            case c.FileStatus.inprogress:
                o += "progress";
                break;
            case c.FileStatus.queue:
                o += "queue";
                break;
            case c.FileStatus.failed:
                o += "failed";
                break;
            default:
                o = ""
            }
            var r = ""
              , s = "";
            t.link && (s = (r = (t.downloadURL || "") + t.link).split("/").pop().split("?")[0]);
            var a = "";
            return /image/.exec(l.getFileClassName(t)) && (t.image && t.image.src ? a = "style=\"background:url('" + t.image.src + "') center center no-repeat;background-size:cover\"" : t.link && (a = "style=\"background:url('" + r + "') center center no-repeat;background-size:cover\"")),
            '<div class="dhx_dataview-item--file ' + o + '">\n\t\t<div class="dhx_dataview-item--file-type ' + l.getFileClassName(t) + '" ' + a + "></div>\n\t\t" + (e ? '<div class="dhx_dataview-item--progress-block">\n\t\t\t\t\t<div class="dhx_dataview-item--progress-value">' + (100 * t.progress).toFixed(1) + '%</div>\n\t\t\t\t\t<svg xmlns="http://www.w3.org/2000/svg" class="dhx_vault-item--progress-circle" viewBox="0 0 60 60">\n\t\t\t\t\t\t<circle cx="30" cy="30" r="28" stroke-width="4" class="dhx_vault-item--progress-bar-background"></circle>\n\t\t\t\t\t\t<circle cx="30" cy="30" r="28" stroke-width="4" stroke-dasharray="175.9 175.9" stroke-dashoffset="' + 175.9 * (1 - t.progress) + '" class="active-circle dhx_vault-item--progress-bar-active"></circle>\n\t\t\t\t\t</svg>\n\t\t\t\t</div>' : '<div class="dhx_dataview-item--default-block">\n\t\t\t\t\t' + (i ? '<div class="dhx_dataview-item--error-mark dxi dxi-alert-circle"></div>' : n ? '<div class="dhx_dataview-item--error-mark dxi dxi-vault"></div>' : '<div class="dhx_dataview-item--success-mark dxi dxi-checkbox-marked-circle"></div>') + '\n\t\t\t\t</div>\n\t\t\t\t<div class="dhx_dataview-item--hover-block">\n\t\t\t\t\t<div class="dhx_dataview-item--control-block ' + (i || n || !t.link ? "dhx_dataview-item--control-block__withoutLink" : "") + '">\n\t\t\t\t\t\t' + (i || n || !t.link ? '<div class="dhx_dataview-item--remove-btn dxi dxi-delete-forever"></div>' : '<a href="' + r + '" class="dhx_dataview-item--download-btn dxi dxi-download" download="' + s + '"></a>\n\t\t\t\t\t\t\t\t\t<div class="dhx_dataview-item--remove-btn dxi dxi-delete-forever"></div>') + "\n\t\t\t\t\t</div>\n\t\t\t\t\t" + (i ? '<div class="dhx_dataview-item--error-text">' + u.default.error + "</div>" : '<div class="dhx_dataview-item--file-size">' + l.getBasis(t.size) + "</div>") + "\n\t\t\t\t</div>") + '\n\t\t</div>\n\t<div class="dhx_dataview-item--file-name">' + l.truncateWord(t.name) + "</div>"
        }
        ,
        e.listTemplate = function(t) {
            var e = t.status === c.FileStatus.failed
              , i = t.status === c.FileStatus.inprogress
              , n = t.status !== c.FileStatus.uploaded && !e
              , o = ""
              , r = "";
            return t.link && (r = (o = (t.downloadURL || "") + t.link).split("/").pop().split("?")[0]),
            '<div class="dhx_list-item--icon ' + (n ? "dhx_list-item--queue" : "") + '">\n\t\t\t<div class="dhx_list-item--file-type ' + l.getFileClassName(t) + '"></div>\n\t\t</div>\n\t\t<div class="dhx_list-item--content">\n\t\t' + (i ? '<div class="dhx_list-item--name">' + t.name + '\n\t\t\t\t\t<p class="dhx_item--progress-value">' + (100 * t.progress).toFixed(1) + "%</p>\n\t\t\t\t</div>" : '<div class="dhx_list-item--name">' + t.name + "\n\t\t\t\t\t" + (e ? '<div class="dhx_list-item--error-info">' + u.default.error + "</div>" : "") + '\n\t\t\t\t\t<div class="dhx_list-item--size ' + (e ? "error" : "") + '">' + l.getBasis(t.size) + "</div>\t\n\t\t\t\t</div>") + "\n\t\t</div>\n\t\t" + (i ? '<div class="dhx_item--download-progress" style="width:' + (100 * t.progress).toFixed(1) + '%"></div>' : '<div class="dhx_item--info">\n\t\t\t\t\t' + (e ? '<div class="dhx_item--error-mark dxi dxi-alert-circle"></div><div class="dhx_item--btn-remove dxi dxi-delete-forever"></div>' : (n ? '<div class="dhx_item--error-mark dxi dxi-vault"></div>' : '<div class="dhx_item--success-mark dxi dxi-checkbox-marked-circle"></div>') + '\n\t\t\t\t\t\t\t<div class="dhx_item--hover-block">\n\t\t\t\t\t\t\t\t' + (e || n || !t.link ? "" : '<a href="' + o + '" class="dhx_item--download-btn dxi dxi-download" download="' + r + '"></a>') + '\n\t\t\t\t\t\t\t\t<div class="dhx_item--btn-remove dxi dxi-delete-forever"></div>\n\t\t\t\t\t\t\t</div>') + "\n\t\t\t\t</div>")
        }
        ,
        e.getContainersEvents = function(i) {
            function t(t) {
                var e = n.locate(t);
                e && (e = i.getItem(e),
                o.tooltip(e.name, {
                    node: t.target,
                    position: o.Position.bottom
                }))
            }
            return {
                onclick: {
                    "dxi-delete-forever": function(t) {
                        t = n.locate(t);
                        t && l.removeItem(i, t)
                    }
                },
                onmouseover: {
                    "dxi-download": function(t) {
                        o.tooltip(u.default.download, {
                            node: t.target,
                            position: o.Position.bottom
                        })
                    },
                    "dxi-delete-forever": function(t) {
                        o.tooltip(u.default.clear, {
                            node: t.target,
                            position: o.Position.bottom
                        })
                    },
                    "dhx_list-item--name": t,
                    "dhx_dataview-item--file-name": t
                }
            }
        }
    }
    , function(t, e, i) {
        "use strict";
        var n, o = this && this.__extends || (n = function(t, e) {
            return (n = Object.setPrototypeOf || {
                __proto__: []
            }instanceof Array && function(t, e) {
                t.__proto__ = e
            }
            || function(t, e) {
                for (var i in e)
                    e.hasOwnProperty(i) && (t[i] = e[i])
            }
            )(t, e)
        }
        ,
        function(t, e) {
            function i() {
                this.constructor = t
            }
            n(t, e),
            t.prototype = null === e ? Object.create(e) : (i.prototype = e.prototype,
            new i)
        }
        );
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var r, s = i(0), a = i(8), l = i(9), c = i(12), o = (r = a.View,
        o(u, r),
        u.prototype.setState = function(t, e) {
            this._progress = t,
            this.config.template ? this._progressText = this.config.template(t, e) : this._progressText = this._progress.toFixed(1) + "%",
            this.paint()
        }
        ,
        u.prototype._draw = function() {
            return s.el(".progress-bar", {
                _key: this._uid
            }, [s.el(".progress-indicator", {
                style: {
                    width: this._progress + "%"
                }
            }), s.el(".progress-text", {
                ".innerHTML": this._progressText
            }), s.el("button", {
                class: "dhx_button dhx_button--color_primary dhx_button--size_small dhx_button--view_flat action-abort-all",
                onclick: this._abortUpload
            }, l.default.cancel)])
        }
        ,
        u);
        function u(t, e) {
            var i = r.call(this, null, e) || this;
            i.events = t,
            i._progress = 0;
            return i.mount(null, s.create({
                render: function() {
                    return i._draw()
                }
            })),
            i._abortUpload = function() {
                i.events.fire(c.ProgressBarEvents.cancel)
            }
            ,
            i
        }
        e.ProgressBar = o
    }
    , function(t, e, i) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var n = (o.prototype.add = function(t, e) {
            void 0 === e && (e = !1),
            this._readerStack.push(t),
            e || this.read()
        }
        ,
        o.prototype.read = function() {
            var i, t, n = this;
            this._readerStack.length && !this._isActive && (i = this._readerStack.shift(),
            this._isActive = !0,
            (t = new FileReader).readAsDataURL(i.file),
            t.onload = function(t) {
                var e = new Image;
                e.src = t.target.result,
                e.onload = function() {
                    n._data.exists(i.id) && n._data.update(i.id, {
                        image: e
                    }),
                    n._isActive = !1,
                    n.read()
                }
            }
            ,
            t.onerror = function() {
                n._isActive = !1,
                n.read()
            }
            )
        }
        ,
        o.prototype.stop = function() {
            this._readerStack = []
        }
        ,
        o);
        function o(t) {
            this._readerStack = [],
            this._isActive = !1,
            this._data = t
        }
        e.ReadStackPreview = n
    }
    , function(t, i, e) {
        "use strict";
        function n(t) {
            for (var e in t)
                i.hasOwnProperty(e) || (i[e] = t[e])
        }
        Object.defineProperty(i, "__esModule", {
            value: !0
        }),
        n(e(84)),
        n(e(21))
    }
    , function(t, e, i) {
        "use strict";
        var n, o = this && this.__extends || (n = function(t, e) {
            return (n = Object.setPrototypeOf || {
                __proto__: []
            }instanceof Array && function(t, e) {
                t.__proto__ = e
            }
            || function(t, e) {
                for (var i in e)
                    e.hasOwnProperty(i) && (t[i] = e[i])
            }
            )(t, e)
        }
        ,
        function(t, e) {
            function i() {
                this.constructor = t
            }
            n(t, e),
            t.prototype = null === e ? Object.create(e) : (i.prototype = e.prototype,
            new i)
        }
        ), u = this && this.__assign || function() {
            return (u = Object.assign || function(t) {
                for (var e, i = 1, n = arguments.length; i < n; i++)
                    for (var o in e = arguments[i])
                        Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
                return t
            }
            ).apply(this, arguments)
        }
        ;
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var r, s = i(1), d = i(0), a = i(18), l = i(32), c = i(8), h = i(3), f = i(5), p = i(2), v = i(21), _ = i(89), o = (r = c.View,
        o(g, r),
        g.prototype.editItem = function(t) {
            this._edited = t,
            this.data.getItem(this._edited) && this.events.fire(v.DataViewEvents.beforeEditStart, [t]) ? (this._getHotkeys(),
            this.paint(),
            this.events.fire(v.DataViewEvents.afterEditStart, [t])) : this._edited = null
        }
        ,
        g.prototype.getFocusItem = function() {
            return this.data.getItem(this.data.getId(this._focusIndex))
        }
        ,
        g.prototype.setItemInRow = function(t) {
            this.config.itemsInRow = t,
            this.paint()
        }
        ,
        g.prototype.setFocus = function(t) {
            t = this.data.getIndex(t);
            this._setFocusIndex(t)
        }
        ,
        g.prototype.getFocus = function() {
            var t = this.data.getItem(this.data.getId(this._focusIndex));
            if (t)
                return t.id
        }
        ,
        g.prototype.destructor = function() {
            this.events.clear(),
            this._navigationDestructor && this._navigationDestructor(),
            this._documentClickDestuctor && this._documentClickDestuctor(),
            this.unmount()
        }
        ,
        g.prototype.getFocusIndex = function() {
            return this._focusIndex
        }
        ,
        g.prototype.setFocusIndex = function(t) {
            this._setFocusIndex(t)
        }
        ,
        g.prototype.edit = function(t) {
            this.editItem(t)
        }
        ,
        g.prototype.disableSelection = function() {
            this.selection.disable(),
            this.paint()
        }
        ,
        g.prototype.enableSelection = function() {
            this.selection.enable(),
            this.paint()
        }
        ,
        g.prototype._dblClick = function(t) {
            var e = p.locate(t);
            e && (this.config.editable && this.editItem(e),
            this.events.fire(v.DataViewEvents.doubleClick, [e, t]))
        }
        ,
        g.prototype._clearTouchTimer = function() {
            this._touch.timer && (clearTimeout(this._touch.timer),
            this._touch.timer = null)
        }
        ,
        g.prototype._dragStart = function(t) {
            var e = this;
            this._touch.start = !0;
            var i = []
              , n = p.locateNode(t, "dhx_id")
              , o = n && n.getAttribute("dhx_id")
              , n = this.selection.getId();
            return this.config.multiselection && n instanceof Array && n.map(function(t) {
                t !== o && e.getRootView().refs[t] && i.push(e.getRootView().refs[t].el)
            }),
            this.config.dragMode && !this._edited ? h.dragManager.onMouseDown(t, this.selection.getId() || o, i) : null
        }
        ,
        g.prototype._setFocusIndex = function(t) {
            var e, i;
            t < 0 || t > this.data.getLength() - 1 || (this._focusIndex = t,
            (e = this.getRootNode()) && e.parentNode && ((i = e.children[Math.floor(this._focusIndex / this.config.itemsInRow)]) && (t = i.children[this._focusIndex % this.config.itemsInRow],
            i = parseInt(this.config.gap.toString().replace("px", ""), null),
            t.offsetTop >= e.clientHeight + e.scrollTop - t.clientHeight ? e.scrollTop = t.offsetTop - e.clientHeight + t.clientHeight + i : t.offsetTop < e.scrollTop - i && (e.scrollTop = t.offsetTop - i)),
            this.events.fire(v.DataViewEvents.focusChange, [this._focusIndex, this.data.getId(this._focusIndex)]),
            this.paint()))
        }
        ,
        g.prototype._renderItem = function(t, e, i) {
            function n(t) {
                return parseFloat(t)
            }
            var o = this.config
              , r = o.itemsInRow
              , s = o.gap
              , a = o.template
              , l = o.itemHeight
              , c = a ? a(t) : t.htmlContent
              , o = t.id.toString();
            return o !== this._edited ? d.el("div", u(u({}, this._events), {
                class: "dhx_dataview-item" + (t.$selected ? " dhx_dataview-item--selected" : "") + (e ? " dhx_dataview-item--focus" : "") + (t.$drophere && !this._edited ? " dhx_dataview-item--drophere" : "") + (t.$dragtarget && !this._edited ? " dhx_dataview-item--dragtarget" : "") + (this.config.dragMode && !this._edited ? " dhx_dataview-item--drag" : "") + (n(s) ? " dhx_dataview-item--with-gap" : "") + (!(t.css && t.$selected || t.css && e) && t.css ? " " + t.css : "") + (i ? " dhx_dataview-item--last-item-in-row" : ""),
                style: {
                    width: "calc(" + 100 / r + "% - " + n(s) + " * " + (r - 1) / r + "px)",
                    "margin-right": i ? "" : s,
                    height: a ? null : l
                },
                _key: o,
                dhx_id: o,
                _ref: o
            }), c ? [d.el(".dhx_dataview-item__inner-html", {
                ".innerHTML": c
            })] : t.value || t.text || t.value) : _.getEditor(t, this).toHTML(i)
        }
        ,
        g.prototype._draw = function() {
            var n = this
              , t = this.config
              , o = t.itemsInRow
              , e = t.css
              , i = t.gap
              , r = 0
              , t = this.data.reduce(function(t, e, i) {
                return 0 === r && t.push([]),
                t[t.length - 1].push(n._renderItem(e, i === n._focusIndex, r === o - 1)),
                r = (r + 1) % o,
                t
            }, []);
            return d.el("", u(u({}, this._handlers), {
                dhx_widget_id: this._uid,
                class: (e || "") + " dhx_widget dhx_dataview" + (this.config.multiselection && this.selection.getItem() ? " dhx_no-select--pointer" : ""),
                style: {
                    height: this.config.height
                }
            }), t.map(function(t) {
                return d.el(".dhx_dataview-row", {
                    style: {
                        margin: i
                    }
                }, t)
            }))
        }
        ,
        g.prototype._getHotkeys = function() {
            var t, e, i = this;
            this.config.keyNavigation && (this._edited ? this._navigationDestructor && this._navigationDestructor() : (t = this.config.keyNavigation,
            "function" != typeof this.config.keyNavigation && (this._widgetInFocus = !1,
            t = function() {
                return i._widgetInFocus
            }
            ,
            this._documentClickDestuctor = s.detectWidgetClick(this._uid, function(t) {
                return i._widgetInFocus = t
            })),
            e = {
                arrowDown: (e = function(e) {
                    return function(t) {
                        t.preventDefault(),
                        e()
                    }
                }
                )(function() {
                    return i.setFocusIndex(i._focusIndex + i.config.itemsInRow)
                }),
                arrowUp: e(function() {
                    return i.setFocusIndex(i._focusIndex - i.config.itemsInRow)
                }),
                arrowLeft: e(function() {
                    return i.setFocusIndex(i._focusIndex - 1)
                }),
                arrowRight: e(function() {
                    return i.setFocusIndex(i._focusIndex + 1)
                }),
                enter: function(t) {
                    var e = i.data.getId(i._focusIndex);
                    i.selection.add(e),
                    i.events.fire(v.DataViewEvents.click, [e, t])
                },
                "enter+shift": function(t) {
                    var e = i.data.getId(i._focusIndex);
                    i.selection.add(e, !1, !0),
                    i.events.fire(v.DataViewEvents.click, [e, t])
                },
                "enter+ctrl": function(t) {
                    var e = i.data.getId(i._focusIndex);
                    i.selection.add(e, !0, !1),
                    i.events.fire(v.DataViewEvents.click, [e, t])
                },
                "ctrl+a": function(t) {
                    i.config.multiselection && (t.preventDefault(),
                    i.selection.remove(),
                    i.data.map(function(t) {
                        return t.id
                    }).forEach(function(t) {
                        "ctrlClick" === i.config.multiselection ? i.selection.add(t, !0) : i.selection.add(t)
                    }))
                }
            },
            p.isIE() && (delete (e = u({
                up: e.arrowUp,
                down: e.arrowDown,
                right: e.arrowRight,
                left: e.arrowLeft
            }, e)).arrowUp,
            delete e.arrowDown,
            delete e.arrowRight,
            delete e.arrowLeft),
            this._navigationDestructor = a.addHotkeys(e, t)))
        }
        ,
        g);
        function g(t, e) {
            void 0 === e && (e = {});
            var o = r.call(this, t, s.extend({
                keyNavigation: !0,
                itemsInRow: 1,
                selection: !0,
                multiselectionMode: e.multiselectionMode ? e.multiselectionMode : "click",
                gap: "0px",
                editable: !1
            }, e)) || this;
            o._events = {},
            o._touch = {
                duration: 350,
                dblDuration: 300,
                timer: null,
                start: !1,
                timeStamp: null
            },
            "ctrlClick" === o.config.multiselectionMode && (o.config.multiselection = "ctrlClick"),
            o.config.editable = o.config.editable || o.config.editing,
            Array.isArray(o.config.data) ? (o.events = new f.EventSystem(o),
            o.data = new h.DataCollection({},o.events),
            o.data.parse(o.config.data)) : o.config.data && o.config.data.events ? (o.data = o.config.data,
            o.events = o.data.events,
            o.events.context = o) : (o.events = new f.EventSystem(o),
            o.data = new h.DataCollection({},o.events)),
            o.selection = new l.Selection({
                multiselection: o.config.multiselection,
                disable: !o.config.selection
            },o.data),
            o._focusIndex = !o.config.selection && o.config.keyNavigation ? 0 : void 0,
            o._getHotkeys();
            var i, e = function(n) {
                return function(t) {
                    var e = t.source
                      , i = t.target
                      , t = t.start;
                    e && e instanceof Array && 1 < e.length ? e.map(function(t) {
                        return o.data.exists(t) && o.data.update(t, n)
                    }) : (o.data.exists(i) && o.data.update(i, n),
                    o.data.exists(t) && o.data.update(t, n))
                }
            };
            if (o.events.on(h.DataEvents.beforeRemove, function(t) {
                o.data.getIndex(t.id) < o._focusIndex && o._focusIndex--
            }),
            o.events.on(h.DataEvents.afterRemove, function() {
                var t = o.selection.getId();
                if (t || o._focusIndex)
                    return !t && o._focusIndex ? (t = o.data.getId(o._focusIndex),
                    void o.setFocus(t)) : void o.setFocus(t[t.length - 1])
            }),
            o.events.on(h.DataEvents.change, function() {
                o.paint()
            }),
            o.events.on(h.DragEvents.canDrop, e({
                $drophere: !0
            })),
            o.events.on(h.DragEvents.cancelDrop, e({
                $drophere: void 0
            })),
            o.events.on(h.DragEvents.dragStart, e({
                $dragtarget: !0
            })),
            o.events.on(h.DragEvents.afterDrag, e({
                $dragtarget: void 0
            })),
            o.events.on(v.DataViewEvents.afterEditEnd, function(t, e) {
                var i = o.data.getItem(e);
                o.data.update(e, u(u({}, i), {
                    value: t
                })),
                o._edited = null,
                o._getHotkeys(),
                o.paint()
            }),
            o._handlers = {
                onmousedown: function(t) {
                    o._dragStart(t)
                },
                ontouchstart: function(t) {
                    o._touch.timer = setTimeout(function() {
                        o._dragStart(t)
                    }, o._touch.duration),
                    o._touch.timeStamp ? (o._touch.dblDuration >= o._touch.timeStamp - +t.timeStamp.toFixed() && (t.preventDefault(),
                    o._dblClick(t)),
                    o._touch.timeStamp = null) : o._touch.timeStamp = +t.timeStamp.toFixed(),
                    setTimeout(function() {
                        o._touch.timeStamp = null
                    }, o._touch.dblDuration)
                },
                ontouchmove: function(t) {
                    o._touch.start && t.preventDefault(),
                    o._clearTouchTimer()
                },
                ontouchend: function() {
                    o._touch.start = !1,
                    o._clearTouchTimer()
                },
                ondragstart: function() {
                    return !(o.config.dragMode && !o._edited) && null
                },
                oncontextmenu: function(t) {
                    var e = !!p.locate(t) && o.data.getItem(p.locate(t)).id;
                    e && (o.events.fire(v.DataViewEvents.itemRightClick, [e, t]),
                    o.events.fire(v.DataViewEvents.contextmenu, [e, t]))
                },
                ondblclick: function(t) {
                    o._dblClick(t)
                },
                onclick: function(t) {
                    var e = !!p.locate(t) && o.data.getItem(p.locate(t)).id;
                    e && (o.setFocus(e),
                    o.selection.add(e, t.ctrlKey || t.metaKey, t.shiftKey),
                    o.events.fire(v.DataViewEvents.click, [e, t]))
                },
                onmouseover: function(t) {
                    var e = !!p.locate(t) && o.data.getItem(p.locate(t)).id
                      , i = p.locateNode(t, "dhx_id", "relatedTarget");
                    i || !e ? i && (i = i.getAttribute("dhx_id") ? i.getAttribute("dhx_id") : null,
                    e && e !== (i || "") && o.events.fire(v.DataViewEvents.itemMouseOver, [e, t])) : o.events.fire(v.DataViewEvents.itemMouseOver, [e, t])
                }
            },
            o.config.dragMode && h.dragManager.setItem(o._uid, o),
            o.config.eventHandlers)
                for (var n in o.config.eventHandlers) {
                    o.config.eventHandlers.hasOwnProperty(n) && (i = o.config.eventHandlers[n],
                    o._events[n] = p.eventHandler(function(t) {
                        return p.locate(t, "dhx_id")
                    }, u({}, i)))
                }
            e = d.create({
                render: function() {
                    return o._draw()
                },
                hooks: {
                    didRedraw: function(t) {
                        var e = t.node.el
                          , i = e.scrollHeight > e.offsetHeight
                          , e = t.node.attrs.class.replace(" dhx_dataview--has-scroll", "")
                          , e = i ? e + " dhx_dataview--has-scroll" : e;
                        t.node.patch({
                            class: e
                        })
                    }
                }
            });
            return o.mount(t, e),
            o
        }
        e.DataView = o
    }
    , function(t, e, i) {
        "use strict";
        var n, o = this && this.__extends || (n = function(t, e) {
            return (n = Object.setPrototypeOf || {
                __proto__: []
            }instanceof Array && function(t, e) {
                t.__proto__ = e
            }
            || function(t, e) {
                for (var i in e)
                    e.hasOwnProperty(i) && (t[i] = e[i])
            }
            )(t, e)
        }
        ,
        function(t, e) {
            function i() {
                this.constructor = t
            }
            n(t, e),
            t.prototype = null === e ? Object.create(e) : (i.prototype = e.prototype,
            new i)
        }
        ), r = this && this.__assign || function() {
            return (r = Object.assign || function(t) {
                for (var e, i = 1, n = arguments.length; i < n; i++)
                    for (var o in e = arguments[i])
                        Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
                return t
            }
            ).apply(this, arguments)
        }
        ;
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var s, a = i(1), l = i(3), c = i(0), u = i(5), d = i(18), h = i(8), f = i(33), p = i(2), v = i(20), _ = i(86), g = i(88), o = (s = h.View,
        o(m, s),
        m.prototype.editItem = function(t) {
            this._edited = t,
            this.data.getItem(this._edited) && this.events.fire(v.ListEvents.beforeEditStart, [t]) ? (this._getHotkeys(),
            this.paint(),
            this.events.fire(v.ListEvents.afterEditStart, [t])) : this._edited = null
        }
        ,
        m.prototype.getFocusItem = function() {
            return this.data.getItem(this.data.getId(this._focusIndex))
        }
        ,
        m.prototype.setFocus = function(t) {
            t = this.data.getIndex(t);
            this._setFocusIndex(t)
        }
        ,
        m.prototype.getFocus = function() {
            var t = this.data.getId(this._focusIndex);
            if (t)
                return t
        }
        ,
        m.prototype.destructor = function() {
            this._navigationDestructor && this._navigationDestructor(),
            this._documentClickDestuctor && this._documentClickDestuctor(),
            this.unmount()
        }
        ,
        m.prototype.getFocusIndex = function() {
            return this._focusIndex
        }
        ,
        m.prototype.setFocusIndex = function(t) {
            this._setFocusIndex(t)
        }
        ,
        m.prototype.edit = function(t) {
            this.editItem(t)
        }
        ,
        m.prototype.disableSelection = function() {
            this.selection.disable(),
            this.paint()
        }
        ,
        m.prototype.enableSelection = function() {
            this.selection.enable(),
            this.paint()
        }
        ,
        m.prototype._renderItem = function(t, e) {
            var i = this.config.template && this.config.template(t) || t.html
              , e = e === this._focusIndex;
            return t.id !== this._edited ? i ? this._renderAsHtml(i, t, e) : this._renderAsValue(t, e) : _.getEditor(t, this).toHTML()
        }
        ,
        m.prototype._renderAsHtml = function(t, e, i) {
            var n = this.config.itemHeight;
            return c.el("li", r(r({}, this._events), {
                class: "dhx_list-item" + (e.$selected ? " dhx_list-item--selected" : "") + (i ? " dhx_list-item--focus" : "") + (e.$drophere && !this._edited ? " dhx_list-item--drophere" : "") + (e.$dragtarget && !this._edited ? " dhx_list-item--dragtarget" : "") + (this.config.dragMode && !this._edited ? " dhx_list-item--drag" : "") + (e.css ? " " + e.css : ""),
                dhx_id: e.id,
                _ref: e.id.toString(),
                style: {
                    height: n
                },
                _key: e.id,
                ".innerHTML": t
            }))
        }
        ,
        m.prototype._renderAsValue = function(t, e) {
            var i = this.config.itemHeight;
            return c.el("li", {
                class: "dhx_list-item dhx_list-item--text" + (t.$selected ? " dhx_list-item--selected" : "") + (e ? " dhx_list-item--focus" : "") + (t.$drophere && !this._edited ? " dhx_list-item--drophere" : "") + (t.$dragtarget && !this._edited ? " dhx_list-item--dragtarget" : "") + (this.config.dragMode && !this._edited ? " dhx_list-item--drag" : "") + (t.css ? " " + t.css : ""),
                dhx_id: t.id,
                _ref: t.id.toString(),
                style: {
                    height: i
                },
                _key: t.id
            }, t.text || t.value)
        }
        ,
        m.prototype._renderList = function() {
            var i = this
              , t = this.data.map(function(t, e) {
                return i._renderItem(t, e)
            });
            return c.el("ul.dhx_widget.dhx_list", r({
                style: {
                    "min-height": this.config.itemHeight,
                    "max-height": this.config.height,
                    position: "relative"
                },
                class: (this.config.css ? this.config.css : "") + (this.config.multiselection && this.selection.getItem() ? " dhx_no-select--pointer" : ""),
                dhx_widget_id: this._uid
            }, this._handlers), t)
        }
        ,
        m.prototype._renderVirtualList = function() {
            var i = this
              , t = this.data.mapRange(this._range[0], this._range[1], function(t, e) {
                return i._renderItem(t, e)
            });
            return c.el(".dhx_widget.dhx_virtual-list-wrapper", r({
                dhx_widget_id: this._uid,
                style: {
                    "min-height": this.config.itemHeight,
                    "max-height": this._visibleHeight
                }
            }, this._handlers), [c.el("ul.dhx_list.dhx_list--virtual", {
                class: (this.config.css ? this.config.css : "") + (this.config.multiselection && this.selection.getItem() ? " dhx_no-select--pointer" : ""),
                style: {
                    height: this._getHeight() + g.defineUnit(this.config.itemHeight),
                    "padding-top": this._topOffset
                }
            }, t)])
        }
        ,
        m.prototype._dblClick = function(t) {
            var e = p.locate(t);
            e && (this.config.editable && this.editItem(e),
            this.events.fire(v.ListEvents.doubleClick, [e, t]))
        }
        ,
        m.prototype._clearTouchTimer = function() {
            this._touch.timer && (clearTimeout(this._touch.timer),
            this._touch.timer = null)
        }
        ,
        m.prototype._dragStart = function(t) {
            var e = this;
            this._touch.start = !0;
            var i = []
              , n = p.locateNode(t, "dhx_id")
              , o = n && n.getAttribute("dhx_id")
              , n = this.selection.getId();
            return this.config.multiselection && n instanceof Array && n.map(function(t) {
                t !== o && e.getRootView().refs[t] && i.push(e.getRootView().refs[t].el)
            }),
            this.config.dragMode && !this._edited ? l.dragManager.onMouseDown(t, this.selection.getId() || o, i) : null
        }
        ,
        m.prototype._setFocusIndex = function(t) {
            if (!(t < 0 || t > this.data.getLength() - 1)) {
                this._focusIndex = t;
                var e = this.getRootView();
                if (e && e.node && e.node.el) {
                    var i = this.getRootNode();
                    if (i) {
                        if (this.config.virtual) {
                            e = t * g.defineValue(this.config.itemHeight);
                            (e >= g.defineValue(this._visibleHeight) + this._topOffset || e < this._topOffset) && i.scrollTo(0, e)
                        } else {
                            t = i.children[t];
                            if (!t)
                                return;
                            t.offsetTop >= i.scrollTop + i.clientHeight - t.clientHeight ? i.scrollTop = t.offsetTop - i.clientHeight + t.clientHeight : t.offsetTop < i.scrollTop && (i.scrollTop = t.offsetTop)
                        }
                        this.events.fire(v.ListEvents.focusChange, [this._focusIndex, this.data.getId(this._focusIndex)]),
                        this.paint()
                    }
                }
            }
        }
        ,
        m.prototype._updateVirtual = function(t) {
            var e = this._getHeight();
            t > e - g.defineValue(this._visibleHeight) && (t = e - g.defineValue(this._visibleHeight));
            var i = Math.floor(g.defineValue(this._visibleHeight) / g.defineValue(this.config.itemHeight)) + 5
              , e = Math.floor(t / g.defineValue(this.config.itemHeight));
            this._range = [e, i + e],
            this._topOffset = t,
            this.paint()
        }
        ,
        m.prototype._getHeight = function() {
            return this.data.getLength() * g.defineValue(this.config.itemHeight)
        }
        ,
        m.prototype._getHotkeys = function() {
            var t, e, i = this;
            this.config.keyNavigation && (this._edited ? this._navigationDestructor && this._navigationDestructor() : (t = this.config.keyNavigation,
            "function" != typeof this.config.keyNavigation && (this._widgetInFocus = !1,
            t = function() {
                return i._widgetInFocus
            }
            ,
            this._documentClickDestuctor = a.detectWidgetClick(this._uid, function(t) {
                return i._widgetInFocus = t
            })),
            e = {
                arrowDown: (e = function(e) {
                    return function(t) {
                        t.preventDefault(),
                        e()
                    }
                }
                )(function() {
                    return i.setFocusIndex(i._focusIndex + 1)
                }),
                arrowUp: e(function() {
                    return i.setFocusIndex(i._focusIndex - 1)
                }),
                enter: function(t) {
                    var e = i.data.getId(i._focusIndex);
                    i.selection.add(e),
                    i.events.fire(v.ListEvents.click, [e, t])
                },
                "enter+shift": function(t) {
                    var e = i.data.getId(i._focusIndex);
                    i.selection.add(e, !1, !0),
                    i.events.fire(v.ListEvents.click, [e, t])
                },
                "enter+ctrl": function(t) {
                    var e = i.data.getId(i._focusIndex);
                    i.selection.add(e, !0, !1),
                    i.events.fire(v.ListEvents.click, [e, t])
                },
                "ctrl+a": function(t) {
                    i.config.multiselection && (t.preventDefault(),
                    i.selection.remove(),
                    i.data.map(function(t) {
                        return t.id
                    }).forEach(function(t) {
                        "ctrlClick" === i.config.multiselection ? i.selection.add(t, !0) : i.selection.add(t)
                    }))
                }
            },
            p.isIE() && (delete (e = r({
                up: e.arrowUp,
                down: e.arrowDown
            }, e)).arrowUp,
            delete e.arrowDown),
            this._navigationDestructor = d.addHotkeys(e, t)))
        }
        ,
        m.prototype._lazyLoad = function(t) {
            var e = t.target.scrollTop
              , i = Math.round(e / g.defineValue(this.config.itemHeight))
              , t = this.config.height / g.defineValue(this.config.itemHeight)
              , e = this.data.dataProxy;
            e && e.config && !this.data.isDataLoaded(i, t + i + e.config.prepare) && (e.updateUrl(null, {
                from: i,
                limit: e.config.limit
            }),
            this.data.load(e))
        }
        ,
        m);
        function m(t, e) {
            void 0 === e && (e = {});
            var o = s.call(this, t, a.extend({
                itemHeight: e.virtual ? 37 : e.itemHeight || null,
                keyNavigation: !1,
                selection: !0,
                multiselectionMode: e.multiselectionMode ? e.multiselectionMode : "click",
                editable: !1
            }, e)) || this;
            o._events = {},
            o._touch = {
                duration: 350,
                dblDuration: 300,
                timer: null,
                start: !1,
                timeStamp: null
            },
            "ctrlClick" === o.config.multiselectionMode && (o.config.multiselection = "ctrlClick"),
            o.config.editable = o.config.editable || o.config.editing,
            Array.isArray(o.config.data) ? (o.events = new u.EventSystem(o),
            o.data = new l.DataCollection({},o.events),
            o.data.parse(o.config.data)) : o.config.data && o.config.data.events ? (o.data = o.config.data,
            o.events = o.data.events,
            o.events.context = o) : (o.events = new u.EventSystem(o),
            o.data = new l.DataCollection({},o.events)),
            o.selection = new f.Selection({
                multiselection: o.config.multiselection,
                disable: !o.config.selection
            },o.data),
            o._focusIndex = !o.config.selection && o.config.keyNavigation ? 0 : void 0,
            o._getHotkeys();
            var i, e = function(n) {
                return function(t) {
                    var e = t.source
                      , i = t.target
                      , t = t.start;
                    e && e instanceof Array && 1 < e.length ? e.map(function(t) {
                        return o.data.exists(t) && o.data.update(t, n)
                    }) : (o.data.exists(i) && o.data.update(i, n),
                    o.data.exists(t) && o.data.update(t, n))
                }
            };
            if (o.events.on(l.DataEvents.change, function() {
                o.paint()
            }),
            o.events.on(l.DataEvents.beforeRemove, function(t) {
                o.data.getIndex(t.id) < o._focusIndex && o._focusIndex--
            }),
            o.events.on(l.DataEvents.afterRemove, function() {
                var t = o.selection.getId();
                if (t || o._focusIndex)
                    return !t && o._focusIndex ? (t = o.data.getId(o._focusIndex),
                    void o.setFocus(t)) : void o.setFocus(t[t.length - 1])
            }),
            o.events.on(l.DataEvents.load, function() {
                o.config.virtual && o._updateVirtual(0),
                o.data.map(function(t) {
                    t.$selected && (o.selection.add(t.id),
                    o.events.fire(v.ListEvents.click, [t.id, null]))
                })
            }),
            o.events.on(l.DragEvents.canDrop, e({
                $drophere: !0
            })),
            o.events.on(l.DragEvents.cancelDrop, e({
                $drophere: void 0
            })),
            o.events.on(l.DragEvents.dragStart, e({
                $dragtarget: !0
            })),
            o.events.on(l.DragEvents.afterDrag, e({
                $dragtarget: void 0
            })),
            o.events.on(v.ListEvents.afterEditEnd, function(t, e) {
                var i = o.data.getItem(e);
                o.data.update(e, r(r({}, i), {
                    value: t
                })),
                o._edited = null,
                o._getHotkeys(),
                o.paint()
            }),
            o._handlers = {
                onmousedown: function(t) {
                    o._dragStart(t)
                },
                ontouchstart: function(t) {
                    o._touch.timer = setTimeout(function() {
                        o._dragStart(t)
                    }, o._touch.duration),
                    o._touch.timeStamp ? (o._touch.dblDuration >= o._touch.timeStamp - +t.timeStamp.toFixed() && (t.preventDefault(),
                    o._dblClick(t)),
                    o._touch.timeStamp = null) : o._touch.timeStamp = +t.timeStamp.toFixed(),
                    setTimeout(function() {
                        o._touch.timeStamp = null
                    }, o._touch.dblDuration)
                },
                ontouchmove: function(t) {
                    o._touch.start && t.preventDefault(),
                    o._clearTouchTimer()
                },
                ontouchend: function() {
                    o._touch.start = !1,
                    o._clearTouchTimer()
                },
                ondragstart: function() {
                    return !(o.config.dragMode && !o._edited) && null
                },
                oncontextmenu: function(t) {
                    var e = !!p.locate(t) && o.data.getItem(p.locate(t)).id;
                    e && (o.events.fire(v.ListEvents.itemRightClick, [e, t]),
                    o.events.fire(v.ListEvents.contextmenu, [e, t]))
                },
                onclick: function(t) {
                    var e = !!p.locate(t) && o.data.getItem(p.locate(t)).id;
                    e && (o.setFocus(e),
                    o.selection.add(e, t.ctrlKey || t.metaKey, t.shiftKey),
                    o.events.fire(v.ListEvents.click, [e, t]))
                },
                ondblclick: function(t) {
                    o._dblClick(t)
                },
                onscroll: function(t) {
                    o.config.virtual && (o._lazyLoad(t),
                    o._updateVirtual(t.target.scrollTop))
                },
                onmouseover: function(t) {
                    var e = !!p.locate(t) && o.data.getItem(p.locate(t)).id
                      , i = p.locateNode(t, "dhx_id", "relatedTarget");
                    i || !e ? i && (i = i.getAttribute("dhx_id") ? i.getAttribute("dhx_id") : null,
                    e && e !== (i || "") && o.events.fire(v.ListEvents.itemMouseOver, [e, t])) : o.events.fire(v.ListEvents.itemMouseOver, [e, t])
                }
            },
            o.config.dragMode && l.dragManager.setItem(o._uid, o),
            o.config.virtual && (o._range = [0, 0],
            o._topOffset = 0),
            o.config.eventHandlers)
                for (var n in o.config.eventHandlers) {
                    o.config.eventHandlers.hasOwnProperty(n) && (i = o.config.eventHandlers[n],
                    o._events[n] = p.eventHandler(function(t) {
                        return p.locate(t, "dhx_id")
                    }, r({}, i)))
                }
            e = c.create({
                render: function() {
                    return o.config.virtual ? o._renderVirtualList() : o._renderList()
                },
                hooks: {
                    didMount: function(t) {
                        o.config.height || (t = t.node.el,
                        o.config.height = t && t.parentNode && t.parentNode.offsetHeight || "100%"),
                        o.config.virtual && (o._visibleHeight = o.config.height,
                        o._updateVirtual(0)),
                        o.paint()
                    }
                }
            });
            return o.mount(t, e),
            o
        }
        e.List = o
    }
    , function(t, e, i) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var n = i(87);
        e.getEditor = function(t, e) {
            return new n.InputEditor(t,e)
        }
    }
    , function(t, e, i) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var n = i(0)
          , o = i(20)
          , i = (r.prototype.endEdit = function() {
            var t;
            this._input && (t = this._input.value,
            this._list.events.fire(o.ListEvents.beforeEditEnd, [t, this._item.id]) ? (this._input.removeEventListener("blur", this._handlers.onBlur),
            this._input.removeEventListener("change", this._handlers.onChange),
            this._handlers = {},
            this._mode = !1,
            this._list.events.fire(o.ListEvents.afterEditEnd, [t, this._item.id])) : this._input.focus())
        }
        ,
        r.prototype.toHTML = function() {
            this._mode = !0;
            var t = this._config.itemHeight;
            return n.el(".dhx_input__wrapper", {}, [n.el("div.dhx_input__container", {}, [n.el("input.dhx_input", {
                class: this._item.css ? " " + this._item.css : "",
                style: {
                    height: t,
                    width: "100%",
                    padding: "8px, 12px"
                },
                _hooks: {
                    didInsert: this._handlers.didInsert
                },
                _key: this._item.id,
                dhx_id: this._item.id
            })])])
        }
        ,
        r.prototype._initHandlers = function() {
            var e = this;
            this._handlers = {
                onBlur: function() {
                    e.endEdit()
                },
                onChange: function() {
                    e.endEdit()
                },
                didInsert: function(t) {
                    t = t.el;
                    (e._input = t).focus(),
                    t.value = e._item.value,
                    t.setSelectionRange(0, t.value.length),
                    t.addEventListener("change", e._handlers.onChange),
                    t.addEventListener("blur", e._handlers.onBlur)
                }
            }
        }
        ,
        r);
        function r(t, e) {
            var i = this;
            this._list = e,
            this._config = e.config,
            this._item = t,
            this._list.events.on(o.ListEvents.focusChange, function(t, e) {
                i._mode && e !== i._item.id && i.endEdit()
            }),
            this._initHandlers()
        }
        e.InputEditor = i
    }
    , function(t, e, i) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        }),
        e.defineValue = function(t) {
            if (t) {
                t = t.toString().trim();
                if (!t.includes("calc"))
                    return parseInt(t.split(/\D+/g)[0], null)
            }
        }
        ,
        e.defineUnit = function(t) {
            if (t) {
                t = t.toString().trim();
                if (!t.includes("calc"))
                    return t.slice(t.split(/\D+/g)[0].length)
            }
        }
    }
    , function(t, e, i) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var n = i(90);
        e.getEditor = function(t, e) {
            return new n.InputEditor(t,e)
        }
    }
    , function(t, e, i) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var o = i(0)
          , n = i(21)
          , i = (r.prototype.endEdit = function() {
            var t;
            this._input && (t = this._input.value,
            this._dataView.events.fire(n.DataViewEvents.beforeEditEnd, [t, this._item.id]) ? (this._input.removeEventListener("blur", this._handlers.onBlur),
            this._input.removeEventListener("change", this._handlers.onChange),
            this._handlers = {},
            this._mode = !1,
            this._dataView.events.fire(n.DataViewEvents.afterEditEnd, [t, this._item.id])) : this._input.focus())
        }
        ,
        r.prototype.toHTML = function(t) {
            this._mode = !0;
            var e = this._config
              , i = e.itemsInRow
              , n = e.gap
              , e = function(t) {
                return parseFloat(t)
            };
            return o.el(".dhx_input__wrapper", {
                style: {
                    width: "calc(" + 100 / i + "% - " + e(n) + " * " + (i - 1) / i + "px)",
                    maxWidth: "calc(" + 100 / i + "% - " + e(n) + " * " + (i - 1) / i + "px)",
                    marginRight: t ? "" : n
                }
            }, [o.el("div.dhx_input__container", {
                style: {
                    height: "100%"
                }
            }, [o.el("input.dhx_input", {
                class: (this._item.css ? " " + this._item.css : "") + (t ? " dhx_dataview-item--last-item-in-row" : ""),
                style: {
                    padding: "8px, 12px",
                    width: "100%",
                    height: "100%"
                },
                _hooks: {
                    didInsert: this._handlers.didInsert
                },
                _key: this._item.id,
                dhx_id: this._item.id
            })])])
        }
        ,
        r.prototype._initHandlers = function() {
            var e = this;
            this._handlers = {
                onBlur: function() {
                    e.endEdit()
                },
                onChange: function() {
                    e.endEdit()
                },
                didInsert: function(t) {
                    t = t.el;
                    (e._input = t).focus(),
                    t.value = e._item.value,
                    t.setSelectionRange(0, t.value.length),
                    t.addEventListener("change", e._handlers.onChange),
                    t.addEventListener("blur", e._handlers.onBlur)
                }
            }
        }
        ,
        r);
        function r(t, e) {
            var i = this;
            this._dataView = e,
            this._config = e.config,
            this._item = t,
            this._dataView.events.on(n.DataViewEvents.focusChange, function(t, e) {
                i._mode && e !== i._item.id && i.endEdit()
            }),
            this._initHandlers()
        }
        e.InputEditor = i
    }
    ],
    o.c = n,
    o.d = function(t, e, i) {
        o.o(t, e) || Object.defineProperty(t, e, {
            enumerable: !0,
            get: i
        })
    }
    ,
    o.r = function(t) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
            value: "Module"
        }),
        Object.defineProperty(t, "__esModule", {
            value: !0
        })
    }
    ,
    o.t = function(e, t) {
        if (1 & t && (e = o(e)),
        8 & t)
            return e;
        if (4 & t && "object" == typeof e && e && e.__esModule)
            return e;
        var i = Object.create(null);
        if (o.r(i),
        Object.defineProperty(i, "default", {
            enumerable: !0,
            value: e
        }),
        2 & t && "string" != typeof e)
            for (var n in e)
                o.d(i, n, function(t) {
                    return e[t]
                }
                .bind(null, n));
        return i
    }
    ,
    o.n = function(t) {
        var e = t && t.__esModule ? function() {
            return t.default
        }
        : function() {
            return t
        }
        ;
        return o.d(e, "a", e),
        e
    }
    ,
    o.o = function(t, e) {
        return Object.prototype.hasOwnProperty.call(t, e)
    }
    ,
    o.p = "/codebase/",
    o(o.s = 34);
    function o(t) {
        if (n[t])
            return n[t].exports;
        var e = n[t] = {
            i: t,
            l: !1,
            exports: {}
        };
        return i[t].call(e.exports, e, e.exports, o),
        e.l = !0,
        e.exports
    }
    var i, n
}),
window.dhx_legacy) {
    if (window.dhx)
        for (var key in dhx)
            dhx_legacy[key] = dhx[key];
    window.dhx = dhx_legacy,
    delete window.dhx_legacy
}
//# sourceMappingURL=vault.js.map
