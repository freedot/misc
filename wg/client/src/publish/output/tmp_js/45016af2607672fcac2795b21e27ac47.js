StrategyDlg=function(){var a,b,c,d={},e=RES_TRG.MYCITY,f=0,g="";this.init=function(c){a=c,b=this},this.openDlg=function(a,b,d){e=a,f=b,g=d,h(),i(),c.show()};var h=function(){c||(c=Dialog.snew(a,{modal:!0,title:rstr.strategydlg.title,pos:{x:"center",y:30}}),a.getGUI().initDlg(c,uicfg.strategydlg,d),d.list.setCaller({self:b,caller:m}),a.regEvent(EVT.ROLEBASE,0,b,n),c.hide())},i=function(){var b=a.getImgr().getItemByResId(FIXID.SLEEVE);TQ.setTextEx(d.num,b?b.number:0),TQ.setTextEx(d.target,g),o(),j()},j=function(){d.list.setItemCount(FIXID.LASTSTRATEGY-FIXID.FIRSTSTRATEGY+1);for(var a=FIXID.FIRSTSTRATEGY;a<=FIXID.LASTSTRATEGY;++a){var c=d.list.getItem(a-FIXID.FIRSTSTRATEGY),f=ItemResUtil.findItemres(a);IMG.setBKImage(c.exsubs.icon,IMG.makeBigImg(f.bigpic)),TQ.setText(c.exsubs.name,f.name);var g=k(f.targets,e);TQ.setClass(c.exsubs.flag,g?"":"disable_icon"),d.list.enableItem(a-FIXID.FIRSTSTRATEGY,g);var h=d.list.getSubItem(c,"tooltips").$item,i=TTIP.getTipById(h);i.setCaller({self:b,caller:l}),i.setData({id:a})}},k=function(a,b){for(var c=0;c<a.length;++c)if(a[c]==b)return!0;return!1},l=function(a){var b=ItemResUtil.findItemres(a.id);return TIPM.getItemDesc({id:0,itemres:b})},m=function(a,b){UIM.getDlg("usestrategy").openDlg(FIXID.FIRSTSTRATEGY+b,e,f,g)},n=function(){o()},o=function(){var b=a.getImgr();TQ.setTextEx(d.stpoint,b.getRoleAttrVal(ATTR.STP)+"/"+b.getRoleAttrVal(ATTR.MSTP))};this.init.apply(this,arguments)},UseStrategyDlg=function(){var a,b,c,d={},e,f=RES_TRG.MYCITY,g=0,h="";this.init=function(c){a=c,b=this},this.openDlg=function(a,b,d,k){e=a,f=b,g=d,h=k,i(),j(),c.show()};var i=function(){c||(c=Dialog.snew(a,{modal:!0,title:rstr.usestrategy.title,pos:{x:"center",y:30},btns:[{btn:{id:0,text:rstr.comm.confirm},caller:{self:b,caller:k}},{btn:{id:0,text:rstr.comm.cancel},caller:{self:b,caller:function(){c.hide()}}}]}),a.getGUI().initDlg(c,uicfg.usestrategy,d),c.hide())},j=function(){var a=ItemResUtil.findItemres(e);TQ.setText(d.name,a.name),TQ.setTextEx(d.desc,a.desc+TIPM.getItemExpends({id:0,itemres:a},null)),TQ.setTextEx(d.target,h)},k=function(){l()},l=function(){var b="{cmd="+NETCMD.STRATEGY+",subcmd=2";b+=",itemid="+e,b+=",ttype="+f+",tuid="+g,b+="}",a.send(null,b),c.hide()};this.init.apply(this,arguments)},AppointHeroDlg=function(){var a,b,c,d={},e;this.init=function(c){a=c,b=this},this.openDlg=function(a){e=a?a:null;if(!g())return;f(),h(),c.show()};var f=function(){c||(c=Dialog.snew(a,{modal:!0,title:rstr.appointherodlg.title,pos:{x:"center",y:40},btns:[{btn:{id:0,text:rstr.comm.confirm},caller:{self:b,caller:l}},{btn:{id:0,text:rstr.comm.cancel},caller:{self:b,caller:function(){c.hide()}}}]}),a.getGUI().initDlg(c,uicfg.hero.appointdlg,d),c.hide(),i())},g=function(){return e.state==HERO_STATE.STEEL?(a.getGUI().msgBox(rstr.comm.msgts,rstr.appointherodlg.issteeling,MB_F_CLOSE,null),!1):!0},h=function(){TQ.setTextEx(d.heroname,e.name),TQ.setRichText(d.curpos,rstr.comm.herostate[e.state]),d.poslist.setCurSel(e.state)},i=function(){var a=j();for(var c=0;c<a.length;++c)d.poslist.addItem({text:a[c]});d.poslist.setCaller({self:b,caller:k})},j=function(){return rstr.comm.herostate.slice(0,rstr.comm.herostate.length-1)},k=function(a,b){TQ.setTextEx(d.desc,rstr.appointherodlg.appointdescs[b])},l=function(){var f=d.poslist.getCurSel();if(e.state!=f)if(f==0){var g=function(a){a==MB_IDYES&&m()};a.getGUI().msgBox(rstr.comm.msgts,TQ.format(rstr.appointherodlg.resign,e.name,rstr.comm.herostate[e.state]),MB_F_YESNO,{self:b,caller:g})}else{var h=a.getImgr().getHeros().list,i=TQ.find(h,"state",f);if(i){var g=function(a){a==MB_IDYES&&m()};a.getGUI().msgBox(rstr.comm.msgts,TQ.format(rstr.appointherodlg.transfer,i.name,rstr.comm.herostate[i.state],e.name),MB_F_YESNO,{self:b,caller:g})}else m()}c.hide()},m=function(){var b=d.poslist.getCurSel(),c="{cmd="+NETCMD.HERORES+",subcmd=7,id="+e.id+",state="+b+"}";a.send(null,c)};this.init.apply(this,arguments)},ItemBuffTrace=function(){var a,b,c,d;this.init=function(d,e){a=d,b=this,c=e,a.regEvent(EVT.LOGIN_OK,0,b,f),a.regEvent(EVT.NET,NETCMD.ITEM,b,g)};var e=function(a){j()},f=function(){h(),a.regUpdater(b,e,1e3)},g=function(b){if(b.data.buffs){var c=a.getImgr().getItemBuffs();TQ.dictCopy(c.list,b.data.buffs),i()}},h=function(){a.send(null,"{cmd="+NETCMD.ITEM+",subcmd=2}")},i=function(){c.list.setItemCount(a.getImgr().getItemBuffs().list.length),k(function(a,c,d,e){var f=ItemResUtil.findItemres(d.id);TQ.setTextEx(e.exsubs.name,f.name),TQ.setTextEx(e.exsubs.target,m(d.target)),l(c,d,e),e.exsubs.usebtn.setId(a),e.exsubs.usebtn.setCaller({self:b,caller:o})})},j=function(){k(function(a,b,c,d){l(b,c,d)})},k=function(b){var d=parseInt(a.getSvrTimeMs()/1e3),e=a.getImgr().getItemBuffs().list;for(var f=0,g=c.list.getCount();f<g;++f){var h=e[f],i=c.list.getItem(f);b(f,d,h,i)}},l=function(a,b,c){var d=b.stoptime>a?b.stoptime-a:0;d==0&&n(b),TQ.setTextEx(c.exsubs.lefttime,TQ.formatTime(0,d))},m=function(a){var b="";if(a.type==RES_TRG.FARM||a.type==RES_TRG.TIMBERYARD||a.type==RES_TRG.QUARRY||a.type==RES_TRG.IRONORE)b=TQ.qfind(res_targets,"id",a.type).desc;return b},n=function(b){var c="{cmd="+NETCMD.ITEM+",subcmd=3,id="+b.id+"}";a.send(null,c)},o=function(b){var c=a.getImgr().getItemBuffs().list[b],d={id:0,resid:c.id,itemres:ItemResUtil.findItemres(c.id)};UIM.getDlg("package").useItem(d)};this.init.apply(this,arguments)},RecruitHeroDlg=function(){var a=null,b=null,c=null,d={},e,f=[];this.init=function(c){a=c,b=this,a.regEvent(EVT.NET,NETCMD.HERORES,b,v),a.regEvent(EVT.HERO_UPDATE,0,b,w)},this.openDlg=function(){g(),k(),a.regUpdater(b,x,1e3),HelpGuider.getNewcomerSpirit().onDlgOpen("recruithero",{parent:c.getParent(),items:d})},this.hideDlg=function(){c&&c.hide()},this.getNewHeros=function(){return f};var g=function(){c||(c=Dialog.snew(a,{modal:!1,title:rstr.recruitherodlg.title,pos:{x:"center",y:40}}),a.getGUI().initDlg(c,uicfg.hero.recruitherodlg,d),c.hide(),c.setCaller({self:b,caller:y}),h(),i(),j()),c.show()},h=function(){d.curherobtn.setCaller({self:b,caller:q}),d.refreshbtn.setCaller({self:b,caller:r}),d.buybtn.setCaller({self:b,caller:t})},i=function(){for(var a=0,c=d.list.getCount();a<c;++a){var e=d.list.getItem(a);e.exsubs.recruitbtn.setId(a),e.exsubs.recruitbtn.setCaller({self:b,caller:u})}},j=function(){for(var a=0,c=d.list.getCount();a<c;++a){var e=d.list.getItem(a);TTIP.setCallerData(e.exsubs.tooltips.$item,{self:b,caller:z},{idx:a}),TTIP.setCallerData(e.exsubs.tooltips.$nfitem,{self:b,caller:A},{idx:a})}},k=function(){e=parseInt(a.getSvrTimeMs()/1e3)+3600,B()},l=function(a){n(),m(a)},m=function(a){if(!C())return;for(var b=0,c=d.list.getCount();b<c;++b){var e=d.list.getItem(b),f=a[b];f?o(e,f):p(e)}},n=function(){if(!C())return;var b=a.getImgr(),c=b.getHeros().list.length,e=res_gethero_maxcnt(b.getRoleLevel());TQ.setTextEx(d.curheronum,c+"/"+e)},o=function(a,b){a.exsubs.recruitbtn.show(),IMG.setBKImage(a.exsubs.icon,IMG.makeBigImg(b.icon)),TQ.setTextEx(a.exsubs.name,b.name),TQ.setTextEx(a.exsubs.level,rstr.recruitherodlg.level+b.level),TQ.setTextEx(a.exsubs.prof,rstr.recruitherodlg.prof+rstr.comm.heroprofs[b.prof]),TQ.setTextEx(a.exsubs.naturefactor,rstr.recruitherodlg.naturefactor+HeroNAttrFactorColorGetter.getColorVal(b)),TQ.setClass(a.exsubs.border,HeroNAttrFactorColorGetter.getBorderClass(b)),HeroNAttrFactorColorGetter.isMaxVal(b)?(TQ.setClass(a.exsubs.naturefactorbak,"maxnvalback"),TQ.setCSS(a.exsubs.naturefactorbak,"display","block")):(TQ.setClass(a.exsubs.naturefactorbak,""),TQ.setCSS(a.exsubs.naturefactorbak,"display","none"))},p=function(a){a.exsubs.recruitbtn.hide(),IMG.setBKImage(a.exsubs.icon,""),TQ.setTextEx(a.exsubs.name,""),TQ.setTextEx(a.exsubs.level,""),TQ.setTextEx(a.exsubs.prof,""),TQ.setHtml(a.exsubs.naturefactor,""),TQ.setClass(a.exsubs.naturefactorbak,""),TQ.setCSS(a.exsubs.naturefactorbak,"display","none"),TQ.setClass(a.exsubs.border,"")},q=function(){UIM.openDlg("hero")},r=function(){var c=function(b){if(b!=MB_IDYES)return;if(a.getImgr().getItemNumByResId(FIXID.REFRESHCARD)==0){a.getGUI().msgBox(rstr.comm.msgts,rstr.recruitherodlg.norefresh,MB_F_CLOSE,null);return}D()};a.getGUI().msgBox(rstr.comm.msgts,s()?rstr.recruitherodlg.useitemrefreshex:rstr.recruitherodlg.useitemrefresh,MB_F_YESNO,{self:b,caller:c})},s=function(){for(var a=0;a<f.length;++a)if(HeroNAttrFactorColorGetter.isMaxVal(f[a]))return!0;return!1},t=function(){UIM.getDlg("buyitem").openDlg({id:0,resid:FIXID.REFRESHCARD,number:1e4})},u=function(c){var d=f[c],e=a.getImgr(),g=e.getHeros().list.length,h=res_gethero_maxcnt(e.getRoleLevel());if(g>=h){a.getGUI().sysMsgTips(SMT_WARNING,rstr.recruitherodlg.maxhero);return}var i=function(a){a==MB_IDYES&&E(d.id)};a.getGUI().msgBox(rstr.comm.msgts,TQ.format(rstr.recruitherodlg.recruithero,d.name),MB_F_YESNO,{self:b,caller:i})},v=function(a){var b=a.data.newheros;if(!b)return;b.del?TQ.dictCopy(f,a.data.newheros.list):f=a.data.newheros.list,e=b.stoptime?b.stoptime:e,l(f),HelpGuider.getNewcomerSpirit().onDlgOpen("recruithero",{parent:c.getParent(),items:d})},w=function(){n()},x=function(b){var c=a.getSvrTimeS(),f=e>c?e-c:0;TQ.setTextEx(d.lefttime,TQ.formatTime(1,f)),f==0&&B()},y=function(c){c==C_SYS_DLG_HIDE&&(a.unregUpdater(b,x),HelpGuider.getNewcomerSpirit().onDlgClose("recruithero"))},z=function(a){return TIPM.getNewHeroDesc(f[a.idx])},A=function(a){return TIPM.getNewHeroNatureFactorDesc(f[a.idx])},B=function(){var b="{cmd="+NETCMD.HERORES+",subcmd=13}";a.send(null,b)},C=function(){return c&&c.isShow()},D=function(){var b="{cmd="+NETCMD.HERORES+",subcmd=13,useitem=1}";a.send(null,b)},E=function(b){var c="{cmd="+NETCMD.HERORES+",subcmd=15,id="+b+"}";a.send(null,c)};this.init.apply(this,arguments)}