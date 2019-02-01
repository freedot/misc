/** 合法性检查 */
Validator = function(){
	//-----------
	//private:data
	//-----------
	var m_g;
	var m_this;
	var m_minuserlen = 3;
	var m_maxuserlen = 12;
	
	var m_minmailtitlelen = 1;
	var m_maxmailtitlelen = 30;
	var m_maxMailTitleBytes = 45; //和server的数据定义应该一致
	var m_minmailconlen = 1;
	var m_maxmailconlen = 500;
	var m_maxMailConBytes = 750; //和server的数据定义应该一致
	
	var m_mingrouplen = 2;
	var m_maxgrouplen = 5;
	var m_minherolen = 3;
	var m_maxherolen = 8;
	var m_maxdescgrouplen = 50;
	var m_invalidchars = [' ','\\','\'','\"','<','>'];
	var m_minallilen = 3;
	var m_maxallilen = 12;
	
	var m_maxSelfSignGBKLen = 100;
	var m_maxSelfSignByteLen = 150;
	
	var m_minalliflaglen = 1; // 一个汉字
	var m_maxalliflaglen = 1; // 一个汉字
	
	var m_maxAllianceIntroduceGBKBytes = 400;
	var m_maxAllianceIntroduceBytes = 600;
	var m_maxAllianceBulletinGBKBytes = 400;
	var m_maxAllianceBulletinBytes = 600;

	//------------
	//public:method
	//------------
	this.initialize = function(){
		m_this = this;
	};
	
	this.checkUsername = function(val){
		return _checkName(val, m_minuserlen, m_maxuserlen);
	};
	
	this.checkHeroname = function(val){
		return _checkName(val, m_minherolen, m_maxherolen);
	};
	
	this.checkAlliname = function(val){
		return _checkName(val, m_minallilen, m_maxallilen);
	};
	
	this.checkAlliFlagName = function(val){
		if (!val) return false;
		if (val.length != m_maxalliflaglen) return false;
		return _isVaildString(val);
	};
	
	this.checkEmailTitle = function(val){
		if ( val.length < m_minmailtitlelen || val.length > m_maxmailtitlelen ){
			return false;
		}
		return true;
	};
	
	this.checkEmailContent = function(val){
		if ( val.length < m_minmailconlen || val.length > m_maxmailconlen ){
			return false;
		}
		return true;
	};
	
	this.checkGroupName = function(val){
		return _checkName(val, m_mingrouplen, m_maxgrouplen);
	};
	
	this.checkShopName = function(val){
		return _checkName(val, m_this.getMinShopLen(), m_this.getMaxShopLen());
	};
	
	this.getMaxUserLen = function(){
		return m_maxuserlen;
	};
	
	this.getMaxCDKeyLen = function(){
		return 20;
	};
	
	this.getMinUserLen = function(){
		return m_minuserlen;
	};
	
	this.getMaxGroupLen = function(){
		return m_maxgrouplen;
	};
	
	this.getMaxDescGroupLen = function(){
		return m_maxdescgrouplen;
	};
	
	this.getMinHeroLen = function(){
		return m_minherolen;
	};
	
	this.getMaxHeroLen = function(){
		return m_maxherolen;
	};
	
	this.getMinAlliLen = function(){
		return m_minallilen;
	};
	
	this.getMaxAlliLen = function(){
		return m_maxallilen;
	};
	
	this.getMinAlliFlagLen = function(){
		return m_minalliflaglen;
	};
	
	this.getMaxAlliFlagLen = function(){
		return m_maxalliflaglen;
	};
	
	this.getMinShopLen = function(){
		return m_minuserlen;
	};
	
	this.getMaxShopLen = function(){
		return m_maxuserlen+3;//的小店--三个字
	};
	
	this.getMaxMailTitleLen = function(){
		return m_maxmailtitlelen;
	};
	
	this.getMaxMailTitleBytes = function(){
		return m_maxMailTitleBytes;
	};
	
	this.getMaxMailContentLen = function(){
		return m_maxmailconlen;
	};
	
	this.getMaxMailContentBytes = function(){
		return m_maxMailConBytes;
	};
	
	this.getSelfSignMaxLen = function(){
		return m_maxSelfSignGBKLen;
	};
	
	this.getSelfSignMaxBytes = function(){
		return m_maxSelfSignByteLen;
	};
	
	this.getMaxAllianceIntroduceGBKBytes = function(){
		return m_maxAllianceIntroduceGBKBytes;
	};
	
	this.getMaxAllianceIntroduceBytes = function(){
		return m_maxAllianceIntroduceBytes;
	};
	
	this.getMaxAllianceBulletinGBKBytes = function(){
		return m_maxAllianceBulletinGBKBytes;
	};
	
	this.getMaxAllianceBulletinBytes = function(){
		return m_maxAllianceBulletinBytes;
	};

	//------------
	//private:method
	//------------
	
	var _checkName = function(val, minlen, maxlen) {
		var bytes = UnicodeStr.gbkLen(val);
		if ( bytes < minlen || bytes > maxlen ){
			return false;
		}
		else{
			if ( !_isVaildString(val) ){
				return false;
			}
		}
		return true;	
	};
	
	var _isVaildString = function(val){
		for ( var k in m_invalidchars ){
			if ( val.indexOf(m_invalidchars[k]) >= 0 ){
				return false;
			}
		}
		return true;
	};
	
	//--------------
	// call constructor
	//--------------
	this.initialize.apply(this, arguments);
};
JVALID = new Validator();

/** 画item的公用类 */
CommDrawItem = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	var m_this;
	
	this.init = function(){
		m_this = this;
	};
	
	this.drawItemIconAndName = function(iconDom, nameDom, res){
		this.drawItemIcon(iconDom, res);
		this.drawItemName(nameDom, res);
	};
	
	this.drawItemIcon = function(iconDom, res){
		IMG.setBKImage(iconDom, IMG.makeBigImg(res.bigpic));
		_setIconBorderClass(iconDom, res);
	};
	
	this.drawItemName = function(nameDom, res){
		if ( res.name ) {
			TQ.setRichText(nameDom, ItemNameColorGetter.getColorVal(res.level, res.name));
		}
	};
	
	this.drawPkgItem = function(item, ritem, forceShowNumber){
		_lc_._drawNumber(item,  _lc_._getNeedDrawNumber(ritem, forceShowNumber));
		this.drawItemIconAndName(item.exsubs.icon, item.exsubs.name, ritem.itemres);
	};
	
	this.drawIconAndNumber = function(item, ritem, forceShowNumber){
		_lc_._drawNumber(item,  _lc_._getNeedDrawNumber(ritem, forceShowNumber));
		this.drawItemIcon(item.exsubs.icon, ritem.itemres);
	};
	
	_lc_._getNeedDrawNumber = function(ritem, forceShowNumber){
		if ( _lc_._isNeedDrawNumber(ritem, forceShowNumber) ) {
			return ritem.number;
		} else {
			return '';
		}
	};
	
	_lc_._isNeedDrawNumber = function(ritem, forceShowNumber){
		if ( !ritem.number && ritem.number != 0 ) {
			return false;
		}
		
		if ( forceShowNumber ) {
			return ritem.number;
		}
		
		if ( ritem.itemres.unique ) {
			return false;
		}
		
		if ( !ritem.itemres.pile || ritem.itemres.pile <= 1 ) {
			return false;
		}
		
		return true;
	};
	
	var _setIconBorderClass = function(iconDom, res){
		var level =  res.level ? res.level : 1;
		var icon_border_class = 'item_icon_border_level' + level;
		TQ.setClass(iconDom, icon_border_class);
	};	
	
	_lc_._drawNumber = function(item, num){
		if ( item.exsubs.fnum ) TQ.setTextEx(item.exsubs.fnum, num);
		if ( item.exsubs.bnum ) TQ.setTextEx(item.exsubs.bnum, num);
		if ( item.exsubs.num ) TQ.setTextEx(item.exsubs.num, num);
	};
	//CommDrawItem-unittest-end
}).snew();

/** 文本输入对话框 */
InputTextDlg = function(){
	//-----------
	//private:const
	//-----------
	var C_CONFIRM_ID = 1;
	var C_CANCEL_ID = 2;
	
	//-----------
	//private:data
	//-----------
	var m_g;
	var m_this;
	var m_dlg;
	var m_items={};
	var m_caller;
	var m_maxlen;
	var m_confirmCaller;
	var m_changeCaller;

	//------------
	//public:method
	//------------
	this.initialize = function(g){
		m_g = g;
		m_this = this;
	};
	
	
	/** 打开话框 
	@param label 提示的label
	@param maxlen 输入框容许的最大长度	*/
	this.openDlg = function(label, maxlen, confirmCaller, changeCaller){
		m_confirmCaller = confirmCaller;
		m_changeCaller = changeCaller;
		_initDlg();
		_initInfo(label, maxlen);
		m_dlg.show();
		m_items.text.focus();
	};
	
	/** */
	this.setCaller = function(caller){
		m_caller = caller;
	};
	
	this.isShow = function(){
		if ( !m_dlg ) return false;
		return m_dlg.isShow();
	};
	
	this.clickOk = function(){
		_onClickBtn(C_CONFIRM_ID);
	};
	
	this.setText = function(text){
		m_items.text.value = text;
	};
	
	this.setTip = function(tip){
		if ( this.isShow() ) {
			TQ.setTextEx(m_items.tip, tip);
		}
	};
	
	var _initDlg = function(){
		if ( !m_dlg ){
			m_dlg = Dialog.snew(m_g,{modal:true,
					pos:{x:"center", y:100},
					uiback:uiback.dlg.npc,
					btns:[{btn:{id:C_CONFIRM_ID,text:rstr.comm.confirm},caller:{self:m_this,caller:_onClickBtn}},
					{btn:{id:C_CANCEL_ID,text:rstr.comm.cancel},caller:{self:m_this,caller:_onClickBtn}}]
				});
			m_g.getGUI().initDlg(m_dlg, uicfg.comm.inputtextdlg, m_items);
			m_dlg.hide();
		}
	};
	
	var _initInfo = function(label, maxlen){
		TQ.setTextEx(m_items.label, label);
		TQ.setTextEx(m_items.tip, '');
		m_items.text.value = '';
		InputLimit.maxGBKBytes(m_items.text, maxlen, m_changeCaller);
	};

	var _onClickBtn = function(id){
		if ( id == C_CONFIRM_ID ){
			if ( m_confirmCaller ) {
				m_confirmCaller.invoke(m_items.text.value);
			} else if (m_caller) {
				m_caller.caller.call(m_caller.self, m_items.text.value);
			}
		}
		
		m_dlg.hide();
	};
	
	//--------------
	// call constructor
	//--------------
	this.initialize.apply(this, arguments);
};

/** 文本输入对话框 */
InputAreaTextDlg = function(){
	//-----------
	//private:const
	//-----------
	var C_CONFIRM_ID = 1;
	var C_CANCEL_ID = 2;
	
	//-----------
	//private:data
	//-----------
	var m_g;
	var m_this;
	var m_dlg;
	var m_items={};
	var m_caller;
	var m_maxlen;

	//------------
	//public:method
	//------------
	this.initialize = function(g){
		m_g = g;
		m_this = this;
	};
	
	
	/** 打开话框 
	@param label 提示的label
	@param maxlen 输入框容许的最大长度	*/
	this.openDlg = function(title, text, label, maxlen){
		_initDlg();
		_initInfo(label, maxlen);
		m_dlg.setTitle(title);
		m_dlg.show();
		this.setContent(text);
		m_items.text.getContainerObj().focus();
		m_items.text.refresh();
	};
	
	this.setCaller = function(caller){
		m_caller = caller;
	};
	
	this.clickOk = function(){
		_onClickBtn(C_CONFIRM_ID);
	};	
	
	this.setContent = function(con){
		m_items.text.getContainerObj().value = con;
	};
	
	//------------
	//private:method
	//------------
	var _initDlg = function(){
		if ( !m_dlg ){
			m_dlg = Dialog.snew(m_g,{modal:true,
					title:'..',
					pos:{x:"center", y:60},
					btns:[{btn:{id:C_CONFIRM_ID,text:rstr.comm.confirm},caller:{self:m_this,caller:_onClickBtn}},
					{btn:{id:C_CANCEL_ID,text:rstr.comm.cancel},caller:{self:m_this,caller:_onClickBtn}}]
				});
			m_g.getGUI().initDlg(m_dlg, uicfg.comm.inputareatextdlg, m_items);
			m_dlg.hide();
		}
	};
	
	var _initInfo = function(label, maxlen){
		TQ.setTextEx(m_items.label, label);
		m_items.text.getContainerObj().value = '';
		InputLimit.maxGBKBytes(m_items.text.getContainerObj(), maxlen);
	};

	var _onClickBtn = function(id){
		if ( id == C_CONFIRM_ID && m_caller ){
			m_caller.caller.call(m_caller.self, m_items.text.getContainerObj().value);
		}
		m_dlg.hide();
	};
	
	//--------------
	// call constructor
	//--------------
	this.initialize.apply(this, arguments);
};

/** 数量输入对话框 */
InputNumDlg = function(){
	//-----------
	//private:const
	//-----------
	var C_CONFIRM_ID = 1;
	var C_CANCEL_ID = 2;
	
	//-----------
	//private:data
	//-----------
	var m_g;
	var m_this;
	var m_dlg;
	var m_items={};
	var m_maxnum=1;
	var m_caller;
	var m_uicfg = uicfg.comm.inputnumdlg;

	//------------
	//public:method
	//------------
	this.initialize = function(g, uicfg){
		m_g = g;
		m_this = this;
		if ( uicfg ) {
			m_uicfg = uicfg;
		}
	};
	
	
	/** 打开话框 
	@param item 当前被使用的道具
	@param targets 当前被使用对象的类型列表	*/
	this.openDlg = function(name,maxnum){
		_initDlg();
		_initInfo(name,maxnum);
		m_dlg.show();
		m_items.num.focus();
	};
	
	this.setNumber = function(number){
		m_items.num.setVal(number);
	};
	
	this.setCaller = function(caller){
		m_caller = caller;
	};
	
	this.isShow = function(){
		return m_dlg && m_dlg.isShow();
	};
	
	this.click = function(){
		_onClickBtn(C_CONFIRM_ID);
	};
	
	//------------
	//private:method
	//------------
	var _initDlg = function(){
		if ( !m_dlg ){
			m_dlg = Dialog.snew(m_g,{modal:true,
					pos:{x:"center", y:60},
					uiback:uiback.dlg.npc,
					btns:[{btn:{id:C_CONFIRM_ID,text:rstr.comm.confirm},caller:{self:m_this,caller:_onClickBtn}},
					{btn:{id:C_CANCEL_ID,text:rstr.comm.cancel},caller:{self:m_this,caller:_onClickBtn}}]
				});
			m_g.getGUI().initDlg(m_dlg, m_uicfg, m_items);
			m_dlg.hide();
			m_items.num.setLimit(_getLimitNum);
		}
	};
	
	var _initInfo = function(name,maxnum){
		m_maxnum = maxnum;
		m_items.num.setVal(m_maxnum);
		TQ.setTextEx(m_items.name, name);
	};
	
	var _getLimitNum = function(){
		return {min:0,max:m_maxnum};
	};
	
	var _onClickBtn = function(id){
		if ( id == C_CONFIRM_ID && m_caller ){
			var num = m_items.num.getVal();
			m_caller.caller.call(m_caller.self, num);
		}
		m_dlg.hide();
	};
	
	//--------------
	// call constructor
	//--------------
	this.initialize.apply(this, arguments);
};

