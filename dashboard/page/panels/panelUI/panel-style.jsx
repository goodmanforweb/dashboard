import React ,{ Component } from 'react';
import PanelTempStyle from './panel-temp-style';



class PanelStyle extends Component {
  constructor(props) {
    super(props);
  }
  styleDispatcher(props) {
    let {name, data} = props.router;
    let cfg = window.cfgComponent[name], widgetNum = null;
    if(cfg) {
      //面板配置优先
      let style = cfg.panel.style;
      widgetNum = this.countWidget(name, data.id);
      if(style.panelcfg) {
        return <PanelTempStyle panelcfg={style.panelcfg} router={props.router} widgetNum = {widgetNum}/>;
      }
      //面板组件
      else if(style.panelcmp) {
        let PanelCmp = style.panelcmp;
        return <PanelCmp widgetNum = {widgetNum}/>;
      }
      else {
        return null;
      }
    }
  }
  countWidget(type, id) {
    let components = window.Dashboard.compManager.components;

    let tempStore=Object.create(null), numInfo = {};
    //对组件进行分类处理
    components.forEach(el => {
      if(!tempStore[el.cfg.type]) {
        tempStore[el.cfg.type] = [];
      }      
      tempStore[el.cfg.type].push({id:el.cfg.id});
    });
    // 找到当前组件 所在索引
    for(let i in tempStore) {
      if(i == type) {
        tempStore[i].forEach((el, index) => {
          if(el.id == id) {
            numInfo = {
              type: i,
              positionNum: index,
              totalNum: tempStore[i].length
            }
            return;
          }
        });
        break;
      }
    }

    return numInfo;
  }
  render() {
    return this.props.router ? this.styleDispatcher(this.props) : null
  }
}

export default PanelStyle;