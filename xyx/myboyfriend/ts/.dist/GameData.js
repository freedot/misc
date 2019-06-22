var logic;
(function (logic) {
    var GameData = (function () {
        function GameData() {
            this._initLocal = false;
            this.tempDbVersion = 0;
            this.isVideoAdCanPlay = true;
            this.playVideoTimes = 0;
            this.gameDataReady = false;
        }
        GameData.Instance = function () {
            return null == GameData._gameData && (GameData._gameData = new GameData()), GameData._gameData;
        };
        GameData.prototype.init = function () {
            this.gameDataReady = false;
            this._playerModule = asgard.module.ModuleManager.getModule(logic.MODULE_PLAYER);
            this._itemListModule = asgard.module.ModuleManager.getModule(logic.MODULE_LIST);
            this._slotModule = asgard.module.ModuleManager.getModule(logic.MODULE_SLOT);
            this._socialModule = asgard.module.ModuleManager.getModule(logic.MODULE_SOCIAL);
            this._lastSaveData = null;
        };
        ;
        GameData.prototype.getGameDataWhenError = function () {
            console.error("========getGameDataWhenError========="),
                this._localData = null;
            this.gameDataReady = false;
            logic.HttpServer.Instance().getUserData(Laya.Handler.create(this, this.OnLoginSuccess), Laya.Handler.create(this, this.OnLoginFailed));
        };
        ;
        GameData.prototype.OnLoginSuccess = function (t) {
            t.result && GameData.Instance().CheckData(t.result);
        };
        ;
        GameData.prototype.OnLoginFailed = function (t) { };
        ;
        GameData.prototype.resetSlotStartTime = function () {
            this._slotModule && this._slotModule.resetSlotStartTime();
        };
        ;
        GameData.prototype.startGameFromLocal = function () {
            if (!this._initLocal) {
                this._localData = null;
                try {
                    var e = logic.PlatForm.GetInstance().readDataFromFile(logic.GameConst.LOCAL_CACHE_FILE_PATH);
                    if (null == e || "" == e)
                        return;
                    var localData = JSON.parse(e);
                    if (localData.dbVersion <= 0 || localData.shopLevel <= 2 || localData.items.length <= 0 || localData.slots.length <= 0)
                        return;
                    this._initLocal = true;
                    this._localData = localData;
                    this.shareGroup = localData.shareGrop;
                    localData.shopLevel >= 2 && localData.guideStep < logic.GuidePanel.guideSteps.length && (localData.guideStep = logic.GuidePanel.guideSteps.length);
                    this._playerModule.onGameInit(localData);
                    this._itemListModule.onInitItemList(localData.shopLevel, localData.items);
                    this._slotModule.onInitSlotData(localData.slots);
                    this._socialModule.onInitData(localData.friendNum, localData.friendDraw, localData.shareGrop);
                    console.log("startGameFromLocal ", localData);
                    this.gameDataReady = true;
                    asgard.events.EventsDispatcher.eventNotify(logic.GameEvents.EVENT_GAME_ONSHOW);
                    asgard.stage.StageManager.enterStage(logic.STAGE_ARENA);
                }
                catch (t) {
                    console.error("startGameFromLocal error ", t);
                }
            }
        };
        ;
        GameData.prototype.caculatOfflineReward = function (isNewPlayer, offlineTime, timestamp, slots) {
            logic.Utils.getTimestamp();
            console.log("caculatOfflineReward ,", offlineTime, timestamp);
            offlineTime = timestamp - offlineTime;
            var reward = 0;
            if (0 == isNewPlayer && offlineTime > 0) {
                if (offlineTime > logic.GameConst.MAX_OFFLINE_TIME) {
                    offlineTime = logic.GameConst.MAX_OFFLINE_TIME;
                    this._slotModule.isLeftOverMaxTime = true;
                }
                for (var cslots = slots, idx = 0; idx < cslots.length; idx++) {
                    var slot = cslots[idx];
                    if (slot == null)
                        continue;
                    var slotdata = data.StaticDataFactory.findPost(slot.id);
                    if (slotdata == null) {
                        console.error("slot id error " + slot.id);
                        continue;
                    }
                    var leftOfflineTime = offlineTime;
                    var curReward = 0;
                    if (leftOfflineTime > 1e3) {
                        if (this._playerModule.SpeedUpEndTime > timestamp) {
                            var leftSpeedTime = this._playerModule.SpeedUpEndTime - this._playerModule.offLineTime;
                            curReward += Math.floor(.001 * leftSpeedTime * slotdata.Offline);
                            leftOfflineTime -= leftSpeedTime;
                        }
                        curReward += Math.floor(.001 * leftOfflineTime * slotdata.Offline);
                    }
                    reward += curReward;
                }
            }
            return reward;
        };
        ;
        GameData.prototype.CheckData = function (serverdata) {
            if (void 0 != serverdata && "" != serverdata) {
                var serverdata = null;
                var shopItems = null;
                var slots = null;
                try {
                    this._playerModule.Player.shareCoinCount = serverdata.shareCoinNum;
                    this._playerModule.Player.shareDiamonCount = serverdata.shareDiamonNum;
                    this._playerModule.Player.lastLoginTime = serverdata.lastLoginTime;
                    this._playerModule.Player.loginDays = serverdata.loginDays;
                    this._playerModule.Player.loginRewardDays = serverdata.loginRewardDays;
                    this._playerModule.isNewPlayer = serverdata.isNewPlayer;
                    asgard.events.EventsDispatcher.eventNotify(logic.GameEvents.EVENT_UPDATE_LOGIN_REWARD);
                    this._socialModule.inviteLoginDraw = serverdata.friendDraw;
                    logic.Utils.setverTimestamp = serverdata.timestamp;
                    var clientTime = new Date();
                    logic.Utils.offsetTimestamp = serverdata.timestamp - clientTime.getTime();
                    var serverslots = serverdata.slots;
                    slots = [];
                    for (var i = 0; i < serverslots.length; i++) {
                        var slot = serverslots[i];
                        slots.push(slot);
                    }
                    this._playerModule.SpeedUpEndTime = serverdata.upStartTime;
                    this._playerModule.offLineTime = serverdata.offlineTime;
                    var offlineReward = this.caculatOfflineReward(serverdata.isNewPlayer, serverdata.offlineTime, serverdata.timestamp, slots);
                    if (this._localData && (this._localData.dbVersion >= serverdata.dbVersion)) {
                        console.error("local.dbVersion " + this._localData.dbVersion + " netdbversion " + serverdata.dbVersion);
                        console.error("shareCoinCount " + this._playerModule.Player.shareCoinCount + " shareDiamonCount " + this._playerModule.Player.shareDiamonCount);
                        return void (offlineReward > 0 && (this._slotModule.offlineCoin = offlineReward,
                            this._playerModule.isGuideOver() && (asgard.ui.UIManager.openView(logic.UIPanelID.OFFLINETIP),
                                asgard.events.EventsDispatcher.eventNotify(logic.GameEvents.EVENT_SHOW_BOX))));
                    }
                    this.gameDataReady = false;
                    asgard.events.EventsDispatcher.eventNotify(logic.GameEvents.EVENT_GAME_ONHIDE);
                    this._slotModule.offlineCoin = offlineReward;
                    var serverShopItems = serverdata.itemArray;
                    shopItems = [];
                    for (var i = 0; i < serverShopItems.length; i++) {
                        var shopItem = serverShopItems[i];
                        shopItems.push(shopItem);
                    }
                    serverdata.shopLevel >= 2 && serverdata.guideStep < logic.GuidePanel.guideSteps.length && (serverdata.guideStep = logic.GuidePanel.guideSteps.length);
                    this._playerModule.onGameInit(serverdata);
                    this._itemListModule.onInitItemList(serverdata.shopLevel, shopItems);
                    this._slotModule.onInitSlotData(slots);
                    this._socialModule.onInitData(serverdata.friendNum, serverdata.friendDraw, this.shareGroup);
                    this.gameDataReady = !0;
                    console.log("使用网络数据游戏 " + serverdata.isFly);
                    asgard.stage.StageManager.enterStage(logic.STAGE_ARENA);
                    asgard.events.EventsDispatcher.eventNotify(logic.GameEvents.EVENT_GAME_ONSHOW);
                    if (this._localData && this._playerModule.isGuideOver() && this._slotModule.offlineCoin > 0 && null == asgard.ui.UIManager.findUIPanel(logic.UIPanelID.OFFLINETIP)) {
                        asgard.ui.UIManager.openView(logic.UIPanelID.OFFLINETIP);
                        asgard.events.EventsDispatcher.eventNotify(logic.GameEvents.EVENT_SHOW_BOX);
                    }
                }
                catch (t) {
                    return void console.error(t);
                }
            }
            else
                console.log("netData error ");
        };
        ;
        GameData.prototype.postGameData = function (callback) {
            if (this.gameDataReady) {
                var i = this.getPlayerBaseInfo(true);
                i.shopLevel <= 1 && 0 == i.isFly || "0" == i.coin || i.dbVersion <= 0 || (i.shareGrop = null, logic.HttpServer.Instance().saveUserData(i, callback));
            }
        };
        ;
        GameData.prototype.saveLocalGameData = function () {
            if (this.gameDataReady) {
                var playerInfo = this.getPlayerBaseInfo(false);
                if (playerInfo.shopLevel <= 1 && 0 == playerInfo.isFly || "0" == playerInfo.coin || playerInfo.dbVersion <= 0)
                    console.log("保存数据失败11");
                else if (this._lastSaveData && playerInfo.shopLevel < this._lastSaveData.shopLevel && playerInfo.isFly != this._lastSaveData.isFly)
                    console.log("保存数据失败22");
                else {
                    this._lastSaveData = playerInfo;
                    var playerInfoStr = JSON.stringify(playerInfo);
                    logic.PlatForm.GetInstance().writeData2File(logic.GameConst.LOCAL_CACHE_FILE_PATH, playerInfoStr);
                }
            }
        };
        ;
        GameData.prototype.getPlayerBaseInfo = function (forServer) {
            var allSlots = this._slotModule.AllSlot;
            var slots = [];
            if (allSlots) {
                allSlots.forEach(function (slot) {
                    if (null != slot) {
                        var newslot = {
                            id: slot.Post.Id,
                            pos: slot.position
                        };
                        slots.push(newslot);
                    }
                });
            }
            else {
                console.error("AllSlot is null");
            }
            var level = 1;
            var shopItems = [];
            this._itemListModule.ItemList.forEach(function (item) {
                if (item && item.isUnlock) {
                    var newShopitem = {
                        id: item.Post.Id,
                        buyUnlock: item.isUnlock ? 1 : 0,
                        diamonUnlock: item.isDiamonUnLock ? 1 : 0,
                        coinUnlock: item.isCoinUnLock ? 1 : 0,
                        coinCount: item.coinBuyCount,
                        diamonCount: item.diamonBuyCount
                    };
                    if (item.Post.Lv > level) {
                        level = item.Post.Lv;
                        shopItems.push(newShopitem);
                    }
                }
            });
            var shares = [];
            for (var shareGroupMap = this._socialModule.shareGroupMap, i = 0; i < shareGroupMap.length; i++) {
                var share = shareGroupMap[i];
                shares[i] = {
                    time: share.time,
                    openGId: share.openGId
                };
            }
            var coin = String(this._playerModule.Player.Coin);
            var shopLevel = this._itemListModule.currOpenLevel >= level ? this._itemListModule.currOpenLevel : level;
            return {
                saveTime: logic.Utils.getTimestamp(),
                coin: coin,
                diamon: this._playerModule.Player.Diamon,
                shopLevel: shopLevel,
                isNewPlayer: this._playerModule.isNewPlayer,
                speedup: this._playerModule.Player.Speed,
                upStartTime: logic.Utils.getTimestamp() + 1e3 * this._playerModule.Player.LeftTime,
                loginDays: this._playerModule.Player.loginDays,
                loginRewardDays: this._playerModule.Player.loginRewardDays,
                lastLoginTime: this._playerModule.Player.lastLoginTime,
                guideStep: this._playerModule.guideStep,
                friendDraw: this._socialModule.inviteLoginDraw,
                shareCoinNum: this._playerModule.Player.shareCoinCount,
                shareDiamonNum: this._playerModule.Player.shareDiamonCount,
                luckyCount: this._playerModule.Player.luckyCount,
                luckyShareCount: this._playerModule.Player.luckyShareCount,
                luckyUpTime: this._playerModule.Player.luckyUpTime,
                dbVersion: this._playerModule.dbVersion,
                version: logic.GameConst.VERSION,
                slots: slots,
                items: shopItems,
                shareGrop: shares,
                isFly: this._playerModule.Player.turnRound
            };
        };
        ;
        GameData.prototype.postRank = function () {
            if (this.gameDataReady) {
                var t = this._playerModule.Player.Coin + this._slotModule.getCurrSlotRecoveryCoin();
                WxUpdateFriendRank({
                    level: this._itemListModule.currOpenLevel,
                    turnRound: this._playerModule.Player.turnRound,
                    coin: t,
                    openId: this._playerModule.Player.openId
                });
            }
        };
        ;
        GameData.prototype.isCanFly = function () {
            if (this._itemListModule.currOpenLevel < logic.GameConst.MAX_LEVEL)
                return false;
            for (var e = 0, i = this._slotModule.AllSlot, n = 0; n < i.length; n++) {
                var s = i[n];
                s && s.Post.Lv == logic.GameConst.MAX_LEVEL && e++;
            }
            return e >= logic.GameConst.FLY_LIMIT_HERO_COUNT;
        };
        ;
        GameData.prototype.doFly = function () {
            if (IsMiniGame()) {
                this.postGameData(Laya.Handler.create(this, this._onFlyOver));
            }
            else {
                this._onFlyOver();
            }
        };
        ;
        GameData.prototype._onFlyOver = function () {
            this._playerModule.doFly();
            this._itemListModule.doFly();
            this._slotModule.doFly();
            this._socialModule.doFly();
            asgard.events.EventsDispatcher.eventNotify(logic.GameEvents.EVENT_GAME_ONSHOW);
            this.postGameData();
            this.saveLocalGameData();
            this.postRank();
            WxGetFriendRankList();
        };
        ;
        GameData._gameData = null;
        return GameData;
    }());
    logic.GameData = GameData;
})(logic || (logic = {}));
//# sourceMappingURL=GameData.js.map