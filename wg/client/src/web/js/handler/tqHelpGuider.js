/*******************************************************************************/
HelpGuider = {}; // namespace

HelpGuider.initOneTime = function(g){
	HelpGuider.g_ = g;
};
	
HelpGuider.spirit = function(ops){
	if (!HelpGuider.spirit_) {
		HelpGuider.spirit_ = HelpGuider.SpiritDlg.snew(HelpGuider.g_);
	}
	ops.shape = 1;
	HelpGuider.spirit_.openDlg(ops);
	HelpGuider.hideSpiritRhombus();
};

HelpGuider.spiritRhombus = function(ops){
	if (!HelpGuider.spiritRhombus_) {
		HelpGuider.spiritRhombus_ = HelpGuider.SpiritDlg.snew(HelpGuider.g_);
	}
	ops.shape = 2;
	HelpGuider.spiritRhombus_.openDlg(ops);
	HelpGuider.hideSpirit();
};

HelpGuider.spiritTip = function(ops){
	if (!HelpGuider.spiritTip_) {
		HelpGuider.spiritTip_ = HelpGuider.SpiritTipDlg.snew(HelpGuider.g_);
	}
	ops.shape = 1;
	HelpGuider.spiritTip_.openDlg(ops);
};

HelpGuider.hideSpirit = function(){
	if (!HelpGuider.spirit_)  return;
	HelpGuider.spirit_.hideDlg();
};

HelpGuider.hideSpiritRhombus = function(){
	if (!HelpGuider.spiritRhombus_) return;
	HelpGuider.spiritRhombus_.hideDlg();
};

HelpGuider.hideAllSpirits = function(){
	HelpGuider.hideSpirit();
	HelpGuider.hideSpiritRhombus();
};

HelpGuider.hideSpiritTip = function(){
	if (!HelpGuider.spiritTip_)  return;
	HelpGuider.spiritTip_.hideDlg();
};

HelpGuider.getNewcomerSpirit = function(){
	if (!HelpGuider.newcomerSpirit_) {
		HelpGuider.newcomerSpirit_ = HelpGuider.NewcomerSpirit.snew(HelpGuider.g_);
	}
	return HelpGuider.newcomerSpirit_;
};
	
