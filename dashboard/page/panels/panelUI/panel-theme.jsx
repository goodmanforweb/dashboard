import React ,{ Component } from 'react';
import ColorPicker from '../panelComponents/colorPicker';
import { Col, Row , Radio, Slider } from 'antd';
import { Scrollbars } from "react-custom-scrollbars";
const RadioGroup = Radio.Group

const themes = [
      {
        type:'default',
        name:'默认',
        selected: true,
        img: require('resource/images/theme1.jpg'),
        property: {
          body: {
            backgroundColor: '#e6eef2',
            backgroundImage: ''
          },
          chart: {
            backgroundColor: '#fff',
            titleBackgroundColor:'',
            textColor: ['#393c41','#919499'],//文字样色
            color: ['#279df5','#ffd401','#72c4b8','#3373b3','#3f557e','#f0b498'],//图表颜色
            borderRadius: 0,
            margin:'',
            borderColor:'#eaeaea',//分割线颜色
            lineColor:['#bfbfbf','#eaeaea'],//辅助线颜色

          },
          activeTheme: 'default'
        }
      },
      {
        type:'clear',
        name:'清爽',
        selected: false,
        img: require('resource/images/theme2.jpg'),
        property: {
          body: {
          // linear-gradient(to bottom right, #2b375e , #345676)
            
            backgroundColor: '#fafbfd',
            backgroundImage: ''
          },
          chart: {
            backgroundColor: 'transparent',
            titleBackgroundColor:'',
            textColor: ['#393c41','#919499'],
            color: ['#36dad9','#a389d3','#03a9f5','#1886b9','#69acb5','#07c0ae'],
            borderRadius: 3,
            margin: 10,
            borderColor:'',
            lineColor:['#bfbfbf','#eaeaea'],
          },
          activeTheme: 'clear'
        }
      },
      {
        type:'motion',
        name:'动感',
        selected: false,
        img: require('resource/images/theme3.jpg'),
        property: {
          body: {
            backgroundColor: '#eee',
            backgroundImage: ''
          },
          chart: {
            backgroundColor: '#fff',
            titleBackgroundColor: '#d7e0e7',
            titleHeight: 40,
            textColor: ['#334d5d','#919499'],
            color: ['#34d4e9','#9ece4c','#1ea4dd','#fac61a','#ffa26b','#84a5b4'],
            borderRadius: 0,
            margin: 10,
            borderColor:'',
            lineColor:['#bfbfbf','#eaeaea'],
          },
          activeTheme: 'motion'
        }
      },
      {
        type:'elegent',
        name:'雅致',
        selected: false,
        img: require('resource/images/theme4.jpg'),
        property: {
          body: {
            backgroundColor: 'linear-gradient(to bottom left, #3e4498, #087397)',
            backgroundImage: ''
          },
          chart: {
            backgroundColor: 'rgba(0, 0, 0, 0.25)',
            titleBackgroundColor:'',
            textColor: ['#fff','#6290b5'],
            color: ['#ea7d2a','#f6c802','#2ec34d','#00bba8' ,'#1592ff','#515c72'],
            borderRadius: 3,
            margin: 10,
            borderColor:'',
            lineColor:['#8589ba','#28497f'],
          },
          activeTheme: 'elegent'
        }
      },
      {
        type:'business',
        name:'商务',
        selected: false,
        img: require('resource/images/theme5.jpg'),
        property: {
          body: {
            backgroundColor: 'linear-gradient(to bottom right, #2b375e , #345676)',
            backgroundImage: ''
          },
          chart: {
            backgroundColor: 'transparent',
            textColor: ['#fff','#94a5bc'],
            titleBackgroundColor:'',
            color: ['#1CD9FC','#869EEE','#93FA93','#E98A25','#F55C5C','#2DDB24'],
            borderRadius: 0,
            margin:'',
            borderColor:'#526286',
            lineColor:['#6a6f88','#475574'],
          },
          activeTheme: 'business'
        }
      },
      {
        type:'stable',
        name:'安稳',
        selected: false,
        img: require('resource/images/theme6.jpg'),
        property: {
          body: {
            backgroundColor: '#1e1e1e',
            backgroundImage: ''
          },
          chart: {
            backgroundColor: 'rgba(255, 255, 255, 0.09)',
            textColor: ['#ddd','#bbb'],
            //fill 为echart 使用
            // 
            titleBackgroundColor: {type:'linear',x:0,y:0,x2:0,y2:1,colorStops:[{offset:0,color:'rgba(255,255,255,.5)'},{offset:0.3,color:'rgba(255,255,255,.09)'}, {offset:1,color: 'transparent'}],globalCoord:false},
            titleHeight: '',
            color: ['#50d67b','#48d0e1','#b6acea','#d8a759','#5185bf','#b9c8cb'],
            borderRadius: 3,
            margin: 10,
            borderColor:'',
            lineColor:['#6f6f6f','#434343'],
          },
          activeTheme: 'stable'
        }
      },
      {
        type:'dark',
        name:'酷黑',
        selected: false,
        img: require('resource/images/theme7.jpg'),
        property: {
          body: {
            backgroundColor: '#171926',
            backgroundImage: ''
          },
          chart: {
            backgroundColor: '#24273E',
            titleBackgroundColor:'',
            textColor: ['#FFFFFF','#6A6F88'],
            color: ['#3FB27E','#9BCC66','#C7CCAC','#F7C51A','#4565E0','#22A3D9','#CC45E0'],
            borderRadius: 3,
            margin:10,
            borderColor:'',
            lineColor:['#3b3f57','#262941'],
          },
          activeTheme: 'dark'
        }
      },
      {
        type:'custom',
        name:'自定义',
        selected: false,
        img: require('resource/images/theme8.jpg')
      },
    ];