/**   UseItemSelTargetDlg  ->  UseItemTarget  ->  ***Getter    */
UseItemTarget = function(){
	//-----------
	//private:data
	//-----------
	var m_g;
	var m_this;
	var m_curitem;
	var m_items;
	var m_targetress=[];
	var m_firstinfos=[];
	var m_starttime;
	var m_targetgetters = {};

	//------------
	//public:method
	//------------
	this.initialize = function(g){
		m_g = g;
		m_this = this;
		// 初始化targetgetter列表
		_registerGetter();
	};
	
	/** 设置当前的对象
	@param uiitems  dlg中uiitem表
	@param curitem 当前被使用的道具
	@param targetres 当前可被使用对象的资源对象 
	@return true-表示需要动态更新界面 */
	this.set = function(uiitems, curitem, targetres){
		m_items = uiitems;
		m_curitem = curitem;
		var rt = _getSuitableGetters(targetres);
		_combine(rt.getters);
		_set();
		return rt.needupdate;
	};
	
	this.startUpdater = function(){
		m_g.regUpdater(m_this, _onUpdate, 1000);
	};
	
	this.stopUpdater = function(){
		m_g.unregUpdater(m_this, _onUpdate);
	};
	
	//------------
	//private:method
	//------------
	var _registerGetter = function(){
		m_targetgetters[RES_TRG.SELF_HERO] = {getter:(new UseItemHeroGetter(m_g,RES_TRG.SELF_HERO)),update:false};//我方英雄
		m_targetgetters[RES_TRG.OBUILD] = {getter:(new UseItemBuildGetter(m_g,RES_TRG.OBUILD)),update:false};//外城建筑
		m_targetgetters[RES_TRG.IBUILD] = {getter:(new UseItemBuildGetter(m_g,RES_TRG.IBUILD)),update:false};//内城建筑
		m_targetgetters[RES_TRG.BUILDING_OBUILD] = {getter:(new UseItemBuildingGetter(m_g,RES_TRG.BUILDING_OBUILD)),update:true};//在建的外城建筑
		m_targetgetters[RES_TRG.BUILDING_IBUILD] = {getter:(new UseItemBuildingGetter(m_g,RES_TRG.BUILDING_IBUILD)),update:true};//在建的内城建筑
		m_targetgetters[RES_TRG.RECRUITING_SOLDIER] = {getter:(new UseItemBuildingSoldierGetter(m_g,RES_TRG.RECRUITING_SOLDIER)),update:true};//正在训练的士兵
		m_targetgetters[RES_TRG.LEARNING_CULTURE] = {getter:(new UseItemBuildingCultureGetter(m_g,RES_TRG.LEARNING_CULTURE)),update:true};//正在研究的国学
		m_targetgetters[RES_TRG.MAKING_WEAPONRY] = {getter:(new UseItemBuildingWeaponryGetter(m_g,RES_TRG.MAKING_WEAPONRY)),update:true};//正在打造的武器
		m_targetgetters[RES_TRG.OBUILDRES] = {getter:(new UseItemOutBuildResGetter(m_g,RES_TRG.OBUILDRES)),update:false};//外城资源
		m_targetgetters[RES_TRG.FARM] = {getter:(new UseItemOutBuildResGetter(m_g,RES_TRG.FARM)),update:false};//自己的农田
		m_targetgetters[RES_TRG.TIMBERYARD] = {getter:(new UseItemOutBuildResGetter(m_g,RES_TRG.TIMBERYARD)),update:false};//自己的木场
		m_targetgetters[RES_TRG.QUARRY] = {getter:(new UseItemOutBuildResGetter(m_g,RES_TRG.QUARRY)),update:false};//自己的石场
		m_targetgetters[RES_TRG.IRONORE] = {getter:(new UseItemOutBuildResGetter(m_g,RES_TRG.IRONORE)),update:false};//自己的铁场
	};
	
	var _set = function(){
		// 初始化使用对象列表
		m_firstinfos = [];
		m_starttime = m_g.getCurTimeMs();
		var tlist = m_items.targetlist;
		tlist.setItemCount(m_targetress.length);
		for ( var i=0; i<m_targetress.length; ++i ){
			var targetitem = m_targetress[i];
			var listitem = tlist.getItem(i);
			IMG.setBKImage(listitem.exsubs.icon,IMG.makeSmallImg(targetitem.icon));
			TQ.setRichText(listitem.exsubs.name,targetitem.name);
			TQ.setRichText(listitem.exsubs.desc1,targetitem.desc1);
			if ( targetitem.flag == 'stable' ){
				TQ.setRichText(listitem.exsubs.desc2,targetitem.desc2);
			}
			m_firstinfos.push({time:targetitem.desc2,flag:targetitem.flag});
			var usebtn = listitem.exsubs.usebtn;
			usebtn.setId(i);
			usebtn.setText(targetitem.btntext);
			usebtn.clearCaller();// fix setCaller bug
			usebtn.setCaller({self:m_this,caller:_onUseItem});
		}
		tlist.scrollPos(0);
	};
	
	var _onUseItem = function(id){
		if ( m_curitem.number > 0 ){
			var targetitem = m_targetress[id];
			if ( targetitem ){
				var sendmsg = '{cmd='+NETCMD.USEITEM+',id='+m_curitem.id+',resid='+m_curitem.resid+',number=1,target={type='+targetitem.targettype+',id='+targetitem.id+'}}';
				m_g.send(null,sendmsg);
			}
		}
		else{
			m_g.getGUI().msgBox(rstr.comm.msgts, rstr.useitem.targetdlg.noitem, MB_F_CLOSE, null);
		}
	};
	
	var _onUpdate = function(curTimeMs){
		var drttime = (curTimeMs - m_starttime)/1000;
		var tlist = m_items.targetlist;
		var cnt = tlist.getCount();
		for ( var i=0; i<cnt; ++i ){
			var listitem = tlist.getItem(i);
			var ndrttime = drttime;
			if ( m_firstinfos[i].flag == 'stable' ){
				continue;
			}
			else if ( m_firstinfos[i].flag == 'inc' ){
				ndrttime = -drttime;
			}
			var curtime = m_firstinfos[i].time - ndrttime;
			if ( curtime < 0 ) curtime = 0;
			TQ.setTextEx(listitem.exsubs.desc2,TQ.formatTime(0,curtime));
		}
	};
	
	var _getSuitableGetters = function(targetres){
		var needupdate = false;
		var getters = [];
		for ( k in targetres ){
			var tid = targetres[k];
			
			var getter = m_targetgetters[tid];
			if ( getter ){
				if ( getter.update ) {
					needupdate = true;
				}
				getters.push(getter.getter);
			}
		}
		return {getters:getters,needupdate:needupdate};
	};
	
	var _combine = function(targetgetters){
		m_targetress = [];
		for ( k in targetgetters ){
			var getter = targetgetters[k];
			getter.reset();
			var cnt = getter.getCount();
			for ( var i=0; i<cnt; ++i ){
				var targetitem = getter.getItem(i);
				m_targetress.push(targetitem);
			}
		}
	};
	
	//--------------
	// call constructor
	//--------------
	this.initialize.apply(this, arguments);
};

UseItemHeroGetter = function(){
	//-----------
	//private:data
	//-----------
	var m_g;
	var m_heros;
	var m_targettype;

	//------------
	//public:method
	//------------
	this.initialize = function(g,targettype){
		m_g = g;
		m_targettype = targettype;
		m_heros = m_g.getImgr().getHeros().list;
	};
	
	this.reset = function(){
	};
	
	this.getCount = function(){
		return m_heros.length;
	};
	
	this.getItem = function(idx){
		var hero = m_heros[idx];
		return {id:hero.id,
				targettype:m_targettype,
				icon:hero.itemres.smallpic,
				name:hero.name,
				desc1:rstr.comm.level+':'+hero.level,
				desc2:rstr.comm.position+':'+rstr.comm.herostate[hero.state],
				flag:0,
				btntext:rstr.useitem.targetdlg.use};
	};
	
	//--------------
	// call constructor
	//--------------
	this.initialize.apply(this, arguments);
};

UseItemBuildGetter = function(){//例如拆除建筑道具
	//-----------
	//private:data
	//-----------
	var m_g;
	var m_targettype;
	var m_builds;

	//------------
	//public:method
	//------------
	this.initialize = function(g,targettype){
		m_g = g;
		m_targettype = targettype;
		var targetmap = {};
		m_builds = m_g.getImgr().getBuildsByCityId(BUILDCITY_ID.MAIN);
	};
	
	this.reset = function(){
	};
	
	this.getCount = function(){
		return m_builds.length;
	};
	
	this.getItem = function(idx){
		var build = m_builds[idx];
		var leveldesc = rstr.comm.level+':';
		if ( build.state == 0 ){
			leveldesc += build.level;
		}
		else if ( build.state == 1 ){
			leveldesc += '↑'+build.level+'->'+(build.level+1);
		}
		else if ( build.state == 2 ){
			leveldesc += '↓'+build.level+'->'+(build.level-1);
		}
		return {id:build.id,
				targettype:m_targettype,
				icon:build.itemres.smallpic,
				name:build.itemres.name,
				desc1:leveldesc,
				desc2:'',
				flag:'stable',
				btntext:rstr.useitem.targetdlg.use};
	};
	
	//--------------
	// call constructor
	//--------------
	this.initialize.apply(this, arguments);
};

UseItemBuildingGetter = function(){
	//-----------
	//private:data
	//-----------
	var m_g;
	var m_targettype;
	var m_builds;

	//------------
	//public:method
	//------------
	this.initialize = function(g,targettype){
		m_g = g;
		m_targettype = targettype;
		_init();
	};
	
	this.reset = function(){
		_reset();
	};
	
	this.getCount = function(){
		return m_builds.length;
	};
	
	this.getItem = function(idx){
		var svrtime = parseInt(m_g.getSvrTimeMs()/1000);
		var build = m_builds[idx];
		var leveldesc = rstr.comm.level+':';
		if ( build.state == 1 ){
			leveldesc += '↑'+build.level+'->'+(build.level+1);
		}
		else if ( build.state == 2 ){
			leveldesc += '↓'+build.level+'->'+(build.level-1);
		}
		var ltime = build.stoptime-svrtime;
		if ( ltime < 0 ){
			ltime = 0;
		}
		return {id:build.id,
				targettype:m_targettype,
				icon:build.itemres.smallpic,
				name:build.itemres.name,
				desc1:leveldesc,
				desc2:ltime,
				flag:'dec',
				btntext:rstr.useitem.targetdlg.use};
	};
	
	//------------
	//private:method
	//------------
	var _init = function(){
		_reset();
	};
	
	var _reset = function(){
		var targetmap = {};
		var builds = m_g.getImgr().getBuildsByCityId(BUILDCITY_ID.MAIN);
		m_builds = [];
		for ( k in builds ){
			b = builds[k];
			if ( b.state != 0 ){
				m_builds.push(b);
			}
		}			
	};
	
	//--------------
	// call constructor
	//--------------
	this.initialize.apply(this, arguments);
};

UseItemBuildingSoldierGetter = function(){
	//-----------
	//private:data
	//-----------
	var m_g;
	var m_targettype;
	var m_soldiers;

	//------------
	//public:method
	//------------
	this.initialize = function(g,targettype){
		m_g = g;
		m_targettype = targettype;
		m_soldiers = m_g.getImgr().getSoldiers().recruiting;
	};
	
	this.reset = function(){
	};
	
	this.getCount = function(){
		return m_soldiers.length;
	};
	
	this.getItem = function(idx){
		var svrtime = parseInt(m_g.getSvrTimeMs()/1000);
		var soldier = m_soldiers[idx];
		var numdesc = rstr.comm.recruit+':'+soldier.number;
		var ltime = soldier.stoptime  > svrtime ? soldier.stoptime  - svrtime :  0;
		return {id:soldier.id,
				targettype:m_targettype,
				icon:soldier.itemres.smallpic,
				name:soldier.itemres.name,
				desc1:numdesc,
				desc2:ltime,
				flag:'dec',
				btntext:rstr.useitem.targetdlg.use};
	};
	
	//--------------
	// call constructor
	//--------------
	this.initialize.apply(this, arguments);
};

UseItemBuildingCultureGetter = function(){
	//-----------
	//private:data
	//-----------
	var m_g;
	var m_targettype;
	var m_cultures;

	//------------
	//public:method
	//------------
	this.initialize = function(g,targettype){
		m_g = g;
		m_targettype = targettype;
		_reset();
	};
	
	this.reset = function(){
		_reset();
	};
	
	this.getCount = function(){
		return m_cultures.length;
	};
	
	this.getItem = function(idx){
		var svrtime = parseInt(m_g.getSvrTimeMs()/1000);
		var culture = m_cultures[idx];
		var leveldesc = rstr.comm.level+':↑'+culture.level+'->'+(culture.level+1);
		var ltime = culture.stoptime > svrtime ? culture.stoptime - svrtime : 0 ;
		return {id:culture.id,
				targettype:m_targettype,
				icon:culture.itemres.smallpic,
				name:culture.itemres.name,
				desc1:leveldesc,
				desc2:ltime,
				flag:'dec',
				btntext:rstr.useitem.targetdlg.use};
	};
	
	var _reset = function(){
		var cultures = m_g.getImgr().getCultures().list;
		m_cultures = [];
		for  ( k in cultures ){
			var c = cultures[k];
			if ( c.state != 0 ){
				m_cultures.push(c);
			}
		}
	};
	
	//--------------
	// call constructor
	//--------------
	this.initialize.apply(this, arguments);
};

UseItemBuildingWeaponryGetter = function(){
	//-----------
	//private:data
	//-----------
	var m_g;
	var m_targettype;
	var m_weaponrys;

	//------------
	//public:method
	//------------
	this.initialize = function(g,targettype){
		m_g = g;
		m_targettype = targettype;
		m_weaponrys = m_g.getImgr().getWeaponrys().making;
	};
	
	this.reset = function(){
	};
	
	this.getCount = function(){
		return m_weaponrys.length;
	};
	
	this.getItem = function(idx){
		var svrtime = parseInt(m_g.getSvrTimeMs()/1000);
		var weaponry = m_weaponrys[idx];
		var numdesc = rstr.comm.make+':'+weaponry.number;
		var ltime = weaponry.stoptime > svrtime ? weaponry.stoptime-svrtime : 0;
		return {id:weaponry.id,
				targettype:m_targettype,
				icon:weaponry.itemres.smallpic,
				name:weaponry.itemres.name,
				desc1:numdesc,
				desc2:ltime,
				flag:'dec',
				btntext:rstr.useitem.targetdlg.use};
	};
	
	//--------------
	// call constructor
	//--------------
	this.initialize.apply(this, arguments);
};

UseItemOutBuildResGetter = function(){
	//-----------
	//private:data
	//-----------
	var m_g;
	var m_targettype;
	var m_buildress;

	//------------
	//public:method
	//------------
	this.initialize = function(g,targettype){
		m_g = g;
		m_targettype = targettype;
		_init();
	};
	
	this.reset = function(){
	};
	
	this.getCount = function(){
		return m_buildress.length;
	};
	
	this.getItem = function(idx){
		var build = m_buildress[idx];
		return {id:build.id,
				targettype:m_targettype,
				icon:build.itemres.smallpic,
				name:build.itemres.name,
				desc1:'',
				desc2:'',
				flag:'stable',
				btntext:rstr.useitem.targetdlg.use};
	};
	
	//------------
	//private:method
	//------------
	var _init = function(){
		if ( m_targettype == RES_TRG.OBUILDRES ){
			m_buildress = [{id:FIXID.FARM,resid:FIXID.FARM}
				,{id:FIXID.TIMBERYARD,resid:FIXID.TIMBERYARD}
				,{id:FIXID.QUARRY,resid:FIXID.QUARRY}
				,{id:FIXID.IRONORE,resid:FIXID.IRONORE}];
		}
		else if ( m_targettype == RES_TRG.FARM ){
			m_buildress = [{id:FIXID.FARM,resid:FIXID.FARM}];
		}
		else if ( m_targettype == RES_TRG.TIMBERYARD ){
			m_buildress = [{id:FIXID.TIMBERYARD,resid:FIXID.TIMBERYARD}];
		}
		else if ( m_targettype == RES_TRG.QUARRY ){
			m_buildress = [{id:FIXID.QUARRY,resid:FIXID.QUARRY}];
		}
		else if ( m_targettype == RES_TRG.IRONORE ){
			m_buildress = [{id:FIXID.IRONORE,resid:FIXID.IRONORE}];
		}
		for ( k in m_buildress ){
			var b = m_buildress[k];
			b.itemres = ItemResUtil.findItemres(b.resid);
		}
	};
	
	//--------------
	// call constructor
	//--------------
	this.initialize.apply(this, arguments);
};

/** 选择目标使用道具对话框 */
UseItemSelTargetDlg = function(){
	//-----------
	//private:const
	//-----------
	var C_CLOSE_ID = 1;
	var C_ITEM_H = 44;
	var C_SPACE_H = 5;
	var C_MAX_CNT = 6;	
	
	//-----------
	//private:data
	//-----------
	var m_g;
	var m_this;
	var m_dlg;
	var m_items={};
	var m_curitem;
	var m_targets;
	var m_targethdr;

	//------------
	//public:method
	//------------
	this.initialize = function(g){
		m_g = g;
		m_this = this;
		m_g.regEvent(EVT.PKG_CHANGE,0,m_this,_onUpdateNumber);
		m_targethdr = new UseItemTarget(m_g);
	};
	
	
	/** 打开话框 
	@param item 当前被使用的道具
	@param targets 当前被使用对象的类型列表	*/
	this.openDlg = function(item,targets){
		_initDlg();
		_initInfo(item,targets);
		m_dlg.show();
	};
	
	//------------
	//private:method
	//------------
	var _initDlg = function(){
		if ( !m_dlg ){
			m_dlg = Dialog.snew(m_g,{modal:false,
					title:rstr.useitem.targetdlg.title,
					pos:{x:"center", y:25},
					btns:[{btn:{id:C_CLOSE_ID, text:rstr.comm.close},caller:{self:m_this,caller:_onClickBtn}}]
				});
			m_g.getGUI().initDlg(m_dlg, uicfg.useitem.targetdlg, m_items);
			m_dlg.hide();
			m_dlg.setCaller({self:m_this, caller:_onDlgEvent});
		}
	};
	
	var _initInfo = function(item,targets){
		m_curitem = item;
		m_targets = targets;
		
		CommDrawItem.drawItemIconAndName(m_items.icon, m_items.name, m_curitem.itemres);
		
		TQ.setTextEx(m_items.desc,m_curitem.itemres.desc);
		TQ.setTextEx(m_items.totalnum,m_curitem.number);
		
		var needupdate = m_targethdr.set(m_items,m_curitem,m_targets);
		if ( needupdate ){
			m_targethdr.startUpdater();
		}
		
		_resetSize();
	};
	
	var _resetSize = function(){
		var tlist = m_items.targetlist;
		var cnt = tlist.getCount();
		if ( cnt > C_MAX_CNT ){
			cnt = C_MAX_CNT;
		}
		else if ( cnt == 0 ){
			cnt = 1;
		}
		var listh = C_ITEM_H*cnt;
		var tlistcon = tlist.getScroller();
		tlistcon.setSize(-1,listh);
		tlistcon.refresh();
		var listdom = tlistcon.getDom();
		var allh = parseInt(listdom.style.top)+listh+C_SPACE_H;
		var condom = m_dlg.getConDom();
		TQ.setDomHeight(condom, allh );
		TQ.setDomHeight(condom.firstChild, allh );
		m_dlg.refreshBack();
	};
	
	var _onClickBtn = function(id){
		m_dlg.hide();
	};
	
	var _onDlgEvent = function(id){
		if ( id == C_SYS_DLG_HIDE ){
			m_targethdr.stopUpdater();
		}
	};
	
	var _onUpdateNumber = function(){
		if ( m_dlg && m_dlg.isShow() ){
			TQ.setTextEx(m_items.totalnum,m_curitem.number);
		}
	};

	//--------------
	// call constructor
	//--------------
	this.initialize.apply(this, arguments);
};

