// pages/writer/writer.js
var app = getApp();
const url = app.globalData.domain;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileList: [],
    imaUrl: []
  },
  test: function () {
    wx.navigateBack({
      delta: 1,
    })

  },

  myUploadFile(file){
    let that = this;
    console.log(file)
    wx.uploadFile({
      url: url+'/square/studyshare/saveImg',
      filePath: file.url,
      name: 'img',
      header:{
        'Authorization': wx.getStorageSync('token')
      },
      success(res) {
        // 上传完成需要更新 fileList
        var result = JSON.parse(res.data)
        const { fileList=[],imaUrl=[] } = that.data;
        fileList.push({
          ...file,
          // url: result.data.imgUrl
        });
        imaUrl.push( result.data.imgUrl );
        that.setData({
          fileList: fileList,
          imaUrl: imaUrl
        });
      },
    });
  },

  //图片上传
  afterRead(event) {
    let that = this;
    const { file } = event.detail;
    if(file.size>1048576){
      // console.log("图片超过1M，请重新选择")
      wx.showModal({
        title: '图片大小超过1M',
        content: '图片在1M内，请重新选择',
        complete () {
          return false;
        }
      })
    }else if(file.type!=="image"){
      // console.log("所选的非图片，请重新选择")
      wx.showModal({
        title: '所选的非图片',
        content: '所选的非图片，请重新选择',
        complete () {
          return false;
        }
      })
    }else{
      if(that.data.fileList.length>=2){
        // console.log("最多上传2张图片")
        wx.showModal({
          title: '最多上传2张图片',
          complete () {
            return false;
          }
        })
      }else{
        //上传图片到服务器
        that.myUploadFile(file);
      }
    }
    //const { file, callback } = e.detail
    //等同于 file = e.detail.file; callback=e.detail.callback
  },

  //图片删除
  deleteClick(event){
      const { index } = event.detail;
      //删除index处的一张图片
      this.data.fileList.splice(index,1);
      this.data.imaUrl.splice(index,1);
      this.setData({
        fileList: this.data.fileList,
        imaUrl: this.data.imaUrl
      })
  },

  //表单提交
  submit(event) {
    let that = this;
    let info = event.detail.value;
    console.log(info)
    if(info.title===""){
      wx.showToast({
        title: '请输入文章标题',
        icon: 'error',
        duration: 2000
      })
      return false;
    }else if(info.describeBrief===""){
      wx.showToast({
        title: '请输入文章简介',
        icon: 'error',
        duration: 2000
      })
      return false;
    }else if(info.describeDetail===""){
      wx.showToast({
        title: '请输入文章内容',
        icon: 'error',
        duration: 2000
      })
      return false;
    }else{
      wx.request({
        url: url+'/square/studyshare/save',
        method: 'POST',
        header:{
          'Authorization': wx.getStorageSync('token'),
          'Content-Type': "application/x-www-form-urlencoded"
        },
        data: {
          title: info.title,
          describeBrief: info.describeBrief,
          describeDetail: info.describeDetail,
          imgs: that.data.imaUrl
        },
        success(res){
          if(res.data.data.aid){
            wx.showToast({
              title: '成功,请等待审核',
              icon: 'success',
              duration: 2000
            })
          }else{
            wx.showToast({
              title: '提交失败',
              icon: 'error',
              duration: 2000
            })
          }
        },
        complete(){
          //关闭当前页面并返回到上一个界面
          setTimeout(
            function(){
              wx.navigateBack()
            },2000);
        }
      });
    }
    
  }
})