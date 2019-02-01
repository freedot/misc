AndSpec = Class.extern(function(){
	this.init = function(){
		this.specs_ = [];
		for ( var i=0; i<arguments.length; ++i ) {
			this.specs_.push(arguments[i]);
		}
	};
	
	this.isSatisfiedBy = function(){
		for ( var i=0; i<this.specs_.length; ++i ) {
			var spec = this.specs_[i];
			if ( !spec.isSatisfiedBy.apply(spec, arguments) ) return false;
		}
		return true;
	};
});

OrSpec = Class.extern(function(){
	this.init = function(){
		this.specs_ = [];
		for ( var i=0; i<arguments.length; ++i ) {
			this.specs_.push(arguments[i]);
		}
	};
	
	this.isSatisfiedBy = function(){
		for ( var i=0; i<this.specs_.length; ++i ) {
			var spec = this.specs_[i];
			if ( spec.isSatisfiedBy.apply(spec, arguments) ) return true;
		}
		return false;
	};
});

NotSpec = Class.extern(function(){
	this.init = function(spec){
		this.spec_ = spec;
	};
	
	this.isSatisfiedBy = function(){
		return !this.spec_.isSatisfiedBy.apply(this.spec_, arguments);
	};
});