/** 销售道具对话框 */
SaleItemDlg = function(){
	//-----------
	//private:const
	//-----------
	var C_CONFIRM_ID = 1;
	var C_CANCEL_ID = 2;
	
	//-----------
	//private:data
	//-----------
	var m_g;
	var m_this;
	var m_dlg;
	var m_items={};
	var m_curitem;
	var m_price=0;
	
	//------------
	//public:method
	//------------
	this.initialize = function(g){
		m_g = g;
		m_this = this;
	};
	
	/** 打开对话框 */
	this.openDlg = function(item){
		if ( !_isVailed() ){
			return;
		}
		_initDlg();
		_initInfo(item);
		m_dlg.show();
	};
	
	this.hideDlg = function(){
		if ( m_dlg ) m_dlg.hide();
	};	
	
	//------------
	//private:method
	//------------
	var _isVailed = function(){
		//bug
		//'提示','市场等级必须达到5级才可以出售物品。'
		return true;
	};
	
	var _initDlg = function(){
		if ( !m_dlg ){
			m_dlg = Dialog.snew(m_g,{modal:false,
					title:rstr.shop.saleitem.title,
					pos:{x:"center", y:25},
					btns:[{btn:{id:C_CONFIRM_ID,text:rstr.comm.confirm},caller:{self:m_this,caller:_onClickBtn}},
					{btn:{id:C_CANCEL_ID,text:rstr.comm.cancel},caller:{self:m_this,caller:_onClickBtn}}]
				});
			m_g.getGUI().initDlg(m_dlg, uicfg.shop.saledlg, m_items);
			m_dlg.hide();
			m_items.inum.setLimit(_onGetNumLimit);
			m_items.inum.setCaller({self:m_this,caller:_onNumChange});
		}
	};
	
	var _initInfo = function(item){
		m_curitem = item;
		var resitem = ItemResUtil.findItemres(m_curitem.resid); 
		if ( resitem == null ) { return; }
		m_price = resitem.saleprice;
		IMG.setBKImage(m_items.icon,IMG.makeBigImg(resitem.bigpic));
		TQ.setTextEx(m_items.totalnum,m_curitem.number);
		TQ.setTextEx(m_items.name,resitem.name);
		TQ.setTextEx(m_items.price,m_price+rstr.shop.buyitem.paynames[0]);
		TQ.setTextEx(m_items.desc,resitem.desc);
		
		m_items.inum.setVal(1);
		TQ.setTextEx(m_items.totalprice,m_price);
	};
	
	var _onGetNumLimit = function(id){
		return {min:1,max:m_curitem.number};
	};
	
	var _onNumChange = function(num){
		TQ.setTextEx(m_items.totalprice,num*m_price);
	};
	
	var _onClickBtn = function(id){
		m_dlg.hide();
		if ( id == C_CONFIRM_ID ){
			var sendmsg = '{cmd='+NETCMD.DEAL+',subcmd=1,id='+m_curitem.id+',gpos='+m_curitem.gpos+',num='+m_items.inum.getVal()+'}';
			m_g.send(null,sendmsg);
		}
	};
	
	//--------------
	// call constructor
	//--------------
	this.initialize.apply(this, arguments);
};

/** */
BaseItemFilter = Class.extern(function(){
	this.g = null;
	this.init = function(g){
		this.g = g;
	};
	
	this.filter = function(data){
		var curArms = [];
		var items = this.getSrcItems(data);
		for ( var i=0; i<items.length; ++i ) {
			var item = items[i];
			if ( !this.isFit(data, item) ) {
				continue;
			}
			
			curArms.push(item);
		}
		return curArms;
	};	
	
	this.isFit = function(data, item){
		return false;
	};
	
	this.getSrcItems = function(data){
		if (data && data.items){
			return data.items;
		}
		else {
			return this.g.getImgr().getPkgs().items;
		}
	};	
});

/** 道具类别范围过滤器 */
ItemClassRangeFilter = BaseItemFilter.extern(function(){
	this.filter = function(data){
		var curItems = [];
		var items = this.getSrcItems(data);
		var needRange = ItemClassRange.getRange(data.classId);
	
		for ( var i=0; i<items.length; ++i ) {
			var item = items[i];
			var resid = item.resid ? item.resid : item.itemres.id;
			if ( !ItemClassRange.isInRange(needRange, resid) ) {
				continue;
			}
			
			curItems.push(item);
		}
		
		return curItems;		
	};
});

/** 使用装备过滤器 */
ArmPosFilter = BaseItemFilter.extern(function(){
	this.isFit = function(data, item){
		if ( !item.itemres ) {
			return false;
		}
		
		if ( !item.itemres.apos ){
			return false;
		}
		
		if ( data.armPos == 0 ) { // all arm pos
			return true;
		}
		
		return (data.armPos == item.itemres.apos);
	};	
});

/** 可以强化和镶嵌的装备位置过滤器 */
CanIntensifyArmPosFilter = BaseItemFilter.extern(function(){
	this.isFit = function(data, item){
		if (!item.itemres.apos) {
			return false;
		}
		
		if ( data.armPos != 0 ) {
			return data.armPos == item.itemres.apos;
		}
		
		if ( item.itemres.apos < HEROARM_POS.HEAD || item.itemres.apos > HEROARM_POS.SHOES ) {
			return false;
		}
		
		return true;
	};
});

/** 可以出售道具的过滤器 */
CanSaleFilterEx = BaseItemFilter.extern(function(){
	this.isFit = function(data, item){
		var hasPrice = item.itemres.salePrice ? true : false;
		if (!hasPrice) {
			return false;
		}
		
		if (!item.gems){
			return true;
		}
		
		return item.gems.length == 0;
	};
});

/** 可以拆分装备的过滤器 */
CanSplitArmFilter = BaseItemFilter.extern(function(){
	this.isFit = function(data, item){
		var hasDecomposeGet = item.itemres.decomposeGet ? true : false;
		if (!hasDecomposeGet) {
			return false;
		}
		
		if (!item.gems){
			return true;
		}
		
		return item.gems.length == 0;
	};
});

/** 道具品质过滤器 */
ItemLevelFilter = BaseItemFilter.extern(function(){
	this.isFit = function(data, item){
		if ( data.itemLevel == 0 ) { // all arm pos
			return true;
		}
		
		return (data.itemLevel == item.itemres.level);
	};
});

/** 宝石过滤器 */
GemFilter = BaseItemFilter.extern(function(){
	this.filter = function(data){
		if (!data) data = {};
		data.classId = RES_CLS.GEMITEM;
		var items = ItemClassRangeFilter.snew(this.g).filter(data);
		items.sort(function(a, b){
			if (a.itemres.gemLevel == b.itemres.gemLevel ) {
				return a.itemres.id - b.itemres.id;
			} else {
				return b.itemres.gemLevel - a.itemres.gemLevel;
			}
		});
		return items;
	};
});

CanSaleFilter = function(){
	//-----------
	//private:const
	//-----------
	
	//-----------
	//private:data
	//-----------
	var m_g;
	var m_armpos;
	var m_items = [];

	//------------
	//public:method
	//------------
	this.init = function(g){
		m_g = g;
	};
	
	this.filter = function(data){
		m_items = [];
		var pkgs = m_g.getImgr().getPkgs().items;
		for ( var k in pkgs ){
			if ( k != 'task' ){
				_collectCanSaleItem(pkgs[k]);
			}
		}
		return m_items;
	};
	
	//------------
	//private:method
	//------------
	var _collectCanSaleItem = function(pkgitems){
		for ( var i=0; i<pkgitems.length; ++i ){
			if ( !pkgitems[i].isBind && !pkgitems[i].islock ){
				m_items.push(pkgitems[i]);
			}
		}
	};
	
	//--------------
	// call constructor
	//--------------
	this.init.apply(this, arguments);			
};

/** 使用道具过滤器 */
UseItemByEffectFilter = Class.extern(function(){
	//private:data
	var m_g;

	//public:method
	this.init = function(g){
		m_g = g;
	};
	
	// 过滤当前有效的道具 
	this.filter = function(data){
		var outputItems = [];
		for ( var i=0; i<data.effids.length; ++i ) {
			this._filterByEffectId(data.effids[i], outputItems);
		}
		return outputItems;
	};
	
	this._filterByEffectId = function(effid, outputItems){
		var mgr = m_g.getImgr();
		var eff = ItemResUtil.findEffectItems(effid);
		for ( var i in eff.items ){
			var resid = eff.items[i];
			var itemres = ItemResUtil.findItemres(resid);
			var itemId = _getItemId(itemres);
			var number = mgr.getItemNumByResId(resid);
			if ( (itemres.nobindid != undefined) && (itemres.nobindid > 0) ) {
				itemres = ItemResUtil.findItemres(itemres.nobindid);
				if (TQ.find(outputItems, 'resid', itemres.id) != null) {
					TQ.removeElement(outputItems, TQ.getLastFindIdx());
				}
			}
			outputItems.push({id:itemId, resid:resid, number:number, itemres:itemres, valid:true});
		}
	};
	
	var _getItemId = function(itemres){
		var mgr = m_g.getImgr();
		var item = mgr.getItemByResId(itemres.id);
		if ( item ) {
			return item.id;
		}
		
		var onBindItem = mgr.getItemByResId(itemres.nobindid);
		if ( !onBindItem ) {
			return 0;
		}
		
		return onBindItem.id;
	};
});

UseItemByItemIdsFilter = Class.extern(function(){
	//private:data
	var m_g;

	//public:method
	this.init = function(g){
		m_g = g;
	};
	
	// 过滤当前有效的道具 
	this.filter = function(data){
		var mgr = m_g.getImgr();
		var outputItems = [];
		for ( var i=0; i<data.itemids.length; ++i ) {
			var resid = data.itemids[i];
			var itemres = ItemResUtil.findItemres(resid);
			var itemId = _getItemId(itemres);
			var number = mgr.getItemNumByResId(resid);
			outputItems.push({id:itemId, resid:resid, number:number, itemres:itemres, valid:true});
		}
		return outputItems;
	};

	var _getItemId = function(itemres){
		var mgr = m_g.getImgr();
		var item = mgr.getItemByResId(itemres.id);
		if ( item ) {
			return item.id;
		}
		
		var onBindItem = mgr.getItemByResId(itemres.nobindid);
		if ( !onBindItem ) {
			return 0;
		}
		
		return onBindItem.id;
	};
});

/** 关联战斗可使用物品的过滤器 */
RefFightItemFilter = function(){
	//-----------
	//private:data
	//-----------
	var m_g;
	var m_scutpos;
	var m_curitems = [];

	//------------
	//public:method
	//------------
	this.initialize = function(g){
		m_g = g;
	};
	
	/** 过滤当前有效的道具 */
	this.filter = function(data){
		m_scutpos = data.scutpos;
		m_curitems = [];
		var pkgs = m_g.getImgr().getPkgs();
		for ( var i=0, n=pkgs.tags.length; i<n; ++i ){
			var items = pkgs.items[pkgs.tags[i]];
			for ( var j=0, m=items.length; j<m; ++j ){
				var item = items[j];
				if ( item.itemres.canuse && item.itemres.canuse.fight ){
					item.valid = true;
					m_curitems.push(item);
				}
			}
		}
		return m_curitems;
	};
	
	//--------------
	// call constructor
	//--------------
	this.initialize.apply(this, arguments);	
};

/** 可分派的士兵过滤器 */
SoldierFilter = function(){
	//-----------
	//private:data
	//-----------
	var m_g;
	var m_soldierpos;
	var m_curitems = [];

	//------------
	//public:method
	//------------
	this.initialize = function(g){
		m_g = g;
	};
	
	/** 过滤当前有效的道具 */
	this.filter = function(data){
		m_curitems = [];
		m_soldierpos = data.soldierpos;
		var soldiers = m_g.getImgr().getSoldiers().list;
		for ( var i=0, n=soldiers.length; i<n; ++i ){
			var s = soldiers[i];
			s.valid = true;
			m_curitems.push(s);
		}
		return m_curitems;
	};
	
	//--------------
	// call constructor
	//--------------
	this.initialize.apply(this, arguments);	
};


CommItemInfoGetter = Class.extern(function(){
	this.getInfo = function(item, timeS){
		return {number:item.number, desc:item.itemres.desc, needNumber:1, isGiftGold:false };
	};
});

AccNeedGoldCalculator = Class.extern(function(){
	this.getNeedGold = function(type, timeS){
		if ( timeS <= 0 ) {
			return 0;
		}
		
		var res = TQ.find(res_acc_needgolds, 'type', type);
		if ( !res ) {
			alert('error:689gj383q, type:' + type);
			return 0;
		}
		
		var lastPhase = {timeS:0, gold:0};
		for ( var i=0; i<res.phases.length; ++i ) {
			var phase = res.phases[i];
			if ( timeS <= phase.timeS ) {
				return lastPhase.gold + parseInt((timeS - lastPhase.timeS)*(phase.gold - lastPhase.gold)/(phase.timeS - lastPhase.timeS)) + 1;
			}
			
			if ( phase.timeS == 0 ) {
				return parseInt(timeS*lastPhase.gold/lastPhase.timeS) + 1;
			}
			
			if ( i == res.phases.length - 1 ) {
				return parseInt(timeS*phase.gold/phase.timeS) + 1;
			}
			
			lastPhase = phase;
		}
		
		return 0;
	};
}).snew();

GoldItemInfoGetter = Class.extern(function(){
	this.init = function(g){
		this.g = g;
	};
	
	this.getInfo = function(item, timeS){
		var mgr = this.g.getImgr();
		
		var numberDesc = rstr.comm.giftgold + mgr.getGiftGold() + ',' + rstr.comm.gold + mgr.getGold();
		
		var needNumber = AccNeedGoldCalculator.getNeedGold(this.getAccType(), timeS);
		var needGold = TQ.format(item.itemres.desc, needNumber);
		
		return {number:numberDesc, desc:needGold, needNumber:needNumber, isGiftGold:true};
	};
	
	this.getAccType = function(){
		alert('no implement');
	};
});

BuildGoldItemInfoGetter = GoldItemInfoGetter.extern(function(){
	this.getAccType = function(){
		return 'build';
	};
});

CultureLearnGoldItemInfoGetter =  GoldItemInfoGetter.extern(function(){
	this.getAccType = function(){
		return 'culture';
	};
});

SkeletonSteelGoldItemInfoGetter = GoldItemInfoGetter.extern(function(){
	this.getAccType = function(){
		return 'skeleton';
	};
});

SkillSteelGoldItemInfoGetter = GoldItemInfoGetter.extern(function(){
	this.getAccType = function(){
		return 'skill';
	};
});

CityDefGoldItemInfoGetter = GoldItemInfoGetter.extern(function(){
	this.getAccType = function(){
		return 'citydef';
	};
});

TradingGoldItemInfoGetter = GoldItemInfoGetter.extern(function(){
	this.getAccType = function(){
		return 'trading';
	};
});

RoleTaskGoldItemInfoGetter = GoldItemInfoGetter.extern(function(){
	this.getAccType = function(){
		return 'roletask';
	};
});


/** 特定道具使用对话框 */
FilterItemDlgEx = function(){
	//-----------
	//private:const
	//-----------
	var C_CLOSE_ID = 1;
	
	//-----------
	//private:data
	//-----------
	var m_g;
	var m_this;
	var m_dlg;
	var m_filters={};
	var m_items={};
	var m_curfilter;
	var m_caller;
	var m_resitems;// 当前过滤出来的itemlist
	var m_paramdata;

	//------------
	//public:method
	//------------
	this.initialize = function(g){
		m_g = g;
		m_this = this;
		m_filters['arm'] = ArmPosFilter.snew(m_g);
		m_filters['fightitem'] = new RefFightItemFilter(m_g);
		m_filters['soldier'] = new SoldierFilter(m_g);
		m_filters['gem'] = GemFilter.snew(m_g);
		m_filters['cansaleitem'] = new CanSaleFilter(m_g);
	};
	
	/** 打开写信对话框 */
	this.openDlg = function(data){
		m_paramdata = data;
		m_curfilter = m_filters[data.filter];
		_initDlg();
		_initInfo(data);
		m_dlg.show();
	};
	
	this.setCaller = function(caller){
		m_caller = caller;
	};
	
	//------------
	//private:method
	//------------
	var _initDlg = function(){
		if ( !m_dlg ){
			m_dlg = Dialog.snew(m_g,{modal:false,
					title:'.',
					pos:{x:"center", y:25}
					});
			m_g.getGUI().initDlg(m_dlg, uicfg.useitem.filterdlg2, m_items);
			var list = m_items.itemlist;
			list.setCaller({caller:_onClickItem,self:m_this});
			m_dlg.hide();
		}
	};
	
	var _initInfo = function(data){
		m_dlg.setTitle(data.title);
		var list = m_items.itemlist;
		m_resitems = m_curfilter.filter(data);
		list.setItemCount(m_resitems.length);
		for ( var i=0; i<m_resitems.length; ++i ){
			var item = list.getItem(i);
			CommDrawItem.drawPkgItem(item, m_resitems[i]);
			TTIP.setCallerData(item.exsubs.tooltips['$item'], {self:m_this, caller:_onGetTooltip},{idx:i});
		}
		list.scrollPos(0);
	};
	
	var _onClickItem = function(e,idx){
		var item = m_resitems[idx];
		if ( m_caller ){
			var rt = m_caller.caller.call(m_caller.self, item);
			if ( rt == RET_END ){
				m_dlg.hide();
			}
		}
	};

	var _onGetTooltip = function(data){
		if ( m_resitems && data.idx >= 0 && data.idx < m_resitems.length ){
			var ritem = m_resitems[data.idx];
			return TIPM.getItemDesc(ritem);
		}
		return null;
	};

	//--------------
	// call constructor
	//--------------
	this.initialize.apply(this, arguments);		
};