HelpGuider.SpiritDlg = JBaseDlg.ex({
	_innerInit : function(){
		this.C_ARROW_W = 57;
		this.C_ARROW_H = 57;
		this.C_SPACE = 6;
		this.C_UPD_DRT = 50;
		
		this.parent_ = null;
		this.uibody_ = TQ.getUiBody();
		this.blinking_ = null;
		this.arraw_ = null;
		this.caller_ = null;
		this.timer_ = null;
		this.arrawPos_ = {x:0, y:0};
		this.arrawDir_ = 0;
		this.arrawDrt_ = 0;		
	}
	
	,_getDlgCfg : function(){
		return {modal:false, pos:{x:"center", y:0}, uiback:uiback.dlg.helpspirit, uicfg:uicfg.help.SpiritDlg};
	}
	
	,_afterCreate : function(){
		this._createBlinkRect();
		this._createArraw();
	}
	
	,_createBlinkRect : function(){
		var zIndex = -1;
		var bakImgs = [];
		if (this.params_.shape == 1) {
			bakImgs = [
				'spirit_select_0'
				,'spirit_select_1'
				,'spirit_select_2'
				,'spirit_select_3'
				,'spirit_select_4'
				,'spirit_select_5'
				,'spirit_select_6'
				,'spirit_select_7'
			];
		} else if (this.params_.shape == 2) {
			bakImgs = ['spirit_select_rhombus'];
		}
		this.blinking_ = BlinkingPanel.snew(this.g_,{zIndex:zIndex, bakImgs:bakImgs});
		this.blinking_.setCaller({self:this, caller:this._onBlinkingEvent});
	}
	
	,_createArraw : function(){
		this.arraw_ = TQ.createDom('div');
		TQ.setCSS(this.arraw_, 'position', 'absolute');
		TQ.setCSS(this.arraw_, 'zIndex', 90000);
	}
	
	,_setCallers : function(){
		this.dlg_.setCaller({self:this, caller:this._onDlgEvent});
	}
	
	,_initInfo : function(){
		this.info_ = this.params_;
		this._setDlgInfo();
		this._changeParent();
		this._setPosAndShow();
		if ( !this.timer_ ) this.timer_ = window.setInterval(this._onTimer(), this.C_UPD_DRT);
	}
	
	,_changeParent : function(){
		var lastparent = this.parent_;
		this.parent_ = this.info_.parent;
		this._resetArrawParent(lastparent, this.parent_);
		this.dlg_.changeParent(this.parent_);
	}	
	
	,_resetArrawParent : function(lastparent, parent){
		if ( lastparent ){
			TQ.remove(lastparent, this.arraw_);
		}
		TQ.append(parent, this.arraw_);
	}
	
	,_onDlgEvent : function(id){
		if ( id == C_SYS_DLG_HIDE ){
			TQ.setCSS(this.arraw_, 'display', 'none');
			this.blinking_.unbind();
			if ( this.caller_ ) this.caller_.caller.call(this.caller_.self, -1);
			if ( this.timer_ ) {
				window.clearInterval(this.timer_);
				this.timer_ = null;
			}
		}
	}
	
	,_onBlinkingEvent : function(){
		this.dlg_.hide();
	}
	
	,_setDlgInfo : function(){
		if ( this.info_ && this.info_.text ){
			TQ.setRichText(this.items_.con, this.info_.text);
		}
	}
	
	,_setPosAndShow : function(){
		var binfo = this.info_.binfo;
		this.blinking_.bind(this.parent_, binfo.dom, BLINKING_TYPE.FLOAT, 
			binfo.x, binfo.y, binfo.w, binfo.h );
		if (binfo.isShow) this.blinking_.start(this.info_.blinktime);
		
		var arect = this.blinking_.getRect();
		var bodyoff = TQ.domOffset(this.uibody_);
		bodyoff.left = 0;
		bodyoff.top = 0;
		
		var fromx = arect.x + arect.w/2 - bodyoff.left;
		var fromy = arect.y + arect.h/2 - bodyoff.top;
		var tox = this.uibody_.offsetWidth/2;
		var toy = this.uibody_.offsetHeight/2;
		var drtx = tox - fromx;
		var drty = toy - fromy;
		
		var parentoff =  TQ.domOffset(this.parent_);
		var dlgdom = this.dlg_.getDom();
		var arrow_x = 0;
		var arrow_y = 0;
		var dlg_x = 0;
		var dlg_y = 0;
		var dir = isNull(this.info_.arrawdir) ? this._calcArrawDir() : this.info_.arrawdir;
		if ( dir == 0 ){
			// 箭头从右指向左
			arrow_x = arect.x + arect.w + this.C_ARROW_W/2 + this.C_SPACE + binfo.offsetx;
			arrow_y = arect.y + arect.h/2 + binfo.offsety;
			dlg_x = arrow_x +  this.C_ARROW_W/2 + this.C_SPACE - bodyoff.left;
			dlg_y = arrow_y - dlgdom.offsetHeight/2 - bodyoff.top;
		} else if ( dir == 1 ){
			// 箭头从下指向上
			arrow_x = arect.x + arect.w/2 + binfo.offsetx;
			arrow_y = arect.y + arect.h + this.C_ARROW_H/2 + this.C_SPACE + binfo.offsety;
			dlg_x = arrow_x - dlgdom.offsetWidth/2 - bodyoff.left;
			dlg_y = arrow_y + this.C_ARROW_H/2 + this.C_SPACE - bodyoff.top;
		} else if ( dir == 3 ){
			// 箭头从上指向下
			arrow_x = arect.x + arect.w/2 + binfo.offsetx;
			arrow_y = arect.y - this.C_ARROW_H/2 - this.C_SPACE + binfo.offsety;
			dlg_x = arrow_x - dlgdom.offsetWidth/2 - bodyoff.left;
			dlg_y = arrow_y - this.C_ARROW_H/2 - this.C_SPACE - dlgdom.offsetHeight - bodyoff.top;
		} else if (dir == 2){
			// 箭头从左指向右
			arrow_x = arect.x - this.C_ARROW_W/2 - this.C_SPACE + binfo.offsetx;
			arrow_y = arect.y + arect.h/2 + binfo.offsety;
			dlg_x = arrow_x - this.C_ARROW_W/2 - this.C_SPACE  - dlgdom.offsetWidth - bodyoff.left;
			dlg_y = arrow_y - dlgdom.offsetHeight/2 - bodyoff.top;
		}
		
		this._setArrowPos(dir, arrow_x, arrow_y);
		dlg_x = dlg_x + bodyoff.left - parentoff.left;
		dlg_y = dlg_y + bodyoff.top - parentoff.top;
		this.dlg_.show({x:dlg_x, y:dlg_y});
		TQ.setCSS(this.arraw_, 'zIndex', this.dlg_.getZIndex());
	}
	
	,_calcArrawDir : function(){
		var arect = this.blinking_.getRect();
		var bodyoff = TQ.domOffset(this.uibody_);
		var fromx = arect.x + arect.w/2 - bodyoff.left;
		var fromy = arect.y + arect.h/2 - bodyoff.top;
		var tox = this.uibody_.offsetWidth/2;
		var toy = this.uibody_.offsetHeight/2;
		var drtx = tox - fromx;
		var drty = toy - fromy;
		var dir = 0;
		if ( drtx > 0 && Math.abs(drtx) > Math.abs(drty) ){
			// 箭头从右指向左
			dir = 0;
		}
		else if ( drty > 0 && Math.abs(drty) > Math.abs(drtx) ){
			// 箭头从下指向上
			dir = 1;
		}
		else if ( drty < 0 && Math.abs(drty) > Math.abs(drtx) ){
			// 箭头从上指向下
			dir = 3;
		}
		else{
			// 箭头从左指向右
			dir = 2;
		}
		return dir;
	}
	
	// 设置箭头指示的位置
	//@param dir 箭头的指向 0,1,2,3 -- left,top,right,bottom
	//@param ox, oy 箭头的中心点在屏幕中的绝对位置
	,_setArrowPos : function(dir, ox, oy){
		var w = this.C_ARROW_W;
		var h = this.C_ARROW_H;
		var parentoff = TQ.domOffset(this.parent_);
		this.arrawPos_.x = ox - Math.floor(w / 2) - parentoff.left;
		this.arrawPos_.y = oy - Math.floor(h / 2) - parentoff.top;
		this.arrawDir_ = dir;
		TQ.setDomRect(this.arraw_, this.arrawPos_.x, this.arrawPos_.y, w, h);
		var arrowfiles = ['left.png', 'up.png', 'right.png', 'down.png'];
		IMG.setBKImage(this.arraw_, IMG.makeImg('newcomerhelp/spirit/arraw/'+arrowfiles[dir]));
		TQ.fixIE6Png(this.arraw_);
		TQ.setCSS(this.arraw_, 'display', 'block');
	}
	
	,_onTimer : function(){
		var this_l = this;
		return function(){
			this_l._updateArrow();
		};
	}
	
	,_updateArrow : function(){
		this.arrawDrt_ += this.C_UPD_DRT;
		var dis =  Math.floor(Math.cos(this.arrawDrt_*0.008)*5);
		var x = this.arrawPos_.x;
		var y = this.arrawPos_.y;
		if ( this.arrawDir_ == 0 || this.arrawDir_ == 2 ) {
			x -= dis;
		} else {
			y -= dis;
		}
		TQ.setDomPos(this.arraw_, x, y);
	}
});

