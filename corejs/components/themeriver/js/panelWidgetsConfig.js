


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
        // option: redux_data.globalParam.map(param => ({name: param.name, value: param.name})),
        defaultValue: 'rgb(16, 142, 233)'
      },
      {
        type: 'string',
        cname:'图例',
        name:'example',
        widget: 'XRadio',
        disable: false,
        visible: true,
        belongTo: 'draw',
        option: [{name:'上',value:'top'},{name:'下',value:'bottom'},{name:'左',value:'left'},{name:'右',value:'right'},{name:'无',value:'null'}],
        defaultValue: 'top',
      },
      
      
    ]
  },
  axis:{
    name: '坐标',
    value: [
      {
        type: 'bolean',
        cname:'刻度',
        name:'axisTick',
        widget: 'XSwitch',
        disable: false,
        visible: true,
        belongTo: 'axis',
        option: null,
        defaultValue: true,
      },
      {
        type: 'string',
        name: 'axisTitle',
        cname:'坐标标题',
        widget: 'XInput',
        disable: false,
        visible: true,
        belongTo: 'axis',
        option: null,
        defaultValue: null,
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
        cname:'网格线',
        name:'splitLine',
        widget: 'XSwitch',
        disable: false,
        visible: true,
        belongTo: 'draw',
        option: null,
        defaultValue: null,
      }
    ]
  }
});