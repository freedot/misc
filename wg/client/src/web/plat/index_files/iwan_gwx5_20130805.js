document.domain = "qq.com";
var iwan_gw = {
	gameId : 28,
	gameCode : "jh",
	appId : 0,
	btnSelectId : "btnReSelect",
	CHAreaId : [],
	iwan : "http://iwan.qq.com",
	indexURL : function() {
		return this.iwan + "/" + this.gameCode + ".htm";
	},
	serverURL : function() {
		return this.iwan + "/" + this.gameCode + "/server.htm"
	},
	cdkeyURL : function() {
		return this.iwan + "/" + this.gameCode + "/cdkey.htm"
	},
	loadQueue : function(urls, callback) {
		var i = 0;
		var loadScript = function() {
			if (i < urls.length) {
				$.getScript(urls[i], function() {
							i++;
							loadScript();
						});
			} else {
				if (callback) {
					callback();
				}
			}
		};
		loadScript();

	},
	// 加载接口数据
	loadData : function(callback) {

		var urls = ['http://openwebgame.qq.com/app/RecentServerInfo.php?appid='
				+ this.appId];
		this.loadQueue(urls, callback);

	},
	/**
	 * 是否为频道武器
	 * 
	 * @param {}
	 *            areaId
	 * @return {Boolean}
	 */
	isCHArea : function() {

		var flag = false;

		return flag;
	},
	/**
	 * 是否为频道服务器
	 * 
	 * @param {serverId}
	 * 
	 * @return {Boolean}
	 */
	isCHServerPos : function(areaIndex, serverIndex) {
		return user_all_servers[areaIndex]['subcat'][serverIndex]['sAttrValue']['type'] == "1"
				? true
				: false;
	},
	isCHServer : function(serverId) {
		var pos = this.findServerPos(serverId);

		return this.isCHServerPos(pos[0], pos[1]);
	},
	// 判断最近登录的服务器是否为联盟
	isCHServerLast : function() {
		var flag = false;
		var serverId = "";
		if ($.isArray(user_recent_servers)) {
			if (user_recent_servers.length > 0) {
				serverId = user_recent_servers[user_recent_servers.length - 1];
				if (this.isCHServer(serverId)) {
					flag = true;
				} else {
					flag = false;
				}
			} else {
				flag = true;
			}

		} else {
			flag = true;
		}
		return flag;
	},

	getRecommHTML : function(isOne) {
		
		var btnHtml = "";
		var qqRcmd = [];
		$(user_all_servers).each(function(areaIndex, area) {
			$(area['subcat']).each(function(serverIndex, server) {
						if (server['sAttrValue']['iIsRecommend'] == "1") {
							qqRcmd.push(iwan_gw.getBtnHtml(areaIndex,
									serverIndex));
						}
					});
		});
		if (isOne) {

			btnHtml = qqRcmd[0];
		} else {
			btnHtml = qqRcmd.join("");
		}

		return btnHtml;
	},
	// 创建推荐服务器
	createRecommServer : function() {
		// 推荐新服

		$("#recommend").html(this
				.getNewRecommHtml(this.isCHServerLast(), false).replace(
						/btn-server/g, 'btn-server btn-server-light'));

	},
	// 创建最近登录的服务器
	getLastHtml : function(isOne) {
		
		var pos = "";
		var btnHtml = "";
		var qqRcmd = [], my = [];
		var tempHtml = "";
		if ($.isArray(user_recent_servers)) {

			for (var i = user_recent_servers.length - 1; i >= 0; i--) {

				pos = iwan_gw.findServerPos(user_recent_servers[i]);
				if (pos.length != 0) {
					tempHtml = iwan_gw.getBtnHtml(pos[0], pos[1]);
					if (i == (user_recent_servers.length - 1)) {
						qqRcmd.push(tempHtml.replace(/btn-server/g,
								'btn-server btn-server-light'));
						my.push(tempHtml.replace(/btn-server/g,
								'btn-server btn-server-light'));
					} else {
						my.push(tempHtml);
					}
				}
			}
		}
		if (isOne) {
			btnHtml = qqRcmd[0];
		} else {
			btnHtml = "<div class='btnset clearfix' id='tabLast'><a href='#' class='here'>最近登录</a> <a href='#'>我的服务器</a></div><div class='boxes clearfix' id='boxLast'><div>"
					+ qqRcmd.join("")
					+ "</div><div style='display:none;'>"
					+ my.join("") + "</div></div>";
		}

		return btnHtml;
	},
	// 服务器页开始按钮
	createServerStart : function() {

		// 未登录

		$("#btnStart").html(this.getNewRecommHtml(true, true).replace(
				/btn-server/, "btn-server btn-start btn-start-server"));

		// 登录
		if ($app.auth.isLogin()) {
			var btnHtml = this.getLastHtml(true);
			if (btnHtml != "") {
				$("#btnStart").html(btnHtml.replace(/btn-server/,
						"btn-server btn-start btn-start-server")).find("a")
						.append("<strong>[最近登录]</strong>");
			}
		}
	},
	createLastServer : function() {
		// 登陆后再显示
		if (top.$app.auth.isLogin()) {
			$("#last").html(this.getLastHtml(false));
			iwan.ui.tab({
						btnId : "tabLast",
						boxId : "boxLast",
						event : "click"
					});
		}
	},
	// 创建全部服务器列表
	createServerList : function() {
		var tabHtml = "";
		var boxHtml = "";
		var gcHtml = "";

		var isShow = false;
		var chCount = 0;
		var newChAreaIndex = 0;

		if (this.isCHServerLast()) {// 联盟服务器，只创建联盟
			$(user_all_servers).each(function(i, area) {
						if (area['sAttrValue']['type'] == "1") {
							chCount++;
							newChAreaIndex = i;
						}
					});

			$(user_all_servers).each(function(i, area) {
						if (area['sAttrValue']['type'] == "1") {
							if (newChAreaIndex == i) {
								isShow = true;
							} else {
								isShow = false;
							}
							tabHtml += iwan_gw.getTabHtml(i, area['sName'],
									isShow);
							boxHtml += iwan_gw
									.getServerBoxHtml(i, area, isShow);
						}
					});
		} else {// 非联盟，创建所有

			$(user_all_servers).each(function(i, area) {
						if (0 == i) {
							isShow = true;
						} else {
							isShow = false;
						}
						tabHtml += iwan_gw.getTabHtml(i, area['sName'], isShow);
						boxHtml += iwan_gw.getServerBoxHtml(i, area, isShow);

					});
		}

		// $("#tabServer").html(tabHtml);
		// $("#boxServer").html(boxHtml);

		$("#serverList").html("<div id='tabServer' class='btnset'>" + tabHtml
				+ "</div><div class='boxes' id='boxServer'>" + boxHtml
				+ "</div>");

		iwan.ui.tab({
					btnId : "tabServer",
					boxId : "boxServer",
					hereIndex : newChAreaIndex,
					event : "click"
				});

		$("#tabServer").find("a").click(function() {
					if (top.iwan) {
						setTimeout(function() {
									top.iwan.ui.resizeGameFrame($(document)
											.height());
								}, 100);
					}
				});

		$("a[name^='btnServer_']").click(function() {
					var t = this;
					if (!$app.auth.isLogin()) {
						top.$app.auth.login({
									callback : function() {
										top.location.href = $(t).attr("href");
									}
								});
						return false;
					}
					if ($(this).find("em").hasClass("s-care")) {
						alert("很抱歉，停机维护中，请稍后刷新页面再试");
						return false;
					}

				});

		if (top.iwan) {
			top.iwan.ui.resizeGameFrame($("body").height());
		}

	},
	/**
	 * 获取选项卡按钮 html
	 * 
	 * @param {i}
	 * 
	 * @param {area}
	 * 
	 * @return {}
	 */
	getTabHtml : function(tabIndex, name, isHere) {
		return "<a id='tab_" + tabIndex + "' class='" + (isHere ? 'here' : '')
				+ "' href='javascript:;'>" + name + "</a>";
	},
	/**
	 * 获取全部列表中单个选项卡html
	 * 
	 * @param {i}
	 * 
	 * @param {area}
	 * 
	 * @return {html}
	 */
	getServerBoxHtml : function(tabIndex, area, isShow) {
		var boxHtml = "";
		var btnHtml = "";
		var areaIndex = tabIndex;
		boxHtml += "<div id='box_" + tabIndex
				+ "' class='server-list clearfix'"
				+ (isShow ? "" : " style='display:none;'") + " >";
		// 服务器html
		var len = area['subcat'].length;

		$(area['subcat']).each(function(serverIndex, server) {

					btnHtml += iwan_gw.getBtnHtml(areaIndex, serverIndex);
				});

		boxHtml += btnHtml;
		boxHtml += "</div>";
		return boxHtml;
	},
	/**
	 * 获取开始游戏URL
	 * 
	 * @param {gid}
	 * 
	 * @param {sid}
	 * 
	 * @param {sname}
	 * 
	 * @return url@string
	 */
	getStartURL : function(gid, sid, sname) {
		return 'http://iwan.qq.com/playgame?gid=' + gid + '&sid=' + sid
				+ '&sname=' + sname;
	},
	/**
	 * 根据serverId 查找位置
	 * 
	 * @param {}
	 *            serverId
	 * @return {}
	 */
	findServerPos : function(serverId) {
		var res = [];
		var flag = true
		$(user_all_servers).each(function(i, area) {
					$(area['subcat']).each(function(j, server) {
								if (server['iNodeId'] == serverId) {
									res[0] = i;
									res[1] = j;
									flag = false;
									return false;
								}
							});
					if (!flag) {
						return false;
					}
				});
		return res;
	},
	/**
	 * 生成服务器按钮html
	 * 
	 * @param {id}
	 * 
	 * @return {}
	 */
	getBtnHtml : function(areaIndex, subcatIndex) {
		
		
		var server = user_all_servers[areaIndex]['subcat'][subcatIndex];
		var html = "";
		html += '<a target="_blank" class="btn-server" name="btnServer_'
				+ server['iNodeId']
				+ '" href="'
				+ this.getStartURL(this.gameId, server['iNodeId'],
						server['sName']) + '" >';
		if (server['sAttrValue']['iIsRecommend'] == 1) {
			html += "<b></b>";
		}
		if (server['sAttrValue']['iIsNew'] == 1) {
			html += "<i></i>";
		}

		var status = 0;
		if (server['iStatus'] == 0) {
			status = 9;
		} else {
			if (server['sAttrValue']) {
				status = server['sAttrValue']['iBusyStatus'];
			} else {
				status = 9;
			}
		}

		var statusInfo = this.getStauts(parseInt(status, 10));

		html += '<em class="' + statusInfo[0] + '" title="' + statusInfo[1]
				+ '" ></em><span>' + server['sName'] + '</span></a>';
		
				return html;

	},
	/**
	 * 通过服务状态获得相应的样式及文字提示
	 * 
	 * @param {status}
	 * @return array[style,tip]
	 */
	getStauts : function(status) {

		var style = "";
		var tip = "";

		switch (status) {
			case 9 :
				style = "s-care";
				tip = "维护";
				break;
			case 0 :
				style = "s-free";
				tip = "畅通";
				break;
			case 1 :
				style = "s-crowd";
				tip = "拥挤";
				break;
			case 2 :
				style = "s-full";
				tip = "繁忙";
				break;
			default :
				style = "s-free";
				tip = "畅通";
				break;
		}

		return [style, tip];
	},
	/**
	 * 设置昵称
	 * 
	 * @param {$nickBox}
	 * 
	 */
	setNick : function($nickBox) {
		$nickBox.html($app.auth.getQQNum());

		iwan.api.getNick(function(res) {
					$nickBox.html(res.nick);
				});

	},
	// 首页登录块控制
	loginBox : function() {
		if ($app.auth.isLogin()) {
			$("#logout-box").show();
			$("#login-box").hide();
			this.setNick($("#logout-box").find("span"));
		}
		// 登录
		$("#login-box>a").click(function() {
					top.$app.auth.login({
								callback : function() {
									top.location.href = iwan_gw.indexURL();

								}
							});
					return false;
				});
		// 退出
		$("#logout-box>a").click(function() {
					if ($app.auth.isLogin()) {
						top.$app.auth.logout();
					}
					return false;
				});

	},
	// 获取推荐的联盟服务器 isChLast是否为联盟服务器 isOne 是否只取一个服务器
	getNewRecommHtml : function(isCHLast, isOne) {
		// 最近的联盟区
		
		var tempArea = 0;
		var html = "";
		var x = 0;
		var y = 0;

		var arrHtml = [];
		var tempServer = [];

		if (isCHLast) {// 联盟
			
			$(user_all_servers).each(function(i, area) {
				if (area['sAttrValue']['type'] == "1") {
					$(area['subcat']).each(function(j, server) {
						
								if (server['sAttrValue']['iIsRecommend'] == "1") {
									arrHtml.push(iwan_gw.getBtnHtml(i, j));
								}
								tempServer = [i, j];
							});
				}
			});
			// 无联盟推荐服务器 则将最后一个联盟服务器推荐
			if (arrHtml.length == 0) {
		
				arrHtml.push(iwan_gw.getBtnHtml(tempServer[0], tempServer[1]));
			}

		} else {// 非联盟
			
			$(user_all_servers).each(function(i, area) {
				if (area['sAttrValue'] == ""
						|| area['sAttrValue']['type'] == "0") {

					$(area['subcat']).each(function(j, server) {
								if (server['sAttrValue']['iIsRecommend'] == "1") {

									arrHtml.push(iwan_gw.getBtnHtml(i, j));
								}
							});
				}
			});
		}

		if (arrHtml.length == 0) {
			return "";
		}

		if (isOne) {
			return arrHtml[arrHtml.length - 1];
		}

		return arrHtml.join("");

	},
	// 加载开始游戏按钮事件
	startGameBox : function() {
		var $btnStart = $("#btnStart");
		var btnHtml = "";

		// 未登录
		$btnStart.html(this.getNewRecommHtml(true, true).replace(/btn-server/,
				"btn-server btn-start"));
                

		// 登录
		if ($app.auth.isLogin()) {
			btnHtml = this.getLastHtml(true);
			if (btnHtml != "") {
				$btnStart.html(btnHtml.replace(/btn-server/,
						"btn-server btn-start")).find("a")
						.append("<strong>[最近登录]</strong>");
			}
		}

		// 进入游戏
		$btnStart.find("a").live("click", function() {
					if (!top.$app.auth.isLogin()) {

						top.$app.auth.login({
									callback : function() {
										top.location.href = iwan_gw.indexURL();
									}
								});
						return false;
					}
				});

		// 推荐新服
		$("#btnCreate").html(this.getNewRecommHtml(true, true).replace(
				/btn-server/, "btn-server btn-create"));
		$("#btnCreate").click(function() {
					if (!top.$app.auth.isLogin()) {

						top.$app.auth.login({
									callback : function() {
										top.location.href = iwan_gw.indexURL();
									}
								});
						return false;
					}
					return false;
				});

	},
	// 重选服务器
	selectServer : function() {
		$("#btnReSelect").click(function() {
					if (!top.$app.auth.isLogin()) {
						top.$app.auth.login({
									callback : function() {

										top.location.href = iwan_gw.serverURL();
									}
								});
						return false;
					}

				});
	},
	indexTab : function() {
		iwan.ui.tab({
					btnId : "tabs",
					boxId : "boxes",
					event : "mousemove"
				});
	},
	// 页面功能
	indexFunc : function() {
		var t = this;
		//
		var tabId = "";
		$("[id^=tabBtns]").each(function() {
					tabId = $(this).attr("id").split("_")[1];
					iwan.ui.tab({
								btnId : "tabBtns_" + tabId,
								boxId : "tabBoxes_" + tabId,
								event : "mouseover"
							});
				});

		$("#picSlider").iwanSlider({
					effect : "slideLeftRight",
					event : "mouseenter",
					autoPlay : true
				});

		// 领取礼包
		$("[id^=btnReceivePack]").click(function() {
					top.iwan.ui.receivePack({
								gameId : t.gameId,
								itemId : $(this).attr("id").split("_")[1]
							});
					return false;
				});

	},
	picList : function(options) {
		var o = {
			target : "",
			items : [{
						simg : "",
						img : ""
					}]
		};

		var o = $.extend({}, o, options)
		var html = "";
		$(o.items).each(function(i, val) {
			html += "<a class='pic-box" + (i + 1) + "' href='" + val['img']
					+ "'><img src='" + val['simg'] + "' /></a>";
		});

		$("#" + o.target).html(html);

		var $imgs = $("#" + o.target).find("a");

		var now = "";
		var pre = "";

		$imgs.mouseenter(function() {
					now = this;

					$(pre).animate({
								opacity : 0.5
							}, 200);

					$(now).animate({
								opacity : 1
							}, 200);

					pre = now;
				});

		$("#" + o.target).hover(function(e) {

					$imgs.each(function(i, v) {
								if (v != now) {
									$(v).animate({
												opacity : 0.5
											}, 200);
								}
							});

				}, function() {
					$imgs.animate({
								opacity : 1
							}, 200);
				});

	},

	serverEvent : function() {
		var t = this;
		$("#btnLogin").click(function() {
					if (!top.$app.auth.isLogin()) {
						top.$app.auth.login({
									callback : function() {
										t.showServer();
									}
								});
					}
					return false;
				});

		// 退出
		$("#logout-box>a").click(function() {
					if ($app.auth.isLogin()) {
						top.$app.auth.logout({
									callback : function() {
										top.location.href = t.indexURL();
									}
								});
					}
					return false;
				});

		// 显示更多
		$("#btnMoreServer").click(function() {
					$("#boxServers").show();
					$("#boxStart").hide();

					if (top.iwan) {
						setTimeout(function() {
									top.iwan.ui.resizeGameFrame($(document)
											.height());
								}, 100);
					}
					return false;
				});

	},

	// 显示服务器页按钮&登录控制
	showServer : function() {
		var t = this;
		var $btnLogin = $("#btnLogin");
		var $btnStart = $("#btnStart");
		var $btnMoreServer = $("#btnMoreServer");

		if (top.$app.auth.isLogin()) {
			// 隐藏登录按钮
			$btnLogin.hide();

			// 显示开始按钮
			$btnStart.show();

			// 显示退出按钮
			$("#logout-box").show();
			this.setNick($("#logout-box").find("span"));

			// 记载数据
			t.loadData(function() {
						t.createServerStart();

						t.createRecommServer();

						t.createLastServer();

						t.createServerList();

						$btnMoreServer.show();

					});
		}
	},

	// 初始化服务器页入口
	initServerPage : function() {
		var t = this;

		t.serverEvent();
		t.showServer();

	},
	// 初始化首页入口
	initIndexPage : function() {
		var t = this;
		t.loginBox();
		t.loadData(function() {
					t.startGameBox();
					t.selectServer();
					t.indexTab();
				});
		t.indexFunc();
	}
};

// 页面高度控制
$(function() {

			if (top.iwan) {
				top.iwan.ui.resizeGameFrame($("body").height());
			}
		});/*  |xGv00|83a87d828363f43633707bafb611a7bf */