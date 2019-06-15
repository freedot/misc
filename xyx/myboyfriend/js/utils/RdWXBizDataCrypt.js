function t(t, r) {
    this.appId = t, this.sessionKey = r;
}

require("cryptojs/cryptojs.js"), "undefined" != typeof Crypto && Crypto.util || function() {
    var t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", r = "undefined" == typeof window ? exports.Crypto = {} : window.Crypto = {}, o = r.util = {
        rotl: function(t, r) {
            return t << r | t >>> 32 - r;
        },
        rotr: function(t, r) {
            return t << 32 - r | t >>> r;
        },
        endian: function(t) {
            if (t.constructor == Number) return 16711935 & o.rotl(t, 8) | 4278255360 & o.rotl(t, 24);
            for (var r = 0; r < t.length; r++) t[r] = o.endian(t[r]);
            return t;
        },
        randomBytes: function(t) {
            for (var r = []; t > 0; t--) r.push(Math.floor(256 * Math.random()));
            return r;
        },
        bytesToWords: function(t) {
            for (var r = [], o = 0, n = 0; o < t.length; o++, n += 8) r[n >>> 5] |= (255 & t[o]) << 24 - n % 32;
            return r;
        },
        wordsToBytes: function(t) {
            for (var r = [], o = 0; o < 32 * t.length; o += 8) r.push(t[o >>> 5] >>> 24 - o % 32 & 255);
            return r;
        },
        bytesToHex: function(t) {
            for (var r = [], o = 0; o < t.length; o++) r.push((t[o] >>> 4).toString(16)), r.push((15 & t[o]).toString(16));
            return r.join("");
        },
        hexToBytes: function(t) {
            for (var r = [], o = 0; o < t.length; o += 2) r.push(parseInt(t.substr(o, 2), 16));
            return r;
        },
        bytesToBase64: function(r) {
            if ("function" == typeof btoa) return btoa(e.bytesToString(r));
            for (var o = [], n = 0; n < r.length; n += 3) for (var s = r[n] << 16 | r[n + 1] << 8 | r[n + 2], i = 0; i < 4; i++) 8 * n + 6 * i <= 8 * r.length ? o.push(t.charAt(s >>> 6 * (3 - i) & 63)) : o.push("=");
            return o.join("");
        },
        base64ToBytes: function(r) {
            if ("function" == typeof atob) return e.stringToBytes(atob(r));
            r = r.replace(/[^A-Z0-9+\/]/gi, "");
            for (var o = [], n = 0, s = 0; n < r.length; s = ++n % 4) 0 != s && o.push((t.indexOf(r.charAt(n - 1)) & Math.pow(2, -2 * s + 8) - 1) << 2 * s | t.indexOf(r.charAt(n)) >>> 6 - 2 * s);
            return o;
        }
    }, n = r.charenc = {}, e = (n.UTF8 = {
        stringToBytes: function(t) {
            return e.stringToBytes(unescape(encodeURIComponent(t)));
        },
        bytesToString: function(t) {
            return decodeURIComponent(escape(e.bytesToString(t)));
        }
    }, n.Binary = {
        stringToBytes: function(t) {
            for (var r = [], o = 0; o < t.length; o++) r.push(255 & t.charCodeAt(o));
            return r;
        },
        bytesToString: function(t) {
            for (var r = [], o = 0; o < t.length; o++) r.push(String.fromCharCode(t[o]));
            return r.join("");
        }
    });
}(), t.prototype.decryptData = function(t, r) {
    var t = Crypto.util.base64ToBytes(t), o = Crypto.util.base64ToBytes(this.sessionKey), r = Crypto.util.base64ToBytes(r), n = new Crypto.mode.CBC(Crypto.pad.pkcs7);
    try {
        var e = Crypto.AES.decrypt(t, o, {
            asBpytes: !0,
            iv: r,
            mode: n
        }), s = JSON.parse(e);
    } catch (t) {
        console.log(t);
    }
    return s.watermark.appid !== this.appId && console.log("decryptResult.watermark.appid " + s.watermark.appid + "  " + this.appId), 
    s;
}, module.exports = t;