var res_country_names = ["魏国", "蜀国", "吴国"];
var res_opos_names = ["平民", "伍长", "什长", "里魁", "亭长", "啬夫", "县长", "县令", "督邮", "太守", "别驾", "刺史", "州牧"];
var res_jpos_names = ["平民", "公士", "上造", "簪袅", "不更", "大夫", "官大夫", "公大夫", "公乘", "五大夫", "左庶长", "右庶长", "左更", "中更", "右更", "少上造", "大上造", "驷车庶长", "大庶长", "关内侯", "列侯"];
var res_apos_names = ["普通", "王爷", "宰相", "帝王"];
var res_morale_statenames = ["稳定", "下降", "上升"];
var res_populace_statenames = ["稳定", "下降", "上升"];
var res_gen_state = ["空闲","守城","主将","军师"];
var res_commres = [{ename:'food', name:'粮食'}, {ename:'wood', name:'木材'}, {ename:'stone', name:'石料'}, {ename:'iron', name:'生铁'}];
var res_fieldflags = ['湖泊', '沼泽', '森林', '荒漠', '山地', '草原', '平地', '城池'];
var res_fieldadds = [{name:'粮食', base:8, add:3}, {name:'粮食', base:5, add:2}, {name:'木材', base:5, add:2}, {name:'石料', base:5, add:2}, {name:'铁矿', base:5, add:2}, {name:'粮食', base:12, add:1}, {name:'平地', base:0, add:0}];
var res_battlestates = ['和平', '采集', '战斗'];
var res_rolestates = ['正常','免战','休假'];
var res_rolestatedetails = ['你正处于“正常”状态，可以攻击他人的城池，也会遭到敌人的攻击。你可以修改状态为“免战”或“休假”。', '使用道具“免战牌”才能更改为“免战”状态。持续12小时，冷却6小时。“免战”每次需要消耗一个免战牌。“免战”状态可避免其他玩家的攻击，自己也无法向他人的城池出征。对已经在出征途中的敌人无效。', '花费金币才能更改为“休假”状态，每次休假需要的金币数量和休假天数有关。你必须停止所有的建筑、科技、军队、城防、出征，才能进入休假。“休假”状态一经开启，玩家就不能进行任何游戏操作。休假至少持续48小时才能解除。“休假”状态下，资源的增长和消耗都将停止。其他玩家不能对其城池出征。对已经在出征途中的敌人无效。'];
var res_armposs = ['所有装备','头部','颈部','肩部','胸部','背部','腰部','手臂','脚部','手指','武器','坐骑'];
var res_genarmgrids = [{gridpos:0,armpos:1},{gridpos:1,armpos:3},{gridpos:2,armpos:2},{gridpos:3,armpos:4},{gridpos:4,armpos:5},{gridpos:5,armpos:7},{gridpos:6,armpos:6},{gridpos:7,armpos:9},{gridpos:8,armpos:10},{gridpos:9,armpos:10},{gridpos:10,armpos:8},{gridpos:11,armpos:11}];

var res_pkgtabtags = ['arm','gem','speed','breed','chest','pear','task'];

var res_fieldouts = [{base:8,add:3,get:"粮食",desc:"珍珠、珊瑚、夜明珠"},
{base:5,add:2,get:"粮食",desc:"翡翠、珊瑚、珍珠"},
{base:5,add:2,get:"木材",desc:"琥珀、水晶、翡翠"},
{base:5,add:2,get:"石料",desc:"琉璃、玉石、玛瑙"},
{base:5,add:2,get:"生铁",desc:"玛瑙、水晶、玉石"},
{base:3,add:1,get:"粮食",desc:"琉璃、琥珀、水晶"},
{base:0,add:0,get:"",desc:"可以筑城"},
{base:0,add:0,get:"",desc:""}];

var res_elems = ['金','木','水','火','土'];