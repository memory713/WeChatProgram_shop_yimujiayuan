var util = require('../../utils/util.js');
var request = require('../../utils/request.js');

const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    chuData: [],
    beizhu: "",
    isDefault: true,
    xiadan: "下单",
    leixing: [{
        name: 'tang',
        value: '汤料',
      },
      {
        name: 'mian',
        value: '炒面料',
      },
      {
        name: 'qita',
        value: '其他'
      },
    ],
    danwei: "",
    suan: "",
    chenben0: 0,
    name233: '',
    addAddress: {
      username: "请添加地址",
      telphone: "",
      address: "请添加地址"
    },
    zhehouPrice: 0,
    discount: 0,
    shifouzhe: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    // 缓存 判断数据来源
    if (options.orderId) { //再来一单
      wx.setStorageSync("shujulaiyuan", 1)
      wx.setStorageSync("orderIdAgain", options.orderId)
      this.setData({
        orderId: options.orderId
      })
    } else if (options.shouye) {
      wx.setStorageSync("shujulaiyuan", 2)
    }
    // 获取缓存
    var shujulaiyuan = wx.getStorageSync('shujulaiyuan')
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    //从首页跳转来的订单信息    
    if (shujulaiyuan == 2) {
      var tijiaoArr2 = wx.getStorageSync('tijiaoArr2')
      tijiaoArr2 = JSON.parse(tijiaoArr2);
      console.log(tijiaoArr2)
      // 确认订单
      request.request('POST', 'soupOrder.confirmSoupOrder', {
        params: {
          userid: app.userId,
          val: tijiaoArr2[0].val,
          soupname: tijiaoArr2[0].soupname,
          productids: tijiaoArr2[0].productids,
        },
        success: function(res) {
          console.log(res)
          wx.hideLoading()
          if (res.data.code !== 200) {
            wx.showToast({
              title: res.data.message,
              icon: 'none',
              duration: 2000
            })
          } else {
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
            that.setData({
              chuData: res.data.data.products,
              suan: res.data.data.totalweight,
              chenben0: res.data.data.productprice,
              jiagong: res.data.data.costmoney,
              tangliaoName: res.data.data.ordername,
              allPrice0: res.data.data.payprice,
              // 折扣
              discount: res.data.data.discount,
              youhuihou: res.data.data.discountprice,
              danwei: res.data.data.unitstr
            })

          }
        },
        fail: function() {
          wx.showToast({
            title: "您的网络有误，请检查",
            icon: 'none',
            duration: 2000
          })

        },
      })
    } else if (shujulaiyuan == 1) { //从再来一单跳转的数据
      //   获取对应订单信息
      var orderIdAgain = wx.getStorageSync('orderIdAgain')
      console.log(orderIdAgain)
      // 订单详情
      request.request('POST', 'soupOrder.getSoupOrderDetail', {
        params: {
          "userid": app.userId,
          "orderid": orderIdAgain
        },
        success: function(res) {
          console.log(res)
          wx.hideLoading()
          if (res.data.code == 200) {
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
            // 汤料列表
            for (var x in res.data.data.product_list) {
              res.data.data.product_list[x].level = res.data.data.product_list[x].class
              res.data.data.product_list[x].weight = res.data.data.product_list[x].buycount
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
              tangliaoleixing: tangliaoleixing

            })
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
    // 判断地址来路
    if (options.newAddress) { //如果从地址页面跳转过来
      console.log(options.newAddress)
      that.setData({
        addAddress: JSON.parse(options.newAddress),
        dizhishuliang: 1
      })
    } else {
      // 获取地址数据  从首页过来
      request.request('POST', 'userAddress.getDefaultAddress', {
        params: {
          "userid": app.userId
        },
        success: function(res) {
          console.log(res)
          if (res.data.code == 200) {
            var newAddress0 = res.data.data
            that.setData({
              addAddress: newAddress0,
              dizhishuliang: 1
            })
          } else {
            that.setData({
              dizhishuliang: 0
            })
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
  // 选择汤料类型
  radioChange: function(e) {
    if (e.detail.value == "mian") {
      this.setData({
        leixing0: 2
      })
    } else if (e.detail.value == "tang") {
      this.setData({
        leixing0: 1
      })
    } else if (e.detail.value == "qita") {
      this.setData({
        leixing0: 0
      })
    }
  },
  // 备注留言
  textareaValue: function(e) {
    this.setData({
      beizhu: e.detail.value
    })
  },
  // 点击取消 返回首页
  quxiao: function() {
    wx.reLaunch({
      url: '../index/index',
    })
  },
  // 添加地址点击跳转
  tianjiadizhi: function() {
    wx.navigateTo({
      url: '../myAddress/myAddress',
    })
  },
  // 购买
  buy: function() {

    // 判断是否选择了类型
    if (this.data.leixing0 == undefined) {
      wx.showToast({
        title: '请选择类型',
        icon: 'none',
        duration: 2000
      })
    } else if (this.data.dizhishuliang == 0) {
      wx.showToast({
        title: '请选择地址',
        icon: 'none',
        duration: 2000
      })
    } else {
      // 单位换算
      var that = this;

      // 判断val值
      if (that.data.danwei == "斤") {
        this.setData({
          val: 500
        })
      } else if (that.data.danwei == "两") {
        this.setData({
          val: 50
        })
      } else if (that.data.danwei == "千克") {
        this.setData({
          val: 1000
        })
      } else if (that.data.danwei == "克") {
        this.setData({
          val: 1
        })
      }

      // 筛选出省份 从默认地址筛选
      var shengfen = that.data.addAddress.shengfen
      // 判断是否存在，
      console.log(shengfen.indexOf(","))
      if (shengfen.indexOf(",") != -1) {
        // 存在
        shengfen = shengfen.split(",")
      } else {
        shengfen = shengfen.split(" ")
      }
      console.log(shengfen)
      that.setData({
        shengfen: shengfen
      })

      // 拼接成productids
      var productids = ""
      for (var x in this.data.chuData) {
        if (this.data.chuData[x].typeid == undefined) {
          this.data.chuData[x].typeid = this.data.chuData[x].id
        } else if (this.data.chuData[x].id == undefined) {
          this.data.chuData[x].id = this.data.chuData[x].typeid
        }
        productids = productids + this.data.chuData[x].typeid + "|" + this.data.chuData[x].weight + ","
      }
      productids = productids.substr(0, productids.length - 1);
      console.log(this.data.chuData)


      that.setData({
        xiadan: "正在下单...",
        isDefault: false
      })
      wx.showLoading({
        title: '正在生成订单，请稍后...',
      })
      // 用户登录

      // 判断何种方式进入

      // 获取缓存
      var shujulaiyuan = wx.getStorageSync('shujulaiyuan')

      //从首页跳转来的订单信息    
      if (shujulaiyuan == 2) {
        // 首页
        // 创建订单
        request.request('POST', 'soupOrder.addSoupOrder', {
          params: {
            "userid": app.userId,
            "val": that.data.val,
            "danwei": that.data.danwei,
            "soupname": that.data.tangliaoName,
            "remark": that.data.beizhu,
            "leixing": that.data.leixing0,
            "addressname": that.data.addAddress.username,
            "addressphone": that.data.addAddress.telphone,
            "address": that.data.addAddress.address,
            "addressprovince": that.data.shengfen[0],
            "productids": productids,
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
              // 设置订单ID
              that.setData({
                orderId0: res.data.data.orderid
              })
              // 登录 获取openid及秘钥
              wx.login({
                success: function(res) {
                  console.log(res)
                  if (res.code) {
                    // 获取openId
                    request.request('POST', 'welite.getOpenid', {
                      params: {
                        "code": res.code
                      },
                      success: function(res) {
                        console.log(res)
                        if (res.data.code == 200) {
                          console.log(res.data.data.openid)
                          console.log(res.data.data.session_id)
                          // 微信支付
                          request.request('POST', 'pay.wxpay', {
                            params: {
                              "paytype": "SOUP",
                              "orderid": that.data.orderId0,
                              "openid": res.data.data.openid
                            },
                            success: function(res) {
                              console.log(res)
                              // 微信支付
                              wx.requestPayment({
                                'appId': res.data.data.appId,
                                'timeStamp': res.data.data.timeStamp,
                                'nonceStr': res.data.data.nonceStr,
                                'package': res.data.data.package,
                                'signType': 'MD5',
                                'paySign': res.data.data.paySign,
                                'success': function(res) {
                                  console.log(res)
                                  wx.showToast({
                                    title: '支付成功',
                                    icon: 'none',
                                    duration: 2000
                                  })
                                },
                                'fail': function(res) {
                                  console.log(res)
                                  wx.showToast({
                                    title: '支付失败',
                                    icon: 'none',
                                    duration: 2000
                                  })
                                },
                                "complete": function() {
                                  // 跳转到我的订单
                                  setTimeout(function() {
                                    wx.navigateTo({
                                      url: '../myOrder/myOrder',
                                    })
                                    that.setData({
                                      xiadan: "下单",
                                      isDefault: true
                                    })
                                  }, 2000)
                                }
                              })
                            },
                            fail: function() {
                              wx.hideLoading()
                              wx.showToast({
                                title: '您的网络连接有问题',
                                icon: 'none',
                                duration: 2000
                              })
                            }
                          })
                        } else {
                          wx.showToast({
                            title: res.data.message,
                            icon: 'none',
                            duration: 2000
                          })

                        }

                      },
                      fail: function() {
                        wx.showToast({
                          title: "您的网络有误，请检查",
                          icon: 'none',
                          duration: 2000
                        })
                      },
                    })

                  } else {
                    wx.showToast({
                      title: res.errMsg,
                      icon: 'none',
                      duration: 2000
                    })
                  }
                }
              });


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

      } else {
        // 从再来一单进入

        // 更新订单
        var orderIdAgain = wx.getStorageSync('orderIdAgain')

        request.request('POST', 'soupOrder.updateSoupOrder', {
          params: {
            userid: app.userId,
            orderid: orderIdAgain,
            leixing: that.data.leixing0,
            addressname: that.data.addAddress.username,
            addressphone: that.data.addAddress.telphone,
            address: that.data.addAddress.address,
            addressprovince: that.data.shengfen[0],
            remark: that.data.beizhu
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
              // 登录 获取openid及秘钥
              wx.login({
                success: function(res) {
                  console.log(res)
                  if (res.code) {
                    // 获取openId
                    request.request('POST', 'welite.getOpenid', {
                      params: {
                        "code": res.code
                      },
                      success: function(res) {
                        console.log(res)
                        if (res.data.code == 200) {
                          console.log(res.data.data.openid)
                          console.log(res.data.data.session_id)
                          // 微信支付
                          request.request('POST', 'pay.wxpay', {
                            params: {
                              "paytype": "SOUP",
                              "orderid": orderIdAgain,
                              "openid": res.data.data.openid
                            },
                            success: function(res) {
                              console.log(res.data.data)
                              // 微信支付
                              wx.requestPayment({
                                'appId': res.data.data.appId,
                                'timeStamp': res.data.data.timeStamp,
                                'nonceStr': res.data.data.nonceStr,
                                'package': res.data.data.package,
                                'signType': 'MD5',
                                'paySign': res.data.data.paySign,
                                'success': function(res) {
                                  console.log(res)
                                  wx.showToast({
                                    title: '支付成功',
                                    icon: 'none',
                                    duration: 2000
                                  })
                                },
                                'fail': function(res) {
                                  console.log(res)
                                  wx.showToast({
                                    title: '支付失败',
                                    icon: 'none',
                                    duration: 2000
                                  })
                                },
                                "complete": function() {
                                  // 跳转到我的订单
                                  setTimeout(function() {
                                    wx.navigateTo({
                                      url: '../myOrder/myOrder',
                                    })
                                    that.setData({
                                      xiadan: "下单",
                                      isDefault: true
                                    })
                                  }, 2000)
                                }
                              })
                            },
                            fail: function() {
                              wx.hideLoading()
                              wx.showToast({
                                title: '您的网络连接有问题',
                                icon: 'none',
                                duration: 2000
                              })
                            }
                          })
                        } else {
                          wx.showToast({
                            title: res.data.message,
                            icon: 'none',
                            duration: 2000
                          })

                        }

                      },
                      fail: function() {
                        wx.showToast({
                          title: "您的网络有误，请检查",
                          icon: 'none',
                          duration: 2000
                        })
                      },
                    })

                  } else {
                    wx.showToast({
                      title: res.errMsg,
                      icon: 'none',
                      duration: 2000
                    })
                  }
                }
              });

              // 支付end




            }

          },
          fail: function() {
            wx.showToast({
              title: "您的网络有误，请检查",
              icon: 'none',
              duration: 2000
            })
          },
        })
      }
    }
  },
  nobuy: function() {
    this.setData({
      xiadan: "正在下单...",
      isDefault: false
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

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