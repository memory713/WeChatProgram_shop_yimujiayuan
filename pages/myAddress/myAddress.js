const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        addressAll: [

        ],
        numAll: true,
        addressClick: []

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        
        var that = this;
        wx.showLoading({
            title: '加载中',
        })
        // 获取地址数据
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
                if (res.data.code !== 200) {
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
                    var repeatGoods = [];
                    for (var x in res.data.data) {
                        var msg = {};
                        msg.address = res.data.data[x].address;
                        msg.username = res.data.data[x].username;
                        msg.telphone = res.data.data[x].telphone;
                        msg.id = res.data.data[x].id;
                        repeatGoods.push(msg);
                    }
                    that.setData({
                        addressAll: repeatGoods
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
    // 点击跳转添加地址
    tianjia: function (e) {
        wx.navigateTo({
            url: '../addAddress/addAddress',
        })
    },
    // 点击地址返回上一页并更新
    dianji: function (e) {
        var that = this
        var id = e.currentTarget.dataset.id //获取下标
        var JSON0 = that.data.addressAll[id]
        this.setData({
            addressClick: JSON0
        })
        var newAddress = JSON.stringify(JSON0)
       
        wx.redirectTo({
            url: "../tlxq/tlxq?newAddress=" + newAddress
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
var that = this;
        // 获取地址数据
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
                if (res.data.code !== 200) {
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
                    var repeatGoods = [];
                    for (var x in res.data.data) {
                        var msg = {};
                        msg.address = res.data.data[x].address;
                        msg.username = res.data.data[x].username;
                        msg.telphone = res.data.data[x].telphone;
                        msg.id = res.data.data[x].id;
                        repeatGoods.push(msg);
                    }
                    that.setData({
                        addressAll: repeatGoods
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