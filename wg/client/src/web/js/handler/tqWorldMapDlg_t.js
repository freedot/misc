require('./tqWorldMapDlg.js');
TestCaseWorldMapDlg = TestCase.extern(function(){
	this.testOpenDlg = function(){
		//var dlg = WorldMapDlg.snew(g_app);
		//dlg.openDlg();
		//assert(dlg.isShow());
	};
	
	this.testEnterCity = function(){
		//var dlg = WorldMapDlg.snew(g_app);
		//dlg.openDlg();
		
		//g_app.clearSendMsg();
		//dlg.clickCity(9900001);
		//assert(g_app.getSendMsg() == '{cmd='+NETCMD.MAP+',subcmd=2,id=9900001}');
	};
});


tqWorldMapDlg_t_main = function(suite) {
	suite.addTestCase(TestCaseWorldMapDlg, 'TestCaseWorldMapDlg');
};
