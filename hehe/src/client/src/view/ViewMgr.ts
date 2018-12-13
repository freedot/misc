module view {
    export class ViewMgr {
        public static ins: ViewMgr = new ViewMgr();

        private loginView: view.loginView = null;
        public openLoginView() {
            if (this.loginView == null) {
                let loginView = new view.loginView();
                Laya.stage.addChild(loginView);
            }
        }
    }
}