/** 穿戴装备对话框 */
WearArmDlg = function(){
	//-----------
	//private:const
	//-----------
	
	//-----------
	//private:data
	//-----------

	//------------
	//public:method
	//------------
	this.initialize = function(g){
	};
	
	/** 打开写信对话框 */
	this.openDlg = function(caller,armpos,hero){
		var dlg = UIM.getDlg('filteritemex');
		dlg.setCaller(caller);
		dlg.openDlg({title:rstr.armdlg.weararm.title,
			filter:'arm', armpos:armpos, hero:hero});
	};
	
	//------------
	//private:method
	//------------	
	
	//--------------
	// call constructor
	//--------------
	this.initialize.apply(this, arguments);
};

/** 道具快捷栏关联对话框 */
RefSCutDlg = function(){
	//------------
	//public:method
	//------------
	this.initialize = function(g){
	};
	
	/** 打开写信对话框 */
	this.openDlg = function(caller,scutpos,hero){
		var dlg = UIM.getDlg('filteritemex');
		dlg.setCaller(caller);
		dlg.openDlg({title:rstr.military.expeddlg.scuttitle,
			filter:'fightitem', scutpos:scutpos, hero:hero});
	};
	
	//--------------
	// call constructor
	//--------------
	this.initialize.apply(this, arguments);
};

/** 宣战对话框 */
DeclareWarDlg = function(){
	//-----------
	//private:const
	//-----------
	var C_CONFIRM_ID = 1;
	var C_CANCEL_ID = 2;
	
	//-----------
	//private:data
	//-----------
	var m_g;
	var m_this;
	var m_dlg;
	var m_useitem;
	var m_items = {};
	var m_player;

	//------------
	//public:method
	//------------
	this.initialize = function(g){
		m_g = g;
		m_this = this;
	};
	
	/** 打开对话框 
	@param player 只能是role
	*/
	this.openDlg = function(player){
		_initDlg();
		m_player = player;
		_initInfo();
		m_dlg.show();
	};
	
	/** 设置宣战目标的名称 */
	this.setName = function(name){
		_initDlg();
		TQ.setTextEx(m_items.name, name);
	};
	
	//------------
	//private:method
	//------------
	var _initDlg = function(){
		if ( !m_dlg ){
			m_dlg = Dialog.snew(m_g,{modal:false,
					title:rstr.military.declaredlg.title,
					pos:{x:"center", y:20},
				btns:[{btn:{id:C_CONFIRM_ID,text:rstr.comm.confirm},caller:{self:m_this,caller:_onClickBtn}},
					{btn:{id:C_CANCEL_ID,text:rstr.comm.cancel},caller:{self:m_this,caller:_onClickBtn}}]
				});
			m_g.getGUI().initDlg(m_dlg, uicfg.military.declaredlg, m_items);
			m_useitem = new InnerUseItem(m_g,m_items.uitem);
			m_useitem.setItems([{id:FIXID.EDICT}]);
			m_dlg.hide();
			m_dlg.refreshBack();
		}
	};
	
	var _initInfo = function(){
		m_useitem.setCurIdx(0);
		m_useitem.setCurIdx(-1);
		TQ.setTextEx(m_items.name, m_player.name);
	};
	
	var _checkUseItem = function(){
		var itemId = m_useitem.getItemId();
		if ( itemId > 0 ) {
			// check self item package
			var item = m_g.getImgr().getItemByResId(itemId);
			if ( !item || item.number < 1 ) {
				var buyitemdlg = UIM.getDlg('buyitem');
				buyitemdlg.openDlg({id:0,resid:itemId,number:10000});
				return false;
			}
		}
		return true;
	};
	
	var _sendDeclareCmdToSvr = function(){
		var itemId = m_useitem.getItemId();
		var sendmsg = '{cmd='+NETCMD.MILITARY;
		sendmsg += ',subcmd=1';
		sendmsg += ',useitem='+itemId;
		if ( m_player.id >= 0 ){
			sendmsg += ',id='+m_player.id;
		}
		if ( m_player.uid >= 0 ){
			sendmsg += ',uid='+m_player.uid;
		}
		if ( m_player.uid < 0 ){
			sendmsg += ',name=\"'+m_player.name+'\"';
		}
		sendmsg += '}';
		m_g.send(null, sendmsg);
		if ( m_player.uid < 0 && m_player.type == OBJ_TYPE.HERO ){
			alert('must set uid if hero: 43489f623');
		}
	};
	
	var _onClickBtn = function(id){
		if ( id == C_CONFIRM_ID ){
			if ( !_checkUseItem() ){
				return;
			}
			_sendDeclareCmdToSvr();
			m_dlg.hide();
		}
		else{
			m_dlg.hide();
		}
	};
	
	//--------------
	// call constructor
	//--------------
	this.initialize.apply(this, arguments);	
};

FindInfoDlg = function() {
	//-----------
	//private:const
	//-----------

	//-----------
	//private:data
	//-----------
	var m_g;
	var m_this;
	var m_dlg;
	var m_items = {};
	var m_lastfind = {name:'', id:0};
	var m_finds = [];
	var m_curselidx = 0;
	var m_curtype = 0;
	var m_group = null;
	var m_gui = null;

	//------------
	//public:method
	//------------
	this.initialize = function(g) {
		m_g = g;
		m_this = this;
		m_gui = m_g.getGUI();
		m_g.regEvent(EVT.NET, NETCMD.FRIEND, m_this, _onSvrPkg);
		m_g.regSendDelay('cmd_addgroup', 500);
		m_g.regSendDelay('cmd_invitegroup', 500);
		m_g.regSendDelay('cmd_inviteteam', 500);
	};

	/** 打开对话框 */
	this.openDlg = function(type, group) {
		m_curtype = type;
		m_group = group;
		_initDlg();
		_initInfo();
		m_dlg.show();
	};
	
	this.inviteTeam = function(hero){
		_sendInviteTeamCmd(hero);
	};
	
	this.addGroup = function(player){
		_sendAddGroupCmd(player);
	};

	//------------
	//private:method
	//------------
	var _initDlg = function() {
		if ( !m_dlg ) {
			m_dlg = Dialog.snew(m_g, {modal:false,
						title:rstr.friend.finddlg.title,
						pos: {x:'center', y:80},
						btns:[{btn:{id:0,text:rstr.friend.finddlg.showbtn},caller:{self:m_this,caller:_onShowFriendDetail}}
							,{btn:{id:0,text:rstr.friend.finddlg.addbtn},caller:{self:m_this,caller:_onAddFriend}}
							,{btn:{id:0,text:rstr.friend.finddlg.iaddbtn},caller:{self:m_this,caller:_onInviteAdd}}
							,{btn:{id:0,text:rstr.friend.finddlg.aaddbtn},caller:{self:m_this,caller:_onApplyAdd}}
							,{btn:{id:0,text:rstr.friend.finddlg.iteambtn},caller:{self:m_this,caller:_onInviteTeam}}
							,{btn:{id:0,text:rstr.friend.finddlg.farmbtn},caller:{self:m_this,caller:_onEnterFarm}}
							]
					});
			m_g.getGUI().initDlg(m_dlg, uicfg.friend.finddlg, m_items);
			m_dlg.hide();
					
			TQ.maxLength(m_items.iname, JVALID.getMaxUserLen());
			m_items.findtype.setCaller( {self:m_this, caller:_onChangedType});
			m_items.findbtn.setCaller( {self:m_this, caller:_onFindFriendOp});
			m_items.list.setCaller( {self:m_this, caller:_onSelectListItem}
							,null
							,null
							,{self:m_this, caller:_onDBClickListItem} );
		}
	};

	var _initInfo = function() {
		m_lastfind.name = '';
		m_lastfind.id = 0;
		m_items.list.setItemCount(0);
		m_finds = [];
		var btns = m_dlg.getBtns();
		for ( var i=0; i<btns.length; ++i ){
			btns[i].enable(false);
		}
		_reshowBtns([true,false,false,false]);
		m_dlg.refreshBtn();
		m_items.findtype.select(m_curtype);
	};
	
	var _onChangedType = function(id){
		m_curtype = id;
		m_lastfind.name ='';
		m_lastfind.id = 0;
	};

	var _onFindFriendOp = function() {
		var name = TQ.trim(m_items.iname.value);
		var id = m_items.iid.getVal();
		if ( name != '' && !JVALID.checkUsername(name) ) {
			name = '';
		}

		if ( name != '' || id != 0 ) {
			if ( m_lastfind.name != name || m_lastfind.id != id ) {
				m_lastfind.name = name;
				m_lastfind.id = id;
				var sendmsg = '{cmd='+NETCMD.FRIEND+',subcmd=4,ftype='+m_curtype+',name="'+name+'",uid='+id+'}';
				m_g.send(null, sendmsg);
			}
		}
		else {
			m_g.getGUI().msgBox(rstr.comm.msgts, rstr.friend.finddlg.validfind, MB_F_CLOSE, null);
		}
	};
	
	var _onShowFriendDetail = function(){
		var player = m_finds[m_curselidx];
		if ( player ){
			var dlg = UIM.getDlg('playerdetail');
			dlg.openDlg(player);
		}
	};
	
	var _onAddFriend = function(){
		var player = m_finds[m_curselidx];
		HDRM.getHdr('friend').applyFriend(player);
	};
	
	var _onInviteAdd = function(){
		var player = m_finds[m_curselidx];
		_sendInviteCmd(player);
	};
	
	var _onApplyAdd = function(){
		var player = m_finds[m_curselidx];
		_sendAddGroupCmd(player);
	};
	
	var _onInviteTeam = function(){
		var hero = m_finds[m_curselidx];
		_sendInviteTeamCmd(hero);
	};
	
	var _onEnterFarm = function(){
		var fd = _getOneFind(m_curselidx);
		if ( fd && fd.type == OBJ_TYPE.ROLE ){
			UIM.getDlg('farm').openDlg(fd.uid);
		}
		else if ( fd && fd.type == OBJ_TYPE.HERO && fd.owner ){
			UIM.getDlg('farm').openDlg(fd.owner.uid);
		}
	};
	
	var _sendInviteCmd = function(player){
		if ( player && m_group ){
			m_gui.sysMsgTips(SMT_NORMAL, TQ.format(rstr.friend.finddlg.invitegroup, player.name, m_group.name));
			var sendmsg = '{cmd='+NETCMD.FRIEND+',subcmd=11,uid='+player.uid+',groupuid='+m_group.uid+'}';
			m_g.send('cmd_invitegroup', sendmsg);
		}
	};
	
	var _sendAddGroupCmd = function(player){
		if ( player ){
			m_gui.sysMsgTips(SMT_NORMAL, TQ.format(rstr.friend.finddlg.addgroup, player.name));
			var sendmsg = '{cmd='+NETCMD.FRIEND+',subcmd=13,groupuid='+player.uid+'}';
			m_g.send('cmd_addgroup', sendmsg);
		}
	};
	
	var _sendInviteTeamCmd = function(hero){
		if ( hero ){
			var teamhdr = HDRM.getHdr('team');
			if ( !teamhdr.meInTeam() || teamhdr.meIsLeader() ){
				m_gui.sysMsgTips(SMT_NORMAL, TQ.format(rstr.friend.finddlg.inviteteam, hero.name));
				var sendmsg = '{cmd='+NETCMD.TEAM+',subcmd=8,uid='+hero.uid+'}';
				m_g.send('cmd_inviteteam', sendmsg);
			}
			else{ // in team, but not leader
				m_gui.sysMsgTips(SMT_WARNING, rstr.friend.finddlg.noinviteteam);
			}
		}
	};

	var _onSelectListItem = function(e, idx) {
		var enable = (m_finds.length > 0);
		var btns = m_dlg.getBtns();
		var fd = _getOneFind(idx);
		var btnshows = [];
		if ( fd ){
			if ( fd.type == OBJ_TYPE.ROLE ){
				if ( m_group ){
					btnshows = [true,true,true,false,false,true];
				}
				else{
					btnshows = [true,true,false,false,false,true];
				}
			}
			else if ( fd.type == OBJ_TYPE.GROUP ){
				btnshows = [true,false,false,true,false,false];
			}
			else if (fd.type == OBJ_TYPE.HERO ){
				if ( fd.owner ){
					btnshows = [true,false,false,false,true,true];
				}
				else{
					btnshows = [true,false,false,false,true,false];
				}
			}
			else{
				alert('error obj type: gk5939423');
			}
		}
		else{
			btnshows = [true,false,false,false,false,false];
		}
		for ( var i=0; i<btns.length; ++i ){
			btns[i].enable(enable);
		}
		_reshowBtns(btnshows);
		m_curselidx = idx;
	};
	
	var _reshowBtns = function(shows){
		var btns = m_dlg.getBtns();
		for ( var i=0; i<btns.length; ++i ){
			btns[i][shows[i]?'show':'hide']();
		}
		m_dlg.refreshBtn();
		m_dlg.refreshBack();
	};
	
	var _onDBClickListItem = function(e, idx){
		_onShowFriendDetail();
	};

	var _onSvrPkg = function(netevent) {
		var cmdpkg = netevent.data;
		if ( cmdpkg.finds ) {
			m_finds = cmdpkg.finds;
			_updateResultList();
		}
	};
	
	var _getOneFind = function(idx){
		if ( idx >= 0 && idx < m_finds.length ){
			return m_finds[idx];
		}
		return null;
	};

	var _updateResultList = function() {
		if ( !m_dlg || !m_dlg.isShow() ){
			return;
		}
		
		var list = m_items.list;
		if ( m_finds.length == 0 ) {
			list.setItemCount(1);
			var item = list.getItem(0);
			TQ.setTextEx(item.exsubs.name, rstr.friend.finddlg.nofind);
		}
		else {
			list.setItemCount(m_finds.length);
			for ( var i=0, n=list.getCount(); i<n; ++i ) {
				var item = list.getItem(i);
				var fd = m_finds[i];
				var itemres = ItemResUtil.findItemres(fd.resid);
				if ( itemres ){
					IMG.setBKImage(item.exsubs.icon,IMG.makeSmallImg(itemres.smallpic));
				}
				
				TQ.setTextEx(item.exsubs.name, fd.name);
				
				if ( fd.level ){
					TQ.setTextEx(item.exsubs.level, TQ.format(rstr.comm.flevel, fd.level));
				}

				if ( fd.cityid ){
					var cityres = ItemResUtil.findItemres(fd.cityid);
					TQ.setTextEx(item.exsubs.city, cityres.name);
				}
			}
		}
		list.setCurSel(0);
	};

	//--------------
	// call constructor
	//--------------
	this.initialize.apply(this, arguments);
};

