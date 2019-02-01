/*******************************************************************************/
require('./loading.js')

TestCaseLoadingFace = JTestCase.ex({
	setUp : function(){
		TestCaseHelper.setUp(this);
		g_scriptlists = ['js/1.js', 'js/2.js', 'js/3.js', 'js/4.js'];
		g_preImgSrcs = ['img/1.png', 'img/2.png', 'img/3.png', 'img/4.png'];
		this.loadingFace = LoadingFace.snew('url', 6869, {'type':'NONE', 'url':'' }, 'sig');
	}
	
	,tearDown : function(){
		TestCaseHelper.tearDown(this);
	}
	
	,helper_getTip : function(){
		return document.getElementById('g_loading_tip_div').innerHTML;
	}
	
	,helper_getPercent : function(){
		var w = parseInt(document.getElementById('g_loading_progress_bar_div').style.width);
		w -= 14;
		return w / 561;
	}
	
	,test_setTipText : function(){
		this.loadingFace.setTipText('tip');
		assertEQ ( this.helper_getTip(), 'tip' );
	}
	
	,test_setPercent : function(){
		this.loadingFace.setPercent(0.5);
		assertFloatEQ ( this.helper_getPercent(), 0.5, null, 0.1);
	}
	
	,test_isShow : function(){
		assertEQ( this.loadingFace.isShow(), true );
		this.loadingFace.hide();
		assertEQ( this.loadingFace.isShow(), false );
	}
	
	,test_loadJssAndImages : function(){
		assertEQ ( this.helper_getTip(), rstr_loading.loadjs);
		this.loadingFace.getJsLoader().getJs('js/1.js').onload();
		this.loadingFace.getJsLoader().getJs('js/2.js').onload();
		assertFloatEQ( this.loadingFace.getJsLoader().getPercent(), 0.5);
		this.loadingFace.getJsLoader().getJs('js/3.js').onload();
		this.loadingFace.getJsLoader().getJs('js/4.js').onload();
		
		// when js load completed, start load images
		assertFloatEQ( this.loadingFace.getJsLoader().getPercent(), 1);
		assertFloatEQ( this.helper_getPercent(), 0.6, null, 0.1);
		assertEQ ( this.helper_getTip(), rstr_loading.loadimage);
		assertFloatEQ( this.loadingFace.getImageLoader().getPercent(), 0);
		this.loadingFace.getImageLoader().getImage('img/1.png').onload();
		this.loadingFace.getImageLoader().getImage('img/2.png').onload();
		this.loadingFace.getImageLoader().getImage('img/3.png').onload();
		
		// when images load completed, start init game
		var _url = ''; var _port = 0; var _proxy = {}; var _sig = '';
		var _error = true;
		initGame = function(url, port, proxy, sig){
			_url = url;
			_port = port;
			_proxy = proxy;
			_sig = sig;
			if ( _error ) throw new Error("error");
		};
		this.loadingFace.getImageLoader().getImage('img/4.png').onload();
		assertFloatEQ( this.helper_getPercent(), 0.95, null, 0.1);
		assertEQ ( this.helper_getTip(), rstr_loading.connect);
		assertEQ ( _url, 'url' );
		assertEQ ( _port, 6869 );
		assertEQ ( _proxy, {'type':'NONE', 'url':'' } );
		assertEQ ( _sig, 'sig' );
		
		// when start init game error, repeat init
		_url = ''; _port = 0; _proxy = {}; _sig = '';
		_error = false;
		window.updateTimer();
		assertEQ ( _url, 'url' );
		assertEQ ( _port, 6869 );
		assertEQ ( _proxy, {'type':'NONE', 'url':'' } );
		assertEQ ( _sig, 'sig' );
		
		// when start init game ok, stop timer
		_url = ''; _port = 0; _proxy = {}; _sig = '';
		window.updateTimer();
		assertEQ ( _url, '' );
		assertEQ ( _port, 0 );
		assertEQ ( _proxy, {} );
		assertEQ ( _sig, '' );
	}
	
	,test_loadJssInPc : function(){
		navigator.userAgent = 'NODE PC';
		g_scriptlists = ['js/1.js', 'js/res_newui_cls.js', 'js/res_newui_mb_cls.js', 'js/4.js'];
		this.loadingFace = LoadingFace.snew('url', 6869, {'type':'NONE', 'url':'' }, 'sig');
		assertEQ ( g_scriptlists, ['js/1.js', 'js/res_newui_cls.js', 'js/4.js'] );
	}
	
	,test_loadJssInMobile : function(){
		navigator.userAgent = 'NODE mobile';
		g_scriptlists = ['js/1.js', 'js/res_newui_cls.js', 'js/res_newui_mb_cls.js', 'js/4.js'];
		this.loadingFace = LoadingFace.snew('url', 6869, {'type':'NONE', 'url':'' }, 'sig');
		assertEQ ( g_scriptlists, ['js/1.js', 'js/res_newui_mb_cls.js', 'js/4.js'] );
	}
});

tqloading_t_main = function(suite) {
	suite.addTestCase(TestCaseLoadingFace, 'TestCaseLoadingFace');
};