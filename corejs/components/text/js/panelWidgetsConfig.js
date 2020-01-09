


export default (dataForPanel) => ({
  content: {
    name: '文本内容',
    value: [
      {
        type: 'string',
        cname:'文本内容',
        name:'content',
        widget: 'XEditor',
        disable: false,
        visible: true,
        belongTo: 'content',
        option: dataForPanel.map(param => ({name: param.name, value: param.id})),
        defaultValue: ''
      }
    ]
  }
});