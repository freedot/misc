var view;
(function (view) {
    var ViewMgr = /** @class */ (function () {
        function ViewMgr() {
            this.loginView = null;
        }
        ViewMgr.prototype.openLoginView = function () {
            if (this.loginView == null) {
                var loginView_1 = new view.loginView();
                Laya.stage.addChild(loginView_1);
            }
        };
        ViewMgr.ins = new ViewMgr();
        return ViewMgr;
    }());
    view.ViewMgr = ViewMgr;
})(view || (view = {}));
//# sourceMappingURL=ViewMgr.js.map