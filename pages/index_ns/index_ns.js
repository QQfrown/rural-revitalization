var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // consigneeRegion: '待选择',
    city: '待选择',
    info: [],
    info2: [],
    page: 1,
    imaUrl: app.globalData.domain
  },
  choose: function () {
    wx.navigateTo({
      url: '/pages/test2/test2',
    })
  },
  // 跳转到搜索页面
  search: function () {
    wx.navigateTo({
      url: '../search/search'
    })
  },
  onShow: function () {
    app.editTabBar1(); //显示自定义的底部导航
    var city = wx.getStorageSync('ownerInfo').city;
    if(city==='市辖区'){
      this.setData({
        city: wx.getStorageSync('ownerInfo').province
      })
    }else{
      this.setData({
        city: wx.getStorageSync('ownerInfo').city
      })
    }
  },
  gotoWeb(e){
    let jumpUrl = e.currentTarget.dataset.value;
    // console.log("跳转url:"+jumpUrl)
    wx.navigateTo({
      url: '/pages/gotoWeb/gotoWeb?url='+jumpUrl
    })
  },
  onLoad: function (options) {
    let that = this;
    wx.request({
        url: app.globalData.domain + '/develop/product/byid/1',
        method: 'GET',
        success(e) {
          that.setData({
            info: e.data,
          })
        },
      }),
      wx.request({
        url: 'http://10.215.83.240:8080/index/project/1',
        method: 'GET',
        success(e) {
          that.setData({
            info2: e.data,
          })
        },
      })
  },
})