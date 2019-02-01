/******************************************************************************
  Copyright (C) 2012. All rights reserved.
******************************************************************************/
HERODLG_TAB_INFO_IDX = 0;
HERODLG_TAB_ARM_IDX = 1;
HERODLG_TAB_JINGMAI_IDX = 2;
HERODLG_TAB_SKILL_IDX = 3;
HERODLG_TAB_OFFI_IDX = 4;

MAX_BASESKILL_GRIDCNT = 6;
MAX_TACTICSKILL_GRIDCNT = 2;
MAX_SPECSKILL_GRIDCNT = 5;

AddLevelByHeroFiveElemAttr = Class.extern(function(){
	this.init = function(){
		this.fiveElemMapAttrIds = {};
		this.fiveElemMapAttrIds[FIVEELEM_TYPE.JIN] = ATTR.JIN_SKILL_LEVEL;
		this.fiveElemMapAttrIds[FIVEELEM_TYPE.MU] = ATTR.MU_SKILL_LEVEL;
		this.fiveElemMapAttrIds[FIVEELEM_TYPE.SHUI] = ATTR.SHUI_SKILL_LEVEL;
		this.fiveElemMapAttrIds[FIVEELEM_TYPE.HUO] = ATTR.HUO_SKILL_LEVEL;
		this.fiveElemMapAttrIds[FIVEELEM_TYPE.TU] = ATTR.TU_SKILL_LEVEL;
	};
	
	this.getAddLevel = function(g, hero, skillRes){
		var attrId = this.fiveElemMapAttrIds[skillRes.fiveelem];
		if ( !attrId ) {
			return 0;
		}
		
		return g.getImgr().getHeroAttrVal(hero, attrId);
	};
}).snew();

TreatmentHeroHdr = Class.extern(function(){
	var m_g = null;
	var m_this = null;
	this.init = function() {
		m_this = this;
	};
	
	this.treatmentHeros = function(g, heroIds){
		var needNum = this.getNeedItemNumber(g, heroIds);
		if ( needNum == 0 ) {
			g.getGUI().sysMsgTips(SMT_NORMAL, rstr.herodlg.tips.fullhealth);
			return;
		}
		
		var hasNum = g.getImgr().getItemNumByResId(FIXID.SALVE);
		if ( needNum > hasNum ) {
			var msg = RStrUtil.makeNoSalveBuyMsg(FIXID.PKG_SALVE, needNum, hasNum);
			g.getGUI().msgBox(rstr.comm.msgts, msg, MB_F_CLOSE, null);
			return;
		}
		
		HeroSender.sendTreatments(g, heroIds);
	};
	
	this.getNeedItemNumber = function(g, heroids) {
		m_g = g;
		var needNumber = 0;
		for ( var i=0; i<heroids.length; ++i ) {
			var heroId = heroids[i];
			var hero = m_g.getImgr().getHero(heroId);
			if ( !hero ) continue;
			
			needNumber += _getTreatmentHeroNeedItemNumber(hero);
		}
		return needNumber;
	};
	
	var _getTreatmentHeroNeedItemNumber = function(hero){
		var imgr = m_g.getImgr();
		var health = imgr.getHeroAttrVal(hero, ATTR.HEALTH);
		var mhealth = imgr.getHeroAttrVal(hero, ATTR.MHEALTH);
		if ( health == mhealth ) {
			return 0;
		}

		var effect = ItemResUtil.findEffectres(FIXID.SALVE, RES_EFF.ADDHEROHEALTH);
		if (effect == null) {
			log('*error salve item effect is invalid, has no RES_EFF.ADDHEROHEALTH');
			return 1000000;
		}
		
		var drt = mhealth - health;
		var needNum = parseInt( (drt + effect.val - 1) / effect.val, 10 );
		return needNum;
	};
}).snew();

HeroDlgView = ListenerBaseDlg.extern(function(){
	var m_g;
	var m_this;
	var m_dlg;
	var m_items = {};
	var m_presenter=null;
	var m_infotab=null;
	var m_armtab=null;
	var m_skilltab=null;
	var m_offitab=null;
	
	//public:method
	this._init = function(){
		m_g = this.g_;
		m_this = this;
		m_infotab = HeroInfoTabView.snew(m_g, this);
		m_armtab = HeroArmTabView.snew(m_g, this);
		m_offitab = HeroOffiTabView.snew(m_g, this);
		m_skilltab = HeroSkillTabView.snew(m_g, this);
		m_jingmaitab = HeroJingmaiTabView.snew(m_g, this);
	};
	
	this.getArmView = function(){
		return m_armtab;
	};
	
	this.getCtrl = function(ctrlname){
		return m_items[ctrlname];
	};
	
	this.beforeChangeHero = function(){
		m_infotab.beforeChangeHero();
	};
	
	this.heroUpdate = function(){
		_updateHeroList();
		m_infotab.update();
		m_armtab.update();
		m_offitab.update();
		m_skilltab.update();
		m_jingmaitab.update();
	};
	
	this.openDlg = function(){
		_initDlg();
		_openDlg();
		_initInfo();
		this._notifyOpenDlg();
	};
	
	this.closeDlg = function(){
		if ( m_dlg ) m_dlg.hide();
	};
	
	this.setPresenter = function(presenter){
		m_presenter = presenter;
		m_infotab.setPresenter(m_presenter);
		m_armtab.setPresenter(m_presenter);
		m_offitab.setPresenter(m_presenter);
		m_skilltab.setPresenter(m_presenter);
		m_jingmaitab.setPresenter(m_presenter);
	};
	
	this.setModel = function(model){
		m_infotab.setModel(model);
		m_armtab.setModel(model);
		m_offitab.setModel(model);
		m_skilltab.setModel(model);
		m_jingmaitab.setModel(model);
	};
	
	this.isShow = function() {
		return m_dlg && m_dlg.isShow();
	};
	
	var _initDlg = function(){
		if ( !m_dlg ) {
			m_dlg = Dialog.snew(m_g,{modal:false,	title:rstr.herodlg.title, pos:{x:"center", y:30} });
			m_g.getGUI().initDlg(m_dlg, uicfg.hero.herodlg, m_items);
			m_dlg.setCaller({self:m_this,caller:_onDlgEvent});

			m_infotab.initDlg( m_items.tablist.getTabItems(HERODLG_TAB_INFO_IDX) );
			m_armtab.initDlg( m_items.tablist.getTabItems(HERODLG_TAB_ARM_IDX) );
			m_jingmaitab.initDlg( m_items.tablist.getTabItems(HERODLG_TAB_JINGMAI_IDX) );
			m_skilltab.initDlg( m_items.tablist.getTabItems(HERODLG_TAB_SKILL_IDX) );
			m_offitab.initDlg( m_items.tablist.getTabItems(HERODLG_TAB_OFFI_IDX) );
			
			if ( m_presenter ) {
				m_presenter.initDlg();
			}
		}
		m_dlg.show();
	};
	
	var _openDlg = function(){
		m_skilltab.openDlg();
		m_jingmaitab.openDlg();
	};
	
	var _initInfo = function(){
		m_items.herolist.setCurSel(0);
	};
	
	var _onDlgEvent = function(id) {
		if ( id == C_SYS_DLG_HIDE ){
			m_skilltab.closeDlg();
			m_jingmaitab.closeDlg();
		}
	};
	
	var _updateHeroList = function(){
		if ( !m_this.isShow() ) {
			return;
		}
		
		var imgr = m_g.getImgr();
		var backsel = m_items.herolist.getCurSel();
		var heros = imgr.getHeros().list;
		m_items.herolist.setItemCount(heros.length);
		for ( var i=0; i<heros.length; ++i ) {
			var litem = m_items.herolist.getItem(i);
			var hero = heros[i];
			TQ.setRichText(litem.exsubs.name, HeroNameColorGetter.getColorName(hero));
			TQ.setText(litem.exsubs.level, hero.level);
			TQ.setRichText(litem.exsubs.state, rstr.comm.herostate[hero.state]);
			TQ.setRichText(litem.exsubs.fightcap, TQ.format(rstr.herodlg.lbl.fmt2fightcap, imgr.getHeroAttrVal(hero, ATTR.SFC)));
		}
		
		if ( backsel >= heros.length ) {
			m_items.herolist.setCurSel( heros.length - 1 );
		}
	};
});

