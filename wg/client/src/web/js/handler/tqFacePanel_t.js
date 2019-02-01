/*******************************************************************************/
requireEx('./handler/tqFacePanel.js', [
	{
		start:'//FacePanel-unittest-start'
		,end:'//FacePanel-unittest-end'
		,items:[]
	}
]);

TestCaseFaceUtil = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.faceUtil = FaceUtil.snew(this.g);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		assertEQ ( this.faceUtil.g, this.g );
	};
	
	this.test_getFaceCount = function(){
		assertEQ ( this.faceUtil.getFaceCount(), 25 );
	};
	
	this.test_getFaceTip = function(){
		assertEQ ( this.faceUtil.getFaceTip(1), this.faceUtil.facetips[1] );
		assertEQ ( this.faceUtil.getFaceTip(2), this.faceUtil.facetips[2] );
	};
	
	this.test_faceFormat = function(){
		var raws = this.faceUtil.getFaceTip(0) + 'xxx' + this.faceUtil.getFaceTip(1);
		assertEQ ( this.faceUtil.faceFormat(raws) , '<img width=35 height=35 align="middle" src="' + IMG.makeImg('chat/face/01/01.gif') + '"/>xxx<img width=35 height=35 align="middle" src="' + IMG.makeImg('chat/face/01/02.gif') + '"/>' );
	};
});

TestCaseFacePanel = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
});

tqFacePanel_t_main = function(suite) {
	suite.addTestCase(TestCaseFaceUtil, 'TestCaseFaceUtil');
	suite.addTestCase(TestCaseFacePanel, 'TestCaseFacePanel');
};
