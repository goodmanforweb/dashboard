


export default (dataForPanel) => ({
  url: {
    name: '地址',
    value: [
      {
        type: 'string',
        cname:'视频地址',
        name:'src',
        widget: 'XInput',
        disable: false,
        visible: true,
        belongTo: 'url',
        option: null,
        defaultValue: ''
      },
      {
        type: 'string',
        cname:'贴画地址',
        name:'poster',
        widget: 'XInput',
        disable: false,
        visible: true,
        belongTo: 'url',
        option: null,
        defaultValue: ''
      },
      {
        type: 'boolean',
        cname:'循环播放',
        name:'loop',
        widget: 'XSwitch',
        disable: false,
        visible: true,
        belongTo: 'url',
        option: null,
        defaultValue: ''
      },
      {
        type: 'boolean',
        cname:'自动播放',
        name:'autoplay',
        widget: 'XSwitch',
        disable: false,
        visible: true,
        belongTo: 'autoPlay',
        option: null,
        defaultValue: ''
      }
    ]
  }
});