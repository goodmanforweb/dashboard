const exportIcon = require('resource/images/downCsv.png');
const defaultOption = () => ({
  title: {
    text: '河流图',
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
    trigger: 'axis',
    axisPointer: {
        type: 'line',
        lineStyle: {
            color: 'rgba(0,0,0,0.2)',
            width: 1,
            type: 'solid'
        }
    }
  },
  grid: {
    left: 20,
    right: 20,
    top: 20,
    bottom: 20,
  },
  color: ['#279df5', '#ffd401', '#72c4b8', '#3373b3', '#3f557e', '#f0b498'],
  legend: {
    // orient: 'vertical',
    right: '0',
    top: '0',
    left: 'auto',
    bottom: 'auto',
    orient: 'horizontal',
    data: ['DQ', 'TY', 'SS', 'QG', 'SY', 'DD'],
    textStyle: {
      color: '#919499'
    }
  },
  singleAxis: {
      name:'',
      nameLocation:'center',
      nameGap:35,
      nameTextStyle: {},
      top: 40,
      bottom: 50,
      left: 20,
      right:50,
      axisTick: {},
      axisLabel: {},
      axisLine: {
        lineStyle: {}
      },
      type: 'time',
      axisPointer: {
          animation: true,
          label: {
              show: true
          }
      },
      splitLine: {
          show: true,
          lineStyle: {
              type: 'dashed',
              opacity: 0.2
          }
      }
  },
  series: [
      {
          type: 'themeRiver',
          itemStyle: {
              emphasis: {
                  shadowBlur: 20,
                  shadowColor: 'rgba(0, 0, 0, 0.8)'
              }
          },
          data: [['2015/11/08',10,'DQ'],['2015/11/09',15,'DQ'],['2015/11/10',35,'DQ'],
          ['2015/11/11',38,'DQ'],['2015/11/12',22,'DQ'],['2015/11/13',16,'DQ'],
          ['2015/11/14',7,'DQ'],['2015/11/15',2,'DQ'],['2015/11/16',17,'DQ'],
          ['2015/11/17',33,'DQ'],['2015/11/18',40,'DQ'],['2015/11/19',32,'DQ'],
          ['2015/11/20',26,'DQ'],['2015/11/21',35,'DQ'],['2015/11/22',40,'DQ'],
          ['2015/11/23',32,'DQ'],['2015/11/24',26,'DQ'],['2015/11/25',22,'DQ'],
          ['2015/11/26',16,'DQ'],['2015/11/27',22,'DQ'],['2015/11/28',10,'DQ'],
          ['2015/11/08',35,'TY'],['2015/11/09',36,'TY'],['2015/11/10',37,'TY'],
          ['2015/11/11',22,'TY'],['2015/11/12',24,'TY'],['2015/11/13',26,'TY'],
          ['2015/11/14',34,'TY'],['2015/11/15',21,'TY'],['2015/11/16',18,'TY'],
          ['2015/11/17',45,'TY'],['2015/11/18',32,'TY'],['2015/11/19',35,'TY'],
          ['2015/11/20',30,'TY'],['2015/11/21',28,'TY'],['2015/11/22',27,'TY'],
          ['2015/11/23',26,'TY'],['2015/11/24',15,'TY'],['2015/11/25',30,'TY'],
          ['2015/11/26',35,'TY'],['2015/11/27',42,'TY'],['2015/11/28',42,'TY']]
      }
  ]
});

export default defaultOption