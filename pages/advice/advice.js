// pages/advice/advice.js
const AV = require('../../libs/av-weapp-min.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputContent: '',
  },

  saveAdvice: function () {
    if (!this.data.inputContent) {
      wx.showToast({
        title: '请输入内容哦',
        duration: 500
      });
      return;
    }

    var advice = new AV.Advice();
    advice.set("author", app.globalData.userId);
    advice.set("content", this.data.inputContent);

    wx.showLoading();

    advice.save().then(() => {
      wx.hideLoading();
      wx.showToast({
        title: '提交成功',
        icon: 'success',
        duration: 500
      });

      setTimeout(() => {
        wx.navigateBack({
          url: '/pages/my/my',
        }); 
      }, 500)
      
    }).catch((err) => {
      console.log(err);
      wx.showToast({
        title: '服务器异常',
        icon: 'warn',
        duration: 500
      });
    })
  },

  inputTextarea: function (e) {
    this.setData({
      inputContent: e.detail.value
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  }
})