import util from 'corejs/util/util'

//全局参数变量模块
class Params {
	constructor(props){
    this.id = props.id || 'params_' + +new Date();//id
    // this.id = props.id || 'params_good';//id
    this.name = props.name || '';//名称
    this.defaultValue = props.defaultValue || '';//默认值
		this.value = props.value || '';//值
    this.type = props.type || 'String';//类型
    this.init();
  	}
	init() {
    // window.Dashboard.globalParam.addParam(this);
    // this._hook(this.id);
  }
  set(obj) {
    for(let key in obj) {
      if(['name','defaultValue','value','type'].indexOf(key) > -1) {
        this[key] = obj[key];
      }
    }
  }
	setName(name) {
    this.name = name;
	}
	setValue(value) {
		this.value = value;
	}
	setType(string){
    this.type = type;
  }
  getValue() {
    return this.value || this.defaultValue;
  }
	// /**
	//  * 参数值改变 就通知全局参数 globalParam 下发通知
	//  * @param {*} id 
	//  */
	// _hook(id) {
	// 	return window.Dashboard.globalParam.triggerNotice(id);
	// }
	//删除参数
	remove() {
		this.name = null
		this.value = null
    this.type = null
    // window.Dashboard.globalParam.removeParam(this.id);
    // this._hook(this.id);
		// let params = Dashboard.GlobalParam.globalParam.params;
		// //删除数组下标
		// let ind = util.getInd(params, 'id', this.id);
		// params.splice(ind,1);
		//清楚绑定事件

  }
  getAllCfg() {
    let temp = {};
    ['id','name','defaultValue', 'value','type'].forEach(el => temp[el] = this[el]);
    return temp;
  }
}
export default Params