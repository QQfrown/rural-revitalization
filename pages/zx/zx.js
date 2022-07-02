// pages/zx/zx.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imaUrl: app.globalData.domain
  },

  test3: function () {
    wx.navigateTo({
      url: '/pages/tour/tour?type=TOURISM',
    })
  },
  test1: function () {
    wx.navigateTo({
      url: '/pages/tour/tour?type=FOOD',
    })
  },
  test2: function () {
    wx.navigateTo({
      url: '/pages/tour/tour?type=HANDICRAFT',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.editTabBar();
  }
})