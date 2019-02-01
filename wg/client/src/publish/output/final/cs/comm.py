# -*- coding: utf-8 -*-
import time, cgi

html_res = r'''<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>狂拽三国-客服系统</title>
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
.STYLE4 {	color: #000000;
	font-weight: bold;
}
.STYLE5 {color: #FF3300}
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
        if(myform.txtTitle.value == ""){
            alert("请输入标题");
            myform.txtTitle.focus();
            return false;
        }

        if (!checkqq()){
            return false;
        }
        
        if(myform.txtZone.value == ""){
            alert("请输入君主名称");
            myform.txtZone.focus();
            return false;
        }    
        
        if(myform.txtContent.value == ""){
            alert("请输入详细问题");
            myform.txtContent.focus();
            return false;
        }    
    
        //alert("its ok!");
        return true;
    }
    
    function checkqq(){
        var re = new RegExp('^[0-9]{4,13}',"i"); 
        if(!re.test(myform.txtQQ.value)){
            alert("请输入QQ号码");
            myform.txtQQ.focus();
            return false;
        }    
        return true;
    }
</script>
</head>
<body>
##tabbar##
##form##
<table width="911" border="0" align="center" cellpadding="5" cellspacing="0" bordercolor="#E2EAF7">
 <tr><td height="0" valign="top">
 <table width="100%" border="0" cellspacing="0" cellpadding="0">
  <tr><td height="0" valign="top">
   ##result##
 </td></tr></table>
</td></tr></table>  

</td></tr></table>
</body></html>'''


html_tab_res = r'''
<table width="100%" height="99" border="0" cellpadding="0" cellspacing="0">
 <tr><td valign="bottom" background="./images/bg.gif">
  <table width="911" border="0" align="center" cellpadding="0" cellspacing="0">
   <tr>
    <td width="100"><img src="./images/logo.png" style="padding-bottom:15px;"></td><td width="291" class=xTitle>客服系统</td>
    <td width="590" valign="bottom"><a href="./cs.py" class=##tabBtn1##>提交问题 </a><a href="./search.py" class=##tabBtn2##> 结果查询</a></td>
   </tr>
  </table>
 </td></tr>
 <tr><td>
'''

html_cs_form = r'''
<form action="./cs.py" id="myform" name="myform" method="post" onsubmit="return checkpost()">
 <table width="911" border="3" align="center" cellpadding="5" cellspacing="0" bordercolor="#E2EAF7">
  <tr><td>
   <table width="100%" border="1" cellpadding="6" cellspacing="0" bordercolor="#E2EAF7">
    <tr>
     <td width="244" align="right" bgcolor="#F1F5FC"><span class="STYLE1">*</span>&nbsp;问题标题：</td>
     <td><input name="txtTitle" type="text" size="60"></td>
    </tr>
    <tr>
     <td width="244" align="right" bgcolor="#F1F5FC"><span class="STYLE1">*</span>&nbsp;问题类型：</td>
     <td>
      <label class="lb"><input type="radio" name="sType" class="pr" value="提交BUG" checked="checked" />提交BUG</label>
      <label class="lb"><input type="radio" name="sType" class="pr" value="游戏建议"  />游戏建议</label>
      <label class="lb"><input type="radio" name="sType" class="pr" value="其他问题"  />其他问题</label>
    </tr>
    <tr>
     <td width="244" align="right" bgcolor="#F1F5FC"><span class="STYLE1">*</span>&nbsp;QQ号码：</td>
     <td><input name="txtQQ" type="text" size="60"></td>
    </tr>
    <tr>
     <td width="244" align="right" bgcolor="#F1F5FC"><span class="STYLE1">*</span>&nbsp;君主名称：</td>
     <td><input name="txtZone" type="text" size="60"></td>
    </tr>
    <tr>
     <td width="244" align="right" valign="top" bgcolor="#F1F5FC"><span class="STYLE1">*</span>&nbsp;详细问题：<br></td>
     <td><textarea name="txtContent" cols="60" rows="15"></textarea></td>
    </tr>
    <tr>
     <td width="244" align="right">&nbsp;</td>
     <td><input type="submit" name="sub" value="提交"></td>
    </tr>
    <tr>
     <td width="244" align="right" bgcolor="#F9F2E8"><br></td>
     <td align="right" bgcolor="#F9F2E8"><span class="STYLE2">本系统由“狂拽三国客服团队提供服务”</span></td>
    </tr>
   </table>
  </td></tr>
 </table>
</form>
'''

