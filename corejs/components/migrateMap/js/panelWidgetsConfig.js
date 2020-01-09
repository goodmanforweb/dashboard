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
        cname:'终点色彩',
        name:'pointColor',
        widget: 'XColorPicker',
        disable: false,
        visible: true,
        belongTo: 'draw',
        option: [{type: 'normal'}],
        defaultValue: 'rgb(16, 142, 233)'
      }, 
      {
        type: 'string',
        cname:'线条色彩',
        name:'routeColor',
        widget: 'XColorPicker',
        disable: false,
        visible: true,
        belongTo: 'draw',
        option: [{type: 'normal'}],
        defaultValue: '#FCC400'
      },
      {
        type: 'number',
        cname:'线条宽度',
        name:'routeWeight',
        widget: 'XSlider',
        disable: false,
        visible: true,
        belongTo: 'draw',
        option: [{maxRange: 10}],
        defaultValue: 2,
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