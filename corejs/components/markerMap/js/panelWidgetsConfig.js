const wiappbiaozhu = require('resource/images/wiappbiaozhu.png');
const biaozhu1 = require('resource/images/biaozhu1.png');
const tuding = require('resource/images/tuding.png');
const ic_flag_px = require('resource/images/ic_flag_px.png');
const yuanxing1 = require('resource/images/yuanxing1.png');

const mapCentersArr = [
  {"name":"全国", "value" : "全国"},
  {"name":"北京市", "value" : "北京市"},
  {"name":"天津市", "value" : "天津市"},
  {"name":"上海市", "value" : "上海市"},
  {"name":"重庆市", "value" : "重庆市"},
  {"name":"河北省", "value" : "河北省"},
  {"name":"山西省", "value" : "山西省"},
  {"name":"辽宁省", "value" : "辽宁省"},
  {"name":"吉林省", "value" : "吉林省"},
  {"name":"黑龙江省", "value" : "黑龙江省"},
  {"name":"江苏省", "value" : "江苏省"},
  {"name":"浙江省", "value" : "浙江省"},
  {"name":"安徽省", "value" : "安徽省"},
  {"name":"福建省", "value" : "福建省"},
  {"name":"江西省", "value" : "江西省"},
  {"name":"山东省", "value" : "山东省"},
  {"name":"河南省", "value" : "河南省"},
  {"name":"湖北省", "value" : "湖北省"},
  {"name":"湖南省", "value" : "湖南省"},
  {"name":"广东省", "value" : "广东省"},
  {"name":"海南省", "value" : "海南省"},
  {"name":"四川省", "value" : "四川省"},
  {"name":"贵州省", "value" : "贵州省"},
  {"name":"云南省", "value" : "云南省"},
  {"name":"陕西省", "value" : "陕西省"},
  {"name":"甘肃省", "value" : "甘肃省"},
  {"name":"青海省", "value" : "青海省"},
  {"name":"西藏自治区", "value" : "西藏自治区"},
  {"name":"广西壮族自治区", "value" : "广西壮族自治区"},
  {"name":"内蒙古自治区", "value" : "内蒙古自治区"},
  {"name":"宁夏回族自治区", "value" : "宁夏回族自治区"},
  {"name":"新疆维吾尔自治区", "value" : "新疆维吾尔自治区"},
  {"name":"香港特别行政区", "value" : "香港特别行政区"},
  {"name":"澳门地区", "value" : "澳门地区"},
  {"name":"台湾省", "value" : "台湾省"}
]; 

const iconArr = [
  {
    icon: wiappbiaozhu,
    value: 'fa fa-map-marker',
    name: '标记'
  },
  {
    icon: biaozhu1,
    value: 'fa fa-map-pin',
    name: '标注'
  },
  {
    icon: tuding,
    value: 'fa  fa-thumb-tack',
    name: '针'
  },
  {
    icon: ic_flag_px,
    value: 'fa fa-flag',
    name: '旗帜'
  },
  {
    icon: yuanxing1,
    value: 'fa fa-circle',
    name: '原形'
  }
];

const mapStyleArr = [
  {
    name:'标准',
    value:'Normal'
  },
  {
    name:'午夜蓝',
    value:'PurplishBlue'
  },
  {
    name:'灰色',
    value:'Gray'
  },
  {
    name:'暖色',
    value:'Warm'
  },
  {
    name:'精简',
    value:'Light'
  },
  {
    name:'卫星',
    value:'Satellite'
  }
];

export default (dataForPanel) => ({
  draw: {
    name: '绘制',
    value: [
      {
        type: 'string',
        cname:'标识色彩',
        name:'markerColor',
        widget: 'XColorPicker',
        disable: false,
        visible: true,
        belongTo: 'draw',
        option: [{type: 'normal'}],
        defaultValue: 'rgb(16, 142, 233)'
      },
      {
        type: 'string',
        cname:'标识符号',
        name:'markerImg',
        widget: 'XIconPicker',
        disable: false,
        visible: true,
        belongTo: 'draw',
        option: iconArr,
        defaultValue: '"fa fa-map-marker'
      },
      {
        type: 'number',
        cname:'标识大小',
        name:'markerSize',
        widget: 'XSlider',
        disable: false,
        visible: true,
        belongTo: 'draw',
        option: [{maxRange: 30}],
        defaultValue: 14,
      }
    ]
  },
  map: {
    name : "地图",
    value : [
      {
        type: 'array',
        cname:'地图中心',
        name:'mapCenter',
        widget: 'XSelect',
        disable: false,
        visible: true,
        belongTo: 'map',
        option: mapCentersArr,
        defaultValue:   '全国',
      },
      {
        type: 'number',
        cname:'放大级别',
        name:'zoomLevel',
        widget: 'XSlider',
        disable: false,
        visible: true,
        belongTo: 'map',
        option:  [{maxRange: 15}],
        defaultValue: 0
      },
      {
        type: 'string',
        cname:'地图风格',
        name:'mapStyle',
        widget: 'XSelect',
        disable: false,
        visible: true,
        belongTo: 'map',
        option: mapStyleArr,
        defaultValue: 'Normal'
      }
    ]
  }
});