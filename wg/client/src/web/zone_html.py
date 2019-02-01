# -*- coding: utf-8 -*-
html_res = {
	# html start
	'html_start_tag' : r'''<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">''',

	#html_end_tag
	'html_end_tag' : r'''
</html>''',

	# head start
	'head_start_tag' : r'''
<head>''',

	# head end
	'head_end_tag' : r'''
</head>''',

	# title
	'title' : r'''
<title>狂拽三国</title>''',

	# head meta
	'head_meta' : r'''
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">''',

	# global info
	'global_info' : r'''
<script language="JavaScript">
	pay_zone_id='%d';
	g_platform='%s';
	g_appid='%d';
</script>''',

	# fusion2
	'fusion2_api' : r'''
<script type="text/javascript" charset="utf-8" 
	src="http://fusion.qq.com/fusion_loader?appid=%d&platform=%s">
</script>''',
	# 3366 api
	'3366_api' : r'''
<script type="text/javascript"  charset="utf-8" src="http://www.3366.com/js/jquery.js"></script>
<script type="text/javascript" charset="utf-8" src="http://www.3366.com/js/jquery.pm.js"></script>
<script type="text/javascript" charset="utf-8" src="http://www.3366.com/js/module/openapilib.js"></script>
<script language="JavaScript">
	$(document).ready(function(){
		//Open3366API.Canvas.setHeight(900);
	});
</script>
	''',
	
	# socket_object
	'socket_object' : r'''
<script type="text/javascript">
hasWebSocket = function(){
	if (window.WebSocket) {
		return true;
	} else {
		return false;
	}
};

isMobileBrowser = function(){
	return true;
	//var isMobile = !!navigator.userAgent.match(/AppleWebKit.*Mobile.*/);
	//return isMobile;
};

isPcBrowser = function(){
	var isMobile = !!navigator.userAgent.match(/AppleWebKit.*Mobile.*/);
	return !isMobile;
};

var params = {
  quality:"high"
  ,menu:"false"
  ,allowFullScreen:"false"
  ,allowScriptAccess:"sameDomain"
  ,allowNetworking:"all"
};
var attributes = { 
  id: "socket"
  ,name:"socket" 
};

if ( isMobileBrowser() && hasWebSocket() ) {// use web socket
} else {// use flash socket
	swfobject.embedSWF("js/s2.swf", "socketAlternative", "0", "0", "9.0.0", null, null, params, attributes);
	swfobject.embedSWF("js/soundPlay.swf", "swf_play_sound_", "0", "0", "9.0.0", "js/expressInstall.swf");
	swfobject.embedSWF("js/soundPlay.swf", "swf_play_backsound_", "0", "0", "9.0.0", "js/expressInstall.swf");
}
</script>''',

	# socket object alternative content
	'socket_object_alter' : r'''
<div  id=socketAlternativeP class=g_swfobjs>
<div id=socketAlternative>
  <font color=white>请点击下面图标安装flash插件</font>
  <p><a href="http://www.adobe.com/go/getflashplayer" target="_blank"><img src="http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif" alt="Get Adobe Flash player" /></a></p>
</div>
<div class="g_hideswfobj"><div id="swf_play_sound_"></div></div>
<div class="g_hideswfobj"><div id="swf_play_backsound_"></div></div>
</div>

<script type="text/javascript">
if ( isMobileBrowser() && hasWebSocket() ) {// use web socket
	var alterId = document.getElementById('socketAlternativeP');
	alterId.style.display = 'none';
}
</script>
''',

	# loading html res
	'loading': r''' 
<div id="g_loading_div_bak" class="g_loading_bak">
<div id="g_loading_div" class="g_loading">
 <div id="g_loading_progress_bak_div" class="g_loading_progress_bak">
  <div id="g_loading_progress_bar_div" class="g_loading_progress_bar"></div>
 </div>
 <div id="g_loading_tip_div" class="g_loading_tip"></div>
</div>
</div>''',

	# html css file tmp
	'css_script_tmp' : r'''
<link rel="stylesheet" type="text/css" href="%s" />''',

	# html js file tmp
	'js_script_tmp' : r'''
<script src="%s" type="text/javascript"></script>''',

	# image_base_url
	'image_base_url' : r'''
<script language="JavaScript">
image_base_url='%s';
</script>''',

	# debug_flag
	'debug_flag' : r'''
<script language="JavaScript">
IS_DEBUG=false;
</script>''',

	# id asc comp function utility
	'util_id_asccomp' : r'''
<script language="JavaScript">
G_ID_ASCCOMP = function(a, b){return a.id - b.id;};
</script>''',

	# utility for log, profile
	'util_log' : r'''
<script language="JavaScript">
  setlogtime=function(){};log=function(msg){};profile=function(flag,key){};
</script>''',

	# shortcut_icon
	'shortcut_icon' : r'''
<link rel="shortcut icon" type="image/x-icon" href="favicon.ico"/>''',

	# body_start_tag
	'body_start_tag' : r'''
<body>''',

	# body_end_tag
	'body_end_tag' : r'''
</body>''',
	
	#fix_ie6_bugs
	'fix_ie6_bugs' : r'''
<style> body{WIDTH:100%; HEIGHT:100%;}</style>''',

	#leavepage
	'leave_page' : r'''
<script language="JavaScript">
refresh_page = function(){
	window.location.reload();
};
</script>''',

	'login_error' : r'''
<html><head><title>登录错误</title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
</head><body>
<center><font style="font-size:12px">数据异常，登录错误</font></center>
</body></html>''',

	'login_stopserver' : r'''
<html><head><title>服务器停服通知</title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
</head><body>
<center><font style="font-size:12px">服务器已经关闭，进行公测前数据校正</font></center>
</body></html>''',

	'login_notify' : r'''
<html><head><title>通知</title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
</head><body>
<center><font style="font-size:12px">%s</font></center>
</body></html>'''
}


