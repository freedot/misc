if (!this.LUA) {
	LUA = {};
}

(function () {

//var str='{cmd = 1, flag = "2=", gg={{"1:"},{"2"},{"3"},{"4"}}, ccc={dd=12,bb="2=,}==",ee=3,}, result = "渠简=表",}';
// 替换所有的=为:
//var mm = str.replace(/([^"]\w+)\s*(\=)\s*/g, "$1:");
// 将所有结尾的 , 取掉
//var mmm = mm.replace(/([^"]\w+),\s*\}/g, "$1}");
//var mmm1 = mmm.replace(/"([^"]*)"\s*,\s*\}/g, "\"$1\"}");
// 转换数组的 {} 为 []
//var mmm2 = mmm1.replace(/\{\s*([^:]*)\s*([,\}\{])/g, "[$1$2");
//var mmm3 = mmm2.replace(/([,\{\"])\s*([^:]*)\s*\}/g, "$1$2]");

	if (typeof LUA.getQuotes !== 'function') { 
		LUA.getQuotes = function (str) {
			var quotes = new Array();
			var patt = new RegExp('[\'\"]', 'g');
			while ( patt.test(str) ) {
				var curchar = str.charAt(patt.lastIndex-1);
				var idx = str.indexOf(curchar, patt.lastIndex);
				if ( idx < 0 ) {
					break;
				}
				
				var bfind = true;
				while ( str.charAt(idx-1) == '\\' ) {
					idx = str.indexOf(curchar, idx + 1);
					if ( idx < 0 ) {
						bfind = false;
						break;
					}
				}
				
				if ( ! bfind ) {
					break;
				}
				
				quotes.push(patt.lastIndex-1, idx);
				patt.lastIndex = idx + 1;
			}
			return quotes;
		};
	}
	
	if (typeof LUA.inQuotes !== 'function') {
		LUA.inQuotes = function (quotes, pos) {
			var binQuote = false;
			for ( var i = 0; i<quotes.length/2; i=i+1){
				if ( pos >= quotes[2*i] && pos <= quotes[2*i+1] ) {
					binQuote = true;
					break;
				}
			}
			return binQuote;
		};
	}
	
	if (typeof LUA.isArray !== 'function') {
		LUA.isArray = function (str, quotes, firstPos, startpos) {
			var bhaseque = false;
			while ( true ) {
				var idx = str.indexOf('=', firstPos);
				if ( idx < 0 || idx >= startpos ) {
					break;
				}
				
				if ( this.inQuotes(quotes, idx) ) {
					firstPos = idx + 1;
					continue;
				}
				
				bhaseque = true;
				break;
			}
			
			return !bhaseque;
		};
	}

	
	if (typeof LUA.getBrackets !== 'function') {
		LUA.getBrackets = function (str, quotes) {
			// 查找所有的 {  }
			var level = 0;
			var totalidx = 0;
			var brackets = new Array();
			var bracketPoss = new Array();
			var patt = new RegExp('[\{\}]', 'g');
			while ( patt.test(str) ) {
				var startpos = patt.lastIndex-1;
				var curchar = str.charAt(startpos);
				var binQuote = this.inQuotes(quotes, startpos);
				brackets.push(0);
				if ( ! binQuote ) {
					if ( curchar == '{' ) {
						bracketPoss.push(totalidx, startpos);
						//检查是否是数组
						if ( bracketPoss.length >= 4 ) {
							var firstPos = bracketPoss[(bracketPoss.length/2-2)*2+1];
							var isarray = this.isArray(str, quotes, firstPos, startpos);
							if ( isarray ) {
								var arraypos = bracketPoss[(bracketPoss.length/2-2)*2];
								brackets[arraypos] = 1;
							}
						}
					}
					else {
						//检查是否是数组
						var firstPos = bracketPoss[(bracketPoss.length/2-1)*2+1];
						var isarray = this.isArray(str, quotes, firstPos, startpos);
						if ( isarray ) {
							var arraypos = bracketPoss[(bracketPoss.length/2-1)*2];
							brackets[arraypos] = 1;
							brackets[totalidx] = 1;
						}
						else {
							var arraypos = bracketPoss[(bracketPoss.length/2-1)*2];
							if ( brackets[arraypos] == 1 ) {
								brackets[totalidx] = 1;
							}
						}
						
						bracketPoss.pop();
						bracketPoss.pop();
					}
				}
				totalidx = totalidx + 1;
			}
			return brackets;
		};
	}
	
	if (typeof LUA.getEqualSigns !== 'function') {
		LUA.getEqualSigns = function (str, quotes) {
			var idx = 0;
			var equals = new Array();
			while ( true ) {
				idx = str.indexOf('=', idx);
				if ( idx < 0 ) {
					break;
				}
				
				var binQuote = this.inQuotes(quotes, idx);
				if ( !binQuote ) {
					equals.push(1);
				}
				else {
					equals.push(0);
				}
				idx = idx + 1;
			}
			return equals;
		};
	}
	
	if (typeof LUA.getCommaLasts !== 'function') {
		LUA.getCommaLasts = function (str, quotes) {
			var commas = new Array();
			var patt = new RegExp(",[ \s\t]*\}", "g");
			while ( patt.test(str) ) {
				var idx = patt.lastIndex-1;
				var binQuote = this.inQuotes(quotes, idx);
				if ( !binQuote ) {
					commas.push(1);
				}
				else {
					commas.push(0);
				}
			}
			return commas;
		};
	}

	if (typeof LUA.toJSON !== 'function') {
		LUA.toJSON = function (str) {
			// 不是lua格式表，则直接返回
			if ( str.charAt(0) != 'L' ) {
				return str;
			}
			str = str.substring(1);
			var quotes = this.getQuotes();
			var brackets = this.getBrackets(str, quotes);
			var equals = this.getEqualSigns(str, quotes);
			var commas = this.getCommaLasts(str, quotes);
			
			var idx = 0;
			var str1 = str.replace(/=/g, function(word){
				if ( equals[idx] == 1 ) {
					idx = idx + 1;
					return ":";
				}
				else {
					idx = idx + 1;
					return "=";
				} }
			);
			
			idx = 0;
			var str2 = str1.replace(/,\s*\}/g, function(word){
				if ( commas[idx] == 1 ) {
					idx = idx + 1;
					return '}';
				}
				else {
					idx = idx + 1;
					return word;
				}
			});
			
			idx = 0;
			var str3 = str2.replace(/[\{\}]/g, function(word){
				if ( brackets[idx] == 1 ) {
					idx = idx + 1;
					if ( word == '{' ) {
						return '[';
					}
					else {
						return ']';
					}
				}
				else {
					idx = idx + 1;
					return word;
				}}
			);
			return str3;
		};
	}
	
}());