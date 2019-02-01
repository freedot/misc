/*******************************************************************************/
requireEx('./handler/tqFieldHandler.js', [
	{
		start:'//FieldBlock-unittest-start'
		,end:'//FieldBlock-unittest-end'
		,items:['m_g'
			,'B_W'
			,'B_H'
			,'NAME_W'
			,'NAME_H'
			,'ROLE_NAME_BOTTOMSPACE'
			,'NPC_NAME_BOTTOMSPACE'
			,'FIELD_NAME_BOTTOMSPACE'
			,'MYALLIFLAG_W'
			,'MYALLIFLAG_H'
			,'ENEMY_ALLIFLAG_TOPSPACE'
			,'SUB_CITYW'
			,'SUB_CITYH'
			,'SUB_TOPSPACE'
			,'SUB_BOTTOMSPACE'
			,'SUB_LEFTSPACE'
			,'SUB_RIGHTSPACE'
			,'CITY_W'
			,'CITY_H'		
			,'m_this'
			,'m_dom'
			,'m_cityDom'
			,'m_gridId'
			,'m_worldRect'
			,'m_nameDom'
			,'m_fieldRefFlag'
			,'m_mySubCityDoms'
			,'m_myAlliFlagDom'
			,'m_enemyAlliFlagDom'
			,'m_blockRes'
			,'_copyBlockRes'
			,'_createDoms'
			,'_setDomsPos'
			,'_hideAllDoms'
			,'_setFieldBackEmptyImg'
			,'_setFieldBackImg'
			,'_setWorldPos'
			,'_setCityImg'
			,'_setRoleCityImg'
			,'_setNpcCityImg'
			,'_setCityDomsVisible'
			,'_setRoleCityBackImg'
			,'_setSubCitysImg'
			,'_setRoleName'
			,'_setMyAlliFlag'
			,'_setEnemyAlliFlag'
			,'_setNpcCityBackImg'
			,'_setNpcName'
			,'_setCityDomPos'
			,'_setRoleCityNamePos'
			,'_setMyAlliFlagPos'
			,'_setEnemyAlliFlagPos'
			,'_setSubCityDomsPos'
			,'_getRoleCityNamePos'
			,'_setNpcCityNamePos'
			,'_getNamePosByBottomSpace'
			,'_setFieldImg'
			,'_setFieldDomsVisible'
			,'_setFieldNamePos'
			,'_setFieldName'
			,'_setFieldFlag'
			,'_setEmptyFieldImg'
			,'_setEmptyFieldDomsVisible'
			,'_setEmptyFieldNamePos'
			,'_setEmptyFieldName'
			,'_newInvalidFieldRes'
			]
	}
	,{
		start:'//FieldGotoBar-unittest-start'
		,end:'//FieldGotoBar-unittest-end'
		,items:['m_g','m_this','m_items','m_view','_setCallers','_onClickGoHomeBtn','_onClickGotoPosBtn']
	}
	,{
		start:'//FieldSmallMapTip-unittest-start'
		,end:'//FieldSmallMapTip-unittest-end'
		,items:['m_g'
			,'m_this'
			,'m_isShow'
			,'m_smallMap'
			,'m_tip'
			,'_initParams'
			,'_createTipObj'
			,'_setMouseEvents'
			,'_onMouseOver'
			,'_onMouseMove'
			,'_onMouseOut'
			,'_onGetGridPosTip'
			,'_updateTip'
			,'_getGridPos'
			]
	}
	,{
		start:'//FieldMapBlockSelector-unittest-start'
		,end:'//FieldMapBlockSelector-unittest-end'
		,items:['m_g'
			,'m_this'
			,'m_mapPanel'
			,'m_selectBlock'
			,'_initParams'
			,'_createSelectBlock'
			,'_setMouseEvents'
			,'_onMouseMove'
			]
	}
	,{
		start:'//FieldMapView-unittest-start'
		,end:'//FieldMapView-unittest-end'
		,items:['m_g'
			,'m_this'
			,'m_moveFieldsHdr'
			,'m_isFirst'
			,'m_items'
			,'m_gotoBar'
			,'m_smallMapTip'
			,'m_blockSelector'
			,'_regEvents'
			,'_firstOpen'
			,'_createBlocks'
			,'_getBlockPoss'
			,'_onViewportChange'
			,'_onSvrData'
			,'_sendGetFieldsCmd'
			,'_getBlockByGridId'
			,'_onClickBlock'
			,'_onGetBlockTooltip'
			,'_getRoleInfoTip'
			]
	}
	,{
		start:'//MoveFieldBlocksHdr-unittest-start'
		,end:'//MoveFieldBlocksHdr-unittest-end'
		,items:['m_fieldBlocks'
			,'_getNeedShowBlockFlags'
			,'_getOutoffBoundBlocks'
			,'_getExistBlockFlags'
			,'_allocAndResetBlocks'
			,'_adjustViewPort'
			]
	}
]);

