require('tqMailMgr')

TestCaseMailMgr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.mailMgr = MailMgr(app)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_getMailCount = function(self)
		local expectSQL = "select mailId, receiver, sender, isSys, isRead, title, tempId, addTime, itemCount from mails where receiver='my';"
		local dbRecords = {
			{mailId=1, receiver='receiver1', sender='sender1', isSys=0, isRead=0, title='title1', tempId=0, itemCount=0, addTime=1},
			{mailId=2, receiver='receiver2', sender='sender2', isSys=1, isRead=1, title='title2', tempId=1002, itemCount=0, addTime=2},
		}
		local queryDB = function(sql, dbrows)
			if sql == expectSQL then
				dbrows:setRecords(dbRecords)
			else
				dbrows:setRecords({})
			end
		end;
		app:regDBQuery(queryDB)
		
		self.player:setRoleName('my')
		assert ( self.mailMgr:getMailCount('my') == 2 )
		assert ( self.mailMgr:getBriefMailByIdx(1):getId() == 1 )
		assert ( self.mailMgr:getBriefMailByIdx(2):getId() == 2 )
	end;
	
	test_getMailById = function(self)
		local g_mailId = 1
		
		local g_resItems = {{id=2, resId=3, number=4, isRaw=0, forceLevel=5, attrs={count=1,attrs={{attr=1,val=2,unit=0}} }, gems={count=1,gems={1001}}}}
		local expectSQL = "select * from mails where mailId=1;"
		local dbRecords = {
			{mailId=1, receiver='receiver', sender='sender', isSys=1, isRead=0, title='title', tempId=1001, bcontent='content', itemCount=1, bpkg=toLUAString(g_resItems), addTime=1},
		}
		local queryDB = function(sql, dbrows)
			if sql == expectSQL then
				dbrows:setRecords(dbRecords)
			else
				dbrows:setRecords({})
			end
		end;
		app:regDBQuery(queryDB)
		
		local mail = self.mailMgr:getMailById( g_mailId )
		assert ( mail:getId() == 1 )
		assert ( mail:getReceiver() == 'receiver' )
		assert ( mail:getSender() == 'sender' )
		assert ( mail:isSys() == 1 )
		assert ( mail:isRead() == 0 )
		assert ( mail:getTitle() == 'title' )
		assert ( mail:getTempId() == 1001 )
		assert ( mail:getContent() == 'content' )
		assert ( mail:getTime() == 1 )
	end;
	
	test_addPlayerMail = function(self)
		self.mm:mock(self.mailMgr, '_removeOverdueMail')
		self.mm:mock(self.mailMgr, '_addPlayerMail')
		self.mailMgr:addPlayerMail('sender', 'receiver', 'title', 'content')
		assert ( self.mm.walkLog == '_removeOverdueMail,_addPlayerMail' )
		assertListEQ ( self.mm.params['_removeOverdueMail'], {'receiver'})
		assertListEQ ( self.mm.params['_addPlayerMail'], {'sender', 'receiver', 'title', 'content'})
	end;
	
	test_addSysMail = function(self)
		local g_addItems = {}
		local g_mail = {}
		
		self.mm:mock( self.mailMgr, '_removeOverdueMail' )
		self.mm:mock( self.mailMgr, '_addSysMail', {g_mail} )
		
		assert ( self.mailMgr:addSysMail( 'receiver', 'title', 1, 'content', g_addItems ) == g_mail )
		
		assert ( self.mm.walkLog == '_removeOverdueMail,_addSysMail' )
		assertListEQ ( self.mm.params['_removeOverdueMail'], {'receiver'})
		assertListEQ ( self.mm.params['_addSysMail'], {'receiver', 'title', 1, 'content', g_addItems})
	end;
	
	test_removeOverdueMail_ = function(self)
		Util:setTimeDrt(res_mail_timeout_s + 1)
		self.mailMgr:_removeOverdueMail('myself')
		assert ( getLastSql_t() == "delete from mails where receiver='myself' and itemCount=0 and addTime<1;" )
	end;
	
	test_addPlayerMail_ = function(self)
		local g_mail = {}
		
		self.mm:mock( UUIDMgr, 'newMailId', {1} )
		self.mm:mock( self.mailMgr, '_makeMail', {g_mail} )
		self.mm:mock( self.mailMgr, '_insertMailToDB' )
		
		assert ( self.mailMgr:_addPlayerMail('sender', 'receiver', 'title', 'content') == g_mail )
		assertListEQ ( self.mm.params['_makeMail'], {1, 'sender', 'receiver', 0, 0, 'title', 0, 'content', Util:getTime(), 0} )
		assertListEQ ( self.mm.params['_insertMailToDB'], {g_mail} )
	end;
	
	test_addSysMail_ = function(self)
		local g_addItems = {}
		local g_mail = {}
		
		self.mm:mock( UUIDMgr, 'newMailId', {1} )
		self.mm:mock( self.mailMgr, '_makeMail', {g_mail} )
		self.mm:mock( self.mailMgr, '_addItems' )
		self.mm:mock( self.mailMgr, '_insertMailToDB' )
		
		assert ( self.mailMgr:_addSysMail('receiver', 'title', 1001, 'content', g_addItems) == g_mail )
		
		assert ( self.mm.walkLog == 'newMailId,_makeMail,_addItems,_insertMailToDB' )
		assertListEQ ( self.mm.params['_makeMail'], {1, '', 'receiver', 1, 0, 'title', 1001, 'content', Util:getTime(), 0 })
		assertListEQ ( self.mm.params['_addItems'], {g_mail, g_addItems})
		assertListEQ ( self.mm.params['_insertMailToDB'], {g_mail})
	end;
	
	test_makeMail_ = function(self)
		local g_resItem = {id=2, resId=3, number=4, isRaw=0, forceLevel=5, attrs={count=1,attrs={{attr=3,val=2,unit=1}} }, gems={count=2,gems={1001,1002}}}
		local item = LuaItemEx(g_resItem)
	
		local mail = self.mailMgr:_makeMail(1
			,'sender' ,'receiver' ,1 ,0 ,'title' ,1001 ,'content'
			,2 ,1 ,'{' .. item:toString() .. '}' )
			
		assert ( mail:getId() == 1 )
		assert ( mail:getReceiver() == 'receiver' )
		assert ( mail:getSender() == 'sender' )
		assert ( mail:isSys() == 1 )
		assert ( mail:isRead() == 0 )
		assert ( mail:getTitle() == 'title' )
		assert ( mail:getTempId() == 1001 )
		assert ( mail:getContent() == 'content' )
		assert ( mail:getTime() == 2 )
		assert ( mail:getItemCount() == 1 )
		assert ( mail:getItemByIdx(1):getId() == 2 )
		assert ( mail:getItemByIdx(1):getResId() == 3 )
		assert ( mail:getItemByIdx(1):getNumber() == 4 )
		assert ( mail:getItemByIdx(1):getForceLevel() == 5 )
		assert ( mail:getItemByIdx(1):isRawItem() == false )
		assert ( mail:getItemByIdx(1):getAttrsCount() == 1 )
		assert ( mail:getItemByIdx(1):getGemsCount() == 2 )
	end;
	
	test_addItems_ = function(self)
		local mail = Mail()
		self.mm:mock(mail, 'addItem')
		self.mailMgr:_addItems(mail, nil)
		assert ( self.mm.walkLog == '' )
		
		local g_item1 = {}
		local g_item2 = {}
		self.mailMgr:_addItems(mail, {g_item1, g_item2})
		assert ( self.mm.walkLog == 'addItem,addItem' )
		assertListEQ ( self.mm.params['addItem.1'], {g_item1} )
		assertListEQ ( self.mm.params['addItem.2'], {g_item2} )
	end;
	
	test_addMailToDB_ = function(self)
		local g_resItem = {id=2, resId=3, number=4, isRaw=1, forceLevel=5, attrs={count=0,attrs={} }, gems={count=0,gems={}}}
		local item = RawItemEx(g_resItem)
	
		local mail = self.mailMgr:_makeMail(1
			,'sender', 'receiver', 1, 0, 'title', 1001, 'content'
			,2, 1, '{' .. item:toString() .. '}' )
			
		self.mailMgr:_insertMailToDB(mail)
		local expectSql = "insert into mails values('1','receiver','sender','1','0','title','1001','content','1','{{id=2,resId=3,number=4,isRaw=1,forceLevel=0,isBind=0,attrs={count=0,attrs={}},gems={count=0,gems={}}}}','2');"
		assert ( getLastSql_t() == expectSql )
	end;
	
	test_setReaded = function(self)
		self.mailMgr:setReaded(2)
		assert ( getLastSql_t() == 'update mails set isRead=1 where mailId=2;' )
	end;
	
	test_deleteMail = function(self)
		local expectSQL1 = "select itemCount from mails where mailId=1;"
		local expectSQL2 = "select itemCount from mails where mailId=2;"
		local dbRecords = {
			{itemCount=1},
		}
		local queryDB = function(sql, dbrows)
			if sql == expectSQL1 then
				dbRecords[1].itemCount = 1
				dbrows:setRecords(dbRecords)
			elseif sql == expectSQL2 then
				dbRecords[1].itemCount = 0
				dbrows:setRecords(dbRecords)
			else
				dbrows:setRecords({})
			end
		end;
		app:regDBQuery(queryDB)
		
		assert ( self.mailMgr:deleteMail('my', 0) == MAIL_RET.NOMAIL )
		assert ( getLastSql_t() ~= "delete from mails where receiver='my' and mailId=0;" )
		
		assert ( self.mailMgr:deleteMail('my', 1) == MAIL_RET.DELETEHASITEMS )
		assert ( getLastSql_t() ~= "delete from mails where receiver='my' and mailId=1;" )
		
		assert ( self.mailMgr:deleteMail('my', 2) == MAIL_RET.OK )
		assert ( getLastSql_t() == "delete from mails where receiver='my' and mailId=2;" )
	end;
	
	test_clearItems = function(self)
		local mail = Mail()
		mail:setId(1)
		mail:addItem({})
		assert ( mail:getItemCount() == 1 )
		
		self.mailMgr:clearItems( 'receiver', mail )
		assert ( mail:getItemCount() == 0 )
		assert ( getLastSql_t() == "update mails set itemCount=0, bpkg='{}' where receiver='receiver' and mailId=1;" )
	end;
})

tqMailMgr_t_main = function(suite)
	suite:addTestCase(TestCaseMailMgr, 'TestCaseMailMgr')
end;
	



