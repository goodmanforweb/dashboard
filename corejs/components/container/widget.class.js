import WidgetBase from 'corejs/components/base';

export default class ContainerWidget extends WidgetBase {
  static cname='容器';
  constructor(htmlObj, cfg) {
    super(htmlObj, cfg);
  }
  widgetWillCreated(cfg) {
    super.widgetWillCreated(cfg);
    this.handleDefinition(cfg.chartDefinition);
  }
  handleDefinition(nextCfg) {
    for(let cname in nextCfg) {
      this.dispatchDefinition(cname, nextCfg[cname])
    }
  }
  dispatchDefinition(type, value) {
    switch(type) {
      case 'data':
      break;
      case 'option': 
              this.handleDefinition(value);
      break;
      case 'backgroundColor':
            this.htmlObj.style.backgroundColor = value;
            this.cfg.chartDefinition.option[type] = value;
      break;
      default: 
    }
  }
  preUpdate(nextCfg) {
    super.preUpdate(nextCfg);
    this.handleDefinition(nextCfg);
  }
}