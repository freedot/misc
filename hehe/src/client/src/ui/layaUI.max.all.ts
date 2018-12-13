
import View=laya.ui.View;
import Dialog=laya.ui.Dialog;
module ui {
    export class loginViewUI extends View {
		public password:Laya.TextInput;
		public email:Laya.TextInput;

        public static  uiView:any ={"type":"View","props":{"width":400,"height":600},"child":[{"type":"Image","props":{"top":0,"skin":"ui/login_bg.png","sizeGrid":"3,6,3,3","right":0,"left":0,"bottom":0,"alpha":1}},{"type":"TextInput","props":{"y":236,"x":70,"width":265,"var":"password","type":"password","skin":"ui/textinput.png","sizeGrid":"12,21,13,15","name":"password","height":40,"fontSize":22,"color":"#000000","bold":true}},{"type":"TextInput","props":{"y":183,"x":70,"width":265,"var":"email","type":"email","skin":"ui/textinput.png","sizeGrid":"12,21,13,15","name":"email","height":40,"fontSize":22,"color":"#000000","bold":true}},{"type":"Button","props":{"y":290,"x":70,"width":265,"skin":"ui/button.png","sizeGrid":"7,15,0,12","labelSize":22,"labelColors":"white,blue,white","label":"登录/注册","height":44}},{"type":"Image","props":{"y":66,"x":126,"skin":"ui/logo.png"}}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.loginViewUI.uiView);

        }

    }
}
