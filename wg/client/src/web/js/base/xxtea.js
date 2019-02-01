function IsLittleEndian() {
	var n = 1;
	return (n & 0x000000ff) > 0;
}

function htonl(n) {
	if ( IsLittleEndian() ) {
		var nn = ((n & 0xff000000) >>> 24) | ((n & 0x00ff0000) >>> 8) | ((n & 0x0000ff00) <<  8) | ((n & 0x000000ff) <<  24);
		return nn>>>0;
	} else {
		return n;
	}
}

function ntohl(n) {
	return htonl(n);
}

function htonl_array(n) {
	return [
        (n & 0xFF000000) >>> 24,
        (n & 0x00FF0000) >>> 16,
        (n & 0x0000FF00) >>>  8,
        (n & 0x000000FF) >>>  0
    ];
}

XXTea = function(){
	//-----------
	//private:data
	//-----------
	var m_key;
	var m_this;
	
	//------------
	//public:method
	//------------
	this.init = function(){
		m_this = this;
	};
	
	this.setKey = function(key){
		_setKey(key);
	};
	
	this.encrypt = function(str){
		return _encrypt(str);
	};
	
	this.decrypt = function(str){
		return _decrypt(str);
	};
	
	this.decrypt_ex = function(array){ //Uint32Array
		return _decrypt_ex(array);
	};
	
	this.long2str = function(v){
		return _long2str(v);
	};
	
	//--------------
	// private:method
	//--------------
	var _setKey = function(key){
		m_key= _str2long(key, false); 
		if ( m_key.length < 4 ) { 
			m_key.length = 4; 
		} 
	};
	
	var _encrypt = function(str){
		if (str == "") { 
			return ""; 
		}
		str = UtfParser.utf16to8(str);
		var v = _str2long(str, true); 
		var n = v.length - 1; 

		var z = v[n], y = v[0], delta = 0x9E3779B9; 
		var mx, e, p, q = Math.floor(6 + 52 / (n + 1)), sum = 0; 
		while (0 < q--) { 
			sum = sum + delta & 0xffffffff; 
			e = sum >>> 2 & 3; 
			for (p = 0; p < n; p++) { 
				y = v[p + 1]; 
				mx = (z >>> 5 ^ y << 2) + (y >>> 3 ^ z << 4) ^ (sum ^ y) + (m_key[p & 3 ^ e] ^ z); 
				z = v[p] = v[p] + mx & 0xffffffff; 
			} 
			y = v[0]; 
			mx = (z >>> 5 ^ y << 2) + (y >>> 3 ^ z << 4) ^ (sum ^ y) + (m_key[p & 3 ^ e] ^ z); 
			z = v[n] = v[n] + mx & 0xffffffff; 
		} 
		return _long2str(v, false); 
	};
	
	var _decrypt = function(str){
		if (str == "") { 
			return ""; 
		}
		var v = _str2long(str, false); 
		var n = v.length - 1; 

		var z = v[n - 1], y = v[0], delta = 0x9E3779B9; 
		var mx, e, p, q = Math.floor(6 + 52 / (n + 1)), sum = q * delta & 0xffffffff; 
		while (sum != 0) { 
			e = sum >>> 2 & 3; 
			for (p = n; p > 0; p--) { 
				z = v[p - 1]; 
				mx = (z >>> 5 ^ y << 2) + (y >>> 3 ^ z << 4) ^ (sum ^ y) + (m_key[p & 3 ^ e] ^ z); 
				y = v[p] = v[p] - mx & 0xffffffff; 
			} 
			z = v[n]; 
			mx = (z >>> 5 ^ y << 2) + (y >>> 3 ^ z << 4) ^ (sum ^ y) + (m_key[p & 3 ^ e] ^ z); 
			y = v[0] = v[0] - mx & 0xffffffff; 
			sum = sum - delta & 0xffffffff; 
		} 
		var aaa = _long2str(v, true);
		return UtfParser.utf8to16(aaa); 
	};
	
	var _str2long = function(s, w){
		var len = s.length; 
		var v = []; 
		for (var i = 0; i < len; i += 4) { 
			v[i >> 2] = s.charCodeAt(i) 
				| s.charCodeAt(i + 1) << 8 
				| s.charCodeAt(i + 2) << 16 
				| s.charCodeAt(i + 3) << 24; 
		} 
		if (w) { 
			v[v.length] = htonl(len);
		} 
		return v; 
	};
	
	var _long2str = function(v, w){
		var vl = v.length; 
		var n = (vl - 1) << 2; 
		if (w) { 
			var m = ntohl(v[vl - 1]); 
			if ( m == 0 ) {
				m = n;
			}
			if ((m < n - 3) || (m > n)) return null; 
			n = m; 
		} 
		for (var i = 0; i < vl; i++) { 
			v[i] = String.fromCharCode(v[i] & 0xff, 
				v[i] >>> 8 & 0xff, 
				v[i] >>> 16 & 0xff, 
				v[i] >>> 24 & 0xff); 
		} 
		if (w) { 
			return v.join('').substring(0, n); 
		} 
		else { 
			return v.join(''); 
		}
	};
	
	var _decrypt_ex = function(v){
		var n = v.length - 1; 
		var z = v[n - 1], y = v[0], delta = 0x9E3779B9; 
		var mx, e, p, q = Math.floor(6 + 52 / (n + 1)), sum = q * delta & 0xffffffff; 
		while (sum != 0) { 
			e = sum >>> 2 & 3; 
			for (p = n; p > 0; p--) { 
				z = v[p - 1]; 
				mx = (z >>> 5 ^ y << 2) + (y >>> 3 ^ z << 4) ^ (sum ^ y) + (m_key[p & 3 ^ e] ^ z); 
				y = v[p] = v[p] - mx & 0xffffffff; 
			} 
			z = v[n]; 
			mx = (z >>> 5 ^ y << 2) + (y >>> 3 ^ z << 4) ^ (sum ^ y) + (m_key[p & 3 ^ e] ^ z); 
			y = v[0] = v[0] - mx & 0xffffffff; 
			sum = sum - delta & 0xffffffff; 
		} 
		var aaa = _long2str_ex(v, true);
		return UtfParser.utf8to16(aaa); 
	};	
	
	var _long2str_ex = function(v, w){
		var vl = v.length; 
		var n = (vl - 1) << 2; 
		if (w) { 
			var m = ntohl(v[vl - 1]); 
			if ( m == 0 ) {
				m = n;
			}
			if ((m < n - 3) || (m > n)) return null; 
			n = m; 
		} 
		for (var i = 0; i < vl; i++) { 
			v[i] = String.fromCharCode(v[i] & 0xff, 
				v[i] >>> 8 & 0xff, 
				v[i] >>> 16 & 0xff, 
				v[i] >>> 24 & 0xff); 
		} 
		if (w) { 
			return v.join('').substring(0, n); 
		} 
		else { 
			return v.join(''); 
		}
	};
	
	//--------------
	// call constructor
	//--------------
	this.init.apply(this, arguments);
};