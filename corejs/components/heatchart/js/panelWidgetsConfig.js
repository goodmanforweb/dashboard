


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
        cname:'图例类型',
        name:'visualMap',
        widget: 'XRadioGroup',
        disable: false,
        visible: true,
        belongTo: 'draw',
        option: [{name:'颜色渐变',value: 'continuous'},{name:'颜色分组',value: 'piecewise' }],
        defaultValue: 'auto',
        controls: ['color']
      },
      {
        type: 'string',
        cname:'色彩',
        name:'color',
        widget: 'XColorPicker',
        disable: false,
        visible: true,
        belongTo: 'draw',
        option: [{type: 'listColor'}],
        defaultValue: 'rgb(16, 142, 233)',
        controlHandle: function(sourceValue) {
          return {
            //控制显示 隐藏
            show: true,
            //控制option
            option: sourceValue === 'continuous' ? [{type: 'listColor', limitColors: 2, disableDelete: true}] : [{type: 'listColor', limitColors: 5, disableDelete: true}]
          }
        }
      }
    ]
  },
  axis: {
    name:'坐标',
    value: [
      {
        type: 'string',
        cname:'X轴位置',
        name:'xAixsPosition',
        widget: 'XRadio',
        disable: false,
        visible: true,
        belongTo: 'axis',
        option: [{name:'上',value:'top'},{name:'下',value:'bottom'},{name:'无',value:'null'}],
        defaultValue: 'bottom',
      },
      {
        type: 'string',
        cname:'X轴标题',
        name:'xAixsName',
        widget: 'XInput',
        disable: false,
        visible: true,
        belongTo: 'axis',
        option:null,
        defaultValue: ''
      },
      {
        type: 'string',
        cname:'Y轴位置',
        name:'yAixsPosition',
        widget: 'XRadio',
        disable: false,
        visible: true,
        belongTo: 'axis',
        option: [{name:'左',value:'left'},{name:'右',value:'right'},{name:'无',value:'null'}],
        defaultValue: 'left',
      },
      {
        type: 'string',
        cname:'Y轴标题',
        name:'yAixsName',
        widget: 'XInput',
        disable: false,
        visible: true,
        belongTo: 'axis',
        option:null,
        defaultValue: ''
      },
      
      {
        type: 'bolean',
        cname:'坐标刻度',
        name:'axisTick',
        widget: 'XSwitch',
        disable: false,
        visible: true,
        belongTo: 'axis',
        option: null,
        defaultValue: true
      },
    ]
  },
  help: {
    name:'辅助项',
    value: [
      {
        type: 'number',
        cname:'数据单位',
        name:'dataFormater',
        widget: 'XRadio',
        // widget: 'XRadioGroup',
        disable: false,
        visible: true,
        belongTo: 'draw',
        option: [{name:'无',value:0},{name:'千',value:3},{name:'万',value:4},{name:'百万',value:6},{name:'亿',value:8}],
        defaultValue: 'top',
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
  },
  warn: {
    name: '预警',
    value: [
      {
          type: 'object',
          cname: null,
          name:'warn',
          widget: 'XWarn',
          disable: false,
          visible: true,
          belongTo: 'warn',
          option: [''],
          defaultValue: {}
      }
    ]
  }
});