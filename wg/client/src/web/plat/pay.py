# -*- coding: utf-8 -*-
import comm_html_res
import comm_config

html_res = {
'body_frame' : r'''
<link rel="stylesheet" href="./css/contact.css">
<div class="content">
  <div class="contactus">
    <div class="title">
      <span>游戏充值</span>
    </div>
    <div class="main">
        <div class="txt">
            • 游戏内测期间，充值暂未开放！ <br>
            • 感谢您关注《狂拽三国》，我们正在努力做得更好：） <br>
        </div>
        <div class="title2">您可以通过以下方式联系我们</div>
        <div class="list clearfix">
            <div class="info-box">
                <div class="icon-qq"></div>
                <span class="link">加入QQ群交流</span>
                <p>交流1群 292911715 <br></p>
            </div>
            <div class="info-box">
                <div class="icon-bbs"></div>
                <a class="alink" href="''' +comm_config.bbs_res['cs_url']+ '''" target="_blank">客服中心</a>
                <p>我们的工作人员将会尽快回应您的留言，并欢迎大家在此处讨论</p>
            </div>
        </div>
    </div>
  </div>
</div>
'''
}

from mod_python import util
from mod_python import Session
import re,md5,time
import config
    
class MySession:
    def __init__(self, req):
        self._req = req
        self._req.add_common_vars()
        self._session = Session.Session(self._req)
        self._guest = '*Guest*'
        self._user = self._session.get('user', self._guest)
        
    def handle(self):
        self._printHtml()
        return ''
        
    def _printHtml(self):
        self._req.content_type = 'text/html;charset=UTF-8;'
        html = comm_html_res.MainFrame(self._req, self._user).make()
        html = html.replace('${pagebody}', html_res['body_frame'])
        
        self._req.write(html)

def index(req):
    return MySession(req).handle()