HeroInfoTabView = Class.extern(function(){
	var m_g;
	var m_this;
	var m_parent=null;
	var m_presenter=null;
	var m_items=null;
	var m_attrsview=null;
	var m_model=null;
	
	this.init = function(g, parent) {
		m_this = this;
		m_g = g;
		m_parent = parent;
		m_attrsview = HeroTabViewAttr.snew(m_g);
	};
	
	this.setPresenter = function(presenter) {
		m_presenter = presenter;
	};
	
	this.setModel = function(model) {
		m_model = model;
	};
	
	this.initDlg = function(items) {
		m_items = items;
		m_attrsview.setItems(m_items);
	};
	
	this.beforeChangeHero = function(){
	};
	
	this.update = function(){
		if ( !m_parent.isShow() ) return;
		
		var hero = m_model.getCurHero();
		if ( !hero ) {
			_clearHeroInfo();
			return;
		}
		
		if ( !m_g.getImgr().isDetailHero(hero) ) { 
			return;
		}
		
		_enableHeroInfoBtns(true);
		
		_setCommonAttrs(hero);
		_setExpAttrBar(hero);
		_setSubjectAttr(hero);
		_setBaseAttrs(hero);
	};
	
	var _setCommonAttrs = function(hero) {
		m_attrsview.setHeroIcon(hero);
		m_attrsview.setHeroName(hero);
		m_attrsview.setOfficialName(hero);
		
		var imgr = m_g.getImgr();
		TQ.setTextEx(m_items.level, TQ.format(rstr.herodlg.lbl.fmtlevel, hero.level));
		TQ.setTextEx(m_items.fightcap, TQ.format(rstr.herodlg.lbl.fmtfightcap, imgr.getHeroAttrVal(hero, ATTR.SFC)));
		TQ.setTextEx(m_items.innerforce, imgr.getHeroAttrVal(hero, ATTR.IF));
		TQ.setTextEx(m_items.health, RStrUtil.getColorHealthVal(imgr.getHeroAttrVal(hero, ATTR.HEALTH)) );
		TQ.setTextEx(m_items.credit, imgr.getHeroAttrVal(hero, ATTR.CRE) );
		TQ.setTextEx(m_items.prof, rstr.comm.heroprofs[hero.prof]);
		TQ.setTextEx(m_items.command, imgr.getHeroAttrVal(hero, ATTR.CO) );
	};
	
	var _setExpAttrBar = function(hero) {
		_setExpbarShowFlag(PROGBAR_SHOWFLAG_PER);
		var imgr = m_g.getImgr();
		m_items.expbar.setRange(imgr.getHeroAttrVal(hero, ATTR.NXP));
		m_items.expbar.setValue(0, imgr.getHeroAttrVal(hero, ATTR.XP));
	};
	
	var _setSubjectAttr = function(hero) {
		var s = '';
		for ( var i in hero.subjects ) s +=  rstr.recruitherodlg.subjects[i] + ':' + SubjectColorGetter.getColorVal(hero.subjects[i]) + '  ';
		TQ.setTextEx(m_items.subject, s);
	};
	
	var _setBaseAttrs = function(hero) {
		var imgr = m_g.getImgr();
		TQ.setText(m_items.hurt, imgr.getHeroAttrVal(hero, ATTR.HU));
		TQ.setText(m_items.def, imgr.getHeroAttrVal(hero, ATTR.DE));
		TQ.setText(m_items.agile, imgr.getHeroAttrVal(hero, ATTR.AG));
		TQ.setText(m_items.physical, imgr.getHeroAttrVal(hero, ATTR.PS));
	};
	
	var _clearHeroInfo = function() {
		_enableHeroInfoBtns(false);
		_setExpbarShowFlag(PROGBAR_SHOWFLAG_NONE);
		IMG.setBKImage(m_items.icon, '');
		var valdoms = ['name', 'level', 'fightcap', 'innerforce', 'health', 'official', 'prof', 'credit', 'command', 'subject', 'hurt', 'def', 'agile', 'physical'];
		for ( k in valdoms ) {
			TQ.setText(m_items[ valdoms[k] ], '' );
		}
	};
	
	var _enableHeroInfoBtns = function(flag) {
		var btns = ['assignexp', 'treatment', 'appoint'];
		for ( k in btns ) {
			m_items[ btns[k] ].enable(flag);
		}
	};
	
	var _setExpbarShowFlag = function(showflag) {
		m_items.expbar.setShowFlag(showflag);
		m_items.expbar.setRange(1);
		m_items.expbar.setValue(0,0);
	};	
});

HeroArmTabView = Class.extern(function(){
	//HeroArmTabView-unittest-start
	var m_g;
	var m_this;
	var m_parent=null;
	var m_items=null;
	var m_presenter=null;
	var m_model=null;	
	var m_isArmPosItemsChanged = null;
	var m_wearListPos = [{x:38,y:8},{x:6,y:84},{x:71,y:84},{x:6,y:164},{x:71,y:164},{x:6,y:244},{x:71,y:244}];
	
	this.init = function(g, parent) {
		m_this = this;
		m_g = g;
		m_parent = parent;
		m_this.setItemChanged();
	};
	
	this.setPresenter = function(presenter) {
		m_presenter = presenter;
	};
	
	this.setModel = function(model) {
		m_model = model;
	};	
	
	this.initDlg = function(items) {
		m_items = items;
		_initWearListPos();
		_initArmsTab();
	};	
	
	this.update = function(){
		if ( !m_parent.isShow() ) {
			return;
		}
		
		_updateWearList();
		_updateCurArmList();
	};
	
	this.updateArmList = function(){
		if ( !m_parent.isShow() ) {
			return;
		}
		
		_updateCurArmList();
	};
	
	this.setItemChanged = function(){
		m_isArmPosItemsChanged = [true, true, true, true, true, true, true, true];
	};
	
	var _initWearListPos = function(){
		for ( var i=0; i<m_items.wearList.getCount(); ++i ) {
			var item = m_items.wearList.getItem(i).item;
			TQ.setCSS(item, 'float', 'none');
			TQ.setCSS(item, 'position', 'absolute');
			TQ.setDomPos(item, m_wearListPos[i].x, m_wearListPos[i].y);
		}
	};
	
	var _initArmsTab = function(){
		_setArmsTabText();
		m_items.armsTab.activeTab(1);
		m_items.armsTab.hideTabCtrl();
	};
	
	var _setArmsTabText = function(){
		for ( var i=0; i<m_items.armsTab.getTabCount(); ++i ) {
			m_items.armsTab.setTabText(i, rstr.herodlg.armTabs[i]);
		}
	};
	
	var _updateWearList = function(){
		var hero = m_model.getCurHero();
		if (!hero || !hero.wears) {
			_clearWearList();
			return;
		}
		
		_setWearList(hero);
	};
	
	var _clearWearList = function() {
		for ( var i=0; i<m_items.wearList.getCount(); ++i ) {
			var item = m_items.wearList.getItem(i);
			_clearWearUIItem(item);
		}
	};
	
	var _setWearList = function(hero) {
		for ( var i=0; i<m_items.wearList.getCount(); ++i ) {
			var item = m_items.wearList.getItem(i);
			var gridPos = i + 1;
			var wear = hero.wears[gridPos];
			if ( wear ) {
				var itemRes = ItemResUtil.findItemres(wear.resid);
				CommDrawItem.drawItemIcon(item.exsubs.icon, itemRes);
			} else {
				_clearWearUIItem(item);
			}
		}
	};
	
	var _clearWearUIItem = function(item){
		IMG.setBKImage(item.exsubs.icon, '');
		TQ.setClass(item.exsubs.icon, '');
	};

	var _updateCurArmList = function(){
		var armPos = m_items.armsTab.getActiveTab();
		if ( !m_isArmPosItemsChanged[armPos] ) {
			return;
		} else {
			m_isArmPosItemsChanged[armPos] = false;
		}
		
		var armList = m_items.armsTab.getTabItems(armPos).armList;
		
		var armPosFilter = ArmPosFilter.snew(m_g);
		var fitPosArms = armPosFilter.filter({armPos:armPos});
		
		var classRangeFilter = ItemClassRangeFilter.snew(m_g);
		var arms = classRangeFilter.filter({classId:RES_CLS.HEROEQUIPITEM, items:fitPosArms});
		
		m_model.setArmPosArms(armPos, arms);
		
		armList.setItemCount(arms.length);
		
		for (var i=0; i<arms.length; ++i) {
			var arm = arms[i];
			var item = armList.getItem(i);
			CommDrawItem.drawItemIcon(item.exsubs.icon, arm.itemres);
		}
		
		m_presenter.getArmPresenter().setArmListTipCaller();
	};
	
	//HeroArmTabView-unittest-end
});

HeroOffiTabView = Class.extern(function(){
	var m_g;
	var m_this;
	var m_parent=null;
	var m_presenter=null;
	var m_model=null;
	var m_items=null;
	var m_attrsview=null;
	
	this.init = function(g, parent) {
		m_this = this;
		m_g = g;
		m_parent = parent;
		m_attrsview = HeroTabViewAttr.snew(m_g);
	};
	
	this.setPresenter = function(presenter) {
		m_presenter = presenter;
	};
	
	this.setModel = function(model) {
		m_model = model;
	};
	
	this.initDlg = function(items) {
		m_items = items;
		m_attrsview.setItems(m_items);
		TQ.setText( m_items.desc, rstr.herodlg.lbl.getCreditDesc );
	};
	
	this.update = function(){
		if ( !m_parent.isShow() ) return;
		var hero = m_model.getCurHero();
		if ( !hero ) {
			_clearHeroInfo();
			return;
		}
		
		if ( !m_g.getImgr().isDetailHero(hero) ) { 
			return;
		}
		
		m_items.conge.enable( hero.official > 0 );
		
		m_attrsview.setHeroIcon(hero);
		m_attrsview.setHeroName(hero);
		m_attrsview.setOfficialName(hero);
		
		var imgr = m_g.getImgr();
		TQ.setText(m_items.credit, imgr.getHeroAttrVal(hero, ATTR.CRE) );
		TQ.setText(m_items.command, imgr.getHeroAttrVal(hero, ATTR.CO) );
		
		_setList();
	};
	
	var _clearHeroInfo = function(){
		m_items.conge.enable( false );
		IMG.setBKImage(m_items.icon, '');
		TQ.setText(m_items.name, '');
		TQ.setText(m_items.official, '');  
		TQ.setText(m_items.credit, '' );
		TQ.setText(m_items.command, '' );
		m_items.list.setItemCount(0);
	};
	
	var _setList = function(){
		var res = m_model.getOfficialRes();
		m_items.list.setItemCount( _getCanConferOfficialCnt(res) );
		for ( var i=0; i<res.nums.length; ++i  ) {
			var maxnum = res.nums[i];
			if ( maxnum == 0 ) break;
			
			var officialId = i + 1;
			var itemres = TQ.qfind(res_heroofficials, 'id', officialId);
			var item = m_items.list.getItem(i);
			TQ.setText(item.exsubs.name, itemres.name);
			TQ.setText(item.exsubs.num, m_model.getOfficialCnt(officialId) + '/' + maxnum );
			TQ.setText(item.exsubs.add, TQ.format(rstr.herodlg.lbl.officialcomadd, itemres.addcom)  );
			TQ.setText(item.exsubs.need, TQ.format(rstr.herodlg.lbl.officialneed, itemres.needcredit, itemres.needitem)  );
		}
	};
	
	var _getCanConferOfficialCnt = function(res) {
		var listcnt = 0;
		for ( var i = 0; i<res.nums.length; ++i  ) {
			if ( res.nums[i] == 0 ) break;
			listcnt++;
		}
		return listcnt;
	};
});

