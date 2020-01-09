import WidgetBase from 'corejs/components/base';
import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Radio } from 'antd';

export default class RadioWidget extends WidgetBase {
  static cname='单选款';
  constructor(htmlObj, cfg) {
    super(htmlObj, cfg);
  }
  widgetWillCreated(cfg) {
    super.widgetWillCreated(cfg);
    this.div = document.createElement('div');
    this.div.setAttribute("id",cfg.id);
    this.handleDefinition(cfg.chartDefinition);
    return this.rootDom = this.div;
  }
  handleDefinition(nextCfg) {
    for(let cname in nextCfg) {
      this.dispatchDefinition(cname, nextCfg[cname])
    }
  }
  setItem(container, value, valueAsId) {
    var self = this;
    let myRadioName = "myRadio" + new Date().getTime();
    class MyRadio extends React.Component {
      constructor(props) {
          super(props);
      }
      state = {
          "value"  : null
      }
      onChange = (e)=>{
        let selected = window.document.getElementById(self.cfg.id).getElementsByClassName("ant-radio-checked");
        if(selected.length > 0){
          for(let i = selected.length-1; i > -1; i--){
            selected[i].classList.remove("ant-radio-checked");
          }
        }
        e.target.parentElement.classList.add("ant-radio-checked");
        self.setParameter(e.target.value);
      }

      componentDidMount = ()=>{
          self.subscribe("parameterChange", (d)=>{
              this.setState({ "value" : d.value});
          });
          $("#"+self.cfg.id+" .ant-radio-group").css("color","inherit");
          $("#"+self.cfg.id+" .ant-radio-wrapper").css("color","inherit");
      }

      render() {
        let children = self.setRadioOptions.call(this, value, valueAsId, myRadioName);
        return(
          <div>{children}</div>
        )
      }
    }
    ReactDOM.render(
        <MyRadio />,
        container
    ); 
    this.setSelected(self.cfg.parameter);
  }

  setSelected(parameter) {
    if(!parameter || !this.getParameter(parameter))return false;
    let value = this.getParameter(parameter).getValue();
    //设置parameter对应值 到radio
    this.dispatch("parameterChange", {"value" : value});
  }

  setRadioOptions(value,valueAsId,name){
    let self = this;
    let options = [];
    if(value && value.resultset){
      for(var i = 0; i < value.resultset.length; i++){
        let item = value.resultset[i];
        let _key = name + i;
        let _value = valueAsId ? item[0] : item[1] ;
        let _checked = self.state.value === _value.toString();
        options.push(<Radio onClick = {self.onChange} value={_value} key={_key} checked = {_checked}>{_value}</Radio>)
      }
    }
    return options;
  }

  
  dispatchDefinition(type, value) {
    switch(type) {
      case 'data':
              this.setItem(this.div, value, this.cfg.chartDefinition.option.valueAsId);
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
      case 'textColor':
          this.htmlObj.style.color = typeof(value) === "string" ? value : value[0];
          this.cfg.chartDefinition.option[type] = typeof(value) === "string" ? value : value[0];
      break;
      case 'valueAsId':
              //数据操作
              this.setItem(this.div, this.cfg.chartDefinition.data, value);
              this.cfg.chartDefinition.option.valueAsId = value;
      break;
      case 'value':
              this.cfg.chartDefinition.option.value = value;
              this.cfg.parameter = value;
              //修改了parameter值之后，应该把parameter对应的值 放入 到select中
              this.setSelected(value);
      break;
      default:
      break; 
      
    }
  }
  widgetDidCreated(cfg) {
    super.widgetDidCreated(cfg);
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
  }
  destroy() {
  }
}