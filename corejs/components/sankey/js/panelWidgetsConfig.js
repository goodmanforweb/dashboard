


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
      },
      
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
        type: 'number',
        cname:'连线风格',
        name:'curveness',
        widget: 'XRadioGroup',
        disable: false,
        visible: true,
        belongTo: 'draw',
        option: [{name:'直线',value: 0},{name:'曲线',value:0.5}],
        defaultValue: 'auto'
      }
    ]
  },
  help: {
    name:'辅助项',
    value: [
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
      },
      {
        type: 'bolean',
        cname:'节点文字',
        name:'labelShow',
        widget: 'XSwitch',
        disable: false,
        visible: true,
        belongTo: 'draw',
        option: null,
        defaultValue: true
      },
    ]
  }
});