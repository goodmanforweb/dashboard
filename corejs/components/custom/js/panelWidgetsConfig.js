


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
  code: {
    name: '代码',
    value: [
      {
        type: 'string',
        cname:'自定义代码',
        name: 'code',
        widget: 'XCodeEditor',
        disable: false,
        visible: true,
        belongTo: 'code',
        option: [{type: 'javascript'}],
        defaultValue: true
      }
    ]
  }
});