const colors = [
  {
    type:'default',
    name:'默认',
    selected: true,
    img: '',
    color:['#31D3E8','#9ECD47','#1EA6E1','#FAC603','#FFA168','#86A8B6']
  },
  {
    type:'elegent',
    name:'优雅',
    selected: false,
    img: '',
    color:['#95BFBA','#C6D5DE','#D5B0C1','#BA4871','#4C6E79','#84B7C1']
  },
  {
    type:'business',
    name:'商务',
    selected: false,
    img: '',
    color:['#1ACAFB','#57C4FF','#098FF0','#1E5BF4','#0345BD','#004566']
  },
  {
    type:'bright',
    name:'明亮',
    selected: false,
    img: '',
    color:['#FFD539','#FF6883','#20C6FD','#F29D2F','#8685F9','#86EB30']
  },
  {
    type:'clear',
    name:'清晰',
    selected: false,
    img: '',
    color:['#F6F5F8','#FFF3A5','#FCCF78','#D2C23F','#37A54C','#A4DF89']
  },
  {
    type:'stable',
    name:'安稳',
    selected: false,
    img: '',
    color:['#B7C7C9','#294159','#3E686B','#68E214','#47CFE1','#416B8F']
  },
  {
    type:'lignt',
    name:'轻快',
    selected: false,
    img: '',
    color:['#03BBF9','#F6DD69','#77E75D','#A686FD','#FF95ED','#83E2FB']
  },
  {
    type:'colors',
    name:'多彩',
    selected: false,
    img: '',
    color:['#28D6F4','#3ED732','#ECB657','#F464E5','#EA7222','#F85672']
  },
];
const backgroundImage = [
  {
    type:'default',
    name:'无',
    selected: true,
    img: '',
    backgroundImage:''
  },
  {
    type:'paper',
    name:'信纸',
    selected: false,
    img: '',
    backgroundImage:'/filename/api/repos/%3Apublic%3Acde%3Aimages%3Apaper.jpg/content'
  },
  {
    type:'bluesky',
    name:'天空',
    selected: false,
    img: '',
    backgroundImage:'/filename/api/repos/%3Apublic%3Acde%3Aimages%3Abluesky.jpg/content'

  },
  {
    type:'sunlight',
    name:'光晕',
    selected: false,
    img: '',
    backgroundImage:'/filename/api/repos/%3Apublic%3Acde%3Aimages%3Asunlight.jpg/content'
  },
  {
    type:'sea',
    name:'海水',
    selected: false,
    img: '',
    backgroundImage:'/filename/api/repos/%3Apublic%3Acde%3Aimages%3Asea.jpg/content'
  },
  {
    type:'sunset',
    name:'日落',
    selected: false,
    img: '',
    backgroundImage:'/filename/api/repos/%3Apublic%3Acde%3Aimages%3Asunset.jpg/content'
  },
  {
    type:'galexy',
    name:'银河',
    selected: false,
    img: '',
    backgroundImage:'/filename/api/repos/%3Apublic%3Acde%3Aimages%3Agalexy.jpg/content'
    
  },
  {
    type:'buzi',
    name:'商务',
    selected: false,
    img: '',
    backgroundImage:'/filename/api/repos/%3Apublic%3Acde%3Aimages%3Abuzi.jpg/content'
  },
];
class PanelTheme extends Component {
  
