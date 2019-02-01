require('./tqFarmHandler.js');
require('./tqInBuildHandler.js');

TestCaseCityLevelUtil = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
	};

	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.testCityLevelAndBlockCnt = function(){
		var bak_res = res_maincity_inbuildnums;
		res_maincity_inbuildnums = [{clevel:0, cnt:10},{clevel:3, cnt:15},{clevel:8, cnt:20},{clevel:10, cnt:25},{clevel:12, cnt:30}];
		
		assert(CityLevelUtil.getCityLevelByCanUseBlockIdx(16) == 8);
		assert(CityLevelUtil.getCityLevelByCanUseBlockIdx(0) == 0);
		assert(CityLevelUtil.getCityLevelByCanUseBlockIdx(20) == 10);
		assert(CityLevelUtil.getCityLevelByCanUseBlockIdx(19) == 8);
		assert(CityLevelUtil.getCityLevelByCanUseBlockIdx(30) == 100);
		assert(CityLevelUtil.getCityLevelByCanUseBlockIdx(29) == 12);
		
		assert(CityLevelUtil.getBlocksCntByCityLevel(0) == 10);
		assert(CityLevelUtil.getBlocksCntByCityLevel(1) == 10);
		assert(CityLevelUtil.getBlocksCntByCityLevel(5) == 15);
		assert(CityLevelUtil.getBlocksCntByCityLevel(8) == 20);
		assert(CityLevelUtil.getBlocksCntByCityLevel(12) == 30);
		assert(CityLevelUtil.getBlocksCntByCityLevel(100) == 30);
		
		res_maincity_inbuildnums = bak_res;
	};
});


tqInBuildHandler_t_main = function(suite) {
	suite.addTestCase(TestCaseCityLevelUtil, 'TestCaseCityLevelUtil');
};
