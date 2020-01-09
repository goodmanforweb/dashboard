


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
        defaultValue: null
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
  chart:{
      name:'图表',
      value:[
          {
              type: 'string',
              cname:'仪表类型',
              name:'gaugeColorSeries',
              widget: 'XGauge',
              disable: false,
              visible: true,
              belongTo: 'chart',
              option: null,
              defaultValue: null,
          },
          {
              type: 'string',
              cname:'仪表角度',
              name:'gaugeAngle',
              widget: 'XRadio',
              disable: false,
              visible: true,
              belongTo: 'chart',
              option: [{name:'360度',value:'360'},{name:'270度',value:'270'},{name:'180度',value:'180'}],
              defaultValue: '180',
          },
          {
              type: 'number',
              cname:'仪表轴线宽度',
              name:'gaugeWidth',
              widget: 'XSlider',
              disable: false,
              visible: true,
              belongTo: 'chart',
              option: [{maxRange: 100}],
              defaultValue:10,
          },
          {
              type: 'number',
              cname:'仪表分割线',
              name:'sliderNumber',
              widget: 'XRadioGroupInput',
              disable: false,
              visible: true,
              belongTo: 'chart',
              option: [{name:'关',value:'auto',defaultValue: 'auto'},
                  {name:'开',name2: '',value:0,defaultValue: 10}],
              // option: redux_data.globalParam.map(param => ({name: param.name, value: param.name})),
              defaultValue: 'auto'
          },
          {
              type: 'number',
              cname:'仪表刻度',
              name:'smallSplitNumber',
              widget: 'XRadioGroupInput',
              disable: false,
              visible: true,
              belongTo: 'chart',
              option: [{name:'关',value:'auto',defaultValue: 'auto'},
                  {name:'开',name2: '',value:0,defaultValue: 5}],
              // option: redux_data.globalParam.map(param => ({name: param.name, value: param.name})),
              defaultValue: 'auto'
          },
          {
              type: 'string',
              cname:'刻度样式',
              name:'gaugeInOut',
              widget: 'XRadio',
              disable: false,
              visible: true,
              belongTo: 'chart',
              option: [{name:'内',value:'inside'},{name:'外',value:'outside'}],
              defaultValue: 'inside'
          }
      ]
  },
  fix:{
      name:'辅助项',
      value:[
          {
              type: 'bolean',
              cname:'数据标签',
              name:'axisLabel',
              widget: 'XSwitch',
              disable: false,
              visible: true,
              belongTo: 'fix',
              option: null,
              defaultValue: null,
          },
          {
              type: 'bolean',
              cname:'显示数据',
              name:'detail',
              widget: 'XSwitch',
              disable: false,
              visible: true,
              belongTo: 'fix',
              option: null,
              defaultValue: null,
          },
          {
              type: 'bolean',
              cname:'显示占比',
              name:'showRadio',
              widget: 'XSwitch',
              disable: false,
              visible: true,
              belongTo: 'fix',
              option: null,
              defaultValue: null,
          },
          {
              type: 'string',
              cname:'数据标题',
              name:'detailName',
              widget: 'XRadioStringInput',
              disable: false,
              visible: true,
              belongTo: 'chart',
              option: [{name:'关',value:'close',defaultValue: 'close'},
                  {name:'自动',value:'auto',defaultValue: 'auto'},
                  {name:'自定义',value:"",defaultValue: ""}],
              // option: redux_data.globalParam.map(param => ({name: param.name, value: param.name})),
              defaultValue: 'auto'
          },
          {
              type: 'bolean',
              cname:'导出数据',
              name:'isExportData',
              widget: 'XSwitch',
              disable: false,
              visible: true,
              belongTo: 'fix',
              option: null,
              defaultValue: null,
          }
      ]
  }
});