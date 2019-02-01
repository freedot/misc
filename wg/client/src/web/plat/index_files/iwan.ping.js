function recordTime() {
	if ($app.auth.isLogin()) {
		setTimeout(function() {
			$.get("http://iwan.qq.com/interface/online");
			recordTime();
		}, 300000);
	}
}
recordTime();
iwan.func.addOneScore();