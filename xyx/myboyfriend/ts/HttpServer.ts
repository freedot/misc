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
            this.appid = 'wydhs';
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
            HttpPost("/Emperor/wxuserinfo/loginIn", data, Laya.Handler.create(null, function (result) {
                console.log("loginIn object ", result);
                if (200 == Number(result.code)) {
                    localStorage.setItem("sessionid", result.sessionid);
                    localStorage.setItem("openId", result.openId);
                    localStorage.setItem("session_key", result.wxSessionkey);
                    HttpServer.Instance().openID = result.openId;

                    if (onSuccess && onSuccess.method)
                        onSuccess.method.apply(onSuccess.caller, [result]);
                } else {
                    if (onFailed && onFailed.method)
                        onFailed.method.apply(onFailed.caller, [result]);
                }
            }), Laya.Handler.create(null, function (result) {
                if (onFailed && onFailed.method)
                    onFailed.method.apply(onFailed.caller, [result]);
            }));
        }

        saveUserData(playInfo: any, onSaved: Laya.Handler) {
            var info = playInfo;
            info.userid = this.getSessionid();
            info.openId = this.getOpenId();
            HttpPost("/Emperor/user/saveUserData", info, Laya.Handler.create(null, function (result) {
                if (200 == Number(result.code)) {
                    console.error("SaveUserData success ");
                    if (onSaved) onSaved.run();
                } else {
                    console.error("SaveUserData fail ", result);
                    logic.GameData.Instance().getGameDataWhenError();
                }
            }), Laya.Handler.create(null, function (result) {
                console.error("SaveUserData fail ", result);
            }));
        }

        //add by qjb 保存邀请者，给他对应的邀请者奖励
        saveInvitePlayer() {
            if (void 0 != logic.WeChat.onShowQuery && null != logic.WeChat.onShowQuery)
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

                    HttpPost("/Emperor/wxuserinfo/invitePlayer", saveData, Laya.Handler.create(null, function (result) {
                        if (200 == Number(result.code)) {
                            console.error("SaveInvitePlayer success ")
                        } else {
                            console.error("SaveInvitePlayer fail ", result, saveData);
                        }
                    }), Laya.Handler.create(null, function (t) {
                        console.error("SaveInvitePlayer fail ", t, saveData);
                    }));
                } catch (e) {
                    console.error(e);
                }
        }

        invitePlayerQuery(onResult: Laya.Handler) {
            var userInfo = { userid: '', openId: '' };
            userInfo.userid = this.getSessionid();
            userInfo.openId = this.getOpenId();

            HttpPost("/Emperor/wxuserinfo/invitePlayerQuery", userInfo, Laya.Handler.create(null, function (result) {
                if (200 == Number(result.code)) {
                    // result.inviteUser = [
                    //    {fopen_id: string, isDraw: number, shareType: number}
                    //]
                    onResult && onResult.method && onResult.method.apply(onResult.caller, [result]);
                }
                else {
                    console.error("invitePlayerQuery fail ", result);
                }
            }), Laya.Handler.create(null, function (result) {
                console.error("invitePlayerQuery fail ", result);
            }));
        }

        updateFriendDraw(shareuser: string, onUpdated: Laya.Handler) {
            var postInfo = { shareuser: shareuser, openId: this.getOpenId() };
            console.log("updateFriendDraw", postInfo);

            HttpPost("/Emperor/wxuserinfo/invitePlayerUpdate", postInfo, Laya.Handler.create(null, function (result) {
                if (200 == Number(result.code)) {
                    console.error("updateFriendDraw success ");
                    // result.shareuser
                    onUpdated.method.apply(onUpdated.caller, [result]);
                } else {
                    console.error("updateFriendDraw fail ", result);
                }
            }), Laya.Handler.create(null, function (result) {
                console.error("updateFriendDraw fail ", result);
            }));
        }

        queryLuckWheel(onResult: Laya.Handler) {
            var userInfo = { userid: this.getSessionid(), openId: this.getOpenId() };
            console.log("queryLuckWheel", userInfo);

            HttpPost("/Emperor/wxuserinfo/playerLuckQuery", userInfo, Laya.Handler.create(null, function (result) {
                if (200 == Number(result.code)) {
                    // result.luckUpTime
                    // result.luckCount
                    // result.luckShareCount
                    onResult.method.apply(onResult.caller, [result])
                } else {
                    console.error("queryLuckWheel fail ", result);
                }
            }), Laya.Handler.create(null, function (t) {
                console.error("queryLuckWheel fail ", t);
            }));
        }

        postLuckWheel(luckCount: number, luckShareCount: number, luckUpTime: number) {
            var luckwheelData = {
                userid: this.getSessionid(),
                openId: this.getOpenId(),
                luckCount: luckCount,
                luckShareCount: luckShareCount,
                luckUpTime: luckUpTime
            };

            HttpPost("/Emperor/wxuserinfo/playerLuckUpdate", luckwheelData, Laya.Handler.create(null, function (result) {
                if (200 == Number(result.code)) {
                    console.error("postLuckWheel succeed");
                }
                else {
                    console.error("postLuckWheel fail ", result);
                }
            }), Laya.Handler.create(null, function (result) {
                console.error("postLuckWheel fail ", result);
            }));
        }

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
