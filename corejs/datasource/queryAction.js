
import axios from 'axios';
import once from './once';
export default class QueryAction {
  constructor(dashboard) {
    this.dashboard = dashboard;
    this.scriptArr = [];
  }
  fetch(queryObj, callback) {
    // Util.execRun(`return ${cfg.inject.preFetch}`)();
    axios(queryObj.getFetchCfg()).then((data)=>{
      callback(data.data);
    },()=>callback({}));
    /*setTimeout(function(){
      // Util.execRun(`return ${cfg.inject.postFetch}`)();
      var arr = [{name:'阿里',value:'alibaba'},{name:'百度',value:'baidu'},{name:'腾讯',value:'tencent'},{name:'京东',value:'jd'}];
      var haha = arr.sort(() => {
        return Math.random() > 0.5
      })
      callback(haha);
    }, 2000)*/
  }
  /**
   * 
   * @param {Object} obj  {[name], src}
   */
  getScriptOnce(obj) {
    return once.loadScript(obj);
  }
  getStyleOnce(obj) {
    return once.loadStyle(obj);
  }
  getScript(src) {
    if(this.scriptArr.indexOf(src) === -1){
      let script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.defer = true;
      script.src = src;
      document.head.appendChild(script);
      return new Promise((resolve, reject) => {
        script.onload = () => resolve()
        script.onerror = () => reject()
      })
    }else{
      return Promise.resolve();
    }
  }
  getStyle(href) {
    let links = document.head.getElementsByTagName('link'), isExit = false;
    for(let i=0, len=links.length; i< len;i++) {
      let link = links[i];
      if(link.href == href) {
        isExit = true;
        break;
      }
    }
    if(isExit) {
      return Promise.resolve();
    }
    const clink = document.createElement('link');
    clink.rel = 'stylesheet';
    clink.href = href;
    document.head.appendChild(clink);
    return new Promise((resolve, reject) => {
      clink.onload = () => resolve();
      clink.onerror = () => reject()
    });
  }

}