PlayerDetailDlg = function(){
	//-----------
	//private:data
	//-----------
	var m_g;
	var m_this;
	var m_dlg;
	var m_items = {};
	var m_player;
	
	//------------
	//public:method
	//------------
	this.initialize = function(g) {
		m_g = g;
		m_this = this;
		m_gui = m_g.getGUI();
		m_g.regEvent(EVT.NET, NETCMD.FRIEND, m_this, _onSvrPkg);
	};

	/** 打开对话框 */
	this.openDlg = function(player) {
		m_player = player;
		_initDlg();
		m_dlg.show();
		_initInfo();
	};

	//------------
	//private:method
	//------------
	var _initDlg = function() {
		if ( !m_dlg ) {
			m_dlg = Dialog.snew(m_g, {modal:true,
						title:rstr.friend.detaildlg.title,
						pos: {x:'center', y:100},
						btns:[{btn:{id:0,text:rstr.friend.detaildlg.btns[0]},caller:{self:m_this,caller:_onChat}}
							,{btn:{id:0,text:rstr.friend.detaildlg.btns[1]},caller:{self:m_this,caller:_onAddFriend}}
							,{btn:{id:0,text:rstr.friend.detaildlg.btns[2]},caller:{self:m_this,caller:_onDeclareWar}}
							,{btn:{id:0,text:rstr.friend.detaildlg.btns[3]},caller:{self:m_this,caller:_onExpedition}}
							,{btn:{id:0,text:rstr.friend.detaildlg.btns[4]},caller:{self:m_this,caller:_onWriteLetter}}
							,{btn:{id:0,text:rstr.friend.detaildlg.btns[5]},caller:{self:m_this,caller:_onApplyGroup}}
							,{btn:{id:0,text:rstr.friend.detaildlg.btns[6]},caller:{self:m_this,caller:_onInviteTeam}}
							,{btn:{id:0,text:rstr.friend.detaildlg.btns[7]},caller:{self:m_this,caller:_onEnterFarm}}
							]
					});
			m_g.getGUI().initDlg(m_dlg, uicfg.friend.detaildlg, m_items);
			m_dlg.hide();
		}
	};

	var _initInfo = function() {
		_resetTitle();
		_formatBtns();
		
		_setIcon();
		_setBaseAttr();
		_setDetailInfo();
	
		_getBaseAttrFromSvr();
		_getDetailFromSvr();
		_getHeroOwnerFromSvr();
	};
	
	var _resetTitle = function(){
		var title = rstr.friend.detaildlg.title;
		if ( m_player.type == OBJ_TYPE.ROLE ){
			title += rstr.friend.detaildlg.titlesuffix[0];
		}
		else if ( m_player.type == OBJ_TYPE.GROUP ){
			title += rstr.friend.detaildlg.titlesuffix[1];
		}
		else if ( m_player.type == OBJ_TYPE.HERO ){
			title += rstr.friend.detaildlg.titlesuffix[2];
		}
		m_dlg.setTitle(title);
	};
	
	var _formatBtns = function(){
		var shows = [false,false,false,false,false,false,false,true];
		if ( m_player.type == OBJ_TYPE.ROLE ){
			shows = [true,true,true,true,true,false,false,true];
		}
		else if ( m_player.type == OBJ_TYPE.GROUP ){
			shows = [false,false,false,false,false,true,false,false];
		}
		else if ( m_player.type == OBJ_TYPE.HERO ){
			shows = [true,true,true,true,true,false,true,true];
		}
		
		var btns = m_dlg.getBtns();
		for(var i=0; i<shows.length; ++i){
			btns[i][shows[i]?'show':'hide']();
		};
		m_dlg.refresh();
	};
	
	var _getAttr = function(attr){
		return m_player[attr] ? m_player[attr] : '';
	};
	
	var _setIcon = function(){
		if ( _isPositive(m_player.resid) ){
			var playerres = ItemResUtil.findItemres(m_player.resid);
			if ( playerres ){
				IMG.setBKImage(m_items.icon,IMG.makeBigImg(playerres.bigpic));
			}
		}
	};
	
	var _isPositive = function(val){
		return (val != undefined && val >= 0 );
	};
	
	var _setBaseAttr = function(){
		TQ.setTextEx(m_items.name, m_player.name ? m_player.name : '' );
		TQ.setTextEx(m_items.id, _isPositive(m_player.uid) ? m_player.uid : '' );
		
		TQ.setTextEx(m_items.level, _isPositive(m_player.level) ? m_player.level : '' );
		
		var cityname = '';
		if ( _isPositive(m_player.cityid) ){
			var cityres = ItemResUtil.findItemres(m_player.cityid);
			if ( cityres ){
				cityname = cityres.name;
			}
		}
		TQ.setTextEx(m_items.city, cityname);
		
		var sex = _isPositive(m_player.sex) ? rstr.comm.sexs[m_player.sex] : '';
		TQ.setTextEx(m_items.sex, sex);
		
		var alliance = m_player.alliance ? m_player.alliance : {uid:0, name:''};
		TQ.setTextEx(m_items.alliance, alliance.name);
	};
	
	var _setDetailInfo = function(){
		var desc = '';
		if ( m_player.type == OBJ_TYPE.HERO ){
			var hero = _getHero();
			desc += _getHeroOwnerDesc(hero) + '<br/>';
			desc += _getHeroAttrsDesc(hero) + '<br/>';
		}
		else if ( m_player.desc ){
			desc += m_player.desc;
		}
		
		TQ.setTextEx(m_items.desc, desc);
	};
	
	var _getBaseAttrFromSvr = function(){
		if ( _isNeedBaseAttrInfo() ){
			var sendmsg = '{cmd='+NETCMD.FRIEND+',subcmd=24,type='+m_player.type;
			if ( m_player.uid >= 0 ){
				sendmsg += ',uid='+m_player.uid;
			}
			if ( m_player.uid < 0 ){
				sendmsg += ',name=\"'+m_player.name+'\"';
			}
			sendmsg += '}';
			m_g.send(null, sendmsg);
			if ( m_player.uid < 0 && m_player.type == OBJ_TYPE.HERO ){
				alert('must set uid if hero: 3684323');
			}
		}
	};
	
	var _getDetailFromSvr = function(){
		if ( _isNeedDetailInfo() ){
			var sendmsg = '{cmd='+NETCMD.FRIEND+',subcmd=5,type='+m_player.type;
			if ( m_player.id >= 0 ){
				sendmsg += ',id='+m_player.id;
			}
			if ( m_player.uid >= 0 ){
				sendmsg += ',uid='+m_player.uid;
			}
			if ( m_player.uid < 0 ){
				sendmsg += ',name=\"'+m_player.name+'\"';
			}
			sendmsg += '}';
			m_g.send(null, sendmsg);
			if ( m_player.uid < 0 && m_player.type == OBJ_TYPE.HERO ){
				alert('must set uid if hero: 98589279fd');
			}
		}
	};
	
	var _getHeroOwnerFromSvr = function(){
		var hero = _getHero();
		if ( hero && _isNeedOwnerInfo(hero) ){
			var sendmsg = '{cmd='+NETCMD.FRIEND+',subcmd=25,type='+hero.type+',uid='+hero.uid+'}';
			m_g.send(null, sendmsg);	
		}
	};

	var _isNeedBaseAttrInfo = function(){
		return ( m_player.resid < 0 );
	};
	
	var _isNeedDetailInfo = function(){
		var need = false;
		if ( m_player.type == OBJ_TYPE.HERO && !m_player.attrs ){
			need = true;
		}
		else if ( m_player.type != OBJ_TYPE.HERO && !m_player.desc ){
			need = true;
		}
		return need;
	};
	
	var _isNeedOwnerInfo = function(hero){
		return !hero.owner;
	};
	
	var _getHeroOwnerDesc = function(hero){
		var role = hero.owner;
		if ( role ){
			return TQ.format(rstr.heroattr.owner, role.name, role.uid);
		}
		return '';
	};
	
	var _getHeroAttrsDesc = function(hero){
		var szattrs = '';
		if ( hero.attrs ){
			for ( var i=0; i<res_heroattrs.length; ++i ){
				szattrs += _getOneAttrDesc(res_heroattrs[i], hero.attrs) + '<br/>';
			}
		}
		return szattrs;
	};
	
	var _getOneAttrDesc = function(attrdesc, attrs){
		var szattr = '';
		szattr += attrdesc.name;
		for ( var i=0; i<attrdesc.attrs.length; ++i ){
			var attr = attrs[attrdesc.attrs[i]];
			if ( i > 0 ){//add backslash after first val, like:  a/b/c
				szattr += '/';
			}
			szattr += attr.val;
			if ( attr.u == VAL_UNIT.PER ){
				szattr += '%';
			}
		}
		return szattr;
	};
	
	var _getRole = function(){
		if ( m_player.type == OBJ_TYPE.ROLE ){
			return m_player;
		}
		else if ( m_player.type == OBJ_TYPE.HERO ){
			return m_player.owner;
		}
		return null;
	};
	
	var _getGroup = function(){
		if ( m_player.type == OBJ_TYPE.GROUP ){
			return m_player;
		}
		return null;
	};
	
	var _getHero = function(){
		if ( m_player.type == OBJ_TYPE.HERO ){
			return m_player;
		}
		return null;
	};
	
	var _onChat = function(){
		UIM.getPanel('chat').setChatTarget(_getRole().name);
	};
	
	var _onAddFriend = function(){
		HDRM.getHdr('friend').applyFriend(_getRole());
	};
	
	var _onDeclareWar = function(){
		UIM.getDlg('declarewar').openDlg(_getRole());
	};
	
	var _onExpedition = function(){
		UIM.getDlg('expedition').openDlg(_getRole());
	};
	
	var _onWriteLetter = function(){
		HDRM.getHdr('letter').writeLetter(_getRole());
	};
	
	var _onApplyGroup = function(){
		UIM.getDlg('findinfo').addGroup(_getGroup());
	};
	
	var _onInviteTeam = function(){
		UIM.getDlg('findinfo').inviteTeam(_getHero());
	};
	
	var _onEnterFarm = function(){
		var role = _getRole();
		if ( role ){
			UIM.getDlg('farm').openDlg(role.uid);
		}
	};

	var _onSvrPkg = function(netevent) {
		if ( !m_dlg || !m_dlg.isShow() ){
			return;
		}
		
		var cmdpkg = netevent.data;
		if ( cmdpkg.baseobj && (m_player.uid < 0 || m_player.uid == cmdpkg.baseobj.uid) ){
			TQ.dictCopy(m_player, cmdpkg.baseobj);
			_setIcon();
			_setBaseAttr();
		}
		
		if ( cmdpkg.heroowner && (m_player.uid < 0 || m_player.uid == cmdpkg.heroowner.uid) ){
			TQ.dictCopy(m_player, cmdpkg.heroowner);
			_setDetailInfo();
		};
		
		if ( cmdpkg.detailobj && (m_player.uid < 0 || m_player.uid == cmdpkg.detailobj.uid) ) {
			TQ.dictCopy(m_player, cmdpkg.detailobj);
			_setDetailInfo();
		}
	};

	//--------------
	// call constructor
	//--------------
	this.initialize.apply(this, arguments);
};

ChatConScroller = Class.extern(function(){
	//------------
	//public:method
	//------------
	this.init = function(g){
		m_g = g;
		m_this = this;
	};
	
	/** 初始化滚动信息
	@param scroller 滚动对象
	@param maxlines 显示的最大行数
	@param reducelines 当聊天行数大于maxlines时一次减少的行数
	*/
	this.initScroller = function(scroller, maxlines, reducelines){
		m_scroller = scroller;
		m_scroller.setCanSelect();
		m_con = m_scroller.getContainerObj();
		m_maxShowLines = maxlines;
		if ( m_maxShowLines < 1 ) {
			m_maxShowLines = 1;
		}
		
		m_reduceLines = reducelines;
		if ( m_reduceLines > m_maxShowLines ){
			m_reduceLines = m_maxShowLines;
		}
		
		if ( m_reduceLines < 1 ){
			m_reduceLines = 1;
		}
	};
	
	this.append = function(msg){
		_append(msg);
	};
	
	this.clear = function(){
		m_reduceCurLine=0;
		m_showLines=0;
		m_reducePoss=[];
		m_reduceScrollHs=[];
		m_allMsgLen=0;
		m_lastCutPos=0;
		m_allMsgScrollH=0;
		m_lastScrollH=0;
		
		TQ.setHtml(m_con, '');
		m_scroller.stopDownBlink();
		m_scroller.refresh();
	};
	
	this.refresh = function(){
		m_scroller.refresh();
	};
	
	//-----------
	//private:method
	//-----------
	var _append = function(msg){
		var need = _isNeedScrollEnd();
		var curh = _cutMsg();
		_addMsg(msg);
		_addReducePos();
		_refreshAndCalScrollH();
		_synchronizeScrollHs();
		if ( need ){
			m_scroller.scrollEnd();
		}
		else{// start blink down arrow btn
			_startBlinkDownArraw();
			if ( curh ){//refresh by reset scroll pos
				var pos = m_scroller.getScrollPos();
				pos = Math.max(0, pos - curh);
				m_scroller.scrollPos(pos);
			}
		}	
	};
	
	var _isNeedScrollEnd = function(){
		return m_scroller.isNearToEnd();
	};
	
	var _cutMsg = function(){
		var curh = 0;
		if ( (++m_showLines) >= m_maxShowLines && m_reducePoss.length > 0 ){
			var msg = m_con.innerHTML;
			
			var cutpos = _cutPos();
			curh = _cutScrollH();
			
			msg = msg.substr(cutpos, msg.length-cutpos);
			m_con.innerHTML = msg;
			m_showLines -= m_reduceLines;
		}
		return curh;
	};
	
	var _cutPos = function(){
		var pos = m_reducePoss[0];
		TQ.removeElement(m_reducePoss, 0);
		var cutpos = pos - m_lastCutPos;
		m_lastCutPos = pos;
		return cutpos;
	};
	
	var _cutScrollH = function(){
		var scrollpos = m_reduceScrollHs[0];
		TQ.removeElement(m_reduceScrollHs, 0);
		curh = scrollpos - m_lastScrollH;
		m_lastScrollH = scrollpos;
		return curh;
	};
	
	var _addMsg = function(msg){
		var pos0 = m_con.innerHTML.length;
		m_con.innerHTML += msg;
		var pos1 = m_con.innerHTML.length;
		m_allMsgLen += (pos1 - pos0);
	};
	
	var _addReducePos = function(){
		if ( (++m_reduceCurLine) >= m_reduceLines ){
			m_reducePoss.push(m_allMsgLen);
			m_reduceCurLine = 0;
		}
	};

	var _refreshAndCalScrollH = function(){
		var lasth = m_scroller.getRange();
		m_scroller.refresh();
		m_allMsgScrollH += (m_scroller.getRange() - lasth);
	};

	var _synchronizeScrollHs = function(){
		if ( m_reduceScrollHs.length < m_reducePoss.length ){
			m_reduceScrollHs.push(m_allMsgScrollH);
		}
	};
	
	var _startBlinkDownArraw = function(){
		m_scroller.startDownBlink();
	};
	
	//-----------
	//private:data
	//-----------
	var m_g;
	var m_this;
	var m_scroller;
	var m_con;
	var m_maxShowLines=1000;//容许最大的显示行数
	var m_reduceLines=50;//当聊天行数大于 m_maxShowLines 时一次减少的行数
	var m_reduceCurLine=0;//每一轮（每增加m_reducelines行数为一轮）的行数计数
	var m_showLines=0;//当前显示行数的行数
	var m_reducePoss=[];//保存当字符串每增加m_reducelines行数时对应的消息字符串位置
	var m_reduceScrollHs=[];//保存当字符串每增加m_reducelines行数时对应一轮消息的像素高度
	var m_allMsgLen=0;//自开始时所有消息字符串长度
	var m_lastCutPos=0;//最近一次被裁减的字符串位置
	var m_allMsgScrollH=0;//自开始时所有消息字符串的高度
	var m_lastScrollH=0;//最近一次被裁减的Scroll高度
});

FontSizePanelBtn = Class.extern(function(){
	//-----------
	//private:data
	//-----------
	var m_g;
	var m_this;
	var m_btn;
	var m_panel;
	var m_caller;

	//------------
	//public:method
	//------------
	this.init = function(g, dom, ops){
		m_g = g;
		m_this = this;
		_init(dom, ops);
	};
	
	this.setCaller = function(caller){
		m_caller = caller;
	};
	
	this.setDefaultSize = function(idx){
		m_panel.setCurSel(idx);
		_setFontSize(idx);
	};
	
	//------------
	//private:method
	//------------
	var _init = function(dom, ops){
		if ( !ops ){
			ops = {};
		}
		if ( !ops.uiback ){
			ops.uiback = uiback.btn.font;
		}
		m_btn = new ComButton(m_g, dom, ops);
		m_btn.setCaller({self:m_this, caller:_onClickBtn});
		m_panel = new FontSizePanel(m_g);
		m_panel.setCaller({self:m_this, caller:_onSetFontSize});
	};
	
	var _onClickBtn = function(){
		m_g.getGUI().showBtnPanel(0, m_btn.getDom(), m_panel);
	};
	
	var _onSetFontSize = function(idx){
		_setFontSize(idx);
	};
	
	var _setFontSize = function(idx){
		if ( m_caller ){
			m_caller.caller.call(m_caller.self, idx);
		}
	};
});

ColorPanelBtn = Class.extern(function(){
	//-----------
	//private:data
	//-----------
	var m_g;
	var m_this;
	var m_btn;
	var m_panel;
	var m_caller;
	var m_curcoloridx=0;

	//------------
	//public:method
	//------------
	this.init = function(g, dom, ops){
		m_g = g;
		m_this = this;
		_init(dom, ops);
	};
	
	this.setCaller = function(caller){
		m_caller = caller;
	};
	
	this.setDefaultColor = function(idx){
		var szcolor = m_panel.getColorByIdx(idx);
		if ( szcolor ){
			_setColor({color:szcolor, idx:idx});
		}
	};
	
	//------------
	//private:method
	//------------
	var _init = function(dom, ops){
		if ( !ops ){
			ops = {};
		}
		if ( !ops.uiback ){
			ops.uiback = uiback.btn.color;
		}
		m_btn = new ComButton(m_g, dom, ops);
		m_btn.setCaller({self:m_this, caller:_onClickBtn});
		m_panel = new ColorPanel(m_g);
		m_panel.setCaller({self:m_this, caller:_onSetColor});
	};
	
	var _onClickBtn = function(){
		m_g.getGUI().showBtnPanel(0, m_btn.getDom(), m_panel);
	};
	
	var _onSetColor = function(data){
		_setColor(data);
	};
	
	var _setColor = function(data){
		var dom = m_btn.getDom();
		dom.style.backgroundColor = data.color;
		m_curcoloridx = data.idx;
		
		if ( m_caller ){
			m_caller.caller.call(m_caller.self, data);
		}
	};
});

