module logic {
    export class ItemListModule extends asgard.module.BaseModule {
        private _allItems: any[];
        private _moduleId: number;
        private currOpenLevel: number;

        constructor() {
            super();
            this._moduleId = logic.MODULE_LIST;
            asgard.events.EventsDispatcher.registerEventListener(logic.GameEvents.EVENT_GAME_ONHIDE, this, this._reset);
            this._reset();
            this.testData();
        }

        private _reset() {
            this._allItems = [];
            this.currOpenLevel = 1;
            var e = asgard.data.StaticDataManager.getSheetDatas(data.Post.DATA_TYPE);
            e.sort(this._sort);
            for (var i = 0; i < e.length; i++) {
                var n = e[i];
                this._allItems[n.Id] = new logic.ListItemInfo(n);
            }
        }

        doFly() {
            this._reset();
            this._allItems[1].fillNetData(0, 0, true, true, true);
        }

        testData() {
            if (!Laya.Browser.onMiniGame) {
                this.currOpenLevel = 34;
                var t = this._allItems[1];
                t.fillNetData(0, 0, true, true, true), (t = this._allItems[34]).fillNetData(1, 1, true, true, true);
            }
        }

        onInitItemList(curShopLevel, shopItems) {
            if (shopItems && void 0 != shopItems) {
                this.currOpenLevel = curShopLevel;
                for (var n = 0, s = (asgard.module.ModuleManager.getModule(logic.MODULE_PLAYER), 0); s < shopItems.length; s++) {
                    var serverItem = shopItems[s];
                    var clientItem = this._allItems[serverItem.id];
                    if (clientItem) {
                        if (clientItem.Post.Lv + 4 <= this.currOpenLevel) {
                            serverItem.buyUnlock = 1;
                            serverItem.coinUnlock = 1;
                            serverItem.diamonUnlock = 1;
                        }
                        clientItem.Post.Lv > n && (n = clientItem.Post.Lv);
                        clientItem.fillNetData(serverItem.coinCount, serverItem.diamonCount, 1 == serverItem.buyUnlock, 1 == serverItem.coinUnlock, 1 == serverItem.diamonUnlock);
                    }
                }
                this.currOpenLevel < n && (this.currOpenLevel = n), asgard.events.EventsDispatcher.eventNotify(logic.GameEvents.EVENT_GET_SHOP_LIST);
            } else console.error("itemArray null");
        }

        _sort(t, e) {
            return t.Id - e.Id;
        }

        get ItemList(): any {
            return this._allItems;
        }

        findItem(t) {
            return this._allItems[t];
        }

        findItemByLevel(t) {
            for (var e = 0, i = this._allItems; e < i.length; e++) {
                var n = i[e];
                if (null != n && n.Post.Lv == t) return n;
            }
            return null;
        }

        buyItemSuccess(t, e) {
            var i = this.findItem(t);
            return null != i ? i.addBuyCount(e) : console.error("查找item失败 id " + t), i;
        }

        getCurrUnlockItem() {
            var t;
            this._allItems.forEach(function (e) {
                if (e != null && e.isCoinUnLock) {
                    if (t == null) {
                        t = e;
                    } else {
                        if (t.Post.Lv < e.Post.Lv) {
                            t = e;
                        }
                    }
                }
            });
            return t;
        }

        getDiamonUnlock() {
            var t, e;
            return this._allItems.forEach(function (i) {
                null != i && (i.isDiamonUnLock && (null == t ? t = i : t.Post.Lv < i.Post.Lv && (t = i)),
                    null == e ? e = i : e.Post.Id > i.Post.Id && (e = i));
            }), null == t && (t = e), t;
        }

        checkNewLevel(e) {
            if (this.currOpenLevel >= e.Post.Lv) return false;
            if (this.currOpenLevel = e.Post.Lv, e.isUnlock = true, e.Post.Lv - 2 >= 0) {
                null != (i = this.findItemByLevel(e.Post.Lv - 2)) && i.Post.Dprice > 0 && 0 == i.isDiamonUnLock && (i.isDiamonUnLock = true);
            }
            if (e.Post.Lv - 3 >= 0) {
                null != (i = this.findItemByLevel(e.Post.Lv - 3)) && i.Post.Dprice > 0 && 0 == i.isDiamonUnLock && (i.isDiamonUnLock = true);
            }
            if (e.Post.Lv - 4 >= 0) {
                var i = this.findItemByLevel(e.Post.Lv - 4);
                null != i && 0 == i.isCoinUnLock && (i.isCoinUnLock = true);
            }
            asgard.ui.UIManager.openView(logic.UIPanelID.LEVELUPTIP), asgard.events.EventsDispatcher.eventNotify(logic.GameEvents.EVENT_COMBINE_NEW),
                logic.GameData.Instance().postGameData();
            asgard.module.ModuleManager.getModule(logic.MODULE_PLAYER), asgard.module.ModuleManager.getModule(logic.MODULE_SLOT);
            return logic.GameData.Instance().postRank(), WxGetFriendRankList(), true;
        }

        getNextItemInfo(t) {
            var e = this.findItem(t);
            if (null == e) return null;
            for (var i = 0, n = this._allItems; i < n.length; i++) {
                var s = n[i];
                if (null != s && e.Post.Lv + 1 == s.Post.Lv) return s;
            }
            return null;
        }

        getBuyItemInfo() {
            var t = [],
                e = this.getCurrUnlockItem();
            e && t.push({
                value: 1,
                item: e
            }), e.Post.Id - 1 > 0 && t.push({
                value: 1,
                item: this.findItem(e.Post.Id - 1)
            }), e.Post.Id - 2 > 0 && t.push({
                value: 1,
                item: this.findItem(e.Post.Id - 2)
            }), e.Post.Id - 3 > 0 && t.push({
                value: 1,
                item: this.findItem(e.Post.Id - 3)
            });
            for (var i = t.length - 1; i >= 0; i--) {
                var n = t[i],
                    s = 1 << t.length - i - 1;
                n.value = n.item.Price / s;
            }
            return t.sort(function (t, e) {
                return t.value - e.value;
            }), t[0].item;
        }
    }
}