html_commit_ok_res = r'''<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
 <head>
  <title></title>
  <script language="javascript" type="text/javascript">
    alert("提交成功，我们会尽快回复您的问题！");
    window.location.href = "./cs.py";
  </script>
  </head>
 <body>
 </body>
</html>
'''

html_search_form = r'''
<form action="./search.py" id="myform" name="myform" method="post" onsubmit="return checkqq()">
 <table width="911" border="3" align="center" cellpadding="5" cellspacing="0" bordercolor="#E2EAF7">
  <tr><td>
   <table width="100%" border="1" cellpadding="6" cellspacing="0" bordercolor="#E2EAF7">
    <tr>
     <td width="244" align="right" bgcolor="#F1F5FC"><span class="STYLE1">*</span>&nbsp;查询QQ号：</td>
     <td width="120"><input name="txtQQ" type="text" size="30"></td>
     <td align="left" ><input type="submit" name="sub" value="提交"></td>
    </tr>
   </table>
  </td></tr>
 </table>
</form>
'''

html_search_result_res = r'''
   <table width="100%" height="100" border="0" cellpadding="6" cellspacing="0" style="border-bottom:1px #E2EAF7 solid; margin-bottom:1px;">
    <tr>
     <td width="30" align="right" bgcolor="#FFFFFF"><img src="./images/ask.gif" width="13" height="13"></td>
     <td align="left" bgcolor="#FFFFFF"><span class="STYLE4">##title##</span></td>
    </tr>
    <tr>
     <td width="30" align="left" bgcolor="#FFFFFF">&nbsp;</td>
     <td align="left" bgcolor="#FFFFFF">##content##</td>
    </tr>
    <tr>
     <td width="30" align="left" bgcolor="#FFFFFF">&nbsp;</td>
     <td align="left" bgcolor="#FFFFFF">提交时间：##rtime##</td>
    </tr>
   </table>
   
   <table width="100%" height="100" border="0" cellpadding="6" cellspacing="0" bordercolor="#E2EAF7">
    <tr>
     <td width="30" align="right" bgcolor="#FFFFFF"><img src="./images/answer.gif" width="13" height="13"></td>
     <td align="left" bgcolor="#FFFFFF"><span class="STYLE4">系统管理员回复</span></td>
    </tr>
    <tr>
     <td width="30" align="left" bgcolor="#FFFFFF">&nbsp;</td>
     <td align="left" bgcolor="#FFFFFF">回复时间：##atime##</td>
    </tr>
    <tr>
     <td width="30" align="left" bgcolor="#FFFFFF">&nbsp;</td>
     <td align="left" bgcolor="#FFFFFF">##answer##</td>
    </tr>
   </table>
'''

request_db = '/home/ubuntu/web/cs/database/request.db'

def makeTabBar(selectId):
	s = html_tab_res
	if selectId == 1 :
		s = s.replace('##tabBtn1##', 'btnDown')
		s = s.replace('##tabBtn2##', 'btnNormal')
	else:
		s = s.replace('##tabBtn2##', 'btnDown')
		s = s.replace('##tabBtn1##', 'btnNormal')
	return s

def escapeStr(s):
	s = cgi.escape(s)
	s = s.replace('\r\n', '<br/>')
	s = s.replace('\r', '<br/>')
	s = s.replace(' ', '&nbsp;')
	return s.replace('\n', '<br/>')
	
def formatTime(timeSec):
	if timeSec == 0: return ''
	m = time.localtime(timeSec)
	return time.strftime('%Y-%m-%d %H:%M:%S', m)
