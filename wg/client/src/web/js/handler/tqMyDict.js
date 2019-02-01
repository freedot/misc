/*******************************************************************************/
MyDict = Class.extern(function(){
	//MyDict-unittest-start
	var m_defaultVal = null;
	var m_dict = {};
	this.init = function(defaultVal){
		m_defaultVal = defaultVal;
	};
	
	this.get = function(key){
		if (m_dict[key] == null) {
			m_dict[key] = m_defaultVal;
		}
		return m_dict[key];
	};
	
	this.set = function(key, val){
		m_dict[key] = val;
	};
	//MyDict-unittest-end
});
