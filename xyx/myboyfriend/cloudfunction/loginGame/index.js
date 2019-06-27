// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init();
const db = cloud.database();
const players = db.collection('players');

/*
serverdata.timestamp = Number(serverdata.timestamp); // 当前服务器的时间
serverdata.offlineTime = Number(serverdata.offlineTime); // 用户上次离线的时间
serverdata.dbVersion = Number(serverdata.dbVersion); // db版本
serverdata.shareCoinNum = Number(serverdata.shareCoinNum); // 分享钱的数量
serverdata.shareDiamonNum = Number(serverdata.shareDiamonNum); // 分享钻石的数量
serverdata.upStartTime = Number(serverdata.upStartTime); // 开始加速的时间
serverdata.friendDraw = Number(serverdata.friendDraw); // 邀请好友今日领奖
serverdata.loginDays = Number(serverdata.loginDays); // 登录天数
serverdata.loginRewardDays = Number(serverdata.loginRewardDays); // 登录奖励的天数
serverdata.lastLoginTime = Number(serverdata.lastLoginTime); // 最近登录时间
serverdata.coin = Number(serverdata.coin); // 钱币数量
serverdata.diamon = Number(serverdata.diamon); // 钻石数量
serverdata.speed = Number(serverdata.speed); // 当前速度
serverdata.guideStep = Number(serverdata.guideStep); // 引导步数
serverdata.shopLevel = Number(serverdata.shopLevel); // 商城等级
serverdata.isNewPlayer = "false" != serverdata.isNewPlayer; // 是否是新玩家
serverdata.isFly = Number(serverdata.isFly); // 是否飞升
serverdata.itemArray; // 商品列表
serverdata.luckyCount; // 幸运大转盘次数
serverdata.luckyShareCount; // 幸运大转盘分享次数
serverdata.luckyUpTime; // 幸运提升时间？
serverdata.slots; //格子
*/

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();

  let playerInfo = null;
  let isNewPlayer = false;
  try {
    const querResult = await players.doc(wxContext.OPENID).get();
    playerInfo = querResult.data;
  } catch (err) {
    isNewPlayer = (playerInfo == null);
  }

  let curtime = new Date().getTime();

  let result = {
    isNewPlayer: isNewPlayer,

    sessionid: '100001',
    openId: wxContext.OPENID,
    wxSessionkey: '455abcf9458924234343256080afea23',

    luckyCount: 5,
    luckyShareCount: 5,
    luckyUpTime: 0,

    diamonCount1: 0,
    diamonCount2: 0,
    strShop: [0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    itemArray: [{id:1, buyUnlock:1, coinUnlock:1, diamonUnlock:0, diamonCount:0,coinCount:0}],
    strSlot: [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    slots: [],
    coin: 4000,
    diamon: 0,
    shopLevel: 1,
    speed: 1,
    guideStep: 0,
    timestamp: curtime,
    upStartTime: curtime,
    isNewPlayer: true,
    loginDays: 1,
    loginRewardDays: 0,
    lastLoginTime: curtime,
    friendDraw: 0,
    friendNum: 0,
    shareCoinNum: 0,
    shareDiamonNum: 0,
    offlineTime: curtime,
    dbVersion: 1,
    isFly: false
  };

  if (playerInfo != null) {
    result.offlineTime = playerInfo.saveTime;
    result.dbVersion = playerInfo.dbVersion;
    result.shareCoinNum = playerInfo.shareCoinNum;
    result.shareDiamonNum = playerInfo.shareDiamonNum;
    result.upStartTime = playerInfo.upStartTime;
    result.friendDraw = playerInfo.friendDraw;
    result.loginDays = playerInfo.loginDays;
    result.loginRewardDays = playerInfo.loginRewardDays;
    result.lastLoginTime = playerInfo.lastLoginTime;
    result.coin = playerInfo.coin;
    result.diamon = playerInfo.diamon;
    result.speed = playerInfo.speed;
    result.guideStep = playerInfo.guideStep;
    result.shopLevel = playerInfo.shopLevel;
    result.isFly = playerInfo.isFly;
    result.luckyCount = playerInfo.luckyCount;
    result.luckyShareCount = playerInfo.luckyShareCount;
    result.luckyUpTime = playerInfo.luckyUpTime;
    result.itemArray = playerInfo.itemArray;
    result.slots = playerInfo.slots;
  }

  return result;
}