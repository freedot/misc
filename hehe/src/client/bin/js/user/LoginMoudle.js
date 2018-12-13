var user;
(function (user) {
    var LoginMoudle = /** @class */ (function () {
        function LoginMoudle() {
            this.OnLogin = Laya.Handler.create(this, this.onLogin);
        }
        LoginMoudle.prototype.onLogin = function (userinfo) {
        };
        LoginMoudle.ins = new LoginMoudle();
        return LoginMoudle;
    }());
    user.LoginMoudle = LoginMoudle;
})(user || (user = {}));
//# sourceMappingURL=LoginMoudle.js.map