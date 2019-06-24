// pages/my/my.js
const app = getApp();
const AV = require('../../libs/av-weapp-min.js');
const util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '',
    nickName: '',
    updateLogIcon: 'http://120.78.124.36/wxxcx/c_note/gengxin.png',
    adviceIcon: 'http://120.78.124.36/wxxcx/c_note/yijian.png',
    guanyuIcon: 'http://120.78.124.36/wxxcx/c_note/guanyu.png',
    dayuhaoIcon: 'http://120.78.124.36/wxxcx/c_note/dayuhao.png',
    backgroundImageUrl: 'http://120.78.124.36/wxxcx/c_note/background.jpg',
    totalDays: 0, //总天数
    totalSize: 0, //总字数
    totalPhoto: 0, //总照片
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getNoteInfo();
  },

  getNoteInfo: function () {
    var that = this;
    if (!app.globalData.userId) {
      console.log("no login");
      return;
    }
    var query = new AV.Query("Note");
    query.equalTo("author", app.globalData.userId);
    query.find().then((result) => {
      result = util.formatLeanCloudObject(result);
      var totalDays = result.length;
      var totalSize = 0;
      var totalPhoto = 0;
      result.forEach((item) => {
        totalSize += item.content.replace(/\s+/, '').length;
        totalPhoto += item.fileList.length;
      })
      that.setData({
        totalDays: totalDays,
        totalSize: totalSize,
        totalPhoto: totalPhoto,
        avatarUrl: app.globalData.userInfo.avatarUrl,
        nickName: app.globalData.userInfo.nickName,
      });
    }).catch((err) => {
      console.log(err);
    });
  },

  //切换到建议页面
  switchToAdvicePage: function () {
    wx.navigateTo({
      url: '/pages/advice/advice'
    });
  },

  //切换到更新日志页面
  switchToUpdateLogPage: function () {
    wx.showModal({
      title: '更新公告',
      content: '暂无更新',
      showCancel: false
    });
  },

  //显示项目说明
  showProjectIntroduction: function () {
    wx.showModal({
      title: '关于C日记',
      content: '一个关于日记的小程序 \n' + 
      '有建议可以反馈哦 \n' + 
      '\n\n' + 
      '希望日记能让时光慢些', 
      showCancel: false
    });
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
    this.getNoteInfo();
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