TestCaseFieldBlock = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.block = new FieldBlock(this.g, MockDomEx.snew('div'));
		this.lc = this.block.lc;
		
		res_fields = [
			{id:170001}
			,{id:170002}
			,{id:170003}
			,{id:170004}
			,{id:170005}
			,{id:170006,models:[2]}
			];		
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		this.mm.mock(TQ, 'setClass' );
		this.mm.mock(this.lc(), '_createDoms' );
		this.mm.mock(this.lc(), '_setDomsPos' );
		this.mm.mock(this.lc(), '_hideAllDoms' );
		this.block.init(this.g, MockDomEx.snew('div'));
		assert ( this.lc().m_g == this.g);
		assert ( this.lc().m_this == this.block);
		assert ( this.mm.walkLog == 'setClass,_createDoms,_setDomsPos,_hideAllDoms' );
		assertListEQ ( this.mm.params['setClass'], [this.lc().m_dom, 'fieldblock'] );
	};
	
	this.test_clear = function(){
		this.block.clear();
	};
	
	this.test_isInRect = function(){
		var pos = {};
		this.mm.mock(TQ, 'isInRect' );
		this.block.isInRect(pos);
		assert ( this.mm.walkLog == 'isInRect' );
		var rect =  {x:this.lc().m_worldRect.x, y:this.lc().m_worldRect.y+90, w:this.lc().m_worldRect.w, h:this.lc().m_worldRect.h};
		assertEQ ( this.mm.params['isInRect'], [rect, pos] );
	};
	
	this.test_setItem = function(){
		this.mm.mock(this.lc(), '_copyBlockRes' );
		this.mm.mock(this.lc(), '_setFieldBackImg' );
		this.mm.mock(this.lc(), '_setCityImg' );
		
		var p_blockRes = {objType:OBJ_TYPE.FIELD,resid:170001,level:1};
		this.block.setItem(p_blockRes);
		
		assertEQ ( this.mm.walkLog, '_copyBlockRes,_setFieldBackImg,_setCityImg' );
		assertEQ ( this.mm.params['_copyBlockRes'], [p_blockRes] );
	};
	
	this.test_show = function(){
		this.mm.mock(TQ, 'setCSS' );
		this.block.show();
		assertListEQ ( this.mm.params['setCSS'], [this.lc().m_dom, 'visibility', 'visible'] );
	};
	
	this.test_hide = function(){
		this.mm.mock(TQ, 'setCSS' );
		this.block.hide();
		assertListEQ ( this.mm.params['setCSS'], [this.lc().m_dom, 'visibility', 'hidden'] );
	};
	
	this.test_setFieldGridId = function(){
		this.mm.mock(this.lc(), '_setWorldPos' );
		assert ( this.block.getFieldGridId() == -1 );
		this.block.setFieldGridId(1);
		assert ( this.block.getFieldGridId() == 1 );
		assert ( this.mm.walkLog == '_setWorldPos' );
	};
	
	this.test_normal = function(){
		this.block.normal();
	};
	
	this.test_hot = function(){
		this.block.hot();
	};
	
	this.test__copyBlockRes = function(){	
		assert ( this.block.getItem() == null);
		var p_blockRes = {objType:OBJ_TYPE.FIELD,resid:170001,level:1};
		this.lc()._copyBlockRes(p_blockRes);
		assertEQ ( this.block.getItem(), p_blockRes);
		
		p_blockRes = {objType:OBJ_TYPE.FIELD,resid:170001,level:2,isDetail:1};
		this.lc()._copyBlockRes(p_blockRes);
		assertEQ ( this.block.getItem(), p_blockRes);
		
		p_blockRes = {objType:OBJ_TYPE.FIELD,resid:170001,level:3};
		this.lc()._copyBlockRes(p_blockRes);
		assertEQ ( this.block.getItem(), p_blockRes);
	};
	
	this.test__createDoms = function(){
		this.lc()._createDoms();
		assert ( TQ.hasSubDom(this.lc().m_dom, this.lc().m_cityDom) == true );
		assert ( TQ.getClass(this.lc().m_cityDom) == 'cityBuild' );
		assert ( TQ.getCSS(this.lc().m_cityDom, 'zIndex') == 2 );
		
		assert ( TQ.hasSubDom(this.lc().m_dom, this.lc().m_nameDom) == true );
		assert ( TQ.getClass(this.lc().m_nameDom) == 'name' );
		assert ( TQ.getCSS(this.lc().m_nameDom, 'zIndex') == 10 );
		
		assert ( TQ.hasSubDom(this.lc().m_dom, this.lc().m_myAlliFlagDom) == true );
		assert ( TQ.getClass(this.lc().m_myAlliFlagDom) == 'myAlliFlag' );
		assert ( TQ.getCSS(this.lc().m_myAlliFlagDom, 'zIndex') == 10 );
		
		assert ( TQ.hasSubDom(this.lc().m_dom, this.lc().m_enemyAlliFlagDom) == true );
		assert ( TQ.getClass(this.lc().m_enemyAlliFlagDom) == 'enemyAlliFlag' );
		assert ( TQ.getCSS(this.lc().m_enemyAlliFlagDom, 'zIndex') == 10 );
		
		assert ( TQ.hasSubDom(this.lc().m_dom, this.lc().m_mySubCityDoms[0]) == true );
		assert ( TQ.getClass(this.lc().m_mySubCityDoms[0]) == 'subCity' );
		assert ( TQ.getCSS(this.lc().m_mySubCityDoms[0], 'zIndex') == 1 );
		
		assert ( TQ.hasSubDom(this.lc().m_dom, this.lc().m_mySubCityDoms[1]) == true );
		assert ( TQ.getClass(this.lc().m_mySubCityDoms[1]) == 'subCity' );
		assert ( TQ.getCSS(this.lc().m_mySubCityDoms[1], 'zIndex') == 3 );
		
		assert ( TQ.hasSubDom(this.lc().m_dom, this.lc().m_mySubCityDoms[2]) == true );
		assert ( TQ.getClass(this.lc().m_mySubCityDoms[2]) == 'subCity' );
		assert ( TQ.getCSS(this.lc().m_mySubCityDoms[2], 'zIndex') == 3 );
		
		assert ( TQ.hasSubDom(this.lc().m_dom, this.lc().m_mySubCityDoms[3]) == true );
		assert ( TQ.getClass(this.lc().m_mySubCityDoms[3]) == 'subCity' );
		assert ( TQ.getCSS(this.lc().m_mySubCityDoms[3], 'zIndex') == 1 );
	};
	
	this.test__setDomsPos = function(){
		this.mm.mock(this.lc(), '_setCityDomPos' );
		this.mm.mock(this.lc(), '_setRoleCityNamePos' );
		this.mm.mock(this.lc(), '_setMyAlliFlagPos' );
		this.mm.mock(this.lc(), '_setEnemyAlliFlagPos' );
		this.mm.mock(this.lc(), '_setSubCityDomsPos' );
		this.lc()._setDomsPos();
		assert ( this.mm.walkLog == '_setCityDomPos,_setRoleCityNamePos,_setMyAlliFlagPos,_setEnemyAlliFlagPos,_setSubCityDomsPos' );
	};
	
	this.test__setCityDomPos = function(){
		this.mm.mock(TQ, 'setDomPos' );
		this.lc()._setCityDomPos();
		assertListEQ ( this.mm.params['setDomPos'], [this.lc().m_cityDom, 0, 0] );
	};
	
	this.test__setRoleCityNamePos = function(){
		this.mm.mock(this.lc(), '_getRoleCityNamePos', [{x:1, y:2}] );
		this.mm.mock(TQ, 'setDomPos' );
		this.lc()._setRoleCityNamePos();
		assertListEQ ( this.mm.params['setDomPos'], [this.lc().m_nameDom, 1, 2] );
	};
	
	this.test__setMyAlliFlagPos = function(){
		this.mm.mock(this.lc(), '_getRoleCityNamePos', [{x:100, y:200}] );
		this.mm.mock(TQ, 'setDomPos' );
		
		this.lc()._setMyAlliFlagPos();
		assertListEQ ( this.mm.params['setDomPos'], [this.lc().m_myAlliFlagDom, 100 - this.lc().MYALLIFLAG_W, 200 +  this.lc().NAME_H - this.lc().MYALLIFLAG_H] );
	};
	
	this.test__setEnemyAlliFlagPos = function(){
		this.mm.mock(this.lc(), '_getRoleCityNamePos', [{x:100, y:200}] );
		this.mm.mock(TQ, 'setDomPos' );
		this.lc()._setEnemyAlliFlagPos();
		assertListEQ ( this.mm.params['setDomPos'], [this.lc().m_enemyAlliFlagDom, 100 + this.lc().NAME_W, this.lc().ENEMY_ALLIFLAG_TOPSPACE] );
	};
	
	this.test__getRoleCityNamePos = function(){
		var pos = this.lc()._getRoleCityNamePos();
		assert ( pos.x == (this.lc().B_W -this.lc().NAME_W)/2 );
		assert ( pos.y == (this.lc().B_H - this.lc().NAME_H - this.lc().ROLE_NAME_BOTTOMSPACE) );
	};
	
	this.test__setSubCityDomsPos = function(){
		var bak_top = 90;
		this.mm.mock(TQ, 'setDomPos' );
		this.lc()._setSubCityDomsPos();
		assert(this.mm.walkLog == 'setDomPos,setDomPos,setDomPos,setDomPos' );
		assertListEQ(this.mm.params['setDomPos.0'], [this.lc().m_mySubCityDoms[0], this.lc().SUB_LEFTSPACE, this.lc().SUB_TOPSPACE + bak_top]);
		assertListEQ(this.mm.params['setDomPos.1'], [this.lc().m_mySubCityDoms[1], this.lc().SUB_LEFTSPACE, this.lc().B_H - this.lc().SUB_BOTTOMSPACE - this.lc().SUB_CITYH + bak_top]);
		assertListEQ(this.mm.params['setDomPos.2'], [this.lc().m_mySubCityDoms[2], this.lc().B_W - this.lc().SUB_RIGHTSPACE - this.lc().SUB_CITYW, this.lc().B_H - this.lc().SUB_BOTTOMSPACE - this.lc().SUB_CITYH + bak_top]);
		assertListEQ(this.mm.params['setDomPos.3'], [this.lc().m_mySubCityDoms[3], this.lc().B_W - this.lc().SUB_RIGHTSPACE - this.lc().SUB_CITYW, this.lc().SUB_TOPSPACE + bak_top]);
	};
	
	this.test__hideAllDoms = function(){
		TQ.setClass(this.lc().m_fieldRefFlag, 'myFieldFlag');
		this.lc()._hideAllDoms();
		assert ( TQ.getCSS(this.lc().m_cityDom, 'display') == 'none' );
		assert ( TQ.getCSS(this.lc().m_nameDom, 'display') == 'none' );
		assert ( TQ.getCSS(this.lc().m_myAlliFlagDom, 'display') == 'none' );
		assert ( TQ.getCSS(this.lc().m_enemyAlliFlagDom, 'display') == 'none' );
		assert ( TQ.getClass(this.lc().m_fieldRefFlag) == 'noFieldFlag' );
		assert ( TQ.getCSS(this.lc().m_mySubCityDoms[0], 'display') == 'none' );
		assert ( TQ.getCSS(this.lc().m_mySubCityDoms[1], 'display') == 'none' );
		assert ( TQ.getCSS(this.lc().m_mySubCityDoms[2], 'display') == 'none' );
		assert ( TQ.getCSS(this.lc().m_mySubCityDoms[3], 'display') == 'none' );
	};
	
	this.test__setWorldPos = function(){
		var bak_top = 90;
		this.mm.mock(this.lc(), '_setFieldBackEmptyImg');
		this.mm.mock(this.lc(), '_copyBlockRes');
		this.mm.mock(TQ, 'setDomPos');
		this.lc().m_gridId = 202;
		this.lc()._setWorldPos();

		var col = (201%C_OUTFIELD_COL_GRIDS);
		var row = Math.floor(201/C_OUTFIELD_COL_GRIDS);
		assert ( this.lc().m_worldRect.x == col*C_OUTFIELD_BLOCK_W );
		assert ( this.lc().m_worldRect.y == -bak_top );
		assertListEQ ( this.mm.params['_setFieldBackEmptyImg'], [col, row] );	
		assertListEQ ( this.mm.params['_copyBlockRes'], [this.lc()._newInvalidFieldRes(202)] );
		assertListEQ ( this.mm.params['setDomPos'], [this.lc().m_dom, this.lc().m_worldRect.x, this.lc().m_worldRect.y] );	
	};
	
	this.test__newInvalidFieldRes = function(){
		assertEQ ( this.lc()._newInvalidFieldRes(1), {gridId:1, objType:OBJ_TYPE.INVALID, resid:170005, modelId:17000501});
	};
	
	this.test__setFieldBackEmptyImg = function(){
		this.mm.mock(this.lc(), '_hideAllDoms');
		this.lc()._setFieldBackEmptyImg(0, 0);
		assertEQ ( this.mm.walkLog, '_hideAllDoms' );
		assertEQ ( isInclude(IMG.getBKImage(this.lc().m_dom), 'fields/block/17000501.jpg'), true );
	};
	
	this.test__setFieldBackImg = function(){
		this.lc().m_blockRes = {objType:OBJ_TYPE.FIELD,resid:170001,modelId:1,level:1};
		this.lc()._setFieldBackImg();
		assert ( isInclude(IMG.getBKImage(this.lc().m_dom), 'fields/block/1.jpg') == true );
		
		this.lc().m_blockRes = {objType:OBJ_TYPE.ROLE,resid:170001,modelId:1,level:1};
		this.lc()._setFieldBackImg();
		assert ( isInclude(IMG.getBKImage(this.lc().m_dom), 'fields/block/2.jpg') == true );
	};
	
	this.test__setCityImg = function(){
		this.lc().m_blockRes = {objType:OBJ_TYPE.ROLE};
		
		this.mm.mock(this.lc(), '_setRoleCityImg' );
		this.mm.mock(this.lc(), '_setNpcCityImg' );
		this.mm.mock(this.lc(), '_setFieldImg' );
		this.mm.mock(this.lc(), '_setEmptyFieldImg' );
		this.mm.mock(this.lc(), '_hideAllDoms' );
		
		this.lc()._setCityImg();
		assert ( this.mm.walkLog == '_setRoleCityImg' );
		
		this.mm.clear();
		this.lc().m_blockRes = {objType:OBJ_TYPE.NPCFIELD};
		this.lc()._setCityImg();
		assert ( this.mm.walkLog == '_setNpcCityImg' );
		
		this.mm.clear();
		this.lc().m_blockRes = {objType:OBJ_TYPE.FIELD};
		this.lc()._setCityImg();
		assert ( this.mm.walkLog == '_setFieldImg' );
		
		this.mm.clear();
		this.lc().m_blockRes = {objType:OBJ_TYPE.NONE};
		this.lc()._setCityImg();
		assert ( this.mm.walkLog == '_setEmptyFieldImg' );
		
		this.mm.clear();
		this.lc().m_blockRes = {objType:-1};
		this.lc()._setCityImg();
		assert ( this.mm.walkLog == '_hideAllDoms' );
	};
	
	this.test__setRoleCityImg = function(){
		this.mm.mock(this.lc(), '_setCityDomsVisible' );
		this.mm.mock(this.lc(), '_setRoleCityNamePos' );
		this.mm.mock(this.lc(), '_setRoleCityBackImg' );
		this.mm.mock(this.lc(), '_setSubCitysImg' );
		this.mm.mock(this.lc(), '_setRoleName' );
		this.mm.mock(this.lc(), '_setMyAlliFlag' );
		this.mm.mock(this.lc(), '_setEnemyAlliFlag' );
		
		this.lc()._setRoleCityImg();
		assert ( this.mm.walkLog == '_setCityDomsVisible,_setRoleCityNamePos,_setRoleCityBackImg,_setSubCitysImg,_setRoleName,_setMyAlliFlag,_setEnemyAlliFlag' );
	};
	
	this.test__setNpcCityImg = function(){
		this.mm.mock(this.lc(), '_setCityDomsVisible' );
		this.mm.mock(this.lc(), '_setNpcCityNamePos' );
		this.mm.mock(this.lc(), '_setNpcCityBackImg' );
		this.mm.mock(this.lc(), '_setNpcName' );
		
		this.lc()._setNpcCityImg();
		assert ( this.mm.walkLog == '_setCityDomsVisible,_setNpcCityNamePos,_setNpcCityBackImg,_setNpcName' );
	};
	
	this.test__setCityDomsVisible = function(){
		this.mm.mock(this.lc(), '_hideAllDoms' );
		this.mm.mock(TQ, 'setCSS' );
		this.lc()._setCityDomsVisible();
		assert ( this.mm.walkLog == '_hideAllDoms,setCSS,setCSS' );
		assertListEQ ( this.mm.params['setCSS.0'], [this.lc().m_cityDom, 'display', 'block'] );
		assertListEQ ( this.mm.params['setCSS.1'], [this.lc().m_nameDom, 'display', 'block'] );
	};
	
	this.test__setNpcCityNamePos = function(){
		this.mm.mock(this.lc(), '_getNamePosByBottomSpace', [{x:1,y:2}]);
		this.mm.mock(TQ, 'setDomPos');
		
		this.lc()._setNpcCityNamePos();
		assert ( this.mm.walkLog == '_getNamePosByBottomSpace,setDomPos' );
		assertListEQ ( this.mm.params['_getNamePosByBottomSpace'], [this.lc().NPC_NAME_BOTTOMSPACE] );
		assertListEQ ( this.mm.params['setDomPos'], [this.lc().m_nameDom, 1, 2] );
	};
	
	this.test__setNpcCityBackImg = function(){
		this.lc().m_blockRes = {objType:OBJ_TYPE.NPCFIELD, modelId:1};
		this.lc()._setNpcCityBackImg();
		assert ( isInclude( IMG.getBKImage(this.lc().m_cityDom), 'fields/npccity/1.gif') == true );
	};
	
	this.test__setNpcName = function(){
		res_npcfields = [{id:170010, name:'npc1'}];
		this.lc().m_blockRes = {objType:OBJ_TYPE.NPCFIELD, resid:170010};
		this.lc()._setNpcName();
		assert ( TQ.getTextEx(this.lc().m_nameDom) == 'npc1' );
	};	
	
	this.test__setRoleCityBackImg = function(){
		this.lc().m_blockRes = {objType:OBJ_TYPE.ROLE,resid:0,modelId:1,level:1,vip:0};
		this.lc()._setRoleCityBackImg();
		assert ( isInclude( IMG.getBKImage(this.lc().m_cityDom), 'fields/rolecity/1.gif') == true );
		
		this.lc().m_blockRes = {objType:OBJ_TYPE.ROLE,resid:0,modelId:1,level:1,vip:2};
		this.lc()._setRoleCityBackImg();
		assert ( isInclude( IMG.getBKImage(this.lc().m_cityDom), 'fields/rolecity/vip/1.png') == true );
		
		this.lc().m_blockRes = {objType:OBJ_TYPE.ROLE,resid:0,modelId:1,level:1,vip:3};
		this.lc()._setRoleCityBackImg();
		assert ( isInclude( IMG.getBKImage(this.lc().m_cityDom), 'fields/rolecity/vip/2.png') == true );
		
		this.lc().m_blockRes = {objType:OBJ_TYPE.ROLE,resid:0,modelId:1,level:1,vip:3};
		this.lc()._setRoleCityBackImg();
		assert ( isInclude( IMG.getBKImage(this.lc().m_cityDom), 'fields/rolecity/vip/2.png') == true );
		
		this.lc().m_blockRes = {objType:OBJ_TYPE.ROLE,resid:0,modelId:1,level:1,vip:11};
		this.lc()._setRoleCityBackImg();
		assert ( isInclude( IMG.getBKImage(this.lc().m_cityDom), 'fields/rolecity/vip/6.png') == true );
		
		this.lc().m_blockRes = {objType:OBJ_TYPE.ROLE,resid:0,modelId:1,level:1,vip:12};
		this.lc()._setRoleCityBackImg();
		assert ( isInclude( IMG.getBKImage(this.lc().m_cityDom), 'fields/rolecity/vip/6.png') == true );
	};
	
	this.test__setSubCitysImg = function(){
		this.lc().m_blockRes = {objType:OBJ_TYPE.ROLE,subCitys:[2,3]};
		
		TQ.setCSS(this.lc().m_mySubCityDoms[0], 'display', 'none');
		TQ.setCSS(this.lc().m_mySubCityDoms[1], 'display', 'none');
		
		this.lc()._setSubCitysImg();
		assert ( isInclude( IMG.getBKImage(this.lc().m_mySubCityDoms[0]), 'fields/rolecity/170401.gif') == true );
		assert ( isInclude( IMG.getBKImage(this.lc().m_mySubCityDoms[1]), 'fields/rolecity/170402.gif') == true );
		assert ( TQ.getCSS(this.lc().m_mySubCityDoms[0], 'display') == 'block' );
		assert ( TQ.getCSS(this.lc().m_mySubCityDoms[1], 'display') == 'block' );
	};
	
	this.test__setRoleName = function(){
		this.lc().m_blockRes = {objType:OBJ_TYPE.ROLE,roleName:'role'};
		this.lc()._setRoleName();
		assert ( TQ.getTextEx(this.lc().m_nameDom) == 'role' );
	};
	
	this.test__setMyAlliFlag = function(){
		this.lc().m_blockRes = {objType:OBJ_TYPE.ROLE,myAlliFlag:'my'};
		this.lc()._setMyAlliFlag();
		assert ( TQ.getCSS(this.lc().m_myAlliFlagDom, 'display') == 'block' );
		assert ( TQ.getTextEx(this.lc().m_myAlliFlagDom) == 'my' );
	};
	
	this.test__setEnemyAlliFlag = function(){
		this.lc().m_blockRes = {objType:OBJ_TYPE.ROLE,enemyAlliFlag:'en'};
		this.lc()._setEnemyAlliFlag();
		assert ( TQ.getCSS(this.lc().m_enemyAlliFlagDom, 'display') == 'block' );
		assert ( TQ.getTextEx(this.lc().m_enemyAlliFlagDom) == 'en' );
	};
	
	this.test__setFieldImg = function(){
		this.mm.mock(this.lc(), '_setFieldDomsVisible' );
		this.mm.mock(this.lc(), '_setFieldNamePos' );
		this.mm.mock(this.lc(), '_setFieldName' );
		this.mm.mock(this.lc(), '_setFieldFlag' );
		this.lc()._setFieldImg();
		assert ( this.mm.walkLog == '_setFieldDomsVisible,_setFieldNamePos,_setFieldName,_setFieldFlag' );
	};
	
	this.test__setFieldName = function(){
		this.lc().m_blockRes = {objType:OBJ_TYPE.FIELD,resid:170001,modelId:1,level:1};
		this.lc()._setFieldName();
		assert ( TQ.getTextEx(this.lc().m_nameDom) == TQ.format(rstr.comm.flevelsomething, 1, res_fields[0].name) );
	};	
	
	this.test__setFieldDomsVisible = function(){
		this.mm.mock(this.lc(), '_hideAllDoms' );
		this.mm.mock(TQ, 'setCSS' );
		this.lc()._setFieldDomsVisible();
		assert ( this.mm.walkLog == '_hideAllDoms,setCSS' );
		assertListEQ ( this.mm.params['setCSS'], [this.lc().m_nameDom, 'display', 'block'] );
	};
	
	this.test__setFieldNamePos = function(){
		this.mm.mock(this.lc(), '_getNamePosByBottomSpace', [{x:1,y:2}]);
		this.mm.mock(TQ, 'setDomPos');
		
		this.lc()._setFieldNamePos();
		assert ( this.mm.walkLog == '_getNamePosByBottomSpace,setDomPos' );
		assertListEQ ( this.mm.params['_getNamePosByBottomSpace'], [this.lc().FIELD_NAME_BOTTOMSPACE] );
		assertListEQ ( this.mm.params['setDomPos'], [this.lc().m_nameDom, 1, 2] );	
	};
	
	this.test__setFieldFlag = function(){
		TQ.setClass(this.lc().m_fieldRefFlag, 'myFieldFlag' );
		this.lc().m_blockRes = {objType:OBJ_TYPE.FIELD,resid:170001,modelId:1,level:1};
		this.lc()._setFieldFlag();
		assertEQ ( TQ.getClass(this.lc().m_fieldRefFlag), 'noFieldFlag' );
		
		this.g.getImgr().getRoleRes().uid = 1001;
		this.g.getImgr().getRoleRes().alliance = {uid:1};
		this.g.getImgr().getRoleRes().name = 'my';
		this.lc().m_blockRes = {objType:OBJ_TYPE.FIELD, roleId:1001, roleName:'my', alliance:{uid:1}, resid:170001,modelId:1,level:1};
		this.lc()._setFieldFlag();
		assertEQ ( TQ.getClass(this.lc().m_fieldRefFlag), 'myFieldFlag' );
		
		this.lc().m_blockRes = {objType:OBJ_TYPE.FIELD, roleId:1002, roleName:'other', alliance:{uid:1}, resid:170001,modelId:1,level:1};
		this.lc()._setFieldFlag();
		assertEQ ( TQ.getClass(this.lc().m_fieldRefFlag), 'alliFieldFlag' );
		
		this.lc().m_blockRes = {objType:OBJ_TYPE.FIELD, roleId:1002, roleName:'other', alliance:{uid:2}, resid:170001,modelId:1,level:1};
		this.lc()._setFieldFlag();
		assertEQ ( TQ.getClass(this.lc().m_fieldRefFlag), 'noalliFieldFlag' );
		
		//m_fieldRefFlag = TQ.createDom('div');
		//TQ.append(m_dom, m_fieldRefFlag);
		//TQ.setClass(m_fieldRefFlag, 'noFieldFlag');
		//TQ.setCSS(m_fieldRefFlag, 'zIndex', 11);
		
		// myFieldFlag alliFieldFlag noalliFieldFlag
	};
	
	this.test__setEmptyFieldImg = function(){
		this.mm.mock(this.lc(), '_setEmptyFieldDomsVisible' );
		this.mm.mock(this.lc(), '_setEmptyFieldNamePos' );
		this.mm.mock(this.lc(), '_setEmptyFieldName' );
		this.lc()._setEmptyFieldImg();
		assertEQ ( this.mm.walkLog, '_setEmptyFieldDomsVisible,_setEmptyFieldNamePos,_setEmptyFieldName' );
	};
	
	this.test__setEmptyFieldDomsVisible = function(){
		this.mm.mock(this.lc(), '_hideAllDoms' );
		this.mm.mock(TQ, 'setCSS' );
		this.lc()._setEmptyFieldDomsVisible();
		assertEQ ( this.mm.walkLog, '_hideAllDoms,setCSS' );
		assertEQ ( this.mm.params['setCSS'], [this.lc().m_nameDom, 'display', 'block'] );
	};
	
	this.test__setEmptyFieldNamePos = function(){
		this.mm.mock(this.lc(), '_getNamePosByBottomSpace', [{x:1,y:2}]);
		this.mm.mock(TQ, 'setDomPos');
		
		this.lc()._setEmptyFieldNamePos();
		assertEQ ( this.mm.walkLog, '_getNamePosByBottomSpace,setDomPos' );
		assertEQ ( this.mm.params['_getNamePosByBottomSpace'], [this.lc().FIELD_NAME_BOTTOMSPACE] );
		assertEQ ( this.mm.params['setDomPos'], [this.lc().m_nameDom, 1, 2] );	
	};
	
	this.test__setEmptyFieldName = function(){
		this.lc()._setEmptyFieldName();
		assertEQ ( TQ.getTextEx(this.lc().m_nameDom), rstr.field.lbl.emptyField );
	};
	
	this.test__getNamePosByBottomSpace = function(){
		var pos = this.lc()._getNamePosByBottomSpace(20);
		assert ( pos.x == (this.lc().B_W - this.lc().NAME_W)/2 );
		assert ( pos.y == this.lc().B_H - this.lc().NAME_H - 20 );
	};
});

