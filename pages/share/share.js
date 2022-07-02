// pages/share/share.js
const app = getApp();
const url = app.globalData.domain;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    info: [],
    page: 1,
    nodata: false,
    count: 0,
    once: 3,
    key:'',
    avatarUrl: ""
  },

  test1: function () {
    wx.navigateBack({
      delta: 1,
    })

  },
 
   //bindtap页面跳转
   gotoSearch(res){
    wx.redirectTo({
      url: '/pages/search/search?pageName='+res.currentTarget.dataset.pagename,
    })
  },

  gotoWrite() {
    wx.navigateTo({
      url: '/pages/writer/writer',
    })
  },
  gotoDetail(item) {
    wx.navigateTo({
      url: '/pages/article/article?id=' + item.currentTarget.dataset.value.articleId
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let key = options.key
    this.setData({
      key:key,
      avatarUrl: wx.getStorageSync('ownerInfo').avatarUrl
    })
    wx.showLoading({
      title: '正在加载数据...',
    })
    if(key != undefined){
      wx.request({
        url: url+'/search/studyshare?current=1&size=' + that.data.once+'&key='+key,
        method: 'GET',
        header: {
          'Authorization': wx.getStorageSync('token'),
          'Content-Type': "application/x-www-form-urlencoded"
        },
        success(e) {
          that.setData({
            info: e.data.data.records,
            nodata: false,
            count: e.data.data.total
          })
        },
        complete() {
          wx.hideLoading();
        }
      })
    }
    else{
      wx.request({
        url: url + '/square/studyshare?current=1&size=' + that.data.once,
        method: 'GET',
        header: {
          'Authorization': wx.getStorageSync('token'),
          'Content-Type': "application/x-www-form-urlencoded"
        },
        success(e) {
          that.setData({
            info: e.data.data.records,
            nodata: false,
            count: e.data.data.total
          })
        },
        complete() {
          wx.hideLoading();
        }
      });
    }
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
    wx.showLoading({
      title: '正在加载数据...',
    })
    let that = this;
    if(that.data.key != undefined){
      wx.request({
        url: url+'/search/studyshare?current=1&size=' + that.data.once+'&key='+that.data.key,
        method: 'GET',
        header: {
          'Authorization': wx.getStorageSync('token'),
          'Content-Type': "application/x-www-form-urlencoded"
        },
        success(e) {
          that.setData({
            info: e.data.data.records,
            nodata: false,
            page:1
          })
        },
        complete() {
          wx.hideLoading();
        }
      })
    }
    else{
      wx.request({
        url: url + '/square/studyshare?current=1&size=' + that.data.once,
        method: 'GET',
        header: {
          'Authorization': wx.getStorageSync('token'),
          'Content-Type': "application/x-www-form-urlencoded"
        },
        success(e) {
          that.setData({
            info: e.data.data.records,
            nodata: false,
            page:1
          })
        },
        complete() {
          wx.hideLoading();
        }
      });
    }
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
        title: '正在加载数据...',
      })
      let that = this;
      this.setData({
        page: that.data.page + 1
      })
      if(that.data.key != undefined){
        wx.request({
          url: url + '/square/studyshare?current=' + that.data.page + '&size=' + that.data.once+'&key='+that.data.key,
          method: 'GET',
          header: {
            'Authorization': wx.getStorageSync('token'),
            'Content-Type': "application/x-www-form-urlencoded"
          },
          success(e) {
            that.setData({
              info: [...that.data.info, ...e.data.data.records]
            })
          },
          complete() {
            wx.hideLoading();
          }
        })
      }
      else{
        wx.request({
          url: url + '/square/studyshare?current=' + that.data.page + '&size=' + that.data.once,
          method: 'GET',
          header: {
            'Authorization': wx.getStorageSync('token'),
            'Content-Type': "application/x-www-form-urlencoded"
          },
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
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})