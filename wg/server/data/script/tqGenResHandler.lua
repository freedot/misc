--[[属性名称缩写
<<attr1>>
xp(Experience)经验值
	xp:c(current)--当前经验值
	xp:n(nextneed)--升到下级需要的经验值
hp气血
	hp:c(current)--当前血量
	hp:m(max)--当前最大血量
mp魔法
	mp:c(current)--当前魔法值
	mp:m(max)--当前最大魔法值
lo(loyalty)忠诚
sa(Salary)俸禄
an(Angry)愤怒
	an:c(current)--当前愤怒值
	an:m(max)--当前最大愤怒值
mr(move radius)移动半径
ar(attack range type)攻击范围类型
	

<<attr2>>
--一下所有的 x.b--表示基础的  x.a--表示后续添加的
in(Interior)内政
ph(Physical)体质
ma(Magic)魔力
st(strength)力量
en(Endurance)耐力
ag(Agile)敏捷
pp(Potential point)潜力点


<<attr3>>
co(Command)统率
hi(Hit)命中
hu(Hurt)伤害
de(Defense)防御
sp(speed)速度
es(Escape)躲避
ma(Mana)灵力

<<attr4>>--资质
at(Attack)攻击资质
de(Defense)防御资质
ph(Physical)体力资质
ma(Magic)法力资质
sp(speed)速度资质
es(Escape)躲闪资质
gr(Growth)成长
el(Element)五行

<<other>>
dur(Durability)装备耐久
效果属性 {id:107,val:10,u:1}  -- {id:效果类型,val:效果值,u:0表示值,1表示百分数}
]]--