TestCaseMoveFieldBlocksHdr = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		UIM.forceRegPanel('smallmap', SmallMapPanel.snew(this.g, new MockDom('div')));
		var view = FieldMapView.snew(this.g, UIM.getPanel('main').getItems());
		
		this.hdr = MoveFieldBlocksHdr.snew(view.lc().m_items.fieldBlocks);
		this.lc = this.hdr.lc;
		
		res_fields = [
			{id:170001}
			,{id:170002}
			,{id:170003}
			,{id:170004}
			,{id:170005}
			,{id:170006,models:[2]}
			];		
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		var g_fieldBlocks = {};
		this.hdr.init(g_fieldBlocks);
		assert ( this.lc().m_fieldBlocks == g_fieldBlocks );
	};
	
	this.test_moveBlocks = function(){
		var g_viewport = {};
		var g_getNeedShowBlockFlagsRt = {};
		var g_getOutoffBoundBlocksRt = [];
		var g_getExistBlockFlagsRt = {};
			
		this.mm.mock(this.lc(), '_getNeedShowBlockFlags', [g_getNeedShowBlockFlagsRt] );
		this.mm.mock(this.lc(), '_getOutoffBoundBlocks', [g_getOutoffBoundBlocksRt] );
		this.mm.mock(this.lc(), '_getExistBlockFlags', [g_getExistBlockFlagsRt] );
		this.mm.mock(this.lc(), '_allocAndResetBlocks' );
			
		this.hdr.moveBlocks(g_viewport);
		assert ( this.mm.walkLog == '_getNeedShowBlockFlags,_getOutoffBoundBlocks,_getExistBlockFlags,_allocAndResetBlocks' );
		assertListEQ ( this.mm.params['_getNeedShowBlockFlags'], [g_viewport] );
		assertListEQ ( this.mm.params['_getOutoffBoundBlocks'], [g_getNeedShowBlockFlagsRt] );
		assertListEQ ( this.mm.params['_getExistBlockFlags'], [g_getNeedShowBlockFlagsRt] );
		assertListEQ ( this.mm.params['_allocAndResetBlocks'], [g_getNeedShowBlockFlagsRt,g_getOutoffBoundBlocksRt,g_getExistBlockFlagsRt] );
	};
	
	this.test__getNeedShowBlockFlags = function(){
		var r_viewport = {x:200, y:100, w:400, h:300};
		this.mm.mock(this.lc(), '_adjustViewPort', [r_viewport] );
		var x0 = Math.floor(200 / C_OUTFIELD_BLOCK_W);
		var x1 = Math.floor((200 + 400) / C_OUTFIELD_BLOCK_W);
		
		var y0 = Math.floor(100 / C_OUTFIELD_BLOCK_H);
		var y1 = Math.floor((100 + 300) / C_OUTFIELD_BLOCK_H);
		
		assert ( x1 - x0 + 1 == 2 )
		assert ( y1 - y0 + 1 == 3 )
		
		var p_viewport = {x:1, y:2, w:400, h:300};
		var needShowBlockFlags = this.lc()._getNeedShowBlockFlags(p_viewport);
		assertEQ ( this.mm.params['_adjustViewPort'], [p_viewport] );
		assert ( needShowBlockFlags[y0*C_OUTFIELD_ROW_GRIDS + x0 + 1] == true );
		assert ( needShowBlockFlags[y0*C_OUTFIELD_ROW_GRIDS + x0 + 1 + 1] == true );
		assert ( needShowBlockFlags[(y0+1)*C_OUTFIELD_ROW_GRIDS + x0 + 1] == true );
		assert ( needShowBlockFlags[(y0+1)*C_OUTFIELD_ROW_GRIDS + x0 + 1 + 1] == true );
		assert ( needShowBlockFlags[(y0+2)*C_OUTFIELD_ROW_GRIDS + x0 + 1] == true );
		assert ( needShowBlockFlags[(y0+2)*C_OUTFIELD_ROW_GRIDS + x0 + 1 + 1] == true );
		assert ( needShowBlockFlags[(y0+2)*C_OUTFIELD_ROW_GRIDS + x0 + 2 + 1] == null );
	};
	
	this.test__adjustViewPort = function(){
		var viewport = {x:-10, y:-20, w:100, h:200};
		assertEQ ( this.lc()._adjustViewPort(viewport), {x:0, y:0, w:100, h:200} );
	};
	
	this.test__getOutoffBoundBlocks = function(){
		var needShowBlockFlags = {'0':true,'1':true,'2':true,'3':true};
		
		for (var i=0; i<this.lc().m_fieldBlocks.getCount(); ++i ) {
			this.lc().m_fieldBlocks.getBlock(i).setFieldGridId(i);
		}
		
		var outoffBoundBlocks = this.lc()._getOutoffBoundBlocks(needShowBlockFlags);
		assert ( outoffBoundBlocks.length == this.lc().m_fieldBlocks.getCount() - 4 );
		assert ( outoffBoundBlocks[0] == this.lc().m_fieldBlocks.getBlock(4) );
		assert ( outoffBoundBlocks[outoffBoundBlocks.length-1] == this.lc().m_fieldBlocks.getBlock(this.lc().m_fieldBlocks.getCount()-1) );
	};
	
	this.test__getExistBlockFlags = function(){
		var needShowBlockFlags = {'0':true,'1':true,'2':true,'3':true};
		
		for (var i=0; i<this.lc().m_fieldBlocks.getCount(); ++i ) {
			this.lc().m_fieldBlocks.getBlock(i).setFieldGridId(i);
		}
		
		var existBlockFlags = this.lc()._getExistBlockFlags(needShowBlockFlags);
		assert ( existBlockFlags[0] == true );
		assert ( existBlockFlags[1] == true );
		assert ( existBlockFlags[2] == true );
		assert ( existBlockFlags[3] == true );
		assert ( existBlockFlags[4] == null );
	};
	
	this.test__allocAndResetBlocks = function(){
		var needShowBlockFlags = {'1':true,'2':true,'3':true,'4':true};
		var outoffBoundBlocks = [this.lc().m_fieldBlocks.getBlock(4)];
		var hasExistBlockFlags = {'1':true,'2':true,'3':true};
		
		this.mm.mock(this.lc().m_fieldBlocks.getBlock(4), 'show' );
		
		assert ( this.lc().m_fieldBlocks.getBlock(4).getFieldGridId() == -1 );
		this.lc()._allocAndResetBlocks(needShowBlockFlags, outoffBoundBlocks,  hasExistBlockFlags);
		assert ( outoffBoundBlocks.length == 0 );
		assert ( this.lc().m_fieldBlocks.getBlock(4).getFieldGridId() == 4 );
		assert ( this.mm.walkLog, 'show' );
	};
});

