const app = getApp()
var request = require('../../utils/request.js');

Page({
  data: {
    addressAll: [
    ],
    numAll: true,
    addressClick: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    // 获取地址数据
    request.request('POST', 'userAddress.getAddressList',
      {
        params: {
        "userid": app.userId //userId默认值1
      },
      success: function(res) {
        console.log(res)
        if (res.data.code !== 200) {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          })

        } else {
          wx.hideLoading()
          var num = res.data.data.length
          if (num.length == 0) {
            that.setData({
              numAll: true,
            })
          } else {
            that.setData({
              numAll: false,
            })
          }
          that.setData({
            addressAll: res.data.data
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
  },
  // 点击跳转添加地址
  tianjia: function(e) {
    wx.navigateTo({
      url: '../addAddress/addAddress',
    })
  },
  // 点击地址返回上一页并更新
  dianji: function(e) {
    var that = this
    var id = e.currentTarget.dataset.id //获取下标
    var JSON0 = that.data.addressAll[id]
    console.log(JSON0)
    this.setData({
      addressClick: JSON0
    })
    var newAddress = JSON.stringify(JSON0)
    console.log(newAddress)
    wx.redirectTo({
      url: "../tlxq/tlxq?newAddress=" + newAddress
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
    var that = this;
    // 获取地址数据
    // 获取地址数据
    request.request('POST', 'userAddress.getAddressList',
      {
        params: {
          "userid": app.userId //userId默认值1
        },
        success: function (res) {
          console.log(res)
          if (res.data.code !== 200) {
            wx.showToast({
              title: res.data.message,
              icon: 'none',
              duration: 2000
            })

          } else {
            wx.hideLoading()
            var num = res.data.data.length
            if (num.length == 0) {
              that.setData({
                numAll: true,
              })
            } else {
              that.setData({
                numAll: false,
              })
            }
            that.setData({
              addressAll: res.data.data
            })
          }
        },
        fail: function () {
          wx.showToast({
            title: '您的网络连接有问题',
            icon: 'none',
            duration: 2000
          })
        }
      })



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