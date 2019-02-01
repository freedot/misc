/*******************************************************************************/
DictIterator = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.m_nodes = null;
	_lc_.m_key = null;
	_lc_.m_pos = 0;
	
	this.init = function(nodes){
		_lc_.m_nodes = nodes;
		_lc_.m_key = [];
		for ( var k in _lc_.m_nodes ) {
			if ( !_lc_.m_nodes[k] ) continue;
			_lc_.m_key.push(k);
		}
		_lc_.m_pos = 0;
	};
	
	this.hasMoreNodes = function(){
		return _lc_.m_key[_lc_.m_pos] ? true : false;
	};
	
	this.nextNode = function(){
		return _lc_.m_nodes[_lc_.m_key[_lc_.m_pos++]];
	};
	//Iterator-unittest-end
});