html_body_res = {
	'for_scrollbar' : r'''
<div id="size_div" name="size_div" class="size_div"></div>
<div id="scrollbar_div" name="scrollbar_div" class="scrollbar_div"><div class="scrollbar_div_con"></div></div>''',

	'game_body' : r'''
<div id="g_body" class="g_body" style="VISIBILITY:hidden;" ondragstart="return false;"></div>''',	
	
	'for_debug' : r'''
<style>
.debuglog_btn:link{color: white;text-decoration:underline;}
.debuglog_btn:visited{color: white;text-decoration:underline;}
.debuglog_btn:hover{color: #ff3300;text-decoration:underline;}
.debuglog_min{POSITION:absolute;Z-INDEX:11111111;TOP:230px;LEFT:0px;WIDTH:20px;HEIGHT:20px;COLOR:#FFFFFF;BACKGROUND-COLOR:#000000;}
.debuglog_max{DISPLAY:none;POSITION:absolute;Z-INDEX:11111111;TOP:230px;LEFT:0px;}
.debuglog_max_bar{TEXT-ALIGN:left;LEFT:0px;WIDTH:500px;HEIGHT:20px;COLOR:#FFFFFF;BACKGROUND-COLOR:#000000;}
.debuglog_max_con{LEFT:0px;WIDTH:500px;HEIGHT:250px;COLOR:#FFFFFF;OVERFLOW:auto;TEXT-ALIGN:left;BORDER:1px solid #000000;BACKGROUND-COLOR:#202020;}
</style>
<DIV id=debuglog_minbtn class="debuglog_min">
  <a href="#" class=debuglog_btn onclick="document.getElementById('debuglog_max').style.display='block';document.getElementById('debuglog_minbtn').style.display='none';return false;">&gt;&gt;</a>
</DIV>
<DIV id=debuglog_max class="debuglog_max">
  <DIV class="debuglog_max_bar">
    <table width="100%"><tr>
      <td width="25%">[log output]</td>
      <td width="70%"><a href="#" class=debuglog_btn onclick="document.getElementById('debuglog').innerHTML='';return false;">Clear</a></td>
      <td width="5%"><a href="#" class=debuglog_btn onclick="document.getElementById('debuglog_minbtn').style.display='block';document.getElementById('debuglog_max').style.display='none';return false;">&lt;&lt;</a></td>
    </tr></table>
  </DIV>
<DIV id=debuglog class="debuglog_max_con"></DIV>
</DIV>
<script language="JavaScript">
IS_DEBUG = true;
var log_start_time_1ast = 0;
function setlogtime() {
  log_start_time_1ast = new Date().getTime();
}
function log(msg) {
  var obj = document.getElementById('debuglog');
  if ( log_start_time_1ast == 0 ) {
    var txt = obj.innerHTML;
    obj.innerHTML = txt+msg+'<br>';
  } else {
    var interval = new Date().getTime() - log_start_time_1ast;
    log_start_time_1ast = 0;
    var txt = obj.innerHTML;
    obj.innerHTML = txt+msg+'<interval>:'+interval+'<br>';
  }
}
</script>''',

	'loading_object' : r'''
<script language="JavaScript">
  g_loading = LoadingFace.snew('%s', %d, {type:'%s', url:'%s'}, '%s');
</script>''',

}