HeroJingmaiTabView = Class.extern(function(){
	var m_g;
	var m_this;
	var m_parent=null;
	var m_presenter=null;
	var m_model=null;
	var m_items=null;
	var m_isShow = false;
	
	this.init = function(g, parent) {
		m_this = this;
		m_g = g;
		m_parent = parent;
		m_g.regEvent(EVT.PKG_CHANGE, 0, m_this, _onItemChanged);
	};
	
	this.setPresenter = function(presenter) {
		m_presenter = presenter;
	};
	
	this.setModel = function(model) {
		m_model = model;
	};
	
	this.initDlg = function(items) {
		m_items = items;
	};
	
	this.openDlg = function(){
		m_g.regUpdater(m_this, _onUpdate, 1000);
		m_isShow = true;
	};
	
	this.closeDlg = function(){
		m_g.unregUpdater(m_this, _onUpdate);
		m_isShow = false;
	};
	
	this.update = function(){
		if ( !m_parent.isShow() ) return;
		var hero = m_model.getCurHero();
		if ( !hero ) {
			_clearHeroInfo();
			return;
		}
		
		if ( !m_g.getImgr().isDetailHero(hero) ) { 
			return;
		}
		
		if ( hero.level < res_hero_hasjingmai_minlevel ) {
			_hideJingMaiPanel();
			return;			
		}
		
		_showJingMaiPanel();
		TQ.setClass( m_items.jingmaibk, hero.icon < 200 ? 'jingmaibk_nan' : 'jingmaibk_nv');
		
		var imgr = m_g.getImgr();
		TQ.setText( m_items.curinnerforce, imgr.getHeroAttrVal(hero, ATTR.IF) );
		TQ.setText( m_items.maxinnerforce, imgr.getHeroAttrVal(hero, ATTR.MIF) );
		
		_setStrDesc(hero.id);
		
		_updateHasItems();
		
		TQ.setHtml(m_items.steeldesc, _getSteelDesc(hero));
		
		m_items.istrtimes.setVal(1);
		
		m_items.buyitem.enable(true);
		m_items.strengthen.enable(true);
		
		_setSteelLeftTime(hero);
		_setSpeedSteelBtn(hero);
		_setSteelBtn(hero);
		
		_setMaiLouNodesImage(hero);
	};
	
	var _updateHasItems = function(){
		TQ.setHtml(m_items.hasstritem, rstr.herodlg.lbl.hasstritem + m_g.getImgr().getItemNumByResId(FIXID.CHILINGDAN) );
	};
	
	var _onItemChanged = function(){
		if ( !m_isShow ) return;
		_updateHasItems();
	};
	
	var _onUpdate = function(cltTimeMs) {
		var hero = m_model.getCurHero();
		if ( !hero ) return;
		_setSteelLeftTime(hero);
	};
	
	var _clearHeroInfo = function(){
		m_items.istrtimes.setVal(1);
		TQ.setText( m_items.curinnerforce, '' );
		TQ.setText( m_items.maxinnerforce, '' );
		TQ.setHtml( m_items.hasstritem, '' );
		TQ.setTextEx( m_items.strdesc.getContainerObj(), '' );
		m_items.strdesc.refresh();
		TQ.setText( m_items.steeldesc, '' );
		TQ.setText( m_items.steeltime, '' );
		
		m_items.buyitem.enable(false);
		m_items.strengthen.enable(false);
		m_items.steeljingmai.enable(false);
		m_items.speedsteel.hide();
		
		TQ.setClass( m_items.jingmaibk, 'jingmaibk_nan');
		_clearMaiLouNodesImage();
		_hideJingMaiPanel();
	};
	
	var _setStrDesc = function(heroid) {
		TQ.setTextEx( m_items.strdesc.getContainerObj(), m_presenter.getStrIFResult(heroid) );
		m_items.strdesc.refresh();
	};
	
	var _setSteelLeftTime = function(hero) {
		if ( _isSkeletonSteeling(hero) ) {
			var lefttime = Math.max(0, hero.skeleton.stoptime - m_g.getSvrTimeS());
			TQ.setText( m_items.steeltime, rstr.herodlg.lbl.ssteeltime + TQ.formatTime(0, lefttime) );
		}
		else {
			TQ.setText( m_items.steeltime, '' );
		}
	};
	
	var _setSpeedSteelBtn = function(hero) {
		m_items.speedsteel[ _isSkeletonSteeling(hero) ? 'show' : 'hide' ]();
	};
	
	var _setSteelBtn = function(hero) {
		if ( _isSkeletonSteeling(hero) ) {
			m_items.steeljingmai.show();
			m_items.steeljingmai.enable(false);
			m_items.steeljingmai.setText(rstr.herodlg.btns.ssteeling);
		}
		else if ( _isFullSkeletonLevel(hero) ){
			m_items.steeljingmai.hide();
		}
		else {
			m_items.steeljingmai.show();
			m_items.steeljingmai.enable(true);
			m_items.steeljingmai.setText(rstr.herodlg.btns.steeljingmai);
		}
	};
	
	var _setMaiLouNodesImage = function(hero){
		for ( var i=1; i<=res_herojingmai.length; ++i ) {
			var img = '';
			if ( i <= hero.skeleton.level ) {
				img = 'hero/mailuo/normal.gif';
			} else if ( i == hero.skeleton.level + 1 ) {
				img = 'hero/mailuo/sel.gif';
			} else {
				img = 'hero/mailuo/disable.gif';
			}
			IMG.setBKImage( m_items['jingmai'+i], IMG.makeImg(img) );
		}
	};
	
	var _clearMaiLouNodesImage = function(){
		for ( var i=1; i<=res_herojingmai.length; ++i ) {
			var img = 'hero/mailuo/disable.gif';
			IMG.setBKImage( m_items['jingmai'+i], IMG.makeImg(img) );
		}
	};
	
	var _isSkeletonSteeling = function(hero) {
		return ( hero.skeleton.stoptime ) ? true : false;
	};
	
	var _isFullSkeletonLevel = function(hero) {
		return hero.skeleton.level >= res_herojingmai.length;
	};
	
	var _getSteelDesc = function(hero) {
		if ( !hero.skeleton ) return '';
		
		var s = m_model.getMaiLuoNodeDesc(hero.skeleton.level);
		if ( s != '' ) s += '<br/>';
		s += m_model.getNextMaiLuoNodeDesc(hero.skeleton.level);
		return s;
	};
	
	var _hideJingMaiPanel = function() {
		TQ.setCSS(m_items.nojingmailabel, 'display', 'block');
		TQ.setCSS(m_items.innerForcePanel, 'display', 'none');
		TQ.setCSS(m_items.jingmaibk, 'display', 'none');
		TQ.setCSS(m_items.jingMaiInfoPanel, 'display', 'none');
	};
	
	var _showJingMaiPanel = function() {
		TQ.setCSS(m_items.nojingmailabel, 'display', 'none');
		TQ.setCSS(m_items.innerForcePanel, 'display', 'block');
		TQ.setCSS(m_items.jingmaibk, 'display', 'block');
		TQ.setCSS(m_items.jingMaiInfoPanel, 'display', 'block');
	};
});

