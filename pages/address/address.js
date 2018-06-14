const app = getApp()

Page({
    /**
     * 页面的初始数据
     */
    data: {
        morenAddress: {
            userName: "ppap",
            userAdderss: "宁波市镇海区XXXXXXX",
            userPhone: "13958243103",
        },
        addressAll: [],
        numAll: true,
        addressClick: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.showLoading({
            title: '加载中',
        })
        // 获取地址列表
        var that = this;
        wx.request({
            url: app.dataHost,
            data: {
                "ac": "myaddress",
                "userId": app.userId,
            },
            method: "GET",
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (res) {
                wx.hideLoading()
                // var that = this;
                    if (res.data.code !== 200){
                        that.setData({ numAll:true});
                    }else{
                        that.setData({ numAll:false });
                    }
                    var addressAll0 = [];
                    for (var x in res.data.data) {
                        var msg = {};
                        msg.userName = res.data.data[x].username;
                        msg.userAdderss = res.data.data[x].address;
                        msg.userPhone = res.data.data[x].telphone;
                        msg.id = res.data.data[x].id;//地址ID
                        addressAll0.push(msg);
                    }
                    that.setData({
                        addressAll: addressAll0
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
    // 点击跳转添加地址
    tianjia: function () {
        wx.navigateTo({
            url: '../addAddress/addAddress',
        })
    },
    //   点击设为默认
    dianji: function (e) {
        // var panduan = false
        var that = this
        var index = e.currentTarget.dataset.index //获取下标
        var Aid = that.data.addressAll[index].id
        wx.showModal({
            title: '提示',
            content: '确定删除该地址吗？',
            success: function (res) {
                if (res.confirm) {
                    // 删除地址
                    wx.request({
                        url: app.dataHost,
                        data: {
                            "ac": "deladdress",
                            "id": Aid
                        },
                        method: "GET",
                        header: {
                            'content-type': 'application/json' // 默认值
                        },
                        success: function (res) {
                            wx.hideLoading()
                                wx.showToast({
                                    title: res.data.message,
                                    icon: 'success',
                                    duration: 2000
                                })
                                that.onLoad();
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
        this.onLoad();
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