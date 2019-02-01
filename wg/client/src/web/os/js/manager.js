var g_roles = [];
var g_mailIdx = 0;

function onSelectToMailType(){
	var mailRoleInput = document.getElementById("mailRole");
	if (mailToRoleType.selectedIndex == 0) {
		mailRoleInput.style.visibility = 'visible';	
	} else {
		mailRoleInput.style.visibility = 'hidden';
	}
}

function runLog(msg){
	var runLog = document.getElementById("runLog");
	runLog.innerHTML = msg;
}

function sendNextMail(){
	if ( g_mailIdx == g_roles.length ) return;
	for ( ; g_mailIdx<g_roles.length; g_mailIdx++ ) {
		var role = g_roles[g_mailIdx].trim();
		if (role == '') continue;
		sendMsg('send_other_mail', role, ['mailTitle', 'mailContent', 'mailItems'], '');
		g_mailIdx++;
		break;
	}
}

function onRecvMsg(msg){
	try {
		var pkg = eval('(' + msg + ')');
		if ( pkg.t == 'send_other_mail' ) {
			runLog(pkg.msg + g_mailIdx);
			sendNextMail();
		} else if ( pkg.t == 'showpkgitems' ) {
			runLog(pkg.msg);
		} else {
			alert(pkg.msg);
		}
	}catch(err) {
		if (msg == 'error! no login') {
			alert('登录态度超时，请重新登录！');
			window.location.href='./login.py'; 
		} else {
			alert('执行错误！');
		}
	}
}
g_ajax = new MyAjax('./manager.py');
g_ajax.setCaller(onRecvMsg);

function getCurZoneId(){
	return zoneid.options[zoneid.selectedIndex].value;
}

function encodeMsg(msg){
	msg = msg.replace(/%/g, "&bfh;");
	msg = msg.replace(/\"/g, "&quot;");
	msg = msg.replace(/\'/g, "&apos;");
	msg = msg.replace(/</g, "&lt;");
	msg = msg.replace(/>/g, "&gt;");
	msg = msg.replace(/\r\n/g, "<br/>");
	msg = msg.replace(/\r/g, "<br/>");
	msg = msg.replace(/\n/g, "<br/>");
	msg = msg.replace(/ /g, "&nbsp;");
	msg = msg.replace(/#/g, "&jh;");
	return msg
}

function sendMsg(stype, preMsg, items, appendMsg){
	var msg = preMsg;
	for ( var i=0; i<items.length; ++i ) {
		if ( msg != '' ) msg += ' ';
		msg += encodeMsg(document.getElementById(items[i]).value);
	}
	
	msg += appendMsg;
	if ( msg == '' ) msg = 'empty';
	msg = encodeURIComponent(msg);
	g_ajax.send('t=' + stype + '&zoneid=' + getCurZoneId() + '&msg=' + msg);
	runLog('send ... ');
}

function clickSendChat(){
	if(confirm("确定要发送吗？")) {
		sendMsg('send_sysmsg', '', ['sendChatMsg'], '');
	}
}

function clickLockUser(){
	if(confirm("确定要封号吗？")) {
		sendMsg('lockuser', '', ['lockRole', 'lockRoleTime'], '');
	}
}

function clickSendMail(){
	if(confirm("确定要发送吗？")) {
		g_mailIdx = 0;
		if (mailToRoleType.selectedIndex == 0) {
			g_roles = document.getElementById('mailRole').value.split(';');
		} else { // send to all roles
			g_roles = ['*'];
		}
		sendNextMail();
	}
}

function clickGetCurOnlines(){
	sendMsg('get_onlines', '', [], '');
}

function clickGetServerStat(){
	sendMsg('getserverstat', '', [], '');
}

function clickStartServer(){
	if(confirm("确定要对外开服吗？")) {
		sendMsg('startserver', '', [], '1');
	}
}

function clickStopServer(){
	if(confirm("确定要对外停服吗？")) {
		sendMsg('startserver', '', [], '0');
	}
}

function clickOtherGM(){
	var gmmsg = document.getElementById('otherGM').value;
	if(confirm("确定要发送吗[" + gmmsg + "]？")) {
		var words = gmmsg.split(' ');
		if (words.length == 0) return;
		var gmcmd = words[0];
		var gmcmdLen = gmcmd.length+1;
		var msg = gmmsg.substr(gmcmdLen, gmmsg.length - gmcmdLen);
		sendMsg(gmcmd, msg, [], '');
	}
}
//'startserver',
	