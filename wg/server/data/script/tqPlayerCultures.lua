--*******************************************************************************
PlayerCultures = Class:extends({
	init = function(self, player)
		self.cultures = player:getPersistVar().cultures
	end;
	
	getLevel = function(self, resid)
		local culture = Util:findC(self.cultures.cultures, self.cultures.count, 'id', resid)
		if culture == nil then return 0 end
		
		return culture.level
	end;
	
	setLevel = function(self, resid, level)
		local culture = Util:findC(self.cultures.cultures, self.cultures.count, 'id', resid)
		if culture == nil then
			self:addCulture(resid, level)
		else
			culture.level = level
		end
	end;
	
	addCulture = function(self, resid, level)
		if self.cultures.count == MAX_CULTURE_CNT then
			LOG('error: the MAX_CULTURE_CNT not enough')
			return
		end
		
		local culture = self.cultures.cultures[self.cultures.count]
		culture.id = resid
		culture.level = level
		self.cultures.count = self.cultures.count + 1
	end;
	
	getCultures = function(self)
		return self.cultures
	end;
	
	getLearningCulture = function(self)
		return self.cultures.learning
	end;
	
	setLearningCulture = function(self, learningCulture)
		self.cultures.learning.id = learningCulture.id
		self.cultures.learning.stoptime = learningCulture.stoptime
	end;
})


