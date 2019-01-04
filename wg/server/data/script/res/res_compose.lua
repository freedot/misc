res_upskillneed = {
	maxlevel=100,
	expends={
		{attr=ATTR.XP,type=EXPEND_TYPE.HEROATTR,val=0,valcalc=function(SLVL)  return 5*SLVL*SLVL*SLVL+10 end},
		{attr=ATTR.MONEY,type=EXPEND_TYPE.MONEY,val=0,valcalc=function(SLVL)  return 0.8*SLVL*SLVL*SLVL+10 end},
	},
	cond={dlevel=5}, --技能等级和英雄等级的差级 skilllevel - herolevel < dlevel
};


