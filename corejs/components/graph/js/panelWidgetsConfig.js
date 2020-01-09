


export default (dataForPanel) => ({
  title: {
    name: '标题',
    value: [
      {
        type: 'string',
        name: 'title',
        cname:'标题内容',
        widget: 'XInput',
        disable: false,
        visible: true,
        belongTo: 'title',
        option: null,
        defaultValue: null,
      },
      {
        type: 'string',
        cname:'标题位置',
        name:'titlePosition',
        widget: 'XRadio',
        disable: false,
        visible: true,
        belongTo: 'title',
        option: [{name:'左',value:'left'},{name:'中',value:'center'},{name:'右',value:'right'}],
        defaultValue: 'left',
      }
    ]
  },
  draw: {
    name: '图表',
    value: [
      {
        type: 'string',
        cname:'色彩',
        name:'color',
        widget: 'XColorPicker',
        disable: false,
        visible: true,
        belongTo: 'draw',
        option: [{type: 'listColor'}],
        defaultValue: 'rgb(16, 142, 233)'
      },
      {
        type: 'string',
        cname:'图例位置',
        name:'example',
        widget: 'XRadio',
        disable: false,
        visible: true,
        belongTo: 'draw',
        option: [{name:'上',value:'top'},{name:'下',value:'bottom'},{name:'左',value:'left'},{name:'右',value:'right'},{name:'无',value:'null'}],
        defaultValue: 'top',
      },
      {
        type: 'string',
        cname:'连线风格',
        name:'curveness',
        widget: 'XRadioGroup',
        disable: false,
        visible: true,
        belongTo: 'draw',
        option: [{name:'直线',value: 0},{name:'曲线',value: 0.3 }],
        defaultValue: 'auto'
      },
      {
        type: 'string',
        cname:'节点标记',
        name:'nodeType',
        widget: 'XRadioGroup',
        // widget: 'XRadioGroup',
        disable: false,
        visible: true,
        belongTo: 'draw',
        option: [{name:'圆形',value:'circle'},{name:'矩形',value:'rect'},{name:'圆角矩形',value:'roundRect'},
                  {name:'三角形',value:'triangle'},{name:'菱形',value:'diamond'},{name:'箭头',value:'arrow'}],
        defaultValue: 'top',
      },
      {
        type: 'number',
        cname:'节点大小',
        name:'nodeSize',
        widget: 'XSlider',
        disable: false,
        visible: true,
        belongTo: 'draw',
        option: [{maxRange: 10, minRange: 1}],
        defaultValue: 'rgb(16, 142, 233)'
      },
      {
        type: 'number',
        cname:'节点斥力',
        name:'nodeRepulsion',
        widget: 'XSlider',
        disable: false,
        visible: true,
        belongTo: 'draw',
        option: [{maxRange: 1000}],
        defaultValue: 'rgb(16, 142, 233)'
      },
      {
        type: 'bolean',
        cname:'节点拖拽',
        name:'nodeDrag',
        widget: 'XSwitch',
        disable: false,
        visible: true,
        belongTo: 'draw',
        option: null,
        defaultValue: false
      },
      {
        type: 'bolean',
        cname:'鼠标缩放',
        name:'mouseScale',
        widget: 'XSwitch',
        disable: false,
        visible: true,
        belongTo: 'draw',
        option: null,
        defaultValue: false
      },
      {
        type: 'bolean',
        cname:'平移漫游',
        name:'move',
        widget: 'XSwitch',
        disable: false,
        visible: true,
        belongTo: 'draw',
        option: null,
        defaultValue: false
      }
    ]
  },
  help: {
    name: '辅助项',
    value: [
      {
        type: 'bolean',
        cname:'节点文字',
        name:'nodeText',
        widget: 'XSwitch',
        disable: false,
        visible: true,
        belongTo: 'draw',
        option: null,
        defaultValue: false
      },
      {
        type: 'bolean',
        cname:'显示数据',
        name:'showData',
        widget: 'XSwitch',
        disable: false,
        visible: true,
        belongTo: 'draw',
        option: null,
        defaultValue: false
      },
      {
        type: 'bolean',
        cname:'导出数据',
        name:'isExportData',
        widget: 'XSwitch',
        disable: false,
        visible: true,
        belongTo: 'title',
        option: null,
        defaultValue: null,
      }
    ]
  }
});
