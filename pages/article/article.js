// pages/article/article.js
const app = getApp();
const url = app.globalData.domain;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:{},
    show: false,
    show1: false,
    like:false,
    collect:false,
    comments:[],
    once:10,
    id:-1,
    haveComment:true,
    avatarUrl: "",
  },
  test:function()
  {
    wx.navigateBack({
      delta: 1,
    })
     
  },
  like(){
    let that =this;
    wx.showToast({
      title: '点赞成功',
      icon: 'success',
    })
    this.setData({
      like:true
    })
    wx.setStorageSync('like', true)
    wx.request({
      url: url+'/square/studyshare/like/'+that.data.id,
      method:'PUT',
      header:{
        'Authorization': wx.getStorageSync('token'),
        'Content-Type': "application/x-www-form-urlencoded"
      },
    })
  },

  //点击收藏
  collect(){
    let that =this;
    wx.request({
      url: url+'/square/studyshare/collect/'+that.data.id,
      method:'PUT',
      header:{
        'Authorization': wx.getStorageSync('token'),
        'Content-Type': "application/x-www-form-urlencoded"
      },
      success(){
        that.setData({
          collect:true
        })
        wx.showToast({
          title: '收藏成功',
          icon:'success'
        })
      },
      fail(){
        wx.showToast({
          title: '收藏失败',
          icon: 'error',
        })
      }
    })
  },

  //取消收藏
  noCollect(){
    let that =this;
    wx.request({
      url: url+'/square/studyshare/collect/'+that.data.id,
      method:'DELETE',
      header:{
        'Authorization': wx.getStorageSync('token'),
        'Content-Type': "application/x-www-form-urlencoded"
      },
      success(){
        that.setData({
          collect:false
        })
        wx.showToast({
          title: '取消收藏',
          icon: 'error',
        })
      },
      fail(){
        wx.showToast({
          title: '取消收藏失败',
          icon: 'error',
        })
      }
    })
    
  },

  showPopup() {
    this.setData({ show: true });
  },

  onClose() {
    this.setData({ show: false });
  },
  showPopup1() {
    this.setData({ show1: true });
  },

  onClose1() {
    this.setData({ show1: false });
  },

  //提交评论信息
  submit(event){
    let that = this;
    let commenInfo = event.detail.value
    if(commenInfo.comment!=""){
      wx.request({
        url: url+'/square/studyshare/comment/'+that.data.id,
        method:'put',
        header:{
          'Authorization': wx.getStorageSync('token'),
          'Content-Type': "application/x-www-form-urlencoded"
        },
        data:{
          comment:commenInfo.comment
        },
        success(){
          wx.showToast({
            title: '提交成功',
            icon:'success'
          })
        },
        fail(){
          wx.showToast({
            title: '提交失败',
            icon:'error'
          })
        },
        complete(){
          let options={
            id:that.data.id
          }
          that.onLoad(options);
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   * 获取跳转页面所传过来的文章信息
   */
  onLoad: function (options) {
    var that = this;
    var id = options.id;
    var avatarUrl = wx.getStorageSync('ownerInfo').avatarUrl;
    this.setData({
      id:id,
      avatarUrl: avatarUrl
    })
    //获取该用户在该文章的点赞、收藏信息
    wx.request({
      url: url+'/square/studyshare/relation/'+id,
      method:'POST',
      header:{
        'Authorization': wx.getStorageSync('token'),
        'Content-Type': "application/x-www-form-urlencoded"
      },
      success(res){
        that.setData({
          like:res.data.data.like,
          collect:res.data.data.collect
        })
      }
    })
    //请求文章信息
    wx.request({
      url: url+'/square/studyshare/'+id,
      method:'get',
      success(e){
        that.setData({
          info:e.data.data
        })
      }
    });
    //请求评论信息
    wx.request({
      url: url+'/square/studyshare/comment/'+id+'?current=1&size='+that.data.once,
      method:'post',
      header:{
        'Authorization': wx.getStorageSync('token'),
        'Content-Type': "application/x-www-form-urlencoded"
      },
      success(e){
        //如果没有评论信息
        if(e.data.data.total==0){
          that.setData({
            haveComment:false
          })
        }
        that.setData({
          comments:e.data.data.records
        })
      }
    })
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