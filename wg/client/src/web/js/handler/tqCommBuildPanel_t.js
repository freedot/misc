/*******************************************************************************/
requireEx('./handler/tqCommBuildPanel.js', [
	{
		start:'//CommBuildPanel-unittest-start'
		,end:'//CommBuildPanel-unittest-end'
		,items:[
			'm_g'
			,'m_this'
			,'m_items'
			,'m_params'
			,'m_buildBlocks'
			,'m_isFirstOpen'
			,'m_isCreated'
			,'m_opMenuHdr'
			,'m_modifyFlag'
			,'m_cityId'
			,'m_firstPos'
			,'_open'
			,'_firstOpen'
			,'_firstCreate'
			,'_setBuildsContent'
			,'_onUpdate'
			,'_createBuildBlocks'
			,'_setBlocksCanUseCnt'
			,'_createOpMenuHdr'
			,'_onViewportChange'
			,'_onClickBlock'
			,'_onGetBlockTooltip'
			,'_clearBlocks'
			,'_setNewBuildBlocks'
			,'_isEnableBlock'
			,'_isEmptyBlock'
			,'_openSelBuildDlg'
			,'_getSelBuildDlgByCityId'
			,'_showOpMenu'
			,'_onSelectOneBuild'
			,'_onUpdateBuildTime'
			,'_getIdFromIdx'
			,'_getIdxFromId'
			,'_setModify'
			,'_getCurSelBlockState'
			,'_isNeedResetOpMenu'
			,'_update'
			,'_addCityIdToBuilds'
		]
	}
]);
	