TestCaseFieldGotoBar = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.view = FieldMapView.snew(this.g, UIM.getPanel('main').getItems());
		this.bar = FieldGotoBar.snew(this.g, UIM.getPanel('main').getItems(), this.view);
		this.lc = this.bar.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		this.mm.mock(this.lc(), '_setCallers');
		
		this.bar.init(this.g, UIM.getPanel('main').getItems(), this.view);
		assertEQ ( this.lc().m_g, this.g );
		assertEQ ( this.lc().m_this, this.bar );
		assertEQ ( this.lc().m_items, UIM.getPanel('main').getItems() );
		assertEQ ( this.lc().m_view, this.view );
		assertEQ ( this.mm.walkLog, '_setCallers' );
	};
	
	this.test_show = function(){
		this.mm.mock(TQ, 'setCSS');
		this.bar.show();
		assertEQ ( this.mm.params['setCSS'], [this.lc().m_items.outFieldToolBar, 'visibility', 'visible'] );
	};
	
	this.test_hide = function(){
		this.mm.mock(TQ, 'setCSS');
		this.bar.hide();
		assertEQ ( this.mm.params['setCSS'], [this.lc().m_items.outFieldToolBar, 'visibility', 'hidden'] );
	};
	
	this.test_setViewport = function(){
		var p_viewPort = {x:1000, y:2000, w:1440, h:900};
		
		this.mm.mock(this.lc().m_items.ifieldX, 'setVal');
		this.mm.mock(this.lc().m_items.ifieldY, 'setVal');
		this.bar.setViewport(p_viewPort);
		var x = Math.floor((1000 + 1440/2)/C_OUTFIELD_BLOCK_W);
		var y = Math.floor((2000 + 900/2)/C_OUTFIELD_BLOCK_H);
		assertEQ ( this.mm.walkLog, 'setVal,setVal' );
		assertEQ ( this.mm.params['setVal.0'], [x] );
		assertEQ ( this.mm.params['setVal.1'], [y] );
	};
	
	this.test__setCallers = function(){
		this.mm.mock(this.lc().m_items.goHomeBtn, 'setCaller');
		this.mm.mock(this.lc().m_items.gotoPosBtn, 'setCaller');
		this.lc()._setCallers();
		assertEQ ( this.mm.walkLog, 'setCaller,setCaller' );
		assertEQ ( this.mm.params['setCaller.0'], [{self:this.bar, caller:this.lc()._onClickGoHomeBtn}] );
		assertEQ ( this.mm.params['setCaller.1'], [{self:this.bar, caller:this.lc()._onClickGotoPosBtn}] );
	};
	
	this.test__onClickGoHomeBtn = function(){
		this.mm.mock(this.lc().m_view, 'goHome');
		this.lc()._onClickGoHomeBtn();
		assertEQ ( this.mm.walkLog, 'goHome' );
	};
	
	this.test__onClickGotoPosBtn = function(){
		this.mm.mock(this.lc().m_view, 'gotoPos');
		this.mm.mock(this.lc().m_items.ifieldX, 'getVal', [1]);
		this.mm.mock(this.lc().m_items.ifieldY, 'getVal', [2]);
		this.lc()._onClickGotoPosBtn();
		assertEQ ( this.mm.params['gotoPos'], [{x:1, y:2}] );
	};
	
	this.test_coodLimit = function(){
		this.lc().m_items.ifieldX.setVal(-1);
		assertEQ ( this.lc().m_items.ifieldX.getVal(), 0 );
		this.lc().m_items.ifieldX.setVal(400);
		assertEQ ( this.lc().m_items.ifieldX.getVal(), 399 );
		
		this.lc().m_items.ifieldY.setVal(-1);
		assertEQ ( this.lc().m_items.ifieldY.getVal(), 0 );
		this.lc().m_items.ifieldY.setVal(400);
		assertEQ ( this.lc().m_items.ifieldY.getVal(), 399 );
	};
});

