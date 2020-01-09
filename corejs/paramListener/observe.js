
class Observe {
  constructor(){
    this.events = Object.create(null);
  }
  //触发监听
  dispatch(type, data){
    if(!type) return false;
    if(this.events[type]) {
      this.events[type].forEach(callback => {
        callback.call(this, data, type);
      })
    }
    else {
      console.log('%s 事件未订阅',type);
      return false;
    }
  }
  //订阅
  subscribe(type, callback) {
    if(!type || !callback) return false;
    if(!this.events[type]) {
      this.events[type] = [];
    }
    this.events[type].push(callback);
  }
  //取消监听， 毁掉函数 必须 和订阅时的一样
  unsubscribe(type, callback) {
    if(!type) return false;
    let listener, index;
    if(this.events[type]) {
      //存在callback，就删除指定的回调监听
      if(callback) {
        index = this.events[type].indexOf(callback);
        index > -1 && (this.events[type].splice(index, 1));
        // for(let i=0; i< listener.length; i++) {
        //   if(listener[i] === callback) {
        //     listener.splice(i, 1);
        //     break;
        //   }
        // }
      }
      //存在 就删除整个事件
      else {
        delete this.events[type];
      }
    }
    else {
      console.log('%s 事件未订阅',type);
      return false;
    }
  }
  hasListener(type) {
    if(!type) {
      console.warn('缺少必要参数');
      return null;
    }
    return this.events[type] ? true : false;
  }
  // destroy(type, callback) {
  //   if(!type) return false;
  //   if(this.events[type]) {
  //     delete this.events[type];
  //     callback && callback.call(this);
  //   }
  //   else {
  //     console.log('%s 事件未订阅',type);
  //     return false;
  //   }
  // }
}
// observe.subscribe('widgetMsg', function(data, type){
//   console.log('%s 事件触发,数据为 %s',type, JSON.stringify(data));
// })
// observe.dispatch('widgetMsg', {good:123});
export default Observe;
