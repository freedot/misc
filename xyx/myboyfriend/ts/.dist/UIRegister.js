var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var ui;
(function (ui) {
    var GameBaseView = (function (_super) {
        __extends(GameBaseView, _super);
        function GameBaseView(uiViewCfg) {
            var _this = _super.call(this) || this;
            _this.uiViewCfg = uiViewCfg;
            return _this;
        }
        GameBaseView.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.createView(this.uiViewCfg);
        };
        return GameBaseView;
    }(ui.View));
    ui.GameBaseView = GameBaseView;
})(ui || (ui = {}));
//# sourceMappingURL=UIRegister.js.map