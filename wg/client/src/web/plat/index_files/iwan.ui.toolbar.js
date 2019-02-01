if (typeof iwan == 'undefined') {
	iwan = {};
}
if (typeof iwan.ui == 'undefined') {
	iwan.ui = jQuery.ffui = {};
}

(function(ui) {
	var $toolbar = "";
	// 入口
	ui.toolbar = function() {

		$.extend(ui.toolbar.defaults, loadParams());

		createStyle();

		$toolbar = ui.toolbar.getToolbar();

		addToolbarEvent($toolbar);
	};

	// 记载参数
	function loadParams() {
		var $script = $("#iwanToolbar");
		if ($script.size() == 0) {
			alert("参数错误");
			return "";
		}
		return iwan.util.getUrlParams($script.attr("src"));
	}

	// 创建style
	function createStyle() {
		var styles = [];
		var t = "position: fixed;; top: 0;left: 0;";
		if (iwan.util.isIE6()) {
			t = 'position: absolute;left: 0;top: expression(eval(document.documentElement.scrollTop));';
			styles.push('html { _background: url("about:blank") fixed;  } ');
		}

		styles
				.push('.navbar{ '
						+ t
						+ ' font-size: 12px; font-family: 微软雅黑,Tahoma,宋体;font-weight:normal;  height: 35px;width: 100%; background-color: #1c1c1c;z-index: 90001;   }');
		styles
				.push('.navbar,.navbar a,em{font-size: 12px; font-family: 微软雅黑,Tahoma,宋体;font-weight:normal; color: #666; text-decoration: none;font-style: normal; }');
		styles
				.push('.navbar .inner{margin: 0 auto; width: 960px; height:35px;position:relative;}');
		styles
				.push('.navbar .logo{ display:none; background: url("http://iwan.qq.com/images/logo_mini2.jpg") no-repeat;  float: left; width: 123px; height: 35px;}');
		styles
				.push('.navbar .hr{float:left;border-left:1px solid #515151; border-right:1px solid #252525; display:block; width:0px; height:35px;}');
		styles.push('.navbar .login-box{float: right; height:35px;   }');
		styles
				.push('.navbar .login-box a{ text-decoration:none;  padding:0 10px; float:left;  display: block; height: 35px; line-height: 35px;  color:#e1e1e1;   }');
		styles.push('.navbar .login-box a:hover{ background-color: #303030;}');
		styles.push('.navbar .login-box a.btn-login{ color:#f7941c; }');

		styles.push('.navbar .info-box{}');
		styles
				.push('.navbar .logout-box{float:right;    line-height: 35px;  }');

		styles
				.push('.navbar .logout-box a{display: inline-block; height: 35px; padding:0 10px; color:#e1e1e1;}');
		styles
				.push('.navbar .logout-box a:hover{background-color: #303030; text-decoration: none;}');
		styles
				.push('.navbar .logout-box a.btn-nick{color:#FC742C; padding: 0 5px; }');

		styles.push('.navbar .link-box{float: right; }');
		styles
				.push('.navbar .link-box a{float:left; display: inline-block;width:20px; height: 35px; background: url("http://iwan.qq.com/images/tb_icons2.gif") no-repeat; padding:0 10px; line-height: 35px;  }');
		styles
				.push('.navbar .link-box a.l-favorite{background-position: 10px -43px; width:26px; padding-left:35px; color:#cccccc;  }');
		styles
				.push('.navbar .link-box div.l-score{position:relative; float:left; display: none;width:40px; height: 35px; background: url("http://iwan.qq.com/images/tb_icons2.gif") no-repeat 10px 8px;  }');
		styles
				.push('.navbar .link-box div.l-score a{background:none; width:auto; float:none; }');
		styles
				.push('.navbar .link-box div.l-score a.l-fuli{width:40px;padding:0; }');
		styles
				.push('.navbar .link-box div.l-score a.l-fuli:hover{background:none;}');
		styles
				.push('.navbar .link-box a.l-wb{background-position: 10px -143px; }');
		styles
				.push('.navbar .link-box a.l-table{ width:30px;  background-position: 10px -195px; position:relative; }');

		styles
				.push('.navbar .link-box a.l-table em{float: right;margin-top: 5px;display:none;width:8px;height:8px;overflow:hidden;background:url(http://iwan.qq.com/images/point.jpg);}');
		styles
				.push('.navbar .link-box a.l-qt{background-position: 10px -195px;}');
		styles
				.push('.navbar .link-box a.l-pay{ background-position: 10px -296px;  }');
		styles
				.push('.navbar .link-box a.l-cu{ background-image:none; width:50px; color:#e1e1e1; }');

		styles
				.push('.navbar .link-box a.l-wb:hover{background-position: -70px -143px; }');
		styles
				.push('.navbar .link-box a.l-table:hover{background-position: -61px -195px; }');
		styles
				.push('.navbar .link-box a.l-qt:hover{background-position: -70px -195px;}');
		styles
				.push('.navbar .link-box a.l-pay:hover{ background-position: -70px -296px;  }');
		styles
				.push('.navbar .link-box a.l-favorite:hover{background-position:-70px -43px;  }');

		styles
				.push('.navbar .link-box div.s-here{background-position: -70px 8px; background-color:#303030;}');
		styles
				.push('.navbar .link-box a:hover{ text-decoration: none;background-color: #303030; }');
		styles
				.push('.navbar .score-tip{zoom:1;width:120px; display:none; position:absolute;top:35px;left:0px;border:1px solid #dddddd; background-color:#ffffff; border-bottom:2px solid #515151; }');
		styles
				.push('.navbar .score-tip iframe{border:0;width:120px;position:absolute; top:0;left:0; background:#fff;}');
		styles.push('.navbar .score-tip .t{height:14px; padding:3px 10px; }');
		styles.push('.navbar .score-tip .t span{color:#7d7d7d; float:left; }');
		styles
				.push('.navbar .l-score .score-tip .t a{padding:0; display:block; margin-top:2px; overflow:hidden; height:12px; width:12px; float:right; background:url("http://iwan.qq.com/images/tb_icons2.gif") no-repeat 0 -359px; }');
		styles
				.push('.navbar .score-tip .f{ text-align:center; padding:3px 0 8px 0;}');
		styles.push('.navbar .score-tip .m{display:none;}');
		styles
				.push('.navbar .loading{ height:30px; background:url("http://iwan.qq.com/images/035.gif") no-repeat center center #ffffff;}');

		styles
				.push('.navbar .l-score .score-tip .f a{line-height:14px; height:auto; background-color:#f7941c; color:#fff;padding:3px 5px; width:auto;float:none; }');

		styles
				.push('.navbar  .score-box{ display: block;  height: 35px;line-height: 35px;_line-height: 34px; padding: 0 10px ; }');
		styles
				.push('.navbar  .score-box span{background:url("http://iwan.qq.com/images/tb_icons.gif?11") no-repeat; display: inline-block; height: 35px; padding:0 20px 0 3px;}');
		styles
				.push('.navbar  .score-box span.g{background-position: 37px -244px;width:30px;text-align:right;}');
		styles
				.push('.navbar  .score-box span.s{background-position: 27px -290px;width:22px;text-align:right;}');
		styles
				.push('.navbar  .score-box em{display: inline-block; color: #009AFC;height: 35px; padding:0 0 0 5px;}');
		styles
				.push('.navbar  .score-box:hover{text-decoration: none;background-color: #EBEBEB;}');
		styles
				.push('.navbar .bc-box{ overflow:hidden;padding-left:35px; background: url("http://iwan.qq.com/images/tb_icons2.gif") no-repeat 7px -246px; height: 35px; float: left;width: 300px;}');
		styles
				.push('.navbar .bc-box .list a{height: 35px;line-height: 35px;display: block;overflow: hidden;}');
		styles.push('.navbar  .here .list a{text-decoration: underline;}');
		styles
				.push('.gt-box{position:absolute;top:35px;right:0px; width:496px; display:none; }');
		styles
				.push('.gt-box-loading{position:absolute;top:35px;right:111px; width:51px;  border: 1px solid #dddddd; }');

		styles
				.push('.game-table{background-color: #ffffff;  position:absolute; top: 0px; left: 0px; border: 1px solid #dddddd;border-bottom: 2px solid #515151; border-left: 0;  }');
		styles
				.push('.gt-list{float: left; width: 100px;margin-right: -1px;   }');
		styles.push('.gt-list-2{width: 199px;}');
		styles
				.push('.gt-list .list{ float:left; width:100px; margin: 0;padding: 0;margin-right: -1px; }');
		styles
				.push('.gt-list .list a{ padding:0 8px; color: #7d7d7d; display:block; font-size: 12px; text-align: left; text-decoration: none; display:block; width: 84px;  height: 30px; line-height: 30px; background: url("../images/sl.gif") no-repeat 0 0; }');
		styles
				.push('.gt-list .list a:hover{color: #009AFC; text-decoration: none;}');
		styles
				.push('.gt-list h6{background: url("images/tab_bg.jpg"); border:1px solid #dddddd; border-top:0; height: 30px; line-height:30px;   text-align:center; color: #f7941c; margin: 0;padding:0; display: block; }');
		styles
				.push('.gt-list a span{background: url("http://iwan.qq.com/images/tb_icons2.gif") no-repeat 0 100px;  float: right; width: 10px; display: block; height: 30px; overflow: hidden; }');
		styles.push('.gt-list a span.hot{background-position:0px -420px; }');
		styles.push('.gt-list a span.new{background-position:0 -386px;}');

		$("head").append(
				"<style type='text/css'>" + styles.join("") + "</style>");
	}

	/**
	 * 用户信息加载
	 */
	function loadInfo() {

		// 昵称

		iwan.api.getNick(function(res) {
			if (res.code == 0) {
				$toolbar.find("a.btn-nick").html(
						iwan.util.getCutNick(res.nick, 12, "..."));
			}
		});

		// 更新金币

		// 加载广播

		iwan.api.getBroadcast(function(res) {
			if (res.length != 0) {
				createBroadcast(res);
			}
		});

	}

	/**
	 * 加载金币
	 */
	function loadScore() {
		var $tipScore = $toolbar.find("div.score-tip");
		var $m = $tipScore.find("div.m");
		$tipScore.addClass("loading");
		$m.hide();
		iwan.api.getScore(function(res) {
			if (res.code == 0) {
				$toolbar.find(".g").html(res.gold);
				$toolbar.find(".s").html(res.silver);
				$tipScore.removeClass("loading");
				$m.show();

			}
		});
	}

	function scoreEvent() {
		var $btnScore = $toolbar.find('div.l-score');
		var $tipScore = $toolbar.find("div.score-tip");
		var o = ui.toolbar.defaults;

		if (o.type != "game") {
			$btnScore.hover(function() {
				loadScore();
				$(this).addClass("s-here");
				$tipScore.show();
			}, function() {
				$(this).removeClass("s-here");
				$tipScore.hide();
			});

			$tipScore.find("div.t>a").showTip({
				text : "钱币是什么",
				time : 0
			});
		} else {
			$btnScore.hover(function() {
				$(this).addClass("s-here");
			}, function() {
				$(this).removeClass("s-here");
			});
		}
	}

	function createBroadcast(res) {
		var len = res.length;
		var addCount = 1;
		if (len > 1) {
			addCount = 2;
		}
		var html = '<div class="bc-box" bosszone="tbBc"><div class="scroll" ><div class="list">';

		for ( var c = 0; c < addCount; c++) {
			$(res).each(
					function(i, bc) {
						if (c == 1 && i == 1) {
							return false;
						}
						html += '<a href="' + bc['url'] + '" style="color:'
								+ bc['color'] + ';" >' + bc['title'] + '</a>';
					});
		}

		html += '</div></div></div>';

		var $bc = $(html);
		$toolbar.find(".inner").append($bc);
		var $scroll = $bc.find("div.scroll");
		// 多余一条时才混动
		if (len > 1) {
			var timer = "";
			var i = 0;
			var isMove = true;
			var scrollText = function() {
				clearTimeout(timer);
				if (isMove) {
					timer = setTimeout(function() {
						i++;
						$scroll.animate({
							'margin-top' : -i * 35
						}, 500, function() {
							if (i == len) {
								i = 0;
								$scroll.css("margin-top", 0);
							}
							scrollText();
						});
					}, 7000);
				}

			};

			$scroll.hover(function() {
				clearTimeout(timer);
				isMove = false;
				$(this).parent().addClass("here");
			}, function() {
				isMove = true;
				scrollText();
				$(this).parent().removeClass("here");
			});
			scrollText();
		} else {
			$scroll.hover(function() {
				$(this).parent().addClass("here");
			}, function() {
				$(this).parent().removeClass("here");
			});
		}

	}

	function removeBroadcast() {
		$toolbar.find("div.bc-box").remove();
	}

	/**
	 * 显示登录后的信息
	 */
	function showInfo() {
		var $loginBox = $toolbar.find("div.login-box");
		var $logoutBox = $toolbar.find("div.logout-box");
		var $btnScore = $toolbar.find("div.l-score");
		//var $btnNick = $toolbar.find("a.btn-nick");

		$loginBox.hide();
		$logoutBox.show();
		$btnScore.show();
		// $btnNick.html($app.auth.getQQNum());
		loadInfo($toolbar);

	}
	/**
	 * 退出后显示
	 */
	function hideInfo() {
		var $loginBox = $toolbar.find("div.login-box");
		var $logoutBox = $toolbar.find("div.logout-box");
		var $btnScore = $toolbar.find("div.l-score");
		$loginBox.show();
		$logoutBox.hide();
		$btnScore.hide();
		removeBroadcast();
	}

	/**
	 * 登录事件
	 */
	function loginEvent() {
		var o = ui.toolbar.defaults;
		var $btnLogin = $toolbar.find("a.btn-login");
		$btnLogin.click(function() {
			$app.auth.login({
				callback : function() {
					if (o.ajax == 0) {
						location.reload();
					} else {
						showInfo();
					}
				}
			});
			return false;
		});

		var $btnLogout = $toolbar.find("a.btn-logout");
		$btnLogout.click(function() {
			$app.auth.logout({
				callback : function() {
					if (o.ajax == 0) {
						location.reload();
					} else {
						hideInfo();
					}
				}
			});
			return false;
		});
	}

	/**
	 * 连接按钮事件
	 */
	function linkEvent() {
		var $linkBox = $toolbar.find(".link-box");
		$linkBox.hover(function() {
			$(this).addClass("here");
			$(this).find("ul").show();
		}, function() {
			$(this).removeClass("here");
			$(this).find("ul").hide();
		});
	}

	/**
	 * logo显示控制
	 */
	function logoEvent() {
		var $logo = $toolbar.find('a.logo');
		$(window).scroll(function() {

			if ($(window).scrollTop() >= 106) {
				$logo.show();
			} else {
				$logo.hide();
			}
		});
	}

	/**
	 * 收藏
	 */
	function favoriteEvent() {
		var $btnFavorite = $toolbar.find(".l-favorite");
		$btnFavorite.click(function() {
			iwan.util.addFavorite($("title").text(), location.href);
			return false;
		});
	}

	/**
	 * 游戏列表
	 */

	function loadGameTable(callback) {
		$.ajax({
			url : "http://iwan.qq.com/interface/getMoreGames?r="
					+ new Date().getTime(),
			type : "get",
			dataType : "jsonp",
			jsonpCallback : "moreGames",
			success : function(res) {
				if (callback) {
					callback(res);
				}
			}
		});
	}

	function gameTableEvent() {
		var timer = "";
		var $btnGameTable = $toolbar.find(".l-table");
		var $BoxGameTable = $toolbar.find(".gt-box");
		var isLoaded = false;

		$btnGameTable.hover(function() {
			$BoxGameTable.show();
			if (!isLoaded) {
				loadGameTable(function(res) {
					if (res.code == 1) {
						$BoxGameTable.removeClass("loading gt-box-loading");
						$BoxGameTable.html(res.msg);
						$btnGameTable.find("em").hide();
						isLoaded = true;
					}
				});
			} else {
				$BoxGameTable.show();
			}
		}, function() {
			timer = setTimeout(function() {
				$BoxGameTable.hide();
			}, 200);
		}).click(function() {
			return false;
		});

		$BoxGameTable.hover(function() {
			clearTimeout(timer);
		}, function() {
			$(this).hide();
		});
	}
	
	//获取新服状态
	function loadNewGameStatus(){
		$.ajax({
			url : "http://iwan.qq.com/interface/checkNewGame?r="
					+ new Date().getTime(),
			type : "get",
			dataType : "jsonp",
			jsonpCallback : "isNewGame",
			success : function(res) {
				if(res.code==1){
					$toolbar.find(".l-table>em").show();
				}
			}
		});
	}

	var addToolbarEvent = function() {
		var o = ui.toolbar.defaults;

		if (o.type == "iwan") {// IWan版本
			logoEvent($toolbar);
		} else if (o.type == "gw") {// 小官网版本
			$toolbar.find(".logo").show();
		} else if (o.type == "game") {// 玩游戏版本
			$toolbar.find(".logo").show();
			$toolbar.find("div.inner").css({
				"width" : 'auto',
				"padding" : "0 10px"
			});
		}

		loginEvent();

		// linkEvent();
		scoreEvent();

		favoriteEvent();

		if (o.type != "game") {
			gameTableEvent();
		}

		if ($app.auth.isLogin()) {
			showInfo();
		} else {
			hideInfo();
		}
		
		//载入新服状态
		loadNewGameStatus();
	};

	// http://iwan.qq.com/interface/checkNewGame
	var createToolbar = function() {
		// var o = ui.toolbar.defaults;
		var html = [];
		html.push('<div id="toolbar" class="navbar"><div class="inner">');
		html
				.push('<a class="logo" bosszone="tbLogo" href="http://iwan.qq.com"></a>');
		html
				.push('<div class="link-box"><div class="l-score" ><a bosszone="tbBtnFuli" class="l-fuli" href="http://iwan.qq.com/profile/fuli" target="_blank" ></a><div class="score-tip loading"><div class="m"><div class="t"><span>我的钱袋:</span><a bosszone="tbBtnWhat" href="http://iwan.qq.com/index?n=qbintro"></a></div><a class="score-box" bosszone="tbBtnScoreLog" href="http://iwan.qq.com/profile/scorelog" ><span class="g">0</span><span class="s" >0</span></a><div class="f"><a bosszone="tbBtnDH" href="http://iwan.qq.com/fuli" target="_blank">去兑换</a></div></div></div></div><div class="hr"></div>');

		html
				.push('<a bosszone="tbBtnFavorite" href="#" class="l-favorite" target="_blank">收藏</a><div class="hr"></div>');
		html
				.push('<a class="l-table"  href="http://iwan.qq.com" target="_blank"><em></em></a>');
		html
				.push('<a bosszone="tbBtnPay" title="充值"  href="http://action.tenpay.com/2012/qbticket/index.shtml?template=tencent&sub=33&ADTAG=ACTION.FASTPAY.QBMONEY.TENCENT" target="_blank" class="l-pay"></a><div class="hr"></div>');
		html
				.push('<a class="l-cu" href="http://iwan.qq.com/contactus" target="_blank">联系我们</a>');
		html.push('</div>');
		html
				.push('<div class="logout-box"><a bosszone="tbBtnNick" href="http://iwan.qq.com/profile/mygame" target="_blank" class="btn-nick" >&nbsp;</a><a bosszone="tbBtnLogout" class="btn-logout" href="#">[退出]</a></div>');

		html
				.push('<div class="login-box"><a bosszone="tbBtnLogin" href="#" class="btn-login">QQ登录</a><a bosszone="tbBtnReg" href="http://zc.qq.com/chs/index.html" target="_blank" class="btn-reg">注&nbsp;册</a></div>');
		html
				.push('<div class="gt-box gt-box-loading loading" ></div></div></div>');

		var $toolbarHtml = $(html.join(""));

		$("body").append($toolbarHtml);

		return $toolbarHtml;
	};

	ui.toolbar.getToolbar = ui.singleton(createToolbar);

	ui.toolbar.defaults = {
		type : "iwan",// iwan页面 gw 小官网页面 game游戏页面
		ajax : 0
	// 是否用ajax方式登录 0否 1是
	};

})(iwan.ui);

iwan.ui.toolbar();
