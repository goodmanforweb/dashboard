import panelcfg from './js/panelWidgetsConfig';
export default {
  //组件基本信息
  base: {
    type: 'date',
    name: '日期',
  },
  //面板配置
  panel: {
    style: {
      name: '样式',
      //提供两种面板生成方式： 配置式（优先）、组件式。
      //面板组件配置
      panelcfg,
      //面板组件
      panelcmp: null
    }
  },
  //组件配置
  cfg: (theme) => ({
    type: 'date',
    name: '日期',
    priority: 5,
    parameter: '',
    executeAtStart: true,
    listeners: [],
    layout: {i: '', x: 0, y: 0, w: 3, h: 1,minW: 1,minH:1,maxW: 12,moved:true},
    chartDefinition:  {
      data: [],
      hasFreshQuery: false,
      option: {
        height: '100%',
        width: '100%',
        borderColor: 'orange',
        value: '',
        valueAsId: true,
        startDate: null,
        endDate: null,
        backgroundColor: theme.chart.backgroundColor,
        textColor: theme.chart.textColor
      },
      inject: {
        // widgetWillCreated: "function() {console.log('run', this)}",
        postUpdate: "function(){console.log('postUpdate')}"
      }
    },
    
  }),
}