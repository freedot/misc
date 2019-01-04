--*******************************************************************************
--*******************************************************************************
require('tqPlayerPackage')

local TestCasePlayerPackage = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.pkg = self.player:getPkg()
		
		res_test_items = {{id=1,pile=2},{id=2,pile=1,unique=1,apos=1},{id=3,pile=1,unique=1},{id=4,pile=1,unique=1}
			,{id=5,pile=1,unique=1}
			,{id=6,pile=1,unique=1,effects={ {id=1,pro=0,min=2,max=2,unit=0},{id=0,pro=100,min=2,max=2,unit=0},{id=1,pro=100,min=0,max=0,unit=0},{id=RES_EFF.H_ADD_STR,pro=100,min=2,max=2,unit=1}  }}
			}
		self.resItem = {id=10000, resId=3, number=1, forceLevel=1, isBind=0, attrs={count=0,attrs={}}, gems={count=0,gems={}} }
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_initItems = function(self)
		self.pkg:_initItems()
		assert ( table.getn(self.pkg.items) == 0 )
		
		self.pkg.innerItems = {count=1, items={} }
		self.pkg.innerItems.items[0] = {id=1}
		self.pkg:_initItems()
		assert ( table.getn(self.pkg.items) == 1 )
		assert ( self.pkg.items[1]:getId() == 1 )
	end;
	
	test_setMaxGridsCnt = function(self)
		assert ( self.pkg:getMaxGridsCnt() == res_role_initdata.pkg.maxgridcnt )
		self.pkg:setMaxGridsCnt(2)
		assert ( self.pkg:getMaxGridsCnt() == 2 )
		
		self.player:setVipLevel(2)
		assert ( self.pkg:getMaxGridsCnt() == 2+50 )
	end;
	
	test_getItemNumber = function(self)
		self.pkg.innerItems = {count=3, items={} }
		self.pkg.innerItems.items[0] = {id=1,resId=1001,number=1}
		self.pkg.innerItems.items[1] = {id=2,resId=1002,number=2}
		self.pkg.innerItems.items[2] = {id=3,resId=1001,number=3}
		self.pkg:_initItems()
		
		assert ( self.pkg:getItemNumber(1001) == 4 )
		assert ( self.pkg:getItemNumber(1002) == 2 )
		assert ( self.pkg:getItemNumber(1003) == 0 )
		assert ( self.pkg:getItemNumber(0) == 0 )
		assert ( self.pkg:getItemNumber(nil) == 0 )
	end;	
	
	test_getItemNumber_includeNoBindResId = function(self)
		self.pkg:addItems({RawItemEx({resId=FIXID.ESSENCE_LVL1, number=1}) })
		assert ( self.pkg:getItemNumber(FIXID.ESSENCE_LVL1) == 1 )

		self.pkg:addItems({RawItemEx({resId=3000034, number=1}) })
		assert ( self.pkg:getItemNumber(FIXID.ESSENCE_LVL1) == 2 )
	end;
	
	test_getItemByResId = function(self)
		self.pkg.innerItems = {count=1, items={} }
		self.pkg.innerItems.items[0] = {id=1,resId=1001,number=1}
		self.pkg:_initItems()
		
		assert ( self.pkg:getItemByResId(1001):getId() == 1 )
		assert ( self.pkg:getItemByResId(1002) == nil )
	end;
	
	test_getItemById = function(self)
		self.pkg.innerItems = {count=1, items={} }
		self.pkg.innerItems.items[0] = {id=1,resId=1001,number=1}
		self.pkg:_initItems()
		
		assert ( self.pkg:getItemById(1):getId() == 1 )
		assert ( self.pkg:getItemById(2) == nil )
	end;
	
	test_getItemsCount = function(self)
		self.pkg.innerItems = {count=1, items={} }
		self.pkg.innerItems.items[0] = {id=1,resId=1001,number=1}
		self.pkg:_initItems()
		
		assert ( self.pkg:getItemsCount() == 1 )
	end;
	
	test_getItemByIdx = function(self)
		self.pkg.innerItems = {count=1, items={} }
		self.pkg.innerItems.items[0] = {id=1,resId=1001,number=1}
		self.pkg:_initItems()
		
		assert ( self.pkg:getItemByIdx(0):getId() == 1 )
		assert ( self.pkg:getItemByIdx(1) == nil )
	end;
	
	test_subItemByResId = function(self)
		self.pkg:addItems({RawItemEx({resId=FIXID.ESSENCE_LVL1, number=2}) })
		self.pkg:addItems({RawItemEx({resId=3000034, number=1}) })
		assertEQ ( self.pkg:getItemNumber(FIXID.ESSENCE_LVL1), 3 )
		assertEQ ( self.pkg:getItemNumber(3000034), 3 )
		self.pkg:subItemByResId(FIXID.ESSENCE_LVL1, 1)
		assertEQ ( self.pkg:getItemNumber(FIXID.ESSENCE_LVL1), 2 )
		assertEQ ( self.pkg:getItemNumber(3000034), 2 )
		
		self.pkg:subItemByResId(FIXID.ESSENCE_LVL1, 3)
		assertEQ ( self.pkg:getItemNumber(FIXID.ESSENCE_LVL1), 0 )
		assertEQ ( self.pkg:getItemNumber(3000034), 0 )
		
		self.pkg:addItems({RawItemEx({resId=FIXID.ESSENCE_LVL1, number=2}) })
		self.pkg:addItems({RawItemEx({resId=3000034, number=1}) })
		self.pkg:subItemByResId(FIXID.ESSENCE_LVL1, 3)
		assertEQ ( self.pkg:getItemNumber(FIXID.ESSENCE_LVL1), 0 )
		assertEQ ( self.pkg:getItemNumber(3000034), 0 )
	end;
	
	test__subItemByResId = function(self)
		self.mm:mock(ItemMsgSender, 'sendChangeItems')
		self.pkg:_addItem(RawItemEx({resId=1, number=2}))
		self.pkg:_addItem(RawItemEx({resId=1, number=2}))
		self.pkg:_addItem(RawItemEx({resId=2, number=1}))
		assert ( self.pkg:getItemsCount() == 3 )
		
		local changeItems = self.pkg:_subItemByResId(1, 3)
		
		assert ( self.pkg:getItemsCount() == 2 )
		
		assert ( changeItems[1].id == 2, 'reverse order' )
		assert ( changeItems[1].del == true )
		assert ( changeItems[1].resid == 1 )
		
		assert ( changeItems[2].id == 1 )
		assert ( changeItems[2].del == false )
		assert ( changeItems[2].number == 1 )
		assert ( changeItems[2].resid == 1 )
		
		assert ( self.pkg:getItemByIdx(0):getId() == 1 )
		assert ( self.pkg:getItemByIdx(1):getId() == 3 )
		assertEQ ( self.mm.params['sendChangeItems'], {self.player, changeItems} )
	end;	
	
	test_delItemById = function(self)
		self.pkg:_addItem(RawItemEx({resId=1, number=1}))
		self.pkg:_addItem(RawItemEx({resId=2, number=1}))
		self.pkg:_addItem(RawItemEx({resId=3, number=1}))
		
		local item = self.pkg:getItemByResId(2)
		self.pkg:delItemById(item:getId())
		assert ( self.pkg:getItemsCount() == 2 )
		assert ( self.pkg:getItemByIdx(0):getResId() == 1 )
		assert ( self.pkg:getItemByIdx(1):getResId() == 3 )
	end;
	
	test_returnItems = function(self)
		self.pkg:setMaxGridsCnt(4)
		
		local rawItem1 = RawItemEx({resId=1, number=2});
		local rawItem2 = RawItemEx({resId=2, number=3});
		
		self.mm:clear()
		self.pkg:returnItems({rawItem1,rawItem2})
		assert( self.pkg:getItemsCount() == 4 )
	
		assert ( self.pkg:returnItems({RawItemEx({resId=4, number=5}),RawItemEx({resId=6, number=7})}) == false )
		assert ( self.pkg:getItemsCount() == 4 )	
	end;
	
	test_addItems = function(self)
		local r_returnItems = {false}
		self.mm:mock(self.pkg, 'returnItems', r_returnItems)
		self.mm:mock(self.pkg, '_sendGetItemsTip')
		self.mm:mock(TaskFinisher, 'checkTasks')
		
		local rawItem1 = RawItemEx({resId=1, number=2});
		local rawItem2 = RawItemEx({resId=2, number=3});
		
		self.pkg:addItems({rawItem1,rawItem2})
		assertEQ ( self.mm.walkLog, 'returnItems' )
		assertEQ ( self.mm.params['returnItems'], {{rawItem1,rawItem2}} )
		
		self.mm:clear()
		r_returnItems[1] = true
		self.pkg:addItems({rawItem1})
		
		assertEQ ( self.mm.walkLog, 'returnItems,_sendGetItemsTip,checkTasks' )
		assertEQ ( self.mm.params['_sendGetItemsTip'], {{rawItem1}} )
		assertEQ ( self.mm.params['checkTasks'], {self.player} )
	end;
	
	test_addItemsNoTip = function(self)
		local r_returnItems = {false}
		self.mm:mock(self.pkg, 'returnItems', r_returnItems)
		self.mm:mock(self.pkg, '_sendGetItemsTip')
		self.mm:mock(TaskFinisher, 'checkTasks')
		
		local rawItem1 = RawItemEx({resId=1, number=2});
		local rawItem2 = RawItemEx({resId=2, number=3});
		
		self.pkg:addItemsNoTip({rawItem1,rawItem2})
		assertEQ ( self.mm.walkLog, 'returnItems' )
		assertEQ ( self.mm.params['returnItems'], {{rawItem1,rawItem2}} )
		
		self.mm:clear()
		r_returnItems[1] = true
		self.pkg:addItemsNoTip({rawItem1})
		
		assertEQ ( self.mm.walkLog, 'returnItems,checkTasks' )
		assertEQ ( self.mm.params['checkTasks'], {self.player} )
	end;
	
	test_preAddItems = function(self)
		assert ( self.pkg:preAddItems(nil) == true )
		assert ( self.pkg:preAddItems({}) == true )
		
		self.mm:clear()
		local g_rawItems = {}
		local g_splitUniqueItems = {{},{}}
		self.mm:mock(self.pkg, '_splitUniqueItems', {g_splitUniqueItems})
		self.mm:mock(self.pkg, '_preAddItems', {false})
		assert ( self.pkg:preAddItems(g_rawItems) == false )
		assert ( self.mm.walkLog == '_splitUniqueItems,_preAddItems' )
		assertListEQ ( self.mm.params['_splitUniqueItems'], {g_rawItems} )
		assertListEQ ( self.mm.params['_preAddItems'], {g_splitUniqueItems} )
	end;
	
	test__splitUniqueItems = function(self)
		local p_addItems = {RawItemEx({resId=1, number=4}),RawItemEx({resId=2, number=2})}
		local splitAddItems = self.pkg:_splitUniqueItems(p_addItems)
		assertEQ ( splitAddItems, {RawItemEx({resId=1, number=4}),RawItemEx({resId=2, number=1}),RawItemEx({resId=2, number=1})} )
	end;
	
	test__preAddItems = function(self)
		self.pkg:setMaxGridsCnt(2)
		assert ( self.pkg:_preAddItems({RawItemEx({resId=1, number=2}),RawItemEx({resId=2, number=1})}) == true )
		assert( self.pkg:getItemsCount() == 0 )
		
		self.pkg:setMaxGridsCnt(1)
		assert ( self.pkg:_preAddItems({RawItemEx({resId=1, number=2}),RawItemEx({resId=2, number=3})}) == false )
		assert( self.pkg:getItemsCount() == 0 )
	end;
	
	test__addItems = function(self)
		local rawItem1 = RawItemEx({resId=1, number=2});
		local rawItem2 = RawItemEx({resId=2, number=1});
		self.pkg:_addItems({rawItem1,rawItem2,rawItem2,rawItem2})
		assert ( self.pkg:getItemsCount() == 4)
		assert ( self.pkg:getItemByIdx(0):getNumber() == 2 )
		assert ( self.pkg:getItemByIdx(0):getResId() == 1 )
		assert ( self.pkg:getItemByIdx(1):getNumber() == 1 )
		assert ( self.pkg:getItemByIdx(1):getResId() == 2 )
		assert ( self.pkg:getItemByIdx(2):getNumber() == 1 )
		assert ( self.pkg:getItemByIdx(2):getResId() == 2 )
		assert ( self.pkg:getItemByIdx(3):getNumber() == 1 )
		assert ( self.pkg:getItemByIdx(3):getResId() == 2 )
		assert( selectSendMsgCnt_t('has@pkg:{items:') == 1 )
	end;
	
	
	
	test_addItem_createNewItem = function(self)
		self.pkg:_addItem(RawItemEx({resId=1, number=2}))
		assert(self.pkg:getItemsCount() == 1)
		
		local item = self.pkg:getItemByResId(1)
		assert(item:getNumber() == 2)
	end;
	
	test_addItem_addPileItem = function(self)
		local item1 = self.pkg:_addItem(RawItemEx({resId=1, number=1}))
		assert(self.pkg:getItemsCount() == 1)

		local item2 = self.pkg:_addItem(RawItemEx({resId=1, number=1}))
		assert(item2:getId() == item1:getId(), 'this item by pile, so ... ')
		assert(item2:getNumber() == 2)
		assert(self.pkg:getItemsCount() == 1)

		local item3 = self.pkg:_addItem(RawItemEx({resId=1, number=1}))
		assert(item3:getId() ~= item2:getId(), 'last item is pile full, so this item no pile')
		assert(item3:getNumber() == 1)
		assert(self.pkg:getItemsCount() == 2)
	end;
	
	test_addItem_addUniqueItem = function(self)
		local item1 = self.pkg:_addItem(RawItemEx({resId=2,number=1}))
		assert(item1:getNumber() == 1)
		assert(self.pkg:getItemsCount() == 1)

		local item2 = self.pkg:_addItem(RawItemEx({resId=2,number=1}))
		assert(item2:getNumber() == 1)
		assert(self.pkg:getItemsCount() == 2)

		assert(item1:getId() ~= item2:getId())
	end;
	
	test_addItem_maxItemGrids = function(self)
		self.pkg:setMaxGridsCnt(2)
		self.pkg:_addItem(RawItemEx({resId=1, number=10}))
		assert(self.pkg:getItemNumber(1) == 4)
		assert(self.pkg:getItemsCount() == 2)
	end;
	
	test_addItem_reinitNoUniqueItemsId = function(self)
		self.pkg:setMaxGridsCnt(10)
		local item1 = self.pkg:_addItem(RawItemEx({resId=1, number=2}))
		local item2 = self.pkg:_addItem(RawItemEx({resId=1, number=2}))
		self.pkg:delItemById( item2:getId() )
		local item3 = self.pkg:_addItem(RawItemEx({resId=1, number=2}))
		assert(item3:getId() == 3)
		
		local g_resItem4 = {id=10000, resId=1, number=2, forceLevel=0, attrs={count=0,attrs={} }, gems={count=0,gems={}}}
		local item4 = self.pkg:_addItem( ItemEx(g_resItem4) )
		assert(item4:getId() == 4)
	end;
	
	test_addItem_uniqueItem = function(self)
		self.pkg:setMaxGridsCnt(2)
		local g_resItem = {id=10000, resId=2, number=1, forceLevel=0, attrs={count=0,attrs={} }, gems={count=0,gems={}}}
		local item = self.pkg:_addItem( ItemEx(g_resItem) )
		assert ( item:getId() == 10000, 'unique id invariability' )
		assert ( self.pkg:getItemsCount() == 1 )
	end;
	
	test__sendGetItemsTip = function(self)
		self.mm:mock(WUtil, 'sendSysMsgArgs' )
		
		local rawItem1 = RawItemEx({resId=1, number=2});
		local rawItem2 = RawItemEx({resId=3, number=4});
		self.pkg:_sendGetItemsTip({rawItem1, rawItem2})
		assertEQ ( self.mm.walkLog, 'sendSysMsgArgs,sendSysMsgArgs' )
		assertEQ ( self.mm.params['sendSysMsgArgs.1'], {self.player, SMSGT.SYSCHANNEL, CHAT_TAG.SYS, 100026, '"@itemid1",2'} )
		assertEQ ( self.mm.params['sendSysMsgArgs.2'], {self.player, SMSGT.SYSCHANNEL, CHAT_TAG.SYS, 100026, '"@itemid3",4'} )
	end;
	
	test_createItemAttrs_ = function(self)
		local g_resItem = {id=10000, resId=6, number=3, forceLevel=0, attrs={count=0,attrs={} }, gems={count=0,gems={}}}
		local item = self.pkg:_addItem( ItemEx(g_resItem) )
		self.pkg:_createItemAttrs(item, ItemResUtil:findItemres(item:getResId()))
		assert ( item:getAttrsCount() == 1 )
		assert ( item:getAttrByIdx(0).attr == ATTR.ST_B )
		assert ( item:getAttrByIdx(0).val == 2 )
		assert ( item:getAttrByIdx(0).unit == 1 )
	end;
	
	test_setGold = function(self)
		self.pkg:setGold(1)
		assert ( self.pkg:getGold() == 1 )
		self.pkg:setGold(-1)
		assert ( self.pkg:getGold() == 1 )
		self.pkg:setGold(0)
		assert ( self.pkg:getGold() == 0 )
	end;
	
	test_addGold = function(self)
		self.pkg:setGold(1)
		self.pkg:addGold(0)
		assert ( self.pkg:getGold() == 1 )
		self.pkg:addGold(1)
		assert ( self.pkg:getGold() == 2 )
		self.pkg:addGold(-1)
		assert ( self.pkg:getGold() == 2 )
	end;
	
	test_setGiftGold = function(self)
		self.pkg:setGiftGold(1)
		assert ( self.pkg:getGiftGold() == 1 )
		self.pkg:setGiftGold(-1)
		assert ( self.pkg:getGiftGold() == 1 )
		self.pkg:setGiftGold(0)
		assert ( self.pkg:getGiftGold() == 0 )
	end;
	
	test_getAllGold = function(self)
		self.pkg:setGold(1)
		self.pkg:setGiftGold(2)
		assert ( self.pkg:getAllGold() == 3 )
	end;
	
	test_subGold = function(self)
		self.pkg:setGold(3)
		
		self.pkg:subGold(-1)
		assert ( self.pkg:getGold() == 3 )
		
		self.pkg:subGold(0)
		assert ( self.pkg:getGold() == 3 )
		
		self.pkg:subGold(1)
		assert ( self.pkg:getGold() == 2 )
		
		self.pkg:subGold(3)
		assert ( self.pkg:getGold() == 0 )
	end;
	
	test_subGiftGold = function(self)
		self.pkg:setGiftGold(3)
		
		self.pkg:subGiftGold(-1)
		assert ( self.pkg:getGiftGold() == 3 )
		
		self.pkg:subGiftGold(0)
		assert ( self.pkg:getGiftGold() == 3 )
		
		self.pkg:subGiftGold(1)
		assert ( self.pkg:getGiftGold() == 2 )
		
		self.pkg:subGiftGold(3)
		assert ( self.pkg:getGiftGold() == 0 )		
	end;
	
	test__createNewItems = function(self)
		local g_itemres = {}
		local g_srcItem = {}
		local g_leftNumber = 2
	
		local g_allocItemRt = {nil}
		self.mm:mock(self.pkg, '_allocItem', g_allocItemRt)
		self.mm:mock(self.pkg, '_createNewItem')
		assert ( self.pkg:_createNewItems(g_itemres, g_srcItem, g_leftNumber) == nil )
		
		self.mm:clear()
		g_allocItemRt[1] = LuaItemEx(self.resItem)
		g_allocItemRt[1]:setNumber(1)
		assert ( self.pkg:_createNewItems(g_itemres, g_srcItem, g_leftNumber) == g_allocItemRt[1] )
		assert ( self.mm.walkLog == '_allocItem,_createNewItem,_allocItem,_createNewItem' )
		assertListEQ ( self.mm.params['_createNewItem.1'], {g_srcItem, g_allocItemRt[1], g_itemres, 2} )
		assertListEQ ( self.mm.params['_createNewItem.2'], {g_srcItem, g_allocItemRt[1], g_itemres, 1} )
	end;
	
	test__createNewItem = function(self)
		self.mm:mock(math, 'min', {10})
		self.mm:mock(self.pkg, '_createNewItemFromRawItem')
		self.mm:mock(self.pkg, '_createNewItemFromExistItem')
		
		local g_itemres = {pile=10}
		local g_srcItem = RawItemEx({resId=1, number=1})
		local g_item = LuaItemEx(self.resItem)
		local g_number = 11
		
		self.pkg:_createNewItem(g_srcItem, g_item, g_itemres, g_number)
		assert ( self.mm.walkLog == 'min,_createNewItemFromRawItem' )
		assertListEQ ( self.mm.params['min'], {g_itemres.pile, g_number} )
		assertListEQ ( self.mm.params['_createNewItemFromRawItem'], {g_srcItem, g_item, g_itemres, 10} )
		
		self.mm:clear()
		g_srcItem = LuaItemEx(self.resItem)
		self.pkg:_createNewItem(g_srcItem, g_item, g_itemres, g_number)
		assert ( self.mm.walkLog == 'min,_createNewItemFromRawItem' )
		
		self.mm:clear()
		g_srcItem = LuaItemEx(self.resItem)
		g_itemres.pile = 1
		self.pkg:_createNewItem(g_srcItem, g_item, g_itemres, g_number)
		assert ( self.mm.walkLog == 'min,_createNewItemFromExistItem' )
		assertListEQ ( self.mm.params['_createNewItemFromExistItem'], {g_srcItem, g_item, g_itemres, 10} )
	end;
	
	test__createNewItemFromRawItem = function(self)
		local g_itemres = {pile=10}
		local g_srcItem = RawItemEx({resId=1001, number=1})
		local g_item = LuaItemEx(self.resItem)
		local g_number = 10
		
		self.mm:mock(UUIDMgr, 'newItemId', {10000})
		self.mm:mock(self.pkg, '_createItemAttrs')
		self.mm:mock(self.pkg, '_bindItem')
		
		self.pkg:_createNewItemFromRawItem(g_srcItem, g_item, g_itemres, g_number)
		assert ( self.mm.walkLog == 'newItemId,_bindItem' )
		assert ( g_item:getResId() == g_srcItem:getResId() )
		assert ( g_item:getNumber() == g_number )
		assert ( g_item:getId() == 10000 )
		assertListEQ ( self.mm.params['_bindItem'], {g_srcItem, g_item, g_itemres} )
		
		self.mm:clear()
		g_itemres.pile = 1
		self.pkg:_createNewItemFromRawItem(g_srcItem, g_item, g_itemres, g_number)
		assert ( self.mm.walkLog == 'newItemId,_bindItem,_createItemAttrs' )
		assert ( g_item:getNumber() == 1 )
		assertListEQ ( self.mm.params['_createItemAttrs'], {g_item, g_itemres} )
	end;
	
	test__createNewItemFromExistItem = function(self)
		local g_itemres = {pile=1}
		local g_srcItem = LuaItemEx(self.resItem)
		local g_item = LuaItemEx(self.resItem)
		local g_number = 10	
		
		g_srcItem:setId(1000)
		g_srcItem:setResId(1001001)
		
		self.pkg:_createNewItemFromExistItem(g_srcItem, g_item, g_itemres, g_number)
		assert ( g_item:getId() == 1000 )
		assert ( g_item:getResId() == 1001001 )
		assert ( g_item:getNumber() == 1 )
	end;
	
	test__bindItem = function(self)
		local g_srcItem = nil
		local g_item = nil
		local g_itemres = nil
		
		local _getParams = function(res)
			g_srcItem = RawItemEx({resId=res.resId,number=1,isBind=res.rawIsBind})
			self.resItem.isBind = 0
			g_item = LuaItemEx(self.resItem)
			g_item:setResId(res.resId)
			g_itemres = {pile=res.pile,isbind=res.isbind, bindid=res.bindid}
			return g_srcItem, g_item, g_itemres
		end;
		
		self.pkg:_bindItem( _getParams({resId=1001, rawIsBind=0, pile=1, isbind=0, bindid=0}) )
		assert ( g_item:getResId() == 1001 )
		assert ( g_item:isBind() == false )
		
		self.pkg:_bindItem( _getParams({resId=1001, rawIsBind=1, pile=1, isbind=1, bindid=1002}) )
		assert ( g_item:getResId() == 1001 )
		assert ( g_item:isBind() == true )

		self.pkg:_bindItem( _getParams({resId=1001, rawIsBind=1, pile=1, isbind=0, bindid=1002}) )
		assert ( g_item:getResId() == 1001 )
		assert ( g_item:isBind() == true )
		
		self.pkg:_bindItem( _getParams({resId=1001, rawIsBind=1, pile=1, isbind=0, bindid=0}) )
		assert ( g_item:getResId() == 1001 )
		assert ( g_item:isBind() == true )
		
		self.pkg:_bindItem( _getParams({resId=1001, rawIsBind=1, pile=10, isbind=0, bindid=0}) )
		assert ( g_item:getResId() == 1001 )
		assert ( g_item:isBind() == true )
	end;
	
	test__allocItem = function(self)
		self.pkg.innerItems.items[0].id = 1
		
		local g_getMaxGridsCntRt = {0}
		self.mm:mock(self.pkg, 'getMaxGridsCnt', g_getMaxGridsCntRt)
		
		assert ( self.pkg:_allocItem() == nil )
		
		g_getMaxGridsCntRt[1] = 1
		local item = self.pkg:_allocItem()
		assert ( item ~= nil )
		assert ( self.pkg:getItemsCount() == 1 )
		assert ( self.pkg:getItemByIdx(0):getId() == 0 )
	end;
	
	test__refreshSalve = function(self)
		local r_min = {0}
		
		self.mm:mock(ItemMsgSender, 'sendSalveMax')

		self.mm:mock(self.pkg, 'getMaxSalveCount', {1000} )
		self.mm:mock(self.pkg, 'getItemNumber', {10} )
		self.mm:mock(self.pkg, 'getOutputSalves', {30} )
		self.mm:mock(math, 'min', r_min )
		self.mm:mock(self.pkg, 'setLastSalveTime' )
		self.mm:mock(self.pkg, 'addItemsNoTip' )
		
		self.pkg:refreshSalve()
		assertEQ ( self.mm.walkLog, 'sendSalveMax,getMaxSalveCount,getItemNumber,getOutputSalves,min,setLastSalveTime' )
		assertEQ ( self.mm.params['sendSalveMax'], {self.player} )
		assertEQ ( self.mm.params['min'], {30, 1000-10} )
		
		self.mm:clear()
		r_min[1] = 20
		self.pkg:refreshSalve()
		assertEQ ( self.mm.walkLog, 'sendSalveMax,getMaxSalveCount,getItemNumber,getOutputSalves,min,setLastSalveTime,addItemsNoTip' )
		assertEQ ( self.mm.params['addItemsNoTip'], { {RawItemEx({resId=FIXID.SALVE, number=20})} } )
	end;
	
	test_getMaxSalveCount = function(self)
		TestCaseCondition:setPreCond(self.player, nil, { builds={ {id=4,resid=FIXID.HOSPITALBUILD,level=0,state=0},{id=5,resid=FIXID.LIANDANLUBUILD,level=20,state=0} } })
		assertEQ ( self.pkg:getMaxSalveCount(), 0 )
		
		TestCaseCondition:setPreCond(self.player, nil, { builds={ {id=4,resid=FIXID.HOSPITALBUILD,level=10,state=0},{id=5,resid=FIXID.LIANDANLUBUILD,level=20,state=0} } })
		assertEQ ( self.pkg:getMaxSalveCount(), 25*10 + 20*20 + 75 )
	end;
	
	test_getSalveOutput = function(self)
		local r_getMaxSalveCount = {1000}
		self.mm:mock(self.pkg, 'getMaxSalveCount', r_getMaxSalveCount )
		assertFloatEQ ( self.pkg:getSalveOutput(), (1000/100)/600 )
	end;
	
	test_getOutputSalves = function(self)
		self.mm:mock(self.pkg, 'getSalveOutput', {10})
		self.pkg.pkg.lastSalveTime = 1
		Util:setTimeDrt(6)
		assertEQ ( self.pkg:getOutputSalves(), (6-1)*10 )
	end;
	
	test_setLastSalveTime = function(self)
		self.pkg.pkg.lastSalveTime = 1
		Util:setTimeDrt(6)
		self.pkg:setLastSalveTime()
		assertEQ ( self.pkg.pkg.lastSalveTime, 6 )
	end;
})


tqPlayerPackage_t_main = function(suite)
	suite:addTestCase(TestCasePlayerPackage, 'TestCasePlayerPackage')
end;


