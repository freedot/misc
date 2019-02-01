Finder = JClass.ex({
	_init : function(){
		this._lastIdx = -1;
	}
	
	,find : function(arrays, keyname, keyval, spec) {
		this._lastIdx = -1;
		for ( var i=0; i<arrays.length; ++i ) {
			if (spec) {
				if (spec.isSatisfiedBy(arrays[i])) {
					this._lastIdx = i;
					return arrays[i];
				}
			} else {
				var cvalue = (keyname==null) ? arrays[i] : arrays[i][keyname];
				if ( cvalue == keyval ) {
					this._lastIdx = i;
					return arrays[i];
				}
			}
		}
		return null;
	}
	
	/** 排序二分法查找 */
	,qfind : function(arrays, keyname, keyval){
		this._lastIdx = -1;
		var first = 0;
		var last = arrays.length;
		var mid = 0;
		var midValue;
		while(first<last){
			mid=(first+last)>>1;
			midValue=(keyname==null) ? arrays[mid] : arrays[mid][keyname];
			if (keyval==midValue){
				this._lastIdx = mid;
				return arrays[mid];
			} else if (keyval<midValue){
				last=mid;
			} else {
				first=mid+1;
			}
		}
		return null;
	}
	
	,getLastIdx : function(){
		return this._lastIdx;
	}
}).snew();