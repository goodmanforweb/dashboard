const exportIcon = require('resource/images/downCsv.png');
const defaultOption = {
  orientation: 'vertical',
  title: {
    text: '未来一周气温变化',
    textStyle: {
      color: '#393c41',
      rich:{}
    }
  },
  toolbox: {
    show: false,
    right: 15,
    feature: {
      restore : {show: true,title:'刷新'},
      myTool2: {
        show: false,
        title: '导出数据',
        icon: 'image://' + exportIcon
      },
      saveAsImage: {show: true,title:'导出图片'},
    }
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['最高气温', '最低气温'],
    textStyle: {
      color: '#919499'
    }
  },
  color: ['#279df5', '#ffd401', '#72c4b8', '#3373b3', '#3f557e', '#f0b498'],
  grid: {
    left: 20,
    right: 40,
    top: 20,
    bottom: 20,
  },
  xAxis: [{
    nameLocation: 'middle',
    nameGap: 35,
    type: 'category',
    boundaryGap: false,
    axisTick: {},
    splitLine: { 
      show: false,
      lineStyle: {
        color:"#ccc"//网络线样色
      }
     },
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    axisLine: {
      show: true,
      nameTextStyle: {
        color: '#919499'
      },
      lineStyle: {
        color: '#BFBFBF'
      }
    },
    axisLabel: {
      interval: 0,
      rotate: 0,
      color:''//坐标刻度文字样色 ，默认与坐标轴颜色相同
    }
  }],
  yAxis: [{
    nameLocation: 'middle',
    nameGap: 35,
    type: 'value',
    axisTick: {},
    splitLine: { 
      show: false ,
      lineStyle: {
        color:"#ccc"//网络线样色
      }
    },
    axisLabel: {
      interval: 0,
      rotate: 0,
      color:''
    },
    axisLine: {
      show: true,
      nameTextStyle: {
        color: '#919499'
      },
      lineStyle: {
        color: '#BFBFBF'
      }
    },
  }],
  series: [
    {
      name: '最高气温',
      type: 'line',
      data: [11, 11, 15, 13, 12, 13, 10],
      areaStyle: {
        normal: {
          opacity: 0
        }
      },
      markLine: {
        data: [
          { type: 'average', name: '平均值' }
        ]
      },
      label: {
        normal: {}
      },
    },
    {
      name: '最低气温',
      type: 'line',
      data: [1, 7, 2, 5, 3, 2, 0],
      areaStyle: {
        normal: {
          opacity: 0
        }
      },
      label: {
        normal: {}
      },
      markLine: {
        data: [
          { type: 'average', name: '平均值' },
          [{
            symbol: 'none',
            x: '90%',
            yAxis: 'max'
          }, {
            symbol: 'circle',
            label: {
              normal: {
                position: 'start',
                formatter: '最大值'
              }
            },
            type: 'max',
            name: '最高点'
          }]
        ]
      }
    },
  ]
};
export default defaultOption