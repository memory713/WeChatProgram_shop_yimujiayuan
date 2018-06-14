const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        animationData: {},
        userInfo:{
            avatarUrl:"../images/app.png"
            },
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        
        // 获取用户接口
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else if (this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                }
            })
        }
    },

    //   获取用户信息
    getUserInfo: function (e) {
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },
    //   跳转到关于我们
    guanyuwomen: function () {
        wx.navigateTo({
            url: '../aboutUs/aboutUs',
        })
    },
    // 退出登录
    tuichu:function(){
        wx.showModal({
            title: '提示',
            content: '确定退出登录吗？',
            success: function (res) {
                if (res.confirm) {
                    // 清除用户USERid
                    app.userId =null
                    // 跳转到首页
                    wx.reLaunch({
                        url: '../index/index',
                    })
                   
                } else if (res.cancel) {
                   
                }
            }
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        // 判断是否登录
        if (app.userId == null || app.userId == undefined || app.userId == "" || isNaN(app.userId)) {
            // 跳转到登录页面
            wx.redirectTo({
                url: '../login/login?center=center',
            })
        }
        var animation = wx.createAnimation({
            duration: 5000,
            timingFunction: 'linear',
        })
        this.animation = animation
        this.setData({
            animationData: animation.export()
        })
        var n = 1;
        //连续动画需要添加定时器,所传参数每次+1就行
        setInterval(function () {
            // animation.translateY(-60).step()
            if (n == 1) {
                this.animation.translateY(120 * (n)).step()
                this.setData({
                    animationData: this.animation.export()
                })
                n = -1
            } else {
                this.animation.translateY(120 * (n)).step()
                this.setData({
                    animationData: this.animation.export()
                })
                n = 1
            }
        }.bind(this), 5000)
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
    //   点击我的收货地址
    wodedizhi: function () {
        wx.navigateTo({
            url: '../address/address',
        })
    },

    // 点击全部订单
    dingdanClick: function (e) {
        wx.navigateTo({
            url: '../myOrder/myOrder?id=' + (e.currentTarget.dataset.id),
        })
    }
})