GenResHandler = Class:extends({
	OnRequest = function(self, player, netevt, cmdtb)
		local sendmsg = ''
		if cmdtb.subcmd == 0 then
			-- 下发将领信息
			sendmsg = 'L{cmd='..NETCMD.GENRES..', full=true, gens={'
			sendmsg = sendmsg..'{id=140001, oid=1, name="将领1", level=1, state=0, },'
			sendmsg = sendmsg..'{id=140002, oid=2, name="将领2", level=2, state=1, },'
			sendmsg = sendmsg..'{id=140003, oid=3, name="将领3", level=10, state=2, },'
			sendmsg = sendmsg..'{id=140004, oid=4, name="将领4", level=200, state=0, },'
			sendmsg = sendmsg..'}, }'
			player:sendMsg(sendmsg)
		elseif cmdtb.subcmd == 1 then
			-- 下发将领的详细信息
			sendmsg = '{cmd:'..NETCMD.GENRES..',full:false,gens:['
			sendmsg = sendmsg..'{oid:'..cmdtb.oid..',resid:0,'
			sendmsg = sendmsg..'attrs:{'
			sendmsg = sendmsg..'attr1:{xp:{c:3000000,n:2000000},hp:{c:222,m:1200},mp:{c:200,m:1000},an:{c:80,m:150},lo:90,sa:40,mr:2,ar:0},'
			sendmsg = sendmsg..'attr2:{pp:10,in:{b:20,a:1},ph:{b:21,a:2},ma:{b:10,a:0},st:{b:12,a:30},en:{b:32,a:30},ag:{b:2,a:13}},'
			sendmsg = sendmsg..'attr3:{co:100,hi:200,hu:123,de:200,sp:20,es:10,ma:5},'
			sendmsg = sendmsg..'attr4:{at:900,de:200,ph:10,ma:2000,sp:20,es:304,gr:80,el:0}'
			sendmsg = sendmsg..'},'--detail end
			sendmsg = sendmsg..'wears:{'
			sendmsg = sendmsg..'g0:{id:5000001,dur:{c:7,m:11},attrs:[{id:106,val:'..math.random(10,100)..',u:0},{id:107,val:10,u:1}]}'
			sendmsg = sendmsg..'},'--wears end
			sendmsg = sendmsg..'skills:['
			sendmsg = sendmsg..'{id:6001001,lvl:1},{id:6001002,lvl:1}'
			sendmsg = sendmsg..'],'--skills end
			sendmsg = sendmsg..'scuts:{'
			--sendmsg = sendmsg..'g0:1'
			sendmsg = sendmsg..'}'--Shortcut end
			sendmsg = sendmsg..'}'
			sendmsg = sendmsg..']}'
			player:sendMsg(sendmsg)
		elseif cmdtb.subcmd == 2 then
			-- 更改将领名
			sendmsg = 'L{cmd='..NETCMD.GENRES..',full=false,gens={'
			sendmsg = sendmsg..'{oid='..cmdtb.oid..',name="'..cmdtb.name..'"}'
			sendmsg = sendmsg..'}}'
			player:sendMsg(sendmsg)
		elseif cmdtb.subcmd == 3 then
			--升级
			sendmsg = 'L{cmd='..NETCMD.GENRES..',full=false,gens={'
			sendmsg = sendmsg..'{oid='..cmdtb.oid..',level=2,detail={attr1={xp={c=100000}}}}'
			sendmsg = sendmsg..'}}'
			player:sendMsg(sendmsg)
		elseif cmdtb.subcmd == 4 then
			--赏赐将领
		elseif cmdtb.subcmd == 5 then
			--保存分配的点数
			sendmsg = 'L{cmd='..NETCMD.GENRES..',full=false,gens={'
			sendmsg = sendmsg..'{oid='..cmdtb.oid..',detail={attr2={pp=0}}}'
			sendmsg = sendmsg..'}}'
			player:sendMsg(sendmsg)
		elseif cmdtb.subcmd == 6 then
			--洗点
		elseif cmdtb.subcmd == 7 then
			--任命将领
			sendmsg = 'L{cmd='..NETCMD.GENRES..',full=false,gens={'
			sendmsg = sendmsg..'{oid='..cmdtb.oid..',state='..cmdtb.appoint..'}'
			sendmsg = sendmsg..'}}'
			player:sendMsg(sendmsg)
		elseif cmdtb.subcmd == 8 then
			--辞去将领职务
			sendmsg = 'L{cmd='..NETCMD.GENRES..',full=false,gens={'
			sendmsg = sendmsg..'{oid='..cmdtb.oid..',state=0}'
			sendmsg = sendmsg..'}}'
			player:sendMsg(sendmsg)
		elseif cmdtb.subcmd == 9 then
			--解雇将领
			sendmsg = 'L{cmd='..NETCMD.GENRES..',full=false,gens={'
			sendmsg = sendmsg..'{oid='..cmdtb.oid..',id=0}'
			sendmsg = sendmsg..'}}'
			player:sendMsg(sendmsg)
		elseif cmdtb.subcmd == 10 then
			--穿戴装备
			sendmsg = 'L{cmd:'..NETCMD.GENRES..',full=false,gens={'
			sendmsg = sendmsg..'{oid='..cmdtb.genid..',wears={g'..cmdtb.wearpos..'={id=5000001,dur={c=7,m=11},attrs={{id=106,val=120,u=0}}}}}'
			sendmsg = sendmsg..'}}'
			player:sendMsg(sendmsg)
			--穿戴装备
			--sendmsg = '{cmd:'..NETCMD.GENRES..
		elseif cmdtb.subcmd == 11 then
			--卸下装备
			sendmsg = 'L{cmd='..NETCMD.GENRES..',full=false,gens={'
			sendmsg = sendmsg..'{oid='..cmdtb.oid..',wears={g'..cmdtb.weargpos..'={id=0}}}'
			sendmsg = sendmsg..'}}'
			player:sendMsg(sendmsg)
		elseif cmdtb.subcmd == 12 then
			--将领修炼
		elseif cmdtb.subcmd == 13 then
			--拉取现在可以招募的将领列表
			sendmsg = 'L{cmd='..NETCMD.GENRES..',engens={'
			sendmsg = sendmsg..'{oid=1,id=140001,level=10,int=20,val=12,res=31,loy=90,ngold=10000},'
			sendmsg = sendmsg..'{oid=2,id=140002,level=12,int=30,val=23,res=11,loy=91,ngold=13000},'
			sendmsg = sendmsg..'{oid=3,id=140003,level=14,int=60,val=52,res=21,loy=70,ngold=14000},'
			sendmsg = sendmsg..'{oid=4,id=140001,level=16,int=10,val=22,res=61,loy=50,ngold=12000},'
			sendmsg = sendmsg..'{oid=5,id=140003,level=17,int=80,val=72,res=71,loy=80,ngold=20000},'
			sendmsg = sendmsg..'}}'
			player:sendMsg(sendmsg)
		elseif cmdtb.subcmd == 14 then
			--使用道具刷新列表
			sendmsg = 'L{cmd='..NETCMD.GENRES..',engens={'
			sendmsg = sendmsg..'{oid=1,id=140001,level=10,int=20,val=12,res=31,loy=90,ngold=10000},'
			sendmsg = sendmsg..'{oid=2,id=140002,level=12,int=30,val=23,res=11,loy=91,ngold=13000},'
			sendmsg = sendmsg..'{oid=3,id=140003,level=14,int=60,val=52,res=21,loy=70,ngold=14000},'
			sendmsg = sendmsg..'{oid=4,id=140001,level=16,int=10,val=22,res=61,loy=50,ngold=12000},'
			sendmsg = sendmsg..'{oid=5,id=140003,level=17,int=80,val=72,res=71,loy=80,ngold=20000},'
			sendmsg = sendmsg..'}}'
			player:sendMsg(sendmsg)
		elseif cmdtb.subcmd == 15 then
			--确定招募某个将领
		elseif cmdtb.subcmd == 16 then
			--拉取打听面板中的名将列表
			sendmsg = 'L{cmd='..NETCMD.GENRES..', famgens={'
			sendmsg = sendmsg..'{oid=1,id=140001,nogold=10,pos={100,200,300,400}},'
			sendmsg = sendmsg..'{oid=2,id=140002,nogold=10,pos={100,200,300,400}},'
			sendmsg = sendmsg..'{oid=3,id=140003,nogold=10,pos={100,200,300,400}},'
			sendmsg = sendmsg..'{oid=4,id=140001,nogold=10,pos={100,200,300,400}},'
			sendmsg = sendmsg..'{oid=5,id=140003,nogold=10,pos={100,200,300,400}},'
			sendmsg = sendmsg..'},}'
			player:sendMsg(sendmsg)
		elseif cmdtb.subcmd == 17 then
			--拉取打听面板中的名将列表,和16不同的是，这个是花了银两的，每次都必须刷新  100G
			sendmsg = 'L{cmd='..NETCMD.GENRES..', famgens={'
			sendmsg = sendmsg..'{oid=1,id=140001,nogold=10,pos={100,200,300,400}},'
			sendmsg = sendmsg..'{oid=2,id=140002,nogold=10,pos={100,200,300,400}},'
			sendmsg = sendmsg..'{oid=3,id=140003,nogold=10,pos={100,200,300,400}},'
			sendmsg = sendmsg..'{oid=4,id=140001,nogold=10,pos={100,200,300,400}},'
			sendmsg = sendmsg..'{oid=5,id=140003,nogold=10,pos={100,200,300,400}},'
			sendmsg = sendmsg..'},}'
			player:sendMsg(sendmsg)
		elseif cmdtb.subcmd == 18 then
			--在打听面板中搜索指定的将领 1000G
			sendmsg = 'L{cmd='..NETCMD.GENRES..', famgens={'
			sendmsg = sendmsg..'{oid=1,id=140001,nogold=10,pos={100,200,300,400}},'
			sendmsg = sendmsg..'{oid=2,id=140002,nogold=10,pos={100,200,300,400}},'
			sendmsg = sendmsg..'{oid=3,id=140003,nogold=10,pos={100,200,300,400}},'
			sendmsg = sendmsg..'{oid=4,id=140001,nogold=10,pos={100,200,300,400}},'
			sendmsg = sendmsg..'{oid=5,id=140003,nogold=10,pos={100,200,300,400}},'
			sendmsg = sendmsg..'},}'
			player:sendMsg(sendmsg)
		elseif cmdtb.subcmd == 19 then
			--详细打听某个将领的位置
		elseif cmdtb.subcmd == 20 then
			--获取旧部的列表
			sendmsg = 'L{cmd='..NETCMD.GENRES..',oldgens={'
			sendmsg = sendmsg..'{oid=1,name="一",id=140001,level=10,int=20,val=12,res=31,ngold=10,loy=90},'
			sendmsg = sendmsg..'{oid=2,name="二",id=140002,level=12,int=30,val=23,res=11,ngold=10,loy=91},'
			sendmsg = sendmsg..'{oid=3,name="三",id=140003,level=14,int=60,val=52,res=21,ngold=10,loy=70},'
			sendmsg = sendmsg..'{oid=4,name="四",id=140001,level=16,int=10,val=22,res=61,ngold=10,loy=50},'
			sendmsg = sendmsg..'{oid=5,name="五",id=140003,level=17,int=80,val=72,res=71,ngold=10,loy=80},'
			sendmsg = sendmsg..'}}'
			player:sendMsg(sendmsg)
		elseif cmdtb.subcmd == 21 then
			--召回某个具体的旧部
		elseif cmdtb.subcmd == 22 then
			--使用某个计谋
		elseif cmdtb.subcmd == 23 then
			--拉取当前计谋的列表
			local curtime = Util:getTime() + 20
			sendmsg = 'L{cmd='..NETCMD.GENRES..', trickbuffs={'
			sendmsg = sendmsg..'{id=6000001, gridpos=1, stoptime='..curtime..',info={curgen=1,tagert={type=1,id=1,name="test1"}}},'  -- cname-cityname, gname-genname
			sendmsg = sendmsg..'{id=6000002, gridpos=2, stoptime='..curtime..',info={curgen=3,tagert={type=1,id=1,name="test2"}}},'
			sendmsg = sendmsg..'}, }'
			player:sendMsg(sendmsg)
		elseif cmdtb.subcmd == 24 then
			--某个计谋时间到期
		elseif cmdtb.subcmd == 25 then
			--关联将领道具栏快捷键
			sendmsg = 'L{cmd='..NETCMD.GENRES..',full=false,gens={'
			sendmsg = sendmsg..'{oid='..cmdtb.oid..',scuts={g'..cmdtb.scutgrid..'={id=5000001}}}'
			sendmsg = sendmsg..'}}'
			player:sendMsg(sendmsg)
		elseif cmdtb.subcmd == 26 then
			--取消将领道具栏快捷键的关联
			sendmsg = 'L{cmd='..NETCMD.GENRES..',full=false,gens={'
			sendmsg = sendmsg..'{oid='..cmdtb.oid..',scuts={g'..cmdtb.scutgrid..'={id=0}}}'
			sendmsg = sendmsg..'}}'
			player:sendMsg(sendmsg)
		end
	end;
})


















