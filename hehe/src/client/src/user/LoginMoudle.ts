module user {
    export class LoginMoudle {
        static ins: LoginMoudle = new LoginMoudle();
        OnLogin = Laya.Handler.create(this, this.onLogin);
        onLogin(userinfo: any) {
            
        }
    }
}