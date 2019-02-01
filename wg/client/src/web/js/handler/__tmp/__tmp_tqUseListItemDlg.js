/** 通过效果获得可使用的道具列表 */
UseListItemDlg = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.m_g = null;
	var m_this = null;
	_lc_.m_targetitem = null;
	_lc_.m_ret = RET_END;
	_lc_.m_preusecaller = null;

	this.init = function(g){
		_lc_.m_g = g;
		m_this = this;
	};
	
	this.setPreUseCaller = function(caller){
		_lc_.m_preusecaller = caller;
	};
	
	/** 打开话框 
	@remark 首先通过effid找到含有该效果的道具列表
	@param effids 效果id的列表
	@param targetitem 当前被使用对象的类型 
	@param ret 当使用一个道具后，是否关闭当前对话框，RET_END 为关闭，RET_CONTINUE为不关闭
	@param desc 在对话框中的描述，可以是一个字符串，也可以是个返回字符串的回调函数
	*/
	this.openDlg = function(effids, targetitem, ret, desc){
		_lc_._setParams(targetitem, ret);
		
		var eff = _lc_._getEffectRes(effids);
		if ( !eff ) return;
		
		var dlg = UIM.getDlg('filteritem');
		dlg.setCaller({self:m_this,caller:_lc_._onUseItem});
		dlg.openDlg({title:eff.dlg.title,
			filter:'effect', effids:effids,
			btntext:eff.dlg.btntext,
			name:_lc_._getTargetName(),
			targetitem:targetitem,
			desc:desc ? desc : ''});
	};
	
	this.openDlgByItemIds = function(title, btnText, itemids, targetitem, ret, desc){
		_lc_._setParams(targetitem, ret);
		var dlg = UIM.getDlg('filteritem');
		dlg.setCaller({self:m_this,caller:_lc_._onUseItem});
		dlg.openDlg({title:title,
			filter:'itemids', itemids:itemids,
			btntext:btnText,
			name:_lc_._getTargetName(),
			targetitem:targetitem,
			desc:desc ? desc : ''});
	};
	
	this.isShow = function() {
		var dlg = UIM.getDlg('filteritem');
		return dlg && dlg.isShow();
	};
	
	this.clickItem = function(idx) {
		var dlg = UIM.getDlg('filteritem');
		dlg.clickItem(idx);
	};
	
	_lc_._setParams = function(targetitem, ret){
		_lc_.m_preusecaller = null;
		_lc_.m_targetitem = targetitem;	
		_lc_.m_ret = isNull(ret) ? RET_END : ret;	
	};
	
	_lc_._getEffectRes = function(effids){
		var eff = null;
		for (var i=0; i<effids.length; ++i){
			var effid = effids[i];
			eff = TQ.qfind(res_effects, 'id', effid);
			if ( !eff ) {
				log('not find effid: '+effid+' in res_effects');
				return null;
			}
		}
		return eff;
	};
	
	_lc_._onUseItem = function(item){
		if ( !_lc_._preCaller(item)  ) {
			return RET_CONTINUE;
		}
		
		if ( _lc_._isNeedBuy(item) ) {
			return RET_CONTINUE;
		}
		
		if ( _lc_._isNeedPay(item) ) {
			return RET_CONTINUE;
		}
		
		if ( DirectUseItemHdrMgr.isSpec(item.itemres) ) {
			DirectUseItemHdrMgr.getHdr(item.itemres).useItem(_lc_.m_g, item);
		}
		else {
			UseItemSender.send(_lc_.m_g, item, item.needNumber, _lc_._filterTargetFields());
		}
		return _lc_.m_ret;
	};
	
	_lc_._preCaller = function(item) {
		if ( !_lc_.m_preusecaller ) {
			return true;
		}
		
		return _lc_.m_preusecaller(item);
	};
	
	_lc_._isNeedBuy = function(item) {
		if ( item.number == 0 && item.itemres.buyprice ){
			var buyitemdlg = UIM.getDlg('buyitem');
			buyitemdlg.openDlg({id:0,resid:item.resid,number:100000});
			return true;
		}
		return false;
	};
	
	_lc_._isNeedPay = function(item) {
		if ( item.isGiftGold && item.needNumber > _lc_.m_g.getImgr().getAllGold() ) {
			var _onCallback = function(id){
				if ( id == MB_IDYES ) {
					JMISC.openPayWnd();
				}
			};
			_lc_.m_g.getGUI().msgBox(rstr.comm.msgts, rstr.useitem.uselistitemdlg.noEnoughGold,  MB_F_YESNO, {self:m_this, caller:_onCallback} );
			return true;
		}	
		return false;
	};
	
	_lc_._getTargetName = function() {
		var name = '--';
		if ( _lc_.m_targetitem.name ) {
			name = _lc_.m_targetitem.name;
		}
		else if ( _lc_.m_targetitem.itemres ) {
			name = _lc_.m_targetitem.itemres.name;
		}
		else if ( _lc_.m_targetitem.resid ) {
			res = ItemResUtil.findItemres(_lc_.m_targetitem.resid);
			name = res.name;
		}
		return name;
	};
	
	_lc_._filterTargetFields = function() {
		var target = {};
		for ( k in _lc_.m_targetitem ) {
			if ( k == 'resid' 
				|| k == 'stoptime' 
				|| k == 'starttime' 
				|| k == 'name' ) continue;
			target[k] = _lc_.m_targetitem[k];
		}
		return target;
	};
	
	//UseListItemDlg-unittest-end
});


