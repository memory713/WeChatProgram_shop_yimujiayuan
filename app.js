//app.js

App({
    dataHost : "https://api2.emjiayuan.com/v3/api.php",
    userId: parseInt(wx.getStorageSync("userId")),



  onLaunch: function () {
      var that = this
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
          wx.request({
              //获取openid接口 
            //   url: 'https://api.weixin.qq.com/sns/jscode2session',
              url: that.dataHost,
              data: {
                  ac: "wxlitelogin",
                 
                //   appid: 'wx8a0c9b5ff049e3db',
                //   secret: 'b5fca600fc9e015c0538ec618dc6a8b6',
                  code: res.code,
                //   grant_type: 'authorization_code'
              },
              method: 'GET',
              success: res2 => {
                  this.globalData.openid = res2.data.data.openid
                  wx.setStorageSync("openid",this.globalData.openid)

              }
            })
        }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })


  },
  globalData: {
    userInfo: null
  }

})