/*******************************************************************************/
require('./FirstRewardHero.js')
TestCaseFirstRewardHero = JTestCase.ex({
	setUp : function(){
		TestCaseHelper.setUp(this);
		this.dlg = FirstRewardHero.snew(this.g);
	}
	
	,tearDown : function(){
		TestCaseHelper.tearDown(this);
	}
	
	,helper_mockEffect : function(){
		this.mm.nologMock(this.g.getWinSizer(), 'getValidClientSize', [{cx:1000,cy:800}] );
		var objRes = {type:'anim', pos:{x:1, y:2}, animId:100006};
		this.anim = this.g.getAnimMgr().alloc(objRes.animId);
		this.mm.mock(this.g.getAnimMgr(), 'alloc', [this.anim]);
		this.mm.mock(this.anim, 'setZIndex');
		this.mm.mock(this.anim, 'setPosition');
		this.mm.mock(this.anim, 'play');
	}
	
	,helper_stopEffectAndOpenDlg : function(){
		this.helper_mockEffect();
		this.dlg.start();
		this.anim.stop();
	}
	
	,test_start : function(){
		this.mm.mock(UIM.getDlg('npc'), 'openDlg');		
		
		//this.helper_mockEffect();
		this.dlg.start();
		
		var params = this.mm.params['openDlg'][0];
		assertEQ ( params.desc, rstr.firstRewardHero.desc );
		assertEQ ( params.ops, rstr.firstRewardHero.ops );
		
		
		//assertEQ ( this.mm.params['alloc'], [3] );
		//assertEQ ( this.mm.params['setZIndex'], [1000000] );
		//assertEQ ( this.mm.params['setPosition'], [{x:500, y:300}] );
		//assertEQ ( this.mm.walkLog, 'alloc,setZIndex,setPosition,play' );
	}
	
	,test_openDlg : function() {
		this.mm.mock(UIM.getDlg('npc'), 'openDlg');		
		
		this.helper_stopEffectAndOpenDlg();
		
		var params = this.mm.params['openDlg'][0];
		assertEQ ( params.desc, rstr.firstRewardHero.desc );
		assertEQ ( params.ops, rstr.firstRewardHero.ops );
	}
	
	,test_selectOption : function(){
		this.mm.mock(RewardSender, 'sendFirstHero' );
		this.helper_stopEffectAndOpenDlg();
		UIM.getDlg('npc').getItems().opslist.clickItem(null, 0);
		assertEQ ( this.mm.params['sendFirstHero'], [ this.g, 0 ] );
		assertEQ ( UIM.getDlg('npc').isShow(), false);
	}
});

tqFirstRewardHero_t_main = function(suite) {
	suite.addTestCase(TestCaseFirstRewardHero, 'TestCaseFirstRewardHero');
};