HelpGuider.SpiritTipDlg = JBaseDlg.ex({
	_innerInit : function(){
		this.C_UPD_DRT = 50;
		this.parent_ = null;
		this.posInfos = {
			dir0:{
				con:[18, 22, 102, 52]
				,closeBtn:[113, 9, 20, 20]
			}
			,dir1:{
				con:[18, 22+15, 102, 52]
				,closeBtn:[113, 9+15, 20, 20]
			}
			,dir2:{
				con:[18, 22+15, 102, 52]
				,closeBtn:[113, 9+15, 20, 20]
			}
		};
	}
	
	,_getDlgCfg : function(){
		return {modal:false, pos:{x:"center", y:0}, uiback:uiback.dlg.noborder, uicfg:uicfg.help.helptipdlg};
	}
	
	,_afterCreate : function(){
		TQ.fixIE6Png(this.items_.bak);
	}
	
	,_setCallers : function(){
		this.dlg_.setCaller({self:this, caller:this._onDlgEvent});
		this.items_.closeBtn.setCaller({self:this, caller:this._onCloseDlg});
	}
	
	,_initInfo : function(){
		this.info_ = this.params_;
		this._duration = 10000;
		this._setDlgBack();
		this._setElemsPos();
		this._setDlgInfo();
		this._changeParent();
		this._setPos();
		if ( !this.timer_ ) this.timer_ = window.setInterval(this._onTimer(), this.C_UPD_DRT);
	}
	
	,_setDlgBack : function(){
		TQ.setClass(this.items_.bak, 'helptipdlg' + this.info_.arrawdir);
		TQ.fixIE6Png(this.items_.bak);
	}
	
	,_setElemsPos : function(){
		var posInfo = this.posInfos['dir' + this.info_.arrawdir];
		TQ.setDomRect(this.items_.closeBtn.getParent(), posInfo.closeBtn[0], posInfo.closeBtn[1], posInfo.closeBtn[2],posInfo.closeBtn[3] );
		TQ.setDomRect(this.items_.con, posInfo.con[0], posInfo.con[1], posInfo.con[2], posInfo.con[3] );
	}
	
	,_setDlgInfo : function(){
		if ( this.info_ && this.info_.text ){
			TQ.setRichText(this.items_.con, this.info_.text);
		}
	}
	
	,_changeParent : function(){
		var lastparent = this.parent_;
		this.parent_ = this.info_.parent;
		this.dlg_.changeParent(this.parent_);
	}	
	
	,_setPos : function(){
		var binfo = this.info_.binfo;
		var parentOffset = TQ.domOffset(this.parent_);
		var targetOffset = TQ.domOffset(binfo.dom);
		var dlgDom = this.dlg_.getDom();
		var x = targetOffset.left - parentOffset.left + dlgDom.offsetWidth/2 + binfo.offsetx;
		var y = targetOffset.top - parentOffset.top - dlgDom.offsetHeight + binfo.offsety;
		this.dlg_.show({x:x, y:y});
	}
	
	,_onDlgEvent : function(id){
		if ( id == C_SYS_DLG_HIDE ){
			if ( this.caller_ ) this.caller_.caller.call(this.caller_.self, -1);
			if ( this.timer_ ) {
				window.clearInterval(this.timer_);
				this.timer_ = null;
			}
		}
	}
	
	,_onCloseDlg : function(){
		this.hideDlg();
	}
	
	,_onTimer : function(){
		var this_l = this;
		return function(){
			this_l._updateDuration();
		};
	}
	
	,_updateDuration : function(){
		this._duration -= this.C_UPD_DRT;
		if ( this._duration <= 0 ) {
			this.hideDlg();
		}
	}
});
	
