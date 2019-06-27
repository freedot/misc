module ui {
    export class GameBaseView extends View {
        private uiViewCfg: any;
        constructor(uiViewCfg: any) {
            super();
            this.uiViewCfg = uiViewCfg;
        }

        createChildren() {
            super.createChildren();
            this.createView(this.uiViewCfg);
        }
    }
}
