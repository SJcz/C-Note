//note.js
//获取应用实例
const app = getApp();
const AV = require('../../libs/av-weapp-min.js');
const util = require('../../utils/util.js');

Page({
  data: {
    noteList: [],
    writeNoteIconSrc: 'http://120.78.124.36/wxxcx/c_note/shuxie.png'
  },

  onShow: function () {
    this.getUserNote();
  },

  onLoad: function () {
    var that = this;
    app.userInfoReadyCallback = res => {
      that.getUserNote();
    }
  },

  //获取当前用户的日历列表
  getUserNote: function () {
    var that = this;
    if (!app.globalData.userId) {
      console.log("no login");
      return;
    }
    var query = new AV.Query("Note");
    query.descending('createdAt');
    query.equalTo("author", app.globalData.userId);
    query.find().then((result) => {
      result = util.formatLeanCloudObject(result);
      result.forEach((item) => {
        item.yearMonth = util.formatDate(new Date(item.createdAt));
        item.dayWeek = util.formatDateTwo(new Date(item.createdAt));
        item.hourMinSec = util.formatDateThree(new Date(item.updatedAt)); //获取最终修改时间
        item.content = item.content.length > 100 ? item.content.substr(0, 100) + "......" : item.content; 
        //只显示一部分内容, 不然只能用css 设置
      });
      console.log(result);
      that.setData({
        noteList: result
      });
    }).catch((err) => {
      console.log(err);
    });
  },
  
  //点击写日记图标, 导航到写日记页面
  navigateToWritePage: function () {
    var that = this;
    if (!app.globalData.userId) {
      wx.showToast({
        title: '请先登录',
        duration: 500
      });
      return;
    }

    var query = new AV.Query("Note");
    query.equalTo("author", app.globalData.userId);
    query.greaterThanOrEqualTo("createdAt", new Date(new Date().toLocaleDateString()));
    query.include('fileList'); //这里查询需要带上特殊的指向, 为了连带查询文件的具体信息, 不然只返回文件的objectid
    query.find().then((result) => {
      result = util.formatLeanCloudObject(result);
      result.forEach((item) => {
        item.yearMonth = util.formatDate(new Date(item.createdAt));
        item.dayWeek = util.formatDateTwo(new Date(item.createdAt));
        item.hourMinSec = util.formatDateThree(new Date(item.updatedAt)); //获取最终修改时间
      });
      if (result.length > 0) {
          wx.navigateTo({
            url: '/pages/writeNote/writeNote?note=' + encodeURIComponent(JSON.stringify(result[0])),
          });
      } else {
        wx.navigateTo({
          url: '/pages/writeNote/writeNote?note=null',
        });
      }
    }).catch((err) => {
      console.log(err);
    });
  },

  //点击日记进入日记详细界面
  viewNote: function (e) {
    var that = this;
    var noteid = e.currentTarget.dataset.noteid;
    console.log(noteid);

    var query = new AV.Query("Note");
    query.equalTo("objectId", noteid);
    query.include('fileList'); //这里查询需要带上特殊的指向
    query.find().then((result) => {
      result = util.formatLeanCloudObject(result);
      result.forEach((item) => {
        item.yearMonth = util.formatDate(new Date(item.createdAt));
        item.dayWeek = util.formatDateTwo(new Date(item.createdAt));
        item.hourMinSec = util.formatDateThree(new Date(item.updatedAt)); //获取最终修改时间
      });
      if (result.length > 0) {
          wx.navigateTo({
            url: '/pages/writeNote/writeNote?note=' + encodeURIComponent(JSON.stringify(result[0])),
          });
      }
    }).catch((err) => {
      console.log(err);
    });
  }
})
