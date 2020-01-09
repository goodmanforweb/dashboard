export default {
    //组件基本信息
    base: {
      type: 'container',
      name: '容器',
    },
    //面板配置
    panel: {
      /*dataSource: {
        name: '数据源',
        typeList: ['sql','service','olap']
      },*/
      style: {
        name: '样式',
        //提供两种面板生成方式： 配置式（优先）、组件式。
        //面板组件配置
        panelcfg:{},
        //面板组件
        panelcmp: null
      },
      /*handle: {
        name: '事件'
      }*/
  
    },
    //组件配置
    cfg: (theme) => ({
      type: "container",
      name: "容器",
      priority: 5,
      parameter: '',
      children: [],
      executeAtStart: true,
      listeners: [],
      layout: {i: '', x: 0, y: 0, w: 12, h: 10,minW: 1,minH:1,maxW: 12,moved:true},
      chartDefinition:  {
        hasFreshQuery: false,
        option: {
          height: '100%',
          width: '100%',
          borderColor: 'orange',
          value: '',
          valueAsId: true,
          backgroundColor: theme.chart.backgroundColor,
        },
        inject: {
          // widgetWillCreated: "function() {console.log('run', this)}",
          postUpdate: "function(){console.log('postUpdate')}"
        }
      },
      
    }),
  }