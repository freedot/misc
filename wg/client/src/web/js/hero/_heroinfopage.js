var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ut = require("../tools/tsunit/tsunit");
var herodlg = require("./herodlg");
var MyTestCase = (function (_super) {
    __extends(MyTestCase, _super);
    function MyTestCase(g) {
        _super.call(this);
        this._g = null;
        this._g = g;
    }
    MyTestCase.prototype.setUp = function () {
        this._dlg = new herodlg.HeroDlg(this._g);
        //this._dlg.openDlg();
    };
    MyTestCase.prototype.tearDown = function () {
    };
    MyTestCase.prototype.test_ok = function () {
        ut.areEqual(1, 1, 'ok');
    };
    MyTestCase.prototype.test_faild = function () {
        ut.areEqual(0, 1, 'unit test failed');
    };
    return MyTestCase;
})(ut.Case);
exports.MyTestCase = MyTestCase;
//# sourceMappingURL=_heroinfopage.js.map