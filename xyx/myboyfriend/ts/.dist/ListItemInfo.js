var logic;
(function (logic) {
    var ListItemInfo = (function () {
        function ListItemInfo(resData) {
            this._postData = resData;
            this._coinBuyCount = 0;
            this.diamonBuyCount = 0;
            this.isUnlock = false;
            this.isCoinUnLock = false;
            this.isDiamonUnLock = false;
            this._playerModule = asgard.module.ModuleManager.getModule(logic.MODULE_PLAYER);
        }
        Object.defineProperty(ListItemInfo.prototype, "coinBuyCount", {
            get: function () {
                return this._coinBuyCount;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ListItemInfo.prototype, "Price", {
            get: function () {
                return this._postData.Lv < 3 ? this.coinBuyCount <= 0 ? this._postData.Price : Math.floor(Math.pow(1.07, this.coinBuyCount) * this._postData.Price) : Math.floor(Math.pow(1.175, this.coinBuyCount) * this._postData.Price);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ListItemInfo.prototype, "RecoveryPrice", {
            get: function () {
                return Math.floor(.8 * this.Price);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ListItemInfo.prototype, "DiamonPrice", {
            get: function () {
                return this._postData.Dprice > 0 ? Math.floor(this._postData.Dprice + this._postData.Up * this.diamonBuyCount) : 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ListItemInfo.prototype, "Post", {
            get: function () {
                return this._postData;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ListItemInfo.prototype, "Produce", {
            get: function () {
                return this._playerModule.Player.turnRound > 0 ? 2 * this.Post.Produce : this.Post.Produce;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ListItemInfo.prototype, "Offline", {
            get: function () {
                return this._playerModule.Player.turnRound > 0 ? 2 * this.Post.Offline : this.Post.Offline;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ListItemInfo.prototype, "Level", {
            get: function () {
                return this._playerModule.Player.turnRound * logic.GameConst.MAX_LEVEL + this.Post.Lv;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ListItemInfo.prototype, "Name", {
            get: function () {
                var t = this._playerModule.Player.turnRound;
                if (t <= 0)
                    return this.Post.Name;
                if (1 == t)
                    return "仙·" + this.Post.Name;
                if (2 == t)
                    return "神·" + this.Post.Name;
                if (3 == t)
                    return "帝·" + this.Post.Name;
                if (4 == t)
                    return "祖·" + this.Post.Name;
                if (5 == t)
                    return "始·" + this.Post.Name;
                if (6 == t)
                    return "天仙·" + this.Post.Name;
                if (7 == t)
                    return "天神·" + this.Post.Name;
                if (8 == t)
                    return "天帝·" + this.Post.Name;
                if (9 == t)
                    return "天祖·" + this.Post.Name;
                if (10 == t)
                    return "天始·" + this.Post.Name;
                if (11 == t)
                    return "金仙·" + this.Post.Name;
                if (12 == t)
                    return "金神·" + this.Post.Name;
                if (13 == t)
                    return "金帝·" + this.Post.Name;
                if (14 == t)
                    return "金祖·" + this.Post.Name;
                if (15 == t)
                    return "金始·" + this.Post.Name;
                var e = Math.ceil((t - 15) / 5);
                return 1 == (t %= 5) ? "金仙" + e + "·" + this.Post.Name : 2 == t ? "金神" + e + "·" + this.Post.Name : 3 == t ? "金帝" + e + "·" + this.Post.Name : 4 == t ? "金祖" + e + "·" + this.Post.Name : 0 == t ? "金始" + e + "·" + this.Post.Name : void 0;
            },
            enumerable: true,
            configurable: true
        });
        ListItemInfo.prototype.addBuyCount = function (e) {
            e == logic.AddSlotType.COIN ? this._coinBuyCount += 1 : e == logic.AddSlotType.DIAMON && (this.diamonBuyCount += 1),
                asgard.events.EventsDispatcher.eventNotify(logic.GameEvents.EVENT_UPDATE_ITEM_BUY_COUNT);
        };
        ListItemInfo.prototype.fillNetData = function (t, e, i, n, s) {
            this._coinBuyCount = t, this.diamonBuyCount = e, this.isUnlock = i, this.isCoinUnLock = n,
                this.isDiamonUnLock = s;
        };
        return ListItemInfo;
    }());
    logic.ListItemInfo = ListItemInfo;
})(logic || (logic = {}));
//# sourceMappingURL=ListItemInfo.js.map