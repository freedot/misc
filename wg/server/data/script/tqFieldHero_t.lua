require('tqFieldHero')

local TestCaseFieldHero = TestCase:extends({
	setUp = function(self)
		self.hero = FieldHero()
		self.bak_res_fieldheros = res_fieldheros
	end;
	
	tearDown = function(self)
		res_fieldheros = self.bak_res_fieldheros
	end;
	
	test_getIcon = function(self)
		assert ( self.hero:getIcon() > 100 )
	end;
	
	test_setIcon = function(self)
		self.hero:setIcon(101)
		assertEQ (  self.hero:getIcon() , 101 )
		self.hero:setIcon(102)
		assertEQ (  self.hero:getIcon() , 102 )
	end;
	
	testSetId = function(self)
		self.hero:setId(1)
		assert ( self.hero:getId() == 1 )
	end;
	
	testSetAttrVal = function(self)
		self.hero:setAttrVal(ATTR.CO, 1)
		assert( self.hero:getAttrVal(ATTR.CO) == 1 )
	end;
	
	test_bindSoldier = function(self)
		self.hero:setAttrVal(ATTR.CO, 10)
	
		local innerSoldier = {resid=150001001, number=2}
		self.hero:bindSoldier(innerSoldier)
		assert(self.hero:getSoldier().resid == 150001001)
		assert(self.hero:getSoldier().number == 2)
		
		self.hero:subSoldierNumber(1)
		assert ( innerSoldier.number == 1 )
	end;
	
	testCarrySoldier = function(self)
		self.hero:setAttrVal(ATTR.CO, 10)
		self.hero:carrySoldier({resid=150001001, number=11})
		assert(self.hero:getSoldier().resid == 150001001)
		assert(self.hero:getSoldier().number == 10)
	end;
	
	testAddSoldierNumber = function(self)
		self.hero:setAttrVal(ATTR.CO, 10)
		self.hero:carrySoldier({resid=150001001, number=9})
		assert(self.hero:getSoldier().number == 9)
		self.hero:addSoldierNumber(2)
		assert(self.hero:getSoldier().number == 10)
	end;
	
	testSubSoldierNumber = function(self)
		self.hero:setAttrVal(ATTR.CO, 10)
		self.hero:carrySoldier({resid=150001001, number=11})
		self.hero:subSoldierNumber(1)
		assert(self.hero:getSoldier().number == 9)
		self.hero:subSoldierNumber(10)
		assert(self.hero:getSoldier().number == 0)
	end;
	
	testInitByRes = function(self)
		res_fieldheros={{id=7600001,level=10,agile=30,phy=40,str=50,prof=HERO_PROF.DAOJIANG,soldiernum=5,singlefightcap=20,fightcap=100,maxnum=5,soldierlevel=1}}
		self.hero:setResId(7600001)
		assert(self.hero:getLevel() == 10)
		assert(self.hero:getProf() == HERO_PROF.DAOJIANG)
		assert(self.hero:getSoldier().resid == FIXID.DAOBING*1000+1)
		assert(self.hero:getSoldier().number == 5)
		assert(self.hero:getAttrVal(ATTR.HEALTH) == 100)
		assert(self.hero:getAttrVal(ATTR.MHEALTH) == 100)
		assert(self.hero:getAttrVal(ATTR.MO) == 100)
		assert(self.hero:getAttrVal(ATTR.MMO) == 100)		
		assert(self.hero:getAttrVal(ATTR.IF) == 0)		
		assert(self.hero:getAttrVal(ATTR.CO) == 5)
		assert(self.hero:getAttrVal(ATTR.FC) == 100)
		assert(self.hero:getAttrVal(ATTR.SFC) == 20)
		assert(self.hero:getAttrVal(ATTR.AG_B) + self.hero:getAttrVal(ATTR.AG_A)== 30)
		assert(self.hero:getAttrVal(ATTR.HI) == res_calchero_hit_attr(HERO_PROF.DAOJIANG, 30, 0, 100, 0) )
		assert(self.hero:getAttrVal(ATTR.HU) == res_calchero_hurt_attr(HERO_PROF.DAOJIANG, 50, 0, 100, 0) )
		assert(self.hero:getAttrVal(ATTR.DE) == res_calchero_def_attr(HERO_PROF.DAOJIANG, 40, 0, 100, 0) )
		assert(self.hero:getAttrVal(ATTR.ES) == res_calchero_esc_attr(HERO_PROF.DAOJIANG, 30, 0, 100, 0) )
		assert(self.hero:getAttrVal(ATTR.BER) == res_calchero_batkper_attr(HERO_PROF.DAOJIANG, 30, 0, 100, 0) )
		assert(self.hero:getAttrVal(ATTR.MPS) == res_calchero_maxphy_attr(HERO_PROF.DAOJIANG, 40, 0, 100, 0) )
		assert(self.hero:getSubject(0) == 3)
		assert(self.hero:getSubject(1) == 1)
		assert(self.hero:getSubject(2) == 1)
		assert(self.hero:getSubject(3) == 2)
		assert(self.hero:getSubject(4) == 1)
		
		res_fieldheros={{id=7600001,level=10,agile=30,phy=40,str=50,prof=HERO_PROF.DAOJIANG,soldiernum=0,maxnum=5,soldierlevel=1}}
		self.hero:setResId(7600001)
		assert(self.hero:getSoldier().resid == 0)
		assert(self.hero:getSoldier().number == 0)
		
		res_fieldheros={{id=7600001,level=10,agile=30,phy=40,str=50,prof=HERO_PROF.YONGSHI, soldiernum=5,maxnum=5,soldierlevel=1}}
		self.hero:setResId(7600001)
		assert(self.hero:getSoldier().resid == 0)
		assert(self.hero:getSoldier().number == 0)
	end;
	
	testGetName = function(self)
		self.hero:initBaseInfo({level=10,prof=HERO_PROF.YONGSHI})
		assert ( self.hero:getName() == string.format(rstr.fieldhero.levelname, 10, rstr.herotypenames[HERO_PROF.YONGSHI]) )
		
		self.hero:initBaseInfo({level=11,prof=HERO_PROF.DAOJIANG})
		assert ( self.hero:getName() == string.format(rstr.fieldhero.levelname, 11, rstr.herotypenames[HERO_PROF.DAOJIANG]) )
	end;
	
	test_setName = function(self)
		self.hero:setName('hero')
		assertEQ ( self.hero:getName(), 'hero' )
	end;
	
	testSetSoldierNumber = function(self)
		self.hero:setAttrVal(ATTR.CO, 10)
		self.hero:initBaseInfo({level=10,prof=HERO_PROF.YONGSHI})
		self.hero:setSoldierNumber(-1)
		assert ( self.hero:getSoldierNumber() == 0 )
		
		self.hero:setSoldierNumber(1)
		assert ( self.hero:getSoldierNumber() == 1 )
		
		self.hero:setSoldierNumber(11)
		assert ( self.hero:getSoldierNumber() == 10 )
	end;
	
	testGetAdaptableFactor = function(self)
		assert ( self.hero:getAdaptableFactor() == 0 )
		
		self.hero:initBaseInfo({level=10,prof=HERO_PROF.YONGSHI})
		self.hero:setAttrVal(ATTR.CO, 10)
		self.hero:carrySoldier({resid=150001001, number=1})
		assert ( self.hero:getAdaptableFactor() > 0 )
	end;
	
	test_getAttrRawVal = function(self)
		res_fieldheros={{id=7600001,level=10,agile=30,phy=40,str=50,prof=HERO_PROF.DAOJIANG,soldiernum=5,fightcap=100,maxnum=5,soldierlevel=1}}
		self.hero:setResId(7600001)
		assertEQ ( self.hero:getAttrRawVal(ATTR.HEALTH), 100*ATTR_PRECISION)
		assertEQ ( self.hero:getAttrRawVal(ATTR.MHEALTH), 100)
	end;
	
	test_getAttrVal = function(self)
		res_fieldheros={{id=7600001,level=10,agile=30,phy=40,str=50,prof=HERO_PROF.DAOJIANG,soldiernum=5,fightcap=100,maxnum=5,soldierlevel=1}}
		self.hero:setResId(7600001)
		assertEQ ( self.hero:getAttrVal(ATTR.HEALTH), 100)
		assertEQ ( self.hero:getAttrVal(ATTR.MHEALTH), 100)
	end;
	
	test__needPrecisionFormat = function(self)
		assertEQ ( self.hero:_needPrecisionFormat(ATTR.HEALTH), true )
		assertEQ ( self.hero:_needPrecisionFormat(ATTR.MHEALTH), false )
	end;
})

tqFieldHero_t_main = function(suite)
	suite:addTestCase(TestCaseFieldHero, 'TestCaseFieldHero')
end;


