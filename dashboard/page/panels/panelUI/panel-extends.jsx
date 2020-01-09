import React, { Component } from "react";
// import CssAndJsPopup from '../panelComponents/cssAndJsPopup'
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
    Switch
} from "antd";
import { Scrollbars } from "react-custom-scrollbars";
const RadioGroup = Radio.Group;
const { TextArea } = Input;

class PanelExtends extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editeType: "",
            editeShow: false,
            code: this.getExtend()
        };
    }
    bigEditer(str) {
        this.setState({
            editeType: str,
            editeShow: true,
            code: this.getExtend()
        });
    }
    getExtend() {
        return window.Dashboard.globalParam.globalParam.cssAndJs;
    }
    setExtend(type, value) {
        type && (this.getExtend()[type] = value);
    }
    hideEdite() {
        this.setState({
            editeShow: false
        });
    }
    onChange(type, e) {
        this.getExtend()[type] = e.target.value;
        this.setState({
            code: this.getExtend()
        });
    }
    render() {
        let cssCodeEditor = {
            title: "CSS代码编辑器",
            type: "css",
            onOK: val => {
                this.setExtend("cssCode", val);
                this.hideEdite.call(this);
            },
            onCancel: this.hideEdite.bind(this),
            show: this.state.editeShow,
            value: this.state.code["cssCode"],
            onChange: e => console.log(e),
            hasSelect: false
        };
        let jsCodeEditor = {
            title: "JS代码编辑器",
            type: "javascript",
            onOK: val => {
                this.setExtend("jsCode", val);
                this.hideEdite.call(this);
            },
            onCancel: this.hideEdite.bind(this),
            show: this.state.editeShow,
            value: this.state.code["jsCode"],
            onChange: e => console.log(e),
            hasSelect: true
        };
        Dashboard.event.dispatch(
            "CssAndJsPop",
            this.state.editeShow
                ? {
                      ...(this.state.editeType === "css"
                          ? cssCodeEditor
                          : jsCodeEditor)
                  }
                : null
        );
        return (
            <Scrollbars autoHide style={{ height: "100%" }}>
                <div className="panel-row style">
                    <Row
                        type="flex"
                        style={{ marginBottom: "15px" }}
                        justify="space-between"
                        align="middle"
                    >
                        <Col span={10}>
                            <h4>CSS代码</h4>
                        </Col>
                        <Col span={4}>
                            <Icon
                                type="arrows-alt"
                                className="senior-code-btn openEditer"
                                onClick={e => this.bigEditer("css")}
                                title={"窗口放大"}
                            />
                        </Col>
                    </Row>
                    <Row type="flex" style={{ marginBottom: "15px" }}>
                        <TextArea
                            style={{ width: "90%", height: "300px" }}
                            value={this.state.code.cssCode}
                            onChange={e => this.onChange("cssCode", e)}
                        />
                    </Row>
                    <Row
                        type="flex"
                        style={{ marginBottom: "15px" }}
                        justify="space-between"
                        align="middle"
                    >
                        <Col span={10}>
                            <h4>JS代码</h4>
                        </Col>
                        <Col span={4}>
                            <Icon
                                type="arrows-alt"
                                className="senior-code-btn openEditer"
                                title={"窗口放大"}
                                onClick={e => this.bigEditer("javascript")}
                            />
                        </Col>
                    </Row>
                    <Row type="flex" style={{ marginBottom: "15px" }}>
                        <TextArea
                            style={{ width: "90%", height: "300px" }}
                            value={this.state.code.jsCode}
                            onChange={e => this.onChange("jsCode", e)}
                        />
                    </Row>
                    {/* this.state.editeShow ? <CssAndJsPopup  {...(this.state.editeType === 'css' ? cssCodeEditor : jsCodeEditor)}  /> : '' Dashboard.event.subscribe('CssAndJsPop'*/}
                </div>
            </Scrollbars>
        );
    }
}

export default PanelExtends;
