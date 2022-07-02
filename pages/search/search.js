// pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    historyData: [],
    value: "",
    show: false,
    xShow:false,
    pageName:''
  },
  test: function () {
    wx.navigateBack({
      delta: 1,
    })

  },
  //点击历史记录也可以查找
  toSearch(item) {
    this.setData({
      value: item.currentTarget.dataset.itemvalue
    })
    this.setSearchStorage();
  },

  //输入触发
  input(event) {
    this.setData({
      value: event.detail.value,
    })

    //检测输入的value长度，如果长度为0，则不显示“x”
    if(event.detail.value.length==0){
      this.setData({
        xShow:false
      })
    }else{
      this.setData({
        xShow:true
      })
    }
  },

  //清除搜索框中的文字
  clean() {
    this.setData({
      value: "",
      xShow:false
    });
  },

  //清除历史记录
  cleanHistory() {
    let that = this;
    wx.showModal({
      cancelColor: 'cancelColor',
      title: '提示',
      content: '确定要删除历史记录吗？',
      confirmText: '删除',
      success(res) {
        if (res.confirm) {
          that.setData({
            historyData: [],
            show: false
          });
          wx.clearStorageSync();
        }
      }
    })
  },

  //点击搜索触发
  setSearchStorage: function (res) {
    let that = this;
    let key = this.data.value
    let pageName = that.data.pageName
    if (this.data.value != '') {
      var searchData = wx.getStorageSync('searchData') || [];
      // console.log(searchData);
      // console.log(searchData.indexOf(this.data.value))
      //判断原历史记录中是否有输入框输入的值，若没有则push
      if (searchData.indexOf(this.data.value)<0) {
        searchData.push(this.data.value);
      }
      that.setData({
        historyData: searchData,
        value: '',
        xShow:false
      })
      wx.setStorageSync('searchData', searchData);
      if (searchData.length != 0) {
        that.setData({
          show: true
        })
      }
      //跳转到对应页面
      wx.redirectTo({
        url: '/pages/'+pageName+'/'+pageName+'?key='+key,
      })
    } else {
      wx.showToast({
        title: '请输入搜索内容',
        icon:'error'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      pageName:options.pageName
    })
    let searchData = wx.getStorageSync('searchData') || [];
    // console.log(searchData.length);
    if (searchData.length != 0) {
      this.setData({
        show: true
      })
    };
    this.setData({
      historyData: searchData
    })
  }
})