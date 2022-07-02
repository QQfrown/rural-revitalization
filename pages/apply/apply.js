const app = getApp();
const url = app.globalData.domain;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gender: '1',
    id:-1
  },
  test:function()
  {
    wx.navigateBack({
      delta: 1,
    })
     
  },

  //表单提交
  submit(event){
    let that = this;
    let info = event.detail.value;
    if(info.addressDetail==''|| info.realName=='' || info.specialty=='' || info.telephone=='' ||info.selfIntroduction==''){
      wx.showToast({
        title: '请填写完整信息再提交哦~',
        icon:'none'
      })
    }
    else{
      wx.request({
        url:url+'/square/findteam/submit',
        method:'POST',
        header:{
          'Authorization': wx.getStorageSync('token'),
        },
        data:{
          fid:that.data.id,
          address:info.addressDetail,
          gender:info.gender,
          name:info.realName,
          specialty:info.specialty,
          telephone:info.telephone,
          selfIntroduction:info.selfIntroduction
        },
        success(res){
          if(res.data.code==200){
            wx.navigateBack({
              delta: 1,
            })
            wx.showToast({
              title: '提交成功',
              icon:"success"
            })
          }
          else{
            wx.showToast({
              title: '提交失败,请稍后再试',
              icon:'error'
            })
          }
        }
      })
    }
  },
  sixChange(event) {
    this.setData({
      gender: event.detail,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options.id)
    this.setData({
      id:options.id
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