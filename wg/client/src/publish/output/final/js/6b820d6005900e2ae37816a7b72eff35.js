HospitalDlg=Class.extern(function(){var a=null,b=null,c=null,d={},e=[];this.init=function(c){b=this,a=c,f()},this.openDlg=function(){g(),j(),k()},this.hideDlg=function(){c&&c.hide()};var f=function(){a.regEvent(EVT.HERO_UPDATE,0,b,y),a.regEvent(EVT.PKG_CHANGE,0,b,z),a.regEvent(EVT.PKG_CHANGE,2,b,z)},g=function(){if(c)return;h(),i()},h=function(){c=Dialog.snew(a,{modal:!1,title:rstr.hospitaldlg.title,pos:{x:"center",y:50}}),a.getGUI().initDlg(c,uicfg.hospitaldlg,d)},i=function(){d.buy.setCaller({self:b,caller:t}),d.treatmentAll.setCaller({self:b,caller:u})},j=function(){c.show()},k=function(){l()},l=function(){if(!m())return;n(),r(),s()},m=function(){return c?c.isShow():!1},n=function(){o(),p(),q()},o=function(){e=[];var b=a.getImgr(),c=b.getHeros().list;for(var d=0;d<c.length;++d){var f=c[d];if(b.getHeroAttrVal(f,ATTR.HEALTH)==b.getHeroAttrVal(f,ATTR.MHEALTH))continue;e.push(f)}},p=function(){d.list.setItemCount(e.length);for(var b=0;b<d.list.getCount();++b){var c=d.list.getItem(b),f=e[b];TQ.setTextEx(c.exsubs.name,f.name),TQ.setTextEx(c.exsubs.level,f.level),TQ.setTextEx(c.exsubs.health,a.getImgr().getHeroAttrVal(f,ATTR.HEALTH)),TQ.setTextEx(c.exsubs.neednum,TreatmentHeroHdr.getNeedItemNumber(a,[f.id]))}},q=function(){for(var a=0;a<d.list.getCount();++a){var c=d.list.getItem(a);c.exsubs.treatment.setId(a),c.exsubs.treatment.setCaller({self:b,caller:v})}},r=function(){var b=a.getImgr().getSalveInfo(),c=a.getImgr().getItemNumByResId(FIXID.SALVE);TQ.setTextEx(d.itemnum,c+"/"+b.max)},s=function(){var b=TreatmentHeroHdr.getNeedItemNumber(a,w());TQ.setTextEx(d.neednum,b)},t=function(){UIM.openDlg("buyitem",{id:0,resid:FIXID.PKG_SALVE,number:1e4})},u=function(){x(w())},v=function(a){x([e[a].id])},w=function(){var a=[];for(var b=0;b<e.length;++b)a.push(e[b].id);return a},x=function(b){var c=TreatmentHeroHdr.getNeedItemNumber(a,b),d=a.getImgr().getItemNumByResId(FIXID.SALVE);if(c>d){var e=RStrUtil.makeNoSalveBuyMsg(FIXID.SALVE,c,d);a.getGUI().msgBox(rstr.comm.msgts,e,MB_F_CLOSE,null);return}HeroSender.sendTreatments(a,b)},y=function(){if(!m())return;n(),s()},z=function(){if(!m())return;r()}})