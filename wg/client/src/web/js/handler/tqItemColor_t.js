requireEx('./handler/tqItemColor.js', [
	{
		start:'//HeroNAttrColorGetter-unittest-start'
		,end:'//HeroNAttrColorGetter-unittest-end'
		,items:['_getColor']
	}
	,{
		start:'//HeroNAttrFactorColorGetter-unittest-start'
		,end:'//HeroNAttrFactorColorGetter-unittest-end'
		,items:['_getColor','_getLevel','_getNatureFactor']
	}
]);


TestCaseHeroNAttrColorGetter = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		res_heronature_max_attrs[HERO_PROF.DAOJIANG][ATTR.NST] = 135;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_getColor = function(){
		var r_getLevel = [0];
		this.mm.mock(HeroNAttrColorGetter, 'getLevel', r_getLevel);
		assert ( HeroNAttrColorGetter.lc()._getColor(HERO_PROF.DAOJIANG, ATTR.NST, 90) == ITEM_COLORS[0] );
		assertEQ ( this.mm.params['getLevel'], [HERO_PROF.DAOJIANG, ATTR.NST, 90] );
		
		r_getLevel[0] = 1;
		assert ( HeroNAttrColorGetter.lc()._getColor(HERO_PROF.DAOJIANG, ATTR.NST, 90) == ITEM_COLORS[0] );
		
		r_getLevel[0] = 2;
		assert ( HeroNAttrColorGetter.lc()._getColor(HERO_PROF.DAOJIANG, ATTR.NST, 90) == ITEM_COLORS[1] );
	};
	
	this.test_getLevel = function(){
		assert ( HeroNAttrColorGetter.getLevel(HERO_PROF.DAOJIANG, ATTR.NST, 90) == 1 );
		assert ( HeroNAttrColorGetter.getLevel(HERO_PROF.DAOJIANG, ATTR.NST, 98) == 1 );
		assert ( HeroNAttrColorGetter.getLevel(HERO_PROF.DAOJIANG, ATTR.NST, 99) == 2 );
		assert ( HeroNAttrColorGetter.getLevel(HERO_PROF.DAOJIANG, ATTR.NST, 107) == 2 );
		assert ( HeroNAttrColorGetter.getLevel(HERO_PROF.DAOJIANG, ATTR.NST, 108) == 3 );
		assert ( HeroNAttrColorGetter.getLevel(HERO_PROF.DAOJIANG, ATTR.NST, 116) == 3 );
		assert ( HeroNAttrColorGetter.getLevel(HERO_PROF.DAOJIANG, ATTR.NST, 117) == 4 );
		assert ( HeroNAttrColorGetter.getLevel(HERO_PROF.DAOJIANG, ATTR.NST, 125) == 4 );
		assert ( HeroNAttrColorGetter.getLevel(HERO_PROF.DAOJIANG, ATTR.NST, 126) == 5 );
		assert ( HeroNAttrColorGetter.getLevel(HERO_PROF.DAOJIANG, ATTR.NST, 134) == 5 );
		assert ( HeroNAttrColorGetter.getLevel(HERO_PROF.DAOJIANG, ATTR.NST, 135) == 5 );
	};
	
	this.test_getColorVal = function(){
		assert ( HeroNAttrColorGetter.getColorVal(HERO_PROF.DAOJIANG, ATTR.NST, 91) == TQ.formatColorStr(91, ITEM_COLORS[0]) );
	};
});

