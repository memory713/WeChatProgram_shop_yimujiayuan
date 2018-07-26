//index.js
var request = require('../../utils/request.js');
var util = require('../../utils/util.js');
//获取应用实例
const app = getApp();
Page({
  data: {
    movies: [],
    tangliaojiaodian: false,
    tldz: '汤料定制',
    wdld: "我的料单",
    color1: "#5D1402",
    color2: "#fff",
    fff1: '#fff',
    fff2: "#5D1402",
    tlmc: "料包名称",
    show1: true,
    show2: false,
    sureName: "确定",
    bottomIf: false,
    orderDetails: [],
    disabledSure: false,
    inputValue: "",
    inputColor1: "#000",
    danwei: [{
      name: 'jin',
      value: '斤',
      checked: 'true'
    }, {
      name: 'liang',
      value: '两',
    }, {
      name: 'kg',
      value: '千克'
    }, {
      name: 'g',
      value: '克'
    }, ],
    danwei2: "斤",
    leiNumber: 0,
    weightNumber: 0,
    tijiaoArr: [],
    noOrder: false,
    inputFalse: 30,

  },
  // 视频播放
  onLoad: function() {
    var lujin = "../images/bumai.png"
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    // 轮播图片加载
    request.request('POST', 'welite.getSoupBannerList', {
      params: {},
      success: function(res) {
        console.log(res)
        var lunboimages = [];
        for (var x in res.data.data) {
          var msg = {};
          msg.url = res.data.data[x].image;
          lunboimages.push(msg);
        }
        that.setData({
          movies: lunboimages,
        })
        wx.hideLoading()
      },
      fail: function(res) {
        wx.hideLoading()
        wx.showToast({
          title: '您的网络连接有问题',
          icon: 'none',
          duration: 2000
        })
      }
    })
    // 请求材料数据
    wx.showLoading({
      title: '加载中',
    })
    request.request('POST', 'soupProduct.getSoupProductList', {
      params: {},
      success: function(res) {
        console.log(res)
        var repeatGoods = [];
        for (var x in res.data.data) {
          var msg = {};
          msg.repeatName = res.data.data[x].name;
          msg.repeatImage = res.data.data[x].images;
          msg.id = res.data.data[x].id;
          msg.price = res.data.data[x].price;
          msg.delflag = res.data.data[x].delflag;
          msg.xuan = "../images/bumai.png";
          repeatGoods.push(msg);
        }
        that.setData({
          repeatGoods: repeatGoods,
        })
        wx.hideLoading()
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
  },
  // 汤料名称确定判断
  nameSure: function(e) {
    // 名称输入框失去焦点
    this.setData({
      tangliaojiaodian: false
    })
    var isShow = this.data.sureName;
    var inputValueAdd = this.data.inputValue;
    if (isShow == "确定") {
      if ((inputValueAdd.replace(/\s+/g, '').length !== 0) && (inputValueAdd !== "请输入汤料名称")) {
        this.setData({
          sureName: "修改",
          disabledSure: true,
          inputColor1: "#C8C8C8",
        })
      } else {
        wx.showToast({
          title: '请输入名称',
          icon: 'none',
          duration: 2000
        })
      }
    } else {
      this.setData({
        sureName: "确定",
        disabledSure: false,
        inputColor1: "#000",
      })
    }
  },
  //   汤料名称输入框失去焦点事件
  bindInputBlur: function(e) {
    this.setData({
      inputValue: e.detail.value.replace(/\s+/g, '')
    })
  },
  // 改变计量单位
  radioChange: function(e) {
    var that = this
    // 确认输入框失去焦点
    if (this.data.inputFalse == 30) {
      console.log(e.detail.value)
      this.computed(e.detail.value, this.data.danwei2)
      // 计算总量
      var weightNumber1 = 0
      for (var x in this.data.tijiaoArr) {
        weightNumber1 += this.data.tijiaoArr[x].Number
      }
      //将字符串转化为浮点数
      weightNumber1 = weightNumber1.toFixed(2) //字符串
      weightNumber1 = parseFloat(weightNumber1)
      this.setData({
        bottomIf: true,
        weightNumber: weightNumber1
      });
    } else {
      // 输入框还没有失去焦点
      setTimeout(function() {
        that.radioChange(e)
      }, 100)
    }
  },
  // 单位换算计算封装 1.数量框变化 2.拼合的最终数组变化
  computed: function(a, b) {
    var aName = "";
    var c, d, e, f;
    if (a == "kg") {
      aName = "千克"
      c = 0.5
      d = 1
      e = 0.001
      f = 0.05
    } else if (a == "liang") {
      aName = "两"
      c = 10
      d = 20
      e = 0.02
      f = 1
    } else if (a == "g") {
      aName = "克"
      c = 500
      d = 1000
      e = 1
      f = 50
    } else if (a == "jin") {
      aName = "斤"
      c = 1
      d = 2
      e = 0.002
      f = 0.1
    }
    if (b == "斤") {
      for (var x in this.data.repeatGoods) {
        this.data.repeatGoods[x].NumberInputValue = this.data.repeatGoods[x].NumberInputValue * c
        this.data.repeatGoods[x].NumberInputValue = (this.data.repeatGoods[x].NumberInputValue).toFixed(2)
        this.data.repeatGoods[x].NumberInputValue = parseFloat(this.data.repeatGoods[x].NumberInputValue)
      }
      for (var x in this.data.tijiaoArr) {
        this.data.tijiaoArr[x].Number = this.data.tijiaoArr[x].Number * c
      }
    } else if (b == "千克") {
      for (var x in this.data.repeatGoods) {
        this.data.repeatGoods[x].NumberInputValue = this.data.repeatGoods[x].NumberInputValue * d
        this.data.repeatGoods[x].NumberInputValue = (this.data.repeatGoods[x].NumberInputValue).toFixed(2)
        this.data.repeatGoods[x].NumberInputValue = parseFloat(this.data.repeatGoods[x].NumberInputValue)
      }
      for (var x in this.data.tijiaoArr) {
        this.data.tijiaoArr[x].Number = this.data.tijiaoArr[x].Number * d
      }
    } else if (b == "克") {
      for (var x in this.data.repeatGoods) {
        this.data.repeatGoods[x].NumberInputValue = this.data.repeatGoods[x].NumberInputValue * e
        this.data.repeatGoods[x].NumberInputValue = (this.data.repeatGoods[x].NumberInputValue).toFixed(2)
        this.data.repeatGoods[x].NumberInputValue = parseFloat(this.data.repeatGoods[x].NumberInputValue)
      }
      for (var x in this.data.tijiaoArr) {
        this.data.tijiaoArr[x].Number = this.data.tijiaoArr[x].Number * e
      }
    } else if (this.data.danwei2 == "两") {
      for (var x in this.data.repeatGoods) {
        this.data.repeatGoods[x].NumberInputValue = this.data.repeatGoods[x].NumberInputValue * f
        this.data.repeatGoods[x].NumberInputValue = (this.data.repeatGoods[x].NumberInputValue).toFixed(2)
        this.data.repeatGoods[x].NumberInputValue = parseFloat(this.data.repeatGoods[x].NumberInputValue)
      }
      for (var x in this.data.tijiaoArr) {
        this.data.tijiaoArr[x].Number = this.data.tijiaoArr[x].Number * f
      }
    }


    this.setData({
      danwei2: aName,
      repeatGoods: this.data.repeatGoods
    })

  },

  // 数量输入框得到焦点
  huodejiaodian: function() {
    this.setData({
      inputFalse: 20 //输入框得到焦点
    })
  },
  // 数量输入框失去焦点
  bindFocusNumber: function(e) {
    var detailValue = parseFloat(e.detail.value);
    var num0 = e.currentTarget.dataset.input;
    if (isNaN(detailValue)) {
      detailValue = 0;
    }
    this.data.repeatGoods[num0].NumberInputValue = detailValue;
    this.setData({
      repeatGoods: this.data.repeatGoods,
      inputFalse: 30 //输入框失去焦点
    })
  },
  // 点击选择图标
  ChooseIcon: function(e) {
    var arr1 = [];
    var num1 = e.currentTarget.id;
    var leiNumber0 = this.data.leiNumber;
    var weightNumber0 = this.data.repeatGoods[num1].NumberInputValue;
    var priceNumber = parseFloat(this.data.repeatGoods[num1].price);
    var id = parseFloat(this.data.repeatGoods[num1].id);
    var name3;
    var that = this
    if (this.data.inputFalse == 30) { // 确认输入框失去焦点
      if ((weightNumber0 == null) || (weightNumber0 == "") || (weightNumber0 == undefined) || isNaN(weightNumber0)) {
        wx.showToast({
          title: '请输入数量',
          icon: 'none',
          duration: 2000
        })
      } else if (weightNumber0 == 0) {
        wx.showToast({
          title: '数量不能为0',
          icon: 'none',
          duration: 2000
        })
      } else {
        if (this.data.repeatGoods[num1].xuan == "../images/mai.png") {
          this.data.repeatGoods[num1].xuan = "../images/bumai.png";
          this.data.repeatGoods[num1].disabledInput = false;
          leiNumber0--;
          name3 = this.data.repeatGoods[num1].repeatName;
          arr1 = {
            name: name3,
            Number: weightNumber0,
            Price: priceNumber,
            id: id
          }
          for (var index in this.data.tijiaoArr) {
            if (this.data.tijiaoArr[index].name == name3) {
              this.data.tijiaoArr.splice(index, 1)
            }
          }
        } else {
          this.data.repeatGoods[num1].xuan = "../images/mai.png";
          this.data.repeatGoods[num1].disabledInput = true;
          leiNumber0++;
          name3 = this.data.repeatGoods[num1].repeatName;
          arr1 = {
            name: name3,
            Number: weightNumber0,
            Price: priceNumber,
            id: id
          }
          this.data.tijiaoArr.push(arr1);
        }
        // 计算总量
        var weightNumber1 = 0
        for (var x in this.data.tijiaoArr) {
          weightNumber1 += this.data.tijiaoArr[x].Number
        }
        //将字符串转化为浮点数
        weightNumber1 = weightNumber1.toFixed(2) //字符串
        weightNumber1 = parseFloat(weightNumber1)
        this.setData({
          bottomIf: true,
          repeatGoods: this.data.repeatGoods,
          leiNumber: leiNumber0,
          weightNumber: weightNumber1
        });
      }
    } else {
      // 输入框还没有失去焦点
      setTimeout(function() {
        that.ChooseIcon(e)
      }, 100)
    }
  },
  // 点击我的料单
  wdldClick: function() {
    wx.showLoading({
      title: '加载中',
    })
    // 判断是否登录
    if (app.userId == null || app.userId == undefined || app.userId == "" || isNaN(app.userId)) {
      // 跳转到登录页面
      wx.redirectTo({
        url: '../login/login?index=index',
      })
    }
    this.setData({
      show2: true,
      show1: false,
      color1: "#fff",
      color2: "#5D1402",
      fff1: '#5D1402',
      fff2: "#fff",
    })
    this.requestOrder(1)


  },
  // 请求订单列表
  requestOrder: function(page) {
    var that = this;
    request.request('POST', 'soupOrder.getSoupOrderList', {
      params: {
        "userid": app.userId,
        "pageindex": page,
        "pagesize": 20,
        "compute": "GT",
        "type": 2
      },
      success: function(res) {
        console.log(res)
        if (res.data.code !== 200) {
          // 判断料单数量并作出相应显示
          that.setData({
            number0: true,
            numberX: false
          })
        } else {
          // 判断料单数量并作出相应显示
          that.setData({
            number0: false,
            numberX: true
          })
          var repeatGoods2 = [];
          for (var x in res.data.data) {
            var msg = {};
            msg.ddh = res.data.data[x].order_no;
            msg.tlb = res.data.data[x].order_name;
            msg.time = util.formatTime(res.data.data[x].createtime, 'Y/M/D h:m:s');
            msg.orderId = res.data.data[x].id;
            repeatGoods2.push(msg);
          }

          if (page == 1) {
            that.setData({
              orderDetails: repeatGoods2
            })
          } else {
            that.setData({
              orderDetails: that.data.orderDetails.concat(repeatGoods2)
            })
          }
          wx.hideLoading()


          // 重加载
          if (res.data.data.length == 20) {
            page++
            that.requestOrder(page)
          }
        }
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

  },
  // 上拉加载
  searchScrollLower: function() {
    console.log("加载")

  },

  // 点击汤料定制
  tldzClick: function() {
    this.setData({
      show2: false,
      show1: true,
      color1: "#5D1402",
      color2: "#fff",
      fff1: '#fff',
      fff2: "#5D1402",
    })

  },
  //点击跳转已完成订单的详情页
  myorder: function(e) {
    // 获取当前料单的index
    var indexA = e.currentTarget.dataset.index
    // 获取当前订单的订单ID
    var orderIdd = this.data.orderDetails[indexA].orderId
    // 微信跳转方法navigateTo 要跳转的页面不能是LIST里的页面
    wx.navigateTo({
      url: '../againOrder/againOrder?orderId=' + orderIdd,
    })
  },
  // 点击跳转汤料清单页面
  tijiao: function() {
    var huansuanNumber = (this.data.weightNumber).toFixed(2)
    huansuanNumber = parseFloat(huansuanNumber);
    var danwei4 = this.data.danwei2; //单位
    var liaoName = this.data.inputValue
    // 单位传值
    var val;
    if (danwei4 == "斤") {
      huansuanNumber = huansuanNumber * 0.5;
      val=500
    } else if (danwei4 == "千克") {
      huansuanNumber = huansuanNumber;
      val = 1000
    } else if (danwei4 == "克") {
      huansuanNumber = huansuanNumber * 0.001;
      val = 1
    } else if (danwei4 == "两") {
      huansuanNumber = huansuanNumber * 0.05;
      val = 50
    }
    if ((this.data.inputValue).length == 0) {
      wx.showToast({
        title: '请输入名称',
        icon: 'none',
        duration: 2000
      })
      this.setData({
        tangliaojiaodian: true
      })
    } else if (huansuanNumber < 2.5) {
      wx.showToast({
        title: '总重量不少于2.5千克',
        icon: 'none',
        duration: 2000
      })
    } else {
      // 凑成productids
      var productids = ""
      for (var x in this.data.tijiaoArr) {
        productids = productids + this.data.tijiaoArr[x].id + "|" + this.data.tijiaoArr[x].Number + ","
      }
      productids = productids.substr(0, productids.length - 1);

      var that = this
      // 存储缓存
      var tijiaoArr2 = []
      var msg = {}
      msg.userId = app.userId
      msg.val = val
      msg.soupname = that.data.inputValue
      msg.productids = productids
      tijiaoArr2.push(msg)
      tijiaoArr2 = JSON.stringify(tijiaoArr2);
      wx.setStorageSync("tijiaoArr2", tijiaoArr2)
      console.log(tijiaoArr2)

      // 判断是否登录
      if (app.userId == null || app.userId == undefined || app.userId == "" || isNaN(app.userId)) {
        // 跳转到登录页面
        wx.redirectTo({
          url: '../login/login?index2=index2',
        })
      } else {
        wx.navigateTo({
          url: '../tlxq/tlxq?shouye=shou',
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
   
  },
 
  // 图片预览
  lookImages: function(e) {
    var List = []
    var List0 = e.currentTarget.dataset.src;
    List[0] = e.currentTarget.dataset.list;
    //图片预览
    wx.previewImage({
      current: List0, // 当前显示图片的http链接
      urls: List // 需要预览的图片http链接列表
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

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
    var that = this

    setTimeout(function() {
      // 清除所有数据
      that.setData({
        tijiaoArr: [],
        weightNumber: 0,
        inputValue: "",
        leiNumber: 0,
        sureName: "确定",
        disabledSure: false,
        bottomIf: false
      })
      // 清空缓存
      var detailsU = JSON.stringify(that.data.tijiaoArr);

      wx.setStorageSync("hui", detailsU)
      wx.setStorageSync("dan", that.data.danwei2)
      wx.setStorageSync("zongliang", null)
      wx.setStorageSync("name", null)

      that.onLoad()



    }, 500)
    setTimeout(function() {
      wx.stopPullDownRefresh()
    }, 1000)



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