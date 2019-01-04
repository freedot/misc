--*******************************************************************************
--*******************************************************************************
require('tqNetCmdHerosHdr')

local TestCaseNetCmdHerosHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		TestCaseHelper:createHero(self)
		self.hdr = NetCmdHerosHdr()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handleParam = function(self)
		assert ( self.hdr:handleParam( self.player, {count=0} ) == false )
		assert ( self.hdr:handleParam( self.player, {count=NETCMDHEROS_MAX_COUNT+1} ) == false )
		
		assert ( self.hdr:handleParam( self.player, {count=3, hid1=0, hid2=self.hero:getId()} ) == true )
		assert ( self.hdr:getHerosCount() == 1 )
		assert ( self.hdr:getHeros()[1] == self.hero )
		assert ( self.hdr:getHeroIdsCount() == 3 )
		assert ( self.hdr:getHeroIds()[1] == 0 )
		assert ( self.hdr:getHeroIds()[2] == 1 )
		assert ( self.hdr:getHeroIds()[3] == 0 )
		
		assert ( self.hdr:handleParam( self.player, {count=3, hid1=0, hid2=self.hero:getId()}, 2 ) == false )
		assert ( self.hdr:handleParam( self.player, {count=3, hid1=0, hid2=self.hero:getId()}, 3 ) == true )
	end;
	
	test_isEmptyHeros = function(self)
		self.hdr:handleParam( self.player, {count=0} )
		assert ( self.hdr:isEmptyHeros() == true )
		
		self.hdr:handleParam( self.player, {count=3, hid1=0, hid2=self.hero:getId()} )
		assert ( self.hdr:isEmptyHeros() == false )
	end;
	
	test_hasBusyHeros = function(self)
		self.hdr:handleParam( self.player, {count=3, hid1=0, hid2=self.hero:getId()} )
		assert ( self.hdr:hasBusyHeros() == false )
		
		self.hero:setState(HERO_STATE.EXPED)
		assert ( self.hdr:hasBusyHeros() == true )
		assert ( self.hdr:hasBusyHeros({[HERO_STATE.EXPED]=true}) == false )
	end;
	
	test_hasRepeatHeros = function(self)
		self.hdr:handleParam( self.player, {count=3, hid1=0, hid2=self.hero:getId() } )
		assert ( self.hdr:hasRepeatHeros() == false )
		
		self.hdr:handleParam( self.player, {count=3, hid1=0, hid2=self.hero:getId(), hid3=self.hero:getId() } )
		assert ( self.hdr:hasRepeatHeros() == true )
	end;
	
	test_hasDeepWoundHeros = function(self)
		self.hdr:handleParam( self.player, {count=3, hid1=0, hid2=self.hero:getId() } )
		assert ( self.hdr:hasDeepWoundHeros() == false )
		
		self.hero:setAttrVal(ATTR.HEALTH, 20)
		assert ( self.hdr:hasDeepWoundHeros() == true )
	end;
	
	test_hasEmptyCarrySoldierHeros = function(self)
		self.hdr:handleParam( self.player, {count=3, hid1=0, hid2=self.hero:getId() } )
		assert ( self.hdr:hasEmptyCarrySoldierHeros() == true )
		
		self.hero:carrySoldier({resid=150001001, number=1})
		assert ( self.hdr:hasEmptyCarrySoldierHeros() == false )
	end;
})


tqNetCmdHerosHdr_t_main = function(suite)
	suite:addTestCase(TestCaseNetCmdHerosHdr, 'TestCaseNetCmdHerosHdr')
end;


