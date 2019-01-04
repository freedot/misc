--[[
	地图类型共有七种
	0			平地
	170001	湖泊
	170002	山脉
	170003	荒漠
	170004	森林
	170005	草地
]]

local mapW = 600
local mapH = 600

g_createmap = 
{
	mapSize = {w=mapW, h=mapH},
	resids =
	{
		--各种地图格子类型的概率是*/10000
		{ objType=0,	resId=0, 			probability=5000, models={17000601}},
		{ objType=4,	resId=170001, 	probability=1000, models={17000101,17000102,17000103,17000104}},
		{ objType=4,	resId=170002, 	probability=1000, models={17000201,17000202,17000203,17000204}},
		{ objType=4,	resId=170003, 	probability=1000, models={17000301,17000302,17000303,17000304}},
		{ objType=4,	resId=170004, 	probability=1000, models={17000401,17000402,17000403,17000404}},
		{ objType=4,	resId=170005, 	probability=1000, models={17000501,17000502,17000503,17000504}},
	},
	tableName = 'mapgrids',
}

--[[
g_invalidgrid = {
	rects = {{x=0, y=600, w=200, h=200}
		,{x=400, y=600, w=200, h=200}
		,{x=600, y=600, w=200, h=200}}
}
]]

g_invalidgrid = {
	rects = {}
}

g_invalidgrid.isInValid = function(gridId)
	local gridIdx = gridId - 1
	local x = gridIdx % mapW
	local y = math.floor(gridIdx/mapH)
	for _, rect in ipairs(g_invalidgrid.rects) do
		if (x>=rect.x) and (x<rect.x+rect.w) and (y>=rect.y) and (y<rect.y+rect.h) then
			return true
		end
	end
	return false
end;

function output_mapdb(descTable)
	create_content(descTable)
end

function create_content(descTable)
	math.randomseed(1)
	
	local output_file = 'c:/myweb/sql/'..descTable.tableName..'_con.sql'
	local sql_outfile = assert(io.open(output_file, "w"))
	
	local residNumbers = {}
	local s = 'LOCK TABLES `'..descTable.tableName..'` WRITE;\n'
	sql_outfile:write(s)
	local gridCount = descTable.mapSize.w * descTable.mapSize.h
	for gridId=1, gridCount, 1 do
		local objType = 1
		local resId = 0
		local modelId = 0
		local subCitys = ''		
		local roleId = 0
		local roleName = ''
		local userName = ''
		local icon = 0
		local level = math.random(10)
		local sex = 0
		local state = 0
		local allianceId = 0
		local enemyAlliId = 0
		local refreshTime = 0
		local alliName = ''
		local cityLevel = 0
		local buildCurVal = 0
		local roleRank = 0
		local introduction = ''
		local loginTime = 0
		local misc = ''
		
		local proRange = 0
		local pro = math.random(10000)
		for _, proDesc in ipairs(descTable.resids) do
			proRange = proRange + proDesc.probability
			if pro <= proRange then
				objType = proDesc.objType
				resId = proDesc.resId
				modelId = proDesc.models[   math.random(table.getn(proDesc.models)) ]
				break
			end
		end
		
		if g_invalidgrid.isInValid(gridId) then
			objType = 100
			resId = 170005
			modelId = 17000501
		end
		
		s = "INSERT INTO "..descTable.tableName.." VALUES('"..gridId.."', '"..objType.."', '"..resId.."', '".. modelId .. "', '".. subCitys .. "', '" .. roleId.."', '"..roleName.."', '"..userName.."', '"..icon.."', '"..level.."', '"..sex.."', '" .. state .. "', '" .. allianceId .. "', '" .. enemyAlliId .. "', '" .. refreshTime .. "', '" .. alliName .. "', '" .. cityLevel .. "', '" .. buildCurVal .. "', '" .. roleRank .. "', '" .. introduction .. "', '" .. loginTime .. "', '"  .. misc .. "');\n" 
		sql_outfile:write(s)
	end
	s = 'UNLOCK TABLES;\n'
	sql_outfile:write(s)
	sql_outfile:close()
	print('create '..output_file..' ok!')
end

--独立运行
if package.loaded['create_map'] == nil then
	output_mapdb(g_createmap)
end


