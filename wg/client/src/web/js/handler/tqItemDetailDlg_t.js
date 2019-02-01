/*******************************************************************************/
require('./tqItemDetailDlg.js')

TestCaseClickItemHdr = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.hdr = ClickItemHdr.snew(this.g);
		res_test_items = [{id:1001, pile:99, name:'item1', desc:'desc1'},{id:1002, pile:1, name:'item2', desc:'desc2'}];
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_clickCommRes = function(){
		var pos = {x:1, y:2};
		var roleId = 10000;
		this.hdr.click(pos, roleId, {id:1, resid:1001, itemres:ItemResUtil.findItemres(1001) });
		assertEQ ( this.hdr.tip_.getLastPos(), pos );
		assertEQ ( this.hdr.tip_.getTipMsg(), TIPM.getItemDesc(this.hdr.item_, 'other', false) );
		
		this.g.getImgr().getRoleRes().uid = 10000;
		this.hdr.click(pos, roleId, {id:1, resid:1001, itemres:ItemResUtil.findItemres(1001) });
		assertEQ ( this.hdr.tip_.getTipMsg(), TIPM.getItemDesc(this.hdr.item_, 'self', false) );
	};
	
	this.test_clickMySpecItem = function(){
		var item = {id:2, resid:1002, itemres:ItemResUtil.findItemres(1002), num:1, attrs:{}};
		item.attrs[ATTR.ST_B] = {val:10, u:1};
		this.g.getImgr().addItem(item);

		this.g.getImgr().getRoleRes().uid = 10000;
		var pos = {x:1, y:2};
		var roleId = 10000;
		this.hdr.click(pos, roleId, {id:2, resid:1002, itemres:ItemResUtil.findItemres(1002) });
		assertEQ ( this.hdr.tip_.getLastPos(), pos );
		assertEQ ( this.hdr.tip_.getTipMsg(), TIPM.getItemDesc(item, 'self', false) );
		
		pos = {x:2, y:3};
		this.hdr.click(pos, roleId, {id:3, resid:1002, itemres:ItemResUtil.findItemres(1002) });
		assertEQ ( this.hdr.tip_.getLastPos(), {x:1, y:2} );
		assertEQ ( TestCaseSysTip.getSystip(), rstr.ids[100168].msg );
	};
	
	this.test_clickOtherSpecItem = function(){
		this.mm.mock(ItemInfoSender, 'sendGetDetailItem' );
		var item = {id:2, resid:1002, itemres:ItemResUtil.findItemres(1002), num:1, attrs:{}};
		item.attrs[ATTR.ST_B] = {val:10, u:1};

		var pos = {x:1, y:2};
		var roleId = 10000;
		this.hdr.click(pos, roleId, {id:2, resid:1002, itemres:ItemResUtil.findItemres(1002) });
		assertEQ ( this.hdr.tip_.getLastPos(), {x:0, y:0} );
		assertEQ ( this.mm.params['sendGetDetailItem'], [this.g, 10000, 2] );
		
		// svr msg : result = -1
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ITEM, data:{result:-1}});
		assertEQ ( this.hdr.tip_.getLastPos(), {x:0, y:0} );
		
		// svr msg : result : 0, ...
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ITEM, data:{result:0, roleId:roleId+1, detailitem:item}});
		assertEQ ( this.hdr.tip_.getLastPos(), {x:0, y:0} );
		
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ITEM, data:{result:0, roleId:roleId}});
		assertEQ ( this.hdr.tip_.getLastPos(), {x:0, y:0} );
		
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ITEM, data:{result:0, roleId:roleId, detailitem:{id:3}}});
		assertEQ ( this.hdr.tip_.getLastPos(), {x:0, y:0} );
		
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ITEM, data:{result:0, roleId:roleId, detailitem:item}});
		assertEQ ( this.hdr.tip_.getLastPos(), {x:1, y:2} );
		assertEQ ( this.hdr.tip_.getTipMsg(), TIPM.getItemDesc(item, 'other', false) );
	};
});

tqItemDetailDlg_t_main = function(suite) {
	suite.addTestCase(TestCaseClickItemHdr, 'TestCaseClickItemHdr');
};
