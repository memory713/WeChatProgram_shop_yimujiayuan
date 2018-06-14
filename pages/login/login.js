const app = getApp()

Page({
    /**
     * 页面的初始数据
     */
    data: {
        value1: "",
        value2: "",
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.showLoading({
            title: '加载中',
        })
        if(options.center){
            this.setData({
                center: options.center
            })
        } else if (options.index){
            this.setData({
                index: options.index
            })
        }
    },
    //   手机号码
    input1: function (e) {
        this.setData({
            value1: e.detail.value.replace(/\s+/g, '')
        })
    },
    //   密码
    input2: function (e) {
        this.setData({
            value2: e.detail.value
        })
    },
    // 登录
    login: function () {
        var num = this.data.value1;
        var num2 = this.data.value2;
        if (num.length !== 11) {
            wx.showToast({
                title: '请输入11位手机号码',
                icon: 'none',
                duration: 2000
            })
        } else if (num2.length < 6) {
            wx.showToast({
                title: '密码不少于6位',
                icon: 'none',
                duration: 2000
            })
        } else {
            wx.showLoading({
                title: '加载中',
            })
            // 登录
            var that = this;
            wx.request({
                url: app.dataHost,
                data: {
                    "ac": "login",
                    "username": that.data.value1,
                    "password": that.data.value2
                },
                method: "GET",
                header: {
                    'content-type': 'application/json' // 默认值
                },
                success: function (res) {
                    if (res.data.code !== 200) {
                        wx.hideLoading()
                        wx.showToast({
                            title: res.data.message,
                            icon: 'none',
                            duration: 2000
                        })
                    } else {
                        //userId 存储到本地
                        wx.setStorageSync("userId", res.data.data[0].id)
                        var userEMMMM = wx.getStorageSync("userId")
                        app.userId = parseInt(userEMMMM)
                        wx.hideLoading()
                        wx.showToast({
                            title: '登录成功',
                            icon: 'success',
                            duration: 2000
                        })
                        setTimeout(function () {
                            if(that.data.center){
                                // 跳转到个人中心
                                wx.switchTab({
                                    url: '../userCenter/userCenter',
                                })
                            } else if (that.data.index){
                                //跳转到首
                                wx.switchTab({
                                    url: '../index/index',
                                })
                            }else{
                                //跳转到详情页
                                wx.redirectTo({
                                    url: '../tlxq/tlxq',
                                })
                            }
                        }, 2000)
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
        }
    },
    // 注册
    zhuce: function () {
        wx.navigateTo({
            url: '../register/register'
        })
    },
    // 找回密码
    zhaohui: function () {
        wx.navigateTo({
            url: '../findPassword/findPassword'
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