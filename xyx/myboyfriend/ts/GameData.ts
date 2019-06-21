module logic {
    export class GameData {
        private _initLocal = false;
        private tempDbVersion = 0;
        private isVideoAdCanPlay = true;
        private playVideoTimes = 0;
        private gameDataReady = false;
        private _playerModule;
        private _itemListModule;
        private _slotModule;
        private _socialModule;
        private _lastSaveData;
        private _localData;
        private shareGroup;

        constructor() {
        }

        private static _gameData: GameData = null;
        static Instance(): GameData {
            return null == GameData._gameData && (GameData._gameData = new GameData()), GameData._gameData;
        }

        init() {
            this.gameDataReady = false;
            this._playerModule = asgard.module.ModuleManager.getModule(logic.MODULE_PLAYER);
            this._itemListModule = asgard.module.ModuleManager.getModule(logic.MODULE_LIST);
            this._slotModule = asgard.module.ModuleManager.getModule(logic.MODULE_SLOT);
            this._socialModule = asgard.module.ModuleManager.getModule(logic.MODULE_SOCIAL);
            this._lastSaveData = null;
        };

        getGameDataWhenError() {
            console.error("========getGameDataWhenError========="),
                this._localData = null;
            this.gameDataReady = false;
            logic.HttpServer.Instance().getUserData(Laya.Handler.create(this, this.OnLoginSuccess), Laya.Handler.create(this, this.OnLoginFailed));
        };

        OnLoginSuccess(t) {
            t.result && GameData.Instance().CheckData(t.result);
        };

        OnLoginFailed(t) { };

        resetSlotStartTime() {
            this._slotModule && this._slotModule.resetSlotStartTime();
        };

        startGameFromLocal() {
            if (!this._initLocal) {
                this._localData = null;
                try {
                    var e = logic.PlatForm.GetInstance().readDataFromFile(logic.GameConst.LOCAL_CACHE_FILE_PATH);
                    if (null == e || "" == e) return;

                    var localData = JSON.parse(e);
                    if (localData.dbVersion <= 0 || localData.shopLevel <= 2 || localData.items.length <= 0 || localData.slots.length <= 0)
                        return;

                    this._initLocal = true;
                    this._localData = localData;
                    this.shareGroup = localData.shareGrop;
                    localData.shopLevel >= 2 && localData.guideStep < logic.GuidePanel.guideSteps.length && (localData.guideStep = logic.GuidePanel.guideSteps.length);

                    this._playerModule.onGameInit(localData); // 主角
                    this._itemListModule.onInitItemList(localData.shopLevel, localData.items); // 商店
                    this._slotModule.onInitSlotData(localData.slots); // 格子
                    this._socialModule.onInitData(localData.friendNum, localData.friendDraw, localData.shareGrop); // 社交

                    console.log("startGameFromLocal ", localData);
                    this.gameDataReady = true;
                    asgard.events.EventsDispatcher.eventNotify(logic.GameEvents.EVENT_GAME_ONSHOW);
                    asgard.stage.StageManager.enterStage(logic.STAGE_ARENA);
                } catch (t) {
                    console.error("startGameFromLocal error ", t);
                }
            }
        };

        // 计算离线奖励
        caculatOfflineReward(isNewPlayer, offlineTime, timestamp, slots) {
            logic.Utils.getTimestamp();
            console.log("caculatOfflineReward ,", offlineTime, timestamp);
            offlineTime = timestamp - offlineTime;
            var reward = 0;
            if (0 == isNewPlayer && offlineTime > 0) {
                // 超过离线上限取上限
                if (offlineTime > logic.GameConst.MAX_OFFLINE_TIME) {
                    offlineTime = logic.GameConst.MAX_OFFLINE_TIME;
                    this._slotModule.isLeftOverMaxTime = true;
                }

                for (var cslots = slots, idx = 0; idx < cslots.length; idx++) {
                    var slot = cslots[idx];
                    if (slot == null) continue;

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

        CheckData(e) {
            if (void 0 != e && "" != e) {
                var serverdata = null;
                var shopItems = null;
                var slots = null;
                try {
                    // 服务器下发的数据
                    serverdata = JSON.parse(e);
                    serverdata.timestamp = Number(serverdata.timestamp); // 当前服务器的时间
                    serverdata.offlineTime = Number(serverdata.offlineTime); // 用户上次离线的时间
                    serverdata.dbVersion = Number(serverdata.dbVersion); // db版本
                    serverdata.shareCoinNum = Number(serverdata.shareCoinNum); // 分享钱的数量
                    serverdata.shareDiamonNum = Number(serverdata.shareDiamonNum); // 分享钻石的数量
                    serverdata.upStartTime = Number(serverdata.upStartTime); // 开始加速的时间
                    serverdata.friendDraw = Number(serverdata.friendDraw); // 邀请好友今日领奖
                    serverdata.loginDays = Number(serverdata.loginDays); // 登录天数
                    serverdata.loginRewardDays = Number(serverdata.loginRewardDays); // 登录奖励的天数
                    serverdata.lastLoginTime = Number(serverdata.lastLoginTime); // 最近登录时间
                    serverdata.coin = Number(serverdata.coin); // 钱币数量
                    serverdata.diamon = Number(serverdata.diamon); // 钻石数量
                    serverdata.speed = Number(serverdata.speed); // 当前速度
                    serverdata.guideStep = Number(serverdata.guideStep); // 引导步数
                    serverdata.shopLevel = Number(serverdata.shopLevel); // 商城等级
                    serverdata.isNewPlayer = "false" != serverdata.isNewPlayer; // 是否是新玩家
                    serverdata.isFly = Number(serverdata.isFly); // 是否飞升
                    serverdata.itemArray; // 商品列表
                    serverdata.luckyCount; // 幸运大转盘次数
                    serverdata.luckyShareCount; // 幸运大转盘分享次数
                    serverdata.luckyUpTime; // 幸运提升时间？
                    serverdata.slots; //格子

                    /* 上传的数据
                    return {
                        saveTime: logic.Utils.getTimestamp(), // 存储的时间
                        coin: coin, // 钱币数量
                        diamon: this._playerModule.Player.Diamon, // 钻石数量
                        shopLevel: shopLevel, // 商城等级
                        isNewPlayer: this._playerModule.isNewPlayer, // 是否是新玩家
                        speedup: this._playerModule.Player.Speed, // 当前速度
                        upStartTime: logic.Utils.getTimestamp() + 1e3 * this._playerModule.Player.LeftTime, // 开始加速的时间
                        loginDays: this._playerModule.Player.loginDays, // 登录天数
                        loginRewardDays: this._playerModule.Player.loginRewardDays, // 登录奖励的天数
                        lastLoginTime: this._playerModule.Player.lastLoginTime, // 最近登录时间
                        guideStep: this._playerModule.guideStep, // 引导步数
                        friendDraw: this._socialModule.inviteLoginDraw, // 邀请好友今日领奖
                        shareCoinNum: this._playerModule.Player.shareCoinCount,  // 分享钱的数量
                        shareDiamonNum: this._playerModule.Player.shareDiamonCount, // 分享钻石的数量
                        luckyCount: this._playerModule.Player.luckyCount, // 幸运大转盘次数
                        luckyShareCount: this._playerModule.Player.luckyShareCount, // 幸运大转盘分享次数
                        luckyUpTime: this._playerModule.Player.luckyUpTime, // 幸运提升时间？
                        dbVersion: this._playerModule.dbVersion, // db版本
                        version: logic.GameConst.VERSION, // 游戏数据版本号
                        slots: slots, // 格子
                        items: shopItems, // 商品列表
                        shareGrop: shares, // 分享的列表
                        isFly: this._playerModule.Player.turnRound // 是否飞升
                    };
                    */

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
                    var serverslots = JSON.parse(serverdata.slots); // 格子中的所有男友们
                    slots = [];
                    for (let i = 0; i < serverslots.length; i++) {
                        let slot = JSON.parse(serverslots[i]);
                        slot.id = Number(slot.id);
                        slot.pos = Number(slot.pos);
                        slots.push(slot);
                    }

                    this._playerModule.SpeedUpEndTime = serverdata.upStartTime;
                    this._playerModule.offLineTime = serverdata.offlineTime;
                    var offlineReward = this.caculatOfflineReward(serverdata.isNewPlayer, serverdata.offlineTime, serverdata.timestamp, slots); //计算离线奖励

                    if (this._localData && (this._localData.dbVersion >= serverdata.dbVersion)) {
                        console.error("local.dbVersion " + this._localData.dbVersion + " netdbversion " + serverdata.dbVersion);
                        console.error("shareCoinCount " + this._playerModule.Player.shareCoinCount + " shareDiamonCount " + this._playerModule.Player.shareDiamonCount);

                        return void (offlineReward > 0 && (this._slotModule.offlineCoin = offlineReward,
                            this._playerModule.isGuideOver() && (
                                asgard.ui.UIManager.openView(logic.UIPanelID.OFFLINETIP),
                                asgard.events.EventsDispatcher.eventNotify(logic.GameEvents.EVENT_SHOW_BOX)
                            )
                        ));
                    }

                    this.gameDataReady = false;
                    asgard.events.EventsDispatcher.eventNotify(logic.GameEvents.EVENT_GAME_ONHIDE);
                    this._slotModule.offlineCoin = offlineReward;
                    var serverShopItems = JSON.parse(serverdata.itemArray);
                    shopItems = [];
                    for (let i = 0; i < serverShopItems.length; i++) {
                        var shopItem = JSON.parse(serverShopItems[i]);
                        shopItem.id = Number(shopItem.id);
                        shopItem.coinCount = Number(shopItem.coinCount);
                        shopItem.diamonCount = Number(shopItem.diamonCount);
                        shopItem.buyUnlock = Number(shopItem.buyUnlock);
                        shopItem.coinUnlock = Number(shopItem.coinUnlock);
                        shopItem.diamonUnlock = Number(shopItem.diamonUnlock);
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
                } catch (t) {
                    return void console.error(t);
                }
            } else console.log("netData error ");
        };

        postGameData(callback?: Laya.Handler) {
            if (this.gameDataReady) {
                var i = this.getPlayerBaseInfo(true);
                i.shopLevel <= 1 && 0 == i.isFly || "0" == i.coin || i.dbVersion <= 0 || (i.shareGrop = null, logic.HttpServer.Instance().saveUserData(i, callback));
            }
        };

        saveLocalGameData() {
            if (this.gameDataReady) {
                var playerInfo = this.getPlayerBaseInfo(false);
                if (playerInfo.shopLevel <= 1 && 0 == playerInfo.isFly || "0" == playerInfo.coin || playerInfo.dbVersion <= 0) console.log("保存数据失败11");
                else if (this._lastSaveData && playerInfo.shopLevel < this._lastSaveData.shopLevel && playerInfo.isFly != this._lastSaveData.isFly) console.log("保存数据失败22");
                else {
                    this._lastSaveData = playerInfo;
                    var playerInfoStr = JSON.stringify(playerInfo);
                    logic.PlatForm.GetInstance().writeData2File(logic.GameConst.LOCAL_CACHE_FILE_PATH, playerInfoStr);
                }
            }
        };

        getPlayerBaseInfo(forServer: boolean) {
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
            else { console.error("AllSlot is null"); }

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

        postRank() {
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

        isCanFly() {
            if (this._itemListModule.currOpenLevel < logic.GameConst.MAX_LEVEL)
                return false;

            for (var e = 0, i = this._slotModule.AllSlot, n = 0; n < i.length; n++) {
                var s = i[n];
                s && s.Post.Lv == logic.GameConst.MAX_LEVEL && e++;
            }
            return e >= logic.GameConst.FLY_LIMIT_HERO_COUNT;
        };

        doFly() {
            if (IsMiniGame()) {
                this.postGameData(Laya.Handler.create(this, this._onFlyOver));
            } else {
                this._onFlyOver();
            }
        };

        _onFlyOver() {
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
    }
}