HeroSkillTabView = Class.extern(function(){
	var m_g;
	var m_this;
	var m_parent=null;
	var m_presenter=null;
	var m_model=null;
	var m_items=null;
	var m_attrsview=null;
	
	this.init = function(g, parent) {
		m_this = this;
		m_g = g;
		m_parent = parent;
		m_attrsview = HeroTabViewAttr.snew(m_g);
	};
	
	this.setPresenter = function(presenter) {
		m_presenter = presenter;
	};
	
	this.setModel = function(model) {
		m_model = model;
	};
	
	this.initDlg = function(items) {
		m_items = items;
		_createMenus();
		m_attrsview.setItems(m_items);
	};
	
	this.openDlg = function(){
		m_g.regUpdater(m_this, _onUpdate, 1000);
	};
	
	this.closeDlg = function(){
		m_g.unregUpdater(m_this, _onUpdate);
	};
	
	this.update = function(){
		if ( !m_parent.isShow() ) return;
		var hero = m_model.getCurHero();
		if ( !hero ) {
			_clearHeroInfo();
			return;
		}
		
		if ( !m_g.getImgr().isDetailHero(hero) ) { 
			return;
		}
		
		if ( hero.level < res_hero_hasskill_minlevel ) {
			m_attrsview.setHeroIcon(hero);
			_hideSkillPanel();
			return;
		}
		
		m_attrsview.setHeroIcon(hero);
		_showSkillPanel();
		_setCanUseSteelTime();
		_setWhichSkillSteel(hero);
		_setSkillSteelTime(hero);
		_setSpeedSteelBtn(hero);
		_setAllListCount(hero);
		_setCurSpecSkill(hero);
		_setBaseSkillList(hero);
		_setTacticSkillList(hero);
		_showOrHideSpecSkilLabel(hero);
		_setSpecSkillList(hero);
	};
	
	var _createMenus = function(){
		m_items.steelmenu = new Menu(m_g,{width:80});
		m_items.steelmenu.addMenuItem( {id:0, icon:null, text:rstr.herodlg.menu.steelbaseskill} );
		
		m_items.learntskillmenu = new Menu(m_g,{width:80});
		m_items.learntskillmenu.addMenuItem( {id:0, icon:null, text:rstr.herodlg.menu.learntskill} );
		
		m_items.weartskillmenu = new Menu(m_g,{width:80});
		m_items.weartskillmenu.addMenuItem( {id:0, icon:null, text:rstr.herodlg.menu.weartskill} );
		
		m_items.unweartskillmenu = new Menu(m_g,{width:80});
		m_items.unweartskillmenu.addMenuItem( {id:0, icon:null, text:rstr.herodlg.menu.unweartskill} );

		m_items.learnsskillmenu = new Menu(m_g,{width:80});
		m_items.learnsskillmenu.addMenuItem( {id:0, icon:null, text:rstr.herodlg.menu.learnsskill} );
	};
	
	var _clearHeroInfo = function(){
		_clearAllBkImage();
		_hideSkillPanel();
	};
	
	var _onUpdate = function(cltTimeMs) {
		var hero = m_model.getCurHero();
		if ( !hero ) return;
		
		_setSkillSteelTime(hero);
	};
	
	var _setWhichSkillSteel = function (hero) {
		if ( hero.skillsteel.id == 0 ) {
			TQ.setTextEx(m_items.whichskillsteel, rstr.herodlg.lbl.noskillsteel);
		} else {
			var res = ItemResUtil.findItemres(hero.skillsteel.id);
			var s = TQ.format(rstr.herodlg.lbl.whichskillsteel, res.name);
			TQ.setTextEx(m_items.whichskillsteel, s);
		}
	};
	
	var _setSkillSteelTime = function(hero){
		if ( !hero.skillsteel ) return;
		
		if ( hero.skillsteel.stoptime == 0 ) {
			TQ.setTextEx(m_items.steellefttime, '');
		}
		else {
			var lefttime = Math.max( 0, hero.skillsteel.stoptime - m_g.getSvrTimeS() );
			TQ.setTextEx( m_items.steellefttime, rstr.herodlg.lbl.skillsteellefttime + TQ.formatTime(0, lefttime) );
		}
	};
	
	var _setSpeedSteelBtn = function(hero){
		var isshow = (hero.skillsteel.id > 0) && (hero.skillsteel.stoptime > 0);
		if ( isshow ) m_items.speedsteel.show();
		else m_items.speedsteel.hide();
	};
	
	var _setCanUseSteelTime = function(){
		var canusetime = m_g.getImgr().getCanUseSkillSteelTime();
		TQ.setTextEx( m_items.cansteeltime, TQ.format(rstr.herodlg.lbl.leftskillsteeltime, canusetime) );
	};
	
	var _setAllListCount = function(hero){
		m_items.specskilllist.setItemCount( hero.prof == 1 ? MAX_SPECSKILL_GRIDCNT : 0 );
		m_items.baseskilllist.setItemCount(MAX_BASESKILL_GRIDCNT);
		m_items.tacticskilllist.setItemCount(MAX_TACTICSKILL_GRIDCNT);
	};
	
	var _setCurSpecSkill = function(hero) {
		if ( hero.curtskill ) {
			var res = ItemResUtil.findItemres(hero.curtskill);
			IMG.setBKImage(m_items.curtacticskill, IMG.makeSmallImg(res.smallpic));
		}
		else {
			IMG.setBKImage(m_items.curtacticskill, '');
		}
	};
	
	var _setBaseSkillList = function(hero){
		_setBaseSkillEmptyGridList(hero);
		_setBaseSkillHasGridList(hero);
		_setBaseSkillLockedGridList(hero);
	};
	
	var _setBaseSkillEmptyGridList = function(hero) {
		var canusegirdcnt = res_get_basegridcnt_by_herolevel(hero.level);
		for ( var i=0; i<canusegirdcnt; ++i ) {
			var item = m_items.baseskilllist.getItem(i);
			IMG.setBKImage(item.exsubs.icon, '');
			TQ.setTextEx(item.exsubs.num, '');
			TQ.setTextEx(item.exsubs.bnum, '');
		}
	};
	
	var _setBaseSkillHasGridList = function(hero) {
		for ( var i=0, idx=0; i<hero.skills.length; ++i ) {
			var skill = hero.skills[i];
			if ( skill.id < res_hero_baseskill_id_first || skill.id > res_hero_baseskill_id_last  ) continue;
			
			var res = ItemResUtil.findItemres(skill.id);
			var item = m_items.baseskilllist.getItem(idx++);
			IMG.setBKImage(item.exsubs.icon, IMG.makeSmallImg(res.smallpic));
			
			var addFrontLevel = '';
			var addBackLevel = '';
			var addLevelVal = AddLevelByHeroFiveElemAttr.getAddLevel(m_g, hero, res);
			if (addLevelVal > 0) {
				addFrontLevel = '(' + TQ.formatColorStr('+' + addLevelVal, COLORS.APPEND_ATTR) + ')';
				addBackLevel = '(' + '+' + addLevelVal + ')';
			}
			
			var skillLevel = skill.level + '#addLevel#/' + res_hero_baseskill_maxlevel;
			TQ.setTextEx(item.exsubs.num, skillLevel.replace('#addLevel#', addFrontLevel) );
			TQ.setTextEx(item.exsubs.bnum, skillLevel.replace('#addLevel#', addBackLevel));
		}
	};
	
	var _setBaseSkillLockedGridList = function(hero) {
		var lockStartIdx = res_get_basegridcnt_by_herolevel(hero.level);
		for ( var i=lockStartIdx; i<MAX_BASESKILL_GRIDCNT; ++i ) {
			var item = m_items.baseskilllist.getItem(i);
			IMG.setBKImage(item.exsubs.icon, IMG.makeImg('hero/skilllock.gif') );
			TQ.setTextEx(item.exsubs.num, '');
			TQ.setTextEx(item.exsubs.bnum, '');
		}
	};
	
	var _setTacticSkillList = function(hero) {
		for ( var i=0; i<MAX_TACTICSKILL_GRIDCNT; ++i ) {
			var skill = m_g.getImgr().getTacticSkillByIdx(hero, i);
			var res = ItemResUtil.findItemres( skill.id );
			var item = m_items.tacticskilllist.getItem(i);
			IMG.setBKImage( item.exsubs.icon, IMG.makeSmallImg(res.smallpic) );
			var skillLevel = skill.level + '/' + res_hero_tacticskill_maxlevel;
			TQ.setTextEx(item.exsubs.num, skillLevel);
			TQ.setTextEx(item.exsubs.bnum, skillLevel);
		}
	};
	
	var _showOrHideSpecSkilLabel = function(hero){
		TQ.setCSS(m_items.zhuanjingskillLbl, 'display', hero.prof==1 ? 'block' : 'none');
	};
	
	var _setSpecSkillList = function(hero){
		for ( var i=0; i<m_items.specskilllist.getCount(); ++i ) {
			var skill = m_g.getImgr().getSpecSkillByIdx(hero, i);
			var res = ItemResUtil.findItemres( skill.id );
			var item = m_items.specskilllist.getItem(i);
			IMG.setBKImage( item.exsubs.icon, IMG.makeSmallImg(res.smallpic) );
			var skillLevel = skill.level + '/' + res_hero_specskill_maxlevel;
			TQ.setTextEx(item.exsubs.num, skillLevel);
			TQ.setTextEx(item.exsubs.bnum, skillLevel);
		}
	};
	
	var _clearAllBkImage = function() {
		IMG.setBKImage(m_items.icon, '');
	};
	
	var _clearAllListCount = function() {
		m_items.baseskilllist.setItemCount(0);
		m_items.tacticskilllist.setItemCount(0);
		m_items.specskilllist.setItemCount(0);
	};
	
	var _hideSkillPanel = function() {
		TQ.setCSS(m_items.noskilllabel, 'display', 'block');
		TQ.setCSS(m_items.hasskillpanel, 'display', 'none');
	};
	
	var _showSkillPanel = function() {
		TQ.setCSS(m_items.noskilllabel, 'display', 'none');
		TQ.setCSS(m_items.hasskillpanel, 'display', 'block');
	};
});

HeroTabViewAttr = Class.extern(function(){
	var m_g=null;
	var m_items=null;
	this.init = function(g) {
		m_g = g;
	};
	
	this.setItems = function(items){
		m_items = items;
	};
	
	this.setHeroIcon = function(hero) {
		IMG.setBKImage(m_items.icon, IMG.makeBigImg(hero.icon));
	};
	
	this.setHeroName = function(hero) {
		TQ.setText(m_items.name, hero.name);
	};
	
	this.setOfficialName = function(hero) {
		var officialres = TQ.qfind(res_heroofficials, 'id', hero.official);
		var name = officialres ? officialres.name : rstr.herodlg.lbl.noofficial;
		TQ.setText(m_items.official, name); 
	};
});

