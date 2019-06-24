const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const uuid = () => {
  var s = [];
  var hexDigits = "0123456789abcdef";
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[8] = s[13] = s[18] = s[23] = "-";
  return s.join('');
}

module.exports = {
  formatTime: formatTime,
  uuid: uuid,
  formatDate: function (date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = month < 10 ? "0" + month : month;
    return year + "." + month;
  },
  formatDateTwo: function (date) {
    var day = date.getDate();
    var weekday = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
    var week = weekday[date.getDay()];
    return day + " " + week;
  },
  formatDateThree: function (date) {
    var hour = date.getHours();       // 获取当前小时数(0-23)
    var min = date.getMinutes() ;     // 获取当前分钟数(0-59)
    var sec = date.getSeconds(); 

    hour = hour < 10 ? '0' + hour : hour;
    min = min < 10 ? '0' + min : min;
    sec = sec < 10 ? '0' + sec : sec;
    return hour + ":" + min + ":" + sec;
  },
  //因为直接用arr.forEach替换item无效, 别问我为什么, 我TM也不知道啊， 草
  formatLeanCloudObject: function (arr) {
    var returnArr = [];
    arr.forEach((item) => {
      returnArr.push(item.toJSON());
    });
    return returnArr;
  }
}