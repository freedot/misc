--*******************************************************************************
--  Copyright (C) 2012 Blue Dot Game Studios (BDGS).  All rights reserved.
--*******************************************************************************
FavoriteContainer = Class:extends({
	init = function(self, player)
		self.player = player
		self.military = player:getPersistVar().military
	end;
	
	add = function(self, gridId)
		if self:has(gridId) then
			return true
		end
		
		self:_removeFirstElemWhenFull()
		self.military.favorites[self.military.favoriteCount] = gridId
		self.military.favoriteCount = self.military.favoriteCount + 1
		
		MilitarySender:sendAddFavorite(self.player, gridId)
		
		return true
	end;
	
	delete = function(self, gridId)
		if Util:findC(self.military.favorites, self.military.favoriteCount, nil, gridId) ~= nil then
			self.military.favoriteCount = Util:removeElementC(self.military.favorites, self.military.favoriteCount, Util:getLastFindIdx())
			MilitarySender:sendDelFavorite(self.player, gridId)
		end
	end;
	
	getCount = function(self)
		return self.military.favoriteCount
	end;
	
	getByIdx = function(self, idx)
		return self.military.favorites[idx]
	end;
	
	has = function(self, gridId)
		return Util:findC(self.military.favorites, self.military.favoriteCount, nil, gridId) ~= nil
	end;
	
	_removeFirstElemWhenFull = function(self)
		if self.military.favoriteCount < MAX_FAVORITE_CNT then
			return
		end
		
		self:delete( self:getByIdx(0) )
	end;
})