FontSizePanel = function(){
	//-----------
	//private:data
	//-----------
	var m_g;
	var m_this;
	var m_panel;
	var m_caller;
	var m_items={};
	var m_uibackres = uiback.dlg.minihelp;
	var m_fonts=[12,14,16];

	//------------
	//public:method
	//------------
	this.initialize = function(g){
		m_g = g;
		m_this = this;
		_init();
	};
	
	this.setCaller = function(caller){
		m_caller = caller;
	};
	
	this.show = function(pos){
		m_panel.show(pos);
	};
	
	this.getSizeByIdx = function(idx){
		if ( idx >= 0 && idx < m_fonts.length ){
			return m_fonts[idx];
		}
		return null;
	};
	
	this.getSize = function(){
		return {cx:m_panel.getWidth(), cy:m_panel.getHeight()};
	};
	
	this.setCurSel = function(sel){
		m_items.list.setCurSel(sel);
	};

	//------------
	//private:method
	//------------
	var _init = function(){
		m_panel = new PopPanel(m_g, {});
		var panel = m_panel.getDom();
		var gui = m_g.getGUI();
		gui.initPanel(panel, uicfg.fontsizepanel, m_items);
		m_panelback = gui.createPanelUIBack(panel, m_uibackres);
		var w = TQ.getDomWidth(panel);
		var h = TQ.getDomHeight(panel);
		gui.setUIBack(m_panelback, w, h, m_uibackres.type);
		m_items.list.setItemCount(rstr.sizepanel.items.length);
		for ( var i=0, n=m_items.list.getCount(); i<n; ++i ){
			var item = m_items.list.getItem(i);
			TQ.setTextEx(item.exsubs.fontsize, rstr.sizepanel.items[i]);
		}
		m_items.list.setCaller({self:m_this, caller:_onSelectItem});
		m_panel.hide();
	};
	
	var _onSelectItem = function(e, idx){
		if ( m_caller ){
			m_caller.caller.call(m_caller.self, idx);
		}
		m_panel.hide();
	};
	
	//--------------
	// call constructor
	//--------------
	this.initialize.apply(this, arguments);	
};

ColorPanel = function(){
	//-----------
	//private:const
	//-----------
	var C_MAXCOLS = 8;
	var C_DIRIDXLEN = 2;
	
	//-----------
	//private:data
	//-----------
	var m_g;
	var m_this;
	var m_btn;
	var m_panel;
	var m_caller;
	var m_items={};
	var m_uibackres = uiback.dlg.minihelp;
	var m_colors=[
			'#000000'
			,'#800000'
			,'#008000'
			,'#808000'
			,'#000080'
			,'#800080'
			,'#008080'
			,'#808080'
			,'#C0C0C0'
			,'#FF0000'
			,'#00FF00'
			,'#FFFF00'
			,'#0000FF'
			,'#FF00FF'
			,'#00FFFF'
			,'#FFFFFF'
		];

	//------------
	//public:method
	//------------
	this.initialize = function(g){
		m_g = g;
		m_this = this;
		_init();
	};
	
	this.setCaller = function(caller){
		m_caller = caller;
	};
	
	this.show = function(pos){
		m_panel.show(pos);
	};
	
	this.getSize = function(){
		return {cx:m_panel.getWidth(), cy:m_panel.getHeight()};
	};
	
	this.getColorByIdx = function(idx){
		if ( idx >= 0 && idx < m_colors.length ){
			return m_colors[idx];
		}
		return null;
	};
	
	//------------
	//private:method
	//------------
	var _init = function(){
		m_panel = new PopPanel(m_g, {});
		var panel = m_panel.getDom();
		var gui = m_g.getGUI();
		gui.initPanel(panel, uicfg.colorpanel, m_items);
		m_panelback = gui.createPanelUIBack(panel, m_uibackres);
		var w = TQ.getDomWidth(panel);
		var h = TQ.getDomHeight(panel);
		gui.setUIBack(m_panelback, w, h, m_uibackres.type);
		
		for ( var i=0, n=m_items.list.getCount(); i<n; ++i ){
			var item = m_items.list.getItem(i);
			item.exsubs.coloritem.style.backgroundColor = m_colors[i];
		}
		m_items.list.setCaller({self:m_this, caller:_onSelectItem});
		m_panel.hide();
	};
	
	var _onSelectItem = function(e, idx){
		if ( m_caller ){
			m_caller.caller.call(m_caller.self, {color:m_colors[idx],idx:idx});
		}
		m_panel.hide();
	};
	
	//--------------
	// call constructor
	//--------------
	this.initialize.apply(this, arguments);	
};


CreateGroupDlg = function(){
	//-----------
	//private:const
	//-----------
	var C_CONFIRM_ID = 1;
	var C_CANCEL_ID = 2;
	
	//-----------
	//private:data
	//-----------
	var m_g;
	var m_this;
	var m_dlg;
	var m_items = {};
	var m_typeinfos = [{members:10,money:10},{members:50,money:50},{members:100,money:2000}];

	//------------
	//public:method
	//------------
	this.initialize = function(g) {
		m_g = g;
		m_this = this;
		m_gui = m_g.getGUI();
	};

	/** 打开对话框 */
	this.openDlg = function(player) {
		m_player = player;
		_initDlg();
		_initInfo();
		m_dlg.show();
	};

	//------------
	//private:method
	//------------
	var _initDlg = function() {
		if ( !m_dlg ) {
			m_dlg = Dialog.snew(m_g, {modal:true,
						title:rstr.friend.crtgroupdlg.title,
						pos: {x:'center', y:80},
						btns:[{btn:{id:C_CONFIRM_ID,text:rstr.comm.confirm},caller:{self:m_this,caller:_onClickBtn}},
							{btn:{id:C_CANCEL_ID,text:rstr.comm.cancel},caller:{self:m_this,caller:_onClickBtn}}]
					});
			m_g.getGUI().initDlg(m_dlg, uicfg.friend.creategroup, m_items);
			TQ.maxLength(m_items.inputname, JVALID.getMaxGroupLen());
			TQ.maxLength(m_items.idesc.getContainerObj(), JVALID.getMaxDescGroupLen());
			m_items.grouptype.select(0);
			for ( var i=0; i<m_typeinfos.length; ++i ){
				var ti = m_typeinfos[i];
				var r = m_items.grouptype.getRadio(i);
				var st = rstr.friend.crtgroupdlg.types[i];
				r.setText(TQ.format(st, ti.members, ti.money));
			}
			m_dlg.hide();
		}
	};

	var _initInfo = function() {
	};
	
	var _checkMoneyEnough = function(need){
		return (need <= m_g.getImgr().getMoney());
	};
	
	var _onClickBtn = function(id){
		if ( id == C_CONFIRM_ID ){
			if ( !JVALID.checkGroupName(m_items.inputname.value) ){
				m_g.getGUI().msgBox(rstr.comm.msgts, rstr.friend.crtgroupdlg.invalidname, MB_F_CLOSE,  {self:m_this,
					 caller:function(id){
							m_items.inputname.focus();
						}
					}
				);
				return;
			}
			
			var grouptype = m_items.grouptype.getCurSelId();
			if ( !_checkMoneyEnough(m_typeinfos[grouptype].money) ){
				m_g.getGUI().msgBox(rstr.comm.msgts, rstr.friend.crtgroupdlg.nomoney, MB_F_CLOSE, null);
				return;
			}
			
			m_g.getGUI().msgBox(rstr.comm.msgts, rstr.friend.crtgroupdlg.confirmcreate, MB_F_YESNO, {self:m_this,
				caller:function(id){
						if ( id == MB_IDYES ){
							var idesc = m_items.idesc.getContainerObj();
							var desc = TQ.trim(idesc.value);
							if ( desc.length > JVALID.getMaxDescGroupLen() ){
								desc = desc.substr(0, JVALID.getMaxDescGroupLen());
							}
							var sendmsg = '{cmd='+NETCMD.FRIEND+',subcmd=16,gtype='+grouptype+',desc=[[-'+desc+'-]],name=[[-'+m_items.inputname.value+'-]]}';
							m_g.send(null,sendmsg);
							m_dlg.hide();
						}
					}
				}
			);
		}
		else{
			m_dlg.hide();
		}
	};

	//--------------
	// call constructor
	//--------------
	this.initialize.apply(this, arguments);
};

ManageGroupDlg = function(){
	//-----------
	//private:data
	//-----------
	var m_g;
	var m_this;
	var m_dlg;
	var m_items = {};
	var m_group;
	var m_curselidx=-1;
	var m_lastseq = 0;

	//------------
	//public:method
	//------------
	this.initialize = function(g) {
		m_g = g;
		m_this = this;
		m_gui = m_g.getGUI();
		m_g.regEvent(EVT.NET, NETCMD.FRIEND, m_this, _onSvrPkg);
	};

	/** 打开对话框 */
	this.openDlg = function(group) {
		m_group = group;
		_initDlg();
		_initInfo();
		m_dlg.show();
	};

	//------------
	//private:method
	//------------
	var _initDlg = function() {
		if ( !m_dlg ) {
			m_dlg = Dialog.snew(m_g, {modal:true,
						title:rstr.friend.mgroupdlg.title,
						pos: {x:'center', y:30},
						btns:[{btn:{id:0,text:rstr.friend.mgroupdlg.ops[0]},caller:{self:m_this,caller:_onClickTransferBtn}}
							,{btn:{id:0,text:rstr.friend.mgroupdlg.ops[1]},caller:{self:m_this,caller:_onClickAppointBtn}}
							,{btn:{id:0,text:rstr.friend.mgroupdlg.ops[2]},caller:{self:m_this,caller:_onClickFireBtn}}
							,{btn:{id:0,text:rstr.friend.mgroupdlg.ops[3]},caller:{self:m_this,caller:_onClickKickoutBtn}}
							]
							
					});
			m_g.getGUI().initDlg(m_dlg, uicfg.friend.memberdlg, m_items);
			m_items.list.setCaller( {self:m_this, caller:_onSelectListItem} );
			_reshowBtns([false,false,false,true]);
			m_dlg.hide();
		}
	};

	var _initInfo = function() {
		if ( !m_group.detail ){
			var sendmsg = '{cmd='+NETCMD.FRIEND+',subcmd=17,id='+m_group.id+'}';
			m_lastseq = m_g.send(null,sendmsg);
		}
		else{
			_updateInfo();
		}
	};
	
	var _onClickTransferBtn = function(id){
		var curm = _getMemberByIdx(m_curselidx);
		if ( curm ){
			var _onMsgBoxCaller = function(id){
				if ( id == MB_IDYES ){
					var sendmsg = '{cmd='+NETCMD.FRIEND+',subcmd=19,guid='+m_group.uid+',uid='+curm.uid+'}';
					m_g.send(null,sendmsg);
				}
			};
			m_g.getGUI().msgBox(rstr.comm.msgts, TQ.format(rstr.friend.mgroupdlg.transfer, m_group.name, curm.name), 
				MB_F_YESNO, {self:m_this, caller:_onMsgBoxCaller} );
		}
	};
	
	var _onClickAppointBtn = function(id){
		var curm = _getMemberByIdx(m_curselidx);
		if ( curm ){
			var _onMsgBoxCaller = function(id){
				if ( id == MB_IDYES ){
					var sendmsg = '{cmd='+NETCMD.FRIEND+',subcmd=20,guid='+m_group.uid+',uid='+curm.uid+'}';
					m_g.send(null,sendmsg);
				}
			};
			m_g.getGUI().msgBox(rstr.comm.msgts, TQ.format(rstr.friend.mgroupdlg.appoint, curm.name, m_group.name), 
				MB_F_YESNO, {self:m_this, caller:_onMsgBoxCaller} );
		}
	};
	
	var _onClickFireBtn = function(id){
		var curm = _getMemberByIdx(m_curselidx);
		if ( curm ){
			var _onMsgBoxCaller = function(id){
				if ( id == MB_IDYES ){
					var sendmsg = '{cmd='+NETCMD.FRIEND+',subcmd=21,guid='+m_group.uid+',uid='+curm.uid+'}';
					m_g.send(null,sendmsg);
				}
			};
			m_g.getGUI().msgBox(rstr.comm.msgts, TQ.format(rstr.friend.mgroupdlg.fire, curm.name, m_group.name), 
				MB_F_YESNO, {self:m_this, caller:_onMsgBoxCaller} );
		}
	};
	
	var _onClickKickoutBtn = function(id){
		var curm = _getMemberByIdx(m_curselidx);
		if ( curm ){
			var _onMsgBoxCaller = function(id){
				if ( id == MB_IDYES ){
					var sendmsg = '{cmd='+NETCMD.FRIEND+',subcmd=22,guid='+m_group.uid+',uid='+curm.uid+'}';
					m_g.send(null,sendmsg);
				}
			};
			m_g.getGUI().msgBox(rstr.comm.msgts, TQ.format(rstr.friend.mgroupdlg.kickout, curm.name, m_group.name), 
				MB_F_YESNO, {self:m_this, caller:_onMsgBoxCaller} );
		}
	};
	
	var _onSvrPkg = function(netevent){
		if ( _isDlgOpen() ){
			var cmdpkg = netevent.data;
			if ( cmdpkg._s == m_lastseq && cmdpkg.detailgroup && cmdpkg.detailgroup.id == m_group.id ){
				TQ.dictCopy(m_group, cmdpkg.detailgroup);
				_updateInfo();
			}
		}
	};
	
	var _onSelectListItem = function(e, idx){
		m_curselidx = idx;
		var m = _getMemberByIdx(idx);
		if ( !m ){
			return;
		}

		if ( m_group.gpos == GROUP_POS.ADMIN ){
			if ( m.gpos == GROUP_POS.ADMIN ){
				_reshowBtns([false,false,false,false]);
			}
			else if ( m.gpos == GROUP_POS.ASSIST ){
				_reshowBtns([true,false,true,false]);
			}
			else if ( m.gpos == GROUP_POS.COMM ){
				_reshowBtns([false,true,false,true]);
			}
		}
		else if ( m_group.gpos == GROUP_POS.ASSIST ){
			if ( m.gpos == GROUP_POS.ASSIST || m.gpos == GROUP_POS.ADMIN ){
				_reshowBtns([false,false,false,false]);
			}
			else if ( m.gpos == GROUP_POS.COMM ){
				_reshowBtns([false,false,false,true]);
			}
		}
	};
	
	var _isDlgOpen = function(){
		if ( m_dlg && m_dlg.isShow() ){
			return true;
		}
		return false;
	};
	
	var _getMemberByIdx = function(idx){
		if ( idx >= 0 && idx < m_group.detail.members.length ){
			return m_group.detail.members[idx];
		}
		return null;
	};
	
	var _reshowBtns = function(shows){
		var btns = m_dlg.getBtns();
		for ( var i=0; i<btns.length; ++i ){
			btns[i][shows[i]?'show':'hide']();
		}
		m_dlg.refreshBtn();
		m_dlg.refreshBack();
	};
	
	var _updateInfo = function(){
		TQ.setTextEx(m_items.desc, m_group.detail.desc);
		m_items.list.setItemCount(m_group.detail.members.length);
		for ( var i=0, n=m_group.detail.members.length; i<n; ++i ){
			var member = m_group.detail.members[i];
			var item = m_items.list.getItem(i);
			if ( !member.itemres || member.resid != member.itemres.id ){
				member.itemres = ItemResUtil.findItemres(member.resid);
			}
			IMG.setBKImage(item.exsubs.icon,IMG.makeSmallImg(member.itemres.smallpic));
			
			// set pos
			IMG.setBKImage(item.exsubs.pos, IMG.makeGroupPosImg(member.gpos));
			
			TQ.setTextEx(item.exsubs.name,member.name);
			
			if ( member.level ){
				TQ.setTextEx(item.exsubs.level, TQ.format(rstr.comm.flevel, member.level));
			}

			if ( member.cityid ){
				var cityres = ItemResUtil.findItemres(member.cityid);
				TQ.setTextEx(item.exsubs.city, cityres.name);
			}
		}
		m_items.list.setCurSel(m_items.list.getCount()>0 ? 0:-1);
	};

	//--------------
	// call constructor
	//--------------
	this.initialize.apply(this, arguments);
};

FriendHandler = function(){
	//-----------
	//private:data
	//-----------
	var m_g;
	var m_this;
	
	//------------
	//public:method
	//------------
	this.init = function(g){
		m_g = g;
		m_this = this;
	};
	
	this.applyFriend = function(role){
		_applyFriend(role);
	};
	
	this.getAllListFromSvr = function(){
		_getAllListFromSvr();
	};
	
	//------------
	//private:method
	//------------
	var _applyFriend = function(role){
		m_g.getGUI().sysMsgTips(SMT_NORMAL, TQ.format(rstr.map.addfriend, role.name));
		FriendSender.sendApplyFriend(m_g, role.name);
	};
	
	var _getAllListFromSvr = function(){
		FriendSender.getAllFriends(m_g);
	};
	
	this.init.apply(this, arguments);
};


