var HeroTabViewAttr = (function () {
    function HeroTabViewAttr(g) {
        this._g = null;
        this._items = null;
        this._g = g;
    }
    HeroTabViewAttr.prototype.setItems = function (items) {
        this._items = items;
    };
    HeroTabViewAttr.prototype.setHeroIcon = function (hero) {
        IMG.setBKImage(this._items.icon, IMG.makeBigImg(hero.icon));
    };
    HeroTabViewAttr.prototype.setHeroName = function (hero) {
        TQ.setText(this._items.name, hero.name);
    };
    HeroTabViewAttr.prototype.setOfficialName = function (hero) {
        var officialres = TQ.qfind(res_heroofficials, 'id', hero.official);
        var name = officialres ? officialres.name : rstr.herodlg.lbl.noofficial;
        TQ.setText(this._items.official, name);
    };
    return HeroTabViewAttr;
})();
// hero base info tab page
var HeroInfoPage = (function () {
    function HeroInfoPage(g, parent) {
        this._g = null;
        this._parent = null;
        this._items = null;
        this._data = null;
        this._heromgr = null;
        this._attrsview = null;
        this._g = g;
        this._parent = parent;
        this._heromgr = this._g.getImgr().getHeroMgr();
        this._attrsview = new HeroTabViewAttr(this._g);
    }
    HeroInfoPage.prototype.setModel = function (data) {
        this._data = data;
    };
    HeroInfoPage.prototype.initDlg = function (items) {
        this._items = items;
        this._attrsview.setItems(this._items);
    };
    HeroInfoPage.prototype.beforeChangeHero = function () {
    };
    HeroInfoPage.prototype.update = function () {
        if (!this._parent.isShow())
            return;
        var hero = this._data.getCurHero();
        if (!hero) {
            this._clearHeroInfo();
            return;
        }
        if (!this._heromgr.isDetailHero(hero)) {
            return;
        }
        this._enableHeroInfoBtns(true);
        this._setCommonAttrs(hero);
        this._setExpAttrBar(hero);
        this._setSubjectAttr(hero);
        this._setBaseAttrs(hero);
    };
    HeroInfoPage.prototype._setCommonAttrs = function (hero) {
        this._attrsview.setHeroIcon(hero);
        this._attrsview.setHeroName(hero);
        this._attrsview.setOfficialName(hero);
        TQ.setTextEx(this._items.level, hero.level);
        TQ.setTextEx(this._items.fightcap, this._heromgr.getHeroAttrVal(hero, ATTR.SFC));
        TQ.setTextEx(this._items.innerforce, this._heromgr.getHeroAttrVal(hero, ATTR.IF));
        TQ.setTextEx(this._items.health, RStrUtil.getColorHealthVal(this._heromgr.getHeroAttrVal(hero, ATTR.HEALTH)));
        TQ.setTextEx(this._items.credit, this._heromgr.getHeroAttrVal(hero, ATTR.CRE));
        TQ.setTextEx(this._items.prof, rstr.comm.heroprofs[hero.prof]);
        TQ.setTextEx(this._items.command, this._heromgr.getHeroAttrVal(hero, ATTR.CO));
    };
    HeroInfoPage.prototype._setExpAttrBar = function (hero) {
        this._setExpbarShowFlag(PROGBAR_SHOWFLAG_PER);
        this._items.expbar.setRange(this._heromgr.getHeroAttrVal(hero, ATTR.NXP));
        this._items.expbar.setValue(0, this._heromgr.getHeroAttrVal(hero, ATTR.XP));
    };
    HeroInfoPage.prototype._setSubjectAttr = function (hero) {
        var s = '';
        for (var i in hero.subjects)
            s += rstr.recruitherodlg.subjects[i] + ':' + SubjectColorGetter.getColorVal(hero.subjects[i]) + '  ';
        TQ.setTextEx(this._items.subject, s);
    };
    HeroInfoPage.prototype._setBaseAttrs = function (hero) {
        TQ.setText(this._items.hurt, this._heromgr.getHeroAttrVal(hero, ATTR.HU));
        TQ.setText(this._items.def, this._heromgr.getHeroAttrVal(hero, ATTR.DE));
        TQ.setText(this._items.agile, this._heromgr.getHeroAttrVal(hero, ATTR.AG));
        TQ.setText(this._items.physical, this._heromgr.getHeroAttrVal(hero, ATTR.PS));
    };
    HeroInfoPage.prototype._clearHeroInfo = function () {
        this._enableHeroInfoBtns(false);
        this._setExpbarShowFlag(PROGBAR_SHOWFLAG_NONE);
        IMG.setBKImage(this._items.icon, '');
        var valdoms = ['name', 'fightcap', 'prof', 'level', 'health', 'official', 'fiveelem', 'credit', 'command', 'innerforce', 'subject', 'hurt', 'def', 'agile', 'ps'];
        for (var k in valdoms) {
            TQ.setText(this._items[valdoms[k]], '');
        }
    };
    HeroInfoPage.prototype._enableHeroInfoBtns = function (flag) {
        var btns = ['assignexp', 'treatment', 'appoint'];
        for (var k in btns) {
            this._items[btns[k]].enable(flag);
        }
    };
    HeroInfoPage.prototype._setExpbarShowFlag = function (showflag) {
        this._items.expbar.setShowFlag(showflag);
        this._items.expbar.setRange(1);
        this._items.expbar.setValue(0, 0);
    };
    return HeroInfoPage;
})();
//# sourceMappingURL=heroinfopage.js.map