// pages/test4/test4.js
var app = getApp()
const url = app.globalData.domain;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // gender: '待编辑',
    // username: '待编辑',
    // email: '待编辑',
    // consigneeRegion: '待编辑',
    // phone: '待编辑',
    // detailedAddress: '待编辑'
    ownerInfo: {
        gender: "未知",
        province: null,
        city: null,
        district: null,
        phone: "未知",
        name: "未知",
        address: "未知",
    },
    // consigneeRegion: "未知"
  },
  myOnLoad: function (){
    var that = this;
    if(wx.getStorageSync('ownerInfo')){
      that.setData({
        ownerInfo: wx.getStorageSync('ownerInfo'),
      })
    }else{
      wx.showToast({
        title: '请先登入！',
        icon: 'error',
        duration: 2000,
        complete(){
          setTimeout(function(){wx.navigateBack()},2000)
        }
      })
    }
    // if(wx.getStorageSync('consigneeRegion')!==undefined){
    //   that.setData({
    //     consigneeRegion: wx.getStorageSync('consigneeRegion'),
    //   })
    // }
  },
  test1: function () {
    wx.navigateBack({
      delta: 1,
    })
    // if (wx.getStorageSync('isStu') == 'STUDENT') {
    //   wx.navigateTo({
    //     url: '/pages/my/my',
    //   })
    // } else {
    //   wx.navigateTo({
    //     url: '/pages/my_ns/my_ns',
    //   })
    // }
  },
  test: function () {
    wx.navigateTo({
      url: '/pages/edit/edit',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.myOnLoad();
  },
  // exit: function (e) {
  //   wx.showModal({
  //     title: '请问您是否要退出？',
  //     success: function (res) {
  //       if (res.confirm) {
  //         // console.log('用户点击确定')
  //         // wx.removeStorageSync('student');


  //         wx.removeStorageSync('consigneeRegion'),
  //           wx.removeStorageSync('username'),
  //           wx.removeStorageSync('gender'),
  //           wx.removeStorageSync('detailedAddress'),
  //           wx.removeStorageSync('phone'),
  //           wx.removeStorageSync('email')

  //         //页面跳转
  //         wx.navigateTo({
  //           url: '/pages/detail/detail',
  //         })
  //       } else if (res.cancel) {
  //         console.log('用户点击取消')
  //       }
  //     }
  //   })
  // },
  onShow: function () {
    this.myOnLoad();
    // if (wx.getStorageSync('consigneeRegion') && wx.getStorageSync('username') && wx.getStorageSync('gender') && wx.getStorageSync('detailedAddress') && wx.getStorageSync('phone') && wx.getStorageSync('email')) {
    //   that.setData({
    //     consigneeRegion: wx.getStorageSync('consigneeRegion'),
    //     username: wx.getStorageSync('username'),
    //     gender: wx.getStorageSync('gender'),
    //     detailedAddress: wx.getStorageSync('detailedAddress'),
    //     phone: wx.getStorageSync('phone'),
    //     email: wx.getStorageSync('email')
    //   })
    // }
  },
  
})