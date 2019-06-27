module logic {
    export class ListItemInfo {
        private _postData: any;
        private _coinBuyCount: number;
        private diamonBuyCount: number;
        private isUnlock: boolean;
        private isCoinUnLock: boolean;
        private isDiamonUnLock: boolean;
        private _playerModule: PlayerModule;

        constructor(resData) {
            this._postData = resData;
            this._coinBuyCount = 0;
            this.diamonBuyCount = 0;
            this.isUnlock = false;
            this.isCoinUnLock = false;
            this.isDiamonUnLock = false;
            this._playerModule = asgard.module.ModuleManager.getModule(logic.MODULE_PLAYER) as PlayerModule;
        }

        get coinBuyCount(): number {
            return this._coinBuyCount;
        }

        get Price(): number {
            return this._postData.Lv < 3 ? this.coinBuyCount <= 0 ? this._postData.Price : Math.floor(Math.pow(1.07, this.coinBuyCount) * this._postData.Price) : Math.floor(Math.pow(1.175, this.coinBuyCount) * this._postData.Price);
        }

        get RecoveryPrice(): number {
            return Math.floor(.8 * this.Price);
        }

        get DiamonPrice(): number {
            return this._postData.Dprice > 0 ? Math.floor(this._postData.Dprice + this._postData.Up * this.diamonBuyCount) : 0;
        }

        get Post(): any {
            return this._postData;
        }

        get Produce(): number {
            return this._playerModule.Player.turnRound > 0 ? 2 * this.Post.Produce : this.Post.Produce;
        }

        get Offline(): number {
            return this._playerModule.Player.turnRound > 0 ? 2 * this.Post.Offline : this.Post.Offline;
        }

        get Level(): number {
            return this._playerModule.Player.turnRound * logic.GameConst.MAX_LEVEL + this.Post.Lv;
        }

        get Name(): string {
            var t = this._playerModule.Player.turnRound;
            if (t <= 0) return this.Post.Name;
            if (1 == t) return "仙·" + this.Post.Name;
            if (2 == t) return "神·" + this.Post.Name;
            if (3 == t) return "帝·" + this.Post.Name;
            if (4 == t) return "祖·" + this.Post.Name;
            if (5 == t) return "始·" + this.Post.Name;
            if (6 == t) return "天仙·" + this.Post.Name;
            if (7 == t) return "天神·" + this.Post.Name;
            if (8 == t) return "天帝·" + this.Post.Name;
            if (9 == t) return "天祖·" + this.Post.Name;
            if (10 == t) return "天始·" + this.Post.Name;
            if (11 == t) return "金仙·" + this.Post.Name;
            if (12 == t) return "金神·" + this.Post.Name;
            if (13 == t) return "金帝·" + this.Post.Name;
            if (14 == t) return "金祖·" + this.Post.Name;
            if (15 == t) return "金始·" + this.Post.Name;
            var e = Math.ceil((t - 15) / 5);
            return 1 == (t %= 5) ? "金仙" + e + "·" + this.Post.Name : 2 == t ? "金神" + e + "·" + this.Post.Name : 3 == t ? "金帝" + e + "·" + this.Post.Name : 4 == t ? "金祖" + e + "·" + this.Post.Name : 0 == t ? "金始" + e + "·" + this.Post.Name : void 0;
        }

        addBuyCount(e) {
            e == logic.AddSlotType.COIN ? this._coinBuyCount += 1 : e == logic.AddSlotType.DIAMON && (this.diamonBuyCount += 1),
                asgard.events.EventsDispatcher.eventNotify(logic.GameEvents.EVENT_UPDATE_ITEM_BUY_COUNT);
        }

        fillNetData(t, e, i, n, s) {
            this._coinBuyCount = t, this.diamonBuyCount = e, this.isUnlock = i, this.isCoinUnLock = n,
                this.isDiamonUnLock = s;
        }
    }
}