  constructor(props) {
    super(props);
    this.init();
    this.state = {
      custom: this.theme().activeTheme == 'custom',
      themes: themes.slice(0),
      color: colors.slice(0),
      backgroundImage:backgroundImage.slice(0),

    };
    
  }
  init() {
    this.theme = this.getTheme();
  }
  getTheme() {
    let theme = window.Dashboard.globalParam.globalParam.theme;
    return function() {
      return theme;
    }
  }
  setTheme(newTheme) {
    console.log(newTheme);
    //更新画布中所有的图表样式
    this.updateComponents(newTheme);
    //同步主题数据到全局
    return window.Dashboard.util.deepAssign(window.Dashboard.globalParam.globalParam.theme, newTheme)
  }
  //通过组件实例 update 方法 更新组件
  updateComponents(themeUpdated) {
    themeUpdated.chart && window.Dashboard.compManager.components.forEach(instance => {
      instance.update({
        option: themeUpdated.chart
      });
    });
  }
  colorchange(e) {
    console.log(e)
  }
  themeChoice(e, type) {
    let property = '';
    let tempObj = {
      custom: false
    };
    if(type) {
      if(type == 'custom') {
        tempObj.custom = true;
        property = {activeTheme: 'custom'};
      }
      else {
        tempObj.custom = false;
        property = this.state.themes.filter(el => el.type == type)[0].property;
      }

      this.setState(tempObj);
     
      this.setTheme(property);
       //触发主题变动
      window.Dashboard.event.dispatch('themeChange', {});
      
    }
  }
  handleBlock(typeProperty, e, type) {
    // const className = e.target.className;
    
    // const type = e.target.getAttribute('type');
    const needed = this.state[typeProperty].filter(el => el.type == type)[0][typeProperty];
    this.customChange(typeProperty, needed);
    
    return false;
  }
  customChange(type, e) {
    const theme = this.props.activeTheme;
    
    let themeConfig = {
      color: e => ({chart: {color: e}}),
      chartbackgroundColor: e => ({chart: {backgroundColor: e.rgba}}),
      textColor: e => ({chart: {textColor: e}}),
      lineColor:  e => ({chart: {lineColor: e}}),
      bodybackgroundColor:  e => ({body: {backgroundColor: e.rgba}}),
      backgroundImage: e => ({body: {backgroundImage: e}}),
    }[type](e);
    //触发页面跟新
    this.setState({
      themeChange: true
    });
     //同步主题数据到全局管理里面
    this.setTheme(themeConfig);
    //立即设置背景
    if(type == 'backgroundImage' || 
       type == 'bodybackgroundColor') {
       window.Dashboard.event.dispatch('themeChange', {});
    }
   
    
  }
  render() {
    const activeTheme = this.theme();
    return (
    <Scrollbars autoHide style={{height:"100%"}}>
    <div className="panel-theme panel-row">
      <h3 style={{fontWeight:'bolder'}}>系统主题</h3>
      <h4 style={{lineHeight: '40px'}}>主题选择</h4>
      <div className="theme-wrap" >
        {
          this.state.themes.map((theme,i )=> {
            return <div className="theme-card" onClick={e => this.themeChoice(e, theme.type)} key={i} type={theme.type} style={{border: activeTheme.activeTheme == theme.type ? '1px solid #29B7F4' : 'none'}}>
                      <img className="theme-avatar" src={theme.img} title={theme.name} width="67" height="52" />
                      <span>{theme.name}</span>
                   </div>
          })
        }
      </div>

      {
        activeTheme.activeTheme == 'custom' ? <div className="custom-panel" >
          <h3 style={{lineHeight: "40px",fontWeight:'bolder'}}>自定义主题</h3>
          <h4 style={{lineHeight: "40px"}}>图表色彩</h4>
          <div className="theme-wrap" >
            {
              this.state.color.map((theme,i )=> {
                return <div className="theme-card" onClick={e => this.handleBlock('color',e, theme.type)} key={i} type={theme.type} style={{border: JSON.stringify(activeTheme.chart.color) == JSON.stringify(theme.color) ? '1px solid #29B7F4' : 'none',height:'auto'}}>
                          <div className="theme-avatar" style={{fontSize:0}}>
                            {
                              theme.color.map((color,ii) => <i key={ii} style={{margin:"0 1px 1px 0",width:20,height:20,display:'inline-block',backgroundColor:color}}></i>)
                            }
                          </div>
                          <span>{theme.name}</span>
                      </div>
              })
            }
          </div>
          <Row  type="flex" style={{margin:'15px 0'}} >
            <Col span={7} style={{marginRight:'9px'}}>图表背景色彩</Col>
            <Col span={15}>
              <ColorPicker
                type="normal"
                position={['br','tl']}
                color={activeTheme.chart.backgroundColor}
                onChange={e => this.customChange('chartbackgroundColor',e)}
                
              />
            </Col>
          </Row>
          <Row type="flex" style={{marginBottom:'15px'}} >
              <Col span={7} style={{marginRight:'9px'}}>图表文字色彩</Col>
              <Col span={15}>
                <ColorPicker
                  type="listColor"
                  limitColors={2}
                  position={['br','tl']}
                  color={activeTheme.chart.textColor}
                  onChange={e => this.customChange('textColor',e)}
                />
              </Col>
          </Row>
          <Row type="flex" style={{marginBottom:'15px'}} >
              <Col span={7} style={{marginRight:'9px'}}>图表线条色彩</Col>
              <Col span={15}>
                <ColorPicker
                  type="listColor"
                  limitColors={2}
                  position={['br','tl']}
                  color={activeTheme.chart.lineColor}
                  onChange={e => this.customChange('lineColor',e)}
                />
              </Col>
          </Row>
          <Row type="flex" style={{marginBottom:0}}>
              <Col span={7} style={{marginRight:'9px'}}>整体背景色彩</Col>
              <Col span={15}>
                <ColorPicker
                  type="normal"
                  position={['br','tl']}
                  color={activeTheme.body.backgroundColor}
                  onChange={e => this.customChange('bodybackgroundColor',e)}
                />
              </Col>
          </Row>
          <h4 style={{lineHeight: "40px"}}>背景图片</h4>
          <div className="theme-wrap">
            {
              this.state.backgroundImage.map((theme,i )=> {
                return <div className="theme-card" onClick={e => this.handleBlock('backgroundImage',e, theme.type)} key={i} type={theme.type} style={{border: activeTheme.body.backgroundImage == theme.backgroundImage ? '1px solid #29B7F4' : 'none',height:'auto'}}>
                          <img src={theme.backgroundImage} title={theme.name} width="64" height="42" />
                          <span>{theme.name}</span>
                      </div>
              })
            }
          </div>
        </div> : null
      }
    </div>
    </Scrollbars>
    )
  }
}


export default PanelTheme;