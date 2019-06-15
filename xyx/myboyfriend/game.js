require("./weapp-adapter.js");

var r = require("./js/utils/RdWXBizDataCrypt");

wx.decryptData = function(a, e, t) {
    var c = {};
    try {
        var d = new r("wxce85269ca3e1d1b0", t).decryptData(a, e);
        c.errMsg = "ok", c.data = d, console.log("解密后 retData.data : ", c.data);
    } catch (r) {
        c.errMsg = "fail", c.error = r;
    }
    return c;
};
require("./code.js");