/** 通过效果获得可使用的道具列表 */
UseListItemDlg = Class.extern(function(){
	//UseListItemDlg-unittest-start
	var m_g = null;
	var m_this = null;
	var m_targetitem = null;
	var m_ret = RET_END;
	var m_preusecaller = null;

	this.init = function(g){
		m_g = g;
		m_this = this;
	};
	
	this.setPreUseCaller = function(caller){
		m_preusecaller = caller;
	};
	
	/** 打开话框 
	@remark 首先通过effid找到含有该效果的道具列表
	@param effids 效果id的列表
	@param targetitem 当前被使用对象的类型 
	@param ret 当使用一个道具后，是否关闭当前对话框，RET_END 为关闭，RET_CONTINUE为不关闭
	@param desc 在对话框中的描述，可以是一个字符串，也可以是个返回字符串的回调函数
	*/
	this.openDlg = function(effids, targetitem, ret, desc){
		_setParams(targetitem, ret);
		
		var eff = _getEffectRes(effids);
		if ( !eff ) return;
		
		var dlg = UIM.getDlg('filteritem');
		dlg.setCaller({self:m_this,caller:_onUseItem});
		dlg.openDlg({title:eff.dlg.title,
			filter:'effect', effids:effids,
			btntext:eff.dlg.btntext,
			name:_getTargetName(),
			targetitem:targetitem,
			desc:desc ? desc : ''});
	};
	
	this.openDlgByItemIds = function(title, btnText, itemids, targetitem, ret, desc){
		_setParams(targetitem, ret);
		var dlg = UIM.getDlg('filteritem');
		dlg.setCaller({self:m_this,caller:_onUseItem});
		dlg.openDlg({title:title,
			filter:'itemids', itemids:itemids,
			btntext:btnText,
			name:_getTargetName(),
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
	
	var _setParams = function(targetitem, ret){
		m_preusecaller = null;
		m_targetitem = targetitem;	
		m_ret = isNull(ret) ? RET_END : ret;	
	};
	
	var _getEffectRes = function(effids){
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
	
	var _onUseItem = function(item){
		if ( !_preCaller(item)  ) {
			return RET_CONTINUE;
		}
		
		if ( _isNeedBuy(item) ) {
			return RET_CONTINUE;
		}
		
		if ( _isNeedPay(item) ) {
			return RET_CONTINUE;
		}
		
		if ( DirectUseItemHdrMgr.isSpec(item.itemres) ) {
			DirectUseItemHdrMgr.getHdr(item.itemres).useItem(m_g, item);
		}
		else {
			UseItemSender.send(m_g, item, item.needNumber, _filterTargetFields());
		}
		return m_ret;
	};
	
	var _preCaller = function(item) {
		if ( !m_preusecaller ) {
			return true;
		}
		
		return m_preusecaller(item);
	};
	
	var _isNeedBuy = function(item) {
		if ( item.number == 0 && item.itemres.buyprice ){
			var buyitemdlg = UIM.getDlg('buyitem');
			buyitemdlg.openDlg({id:0,resid:item.resid,number:100000});
			return true;
		}
		return false;
	};
	
	var _isNeedPay = function(item) {
		if ( item.isGiftGold && item.needNumber > m_g.getImgr().getAllGold() ) {
			var _onCallback = function(id){
				if ( id == MB_IDYES ) {
					JMISC.openPayWnd();
				}
			};
			m_g.getGUI().msgBox(rstr.comm.msgts, rstr.useitem.uselistitemdlg.noEnoughGold,  MB_F_YESNO, {self:m_this, caller:_onCallback} );
			return true;
		}	
		return false;
	};
	
	var _getTargetName = function() {
		var name = '--';
		if ( m_targetitem.name ) {
			name = m_targetitem.name;
		}
		else if ( m_targetitem.itemres ) {
			name = m_targetitem.itemres.name;
		}
		else if ( m_targetitem.resid ) {
			res = ItemResUtil.findItemres(m_targetitem.resid);
			name = res.name;
		}
		return name;
	};
	
	var _filterTargetFields = function() {
		var target = {};
		for ( k in m_targetitem ) {
			if ( k == 'resid' 
				|| k == 'stoptime' 
				|| k == 'starttime' 
				|| k == 'name' ) continue;
			target[k] = m_targetitem[k];
		}
		return target;
	};
	
	//UseListItemDlg-unittest-end
});