HeroDlgModel = Class.extern(function(){
	//HeroDlgModel-unittest-start
	var m_g=null;
	var m_this=null;
	var m_curheroidx=-1;
	var m_armPosArms = {};
	this.init = function(g) {
		m_g = g;
		m_this = this;
	};
	
	this.handleHeroSvrData = function(ndata) {
		if ( ndata.data.heros ) {
			var imgr = m_g.getImgr();
			var heros = imgr.getHeros();
			TQ.dictCopy( heros.list, ndata.data.heros );
			
			var _levelDescComp = function(a, b){
				if ( b.level != a.level ) return b.level - a.level;
				
				var a_fc = imgr.getHeroAttrVal(a, ATTR.FC);
				var b_fc = imgr.getHeroAttrVal(b, ATTR.FC);
				if ( b_fc != a_fc ) return b_fc - a_fc;
				
				var a_sfc = imgr.getHeroAttrVal(a, ATTR.SFC);
				var b_sfc = imgr.getHeroAttrVal(b, ATTR.SFC);
				return b_sfc - a_sfc;
			};
			heros.list.sort(_levelDescComp);
			
			_initHerosWearsItemres( heros.list );
			imgr.setHerosDefaultInfo();
			m_g.pendReplaceEvent({eid:EVT.HERO_UPDATE, sid:0, pendtime:50});
		}
		
		if ( ndata.data.canusesstime != undefined ) {
			m_g.getImgr().setCanUseSkillSteelTime( ndata.data.canusesstime );
			m_g.pendReplaceEvent({eid:EVT.HERO_UPDATE, sid:0, pendtime:50});
		}
	};
	
	this.getOfficialRes = function(){
		var rolelevel = m_g.getImgr().getRoleLevel();
		for ( var i=0; i<res_roleofficials.length; ++i ) {
			var r = res_roleofficials[i];
			if ( rolelevel <= r.level ) return r;
		}
		return null;
	};
	
	this.getOfficialCnt = function(officialId){
		var cnt = 0;
		var heros = m_g.getImgr().getHeros().list;
		for ( var i=0; i<heros.length; ++i ) {
			if ( officialId == heros[i].official ) cnt++;
		}
		return cnt;
	};
	
	this.getStrIFNeedItemNumber = function(hero) {
		var imgr = m_g.getImgr();
		return res_get_str_if_need_itemnum( hero.skeleton.level );
	};
	
	this.getSubjectTip = function(heroidx){
		var imgr = m_g.getImgr();
		var hero = imgr.getHeroByIdx(heroidx);
		if ( hero == null ) return '';
		var s = '<div class=subjecttip>';
		s += rstr.herodlg.lbl.subjecttitle + '<br/>';
		for ( var i=0; i<hero.subjects.length; ++i ){
			s += rstr.recruitherodlg.subjects[i]+rstr.comm.colon+_getStarStringByNum(hero.subjects[i])+'<br/>';
		}
		s += '</div>';
		return s;
	};
	
	this.getExpBarTip = function(heroidx){
		var imgr = m_g.getImgr();
		var hero = imgr.getHeroByIdx(heroidx);
		if ( hero == null ) return '';
		
		var s = '<div class=heroexpbartip>';
		s += rstr.herodlg.tips.curexp + imgr.getHeroAttrVal(hero, ATTR.XP);
		s += '<br/>';
		if ( hero.level < res_max_hero_level ) {
			s += rstr.herodlg.tips.needexp + imgr.getHeroAttrVal(hero, ATTR.NXP);
		}
		else {
			s += rstr.herodlg.tips.fulllevel;
		}
		s += '</div>';
		return s;
	};
	
	this.getMaiLuoNodeDesc = function(slevel){
		var s = '';
		var res = TQ.qfind(res_herojingmai, 'id', slevel);
		if ( res ) {
			s += '<center>' + res.name + '</center>';
			s += _getAttrEffectsDesc(res);
			s += _getMaxInnerforceDesc(res);
		}
		return s;
	};
	
	this.getNextMaiLuoNodeDesc = function(slevel){
		var s = '';
		var nextres = TQ.qfind(res_herojingmai, 'id', slevel+1);
		if ( nextres ) {
			s += '<center>' + rstr.herodlg.lbl.nextjingmaidesc + nextres.name + '</center>';
			s += _getAttrEffectsDesc(nextres);
			s += _getMaxInnerforceDesc(nextres);
			s += _getUpgradePreCondDesc(nextres);
			s += _getUpgradeExpendDesc(nextres);
		}
		return s;
	};
	
	this.setCurHeroIdx = function(curidx){
		m_curheroidx = curidx;
	};
	
	this.getCurHero = function(){
		return m_g.getImgr().getHeroByIdx(m_curheroidx);
	};
	
	this.setArmPosArms = function(armPos, arms){
		m_armPosArms[armPos] = arms;
	};
	
	this.getArmsByArmPos = function(armPos){
		return m_armPosArms[armPos];
	};
	
	var _initHerosWearsItemres = function(heros){
		for ( var heroIdx=0; heroIdx<heros.length; ++heroIdx ){
			var hero = heros[heroIdx];
			if (!hero.wears) continue;
			
			for ( var armPos in hero.wears ) {
				if ( !hero.wears[armPos] ) continue; 
				
				ItemResUtil.initItemres(hero.wears[armPos], 'resid');
			}
		}
	};
	
	var _getStarStringByNum = function(dlevel){
		var star = '';
		for ( var i=0; i<dlevel; ++i ){
			star += rstr.comm.star;
		}
		return star;
	};
	
	var _getAttrEffectsDesc = function(res) {
		var s = '';
		var maps = {'addhurt':ATTR.HU, 'adddef':ATTR.DE, 'addmps':ATTR.MPS, 
						   'addes':ATTR.ES, 'addber':ATTR.BER, 'addhit':ATTR.HI};
		for ( var k in maps ) {
			var addval = res[k];
			if ( !addval || !addval.val ) continue;
			
			var attrid = maps[k];
			var name = TQ.qfind(res_attrs, 'id', attrid).name;
			s += name + rstr.comm.colon + ' +' + addval.val;
			if ( addval.unit == VAL_UNIT.PER ) {
				s += '%';
			}
			s += '<br/>';
		}
		return TQ.formatColorStr(s, '#22ff22');
	};
	
	var _getMaxInnerforceDesc = function(res) {
		var s = rstr.herodlg.lbl.maxifdesc + res.maxif + '<br/>';
		return TQ.formatColorStr(s, '#22ff22');
	};
	
	var _getUpgradePreCondDesc = function(res) {
		var s = '<br/>';
		s += TQ.format(rstr.herodlg.lbl.nextprecond, res.prelevel, res.preif) + '<br/>';
		return TQ.formatColorStr(s, '#f0e000');
	};
	
	var _getUpgradeExpendDesc = function(res) {
		var s = TQ.format(rstr.herodlg.lbl.nextexpendmoney, res.needmoney) + '<br/>';
		if ( res.needitem ) {
			itemRes = ItemResUtil.findItemres(res.itemid);
			s += TQ.format(rstr.herodlg.lbl.nextexpenditem, itemRes.name, res.needitem) + '<br/>';
		}
		return TQ.formatColorStr(s, '#f0a000');
	};	
	//HeroDlgModel-unittest-end
});


HeroDlgPresenter = Class.extern(function(){
	var m_g=null;
	var m_this=null;
	var m_view=null;
	var m_model=null;
	var m_infotab=null;
	var m_armtab=null;
	var m_offitab=null;
	var m_jingmaitab=null;
	var m_strifresults={};
	this.init = function(g, view, model) {
		m_g = g;
		m_this = this;
		m_view = view;
		m_model = model;
		m_view.setPresenter(m_this);
		m_view.setModel(m_model);
		
		m_infotab = HeroInfoTabPresenter.snew(m_g, this, view, model);
		m_armtab = HeroArmTabPresenter.snew(m_g, this, view, model);
		m_offitab = HeroOffiTabPresenter.snew(m_g, this, view, model);
		m_jingmaitab = HeroJingmaiTabPresenter.snew(m_g, this, view, model);
		m_skilltab = HeroSkillTabPresenter.snew(m_g, this, view, model);
		
		m_g.regEvent(EVT.LOGIN_OK, 0, m_this, _onLoginOk);
		m_g.regEvent(EVT.NET, NETCMD.HERORES, m_this, _onSvrData);
		m_g.regEvent(EVT.HERO_UPDATE, 0, m_this, _onHeroUpdate);
	};
	
	this.getArmPresenter = function(){
		return m_armtab;
	};
	
	this.openDlg = function() {
		m_view.openDlg();
	};
	
	this.initDlg = function() {
		_setTabTitles();
		_setCallers();
	};
	
	this.hideDlg = function(){
		m_view.closeDlg();
	};
	
	this.isShow = function(){
		return m_view.isShow();
	};

	this.getStrIFResult = function(heroid){
		if ( m_strifresults[heroid] ) return m_strifresults[heroid];
		else return rstr.herodlg.lbl.ifstrdesc;
	};
	
	var _setTabTitles = function() {
		for ( var i=0; i<rstr.herodlg.tabs.length; ++i ) {
			m_view.getCtrl('tablist').setTabText(i, rstr.herodlg.tabs[i]);
		};
		m_view.getCtrl('tablist').activeTab(0);
	};
	
	var _setCallers = function() {	
		m_view.getCtrl('herolist').setCaller({self:m_this, caller:_onSelHero});
		m_infotab.setCaller();
		m_armtab.setCaller();
		m_offitab.setCaller();
		m_jingmaitab.setCaller();
		m_skilltab.setCaller();
	};
	
	var _onLoginOk = function(){
		HeroSender.sendGetAllHeros(m_g);
	};
	
	var _onSvrData = function(netdata){
		m_model.handleHeroSvrData(netdata);
		_makeStrIFResult(netdata.data.strifresult);
	};
	
	var _onHeroUpdate = function(){
		m_view.heroUpdate();
	};
	
	var _onSelHero = function(e, idx){
		m_model.setCurHeroIdx(idx);
		m_view.beforeChangeHero();
		m_view.heroUpdate();
		
		var hero = m_model.getCurHero();
		if ( !hero ) {
			return;
		}
		
		if ( m_g.getImgr().isDetailHero(hero) ) { 
			return;
		}
		
		HeroSender.sendGetDetail(m_g, hero.id);
	};
	
	var _makeStrIFResult = function(strifresult) {
		if ( !strifresult ) return;
		var hero = m_model.getCurHero();
		if ( !hero ) return;
		
		var s = '';
		for ( var i=0; i<strifresult.length; ++i ) {
			var val = strifresult[i];
			if ( val > 0 ) s += TQ.format(rstr.herodlg.lbl.resultsuccstrif, val) + '<br/>';
			else s += rstr.herodlg.lbl.resultsuccstriffull + '<br/>';
		}
		
		if ( !m_strifresults[hero.id] ) m_strifresults[hero.id] = '';
		m_strifresults[hero.id] = m_strifresults[hero.id] + s;
		m_g.sendEvent({eid:EVT.HERO_STRIF_RESULT, sid:0});
	};
});

HeroInfoTabPresenter = Class.extern(function(){
	var m_g=null;
	var m_this=null;
	var m_parent=null;
	var m_view=null;
	var m_model=null;
	var m_items=null;
	this.init = function(g, parent, view, model) {
		m_g = g;
		m_this = this;
		m_parent = parent;
		m_view = view;
		m_model = model;
	};
	
	this.setCaller = function(){
		m_items = m_view.getCtrl('tablist').getTabItems(HERODLG_TAB_INFO_IDX);
			
		var tip = TTIP.getTipById(m_items['tooltips'][TIP_PREFIX + 'subject']);
		tip.setCaller({self:m_this, caller:_onGetSubjectTooltip});
		var tip = TTIP.getTipById(m_items['tooltips'][TIP_PREFIX + 'expbar']);
		tip.setCaller({self:m_this, caller:_onGetExpBarTooltip});
		
		m_items.assignexp.setCaller({self:m_this, caller:_onClickAssignExps});
		m_items.treatment.setCaller({self:m_this, caller:_onClickTreatment});
		m_items.appoint.setCaller({self:m_this, caller:_onClickAppoint});	
	};
	
	var _onGetSubjectTooltip = function(){
		var cursel = m_view.getCtrl('herolist').getCurSel();
		return m_model.getSubjectTip(cursel);
	};
	
	var _onGetExpBarTooltip = function(){
		var cursel = m_view.getCtrl('herolist').getCurSel();
		return m_model.getExpBarTip(cursel);
	};	
	
	var _onGetCurHeroAttr = function(attrid) {
		var hero = m_model.getCurHero();
		if ( !hero ) return;
		
		var imgr = m_g.getImgr();
		return imgr.getHeroAttrVal(hero, attrid);
	};
	
	var _onClickAssignExps = function(){
		var hero = m_model.getCurHero();
		if ( !hero ) return;
		UIM.openDlg('roleassignexp', hero.id);
	};
	
	var _onClickTreatment = function(){
		var hero = m_model.getCurHero();
		if ( !hero ) return;
		
		var needNum = TreatmentHeroHdr.getNeedItemNumber(m_g, [hero.id]);
		if ( needNum == 0 ) {
			m_g.getGUI().sysMsgTips(SMT_NORMAL, rstr.herodlg.tips.fullhealth);
			return;
		}
		
		var hasNum = m_g.getImgr().getItemNumByResId(FIXID.SALVE);
		if ( needNum > hasNum ) {
			var msg = RStrUtil.makeNoSalveBuyMsg(FIXID.SALVE, needNum, hasNum);
			m_g.getGUI().msgBox(rstr.comm.msgts, msg, MB_F_CLOSE, null);
			return;
		}
		
		HeroSender.sendTreatment(m_g, hero.id);
	};
	
	var _onClickAppoint = function(){
		m_view.getCtrl('tablist').activeTab(HERODLG_TAB_OFFI_IDX);
	};
});

