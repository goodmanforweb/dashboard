import React, { Component } from "react";
import ReactDOM from "react-dom";

import {
    Col,
    Row,
    Radio,
    Slider,
    Table,
    Input,
    Popover,
    Button,
    Icon,
    Popconfirm,
    message,
    Select
} from "antd";
const Option = Select.Option;
// import CodeMirror from 'react-codemirror'
import CodeMirror from "./codeMirror";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/css/css";

const textConStyle = {
    backgroundColor: "#eaedee",
    position: "absolute",
    top: "0",
    left: "0",
    bottom: "0",
    right: "0",
    margin: "auto",
    padding: "10px",
    width: "60%",
    height: "calc(100% - 20px)",
    boxShadow: "1px 0 2px #666,-1px 0 2px #555,0 -1px 2px #666,0 1px 2px #555"
};
//codemirror实例  this.ref.codeMirror   可使用dom操作方法操作
//replaceSelection 为在当前光标处插入代码

//赋值下拉框组件
class MySelect extends Component {
    constructor(props) {
        super(props);
        this.config = {
            param: {
                width: 100,
                defaultValue: "插入参数"
            },
            func: {
                width: 200,
                defaultValue: "插入方法"
            }
        }[props.type];
    }
    changeType(value) {
        this.props.thisRefEvent(value);
    }
    render() {
        return (
            <Select
                style={{ width: this.config.width }}
                placeholder={this.config.defaultValue}
                onChange={value => this.changeType(value)}
                dropdownStyle={{ position: "fixed" }}
            >
                {this.props.params.map((item1, index) => (
                    <Option key={index} value={item1}>
                        {item1}
                    </Option>
                ))}
            </Select>
        );
    }
}
//函数名列表配置
const functionName = [
    "Dashboards.contexts",
    "Dashboards.addComponent",
    "Dashboards.addParameter",
    "Dashboards.getQuery",
    "Dashboards.getQueryParameter",
    "Dashboards.getParameterValue",
    "Dashboards.removeComponent",
    "Dashboards.updateComponent",
    "Dashboards.setParameter",
    "Dashboards.fireChange"
];
//css及js代码编辑器组件封装
class CssAndJsPopup extends Component {
    //组件构造器，初始化执行
    constructor(props) {
        super(props);
        this.state = {
            show: !!props.show,
            codeValue: props.value
        };
        this.codeValue = props.value;
    }
    //组件接收新参数props时执行
    componentWillReceiveProps(nextProps) {
        this.setState({
            show: !!nextProps.show,
            codeValue: nextProps.value
        });
        this.codeValue = nextProps.value;
    }
    changeParams(value, item) {
        // console.log(value,'itemitem');
        this.code.codeMirror.replaceSelection(value);
    }
    //输入值双向绑定
    onchange(val) {
        //获取当前值
        // this._thisCode = val;
        this.codeValue = val;
        this.setState(
            {
                codeValue: val
            },
            () => {
                this.props.onChange && this.props.onChange(val);
            }
        );
    }
    //关闭编辑器
    cancel(e) {
        if (
            e.target.id != "edite-layer" &&
            e.target.id != "edite-cancel-btn" &&
            e.target.id != "edite-cancel-icon"
        )
            return !1;
        this.props.onCancel && this.props.onCancel(e);
        this.hide();
    }
    //确定按钮点击
    OK(e) {
        this.props.onOK && this.props.onOK(this.codeValue);
        this.hide();
    }
    //隐藏
    hide(e) {
        this.setState({
            show: false
        });
    }
    //根据css和js设置宽高
    setHeight() {
        this.codeDom.style.cssText = `height: ${this.edite.clientHeight -
            (this.props.hasSelect ? 180 : 160) +
            "px"};width: 100%`;
    }
    //组件加载完成设置宽高
    componentDidMount() {
        this.codeDom = ReactDOM.findDOMNode(this.code);
        this.setHeight();
    }
    //组件更新完成设置宽高
    componentDidUpdate() {
        this.state.show && this.setHeight();
    }
    render() {
        const props = this.props;
        return (
            <div
                id="edite-layer"
                ref={edite => (this.edite = edite)}
                style={{
                    backgroundColor: "rgba(255,255,255,0.3)",
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    top: 0,
                    left: "0",
                    zIndex: 600,
                    display: { true: "block", false: "none" }[this.state.show]
                }}
                // onClick={e => this.cancel(e)}
            >
                <div style={textConStyle} className={"cssAndJsCon"}>
                    <Row
                        type="flex"
                        style={{ marginBottom: "15px" }}
                        justify="space-between"
                    >
                        <Col span={10}>
                            <h4>{props.title}</h4>
                        </Col>
                        <Col span={7}>
                            <span className="param-delete">
                                <Icon
                                    type="close"
                                    id="edite-cancel-icon"
                                    onClick={e => this.cancel(e)}
                                />
                            </span>
                        </Col>
                    </Row>
                    <Row type="flex">
                        <CodeMirror
                            style={{ width: "100%" }}
                            ref={code => (this.code = code)}
                            onChange={val => this.onchange(val)}
                            value={this.state.codeValue}
                            options={{
                                mode: this.props.type || "css",
                                lineNumbers: true
                            }}
                        />
                    </Row>
                    <Row
                        type="flex"
                        style={{ marginTop: "5px", marginBottom: "0" }}
                    >
                        {props.type === "javascript" &&
                        props.params &&
                        props.hasSelect ? (
                            <MySelect
                                {...this.props}
                                thisRefEvent={this.changeParams.bind(this)}
                                params={props.params}
                                type="param"
                            />
                        ) : (
                            ""
                        )}
                        {props.type === "javascript" && props.hasSelect ? (
                            <MySelect
                                {...this.props}
                                thisRefEvent={this.changeParams.bind(this)}
                                params={props.functionName || functionName}
                                type="func"
                            />
                        ) : (
                            ""
                        )}
                    </Row>
                    <Row
                        type="flex"
                        style={{ marginBottom: "15px" }}
                        justify="end"
                    >
                        <Button
                            id="edite-cancel-btn"
                            onClick={e => this.cancel(e)}
                        >
                            取消
                        </Button>
                        <Button
                            type="primary"
                            style={{ margin: "0 30px" }}
                            onClick={e => this.OK(e)}
                        >
                            确定
                        </Button>
                    </Row>
                </div>
            </div>
        );
    }
}

export default CssAndJsPopup;