//---------------------------------------------------------------//
HelpGuider.RoleCanDoSomethingChecker = Class.extern(function(){
	this.init = function(){
	};
	
	this._checkPPAssign = function(){
	};
	
	this._checkHeroExpsAssign = function(){
	};
});

HelpGuider.TaskCanDoSomethingChecker = Class.extern(function(){
	this.init = function(){
	};
	
	this._checkCanGetCommAward = function(){
	};
	
	this._checkCanGetPrestigeAward = function(){
	};
	
	this._checkCanDoRoleTask = function(){
	};
});

HelpGuider.HeroCanDoSomethingChecker = Class.extern(function(){
	this.init = function(){
	};
	
	this._checkPPAssign = function(){
	};
	
	this._checkCanWearArm = function(){
		// 类似于刀塔传奇的，左边 带+号的绿色框，右边 列出可装备的，不可装备的排列到后面，加红色蒙版
	};
	
	this._checkCanOfficial = function(){
	};
});

HelpGuider.AlliCanDoSomethingChecker = Class.extern(function(){
	this.init = function(){
	};
	
	this._hasApplyJoin = function(){
	};
});

HelpGuider.HasNewArmyChecker = Class.extern(function(){
	this.init = function(){
	};
});

//---------------------------------------------------------------//
HelpGuider.HasNewMailChecker = Class.extern(function(){
	this.init = function(){
	};
});