HeroArmTabPresenter = Class.extern(function(){
	//HeroArmTabPresenter-unittest-start
	var m_g=null;
	var m_this=null;
	var m_parent=null;
	var m_view=null;
	var m_model=null;
	var m_items=null;
	
	this.init = function(g, parent, view, model) {
		m_g = g;
		m_this = this;
		m_parent = parent;
		m_view = view;
		m_model = model;
	};
	
	this.setCaller = function(){
		_setItems();
		_regItemChangeEvent();
		_setWearListCaller();
		_setArmsTabCaller();
		_setArmListCaller();
		_setWearListTipCaller();
		_setArmListTipCaller();
	};
	
	this.setArmListTipCaller = function(){
		_setArmListTipCaller();
	};
	
	var _setItems = function(){
		m_items = m_view.getCtrl('tablist').getTabItems(HERODLG_TAB_ARM_IDX);
	};
	
	var _regItemChangeEvent = function(){
		m_g.regEvent(EVT.PKG_CHANGE, 0, m_this, _onItemChanged);
	};
	
	var _setWearListCaller = function(){
		m_items.wearList.setCaller({self:m_this, caller:_onClickWearList});
	};
	
	var _setArmsTabCaller = function(){
		m_items.armsTab.setCaller({self:m_this, caller:_onClickArmsTab});
	};
	
	var _setArmListCaller = function(){
		for ( var i=0, n=m_items.armsTab.getTabCount(); i<n; ++i) {
			var armList = m_items.armsTab.getTabItems(i).armList;
			armList.setCaller({self:m_this, caller:_onClickArmList});
		}
	};
	
	var _setWearListTipCaller = function(){
		for ( var i=0, n=m_items.wearList.getCount(); i<n; ++i ) {
			var item = m_items.wearList.getItem(i);
			TTIP.setCallerData(item.exsubs.tooltips[TIP_PREFIX + 'item'], {self:m_this, caller:_onGetWearArmTip}, {idx:i});
		}
	};
	
	var _setArmListTipCaller = function(){
		for ( var tabIdx=0, tabCount=m_items.armsTab.getTabCount(); tabIdx<tabCount; ++tabIdx ) {
			var armList = m_items.armsTab.getTabItems(tabIdx).armList;
			for ( var listIdx=0, listCount=armList.getCount(); listIdx<listCount; ++listIdx ) {
				var item = armList.getItem(listIdx);
				TTIP.setCallerData(item.exsubs.tooltips[TIP_PREFIX + 'item'], {self:m_this, caller:_onGetArmTip}, {idx:listIdx});
			}
		}
	};
	
	var _onItemChanged = function(){
		m_view.getArmView().setItemChanged();
	};
	
	var _onClickWearList = function(e, idx){
		var hero = m_model.getCurHero();
		if (!hero) {
			return;
		}
		var armPos = idx + 1;
		m_items.armsTab.activeTab(armPos);
		
		var wear = hero.wears[armPos];
		if (wear) {
			HeroSender.sendUnWearArm(m_g, hero.id, armPos);
		}
	};
	
	var _onClickArmsTab = function(){
		m_view.getArmView().updateArmList();
	};
	
	var _onClickArmList = function(e, idx){
		var hero = m_model.getCurHero();
		if (!hero) {
			return;
		}
		
		var armPos = m_items.armsTab.getActiveTab();
		var arms = m_model.getArmsByArmPos(armPos);
		var arm  = arms[idx];
		if (arm) {
			HeroSender.sendWearArm(m_g, hero.id, arm.id);
		}
	};
	
	var _onGetWearArmTip = function(data){
		var armPos = data.idx + 1;
		return _getWearArmTip(armPos);
	};
	
	var _onGetArmTip = function(data){
		var arm = _getCurArm(data.idx);
		if ( !arm ) {
			return '';
		}
		
		var armTip = TIPM.getItemDesc(arm);
		var wearTip = _getWearArmTip(arm.itemres.apos);
		
		if ( wearTip != '' ) {
			return wearTip + '<split>' + armTip;
		}
		else {
			return armTip;
		}
	};
	
	var _getWearArmTip = function(armPos){
		var hero = m_model.getCurHero();
		if (!hero || !hero.wears) {
			return '';
		}
		
		if (!hero.wears[armPos]) {
			return '';
		}
		
		return TIPM.getItemDesc(hero.wears[armPos], null, true);	
	};
	
	var _getCurArm = function(idx){
		var armPos = m_items.armsTab.getActiveTab();
		var arms = m_model.getArmsByArmPos(armPos);
		return arms[idx];
	};
	
	//HeroArmTabPresenter-unittest-end
});

HeroOffiTabPresenter = Class.extern(function(){
	var m_g=null;
	var m_this=null;
	var m_parent=null;
	var m_view=null;
	var m_model=null;
	var m_items=null;
	this.init = function(g, parent, view, model) {
		m_g = g;
		m_this = this;
		m_parent = parent;
		m_view = view;
		m_model = model;
	};
	
	this.setCaller = function(){
		m_items = m_view.getCtrl('tablist').getTabItems(HERODLG_TAB_OFFI_IDX);
		_setCommonBtnCaller();
		_setListConferBtnCaller();
	};
	
	var _setCommonBtnCaller = function() {
		m_items.conge.setCaller({self:m_this, caller:_onClickConge});	
		m_items.buyitem.setCaller({self:m_this, caller:_onClickBuyItem});
	};
	
	var _setListConferBtnCaller = function() {
		m_items.list.setItemCount(res_heroofficials.length);
		for ( var i=0; i<res_heroofficials.length; ++i ) {
			var conferbtn = m_items.list.getItem(i).exsubs.confer;
			conferbtn.setId(i);
			conferbtn.setCaller({self:m_this, caller:_onClickConfer});
		}
		m_items.list.setItemCount(0);
	};
	
	var _onClickConge = function(){
		var hero = m_model.getCurHero();
		if ( !hero ) return;
		
		if ( !_isFreeHero(hero) ) {
			m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.herodlg.err.conge.freestate);
			return;
		}
		if ( _hasSoldier(hero) ) {
			m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.herodlg.err.conge.nosoldier);
			return;
		}
		
		var _onCongeCallback = function(id) {
			if ( id == MB_IDYES ) HeroSender.sendConge(m_g, hero.id);
		};
		m_g.getGUI().msgBox(rstr.comm.msgts, TQ.format(rstr.herodlg.lbl.congehero, hero.name),  MB_F_YESNO, {self:m_this, caller:_onCongeCallback} );
	};
	
	var _onClickBuyItem = function(){
		UIM.openDlg('buyitem', {id:0,resid:FIXID.TIGERCARD,number:10000});
	};
	
	var _onClickConfer = function(idx){
		var hero = m_model.getCurHero();
		if ( !hero ) return;
		
		var officialId = idx + 1;
		if ( !_isFreeHero(hero) ) {
			m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.herodlg.err.confer.freestate);
			return;
		}
		if ( _hasOfficial(hero) ) {
			m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.herodlg.err.confer.hasofficial);
			return;
		}
		if ( _hasFullOfficals(officialId) ) {
			m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.herodlg.err.confer.fullofficial);
			return;
		}
		if ( !_hasEnoughCredit(hero, officialId) ) {
			m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.herodlg.err.confer.noenoughcredit);
			return;
		}
		if ( !_hasEnoughTigerCard(officialId) ) {
			m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.herodlg.err.confer.noenoughitem);
			return;
		}
		
		HeroSender.sendConfer(m_g, hero.id, officialId);
	};
	
	var _isFreeHero = function(hero) {
		return hero.state == HERO_STATE.FREE;
	};
	
	var _hasSoldier = function(hero) {
		return hero.soldier.number > 0;
	};
	
	var _hasOfficial = function(hero) {
		return hero.official != 0;
	};
	
	var _hasFullOfficals = function(officialId) {
		var res = m_model.getOfficialRes();
		var maxnum = res.nums[officialId - 1];
		return m_model.getOfficialCnt(officialId) == maxnum;
	};
	
	var _hasEnoughCredit = function(hero, officialId) {
		var imgr = m_g.getImgr();
		var herores = res_heroofficials[officialId - 1];
		return imgr.getHeroAttrVal(hero, ATTR.CRE) >= herores.needcredit;
	};
	
	var _hasEnoughTigerCard = function(officialId) {
		var imgr = m_g.getImgr();
		var herores = res_heroofficials[officialId - 1];
		return imgr.getItemNumByResId(FIXID.TIGERCARD) >= herores.needitem;
	};
});

