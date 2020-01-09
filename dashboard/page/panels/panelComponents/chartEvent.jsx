import React, { Component } from "react";
import panelWidgets from "../panelWidgets/index";
import ChartEventTable from "./chartEventTable";
import Immutable, { Map, is } from "immutable";

let widget = {
    type: "string",
    cname: "点击事件",
    name: "clickEvent",
    widget: "XRadio",
    disable: false,
    visible: true,
    belongTo: "title",
    defaultValue: "null",
    option: [
        { name: "无", value: "null" },
        { name: "下钻", value: "drill" },
        { name: "数据交互", value: "interact" }
    ]
};
function copy(props) {
    let _widget = Immutable.fromJS(widget).toJS();
    return _widget.option.filter(
        e => (props.noDrill ? e.value !== "drill" : true)
    );
}
class Dirll extends Component {
    constructor(props) {
        super(props);
        this.init(props);
    }
    init(props) {
        this.inst = this.getInstFromSDK(props.data.id);
    }
    componentWillReceiveProps(nextProps) {
        this.init(nextProps);
    }
    widgetChange(type, e) {
        this.inst.update({ option: { [type]: e } });
        this.setState({
            ifShow: +new Date()
        });
    }
    getInstFromSDK(id) {
        return window.Dashboard.compManager.getComponent(id);
    }
    getValue() {
        return this.inst.cfg.chartDefinition.option.clickEvent;
    }
    render() {
        return (
            <div>
                {panelWidgets[widget.widget]({
                    key: "886_" + +new Date(),
                    value: this.getValue(),
                    defaultValue: widget.defaultValue,
                    options: copy(this.props),
                    name: widget.cname,
                    onChange: e => this.widgetChange(widget.name, e)
                })}
                {this.getValue() === "interact" ? (
                    <ChartEventTable Instance={this.inst} />
                ) : null}
            </div>
        );
    }
}
export default Dirll;
