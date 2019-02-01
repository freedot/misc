/******************************************************************************
  Copyright (C) 2012. All rights reserved.
******************************************************************************/
PageNavigate = function(){
	//-----------
	//private:data
	//-----------
	var m_g;
	var m_this;
	var m_dom;
	var m_pageIdx;
	var m_pageCnt;
	var m_caller;
	var m_firstbtn=null;
	var m_prevbtn=null;
	var m_nextbtn=null;
	var m_lastbtn=null;
	var m_pagelabel;
	var m_showcount;
	var m_ops={edgebtn:false};
	var m_id = 0;

	//------------
	//public:method
	//------------
	/** 初始化 */
	this.init = function(g, dom, ops){
		m_g = g;
		m_this = this;
		m_dom = dom;
		m_pageIdx = 1;
		m_pageCnt = 1;
		if ( ops ) m_ops = ops;
		
		if ( m_ops.edgebtn ) {
			m_firstbtn = new ComButton(m_g,dom,{uiback:uiback.btn.pagefirst});
			m_firstbtn.setCaller({self:m_this, caller:_onFirstPage});
		}
		
		m_prevbtn = new ComButton(m_g,dom,{uiback:uiback.btn.pageprev});
		m_prevbtn.setCaller({self:m_this, caller:_onPrevPage});
		
		m_showcount = TQ.createDom('div');
		TQ.setClass(m_showcount, 'page_showcount');
		TQ.append(m_dom, m_showcount);
		
		m_nextbtn = new ComButton(m_g,dom,{uiback:uiback.btn.pagenext});
		m_nextbtn.setCaller({self:m_this, caller:_onNextPage});
		
		if ( m_ops.edgebtn ) {
			m_lastbtn = new ComButton(m_g,dom,{uiback:uiback.btn.pagelast});
			m_lastbtn.setCaller({self:m_this, caller:_onLastPage});
		}
		
		_resetPos();
		_reShowPage();
	};
	
	this.setId = function(id){
		m_id = id;
	};
	
	this.getId = function(){
		return m_id;
	};
	
	/** 设置回调 */
	this.setCaller = function(caller){
		m_caller = caller;
	};
	
	/** 激活某个页 */
	this.activePage = function(pageidx,force,nosend){
		if ( pageidx < 1 ) {
			pageidx = 1;
		}
		if ( pageidx > m_pageCnt ) {
			pageidx = m_pageCnt;
		}
		if ( force || m_pageIdx != pageidx ){
			m_pageIdx = pageidx;
			if ( m_caller != null && !nosend ) {
				m_caller.caller.call(m_caller.self, m_pageIdx, m_id);
			}
		}
		_reShowPage();
	};
	
	/** 设置页面的总个数 */
	this.setPageCnt = function(cnt) {
		m_pageCnt = cnt;
		if ( m_pageIdx > m_pageCnt ) {
			m_pageIdx = m_pageCnt;
		}
		_reShowPage();
	};
	
	/** 获得当前的页 */
	this.getCurPage = function() {
		return m_pageIdx;
	};
	
	this.getPageCnt = function(){
		return m_pageCnt;
	};
	
	//--------------
	// private:method
	//--------------
	var _reShowPage = function() {
		TQ.setHtml(m_showcount, m_pageIdx + '/' + m_pageCnt);
		m_prevbtn.enable(m_pageIdx>1);
		m_nextbtn.enable(m_pageIdx<m_pageCnt);
		if ( m_firstbtn ){
			m_firstbtn.enable(m_pageIdx>1);
		}
		if ( m_lastbtn ){
			m_lastbtn.enable(m_pageIdx<m_pageCnt);
		}
	};
	
	/** 设置位置 */
	var _resetPos = function() {
		var btnw = m_prevbtn.getWidth() + m_nextbtn.getWidth();
		if ( m_firstbtn && m_lastbtn){
			btnw += m_firstbtn.getWidth() + m_lastbtn.getWidth();
		}
		var iWidth = TQ.getDomWidth(m_dom) - btnw;
		TQ.setDomWidth(m_showcount, iWidth );
	};
	
	/** 响应翻页到头 */
	var _onFirstPage = function(id) {
		m_this.activePage(0,true);
	};
	
	/** 响应向前翻页 */
	var _onPrevPage = function(id) {
		m_this.activePage(--m_pageIdx,true);
	};
	
	/** 响应向后翻页 */
	var _onNextPage = function(id) {
		m_this.activePage(++m_pageIdx,true);
	};
	
	/** 响应翻页到结尾 */
	var _onLastPage = function(id) {
		m_this.activePage(m_pageCnt,true);
	};

	//--------------
	// call constructor
	//--------------
	this.init.apply(this, arguments);
};