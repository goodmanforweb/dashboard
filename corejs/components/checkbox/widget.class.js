import WidgetBase from 'corejs/components/base';
import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Checkbox } from 'antd';
import { setTimeout } from 'timers';

export default class CheckBoxWidget extends WidgetBase {
  static cname='多选框';
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
    let self = this;
    let myCheckboxName = "myCheckbox" + new Date().getTime();
    class MyCheckbox extends React.Component {
      constructor(props) {
          super(props);
      }
      state = {
        defaultCheckedList : []
      };
      onChange = (e) => {
        //value值有可能重复，只勾选当前点击的项
        if(this.state.defaultCheckedList.length !== 0){
          let parentElementClass = e.nativeEvent.target.parentElement.classList;
          this.setState({"defaultCheckedList" : []},()=>{
            parentElementClass.contains("ant-checkbox-checked") ? parentElementClass.remove("ant-checkbox-checked") : parentElementClass.add("ant-checkbox-checked");
          });          
        }

        let checks = window.document.getElementsByName(myCheckboxName);
        let checkedList = [];
        for(let item of checks){
          if(item.checked && checkedList.indexOf(item.value) === -1){
            checkedList.push(item.value)
          }
        }
        self.setParameter(checkedList);
      }
      componentDidMount = ()=>{
        self.subscribe("parameterChange", (d)=>{
          this.setState({"defaultCheckedList" : d.value});
        });
        $("#"+self.cfg.id+" .ant-checkbox-group").css("color","inherit");
        $("#"+self.cfg.id+" .ant-checkbox-wrapper").css("color","inherit");
      }
      componentWillUnmount(){ 
        this.setState = (state,callback)=>{
          return;
        };  
      }
      render() {
        let children = self.setCheckboxOptions.call(this, value, valueAsId, myCheckboxName);
        return(
          <div>{children}</div>
          )
        }
      }
      ReactDOM.render(
          <MyCheckbox />,
          container
      ); 
      this.setSelected(self.cfg.parameter);
  }

  setSelected(parameter) {
    if(!parameter || !this.getParameter(parameter))return false;
    let value = this.getParameter(parameter).getValue();
    this.dispatch("parameterChange", {"value" : value});
  }

  setCheckboxOptions(value,valueAsId,name){
    let self = this;
    let options = [];
    if(value && value.resultset){
      for(var i = 0; i < value.resultset.length; i++){
        let item = value.resultset[i];
        let _key = name + i;
        let _value = valueAsId ? item[0] : item[1] ;
        if(self.state.defaultCheckedList.length === 0){
          options.push(<Checkbox onChange = {self.onChange} value={_value} name={name} key={_key}>{_value}</Checkbox>)
        }else{
          let _checked = self.state.defaultCheckedList.indexOf(_value.toString()) > -1;
          options.push(<Checkbox onChange = {self.onChange} value={_value} name={name} key={_key} checked = {_checked}>{_value}</Checkbox>)
        }
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
              this.setItem(this.div, this.cfg.chartDefinition.data, value)
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