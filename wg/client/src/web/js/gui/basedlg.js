///<reference path="../com/o.d.ts"/>
///<reference path="ui.d.ts"/>
var caller = require('../com/caller');
var BaseDlg = (function () {
    function BaseDlg(g, dlgName, openListener) {
        this._g = null;
        this._imgr = null;
        this._dlg = null;
        this._items = {};
        this._params = null;
        this._dlgName = '';
        this._openListener = null;
        this._g = g;
        this._dlgName = dlgName ? dlgName : '';
        this._openListener = openListener ? openListener : new caller.NullCaller;
        this._imgr = this._g.getImgr();
        this._init();
    }
    BaseDlg.prototype.openDlg = function (params) {
        this._initParams(params);
        if (!this._isCanOpen())
            return;
        this._initDlg();
        this._showDlg();
        this._initInfo();
        this._openListener.invoke(this._dlgName);
    };
    BaseDlg.prototype.hideDlg = function () {
        if (this._dlg) {
            this._dlg.hide();
        }
    };
    BaseDlg.prototype.isShow = function () {
        if (!this._dlg)
            return false;
        return this._dlg.isShow();
    };
    BaseDlg.prototype._initParams = function (params) {
        this._params = params;
    };
    BaseDlg.prototype._initDlg = function () {
        if (this._dlg)
            return;
        this._createDlg();
        this._afterCreate();
        this._setCallers();
    };
    BaseDlg.prototype._createDlg = function () {
        var dlgCfg = this._getDlgCfg();
        dlgCfg.uiback = dlgCfg.uiback ? dlgCfg.uiback : null;
        this._dlg = Dialog.snew(this._g, {
            modal: dlgCfg.modal,
            title: dlgCfg.title,
            uiback: dlgCfg.uiback,
            btns: dlgCfg.btns,
            pos: dlgCfg.pos });
        this._g.getGUI().initDlg(this._dlg, dlgCfg.uicfg, this._items);
    };
    BaseDlg.prototype._showDlg = function () {
        this._dlg.show();
    };
    /* for test */
    BaseDlg.prototype.getItems = function () { return this._items; };
    BaseDlg.prototype.getParams = function () { return this._params; };
    BaseDlg.prototype.getCoreDlg = function () { return this._dlg; };
    /* for sub class */
    BaseDlg.prototype._init = function () { };
    ;
    BaseDlg.prototype._isCanOpen = function () { return true; };
    BaseDlg.prototype._getDlgCfg = function () { };
    BaseDlg.prototype._afterCreate = function () { };
    BaseDlg.prototype._setCallers = function () { };
    BaseDlg.prototype._initInfo = function () { };
    return BaseDlg;
})();
module.exports = BaseDlg;
//# sourceMappingURL=basedlg.js.map