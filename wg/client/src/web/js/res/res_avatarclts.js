/** 角色方向定义
            3     
	       |   
	2 ------- 0
            |   
            1     
*/

res_actdefaults = {
	'prepare':'prepare'
	,'attack':'attack'
	,'run':'run'
	,'hit':'hit'
	,'die':'die'
};

res_avatarclts = [
	{
		id:160001
		,acts:{
			'stand':{id:0,dirs:[0]}
			,'prepare':{id:1,dirs:[0]}
			,'attack':{id:2,dirs:[0]}
			,'hit':{id:3,dirs:[0]}
			,'run':{id:4,dirs:[0]}
		}
	}
	,{
		id:160002
		,acts:{
			'stand':{id:0,dirs:[0]}
			,'prepare':{id:2,dirs:[0]}
			,'attack':{id:3,dirs:[0]}
			,'hit':{id:4,dirs:[0]}
			,'run':{id:4,dirs:[0]}
		}
	}
];