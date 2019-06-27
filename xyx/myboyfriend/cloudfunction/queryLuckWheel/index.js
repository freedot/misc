// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  let curtime = new Date().getTime();
  return {
    luckCount:5,
    luckShareCount:0,
    luckUpTime: curtime
  }
}