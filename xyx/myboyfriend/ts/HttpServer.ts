wx.cloud.init();

module logic {
    class HttpServer {
        private static _instance: HttpServer = null;
        static Instance(): HttpServer {
            if (null == this._instance) {
                this._instance = new HttpServer()
            }
            return this._instance;
        }

        private openLog: boolean = false;
        private appid: string;
        private openID: string;
        constructor() {
            this.appid = 'myfriend';
            this.openID = '';
        }

        getSessionid() {
            return localStorage.getItem("sessionid");
        }

        getOpenId() {
            return localStorage.getItem("openId");
        }

        //add by qjb [游戏登录]
        login(data: any, onSuccess: Laya.Handler, onFailed: Laya.Handler) {
            wx.cloud.callFunction({
                name: 'loginGame',
                data: data,
                success: res => {
                    localStorage.setItem("sessionid", res.result.sessionid);
                    localStorage.setItem("openId", res.result.openId);
                    localStorage.setItem("session_key", res.result.wxSessionkey);
                    HttpServer.Instance().openID = res.result.openId;

                    if (onSuccess && onSuccess.method)
                        onSuccess.method.apply(onSuccess.caller, [res]);
                },
                fail: err => {
                    console.error('login game failed with error', err)
                    if (onFailed && onFailed.method)
                        onFailed.method.apply(onFailed.caller, [err]);
                }
            });
        }

        saveUserData(playInfo: any, onSaved: Laya.Handler) {
            var info = playInfo;
            info.userid = this.getSessionid();
            info.openId = this.getOpenId();

            wx.cloud.callFunction({
                name: 'savePlayerInfo',
                data: info,
                success: res => {
                    console.log("save user info success ");
                    if (onSaved) onSaved.run();
                },
                fail: err => {
                    console.error('save user info failed with error', err)
                }
            });
        }

        //add by qjb 保存邀请者，给他对应的邀请者奖励
        saveInvitePlayer() {
            if (void 0 == logic.WeChat.onShowQuery || null == logic.WeChat.onShowQuery)
                return;

            try {
                var shareQuery = logic.WeChat.onShowQuery;
                var openId = this.getOpenId();
                if ("" == openId)
                    return;

                if (shareQuery.shareuser == openId)
                    return;

                var player = asgard.module.ModuleManager.getModule(logic.MODULE_PLAYER) as PlayerModule;
                var saveData = { shareuser: '', openId: '', prop: '', nickName: '', avatar_url: '' };
                saveData.shareuser = shareQuery.shareuser;
                saveData.openId = openId;
                saveData.prop = shareQuery.prop;
                saveData.nickName = player.Player.nickName;
                saveData.avatar_url = player.Player.avatarUrl;

                wx.cloud.callFunction({
                    name: 'saveInvitePlayer',
                    data: saveData,
                    success: res => {
                        console.log("save invite player success");
                    },
                    fail: err => {
                        console.error('save user info failed with error', err)
                    }
                });
            } catch (e) {
                console.error(e);
            }
        }

        invitePlayerQuery(onResult: Laya.Handler) {
            var userInfo = { userid: '', openId: '' };
            userInfo.userid = this.getSessionid();
            userInfo.openId = this.getOpenId();

            wx.cloud.callFunction({
                name: 'invitePlayerQuery',
                data: userInfo,
                success: res => {
                    console.log("save invite player success");
                    // result.inviteUser = [
                    //    {fopen_id: string, isDraw: number, shareType: number}
                    //]
                    onResult && onResult.method && onResult.method.apply(onResult.caller, [res.result]);
                },
                fail: err => {
                    console.error('save user info failed with error', err)
                }
            });
        }

        updateFriendDraw(shareuser: string, onUpdated: Laya.Handler) {
            var postInfo = { shareuser: shareuser, openId: this.getOpenId() };
            console.log("update friend draw", postInfo);

            wx.cloud.callFunction({
                name: 'updateFriendDraw',
                data: postInfo,
                success: res => {
                    console.log("update friend draw success");
                    // result.shareuser
                    onUpdated.method.apply(onUpdated.caller, [res.result]);
                },
                fail: err => {
                    console.error('update friend draw failed with error', err)
                }
            });
        }

