var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BaseDlg = require('../gui/basedlg');
var HeroDlg = (function (_super) {
    __extends(HeroDlg, _super);
    function HeroDlg() {
        _super.apply(this, arguments);
    }
    HeroDlg.prototype._getDlgCfg = function () {
        return {};
    };
    return HeroDlg;
})(BaseDlg);
exports.HeroDlg = HeroDlg;
//# sourceMappingURL=herodlg.js.map