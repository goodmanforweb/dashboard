import WidgetBase from "corejs/components/base";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Select } from "antd";
const Option = Select.Option;

export default class SelectWidget extends WidgetBase {
    static cname = "下拉框";
    constructor(htmlObj, cfg) {
        super(htmlObj, cfg);
    }
    widgetWillCreated(cfg) {
        super.widgetWillCreated(cfg);
        this.select = document.createElement("div");
        this.select.setAttribute("id",cfg.id);
        this.select.style.padding = "5px";
        this.handleDefinition(cfg.chartDefinition);
        return (this.rootDom = this.select);
    }
    handleDefinition(nextCfg) {
        for (let cname in nextCfg) {
            this.dispatchDefinition(cname, nextCfg[cname]);
        }
    }
    setSelectOption(select, value, valueAsId) {
        let self = this;
        let result = null;
        class MySelect extends React.Component {
            constructor(props) {
                super(props);
            }
            state = {
                "value"  : ""
            }
            onChange = (value)=>{
              this.setState({ "value" : value});
              //设置的value和实际的value需要转化
              let n = value.lastIndexOf("-");
              self.setParameter(value.substr(0,n));
            }
            componentDidMount = ()=>{
                self.subscribe("parameterChange", (d)=>{
                    let value  = result.valueList.indexOf(d.value.toString()) > -1 ? d.value : ""; 
                    this.setState({ "value" : value});
                });
                $("#" + self.cfg.id + " .ant-select-selection").css("backgroundColor","inherit");   
                $("#" + self.cfg.id + " .ant-select").css("color","inherit"); 
            }
            render() {
                result = self.setSelectOptions.call(this, value, valueAsId);
                const tProps = {
                  value: this.state.value,
                  onChange: this.onChange,
                  style: {
                      width: "100%",
                      height : "100%"
                  },
                };
                return <Select {...tProps} >{result.children}</Select>;
              }
        }
        ReactDOM.render(
            <MySelect />,
            select
        ); 
        
        this.setSelected(self.cfg.parameter)
    }

    setSelected(parameter) {
        if (!parameter || !this.getParameter(parameter)) return false;
        let value = this.getParameter(parameter).getValue();
        this.dispatch("parameterChange", {"value" : value});
    }

    setSelectOptions(value, valueAsId){
        let self = this;
        let children = [];
        let valueList = [];
        if(value && value.resultset){
            for(let i = 0; i< value.resultset.length; i++){
                let item = value.resultset[i];
                let _value = valueAsId ? item[0] : item[1];
                let _key = _value + "-" + i;
                valueList.push(_value.toString());
                children.push(<Option value={_key} key={_key}>{_value}</Option>);
            }
        }
        return {"children" : children, "valueList" : valueList};
    }
    
    dispatchDefinition(type, value) {
        switch (type) {
            case "data":
                this.setSelectOption(
                    this.select,
                    value,
                    this.cfg.chartDefinition.option.valueAsId
                );
                this.cfg.chartDefinition.data = value;
                break;
            case "option":
                this.handleDefinition(value);
                break;
            case "backgroundColor":
                this.htmlObj.style.backgroundColor = value;
                this.cfg.chartDefinition.option[type] = value;
                if(this.cfg.parentId){
                    this.htmlObj.style.backgroundColor = "rgba(0, 0, 0, 0)";
                    this.cfg.chartDefinition.option[type] = "rgba(0, 0, 0, 0)";
                  }
                break;
            case "textColor":
                this.htmlObj.style.color = typeof(value) === "string" ? value : value[0];
                this.cfg.chartDefinition.option[type] = typeof(value) === "string" ? value : value[0];
                break;
            case "valueAsId":
                //数据操作
                this.setSelectOption(
                    this.select,
                    this.cfg.chartDefinition.data,
                    value
                );
                this.cfg.chartDefinition.option.valueAsId = value;
                break;
            case "value":
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
        this.htmlObj.appendChild(this.select);
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
