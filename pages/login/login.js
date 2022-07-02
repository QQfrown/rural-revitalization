// pages/login/login.js
//全局数据
const app = getApp();
Page({
    /**
   * 页面的初始数据
   */
  data: {
    imaUrl: app.globalData.domain,
  },

  goto: function () {
    var isStu = 1;
    if (!wx.getStorageSync("server")) {
      this.login(isStu);
    } else {
      this.modifyStu(isStu);
      //用户已授权过
      wx.reLaunch({
        url: '/pages/index/index',
      })
    }
  },

  goto1: function () {
    var isStu = 0;
    if (!wx.getStorageSync("server")) {
      this.login(isStu);
    } else {
      this.modifyStu(isStu);
      wx.reLaunch({
        url: '/pages/index_ns/index_ns',
      })
    }
  },
  // isStu为数值类型，0：非学生，1：学生
  modifyStu(isStu) {
    wx.request({
      url: app.globalData.domain + '/user/person-info/is-stu/' + isStu,
      method: 'PUT',
      header: {
        'Authorization': wx.getStorageSync('token'),
      },
      success(res) {
        if (isStu === 1) {
          wx.showToast({
            title: '已更改为学生用户',
            icon: 'none',
            duration: 2000
          })
          wx.setStorageSync('isStu', 'STUDENT');
        } else if (isStu === 0) {
          wx.showToast({
            title: '已更改为非学生用户',
            icon: 'none',
            duration: 2000
          })
          wx.setStorageSync('isStu', 'NON_STUDENT');
        }
      }
    })
  },

  login(isStu) {
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
    // this.get_token()
    wx.getUserProfile({
      desc: '用于完善用户资料', //声明获取用户信息的用途
      success(res) {
        that.setData({
          userInfo: res.userInfo
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
            isStu: isStu
          },
          success(res) {
            // app.globalData.userInfo = res.data.data;
            wx.setStorageSync('server', res.data.data.server);
            wx.hideLoading();
            if (isStu === 1) {
              wx.showToast({
                title: '学生用户',
                icon: 'none',
                duration: 2000
              })
              wx.navigateTo({
                url: '/pages/index/index',
              })
            } else {
              wx.showToast({
                title: '非学生用户',
                icon: 'none',
                duration: 2000
              })
              wx.navigateTo({
                url: '/pages/index_ns/index_ns',
              })
            }
          },
          fail(res){
            wx.hideLoading();
            wx.showToast({
              title: '网络异常',
              icon: 'error',
              duration: 2000
            })
          }
        })
        //用户同意授权后，向服务器获取用户数据
        wx.request({
          url: app.globalData.domain + '/user/person-info/getinfo/self',
          method: 'POST',
          header: {
            'Authorization': wx.getStorageSync('token')
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
  }
})