HelpGuider.HasCanExchangeChecker = Class.extern(function(){
	this.init = function(){
	};
});

//---------------------------------------------------------------//
HelpGuider.HasCanCompleteFarmChecker = Class.extern(function(){
	this.init = function(){
	};
});

//---------------------------------------------------------------//
HelpGuider.ActValCanDoSomethingChecker = Class.extern(function(){
	this.init = function(){
	};
	
	this._checkCanGetAward = function(){
	};
	
	this._checkTodaySignin = function(){
	};
});

//---------------------------------------------------------------//
HelpGuider.CanDoSomething = Class.extern(function(){
	this.init = function(){
		this._regCheckers = [];
	};
});

//---------------------------------------------------------------//
//---------------------------------------------------------------//
HelpGuider.NewerMainEmptyBlock = Class.extern(function(){
	// 如果还没有任何建筑， 指向一块空地，提示建造民居（判断任务？）
	// 可以建筑酒馆时，在一空地提示建筑
});

HelpGuider.NewerMainBuild = Class.extern(function(){
	// 如果还没有任何建筑， 指向一块空地，提示建造民居（判断任务？）
});

HelpGuider.NewerRoleDlgChecker = Class.extern(function(){
	// 免费转州
	// 个性签名
});

HelpGuider.NewerTaskDlgChecker = Class.extern(function(){
	// 没有武将时，提示，同时不记录，下次打开继续提示，判断有没有酒馆
	// 有武将时，
});

HelpGuider.NewerHeroDlgChecker = Class.extern(function(){
	// 没有武将时，提示，同时不记录，下次打开继续提示，判断有没有酒馆
	// 有武将时，如果没有穿戴过装备，且没有合适的装备：
	// 有武将时，如果没有穿戴过装备，且有合适的装备：
	// 有武将时，且等级达到12级时，如果没有提升过内功：
	// 有武将时，且等级达到12级时，如果没有修炼果筋脉：
	// 有武将时，且等级达到60级时，如果没有领悟过技能时：
	// 有武将时，且等级达到60级时，如果没有学习过技能时：
	// 有武将时，且等级达到60级时，如果没有修炼过技能时：
	// 有武将时，且等级达到60级时，且是勇士时，如果没有学习过专精技能时：
	// 有武将时，没有足够的武勋：
	// 有武将时，且有足够的武勋：
});

HelpGuider.NewerAlliDlgChecker = Class.extern(function(){
	// 没有建立外使院时
	// 已建立外使院，且没有加入联盟，创建页签
	// 已建立外使院，且没有加入联盟，申请页签
	// 已建立外使院，已加入联盟，提示贡献，提示圣兽喂养，提示联盟福利领取，提示联盟福利发放
});

HelpGuider.NewerExpedDlgChecker = Class.extern(function(){
	// 选择目标
	// 更改部署
	//     如果默认小队，且没有设置过，提示使用默认小队(并行关系)
	// 出征
	
	// 首次有重伤，快速医疗(并行关系)
	// 首次有未满的士兵，快速补兵(并行关系)
	// 首次任务需求，配兵(并行关系)
});


HelpGuider.NewerAssignHeroDlgChecker = Class.extern(function(){
	// 如果首次有阵型，则阵型的选择(并行关系)
	// 如果
	//        设置默认小队
	// 出征
});

HelpGuider.NewerAssignSoldierDlgChecker = Class.extern(function(){
	//        配兵设置
	//                如果没有
	//        设置默认小队
	// 出征
});

HelpGuider.NewerMilitaryDlgChecker = Class.extern(function(){
	// 
});

HelpGuider.NewerMilitaryDlgChecker = Class.extern(function(){
	// 
});

HelpGuider.NewerPkgDlgChecker = Class.extern(function(){
	// 8/250 增加tips说明
});
	
HelpGuider.NewerChecker = Class.extern(function(){
	this.init = function(){
		this._regCheckers = [];
	};
});

//---------------------------------------------------------------------------
//HelpGuider.spiritRhombus({parent:TQ.getDomParent(m_items.cityflag), text:'城池升级', blinktime:1000000, arrawdir:3, binfo:{dom:m_items.cityflag, x:-8, y:-8, w:76, h:41}});