TestCaseCommBuildPanel = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.mm.nologMock( this.g.getWinSizer(), 'getValidClientSize', [{cx:1000, cy:600}] );
		var p_dom = MockDom.snew();
		this.params = {cityResId:1, mapTitle:'title', blockPoss:[{x:1, y:2},{x:3, y:4},{x:5, y:6}], canUseBlockCnt:10,cityId:1};
		this.panel = CommBuildPanel.snew(this.g, p_dom, this.params);
		this.lc = this.panel.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};

	this.test_init = function(){
		var p_dom = MockDom.snew();
		var p_params = {};
		var panel = CommBuildPanel.snew(this.g, p_dom, p_params);
		
		this.mm.mock ( panel.Super, 'init' );
		this.mm.mock ( panel, 'hide' );
		
		panel.init(this.g, p_dom, p_params);
		assertEQ ( this.mm.walkLog, 'init,hide' );
		assertEQ ( this.mm.params['init'], [this.g, p_dom] );
		assertEQ ( panel.lc().m_g, this.g );
		assertEQ ( panel.lc().m_this, panel );
		assertEQ ( panel.lc().m_params, p_params );
		assertEQ ( this.lc().m_cityId, 1 );
		assertEQ ( this.lc().m_isFirstOpen, true );
	};
	
	this.test_setFirstPos = function(){
		var firstPos = {x:1, y:2};
		this.panel.setFirstPos(firstPos);
		assertEQ ( this.lc().m_firstPos, {x:1, y:2});
	};
	
	this.test_open = function(){
		this.lc().m_isFirstOpen = true;
		this.mm.mock ( this.lc(), '_firstOpen');
		this.mm.mock ( this.lc(), '_open');
		
		this.panel.open();
		assertEQ ( this.mm.walkLog, '_firstOpen' );
		
		this.mm.clear();
		this.lc().m_isFirstOpen = false;
		this.panel.open();
		assertEQ ( this.mm.walkLog, '_open' );
	};
	
	this.test_hide = function(){
		this.mm.mock ( this.g, 'unregUpdater');
		this.mm.mock ( this.panel.Super, 'hide');
		this.panel.hide();
		assertEQ ( this.mm.walkLog, 'unregUpdater,hide' );
		assertEQ ( this.mm.params['unregUpdater'], [this.panel, this.lc()._onUpdate] );
	};
	
	this.test_opSpeed = function(){
		this.lc()._createOpMenuHdr();
		
		this.mm.mock ( this.lc().m_opMenuHdr, 'opSpeed');
		var p_item = {};
		this.panel.opSpeed(p_item);
		assertEQ ( this.mm.params['opSpeed'], [p_item] );
	};
	
	this.test_opCancel = function(){
		this.lc()._createOpMenuHdr();
		
		this.mm.mock ( this.lc().m_opMenuHdr, 'opCancel');
		var p_item = {};
		this.panel.opCancel(p_item);
		assertEQ ( this.mm.params['opCancel'], [p_item] );
	};	
	
	this.test_setBlocksCanUseCnt = function(){
		this.mm.mock(this.lc(), '_setBlocksCanUseCnt');
		this.panel.setBlocksCanUseCnt(1)
		assertEQ ( this.mm.params['_setBlocksCanUseCnt'], [1] );
	};
	
	this.test_handleSvrBuildsData = function(){
		this.lc()._createOpMenuHdr();
		
		var r_oldState = 1;
		var r_isNeedResetOpMenu = [false];
		
		this.mm.mock( this.lc(), '_setModify' );
		this.mm.mock( this.lc(), '_getCurSelBlockState', [r_oldState] );
		this.mm.mock( ItemResUtil, 'initItemsres' );
		this.mm.mock( this.lc(), '_addCityIdToBuilds' );
		this.mm.mock( this.lc(), '_setBuildsContent' );
		this.mm.mock( this.lc(), '_isNeedResetOpMenu', r_isNeedResetOpMenu );
		this.mm.mock( this.lc().m_opMenuHdr, 'resetOpMenuItemsShow');
		this.mm.mock( this.lc(), '_update');

		var p_netBuilds = [{id:1},{id:2}];		
		this.panel.handleSvrBuildsData(p_netBuilds);
		assertEQ ( this.mm.walkLog, '_setModify,_getCurSelBlockState,initItemsres,_addCityIdToBuilds,_setBuildsContent,_isNeedResetOpMenu,_update');
		assertEQ ( this.mm.params['_setModify'], [true] );
		assertEQ ( this.mm.params['initItemsres'], [this.g.getImgr().getBuildsByCityId(1)] );
		assertEQ ( this.mm.params['_addCityIdToBuilds'], [this.g.getImgr().getBuildsByCityId(1)] );
		assertEQ ( this.mm.params['_isNeedResetOpMenu'], [r_oldState] );
		assertEQ ( this.g.getImgr().getBuildsByCityId(1), [{id:1},{id:2}] );
		
		this.mm.clear();
		r_isNeedResetOpMenu[0] = true;
		this.panel.handleSvrBuildsData(p_netBuilds);
		assertEQ ( this.mm.walkLog, '_setModify,_getCurSelBlockState,initItemsres,_addCityIdToBuilds,_setBuildsContent,_isNeedResetOpMenu,resetOpMenuItemsShow,_update');

	};
	
	this.test__firstOpen = function(){
		this.lc()._createBuildBlocks();
		
		this.lc().m_isFirstOpen = true;
		
		this.mm.mock ( UIM, 'closeMapPanels' );
		this.mm.mock ( this.panel, 'setLastViewport' );
		this.mm.mock ( this.lc(), '_open' );
		this.mm.mock ( this.lc().m_buildBlocks, 'setViewPos' );
		
		var mapSize = {cx:2048, cy:1536};
		var x = Math.max(0, (mapSize.cx - 1000)/2);
		var y = Math.max(0, (mapSize.cy - 600)/2);
		assertEQ ( this.lc().m_firstPos, {x:x, y:y});
		
		var firstPos = {x:1, y:2};
		this.panel.setFirstPos(firstPos);
		
		this.lc()._firstOpen();
		assertEQ ( this.mm.walkLog, 'closeMapPanels,setLastViewport,_open,setViewPos' );
		assertEQ ( this.mm.params['setLastViewport'], [firstPos] );
		assertEQ ( this.mm.params['setViewPos'], [firstPos.x, firstPos.y] );
		assertEQ ( this.lc().m_isFirstOpen, false );
	};
	
	this.test__open = function(){
		this.mm.mock ( this.panel, 'show');
		this.mm.mock ( this.lc(), '_firstCreate');
		this.mm.mock ( this.panel, 'loadMap');
		this.mm.mock ( this.g, 'regUpdater');
		this.mm.mock ( this.lc(), '_setBuildsContent');
		this.mm.mock ( this.g.getImgr(), 'setCurLoadCity');
		this.mm.mock ( UIM.getPanel('main').getSubCityBtnsBar(), 'setCurSubCityId');
		this.mm.mock ( this.panel, 'resetSMapCaller');
		
		this.lc()._open();
		assertEQ ( this.mm.walkLog, 'show,_firstCreate,loadMap,regUpdater,_setBuildsContent,setCurLoadCity,setCurSubCityId,resetSMapCaller' );
		assertEQ ( this.mm.params['loadMap'], [this.params.cityResId, this.params.mapTitle] );
		assertEQ ( this.mm.params['regUpdater'], [this.panel, this.lc()._onUpdate, 1000] );
		assertEQ ( this.mm.params['setCurLoadCity'], [this.params.cityResId] );
		assertEQ ( this.mm.params['setCurSubCityId'], [this.params.cityId] );
	};	
	
	this.test__setModify = function(){
		this.lc()._setModify(false);
		assertEQ ( this.lc().m_modifyFlag, false );
		
		this.lc()._setModify(true);
		assertEQ ( this.lc().m_modifyFlag, true );
	};
	
	this.test__getCurSelBlockState = function(){
		assertEQ ( this.lc()._getCurSelBlockState(), -1 );
		
		this.lc()._createBuildBlocks();
		assertEQ ( this.lc()._getCurSelBlockState(), -1 );
		
		var r_item = null;
		var p_curBlock = new function(){this.getItem = function(){
				return r_item;
			};};
		this.mm.mock ( this.lc().m_buildBlocks, 'getCurBlock', [p_curBlock] );
		assertEQ ( this.lc()._getCurSelBlockState(), -1 );
			
		r_item = {state:1};
		assertEQ ( this.lc()._getCurSelBlockState(), 1 );
	};
	
	this.test__addCityIdToBuilds = function(){
		this.lc().m_cityId = 2;
		var builds = [{id:1},{id:2}];
		this.lc()._addCityIdToBuilds(builds);
		assertEQ ( builds, [{id:1,cityId:2},{id:2,cityId:2}] );
	};
	
	this.test__isNeedResetOpMenu = function(){
		this.lc()._createOpMenuHdr();
		this.lc().m_isCreated = false;
		var r_isShow1 = [false];
		var r_isShow2 = [false];
		var r_curState = 1;
		this.mm.mock(this.panel, 'isShow', r_isShow1 );
		this.mm.mock(this.lc().m_opMenuHdr, 'isShow', r_isShow2 );
		this.mm.mock(this.lc(), '_getCurSelBlockState', [r_curState] );
		
		var p_lastState = 1;
		assertEQ ( this.lc()._isNeedResetOpMenu(p_lastState), false );
		assertEQ ( this.mm.walkLog, '' );
		
		this.mm.clear();
		this.lc().m_isCreated = true;
		assertEQ ( this.lc()._isNeedResetOpMenu(p_lastState), false );
		assertEQ ( this.mm.walkLog, 'isShow' );
		
		this.mm.clear();
		r_isShow1[0] = true;
		assertEQ ( this.lc()._isNeedResetOpMenu(p_lastState), false );
		assertEQ ( this.mm.walkLog, 'isShow,isShow' );
		
		this.mm.clear();
		r_isShow2[0] = true;
		assertEQ ( this.lc()._isNeedResetOpMenu(p_lastState), false );
		assertEQ ( this.mm.walkLog, 'isShow,isShow,_getCurSelBlockState' );
	
		this.mm.clear();
		p_lastState = 0;
		assertEQ ( this.lc()._isNeedResetOpMenu(p_lastState), true );
	};
	
	this.test__firstCreate = function(){
		this.lc().m_isCreated = true;
		
		var r_items = {mapscene:MockDom.snew(), mousemap:MockDom.snew()};
		this.mm.mock ( this.panel, 'create' );
		this.mm.mock ( this.panel, 'setViewportCaller' );
		this.mm.mock ( this.lc(), '_createBuildBlocks' );
		this.mm.mock ( this.lc(), '_setBlocksCanUseCnt' );
		this.mm.mock ( this.lc(), '_createOpMenuHdr' );
		
		this.lc()._firstCreate();
		assertEQ ( this.mm.walkLog, '' );
		
		this.lc().m_isCreated = false;
		this.lc()._firstCreate();
		assertEQ ( this.mm.walkLog, 'create,setViewportCaller,_createBuildBlocks,_setBlocksCanUseCnt,_createOpMenuHdr' );
		assertEQ ( this.mm.params['setViewportCaller'], [{self:this.panel, caller:this.lc()._onViewportChange}] );
		assertEQ ( this.mm.params['_setBlocksCanUseCnt'], [10] );
		assertEQ ( this.lc().m_isCreated, true );
	};
	
	this.test__createBuildBlocks = function(){
		var r_items = {mapscene:MockDom.snew(), mousemap:MockDom.snew()};
		this.mm.mock ( this.panel, 'getItems', [r_items] );
		this.mm.mock ( BuildBlocks, 'snew' );
		
		this.lc()._createBuildBlocks();
		assertEQ ( this.mm.walkLog, 'getItems,snew' );
		assertEQ ( this.mm.params['snew'], [this.g, {map:this.lc().m_items.mapscene
			,mousemap:this.lc().m_items.mousemap
			,blockclass:InBuildBlock
			,poss:this.params.blockPoss
			,blockw:100
			,blockh:54
			,clickcaller:{self:this.panel, caller:this.lc()._onClickBlock}
			,tipcaller:{self:this.panel, caller:this.lc()._onGetBlockTooltip}
			}] );		
		assertEQ ( this.lc().m_items,  r_items );
	};
	
	this.test__setBlocksCanUseCnt = function(){
		this.lc()._createBuildBlocks();
		this.lc()._setBlocksCanUseCnt(1000);
		assertEQ ( this.lc().m_buildBlocks.getCanUseBlockCnt(), 1000 );
	};
	
	this.test__createOpMenuHdr = function(){
		this.lc()._createBuildBlocks();
		
		var r_opHdr = BuildsOpHdr.snew(this.g, {});
		this.mm.mock ( BuildsOpHdr, 'snew', [r_opHdr] );
		this.mm.mock ( r_opHdr, 'createOpMenu' );
		
		this.lc().m_cityId = 1;
		this.lc()._createOpMenuHdr();
		assertEQ ( this.mm.walkLog, 'snew,createOpMenu' );
		assertEQ ( this.mm.params['snew'], [this.g, this.lc().m_buildBlocks] );
		assertEQ ( this.lc().m_opMenuHdr, r_opHdr );
	};
	
	this.test__setBuildsContent = function(){
		this.lc().m_isCreated = false;
		var r_isShow = [false];
		this.lc().m_modifyFlag = false;
		
		this.mm.mock(this.lc(), '_clearBlocks' );
		this.mm.mock(this.lc(), '_setNewBuildBlocks' );
		this.mm.mock(this.panel, 'isShow', r_isShow );
		
		this.lc()._setBuildsContent();
		assertEQ ( this.mm.walkLog, '' );
		
		this.mm.clear();
		this.lc().m_isCreated = true;
		this.lc()._setBuildsContent();
		assertEQ ( this.mm.walkLog, 'isShow' );
		
		this.mm.clear();
		r_isShow[0] = true;
		this.lc()._setBuildsContent();
		assertEQ ( this.mm.walkLog, 'isShow' );
		
		this.mm.clear();
		this.lc().m_modifyFlag = true;
		this.lc()._setBuildsContent();
		assertEQ ( this.mm.walkLog, 'isShow,_clearBlocks,_setNewBuildBlocks' );
		assertEQ ( this.lc().m_modifyFlag, false );
	};
	
	this.test__clearBlocks = function(){
		this.lc()._createBuildBlocks();
		
		this.mm.mock(this.lc().m_buildBlocks.getBlock(0), 'setItem');
		this.mm.mock(this.lc().m_buildBlocks.getBlock(1), 'setItem');
		
		this.lc()._clearBlocks();
		assertEQ ( this.mm.walkLog, 'setItem,setItem' );
		assertEQ ( this.mm.params['setItem.0'], [null] );
		assertEQ ( this.mm.params['setItem.1'], [null] );
	};
	
	this.test__setNewBuildBlocks = function(){
		this.lc()._createBuildBlocks();
		
		this.g.getImgr().getBuilds().cityBuilds[1] = [{id:2}];
		this.mm.mock(this.lc().m_buildBlocks.getBlock(1), 'setItem');
		this.lc()._setNewBuildBlocks();
		assertEQ ( this.mm.walkLog, 'setItem' );
		assertEQ ( this.mm.params['setItem'], [ this.g.getImgr().getBuildsByCityId(1)[0] ] );
	};
	
	this.test__onViewportChange = function(){
		this.lc()._createBuildBlocks();
		this.mm.mock(this.lc().m_buildBlocks, 'setViewPos');
		this.lc()._onViewportChange({x:1, y:2});
		assertEQ ( this.mm.params['setViewPos'], [1,2] );
	};
	
	this.test__onClickBlock = function(){
		this.lc()._createBuildBlocks();
		
		var r_isDragged = [true];
		var r_isValidBlock = [false];
		var r_isEmptyBlock = [true];
		
		var r_pos = {x:1, y:2};
		this.mm.mock(this.panel, 'isDragged', r_isDragged);
		this.mm.mock(this.lc(), '_isEnableBlock', r_isValidBlock);
		this.mm.mock(this.lc(), '_isEmptyBlock', r_isEmptyBlock);
		this.mm.mock(this.g.getGUI(), 'hideAllMenu');
		this.mm.mock(this.lc(), '_openSelBuildDlg');
		this.mm.mock(TQ, 'mouseCoords', [r_pos]);
		this.mm.mock(this.lc(), '_showOpMenu');
		
		var p_event = {type:'event'};
		var p_blockIdx = 0;
		this.lc()._onClickBlock(p_event, p_blockIdx);
		assertEQ ( this.mm.walkLog, 'isDragged,hideAllMenu' );
		assertEQ ( this.mm.params['isDragged'], [p_event] );
		
		this.mm.clear();
		r_isDragged[0] = false;
		this.lc()._onClickBlock(p_event, p_blockIdx);
		assertEQ ( this.mm.walkLog, 'isDragged,_isEnableBlock,hideAllMenu' );
		assertEQ ( this.mm.params['_isEnableBlock'], [p_blockIdx] );
		
		this.mm.clear();
		r_isValidBlock[0] = true;
		this.lc()._onClickBlock(p_event, p_blockIdx);
		assertEQ ( this.mm.walkLog, 'isDragged,_isEnableBlock,_isEmptyBlock,_openSelBuildDlg' );
		assertEQ ( this.mm.params['_openSelBuildDlg'], [p_blockIdx] );
		
		this.mm.clear();
		r_isEmptyBlock[0] = false;
		this.lc()._onClickBlock(p_event, p_blockIdx);
		assertEQ ( this.mm.walkLog, 'isDragged,_isEnableBlock,_isEmptyBlock,mouseCoords,_showOpMenu' );
		assertEQ ( this.mm.params['mouseCoords'], [p_event] );
		assertEQ ( this.mm.params['_showOpMenu'], [r_pos] );
	};
	
	this.test__isEnableBlock = function(){
		this.lc()._createBuildBlocks();
		
		this.lc().m_buildBlocks.setCanUseBlockCnt(1);
		assertEQ ( this.lc()._isEnableBlock(-1), false );
		assertEQ ( this.lc()._isEnableBlock(0), true );
		assertEQ ( this.lc()._isEnableBlock(1), false );
	};
	
	this.test__isEmptyBlock = function(){
		this.lc()._createBuildBlocks();
		var r_getItem = [null];
		this.mm.mock(this.lc().m_buildBlocks.getBlock(0), 'getItem', r_getItem);
		
		var p_blockIdx = 0;
		assertEQ ( this.lc()._isEmptyBlock(p_blockIdx), true );
		
		r_getItem[0] = {type:'item'};
		assertEQ ( this.lc()._isEmptyBlock(p_blockIdx), false );
	};
	
	this.test__openSelBuildDlg = function(){
		this.lc()._createBuildBlocks();
		
		this.lc().m_cityId = 1;
		
		var dlg = MockDialog.snew();
		this.mm.mock(this.lc(), '_getSelBuildDlgByCityId', [dlg]);
		this.mm.mock(dlg, 'openDlg');
		this.mm.mock(dlg, 'setCaller');
		
		var p_blockIdx = 0;
		this.lc()._openSelBuildDlg(p_blockIdx);
		assertEQ ( this.mm.walkLog, '_getSelBuildDlgByCityId,openDlg,setCaller' );
		assertEQ ( this.mm.params['openDlg'], [this.lc().m_cityId] );
		assertEQ ( this.mm.params['setCaller'], [{self:this.panel, caller:this.lc()._onSelectOneBuild}] );
	};
	
	this.test__getSelBuildDlgByCityId = function(){
		this.lc().m_cityId = 1;
	
		var r_dlg = MockDialog.snew();
		var r_getCityTypeByCityId = [CITY_TYPE.MAIN];
		this.mm.mock(this.g.getImgr(), 'getCityTypeByCityId', r_getCityTypeByCityId);
		this.mm.mock(UIM, 'getDlg', [r_dlg]);
		
		assertEQ ( this.lc()._getSelBuildDlgByCityId(), r_dlg );
		assertEQ ( this.mm.params['getCityTypeByCityId'], [this.lc().m_cityId] );
		assertEQ ( this.mm.params['getDlg'], ['mainselbuild'] );
		
		this.mm.clear();
		r_getCityTypeByCityId[0] = CITY_TYPE.SUBRES;
		assertEQ ( this.lc()._getSelBuildDlgByCityId(), r_dlg );
		assertEQ ( this.mm.params['getDlg'], ['resselbuild'] );
		
		this.mm.clear();
		r_getCityTypeByCityId[0] = CITY_TYPE.SUBARMY;
		assertEQ ( this.lc()._getSelBuildDlgByCityId(), r_dlg );
		assertEQ ( this.mm.params['getDlg'], ['militaryselbuild'] );
	};
	
	this.test__showOpMenu = function(){
		this.lc()._createOpMenuHdr();
		this.mm.mock(this.lc().m_opMenuHdr, 'resetOpMenuItemsShow');
		this.mm.mock(this.lc().m_opMenuHdr, 'show');
		this.mm.mock(this.lc().m_opMenuHdr, 'updateOpMenuItem');
		
		var p_pos = {x:1, y:2};
		this.lc()._showOpMenu(p_pos);
		assertEQ ( this.mm.walkLog, 'resetOpMenuItemsShow,show,updateOpMenuItem' );
		assertEQ ( this.mm.params['show'], [p_pos] );
	};
	
	this.test__onGetBlockTooltip = function(){
		this.lc()._createBuildBlocks();
		this.lc().m_cityId = 1;
		
		var r_isEnableBlock = [false];
		var r_isEmptyBlock = [true];
		var r_canUseCityLevel = 1;
		this.mm.mock(this.lc(), '_isEnableBlock', r_isEnableBlock );
		this.mm.mock(CityLevelUtil, 'getCityLevelByCanUseBlockIdx', [r_canUseCityLevel] );
		this.mm.mock(this.lc(), '_isEmptyBlock', r_isEmptyBlock );
		this.mm.mock(TIPM, 'getBuildDesc', ['desc'] );
		
		var p_data = {idx:0};
		assertEQ ( this.lc()._onGetBlockTooltip(p_data), TQ.formatLine(TQ.format(rstr.inbuild.panel.tips.disableblock, RStrUtil.getCityNameByLevel(1))) );
		assertEQ ( this.mm.params['_isEnableBlock'], [0] );
		assertEQ ( this.mm.params['getCityLevelByCanUseBlockIdx'], [0] );
		
		this.mm.clear();
		r_isEnableBlock[0] = true;
		assertEQ ( this.lc()._onGetBlockTooltip(p_data), TQ.formatLine(rstr.inbuild.panel.tips.eblock) );
		assertEQ ( this.mm.params['_isEmptyBlock'], [0] );
		
		this.mm.clear();
		r_isEmptyBlock[0] = false;
		assertEQ ( this.lc()._onGetBlockTooltip(p_data), 'desc' );
		assertEQ ( this.mm.params['getBuildDesc'], [1, 'build', this.lc().m_buildBlocks.getBlock(0).getItem()] );
	};
	
	this.test__onSelectOneBuild = function(){
		this.lc()._createBuildBlocks();
		this.lc().m_cityId = 2;
		this.mm.mock(this.lc().m_buildBlocks, 'getCurSel', [2]);
		this.mm.mock(CityBuildSender, 'sendAddBuild');
		
		var p_resid = 110001;
		this.lc()._onSelectOneBuild(p_resid);
		assertEQ ( this.mm.walkLog, 'getCurSel,sendAddBuild' );
		assertEQ ( this.mm.params['sendAddBuild'], [this.g, 2, 3, 110001] );
	};
	
	this.test__onUpdate = function(){
		this.mm.mock(this.lc(), '_update');
		this.lc()._onUpdate();
		assertEQ ( this.mm.walkLog, '_update' );
	};
	
	this.test__update = function(){
		this.lc()._createOpMenuHdr();
		
		this.lc().m_isCreated = false;
		var r_isShow = [false];
		this.mm.mock( this.panel, 'isShow', r_isShow);
		this.mm.mock( this.lc(), '_onUpdateBuildTime' );
		this.mm.mock( this.lc().m_opMenuHdr, 'updateOpMenuItem' );
		
		this.lc()._update();
		assertEQ ( this.mm.walkLog, '' );
		
		this.mm.clear();
		this.lc().m_isCreated = true;
		this.lc()._update();
		assertEQ ( this.mm.walkLog, 'isShow' );
		
		this.mm.clear();
		r_isShow[0] = true;
		this.lc()._update();
		assertEQ ( this.mm.walkLog, 'isShow,_onUpdateBuildTime,updateOpMenuItem' );
	};
	
	this.test__onUpdateBuildTime = function(){
		this.g.setSvrTimeS(5);
		this.lc()._createBuildBlocks();
		this.mm.mock(this.lc().m_buildBlocks.getBlock(0), 'getItem', [null]);
		this.mm.mock(this.lc().m_buildBlocks.getBlock(1), 'getItem', [{state:0}]);
		this.mm.mock(this.lc().m_buildBlocks.getBlock(2), 'getItem', [{state:1,stoptime:10}]);
		this.mm.mock(this.lc().m_buildBlocks.getBlock(2), 'setTime');
		this.mm.mock(Math, 'max', [6]);
		
		this.lc()._onUpdateBuildTime();
		assertEQ ( this.mm.walkLog, 'getItem,getItem,getItem,max,setTime' );
		assertEQ ( this.mm.params['max'], [0, 5] );
		assertEQ ( this.mm.params['setTime'], [TQ.formatTime(0, 6)] );
	};
	
	this.test__getIdFromIdx = function(){
		assertEQ ( this.lc()._getIdFromIdx(1), 2);
	};
	
	this.test__getIdxFromId = function(){
		assertEQ ( this.lc()._getIdxFromId(2), 1);
	};
});

tqCommBuildPanel_t_main = function(suite) {
	suite.addTestCase(TestCaseCommBuildPanel, 'TestCaseCommBuildPanel');
};
