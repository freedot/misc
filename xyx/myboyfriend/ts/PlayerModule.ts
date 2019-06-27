module logic {
    export class PlayerModule extends asgard.module.BaseModule {
        private _isModify: boolean;
        private _moduleId: number;
        private _player: PlayerInfo;
        private _dbVersion: number;
        private guideStep: number;
        private ConnectTime: number;
        private isNewPlayer: boolean;
        private SpeedUpEndTime: number;
        private offLineTime: number;

        constructor() {
            super();
            this._isModify = false;
            this._moduleId = logic.MODULE_PLAYER;
            this._player = new logic.PlayerInfo();
            this._reset();
            asgard.events.EventsDispatcher.registerEventListener(logic.GameEvents.EVENT_GAME_ONHIDE, this, this._reset);
            this.testData();
        }

        get dbVersion() {
            return this._dbVersion;
        }

        get Player() {
            return this._player;
        }

        isGuideOver() {
            return this.guideStep >= logic.GuidePanel.guideSteps.length;
        }

        _reset() {
            this._player.reset();
            this.guideStep = 0;
            this.ConnectTime = 0;
            this.isNewPlayer = false;
            this.SpeedUpEndTime = 0;
            this._dbVersion = -1;
            this.Player.turnRound = 0;
            console.log("playermodule reset");
        }

        doFly() {
            this._player.reset(true);
            this.modifyConfig();
            this._dbVersion++;
            this.Player.turnRound++;
            console.log("playermodule doFly");
        }

        testData() {
            Laya.Browser.onMiniGame || (this._player.Coin = 1e22, this._player.Diamon = 1e9,
                this._player.nickName = "abasdf", this._player.luckyCount = 5, this.Player.luckyShareCount = 0,
                this.guideStep = 4);
        }

        onGameInit(serverData) {
            console.log("player dbVersion", serverData.dbVersion);
            this.ConnectTime = serverData.timestamp;
            this.offLineTime = serverData.offlineTime;

            this._dbVersion = serverData.dbVersion;
            this._player.Coin = serverData.coin;
            this._player.Diamon = serverData.diamon;
            this._player.luckyCount = serverData.luckyCount ? serverData.luckyCount : 0;
            this._player.luckyShareCount = serverData.luckyShareCount ? serverData.luckyShareCount : 0;
            this._player.luckyUpTime = serverData.luckyUpTime ? serverData.luckyUpTime : 0;
            this._player.Speed = serverData.speed;
            this.isNewPlayer = serverData.isNewPlayer;
            this.SpeedUpEndTime = serverData.upStartTime;

            if (this.ConnectTime > serverData.upStartTime) {
                this._player.addSpeedTime(-1);
            } else {
                var n = Math.floor(.001 * (serverData.upStartTime - this.ConnectTime));
                this._player.addSpeedTime(n);
            }
            this.guideStep = serverData.guideStep, this._player.loginDays = serverData.loginDays, this._player.loginRewardDays = serverData.loginRewardDays,
                this._player.lastLoginTime = serverData.lastLoginTime, this.Player.shareCoinCount = serverData.shareCoinNum,
                this.Player.shareDiamonCount = serverData.shareDiamonNum, this.Player.turnRound = serverData.isFly,
                this.modifyConfig();
        }

        showBox() {
            asgard.events.EventsDispatcher.eventNotify(logic.GameEvents.EVENT_SHOW_BOX);
        }

        hideBox() {
            asgard.events.EventsDispatcher.eventNotify(logic.GameEvents.EVENT_HIDE_BOX), Laya.timer.once(9e4, this, this.showBox);
        }

        getLoginReward(e) {
            this._player.loginRewardDays += 1;
            this._player.showReward(logic.PlayerInfo.REWARD_TYPE_DIAMON, e, logic.UIPanelID.LOGINDAY),
                asgard.events.EventsDispatcher.eventNotify(logic.GameEvents.EVENT_UPDATE_LOGIN_REWARD);
        }

        openLuckWheel() {
            logic.HttpServer.Instance().queryLuckWheel(Laya.Handler.create(this, this._onLuckWheelData));
        }

        _onLuckWheelData(e) {
            var i = new Date(this._player.luckyUpTime);
            var n = new Date(Number(e.luckUpTime));
            if (i.toDateString() != n.toDateString()) {
                this._player.luckyCount = Number(e.luckCount);
                this._player.luckyShareCount = Number(e.luckShareCount), this._player.luckyUpTime = Number(e.luckUpTime);
            }
            console.log("_onLuckWheelData", e);
            asgard.ui.UIManager.openView(logic.UIPanelID.LUCKYWHEEL);
        }

        addLuckyTickets() {
            this.Player.luckyCount += 5;
            this.Player.luckyShareCount += 1;
            asgard.events.EventsDispatcher.eventNotify(logic.GameEvents.EVENT_UPDATE_LUCKY_TICKETS);
        }

        modifyConfig() {
            if (this.Player.turnRound > 0 && !this._isModify) {
                this._isModify = true;
                for (var t = asgard.data.StaticDataManager.getSheetDatas(data.Post.DATA_TYPE), e = 0; e < t.length; e++) {
                    var i = t[e];
                    i && (i.Produce = Math.floor(2 * i.Produce), i.Offline = Math.floor(2 * i.Offline));
                }
            }
        }
    }
}
