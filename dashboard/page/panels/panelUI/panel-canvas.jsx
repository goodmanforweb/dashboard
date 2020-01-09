import React, { Component } from "react";
import { Input, Select, Row, Col, Icon, Radio, Switch, Slider } from "antd";
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

import { dispatch } from "xdux";

class PanelCanvas extends Component {
    constructor(props) {
        super(props);
        let globalParam = window.Dashboard.globalParam.globalParam;
        this.state = {
            width: globalParam.globelProps.width,
            state: globalParam.freshPeriod.state,
            period: globalParam.freshPeriod.period,
            showGridBack: false
        };
        this.init();
    }
    init() {
        this.initParamListener();
    }
    initParamListener() {
        window.Dashboard.event.subscribe("globalParam", globalParam => {
            this.setState({
                width: globalParam.globelProps.width,
                state: globalParam.freshPeriod.state,
                period: globalParam.freshPeriod.period
            });
        });
    }
    canvasChange(type, e) {
        //_value赋值   为 ‘auto’或者字符
        var _value = e.target.value;
        if (type === "width") {
            _value = _value === "custom" ? 1200 : _value;

            //添加进corejs
            dispatch({
                type: "updateGlobelProps",
                value: {
                    type: "width",
                    value: _value
                }
            });

            //触发UI
            window.Dashboard.event.dispatch(
                "globalParam",
                Dashboard.globalParam.globalParam
            );

            this.setState(
                {
                    width: _value
                },
                () => {
                    _value != "auto" && this.dom.focus();
                }
            );
        } else if (type === "state") {
            this.setState(
                {
                    [type]: _value
                },
                () => {
                    Dashboard.globalParam.globalParam.freshPeriod[
                        type
                    ] = _value;
                    if (_value) {
                        this.freshdom.focus();
                    }
                }
            );
        } else if (type === "period") {
            this.setState(
                {
                    [type]: _value,
                    state: true
                },
                () => {
                    this.freshdom.focus();
                    Dashboard.globalParam.globalParam.freshPeriod = {
                        [type]: _value,
                        state: true
                    };
                }
            );
        }
    }
    render() {
        let state = this.state;
        return (
            <div>
                <Row>
                    <Col span={6}>画布宽度</Col>
                    <Col span={18}>
                        <RadioGroup
                            value={state.width === "auto" ? "auto" : "custom"}
                            onChange={e => this.canvasChange("width", e)}
                        >
                            <Radio value={"auto"}>自适应</Radio>
                            <Radio value={"custom"}>
                                固定
                                <input
                                    ref={e => (this.dom = e)}
                                    onChange={e =>
                                        this.canvasChange("width", e)
                                    }
                                    value={
                                        state.width === "auto"
                                            ? ""
                                            : state.width
                                    }
                                    type="number"
                                    style={{
                                        border: "1px solid #d9d9d9",
                                        width: 50
                                    }}
                                />
                                px
                            </Radio>
                        </RadioGroup>
                    </Col>
                </Row>
                <Row style={{ marginTop: 5 }}>
                    <Col span={6}>动态刷新</Col>
                    <Col span={18}>
                        <RadioGroup
                            value={state.state}
                            onChange={e => this.canvasChange("state", e)}
                        >
                            <Radio value={false}>关闭</Radio>
                            <Radio value={true} style={{ marginLeft: 14 }}>
                                间隔
                                <input
                                    ref={e => (this.freshdom = e)}
                                    onChange={e =>
                                        this.canvasChange("period", e)
                                    }
                                    value={state.state ? state.period : ""}
                                    type="number"
                                    style={{
                                        border: "1px solid #d9d9d9",
                                        width: 50
                                    }}
                                />s
                            </Radio>
                        </RadioGroup>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default PanelCanvas;