TeamDlg = function(){
	//-----------
	//private:const
	//-----------
	var C_BTN_CREATE_ID = 0;
	var C_BTN_APPLY_ID = 1;
	var C_BTN_TRAN_ID = 2;
	var C_BTN_TICKOUT_ID = 3;
	var C_BTN_INVITE_ID = 4;
	var C_BTN_STEPOUT_ID = 5;
	var C_BTN_EXITTEAM_ID = 6;
	var C_BTN_ADDFRIEND_ID = 7;
	var C_BTN_CHAT_ID = 8;
	var C_BTN_LETTER_ID = 9;
	var C_BTN_RETURN_ID = 10; // 只是显示
	
	var C_BTN_AGREEJOIN_ID = 10;
	var C_BTN_REFUSEJOIN_ID = 11;
	var C_BTN_ALLREFUSE_ID = 12;
	
	var C_BTN_REFRESH_1_ID = 20;
	var C_BTN_ADDFRIEND_1_ID = 21;
	var C_BTN_INVITE_1_ID = 22;
	
	var C_BTN_REFRESH_2_ID = 30;
	var C_BTN_ADDFRIEND_2_ID = 31;
	var C_BTN_APPLY_2_ID = 32;
	
	var C_TAB_MYTEAM_IDX = 0;
	var C_TAB_APPLY_IDX = 1;
	var C_TAB_SINGLE_IDX = 2;
	var C_TAB_TEAMS_IDX = 3;
	var C_TAB_MAXCNT = 4;
	
	var C_REFRESH_INTERVAL_MS = 2000;
	
	var C_DOWN_ZINDEX = parseInt(UI_ZORDER_DLG/2, 10);
	
	//-----------
	//private:data
	//-----------
	var m_g;
	var m_this;
	var m_dlg;
	var m_items = {};
	var m_tabidx=0;
	var m_listidx=0;
	var m_tabdirtys=[true,true,true,true];
	var m_listidxs=[-1,-1,-1,-1];
	var m_callermaps = {};
	var m_tabbtncnts = [10,3,3,3];
	var m_teamgroup;
	var m_applylist=[];
	var m_singlelist=[];
	var m_teamslist=[];
	var m_hasnewapply = false;

	//------------
	//public:method
	//------------
	this.initialize = function(g) {
		m_g = g;
		m_this = this;
		m_gui = m_g.getGUI();
		m_g.regSendDelay('cmd_createteam', 200);
		m_g.regEvent(EVT.TEAMINFO_CHANGE,0,m_this,_onTeamInfoChange);
		m_g.regEvent(EVT.NET, NETCMD.TEAM, m_this, _onSvrPkg);
	};

	/** 打开对话框 */
	this.openDlg = function() {
		_initDlg();
		_initInfo();
		m_dlg.show();
	};

	//------------
	//private:method
	//------------
	var _initDlg = function() {
		if ( !m_dlg ) {
			m_dlg = Dialog.snew(m_g, {modal:true,
						title:rstr.teamdlg.title,
						fixzIndex:true,
						zIndex:C_DOWN_ZINDEX,
						pos: {x:'center', y:80}
					});
			m_g.getGUI().initDlg(m_dlg, uicfg.team.teamdlg, m_items);
			m_dlg.hide();
			m_teamgroup = UIM.getPanel('main').getTeamGroup();
					
			for ( var i=0; i<m_tabbtncnts.length; ++i ){
				var domitems = m_items.tab.getTabItems(i);
				for ( var j=0, n=m_tabbtncnts[i]; j<n; ++j ){
					var szop = 'op'+i+''+j;
					var btn = domitems[szop];
					btn.setCaller({self:m_this, caller:_onOpBtnClick});
					var btnid = i*10+j;
					btn.setId(btnid);
					if ( btnid == C_BTN_REFRESH_1_ID || btnid == C_BTN_REFRESH_2_ID ){
						btn.setType(BTN_TYPE.DELAY);
						btn.setDelay(C_REFRESH_INTERVAL_MS);
					}
				}
			}
			
			// init list caller
			m_items.tab.getTabItems(C_TAB_MYTEAM_IDX).list.setCaller({self:m_this, caller:_onClickMyTeamItem});
			m_items.tab.getTabItems(C_TAB_APPLY_IDX).list.setCaller({self:m_this, caller:_onClickApplyItem});
			m_items.tab.getTabItems(C_TAB_SINGLE_IDX).list.setCaller({self:m_this, caller:_onClickSingleItem});
			m_items.tab.getTabItems(C_TAB_TEAMS_IDX).list.setCaller({self:m_this, caller:_onClickTeamsItem});
			
			// set tab text
			for ( var i=0; i<rstr.teamdlg.tabs.length; ++i ){
				m_items.tab.setTabText(i, rstr.teamdlg.tabs[i]);
			}
			m_items.tab.setCaller({self:m_this, caller:_onSelectTab});
			m_items.tab.activeTab(0);
		}
	};

	var _initInfo = function(){
		_updateInfo();
		if ( m_hasnewapply ){
			m_items.tab.activeTab(C_TAB_APPLY_IDX);
		}
	};
	
	var _updateInfo = function(){
		if ( m_dlg ){
			_setMyTeamsInfo();
			_setApplyListInfo();
			_setSingleListInfo();
			_setOTeamsListInfo();
		}
	};
	
	var _onTeamInfoChange = function(){
		m_tabdirtys[C_TAB_MYTEAM_IDX] = true;
		_updateInfo();
	};
	
	var _onSvrPkg = function(netevent){
		var cmdpkg = netevent.data;
		if ( cmdpkg.applys ){
			TQ.dictCopy(m_applylist, cmdpkg.applys);
			m_tabdirtys[C_TAB_APPLY_IDX] = true;
			_updateInfo();
		}
		
		if ( cmdpkg.singles ){
			TQ.dictCopy(m_singlelist, cmdpkg.singles);
			m_tabdirtys[C_TAB_SINGLE_IDX] = true;
			_updateInfo();
		}
		
		if ( cmdpkg.oteams ){
			TQ.dictCopy(m_teamslist, cmdpkg.oteams);
			m_tabdirtys[C_TAB_TEAMS_IDX] = true;
			_updateInfo();
		}
		
		if ( cmdpkg.newapply ){
			if ( !m_dlg || !m_dlg.isShow() || m_tabidx != C_TAB_APPLY_IDX ){
				m_hasnewapply = true;
				m_g.sendEvent({eid:EVT.NEWAPPLY_TEAM,sid:0,start:true});
			}
		}
	};
	
	var _onSelectTab  = function(idx){
		m_tabidx = idx;
		var list = m_items.tab.getTabItems(m_tabidx).list;
		list.refresh();
		if ( m_hasnewapply && m_tabidx == C_TAB_APPLY_IDX ){
			m_hasnewapply = false;
			m_g.sendEvent({eid:EVT.NEWAPPLY_TEAM, sid:0, stop:true});
		}
	};
	
	var _createTeam = function(){
		var sendmsg = '{cmd='+NETCMD.TEAM+',subcmd=2}';
		m_g.send('cmd_createteam', sendmsg);
	};
	
	var _applyLeader = function(){
		HDRM.getHdr('team').applyLeader(_getLeader());
	};
	
	var _tranLeader = function(){
		HDRM.getHdr('team').tranLeader(_getSelHero());
	};
	
	var _tickoutTeam = function(){
		HDRM.getHdr('team').tickoutTeam(_getSelHero());
	};
	
	var _inviteTeam = function(){
		UIM.getDlg('findinfo').openDlg(2,null);
	};
	
	var _stepoutTeam = function(){
		HDRM.getHdr('team').stepoutTeam(_getMyHero());
	};
	
	var _returnTeam = function(){
		HDRM.getHdr('team').returnTeam(_getMyHero());
	};
	
	var _exitTeam = function(){
		HDRM.getHdr('team').exitTeam(_getMyHero());
	};
	
	var _applyFriend = function(){
		HDRM.getHdr('friend').applyFriend(_getSelHero().owner);
	};
	
	var _chatWithPlayer = function(){
		UIM.getPanel('chat').setChatTarget(_getSelHero().owner.name);
	};
	
	var _writeLetter = function(){
		HDRM.getHdr('letter').writeLetter(_getSelHero().owner);
	};
	
	var _agreeJoin = function(){
		var hero = _getSelApplyItem();
		var sendmsg = '{cmd='+NETCMD.TEAM+',subcmd=11,agree=1,uid='+hero.uid+'}';
		m_g.send(null,sendmsg);
		m_gui.sysMsgTips(SMT_NORMAL, TQ.format(rstr.teamdlg.agreejoin, hero.name));
	};
	
	var _refuseJoin = function(){
		var hero = _getSelApplyItem();
		var sendmsg = '{cmd='+NETCMD.TEAM+',subcmd=11,agree=0,uid='+hero.uid+'}';
		m_g.send(null,sendmsg);
		m_gui.sysMsgTips(SMT_NORMAL, TQ.format(rstr.teamdlg.refusejoin, hero.name));
	};
	
	var _refuseAll = function(){
		var _onMsgCallback = function(id){
			if ( id == MB_IDYES ){
				var sendmsg = '{cmd='+NETCMD.TEAM+',subcmd=11,agree=0,uid=-1}';
				m_g.send(null,sendmsg);
			}
		};
		m_gui.msgBox(rstr.comm.msgts, rstr.teamdlg.refuseall,  MB_F_YESNO, {self:m_this, caller:_onMsgCallback} );
	};
	
	var _refreshSingleList = function(){
		var sendmsg = '{cmd='+NETCMD.TEAM+',subcmd=12}';
		m_g.send(null, sendmsg);
	};
	
	var _applyFriendFromSingleList = function(){
		var hero = _getSelSingleItem();
		HDRM.getHdr('friend').applyFriend(hero.owner);
	};
	
	var _inviteFromSingleList = function(){
		var hero = _getSelSingleItem();
		UIM.getDlg('findinfo').inviteTeam(hero);
	};
	
	var _refreshOTeamList = function(){
		var sendmsg = '{cmd='+NETCMD.TEAM+',subcmd=13}';
		m_g.send(null, sendmsg);
	};
	
	var _applyFriendFromOTeamList = function(){
		var hero = _getSelOTeamItem();
		HDRM.getHdr('friend').applyFriend(hero.owner);
	};
	
	var _applyFromOTeamList = function(){
		var hero = _getSelOTeamItem();
		var sendmsg = '{cmd='+NETCMD.TEAM+',subcmd=10,uid='+hero.uid+'}';
		m_g.send(null,sendmsg);
		m_gui.sysMsgTips(SMT_NORMAL, TQ.format(rstr.teamdlg.applyteam, hero.name));
	};
	
	var _getSelApplyItem = function(){
		var listidx = m_listidxs[C_TAB_APPLY_IDX];
		return m_applylist[listidx];
	};
	
	var _getSelSingleItem = function(){
		var listidx = m_listidxs[C_TAB_SINGLE_IDX];
		return m_singlelist[listidx];
	};
	
	var _getSelOTeamItem = function(){
		var listidx = m_listidxs[C_TAB_TEAMS_IDX];
		return m_teamslist[listidx];
	};
	
	var _onOpBtnClick = function(id){
		if ( id == C_BTN_CREATE_ID ){
			_createTeam();
		}
		else if ( id == C_BTN_APPLY_ID ){
			_applyLeader();
		}
		else if ( id == C_BTN_TRAN_ID ){
			_tranLeader();
		}
		else if ( id == C_BTN_TICKOUT_ID ){
			_tickoutTeam();
		}
		else if ( id == C_BTN_INVITE_ID ){
			_inviteTeam();
		}
		else if ( id == C_BTN_STEPOUT_ID ){
			var myhero = _getMyHero();
			if ( myhero ){
				if ( myhero.state == 0 ){
					_returnTeam();
				}
				else{
					_stepoutTeam();
				}
			}
		}
		else if ( id == C_BTN_EXITTEAM_ID ){
			_exitTeam();
		}
		else if ( id == C_BTN_ADDFRIEND_ID ){
			_applyFriend();
		}
		else if ( id == C_BTN_CHAT_ID ){
			_chatWithPlayer();
		}
		else if ( id == C_BTN_LETTER_ID ){
			_writeLetter();
		}
		else if ( id == C_BTN_AGREEJOIN_ID ){
			_agreeJoin();
		}
		else if ( id == C_BTN_REFUSEJOIN_ID ){
			_refuseJoin();
		}
		else if ( id == C_BTN_ALLREFUSE_ID ){
			_refuseAll();
		}
		else if ( id == C_BTN_REFRESH_1_ID ){
			_refreshSingleList();
		}
		else if ( id == C_BTN_ADDFRIEND_1_ID ){
			_applyFriendFromSingleList();
		}
		else if ( id == C_BTN_INVITE_1_ID ){
			_inviteFromSingleList();
		}
		else if ( id == C_BTN_REFRESH_2_ID ){
			_refreshOTeamList();
		}
		else if ( id == C_BTN_ADDFRIEND_2_ID ){
			_applyFriendFromOTeamList();
		}
		else if ( id == C_BTN_APPLY_2_ID ){
			_applyFromOTeamList();
		}
	};

	var _setMyTeamsInfo = function(){
		if ( m_tabdirtys[C_TAB_MYTEAM_IDX] ){
			m_tabdirtys[C_TAB_MYTEAM_IDX] = false;
			var teamlist = m_g.getImgr().getTeams().list;
			var list = m_items.tab.getTabItems(C_TAB_MYTEAM_IDX).list;
			list.setItemCount(teamlist.length);
			for ( var i=0; i<teamlist.length; ++i ){
				var ritem = teamlist[i];
				var litem = list.getItem(i);
				IMG.setBKImage(litem.exsubs.icon, IMG.makeBigImg(ritem.itemres.bigpic));
				
				var szself = m_g.getImgr().isMyHero(ritem.uid)?'*':'';
				TQ.setTextEx(litem.exsubs.name, szself+ritem.name);
				
				IMG.setBKImage(litem.exsubs.flag, IMG.makeStepoutImg(ritem.state));
				
				var tipid = list.getSubItem(litem,'tooltips')['$hero'];
				var tip = TTIP.getTipById(tipid);
				tip.setCaller({self:m_this, caller:_onGetTooltip});
				tip.setData({tabidx:C_TAB_MYTEAM_IDX, idx:i});
			}
			
			var listidx = m_listidxs[C_TAB_MYTEAM_IDX];
			if ( listidx < 0 ){
				listidx = 0;
			}
			if ( listidx >= teamlist.length ){
				listidx = teamlist.length - 1;
			}
			list.setCurSel(listidx);
		}
	};
	
	var _setHeroListInfo = function(tabidx, reslist){
		if ( m_tabdirtys[tabidx] ){
			m_tabdirtys[tabidx] = false;
			var list = m_items.tab.getTabItems(tabidx).list;
			list.setItemCount(reslist.length);
			for ( var i=0; i<reslist.length; ++i ){
				var ritem = reslist[i];
				var litem = list.getItem(i);
				if ( !ritem.itemres || ritem.resid != ritem.itemres.id ){
					ritem.itemres = ItemResUtil.findItemres(ritem.resid);
				}
				IMG.setBKImage(litem.exsubs.icon, IMG.makeSmallImg(ritem.itemres.smallpic));
				TQ.setTextEx(litem.exsubs.name, ritem.name);
				TQ.setTextEx(litem.exsubs.level, TQ.format(rstr.comm.flevel, ritem.level));
				var cityres = ItemResUtil.findItemres(ritem.cityid);
				TQ.setTextEx(litem.exsubs.city, cityres.name);
				if ( ritem.num != undefined ){
					TQ.setTextEx(litem.exsubs.info, TQ.format(rstr.teamdlg.teamnum, ritem.num));
				}
				
				var tipid = list.getSubItem(litem,'tooltips')['$hero'];
				var tip = TTIP.getTipById(tipid);
				tip.setCaller({self:m_this, caller:_onGetTooltip});
				tip.setData({tabidx:tabidx, idx:i});
			}
			var listidx = m_listidxs[tabidx];
			if ( listidx < 0 ){
				listidx = 0;
			}
			if ( listidx >= reslist.length ){
				listidx = reslist.length - 1;
			}
			list.setCurSel(listidx);
		}
	};	
	
	var _setApplyListInfo = function(){
		_setHeroListInfo(C_TAB_APPLY_IDX, m_applylist);
	};
	
	var _setSingleListInfo = function(){
		_setHeroListInfo(C_TAB_SINGLE_IDX, m_singlelist);
	};
	
	var _setOTeamsListInfo = function(){
		_setHeroListInfo(C_TAB_TEAMS_IDX, m_teamslist);
	};
	
	var _setMyTeamOpBtnState = function(){
		var teamlist = m_g.getImgr().getTeams().list;
		var domitems = m_items.tab.getTabItems(C_TAB_MYTEAM_IDX);
		var enables = {};
		var listidx = m_listidxs[C_TAB_MYTEAM_IDX];
		if ( listidx >= 0 && listidx < teamlist.length ){
			var hero = teamlist[listidx];
			var bselme = m_g.getImgr().isMyHero(hero.uid);
			var bselleader = (hero.teampos == 1);
			var bmeleader = HDRM.getHdr('team').meIsLeader();
			if ( bselme ){
				if ( bmeleader ){
					enables[C_BTN_INVITE_ID] = true;
					enables[C_BTN_EXITTEAM_ID] = true;
				}
				else {
					enables[C_BTN_APPLY_ID] = true;
					enables[C_BTN_STEPOUT_ID] = true;
					enables[C_BTN_EXITTEAM_ID] = true;
				}
			}
			else { // select is't me hero
				enables[C_BTN_EXITTEAM_ID] = true;
				enables[C_BTN_ADDFRIEND_ID] = true;
				enables[C_BTN_CHAT_ID] = true;
				enables[C_BTN_LETTER_ID] = true;
				if ( bmeleader ){
					enables[C_BTN_TRAN_ID] = true;
					enables[C_BTN_TICKOUT_ID] = true;
					enables[C_BTN_INVITE_ID] = true;
				}
				else {
					enables[C_BTN_APPLY_ID] = true;
					enables[C_BTN_STEPOUT_ID] = true;
				}
			}
		}
		else{
			if ( teamlist.length > 0 ){
				alert( 'error 01248s8' );
			}
			enables[C_BTN_CREATE_ID] = true;
		}
		
		_setBtnEnable(C_TAB_MYTEAM_IDX, enables);
		
		var myhero = _getMyHero();
		if ( myhero ){
			var btn = domitems['op'+C_TAB_MYTEAM_IDX+''+C_BTN_STEPOUT_ID];
			btn.setText(rstr.teamdlg.btns.op1s[myhero.state==1?C_BTN_STEPOUT_ID:C_BTN_RETURN_ID]);
		}
	};
	
	var _setApplyOpBtnState = function(){
		var domitems = m_items.tab.getTabItems(C_TAB_APPLY_IDX);
		var enables = {};
		var listidx = m_listidxs[C_TAB_APPLY_IDX];
		if ( listidx >= 0 && listidx < m_applylist.length ){
			enables[C_BTN_AGREEJOIN_ID-C_BTN_AGREEJOIN_ID] = true;
			enables[C_BTN_REFUSEJOIN_ID-C_BTN_AGREEJOIN_ID] = true;
			enables[C_BTN_ALLREFUSE_ID-C_BTN_AGREEJOIN_ID] = true;
		}
		_setBtnEnable(C_TAB_APPLY_IDX, enables);
	};
	
	var _setSingleOpBtnState = function(){
		var domitems = m_items.tab.getTabItems(C_TAB_SINGLE_IDX);
		var enables = {};
		var listidx = m_listidxs[C_TAB_SINGLE_IDX];
		enables[C_BTN_REFRESH_1_ID-C_BTN_REFRESH_1_ID] = true;
		if ( listidx >= 0 && listidx < m_singlelist.length ){
			enables[C_BTN_ADDFRIEND_1_ID-C_BTN_REFRESH_1_ID] = true;
			var teamhdr = HDRM.getHdr('team');
			if ( !teamhdr.meInTeam() || teamhdr.meIsLeader() ){
				enables[C_BTN_INVITE_1_ID-C_BTN_REFRESH_1_ID] = true;
			}
		}
		_setBtnEnable(C_TAB_SINGLE_IDX, enables);
	};
	
	var _setTeamsOpBtnState = function(){
		var domitems = m_items.tab.getTabItems(C_TAB_TEAMS_IDX);
		var enables = {};
		var listidx = m_listidxs[C_TAB_TEAMS_IDX];
		enables[C_BTN_REFRESH_2_ID-C_BTN_REFRESH_2_ID] = true;
		if ( listidx >= 0 && listidx < m_teamslist.length ){
			enables[C_BTN_ADDFRIEND_2_ID-C_BTN_REFRESH_2_ID] = true;
			var teamhdr = HDRM.getHdr('team');
			if ( !teamhdr.meInTeam() ){
				enables[C_BTN_APPLY_2_ID-C_BTN_REFRESH_2_ID] = true;
			}
		}
		_setBtnEnable(C_TAB_TEAMS_IDX, enables);
	};
	
	var _setBtnEnable = function(tabidx, enables){
		var maxcnt = m_tabbtncnts[tabidx];
		var domitems = m_items.tab.getTabItems(tabidx);
		for ( var i=0; i<maxcnt; ++i ){
			var btn = domitems['op'+tabidx+''+i];
			btn.enable(enables[i]==true);
		}
	};

	var _onClickMyTeamItem = function(e, idx){
		m_listidxs[C_TAB_MYTEAM_IDX] = idx;
		_setMyTeamOpBtnState();
	};
	
	var _onClickApplyItem = function(e, idx){
		m_listidxs[C_TAB_APPLY_IDX] = idx;
		_setApplyOpBtnState();
	};
	
	var _onClickSingleItem = function(e, idx){
		m_listidxs[C_TAB_SINGLE_IDX] = idx;
		_setSingleOpBtnState();
	};
	
	var _onClickTeamsItem = function(e, idx){
		m_listidxs[C_TAB_TEAMS_IDX] = idx;
		_setTeamsOpBtnState();
	};
	
	var _onGetTooltip = function(data){
		var hero = _getHeroByIdx(data.tabidx, data.idx);
		return TIPM.getHeroDesc(hero);
	};
	
	var _getSelHero = function(){
		var teamlist = m_g.getImgr().getTeams().list;
		return teamlist[m_listidxs[C_TAB_MYTEAM_IDX]];
	};
	
	var _getMyHero = function(){
		var teamlist = m_g.getImgr().getTeams().list;
		for ( var i=0; i<teamlist.length; ++i ){
			var hero = teamlist[i];
			if ( m_g.getImgr().isMyHero(hero.uid) ){
				return hero;
			}
		}
		return null;
	};
	
	var _getLeader = function(){
		var teamlist = m_g.getImgr().getTeams().list;
		for ( var i=0; i<teamlist.length; ++i ){
			var hero = teamlist[i];
			if ( hero.teampos == 1 ){
				return hero;
			}
		}
		return null;
	};
	
	var _getHeroByIdx = function(tabidx, idx){
		var lists = [m_g.getImgr().getTeams().list, m_applylist, m_singlelist, m_teamslist];
		return lists[tabidx][idx];
	};

	//--------------
	// call constructor
	//--------------
	this.initialize.apply(this, arguments);
};

