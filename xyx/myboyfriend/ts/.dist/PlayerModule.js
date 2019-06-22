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
var logic;
(function (logic) {
    var PlayerModule = (function (_super) {
        __extends(PlayerModule, _super);
        function PlayerModule() {
            var _this = _super.call(this) || this;
            _this._isModify = false;
            _this._moduleId = logic.MODULE_PLAYER;
            _this._player = new logic.PlayerInfo();
            _this._reset();
            asgard.events.EventsDispatcher.registerEventListener(logic.GameEvents.EVENT_GAME_ONHIDE, _this, _this._reset);
            _this.testData();
            return _this;
        }
        Object.defineProperty(PlayerModule.prototype, "dbVersion", {
            get: function () {
                return this._dbVersion;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerModule.prototype, "Player", {
            get: function () {
                return this._player;
            },
            enumerable: true,
            configurable: true
        });
        PlayerModule.prototype.isGuideOver = function () {
            return this.guideStep >= logic.GuidePanel.guideSteps.length;
        };
        PlayerModule.prototype._reset = function () {
            this._player.reset();
            this.guideStep = 0;
            this.ConnectTime = 0;
            this.isNewPlayer = false;
            this.SpeedUpEndTime = 0;
            this._dbVersion = -1;
            this.Player.turnRound = 0;
            console.log("playermodule reset");
        };
        PlayerModule.prototype.doFly = function () {
            this._player.reset(true);
            this.modifyConfig();
            this._dbVersion++;
            this.Player.turnRound++;
            console.log("playermodule doFly");
        };
        PlayerModule.prototype.testData = function () {
            Laya.Browser.onMiniGame || (this._player.Coin = 1e22, this._player.Diamon = 1e9,
                this._player.nickName = "abasdf", this._player.luckyCount = 5, this.Player.luckyShareCount = 0,
                this.guideStep = 4);
        };
        PlayerModule.prototype.onGameInit = function (serverData) {
            console.error("player dbVersion", serverData.dbVersion);
            this.ConnectTime = serverData.timestamp;
            this.offLineTime = serverData.offlineTime;
            var e = 0;
            var i = 0;
            if (this._dbVersion = serverData.dbVersion, e = Number(serverData.coin), i = Number(serverData.diamon), this._player.Coin = e,
                this._player.Diamon = i, this._player.luckyCount = serverData.luckyCount ? serverData.luckyCount : 0,
                this._player.luckyShareCount = serverData.luckyShareCount ? serverData.luckyShareCount : 0, this._player.luckyUpTime = serverData.luckyUpTime ? serverData.luckyShareCount : 0,
                this._player.Speed = serverData.speed, this.isNewPlayer = serverData.isNewPlayer, this.SpeedUpEndTime = serverData.upStartTime,
                this.ConnectTime > serverData.upStartTime) {
                this._player.addSpeedTime(-1);
            }
            else {
                var n = Math.floor(.001 * (serverData.upStartTime - this.ConnectTime));
                this._player.addSpeedTime(n);
            }
            this.guideStep = serverData.guideStep, this._player.loginDays = serverData.loginDays, this._player.loginRewardDays = serverData.loginRewardDays,
                this._player.lastLoginTime = serverData.lastLoginTime, this.Player.shareCoinCount = serverData.shareCoinNum,
                this.Player.shareDiamonCount = serverData.shareDiamonNum, this.Player.turnRound = serverData.isFly,
                this.modifyConfig();
        };
        PlayerModule.prototype.showBox = function () {
            asgard.events.EventsDispatcher.eventNotify(logic.GameEvents.EVENT_SHOW_BOX);
        };
        PlayerModule.prototype.hideBox = function () {
            asgard.events.EventsDispatcher.eventNotify(logic.GameEvents.EVENT_HIDE_BOX), Laya.timer.once(9e4, this, this.showBox);
        };
        PlayerModule.prototype.getLoginReward = function (e) {
            this._player.loginRewardDays += 1;
            this._player.showReward(logic.PlayerInfo.REWARD_TYPE_DIAMON, e, logic.UIPanelID.LOGINDAY),
                asgard.events.EventsDispatcher.eventNotify(logic.GameEvents.EVENT_UPDATE_LOGIN_REWARD);
        };
        PlayerModule.prototype.openLuckWheel = function () {
            logic.HttpServer.Instance().queryLuckWheel(Laya.Handler.create(this, this._onLuckWheelData));
        };
        PlayerModule.prototype._onLuckWheelData = function (e) {
            var i = new Date(this._player.luckyUpTime);
            var n = new Date(Number(e.luckUpTime));
            if (i.toDateString() != n.toDateString()) {
                this._player.luckyCount = Number(e.luckCount);
                this._player.luckyShareCount = Number(e.luckShareCount), this._player.luckyUpTime = Number(e.luckUpTime);
            }
            console.log("_onLuckWheelData", e);
            asgard.ui.UIManager.openView(logic.UIPanelID.LUCKYWHEEL);
        };
        PlayerModule.prototype.addLuckyTickets = function () {
            this.Player.luckyCount += 5;
            this.Player.luckyShareCount += 1;
            asgard.events.EventsDispatcher.eventNotify(logic.GameEvents.EVENT_UPDATE_LUCKY_TICKETS);
        };
        PlayerModule.prototype.modifyConfig = function () {
            if (this.Player.turnRound > 0 && !this._isModify) {
                this._isModify = true;
                for (var t = asgard.data.StaticDataManager.getSheetDatas(data.Post.DATA_TYPE), e = 0; e < t.length; e++) {
                    var i = t[e];
                    i && (i.Produce = Math.floor(2 * i.Produce), i.Offline = Math.floor(2 * i.Offline));
                }
            }
        };
        return PlayerModule;
    }(asgard.module.BaseModule));
    logic.PlayerModule = PlayerModule;
})(logic || (logic = {}));
//# sourceMappingURL=PlayerModule.js.map