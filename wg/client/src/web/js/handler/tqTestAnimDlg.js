/*******************************************************************************/
TestAnimDlg = Class.extern(function(){
	//TestAnimDlg-unittest-start
	var m_g = null;
	var m_this = null;
	var m_dlg = null;
	var m_items = {};
	var m_anim = null;
	
	this.init = function(g){
		m_g = g;
		m_this = this;
	};
	
	this.openDlg = function(){
		_initDlg();
		_openDlg();
		_initInfo();
	};
	
	var _initDlg = function(){
		if ( m_dlg ){
			return;
		}
		
		m_dlg = Dialog.snew(m_g,{modal:false, title:'test animation', pos:{x:'center', y:50} });
		m_g.getGUI().initDlg(m_dlg, uicfg.TestAnimDlg, m_items);
		m_items.list.setCaller(null, null, null, {self:m_this, caller:_onDBClickList});
	};
	
	var _openDlg = function(){
		m_dlg.show();
	};
	
	var _initInfo = function(){
		_updateAnimList();
	};
	
	var _updateAnimList = function(){
		m_items.list.setItemCount(res_animations.length);
		for ( var i=0; i<res_animations.length; ++i ) {
			var anim = res_animations[i];
			var item = m_items.list.getItem(i);
			TQ.setHtml(item.exsubs.animId, '<font color="#ffffff">id:' + anim.id + '</font>');
		}
	};
	
	var _onDBClickList = function(e, idx){
		var animId = res_animations[idx].id;
		if ( m_anim ) {
			m_anim.stop();
		}
		m_anim = m_g.getAnimMgr().alloc(animId);
		m_anim.setZIndex(1000000);
		m_anim.setPosition({x:200, y:200});
		m_anim.play();
	};
	//TestAnimDlg-unittest-end
});
