Loader = JClass.ex({
	_init : function(){
		this._loadedCount = 0;
		this._files = [];
		this._objs = {};
		this._caller = NullCaller;
	}
	
	,setCaller : function(caller){
		this._caller = caller;
	}
	
	,load : function(){
	}
	
	,getPercent : function(){
		return this.getLoadedCount()/this.getTotalCount() + 0.0001;
	}
	
	,getTotalCount : function(){
		return this._files.length;
	}
	
	,getLoadedCount : function(){
		return this._loadedCount;
	}
	
	,isCompleted : function(){
		return this.getTotalCount() == this.getLoadedCount();
	}
});

JsLoader = Loader.ex({
	load : function(files){
		this._files = files;
		this._loadFirst();
	}
	
	,getJs : function(fileName){
		return this._objs[fileName];
	}
	
	,_loadFirst : function(){
		this._loadNext();
	}
	
	,_loadNext : function(){
		if ( this.isCompleted() ) return;
		var file = this._files[this._loadedCount];
		this._objs[file] = this._loadRes('script', {type:'text/javascript', src:file});
		//this._loadRes('link', {rel:'stylesheet', type:'text/css', src:css_file},);
	}
	
	,_loadRes : function(restype, attrs){
		var res = document.createElement(restype);
		var html_doc = document.getElementsByTagName('head')[0];
		for ( k in attrs ){
			res.setAttribute(k, attrs[k]);
		}
		
		var this_l = this;
		html_doc.appendChild(res);
		res.onload = function () {
			log('load js : ' + res.src);
			this_l._loadedCount++;
			this_l._caller.invoke(true);
			this_l._loadNext();
		};
		
		res.onreadystatechange = function () {
			if ( res.readyState == 'complete' || res.readyState == 'loaded' ) {
				log('load js ex : ' + res.src);
				this_l._loadedCount++;
				this_l._caller.invoke(true);
				this_l._loadNext();
			}
		};
		
		return res;
	}
});

ImageLoader = Loader.ex({
	load : function(files){
		this._files = files;
		for ( var i=0; i<this._files.length; ++i ) {
			this._load( this._files[i] );
		}
	}
	
	,getImage : function(idx){
		return this._objs[idx];
	}
	
	,_load : function(imgSrc){
		var this_l = this;
		var img = new Image();
		img.onload = function(){
			this_l._loadedCount++;
			this_l._caller.invoke(true);
		};
		img.onerror = function(){
			this_l._loadedCount++;
			this_l._caller.invoke(false);
		};
		if ( this._isAbsolutelyUrl(imgSrc) ) {
			img.src = imgSrc;
		} else {
			img.src = IMG.makeImg(imgSrc);
		}
		log ( 'pre load img : ' + img.src );
		this._objs[imgSrc] = img;
	}
	
	,_isAbsolutelyUrl : function(imgSrc){
		return imgSrc.toLowerCase().indexOf('http://') >= 0 
			||imgSrc.toLowerCase().indexOf('https://') >= 0;
	}
});
