var t = function(t) {
    return (t = t.toString())[1] ? t : "0" + t;
};

module.exports = {
    formatTime: function(e) {
        var n = e.getFullYear(), o = e.getMonth() + 1, s = e.getDate(), i = e.getHours(), r = e.getMinutes(), u = e.getSeconds();
        return [ n, o, s ].map(t).join("/") + " " + [ i, r, u ].map(t).join(":");
    },
    showBusy: function(t) {
        return wx.showToast({
            title: t,
            icon: "loading",
            duration: 1e4
        });
    },
    showSuccess: function(t) {
        return wx.showToast({
            title: t,
            icon: "success"
        });
    },
    showModel: function(t, e) {
        wx.hideToast(), wx.showModal({
            title: t,
            content: JSON.stringify(e),
            showCancel: !1
        });
    },
    getSDKVersion: function(t) {
        return t ? (t.length < 6 && (t += "0"), t = parseInt(t.replace(/\./g, ""))) : t = 0, 
        t;
    }
};