import panelcfg from './js/panelWidgetsConfig';
export default {
  //组件基本信息
  base: {
    type: 'select',
    name: '下拉框',
  },
  //面板配置
  panel: {
    dataSource: {
      name: '数据源',
      typeList: ['sql','service','olap']
    },
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
    type: "select",
    name: "下拉框",
    priority: 5,
    parameter: '',
    executeAtStart: true,
    listeners: [],
    layout: {i: '', x: 0, y: 0, w: 3, h: 1,minW: 1,minH:1,maxW: 12,moved:true},
    chartDefinition:  {
      queryid: '',
      queryname:'',
      hasFreshQuery: false,
      query: {
        type:'sql',
        param: {},
        statement: '',
        query: ``,
        jndi: ''
      },
      data: {"queryInfo":{"totalRows":"4"},"resultset":[["食品经营",1000012,"349212,13423,129843,22541"],["餐饮服务",1000012,"349212,13423,129843,22541"],["食品流通",2000012,"349212,13423,129843,22541"],["食品生产",3000012,"349212,13423,129843,22541"]],"metadata":[{"colIndex":0,"colType":"String","colName":"食品大类"},{"colIndex":1,"colType":"Numeric","colName":"金额"},{"colIndex":2,"colType":"String","colName":"数据"}]},
      option: {
        height: '100%',
        width: '100%',
        borderColor: 'orange',
        value: '',
        valueAsId: true,
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