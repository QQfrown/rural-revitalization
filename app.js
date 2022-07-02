// app.js
// const DOMAIN = 'http://10.215.83.240:8080';
const DOMAIN = 'https://sshoss.top:7443';
module.exports = {
	DOMAIN: DOMAIN
}
App({

   //底部导航版本1  
   editTabBar: function() {
    //使用getCurrentPages可以获取当前加载中所有的页面对象的一个数组，数组最后一个就是当前页面。
    var curPageArr = getCurrentPages(); //获取加载的页面
    var curPage = curPageArr[curPageArr.length - 1]; //获取当前页面的对象
    var pagePath = curPage.route; //当前页面url
    if (pagePath.indexOf('/') != 0) {
      pagePath = '/' + pagePath;
    }

    var tabBar = this.globalData.tabBar;
    for (var i = 0; i < tabBar.list.length; i++) {
      tabBar.list[i].active = false;
      if (tabBar.list[i].pagePath == pagePath) {
        tabBar.list[i].active = true; //根据页面地址设置当前页面状态    
      }
    }
    curPage.setData({
      tabBar: tabBar
    });
  },

  //底部导航版本2
  editTabBar1: function() {
    var curPageArr = getCurrentPages();
    var curPage = curPageArr[curPageArr.length - 1];
    var pagePath = curPage.route;
    if (pagePath.indexOf('/') != 0) {
      pagePath = '/' + pagePath;
    }
    var tabBar = this.globalData.tabBar1;
    for (var i = 0; i < tabBar.list.length; i++) {
      tabBar.list[i].active = false;
      if (tabBar.list[i].pagePath == pagePath) {
        tabBar.list[i].active = true;
      }
    }
    curPage.setData({
      tabBar: tabBar
    });
  },

 globalData: {
    domain: DOMAIN,
    //版本1底部导航栏显示
    tabBar: {
      "list": [
        {
          "pagePath": "/pages/index/index",
          "text": "首页",
          "clas": "tab-item",
          "iconName": "biaoqiankuozhan_shouye-351-copy",
          "selectedIconName": "biaoqiankuozhan_shouye-351"
        },
        {
          "pagePath": "/pages/square_s/square_s",
          "text": "广场",
          "clas": "tab-item",
          "iconName": "biaoqiankuozhan_faxian-104-copy",
          "selectedIconName": "biaoqiankuozhan_faxian-104"
        },
        {
          "pagePath": "/pages/zx/zx",
          "text": "振兴",
          "clas": "tab-item",
          "iconName": "biaoqiankuozhan_chaoshi-212-copy",
          "selectedIconName": "biaoqiankuozhan_chaoshi-212"
        },
        {
          "pagePath": "/pages/my/my",
          "text": "我",
          "clas": "tab-item",
          "iconName": "biaoqiankuozhan_wode-105-copy",
          "selectedIconName": "biaoqiankuozhan_wode-105"
        }
      ]
    },
    //版本2底部导航栏显示
    tabBar1: {
      "list": [
        {
          "pagePath": "/pages/index_ns/index_ns",
          "text": "首页",
          "clas": "tab-item",
          "iconName": "biaoqiankuozhan_shouye-351-copy",
          "selectedIconName": "biaoqiankuozhan_shouye-351"
        },
        {
          "pagePath": "/pages/square_ns/square_ns",
          "text": "广场",
          "clas": "tab-item",
          "iconName": "biaoqiankuozhan_faxian-104-copy",
          "selectedIconName": "biaoqiankuozhan_faxian-104"
        },
        {
          "pagePath": "/pages/zx_ns/zx_ns",
          "text": "振兴",
          "clas": "tab-item",
          "iconName": "biaoqiankuozhan_chaoshi-212-copy",
          "selectedIconName": "biaoqiankuozhan_chaoshi-212"
        },
        {
          "pagePath": "/pages/my_ns/my_ns",
          "text": "我",
          "clas": "tab-item",
          "iconName": "biaoqiankuozhan_wode-105-copy",
          "selectedIconName": "biaoqiankuozhan_wode-105"
        }
      ]
    }

  },
  
  //获取token
  get_token:function(){
    // console.log(this.globalData.domain)
    wx.login({
      success(res) {
        wx.request({ // 调用登录接口，获取用户登录凭证token
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          // url: getApp().globalData.domain+'/user/index/login/',
          url: DOMAIN + '/user/index/login/',
          method: 'POST',
          header: {
            'Content-Type': "application/x-www-form-urlencoded",
          },
          data: {
            code: res.code,
          },
          success(res) { // 接口调用成功，获取token并缓存
            // console.log(res.data.data);
            wx.setStorageSync('token', res.data.data.token); // 将token进行缓存到'token'字段
            wx.setStorageSync('tokenExpire', res.data.data.expire);
          }
        })
      }
    });
  },
  getOwnerInfo:function(){
    wx.request({
      url: DOMAIN + '/user/person-info/getinfo/self',
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

  onLaunch() {
    // 展示本地存储能力
    // const logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    // 登录
    if (!wx.getStorageSync("token")) {
      // console.log("不存在token");
      this.get_token();
    } else {
      // console.log("存在token");
      var expire = wx.getStorageSync('tokenExpire');
      var newDate = new Date();
      if(newDate.getTime()>expire){
        this.get_token();
      }
      this.getOwnerInfo();
    }
    //如果用户存在server(服务器返回的认证信息)，就直接跳转首页
    if (wx.getStorageSync("server")){
      if(wx.getStorageSync("isStu")==="NON_STUDENT"){
        wx.reLaunch({
          url: '/pages/index_ns/index_ns',
        })
      }else{
        wx.reLaunch({
          url: '/pages/index/index',
        })
      }
    }
  }
})