TestCaseHeroNAttrFactorColorGetter = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_getColorVal = function(){
		var hero = {prof:2, attrs:{}};
		hero.attrs[ATTR.NAG] = {val:90};
		hero.attrs[ATTR.NPH] = {val:90};
		hero.attrs[ATTR.NST] = {val:90};
		assert ( HeroNAttrFactorColorGetter.getColorVal(hero) == TQ.formatColorStr(3.3, ITEM_COLORS[0]) );
	};	
	
	this.test_getColor = function(){
		assert ( HeroNAttrFactorColorGetter.lc()._getColor(3.0) == ITEM_COLORS[0] );
		assert ( HeroNAttrFactorColorGetter.lc()._getColor(3.3) == ITEM_COLORS[0] );
		assert ( HeroNAttrFactorColorGetter.lc()._getColor(12.2) == ITEM_COLORS[1] );
	};
	
	this.test_isMaxVal = function(){
		var hero = {prof:1, attrs:{}};
		hero.attrs[ATTR.NAG] = {val:145};
		hero.attrs[ATTR.NPH] = {val:145};
		hero.attrs[ATTR.NST] = {val:145};
		assertEQ ( HeroNAttrFactorColorGetter.isMaxVal(hero), true );
		
		hero.attrs[ATTR.NST] = {val:100};
		assertEQ ( HeroNAttrFactorColorGetter.isMaxVal(hero), false );
	};
	
	this.test__getLevel = function(){
		assert ( HeroNAttrFactorColorGetter.lc()._getLevel(3) == 0 );
		assert ( HeroNAttrFactorColorGetter.lc()._getLevel(3.3) == 1 );
		assert ( HeroNAttrFactorColorGetter.lc()._getLevel(12.1) == 1 );
		assert ( HeroNAttrFactorColorGetter.lc()._getLevel(12.2) == 2 );
		assert ( HeroNAttrFactorColorGetter.lc()._getLevel(13.2) == 2 );
		assert ( HeroNAttrFactorColorGetter.lc()._getLevel(13.3) == 3 );
		assert ( HeroNAttrFactorColorGetter.lc()._getLevel(14.3) == 3 );
		assert ( HeroNAttrFactorColorGetter.lc()._getLevel(14.4) == 4 );
		assert ( HeroNAttrFactorColorGetter.lc()._getLevel(15.4) == 4 );
		assert ( HeroNAttrFactorColorGetter.lc()._getLevel(15.5) == 5 );
		assert ( HeroNAttrFactorColorGetter.lc()._getLevel(16.5) == 5 );
		assert ( HeroNAttrFactorColorGetter.lc()._getLevel(16.6) == 0 );
	};
	
	this.test__getNatureFactor = function(){
		var hero = {prof:2, attrs:{}};
		hero.attrs[ATTR.NAG] = {val:90};
		hero.attrs[ATTR.NPH] = {val:90};
		hero.attrs[ATTR.NST] = {val:90};
		assertEQ ( HeroNAttrFactorColorGetter.lc()._getNatureFactor(hero),  '3.3');
		
		hero.prof = 1;
		hero.attrs[ATTR.NAG] = {val:145};
		hero.attrs[ATTR.NPH] = {val:145};
		hero.attrs[ATTR.NST] = {val:145};
		assertEQ ( HeroNAttrFactorColorGetter.lc()._getNatureFactor(hero),  '16.5');
		
		hero.prof = 1;
		hero.attrs[ATTR.NAG] = {val:145};
		hero.attrs[ATTR.NPH] = {val:125};
		hero.attrs[ATTR.NST] = {val:90};
		assertEQ ( HeroNAttrFactorColorGetter.lc()._getNatureFactor(hero),  (5*1.1 + 4*1.1 + 1*1.1).toFixed(1));
		
		hero.prof = 2;
		hero.attrs[ATTR.NPH] = {val:150};
		hero.attrs[ATTR.NAG] = {val:145};
		hero.attrs[ATTR.NST] = {val:135};
		assertEQ ( HeroNAttrFactorColorGetter.lc()._getNatureFactor(hero),  '16.5');
		
		hero.prof = 2;
		hero.attrs[ATTR.NPH] = {val:150};
		hero.attrs[ATTR.NAG] = {val:145-12};
		hero.attrs[ATTR.NST] = {val:135-20};
		assertEQ ( HeroNAttrFactorColorGetter.lc()._getNatureFactor(hero),  (5*1.2 + 4*1.1 + 3*1.0).toFixed(1));
	};	
});

TestCaseSubjectColorGetter = TestCase.extern(function(){
	this.setUp = function(){
		this.g = g_app;
	};
	
	this.tearDown = function(){
		TestCaseHelper.clearAll();
	};
	
	this.test_getColorVal = function(){
		assert ( SubjectColorGetter.getColorVal(0) == TQ.formatColorStr(rstr.herodlg.lbl.subjectlevel[0], ITEM_COLORS[0]) );
		assert ( SubjectColorGetter.getColorVal(1) == TQ.formatColorStr(rstr.herodlg.lbl.subjectlevel[1], ITEM_COLORS[1-1]) );
		assert ( SubjectColorGetter.getColorVal(2) == TQ.formatColorStr(rstr.herodlg.lbl.subjectlevel[2], ITEM_COLORS[2-1]) );
	};
});

