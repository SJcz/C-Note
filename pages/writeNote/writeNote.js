// pages/index/writeNote/writeNote.js
const app = getApp();
const AV = require('../../libs/av-weapp-min.js');
const util = require('../../utils/util.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    whetherUrl: 'https://free-api.heweather.net/s6/weather/now',
    whetherUrlKey: 'xxxxxxxxxxxxxxxx',
    location: '', //当前位置
    whether: '', //当前天气
    currentDate: null,
    inputContent: '', //textarea内容
    currentNote: null, //当前日记对象, 因为是序列化传过来的,所以有些属性有变化, 可以直接获取， 比如id变为objectid
    isTodayNote: false, //如果是今天的日记, 那就可以修改, 否则不能
    styleIndexArr: [0, 1, 2, 3, 4],
    styleIndex: 0,
    backgroundColorArr: ['#fff', '#dff0d8', '#d9edf7', '#fcf8e3', '#f2dede'],
    fontColorArr: ['#000', '#3c763d', '#31708f', '#8a6d3b', '#a94442'],
    choosedImageList: [], //选择的本机照片路径列表
    maxUploadImageCount: 6, //最大照片上传数量
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var date = new Date(); //如果是新的日记, 用来计算日期的
    console.log(options);
    var note = JSON.parse(decodeURIComponent(options.note));

    if (note) {
      //这里不是日期比较 而是字符串比较， 因为createDate在这里已经是字符串了
      //并且要是ISO时间
      //判断是否是今天的日记, 如果是，那就可以修改内容
      var index = note.styleIndex ? note.styleIndex : 0;
      if (note.createdAt > new Date(new Date().toLocaleDateString()).toISOString()) {
        this.setData({
          location: note.location ? note.location : '',
          whether: note.whether ? note.whether : '',
          inputContent: note.content,
          currentNote: note,
          currentDate: note.yearMonth + " " + note.dayWeek + " " + note.hourMinSec,
          isTodayNote: true,
          styleIndex: index,
          backgroundColor: this.data.backgroundColorArr[index],
          fontColor: this.data.fontColorArr[index]
        });
      } else {
        this.setData({
          location: note.location ? note.location : '',
          whether: note.whether ? note.whether : '',
          inputContent: note.content,
          currentNote: note,
          currentDate: note.yearMonth + " " + note.dayWeek + " " + note.hourMinSec,
          isTodayNote: false,
          styleIndex: index,
          backgroundColor: this.data.backgroundColorArr[index],
          fontColor: this.data.fontColorArr[index]
        });
      }
    } else {
      this.getLocationAndWhether();
      this.setData({
        location: this.data.location,
        inputContent: '',
        currentNote: null,
        currentDate: util.formatDate(date) + '  ' + util.formatDateTwo(date) + "  " + util.formatDateThree(date),
        isTodayNote: true,
        styleIndex: 0,
        backgroundColor: this.data.backgroundColorArr[0],
        fontColor: this.data.fontColorArr[0]
      });
    }
  },

  //获取位置和天气
  getLocationAndWhether: function () {
    var that = this;
    return new Promise(function (resolve, reject) {
      wx.getLocation({
        type: 'gcj02',
        success(res) {
          let latitude = res.latitude
          let longitude = res.longitude
          console.log(longitude, latitude);
          resolve([longitude, latitude]);
        }
      });
    }).then((res) => {
      return that.getNowWhether(res[0], res[1]);
    }).then((res) => {
      that.setData({
        location: res[0],
        whether: res[1],
      });
    }).catch((err) => {
      console.log(err);
    })
    
  },

  //获取实时天气状况
  getNowWhether: function (longitude, latitude) {
    var that = this;
    return new Promise(function (resolve, reject) {
      wx.request({
        url: that.data.whetherUrl, //
        data: {
          key: that.data.whetherUrlKey,
          location: longitude + ',' + latitude
        },
        method: 'Get',
        success(res) {
          console.log(res.statusCode);
          console.log(res.data);
          if (res.data.HeWeather6 && res.data.HeWeather6.length > 0) {
            var location = res.data.HeWeather6[0].basic.location;
            var parent_city = res.data.HeWeather6[0].basic.parent_city;
            var admin_area = res.data.HeWeather6[0].basic.admin_area;
            var cond_txt = res.data.HeWeather6[0].now.cond_txt;
            var tmp = res.data.HeWeather6[0].now.tmp;
            resolve([parent_city == location ? location : parent_city + location, cond_txt + " " + tmp + "°C"]);
          }
        },
        fail(err) {
          console.log(err);
          reject('fail');
        }
      })
    });
  },

  //输入框值改变事件
  inputTextarea: function (e) {
    var that = this;
    that.setData({
      inputContent: e.detail.value
    });
  },

  //改变样式
  changeNoteStyle: function (e) {
    console.log(e);
    var index = e.currentTarget.dataset.index;

    this.setData({
      styleIndex: index,
      backgroundColor: this.data.backgroundColorArr[index],
      fontColor: this.data.fontColorArr[index]
    });
  },

  ////点击清除图标
  clearContent: function () {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确认要清空所有内容么？',
      success: (res) => {
        if (!res.confirm) {
          return;
        }
        that.setData({
          inputContent: '',
          choosedImageList: [] //本地照片清空
        });
      }
    })

  },

  //点击保存日记图标
  saveNote: function () {
    var that = this;
    if (!app.globalData.userId) {
      wx.showToast({
        title: '请先登录',
        duration: 500
      });
      return;
    }

    if (!that.data.inputContent) {
      wx.showToast({
        title: '请输入内容',
        duration: 500
      });
      return;
    }
    var note = null;
    console.log(that.data.currentNote);

    if (that.data.currentNote) {
      note = AV.Object.createWithoutData('Note', this.data.currentNote.objectId);
      note.set("content", this.data.inputContent);
      note.set("styleIndex", this.data.styleIndex);
    } else {
      note = new AV.Note();
      note.set("author", app.globalData.userId);
      note.set("authorName", app.globalData.userInfo.nickName);
      note.set("location", this.data.location);
      note.set("whether", this.data.whether);
      note.set("content", this.data.inputContent);
      note.set("styleIndex", this.data.styleIndex);

      var fileList = [];
      for (var i = 0; i < that.data.choosedImageList.length; i++) {
        fileList.push(new AV.File('upload.png', {
          blob: {
            uri: that.data.choosedImageList[i]
          }
        }));
      }
      note.set("fileList", fileList);
    }

    wx.showLoading();

    note.save().then((result) => {
      wx.hideLoading();
      console.log('success');
      console.log(result);
      wx.showToast({
        title: '发布成功',
        icon: 'success',
        duration: 500
      });
      setTimeout(() => {
        wx.navigateBack({
          url: '/pages/note/note',
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

  //选择本机照片
  chooseImage: function () {
    var that = this;
    wx.chooseImage({
      count: that.data.maxUploadImageCount, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: res => {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        console.log(res);
        that.setData({
          choosedImageList: tempFilePaths
        });
      }
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