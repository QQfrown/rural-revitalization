// pages/test3/test3.js
var address = require("../data/mock1");
var app = getApp();
const url = app.globalData.domain;
Page({
    /**
     * 页面的初始数据
     */
    data: {
      addressMenuIsShow: false,
      value: [0, 0, 0],
      provinces: [],
      citys: [],
      areas: [],
      // consigneeRegion: null,
      // city: "",
      ownerInfo: {}
    },
    test1:function(){
      wx.navigateBack({
        delta: 1,
      })
    },
    // consigneeRegionInput: function (e) {
    //   var consigneeRegion = e.detail.value;
    //   this.setData({
    //     consigneeRegion: consigneeRegion
    //   })
    // },
    formSubmit: function() {
      if (this.data.ownerInfo.province === null) {
        wx.showToast({
          title: '请选择所在地区',
          icon: 'error',
          duration: 2000
        })
        return false
      }else {
        var owner = this.data.ownerInfo;
        // var consigneeRegion = this.data.consigneeRegion;
        wx.showLoading({
          title: '保存信息中...',
        })
        wx.request({
          url: url + '/user/person-info/update/edit',
          method: "PUT",
          header: {
            'Authorization': wx.getStorageSync('token'),
            'Content-Type': "application/json",
          },
          data:{
            province: owner.province,
            city: owner.city,
            district: owner.district
          },
          success(res){
            wx.hideLoading();
            if(res.data.data){
              wx.setStorageSync('ownerInfo', owner);
              // wx.setStorageSync('consigneeRegion', consigneeRegion);
              wx.showToast({
                title: '保存成功',
                icon: 'success',
                duration: 2000
              })
            }else{
              wx.showToast({
                title: '保存失败',
                icon: 'error',
                duration: 2000
              })
            }
          },
          fail(res){
            wx.hideLoading();
            wx.showToast({
              title: '未知错误',
              icon: 'error',
              duration: 2000
            })
          },
          complete(){
            setTimeout(
              function(){
                wx.navigateBack()
              },2000);
          }
        })
      }
      },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      var id = address.provinces[0].id
      this.setData({
        provinces: address.provinces,
        citys: address.citys[id],
        areas: address.areas[address.citys[id][0].id],
      })
    },
    // 点击所在地区弹出选择框
    select: function (e) {
      // 如果已经显示，不在执行显示动画
      if (this.data.addressMenuIsShow) {
        return false
      } else {
        // 执行显示动画
        this.startAddressAnimation(true)
      }
    },
    // 执行动画
    startAddressAnimation: function (isShow) {
      if (isShow) {
        // vh是用来表示尺寸的单位，高度全屏是100vh
        this.animation.translateY(0 + 'vh').step()
      } else {
        this.animation.translateY(40 + 'vh').step()
      }
      this.setData({
        animationAddressMenu: this.animation.export(),
        addressMenuIsShow: isShow,
      })
    },
    // 点击地区选择取消按钮
    cityCancel: function (e) {
      this.startAddressAnimation(false)
    },
    // 点击地区选择确定按钮
    citySure: function (e) {
      var that = this
      var city = that.data.city
      var value = that.data.value
      this.startAddressAnimation(false)
      // 将选择的城市信息显示到输入框
      // var consigneeRegion = that.data.provinces[value[0]].name + '-' + that.data.citys[value[1]].name + '-' + that.data.areas[value[2]].name
      that.setData({
        // consigneeRegion: consigneeRegion,
        'ownerInfo.province': that.data.provinces[value[0]].name,
        'ownerInfo.city': that.data.citys[value[1]].name,
        'ownerInfo.district': that.data.areas[value[2]].name
      })
    },
    // 处理省市县联动逻辑
    cityChange: function (e) {
      var value = e.detail.value
      var provinces = this.data.provinces
      var citys = this.data.citys
      var areas = this.data.areas
      var provinceNum = value[0]
      var cityNum = value[1]
      var countyNum = value[2]
      // 如果省份选择项和之前不一样，表示滑动了省份，此时市默认是省的第一组数据，
      if (this.data.value[0] != provinceNum) {
        var id = provinces[provinceNum].id
        this.setData({
          value: [provinceNum, 0, 0],
          citys: address.citys[id],
          areas: address.areas[address.citys[id][0].id],
        })
      } else if (this.data.value[1] != cityNum) {
        // 滑动选择了第二项数据，即市，此时区显示省市对应的第一组数据
        var id = citys[cityNum].id
        this.setData({
          value: [provinceNum, cityNum, 0],
          areas: address.areas[citys[cityNum].id],
        })
      } else {
        // 滑动选择了区
        this.setData({
          value: [provinceNum, cityNum, countyNum]
        })
      }
    },
    onShow: function () {
      var animation = wx.createAnimation({
        duration: 500,
        timingFunction: 'linear',
      })
      this.animation = animation;
      this.myOnLoad();
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
  })

  