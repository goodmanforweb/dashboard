import panelcfg from './js/panelWidgetsConfig';
export default {
  //组件基本信息
  base: {
    type: 'video',
    name: '视频',
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
  cfg: () => ({
    type: 'video',
    name: '视频',
    priority: 5,
    parameter: '',
    executeAtStart: true,
    listeners: ['params_good'],
    layout: {i: '', x: 0, y: 0, w: 12, h: 10, minW: 5, minH: 5,maxW: 12,moved:true},
    chartDefinition:  {
      data:  "dfsfdsdfsdfsadfsadfsadfs",
      hasFreshQuery: false,
      option: {
        height: '100%',
        width: '100%',
        value: '',
        src:"http://172.27.9.12:41116/filename/doc/intro_xdt.mp4",
        // src: './intro_xdt.mp4',
        poster: 'http://172.207.9.12:41116/filename/xdt/images/04832d18.screen1pic.png',
        loop: true,
        autoplay: true
      },
      inject: {
        // widgetWillCreated: "function() {console.log('run', this)}",
        postUpdate: "function(){console.log('postUpdate')}"
      }
    },
    
  }),
}