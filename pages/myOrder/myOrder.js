var util = require('../../utils/util.js');
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        wdld: "我的料单",
        tldz: '汤料定制',
        orderList: [
        ],
        nowtab: '全部',
        Type: 5
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.showLoading({
            title: '加载中',
        })
        var that = this;
        if (options.id) {
            this.setData({
                nowtab: options.id
            })
        }
        // 请求全部订单列表
        wx.request({
            url: app.dataHost,
            data: {
                "ac": "mysouporderlist2",
                "userId": app.userId,
            },
            method: "GET",
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (res) {
                var repeatchenben = [];
                // 加工费剥离
                for (var x in res.data.data) {
                    var msg3 = []
                    for (var y in res.data.data[x].goodsinfo) {
                        msg3.push(res.data.data[x].goodsinfo[y].buycount);
                    }
                    repeatchenben.push(msg3);
                }
                var shuliang = []
                for (var x in repeatchenben){
                    var num9 = 0
                    for (var y in repeatchenben[x]){
                        num9 += parseInt(repeatchenben[x][y])
                    }
                    num9 = num9 / 500
                    shuliang.push(num9);
                }


                var repeatGoods2 = [];
                for (var x in res.data.data) {
                    var msg = {};
                    // 判断状态
                    if (res.data.data[x].orderinfo.ordertype == 1) {
                        msg.status = "待付款"
                    } else if (res.data.data[x].orderinfo.ordertype == 2) {
                        msg.status = "待发货"
                    } else if (res.data.data[x].orderinfo.ordertype == 3) {
                        msg.status = "待收货"
                    } else if (res.data.data[x].orderinfo.ordertype == 4) {
                        msg.status = "已完成"
                    };



                    msg.total1 = res.data.data[x].orderinfo.usemoney;
                    msg.total2 = shuliang[x];
                    msg.total = parseFloat(msg.total1) * 0.01 + parseFloat(msg.total2)
                   
                    msg.total = msg.total.toFixed(2)


                    msg.goodsName = res.data.data[x].orderinfo.order_name;
                    
                    msg.id = res.data.data[x].orderinfo.id;
                    msg.expresscom = res.data.data[x].orderinfo.expresscom;
                    msg.expressno = res.data.data[x].orderinfo.expressno;
                    msg.time = util.formatTime(res.data.data[x].orderinfo.createtime, 'Y/M/D h:m:s');
                    repeatGoods2.push(msg);
                }
                that.setData({
                    orderList: repeatGoods2
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
    },

    // 去支付
    goPay: function (e) {
        var index = e.currentTarget.dataset.id;
        var nummm = this.data.orderList[index].id
        wx.navigateTo({
            url: '../tlxq/tlxq?orderId=' + nummm,
        })
    },
    // 点击再来一单

    again: function (e) {
        var index = e.currentTarget.dataset.top;
        var nummm = this.data.orderList[index].id
        wx.navigateTo({
            url: '../againOrder/againOrder?orderId=' + nummm,
        })
    },
    // 查看物流
    lookWu: function (e) {
        var index = e.currentTarget.dataset.id;
        var wuliu = this.data.orderList[index].expresscom
        var wuliudanhao = this.data.orderList[index].expressno
        wx.navigateTo({
            url: '../lookWuliu/lookWuliu?gs=' + wuliu + "&dh=" + wuliudanhao,
        })
    },

    // tab切换
    switchTabs: function (el) {
        this.setData({
            nowtab: el.currentTarget.dataset.nowtab
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

    },


    // 提醒发货
    tixing: function () {
        wx.showToast({
            title: '提醒成功',
            icon: 'success',
            duration: 2000
        })
    }
})