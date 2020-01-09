import React ,{ Component } from 'react';
import {Icon} from 'antd';

class FolderWrap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fold: false
    };
  }
  setHeight() {
    //这种方式可以让组件节点随意扩充 **特征 对高度不定实现 transition 效果
    this.folderDom.style.transition = 'none';
    if(this.state.fold) {
      this.folderDom.style.height = window.getComputedStyle(this.folderDom).height;
      this.folderDom.clientWidth;//触发重排
      this.folderDom.style.transition = 'height .3s linear';
      this.folderDom.style.height = "0px";
    }
    else {
      const initHeight = window.getComputedStyle(this.folderDom).height;;
      this.folderDom.style.height = 'auto';
      const targetHeight = window.getComputedStyle(this.folderDom).height;
      this.folderDom.style.height = initHeight;
      this.folderDom.clientWidth;//触发重排
      this.folderDom.style.transition = 'height .3s linear';
      this.folderDom.style.height = targetHeight;
    }
  }
  foldController(type, e) {
    if(type == 'handle') {
      this.setState({
        fold: !this.state.fold
      }, () => {
        this.setHeight();
      });
    }
    else if(type == 'transitionend') {
      //如果是开启状态，动画完毕后，设置高度为auto,方便组件切换时，react不刷新dom 造成样式错误
      if(!this.state.fold) {
        this.folderDom.style.height = 'auto';
      }
    }
  }
  render() {
    const props = this.props;
    const className = "panel-block " + (props.className ? props.className : '');
    return (<div className={className}>
              <div className="panel-block-hd flex justify" onClick={e => this.foldController('handle', e)} style={{cursor: 'pointer'}}>
                <span className="panel-block-tit ">{props.name}</span>
                <span className="panel-block-arrow " style={{transform: this.state.fold ? "rotate(180deg)" : "rotate(0)", transition: "all .3s linear"}}><Icon type="up" /></span>
              </div>
              <div ref={dom => this.folderDom = dom } onTransitionEnd={e => this.foldController('transitionend',e)} className="panel-block-bd" style={{overflow:'hidden'}}>
                { props.children }
              </div>
          </div>)
  }
}


export default FolderWrap;