TestCaseFieldSmallMapTip = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.tip = FieldSmallMapTip.snew(this.g, UIM.getPanel('smallmap'));
		this.lc = this.tip.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		this.mm.mock(this.lc(), '_initParams');
		this.mm.mock(this.lc(), '_createTipObj');
		this.mm.mock(this.lc(), '_setMouseEvents');
		this.tip.init(this.g, UIM.getPanel('smallmap'));
		assertEQ ( this.mm.walkLog, '_initParams,_createTipObj,_setMouseEvents' );
		assertEQ ( this.mm.params['_initParams'], [this.tip, this.g, UIM.getPanel('smallmap')] );
	};
	
	this.test_show = function(){
		this.lc().m_isShow = false;
		this.tip.show();
		assertEQ ( this.lc().m_isShow, true );
	};
	
	this.test_hide = function(){
		this.tip.show();
		this.mm.mock(this.lc().m_tip, 'hide');
		this.tip.hide();
		assertEQ ( this.lc().m_isShow, false );
		assertEQ ( this.mm.walkLog, 'hide');
	};
	
	this.test__initParams = function(){
		this.lc()._initParams(this.tip, this.g, UIM.getPanel('smallmap'));
		assertEQ ( this.lc().m_this, this.tip );
		assertEQ ( this.lc().m_g, this.g );
		assertEQ ( this.lc().m_smallMap, UIM.getPanel('smallmap'))
	};
	
	this.test__createTipObj = function(){
		var r_tip = TTIP.getTipById(TTIP.addTip(MockDomEx.snew(), 'no'));
		this.mm.mock(TTIP, 'addTip', [10]);
		this.mm.mock(TTIP, 'getTipById', [r_tip]);
		this.mm.mock(r_tip, 'setFlag');
		this.mm.mock(r_tip, 'setCaller');
		
		this.lc()._createTipObj();
		assertEQ ( this.mm.walkLog, 'addTip,getTipById,setFlag,setCaller' );
		assertEQ ( this.mm.params['addTip'], [UIM.getPanel('smallmap').getMapEventDom(), 'no'] );
		assertEQ ( this.mm.params['getTipById'], [10] );
		assertEQ ( this.mm.params['setFlag'], [1] );
		assertEQ ( this.mm.params['setCaller'], [{self:this.tip, caller:this.lc()._onGetGridPosTip}] );
	};
	
	this.test__setMouseEvents = function(){
		this.mm.mock ( TQ, 'addEvent' );
		this.lc()._setMouseEvents();
		assertEQ ( this.mm.walkLog, 'addEvent,addEvent,addEvent' );
		assertEQ ( this.mm.params['addEvent.0'], [UIM.getPanel('smallmap').getMapEventDom(), 'mouseover', this.lc()._onMouseOver] );
		assertEQ ( this.mm.params['addEvent.1'], [UIM.getPanel('smallmap').getMapEventDom(), 'mousemove', this.lc()._onMouseMove] );
		assertEQ ( this.mm.params['addEvent.2'], [UIM.getPanel('smallmap').getMapEventDom(), 'mouseout', this.lc()._onMouseOut] );
	};
	
	this.test__onMouseOver = function(){
		this.mm.mock(this.lc(), '_updateTip');
		this.lc().m_isShow = false;
		this.lc()._onMouseOver({name:'event'});
		assertEQ ( this.mm.walkLog, '' );
		
		this.lc().m_isShow = true;
		this.lc()._onMouseOver({name:'event'});
		assertEQ ( this.mm.walkLog, '_updateTip' );
		assertEQ ( this.mm.params['_updateTip'], [{name:'event'}] );
	};
	
	this.test__onMouseMove = function(){
		this.mm.mock(this.lc(), '_updateTip');
		this.lc().m_isShow = false;
		this.lc()._onMouseMove({name:'event'});
		assertEQ ( this.mm.walkLog, '' );
		
		this.lc().m_isShow = true;
		this.lc()._onMouseMove({name:'event'});
		assertEQ ( this.mm.walkLog, '_updateTip' );
		assertEQ ( this.mm.params['_updateTip'], [{name:'event'}] );
	};
	
	this.test__onMouseOut = function(){
		this.mm.mock(this.lc().m_tip, 'hide');
		this.lc().m_isShow = false;
		this.lc()._onMouseOut();
		assertEQ ( this.mm.walkLog, '' );
		
		this.lc().m_isShow = true;
		this.lc()._onMouseOut();
		assertEQ ( this.mm.walkLog, 'hide' );
	};
	
	this.test__onGetGridPosTip = function(){
		assertEQ ( this.lc()._onGetGridPosTip({x:1, y:2}), '1,2' );
	};
	
	this.test__updateTip = function(){	
		this.mm.mock(this.lc(), '_getGridPos', [{x:1, y:2}]);
		this.mm.mock(this.lc().m_tip, 'setData');
		this.mm.mock(this.lc().m_tip, 'reset');
		this.mm.mock(TQ, 'mouseCoords', [{x:10, y:20}]);
		this.mm.mock(this.lc().m_tip, 'show');
		
		var p_event = {name:'event'};
		this.lc()._updateTip(p_event);
		assertEQ ( this.mm.walkLog, '_getGridPos,setData,reset,mouseCoords,show' );
		assertEQ ( this.mm.params['_getGridPos'], [p_event] );
		assertEQ ( this.mm.params['setData'], [{x:1, y:2}] );
		assertEQ ( this.mm.params['mouseCoords'], [p_event] );
		assertEQ ( this.mm.params['show'], [{x:10, y:20}] );
	};
	
	this.test__getGridPos = function(){
		this.mm.mock(TQ, 'mouseRelativeCoords', [{x:1, y:2}]);
		this.mm.mock(UIM.getPanel('smallmap'), 'convertSTLPos', [{x:1000, y:2000}]);
		
		var p_event = {name:'event'};
		assertEQ ( this.lc()._getGridPos(p_event), {x:Math.floor(1000/C_OUTFIELD_BLOCK_W), y:Math.floor(2000/C_OUTFIELD_BLOCK_H)} );
		assertEQ ( this.mm.params['mouseRelativeCoords'], [UIM.getPanel('smallmap').getMapEventDom(), p_event] );
		assertEQ ( this.mm.params['convertSTLPos'], [{x:1, y:2}] );
	};
});

