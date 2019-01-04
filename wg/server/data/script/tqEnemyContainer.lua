--*******************************************************************************
--*******************************************************************************
EnemyContainer = Class:extends({
	init = function(self, player)
		self.player = player
		self.military = player:getPersistVar().military
	end;
	
	add = function(self, enemyId)
		if self:has(enemyId) then
			return
		end
		
		if self.military.enemyCount >= self:_getMaxCount() then
			self.military.enemyCount = Util:removeElementC(self.military.enemys, self.military.enemyCount, 0)
		end
		
		self.military.enemys[self.military.enemyCount] = enemyId
		self.military.enemyCount = self.military.enemyCount + 1
	end;
	
	delete = function(self, enemyId)
		if Util:findC(self.military.enemys, self.military.enemyCount, nil, enemyId) ~= nil then
			self.military.enemyCount = Util:removeElementC(self.military.enemys, self.military.enemyCount, Util:getLastFindIdx())
		end
	end;
	
	getCount = function(self)
		return self.military.enemyCount
	end;
	
	getByIdx = function(self, idx)
		return self.military.enemys[idx]
	end;
	
	has = function(self, enemyId)
		return Util:findC(self.military.enemys, self.military.enemyCount, nil, enemyId) ~= nil
	end;
	
	_getMaxCount = function(self)
		return res_enemy_base_cnt + self.player:getVipEffectVal(VIP_EFF.ADD_FRIEND_COUNT)
	end;
})


