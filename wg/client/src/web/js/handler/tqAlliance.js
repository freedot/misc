/*******************************************************************************/
AllianceLawLight = Class.extern(function(){
	var m_g = null;
	var m_lawLightInfo = {
		level:1
		,growup:{val:0}
		};
	this.init = function(g){
		m_g = g;
	};
	
	this.copyLawLight = function(lawLight){
		TQ.dictCopy(m_lawLightInfo, lawLight);
	};
	
	this.getLevel = function(){
		return m_lawLightInfo.level;
	};
	
	this.getGrowupVal = function(){
		return m_lawLightInfo.growup.val;
	};
});

AllianceMember = Class.extern(function(){
	var m_g = null;
	var m_member = {
		alliPos : 0
		,contributes : 0
		,gainGift : {count:0, lastTime:0}
		,feed : {count:0, lastTime:0}		
	};
	
	this.init = function(g){
		m_g = g;
	};
	
	this.copySelfMember = function(selfMember){
		TQ.dictCopy(m_member, selfMember);
	};
	
	this.getAlliPos = function(){
		return m_member.alliPos;
	};
	
	this.isTodayGotRes = function(){
		return TQ.isSameDay(m_g.getSvrTimeS(), m_member.gainGift.lastTime);
	};	
	
	this.getTodayFeedTimes = function(){
		if (!TQ.isSameDay(m_g.getSvrTimeS(), m_member.feed.lastTime)){
			return 0;
		}
		return m_member.feed.count;
	};
	
	this.getContributes = function(){
		return m_member.contributes;
	};
});

Alliance = Class.extern(function(){
	//Alliance-unittest-start
	var m_g = null;
	var m_lawLight = null;
	var m_selfMember = null;
	var m_alliinfo = {};
	var m_auction = {items:[]};

	this.init = function(g){
		m_g = g;
		m_lawLight = AllianceLawLight.snew(m_g);
		m_selfMember = AllianceMember.snew(m_g);
		this.clear();
	};
	
	this.clear = function() {
		m_alliinfo = {
			name: "",
			cityResId:9900001,
			flag:'',
			rank:0,
			honour:0,
			level: 1,
			leader:'',
			mem:0,
			buildVal:0,
			card:0,
			qqGroup:'',
			introduction:'',
			bulletin:'',
			upgrade:{startTime:0,stopTime:0},
			transfer:{name:'', startTime:0,stopTime:0},
			dismiss:{startTime:0,stopTime:0}
		};
	};
	
	this.copyDetail = function(detail){
		TQ.dictCopy(m_alliinfo, detail);
	};
	
	this.copyLawLight = function(lawLight){
		m_lawLight.copyLawLight(lawLight);
	};
	
	this.copyAuction = function(auction){
		TQ.dictCopy(m_auction, auction);
		ItemResUtil.initItemsres(m_auction.items);
	};
	
	this.copySelfMember = function(selfMember){
		m_selfMember.copySelfMember(selfMember);
	};
	
	this.getName = function(){
		return m_alliinfo.name;
	};
	
	this.getCityResId = function(){
		return m_alliinfo.cityResId;
	};
	
	this.getAlliFlag = function(){
		return m_alliinfo.flag;
	};
	
	this.getRank = function(){
		return m_alliinfo.rank;
	};
	
	this.getHonour = function(){
		return m_alliinfo.honour;
	};
	
	this.getLeader = function(){
		return m_alliinfo.leader;
	};
	
	this.getMemCount = function(){
		return m_alliinfo.mem;
	};
	
	this.getQQGroup = function(){
		return m_alliinfo.qqGroup;
	};
	
	this.getIntroduction = function(){
		return m_alliinfo.introduction;
	};
	
	this.getBulletin = function(){
		return m_alliinfo.bulletin;
	};
	
	this.getLevel = function(){
		return m_alliinfo.level;
	};
	
	this.getUpgradeStartTime = function(){
		return m_alliinfo.upgrade.startTime;
	};
	
	this.getUpgradeStopTime = function(){
		return m_alliinfo.upgrade.stopTime;
	};
	
	this.getTransferStartTime = function(){
		return m_alliinfo.transfer.startTime;
	};
	
	this.getTransferStopTime = function(){
		return m_alliinfo.transfer.stopTime;
	};
	
	this.getTransferName = function(){
		return m_alliinfo.transfer.name;
	};
	
	this.getDismissStartTime = function(){
		return m_alliinfo.dismiss.startTime;
	};
	
	this.getDismissStopTime = function(){
		return m_alliinfo.dismiss.stopTime;
	};
	
	this.getBuildVal = function(){
		return m_alliinfo.buildVal;
	};
	
	this.getCardNumber = function(){
		return m_alliinfo.card;
	};
	
	this.isUpgradingAlliance = function(){
		return this.getUpgradeStopTime() > 0;
	};
	
	this.isTransfering = function(){
		return this.getTransferStopTime() > 0;
	};
	
	this.isDismissing = function(){
		return this.getDismissStopTime() > 0;
	};
	
	this.isFullLevel = function(){
		return this.getLevel() >= res_alli_max_level;
	};
	
	this.getLawLight = function(){
		return m_lawLight;
	};
	
	this.getSelfMember = function(){
		return m_selfMember;
	};
	
	this.getAuctionItems = function(){
		return m_auction.items;		
	};
	//Alliance-unittest-end
});
