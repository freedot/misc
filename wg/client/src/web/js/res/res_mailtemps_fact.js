res_mailtemps_fact = {};

var s = '';
s +='<table width=625 class=mailfightresult>';
s +='<tr>';
s +='<td style="padding-left:4px;">';
s +='#result#';
s +='</td>';
s +='</tr>';
s +='</table>';
s +='';
s +='<table width=625 border=1 class=mailfighttable>';
s +='<tr height=25><td width=60 class=title>攻方武将</td><td width=40 class=title>等级</td><td width=58 class=title>士兵</td><td width=38 class=title>数量</td><td width=38 class=title>伤亡</td><td width=38 class=title>恢复</td><td width=38 class=title>经验</td><td width=60 class=title>守方武将</td><td width=40 class=title>等级</td><td width=58 class=title>士兵</td><td width=38 class=title>数量</td><td width=38 class=title>伤亡</td><td width=38 class=title>恢复</td></tr>';
s +='#lines#';
s +='</table>';
s +='';
s +='<table width=625 class=mailfightres>';
s +='<tr>';
s +='<td style="padding-left:4px;">';
s +='#res#';
s +='</td>';
s +='</tr>';
s +='</table>';
res_mailtemps_fact[FIXID.FDEMO_MAILTEMP] = s;


var s = '';
s +='<div class=sys_mail_logo></div>';
s +='<table width=625 class=mailcommsys>';
s +='<tr>';
s +='<td class=con>';
s +='#con#';
s +='</td>';
s +='</tr>';
s +='</table>';
res_mailtemps_fact[FIXID.COMM_SYS_MAILTEMP] = s;




