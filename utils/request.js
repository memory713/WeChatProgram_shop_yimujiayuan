
var _md5 = require('md5.js')

var _conf = {
  'api': 'https://emapi.emjiayuan.com/api.php',
  'key': '81faee75bd269f0010b94bf54cd44345',
}

function request(action, method, requestHandler) {
    var timestamp = Date.parse(new Date())
    timestamp = timestamp / 1000
    var headers = {
        'method': method,
        'platform': 'WX_XCX',
        'time': timestamp
    };

    var sign = '';
    for (var k in headers) {
        if (sign == '') {
            sign += k + '=' + headers[k]
        } else {
            sign += '&' + k + '=' + headers[k]
        }
    }
    // console.log(sign + _conf.key)
    headers['Content-Type'] = 'application/json'
    headers['sign'] = _md5.hexMD5(sign + _conf.key)
    wx.request({
        url: _conf.api,
        data: requestHandler.params,
        // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        method: action,
        header: headers,
        success: function (res) {
            requestHandler.success(res)
        },
        fail: function () {
            requestHandler.fail()
        },
        complete: function () {
            //requestHandler.complete()
        }
    })
}

module.exports = {
    request: request
}