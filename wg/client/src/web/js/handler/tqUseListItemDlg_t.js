/*******************************************************************************/
requireEx('./handler/tqUseListItemDlg.js', [
	{
		start:'//UseListItemDlg-unittest-start'
		,end:'//UseListItemDlg-unittest-end'
		,items:['m_g'
			,'m_preusecaller'
			,'m_targetitem'
			,'m_ret'
			,'_setParams'
			,'_getEffectRes'
			,'_getTargetName'
			,'_onUseItem'
			,'_preCaller'
			,'_isNeedBuy'
			,'_isNeedPay'
			,'_filterTargetFields']
	}
]);

TestCaseUseListItemDlg= TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		UIM.regDlg('buyitem', FilterItemDlg.snew(this.g));
		this.dlg = UseListItemDlg.snew(this.g);
		this.lc = this.dlg.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_openDlg = function(){
		var r_effRes = [null];
		this.mm.mock(this.lc(), '_setParams' );
		this.mm.mock(this.lc(), '_getEffectRes', r_effRes );
		this.mm.mock(this.lc(), '_getTargetName', ['my'] );
		this.mm.mock(UIM.getDlg('filteritem'), 'setCaller' );
		this.mm.mock(UIM.getDlg('filteritem'), 'openDlg' );
		
		var effids = [1,2];
		var targetitem = {name:'my'};
		var ret = 1;
		var desc = 'desc';
		this.dlg.openDlg(effids, targetitem, ret, desc);
		assertEQ ( this.mm.walkLog, '_setParams,_getEffectRes' );
		assertEQ ( this.mm.params['_setParams'], [targetitem, ret] );
		assertEQ ( this.mm.params['_getEffectRes'], [effids] );
		
		this.mm.clear();
		r_effRes[0] = {dlg:{title:'title', btntext:'btn'}};
		this.dlg.openDlg(effids, targetitem, ret, desc);
		assertEQ ( this.mm.walkLog, '_setParams,_getEffectRes,setCaller,_getTargetName,openDlg' );
		assertEQ ( this.mm.params['setCaller'], [{self:this.dlg,caller:this.lc()._onUseItem}] );
		assertEQ ( this.mm.params['openDlg'], [{title:'title', filter:'effect', effids:effids, 
			btntext:'btn', name:'my', targetitem:targetitem, desc:'desc'}] );
	};
	
	this.test_openDlgByItemIds = function(){
		this.mm.mock(this.lc(), '_setParams' );
		this.mm.mock(this.lc(), '_getTargetName', ['my'] );
		this.mm.mock(UIM.getDlg('filteritem'), 'setCaller' );
		this.mm.mock(UIM.getDlg('filteritem'), 'openDlg' );
		
		var title = 'title';
		var btnText = 'btnText';
		var itemids = [1,2];
		var targetitem = {name:'my'};
		var ret = 1;
		var desc = 'desc';
		this.dlg.openDlgByItemIds(title, btnText, itemids, targetitem, ret, desc);
		assertEQ ( this.mm.walkLog, '_setParams,setCaller,_getTargetName,openDlg' );
		assertEQ ( this.mm.params['setCaller'], [{self:this.dlg,caller:this.lc()._onUseItem}] );
		assertEQ ( this.mm.params['openDlg'], [{title:'title', filter:'itemids', itemids:itemids, 
			btntext:'btnText', name:'my', targetitem:targetitem, desc:'desc'}] );
	};
	
	this.test__setParams = function(){
		this.lc().m_preusecaller = {};
		this.lc().m_targetitem = null;
		this.lc().m_ret = null;
		
		var targetitem = {name:'my'};
		var ret = 100;
		this.lc()._setParams(targetitem, ret);
		assertEQ ( this.lc().m_preusecaller, null );
		assertEQ ( this.lc().m_targetitem, targetitem );
		assertEQ ( this.lc().m_ret, ret );
		
		this.lc()._setParams(targetitem, null);
		assertEQ ( this.lc().m_ret, RET_END );
		
		this.lc()._setParams(targetitem);
		assertEQ ( this.lc().m_ret, RET_END );
	};
	
	this.test__getEffectRes = function(){
		var log_bak = log;
		log = function(){};
		assertEQ ( this.lc()._getEffectRes([RES_EFF.ACCELERATE, RES_EFF.ADDARMGRID]), TQ.qfind(res_effects, 'id', RES_EFF.ADDARMGRID));
		assertEQ ( this.lc()._getEffectRes([RES_EFF.ACCELERATE,  -1, RES_EFF.ADDARMGRID]), null );
		log = log_bak;
	};
	
	this.test_preCaller = function(){
		var g_item = {};
		this.lc().m_preusecaller = null;
		
		assert ( this.lc()._preCaller(g_item) == true );
		
		var item_ = null;
		this.lc().m_preusecaller = function(item){ item_= item; return false; }
		
		assert ( this.lc()._preCaller(g_item) == false );
		assert ( item_ == g_item );
		
		var item_ = null;
		this.lc().m_preusecaller = function(item){item_=item; return true; }
		assert ( this.lc()._preCaller(g_item) == true );
	};
	
	this.test_isNeedBuy = function(){
		var buyItemDlg = MockDialog.snew();
		var item_ = null;
		buyItemDlg.openDlg = function(item){ item_ = item;	};
		UIM.regDlg('buyitem', buyItemDlg);
		
		assert ( this.lc()._isNeedBuy({number:1}) == false );
		assert ( this.lc()._isNeedBuy({number:0, itemres:{}}) == false );
		assert ( this.lc()._isNeedBuy({number:0, resid:1, itemres:{buyprice:[0,1,1]}}) == true );
		assert ( item_.id == 0 );
		assert ( item_.resid == 1 );
		assert ( item_.number > 1 );
	};
	
	this.test_isNeedPay = function(){
		assert ( this.lc()._isNeedPay({isGiftGold:false}) == false );
		assert ( this.lc()._isNeedPay({isGiftGold:true, needNumber:0}) == false );
		assert ( this.lc()._isNeedPay({isGiftGold:true, needNumber:10000}) == true );
		assert ( g_app.getGUI().isShowMsgBox() == true);
		assert ( g_app.getGUI().getMsgBoxMsg() == rstr.useitem.uselistitemdlg.noEnoughGold );
		
		var mm = MethodMock.snew();
		mm.mock(JMISC, 'openPayWnd', function(){ mm.walkLog='openPayWnd'; } );
		g_app.getGUI().msgBoxClick(MB_IDYES);
		mm.restore();
		
		assert ( mm.walkLog == 'openPayWnd' );
	};
	
	this.test__onUseItem = function(){
		var r_preCaller = [false];
		var r_isNeedBuy = [true];
		var r_isNeedPay = [true];
		var r_isSpec = [false];
		this.mm.mock(this.lc(), '_preCaller', r_preCaller);
		this.mm.mock(this.lc(), '_isNeedBuy', r_isNeedBuy);
		this.mm.mock(this.lc(), '_isNeedPay', r_isNeedPay);
		var specHdr =DirectUseItemHdrMgr.getHdr({effects:[{id:RES_EFF.SETPOS_MOVECITY}]});
		this.mm.mock(DirectUseItemHdrMgr, 'getHdr', [specHdr]);
		this.mm.mock(DirectUseItemHdrMgr, 'isSpec', r_isSpec);
		this.mm.mock(specHdr, 'useItem');
		this.mm.mock(UseItemSender, 'send');
		
		this.mm.clear();
		var item = {itemres:{id:1},needNumber:1};
		assertEQ ( this.lc()._onUseItem(item), RET_CONTINUE );
		assertEQ ( this.mm.walkLog , '_preCaller' );
		assertEQ ( this.mm.params['_preCaller'] , [item] );
		
		this.mm.clear();
		r_preCaller[0] = true;
		assertEQ ( this.lc()._onUseItem(item), RET_CONTINUE );
		assertEQ ( this.mm.walkLog , '_preCaller,_isNeedBuy' );
		assertEQ ( this.mm.params['_isNeedBuy'] , [item] );
		
		this.mm.clear();
		r_isNeedBuy[0] = false;
		assertEQ ( this.lc()._onUseItem(item), RET_CONTINUE );
		assertEQ ( this.mm.walkLog , '_preCaller,_isNeedBuy,_isNeedPay' );
		assertEQ ( this.mm.params['_isNeedPay'] , [item] );
		
		this.mm.clear();
		this.lc().m_ret = 100;
		r_isNeedPay[0] = false;
		assertEQ ( this.lc()._onUseItem(item), 100 );
		assertEQ ( this.mm.walkLog , '_preCaller,_isNeedBuy,_isNeedPay,isSpec,send' );
		assertEQ ( this.mm.params['isSpec'] , [item.itemres] );
		assertEQ ( this.mm.params['send'] , [this.g, item, item.needNumber, this.lc()._filterTargetFields()] );
		
		this.mm.clear();
		r_isSpec[0] = true;
		assertEQ ( this.lc()._onUseItem(item), 100 );
		assertEQ ( this.mm.walkLog , '_preCaller,_isNeedBuy,_isNeedPay,isSpec,getHdr,useItem' );
		assertEQ ( this.mm.params['getHdr'] , [item.itemres] );
		assertEQ ( this.mm.params['useItem'] , [this.g, item] );
	};
});


tqUseListItemDlg_t_main = function(suite) {
	suite.addTestCase(TestCaseUseListItemDlg, 'TestCaseUseListItemDlg');
};