TestCaseFieldMapBlockSelector = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.selector = FieldMapBlockSelector.snew(this.g, UIM.getPanel('field'));
		this.lc = this.selector.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		this.mm.mock(this.lc(), '_initParams');
		this.mm.mock(this.lc(), '_createSelectBlock');
		this.mm.mock(this.lc(), '_setMouseEvents');
		this.selector.init(this.g, UIM.getPanel('field'));
		assertEQ ( this.mm.walkLog, '_initParams,_createSelectBlock,_setMouseEvents' );
		assertEQ ( this.mm.params['_initParams'], [this.selector, this.g, UIM.getPanel('field')] );
	};
	
	this.test__initParams = function(){
		this.lc()._initParams(this.selector, this.g, UIM.getPanel('field'));
		assertEQ ( this.lc().m_this, this.selector );
		assertEQ ( this.lc().m_g, this.g );
		assertEQ ( this.lc().m_mapPanel, UIM.getPanel('field'))	
	};
	
	this.test__createSelectBlock = function(){
		var r_dom = MockDomEx.snew('div');
		this.mm.mock(TQ, 'createDom', [r_dom]);
		this.mm.mock(TQ, 'append');
		this.mm.mock(TQ, 'setClass');
		this.mm.mock(TQ, 'setDomSize');
		this.lc()._createSelectBlock();
		assertEQ ( this.lc().m_selectBlock, r_dom);
		assertEQ ( this.mm.walkLog, 'createDom,append,setClass,setDomSize');
		assertEQ ( this.mm.params['createDom'], ['div'] );
		assertEQ ( this.mm.params['append'], [UIM.getPanel('field').getItems().mapscene, r_dom] );
		assertEQ ( this.mm.params['setClass'], [r_dom, 'fieldselectblock'] );
		assertEQ ( this.mm.params['setDomSize'], [r_dom, C_OUTFIELD_BLOCK_W, C_OUTFIELD_BLOCK_H] );
	};
	
	this.test__setMouseEvents = function(){
		this.mm.mock(TQ, 'addEvent');
		this.lc()._setMouseEvents();
		assertEQ ( this.mm.params['addEvent'], [UIM.getPanel('field').getItems().mousemap, 'mousemove', this.lc()._onMouseMove] );
	};
	
	this.test__onMouseMove = function(){
		this.mm.mock(TQ, 'mouseRelativeCoords', [{x:300, y:400}] );
		this.mm.mock(this.lc().m_mapPanel, 'getViewport', [{x:1000, y:2000}] );
		this.mm.mock(TQ, 'setDomPos' );
		
		var p_event = {name:'event'};
		this.lc()._onMouseMove(p_event);
		var x = Math.floor(1300/C_OUTFIELD_BLOCK_W)*C_OUTFIELD_BLOCK_W;
		var y = Math.floor(2400/C_OUTFIELD_BLOCK_H)*C_OUTFIELD_BLOCK_H;
		assertEQ ( this.mm.params['setDomPos'], [this.lc().m_selectBlock, x, y] );
		assertEQ ( this.mm.params['mouseRelativeCoords'], [UIM.getPanel('field').getItems().mousemap, p_event] );
	};
})

