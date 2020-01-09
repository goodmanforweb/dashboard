import WidgetBase from 'corejs/components/base';

export default class TextWidget extends WidgetBase {
  static cname='文本';
  constructor(htmlObj, cfg) {
    super(htmlObj, cfg);
  }
  widgetWillCreated(cfg) {
    super.widgetWillCreated(cfg);
    this.div = document.createElement('div');
    this.handleDefinition(cfg.chartDefinition);
    return this.rootDom = this.div;
  }
  widgetDidCreated(cfg) {
    super.widgetDidCreated(cfg);
    //设置 垂直居中
    this.htmlObj.style.position = 'relative';
    this.div.style.cssText = 'word-break: break-all;width:100%;position: absolute;top:50%;transform: translateY(-50%);-ms-transform: translateY(-50%);-moz-transform: translateY(-50%);';
    this.htmlObj.appendChild(this.div);
    
  }
  preUpdate(nextCfg) {
    super.preUpdate(nextCfg);
    this.handleDefinition(nextCfg);
  }
  postUpdate(nextCfg) {
    super.postUpdate(nextCfg);
  
  }
  draw() {
    this.div.innerHTML = this.createText();
  }
  destroy() {
    
  }
  //参数监听钩子
  paramChanged() {
    this.draw();
  }
  /**
   * 
   * @param {Array} listenersObj 
   * @param {String} paramName 
   */
  paramNameMapValue(listenersObj, paramName) {
    let paramFinded = listenersObj.find(paramObj => {
      if(paramObj.name === paramName) {
        return true;
      }
      return false;
    });
    return paramFinded ? paramFinded.getValue() : undefined;
  }
  createText() {
    let listeners = this.cfg.listeners, content = this.cfg.chartDefinition.option.content;
    let listenersObj = window.Dashboard.globalParam.getParams(listeners);
                                            //${para}  para
    let newContent = content.replace(/\$\{(\w+)\}/ig, (parameterWith$, parameterName) => {
      return this.paramNameMapValue(listenersObj, parameterName);
    });

    return newContent;
  }
  handleDefinition(nextCfg) {
    for(let cname in nextCfg) {
      this.dispatchDefinition(cname, nextCfg[cname])
    }
  }
  
  setStyle(div, key,value) {
    div.style[key] = value;
  }
  
  getParamFromContent(content) {
    this.cfg.listeners = [];
    let reg =  /\$\{(\w+)\}/ig, results = null, resultArr = [];
    do {
      results = reg.exec(content);
      if(results) {
        resultArr.push(results[1]);
      }
    }
    while (reg.lastIndex > 0);
    //参数名数组
    if(resultArr.length > 0) {
      return window.Dashboard.globalParam.getParamsByNames(resultArr).map(paramObj => paramObj.id);
    }
   return [];
  }
  handleData(value) {
    // let textValue = null;
    // if(value.metadata) {
    //   let textValueInfo = value.metadata.find(el => el.colName == 'textValue');
    //   if(textValueInfo) {
    //     textValue = value.resultset[0][textValueInfo.colIndex];
    //   } 
    // }
    if(value && value.resultset) {
      return value.resultset.reduce((prev, next) => {
        return prev+ next.join('')
      }, '');
    }
    return '';
  }
  dispatchDefinition(type, value) {
    switch(type) {
      case 'data':
          let textData = this.handleData(value);
          textData && this.setParameter(textData);
          this.cfg.chartDefinition.data = value;
      break;
      case 'option': 
              this.handleDefinition(value);
      break;
      case 'backgroundColor':
            this.htmlObj.style.backgroundColor = value;
            this.cfg.chartDefinition.option[type] = value;
            if(this.cfg.parentId){
              this.htmlObj.style.backgroundColor = "rgba(0, 0, 0, 0)";
              this.cfg.chartDefinition.option[type] = "rgba(0, 0, 0, 0)";
            }
      break;
      case "textColor":
          this.htmlObj.style.color = value[0];
          this.cfg.chartDefinition.option[type] = value;
      break;
      // case {height: 'height',width:'width',/*borderColor:'borderColor'*/}[type]:
      //         this.setStyle(this.div, type, value);
      //         this.cfg.chartDefinition.option[type] = value;
      // break;
      case 'content':
      //内容改变，就重新从中获取参数，然后设置到listeners上；
              this.cfg.listeners = this.getParamFromContent(value);
              this.cfg.chartDefinition.option.content = value;
      break;        
      case 'value':
            this.cfg.chartDefinition.option.value = value;
            this.cfg.parameter = value;
            let textData2 = this.handleData(this.cfg.chartDefinition.data);
            textData2 && this.setParameter(textData2);
      default: 
      
    }
  }
  
}