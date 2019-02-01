# -*- coding: utf-8 -*-
import time, cgi

html_res = r'''<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>狂拽三国-运营系统</title>
<script type="text/javascript" src="./js/ajax.js"></script>
<script language="javascript" type="text/javascript">
##alert##
</script>
<style type="text/css">
<!--
body {
    margin-left: 0px;
    margin-top: 0px;
    margin-right: 0px;
    margin-bottom: 0px;
    font-size: 14px;
}
.STYLE1 {
    color: #FF0000;
    font-style: italic;
}
.STYLE2 {
    color: #db5500;
    font-size: 12px;
}
.STYLE3 {
    color: #2000ff;
    font-size: 12px;
}
.STYLE4 {	color: #000000;
	font-weight: bold;
}
.STYLE5 {color: #FF3300}
.STYLE6 {color: #ffffff; background-color:#303030;}
.btnNormal {
    float:left;
    width:122px;
    height:42px;
    display:block;
    text-align:center;
    line-height:45px;
    text-decoration:none;
    font-size: 16px;
    color: #2b5494;
}
.btnDown {
    float:left;
    width:122px;
    height:42px;
    background-image:url(./images/btn_back.gif);
    display:block;
    text-align:center;
    line-height:45px;
    text-decoration:none;
    font-size: 16px;
    font-weight: bold;
    color: #2b5494;
}
.xTitle {
    float:left;
    font-size: 20px;
    line-height:75px;
    font-family:黑体,宋体;
    color: #800000;
}
-->
</style>
<script language="javascript" type="text/javascript">
    function checkpost(){
        if(myform.username.value == ""){
            alert("请输入用户名称");
            myform.username.focus();
            return false;
        }    
        
        if(myform.password.value == ""){
            alert("请输入用户密码");
            myform.password.focus();
            return false;
        }    
        
        return true;
    }
</script>
</head>
<body>

<table width="100%" height="99" border="0" cellpadding="0" cellspacing="0">
 <tr><td valign="bottom" background="./images/bg.gif">
  <table width="911" border="0" align="center" cellpadding="0" cellspacing="0">
   <tr>
    <td width="100"><img src="./images/logo.png" style="padding-bottom:15px;"></td><td width="291" class=xTitle>狂拽三国-运营系统</td>
    <td width="590" valign="bottom"></td>
   </tr>
  </table>
 </td></tr>
 <tr><td>
##form##
<table width="911" border="0" align="center" cellpadding="5" cellspacing="0" bordercolor="#E2EAF7">
 <tr><td height="0" valign="top">
 <table width="100%" border="0" cellspacing="0" cellpadding="0">
  <tr><td height="0" valign="top">
  
 </td></tr></table>
</td></tr></table>  

</td></tr></table>
</body></html>'''

html_login_form = r'''
<form action="./login.py" id="myform" name="myform" method="post" onsubmit="return checkpost()">
 <table width="911" border="3" align="center" cellpadding="5" cellspacing="0" bordercolor="#E2EAF7">
  <tr><td>
   <table width="100%" border="1" cellpadding="6" cellspacing="0" bordercolor="#E2EAF7">
    <tr>
     <td width="244" align="right" bgcolor="#F1F5FC"><span class="STYLE1">*</span>&nbsp;用户：</td>
     <td><input name="username" type="text" size="30"></td>
    </tr>
    <tr>
     <td width="244" align="right" bgcolor="#F1F5FC"><span class="STYLE1">*</span>&nbsp;密码：</td>
     <td><input name="password" type="password" size="30"></td>
    </tr>
    <tr>
     <td width="244" align="right">&nbsp;</td>
     <td><input type="submit" name="sub" value="登录"></td>
    </tr>
    <tr>
     <td width="244" align="right" bgcolor="#F9F2E8"><br></td>
     <td align="right" bgcolor="#F9F2E8"><span class="STYLE2">本系统由“狂拽三国运营团队提供服务”</span></td>
    </tr>
   </table>
  </td></tr>
 </table>
</form>
'''

