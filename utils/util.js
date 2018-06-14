// const formatTime = date => {
//   const year = date.getFullYear()
//   const month = date.getMonth() + 1
//   const day = date.getDate()
//   const hour = date.getHours()
//   const minute = date.getMinutes()
//   const second = date.getSeconds()

//   return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
// }

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


/** 
 * 时间戳转化为年 月 日 时 分 秒 
 * number: 传入时间戳 
 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致 
*/
function formatTime(number, format) {

    var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
    var returnArr = [];

    var date = new Date(number * 1000);
    returnArr.push(date.getFullYear());
    returnArr.push(formatNumber(date.getMonth() + 1));
    returnArr.push(formatNumber(date.getDate()));

    returnArr.push(formatNumber(date.getHours()));
    returnArr.push(formatNumber(date.getMinutes()));
    returnArr.push(formatNumber(date.getSeconds()));

    for (var i in returnArr) {
        format = format.replace(formateArr[i], returnArr[i]);
    }
    return format;
}  

// 获取总重量，原材料成本，加工成本

// danwei:单位
//weight:总重量
// yuanPrice:原材料成本
// jiaPrice:加工成本
// allPrice:总价格
// 材料数组:Array[{
//          Number:455
//          Price:5.34
//          name:"桂籽"
//         }]

function suanNumber(danwei, weight, yuanPrice, jiaPrice, allPrice, Array, zhenghe){
    // 循环获取总重量和总价格
    for (var i = 0; i < Array.length; i++){
        // 判断单位并将重量换算成斤后的重量
        if (danwei == "斤") {
            Array[i].Number = Array[i].Number
        } else if (danwei == "两") {
            Array[i].Number = Array[i].Number * 0.1
        } else if (danwei == "千克") {
            Array[i].Number = Array[i].Number * 2
        } else if (danwei == "克") {
            Array[i].Number = Array[i].Number * 0.002
        }
        // toFixed(2)  parseFloat
        weight = parseFloat(weight) + parseFloat(Array[i].Number);
        yuanPrice = parseFloat(yuanPrice) + parseFloat(Array[i].Price) * parseFloat(Array[i].Number) // 原材料成本：换算成斤之后的重量*单价  叠加
    }
    jiaPrice = jiaPrice + weight * 1 // 加工成品：总重量*1  叠加
    allPrice = yuanPrice + jiaPrice
     // 去后两位小数，在化成浮点数
    weight = parseFloat(weight.toFixed(2))
    yuanPrice = parseFloat(yuanPrice.toFixed(2))
    jiaPrice = parseFloat(jiaPrice.toFixed(2))
     zhenghe.yuanPrice = yuanPrice*5
     zhenghe.jiaPrice = jiaPrice
     zhenghe.weight = weight
     
    return zhenghe;
}

module.exports = {
  formatTime: formatTime,
  suanNumber:suanNumber
}


