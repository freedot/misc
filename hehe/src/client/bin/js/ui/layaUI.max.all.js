var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var View = laya.ui.View;
var Dialog = laya.ui.Dialog;
var ui;
(function (ui) {
    var loginViewUI = /** @class */ (function (_super) {
        __extends(loginViewUI, _super);
        function loginViewUI() {
            return _super.call(this) || this;
        }
        loginViewUI.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.createView(ui.loginViewUI.uiView);
        };
        loginViewUI.uiView = { "type": "View", "props": { "width": 400, "height": 600 }, "child": [{ "type": "Image", "props": { "top": 0, "skin": "ui/login_bg.png", "sizeGrid": "3,6,3,3", "right": 0, "left": 0, "bottom": 0, "alpha": 1 } }, { "type": "TextInput", "props": { "y": 236, "x": 70, "width": 265, "var": "password", "type": "password", "skin": "ui/textinput.png", "sizeGrid": "12,21,13,15", "name": "password", "height": 40, "fontSize": 22, "color": "#000000", "bold": true } }, { "type": "TextInput", "props": { "y": 183, "x": 70, "width": 265, "var": "email", "type": "email", "skin": "ui/textinput.png", "sizeGrid": "12,21,13,15", "name": "email", "height": 40, "fontSize": 22, "color": "#000000", "bold": true } }, { "type": "Button", "props": { "y": 290, "x": 70, "width": 265, "skin": "ui/button.png", "sizeGrid": "7,15,0,12", "labelSize": 22, "labelColors": "white,blue,white", "label": "登录/注册", "height": 44 } }, { "type": "Image", "props": { "y": 66, "x": 126, "skin": "ui/logo.png" } }] };
        return loginViewUI;
    }(View));
    ui.loginViewUI = loginViewUI;
})(ui || (ui = {}));
//# sourceMappingURL=layaUI.max.all.js.map