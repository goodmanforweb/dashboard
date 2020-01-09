//全局参数管理   包括全局变量,主题等
//数据格式为{
//	parmas:[
//		{
//			name: ,type: ,value: ,key: 
//		}
//	],
//	theme: [
//		
//	]
//}
import Util from '../util/util';
let theme = {
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
};

//页面代码注入
let cssAndJs = {
  cssCode: '',
  jsCode: '',
};
class GlobalParam {
	constructor(dashboard){
		this.globalParam = dashboard.globalParams || {
      params:new dashboard.store(true),
      theme: theme,
      cssAndJs,
      saveInfo: {},
      globelProps: {
        width: 'auto'
      },
      freshPeriod: {
        period: 10,
        state: false
      }
    };
    this.params = this.globalParam.params;
	  this.init();
	}
	//初始化  向参数数组里面添加实例
	//暂定再编译存储的字段为 this.globelParam.parmas
	init(){
		this.params.length && this.parmas.forEach( e => {
			new Params(e);
		});
  }
  //设置全局属性  宽高
  updateGlobelProps(type,value){
    this.globalParam.globelProps[type] = value;
  }
  /**
   * 批量创建参数，只通知一次
   * @param {array} props 
   */
  addParams(props) {
    let paramFactory =window.Dashboard.params;
    props.forEach(prop => {
      this.params.add(new paramFactory(prop));
    });
    this._triggerNotice();
  }
  /**
   * 添加一个参数
   */
  addParam() {
    return this.addParams([{}])
  };
  
  /**
   * 批量删除参数，只通知一次
   * @param {array} ids 
   */
  removeParams(ids) {
    ids.forEach(id => {
      //调用实例remove
      this.params.get(id).remove();
      //移除store中的实例
      this.params.remove(id);
    });
    this._triggerNotice(ids);
  }
  /**
   * 批量修改参数，只通知一次
   * @param {array} props 
   */
  updateParams(props) {
    props.forEach(prop => {
      this.getParam(prop.id).set(prop);
    });
    this._triggerNotice(props.map(p=>p.id));
  }
  getParam(id){
    return this.params.get(id); 
  }
  getParams(ids) {
    return ids.map(id => this.params.get(id));
  }
  getParamsByName(name) {
    return this.params.getAll().find(paramObj => paramObj.name === name);
  }
  getParamsByNames(names) {
    return names.map(name => this.getParamsByName(name));
  }
  setParamValueById(id, value) {
    return id && this.updateParams([{id, value}])
  }
  /**
   * 参数值改变 就通过组件参数监听接口 paramListenedChange 通知组件
   * @param {*} id 
   */
  _triggerNotice(ids) {
    //通过查看listeners中是否含有修改的ids,精确通知组件实例
    ids && window.Dashboard.compManager.components.forEach( cmp => {
      let { listeners } = cmp.cfg, parametersInListeners = [], parametersInQueryParam = [];
      //listeners 中 具有的改变参数
      let theSameInListeners = window.Dashboard.util.findSameFromArrs(ids, listeners);
      //数据源中param 具有的改变的参数
      //值针对有数据源的组件
      if(cmp.cfg.chartDefinition.query) {
        let rawParamsIds = Util._.isEmpty(cmp.cfg.chartDefinition.query.rawParamsIds) ? [] : cmp.cfg.chartDefinition.query.rawParamsIds;
        let theSameInQueryParam = window.Dashboard.util.findSameFromArrs(ids, rawParamsIds);
        //只要 两者 有一个具有改变的参数 ，就通知组件 只给发生变化了的参数
        if(theSameInListeners.length > 0 || theSameInQueryParam.length > 0) {
          theSameInListeners.forEach(id => parametersInListeners.push(this.getParam(id)));
          theSameInQueryParam.forEach(id => parametersInQueryParam.push(this.getParam(id)));
          cmp.paramListenedChange(parametersInListeners, parametersInQueryParam);
        } 
      }
    });

    // 同时抛出参数变化事件，
    window.Dashboard.event.dispatch('paramChange', this.params.getAll());
    
  }
  
}
export default GlobalParam