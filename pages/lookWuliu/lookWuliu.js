const app = getApp()
var request = require('../../utils/request.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
      wuliu:"暂无物流消息",
      panduan:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      wx.showLoading({
          title: '加载中',
      })
      var that = this;
    //   http://api2.emjiayuan.com/v3/api.php?ac=kuaidi&postcom=zhongtong&postid=631037739043
    //   "postcom": options.gs,
    //       "postid": options.dh
      // 请求物流消息
      request.request('POST', 'public.getExpress', {
        params: {
              "postcom": options.gs,
              "postid": options.dh
          },
          success: function (res) {
              if (res.data.code !==200){
                  that.setData({
                      wuliu: res.data.message,
                      panduan:true
                  })
              }else{
                  var line = [];
                  for (var x in res.data.data) {
                      var msg = {};
                      msg.context = res.data.data[x].context;
                      msg.ftime = res.data.data[x].ftime;
                      line.push(msg);
                  }
                  that.setData({
                      line: line,
                      panduan:false
                  })
              }
          },
          fail: function (res) {
              wx.showToast({
                  title: '您的网络连接有问题',
                  icon: 'none',
                  duration: 2000
              })
          }
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
      wx.hideLoading()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})