TestCaseItemNameColorGetter =  TestCase.extern(function(){
	this.setUp = function(){
		this.g = g_app;
	};
	
	this.tearDown = function(){
		TestCaseHelper.clearAll();
	};
	
	this.test_getColorVal = function(){
		assert ( ItemNameColorGetter.getColorVal(null, 'name') == TQ.formatColorStr('name', ITEM_COLORS[0]) );
		assert ( ItemNameColorGetter.getColorVal(0, 'name') == TQ.formatColorStr('name', ITEM_COLORS[0]) );
		assert ( ItemNameColorGetter.getColorVal(1, 'name') == TQ.formatColorStr('name', ITEM_COLORS[0]) );
		assert ( ItemNameColorGetter.getColorVal(2, 'name') == TQ.formatColorStr('name', ITEM_COLORS[1]) );
	};
});

TestCaseHeroNameColorGetter = TestCase.extern(function(){
	this.setUp = function(){
		this.g = g_app;
	};
	
	this.tearDown = function(){
		TestCaseHelper.clearAll();
	};
	
	this.test_getColorName = function(){
		var hero = {name:'hero1', attrs:{}};
		hero.attrs[ATTR.IF] = {val:49};
		assertEQ ( HeroNameColorGetter.getColorName(hero), TQ.formatColorStr('hero1', HERO_COLORS[0]) );
			
		hero.attrs[ATTR.IF].val = 50;
		assertEQ ( HeroNameColorGetter.getColorName(hero), TQ.formatColorStr('hero1', HERO_COLORS[1]) );
		hero.attrs[ATTR.IF].val = 150 - 1;
		assertEQ ( HeroNameColorGetter.getColorName(hero), TQ.formatColorStr('hero1', HERO_COLORS[1]) );
			
		hero.attrs[ATTR.IF].val = 150;
		assertEQ ( HeroNameColorGetter.getColorName(hero), TQ.formatColorStr('hero1', HERO_COLORS[2]) );
		hero.attrs[ATTR.IF].val = 250 - 1;
		assertEQ ( HeroNameColorGetter.getColorName(hero), TQ.formatColorStr('hero1', HERO_COLORS[2]) );
		
		hero.attrs[ATTR.IF].val = 250;
		assertEQ ( HeroNameColorGetter.getColorName(hero), TQ.formatColorStr('hero1', HERO_COLORS[3]) );
		hero.attrs[ATTR.IF].val = 350 - 1;
		assertEQ ( HeroNameColorGetter.getColorName(hero), TQ.formatColorStr('hero1', HERO_COLORS[3]) );
		
		hero.attrs[ATTR.IF].val = 350;
		assertEQ ( HeroNameColorGetter.getColorName(hero), TQ.formatColorStr('hero1', HERO_COLORS[4]) );
		hero.attrs[ATTR.IF].val = 450 - 1;
		assertEQ ( HeroNameColorGetter.getColorName(hero), TQ.formatColorStr('hero1', HERO_COLORS[4]) );
		
		hero.attrs[ATTR.IF].val = 450;
		assertEQ ( HeroNameColorGetter.getColorName(hero), TQ.formatColorStr('hero1', HERO_COLORS[5]) );
		hero.attrs[ATTR.IF].val = 9999;
		assertEQ ( HeroNameColorGetter.getColorName(hero), TQ.formatColorStr('hero1', HERO_COLORS[5]) );
	};
});

tqItemColor_t_main = function(suite) {
	suite.addTestCase(TestCaseHeroNAttrColorGetter, 'TestCaseHeroNAttrColorGetter');
	suite.addTestCase(TestCaseSubjectColorGetter, 'TestCaseSubjectColorGetter');
	suite.addTestCase(TestCaseItemNameColorGetter, 'TestCaseItemNameColorGetter');
	suite.addTestCase(TestCaseHeroNAttrFactorColorGetter, 'TestCaseHeroNAttrFactorColorGetter');
	suite.addTestCase(TestCaseHeroNameColorGetter, 'TestCaseHeroNameColorGetter');
};