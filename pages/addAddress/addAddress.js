const app = getApp()

// directory.js
var address = require('../../utils/city.js')
var animation
Page({

    /**
     * 页面的初始数据
     * 当前    provinces:所有省份
     * citys选择省对应的所有市,
     * areas选择市对应的所有区
     * provinces：当前被选中的省
     * city当前被选中的市
     * areas当前被选中的区
     */
    data: {
        nameValue: null,
        phoneValue: null,
        detailsValue: null,
        isVisible: false,
        animationData: {},
        animationAddressMenu: {},
        addressMenuIsShow: false,
        value: [0, 0, 0],
        provinces: [],
        citys: [],
        areas: [],
        province: '',
        city: '',
        area: '',
        fang0: null,
        areaInfo: "请选择所在城市"
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (options.fang) {
            this.setData({
                fang0: options.fang
            })
        }

        // 初始化动画变量
        var animation = wx.createAnimation({
            duration: 500,
            transformOrigin: "50% 50%",
            timingFunction: 'ease',
        })
        this.animation = animation;
        // 默认联动显示北京
        var id = address.provinces[0].id
        this.setData({
            provinces: address.provinces,
            citys: address.citys[id],
            areas: address.areas[address.citys[id][0].id],
        })
    },

    // 执行动画
    startAnimation: function (isShow, offset) {
        var that = this
        var offsetTem
        if (offset == 0) {
            offsetTem = offset
        } else {
            offsetTem = offset + 'rpx'
        }
        this.animation.translateY(offset).step()
        this.setData({
            animationData: this.animation.export(),
            isVisible: isShow
        })
    },


    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

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
    // 点击所在地区弹出选择框
    selectDistrict: function (e) {
        var that = this
        if (that.data.addressMenuIsShow) {
            return
        }
        that.startAddressAnimation(true)
    },
    // 执行动画
    startAddressAnimation: function (isShow) {
        var that = this
        if (isShow) {
            that.animation.translateY(0 + 'vh').step()
        } else {
            that.animation.translateY(40 + 'vh').step()
        }
        that.setData({
            animationAddressMenu: that.animation.export(),
            addressMenuIsShow: isShow,
        })
    },
    // 点击地区选择取消按钮
    cityCancel: function (e) {
        this.startAddressAnimation(false)
    },
    // 点击地区选择确定按钮
    citySure: function (e) {
        var that = this
        var city = that.data.city
        var value = that.data.value

        var areaInfo = ""
        that.startAddressAnimation(false)
        // 将选择的城市信息显示到输入框
        // 判断是否有第三级联动
        if (that.data.areas[value[2]] == undefined || that.data.areas[value[2]]== null) {
            areaInfo = that.data.provinces[value[0]].name + ',' + that.data.citys[value[1]].name 
        } else {
           
            areaInfo = that.data.provinces[value[0]].name + ',' + that.data.citys[value[1]].name + ',' + that.data.areas[value[2]].name
        }

        that.setData({
            areaInfo: areaInfo,
        })
    },
    hideCitySelected: function (e) {
        this.startAddressAnimation(false)
    },
    // 处理省市县联动逻辑
    cityChange: function (e) {
        var value = e.detail.value
        var provinces = this.data.provinces
        var citys = this.data.citys
        var areas = this.data.areas
        var provinceNum = value[0]
        var cityNum = value[1]
        var countyNum = value[2]
        if (this.data.value[0] != provinceNum) {
            var id = provinces[provinceNum].id
            this.setData({
                value: [provinceNum, 0, 0],
                citys: address.citys[id],
                areas: address.areas[address.citys[id][0].id],
            })
        } else if (this.data.value[1] != cityNum) {
            var id = citys[cityNum].id
            this.setData({
                value: [provinceNum, cityNum, 0],
                areas: address.areas[citys[cityNum].id],
            })
        } else {
            this.setData({
                value: [provinceNum, cityNum, countyNum]
            })
        }
    },
    // 第一个INPUT失去焦点时
    currentName: function (e) {
        var value1 = e.detail.value
        this.setData({
            nameValue: value1.replace(/\s+/g, ''),
        })
    },
    // 第2个INPUT失去焦点时
    currentPhone: function (e) {
        var value2 = e.detail.value
        this.setData({
            phoneValue: value2.replace(/\s+/g, ''),
        })
    },
    // 第3个INPUT失去焦点时
    currentAddressDetails: function (e) {
        var value3 = e.detail.value
        this.setData({
            detailsValue: value3.replace(/\s+/g, ''),
        })
    },
    // 点击添加按钮
    addButton: function () {
        var that = this;
        var num0 = this.data.areaInfo;
        var num1 = this.data.nameValue;
        var num2 = this.data.phoneValue;
        var num3 = this.data.detailsValue;
        var num4 = num0 + " " + num3;
        if ((num1 == "") || (num1 == null) || (num1 == undefined)) {
            wx.showToast({
                title: '请输入姓名',
                icon: 'none',
                duration: 2000
            })
        } else if ((num2 == "") || (num2 == null) || (num2 == undefined) || (num2.length !== 11)) {
            wx.showToast({
                title: '请输入11位电话号码',
                icon: 'none',
                duration: 2000
            })
        } else if ((num0 == "") || (num0 == null) || (num0 == undefined) || (num0 == "请选择所在城市")) {
            wx.showToast({
                title: '请选择所在省份',
                icon: 'none',
                duration: 2000
            })
        } else if ((num3 == "") || (num3 == null) || (num3 == undefined)) {
            wx.showToast({
                title: '请输入详细地址',
                icon: 'none',
                duration: 2000
            })
        } else {
            wx.showLoading({
                title: '加载中',
            })
            // 添加地址
            wx.request({
                url: app.dataHost,
                data: {
                    "ac": "addaddress",
                    "userId": app.userId,
                    "username": num1,//收货人
                    "telphone": num2,//电话
                    "address": num4,//地址详情
                    "shengfen": num0 //	省份
                },
                method: "GET",
                header: {
                    'content-type': 'application/json' // 默认值
                },
                success: function (res) {
                    wx.hideLoading()
                    wx.showToast({
                        title: '成功',
                        icon: 'success',
                        duration: 2000
                    })
                    setTimeout(function () {
                        wx.navigateBack()
                    }, 2000)
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