TeamHandler = function(){
	//-----------
	//private:const
	//-----------
	var C_INVITE_WAITTIME_S = 50;
	
	//-----------
	//private:data
	//-----------
	var m_g;
	var m_this;
	var m_checkLeaderDirty=true;
	var m_isleader=false;
	
	//------------
	//public:method
	//------------
	this.init = function(g){
		m_g = g;
		m_this = this;
		m_g.regEvent(EVT.NET, NETCMD.TEAM, m_this, _onSvrPkg);
		m_g.regSendDelay('cmd_applyleader', 200);
	};
	
	this.meInTeam = function(){
		return _meInTeam();
	};
	
	this.meIsLeader = function(){
		return _meIsLeader();
	};
	
	this.applyLeader = function(hero){
		_applyLeader(hero);
	};
	
	this.tranLeader = function(hero){
		_tranLeader(hero);
	};
	
	this.tickoutTeam = function(hero){
		_tickoutTeam(hero);
	};
	
	this.stepoutTeam = function(hero){
		_stepoutTeam(hero);
	};
	
	this.returnTeam = function(hero){
		_returnTeam(hero);
	};
	
	this.exitTeam = function(hero){
		_exitTeam(hero);
	};
	
	this.inviteMe = function(invite){
		_inviteMe(invite);
	};
	
	this.applyLeaderFromMe = function(applyleader){
		_applyLeaderFromMe(applyleader);
	};
	
	this.changeLeaderToMe = function(changeleader){
		_changeLeaderToMe(changeleader);
	};
	
	//------------
	//private:method
	//------------
	var _meInTeam = function(){
		var teamlist = m_g.getImgr().getTeams().list;
		return (teamlist.length > 0);
	};
	
	var _meIsLeader = function(){
		if ( m_checkLeaderDirty ){
			m_checkLeaderDirty = false;
			m_isleader = false;
			var teams = m_g.getImgr().getTeams().list;
			for ( var i=0; i<teams.length; ++i ){
				var t = teams[i];
				var fhero = m_g.getImgr().isMyHero(t.uid);
				if ( fhero && t.teampos == 1 ){
					m_isleader = true;
					break;
				}
			}
		}
		return m_isleader;
	};
	
	var _applyLeader = function(hero){
		var sendmsg = '{cmd='+NETCMD.TEAM+',subcmd=6,uid='+hero.uid+'}';
		m_g.send('cmd_applyleader', sendmsg);
		m_g.getGUI().sysMsgTips(SMT_NORMAL, TQ.format(rstr.teampanel.applyleader, hero.name));
	};
	
	var _tranLeader = function(hero){
		var _onMsgBoxCaller = function(id){
			if ( id == MB_IDYES ){
				var sendmsg = '{cmd='+NETCMD.TEAM+',subcmd=7,uid='+hero.uid+'}';
				m_g.send(null,sendmsg);
			}
		};
		m_g.getGUI().msgBox(rstr.comm.msgts, TQ.format(rstr.teampanel.tranleader, hero.name), MB_F_YESNO, {self:m_this, caller:_onMsgBoxCaller} );
	};
	
	var _tickoutTeam = function(hero){
		var _onMsgBoxCaller = function(id){
			if ( id == MB_IDYES ){
				var sendmsg = '{cmd='+NETCMD.TEAM+',subcmd=3,uid='+hero.uid+'}';
				m_g.send(null,sendmsg);
			}
		};
		m_g.getGUI().msgBox(rstr.comm.msgts, TQ.format(rstr.teampanel.tickout, hero.name), MB_F_YESNO, {self:m_this, caller:_onMsgBoxCaller} );
	};
	
	var _stepoutTeam = function(hero){
		var _onMsgBoxCaller = function(id){
			if ( id == MB_IDYES ){
				var sendmsg = '{cmd='+NETCMD.TEAM+',subcmd=5,uid='+hero.uid+'}';
				m_g.send(null,sendmsg);
			}
		};
		m_g.getGUI().msgBox(rstr.comm.msgts, TQ.format(rstr.teampanel.stepout, hero.name), MB_F_YESNO, {self:m_this, caller:_onMsgBoxCaller} );
	};
	
	var _returnTeam = function(hero){
		var sendmsg = '{cmd='+NETCMD.TEAM+',subcmd=9,uid='+hero.uid+'}';
		m_g.send(null,sendmsg);
	};
	
	var _exitTeam = function(hero){
		var _onMsgBoxCaller = function(id){
			if ( id == MB_IDYES ){
				var sendmsg = '{cmd='+NETCMD.TEAM+',subcmd=4,uid='+hero.uid+'}';
				m_g.send(null,sendmsg);
			}
		};
		m_g.getGUI().msgBox(rstr.comm.msgts, TQ.format(rstr.teampanel.exit, hero.name), MB_F_YESNO, {self:m_this, caller:_onMsgBoxCaller} );
	};
	
	var _inviteMe = function(invite){
		var dlg = UIM.getDlg('inviteconfirm');
		var _onCallBack = function(result){
			var sendmsg = '{cmd='+NETCMD.TEAM+',subcmd=14,uid='+invite.uid+',agree='+result+'}';
			m_g.send(null,sendmsg);
		};
		var msg = TQ.format(rstr.teampanel.invitemsg, 
			invite.name,
			invite.level,
			invite.num);
		dlg.openDlg(msg, C_INVITE_WAITTIME_S, {self:m_this, caller:_onCallBack});
	};
	
	var _applyLeaderFromMe = function(applyleader){
		var dlg = UIM.getDlg('inviteconfirm');
		var _onCallBack = function(result){
			var sendmsg = '{cmd='+NETCMD.TEAM+',subcmd=15,uid='+applyleader.uid+',agree='+result+'}';
			m_g.send(null,sendmsg);
		};
		var msg = TQ.format(rstr.teampanel.applyleaderfromme, applyleader.name);
		dlg.openDlg(msg, C_INVITE_WAITTIME_S, {self:m_this, caller:_onCallBack});
	};
	
	var _changeLeaderToMe = function(changeleader){
		var dlg = UIM.getDlg('inviteconfirm');
		var _onCallBack = function(result){
			var sendmsg = '{cmd='+NETCMD.TEAM+',subcmd=16,uid='+changeleader.uid+',agree='+result+'}';
			m_g.send(null,sendmsg);
		};
		var msg = TQ.format(rstr.teampanel.changeleadertome, changeleader.name);
		dlg.openDlg(msg, C_INVITE_WAITTIME_S, {self:m_this, caller:_onCallBack});
	};
	
	var _onSvrPkg = function(netevent){
		var cmdpkg = netevent.data;
		if ( cmdpkg.teams ){
			m_checkLeaderDirty = true;
		}
	};
	
	//---------------------------------------
	this.init.apply(this, arguments);
};

InviteConfirmDlg = function(){
	//-----------
	//private:const
	//-----------
	var C_WAIT_TIME_S = 0;

	//-----------
	//private:data
	//-----------
	var m_g;
	var m_this;
	var m_dlg;
	var m_items={};
	var m_startTimeMs;
	var m_leftTimeMs;
	var m_caller;

	//------------
	//public:method
	//------------
	this.init = function(g){
		m_g = g;
		m_this = this;
	};
	
	/** 打开话框 */
	this.openDlg = function(msg, leftTimeS, caller){
		_initDlg();
		_initInfo(msg, leftTimeS);
		m_caller = caller;
		m_dlg.show();
	};
	
	//------------
	//private:method
	//------------
	var _initDlg = function(){
		if ( !m_dlg ){
			m_dlg = Dialog.snew(m_g,{modal:true,
				pos:{x:'center', y:100},
				uiback:uiback.dlg.minihelp
				});
			m_g.getGUI().initDlg(m_dlg, uicfg.team.inviteconfirm, m_items);
			m_dlg.hide();
			m_items.agreebtn.setCaller({self:m_this, caller:_onClickAgree});
			m_items.refusebtn.setCaller({self:m_this, caller:_onClickRefuse});
			m_dlg.setCaller({self:m_this, caller:_onDlgEvent});
		}
	};
	
	var _initInfo = function(msg, leftTimeS){
		m_leftTimeMs = leftTimeS*1000;
		if ( m_leftTimeMs > 0 ){
			m_g.regUpdater(m_this, _onUpdate, 1000);
			m_startTimeMs = m_g.getCurTimeMs();
			TQ.setTextEx(m_items.lefttime, leftTimeS);		
		}
		TQ.setTextEx(m_items.tip, msg);
	};
	
	var _onUpdate = function(curTimeMs){
		var durMs = curTimeMs - m_startTimeMs;
		var lefttime = parseInt((m_leftTimeMs - durMs)/1000, 10);
		if ( lefttime <= -C_WAIT_TIME_S ){
			lefttime = 0;
			m_dlg.hide();
		}
		TQ.setTextEx(m_items.lefttime, lefttime);
	};
	
	var _onDlgEvent = function(id){
		if ( id == C_SYS_DLG_HIDE && m_leftTimeMs > 0 ){
			m_g.unregUpdater(m_this, _onUpdate);				
		}
	};
	
	var _onClickAgree = function(){
		m_dlg.hide();
		if ( m_caller ){
			m_caller.caller.call(m_caller.self, 1);
		}
	};
	
	var _onClickRefuse = function(){
		m_dlg.hide();
		if ( m_caller ){
			m_caller.caller.call(m_caller.self, 0);
		}
	};
	
	//---------------------------------------
	this.init.apply(this, arguments);
};

SysMsgHandler = function(){
	//-----------
	//private:data
	//-----------
	var m_g;
	var m_this;
	var m_gui;

	//------------
	//public:method
	//------------
	this.initialize = function(g) {
		m_g = g;
		m_this = this;
		m_gui = m_g.getGUI();
		m_g.regEvent(EVT.NET, NETCMD.SYSMSG, m_this, _onSvrPkg);
	};
	
	//------------
	//private:method
	//------------
	var _onSvrPkg = function(netevent){
		var cmdpkg = netevent.data;
		_showMsg(cmdpkg, _formatMsg(cmdpkg));
	};
	
	var _formatMsg = function(cmdpkg){
		if ( cmdpkg.msgid == undefined ) {
			return cmdpkg.msg;
		}
		
		if ( rstr.ids[cmdpkg.msgid].param != cmdpkg.params.length ) {
			return 'error: 784m3we , msgid:' + cmdpkg.msgid + ', netlen:' + cmdpkg.params.length;
		}
		
		if ( rstr.ids[cmdpkg.msgid].param == 0 ) {
			return rstr.ids[cmdpkg.msgid].msg;
		}
		
		return MsgTipUtil.formatIdMsg(m_g, cmdpkg.msgid, cmdpkg.params);
	};
	
	var _showMsg = function(cmdpkg, msg){
		if ( cmdpkg.type == SMSGT.POP ){
			m_gui.sysMsgTips(cmdpkg.flag, HyperLinkMgr.formatLink(msg));
		} else if ( cmdpkg.type == SMSGT.SYSCHANNEL ){
			var hmsg = HyperLinkMgr.formatLink(msg);
			UIM.getPanel('sysmsg').append(cmdpkg.flag, hmsg);
			if ( hmsg.indexOf('fight_demo_a_0') >= 0 ) {
				var dom = TQ.getDomById('fight_demo_a_0');
				HelpGuider.startFirstFightDemo(dom);
			}
		} else if ( cmdpkg.type == SMSGT.POPMSGBOX ){
			m_g.getGUI().msgBox(rstr.comm.msgts, msg, MB_F_CLOSE, null);
		} else if ( cmdpkg.type == SMSGT.CHAT_CHANNEL ) {
			UIM.getPanel('chat').appendMsgToCurChannel(HyperLinkMgr.formatLink(msg));
		} else if ( cmdpkg.type == SMSGT.SYS_POPBAR ) {
			m_gui.sysMsgTips2(cmdpkg.flag, HyperLinkMgr.formatLink(msg));
		} else if ( cmdpkg.type == SMSGT.NPC_MSG ) {
			UIM.getDlg('npc').openDlg({desc:msg, ops:[rstr.npcdlg.closeop]});
		} else {
			alert('error：f489572fa sys msg!');
		}
	};
	
	//--------------
	// call constructor
	//--------------
	this.initialize.apply(this, arguments);	
};

WaitmidDlg = function(){
	//-----------
	//private:data
	//-----------
	var m_g;
	var m_this;
	var m_dlg;
	var m_items={};

	//------------
	//public:method
	//------------
	this.init = function(g){
		m_g = g;
		m_this = this;
	};
	
	/** 打开话框 */
	this.openDlg = function(){
		_initDlg();
		m_dlg.show();
	};
	
	this.closeDlg = function(){
		m_dlg.hide();
	};
	
	//------------
	//private:method
	//------------
	var _initDlg = function(){
		if ( !m_dlg ){
			m_dlg = Dialog.snew(m_g,{modal:false,
				pos:{x:'center', y:150},
				zIndex:UI_ZORDER_TOOLTIP,
				uiback:uiback.dlg.minihelp
				});
			m_g.getGUI().initDlg(m_dlg, uicfg.misc.waitmiddlg, m_items);
			m_dlg.hide();
		}
	};
	
	//---------------------------------------
	this.init.apply(this, arguments);
};