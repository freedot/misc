module net {
    export class Login {
        private static handle: Handler = null;
        static loginByCache(handle: Handler) {
            this.handle = handle;
            if ('android') {
                //Java.loginByCache();
            } else if ('ios') {
                //Ios.loginByCache();
            }
        }

        static login(username: string, password: string, handle: Handler) {
            this.handle = handle;
            if ('android') {
                //Java.login(username, password);
            } else if ('ios') {
                //Ios.login(username, password);
            }
        }

        private static onLogined(userinfo: any) { // call by android/ios
            this.handle.runWith(userinfo);
        }
    }
}