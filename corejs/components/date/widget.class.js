import WidgetBase from 'corejs/components/base';
import React, { Component } from "react";
import ReactDOM from "react-dom";
import { DatePicker } from 'antd';
import moment from 'moment';

export default class DateWidget extends WidgetBase {
  static cname='日期';
  constructor(htmlObj, cfg) {
    super(htmlObj, cfg);
  }
  widgetWillCreated(cfg) {
    super.widgetWillCreated(cfg);
    this.date = document.createElement('div');
    this.date.style.padding = "5px";
    this.handleDefinition(cfg.chartDefinition);
    return this.rootDom = this.date;
  }
  handleDefinition(nextCfg) {
    for(let cname in nextCfg) {
      this.dispatchDefinition(cname, nextCfg[cname])
    }
  }
  
  setItem(container, value) {
    let self = this;
    let parameter = self.cfg.parameter;
    let defaultValue = (parameter &&  self.getParameter(parameter) && self.getParameter(parameter).getValue()) ? self.getParameter(parameter).getValue() : "";
     class MyDatePicker extends React.Component {
      constructor(props) {
          super(props);
      }
      state = {
        value : defaultValue
      }

      disabledDate =(current)=>{
        let start = self.cfg.chartDefinition.option.startDate;
        let end =  self.cfg.chartDefinition.option.endDate;
        if(current && current._d){
          if( start && end){
            return  !(current._d.getTime() > new Date(start).getTime() && current._d.getTime()  < new Date(end).getTime());
          }else if(start && !end){
            return  !(current._d.getTime() > new Date(start).getTime());
          }else if(!start && end){
            return  !(current._d.getTime()  < new Date(end).getTime());
          }else{
            return false;
          }
        }else{
          return false;
        }
      }

      onChange = (value)=>{
        var result;
        if(value){
          result = value._d.getFullYear() 
                    +"-"+
                    (value._d.getMonth()+1 > 10 ? value._d.getMonth()+1 : "0" + (value._d.getMonth()+1))
                    +"-"+
                    value._d.getDate()
        }else{
          result = "";
        }
        this.setState({value : result});
        self.setParameter(result);
      }
      componentDidMount = ()=>{
        self.subscribe("parameterChange",(d)=>{
          this.setState({value : d.value});
        });
        $("#"+self.cfg.id+" .ant-calendar-picker-input").css("background","inherit");
        $("#"+self.cfg.id+" .ant-calendar-picker").css("color","inherit");
        $("#"+self.cfg.id+" .ant-calendar-picker-input").css("color","inherit");
      }
      render() {
          const tProps = {
            style: {
                width: "100%",
                height : "100%"
            },
            disabledDate: this.disabledDate,
            onChange: this.onChange,
            value : this.state.value === "" ? null : moment(this.state.value, "YYYY-MM-DD")
          };
          return <DatePicker {...tProps} />
        }
      }
      ReactDOM.render(
          <MyDatePicker/>,
          container
      ); 
  }
  /**
   * 
   * @param {*} parameter  参数的id
   */
  setValue(parameter) {
    if(!parameter || !this.getParameter(parameter))return false;
    let value = this.getParameter(parameter).getValue();
    this.dispatch("parameterChange", {"value" : value});
  }

  checkValue(){
    let start = this.cfg.chartDefinition.option.startDate;
    let end =  this.cfg.chartDefinition.option.endDate;
    let current = this.cfg.parameter  ? this.getParameter(this.cfg.parameter).getValue() : null;
    if(current){
      if((start && new Date(start).getTime() > new Date(current).getTime()) || (end && new Date(end).getTime() < new Date(current).getTime())){
        this.dispatch("parameterChange", {"value" : ""});
      }
    }
  }

  dispatchDefinition(type, value) {
    switch(type) {
      case 'data':
              this.setItem(this.date, value);
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
      case 'value':
              this.cfg.chartDefinition.option.value = value;
              this.cfg.parameter = value;
              //修改了parameter值之后，应该把parameter对应的值 放入 到select中
              this.setValue(value);
      break;
      case 'startDate':
          this.cfg.chartDefinition.option.startDate = value;
          this.checkValue();
      break;
      case 'endDate':
          this.cfg.chartDefinition.option.endDate = value;
          this.checkValue();
      break;
      default: 
      break;
    }
  }
  widgetDidCreated(cfg) {
    super.widgetDidCreated(cfg);
    console.log('widgetDidCreated');
    this.htmlObj.appendChild(this.date);
  }
  preUpdate(nextCfg) {
    super.preUpdate(nextCfg);
    console.log('preUpdate', nextCfg);
    this.handleDefinition(nextCfg);
  }
  postUpdate(nextCfg) {
    super.postUpdate(nextCfg);
    console.log('postUpdate');
  }
  draw() {
  }
  destroy() {
  }
}