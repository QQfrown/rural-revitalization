// pages/mypost/mypost.js
const app = getApp();
const url = app.globalData.domain;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:[],
    page:1,
    nodata:false,
    count:0,
    nodata:false,
    once:6,
    allLikeNum:0,
    allCommentNum:0,
    allViewNum:0
  },

  test1: function () {
    wx.navigateBack({
      delta: 1,
    })
  },

  gotoWrite(){
    wx.navigateTo({
      url: '/pages/writer/writer',
    })
  },

  gotoDetail(item){
    wx.navigateTo({
      url:'/pages/article/article?id='+item.currentTarget.dataset.value.articleId
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.showLoading({
      title: '正在加载数据...',
    })
    wx.request({
      url: url+'/square/studyshare/user?current=1&size='+that.data.once,
      method:'POST',
      header:{
        'Authorization': wx.getStorageSync('token'),
        'Content-Type': "application/x-www-form-urlencoded"
      },
      success(e){
        let sum = e.data.data.total;
        wx.request({
          url: url+'/square/studyshare/user?current=1&size='+sum,
          method:'POST',
          header:{
            'Authorization': wx.getStorageSync('token'),
            'Content-Type': "application/x-www-form-urlencoded"
          },
          success(res){
            let viewSum=0;
            let commentSum=0;
            let likeSum=0;
            let returns = res.data.data.records;
            for(let i=0;i<sum;i++){
              likeSum = likeSum+returns[i].likeNum;
              viewSum = viewSum+returns[i].viewNum
              commentSum = commentSum+returns[i].commentNum
            }
            that.setData({
              allCommentNum:commentSum,
              allLikeNum:likeSum,
              allViewNum:viewSum
            })
          }
        })
        that.setData({
          info:e.data.data.records,
          count:e.data.data.total,
          nodata:false
        })
      },
      complete(){
        wx.hideLoading();
      }
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showLoading({
      title: '正在加载数据...',
    })
    let that = this;
    wx.request({
      url: url+'/square/studyshare/user?current=1&size='+that.data.once,
      method:'POST',
      header:{
        'Authorization': wx.getStorageSync('token'),
        'Content-Type': "application/x-www-form-urlencoded"
      },
      success(e){
        that.setData({
          info:e.data.data.records,
          nodata:false,
          page:1
        })
      },
      fail(){
        wx.showToast({
          title: '网络异常！请求数据失败！',
        })
      },
      complete(){
        wx.hideLoading();
        wx.stopPullDownRefresh();
      }
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.count <= (this.data.once*this.data.page)){
      this.setData({
        nodata:true
      })
    }
    else{
      wx.showLoading({
        title: '正在加载数据...',
      })
      let that = this;
      this.setData({
        page:that.data.page+1
      })
      wx.request({
        url: url+'/square/studyshare/user?current='+that.data.page+'&size='+that.data.once,
        method:'POST',
        header:{
          'Authorization': wx.getStorageSync('token'),
          'Content-Type': "application/x-www-form-urlencoded"
        },
        success(e){      
            that.setData({
              info:[...that.data.info,...e.data.data.records]
           })
        },
        complete(){
          wx.hideLoading();
        }
      });
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})