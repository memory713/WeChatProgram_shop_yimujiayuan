var util = require('../../utils/util.js');
const app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        chuData: [
        ],
        isDefault: true,
        xiadan: "下单",
        leixing: [
            { name: 'tang', value: '汤料', },
            { name: 'mian', value: '炒面料', },
            { name: 'qita', value: '其他' },
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
        discount:0,
        shifouzhe:false
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
 // 缓存 判断数据来源
      
        if (options.orderId){//再来一单
            wx.setStorageSync("shujulaiyuan", 1)
            wx.setStorageSync("orderIdAgain", options.orderId)
            this.setData({
                orderId: options.orderId
            })

        } else if (options.shouye){
            wx.setStorageSync("shujulaiyuan", 2)
        }else{
          
          
        }

        // 获取缓存
        var shujulaiyuan = wx.getStorageSync('shujulaiyuan')


        wx.showLoading({
            title: '加载中',
        })

        var that = this;
       

        // 折扣
        wx.request({
            url: app.dataHost,
            data: {
                "ac": "getsoupdiscount",
            },
            method: "GET",
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (res) {
                var chengben = 0;
                var weight = 0;
                var yuanPrice = 0;
                var jiaPrice = 0;
                var allPrice = 0;
                var zhenghe = [];
                var discount0 = 0
                that.setData({
                    chuanzhizhekou: res.data.data.discount
                })
                // 判断折扣是否有
                if (res.data.data.discount == null || res.data.data.discount == 0 || res.data.data.discount == undefined){
                    
                    // 换算成零点几
                    discount0 = 1
                    that.setData({
                        shifouzhe: false,
                    })

                }else{
                    res.data.data.discount = res.data.data.discount
                    // 换算成零点几
                    discount0 = parseFloat(parseFloat(res.data.data.discount) * 0.1.toFixed(2))
                    that.setData({
                        shifouzhe: true
                    })
                }
               
                that.setData({
                    discount: discount0
                })

                //从首页跳转来的订单信息    
                if (shujulaiyuan==2) {

                   


                    var name233 = wx.getStorageSync('name')
                    var hui = wx.getStorageSync('hui')
                    var dan = wx.getStorageSync('dan')
                    var zongliang = wx.getStorageSync('zongliang')
                    var detailsUn = JSON.parse(hui);
                    that.setData({
                        chuData: detailsUn,
                        danwei: dan,
                        tangliaoName: name233
                    })

                    // 换算
                    util.suanNumber(dan, weight, yuanPrice, jiaPrice, allPrice, detailsUn, zhenghe)
                    var allPrice = zhenghe.jiaPrice + zhenghe.yuanPrice * discount0;
                    zhenghe.yuanPrice = parseFloat(zhenghe.yuanPrice.toFixed(2))
                    allPrice = parseFloat(allPrice.toFixed(2))
                    var youhuihou = zhenghe.yuanPrice - (zhenghe.yuanPrice * discount0).toFixed(2)
                    youhuihou = youhuihou.toFixed(2)

                    that.setData({
                        allPrice0: allPrice,
                        chenben0: zhenghe.yuanPrice,
                        suan: zhenghe.weight + "斤",
                        jiagong: zhenghe.jiaPrice,
                        zhehouPrice: (zhenghe.yuanPrice * discount0).toFixed(2),
                        youhuihou: youhuihou
                    })
                } else if (shujulaiyuan == 1) {//从再来一单跳转的数据
                    var chengben = 0;
                    
                    var weight = 0;
                    var yuanPrice = 0;
                    var jiaPrice = 0;
                    var allPrice = 0;
                    var zhenghe = [];
                    //   获取对应订单信息
                    var orderIdAgain = wx.getStorageSync('orderIdAgain')
                    wx.request({
                        url: app.dataHost,
                        data: {
                            "ac": "souporderdetail",
                            "soup_orderid": orderIdAgain
                        },
                        method: "GET",
                        header: {
                            'content-type': 'application/json' // 默认值
                        },
                        success: function (res) {

                            // var dan = res.data.data.orderinfo[0].danwei;
                            var dan = "克";
                            var repeatGoods = [];

                            for (var x in res.data.data.goodsinfo) {
                                var msg = {};
                                msg.name = res.data.data.goodsinfo[x].name;
                                // 单位换算
                                msg.Number = res.data.data.goodsinfo[x].buycount;
                                msg.orderid = res.data.data.goodsinfo[x].orderid;
                                msg.Price = res.data.data.goodsinfo[x].price;
                                msg.class = res.data.data.goodsinfo[x].class;
                                msg.id = res.data.data.goodsinfo[x].id;
                                repeatGoods.push(msg);
                            }
                            if (res.data.data.orderinfo[0].comment !== null) {
                                res.data.data.orderinfo[0].comment = res.data.data.orderinfo[0].comment
                            } else {
                                res.data.data.orderinfo[0].comment = "无"
                            }
                            that.setData({
                                chuData: repeatGoods,
                                danwei: dan,
                                
                                beizhuliuyan: res.data.data.orderinfo[0].comment,
                                tangliaoName: res.data.data.orderinfo[0].order_name,
                                orderId: orderIdAgain
                            })
                            if (options.newAddress){
                                that.setData({
                                    addAddress: JSON.parse(options.newAddress),
                                })
                                
                            }else{
                                that.setData({
                                    addAddress: {
                                        address: res.data.data.orderinfo[0].address,
                                        username: res.data.data.orderinfo[0].address_name,
                                        telphone: res.data.data.orderinfo[0].address_phone
                                    },
                                })

                            }
                            // 换算
                            util.suanNumber(dan, weight, yuanPrice, jiaPrice, allPrice, repeatGoods, zhenghe)
                            var allPrice = zhenghe.jiaPrice + zhenghe.yuanPrice * discount0;
                            zhenghe.yuanPrice = parseFloat(zhenghe.yuanPrice.toFixed(2))
                            allPrice = parseFloat(allPrice.toFixed(2))
                            var youhuihou = zhenghe.yuanPrice - (zhenghe.yuanPrice * discount0).toFixed(2)
                            youhuihou = youhuihou.toFixed(2)

                            that.setData({
                                allPrice0: allPrice,
                                chenben0: zhenghe.yuanPrice,
                                suan: zhenghe.weight + "斤",
                                jiagong: zhenghe.jiaPrice,
                                zhehouPrice: (zhenghe.yuanPrice * discount0).toFixed(2),
                                youhuihou: youhuihou

                            })
                        },
                        fail: function (res) {
                            wx.showToast({
                                title: '您的网络连接有问题',
                                icon: 'none',
                                duration: 2000
                            })
                        }
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



        // 判断地址来路
        if (options.newAddress) {//如果从地址页面跳转过来
            that.setData({
                addAddress: JSON.parse(options.newAddress),
                dizhishuliang: 1
            })
        } else {
            // 获取地址数据  从首页过来
            wx.request({
                url: app.dataHost,
                data: {
                    "ac": "myaddress",
                    "userId": app.userId//userId默认值1
                },
                method: "GET",
                header: {
                    'content-type': 'application/json' // 默认值
                },
                success: function (res) {
                    if (res.data.code == 200) {
                        var newAddress0 = res.data.data[0]
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
                fail: function (res) {
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
    radioChange: function (e) {
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
    textareaValue: function (e) {
        this.setData({
            beizhu: e.detail.value
        })
    },
    // 点击取消 返回首页
    quxiao: function () {
        wx.reLaunch({
            url: '../index/index',
        })
    },
    // 添加地址点击跳转
    tianjiadizhi: function () {
        wx.navigateTo({
            url: '../myAddress/myAddress',
        })
    },
    // 购买
    buy: function () {

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
            var piddata = this.data.chuData[0].id;
            var ppricedata = this.data.chuData[0].Price;
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
            var pnumdata = this.data.chuData[0].Number * this.data.val;
            for (var i = 1; i < this.data.chuData.length; i++) {
                piddata = piddata + "|" + this.data.chuData[i].id;
                pnumdata = pnumdata + "|" + this.data.chuData[i].Number * this.data.val;
                ppricedata = ppricedata + "|" + this.data.chuData[i].Price;
            }
            // 创建订单1
            wx.request({
                url: app.dataHost,
                data: {
                    "ac": "addsouporder",
                    "userId": app.userId,
                    "val": that.data.val,
                    "danwei": that.data.danwei,
                    "soupname": that.data.tangliaoName,
                    "piddata": piddata,
                    "pnumdata": pnumdata,
                    "ppricedata": ppricedata,
                    "totalprice": that.data.zhehouPrice * 100,
                    "leixing": that.data.leixing0,
                    "comment": that.data.beizhu,
                    "source_platform": "WX_XCX",
                    "discount": that.data.chuanzhizhekou
                },
                method: "GET",
                header: {
                    'content-type': 'application/json' // 默认值
                },
                success: function (res) {
                    that.setData({
                        xiadan: "正在下单...",
                        isDefault: false
                    })


                    wx.showLoading({
                        title: '正在生成订单，请稍后...',
                    })



                    // 设置订单ID
                    that.setData({
                        orderId0: res.data.data.orderid
                    })

                    // 创建订单第二步
                    wx.request({
                        url: app.dataHost,
                        data: {
                            "ac": "souporderaddress",
                            "orderid": res.data.data.orderid,
                            "username": that.data.addAddress.username,
                            "telphone": that.data.addAddress.telphone,
                            "address": that.data.addAddress.address
                        },
                        method: "GET",
                        header: {
                            'content-type': 'application/json' // 默认值
                        },
                        success: function (res) {
                            wx.hideLoading()
                            if ((app.globalData.openid == null) || (app.globalData.openid == undefined)) {
                                // 登录
                                wx.login({
                                    success: res => {
                                        // 发送 res.code 到后台换取 openId, sessionKey, unionId
                                        wx.request({
                                            //获取openid接口 
                                            //   url: 'https://api.weixin.qq.com/sns/jscode2session',
                                            url: app.dataHost,
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
                                                wx.setStorageSync("openid", this.globalData.openid)

                                            }
                                        })
                                    }
                                })

                            }
                            // 调用支付接口
                            // 支付接口
                            // https://api2.emjiayuan.com/wxpay/wxpay.php
                            // openid
                            // orderid
                            // ordertype = SOUP
                            wx.request({
                                url: "https://api2.emjiayuan.com/wxpay/wxpay.php",
                                data: {
                                    "openid": app.globalData.openid,
                                    "orderid": that.data.orderId0,
                                    "ordertype": "soup"
                                },
                                method: "GET",
                                header: {
                                    'content-type': 'application/json' // 默认值
                                },
                                success: function (res) {
                                    // 微信支付
                                    wx.requestPayment({
                                        'appId': res.data.data.appId,
                                        'timeStamp': res.data.data.timeStamp,
                                        'nonceStr': res.data.data.nonceStr,
                                        'package': res.data.data.package,
                                        'signType': 'MD5',
                                        'paySign': res.data.data.paySign,
                                        'success': function (res) {

                                            wx.showToast({
                                                title: '支付成功',
                                                icon: 'none',
                                                duration: 2000
                                            })

                                        },
                                        'fail': function (res) {

                                            wx.showToast({
                                                title: '支付失败',
                                                icon: 'none',
                                                duration: 2000
                                            })

                                        },
                                        "complete": function () {
                                            // 跳转到我的订单
                                            setTimeout(function () {
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
                                fail: function () {
                                    wx.hideLoading()
                                    wx.showToast({
                                        title: '您的网络连接有问题',
                                        icon: 'none',
                                        duration: 2000
                                    })
                                }
                            })



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
                fail: function () {
                    wx.showToast({
                        title: '您的网络连接有问题',
                        icon: 'none',
                        duration: 2000
                    })
                }
            })
        }

    },
    nobuy: function () {
        this.setData({
            xiadan: "正在下单...",
            isDefault: false
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