html_manager_form = r'''
<script type="text/javascript" src="./js/manager.js"></script>
 <table width="911" border="3" align="center" cellpadding="5" cellspacing="0" bordercolor="#E2EAF7">
  <tr><td>
   <table width="100%" border="1" cellpadding="6" cellspacing="0" bordercolor="#E2EAF7">
    <tr>
     <td width="80" align="right" bgcolor="#F1F5FC">游戏区号：</td>
     <td>
     ##selectzone##
     </td>
    </tr>
    <tr>
     <td width="80" align="right" bgcolor="#F1F5FC">系统消息：</td>
     <td><input name="sendChatMsg" id="sendChatMsg" type="text" size="110"><input type="button" value="发送" onclick="clickSendChat()"><br/>
      <span class="STYLE3">　　*发送超链接格式为：<font class="STYLE6">#[A:有问题找客服:jq.qq.com/?_wv=1027&k=KzZxN5]</font></span><br/>
     </td>
    </tr>
    <tr>
     <td width="80" align="right" bgcolor="#F1F5FC">封锁角色：</td>
     <td>角色名：<input name="lockRole" id="lockRole" type="text" size="12">封号小时：<input name="lockRoleTime" id="lockRoleTime" type="text" size="12"><input type="button" value="确定" onclick="clickLockUser()"><br/>
      <span class="STYLE3">　　*说明，当小时数为0时，则解封该角色</span><br/>
     </td>
    </tr>
    <tr>
     <td width="80" align="right" bgcolor="#F1F5FC">邮件发送：</td>
     <td>
     目标：<select name="mailToRoleType" id="mailToRoleType" onchange="onSelectToMailType()"><option value="0">特定角色</option><option value="1">所有角色</option></select><input name="mailRole" id="mailRole" type="text" size="20"><span class="STYLE3">*发送多人用半角;分割 例如 <font class="STYLE6">bill:jack;tom</font></span><br/>
     标题：<input name="mailTitle" id="mailTitle" type="text" size="68"><br/>
     <font style="vertical-align: top">内容：</font><textarea name="mailContent"  id="mailContent" rows="3" cols="60"></textarea><br/>
     道具：<input name="mailItems" id="mailItems" type="text" size="68"><br/>
     <span class="STYLE3">　　　*格式为 道具id:个数 例如 <font class="STYLE6">3000060:1</font></span><br/>
     <input type="button" value="发送" onclick="clickSendMail()">
     </td>
    </tr>
    <tr>
     <td width="80" align="right" bgcolor="#F1F5FC">服务开启：</td>
     <td><input type="button" value="服务器状态" onclick="clickGetServerStat()"><input type="button" value="对外网开启" onclick="clickStartServer()"><input type="button" value="对外网关闭" onclick="clickStopServer()"></td>
    </tr>
    <tr>
     <td width="80" align="right" bgcolor="#F1F5FC">当前在线：</td>
     <td><input type="button" value="获取当前在线人数" onclick="clickGetCurOnlines()"></td>
    </tr>
    <tr>
     <td width="80" align="right" bgcolor="#F1F5FC">其他指令：</td>
     <td><input name="otherGM" id="otherGM" type="text" size="68"><input type="button" value="发送" onclick="clickOtherGM()"></td>
    </tr>
    <tr>
     <td width="80" align="right" bgcolor="#F1F5FC">　</td>
     <td><div class="STYLE3" id="runLog" name="runLog"></div></td>
    </tr>
    <tr>
     <td width="80" align="right" bgcolor="#F9F2E8"><br></td>
     <td align="right" bgcolor="#F9F2E8"><span class="STYLE2">本系统由“狂拽三国运营团队提供服务”</span></td>
    </tr>
   </table>
  </td></tr>
 </table>
'''

