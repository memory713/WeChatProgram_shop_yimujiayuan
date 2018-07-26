//app.js
App({
  // 测试 http://emapi.emjiayuan.com/api.php
  // 正式 http://api.emjiayuan.com/api.php
  // 原先 https://api2.emjiayuan.com/v3/api.php
  header: {
    "key": '81faee75bd269f0010b94bf54cd44345',
    "platform": "WX_XCX",
    'content-type': 'application/json' // 默认值
  },
  userId: parseInt(wx.getStorageSync("userId")),
  onLaunch: function() {
  },
})