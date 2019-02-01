res_test_items = [];

var reinit_items_builds = function(){
	for ( var i=0; i<res_items_builds.length; ++i ) {
		var it = res_items_builds[i];
		if ( !it.irects || it.irects == '' ) {
			it.irects = null;
		}
		else {
			it.irects = eval(it.irects);
		}
	}
};

reinit_items_builds();

var check_drops_exp_and_credit_mutex = function(){
	for ( var i=0; i<res_drops.length; ++i ) {
		var drop = res_drops[i];
		if ( drop.heroexp && drop.credit ) {
			if ( drop.heroexp.pro > 0 
				&& drop.heroexp.maxnum > 0
				&& drop.credit.pro > 0 
				&& drop.credit.maxnum > 0 ) {
				assert ( false, 'heroexp and credit collision in res_drops [id]:'+drop.id);
			}
		}
	}
};
check_drops_exp_and_credit_mutex();

//add bindid, nobindid, isbind in res_items_ex
var add_bindinfo_in_res_items_ex = function(){
	for ( var i in res_items_ex ) {
		var item = res_items_ex[i];
		if (item.isbind == null || item.isbind == undefined){
			item.isbind = 0;
		}
		
		if (item.bindid == null || item.bindid == undefined){
			item.bindid = 0;
		}
		
		if (item.nobindid == null || item.nobindid == undefined){
			item.nobindid = 0;
		}
		
		if (item.nobindid > 0) {
			var nobindItem = TQ.qfind(res_items_ex, 'id', item.nobindid);
			if (nobindItem) {
				nobindItem.bindid = item.id;
			}
		}
	}
};
add_bindinfo_in_res_items_ex();

//add addpopu field in res_inbuild
var add_addpopu_in_res_inbuild = function(){
	var lastPopu = 0;
	for ( var i=0; i<res_inbuild.length; ++i ) {
		var b = res_inbuild[i];
		if ( !b.popu ) continue;
		
		b.addpopu = b.popu - lastPopu;
		lastPopu = b.popu;
	}
};
add_addpopu_in_res_inbuild();

//collect Terrace res
res_terrace = {};
var collect_terrace_res = function(){
	var startId = 173200;
	var endId = 173262;
	TQ.qfind(res_copyfields, 'id', startId);
	var startResIdx = TQ.getLastFindIdx();
	TQ.qfind(res_copyfields, 'id', endId);
	var endResIdx = TQ.getLastFindIdx();
	for ( var idx=startResIdx; idx<=endResIdx; ++idx ) {
		var res = res_copyfields[idx];
		if (!res_terrace[res.gateId]) {
			res_terrace[res.gateId] = [];
		}
		res_terrace[res.gateId].push(res);
	}
};
collect_terrace_res();

// 添加被转表工具优化了的值
res_activityval_rewards[0].val = 0;
res_activityval_tips[0].val = 0;

// 从 res_newhelp_tasks 收集 新手指引帮助到 res_helps中
var collect_newhelp_to_res_helps = function(){
	for ( var i=0; i<res_newhelp_tasks.length; ++i ) {
		var res = res_newhelp_tasks[i];
		res_helps.catalog[0].catalog.push({name:res.name, res:res, catalog:[]});
	}
};
collect_newhelp_to_res_helps();

// 生成分类的商品售卖列表
res_shops_class = [];  // [ {id:1, name:'tag1', list:[{id:10001},], ]
var init_res_shops_class = function(){
	for ( var i=0; i<res_shops.length; ++i ) {
		var s = res_shops[i];
		var shopClass = TQ.find(res_shops_class, 'id', s.type);
		if (!shopClass){
			res_shops_class.push({id:s.type, name:TQ.find(res_shops_tagsname, 'id', s.type).name, list:[]});
			shopClass = res_shops_class[res_shops_class.length-1];
		}
		var itemnumsec = s.itemnumsec ? s.itemnumsec : 0;
		var itemnum = s.itemnum ? s.itemnum : 0;
		shopClass.list.push({id:s.itemid, itemnumsec:itemnumsec, itemnum:itemnum});
	}
};
init_res_shops_class();


res_everyday_task_cnt = 0;
calc_res_everyday_task_cnt = function(){
	for ( var i=0; i<res_tasks.length; ++i ) {
		var task = res_tasks[i];
		if (task.type == TASK_TYPE.EVERYDAY) res_everyday_task_cnt++;
	}
};
calc_res_everyday_task_cnt();