TestCaseFieldMapView = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.view = FieldMapView.snew(this.g, UIM.getPanel('main').getItems());
		this.lc = this.view.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		this.mm.mock(this.view.Super, 'init');
		this.mm.mock(this.view, 'create');
		this.mm.mock(this.lc(), '_regEvents');
		this.mm.mock(this.lc(), '_createBlocks');
		this.mm.mock(FieldGotoBar, 'snew', [{name:'gotoBar'}]);
		this.mm.mock(FieldSmallMapTip, 'snew', [{name:'mapTip'}]);
		
		this.view.init(this.g, UIM.getPanel('main').getItems());
		assert ( this.mm.walkLog == 'init,create,snew,snew,_regEvents,_createBlocks' );
		assertListEQ ( this.mm.params['snew.0'], [this.g, UIM.getPanel('main').getItems(), this.view] );
		assertListEQ ( this.mm.params['snew.1'], [this.g, UIM.getPanel('smallmap')] );
		assertListEQ ( this.mm.params['init'], [this.g, UIM.getPanel('main').getItems().map] );
		assert ( this.lc().m_g == this.g );
		assert ( this.lc().m_this == this.view );
		assert ( this.lc().m_items == this.view.Super.getItems() );
		assertEQ ( this.lc().m_gotoBar, {name:'gotoBar'} );
		assertEQ ( this.lc().m_smallMapTip, {name:'mapTip'} );
		assertEQ ( this.lc().m_smallMapTip, {name:'mapTip'} );
	};
	
	this.test_open = function(){
		var r_isShow = [true];
		this.mm.mock(this.view, 'isShow', r_isShow);
		this.mm.mock(OutFieldSender, 'sendEnterOutField');
		this.mm.mock(this.view, 'show');
		this.mm.mock(this.view, 'loadMap');
		this.mm.mock(this.g.getImgr(), 'setCurLoadCity');
		this.mm.mock(this.view, 'resetSMapCaller');
		this.mm.mock(this.lc(), '_firstOpen');
		this.mm.mock(OutFieldSender, 'sendRefreshFieldsByLastViewPos');
		
		this.view.open();
		assertEQ ( this.mm.walkLog, 'isShow,show,_firstOpen,loadMap,setCurLoadCity,resetSMapCaller,sendRefreshFieldsByLastViewPos' );
		assertEQ ( this.mm.params['loadMap'], [FIXID.OUTFIELD, rstr.citylist.outfield] );
		assertEQ ( this.mm.params['setCurLoadCity'], [FIXID.OUTFIELD] );
		assertEQ ( this.mm.params['sendRefreshFieldsByLastViewPos'], [this.g] );
		
		this.mm.clear();
		r_isShow[0] = false;
		this.view.open();
		assertEQ ( this.mm.walkLog, 'isShow,sendEnterOutField,show,_firstOpen,loadMap,setCurLoadCity,resetSMapCaller,sendRefreshFieldsByLastViewPos' );
		assertEQ ( this.mm.params['sendEnterOutField'], [this.g] );
	};
	
	this.test_open_ex = function(){
		this.view.open();
		assertEQ ( this.view.getMapPixelRect(), { x: 63800, y: 32000, w: 63800, h: 32000 } );
	};
	
	this.test_show = function(){
		this.mm.mock(this.view.Super, 'show');
		this.mm.mock(this.lc().m_gotoBar, 'show');
		this.mm.mock(this.lc().m_smallMapTip, 'show');
		this.view.show();
		assertEQ ( this.mm.walkLog, 'show,show,show' );
	};
	
	this.test_hide = function(){
		this.mm.mock(this.view.Super, 'hide');
		this.mm.mock(this.lc().m_gotoBar, 'hide');
		this.mm.mock(this.lc().m_smallMapTip, 'hide');
		this.view.hide();
		assertEQ ( this.mm.walkLog, 'hide,hide,hide' );
	};
	
	this.test_goHome = function(){
		this.g.getImgr().getRoleRes().pos = {x:1, y:2};
		this.mm.mock(this.view, 'gotoPos');
		this.mm.mock(OutFieldSender, 'sendRefreshFieldsByLastViewPos');
		this.view.goHome();
		assertEQ ( this.mm.walkLog, 'gotoPos,sendRefreshFieldsByLastViewPos' );
		assertEQ ( this.mm.params['gotoPos'], [{x:1, y:2}] ); 
		assertEQ ( this.mm.params['sendRefreshFieldsByLastViewPos'], [this.g] ); 
	};
	
	this.test_gotoPos = function(){
		this.mm.mock(this.g.getWinSizer(), 'getValidClientSize', [{cx:200,cy:100}]);
		this.mm.mock(this.view, 'setLastViewport');
		this.mm.mock(this.lc().m_items.fieldBlocks, 'setViewPos');
		this.mm.mock(this.view, 'setViewportPos');
		
		this.view.gotoPos({x:1000, y:2000});
		assert ( this.mm.walkLog == 'getValidClientSize,setLastViewport,setViewPos,setViewportPos' );
		var x = Math.floor(1000*C_OUTFIELD_BLOCK_W+C_OUTFIELD_BLOCK_W/2 - 100)
		var y = Math.floor(2000*C_OUTFIELD_BLOCK_H+C_OUTFIELD_BLOCK_H/2 - 50)
		assert ( this.mm.params['setLastViewport'][0].x == x);
		assert ( this.mm.params['setLastViewport'][0].y == y);
		assertListEQ ( this.mm.params['setViewPos'], [x, y]);
		assertListEQ ( this.mm.params['setViewportPos'], [{x:x, y:y}]);
	};
	
	this.test__regEvents = function(){
		this.mm.mock(this.g, 'regEvent');
		this.lc()._regEvents();
		assert ( this.mm.walkLog == 'regEvent' );
	};
	
	this.test__createBlocks = function(){
		var g_moveFieldHdr = {};
		var g_getBlockPoss = [{x:0, y:0}];
		var g_fieldBlocks = this.lc().m_items.fieldBlocks;
		this.mm.mock(BuildBlocks, 'snew', [g_fieldBlocks]);
		this.mm.mock(this.lc(), '_getBlockPoss', [g_getBlockPoss]);
		this.mm.mock(MoveFieldBlocksHdr, 'snew', [g_moveFieldHdr]);
		this.mm.mock(g_fieldBlocks, 'hideAllBlock');
		this.mm.mock(this.view, 'setViewportCaller');
		
		this.lc()._createBlocks();
		assertEQ ( this.lc().m_moveFieldsHdr, g_moveFieldHdr );
		assertEQ ( this.mm.walkLog, '_getBlockPoss,snew,snew,hideAllBlock,setViewportCaller' );
		
		assertEQ ( this.mm.params['snew.0'][0], this.g );
		assertEQ ( this.mm.params['snew.0'][1].map, this.lc().m_items.mapscene );
		assertEQ ( this.mm.params['snew.0'][1].mousemap, this.lc().m_items.mousemap );
		assertEQ ( this.mm.params['snew.0'][1].blockclass, FieldBlock );
		assertEQ ( this.mm.params['snew.0'][1].poss, g_getBlockPoss );
		assertEQ ( this.mm.params['snew.0'][1].blockw, C_OUTFIELD_BLOCK_W );
		assertEQ ( this.mm.params['snew.0'][1].blockh, C_OUTFIELD_BLOCK_H );
		assertEQ ( this.mm.params['snew.0'][1].clickcaller, {self:this.view, caller:this.lc()._onClickBlock} );
		assertEQ ( this.mm.params['snew.0'][1].tipcaller, {self:this.view, caller:this.lc()._onGetBlockTooltip} );
		assertEQ ( this.mm.params['snew.0'][2], 'rect' );
		
		assertEQ ( this.mm.params['snew.1'], [g_fieldBlocks] );
		
		assertEQ ( this.mm.params['setViewportCaller'][0].self, this.view );
		assertEQ ( this.mm.params['setViewportCaller'][0].caller, this.lc()._onViewportChange );
	};
	
	this.test__firstOpen = function(){
		this.mm.mock(this.view, 'goHome');
		this.mm.mock(FieldMapBlockSelector, 'snew', [{name:'blockSelector'}]);
		
		this.lc()._firstOpen();
		assertEQ ( this.lc().m_isFirst, false );
		assertEQ ( this.mm.walkLog, 'snew,goHome' );
		assertEQ ( this.lc().m_blockSelector, {name:'blockSelector'} );
		assertEQ ( this.mm.params['snew'], [this.g, this.view] );
				
		this.mm.clear();
		this.lc()._firstOpen();
		assert ( this.mm.walkLog == '' , 'only call one time');
	};
	
	this.test__getBlockPoss = function(){
		var size = this.g.getWinSizer().getMaxClientSize();
		var rows = Math.floor((size.cx + 2*C_OUTFIELD_BLOCK_W)/C_OUTFIELD_BLOCK_W);
		var cols = Math.floor((size.cy + 2*C_OUTFIELD_BLOCK_H)/C_OUTFIELD_BLOCK_H);
		
		var poss = this.lc()._getBlockPoss();
		assert ( poss.length > 0 && poss.length == rows  * cols );
		assert ( poss[0].x == 0 );
		assert ( poss[0].y == 0 );
	};
	
	this.test__onViewportChange = function(){
		this.mm.mock(this.lc().m_moveFieldsHdr, 'moveBlocks' );
		this.mm.mock(this.lc(), '_sendGetFieldsCmd' );
		this.mm.mock(this.lc().m_gotoBar, 'setViewport' );
		this.mm.mock(this.lc().m_items.fieldBlocks, 'setViewPos' );
		
		var g_viewport = {x:1, y:2};
		this.lc()._onViewportChange(g_viewport);
		assert ( this.mm.walkLog == 'moveBlocks,_sendGetFieldsCmd,setViewport,setViewPos' );
		var size = this.g.getWinSizer().getMaxClientSize();
		var newViewPort = {x:1, y:2, w:size.cx, h:size.cy};
		assertListEQ ( this.mm.params['moveBlocks'], [newViewPort] );
		assertListEQ ( this.mm.params['_sendGetFieldsCmd'], [newViewPort] );
		assertListEQ ( this.mm.params['setViewport'], [g_viewport] );
		assertListEQ ( this.mm.params['setViewPos'], [g_viewport.x, g_viewport.y] );
	};
	
	this.test__onSvrData = function(){
		var g_getBlockByGridIdRt = [null];
		this.mm.mock(this.lc(), '_getBlockByGridId',  g_getBlockByGridIdRt);
		this.mm.mock(this.g.getImgr(), 'setCurDetailField');
		
		var ndata = {data:{}};
		this.lc()._onSvrData(ndata);
		assertEQ ( this.mm.walkLog, '' );
		
		this.mm.clear();
		var ndata = {data:{outFields:[{_k:'gridId'},{gridId:1}]}};
		this.lc()._onSvrData(ndata);
		assertEQ ( this.mm.walkLog, '_getBlockByGridId' );
		
		this.mm.mock(this.lc().m_items.fieldBlocks.getBlock(0), 'setItem');
		this.mm.mock(this.g, 'sendEvent');
		
		this.mm.clear();
		g_getBlockByGridIdRt[0] = this.lc().m_items.fieldBlocks.getBlock(0);
		this.lc()._onSvrData(ndata);
		assertEQ ( this.mm.walkLog, '_getBlockByGridId,setItem' );
		
		this.mm.mock(UIM.getDlg('rolecity'), 'openDlg');
		
		this.mm.clear();
		var ndata = {data:{outFields:[{_k:'gridId'},{isDetail:1, gridId:1}]}};
		this.lc()._onSvrData(ndata);
		assertEQ ( this.mm.walkLog, 'setCurDetailField,_getBlockByGridId,setItem,openDlg,sendEvent' );
		assertEQ ( this.mm.params['setCurDetailField'], [ {isDetail:1, gridId:1} ] );
		assertEQ ( this.mm.params['openDlg'], [this.g.getImgr().getCurDetailField()] );
		assertEQ ( this.mm.params['sendEvent'], [{eid:EVT.OUTFIELD_DETAIL, sid:0}] );
	};
	
	this.test__sendGetFieldsCmd = function(){
		var g_viewport = {x:10, y:20, w:30, h:40};
		this.mm.mock(OutFieldSender, 'sendGetFieldsByPos');
		this.lc()._sendGetFieldsCmd(g_viewport);
		assert ( this.mm.walkLog == 'sendGetFieldsByPos' );
		assert ( this.mm.params['sendGetFieldsByPos'][0] == this.g );
		assert ( this.mm.params['sendGetFieldsByPos'][1].x == 10 + 30/2 );
		assert ( this.mm.params['sendGetFieldsByPos'][1].y == 20 + 40/2 );
	};
	
	this.test__onClickBlock = function(){
		var block = this.lc().m_items.fieldBlocks.getBlock(1);
		
		var r_isDragged = [true];
		var r_field = [{}];
		this.mm.mock(this.view, 'isDragged', r_isDragged)
		this.mm.mock(block, 'getItem', r_field)
		this.mm.mock(UIM, 'openDlg' );
		this.mm.mock(this.g.getGUI(), 'sysMsgTips');
		
		var p_event = {name:'event'};
		var p_blockIdx = 0;
		this.lc()._onClickBlock(p_event, p_blockIdx);
		assertEQ ( this.mm.walkLog, 'isDragged' );
		assertEQ ( this.mm.params['isDragged'], [ p_event ] );
		
		this.mm.clear();
		r_isDragged[0] = false;
		this.lc()._onClickBlock(p_event, p_blockIdx);
		assertEQ ( this.mm.walkLog, 'isDragged' );
		
		this.mm.clear();
		p_blockIdx = 1;
		r_field[0] = {objType:OBJ_TYPE.NONE};
		this.lc()._onClickBlock(p_event, p_blockIdx);
		assertEQ ( this.mm.walkLog, 'isDragged,getItem,openDlg' );
		assertEQ ( this.mm.params['openDlg'], [ 'emptyfield', r_field[0] ] );
		
		this.mm.clear();
		r_field[0] = {objType:OBJ_TYPE.ROLE};
		this.lc()._onClickBlock(p_event, p_blockIdx);
		assertEQ ( this.mm.walkLog, 'isDragged,getItem,openDlg' );
		assertEQ ( this.mm.params['openDlg'], [ 'rolecity', r_field[0] ] );
		
		this.mm.clear();
		r_field[0] = {objType:OBJ_TYPE.FIELD};
		this.lc()._onClickBlock(p_event, p_blockIdx);
		assertEQ ( this.mm.walkLog, 'isDragged,getItem,openDlg' );
		assertEQ ( this.mm.params['openDlg'], [ 'field', r_field[0] ] );
		
		this.mm.clear();
		r_field[0] = {objType:OBJ_TYPE.INVALID};
		this.lc()._onClickBlock(p_event, p_blockIdx);
		assertEQ ( this.mm.walkLog, 'isDragged,getItem,sysMsgTips' );
		assertEQ ( this.mm.params['sysMsgTips'], [ SMT_WARNING, rstr.field.lbl.invalidField ] );

	};
	
	this.test__onGetBlockTooltip = function(){
		var block = this.lc().m_items.fieldBlocks.getBlock(1);
		
		var r_field = [{}];
		this.mm.mock(block, 'getItem', r_field);
		this.mm.mock(this.lc(), '_getRoleInfoTip', ['role info tip']);
		
		assertEQ ( this.lc()._onGetBlockTooltip({idx:0}), '');
		assertEQ ( this.mm.walkLog, '' );
		
		r_field[0] = {objType:OBJ_TYPE.NONE};
		assertEQ ( this.lc()._onGetBlockTooltip({idx:1}), '');
		assertEQ ( this.mm.walkLog, 'getItem' );
		
		this.mm.clear();
		r_field[0] = {objType:OBJ_TYPE.ROLE};
		assertEQ ( this.lc()._onGetBlockTooltip({idx:1}), 'role info tip');
		assertEQ ( this.mm.params['_getRoleInfoTip'], [ r_field[0] ] );
	};
	
	this.test__getRoleInfoTip = function(){
		this.mm.mock(FieldUtil, 'getPosByGridId', [{x:10, y:20}] );
		this.mm.mock(FieldUtil, 'getCityNameByGridId', ['xxx'] );
		var p_field = {gridId:1, roleName:'role', alliance:{name:'alliance'}};
		assertEQ ( this.lc()._getRoleInfoTip(p_field), TQ.format(rstr.field.tip.roleInfo, 'role', 'alliance', '10,20', 'xxx')  );
		assertEQ ( this.mm.params['getPosByGridId'], [1] );
		assertEQ ( this.mm.params['getCityNameByGridId'], [1] );
	};
	
});

tqFieldHandler_t_main = function(suite) {
	suite.addTestCase(TestCaseFieldBlock, 'TestCaseFieldBlock');
	suite.addTestCase(TestCaseMoveFieldBlocksHdr, 'TestCaseMoveFieldBlocksHdr');
	suite.addTestCase(TestCaseFieldGotoBar, 'TestCaseFieldGotoBar');
	suite.addTestCase(TestCaseFieldSmallMapTip, 'TestCaseFieldSmallMapTip');
	suite.addTestCase(TestCaseFieldMapBlockSelector, 'TestCaseFieldMapBlockSelector');
	suite.addTestCase(TestCaseFieldMapView, 'TestCaseFieldMapView');
};
