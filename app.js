//app.js
const util = require('./utils/util.js');
const AV = require('./libs/av-weapp-min.js');
AV.init({
  appId: 'xxxxxxxxxxxxxxx',
  appKey: 'xxxxxxxxxxxx',
  serverURLs: 'https://avoscloud.com'
});
AV.Note = AV.Object.extend('Note');
AV.Advice = AV.Object.extend('Advice');

App({
  globalData: {
    userId: null,
    userInfo: null
  },
  onLaunch: function () {
    // 展示本地存储能力
    var that = this;
    var userId = wx.getStorageSync('USERID');
    var userInfo = wx.getStorageSync('USERINFO');

    console.log(userInfo)

    if (userId && userInfo) {
      this.globalData.userId = userId;
      this.globalData.userInfo = userInfo;
      return;
    }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              that.globalData.userInfo = res.userInfo;
              that.globalData.userId = res.userInfo.nickName + "-" + util.uuid();

              //保存用户信息
              wx.setStorageSync('USERID', that.globalData.userId);
              wx.setStorageSync('USERINFO', that.globalData.userInfo);

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res);
              }
            }
          });
        }
      }
    });
  }
})