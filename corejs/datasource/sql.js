
class Jdbc{
	//
	constructor(cfg={}){
		this.type = 'sql';//类型
		this.query = (cfg && cfg.query) || '';//查询语句
		this.jndi = (cfg && cfg.jndi) || ''; //数据库名称
		this.param = (cfg && cfg.param) || '';//绑定参数
		this.url = '/filename/plugin/cda/api/query';
	}
	setDefineCfg(key, val){
		if(key === 'param'){
			this.param[val] || (this.param[val] = '');
		}else {
			this[key] = val;
		}
  }
  //创建url 参数，因为多选框会产生数组值，所以 要单独处理
  createParam() {
    let value, key, param = [];
    for(key in this.param) {
      value = this.param[key];
      if(Array.isArray(value)) {
        value.forEach(val => param.push(`${key}=${val}`));
      }
      else {
        param.push(`${key}=${value}`)
      }
    }
    return param.join('&');
  }
	getFetchCfg(){
		let formParams = 'type=sql&jndi='+encodeURIComponent(this.jndi)+'&query='+encodeURIComponent(this.query);
		return {
          method: 'post',
          //之所以把参数附在url后面，是因为axios的params只支持obj, urlRearchParams，而参数 中会有多个同名的key
		      url: `${this.url}?${this.createParam()}`,
		      // params: this.createParam(),
		      responseType: 'json',
		      headers: {
		        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
		        'Accept': 'application/json'
		      },
		      data: formParams.toString()
		    }
  }
  
  getAllCfg() {
    return {
      queryid: this.queryid,
      queryname: this.queryname,
      freshQuery: this.freshQuery,
      query: {
        type: this.type,
        query: this.query,
        jndi: this.jndi,
        param: this.param
      }
    }
  }
}
export default Jdbc