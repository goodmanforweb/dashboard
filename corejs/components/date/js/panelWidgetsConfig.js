


export default (dataForPanel) => ({
  // style: {
  //   name: '样式',
  //   value: [
  //     {
  //       type: 'string',
  //       name: 'width',
  //       cname:'宽度',
  //       widget: 'XRadioInput',
  //       disable: false,
  //       visible: true,
  //       belongTo: 'style',
  //       option: [{name:'适应内容',value:'auto', defaultValue: 'auto'},{name:'固定',value:'custom', unit:'px',defaultValue: 100}],
  //       defaultValue: 'auto',
  //     },
  //     {
  //       type: 'string',
  //       cname:'高度',
  //       name:'height',
  //       widget: 'XRadioInput',
  //       disable: false,
  //       visible: true,
  //       belongTo: 'style',
  //       option: [{name:'适应内容',value:'auto', defaultValue: 'auto'},{name:'固定',value:'custom', unit:'px',defaultValue: 100}],
  //       defaultValue: 'auto',
  //     }
  //   ]
  // },
  control: {
    name: '控件',
    value: [
      {
        type: 'string',
        cname:'开始日期',
        name: 'startDate',
        widget: 'XDate',
        disable: false,
        visible: true,
        belongTo: 'controler',
        option: null,
        defaultValue: '',
      },
      {
        type: 'string',
        cname:'结束日期',
        name: 'endDate',
        widget: 'XDate',
        disable: false,
        visible: true,
        belongTo: 'controler',
        option: null,
        defaultValue: '',
      },
      {
        type: 'string',
        cname:'保存选择到',
        name:'value',
        widget: 'XSelect',
        disable: false,
        visible: true,
        belongTo: 'controler',
        option: dataForPanel.map(param => ({name: param.name, value: param.id})),
        // option: redux_data.globalParam.map(param => ({name: param.name, value: param.name})),
        defaultValue: ''
      },
    ]
  }
});