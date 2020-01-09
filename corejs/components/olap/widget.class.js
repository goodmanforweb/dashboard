import WidgetBase from 'corejs/components/base';
export default class OlapWidget extends WidgetBase {
  static cname='多维';
  constructor(htmlObj, cfg) {
    super(htmlObj, cfg);
  }
  widgetWillCreated(cfg) {
    super.widgetWillCreated(cfg);
    this.handleDefinition(cfg.chartDefinition);
    this.htmlObj.style.display = 'flex';
    this.htmlObj.style.flexDirection = 'column';
    this.htmlObj.style.height = '100%';

    let olapdiv = this.olapdiv = document.createElement('div');
    this.olapdiv.style.flex = 1;
    this.olapdiv.style.height = '100%';

    olapdiv.className = 'workspace_results';
    return this.rootDom = olapdiv;
  }
  handleDefinition(nextCfg) {
    for(let cname in nextCfg) {
      this.dispatchDefinition(cname, nextCfg[cname])
    }
  }

  dispatchDefinition(type, value) {
    switch(type) {
      case 'data':
              this.cfg.chartDefinition.data = value;
      break;
      case 'option': 
              this.handleDefinition(value);
      break;
      case 'backgroundColor':
            this.htmlObj.style.backgroundColor = value;
            this.cfg.chartDefinition.option[type] = value;
      break;
      case {
        mode:'mode', 
        render: 'render', 
        zoom: 'zoom', 
        formatter: 'formatter', 
        title: 'title', 
        titlePosition: 'titlePosition',
        isExportData: 'isExportData',
        hideParent: 'hideParent',
      }[type]:

              
      break;
      case 'listeners':
        this.cfg.listeners = value;
      break;
      case 'file':
      //数据源切换 要 清楚 listeners  olapParametes
        this.cfg.chartDefinition.option[type] = value;
      break;
      case 'olapParameters':
        this.cfg.chartDefinition.option[type] = value;
        this.cfg.listeners = value.map(param => param.value).filter(v => !!v);
        break
      case 'currentOlapStatus': 
        this.cfg.chartDefinition.option[type] = value;
      default: 
      
    }
  }
  /**参数改变后的钩子，子类继承这个钩子 */
  paramChanged(obj1) {
    this.fetchMustAttach();
  }
  widgetDidCreated(cfg) {
    super.widgetDidCreated(cfg);
    this.htmlObj.appendChild(this.olapdiv);
  }
  preUpdate(nextCfg) {
    super.preUpdate(nextCfg);
    this.handleDefinition(nextCfg);
  }
  postUpdate(nextCfg) {
    super.postUpdate(nextCfg);
  }
  buildOlap(htmlObj, option) {
    let self = this;
    htmlObj.innerHTML = '';
    let paramValue = '';
    let params = option.olapParameters.map(param => {
      paramValue = param.value ? this.getParameter(param.value).getValue() : '';

      paramValue = Array.isArray(paramValue) ? paramValue.join(",") : paramValue;

      return {[param.name]: paramValue}
    });
    params = params.reduce((prev, next) => Object.assign({}, prev, next),{});
    let myClient = new SaikuClient({
      server: "/filename",
      path: "/plugin/saiku/api/cde-component"
    });
    try {
      myClient.execute({
        htmlObject: htmlObj,
        file: option.file,
        // mode: option.chart,
        // render: option.bar,
        // zoom: option.zoom,
        formatter: "",
        chartDefinition: {
          // height: 400,
          renderAfter: function() {
            setTimeout(function() {
              Array.from(document.querySelectorAll('.workspace_results text')).forEach(text => {
                text.style.fill = option.textColor[1];
              });
            });
          },
          colors: option.color,
          legendLabel_textStyle: option.textColor[1],
          extensionPoints: {
            baseAxisTitleLabel_textStyle: option.textColor[0],
            orthoAxisTitleLabel_textStyle: option.textColor[0],
            titleFontColor:option.textColor[0],

            baseAxisLabel_textStyle: option.textColor[1],
            orthoAxisLabel_textStyle: option.textColor[1],
            legendLabel_textStyle: option.textColor[1],
            label_textStyle:option.textColor[1],
            labelFontColor:option.textColor[1],
            valueFontColor:option.textColor[1],
            baseAxisRule_strokeStyle: option.lineColor[0],
            baseAxisGrid_strokeStyle: option.lineColor[0],

            orthoAxisRule_strokeStyle: option.lineColor[0],
            orthoAxisGrid_strokeStyle: option.lineColor[0],

            linkLine_strokeStyle: option.lineColor[1],

          }
        },
        //通过 id 获取 param 值， 然后 合成一个 对象
        params,
        loadBefore: function() {
          console.log('before');
          self.loader.show();
        },
        loadSuccess: function(data) {
          console.log('succ', data);
          self.loader.hide();
          self.processParams(data && data.query && Object.keys(data.query.parameters).length > 0 ? data.query.parameters : {});
        },
        loadFail: function() {
          self.loader.hide();
        }
      });
    } catch (error) {
      
    }
    
  }

  processParams(parameters) {
    

    //根据当前多维在更新 还是  切换file
    switch(this.cfg.chartDefinition.option.currentOlapStatus) {
      case 'filesouceChange':
        //包存到实例上  方便 下次 直接使用
        parameters = Object.keys(parameters).map((param, i) => ({name: param, value: '', key: i}));
        //返回来的 parameters  的 value  是  值， 而不是参数id ，所以需要转换
        this.cfg.chartDefinition.option.olapParameters = parameters;
        this.dispatch('olapParameters', parameters);
      break;
      case 'parametersChange':
        //如果是更新 就不 处理parameter

      break;
      default:
    }
    
    //这里涉及到  一个cfg 对应多个 olap问题，绑定参数后，如果返回参数为空，或者没有数据， 就会导致之前绑定的数据在页面上显示不出来
    //根本问题是  这个函数 ， 在多维 更新， 切换file 都要走这个函数， 导致处理不好
    
    
    
  }
  fetchMustAttach() {
    window.Dashboard.queryAction.getStyleOnce({
      href:'/filename/api/repos/%3Apublic%3Acde%3Alib%3Aolap.min.css/content',
      name: 'olapstyle'
    }).then(() => {
      console.log('多维样式加载完毕');
    });

    window.Dashboard.queryAction.getScriptOnce({
      src:'/filename/api/repos/%3Apublic%3Acde%3Alib%3Aolap.min.js/content',
      name: 'olapjs'
    }).then(() => {
      console.log(d3);
      console.log('多维js加载完毕');
      this.buildOlap(this.olapdiv, this.cfg.chartDefinition.option);
    });
    // this.buildOlap(this.olapdiv, this.cfg.chartDefinition.option);
  }
  draw() {
    if(this.cfg.chartDefinition.option.file) {
      this.fetchMustAttach();
    }
  }
  destroy() {
    // this.select.removeEventListener('change',() => {});
    // document.getElementById(this.cfg.id).remove();
    // this.cfg.htmlObj.removeChild(this.select)
    
  }
}