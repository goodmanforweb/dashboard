import WidgetBase from "corejs/components/base";
import React, { Component } from "react";
import ReactDOM from "react-dom";
// import './rc_select/selectCss.css';
// import { Select } from './rc_select/index';
import { Select } from "antd";
const Option = Select.Option;
import $ from "jquery";

export default class MultiselectWidget extends WidgetBase {
    static cname = "多选下拉";
    constructor(htmlObj, cfg) {
        super(htmlObj, cfg);
    }
    widgetWillCreated(cfg) {
        super.widgetWillCreated(cfg);
        //添加style
        this._mySelectStyle =
            $("#_mySelectStyle").length > 0
                ? $("#_mySelectStyle")
                : $('<style id="_mySelectStyle">').appendTo(document.head);
        window.aa_bb = $;
        this.div = $("<div>");
        this.div.css({
            width: "100%",
            height: "100%",
            "box-sizing": "border-box",
            padding: "5px"
        });
        this.handleDefinition(cfg.chartDefinition);
        return (this.rootDom = this.div[0]);
    }
    handleDefinition(nextCfg) {
        for (let cname in nextCfg) {
            this.dispatchDefinition(cname, nextCfg[cname]);
        }
    }
    listenerHandle(value) {
        let inputs = value.map(e => this.KeyToValue[e]);
        this.setParameter(inputs);
    }
    handleDataToOption(value, valueAsId, isChildren) {
        let children = [],
            _valueArr = [];
        this.KeyToValue = {};
        if (value && value.resultset) {
            _valueArr = value.resultset.map((e, i) => {
                let _key = i.toString(36) + i;
                this.KeyToValue[_key] = valueAsId ? e[1] : e[0];
                children.push(
                    <Option key={_key}>{valueAsId ? e[1] : e[0]}</Option>
                );
                return this.KeyToValue[_key];
            });
        }
        return isChildren ? _valueArr : children;
    }
    setItem(container, value, valueAsId, label) {
        let $container = $("#" + this.cfg.id),
            self = this,
            children = [];
        children = this.handleDataToOption(value, valueAsId);
        let _mySelectStyle = this._mySelectStyle;
        //重置下拉框的样式
        let resizeBox = () => {
            //获取弹出下拉框
            let aa = $("." + this.cfg.id + "_select");
            //添加样式
            _mySelectStyle.text(
                `.${this.cfg.id +
                    "_select"}{top: ${$container[0].getBoundingClientRect()
                    .top +
                    $container.outerHeight() +
                    "px!important"}}`
            );
            if (
                $("#background-container").height() <
                parseFloat(aa.css("top")) + aa.height()
            ) {
                _mySelectStyle.text(
                    `.${this.cfg.id + "_select"}{
                        top:auto!important;
                        bottom:-${$container[0].getBoundingClientRect().top +
                            "px!important"}
                }}`
                );
            }
        };
        function handleChange(value) {
            self.listenerHandle(value);
            resizeBox();
        }
        function handleFocus() {
            resizeBox();
        }
        function handleSearch(value) {
            resizeBox();
        }
        self._select &&
            label === "data" &&
            ReactDOM.unmountComponentAtNode(container[0]);

        var _value = this._setdefaultValue(
            this.cfg.parameter,
            value,
            valueAsId
        );
        _value = _value
            ? _value.length
                ? { defaultValue: _value }
                : null
            : null;
        ReactDOM.render(
            <Select
                mode="tags"
                style={{
                    width: "100%",
                    height: "100%"
                }}
                placeholder="Tags Mode"
                onChange={handleChange}
                onFocus={resizeBox}
                {..._value}
                onSearch={handleSearch}
                dropdownClassName={this.cfg.id + "_select"}
            >
                {children}
            </Select>,
            container[0],
            function() {
                self._select = this;
                $("#" + self.cfg.id + " .ant-select-selection").css(
                    "backgroundColor",
                    "inherit"
                );
            }
        );
    }
    /**
     * 设置默认值
     * @param {*} parameter 监听的参数
     * @param {*} value 数据
     * @param {*} valueAsId 是value还是id
     */
    _setdefaultValue(parameter, value, valueAsId) {
        //获取默认参数
        let selfParam = this.setSelected(this.cfg.parameter);
        //获取数据
        let selfValueArr = this.handleDataToOption(value, valueAsId, true);
        selfParam = typeof selfParam != "object" ? [selfParam] : selfParam;
        return selfParam.filter(e1 => {
            var bb = selfValueArr.find(e2 => e1 === e2);
            return bb !== undefined;
        });
    }
    setSelected(parameter) {
        if (!parameter || !this.getParameter(parameter)) return false;
        let value = this.getParameter(parameter).getValue();
        return value;
    }
    dispatchDefinition(type, value) {
        let _option = this.cfg.chartDefinition.option;
        switch (type) {
            case "data":
                this.setItem(this.div, value, _option.valueAsId, "data");
                this.cfg.chartDefinition.data = value;
                break;
            case "option":
                this.handleDefinition(value);
                break;
            case "backgroundColor":
                this.htmlObj.style.backgroundColor = value;
                _option[type] = value;
                break;
            case "textColor":
                this.htmlObj.style.color = value[0];
                _option[type] = value;
                if (this.cfg.parentId) {
                    this.htmlObj.style.backgroundColor = "rgba(0, 0, 0, 0)";
                    _option[type] = "rgba(0, 0, 0, 0)";
                }
                break;
            case "valueAsId":
                //数据操作
                this.setItem(this.div, this.cfg.chartDefinition.data, value);
                _option.valueAsId = value;
                break;
            case "value":
                _option.value = value;
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
        console.log("widgetDidCreated");
        this.htmlObj.appendChild(this.rootDom);
    }
    preUpdate(nextCfg) {
        super.preUpdate(nextCfg);
        console.log("preUpdate", nextCfg);
        this.handleDefinition(nextCfg);
    }
    postUpdate(nextCfg) {
        super.postUpdate(nextCfg);
        console.log("postUpdate");
    }
    draw() {
        // this.setSelectOption(this.select, this.cfg.chartDefinition.data, this.cfg.chartDefinition.option.valueAsId);
        console.log("draw");
        // this.cfg.htmlObj.appendChild(this.widget)
    }
    destroy() {}
}
