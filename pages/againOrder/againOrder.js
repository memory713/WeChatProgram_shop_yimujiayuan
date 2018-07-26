var util = require('../../utils/util.js');
var request = require('../../utils/request.js');

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chuData: [{
        name: "桂圆",
        level: "优质",
        weight: "1.5斤"

      },
      {
        name: "花椒",
        level: "优质",
        weight: "2.5斤"

      },
      {
        name: "胡椒",
        level: "优质",
        weight: "1.5斤"
      }
    ],
    leixing: [{
        name: 'tang',
        value: '汤料',
        checked: 'true'
      },
      {
        name: 'mian',
        value: '面料',
      },
      {
        name: 'qita',
        value: '其他'
      },
    ],
    addAddress: {
      userAdderss: "宁波市镇海区XXXXXXX",
      userName: "黄赌毒11111",
      userPhone: "13958243103"
    },
    tangliaoleixing: "汤料",
    beizhuliuyan: "无",
    orderId: "",
    zhehouPrice: 0,
    discount: 0,
    shifouzhe: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    })
    //   订单详情
    var that = this;
    request.request('POST', 'soupOrder.getSoupOrderDetail', {
      params: {
        "orderid": options.orderId,
        "userid": app.userId
      },
      success: function(res) {
        console.log(res)
        if(res.data.code==200){
          wx.hideLoading()
            // 判断折扣是否有
            if (res.data.data.discount == null || res.data.data.discount == 0 || res.data.data.discount == undefined) {
              that.setData({
                shifouzhe: false,
              })
            } else {
              that.setData({
                shifouzhe: true
              })
            }
            // 计算总重量
            var suan = 0;
            for (var x in res.data.data.product_list) {
              suan = suan + Number(res.data.data.product_list[x].buycount)
            }
            // 判断汤料类型
            var tangliaoleixing;
            if (res.data.data.leixing == 1) {
              tangliaoleixing = "汤料"
            } else if (res.data.data.leixing == 0) {
              tangliaoleixing = "其他"
            } else if (res.data.data.leixing == 2) {
              tangliaoleixing = "面料"
            }
            // 判断留言与否
            var comment = "";
            if (res.data.data.comment == null) {
              comment = "无"
            }
      
            that.setData({
              chuData: res.data.data.product_list,
              suan: suan,
              danwei: res.data.data.danwei,
              chenben0: res.data.data.showmoney,
              jiagong: res.data.data.costmoney,
              tangliaoName: res.data.data.order_name,
              allPrice0: res.data.data.totalmoney,
              // 折扣
              discount: res.data.data.discount,
              youhuihou: res.data.data.discount_price,
              comment: comment,
              tangliaoleixing: tangliaoleixing,
              address: res.data.data.address,
              address_name: res.data.data.address_name,
              address_phone: res.data.data.address_phone,
            })
        }else{
          wx.showToast({
            title: res.data.message,
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
  },
  radioChange: function(e) {},
  // 再来一单
  buy: function() {
    wx.navigateTo({
      url: '../tlxq/tlxq?orderId=' + this.data.orderId,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    
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