        queryLuckWheel(onResult: Laya.Handler) {
            var userInfo = { userid: this.getSessionid(), openId: this.getOpenId() };
            console.log("query luck wheel", userInfo);

            wx.cloud.callFunction({
                name: 'queryLuckWheel',
                data: userInfo,
                success: res => {
                    console.log("query luck wheel success");
                    // result.luckUpTime
                    // result.luckCount
                    // result.luckShareCount
                    onResult.method.apply(onResult.caller, [res.result])
                },
                fail: err => {
                    console.error('query luck wheel failed with error', err)
                }
            });
        }

        postLuckWheel(luckCount: number, luckShareCount: number, luckUpTime: number) {
            var luckwheelData = {
                userid: this.getSessionid(),
                openId: this.getOpenId(),
                luckCount: luckCount,
                luckShareCount: luckShareCount,
                luckUpTime: luckUpTime
            };

            wx.cloud.callFunction({
                name: 'saveLuckWheel',
                data: luckwheelData,
                success: res => {
                    console.log("save luck wheel success");
                },
                fail: err => {
                    console.error('save luck wheel failed with error', err)
                }
            });
        }

        //---- 以下为日志接口 ----//
        startLog(log: string) {
            if (!this.openLog) return;

            var openId = this.getOpenId();
            var logmsg = logic.GameConst.REPORT_URL + "?appid=" + this.appid + "&openid=" + openId + "&channel=" + log + "&event=start";
            console.log("startLog " + logmsg);
            var req = new Laya.HttpRequest();
            req.http.timeout = 1e4;
            req.once(Laya.Event.COMPLETE, null, function (t) {
                console.error("startLog success ", t);
            });
            req.once(Laya.Event.ERROR, null, function (t) {
                console.error("startLog error ", t);
            });
            req.send(logmsg, null, "post", "text", ["Content-Type", "application/json"]);
        }

        registLog(log: string) {
            if (!this.openLog) return;

            var openId = this.getOpenId();
            var logmsg = logic.GameConst.REPORT_URL + "?appid=" + this.appid + "&openid=" + openId + "&channel=" + log + "&event=register";
            console.log("registLog " + logmsg);
            var req = new Laya.HttpRequest();
            req.http.timeout = 1e4, req.once(Laya.Event.COMPLETE, null, function (t) {
                console.error("registLog success ", t);
            });

            req.once(Laya.Event.ERROR, null, function (t) {
                console.error("registLog error ", t);
            });

            req.send(logmsg, null, "post", "text", ["Content-Type", "application/json"]);
        }

        shareCountLog(shareid: string) {
            if (!this.openLog) return;

            var req = new Laya.HttpRequest();
            req.http.timeout = 1e4, req.once(Laya.Event.COMPLETE, null, function (t) {
                console.log("post shareid", t);
            });
            req.once(Laya.Event.ERROR, null, function (t) {
                console.log("post shareid error ", t);
            });
            var logmsg = JSON.stringify({
                shareId: shareid
            });
            req.send(logic.GameConst.SHARE_COUNT_URL, logmsg, "post", "json", ["Content-Type", "application/json"]);
        }

        loginErrorLog(err: string) {
            if (!this.openLog) return;

            var req = new Laya.HttpRequest();
            req.http.timeout = 1e4;

            err = "openId:" + localStorage.getItem("openId") + err;
            req.once(Laya.Event.COMPLETE, null, function (t) {
                console.log("loginErrorLog", t);
            });
            req.once(Laya.Event.ERROR, null, function (t) {
                console.log("loginErrorLog error ", t);
            });
            var errmsg = JSON.stringify({
                error: err
            });
            req.send(logic.GameConst.SHARE_COUNT_URL, errmsg, "post", "json", ["Content-Type", "application/json"]);
        }

        errorLog(err: any) {
            if (!this.openLog) return;

            var req = new Laya.HttpRequest();
            req.http.timeout = 1e4, req.once(Laya.Event.COMPLETE, null, function (t) {
                console.log("loginErrorLog", t);
            });

            req.once(Laya.Event.ERROR, null, function (t) {
                console.log("loginErrorLog error ", t);
            });

            err.gameVersion = logic.GameConst.VERSION;
            err.openid = this.getOpenId();
            var errmsg = JSON.stringify(err);
            req.send(logic.GameConst.SHARE_COUNT_URL, errmsg, "post", "json", ["Content-Type", "application/json"]);
        }

    }
}
