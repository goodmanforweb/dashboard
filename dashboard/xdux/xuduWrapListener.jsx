import React ,{ Component } from 'react';
//自动监听 与取消 组件
//监听事件类型 Array
let xuduWrapListener = function(listenerTypeArr) {
  return function(ReactCmp) {//react 组件
    return class XuduWrap extends Component {
            constructor(props) {
              super(props);
              this.state = {};
              this.listenerCallBacks = {};
              this.init();
            }
            init() {
              listenerTypeArr.forEach(listenerType => {
                this.state[listenerType] = '';
                //将监听事件 和 及其处理函数 缓存， 以便 组件销毁时 进行 取消监听；
                this.listenerCallBacks[listenerType] = data => this.setState({[listenerType]: data});
                window.Dashboard.event.subscribe(listenerType, this.listenerCallBacks[listenerType]);
              })
            }
            //这里 接受 props 我们不知道 是 一样组件props 变化，还是另外组件，有可能  listenerTypeArr, ReactCmp已经发生变化，所以没有开发完全
            //但是 就目前 业务 ，视乎 这个HOC 可以满足，所以 就 继续使用
            //如果后期 这里出现不可预期的bug，可以改成对象继承的方式去实现扩展 定义一个变化的钩子在在父类，子类就可以使用这个监听变化钩子
            componentWillReceiveProps(nextProps) {
              console.log(56565);
            }
            offListener() {
              let event = window.Dashboard.event;
              for (let listenerType in this.listenerCallBacks) {
                 event.unsubscribe(listenerType, this.listenerCallBacks[listenerType]);
              }
            }
            componentWillUnmount() {
              this.offListener();
            }
            render() {
              return <ReactCmp {...this.state}  {...this.props}/>
            }
          }
  }
}

export default xuduWrapListener;