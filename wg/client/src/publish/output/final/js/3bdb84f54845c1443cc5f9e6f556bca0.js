DropList=function(){var a,b,c,d,e,f,g=90,h,i=0;this.initialize=function(h,i,l){a=h,b=this,c=i;var m=TQ.createDom("div");TQ.append(c,m),TQ.setClass(m,"ui-droplist"),f=new ComButton(a,m,{uiback:uiback.btn.droptitle}),f.setText("--");var n=new ComButton(a,m,{uiback:uiback.btn.droparraw});f.setCaller({self:b,caller:j}),n.setCaller({self:b,caller:j}),l.width&&(g=l.width),l.className="menu_panel",l.zindex=UI_ZORDER_MENU,d=new PopPanel(a,l),d.hide(),e=List.snew(h,d.getDom()),e.setCols({sel:"dropitemsel",hot:"dropitemhot",normal:"dropitemnor"},[{sel:"dropnamehot",hot:"dropnamehot",normal:"dropnamenor"}]),e.setCaller({self:b,caller:k})},this.addItem=function(a){var b=e.getCount();e.setItemCount(b+1),e.setItem(b,[{text:a.text}]);var c=e.getItem(b);c&&(TQ.setDomWidth(c.item,g),TQ.setDomHeight(c.item,TQ.getDomHeight(c.subs[0].item)),TQ.setDomWidth(c.subs[0].item,g))},this.deleteAllItem=function(){e.setItemCount(0)},this.setCurSel=function(a){e.setCurSel(a)},this.getCurSel=function(){return e.getCurSel()},this.getCount=function(){return e.getCount()},this.setCaller=function(a){h=a},this.setTitle=function(a){f.setText(a)},this.getTitle=function(){return f.getText()},this.getTitleDom=function(){return f.getDom()},this.setId=function(a){i=a},this.getItemText=function(a){var b=e.getItem(a);return b?b.subs[0].item.innerHTML:""};var j=function(a,b){var c=f.getDom(),e=TQ.domOffset(c);d.show({x:e.left,y:e.top+TQ.getDomHeight(c)})},k=function(a,b){var c=e.getItem(b);c&&f.setText(c.subs[0].item.innerHTML),h&&h.caller.call(h.self,a,b,i),d.hide()};this.initialize.apply(this,arguments)}