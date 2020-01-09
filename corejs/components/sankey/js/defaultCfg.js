const exportIcon = require('resource/images/downCsv.png');
const defaultOption = () => ({
  title: {
    text: '桑基图',
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
    trigger: 'item',
    triggerOn: 'mousemove'
  },
  color: ['#279df5', '#ffd401', '#72c4b8', '#3373b3', '#3f557e', '#f0b498'],
  series: {
    type: 'sankey',
    layout:'none',
    top:20,
    left:20,
    bottom:20,
    label: {
      show: true
    },
    itemStyle: {
      normal: {
          borderWidth: 0,
      }
  },
    lineStyle: {
        curveness:0.5,
        color: 'source'
    },
    data: [{
        name: 'a',
    }, {
        name: 'b'
    }, {
        name: 'a1'
    }, {
        name: 'a2'
    }, {
        name: 'b1'
    }, {
        name: 'c'
    }],
    links: [{
        source: 'a',
        target: 'a1',
        value: 1
    }, {
        source: 'a',
        target: 'a2',
        value: 3
    }, {
        source: 'b',
        target: 'b1',
        value: 8
    }, {
        source: 'a',
        target: 'b1',
        value: 3
    }, {
        source: 'b1',
        target: 'a1',
        value: 1
    }, {
        source: 'b1',
        target: 'c',
        value: 2
    }]
}
});
export default defaultOption