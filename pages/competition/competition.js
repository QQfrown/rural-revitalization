
const app = getApp();
const url = app.globalData.domain;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName:"",
    competitionInfo:[],
    page:1,
    nodata:false,
    count:0,
    once:4,
    isStu: ""
  },
test:function(){
  wx.navigateBack({
    delta: 1,
  })
},
  gotoWeb(e){
    let applyWebUrl = e.currentTarget.dataset.value;
    wx.navigateTo({
      url: '/pages/gotoWeb/gotoWeb?url='+e.currentTarget.dataset.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    var nickName = wx.getStorageSync('ownerInfo').nickname;
    var isStu = wx.getStorageSync('isStu');
    that.setData({
      nickName: nickName,
      isStu: isStu
    });
    wx.showLoading({
      title: '正在加载数据...',
    })
    wx.request({
      url: url+'/square/competition?current=1&size='+that.data.once+'&isStu='+isStu,
      method:'GET',
      header:{
        'Authorization': wx.getStorageSync('token'),
        'Content-Type': "application/x-www-form-urlencoded"
      },
      success(e){
        that.setData({
          competitionInfo:e.data.data.list,
          nodata:false,
          count:e.data.data.totalCount
        })
      },
      complete(){
        wx.hideLoading();
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
    wx.showLoading({
      title: '正在加载数据...',
    })
    let that = this;
    wx.request({
      url: url+'/square/competition?current=1&size='+that.data.once+'&isStu='+that.data.isStu,
      method:'GET',
      header:{
        'Authorization': wx.getStorageSync('token'),
        'Content-Type': "application/x-www-form-urlencoded"
      },
      success(e){
        that.setData({
          competitionInfo:e.data.data.list,
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
      }
    });
    wx.stopPullDownRefresh();
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
        url: url+'/square/competition?current='+that.data.page+'&size='+that.data.once+'&isStu='+that.data.isStu,
        method:'GET',
        success(e){      
            that.setData({
              competitionInfo:[...that.data.competitionInfo,...e.data.data.list]
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