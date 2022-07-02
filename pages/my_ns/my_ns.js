// pages/my/my.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: '',
    isLogin: false,
    imaUrl: app.globalData.domain,
    isStu:'',
  },

  test1: function () {
    let that = this;
    wx.showModal({
      title: '请问您是否要切换身份？',
      success(res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/login/login',
          })
        } else if (res.cancel) {

        }
      }
    })
  },
  test2: function () {
    wx.navigateTo({
      url: '/pages/about/about',
    })
  },
  test3: function () {
    wx.navigateTo({
      url: '/pages/love/love',
    })
  },
  test4: function () {
    wx.navigateTo({
      url: '/pages/detail/detail',
    })
  },

  //登录
  login() {
    if (!wx.getStorageSync("token")) {
      // console.log("不存在token");
      app.get_token();
    } else {
      // console.log("存在token");
      var expire = wx.getStorageSync('tokenExpire');
      var newDate = new Date();
      if (newDate.getTime() > expire) {
        app.get_token();
      }
    }
    //用户登入
    let that = this;
    wx.getUserProfile({
      desc: '用于完善用户资料', //声明获取用户信息的用途
      success(res) {
        that.setData({
          userInfo: res.userInfo,
          isLogin: true
        });
        wx.setStorageSync('userInfo', res.userInfo);
        wx.showLoading({
          title: '正在登录...',
        })
        //将用户头像和昵称存入数据库中
        wx.request({
          url: app.globalData.domain + '/user/index/person-info/',
          // url: 'http://10.215.83.240:8080/user/index/person-info/',
          method: 'POST',
          header: {
            'Authorization': wx.getStorageSync('token'),
            'Content-Type': "application/x-www-form-urlencoded",
          },
          data: {
            nickname: wx.getStorageSync('userInfo').nickName,
            avatarUrl: wx.getStorageSync('userInfo').avatarUrl,
            isStu: 0
          },
          success(res) {
            // app.globalData.userInfo = res.data.data;
            wx.setStorageSync('server', res.data.data.server);
            wx.hideLoading();

            wx.showToast({
              title: '非学生用户',
              icon: 'none',
              duration: 2000
            })
          },
        })
        //用户同意授权后，向服务器获取用户数据
        wx.request({
          url: app.globalData.domain + '/user/person-info/getinfo/self',
          method: 'POST',
          header: {
            'Authorization': wx.getStorageSync('token'),
          },
          success(res) {
            wx.setStorageSync('isStu', res.data.data.isStu);
            wx.setStorageSync('userId', res.data.data.id);
            wx.setStorageSync('ownerInfo', res.data.data);
          }
        })
      },
      fail() {
        wx.showModal({
          title: '警告通知',
          content: '您点击了拒绝授权,将无法正常显示个人信息,点击确定重新获取授权。',
        });
      },
      complete() {

      }
    })

  },
  nologin() {
    let that = this;
    wx.showModal({
      title: '请问您是否要退出？',
      success(res) {
        if (res.confirm) {
          that.setData({
            userInfo: '',
            isLogin: false
          })
          try {
            wx.clearStorageSync()
          } catch (e) {
            // Do something when catch error
          }
        } else if (res.cancel) {

        }
      }
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.editTabBar1();
    var that = this ;
    if(wx.getStorageSync('isStu')==='STUDENT'){
      that.setData({
        isStu:'学生用户'
      })
    }
    else{
      that.setData({
        isStu:'非学生用户'
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //用户授权后得到server,将登入状态改为true
    if (wx.getStorageSync('server')) {
      let user = wx.getStorageSync('userInfo')
      this.setData({
        userInfo: user,
        isLogin: true
      })
    }
  },
})