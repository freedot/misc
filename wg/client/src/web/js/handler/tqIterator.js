/*******************************************************************************/
DictIterator = Class.extern(function(){
	//Iterator-unittest-start
	var m_nodes = null;
	var m_key = null;
	var m_pos = 0;
	
	this.init = function(nodes){
		m_nodes = nodes;
		m_key = [];
		for ( var k in m_nodes ) {
			if ( !m_nodes[k] ) continue;
			m_key.push(k);
		}
		m_pos = 0;
	};
	
	this.hasMoreNodes = function(){
		return m_key[m_pos] ? true : false;
	};
	
	this.nextNode = function(){
		return m_nodes[m_key[m_pos++]];
	};
	//Iterator-unittest-end
});
