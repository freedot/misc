function log(msg){
	document.getElementById('id_log').innerHTML += msg + '<br/>';
}

var _j_ok_cnt = 0;
var _j_error_cnt = 0;
function jassert(a, msg){
	if ( a ){
		_j_ok_cnt++;
	}
	else{
		log('<font color=red>' + msg+': *error</font>');
		_j_error_cnt++;
	}
}

function assert(a, msg){
	if ( a ){
		_j_ok_cnt++;
	}
	else{
		log('<font color=red>' + msg+': *error</font>');
		_j_error_cnt++;
	}
}

function joutresult(){
	log('');
	log('------------------------------------------------------------');
	if ( _j_error_cnt > 0 ){
		log('<b>sucess :' + _j_ok_cnt + '</b>');
		log('<font color=red><b>error :' + _j_error_cnt + '</b></font>');
	}
	else{
		log('<font color=green><b>sucess :' + _j_ok_cnt + '</b></font>');
	}
	log('------------------------------------------------------------');
}