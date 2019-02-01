/*******************************************************************************/
ClickItemHdr = Class.extern(function(){
	this.init = function(g){
		this.g_ = g;
		
		this.tip_ = null;
		this.pos_ = {x:0, y:0};
		this.roleId_ = 0;
		this.item_ = {};
			
		this.g_.regEvent(EVT.NET, NETCMD.ITEM, this, this._onSvrPkg);
	};
	
	this.click = function(pos, roleId, item){
		this._createTip();
		this.tip_.hide();
		
		this.pos_ = pos;
		this.roleId_ = roleId;
		this.item_ = item;
		if ( this._isSelfItem() && this._isUniqueItem() ) {
			this.item_ = this.g_.getImgr().getItemById(this.item_.id);
		}
		
		if ( !this._isSelfItem() && this._isUniqueItem() ) {
			ItemInfoSender.sendGetDetailItem(this.g_, this.roleId_, this.item_.id);
		} else if (this.item_ == null) {
			this.g_.getGUI().sysMsgTips(SMT_NORMAL, rstr.ids[100168].msg);
		} else {
			this.tip_.show(this.pos_);
		}
	};
	
	this._createTip = function(){
		if (this.tip_) return;
		var tipid = TTIP.addTip(TQ.getUiBody(), 'no');
		this.tip_ = TTIP.getTipById(tipid);
		this.tip_.setFlag(TIP_FLAG.CUSTOM);
		this.tip_.setCaller({self:this, caller:this._onGetBlockTooltip});
	};
	
	this._onGetBlockTooltip = function(){
		return TIPM.getItemDesc(this.item_, this._isSelfItem() ? 'self' : 'other', false);
	};
	
	this._onSvrPkg = function(netevent){
		var pkg = netevent.data;
		if ( pkg.result < 0 ) {
			return;
		}
		
		if ( pkg.roleId == this.roleId_ 
			&& pkg.detailitem 
			&& pkg.detailitem.id == this.item_.id ){
			TQ.dictCopy(this.item_, pkg.detailitem);
			this.tip_.show(this.pos_);
		}
	};
	
	this._isSelfItem = function(){
		return this.g_.getImgr().getRoleId() == this.roleId_;
	};
	
	this._isUniqueItem = function(){
		return (this.item_.itemres.pile && this.item_.itemres.pile == 1);
	};
});
