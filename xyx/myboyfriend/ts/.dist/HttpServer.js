wx.cloud.init();
var logic;
(function (logic) {
    var HttpServer = (function () {
        function HttpServer() {
            this.openLog = false;
            this.appid = 'myfriend';
            this.openID = '';
        }
        HttpServer.Instance = function () {
            if (null == this._instance) {
                this._instance = new HttpServer();
            }
            return this._instance;
        };
        HttpServer.prototype.getSessionid = function () {
            return localStorage.getItem("sessionid");
        };
        HttpServer.prototype.getOpenId = function () {
            return localStorage.getItem("openId");
        };
        HttpServer.prototype.login = function (data, onSuccess, onFailed) {
            wx.cloud.callFunction({
                name: 'loginGame',
                data: data,
                success: function (res) {
                    localStorage.setItem("sessionid", res.result.sessionid);
                    localStorage.setItem("openId", res.result.openId);
                    localStorage.setItem("session_key", res.result.wxSessionkey);
                    HttpServer.Instance().openID = res.result.openId;
                    if (onSuccess && onSuccess.method)
                        onSuccess.method.apply(onSuccess.caller, [res]);
                },
                fail: function (err) {
                    console.error('login game failed with error', err);
                    if (onFailed && onFailed.method)
                        onFailed.method.apply(onFailed.caller, [err]);
                }
            });
        };
        HttpServer.prototype.saveUserData = function (playInfo, onSaved) {
            var info = playInfo;
            info.userid = this.getSessionid();
            info.openId = this.getOpenId();
            wx.cloud.callFunction({
                name: 'savePlayerInfo',
                data: info,
                success: function (res) {
                    console.log("save user info success ");
                    if (onSaved)
                        onSaved.run();
                },
                fail: function (err) {
                    console.error('save user info failed with error', err);
                }
            });
        };
        HttpServer.prototype.saveInvitePlayer = function () {
            if (void 0 == logic.WeChat.onShowQuery || null == logic.WeChat.onShowQuery)
                return;
            try {
                var shareQuery = logic.WeChat.onShowQuery;
                var openId = this.getOpenId();
                if ("" == openId)
                    return;
                if (shareQuery.shareuser == openId)
                    return;
                var player = asgard.module.ModuleManager.getModule(logic.MODULE_PLAYER);
                var saveData = { shareuser: '', openId: '', prop: '', nickName: '', avatar_url: '' };
                saveData.shareuser = shareQuery.shareuser;
                saveData.openId = openId;
                saveData.prop = shareQuery.prop;
                saveData.nickName = player.Player.nickName;
                saveData.avatar_url = player.Player.avatarUrl;
                wx.cloud.callFunction({
                    name: 'saveInvitePlayer',
                    data: saveData,
                    success: function (res) {
                        console.log("save invite player success");
                    },
                    fail: function (err) {
                        console.error('save user info failed with error', err);
                    }
                });
            }
            catch (e) {
                console.error(e);
            }
        };
        HttpServer.prototype.invitePlayerQuery = function (onResult) {
            var userInfo = { userid: '', openId: '' };
            userInfo.userid = this.getSessionid();
            userInfo.openId = this.getOpenId();
            wx.cloud.callFunction({
                name: 'invitePlayerQuery',
                data: userInfo,
                success: function (res) {
                    console.log("save invite player success");
                    onResult && onResult.method && onResult.method.apply(onResult.caller, [res.result]);
                },
                fail: function (err) {
                    console.error('save user info failed with error', err);
                }
            });
        };
        HttpServer.prototype.updateFriendDraw = function (shareuser, onUpdated) {
            var postInfo = { shareuser: shareuser, openId: this.getOpenId() };
            console.log("update friend draw", postInfo);
            wx.cloud.callFunction({
                name: 'updateFriendDraw',
                data: postInfo,
                success: function (res) {
                    console.log("update friend draw success");
                    onUpdated.method.apply(onUpdated.caller, [res.result]);
                },
                fail: function (err) {
                    console.error('update friend draw failed with error', err);
                }
            });
        };
        HttpServer.prototype.queryLuckWheel = function (onResult) {
            var userInfo = { userid: this.getSessionid(), openId: this.getOpenId() };
            console.log("query luck wheel", userInfo);
            wx.cloud.callFunction({
                name: 'queryLuckWheel',
                data: userInfo,
                success: function (res) {
                    console.log("query luck wheel success");
                    onResult.method.apply(onResult.caller, [res.result]);
                },
                fail: function (err) {
                    console.error('query luck wheel failed with error', err);
                }
            });
        };
        HttpServer.prototype.postLuckWheel = function (luckCount, luckShareCount, luckUpTime) {
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
                success: function (res) {
                    console.log("save luck wheel success");
                },
                fail: function (err) {
                    console.error('save luck wheel failed with error', err);
                }
            });
        };
        HttpServer.prototype.startLog = function (log) {
            if (!this.openLog)
                return;
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
        };
        HttpServer.prototype.registLog = function (log) {
            if (!this.openLog)
                return;
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
        };
        HttpServer.prototype.shareCountLog = function (shareid) {
            if (!this.openLog)
                return;
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
        };
        HttpServer.prototype.loginErrorLog = function (err) {
            if (!this.openLog)
                return;
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
        };
        HttpServer.prototype.errorLog = function (err) {
            if (!this.openLog)
                return;
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
        };
        HttpServer._instance = null;
        return HttpServer;
    }());
})(logic || (logic = {}));
//# sourceMappingURL=HttpServer.js.map