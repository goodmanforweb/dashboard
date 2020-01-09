import React, { Component } from "react";
import { Row, Col, Radio, Button, Message } from "antd";
const RadioGroup = Radio.Group;
import _ from "lodash";
import ColorPicker from "../panelComponents/colorPicker";
import Immutable, { Map, is } from "immutable";
/**
input {
  series,switch,filter,value,color,seriesList
}
onChange
output {
  series,switch,filter,value,color
}
**/
const filter = ["", ">", ">=", "<", "<=", "==", "!="];
const keys = [
    "series",
    "switch",
    "filter",
    "value",
    "color",
    "seriesList",
    "showMarkType",
    "markType"
];
class XWarn extends Component {
    constructor(props) {
        super(props);
        this.state = this.assign(props.value);
        this.initListener();
    }
    initListener() {
        if (!this.props.inst.hasListener("seriesListChange")) {
            this.props.inst.subscribe("seriesListChange", data => {
                if (!_.isEqual(data, this.state.seriesList)) {
                    this.setState({
                        seriesList: data
                    });
                }
            });
        }
    }
    //删除一行
    deleteRow(ind) {
        let _state = this.assign(this.state);
        if (_state.value.length < 2) {
            Message.warning("最少保留一条预警方案。", 2);
            return;
        }
        _state.value.splice(ind, 1);
        this.setState(_state, () => {
            let __state = this.assign(_state);
            this.props.onChange && this.props.onChange(__state);
        });
    }
    /**
     * 添加一列
     */
    addRow() {
        let _state = this.assign(this.state);
        if (_state.value.length > 2) {
            Message.warning("最多添加三条预警方案。", 2);
            return;
        }
        _state.value.push({
            series: "",
            filter: "==",
            value: 10,
            color: "rgba(228, 14, 14, 1)",
            showMarkType: true,
            markType: false
        });
        this.setState(_state, () => {
            let __state = this.assign(_state);
            this.props.onChange && this.props.onChange(__state);
        });
    }
    componentWillUnmount() {
        //这里 做 取消监听事件  没太多必要， 因为一个组件删除 就 把实例 销毁了
        this.props.inst || this.props.inst.unsubscribe("seriesListChange");
    }
    assign(source) {
        return Immutable.fromJS(source || {}).toJS();
    }
    componentWillReceiveProps(nextProps) {
        this.setState(this.assign(nextProps.value));
        this.initListener();
    }
    // shouldComponentUpdate(nextProps,nextState) {
    //   return  _.isEqual(this.props.value, nextProps.value) ? false : true;
    // }
    handleChange(type, e) {
        let value = e.rgba || e.target.value;
        this.setState(
            {
                [type]: value
            },
            () => {
                const result = keys
                    .map(key => ({ [key]: this.state[key] }))
                    .reduce((prev, next) => Object.assign(prev, next));
                this.props.onChange && this.props.onChange(result);
            }
        );
    }
    /**
     * 操作各个对象
     * @param {*} type
     * @param {*} e
     * @param {*} i
     */
    handleSubChange(type, e, i) {
        let value = e.rgba || e.target.value;
        if (value === "") {
            Message.warn("只能输入数字,且不能为空", 3);
            return false;
        }
        typeof value === "string" && (value = value.replace(/^0*/, "") || "0");
        let _state = this.assign(this.state);
        _state.value[i][type] = value;
        this.setState(_state, () => {
            let __state = this.assign(_state);
            this.props.onChange && this.props.onChange(__state);
        });
    }
    render() {
        return (
            <div>
                <Row type="flex" align="middle">
                    <Col span={6}>预警方案</Col>
                    <Col span={18}>
                        <RadioGroup
                            onChange={e => this.handleChange("switch", e)}
                            value={this.state.switch}
                        >
                            <Radio value={false} key={1}>
                                停用
                            </Radio>
                            <Radio value={true} key={2}>
                                启用
                            </Radio>
                        </RadioGroup>
                    </Col>
                </Row>
                {this.state.switch ? (
                    <div>
                        {this.state.value.map((item, i) => {
                            return (
                                <div
                                    key={i}
                                    style={{
                                        border: "1px #ccc solid",
                                        margin: "3px 0",
                                        padding: "2px",
                                        position: "relative"
                                    }}
                                >
                                    <Button
                                        size="small"
                                        icon="minus"
                                        style={{
                                            position: "absolute",
                                            right: 0,
                                            top: "-19px"
                                        }}
                                        onClick={() => {
                                            this.deleteRow(i);
                                        }}
                                    />
                                    <Row type="flex" align="middle">
                                        <Col span={6}>预警条件</Col>
                                        <Col span={18}>
                                            <select
                                                onChange={e =>
                                                    this.handleSubChange(
                                                        "series",
                                                        e,
                                                        i
                                                    )
                                                }
                                                value={item.series}
                                                style={{
                                                    width: "35%",
                                                    height: 30
                                                }}
                                            >
                                                <option value="" key={99}>
                                                    {" "}
                                                </option>
                                                {this.state.seriesList.map(
                                                    (op, i) => (
                                                        <option
                                                            value={op}
                                                            key={i}
                                                        >
                                                            {op}
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                            <select
                                                onChange={e =>
                                                    this.handleSubChange(
                                                        "filter",
                                                        e,
                                                        i
                                                    )
                                                }
                                                value={item.filter}
                                                style={{
                                                    width: "26%",
                                                    display: "inline-block",
                                                    margin: "0 6px",
                                                    height: 30
                                                }}
                                            >
                                                {filter.map((op, i) => (
                                                    <option value={op} key={i}>
                                                        {op}
                                                    </option>
                                                ))}
                                            </select>
                                            <input
                                                type="number"
                                                onChange={e =>
                                                    this.handleSubChange(
                                                        "value",
                                                        e,
                                                        i
                                                    )
                                                }
                                                value={item.value}
                                                style={{
                                                    border: "none",
                                                    height: 30,
                                                    width: "30%"
                                                }}
                                            />
                                        </Col>
                                    </Row>
                                    <Row type="flex" align="middle">
                                        <Col span={6}>预警色彩</Col>
                                        <Col span={18}>
                                            <ColorPicker
                                                type="normal"
                                                position={["br", "tl"]}
                                                color={item.color}
                                                onChange={e =>
                                                    this.handleSubChange(
                                                        "color",
                                                        e,
                                                        i
                                                    )
                                                }
                                            />
                                        </Col>
                                    </Row>
                                    {item.showMarkType ? (
                                        <Row type="flex" align="middle">
                                            <Col span={6}>预警标记</Col>
                                            <Col span={18}>
                                                <RadioGroup
                                                    onChange={e =>
                                                        this.handleSubChange(
                                                            "markType",
                                                            e,
                                                            i
                                                        )
                                                    }
                                                    value={item.markType}
                                                >
                                                    <Radio
                                                        value={false}
                                                        key={1}
                                                    >
                                                        停用
                                                    </Radio>
                                                    <Radio value={true} key={2}>
                                                        启用
                                                    </Radio>
                                                </RadioGroup>
                                            </Col>
                                        </Row>
                                    ) : null}
                                </div>
                            );
                        })}
                        <Button
                            size="small"
                            icon="plus"
                            onClick={e => this.addRow()}
                        />
                    </div>
                ) : null}
            </div>
        );
    }
}

export default XWarn;
