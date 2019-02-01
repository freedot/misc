require('./fulljslint.js')
require('./all_t_base.js')

var lasttime = new Date().getTime();

require('./pub_t.js');
require('./tqTQ_t');
require('./all_t_scriptlist.js');

requireTestFiles();
resetCurTestCases(process.argv[2]);
printMissingSemicolonErrors(process.argv[2]);

//-- init global obj -- start
SelfFieldUtil.initOneTime(g_app);
CityBuildUtil.initOneTime(g_app);
//HDRM.initOneTime(g_app);
UIM.initOneTime(g_app);
TTIP.create(g_app);
TIPM.init(g_app);
SkillManager.initOneTime(g_app);
SkillPhaseFactory.initOneTime(g_app);
StateFactory.initOneTime(g_app);
EffectManager.initOneTime(g_app);
HeroNameColorGetter.initOneTime(g_app);
HeroNAttrFactorColorGetter.initOneTime(g_app);
FixTimer.initOneTime(g_app);
Payment.initOneTime(g_app);
HelpGuider.initOneTime(g_app);
SoundMgr.initOneTime(g_app);
RStrUtil.initOneTime(g_app);
//HDRM.initOneTime(g_app);
//-- init global obj -- end

var curtime = new Date().getTime();
var s1 = (curtime - lasttime)/1000;
lasttime = curtime;
var suite = TestSuite.snew();

//process.argv.length
if ( g_curtestsuite == '' ) {
	if ( process.argv.length == 4 ) {
		var pageIdx = process.argv[3];
		var pageCount = 4;
		var onePageNumber = Math.ceil(g_testsuites.length / pageCount);
		var fromIdx = pageIdx*onePageNumber;
		var count = onePageNumber;
		if ( fromIdx + count > g_testsuites.length ) {
			count = g_testsuites.length - fromIdx;
		}
		addTestsuites(suite, fromIdx, count);
	}
}

curtime = new Date().getTime();
var s2 = (curtime - lasttime)/1000;
lasttime = curtime;

addTestsuite(suite, g_curtestsuite);
var result = suite.run(null, g_curtestcases);
curtime = new Date().getTime();
var s3 = (curtime - lasttime)/1000;

print('--------------------------------------');
print(result.summary()+'   sec '+parseInt((s1+s2+s3),10)+'(s1:'+s1+',s2:'+s2+',s3:'+s3+')');
print('--------------------------------------');

