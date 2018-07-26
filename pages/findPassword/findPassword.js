var request = require('../../utils/request.js');
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    time: "获取验证码",
    currentTime: 61,
    panduan: false,
    value0: ''
  },
  //获取手机号码
  input0: function(e) {
    this.setData({
      value0: e.detail.value.replace(/\s+/g, '')
    })
  },
  // 获取验证码
  input1: function(e) {
    this.setData({
      value1: e.detail.value
    })
  },
  // 获取输入密码
  input2: function(e) {
    this.setData({
      value2: e.detail.value
    })
  },
  // 获取再次输入密码
  input3: function(e) {
    this.setData({
      value3: e.detail.value
    })
  },
  // 获取验证码点击事件
  yanzhengma: function() {
    if (this.data.value0 == undefined) {
      wx.showToast({
        title: '请输入号码',
        icon: 'none',
        duration: 2000
      })
    } else {
      var that = this;
      var currentTime = that.data.currentTime
      var telephone = that.data.value0
      // 验证号码格式
      if (this.data.value0.length !== 11) {
        wx.showToast({
          title: '请输入11位电话号码',
          icon: 'none',
          duration: 2000
        })
      } else {
        wx.showLoading({
          title: '加载中',
        })
        //  发送手机号码到后台
        request.request('POST', 'system.sendUserSms', {
          params: {
            "telphone": telephone,
            "sendtype": 2
          },
          success: function(res) {
            wx.hideLoading()
            if (res.data.code == 200) {
              wx.showToast({
                title: '验证码已发送',
                icon: 'success',
                duration: 2000
              })
              var interval = setInterval(function() {
                currentTime--;
                that.setData({
                  time: currentTime + '秒',
                  disabled: true
                })
                if (currentTime <= 0) {
                  clearInterval(interval)
                  that.setData({
                    time: '重新发送',
                    currentTime: 61,
                    disabled: false
                  })
                }
              }, 1000)
            } else {
              wx.showToast({
                title: '请输入有效的电话号码',
                icon: 'none',
                duration: 2000
              })
            }
          },
          fail: function() {
            wx.showToast({
              title: '您的网络连接有问题',
              icon: 'none',
              duration: 2000
            })
          }
        })
      }
    }
  },
  // 重设
  chongshe: function() {
    var that = this;
    // 判断数据是否齐全
    if (that.data.value0 == undefined) {
      wx.showToast({
        title: '请填写手机号码',
        icon: 'none',
        duration: 2000
      })
    } else if (that.data.value1 == undefined) {
      wx.showToast({
        title: '请填写验证码',
        icon: 'none',
        duration: 2000
      })
    } else if (that.data.value2 == undefined) {
      wx.showToast({
        title: '请填写密码',
        icon: 'none',
        duration: 2000
      })
    } else if (that.data.value3 == undefined) {
      wx.showToast({
        title: '请确认密码',
        icon: 'none',
        duration: 2000
      })
    } else if (this.data.value3 !== this.data.value2) { // 判断密码是否一致
      wx.showToast({
        title: '两次密码不一致',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.showLoading({
        title: '加载中',
      })
      //  找回密码
      request.request('POST', 'user.forget', {
        params: {
          "username": that.data.value0,
          "password": that.data.value2,
          "confirmpassword": that.data.value3,
          "smscode": that.data.value1
        },
        success: function(res) {
          wx.hideLoading()
          if (res.data.code !== 200) {
            wx.showToast({
              title: res.data.message,
              icon: 'none',
              duration: 2000
            })
          } else {
            wx.showToast({
              title: '修改成功',
              icon: 'none',
              duration: 2000
            })

            // 重置openID
            wx.setStorageSync("openid", null)
            // 重置userInfo
            app.globalData.userInfo = null;
            // 跳转到首页
            // wx.navigateTo({
            //     url: '../login/login',
            // })
          }
        },
        fail: function(res) {
          wx.showToast({
            title: '您的网络连接有问题',
            icon: 'none',
            duration: 2000
          })
        }
      })
    }
  },
  // 未收到验证码
  lianxi: function() {
    wx.showModal({
      showCancel: false,
      content: '请联系客服 4008-123-337',
      success: function(res) {
        if (res.confirm) {} else if (res.cancel) {}
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    wx.hideLoading()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})