var util = require('../../utils/util.js');
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        chuData: [
            {
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
        leixing: [
            { name: 'tang', value: '汤料', checked: 'true' },
            { name: 'mian', value: '面料', },
            { name: 'qita', value: '其他' },
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
    onLoad: function (options) {
        wx.showLoading({
            title: '加载中',
        })
        var chengben = 0;
        var that = this;
        var weight = 0;
        var yuanPrice = 0;
        var jiaPrice = 0;
        var allPrice = 0;
        var zhenghe = [];
        var discount0 = 0
        //   获取对应订单信息
        var that = this;
        wx.request({
            url: app.dataHost,
            data: {
                "ac": "souporderdetail",
                "soup_orderid": options.orderId
            },
            method: "GET",
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (res) {


                // 判断折扣是否有
                if (res.data.data.orderinfo[0].discount == null || res.data.data.orderinfo[0].discount == 0 || res.data.data.orderinfo[0].discount == undefined) {
                   
                    // 换算成零点几
                    discount0 = 1
                    that.setData({
                        shifouzhe: false,
                    })

                } else {
                    res.data.data.orderinfo[0].discount = res.data.data.orderinfo[0].discount
                    // 换算成零点几
                    discount0 = parseFloat(parseFloat(res.data.data.orderinfo[0].discount) * 0.1.toFixed(2))
                    that.setData({
                        shifouzhe: true
                    })
                }
                
                // 判断类型
                if (res.data.data.orderinfo[0].leixing==0){
                    that.setData({
                        tangliaoleixing: "其他",
                    })

                } else if (res.data.data.orderinfo[0].leixing == 1){
                    that.setData({
                        tangliaoleixing: "汤料",
                    })
                } else if (res.data.data.orderinfo[0].leixing == 2){
                    that.setData({
                        tangliaoleixing: "炒面料",
                    })
                }


                that.setData({
                    discount: discount0

                })


                var repeatGoods = [];
                for (var x in res.data.data.goodsinfo) {
                    var msg = {};
                    msg.name = res.data.data.goodsinfo[x].name;
                    msg.Number = res.data.data.goodsinfo[x].buycount;
                    msg.orderid = res.data.data.goodsinfo[x].orderid;
                    msg.Price = res.data.data.goodsinfo[x].price;
                    msg.class = res.data.data.goodsinfo[x].class;
                    repeatGoods.push(msg);
                }
                // var dan = res.data.data.orderinfo[0].danwei;
                var dan = "克";
                if (res.data.data.orderinfo[0].comment !== null) {
                    res.data.data.orderinfo[0].comment = res.data.data.orderinfo[0].comment
                } else {
                    res.data.data.orderinfo[0].comment = "无"
                }
                that.setData({
                    chuData: repeatGoods,
                    danwei: dan,
                    addAddress: {
                        userAdderss: res.data.data.orderinfo[0].address,
                        userName: res.data.data.orderinfo[0].address_name,
                        userPhone: res.data.data.orderinfo[0].address_phone
                    },
                    beizhuliuyan: res.data.data.orderinfo[0].comment,
                    tangliaoName: res.data.data.orderinfo[0].order_name,
                    orderId: options.orderId
                })
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
            fail: function () {
                wx.showToast({
                    title: '您的网络连接有问题',
                    icon: 'none',
                    duration: 2000
                })
            }
        })
    },
    radioChange: function (e) {
    },
    // 再来一单
    buy: function () {
        wx.navigateTo({
            url: '../tlxq/tlxq?orderId=' + this.data.orderId,
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