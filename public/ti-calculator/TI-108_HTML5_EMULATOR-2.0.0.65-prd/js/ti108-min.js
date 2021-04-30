/*Copyright (C) 2013-2016, Texas Instruments.  All rights reserved.*/
(function () {
  function n() {
    this.T()
  }
  function F() {
    this.ca = this.ra = !1;
    this.O = this.S = 0;
    this.Ob = function (a) {
      this.ca && (this.O = this.O - a, 0 >= this.O && (this.ra = !0, this.O = this.S))
    };
    this.reset = function () {
      this.O = this.S
    };
    this.Lb = function () {
      this.ca = !0;
      this.O = this.S
    };
    this.Nb = function () {
      this.ca = !1
    };
    this.Kb = function (a) {
      this.S = a
    }
  }

  function x(a, b) {
    this.ea = a;
    this.Ua = b
  }

  function G(a, b) {
    var d, e, f;
    switch (a.nodeType) {
      case document.ELEMENT_NODE:
        d = document.createElementNS(a.namespaceURI, a.nodeName);
        if (a.attributes && 0 < a.attributes.length)
          for (e =
            0, f = a.attributes.length; e < f; e += 1) d.setAttribute(a.attributes[e].nodeName, a.getAttribute(a.attributes[e].nodeName));
        if (b && a.childNodes && 0 < a.childNodes.length)
          for (e = 0, f = a.childNodes.length; e < f; e += 1) d.appendChild(G(a.childNodes[e], b));
        return d;
      case document.TEXT_NODE:
      case document.CDATA_SECTION_NODE:
      case document.COMMENT_NODE:
        return document.createTextNode(a.nodeValue)
    }
  }

  function I(a) {
    var b = typeof a,
      d = !1;
    "undefined" === b || "string" !== b || 0 !== a.search("http://") && 0 !== a.search("https://") || (d = !0);
    return d
  }

  function J(a) {
    var b = !1;
    "undefined" !== typeof a && (a = a.split(".").pop(), "svg" === a && (b = !0));
    return b
  }

  function y(a) {
    this.O = a;
    this.Da();
    this.S()
  }

  function K(a) {
    var b = !1,
      d = ["TI84SE", "TI83PCE", "TI84CE"];
    this.O = this.S = "";
    this.sa = 6E4;
    this.xhr = new XMLHttpRequest;
    this.dc = function (b, d) {
      var g = typeof b;
      "undefined" !== typeof d && (this.sa = d);
      "object" === g ? this.Da(b) : "string" === g ? this.$a(b) : a.s(0, "You must provide a valid JSON object or a path to a configuration file.")
    };
    this.$a = function (b) {
      var d, g = this;
      "json" !== b.split(".").pop() ?
        a.s(0, "The configuration file extension must be json.") : (this.xhr.open("GET", b, !0), this.xhr.responseType = "", this.xhr.timeout = this.sa, this.xhr.ontimeout = function () {
          a.s(0, "Unable to connect with the server.")
        }, this.xhr.onload = function () {
          if (200 === this.status) {
            try {
              d = JSON.parse(this.responseText)
            } catch (b) {
              a.s(0, "The configuration file is damaged, or is not a JSON file.");
              return
            }
            g.Da(d)
          } else a.s(0, "The configuration file cannot be found.")
        }, this.xhr.send())
    };
    this.Da = function (b) {
      b ? (a.Dc = b.DisplayMode, a.Bc =
        b.AngleMode, a.da = b.KeyHistBufferLength, this.S = b.FaceplateLocation, w = b.KeyMappingFile, this.O = b.ROMLocation, b = b.elementId, void 0 !== b && (u = b), null !== document.getElementById(u) ? this.ab() : (b = "The div with ID XXX does not exist in the DOM.".replace("XXX", u), a.s(0, b))) : a.s(0, "You must specify initial configuration settings.")
    };
    this.Ya = function (a) {
      var b;
      switch (a) {
        case "TI84":
        case "TI83PCE":
          b = "h84keymap";
          break;
        case "TI30":
          b = "h30keymap";
          break;
        case "TI108":
          b = "h108keymap"
      }
      return b
    };
    this.ab = function () {
      var b, d;
      if (this.O)
        if (this.S)
          if (b = this.O.split(".").pop(), "h84state" !== b && "h84statej" !== b) a.s(0, "The ROM extension must be h84state or h84statej.");
          else if (b = this.S.split(".").pop(), "svg" !== b) a.s(0, "The faceplate extension must be svg.");
      else {
        if (w && (b = w.split(".").pop(), d = this.Ya(this.Ec), b !== d)) {
          a.s(0, "The key mapping file extension must be " + d + ".");
          return
        }
        this.Ia(this.S, !1, 0)
      } else a.s(0, "You must specify a URL for the faceplates.");
      else a.s(0, "You must specify a URL for the ROM file.")
    };
    this.Ia = function (b,
      d, g) {
      var k, h, l, m = !1,
        t, q, r, A, c = 1,
        B, p = this,
        n;
      3 <= g ? a.s(0, "Unable to download the SVG. The SVG may be damaged or has a wrong format.") : (this.xhr.open("GET", b, !0), this.xhr.responseType = "document", this.xhr.timeout = this.sa, this.xhr.ontimeout = function () {
        a.s(0, "Unable to connect with the server, or the requested faceplate is not available.")
      }, this.xhr.onload = function () {
        if (200 === this.status) {
          h = p.xhr.responseXML;
          q = typeof h;
          if ("undefined" === q || null === h) {
            p.Ia(b, d, ++g);
            return
          }
          h = h.documentElement;
          try {
            h = document.importNode(h,
              !0)
          } catch (w) {
            h = G(h, !0)
          }
          q = typeof h;
          if ("undefined" === q || null === h) {
            p.Ia(b, d, ++g);
            return
          }
          t = h.getAttribute("viewBox");
          if (null !== t) {
            k = document.getElementById(u);
            l = document.getElementById(v);
            null !== l && k.removeChild(l);
            n = t.split(/\s*,\s*|\s+/);
            r = parseFloat(n[2]);
            A = parseFloat(n[3]);
            if (d) {
              if (void 0 !== window.orientation) switch (window.orientation) {
                case 90:
                case -90:
                  B = window.innerHeight;
                  break;
                default:
                  B = 672
              }
              c = B <= A ? A / B : B / A;
              k.style.width = r * c + "px";
              k.style.height = A * c + "px"
            } else k.style.width = r + "px", k.style.height = A +
              "px";
            k.insertBefore(h, k.firstChild);
            m = !0;
            p.Ca(0)
          }
        }
        m || a.s(0, "The requested faceplate is not available.")
      }, this.xhr.send())
    };
    this.Ca = function (d) {
      var f = this;
      null !== document.getElementById(v) ? !1 === b && f.Za() : 4 >= d ? setTimeout(function () {
        f.Ca(++d)
      }, 2E3) : a.s(0, "Unable to insert the SVG into the DOM.")
    };
    this.Za = function () {
      var e, f, g, k, h, l, m, t, q, r;
      t = this.O.substring(0, this.O.lastIndexOf("."));
      r = d.indexOf(v);
      t = 0 <= r || !a.Ta.wb ? t + ".h84statej" : t + ".h84state";
      this.xhr.open("GET", t, !0);
      this.xhr.timeout = this.sa;
      this.xhr.ontimeout =
        function () {
          a.s(0, "Unable to connect with the server, or the requested ROM file is not available.")
        };
      0 <= r || !a.Ta.wb ? (this.xhr.responseType = "", this.xhr.onload = function () {
        200 === this.status ? (C = this.responseText, q = typeof a.Va, "undefined" !== q && a.T(), b = !0) : a.s(0, "The requested state file is not available.")
      }) : (this.xhr.responseType = "arraybuffer", this.xhr.onload = function () {
        200 === this.status ? (e = this.response, f = 1E3, g = setInterval(function () {
          f -= 100;
          if (0 >= f) {
            clearInterval(g);
            k = new Uint8Array(e);
            l = new ArrayBuffer(e.byteLength);
            C = new Uint8Array(l);
            h = k.length;
            for (m = 0; m < h; m += 1) C[m] = k[m];
            q = typeof a.Va;
            "undefined" !== q && a.T();
            b = !0
          }
        }, 100)) : a.s(0, "The requested state file is not available.")
      });
      this.xhr.send()
    }
  }

  function p() {
    this.T()
  }

  function D() {
    this.Sa = "h108keymap";
    this.u = {};
    this.r = [];
    this.ib = function (a) {
      this.u = a
    };
    this.Ja = function (a) {
      return this.u.qc(a)
    };
    this.gc = function () {
      this.r[0] = {
        t: "TI108_KEY_PERCENT",
        code: 56,
        keyCode: [53],
        shiftKey: [!0],
        C: 3
      };
      this.r[1] = {
        t: "TI108_KEY_ONCLEAR",
        code: 87,
        keyCode: [8],
        shiftKey: [!1],
        C: 5
      };
      this.r[2] = {
        t: "TI108_KEY_DIVIDE",
        code: 86,
        keyCode: [111, 191],
        shiftKey: [!1, !1],
        C: 3
      };
      this.r[3] = {
        t: "TI108_KEY_SQRT",
        code: 37,
        keyCode: [88],
        shiftKey: [!1],
        C: 3
      };
      this.r[4] = {
        t: "TI108_KEY_MULTIPLY",
        code: 85,
        keyCode: [106, 56],
        shiftKey: [!1, !0],
        C: 3
      };
      this.r[5] = {
        t: "TI108_KEY_7",
        code: 36,
        keyCode: [103, 55],
        shiftKey: [!1, !1],
        C: 4
      };
      this.r[6] = {
        t: "TI108_KEY_8",
        code: 52,
        keyCode: [104, 56],
        shiftKey: [!1, !1],
        C: 4
      };
      this.r[7] = {
        t: "TI108_KEY_9",
        code: 68,
        keyCode: [105, 57],
        shiftKey: [!1, !1],
        C: 4
      };
      this.r[8] = {
        t: "TI108_KEY_SUBTRACT",
        code: 84,
        keyCode: [109, 189],
        shiftKey: [!1, !1],
        C: 3
      };
      this.r[9] = {
        t: "TI108_KEY_MMINUS",
        code: 19,
        keyCode: [77],
        shiftKey: [!1],
        C: 5
      };
      this.r[10] = {
        t: "TI108_KEY_4",
        code: 35,
        keyCode: [100, 52],
        shiftKey: [!1, !1],
        C: 4
      };
      this.r[11] = {
        t: "TI108_KEY_5",
        code: 51,
        keyCode: [101, 53],
        shiftKey: [!1, !1],
        C: 4
      };
      this.r[12] = {
        t: "TI108_KEY_6",
        code: 67,
        keyCode: [102, 54],
        shiftKey: [!1, !1],
        C: 4
      };
      this.r[13] = {
        t: "TI108_KEY_ADD",
        code: 83,
        keyCode: [107, 187],
        shiftKey: [!1, !0],
        C: 3
      };
      this.r[14] = {
        t: "TI108_KEY_MRC",
        code: 18,
        keyCode: [67],
        shiftKey: [!1],
        C: 5
      };
      this.r[15] = {
        t: "TI108_KEY_1",
        code: 34,
        keyCode: [97, 49],
        shiftKey: [!1,
          !1
        ],
        C: 4
      };
      this.r[16] = {
        t: "TI108_KEY_2",
        code: 50,
        keyCode: [98, 50],
        shiftKey: [!1, !1],
        C: 4
      };
      this.r[17] = {
        t: "TI108_KEY_3",
        code: 66,
        keyCode: [99, 51],
        shiftKey: [!1, !1],
        C: 4
      };
      this.r[18] = {
        t: "TI108_KEY_MPLUS",
        code: 17,
        keyCode: [80],
        shiftKey: [!1],
        C: 5
      };
      this.r[19] = {
        t: "TI108_KEY_0",
        code: 33,
        keyCode: [96, 48],
        shiftKey: [!1, !1],
        C: 4
      };
      this.r[20] = {
        t: "TI108_KEY_DECIMAL",
        code: 49,
        keyCode: [110, 190],
        shiftKey: [!1, !1],
        C: 4
      };
      this.r[21] = {
        t: "TI108_KEY_NEGATIVE",
        code: 65,
        keyCode: [189],
        shiftKey: [!0],
        C: 3
      };
      this.r[22] = {
        t: "TI108_KEY_EQUALS",
        code: 81,
        keyCode: [13],
        shiftKey: [!1],
        C: 3
      }
    };
    this.gc()
  }
  x.prototype.Tb = {
    TI84SE: !0,
    TI83: !0,
    TI30XS: !0,
    TI108: !0,
    TI83PCE: !0,
    TI84CE: !0
  };
  x.prototype.killInstance = function () {
    var a = typeof this.ea;
    this.Qb(this.ea);
    return "undefined" !== a && this.Tb[this.Ua] ? (this.yc(this.ea, this.Ua), this.sc(this.Ua), this.Fb(this.ea, this.ea), this.ea = void 0, delete this.ea, !0) : !1
  };
  x.prototype.Qb = function (a) {
    clearTimeout(a.va.Gc);
    a.va.xhr.abort()
  };
  x.prototype.yc = function (a, b) {
    var d, e;
    switch (b) {
      case "TI83PCE":
      case "TI84CE":
        this.Mb(a);
        d = typeof global_inputPollingTimer;
        "undefined" !== d && clearTimeout(global_inputPollingTimer);
        break;
      case "TI84SE":
      case "TI83":
        this.Mb(a);
        break;
      case "TI30XS":
      case "TI108":
        d = typeof a.ua, "undefined" !== d && clearTimeout(a.ua), d = typeof a.u, e = typeof a.u.Ga, "undefined" !== d && "undefined" !== e && clearTimeout(a.u.Ga)
    }
  };
  x.prototype.Mb = function (a) {
    var b = typeof a.u,
      d = typeof a.fc,
      e = typeof displayTimer;
    "undefined" !== typeof repeaterTimer && clearInterval(repeaterTimer);
    "undefined" !== e && clearInterval(displayTimer);
    "undefined" !== d && clearInterval(a.fc);
    "undefined" !==
    b && (a.u.Cc(), clearTimeout(a.u.w.Hc), clearTimeout(a.u.la.Fc))
  };
  x.prototype.Fb = function (a, b) {
    if (null !== a) {
      var d, e, f = Object.keys(a);
      for (d = 0; d < f.length; d++) {
        e = a[f[d]];
        switch (Object.prototype.toString.call(e)) {
          case "[object Object]":
            e !== b && this.Fb(e, a);
            break;
          case "[object Array]":
            e.length = 0
        }
        a[f[d]] = void 0;
        delete a[f[d]]
      }
    }
  };
  x.prototype.sc = function (a) {
    var b = document.getElementById(u);
    if ("TI84SE" === a || "TI83" === a || "TI83PCE" === a || "TI84CE" === a) actualConfigurationFile = faceplate = w = actualStateFile = void 0;
    for (w =
      C = void 0; b.firstChild;) b.removeChild(b.firstChild);
    a = b.cloneNode(!0);
    b.parentNode.replaceChild(a, b)
  };
  var z = {
    0: "MSIE",
    1: "Chrome",
    2: "Safari",
    3: "Firefox",
    4: "Trident"
  };
  y.prototype.Da = function () {
    var a = typeof this.O.s;
    this.ab() || "undefined" === a || this.O.s(0, "This browser version may not support all TI ExamCalc functionality. It is recommended that you use a fully supported browser version. For more information visit education.ti.com")
  };
  y.prototype.ab = function () {
    var a = this.$a(),
      b = a[1].split(".");
    return !1 ===
      this.Ya ? this.Ca(a[0], b[0]) : this.Za(a[0], b[0])
  };
  y.prototype.Za = function (a, b) {
    b = parseInt(b, 10);
    switch (a) {
      case z[1]:
        break;
      case z[2]:
        if (8 !== b) return !1;
        break;
      default:
        return !1
    }
    return !0
  };
  y.prototype.Ca = function (a, b) {
    var d = !1;
    b = parseInt(b, 10);
    switch (a) {
      case z[0]:
        10 <= b && (d = !0);
        break;
      case z[1]:
        22 <= b && (d = !0);
        break;
      case z[2]:
        7 <= b && 10 >= b && (d = !0);
        break;
      case z[3]:
        10 <= b && (d = !0);
        break;
      case z[4]:
        d = !0
    }
    return d
  };
  y.prototype.$a = function () {
    var a = window.navigator.appName,
      b = window.navigator.userAgent,
      d = b.match(/(opera|chrome|safari|firefox|msie|trident)\/?\s*(\.?\d+(\.\d+)*)/i),
      e = b.match(/version\/([\.\d]+)/i),
      b = b.search("Mobile");
    null !== (d && e) && (d[2] = e[1]);
    d = d ? [d[1], d[2]] : [a, window.navigator.appVersion, "-?"];
    this.Ya = -1 === b ? !1 : !0;
    return d
  };
  y.prototype.$b = function () {
    var a = window.navigator.userAgent,
      b = a.match(/(opera|chrome|safari|firefox|msie|trident)\/?\s*(\.?\d+(\.\d+)*)/i),
      a = a.match(/version\/([\.\d]+)/i);
    null !== a && (b = [b[1], a[1]]);
    return b
  };
  y.prototype.S = function () {
    this.wb = "undefined" === typeof (new XMLHttpRequest).responseType ? !1 : !0
  };
  var w, C;
  p.prototype.T = function () {
    var a,
      b, d;
    this.Ba = this.Qa = this.Ra = this.c = this.G = this.F = this.v = this.B = this.A = this.f = this.e = this.d = this.p = this.g = 0;
    this.Q = [];
    this.Aa = [];
    this.k = [];
    this.n = [];
    this.q = [];
    for (b = 0; 65536 > b; b++) this.Q[b] = 0, this.Aa[b] = 0, this.k[b] = 0, this.n[b] = 0, this.q[b] = 0;
    this.b = this.l = this.i = 0;
    this.a = Array(64);
    this.o = !1;
    this.J = Array(16);
    for (a = 0; 16 > a; a++)
      for (this.J[a] = Array(16), b = 0; 16 > b; b++)
        for (this.J[a][b] = Array(16), d = 0; 16 > d; d++) this.J[a][b][d] = 0;
    this.h = Array(16);
    for (a = 0; 4 > a; a++)
      for (this.h[a] = Array(16), b = 0; 16 > b; b++)
        for (this.h[a][b] =
          Array(16), d = 0; 16 > d; d++) this.h[a][b][d] = 0;
    this.R = 255;
    this.rb = this.pb = this.ub = this.tb = this.qb = this.sb = 0;
    this.Ha = this.W = this.ob = this.La = this.Pa = this.Oa = this.za = this.ya = this.Na = this.Ma = !1;
    this.I = Array(2);
    this.yb = new Date;
    this.I[0] = new F;
    this.I[1] = new F;
    for (b = 0; 64 > b; b++) this.a[b] = 0
  };
  p.prototype.vb = function (a, b) {
    this.Aa[b] = (a & 65024) >>> 10;
    switch (this.Aa[b]) {
      case 0:
        this.k[b] = (a & 7) >>> 0;
        this.n[b] = (a & 192) >>> 6;
        this.q[b] = (a & 768) >>> 8;
        break;
      case 22:
        this.k[b] = (a & 15) >>> 0;
        this.n[b] = (a & 240) >>> 4;
        this.q[b] = (a & 768) >>>
          8;
        break;
      case 20:
        this.k[b] = (a & 15) >>> 0;
        this.n[b] = (a & 1008) >>> 4;
        break;
      case 60:
      case 61:
      case 62:
      case 63:
        this.k[b] = (a & 4095) >>> 0;
        break;
      case 3:
        this.k[b] = (a & 15) >>> 0;
        this.q[b] = (a & 768) >>> 8;
        break;
      case 40:
      case 41:
      case 42:
      case 43:
        this.k[b] = (a & 4095) >>> 0;
        break;
      case 16:
        this.k[b] = (a & 15) >>> 0;
        this.n[b] = (a & 112) >>> 4;
        this.q[b] = (a & 896) >>> 7;
        break;
      case 14:
        this.n[b] = (a & 1008) >>> 4;
        break;
      case 1:
        this.q[b] = (a & 768) >>> 8;
        this.k[b] = (a & 15) >>> 0;
        this.n[b] = (a & 240) >>> 4;
        break;
      case 32:
      case 33:
      case 34:
      case 35:
        this.k[b] = (a & 15) >>> 0;
        this.n[b] =
          (a & 240) >>> 4;
        this.q[b] = (a & 3840) >>> 8;
        break;
      case 15:
        this.n[b] = (a & 1008) >>> 4;
        break;
      case 5:
        this.q[b] = (a & 768) >>> 8;
        this.k[b] = (a & 15) >>> 0;
        this.n[b] = (a & 240) >>> 4;
        break;
      case 30:
        this.n[b] = (a & 1008) >>> 4;
        break;
      case 31:
        this.n[b] = (a & 1008) >>> 4;
        break;
      case 10:
        this.n[b] = (a & 1008) >>> 4;
        break;
      case 11:
        this.n[b] = (a & 1008) >>> 4;
        break;
      case 7:
        this.q[b] = (a & 768) >>> 8;
        this.n[b] = (a & 240) >>> 4;
        this.k[b] = (a & 15) >>> 0;
        break;
      case 17:
        this.k[b] = (a & 7) >>> 0;
        this.n[b] = (a & 112) >>> 4;
        this.q[b] = (a & 896) >>> 7;
        break;
      case 21:
        this.k[b] = (a & 7) >>> 0;
        this.n[b] = (a &
          112) >>> 4;
        this.q[b] = (a & 896) >>> 7;
        break;
      case 2:
        this.k[b] = (a & 15) >>> 0;
        this.q[b] = (a & 768) >>> 8;
        break;
      case 6:
        this.n[b] = (a & 240) >>> 4;
        this.q[b] = (a & 768) >>> 8;
        break;
      case 18:
        this.k[b] = (a & 15) >>> 0;
        this.n[b] = (a & 112) >>> 4;
        this.q[b] = (a & 896) >>> 7;
        break;
      case 19:
        this.k[b] = (a & 7) >>> 0;
        this.n[b] = (a & 112) >>> 4;
        this.q[b] = (a & 896) >>> 7;
        break;
      case 23:
        this.k[b] = (a & 7) >>> 0;
        this.n[b] = (a & 112) >>> 4;
        this.q[b] = (a & 896) >>> 7;
        break;
      case 24:
        this.k[b] = (a & 15) >>> 0;
        this.n[b] = (a & 112) >>> 4;
        this.q[b] = (a & 896) >>> 7;
        break;
      case 25:
        this.k[b] = (a & 7) >>> 0;
        this.n[b] =
          (a & 112) >>> 4;
        this.q[b] = (a & 896) >>> 7;
        break;
      case 26:
        this.k[b] = (a & 15) >>> 0;
        this.n[b] = (a & 112) >>> 4;
        this.q[b] = (a & 896) >>> 7;
        break;
      case 27:
        this.k[b] = (a & 7) >>> 0;
        this.n[b] = (a & 112) >>> 4;
        this.q[b] = (a & 896) >>> 7;
        break;
      case 28:
        this.k[b] = (a & 15) >>> 0;
        this.n[b] = (a & 112) >>> 4;
        this.q[b] = (a & 896) >>> 7;
        break;
      case 29:
        this.k[b] = (a & 7) >>> 0;
        this.n[b] = (a & 112) >>> 4;
        this.q[b] = (a & 896) >>> 7;
        break;
      case 12:
        this.k[b] = (a & 3) >>> 0;
        this.n[b] = (a & 112) >>> 4;
        this.q[b] = (a & 896) >>> 7;
        break;
      case 8:
        this.k[b] = (a & 3) >>> 0;
        this.q[b] = (a & 896) >>> 7;
        break;
      case 13:
        this.k[b] =
          (a & 3) >>> 0;
        this.n[b] = (a & 112) >>> 4;
        this.q[b] = (a & 896) >>> 7;
        break;
      case 9:
        this.k[b] = (a & 3) >>> 0;
        this.q[b] = (a & 896) >>> 7;
        break;
      case 44:
      case 45:
      case 46:
      case 47:
        this.k[b] = (a & 4095) >>> 0;
        break;
      case 48:
      case 49:
      case 50:
      case 51:
        this.k[b] = (a & 4095) >>> 0;
        break;
      case 52:
      case 53:
      case 54:
      case 55:
        this.k[b] = (a & 4095) >>> 0;
        break;
      case 56:
      case 57:
      case 58:
      case 59:
        this.k[b] = (a & 4095) >>> 0;
        break;
      case 36:
      case 37:
      case 38:
      case 39:
        this.k[b] = (a & 4095) >>> 0
    }
  };
  p.prototype.ic = function () {
    var a, b, d;
    switch (this.Aa[this.b]) {
      case 0:
        this.o = !1;
        a = this.q[this.b];
        switch (a) {
          case 2:
            this.i += 2;
            this.g = this.k[this.b];
            this.b = 0 !== this.g ? this.b + this.a[this.g] + 1 : this.b + 1;
            break;
          case 3:
            this.i += 3;
            this.l = 16 * (this.a[9] & 7) + (this.a[8] & 14) >>> 1;
            this.d = 0;
            this.f = 8 + (this.l >>> 3);
            this.e = this.l % 8 * 2;
            this.b = 4096 * this.h[this.d][this.f][this.e + 1] + 256 * this.h[this.d][this.f][this.e];
            this.l += 1;
            this.d = 0;
            this.f = 8 + (this.l >>> 3);
            this.e = this.l % 8 << 1;
            this.b = 16 * this.h[this.d][this.f][this.e + 1] + this.h[this.d][this.f][this.e] + this.b;
            this.l += 1;
            63 < this.l ? (this.a[9] = 0, this.a[8] = 0) : 15 < this.l << 1 ? (this.a[9] =
              this.l >>> 3, this.a[8] = (this.l << 1) % 16) : (this.a[9] = 0, this.a[8] = this.l << 1);
            break;
          case 0:
            this.i += 1, a = this.n[this.b], 0 === a ? this.b += 1 : 2 === a && (this.Ma = !0)
        }
        break;
      case 1:
        this.o = !1;
        a = this.q[this.b];
        switch (a) {
          case 0:
            this.i += 2;
            this.Ba = (this.a[7] << 12) + (this.a[6] << 8) + (this.a[5] << 4) + this.a[4];
            this.Ra = this.Q[this.Ba];
            b = (this.Ra & 240) >> 4;
            this.e = this.a[2] | 1;
            this.f = this.a[3];
            this.d = this.a[0] >>> 2;
            this.h[this.d][this.f][this.e] = b;
            b = this.Ra & 15;
            this.h[this.d][this.f][this.e - 1] = b;
            break;
          case 1:
            this.i += 2;
            this.Ba = (this.a[7] <<
              12) + (this.a[6] << 8) + (this.a[5] << 4) + this.a[4];
            this.Qa = this.Q[this.Ba];
            b = (this.Qa & 61440) >> 12;
            this.e = this.a[2] | 1;
            this.f = this.a[3];
            this.d = this.a[0] >>> 2;
            this.h[this.d][this.f][this.e] = b;
            b = (this.Qa & 3840) >> 8;
            this.h[this.d][this.f][this.e - 1] = b;
            break;
          case 2:
            this.i += 1;
            this.e = this.a[2];
            this.f = this.a[3];
            this.d = this.a[0] >>> 2;
            this.h[this.d][this.f][this.e] = this.k[this.b];
            this.a[2] = (this.a[2] + this.n[this.b]) % 16;
            break;
          case 3:
            this.i += 1, this.e = this.a[2] & 14, this.f = this.a[3], this.d = this.a[0] >>> 2, this.h[this.d][this.f][this.e] =
              this.k[this.b], this.h[this.d][this.f][this.e + 1] = this.n[this.b]
        }
        this.b += 1;
        break;
      case 2:
        this.i += 2;
        this.o = !1;
        switch (this.q[this.b]) {
          case 0:
            this.d = this.a[0] >>> 2;
            this.f = this.a[3];
            this.e = this.a[2];
            a = this.a[0];
            this.c = this.h[this.d][this.f][this.e] + this.k[this.b];
            16 > this.c ? (this.h[this.d][this.f][this.e] = this.c, a = 0 !== this.c ? a & 12 : (a | 2) & 14) : (this.c = this.c % 16, this.h[this.d][this.f][this.e] = this.c, a = 0 !== this.c ? a & 13 | 1 : a | 3);
            this.a[0] = a;
            break;
          case 2:
            this.d = this.a[0] >>> 2, this.f = this.a[3], this.e = this.a[2], a = this.a[0],
              this.c = this.h[this.d][this.f][this.e] - this.k[this.b], 0 <= this.c ? (this.h[this.d][this.f][this.e] = this.c, a = 0 !== this.c ? a & 12 : (a | 2) & 14) : (this.c = 16 + this.c, this.h[this.d][this.f][this.e] = this.c, a = 0 !== this.c ? a & 13 | 1 : a | 3), this.a[0] = a
        }
        this.b += 1;
        break;
      case 3:
        this.o = !1;
        a = this.q[this.b];
        switch (a) {
          case 0:
            this.i += 2;
            this.d = this.a[0] >>> 2;
            this.f = this.a[3];
            this.e = this.a[2];
            a = this.a[0];
            this.c = this.h[this.d][this.f][this.e] & this.k[this.b];
            this.h[this.d][this.f][this.e] = this.c;
            a = 0 !== this.c ? a & 13 : a | 2;
            this.a[0] = a;
            break;
          case 1:
            this.i +=
              2;
            this.d = this.a[0] >>> 2;
            this.f = this.a[3];
            this.e = this.a[2];
            a = this.a[0];
            this.c = this.h[this.d][this.f][this.e] | this.k[this.b];
            this.h[this.d][this.f][this.e] = this.c;
            a = 0 !== this.c ? a & 13 : a | 2;
            this.a[0] = a;
            break;
          case 2:
            this.i += 2;
            this.d = this.a[0] >>> 2;
            this.f = this.a[3];
            this.e = this.a[2];
            a = this.a[0];
            this.c = this.h[this.d][this.f][this.e] ^ this.k[this.b];
            this.h[this.d][this.f][this.e] = this.c;
            a = 0 !== this.c ? a & 13 : a | 2;
            this.a[0] = a;
            break;
          case 3:
            this.d = this.a[0] >>> 2, this.f = this.a[3], this.e = this.a[2], a = this.a[0], this.c = this.h[this.d][this.f][this.e] -
              this.k[this.b], a = 0 <= this.c ? 0 !== this.c ? a & 12 : (a | 2) & 14 : a & 13 | 1, this.a[0] = a
        }
        this.b += 1;
        break;
      case 5:
        this.o = !1;
        a = this.q[this.b];
        switch (a) {
          case 0:
            this.i += 2;
            this.d = this.a[0] >>> 2;
            this.f = this.a[3];
            this.e = this.a[2];
            this.B = this.n[this.b];
            this.A = this.k[this.b];
            this.h[this.d][this.f][this.e] = this.h[this.d][this.B][this.A];
            break;
          case 2:
            this.i += 4, this.d = this.a[0] >>> 2, this.f = this.a[3], this.e = this.a[2], this.B = this.n[this.b], this.A = this.k[this.b], b = this.h[this.d][this.f][this.e], this.h[this.d][this.f][this.e] = this.h[this.d][this.B][this.A],
              this.h[this.d][this.B][this.A] = b
        }
        this.b += 1;
        break;
      case 6:
        this.i += 3;
        this.o = !1;
        a = this.q[this.b];
        switch (a) {
          case 0:
            d = 0;
            this.a[0] |= 2;
            do this.d = this.a[0] >>> 2, d += 1, this.f = this.a[3], this.e = this.a[2], this.B = this.n[this.b], this.A = this.a[2], this.c = this.h[this.d][this.f][this.e] + this.h[this.d][this.B][this.A] + (this.a[0] & 1), 16 > this.c ? (this.h[this.d][this.f][this.e] = this.c, this.a[0] = 0 !== this.c ? this.a[0] & 12 : this.a[0] & 14) : (this.c = this.c % 16, this.h[this.d][this.f][this.e] = this.c, this.a[0] = 0 !== this.c ? this.a[0] & 13 | 1 :
              this.a[0] | 1), this.a[2] = (this.a[2] + 1) % 16, this.a[1] = 0 !== this.a[1] ? this.a[1] - 1 : 15; while (0 < this.a[1]);
            break;
          case 1:
            d = 0;
            this.a[0] |= 2;
            do this.d = this.a[0] >>> 2, d += 1, this.f = this.a[3], this.e = this.a[2], this.B = this.n[this.b], this.A = this.a[2], this.c = this.h[this.d][this.f][this.e] + this.h[this.d][this.B][this.A] + (this.a[0] & 1), 10 > this.c ? (this.h[this.d][this.f][this.e] = this.c, this.a[0] = 0 !== this.c ? this.a[0] & 12 : this.a[0] & 14) : (this.c = this.c % 10, this.h[this.d][this.f][this.e] = this.c, this.a[0] = 0 !== this.c ? this.a[0] & 13 | 1 :
              this.a[0] | 1), this.a[2] = (this.a[2] + 1) % 16, this.a[1] = 0 !== this.a[1] ? this.a[1] - 1 : 15; while (0 < this.a[1]);
            break;
          case 2:
            d = 0;
            this.a[0] |= 2;
            do this.d = this.a[0] >>> 2, d += 1, this.f = this.a[3], this.e = this.a[2], this.B = this.n[this.b], this.A = this.a[2], this.c = this.h[this.d][this.f][this.e] - this.h[this.d][this.B][this.A] - (this.a[0] & 1), 0 <= this.c ? (this.h[this.d][this.f][this.e] = this.c, this.a[0] = 0 !== this.c ? this.a[0] & 12 : this.a[0] & 14) : (this.c += 16, this.h[this.d][this.f][this.e] = this.c, this.a[0] = 0 !== this.c ? this.a[0] & 13 | 1 : this.a[0] |
              1), this.a[2] = (this.a[2] + 1) % 16, this.a[1] = 0 !== this.a[1] ? this.a[1] - 1 : 15; while (0 < this.a[1]);
            break;
          case 3:
            d = 0;
            this.a[0] |= 2;
            do this.d = this.a[0] >>> 2, d += 1, this.f = this.a[3], this.e = this.a[2], this.B = this.n[this.b], this.A = this.a[2], this.c = this.h[this.d][this.f][this.e] - this.h[this.d][this.B][this.A] - (this.a[0] & 1), 0 <= this.c ? (this.h[this.d][this.f][this.e] = this.c, this.a[0] = 0 !== this.c ? this.a[0] & 12 : this.a[0] & 14) : (this.c += 10, this.h[this.d][this.f][this.e] = this.c, this.a[0] = 0 !== this.c ? this.a[0] & 13 | 1 : this.a[0] | 1), this.a[2] =
              (this.a[2] + 1) % 16, this.a[1] = 0 < this.a[1] ? this.a[1] - 1 : 15; while (0 < this.a[1])
        }
        this.b += 1;
        break;
      case 7:
        this.o = !1;
        a = this.q[this.b];
        switch (a) {
          case 0:
            this.i += 2;
            this.d = this.a[0] >>> 2;
            d = 0;
            do d += 1, this.f = this.a[3], this.e = (this.a[2] + this.k[this.b]) % 16, this.B = this.n[this.b], this.A = this.a[2], this.h[this.d][this.f][this.e] = this.h[this.d][this.B][this.A], this.a[2] = 15 === this.a[2] ? 0 : this.a[2] + 1, this.a[1] = 0 < this.a[1] ? this.a[1] - 1 : 15; while (0 < this.a[1]);
            break;
          case 1:
            this.i += 2;
            this.d = this.a[0] >>> 2;
            d = 0;
            do d += 1, this.f = this.a[3],
              this.e = (this.a[2] + this.k[this.b]) % 16, this.B = this.n[this.b], this.A = this.a[2], this.h[this.d][this.f][this.e] = this.h[this.d][this.B][this.A], this.a[2] = 0 < this.a[2] ? this.a[2] - 1 : 15, this.a[1] = 0 < this.a[1] ? this.a[1] - 1 : 15; while (0 < this.a[1]);
            break;
          case 2:
            this.i += 4;
            this.d = this.a[0] >>> 2;
            d = 0;
            do d += 1, this.f = this.a[3], this.e = this.a[2], this.B = this.n[this.b], this.A = this.e, b = this.h[this.d][this.f][this.e], this.h[this.d][this.f][this.e] = this.h[this.d][this.B][this.A], this.h[this.d][this.B][this.A] = b, this.a[2] = 15 === this.a[2] ?
              0 : this.a[2] + 1, this.a[1] = 0 < this.a[1] ? this.a[1] - 1 : 15; while (0 < this.a[1]);
            break;
          case 3:
            this.i += 2;
            this.d = this.a[0] >>> 2;
            d = 0;
            this.a[0] |= 2;
            do d += 1, this.f = this.a[3], this.e = this.a[2], this.B = this.n[this.b], this.A = this.a[2], b = this.a[0] & 1, this.c = this.h[this.d][this.f][this.e] - this.h[this.d][this.B][this.A] - b, this.a[0] = 0 <= this.c ? 0 !== this.c ? this.a[0] & 12 : this.a[0] & 14 : 0 !== this.c ? this.a[0] & 13 | 1 : this.a[0] | 1, this.a[2] = 15 === this.a[2] ? 0 : this.a[2] + 1, this.a[1] = 0 < this.a[1] ? this.a[1] - 1 : 15; while (0 < this.a[1])
        }
        this.b += 1;
        break;
      case 8:
        this.i += 1;
        this.o = !1;
        this.d = this.a[0] >>> 2;
        this.f = this.a[3];
        this.e = this.a[2];
        this.p = this.q[this.b];
        b = this.k[this.b];
        a = this.a[0];
        for (d = this.h[this.d][this.f][this.e]; 0 <= b;) a = 0 !== d % 2 ? a | 1 : a & 14, d = d >>> 1, b = b - 1;
        this.a[this.p] = d;
        this.o = 7 !== this.p ? !1 : !0;
        this.a[0] = a;
        this.b += 1;
        break;
      case 9:
        this.i += 1;
        this.o = !1;
        this.d = this.a[0] >>> 2;
        this.f = this.a[3];
        this.e = this.a[2];
        this.p = this.q[this.b];
        b = this.k[this.b];
        a = this.a[0];
        for (this.c = this.h[this.d][this.f][this.e]; 0 <= b;) this.c = this.c << 1, 16 <= this.c ? (this.c %= 16, a =
          a | 1) : a = a & 14, b = b - 1;
        this.a[this.p] = this.c;
        this.o = 7 !== this.p ? !1 : !0;
        this.a[0] = a;
        this.b += 1;
        break;
      case 10:
        this.i += 1;
        this.o = !1;
        this.l = ((this.a[9] & 7) << 4) + (this.a[8] & 14) >>> 1;
        this.l = 0 !== this.l ? this.l - 1 : 63;
        this.d = 0;
        this.f = 8 + (this.l >>> 3);
        this.e = this.l % 8 << 1;
        this.g = this.n[this.b];
        30 !== this.g ? 48 !== this.g && (16 === this.g && (this.na(16), this.na(17)), this.h[this.d][this.f][this.e] = this.a[this.g], this.h[this.d][this.f][this.e + 1] = this.a[this.g + 1]) : (this.v = this.a[27], !1 === this.fa(this.v) && (14 > this.v ? 0 !== (this.a[24] & 1) &&
          (this.G = this.a[29], this.F = this.a[28], this.a[30] = this.J[this.v][this.G][this.F] % 16, this.h[this.d][this.f][this.e] = this.a[30], this.a[31] = this.J[this.v][this.G][this.F] >>> 4, this.h[this.d][this.f][this.e + 1] = this.a[31]) : 0 !== (this.a[24] & 2) && (this.G = this.a[29], this.F = this.a[28], this.a[30] = this.J[this.v][this.G][this.F] % 16, this.h[this.d][this.f][this.e] = this.a[30], this.a[31] = this.J[this.v][this.G][this.F] >>> 4, this.h[this.d][this.f][this.e + 1] = this.a[31]), this.xa()));
        this.a[8] = 2 * this.l % 16;
        this.a[9] = this.l >>>
          3;
        this.b += 1;
        break;
      case 11:
        this.i += 1;
        this.l = ((this.a[9] & 7) << 4) + (this.a[8] & 14) >> 1;
        this.d = 0;
        this.f = 8 + (this.l >>> 3);
        this.e = this.l % 8 << 1;
        this.g = this.n[this.b];
        this.o = 6 !== this.g ? !1 : !0;
        if (30 !== this.g) switch (this.a[this.g] = this.h[this.d][this.f][this.e], this.a[this.g + 1] = this.h[this.d][this.f][(this.e + 1) % 16], this.g) {
          case 8:
            this.a[this.g] = this.h[this.d][this.f][this.e] & 14;
            this.a[this.g + 1] = this.h[this.d][this.f][(this.e + 1) % 16] & 7;
            break;
          case 44:
            this.wa();
            break;
          case 10:
            this.oa();
            break;
          case 42:
            this.pa();
            this.qa();
            break;
          case 22:
            0 !== (this.a[22] & 2) && (this.W = !0);
            break;
          case 24:
            0 !== (this.a[this.g] & 1) && (this.R = 255);
            break;
          case 58:
            0 !== (this.a[58] & 1) && this.ma()
        } else this.v = this.a[27], !1 === this.fa(this.v) && (14 > this.v ? 0 !== (this.a[24] & 1) && (this.G = this.a[29], this.F = this.a[28], this.a[30] = this.h[this.d][this.f][this.e], this.a[31] = this.h[this.d][this.f][(this.e + 1) % 16], this.J[this.v][this.G][this.F] = 16 * this.a[31] + this.a[30]) : 0 !== (this.a[24] & 2) && (this.G = this.a[29], this.F = this.a[28], this.a[30] = this.h[this.d][this.f][this.e],
          this.a[31] = this.h[this.d][this.f][(this.e + 1) % 16], this.J[this.v][this.G][this.F] = 16 * this.a[31] + this.a[30]), this.xa());
        this.l = (this.l + 1) % 64;
        this.a[9] = this.l >>> 3;
        this.a[8] = (this.l << 1) % 16;
        this.b += 1;
        break;
      case 12:
        this.i += 1;
        this.o = !1;
        this.g = this.n[this.b];
        this.p = this.q[this.b];
        b = this.k[this.b];
        a = this.a[0];
        for (0 !== this.g ? d = this.a[this.g] : d = 0; 0 <= b;) a = 0 !== d % 2 ? a | 1 : a & 14, d = d >>> 1, b = b - 1;
        this.a[this.p] = d;
        this.a[0] = a;
        this.o = 7 !== this.p ? !1 : !0;
        this.b += 1;
        break;
      case 13:
        this.i += 1;
        this.o = !1;
        this.g = this.n[this.b];
        this.p =
          this.q[this.b];
        b = this.k[this.b];
        a = this.a[0];
        for (0 !== this.g ? this.c = this.a[this.g] : this.c = 0; 0 <= b;) this.c = this.c << 1, 16 <= this.c ? (this.c %= 16, a = a | 1) : a = a & 14, b = b - 1;
        this.a[this.p] = this.c;
        this.o = 7 !== this.p ? !1 : !0;
        this.a[0] = a;
        this.b += 1;
        break;
      case 14:
        this.i += 1;
        this.g = this.n[this.b];
        this.o = 7 !== this.g ? !1 : !0;
        this.e = this.a[2];
        this.f = this.a[3];
        this.d = this.a[0] >>> 2;
        this.a[this.g] = this.h[this.d][this.f][this.e];
        switch (this.g) {
          case 8:
            this.a[this.g] = this.h[this.d][this.f][this.e] & 14;
            break;
          case 9:
            this.a[this.g] = this.h[this.d][this.f][this.e] &
              7;
            break;
          case 44:
            this.wa();
            break;
          case 10:
            this.oa();
            break;
          case 42:
            this.pa();
            break;
          case 43:
            this.qa();
            break;
          case 22:
            0 === (this.a[22] & 2) && (this.W = !0);
            break;
          case 24:
            0 !== (this.a[this.g] & 1) && (this.R = 255);
            break;
          case 58:
            0 !== (this.a[58] & 1) && this.ma()
        }
        this.b += 1;
        break;
      case 15:
        this.i += 1;
        this.o = !1;
        this.g = this.n[this.b];
        16 !== this.g && 17 !== this.g || this.na(this.g);
        this.d = this.a[0] >>> 2;
        this.f = this.a[3];
        this.e = this.a[2];
        this.h[this.d][this.f][this.e] = this.a[this.g];
        this.b += 1;
        break;
      case 16:
        this.i += 1;
        this.g = this.n[this.b];
        this.p = this.q[this.b];
        this.c = 0 !== this.g ? this.a[this.g] + this.k[this.b] : this.k[this.b];
        a = this.a[0];
        16 > this.c ? (this.a[this.p] = this.c, a = 0 !== this.c ? a & 12 : (a | 2) & 14) : (this.c = this.c % 16, this.a[this.p] = this.c, a = 0 !== this.c ? a & 13 | 1 : a | 3);
        this.o = 7 !== this.p ? !1 : !0;
        this.a[0] = a;
        this.b += 1;
        break;
      case 17:
        this.i += 1;
        this.o = !1;
        this.g = this.k[this.b];
        0 !== this.g ? b = this.a[this.g] : b = 0;
        this.g = this.n[this.b];
        this.p = this.q[this.b];
        this.c = 0 !== this.g ? this.a[this.g] + b : b;
        a = this.a[0];
        16 > this.c ? (this.a[this.p] = this.c, a = 0 !== this.c ? a & 12 :
          (a | 2) & 14) : (this.c = this.c % 16, this.a[this.p] = this.c, a = 0 !== this.c ? a & 13 | 1 : a | 3);
        this.o = 7 !== this.p ? !1 : !0;
        this.a[0] = a;
        this.b += 1;
        break;
      case 18:
        this.i += 1;
        this.o = !1;
        this.g = this.n[this.b];
        this.p = this.q[this.b];
        this.c = 0 !== this.g ? this.a[this.g] - this.k[this.b] : 0 - this.k[this.b];
        a = this.a[0];
        0 <= this.c ? (this.a[this.p] = this.c, a = 0 !== this.c ? a & 12 : (a | 2) & 14) : (this.c += 16, this.a[this.p] = this.c, a = a & 13 | 1);
        this.o = 7 !== this.p ? !1 : !0;
        this.a[0] = a;
        this.b += 1;
        break;
      case 19:
        this.i += 1;
        this.o = !1;
        this.g = this.k[this.b];
        0 !== this.g ? b = this.a[this.g] :
          b = 0;
        this.g = this.n[this.b];
        this.p = this.q[this.b];
        this.c = 0 !== this.g ? this.a[this.g] - b : 0 - b;
        a = this.a[0];
        0 <= this.c ? (this.a[this.p] = this.c, a = 0 !== this.c ? a & 12 : (a | 2) & 14) : (this.c += 16, this.a[this.p] = this.c, a = 0 !== this.c ? a & 13 | 1 : a | 3);
        this.o = 7 !== this.p ? !1 : !0;
        this.a[0] = a;
        this.b += 1;
        break;
      case 20:
        this.i += 1;
        this.g = this.n[this.b];
        this.o = 7 !== this.g ? !1 : !0;
        this.a[this.g] = this.k[this.b];
        switch (this.g) {
          case 8:
            this.a[this.g] = this.k[this.b] & 14;
            break;
          case 9:
            this.a[this.g] = this.k[this.b] & 7;
            break;
          case 44:
            this.wa();
            break;
          case 10:
            this.oa();
            break;
          case 42:
            this.pa();
            break;
          case 43:
            this.qa();
            break;
          case 22:
            0 === (this.a[22] & 2) && (this.W = !0);
            break;
          case 24:
            0 !== (this.a[this.g] & 1) && (this.R = 255, this.a[47] &= 14);
            this.Ha || (this.Ha = !0);
            break;
          case 58:
            0 !== (this.a[58] & 1) && this.ma()
        }
        this.b += 1;
        break;
      case 21:
        this.i += 1;
        this.o = !1;
        this.g = this.k[this.b];
        0 !== this.g ? b = this.a[this.g] : b = 0;
        this.g = this.n[this.b];
        this.p = this.q[this.b];
        a = this.a[0];
        this.c = 0 !== this.g ? this.a[this.g] + b + (a & 1) : b + (a & 1);
        16 > this.c ? (this.a[this.p] = this.c, a = 0 !== this.c ? a & 12 : (a | 2) & 14) : (this.c = this.c %
          16, this.a[this.p] = this.c, a = 0 !== this.c ? a & 13 | 1 : a | 3);
        this.o = 7 !== this.p ? !1 : !0;
        this.a[0] = a;
        this.b += 1;
        break;
      case 22:
        this.i += 1;
        this.g = this.q[this.b] << 1;
        this.o = 6 !== this.g ? !1 : !0;
        this.a[this.g] = this.k[this.b];
        this.a[this.g + 1] = this.n[this.b];
        switch (this.g) {
          case 8:
            this.a[this.g] = this.k[this.b] & 14;
            this.a[this.g + 1] = this.k[this.b] & 7;
            break;
          case 44:
            this.wa();
            break;
          case 10:
            this.oa();
            break;
          case 42:
            this.pa();
            this.qa();
            break;
          case 22:
            0 === (this.a[22] & 2) && (this.W = !0);
            break;
          case 24:
            0 !== (this.a[this.g] & 1) && (this.R = 255);
            break;
          case 58:
            0 !== (this.a[58] & 1) && this.ma()
        }
        this.b += 1;
        break;
      case 23:
        this.i += 1;
        this.o = !1;
        this.g = this.k[this.b];
        0 !== this.g ? b = this.a[this.g] : b = 0;
        this.g = this.n[this.b];
        this.p = this.q[this.b];
        a = this.a[0] >>> 0;
        this.c = 0 !== this.g ? this.a[this.g] - b - (a & 1) : 0 - b - (a & 1);
        0 <= this.c ? (this.a[this.p] = this.c, a = 0 !== this.c ? a & 12 : (a | 2) & 14) : (this.c += 16, this.a[this.p] = this.c, a = 0 !== this.c ? a & 13 | 1 : a | 3);
        this.o = 7 !== this.p ? !1 : !0;
        this.a[0] = a;
        this.b += 1;
        break;
      case 24:
        this.i += 1;
        this.o = !1;
        this.g = this.n[this.b];
        this.p = this.q[this.b];
        this.c = 0 !==
          this.g ? this.a[this.g] & this.k[this.b] : 0;
        a = this.a[0];
        this.a[this.p] = this.c;
        a = 0 !== this.c ? a & 13 : a | 2;
        this.o = 7 !== this.p ? !1 : !0;
        this.a[0] = a;
        this.b += 1;
        break;
      case 25:
        this.i += 1;
        this.o = !1;
        this.g = this.k[this.b];
        0 !== this.g ? b = this.a[this.g] : b = 0;
        this.g = this.n[this.b];
        this.p = this.q[this.b];
        this.c = 0 !== this.g ? this.a[this.g] & b : 0;
        a = this.a[0];
        this.a[this.p] = this.c;
        a = 0 !== this.c ? a & 13 : a | 2;
        this.o = 7 !== this.p ? !1 : !0;
        this.a[0] = a;
        this.b += 1;
        break;
      case 26:
        this.i += 1;
        this.o = !1;
        this.g = this.n[this.b];
        this.p = this.q[this.b];
        0 !== this.g ?
          this.c = this.a[this.g] | this.k[this.b] : this.c = this.k[this.b];
        a = this.a[0];
        this.a[this.p] = this.c;
        a = 0 !== this.c ? a & 13 : a | 2;
        this.o = 7 !== this.p ? !1 : !0;
        this.a[0] = a;
        this.b += 1;
        break;
      case 27:
        this.i += 1;
        this.o = !1;
        this.g = this.k[this.b];
        0 !== this.g ? b = this.a[this.g] : b = 0;
        this.g = this.n[this.b];
        this.p = this.q[this.b];
        0 !== this.g ? this.c = this.a[this.g] | b : this.c = b;
        a = this.a[0];
        this.a[this.p] = this.c;
        a = 0 !== this.c ? a & 13 : a | 2;
        this.o = 7 !== this.p ? !1 : !0;
        this.a[0] = a;
        this.b += 1;
        break;
      case 28:
        this.i += 1;
        this.o = !1;
        this.g = this.n[this.b];
        this.p =
          this.q[this.b];
        this.c = 0 !== this.g ? this.a[this.g] ^ this.k[this.b] : 0 ^ this.k[this.b];
        a = this.a[0];
        this.a[this.p] = this.c;
        a = 0 !== this.c ? a & 13 : a | 2;
        this.o = 7 !== this.p ? !1 : !0;
        this.a[0] = a;
        this.b += 1;
        break;
      case 29:
        this.i += 1;
        this.o = !1;
        this.g = this.k[this.b];
        0 !== this.g ? b = this.a[this.g] : b = 0;
        this.g = this.n[this.b];
        this.p = this.q[this.b];
        this.c = 0 !== this.g ? this.a[this.g] ^ b : 0 ^ b;
        a = this.a[0];
        this.a[this.p] = this.c;
        a = 0 !== this.c ? a & 13 : a | 2;
        this.o = 7 !== this.p ? !1 : !0;
        this.a[0] = a;
        this.b += 1;
        break;
      case 30:
        this.i += 1;
        this.o = !1;
        this.d = this.a[0] >>>
          2;
        this.f = this.a[3];
        this.e = this.a[2] & 14;
        this.g = this.n[this.b];
        this.o = 6 !== this.g ? !1 : !0;
        if (30 !== this.g) switch (this.a[this.g] = this.h[this.d][this.f][this.e], this.a[this.g + 1] = this.h[this.d][this.f][(this.e + 1) % 16], this.g) {
          case 8:
            this.a[this.g] = this.h[this.d][this.f][this.e] & 14;
            this.a[this.g + 1] = this.h[this.d][this.f][(this.e + 1) % 16] & 7;
            break;
          case 44:
            this.wa();
            break;
          case 10:
            this.oa();
            break;
          case 42:
            this.pa();
            this.qa();
            break;
          case 22:
            0 === (this.a[22] & 2) && (this.W = !0);
            break;
          case 24:
            0 !== (this.a[this.g] & 1) && (this.R =
              255);
            break;
          case 58:
            0 !== (this.a[58] & 1) && this.ma()
        } else this.v = this.a[27], !1 === this.fa(this.v) && (14 > this.v ? 0 !== (this.a[24] & 1) && (this.G = this.a[29], this.F = this.a[28], this.a[30] = this.h[this.d][this.f][this.e], this.a[31] = this.h[this.d][this.f][(this.e + 1) % 16], this.J[this.v][this.G][this.F] = 16 * this.a[31] + this.a[30]) : 0 !== (this.a[24] & 2) && (this.G = this.a[29], this.F = this.a[28], this.a[30] = this.h[this.d][this.f][this.e], this.a[31] = this.h[this.d][this.f][(this.e + 1) % 16], this.J[this.v][this.G][this.F] = (this.a[31] <<
          4) + this.a[30]), this.xa());
        this.b += 1;
        break;
      case 31:
        this.i += 1;
        this.o = !1;
        this.d = this.a[0] >>> 2;
        this.f = this.a[3];
        this.e = this.a[2] & 14;
        this.g = this.n[this.b];
        30 !== this.g ? 48 !== this.g && (16 === this.g && (this.na(16), this.na(17)), this.h[this.d][this.f][this.e] = this.a[this.g], this.h[this.d][this.f][this.e + 1] = this.a[this.g + 1]) : (this.v = this.a[27], !1 === this.fa(this.v) && (14 > this.v ? 0 !== (this.a[24] & 1) && (this.G = this.a[29], this.F = this.a[28], this.a[30] = this.J[this.v][this.G][this.F] % 16, this.h[this.d][this.f][this.e] = this.a[30],
          this.a[31] = this.J[this.v][this.G][this.F] >>> 4, this.h[this.d][this.f][this.e + 1] = this.a[31]) : 0 !== (this.a[24] & 2) && (this.G = this.a[29], this.F = this.a[28], this.a[30] = this.J[this.v][this.G][this.F] % 16, this.h[this.d][this.f][this.e] = this.a[30], this.a[31] = this.J[this.v][this.G][this.F] >>> 4, this.h[this.d][this.f][this.e + 1] = this.a[31]), this.xa()));
        this.b += 1;
        break;
      case 32:
      case 33:
      case 34:
      case 35:
        this.i += 1;
        this.o = !1;
        this.d = this.a[0] >>> 2;
        this.f = this.q[this.b];
        this.e = this.n[this.b];
        this.h[this.d][this.f][this.e] =
          this.k[this.b];
        this.b += 1;
        break;
      case 36:
      case 37:
      case 38:
      case 39:
        this.b += 1;
        this.o = !1;
        this.l = ((this.a[9] & 7) << 4) + (this.a[8] & 14) >>> 1;
        this.l = 0 !== this.l ? this.l - 1 : 63;
        this.d = 0;
        this.f = 8 + (this.l >>> 3);
        this.e = this.l % 8 << 1;
        this.h[this.d][this.f][this.e] = this.b & 15;
        this.h[this.d][this.f][this.e + 1] = (this.b & 240) >> 4;
        --this.l;
        this.d = 0;
        this.f = 8 + (this.l >>> 3);
        this.e = this.l % 8 << 1;
        this.h[this.d][this.f][this.e] = (this.b & 3840) >> 8;
        this.h[this.d][this.f][this.e + 1] = (this.b & 61440) >> 12;
        this.b = (this.b >>> 12 << 12) + this.k[this.b - 1];
        15 <
          this.l << 1 ? (this.a[9] = this.l >>> 3, this.a[8] = (this.l << 1) % 16) : (this.a[9] = 0, this.a[8] = this.l << 1);
        break;
      case 40:
      case 41:
      case 42:
      case 43:
        a = this.b;
        this.i += 2;
        this.b += 1;
        this.o = !1;
        this.l = ((this.a[9] & 7) << 4) + (this.a[8] & 14) >>> 1;
        this.l = 0 !== this.l ? this.l - 1 : 63;
        this.d = 0;
        this.f = 8 + (this.l >>> 3);
        this.e = this.l % 8 << 1;
        this.h[this.d][this.f][this.e] = this.b & 15;
        this.h[this.d][this.f][this.e + 1] = (this.b & 240) >> 4;
        --this.l;
        this.d = 0;
        this.f = 8 + (this.l >>> 3);
        this.e = this.l % 8 * 2;
        this.h[this.d][this.f][this.e] = (this.b & 3840) >> 8;
        this.h[this.d][this.f][this.e +
          1
        ] = (this.b & 61440) >> 12;
        15 < 2 * this.l ? (this.a[9] = this.l >>> 3, this.a[8] = (this.l << 1) % 16) : (this.a[9] = 0, this.a[8] = this.l << 1);
        this.b = this.k[a];
        break;
      case 44:
      case 45:
      case 46:
      case 47:
        this.i += 1;
        this.o = !1;
        this.b = 0 !== (this.a[0] & 2) ? 4096 * ((this.b >>> 0) / 4096 >>> 0) + this.k[this.b] : this.b + 1;
        break;
      case 48:
      case 49:
      case 50:
      case 51:
        this.i += 1;
        this.o = !1;
        this.b = 0 === (this.a[0] & 2) ? 4096 * ((this.b >>> 0) / 4096 >>> 0) + this.k[this.b] : this.b + 1;
        break;
      case 52:
      case 53:
      case 54:
      case 55:
        this.i += 1;
        this.o = !1;
        this.b = 0 !== (this.a[0] & 1) ? 4096 * ((this.b >>>
          0) / 4096 >>> 0) + this.k[this.b] : this.b + 1;
        break;
      case 56:
      case 57:
      case 58:
      case 59:
        this.i += 1;
        this.o = !1;
        this.b = 0 === (this.a[0] & 1) ? 4096 * ((this.b >>> 0) / 4096 >>> 0) + this.k[this.b] : this.b + 1;
        break;
      case 60:
      case 61:
      case 62:
      case 63:
        a = this.b, this.i += 1, !0 === this.o && (this.b = 4096 * this.a[7] + this.k[a]), this.o = !1, this.b = 4096 * ((this.b >>> 0) / 4096 >>> 0) + this.k[a]
    }
    this.Na && 0 !== (this.a[10] & 2) && (this.ga(), this.b = this.sb, this.Na = !1, this.a[40] &= 14);
    this.ya && this.Oa && (this.ga(), this.b = this.tb, this.ya = !1, this.a[40] &= 13);
    this.za && this.Pa &&
      (this.ga(), this.b = this.ub, this.za = !1, this.a[40] &= 11);
    this.nb && (this.ga(), this.b = this.qb, this.nb = !1, this.a[40] &= 7);
    this.La && (this.ga(), this.b = this.pb, this.La = !1, this.a[41] &= 14);
    this.ob && (this.ga(), this.b = this.rb, this.ob = !1, this.a[41] &= 13);
    0 === (this.a[22] & 2) && (this.h[2][8][10] = 15)
  };
  p.prototype.uc = function () {
    var a;
    for (a = 3E3; 0 <= a; a--) this.ic();
    a = 1E3 * (new Date - this.yb);
    this.yb = new Date;
    this.I[0].Ob(a);
    this.I[1].Ob(a);
    this.I[0].ra && this.I[0].ca && (0 !== (this.a[42] & 4) && (this.ya = !0, this.a[40] |= 2), this.I[0].reset(),
      this.I[0].ra = !1);
    this.I[1].ra && this.I[1].ca && (0 !== (this.a[43] & 4) && (this.za = !0, this.a[40] |= 4), this.I[1].reset(), this.I[1].ra = !1)
  };
  p.prototype.oa = function () {
    this.Oa = 0 !== (this.a[10] & 4) ? !0 : !1;
    this.Pa = 0 !== (this.a[10] & 8) ? !0 : !1
  };
  p.prototype.wa = function () {
    0 !== (this.a[44] & 1) ? (!1 === this.I[0].ca && (this.I[0].Kb(35E4), this.I[0].Lb()), !1 === this.I[1].ca && (this.I[1].Kb(6E3), this.I[1].Lb())) : (this.I[0].Nb(), this.I[1].Nb())
  };
  p.prototype.pa = function () {
    this.a[40] &= 13
  };
  p.prototype.qa = function () {
    this.a[40] &= 11
  };
  p.prototype.ga =
    function () {
      this.l = ((this.a[9] & 7) << 4) + (this.a[8] & 14) >> 1;
      !0 === this.Ma && (this.b += 1, this.Ma = !1);
      this.l = 0 !== this.l ? this.l - 1 : 63;
      this.d = 0;
      this.f = 8 + (this.l >>> 3);
      this.e = this.l % 8 << 1;
      this.h[this.d][this.f][this.e] = this.b & 15;
      this.h[this.d][this.f][this.e + 1] = (this.b & 240) >> 4;
      this.l = 0 !== this.l ? this.l - 1 : 63;
      this.d = 0;
      this.f = 8 + (this.l >>> 3);
      this.e = this.l % 8 << 1;
      this.h[this.d][this.f][this.e] = (this.b & 3840) >> 8;
      this.h[this.d][this.f][this.e + 1] = (this.b & 61440) >> 12;
      15 < this.l << 1 ? (this.a[9] = this.l >>> 3, this.a[8] = (this.l << 1) % 16) :
        (this.a[9] = 0, this.a[8] = this.l << 1)
    };
  p.prototype.fa = function (a) {
    return 8 <= a && 14 > a ? !0 : !1
  };
  p.prototype.xa = function () {
    var a;
    a = (this.a[27] << 8) + (this.a[29] << 4) + this.a[28];
    0 !== (this.a[23] & 1) && (0 !== (this.a[23] & 2) ? (a = a - 1, this.a[27] = a >> 8, this.a[29] = a % 256 >> 4, this.a[28] = a % 256 % 16) : (a += 1, this.a[27] = a >> 8, this.a[29] = a % 256 >> 4, this.a[28] = a % 256 % 16))
  };
  p.prototype.na = function (a) {
    if (255 === this.R) this.a[a] = 0;
    else {
      switch ((this.R & 240) >> 4) {
        case 1:
          if (0 === (this.a[12] & 1)) {
            this.a[a] = 0;
            return
          }
          break;
        case 2:
          if (0 === (this.a[12] & 2)) {
            this.a[a] =
              0;
            return
          }
          break;
        case 3:
          if (0 === (this.a[12] & 4)) {
            this.a[a] = 0;
            return
          }
          break;
        case 4:
          if (0 === (this.a[12] & 8)) {
            this.a[a] = 0;
            return
          }
          break;
        case 5:
          if (0 === (this.a[13] & 1)) {
            this.a[a] = 0;
            return
          }
          break;
        case 6:
          if (0 === (this.a[13] & 2)) {
            this.a[a] = 0;
            return
          }
          break;
        case 7:
          if (0 === (this.a[13] & 4)) {
            this.a[a] = 0;
            return
          }
      }
      switch (this.R & 15) {
        case 8:
          if (16 === a) {
            this.a[a] = 0;
            break
          }
          17 === a && (this.a[a] = 8);
          break;
        case 7:
          if (16 === a) {
            this.a[a] = 0;
            break
          }
          17 === a && (this.a[a] = 4);
          break;
        case 6:
          if (16 === a) {
            this.a[a] = 0;
            break
          }
          17 === a && (this.a[a] = 2);
          break;
        case 5:
          if (16 ===
            a) {
            this.a[a] = 0;
            break
          }
          17 === a && (this.a[a] = 1);
          break;
        case 4:
          16 === a && (this.a[a] = 8);
          17 === a && (this.a[a] = 0);
          break;
        case 3:
          16 === a && (this.a[a] = 4);
          17 === a && (this.a[a] = 0);
          break;
        case 2:
          16 === a && (this.a[a] = 2);
          17 === a && (this.a[a] = 0);
          break;
        case 1:
          16 === a && (this.a[a] = 1);
          17 === a && (this.a[a] = 0);
          break;
        case 0:
          16 === a && (this.a[a] = 0), 17 === a && (this.a[a] = 8)
      }
    }
  };
  p.prototype.ma = function () {
    var a, b, d, e, f, g, k, h, l, m, t, q, r;
    a = this.a[51];
    b = this.a[53];
    d = this.a[52];
    g = this.a[59];
    k = this.a[61];
    h = this.a[60];
    l = ((this.a[50] & 7) << 8) + (this.a[49] << 4) +
      this.a[48] >>> 0;
    m = this.a[56] & 7;
    r = 0;
    e = (a << 8) + (b << 4) + d >>> 0;
    f = (g << 8) + (k << 4) + h >>> 0;
    for (t = 0; t < l && !0 !== this.fa(a) && !0 !== this.fa(a); t++) {
      q = r;
      r = 0;
      a = this.J[a][b][d];
      for (b = 0; b < m; b++) r += a & 1 << b - 1;
      r *= 1 << 8 - m;
      b = 1 << m;
      a = (a >>> 0) / b + q >>> 0;
      this.J[g][k][h] = a;
      e += 1;
      f += 1;
      a = e >>> 8;
      b = e % 256 >>> 4 >>> 0;
      d = e % 256 % 16;
      g = f >>> 8;
      k = f % 256 >>> 4 >>> 0;
      h = f % 256 % 16
    }
    0 !== (this.a[11] & 2) && 0 !== (this.a[58] & 8) && (this.La = !0, this.a[41] |= 1);
    this.a[58] &= 14
  };
  n.prototype.T = function () {
    this.eb = [];
    this.Ga = void 0;
    this.m ? this.m.T() : this.m = new p
  };
  n.prototype.kc = function (a) {
    var b,
      d, e, f;
    e = 0;
    d = a.length;
    for (b = 0; e < d; e += 2, b++) f = a[e + 1] << 8 | a[e], this.m.Q[b] = f, this.m.vb(this.m.Q[b], b)
  };
  n.prototype.lc = function (a) {
    var b, d, e, f;
    e = 0;
    d = a.length;
    for (b = 0; e < d; e += 4, b++) f = parseInt(a.substr(e + 2, 2) + a.substr(e, 2), 16), this.m.Q[b] = f, this.m.vb(this.m.Q[b], b)
  };
  n.prototype.mc = function () {
    this.m.b = 0;
    this.m.sb = this.m.Q[1] & 4095;
    this.m.tb = this.m.Q[2] & 4095;
    this.m.ub = this.m.Q[3] & 4095;
    this.m.qb = this.m.Q[4] & 4095;
    this.m.pb = this.m.Q[5] & 4095;
    this.m.rb = this.m.Q[6] & 4095
  };
  n.prototype.hc = function (a) {
    "string" !== typeof a ?
      this.kc(a) : this.lc(a);
    this.mc()
  };
  n.prototype.qc = function (a) {
    this.eb.push(a);
    this.gb(this)
  };
  n.prototype.vc = function (a, b) {
    a.m.R = b;
    0 === a.m.R && (a.m.R = 255, a.m.a[47] |= 1, 0 !== (a.m.a[47] & 8) && (a.m.Na = !0));
    return !0 === a.Wb(b) ? (a.m.nb = !0, a.m.a[40] |= 8, !0) : !1
  };
  n.prototype.gb = function (a) {
    if (a.m.a[11] & 1 && !(a.m.a[40] & 8)) {
      var b = a.eb.shift();
      a.vc(a, b) || (a.eb.push(b), this.Ga = setTimeout(function () {
        a.gb(a)
      }, 100))
    } else this.Ga = setTimeout(function () {
      a.gb(a)
    }, 100)
  };
  n.prototype.jc = function () {
    var a = !1;
    this.ac() & 1 && (a = !0);
    return a
  };
  n.prototype.Wb = function (a) {
    if (this.m.ya && this.m.Oa || this.m.za && this.m.Pa) return !1;
    switch ((a & 240) >> 4) {
      case 1:
        if (0 === (this.m.a[12] & 1)) return !1;
        break;
      case 2:
        if (0 === (this.m.a[12] & 2)) return !1;
        break;
      case 3:
        if (0 === (this.m.a[12] & 4)) return !1;
        break;
      case 4:
        if (0 === (this.m.a[12] & 8)) return !1;
        break;
      case 5:
        if (0 === (this.m.a[13] & 1)) return !1;
        break;
      case 6:
        if (0 === (this.m.a[13] & 2)) return !1
    }
    switch (a & 15) {
      case 0:
        return !0;
      case 1:
        if (0 !== (this.m.a[11] & 1) && 0 !== (this.m.a[32] & 1)) return !0;
        break;
      case 2:
        if (0 !== (this.m.a[11] & 1) && 0 !==
          (this.m.a[32] & 2)) return !0;
        break;
      case 3:
        if (0 !== (this.m.a[11] & 1) && 0 !== (this.m.a[32] & 4)) return !0;
        break;
      case 4:
        if (0 !== (this.m.a[11] & 1) && 0 !== (this.m.a[32] & 8)) return !0;
        break;
      case 5:
        if (0 !== (this.m.a[11] & 1) && 0 !== (this.m.a[33] & 1)) return !0;
        break;
      case 6:
        if (0 !== (this.m.a[11] & 1) && 0 !== (this.m.a[33] & 2)) return !0;
        break;
      case 7:
        if (0 !== (this.m.a[11] & 1) && 0 !== (this.m.a[33] & 4)) return !0;
        break;
      case 8:
        if (0 !== (this.m.a[11] & 1) && 0 !== (this.m.a[33] & 8)) return !0
    }
    return !1
  };
  n.prototype.ac = function () {
    return this.m.J[15][7][7]
  };
  TI108_lcd =
    function () {
      this.Vb = 128;
      this.Ub = 20;
      var a, b, d, e, f, g, k, h, l, m, t, q;
      this.ec();
      this.context = document.getElementById("display").getContext("2d");
      this.u = {};
      this.j = Array(303);
      for (a = 0; 304 > a; a++) this.j[a] = !1;
      this.j[130] = function (a, b, c) {
        b = 15 + b;
        c = 3 + c;
        a.fillRect(b, c, 1, 6);
        a.fillRect(b + 1, c + 1, 1, 4)
      };
      this.j[131] = function (a, b, c) {
        b = 15 + b;
        c = 8 + c;
        a.fillRect(b + 1, c, 5, 1);
        a.fillRect(b, c + 1, 7, 1);
        a.fillRect(b + 1, c + 2, 5, 1)
      };
      this.j[132] = function (a, b, c) {
        b = 15 + b;
        c = 10 + c;
        a.fillRect(b, c, 1, 6);
        a.fillRect(b + 1, c + 1, 1, 4)
      };
      this.j[133] = function (a,
        b, c) {
        b = 15 + b;
        c = 15 + c;
        a.fillRect(b + 1, c, 5, 1);
        a.fillRect(b, c + 1, 7, 1)
      };
      this.j[137] = function (a, b, c) {
        a.fillRect(4 + b, 8 + c, 8, 2)
      };
      this.j[138] = function (a, b, c) {
        b = 15 + b;
        c = 2 + c;
        a.fillRect(b, c, 7, 1);
        a.fillRect(b + 1, c + 1, 5, 1)
      };
      this.j[139] = function (a, b, c) {
        b = 20 + b;
        c = 3 + c;
        a.fillRect(b, c + 1, 1, 4);
        a.fillRect(b + 1, c, 1, 6)
      };
      this.j[140] = function (a, b, c) {
        b = 20 + b;
        c = 10 + c;
        a.fillRect(b, c + 1, 1, 4);
        a.fillRect(b + 1, c, 1, 6)
      };
      this.j[141] = function (a, b, c) {
        a.fillRect(23 + b, 13 + c + 2, 2, 2)
      };
      this.j[142] = function (a, b, c) {
        b = 23 + b;
        c = 16 + c;
        a.fillRect(b, c, 2, 2);
        a.fillRect(b +
          1, c + 2, 1, 1);
        a.fillRect(b, c + 2 + 1, 1, 1)
      };
      this.j[146] = function (a, b, c) {
        b = 26 + b;
        c = 3 + c;
        a.fillRect(b, c, 1, 6);
        a.fillRect(b + 1, c + 1, 1, 4)
      };
      this.j[147] = function (a, b, c) {
        b = 26 + b;
        c = 8 + c;
        a.fillRect(b + 1, c, 5, 1);
        a.fillRect(b, c + 1, 7, 1);
        a.fillRect(b + 1, c + 2, 5, 1)
      };
      this.j[148] = function (a, b, c) {
        b = 26 + b;
        c = 10 + c;
        a.fillRect(b, c, 1, 6);
        a.fillRect(b + 1, c + 1, 1, 4)
      };
      this.j[149] = function (a, b, c) {
        b = 26 + b;
        c = 15 + c;
        a.fillRect(b + 1, c, 5, 1);
        a.fillRect(b, c + 1, 7, 1)
      };
      this.j[153] = function (a, b, c) {
        b = 4 + b;
        c = 12 + c;
        a.fillRect(b, c, 6, 1);
        a.fillRect(b, c + 2, 6, 1);
        a.fillRect(b,
          c + 4, 6, 1);
        a.fillRect(b, c, 1, 4)
      };
      this.j[154] = function (a, b, c) {
        b = 26 + b;
        c = 2 + c;
        a.fillRect(b, c, 7, 1);
        a.fillRect(b + 1, c + 1, 5, 1)
      };
      this.j[155] = function (a, b, c) {
        b = 31 + b;
        c = 3 + c;
        a.fillRect(b, c + 1, 1, 4);
        a.fillRect(b + 1, c, 1, 6)
      };
      this.j[156] = function (a, b, c) {
        b = 31 + b;
        c = 10 + c;
        a.fillRect(b, c + 1, 1, 4);
        a.fillRect(b + 1, c, 1, 6)
      };
      this.j[157] = function (a, b, c) {
        a.fillRect(34 + b, 13 + c + 2, 2, 2)
      };
      this.j[158] = function (a, b, c) {
        b = 34 + b;
        c = 16 + c;
        a.fillRect(b, c, 2, 2);
        a.fillRect(b + 1, c + 2, 1, 1);
        a.fillRect(b, c + 2 + 1, 1, 1)
      };
      this.j[162] = function (a, b, c) {
        b = 37 + b;
        c = 3 + c;
        a.fillRect(b,
          c, 1, 6);
        a.fillRect(b + 1, c + 1, 1, 4)
      };
      this.j[163] = function (a, b, c) {
        b = 37 + b;
        c = 8 + c;
        a.fillRect(b + 1, c, 5, 1);
        a.fillRect(b, c + 1, 7, 1);
        a.fillRect(b + 1, c + 2, 5, 1)
      };
      this.j[164] = function (a, b, c) {
        b = 37 + b;
        c = 10 + c;
        a.fillRect(b, c, 1, 6);
        a.fillRect(b + 1, c + 1, 1, 4)
      };
      this.j[165] = function (a, b, c) {
        b = 37 + b;
        c = 15 + c;
        a.fillRect(b + 1, c, 5, 1);
        a.fillRect(b, c + 1, 7, 1)
      };
      this.j[170] = function (a, b, c) {
        b = 37 + b;
        c = 2 + c;
        a.fillRect(b, c, 7, 1);
        a.fillRect(b + 1, c + 1, 5, 1)
      };
      this.j[171] = function (a, b, c) {
        b = 42 + b;
        c = 3 + c;
        a.fillRect(b, c + 1, 1, 4);
        a.fillRect(b + 1, c, 1, 6)
      };
      this.j[172] = function (a,
        b, c) {
        b = 42 + b;
        c = 10 + c;
        a.fillRect(b, c + 1, 1, 4);
        a.fillRect(b + 1, c, 1, 6)
      };
      this.j[173] = function (a, b, c) {
        a.fillRect(45 + b, 13 + c + 2, 2, 2)
      };
      this.j[174] = function (a, b, c) {
        b = 45 + b;
        c = 16 + c;
        a.fillRect(b, c, 2, 2);
        a.fillRect(b + 1, c + 2, 1, 1);
        a.fillRect(b, c + 2 + 1, 1, 1)
      };
      this.j[178] = function (a, b, c) {
        b = 48 + b;
        c = 3 + c;
        a.fillRect(b, c, 1, 6);
        a.fillRect(b + 1, c + 1, 1, 4)
      };
      this.j[179] = function (a, b, c) {
        b = 48 + b;
        c = 8 + c;
        a.fillRect(b + 1, c, 5, 1);
        a.fillRect(b, c + 1, 7, 1);
        a.fillRect(b + 1, c + 2, 5, 1)
      };
      this.j[180] = function (a, b, c) {
        b = 48 + b;
        c = 10 + c;
        a.fillRect(b, c, 1, 6);
        a.fillRect(b +
          1, c + 1, 1, 4)
      };
      this.j[181] = function (a, b, c) {
        b = 48 + b;
        c = 15 + c;
        a.fillRect(b + 1, c, 5, 1);
        a.fillRect(b, c + 1, 7, 1)
      };
      this.j[186] = function (b, a, c) {
        a = 48 + a;
        c = 2 + c;
        b.fillRect(a, c, 7, 1);
        b.fillRect(a + 1, c + 1, 5, 1)
      };
      this.j[187] = function (a, b, c) {
        b = 53 + b;
        c = 3 + c;
        a.fillRect(b, c + 1, 1, 4);
        a.fillRect(b + 1, c, 1, 6)
      };
      this.j[188] = function (b, a, c) {
        a = 53 + a;
        c = 10 + c;
        b.fillRect(a, c + 1, 1, 4);
        b.fillRect(a + 1, c, 1, 6)
      };
      this.j[189] = function (a, b, c) {
        a.fillRect(56 + b, 13 + c + 2, 2, 2)
      };
      this.j[190] = function (a, b, c) {
        b = 56 + b;
        c = 16 + c;
        a.fillRect(b, c, 2, 2);
        a.fillRect(b + 1, c + 2, 1, 1);
        a.fillRect(b, c + 2 + 1, 1, 1)
      };
      this.j[194] = function (b, a, c) {
        a = 59 + a;
        c = 3 + c;
        b.fillRect(a, c, 1, 6);
        b.fillRect(a + 1, c + 1, 1, 4)
      };
      this.j[195] = function (a, b, c) {
        b = 59 + b;
        c = 8 + c;
        a.fillRect(b + 1, c, 5, 1);
        a.fillRect(b, c + 1, 7, 1);
        a.fillRect(b + 1, c + 2, 5, 1)
      };
      this.j[196] = function (b, a, c) {
        a = 59 + a;
        c = 10 + c;
        b.fillRect(a, c, 1, 6);
        b.fillRect(a + 1, c + 1, 1, 4)
      };
      this.j[197] = function (a, b, c) {
        b = 59 + b;
        c = 15 + c;
        a.fillRect(b + 1, c, 5, 1);
        a.fillRect(b, c + 1, 7, 1)
      };
      this.j[201] = function (b, a, c) {
        a = 4 + a;
        c = 2 + c;
        b.fillRect(a, c, 2, 4);
        b.fillRect(a + 2, c + 1, 1, 1);
        b.fillRect(a + 3, c + 2, 1, 1);
        b.fillRect(a + 4, c + 1, 1, 1);
        b.fillRect(a + 5, c, 2, 4)
      };
      this.j[202] = function (a, b, c) {
        b = 59 + b;
        c = 2 + c;
        a.fillRect(b, c, 7, 1);
        a.fillRect(b + 1, c + 1, 5, 1)
      };
      this.j[203] = function (b, a, c) {
        a = 64 + a;
        c = 3 + c;
        b.fillRect(a, c + 1, 1, 4);
        b.fillRect(a + 1, c, 1, 6)
      };
      this.j[204] = function (a, b, c) {
        b = 64 + b;
        c = 10 + c;
        a.fillRect(b, c + 1, 1, 4);
        a.fillRect(b + 1, c, 1, 6)
      };
      this.j[205] = function (b, a, c) {
        b.fillRect(67 + a, 13 + c + 2, 2, 2)
      };
      this.j[206] = function (b, a, c) {
        a = 67 + a;
        c = 16 + c;
        b.fillRect(a, c, 2, 2);
        b.fillRect(a + 1, c + 2, 1, 1);
        b.fillRect(a, c + 2 + 1, 1, 1)
      };
      this.j[210] = function (a, b, c) {
        b =
          70 + b;
        c = 3 + c;
        a.fillRect(b, c, 1, 6);
        a.fillRect(b + 1, c + 1, 1, 4)
      };
      this.j[211] = function (b, a, c) {
        a = 70 + a;
        c = 8 + c;
        b.fillRect(a + 1, c, 5, 1);
        b.fillRect(a, c + 1, 7, 1);
        b.fillRect(a + 1, c + 2, 5, 1)
      };
      this.j[212] = function (a, b, c) {
        b = 70 + b;
        c = 10 + c;
        a.fillRect(b, c, 1, 6);
        a.fillRect(b + 1, c + 1, 1, 4)
      };
      this.j[213] = function (b, a, c) {
        a = 70 + a;
        c = 15 + c;
        b.fillRect(a + 1, c, 5, 1);
        b.fillRect(a, c + 1, 7, 1)
      };
      this.j[218] = function (a, b, c) {
        b = 70 + b;
        c = 2 + c;
        a.fillRect(b, c, 7, 1);
        a.fillRect(b + 1, c + 1, 5, 1)
      };
      this.j[219] = function (b, a, c) {
        a = 75 + a;
        c = 3 + c;
        b.fillRect(a, c + 1, 1, 4);
        b.fillRect(a +
          1, c, 1, 6)
      };
      this.j[220] = function (a, b, c) {
        b = 75 + b;
        c = 10 + c;
        a.fillRect(b, c + 1, 1, 4);
        a.fillRect(b + 1, c, 1, 6)
      };
      this.j[221] = function (b, a, c) {
        b.fillRect(78 + a, 13 + c + 2, 2, 2)
      };
      this.j[222] = function (b, a, c) {
        a = 78 + a;
        c = 16 + c;
        b.fillRect(a, c, 2, 2);
        b.fillRect(a + 1, c + 2, 1, 1);
        b.fillRect(a, c + 2 + 1, 1, 1)
      };
      this.j[226] = function (a, b, c) {
        b = 81 + b;
        c = 3 + c;
        a.fillRect(b, c, 1, 6);
        a.fillRect(b + 1, c + 1, 1, 4)
      };
      this.j[227] = function (b, a, c) {
        a = 81 + a;
        c = 8 + c;
        b.fillRect(a + 1, c, 5, 1);
        b.fillRect(a, c + 1, 7, 1);
        b.fillRect(a + 1, c + 2, 5, 1)
      };
      this.j[228] = function (a, b, c) {
        b = 81 + b;
        c = 10 +
          c;
        a.fillRect(b, c, 1, 6);
        a.fillRect(b + 1, c + 1, 1, 4)
      };
      this.j[229] = function (b, a, c) {
        a = 81 + a;
        c = 15 + c;
        b.fillRect(a + 1, c, 5, 1);
        b.fillRect(a, c + 1, 7, 1)
      };
      this.j[234] = function (a, b, c) {
        b = 81 + b;
        c = 2 + c;
        a.fillRect(b, c, 7, 1);
        a.fillRect(b + 1, c + 1, 5, 1)
      };
      this.j[235] = function (b, a, c) {
        a = 86 + a;
        c = 3 + c;
        b.fillRect(a, c + 1, 1, 4);
        b.fillRect(a + 1, c, 1, 6)
      };
      this.j[236] = function (a, b, c) {
        b = 86 + b;
        c = 10 + c;
        a.fillRect(b, c + 1, 1, 4);
        a.fillRect(b + 1, c, 1, 6)
      };
      this.j[237] = function (b, a, c) {
        b.fillRect(89 + a, 13 + c + 2, 2, 2)
      };
      this.j[238] = function (b, a, c) {
        a = 89 + a;
        c = 16 + c;
        b.fillRect(a,
          c, 2, 2);
        b.fillRect(a + 1, c + 2, 1, 1);
        b.fillRect(a, c + 2 + 1, 1, 1)
      };
      this.j[242] = function (a, b, c) {
        b = 92 + b;
        c = 3 + c;
        a.fillRect(b, c, 1, 6);
        a.fillRect(b + 1, c + 1, 1, 4)
      };
      this.j[243] = function (b, a, c) {
        a = 92 + a;
        c = 8 + c;
        b.fillRect(a + 1, c, 5, 1);
        b.fillRect(a, c + 1, 7, 1);
        b.fillRect(a + 1, c + 2, 5, 1)
      };
      this.j[244] = function (a, b, c) {
        b = 92 + b;
        c = 10 + c;
        a.fillRect(b, c, 1, 6);
        a.fillRect(b + 1, c + 1, 1, 4)
      };
      this.j[245] = function (b, a, c) {
        a = 92 + a;
        c = 15 + c;
        b.fillRect(a + 1, c, 5, 1);
        b.fillRect(a, c + 1, 7, 1)
      };
      this.j[250] = function (a, b, c) {
        b = 92 + b;
        c = 2 + c;
        a.fillRect(b, c, 7, 1);
        a.fillRect(b + 1,
          c + 1, 5, 1)
      };
      this.j[251] = function (b, a, c) {
        a = 97 + a;
        c = 3 + c;
        b.fillRect(a, c + 1, 1, 4);
        b.fillRect(a + 1, c, 1, 6)
      };
      this.j[252] = function (a, b, c) {
        b = 97 + b;
        c = 10 + c;
        a.fillRect(b, c + 1, 1, 4);
        a.fillRect(b + 1, c, 1, 6)
      };
      this.j[253] = function (b, a, c) {
        b.fillRect(100 + a, 13 + c + 2, 2, 2)
      };
      this.j[254] = function (b, a, c) {
        a = 100 + a;
        c = 16 + c;
        b.fillRect(a, c, 2, 2);
        b.fillRect(a + 1, c + 2, 1, 1);
        b.fillRect(a, c + 2 + 1, 1, 1)
      };
      this.j[258] = function (a, b, c) {
        b = 103 + b;
        c = 3 + c;
        a.fillRect(b, c, 1, 6);
        a.fillRect(b + 1, c + 1, 1, 4)
      };
      this.j[259] = function (b, a, c) {
        a = 103 + a;
        c = 8 + c;
        b.fillRect(a + 1, c, 5,
          1);
        b.fillRect(a, c + 1, 7, 1);
        b.fillRect(a + 1, c + 2, 5, 1)
      };
      this.j[260] = function (a, b, c) {
        b = 103 + b;
        c = 10 + c;
        a.fillRect(b, c, 1, 6);
        a.fillRect(b + 1, c + 1, 1, 4)
      };
      this.j[261] = function (b, a, c) {
        a = 103 + a;
        c = 15 + c;
        b.fillRect(a + 1, c, 5, 1);
        b.fillRect(a, c + 1, 7, 1)
      };
      this.j[266] = function (a, b, c) {
        b = 103 + b;
        c = 2 + c;
        a.fillRect(b, c, 7, 1);
        a.fillRect(b + 1, c + 1, 5, 1)
      };
      this.j[267] = function (b, a, c) {
        a = 108 + a;
        c = 3 + c;
        b.fillRect(a, c + 1, 1, 4);
        b.fillRect(a + 1, c, 1, 6)
      };
      this.j[268] = function (a, b, c) {
        b = 108 + b;
        c = 10 + c;
        a.fillRect(b, c + 1, 1, 4);
        a.fillRect(b + 1, c, 1, 6)
      };
      this.j[269] = function (b,
        a, c) {
        b.fillRect(111 + a, 13 + c + 2, 2, 2)
      };
      this.j[270] = function (b, a, c) {
        a = 111 + a;
        c = 16 + c;
        b.fillRect(a, c, 2, 2);
        b.fillRect(a + 1, c + 2, 1, 1);
        b.fillRect(a, c + 2 + 1, 1, 1)
      };
      this.j[274] = function (a, b, c) {
        b = 114 + b;
        c = 3 + c;
        a.fillRect(b, c, 1, 6);
        a.fillRect(b + 1, c + 1, 1, 4)
      };
      this.j[275] = function (b, a, c) {
        a = 114 + a;
        c = 8 + c;
        b.fillRect(a + 1, c, 5, 1);
        b.fillRect(a, c + 1, 7, 1);
        b.fillRect(a + 1, c + 2, 5, 1)
      };
      this.j[276] = function (a, b, c) {
        b = 114 + b;
        c = 10 + c;
        a.fillRect(b, c, 1, 6);
        a.fillRect(b + 1, c + 1, 1, 4)
      };
      this.j[277] = function (b, a, c) {
        a = 114 + a;
        c = 15 + c;
        b.fillRect(a + 1, c, 5, 1);
        b.fillRect(a,
          c + 1, 7, 1)
      };
      this.j[282] = function (a, b, c) {
        b = 114 + b;
        c = 2 + c;
        a.fillRect(b, c, 7, 1);
        a.fillRect(b + 1, c + 1, 5, 1)
      };
      this.j[283] = function (b, a, c) {
        a = 119 + a;
        c = 3 + c;
        b.fillRect(a, c + 1, 1, 4);
        b.fillRect(a + 1, c, 1, 6)
      };
      this.j[284] = function (a, b, c) {
        b = 119 + b;
        c = 10 + c;
        a.fillRect(b, c + 1, 1, 4);
        a.fillRect(b + 1, c, 1, 6)
      };
      this.j[285] = function (b, a, c) {
        b.fillRect(122 + a, 13 + c + 2, 2, 2)
      };
      this.j[286] = function (b, a, c) {
        a = 122 + a;
        c = 16 + c;
        b.fillRect(a, c, 2, 2);
        b.fillRect(a + 1, c + 2, 1, 1);
        b.fillRect(a, c + 2 + 1, 1, 1)
      };
      this.ib = function (a) {
        this.u = a
      };
      this.tc = function () {
        void 0 !== this.context &&
          this.Pb(this.context)
      };
      this.Pb = function (r) {
        var p = [],
          c = 0,
          n, u, v;
        r.fillStyle = "#FFFFFF";
        r.fillRect(0, 0, 128, 20);
        r.fillStyle = "#000000";
        for (n = 14; 15 >= n; n++)
          for (u = 0; 16 > u; u++)
            for (v = 0; 16 > v; v++) p[c] = this.u.m.J[n][u][v], c++;
        b = [!1, !1, !1, !1, !1, !1, !1];
        d = [!1, !1, !1, !1, !1, !1, !1];
        e = [!1, !1, !1, !1, !1, !1, !1];
        f = [!1, !1, !1, !1, !1, !1, !1];
        g = [!1, !1, !1, !1, !1, !1, !1];
        k = [!1, !1, !1, !1, !1, !1, !1];
        h = [!1, !1, !1, !1, !1, !1, !1];
        l = [!1, !1, !1, !1, !1, !1, !1];
        m = 0;
        q = t = !1;
        for (a = 0; 38 > a; a++)
          for (c = 0; 7 > c; c++) 0 !== (p[a] & 1 << c) && !1 !== this.j[8 * a + c + 1] && (n = 8 * a +
            c + 1, this.j[n](r, 0, 0), this.xc(n))
      };
      this.getFullPrecisionAnswer = function () {
        var a;
        a = this.X(l);
        a += this.X(h);
        a += this.X(k);
        a += this.X(g);
        a += this.X(f);
        a += this.X(e);
        a += this.X(d);
        a += this.X(b);
        !0 === q ? a = "ERROR" : (a = a.substring(0, a.length - m) + "." + a.substring(a.length - m, a.length), t && (a = "-" + a));
        return a
      };
      this.X = function (a) {
        var b = "";
        switch (a.reduce(function (a, b) {
          return b ? ++a : a
        }, 0)) {
          case 2:
            b = "1";
            break;
          case 4:
            b = a[1] ? "4" : "7";
            break;
          case 5:
            b = a[0] ? "5" : a[2] ? "2" : "3";
            break;
          case 6:
            b = !1 === a[1] ? "0" : !1 === a[5] ? "6" : "9";
            break;
          case 7:
            b =
              "8"
        }
        return b
      };
      this.xc = function (a) {
        switch (a) {
          case 162:
            l[0] = !0;
            break;
          case 163:
            l[1] = !0;
            break;
          case 164:
            l[2] = !0;
            break;
          case 165:
            l[3] = !0;
            break;
          case 170:
            l[4] = !0;
            break;
          case 171:
            l[5] = !0;
            break;
          case 172:
            l[6] = !0;
            break;
          case 178:
            h[0] = !0;
            break;
          case 179:
            h[1] = !0;
            break;
          case 180:
            h[2] = !0;
            break;
          case 181:
            h[3] = !0;
            break;
          case 186:
            h[4] = !0;
            break;
          case 187:
            h[5] = !0;
            break;
          case 188:
            h[6] = !0;
            break;
          case 194:
            k[0] = !0;
            break;
          case 195:
            k[1] = !0;
            break;
          case 196:
            k[2] = !0;
            break;
          case 197:
            k[3] = !0;
            break;
          case 202:
            k[4] = !0;
            break;
          case 203:
            k[5] = !0;
            break;
          case 204:
            k[6] = !0;
            break;
          case 210:
            g[0] = !0;
            break;
          case 211:
            g[1] = !0;
            break;
          case 212:
            g[2] = !0;
            break;
          case 213:
            g[3] = !0;
            break;
          case 218:
            g[4] = !0;
            break;
          case 219:
            g[5] = !0;
            break;
          case 220:
            g[6] = !0;
            break;
          case 226:
            f[0] = !0;
            break;
          case 227:
            f[1] = !0;
            break;
          case 228:
            f[2] = !0;
            break;
          case 229:
            f[3] = !0;
            break;
          case 234:
            f[4] = !0;
            break;
          case 235:
            f[5] = !0;
            break;
          case 236:
            f[6] = !0;
            break;
          case 242:
            e[0] = !0;
            break;
          case 243:
            e[1] = !0;
            break;
          case 244:
            e[2] = !0;
            break;
          case 245:
            e[3] = !0;
            break;
          case 250:
            e[4] = !0;
            break;
          case 251:
            e[5] = !0;
            break;
          case 252:
            e[6] = !0;
            break;
          case 258:
            d[0] = !0;
            break;
          case 259:
            d[1] = !0;
            break;
          case 260:
            d[2] = !0;
            break;
          case 261:
            d[3] = !0;
            break;
          case 266:
            d[4] = !0;
            break;
          case 267:
            d[5] = !0;
            break;
          case 268:
            d[6] = !0;
            break;
          case 274:
            b[0] = !0;
            break;
          case 275:
            b[1] = !0;
            break;
          case 276:
            b[2] = !0;
            break;
          case 277:
            b[3] = !0;
            break;
          case 282:
            b[4] = !0;
            break;
          case 283:
            b[5] = !0;
            break;
          case 284:
            b[6] = !0;
            break;
          case 285:
            m = 0;
            break;
          case 269:
            m = 1;
            break;
          case 253:
            m = 2;
            break;
          case 237:
            m = 3;
            break;
          case 221:
            m = 4;
            break;
          case 205:
            m = 5;
            break;
          case 189:
            m = 6;
            break;
          case 173:
            m = 7;
            break;
          case 137:
            t = !0;
            break;
          case 153:
            q = !0
        }
      }
    };
  TI108_lcd.prototype = new function () {
    this.getScreen = function () {
      return document.getElementById("display").toDataURL()
    };
    this.write = function () {};
    this.ec = function () {
      var a = document.createElement("div"),
        b = document.createElement("canvas"),
        d = document.getElementById(v),
        e = document.getElementById(u),
        f = document.querySelectorAll('*[id^="' + v + '_CALCSCREEN"]');
      if (null !== d && 0 < f.length && null !== e) {
        for (d.getAttribute("viewBox"); e.firstChild;) e.removeChild(e.firstChild);
        e.insertBefore(d, e.firstChild);
        e.className =
          "calculatorDiv";
        e.tabIndex = "0";
        a.id = "displayDiv";
        a.className = "displayDiv";
        e.appendChild(a);
        b.id = "display";
        b.className = "display";
        b.width = this.Vb;
        b.height = this.Ub;
        a.appendChild(b);
        b.getContext("2d");
        this.Sb()
      }
    };
    this.Sb = function () {
      var a = document.getElementById(v),
        b = document.getElementById("displayDiv"),
        d = document.querySelectorAll('*[id^="' + v + '_CALCSCREEN"] rect');
      if (null !== a && 0 < d.length) {
        var a = a.getAttribute("viewBox").split(/\s*,\s*|\s+/),
          e = parseFloat(a[1]),
          f = parseFloat(a[2]),
          g = parseFloat(a[3]),
          d = d[0],
          k = d.y.baseVal.value + 1,
          h = d.width.baseVal.value - 2,
          l = d.height.baseVal.value - 2;
        b.style.left = (d.x.baseVal.value + 1 - parseFloat(a[0])) / f * 100 + "%";
        b.style.top = (k - e) / g * 100 + "%";
        b.style.width = h / f * 100 + "%";
        b.style.height = l / g * 100 + "%"
      }
    }
  };
  D.prototype = new function () {
    var a = void 0;
    this.D = void 0;
    this.ia = !1;
    this.da = this.ka = 0;
    this.L = this.Fa = this.bb = !1;
    this.M = void 0;
    this.r = [];
    this.H = [];
    this.P = [];
    this.V = [];
    this.ha = [];
    this.Y = "ti_highlight_keys";
    this.zb = "ti_disabled_keys";
    this.ba = [];
    this.Ea = [];
    this.Wa = [];
    this.Xa = [];
    this.aa =
      "normal";
    this.kb = !1;
    this.lb = function (a) {
      0 < this.da && (this.ja[this.ka] = a, this.ka = (this.ka + 1) % this.da)
    };
    this.Xb = function () {
      this.ka = this.ja.length = 0
    };
    this.cc = function () {
      var a = 0,
        d = [],
        a = [],
        e = [];
      return this.ja.length === this.da && 0 !== this.ka ? (a = this.ka, d = this.ja.slice(0, a), a = this.ja.slice(a), e.concat(a, d)) : this.ja
    };
    this.nc = function (a) {
      var d = a.currentTarget || a.target || a.srcElement;
      this.kb && (a.stopPropagation(), a.preventDefault(), this.M.focus(), !this.L && this.ta(d.id) && (this.D = d, this.L = this.ia = !0, this.addClass(d,
        this.Y), a = this.H.indexOf(d.id), this.Ja(this.ha[a]), this.lb(d.id)))
    };
    this.fb = function (a) {
      var d = a.currentTarget || a.target || a.srcElement;
      a.preventDefault();
      this.L && this.D === d && this.ta(d.id) && (this.removeClass(d, this.Y), this.D = null, this.L = !1, this.Ka())
    };
    this.pc = function (a) {
      var d = a.currentTarget || a.target || a.srcElement;
      this.L && this.D === d && this.fb(a)
    };
    this.oc = function (a) {
      var d = a.currentTarget || a.target || a.srcElement;
      this.L && this.D === d && this.fb(a)
    };
    this.Z = function (a, d) {
      var e, f, g;
      e = function (d) {
        return -1 ===
          a.indexOf(d)
      };
      f = function (a) {
        this.addClass(document.getElementById(a), this.zb);
        this.L && (this.removeClass(document.getElementById(a), this.Y), this.mb());
        return !0
      };
      g = function (a) {
        this.removeClass(document.getElementById(a), this.zb);
        return !0
      };
      a && (d ? (a.forEach(g, this), this.ba = this.ba.filter(e, this)) : (a.forEach(f, this), this.ba = a));
      g = f = e = null
    };
    this.Db = function (b) {
      var d, e, f, g, k, h = this,
        l, m, n, q;
      a = b;
      this.bb ? this.Zb() : this.Eb();
      this.ja = [];
      this.N = [];
      this.H = this.r.map(function (a) {
        return a.t
      });
      this.P = this.r.map(function (a) {
        return a.keyCode[0]
      });
      this.V = this.r.map(function (a) {
        return a.keyCode[1]
      });
      this.ha = this.r.map(function (a) {
        return a.code
      });
      if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/Windows Phone/i) || "ontouchstart" in window || 0 < navigator.msMaxTouchPoints) q = window.orientation, b = function () {
        window.orientation !== q && (q = window.orientation, h.mb())
      }, window.addEventListener("resize", b, !1), window.addEventListener("orientationchange",
        b, !1);
      this.M = document.getElementById(u);
      this.M.onkeydown = function (a) {
        a.preventDefault();
        h.zc(a)
      };
      this.M.onkeyup = function (a) {
        a.preventDefault();
        h.Ac(a)
      };
      this.M.onmousedown = function (a) {
        a.preventDefault();
        h.M.focus()
      };
      this.M.onblur = function () {
        h.mb()
      };
      this.M.oncontextmenu = function (a) {
        a.preventDefault()
      };
      e = function (a) {
        h.nc(a)
      };
      f = function (a) {
        h.fb(a)
      };
      oncontextmenuFcn = function (a) {
        a.preventDefault()
      };
      g = function (a) {
        h.pc(a)
      };
      onmouseleaveFcn = function (a) {
        h.oc(a)
      };
      k = function (a) {
        1 === a.targetTouches.length && a.preventDefault()
      };
      l = this.bc();
      1 === l && ("ontouchleave" in window && (m = !0), n = !0);
      b = this.H.length;
      for (d = 0; d < b; d += 1) {
        this.N.push(document.getElementById(this.H[d]));
        if (!this.N[d]) throw Error("SVG is missing Key " + this.r[d].t);
        switch (l) {
          case 0:
            this.N[d].addEventListener("MSPointerDown", e);
            this.N[d].addEventListener("MSPointerUp", f);
            this.N[d].addEventListener("MSPointerOut", g);
            break;
          case 1:
            if (this.N[d].addEventListener("touchstart", e), this.N[d].addEventListener("touchmove", k), this.N[d].addEventListener("contextmenu", oncontextmenuFcn),
              this.N[d].addEventListener("touchend", f), m && this.N[d].addEventListener("touchleave", g), !n) break;
          default:
            this.N[d].onmousedown = e, this.N[d].onmouseup = f, -1 !== navigator.userAgent.indexOf("Edge") ? this.N[d].onmouseout = g : this.N[d].onmouseleave = onmouseleaveFcn
        }
      }
      this.bb = !0
    };
    this.bc = function () {
      return window.navigator.msPointerEnabled ? 0 : "ontouchstart" in window ? 1 : 2
    };
    this.Zb = function () {
      this.H.length = 0;
      this.P.length = 0;
      this.V.length = 0;
      this.ha.length = 0;
      this.N.length = 0;
      this.ba.length = 0;
      this.D = void 0;
      this.bb = this.L = !1;
      this.aa = "normal"
    };
    this.mb = function () {
      var a = 0,
        d = 0,
        e = 0,
        f = !1,
        g, k;
      document.onhelp = function () {
        return !0
      };
      this.Fa = !0;
      null == this.D && (this.Fa = !1);
      if (this.D && this.L)
        if (this.D.id) g = this.D.id, a = this.H.indexOf(g), this.removeClass(document.getElementById(g), this.Y), this.D = null, this.L = !1, this.Ka();
        else {
          for (k = this.D; !f && -1 !== a;) {
            a = this.P.indexOf(k.keyboardCode, d);
            if (-1 !== a && this.r[a].shiftKey[0] === k.shiftKey) {
              g = this.H[a];
              f = !0;
              break
            }
            if (a === this.P.length - 1) {
              a = -1;
              break
            }
            d = a + 1
          }
          f || (e = 1, a = d = 0);
          for (; !f && -1 !== a;) {
            a = this.V.indexOf(k.keyboardCode,
              d);
            if (-1 !== a && this.r[a].shiftKey[e] === k.shiftKey) {
              g = this.H[a];
              f = !0;
              break
            }
            if (a === this.P.length - 1) {
              a = -1;
              break
            }
            d = a + 1
          } - 1 !== a && f && (this.removeClass(document.getElementById(g), this.Y), this.D = null, this.L = !1, this.Ka())
        }
    };
    this.Ac = function (a) {
      var d, e = 0,
        f, g = 0,
        k = 0,
        h = !1;
      this.Fa = !1;
      if (!this.U() && this.L && 9 !== a.keyCode) {
        d = this.xb(a);
        if (18 === d.keyboardCode || 91 === d.keyboardCode || 16 === d.keyboardCode) d = this.D;
        for (; !h && -1 !== e;) {
          e = this.P.indexOf(d.keyboardCode, k);
          if (-1 !== e && this.r[e].shiftKey[0] === d.shiftKey) {
            f = this.H[e];
            h = !0;
            break
          }
          if (e === this.P.length - 1) {
            e = -1;
            break
          }
          k = e + 1
        }
        h || (g = 1, e = k = 0);
        for (; !h && -1 !== e;) {
          e = this.V.indexOf(d.keyboardCode, k);
          if (-1 !== e && this.r[e].shiftKey[g] === d.shiftKey) {
            f = this.H[e];
            h = !0;
            break
          }
          if (e === this.P.length - 1) break;
          k = e + 1
        }
        h && this.D.hasOwnProperty("keyboardCode") && this.D.keyboardCode === d.keyboardCode && this.D.hasOwnProperty("shiftKey") && this.D.shiftKey === d.shiftKey && this.ta(f) && (a.preventDefault(), this.removeClass(document.getElementById(f), this.Y), this.D = null, this.L = !1, this.Ka())
      }
    };
    this.zc = function (a) {
      var d = -2,
        e = 0,
        f, g = 0,
        k = !1;
      if (this.kb && !this.Fa) {
        for (f = this.xb(a); !k && -1 !== d;) d = this.P.indexOf(f.keyboardCode, g), -1 !== d && this.r[d].shiftKey[e] === f.shiftKey && this.ta(this.H[d]) && (a.preventDefault(), document.onhelp = function () {
          return !1
        }, this.L || this.U() || 16 === a.keyCode || 9 === a.keyCode || (this.D = f, this.addClass(document.getElementById(this.H[d]), this.Y), k = this.Ja(this.ha[d]), this.lb(this.H[d]), this.ia = this.L = !0)), d === this.P.length - 1 ? d = -1 : g = d + 1;
        k || (g = 0, d = -2, e = 1);
        for (; !k && -1 !== d;) d = this.V.indexOf(f.keyboardCode, g),
          -1 !== d && this.r[d].shiftKey[e] === f.shiftKey && this.ta(this.H[d]) && (a.preventDefault(), document.onhelp = function () {
            return !1
          }, this.L || this.U() || 16 === a.keyCode || 9 === a.keyCode || (this.D = f, this.addClass(document.getElementById(this.H[d]), this.Y), this.Ja(this.ha[d]), this.lb(this.H[d]), k = this.ia = this.L = !0)), d === this.P.length - 1 ? d = -1 : g = d + 1
      }
    };
    this.xb = function (a) {
      var d = a.keyCode,
        e = a.shiftKey,
        f = a.key;
      a = a.location;
      switch (d) {
        case 59:
          d = 186;
          break;
        case 61:
          d = 187;
          3 === a && (e = !1);
          break;
        case 96:
          d = 48;
          break;
        case 97:
          d = 49;
          break;
        case 98:
          d = 50;
          break;
        case 99:
          d = 51;
          break;
        case 100:
          d = 52;
          break;
        case 101:
          d = 53;
          break;
        case 102:
          d = 54;
          break;
        case 103:
          d = 55;
          break;
        case 104:
          d = 56;
          break;
        case 105:
          d = 57;
          break;
        case 106:
          d = 56;
          e = !0;
          break;
        case 107:
          d = 187;
          e = !0;
          break;
        case 109:
          d = 189;
          break;
        case 110:
          d = 190;
          break;
        case 111:
          d = 191;
          break;
        case 173:
          d = 189;
          break;
        case 187:
          3 === a && (e = "U+002B" === f ? !0 : !1);
          break;
        case 224:
          d = 91
      }
      return {
        keyboardCode: d,
        shiftKey: e
      }
    };
    this.ta = function (a) {
      return 0 === this.ba.length || -1 === this.ba.toString().indexOf(a)
    };
    this.Cb = function (a) {
      return this.ha.indexOf(a)
    };
    this.wc = function () {
      var a, d, e, f = [],
        g, k = this,
        h, l;
      if (!w) throw Error("Unable to connect with the server, or the requested key mapping file is not available.");
      if (w.split(".").pop() === this.Sa) {
        a = new XMLHttpRequest;
        e = !1;
        d = setTimeout(function () {
          e = !0;
          a.abort();
          throw Error("Unable to connect with the server, or the requested key mapping file is not available.");
        }, 5E3);
        a.open("GET", w, !0);
        a.onreadystatechange = function () {
          if (4 !== a.readyState || e) return !1;
          clearTimeout(d);
          if (200 === a.status) {
            try {
              f = JSON.parse(a.responseText)
            } catch (m) {
              throw Error("The key mapping file is damaged or not a valid key mapping file.");
            }
            0 < f.length && (f.forEach(function (a) {
              g = this.Cb(a.code);
              if (-1 !== g) {
                for (h = 0; 2 > h; h += 1) l = this.P.indexOf(a.keyCode[h]), -1 !== l && this.r[l].shiftKey[0] === a.shiftKey[0] && (delete this.P[l], delete this.r[l].keyCode[0], delete this.r[l].shiftKey[0]), l = this.V.indexOf(a.keyCode[h]), -1 !== l && this.r[l].shiftKey[1] === a.shiftKey[1] && (delete this.V[l], delete this.r[l].keyCode[1], delete this.r[l].shiftKey[1]);
                this.r[g].keyCode = a.keyCode;
                this.P[g] = a.keyCode[0];
                this.V[g] = a.keyCode[1];
                this.r[g].shiftKey = a.shiftKey
              }
            }, k), k.r.forEach(function (a) {
              if (!a.keyCode[0] &&
                !a.keyCode[1]) throw Error("The key " + a.t + " doesn't have a keyboard code associated.");
            }))
          } else if (k = null, 404 === a.status) throw Error("Unable to connect with the server, or the requested key mapping file is not available.");
          k = f = null
        };
        try {
          a.send(null)
        } catch (m) {
          throw Error(m.message);
        }
      } else throw Error("The key mapping file extension must be " + this.Sa);
    };
    this.disableKeys = function (a) {
      var d = typeof a;
      if (this.U()) throw Error("The keys cannot be disabled when the calculator is hidden.");
      "string" == d ? this.rc(a) :
        "object" === d && this.Ab(a)
    };
    this.Ab = function (a) {
      var d;
      a.keys && a.hasOwnProperty("secondKeys") && a.hasOwnProperty("alphaKeys") && a.keys instanceof Array && a.secondKeys instanceof Array && a.alphaKeys instanceof Array && (d = function (a) {
          a = this.Cb(a);
          if (-1 !== a) return this.H[a];
          throw Error("You must provide a valid JSON object or a path to a valid key configuration file.");
        }, this.Ea = a.keys.map(d, this), this.Wa = a.secondKeys.map(d, this), this.Xa = a.alphaKeys.map(d, this), this.Z(this.H, !0), "2nd" !== this.aa && "alpha" !== this.aa &&
        this.Z(this.Ea, !1), "2nd" === this.aa && this.Z(this.Wa, !1), "alpha" === this.aa && this.Z(this.Xa, !1))
    };
    this.rc = function (a) {
      a = a.trim();
      var d = window.location.host,
        e = a.split("/"),
        f;
      if (0 === a.indexOf("http://") || 0 === a.indexOf("https://")) {
        if ("json" === a.split(".").pop()) {
          if (e[2] === d) {
            d = new XMLHttpRequest;
            d.open("GET", a + "?r=" + Math.random(), !1);
            d.send(null);
            if (200 === d.status) {
              try {
                f = JSON.parse(d.responseText), this.Ab(f)
              } catch (g) {
                throw this.enableAllKeys(), Error("You must provide a valid JSON object or a path to a valid key configuration file.");
              }
              return
            }
            throw Error("Unable to connect with the server, or the requested key mapping file is not available.");
          }
          throw Error("The requested file must be in the same server as the TI ExamCalc application");
        }
        throw Error("The key configuration file extension must be .json");
      }
      throw Error("You must provide a non-empty JSON object or a valid URL beginning with http:// or https://");
    };
    this.enableAllKeys = function () {
      if (this.U()) throw Error("The keys cannot be enabled when the calculator is hidden.");
      this.Ea.length =
        0;
      this.Wa.length = 0;
      this.Xa.length = 0;
      this.Z(this.H, !0)
    };
    this.disableAllKeys = function () {
      if (this.U()) throw Error("The keys cannot be disabled when the calculator is hidden.");
      this.Z(this.H, !1)
    };
    this.Ka = function () {
      this.U() || "normal" === this.aa || (this.Z(this.ba, !0), this.Z(this.Ea, !1), this.aa = "normal")
    };
    this.Eb = function () {
      return !0
    };
    this.Ja = function () {
      return !0
    };
    this.Rb = function () {
      this.kb = !0
    };
    this.hasClass = function (a, d) {
      var e = !1;
      void 0 !== a.className.baseVal ? e = -1 < a.className.baseVal.indexOf(d) : void 0 !== a.className &&
        "" !== a.className && (e = -1 < a.className.indexOf(d));
      return e
    };
    this.addClass = function (a, d) {
      this.hasClass(a, d) || (void 0 !== a.classList ? a.classList.add(d) : void 0 !== a.className.baseVal ? a.className.baseVal += " " + d : a.className += " " + d, this.Bb())
    };
    this.removeClass = function (a, d) {
      if (this.hasClass(a, d)) {
        var e = new RegExp("(\\s|^)" + d + "(\\s|$)");
        void 0 !== a.classList ? a.classList.remove(d) : void 0 !== a.className.baseVal && "" !== a.className.baseVal ? a.className.baseVal = a.className.baseVal.replace(e, " ") : void 0 !== a.className &&
          "" !== a.className && (a.className = a.className.replace(e, " "));
        this.Bb()
      }
    };
    this.Jb = function (a) {
      var d;
      void 0 !== a.className.baseVal ? d = a.className.baseVal.split(" ") : void 0 !== a.className && (d = a.className.split(" "));
      for (var e = d.length - 1; 0 <= e; e--) d[e] && 0 === d[e].indexOf("ti_theme_") && this.removeClass(a, d[e])
    };
    this.switchTheme = function (a, d) {
      if (!/[^a-z\d]/i.test(a)) {
        var e = document.getElementById(d),
          f = document.getElementById("display");
        this.Jb(f);
        this.Jb(e);
        void 0 !== a && "" !== a && (a = "ti_theme_" + a, this.addClass(e,
          a), this.addClass(f, a))
      }
    };
    this.U = function () {
      var a = !0,
        d = document.getElementById(u);
      null !== d.offsetParent && (d = window.getComputedStyle(d), "none" !== d.display && "hidden" !== d.visibility && (a = !1));
      return a
    };
    this.Bb = function () {
      if (void 0 !== a) {
        var b = a.Ta.$b();
        "Safari" === b[0] && 0 === b[1].indexOf("7") && (a.hideCalculator(), a.showCalculator())
      }
    }
  };
  D.prototype.Eb = function () {
    this.Sa = "h108keymap"
  };
  var u = "calculatorDiv",
    E, v = "TI108";
  TI108 = function (a, b) {
    this.s = function (a, b) {
      console.log("TI Default Error Handler: " + b)
    };
    this.Ta =
      new y(this);
    this.Ib = this;
    this.Va = new x(this, v);
    this.va = new K(this);
    this.va.dc(a, b)
  };
  TI108.prototype.T = function () {
    var a, b, d;
    this.cb = !1;
    this.la = this.la || new TI108_lcd;
    if (!this.w) {
      this.w = new D;
      try {
        this.w.Db(this)
      } catch (e) {
        this.s(0, e.message)
      }
    }
    d = parseInt(this.da, 10);
    isNaN(d) ? (this.s(0, "Unable to read a key history buffer length value. A value of 100 will be set."), this.w.da = 100) : this.w.da = d;
    this.u ? this.u.T() : this.u = new n;
    this.w.ib(this.u);
    this.la.ib(this.u);
    this.scale || (this.scale = "medium", this.M = document.getElementById(u),
      this.jb());
    this.u.hc(C);
    b = this;
    this.hb = this.hb || 0;
    this.ua = this.ua || null;
    a = function () {
      b.u.m.uc();
      !0 === b.u.m.W && (b.u.m.W = !1, b.la.tc(), b.u.m.Ha && (b.cb = !0, b.w.Rb()));
      b.ua = setTimeout(a, 0)
    };
    if (w) try {
      this.w.wc()
    } catch (f) {
      this.s(0, f.message)
    }
    a()
  };
  TI108.prototype.jb = function () {
    this.Hb = this.M.getBoundingClientRect().width;
    this.Gb = this.M.getBoundingClientRect().height
  };
  TI108.prototype.resetEmulator = function () {
    var a = (new Date).getTime();
    this.K();
    return a > this.hb + 3E3 ? (this.hb = a, this.deleteKeyHistory(), this.Yb(),
      clearTimeout(this.ua), this.u.m.W = !1, this.u.m.Ha = !1, this.T(), !0) : !1
  };
  TI108.prototype.hideCalculator = function () {
    var a = !1,
      b = document.getElementById(u);
    this.K();
    if (b) {
      if ("hidden" === b.style.visibility) return !0;
      b.style.visibility = "hidden";
      window.getComputedStyle ? E = document.defaultView.getComputedStyle(b, null).getPropertyValue("z-index") : b.currentStyle && (E = b.currentStyle["z-index"]);
      b.style.zIndex = -1E3;
      a = !0
    }
    return a
  };
  TI108.prototype.showCalculator = function () {
    var a = !1,
      b = document.getElementById(u);
    this.K();
    if (b) {
      if ("visible" === b.style.visibility) return !0;
      b.style.visibility = "visible";
      b.style.zIndex = E;
      a = !0
    }
    return a
  };
  TI108.prototype.enableAllKeys = function () {
    var a = !0;
    this.K();
    try {
      this.w.enableAllKeys()
    } catch (b) {
      a = !1, this.s(0, b.message)
    }
    return a
  };
  TI108.prototype.disableAllKeys = function () {
    var a = !0;
    this.K();
    try {
      this.w.disableAllKeys()
    } catch (b) {
      a = !1, this.s(0, b.message)
    }
    return a
  };
  TI108.prototype.disableKeys = function (a) {
    var b = !0;
    this.K();
    if (a) try {
      this.w.disableKeys(a)
    } catch (d) {
      b = !1, this.s(0, d.message)
    } else b = !1, this.s(0, "You must provide a non-empty JSON object or a valid URL beginning with http:// or https://");
    return b
  };
  TI108.prototype.resize = function (a) {
    var b = !1,
      d;
    this.K();
    if (void 0 !== this.scale)
      if ("string" === typeof a)
        if (this.w.U()) this.s(0, "The calculator cannot be resized when it is hidden.");
        else {
          a = a.toLowerCase();
          switch (a) {
            case "small":
              d = .75;
              break;
            case "medium":
              d = 1;
              break;
            case "large":
              d = 1.5;
              break;
            case "extra large":
              d = 2;
              break;
            default:
              return this.s(0, "The calculator scale must be specified by its string name representation (small, medium, large or extra large)."),
                b
          }
          0 !== this.Hb && 0 !== this.Gb || this.jb();
          0 < d && (this.scale = a, this.M.style.display = "none", this.M.style.width = this.Hb * d + "px", this.M.style.height = this.Gb * d + "px", this.height = this.M.offsetHeight, this.M.style.display = "block", b = !0)
        }
    else this.s(0, "The calculator scale must be specified by its string name representation (small, medium, large or extra large).");
    else this.s(0, "The calculator cannot be resized while it is loading.");
    return b
  };
  TI108.prototype.getKeyHistory = function () {
    this.K();
    return this.w.cc()
  };
  TI108.prototype.hasBeenUsed = function () {
    var a = !1;
    this.K();
    try {
      void 0 !== this.w && (a = this.w.ia, this.w.ia = !1)
    } catch (b) {
      a = !1, this.s(0, "Cannot determine if the calculator has been used.")
    }
    return a
  };
  TI108.prototype.Yb = function () {
    void 0 !== this.w && (this.w.ia = !1)
  };
  TI108.prototype.deleteKeyHistory = function () {
    var a = !1;
    this.K();
    void 0 !== this.w && (this.w.Xb(), a = !0);
    return a
  };
  TI108.prototype.killInstance = function () {
    this.K();
    this.showCalculator();
    if (this.Va.killInstance()) this.Ib = void 0;
    else return this.s(0, "Unable to destroy the XXX ExamCalc instance.".replace("XXX",
      "TI-108")), this
  };
  TI108.prototype.isInitialized = function () {
    var a = typeof this.cb;
    this.K();
    return "undefined" === a ? !1 : this.cb
  };
  TI108.prototype.getFullPrecisionAnswer = function () {
    this.K();
    return this.la.getFullPrecisionAnswer()
  };
  TI108.prototype.getScreen = function () {
    this.K();
    return this.la.getScreen()
  };
  TI108.prototype.switchFaceplate = function (a) {
    var b = this,
      d = new XMLHttpRequest,
      e, f, g, k, h = !1;
    this.K();
    this.w.U() ? this.s(0, "The faceplate cannot be switched when the calculator is hidden.") : !I(a) || 8 >= a.length ? this.s(0,
      "You must provide a valid URL beginning with http:// or https://") : J(a) ? (d.open("HEAD", a, !0), k = setTimeout(function () {
      h = !0;
      d.abort();
      b.s(0, "Unable to connect with the server, or the requested faceplate is not available.")
    }, b.va.sa), d.onload = function () {
      h || (clearTimeout(k), 200 === this.status ? (g = document.getElementById(v), b.va.Ia(a, !1, 0), e = setInterval(function () {
          f = document.getElementById(v);
          null !== f && f !== g && (b.w.Db(b), b.jb(), b.resize(b.scale), clearInterval(e))
        }, 10)) : 404 !== this.status && 503 !== this.status ||
        b.s(0, "The requested faceplate is not available."))
    }, d.send()) : this.s(0, "The faceplate extension must be svg.")
  };
  TI108.prototype.switchTheme = function (a) {
    this.K();
    this.w.switchTheme(a, v)
  };
  TI108.prototype.getVersion = function () {
    var a = typeof H;
    this.K();
    return "undefined" !== a ? H : "DEV"
  };
  TI108.prototype.isBusy = function () {
    var a = !1;
    this.K();
    if (!1 === this.isInitialized() || !0 === this.u.jc()) a = !0;
    return a
  };
  TI108.prototype.K = function () {
    if (void 0 === this.Ib) throw new ReferenceError("The emulator has been destroyed.");
  };
  var H = "TI-108_HTML5_EMULATOR-2.0.0.65-prd"
})();