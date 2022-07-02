Component({
  properties: {
    // biaoqiankuozhan_faxian-104 | biaoqiankuozhan_wode-105 | biaoqiankuozhan_chaoshi-212 | biaoqiankuozhan_shouye-351 | biaoqiankuozhan_faxian-104-copy | biaoqiankuozhan_wode-105-copy | biaoqiankuozhan_chaoshi-212-copy | biaoqiankuozhan_shouye-351-copy | bianji | shoucang2-copy | dianzan-copy | shoucang1 | pinglun | liulan | dingdan | shoucang2 | dianzan | toutiao | dianzan1 | hezuo | duijie | panduan- | jiangbei- | xuexijihua- | tiaoyanxinxituisong | duiyou-xuanzhong1x | a-chartqushitiaoyantongji | qiehuan | shoucang | tishi | wenjian | tongzhihuotixing | xinxi | yonghu | tuichu
    name: {
      type: String,
    },
    // string | string[]
    color: {
      type: null,
      observer: function(color) {
        this.setData({
          colors: this.fixColor(),
          isStr: typeof color === 'string',
        });
      }
    },
    size: {
      type: Number,
      value: 18,
      observer: function(size) {
        this.setData({
          svgSize: size,
        });
      },
    },
  },
  data: {
    colors: '',
    svgSize: 24,
    quot: '"',
    isStr: true,
  },
  methods: {
    fixColor: function() {
      var color = this.data.color;
      var hex2rgb = this.hex2rgb;

      if (typeof color === 'string') {
        return color.indexOf('#') === 0 ? hex2rgb(color) : color;
      }

      return color.map(function (item) {
        return item.indexOf('#') === 0 ? hex2rgb(item) : item;
      });
    },
    hex2rgb: function(hex) {
      var rgb = [];

      hex = hex.substr(1);

      if (hex.length === 3) {
        hex = hex.replace(/(.)/g, '$1$1');
      }

      hex.replace(/../g, function(color) {
        rgb.push(parseInt(color, 0x10));
        return color;
      });

      return 'rgb(' + rgb.join(',') + ')';
    }
  }
});
