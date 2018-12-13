var WebGL = Laya.WebGL;
var Handler = Laya.Handler;
var Main = /** @class */ (function () {
    function Main() {
        this.atlasRes = ["res/atlas/ui.atlas"];
        Laya.init(400, 600, WebGL);
        Laya.loader.load(this.atlasRes, Handler.create(this, this.onAtlasResLoaded));
    }
    Main.prototype.onAtlasResLoaded = function () {
        if (user.LoginData.hasLoginedCacheData()) {
            net.Login.loginByCache(user.LoginMoudle.ins.OnLogin);
        }
        else {
            view.ViewMgr.ins.openLoginView();
        }
    };
    return Main;
}());
new Main();
//# sourceMappingURL=Main.js.map