HeroJingmaiTabPresenter = Class.extern(function(){
	var m_g=null;
	var m_this=null;
	var m_parent=null;
	var m_view=null;
	var m_model=null;
	var m_items=null;
	this.init = function(g, parent, view, model) {
		m_g = g;
		m_this = this;
		m_parent = parent;
		m_view = view;
		m_model = model;
		m_g.regEvent(EVT.HERO_STRIF_RESULT, 0, m_this, _onStrIFResult);
	};
	
	this.setCaller = function(){
		m_items = m_view.getCtrl('tablist').getTabItems(HERODLG_TAB_JINGMAI_IDX);
		_setMeiLuoNodeTips();
		_setCommonBtnCaller();
		_setInputStrTimesCaller();
	};
	
	var _setMeiLuoNodeTips = function(){
		for ( var i=1; i<=res_herojingmai.length; ++i ) {
			var tipid = m_items.tooltips[TIP_PREFIX + 'jingmai'+i];
			TTIP.setCallerData(tipid, {self:m_this, caller:_onGetJingmaiNodeTip},{idx:i});
		}
	};
	
	var _setCommonBtnCaller = function(){
		m_items.buyitem.setCaller({self:m_this, caller:_onClickBuyItem});
		m_items.strengthen.setCaller({self:m_this, caller:_onClickStrengthen});
		m_items.steeljingmai.setCaller({self:m_this, caller:_onClickSteelJingMai});
		m_items.speedsteel.setCaller({self:m_this, caller:_onClickSpeedSteel});
	};
	
	var _setInputStrTimesCaller = function(){
		m_items.istrtimes.setLimit(_onGetStrTimesLimit);
		m_items.istrtimes.setCaller({self:m_this, caller:_onStrTimesNumChange});
	};
	
	var _onStrIFResult = function(e){
		var heroid = 0;
		var hero = m_model.getCurHero();
		if ( hero ) heroid = hero.id;
		
		TQ.setTextEx( m_items.strdesc.getContainerObj(), m_parent.getStrIFResult(heroid) );
		m_items.strdesc.refresh();
		m_items.strdesc.scrollEnd();
	};
	
	var _onGetJingmaiNodeTip = function(data){
		var hero = m_model.getCurHero();
		if ( !hero ) return '';
		
		var s = m_model.getMaiLuoNodeDesc(data.idx);
		return '<div class=itemtip>'+s+'</div>';
	};
	
	var _onClickBuyItem = function() {
		UIM.openDlg('buyitem', {id:0,resid:FIXID.CHILINGDAN,number:10000});
	};
	
	var _onClickStrengthen = function() {
		var hero = m_model.getCurHero();
		if ( !hero ) return;
		
		if ( !_isFreeHero(hero) ) {
			m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.herodlg.err.strengthen.freestate);
			return;
		}
		
		if ( !_hasEnoughChiLingDan(hero) ) {
			m_g.getGUI().msgBox(rstr.comm.msgts, 
				RStrUtil.makeNoItemBuyMsg(m_g, FIXID.CHILINGDAN, _getNeedChiLingDanNumber(hero)),  
				MB_F_CLOSE, null);
			return;
		}
		
		if ( _isArriveMaxIFVal(hero) ) {
			m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.herodlg.err.strengthen.arrivemaxval);
			return;
		}
		
		var times = m_items.istrtimes.getVal();
		var needNum = m_model.getStrIFNeedItemNumber(hero) * times;
		UseItemSender.send(m_g, {id:0, resid:FIXID.CHILINGDAN}, needNum, {type:RES_TRG.SELF_HERO, id:hero.id});
	};
	
	var _onClickSteelJingMai = function() {
		var hero = m_model.getCurHero();
		if ( !hero ) return;
		
		var need = _getSteelNeed(hero);
		if ( !need ) return;
		
		if ( hero.level < need.prelevel ) {
			m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.herodlg.err.skeleton.lowherolevel);
			return;
		}
		
		if ( m_g.getImgr().getHeroAttrVal(hero, ATTR.IF) < need.preif ) {
			m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.herodlg.err.skeleton.noenoughif);
			return;
		}
		
		if ( m_g.getImgr().getMoney() < need.needmoney ) {
			m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.herodlg.err.skeleton.noenoughmoney);
			return;
		}
		
		if ( m_g.getImgr().getItemNumByResId(need.itemid) < need.needitem ) {
			m_g.getGUI().msgBox(rstr.comm.msgts, RStrUtil.makeNoItemBuyMsg(m_g, need.itemid, need.needitem),  MB_F_CLOSE, null);
			return;
		}
		
		HeroSender.sendSteelSkeleton(m_g, hero.id);
	};
	
	var _onClickSpeedSteel = function() {
		var hero = m_model.getCurHero();
		if ( !hero ) return;
		
		var dlg = UIM.getDlg('uselistitem');
		dlg.openDlg([RES_EFF.ACC_STEELMAILUO], 
			{id:hero.id, stoptime:hero.skeleton.stoptime, name:hero.name, type:RES_TRG.SELF_HERO} );
	};
	
	var _onGetStrTimesLimit = function() {	
		var hero = m_model.getCurHero();
		if ( !hero ) return {min:1, max:1};
		
		var onetimeneednum = m_model.getStrIFNeedItemNumber(hero);
		var hasnum = m_g.getImgr().getItemNumByResId(FIXID.CHILINGDAN);
		var times = Math.max(parseInt(hasnum / onetimeneednum, 10), 1);
		return {min:1,max:times};
	};
	
	var _onStrTimesNumChange = function(num) {
		var hero = m_model.getCurHero();
		if ( !hero ) {
			TQ.setHtml(m_items.strneeditem, '');
			return;
		}
		
		TQ.setHtml(m_items.strneeditem, rstr.herodlg.lbl.strneeditem + (m_model.getStrIFNeedItemNumber(hero)*num) );
	};
	
	var _isFreeHero = function(hero) {
		return hero.state == HERO_STATE.FREE;
	};
	
	var _hasEnoughChiLingDan = function(hero) {
		return _getNeedChiLingDanNumber(hero) <= m_g.getImgr().getItemNumByResId(FIXID.CHILINGDAN);
	};
	
	var _getNeedChiLingDanNumber = function(hero){
		var times = m_items.istrtimes.getVal();
		return m_model.getStrIFNeedItemNumber(hero) * times;
	};
	
	var _isArriveMaxIFVal = function(hero) {
		var imgr = m_g.getImgr();
		return imgr.getHeroAttrVal(hero, ATTR.IF) == imgr.getHeroAttrVal(hero, ATTR.MIF);
	};
	
	var _getSteelNeed = function(hero){
		return TQ.qfind(res_herojingmai, 'id', hero.skeleton.level+1);
	};
});

