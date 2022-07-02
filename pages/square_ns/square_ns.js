// pages/square_s/square_s.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imaUrl: app.globalData.domain
  },
  search: function () {
    wx.navigateTo({
      url: '../search/search'
    })
  },
  test1: function () {
    wx.navigateTo({
      url: '/pages/text/text',
    })
  },
  test2: function () {
    wx.navigateTo({
      url: '/pages/team/team',
    })
  },
  test3: function () {
    wx.navigateTo({
      url: '/pages/competition/competition',
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.editTabBar1();
  }
})