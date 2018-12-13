var net;
(function (net) {
    var Login = /** @class */ (function () {
        function Login() {
        }
        Login.loginByCache = function (handle) {
            this.handle = handle;
            if ('android') {
                //Java.loginByCache();
            }
            else if ('ios') {
                //Ios.loginByCache();
            }
        };
        Login.login = function (username, password, handle) {
            this.handle = handle;
            if ('android') {
                //Java.login(username, password);
            }
            else if ('ios') {
                //Ios.login(username, password);
            }
        };
        Login.onLogined = function (userinfo) {
            this.handle.runWith(userinfo);
        };
        Login.handle = null;
        return Login;
    }());
    net.Login = Login;
})(net || (net = {}));
//# sourceMappingURL=Login.js.map