HeroSkillTabPresenter = Class.extern(function(){
	var m_g=null;
	var m_this=null;
	var m_parent=null;
	var m_view=null;
	var m_model=null;
	var m_items=null;
	var m_curskill=null;
	this.init = function(g, parent, view, model) {
		m_g = g;
		m_this = this;
		m_parent = parent;
		m_view = view;
		m_model = model;
	};
	
	this.setCaller = function(){
		m_items = m_view.getCtrl('tablist').getTabItems(HERODLG_TAB_SKILL_IDX);
		_setBaseListToolTipCaller();
		_setSpecListToolTipCaller();
		_setTacticListToolTipCaller();
		_setCurTacticSkillToolTipCaller();
		_setCommonBtnCaller();
		_setListClickCaller();
		_setMenusCaller();
	};
	
	var _setBaseListToolTipCaller = function(){
		m_items.baseskilllist.setItemCount(MAX_BASESKILL_GRIDCNT);
		for ( var i=0; i<MAX_BASESKILL_GRIDCNT; ++i ) {
			var item = m_items.baseskilllist.getItem(i);
			TTIP.setCallerData(item.exsubs.tooltips[TIP_PREFIX + 'item'], {self:m_this, caller:_onGetBaseSkillTip}, {idx:i});
		}
	};
	
	var _setSpecListToolTipCaller = function(){
		m_items.specskilllist.setItemCount(MAX_SPECSKILL_GRIDCNT);
		for ( var i=0; i<MAX_SPECSKILL_GRIDCNT; ++i ) {
			var item = m_items.specskilllist.getItem(i);
			TTIP.setCallerData(item.exsubs.tooltips[TIP_PREFIX + 'item'], {self:m_this, caller:_onGetSpecSkillTip}, {idx:i});
		}	
	};
	
	var _setTacticListToolTipCaller = function(){
		m_items.tacticskilllist.setItemCount(MAX_TACTICSKILL_GRIDCNT);
		for ( var i=0; i<MAX_TACTICSKILL_GRIDCNT; ++i ) {
			var item = m_items.tacticskilllist.getItem(i);
			TTIP.setCallerData(item.exsubs.tooltips[TIP_PREFIX + 'item'], {self:m_this, caller:_onGetTacticSkillTip}, {idx:i});
		}	
	};
	
	var _setCurTacticSkillToolTipCaller = function(){
		TTIP.setCallerData(m_items.tooltips[TIP_PREFIX + 'curtskill'], {self:m_this, caller:_onGetCurTacticSkillTip}, {});
	};
	
	var _setCommonBtnCaller = function() {
		m_items.insight.setCaller({self:m_this, caller:_onClickInsight});
		m_items.learn.setCaller({self:m_this, caller:_onClickLearn});
		m_items.speedsteel.setCaller({self:m_this, caller:_onSpeedSkillSteel});
		m_items.addtime.setCaller({self:m_this, caller:_onAddCanSteelTime});
	};
	
	var _setListClickCaller = function() {
		m_items.baseskilllist.setCaller({self:m_this, caller:_onClickBaseSkillItem});
		m_items.tacticskilllist.setCaller({self:m_this, caller:_onClickTacticSkillItem});
		m_items.specskilllist.setCaller({self:m_this, caller:_onClickSpecSkillItem});
		TQ.addEvent(m_items.curtacticskill, 'click', _onClickCurTactic);
	};
	
	var _setMenusCaller = function() {
		m_items.steelmenu.setCaller({self:m_this, caller:_onSteelSkillCmd});
		m_items.learntskillmenu.setCaller({self:m_this, caller:_onLearnTSkillCmd});
		m_items.weartskillmenu.setCaller({self:m_this, caller:_onWearTSkillCmd});
		m_items.unweartskillmenu.setCaller({self:m_this, caller:_onUnWearTSkillCmd});
		m_items.learnsskillmenu.setCaller({self:m_this, caller:_onLearnSSkillCmd});
	};
	
	var _onClickInsight = function() {
		var hero = m_model.getCurHero();
		if ( !hero ) return '';
		
		if ( _getEmptyBaseSkillGridCnt(hero) == _getBaseSkillCnt(hero) ) {
			m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.herodlg.err.insight.noemptygrid);
			return;
		}
		if ( m_g.getImgr().getItemNumByResId(FIXID.LINGWUDAN) == 0 ) { 
			m_g.getGUI().msgBox(rstr.comm.msgts, rstr.herodlg.err.insight.noenoughitem,  MB_F_CLOSE, null);
			return;
		}
		
		var _onInsightCallback = function(id) {
			if ( id == MB_IDYES ) HeroSender.sendInsightSkill(m_g, hero.id);
		};
		m_g.getGUI().msgBox(rstr.comm.msgts, rstr.herodlg.lbl.insightskill,  MB_F_YESNO, {self:m_this, caller:_onInsightCallback} );
	};
	
	var _onClickLearn = function() {
		var hero = m_model.getCurHero();
		if ( !hero ) return '';
		
		if ( hero.skillsteel.id > 0 ) {
			m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.herodlg.err.learn.skillsteeling);
			return;
		}
		
		var _preUseItem = function(item) {
			var skillid = item.itemres.effects[0].val;
			if ( TQ.find(hero.skills, 'id', skillid) == null ) {
				return true;
			}

			m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.herodlg.err.learn.existskill);
			return false;
		};
		var dlg = UIM.getDlg('uselistitem');
		dlg.openDlg([RES_EFF.LEARN_HERO_BSKILL], 
			{id:hero.id, name:hero.name, type:RES_TRG.SELF_HERO} );
		dlg.setPreUseCaller(_preUseItem);
	};
	
	var _onSpeedSkillSteel = function() {
		var hero = m_model.getCurHero();
		if ( !hero ) return '';
		
		var dlg = UIM.getDlg('uselistitem');
		dlg.openDlg([RES_EFF.ACC_STEELSKILL], 
			{id:hero.id, stoptime:hero.skillsteel.stoptime, name:hero.name, type:RES_TRG.SELF_HERO} );			
	};
	
	var _onAddCanSteelTime = function() {
		var hero = m_model.getCurHero();
		if ( !hero ) return '';
		
		var dlg = UIM.getDlg('uselistitem');
		dlg.openDlg([RES_EFF.ADD_CANSTEELSKILL], {type:RES_TRG.SELF_ROLE} );			
	};
	
	var _onGetBaseSkillTip = function(data){
		var hero = m_model.getCurHero();
		if ( !hero ) return '';
		
		if ( _isLockSkill(hero, data.idx) ) {
			return rstr.herodlg.tips.skill.lockedskill[data.idx];
		}
		
		var curskill = _getBaseSkillByIdx(hero, data.idx);
		if ( curskill == null ) return '';
		
		return TIPM.getSkillDesc(hero, curskill);
	};
	
	var _onGetSpecSkillTip = function(data){
		var hero = m_model.getCurHero();
		if ( !hero ) return '';
		
		var curskill = m_g.getImgr().getSpecSkillByIdx(hero, data.idx);
		if ( curskill == null ) return '';
		
		return TIPM.getSpecSkillDesc(curskill, true);
	};
	
	var _onGetTacticSkillTip = function(data){
		var hero = m_model.getCurHero();
		if ( !hero ) return '';
		
		var curskill = m_g.getImgr().getTacticSkillByIdx(hero, data.idx);
		if ( curskill == null ) return '';
		
		return TIPM.getTacticSkillDesc(curskill, 'original');
	};
	
	var _onGetCurTacticSkillTip = function(data){
		var hero = m_model.getCurHero();
		if ( !hero ) return '';
		if ( !hero.curtskill ) return rstr.herodlg.tips.skill.noweartacticskill;
		
		var curskill = m_g.getImgr().getHeroSkillById(hero, hero.curtskill);
		if ( curskill == null ) return rstr.herodlg.tips.skill.noweartacticskill;
		
		return TIPM.getTacticSkillDesc(curskill, 'weared');
	};
	
	var _isLockSkill = function(hero, idx){
		var lockStartIdx = res_get_basegridcnt_by_herolevel(hero.level);
		return (idx >= lockStartIdx) && (idx < MAX_BASESKILL_GRIDCNT);
	};
	
	var _getBaseSkillByIdx = function(hero, cidx) {
		for ( var i=0, idx=0; i<hero.skills.length; ++i ) {
			var skill = hero.skills[i];
			if ( skill.id < res_hero_baseskill_id_first ) continue;
			if ( skill.id > res_hero_baseskill_id_last ) continue;
			if ( idx == cidx ) return skill;
			idx++;
		}
		return null;
	};
	
	var _getEmptyBaseSkillGridCnt = function(hero) {
		return res_get_basegridcnt_by_herolevel(hero.level);
	};

	var _getBaseSkillCnt = function(hero) {
		var cnt = 0;
		for ( var i=0; i<hero.skills.length; ++i ) {
			var skill = hero.skills[i];
			if ( skill.id >= res_hero_baseskill_id_first && skill.id <= res_hero_baseskill_id_last ) {
				cnt++;
			}
		}
		return cnt;
	};
	
	var _onClickBaseSkillItem = function(e, idx){
		var hero = m_model.getCurHero();
		if ( !hero ) return;
		
		m_curskill = _getBaseSkillByIdx(hero, idx);
		if ( m_curskill == null ) return;
		if ( m_curskill.level == res_hero_baseskill_maxlevel ) return;
		
		m_items.steelmenu.show(TQ.offsetPoint(TQ.mouseCoords(e), 5, 5));
	};
	
	var _onClickTacticSkillItem = function(e, idx){
		var hero = m_model.getCurHero();
		if ( !hero ) return;
		
		m_curskill = m_g.getImgr().getTacticSkillByIdx(hero, idx);
		if ( m_curskill == null ) return;
		
		if ( m_curskill.level == 0 ) {
			m_items.learntskillmenu.show(TQ.offsetPoint(TQ.mouseCoords(e), 5, 5));
		}
		else {
			m_items.weartskillmenu.show(TQ.offsetPoint(TQ.mouseCoords(e), 5, 5));
		}
	};
	
	var _onClickSpecSkillItem = function(e, idx){
		var hero = m_model.getCurHero();
		if ( !hero ) return;
		
		m_curskill = m_g.getImgr().getSpecSkillByIdx(hero, idx);
		if ( m_curskill == null ) return;
		
		if ( m_curskill.level == 0 ) {
			m_items.learnsskillmenu.show(TQ.offsetPoint(TQ.mouseCoords(e), 5, 5));
		}
	};
	
	var _onClickCurTactic = function(e){
		var hero = m_model.getCurHero();
		if ( !hero ) return;
		
		if ( hero.curtskill > 0 ) {
			m_items.unweartskillmenu.show(TQ.offsetPoint(TQ.mouseCoords(e), 5, 5));
		}
	};
	
	var _onSteelSkillCmd = function() {
		m_g.getGUI().hideAllMenu();
		var hero = m_model.getCurHero();
		if ( !hero ) return;
		
		if ( hero.skillsteel.id > 0 ) {
			m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.herodlg.err.ssteel.issteeling);
			return;
		}
		if ( m_g.getImgr().getCanUseSkillSteelTime() == 0 ) {
			m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.herodlg.err.ssteel.nosstime);
			return;
		}
		
		var _onInputOk = function(num) {
			HeroSender.sendSkillSteel(m_g, hero.id, m_curskill.id, num);
		};
		var canuse = m_g.getImgr().getCanUseSkillSteelTime();
		var onemax = res_canuse_sstime_maxnum;
		var inputdlg = UIM.getDlg('inputnum');
		inputdlg.openDlg(rstr.herodlg.lbl.inputssitem, Math.min(canuse, onemax));
		inputdlg.setCaller({self:m_this, caller:_onInputOk});
	};
	
	var _onLearnTSkillCmd = function() {
		m_g.getGUI().hideAllMenu();
		var hero = m_model.getCurHero();
		if ( !hero ) return;
		
		var needItemId = _getLearnTacticSkillNeedItem(m_curskill.id);
		var num = m_g.getImgr().getItemNumByResId(needItemId);
		if (num == 0) {
			m_g.getGUI().msgBox(rstr.comm.msgts, RStrUtil.makeNoItemBuyMsg(m_g, needItemId, 1),  MB_F_CLOSE, null);
			return;
		}
		UseItemSender.send(m_g, {id:0,resid:needItemId}, 1, {type:RES_TRG.SELF_HERO, id:hero.id});
	};
	
	var _onLearnSSkillCmd = function() {
		m_g.getGUI().hideAllMenu();
		var hero = m_model.getCurHero();
		if ( !hero ) return;
		
		var needItemId = _getLearnSpecSkillNeedItem(m_curskill.id);
		var num = m_g.getImgr().getItemNumByResId(needItemId);
		if (num == 0) {
			m_g.getGUI().msgBox(rstr.comm.msgts, RStrUtil.makeNoItemBuyMsg(m_g, needItemId, 1),  MB_F_CLOSE, null);
			return;
		}
		UseItemSender.send(m_g, {id:0,resid:needItemId}, 1, {type:RES_TRG.SELF_HERO, id:hero.id});
	};
	
	var _onWearTSkillCmd = function() {
		m_g.getGUI().hideAllMenu();
		var hero = m_model.getCurHero();
		if ( !hero ) return;
		
		HeroSender.sendWearTSkill(m_g, hero.id, m_curskill.id);
	};
	
	var _onUnWearTSkillCmd = function() {
		m_g.getGUI().hideAllMenu();
		var hero = m_model.getCurHero();
		if ( !hero ) return;
		
		HeroSender.sendUnWearTSkill(m_g, hero.id);
	};
	
	var _getLearnSkillNeedItem = function(effectid, skillid) {
		var effectItems = ItemResUtil.findEffectItems(effectid);
		for ( k in effectItems.items ) {
			var itemid = effectItems.items[k];
			var itemres = ItemResUtil.findItemres(itemid);
			for ( ek in itemres.effects ) {
				var effect = itemres.effects[ek];
				if ( effect.id != effectid )  continue;
				if ( effect.val == skillid ) return itemid;
			}
		}
		return 0;	
	};
	
	var _getLearnTacticSkillNeedItem = function(skillid) {
		return _getLearnSkillNeedItem(RES_EFF.LEARN_HERO_TSKILL, skillid);
	};	
	
	var _getLearnSpecSkillNeedItem = function(skillid) {
		return _getLearnSkillNeedItem(RES_EFF.LEARN_HERO_SSKILL, skillid);
	};		
});

