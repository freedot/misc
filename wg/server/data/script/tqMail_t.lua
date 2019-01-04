--*******************************************************************************
--  Copyright (C) 2012 Blue Dot Game Studios (BDGS).  All rights reserved.
--*******************************************************************************
require('tqMail')

local TestCaseMail = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.mail = Mail()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_setId = function(self)
		assert ( self.mail:getId() == 0 )
		self.mail:setId(1)
		assert ( self.mail:getId() == 1 )
	end;
	
	test_setReceiver = function(self)
		assert ( self.mail:getReceiver() == '' )
		self.mail:setReceiver('me')
		assert ( self.mail:getReceiver() == 'me' )
	end;
	
	test_setSender = function(self)
		assert ( self.mail:getSender() == '' )
		self.mail:setSender('you')
		assert ( self.mail:getSender() == 'you' )
	end;
	
	test_setSysFlag = function(self)
		assert ( self.mail:isSys() == 0 )
		self.mail:setSysFlag(1)
		assert ( self.mail:isSys() == 1 )
	end;
	
	test_setReadFlag = function(self)
		assert ( self.mail:isRead() == 0 )
		self.mail:setReadFlag(1)
		assert ( self.mail:isRead() == 1 )
	end;
	
	test_setTitle = function(self)
		assert ( self.mail:getTitle() == '' )
		self.mail:setTitle('title')
		assert ( self.mail:getTitle() == 'title' )
	end;
	
	test_setTempId = function(self)
		assert ( self.mail:getTempId() == 0 )
		self.mail:setTempId(1001)
		assert ( self.mail:getTempId() == 1001 )
	end;
	
	test_setContent = function(self)
		assert ( self.mail:getContent() == '' )
		self.mail:setContent('content')
		assert ( self.mail:getContent() == 'content' )
	end;
	
	test_setTime = function(self)
		assert ( self.mail:getTime() == 0 )
		self.mail:setTime(1)
		assert ( self.mail:getTime() == 1 )
	end;
	
	test_getItems = function(self)
		assert ( self.mail:getItems() == self.mail.items )
	end;
	
	test_clearItems = function(self)
		self.mail:addItem({})
		assert ( self.mail:getItemCount() == 1 )
		self.mail:clearItems()
		assert ( self.mail:getItemCount() == 0 )
	end;
	
	test_addItem = function(self)
		assert ( self.mail:getItemCount() == 0 )
		local g_resItem = {id=1, resId=2, number=3, attrs={count=1,attrs={{attr=1,val=2,unit=0}}}, gems={count=1,gems={1001}} }
		
		self.mail:addItem( LuaItemEx(g_resItem) )
		
		assert ( self.mail:getItemCount() == 1 )
		
		local item = self.mail:getItemByIdx(1)
		assert ( item:getId() == 1 )
		assert ( item:getResId() == 2 )
		assert ( item:getNumber() == 3 )
		assert ( item:getAttrsCount() == 1 )
		
		assert ( item:getAttrByIdx(0).attr == 1 )
		assert ( item:getAttrByIdx(0).val == 2 )
		assert ( item:getAttrByIdx(0).unit == 0 )
		
		assert ( item:getGemsCount() == 1 )
		assert ( item:getGemByIdx(0) == 1001 )
	end;
	
	test_itemsToString = function(self)
		assert ( self.mail:itemsToString() == '{}' )
		local g_resItem = {id=1, resId=2, number=3, forceLevel=4, attrs={count=1,attrs={{attr=1,val=2,unit=0}}}, gems={count=2,gems={1001,1002}} }
		self.mail:addItem( LuaItemEx(g_resItem) )
		
		local g_resItem = {id=2, resId=3, number=4, forceLevel=5, attrs={count=1,attrs={{attr=4,val=3,unit=1}}}, gems={count=3,gems={1001,1002,1003}} }
		self.mail:addItem( LuaItemEx(g_resItem) )
		assert ( self.mail:itemsToString() == '{{id=1,resId=2,number=3,isRaw=0,forceLevel=4,isBind=0,attrs={count=1,attrs={{attr=1,val=2,unit=0}}},gems={count=2,gems={1001,1002}}},{id=2,resId=3,number=4,isRaw=0,forceLevel=5,isBind=0,attrs={count=1,attrs={{attr=4,val=3,unit=1}}},gems={count=3,gems={1001,1002,1003}}}}' )
	end;
})


tqMail_t_main = function(suite)
	suite:addTestCase(TestCaseMail, 'TestCaseMail')
end;


