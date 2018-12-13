import WebGL = Laya.WebGL;
import Handler = Laya.Handler;

class Main {
    private atlasRes = ["res/atlas/ui.atlas"];
    constructor() {
        Laya.init(400, 600, WebGL);
        Laya.loader.load(this.atlasRes, Handler.create(this, this.onAtlasResLoaded));
    }

    private onAtlasResLoaded() {
        if (user.LoginData.hasLoginedCacheData()) {
            net.Login.loginByCache(user.LoginMoudle.ins.OnLogin);
        } else {
            view.ViewMgr.ins.openLoginView();
        }
    }
}

new Main();