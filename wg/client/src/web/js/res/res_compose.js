var res_compose = [
	{
		resid:2500001,
		need: {
			items: [{
				resid: 5000001,
				number: 5
			}
			,{
				resid: 5000001,
				number: 15
			}
			,{
				resid: 5000001,
				number: 2
			}
			],
			money: 10,
			phy: 5
		}
	}
];

var res_intensify = [
	{//0 -> 1
		need:{
			items: [{
				resid: 5000001,
				number: 5
			}
			,{
				resid: 5000002,
				number: 0
			}],
			money: 12,
			phy: 5
		}
		,addbattrper:20
	}
	,{//1 -> 2
		need:{
			items: [{
				resid: 5000001,
				number: 5
			}
			,{
				resid: 5000002,
				number: 10
			}],
			money: 120000,
			phy: 5
		}
		,addbattrper:40
	}
];

var res_resolve = [
	{//0 -> 1
		need:{
			items: [{
				resid: 5000001,
				number: 5
			}
			,{
				resid: 5000002,
				number: 0
			}],
			money: 12,
			phy: 5
		}
		,addbattrper:20
	}
	,{//1 -> 2
		need:{
			items: [{
				resid: 5000001,
				number: 5
			}
			,{
				resid: 5000002,
				number: 10
			}],
			money: 120000,
			phy: 5
		}
		,addbattrper:40
	}
];

var res_upskillneed = {
	maxlevel:100
	,need:{
		exp:'5*SLVL*SLVL*SLVL+10'
		,money:'0.8*SLVL*SLVL*SLVL+10'
	}
	,expends:[
		{attr:ATTR.XP,type:EXPEND_TYPE.HEROATTR,val:0,valcalc:function(SLVL){  return 5*SLVL*SLVL*SLVL+10; }}
		,{attr:ATTR.MONEY,type:EXPEND_TYPE.MONEY,val:0,valcalc:function(SLVL){  return 0.8*SLVL*SLVL*SLVL+10; }}
	]
	,cond:{dlevel:5} //技能等级和英雄等级的差级 skilllevel - herolevel < dlevel
};
