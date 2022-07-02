// pages/tour/tour.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    info: [],
    page: 1,
    imgurl: app.globalData.domain,
    once: 4,
    count: 0,
    type: "",
    title: "",
    nodata:false
  },
  test: function () {
    wx.navigateBack({
      delta: 1,
    })

  },
  gotoWeb(e){
    let jumpUrl = e.currentTarget.dataset.value;
    wx.navigateTo({
      url: '/pages/gotoWeb/gotoWeb?url='+jumpUrl
    })
  },
  // 跳转到搜索页面
  search: function () {
    wx.navigateTo({
      url: '../search/search'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    var type = options.type;
    var title;
    if (type==="TOURISM"){
      title = "旅游休闲区";
    }else if(type==="FOOD"){
      title = "食品区";
    }else if(type==="HANDICRAFT"){
      title = "手工艺区";
    }
    that.setData({
      type: type,
      title: title
    })
    wx.request({
      url: app.globalData.domain + '/develop/product/'+type+'?current=1&size=' + that.data.once,
      method: 'GET',
      success(e) {
        that.setData({
          info: e.data.data.records,
          count: e.data.data.total
        })
      },
    })
  },

  //下拉刷新函数
  onPullDownRefresh: function () {
    wx.showLoading({
      title: '正在加载数据...',
    })
    let that = this;
    var type = that.data.type;
    wx.request({
      url: app.globalData.domain + '/develop/product/'+type+'?current=1&size=' + that.data.once,
      method: 'GET',
      success(e) {
        that.setData({
          info: e.data.data.records,
          page: 1
        })
      },
      fail() {
        wx.showToast({
          title: '网络异常！请求数据失败！',
        })
      },
      complete() {
        wx.hideLoading();
      }
    });
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.count <= (this.data.once * this.data.page)) {
      this.setData({
        nodata: true
      })
    } else {
      wx.showLoading({
        title: '正在加载数据...'
      })
      let that = this;
      var type = that.data.type;
      this.setData({
        page: that.data.page + 1
      })
      wx.request({
        url: app.globalData.domain + '/develop/product/'+type+'?current=' + that.data.page + '&size=' + that.data.once,
        method: 'GET',
        success(e) {
          that.setData({
            info: [...that.data.info, ...e.data.data.records]
          })
        },
        complete() {
          wx.hideLoading();
        }
      });
    }
  },
})