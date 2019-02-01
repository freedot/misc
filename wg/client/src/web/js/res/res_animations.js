/** 角色方向定义
           4   
	      |   
	3 ------- 1
            |  
           2
*/
/*
res_actdefaults = {
	'prepare':'prepare'  01
	,'attack':'attack'  02
	,'run':'run'  03
	,'hit':'hit'  04
	,'die':'die' 05
};

150001

150001 方向01 动作01
150001 01 02

// 000.png, ... 00n.png
*/

res_effectclts = [ // 将要作废
	{
		id:100000,size:{cx:32,cy:32},corner:{x:16,y:32},dirs:[0]
	},
	{
		id:100001,size:{cx:32,cy:32},corner:{x:16,y:32},dirs:[0]
	},
	{
		id:100002,size:{cx:32,cy:32},corner:{x:16,y:32},dirs:[0]
	},
	{
		id:100003,size:{cx:32,cy:32},corner:{x:16,y:32},dirs:[0]
	},
	{
		id:100004,size:{cx:32,cy:32},corner:{x:16,y:32},dirs:[0]
	},
	{
		id:100005,size:{cx:32,cy:32},corner:{x:16,y:32},dirs:[0,5]
	}
];

res_animations = [
	{
		id:100006, path:'effects/test1/', playTimes:10, frameSize:{cx:80, cy:96}, frameCount:12, frameInterval:100
	}
        ,{ 
		id:1500010101, path:'avatars/1500010101/', playTimes:0, frameSize:{cx:63, cy:63}, center:{x:31, y:50}, frameCount:1, frameInterval:100
	}
	,{ 
		id:1500010102, path:'avatars/1500010102/', playTimes:1, frameSize:{cx:63, cy:63}, center:{x:31, y:50}, frameCount:8, frameInterval:100
	}
	,{ 
		id:1500010103, path:'avatars/1500010103/', playTimes:0, frameSize:{cx:46, cy:54}, center:{x:12, y:46}, frameCount:8, frameInterval:100
	}
        ,{ 
		id:1500010104, path:'avatars/1500010104/', playTimes:1, frameSize:{cx:54, cy:52}, center:{x:24, y:44}, frameCount:6, frameInterval:100
	}
        ,{ 
		id:1500010105, path:'avatars/1500010105/', playTimes:1, frameSize:{cx:74, cy:58}, center:{x:24, y:48}, frames:[100,100,100,100,100,100,100,1500]
	}
        ,{ 
		id:1500010201, path:'avatars/1500010201/', playTimes:0, frameSize:{cx:84, cy:76}, center:{x:34, y:58}, frameCount:1, frameInterval:100
	}
        ,{ 
		id:1500010202, path:'avatars/1500010202/', playTimes:1, frameSize:{cx:84, cy:76}, center:{x:34, y:58}, frameCount:8, frameInterval:100
	}
        ,{ 
		id:1500010203, path:'avatars/1500010203/', playTimes:0, frameSize:{cx:38, cy:57}, center:{x:12, y:47}, frameCount:8, frameInterval:100
	}
        ,{ 
		id:1500010204, path:'avatars/1500010204/', playTimes:1, frameSize:{cx:55, cy:57}, center:{x:25, y:49}, frameCount:6, frameInterval:100
	}
        ,{ 
		id:1500010205, path:'avatars/1500010205/', playTimes:1, frameSize:{cx:54, cy:85}, center:{x:22, y:55}, frames:[100,100,100,100,100,100,100,1500]
	}
        ,{ 
		id:1500010301, path:'avatars/1500010301/', playTimes:0, frameSize:{cx:85, cy:74}, center:{x:37, y:56}, frameCount:1, frameInterval:100
	}
        ,{ 
		id:1500010302, path:'avatars/1500010302/', playTimes:1, frameSize:{cx:85, cy:74}, center:{x:37, y:56}, frameCount:8, frameInterval:100
	}
        ,{ 
		id:1500010303, path:'avatars/1500010303/', playTimes:0, frameSize:{cx:49, cy:51}, center:{x:23, y:45}, frameCount:8, frameInterval:100
	}
        ,{ 
		id:1500010304, path:'avatars/1500010304/', playTimes:1, frameSize:{cx:58, cy:50}, center:{x:20, y:44}, frameCount:6, frameInterval:100
	}
        ,{ 
		id:1500010305, path:'avatars/1500010305/', playTimes:1, frameSize:{cx:79, cy:66}, center:{x:43, y:53}, frames:[100,100,100,100,100,100,100,1500]
	}
        ,{ 
		id:1500010401, path:'avatars/1500010401/', playTimes:0, frameSize:{cx:76, cy:51}, center:{x:32, y:44}, frameCount:1, frameInterval:100
	}
        ,{ 
		id:1500010402, path:'avatars/1500010402/', playTimes:1, frameSize:{cx:76, cy:51}, center:{x:32, y:44}, frameCount:7, frameInterval:100
	}
        ,{ 
		id:1500010403, path:'avatars/1500010403/', playTimes:0, frameSize:{cx:34, cy:56}, center:{x:14, y:47}, frameCount:8, frameInterval:100
	}
        ,{ 
		id:1500010404, path:'avatars/1500010404/', playTimes:1, frameSize:{cx:49, cy:51}, center:{x:17, y:44}, frameCount:6, frameInterval:100
	}
        ,{ 
		id:1500010405, path:'avatars/1500010405/', playTimes:1, frameSize:{cx:58, cy:57}, center:{x:23, y:48}, frames:[100,100,100,100,100,100,100,1500]
	}
        ,{ 
		id:1500020101, path:'avatars/1500020101/', playTimes:0, frameSize:{cx:83, cy:50}, center:{x:24, y:44}, frameCount:1, frameInterval:100
	}
        ,{ 
		id:1500020102, path:'avatars/1500020102/', playTimes:1, frameSize:{cx:83, cy:50}, center:{x:24, y:44}, frameCount:7, frameInterval:100
	}
        ,{ 
		id:1500020103, path:'avatars/1500020103/', playTimes:0, frameSize:{cx:71, cy:48}, center:{x:28, y:41}, frameCount:8, frameInterval:100
	}
        ,{ 
		id:1500020104, path:'avatars/1500020104/', playTimes:1, frameSize:{cx:67, cy:63}, center:{x:11, y:55}, frameCount:6, frameInterval:100
	}
        ,{ 
		id:1500020105, path:'avatars/1500020105/', playTimes:1, frameSize:{cx:68, cy:55}, center:{x:17, y:38}, frames:[100,100,100,100,100,100,100,1500]
	}
        ,{ 
		id:1500020201, path:'avatars/1500020201/', playTimes:0, frameSize:{cx:61, cy:78}, center:{x:21, y:44}, frameCount:1, frameInterval:100
	}
        ,{ 
		id:1500020202, path:'avatars/1500020202/', playTimes:1, frameSize:{cx:61, cy:78}, center:{x:21, y:44}, frameCount:7, frameInterval:100
	}
        ,{ 
		id:1500020203, path:'avatars/1500020203/', playTimes:0, frameSize:{cx:33, cy:58}, center:{x:11, y:43}, frameCount:8, frameInterval:100
	}
        ,{ 
		id:1500020204, path:'avatars/1500020204/', playTimes:1, frameSize:{cx:67, cy:65}, center:{x:30, y:43}, frameCount:6, frameInterval:100
	}
        ,{ 
		id:1500020205, path:'avatars/1500020205/', playTimes:1, frameSize:{cx:58, cy:63}, center:{x:29, y:40}, frames:[100,100,100,100,100,100,100,1500]
	}
        ,{ 
		id:1500020301, path:'avatars/1500020301/', playTimes:0, frameSize:{cx:92, cy:48}, center:{x:55, y:39}, frameCount:1, frameInterval:100
	}
        ,{ 
		id:1500020302, path:'avatars/1500020302/', playTimes:1, frameSize:{cx:92, cy:48}, center:{x:55, y:39}, frameCount:7, frameInterval:100
	}
        ,{ 
		id:1500020303, path:'avatars/1500020303/', playTimes:0, frameSize:{cx:69, cy:47}, center:{x:31, y:40}, frameCount:8, frameInterval:100
	}
        ,{ 
		id:1500020304, path:'avatars/1500020304/', playTimes:1, frameSize:{cx:67, cy:58}, center:{x:42, y:50}, frameCount:6, frameInterval:100
	}
        ,{ 
		id:1500020305, path:'avatars/1500020305/', playTimes:1, frameSize:{cx:67, cy:49}, center:{x:43, y:36}, frames:[100,100,100,100,100,100,100,1500]
	}
        ,{ 
		id:1500020401, path:'avatars/1500020401/', playTimes:0, frameSize:{cx:45, cy:54}, center:{x:23, y:41}, frameCount:1, frameInterval:100
	}
        ,{ 
		id:1500020402, path:'avatars/1500020402/', playTimes:1, frameSize:{cx:45, cy:54}, center:{x:23, y:41}, frameCount:7, frameInterval:100
	}
        ,{ 
		id:1500020403, path:'avatars/1500020403/', playTimes:0, frameSize:{cx:33, cy:58}, center:{x:13, y:42}, frameCount:8, frameInterval:100
	}
        ,{ 
		id:1500020404, path:'avatars/1500020404/', playTimes:1, frameSize:{cx:45, cy:65}, center:{x:17, y:58}, frameCount:6, frameInterval:100
	}
        ,{ 
		id:1500020405, path:'avatars/1500020405/', playTimes:1, frameSize:{cx:53, cy:53}, center:{x:19, y:41}, frames:[100,100,100,100,100,100,100,1500]
	}
        ,{ 
		id:1500030101, path:'avatars/1500030101/', playTimes:0, frameSize:{cx:53, cy:64}, center:{x:16, y:59}, frameCount:1, frameInterval:100
	}
        ,{ 
		id:1500030102, path:'avatars/1500030102/', playTimes:1, frameSize:{cx:53, cy:64}, center:{x:16, y:59}, frameCount:8, frameInterval:100
	}
        ,{ 
		id:1500030103, path:'avatars/1500030103/', playTimes:0, frameSize:{cx:59, cy:46}, center:{x:26, y:41}, frameCount:8, frameInterval:100
	}
        ,{ 
		id:1500030104, path:'avatars/1500030104/', playTimes:1, frameSize:{cx:51, cy:47}, center:{x:19, y:42}, frameCount:6, frameInterval:100
	}
        ,{ 
		id:1500030105, path:'avatars/1500030105/', playTimes:1, frameSize:{cx:52, cy:60}, center:{x:22, y:42}, frames:[100,100,100,100,100,100,100,1500]
	}
        ,{ 
		id:1500030201, path:'avatars/1500030201/', playTimes:0, frameSize:{cx:55, cy:65}, center:{x:20, y:57}, frameCount:1, frameInterval:100
	}
        ,{ 
		id:1500030202, path:'avatars/1500030202/', playTimes:1, frameSize:{cx:55, cy:65}, center:{x:20, y:57}, frameCount:8, frameInterval:100
	}
        ,{ 
		id:1500030203, path:'avatars/1500030203/', playTimes:0, frameSize:{cx:38, cy:52}, center:{x:8, y:45}, frameCount:8, frameInterval:100
	}
        ,{ 
		id:1500030204, path:'avatars/1500030204/', playTimes:1, frameSize:{cx:50, cy:54}, center:{x:13, y:43}, frameCount:6, frameInterval:100
	}
        ,{ 
		id:1500030205, path:'avatars/1500030205/', playTimes:1, frameSize:{cx:53, cy:61}, center:{x:30, y:44}, frames:[100,100,100,100,100,100,100,1500]
	}
         ,{ 
		id:1500030301, path:'avatars/1500030301/', playTimes:0, frameSize:{cx:52, cy:65}, center:{x:26, y:54}, frameCount:1, frameInterval:100
	}
        ,{ 
		id:1500030302, path:'avatars/1500030302/', playTimes:1, frameSize:{cx:52, cy:65}, center:{x:26, y:54}, frameCount:8, frameInterval:100
	}
        ,{ 
		id:1500030303, path:'avatars/1500030303/', playTimes:0, frameSize:{cx:59, cy:51}, center:{x:22, y:44}, frameCount:8, frameInterval:100
	}
        ,{ 
		id:1500030304, path:'avatars/1500030304/', playTimes:1, frameSize:{cx:57, cy:59}, center:{x:30, y:44}, frameCount:6, frameInterval:100
	}
        ,{ 
		id:1500030305, path:'avatars/1500030305/', playTimes:1, frameSize:{cx:58, cy:53}, center:{x:31, y:42}, frames:[100,100,100,100,100,100,100,1500]
	}
        ,{ 
		id:1500030401, path:'avatars/1500030401/', playTimes:0, frameSize:{cx:51, cy:67}, center:{x:22, y:60}, frameCount:1, frameInterval:100
	}
        ,{ 
		id:1500030402, path:'avatars/1500030402/', playTimes:1, frameSize:{cx:51, cy:67}, center:{x:22, y:60}, frameCount:8, frameInterval:100
	}
        ,{ 
		id:1500030403, path:'avatars/1500030403/', playTimes:0, frameSize:{cx:41, cy:56}, center:{x:16, y:46}, frameCount:8, frameInterval:100
	}
        ,{ 
		id:1500030404, path:'avatars/1500030404/', playTimes:1, frameSize:{cx:48, cy:51}, center:{x:23, y:44}, frameCount:6, frameInterval:100
	}
        ,{ 
		id:1500030405, path:'avatars/1500030405/', playTimes:1, frameSize:{cx:49, cy:53}, center:{x:19, y:42}, frames:[100,100,100,100,100,100,100,1500]
	}
        ,{ 
		id:1500040101, path:'avatars/1500040101/', playTimes:0, frameSize:{cx:93, cy:56}, center:{x:36, y:47}, frameCount:1, frameInterval:100
	}
        ,{ 
		id:1500040102, path:'avatars/1500040102/', playTimes:1, frameSize:{cx:93, cy:56}, center:{x:36, y:47}, frameCount:8, frameInterval:100
	}
        ,{ 
		id:1500040103, path:'avatars/1500040103/', playTimes:0, frameSize:{cx:70, cy:48}, center:{x:24, y:46}, frameCount:8, frameInterval:100
	}
        ,{ 
		id:1500040104, path:'avatars/1500040104/', playTimes:1, frameSize:{cx:66, cy:54}, center:{x:30, y:46}, frameCount:3, frameInterval:200
	}
        ,{ 
		id:1500040105, path:'avatars/1500040105/', playTimes:1, frameSize:{cx:84, cy:86}, center:{x:48, y:48}, frames:[100,100,100,100,100,100,1500]
	}
        ,{ 
		id:1500040201, path:'avatars/1500040201/', playTimes:0, frameSize:{cx:46, cy:88}, center:{x:26, y:54}, frameCount:1, frameInterval:100
	}
        ,{ 
		id:1500040202, path:'avatars/1500040202/', playTimes:1, frameSize:{cx:46, cy:88}, center:{x:26, y:54}, frameCount:8, frameInterval:100
	}
        ,{ 
		id:1500040203, path:'avatars/1500040203/', playTimes:0, frameSize:{cx:40, cy:64}, center:{x:20, y:51}, frameCount:9, frameInterval:100
	}
        ,{ 
		id:1500040204, path:'avatars/1500040204/', playTimes:1, frameSize:{cx:55, cy:62}, center:{x:35, y:50}, frameCount:3, frameInterval:200
	}
        ,{ 
		id:1500040205, path:'avatars/1500040205/', playTimes:1, frameSize:{cx:62, cy:67}, center:{x:42, y:55}, frames:[100,100,100,100,100,100,1500]
	}
        ,{ 
		id:1500040301, path:'avatars/1500040301/', playTimes:0, frameSize:{cx:91, cy:50}, center:{x:51, y:47}, frameCount:1, frameInterval:100
	}
        ,{ 
		id:1500040302, path:'avatars/1500040302/', playTimes:1, frameSize:{cx:91, cy:50}, center:{x:51, y:47}, frameCount:8, frameInterval:100
	}
        ,{ 
		id:1500040303, path:'avatars/1500040303/', playTimes:0, frameSize:{cx:64, cy:47}, center:{x:37, y:46}, frameCount:9, frameInterval:100
	}
        ,{ 
		id:1500040304, path:'avatars/1500040304/', playTimes:1, frameSize:{cx:60, cy:48}, center:{x:27, y:45}, frameCount:3, frameInterval:200
	}
        ,{ 
		id:1500040305, path:'avatars/1500040305/', playTimes:1, frameSize:{cx:63, cy:55}, center:{x:27, y:50}, frames:[100,100,100,100,100,100,1500]
	}
       ,{ 
		id:1500040401, path:'avatars/1500040401/', playTimes:0, frameSize:{cx:29, cy:65}, center:{x:9, y:52}, frameCount:1, frameInterval:100
	}
        ,{ 
		id:1500040402, path:'avatars/1500040402/', playTimes:1, frameSize:{cx:29, cy:65}, center:{x:9, y:52}, frameCount:8, frameInterval:100
	}
        ,{ 
		id:1500040403, path:'avatars/1500040403/', playTimes:0, frameSize:{cx:29, cy:57}, center:{x:10, y:51}, frameCount:9, frameInterval:100
	}
        ,{ 
		id:1500040404, path:'avatars/1500040404/', playTimes:1, frameSize:{cx:43, cy:60}, center:{x:10, y:51}, frameCount:3, frameInterval:200
	}
        ,{ 
		id:1500040405, path:'avatars/1500040405/', playTimes:1, frameSize:{cx:67, cy:75}, center:{x:11, y:53}, frames:[100,100,100,100,100,100,1500]
	}
        ,{ 
		id:1500050101, path:'avatars/1500050101/', playTimes:0, frameSize:{cx:71, cy:46}, center:{x:37, y:41}, frameCount:1, frameInterval:100
	}
        ,{ 
		id:1500050102, path:'avatars/1500050102/', playTimes:1, frameSize:{cx:71, cy:46}, center:{x:37, y:41}, frameCount:7, frameInterval:100
	}
        ,{ 
		id:1500050103, path:'avatars/1500050103/', playTimes:0, frameSize:{cx:67, cy:39}, center:{x:37, y:34}, frameCount:5, frameInterval:100
	}
        ,{ 
		id:1500050104, path:'avatars/1500050104/', playTimes:1, frameSize:{cx:71, cy:46}, center:{x:37, y:41}, frameCount:3, frameInterval:100
	}
        ,{ 
		id:1500050105, path:'avatars/1500050105/', playTimes:1, frameSize:{cx:74, cy:40}, center:{x:44, y:34}, frames:[100,100,100,100,1500]
	}
        ,{ 
		id:1500050201, path:'avatars/1500050201/', playTimes:0, frameSize:{cx:51, cy:54}, center:{x:23, y:50}, frameCount:1, frameInterval:100
	}
        ,{ 
		id:1500050202, path:'avatars/1500050202/', playTimes:1, frameSize:{cx:51, cy:54}, center:{x:23, y:50}, frameCount:7, frameInterval:100
	}
        ,{ 
		id:1500050203, path:'avatars/1500050203/', playTimes:0, frameSize:{cx:51, cy:49}, center:{x:23, y:45}, frameCount:5, frameInterval:100
	}
        ,{ 
		id:1500050204, path:'avatars/1500050204/', playTimes:1, frameSize:{cx:51, cy:54}, center:{x:23, y:50}, frameCount:3, frameInterval:100
	}
        ,{ 
		id:1500050205, path:'avatars/1500050205/', playTimes:1, frameSize:{cx:58, cy:50}, center:{x:23, y:45}, frames:[100,100,100,100,1500]
	}
        ,{ 
		id:1500050301, path:'avatars/1500050301/', playTimes:0, frameSize:{cx:70, cy:46}, center:{x:33, y:43}, frameCount:1, frameInterval:100
	}
        ,{ 
		id:1500050302, path:'avatars/1500050302/', playTimes:1, frameSize:{cx:70, cy:46}, center:{x:33, y:43}, frameCount:7, frameInterval:100
	}
        ,{ 
		id:1500050303, path:'avatars/1500050303/', playTimes:0, frameSize:{cx:70, cy:39}, center:{x:33, y:36}, frameCount:5, frameInterval:100
	}
        ,{ 
		id:1500050304, path:'avatars/1500050304/', playTimes:1, frameSize:{cx:70, cy:46}, center:{x:33, y:43}, frameCount:3, frameInterval:100
	}
        ,{ 
		id:1500050305, path:'avatars/1500050305/', playTimes:1, frameSize:{cx:72, cy:49}, center:{x:33, y:36}, frames:[100,100,100,100,1500]
	}
        ,{ 
		id:1500050401, path:'avatars/1500050401/', playTimes:0, frameSize:{cx:51, cy:62}, center:{x:23, y:58}, frameCount:1, frameInterval:100
	}
        ,{ 
		id:1500050402, path:'avatars/1500050402/', playTimes:1, frameSize:{cx:51, cy:62}, center:{x:23, y:58}, frameCount:7, frameInterval:100
	}
        ,{ 
		id:1500050403, path:'avatars/1500050403/', playTimes:0, frameSize:{cx:51, cy:45}, center:{x:23, y:41}, frameCount:5, frameInterval:100
	}
        ,{ 
		id:1500050404, path:'avatars/1500050404/', playTimes:1, frameSize:{cx:51, cy:62}, center:{x:23, y:58}, frameCount:3, frameInterval:100
	}
        ,{ 
		id:1502010301, path:'avatars/1502010301/', playTimes:0, frameSize:{cx:238, cy:900}, center:{x:66+35 - 50, y:450-11}, frameCount:1, frameInterval:100
	}
	,{
		id:1502010304, path:'avatars/1502010301/', playTimes:1, frameSize:{cx:238, cy:900}, center:{x:66+35 - 50, y:450-11}, frameCount:1, frameInterval:100
	}
	,{ 
		id:1502010305, path:'avatars/1502010305/', playTimes:1, frameSize:{cx:238, cy:900}, center:{x:66+35 - 50, y:450-11}, frameCount:1, frameInterval:100
	}
        ,{ 
		id:1500050405, path:'avatars/1500050405/', playTimes:1, frameSize:{cx:65, cy:49}, center:{x:37, y:41}, frames:[100,100,100,100,1500]
	}
        ,{ 
		id:1501010101, path:'avatars/1501010101/', playTimes:0, frameSize:{cx:124, cy:127}, center:{x:54, y:85}, frameCount:1, frameInterval:100
	}
        ,{ 
		id:1501010102, path:'avatars/1501010102/', playTimes:1, frameSize:{cx:270, cy:167}, center:{x:78, y:115}, frameCount:9, frameInterval:100
	}
        ,{ 
		id:1501010104, path:'avatars/1501010104/', playTimes:1, frameSize:{cx:124, cy:127}, center:{x:54, y:85}, frameCount:5, frameInterval:100
	}
        ,{ 
		id:1501010105, path:'avatars/1501010105/', playTimes:1, frameSize:{cx:300, cy:300}, center:{x:165, y:173}, frameCount:8, frameInterval:100
	}
        ,{ 
		id:1501010301, path:'avatars/1501010301/', playTimes:0, frameSize:{cx:124, cy:127}, center:{x:69, y:85}, frameCount:1, frameInterval:100
	}
        ,{ 
		id:1501010302, path:'avatars/1501010302/', playTimes:1, frameSize:{cx:270, cy:167}, center:{x:191, y:115}, frameCount:9, frameInterval:100
	}
        ,{ 
		id:1501010304, path:'avatars/1501010304/', playTimes:1, frameSize:{cx:124, cy:127}, center:{x:69, y:85}, frameCount:5, frameInterval:100
	}
        ,{ 
		id:1501010305, path:'avatars/1501010305/', playTimes:1, frameSize:{cx:300, cy:300}, center:{x:134, y:173}, frameCount:8, frameInterval:100
	}
        ,{ 
		id:1501020101, path:'avatars/1501020101/', playTimes:0, frameSize:{cx:65, cy:93}, center:{x:14, y:82}, frameCount:1, frameInterval:100
	}
        ,{ 
		id:1501020102, path:'avatars/1501020102/', playTimes:1, frameSize:{cx:150, cy:129}, center:{x:51, y:115}, frameCount:10, frameInterval:100
	}
        ,{ 
		id:1501020104, path:'avatars/1501020104/', playTimes:1, frameSize:{cx:89, cy:94}, center:{x:21, y:82}, frameCount:5, frameInterval:100
	}
        ,{ 
		id:1501020105, path:'avatars/1501020105/', playTimes:1, frameSize:{cx:115, cy:101}, center:{x:27, y:82}, frameCount:7, frameInterval:100
	}
        ,{ 
		id:1501020301, path:'avatars/1501020301/', playTimes:0, frameSize:{cx:65, cy:93}, center:{x:50, y:82}, frameCount:1, frameInterval:100
	}
        ,{ 
		id:1501020302, path:'avatars/1501020302/', playTimes:1, frameSize:{cx:150, cy:129}, center:{x:98, y:115}, frameCount:10, frameInterval:100
	}
        ,{ 
		id:1501020304, path:'avatars/1501020304/', playTimes:1, frameSize:{cx:89, cy:94}, center:{x:67, y:82}, frameCount:5, frameInterval:100
	}
        ,{ 
		id:1501020305, path:'avatars/1501020305/', playTimes:1, frameSize:{cx:115, cy:101}, center:{x:87, y:82}, frameCount:7, frameInterval:100
	}
        ,{ 
		id:10010100, path:'avatars/10010100/', playTimes:0, frameSize:{cx:62, cy:13}, center:{x:30, y:60}, frameCount:1, frameInterval:100
	}
        ,{ 
		id:10010200, path:'avatars/10010200/', playTimes:0, frameSize:{cx:13, cy:62}, center:{x:6, y:60}, frameCount:1, frameInterval:100
	}
        ,{ 
		id:10010300, path:'avatars/10010300/', playTimes:0, frameSize:{cx:62, cy:13}, center:{x:30, y:60}, frameCount:1, frameInterval:100
	}
        ,{ 
		id:10010400, path:'avatars/10010400/', playTimes:0, frameSize:{cx:13, cy:62}, center:{x:6, y:60}, frameCount:1, frameInterval:100
	}
        ,{ 
		id:10020100, path:'avatars/10020100/', playTimes:0, frameSize:{cx:25, cy:24}, center:{x:12, y:60}, frameCount:1, frameInterval:100
	}
        ,{ 
		id:10030100, path:'avatars/10030100/', playTimes:1, frameSize:{cx:37, cy:68}, center:{x:20, y:40}, frames:[100,100,100,100,100,100,100,1500]
	}
        ,{ 
		id:10040100, path:'avatars/10040100/', playTimes:1, frameSize:{cx:19, cy:102}, center:{x:9, y:59}, frames:[100,100,100,100,100,1500]
	}
        ,{ 
		id:10050100, path:'avatars/10050100/', playTimes:1, frameSize:{cx:37, cy:38}, center:{x:20, y:18}, frames:[0,0,0,500,0,150,150,1500]
	}
        ,{ 
		id:10060100, path:'avatars/10060100/', playTimes:1, frameSize:{cx:96, cy:142}, center:{x:51, y:76}, frames:[100,100,100,100,100,100,100,1500]
	}
        ,{ 
		id:10070100, path:'avatars/10070100/', playTimes:1, frameSize:{cx:278, cy:41}, center:{x:132, y:22}, frames:[100,100,100,100,100,100,1500]
	}
        ,{ 
		id:10001, path:'avatars/10001/', playTimes:1, frameSize:{cx:31, cy:47}, center:{x:15, y:35},frameCount:7, frameInterval:130
	}
        ,{ 
		id:10002, path:'avatars/10002/', playTimes:1, frameSize:{cx:61, cy:82}, center:{x:31, y:58},frameCount:7, frameInterval:100
	}
        ,{ 
		id:10003, path:'avatars/10003/', playTimes:1, frameSize:{cx:425, cy:353}, center:{x:216, y:225},frameCount:10, frameInterval:100
	}
        ,{ 
		id:10004, path:'avatars/10004/', playTimes:1, frameSize:{cx:79, cy:66}, center:{x:39, y:36},frameCount:9, frameInterval:50
	}
        ,{ 
		id:10005, path:'avatars/10005/', playTimes:1, frameSize:{cx:31, cy:47}, center:{x:15, y:35},frameCount:7, frameInterval:130
	}
        ,{ 
		id:10006, path:'avatars/10006/', playTimes:0, frameSize:{cx:104, cy:71}, center:{x:52, y:36},frameCount:5, frameInterval:130
	}
        ,{ 
		id:10007, path:'avatars/10007/', playTimes:0, frameSize:{cx:81, cy:34}, center:{x:39, y:15},frameCount:5, frameInterval:100
	}
        ,{ 
		id:10008, path:'avatars/10008/', playTimes:0, frameSize:{cx:79, cy:67}, center:{x:34, y:33},frameCount:5, frameInterval:130
	}
        ,{ 
		id:10009, path:'avatars/10009/', playTimes:0, frameSize:{cx:25, cy:28}, center:{x:12, y:13},frameCount:8, frameInterval:150
	}
        ,{ 
		id:10010, path:'avatars/10010/', playTimes:0, frameSize:{cx:80, cy:38}, center:{x:37, y:18},frameCount:8, frameInterval:150
	}
        ,{ 
		id:10011, path:'avatars/10011/', playTimes:1, frameSize:{cx:70, cy:59}, center:{x:33, y:30},frameCount:6, frameInterval:50
	}
        ,{ 
		id:20001, path:'avatars/20001/', playTimes:1, frameSize:{cx:60, cy:91}, center:{x:29, y:50},frameCount:7, frameInterval:130
	}
        ,{ 
		id:20002, path:'avatars/20002/', playTimes:1, frameSize:{cx:61, cy:82}, center:{x:31, y:58},frameCount:7, frameInterval:100
	}
        ,{ 
		id:20003, path:'avatars/20003/', playTimes:1, frameSize:{cx:425, cy:353}, center:{x:216, y:225},frameCount:10, frameInterval:100
	}
        ,{ 
		id:20004, path:'avatars/20004/', playTimes:1, frameSize:{cx:139, cy:117}, center:{x:68, y:63},frameCount:9, frameInterval:50
	}
        ,{ 
		id:20005, path:'avatars/20005/', playTimes:1, frameSize:{cx:60, cy:91}, center:{x:29, y:50},frameCount:7, frameInterval:130
	}
        ,{ 
		id:20006, path:'avatars/20006/', playTimes:0, frameSize:{cx:132, cy:90}, center:{x:67, y:46},frameCount:5, frameInterval:130
	}
        ,{ 
		id:20007, path:'avatars/20007/', playTimes:0, frameSize:{cx:95, cy:40}, center:{x:47, y:17},frameCount:5, frameInterval:100
	}  
        ,{ 
		id:20008, path:'avatars/20008/', playTimes:0, frameSize:{cx:87, cy:80}, center:{x:41, y:45},frameCount:5, frameInterval:130
	}
       ,{ 
		id:20009, path:'avatars/20009/', playTimes:0, frameSize:{cx:60, cy:67}, center:{x:30, y:35},frameCount:8, frameInterval:150
	}
        ,{ 
		id:20010, path:'avatars/20010/', playTimes:0, frameSize:{cx:111, cy:53}, center:{x:56, y:26},frameCount:8, frameInterval:150
	}
        ,{ 
		id:20011, path:'avatars/20011/', playTimes:1, frameSize:{cx:150, cy:159}, center:{x:70, y:59},frameCount:6, frameInterval:50
	}
        ,{ 
		id:1, path:'avatars/cityupgrade/', playTimes:1, frameSize:{cx:480, cy:300}, center:{x:240, y:150},frameCount:12, frameInterval:100
	}
        ,{ 
		id:2, path:'avatars/2/', playTimes:1, frameSize:{cx:1104, cy:161}, center:{x:552, y:80},frameCount:14, frameInterval:40
	}	
        ,{ //for first revward hero
		id:3, path:'avatars/cityupgrade/', playTimes:1, frameSize:{cx:480, cy:300}, center:{x:240, y:150},frameCount:12, frameInterval:100
	}	
        ,{ 
		id:1503000301, path:'avatars/1503000301/', playTimes:0, frameSize:{cx:614, cy:406}, center:{x:412, y:213}, frameCount:1, frameInterval:100
	}
        ,{ 
		id:1503000302, path:'avatars/1503000302/', playTimes:1, frameSize:{cx:614, cy:406}, center:{x:412, y:213}, frameCount:9, frameInterval:100
	}
        ,{ 
		id:1503000303, path:'avatars/1503000301/', playTimes:0, frameSize:{cx:614, cy:406}, center:{x:412, y:213}, frameCount:1, frameInterval:100
	}	
        ,{ 
		id:1503000304, path:'avatars/1503000304/', playTimes:1, frameSize:{cx:614, cy:406}, center:{x:412, y:213}, frameCount:2, frameInterval:100
	}
        ,{ 
		id:1503000305, path:'avatars/1503000301/', playTimes:1, frameSize:{cx:614, cy:406}, center:{x:412, y:213}, frameCount:1, frameInterval:100
	}		
].sort(G_ID_ASCCOMP);



