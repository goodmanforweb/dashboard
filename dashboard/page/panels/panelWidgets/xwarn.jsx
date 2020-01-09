import React, { Component } from "react";
import { Row, Col, Radio, Message , Slider} from "antd";
const RadioGroup = Radio.Group;
import _ from "lodash";
import ColorPicker from "../panelComponents/colorPicker";
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
const keys = ["series", "switch", "filter", "value", "color", "seriesList", 'markerSize'];
class XWarn extends Component {
    constructor(props) {
        super(props);
        this.state = this.assign(props);
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
    componentWillUnmount() {
        //这里 做 取消监听事件  没太多必要， 因为一个组件删除 就 把实例 销毁了
        this.props.inst && this.props.inst.unsubscribe("seriesListChange");
    }

    assign(source) {
        let tempObj = {};
        keys.forEach(key => (tempObj[key] = source.value[key]));
        return tempObj;
    }
    componentWillReceiveProps(nextProps) {
        this.setState(this.assign(nextProps));
        this.initListener();
    }
    // shouldComponentUpdate(nextProps,nextState) {
    //   return  _.isEqual(this.props.value, nextProps.value) ? false : true;
    // }
    handleChange(type, e) {
        let value = type == 'markerSize' ? e : (e.rgba || e.target.value);
        if (value === "") {
            Message.warn("只能输入数字,且不能为空", 3);
            return false;
        }
        typeof value === "string" && (value = value.replace(/^0*/, "") || "0");
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
                {
                  this.state.switch ? 
                        <Row type="flex" align="middle">
                            <Col span={6}>预警条件</Col>
                            <Col span={18}>
                                <select
                                    onChange={e =>
                                        this.handleChange("series", e)
                                    }
                                    value={this.state.series}
                                    style={{ width: "35%", height: 30 }}
                                >
                                    <option value="" key={99}>
                                        {" "}
                                    </option>
                                    {this.state.seriesList.map((op, i) => (
                                        <option value={op} key={i}>
                                            {op}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    onChange={e =>
                                        this.handleChange("filter", e)
                                    }
                                    value={this.state.filter}
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
                                        this.handleChange("value", e)
                                    }
                                    value={this.state.value}
                                    style={{
                                        border: "none",
                                        height: 30,
                                        width: "30%"
                                    }}
                                />
                            </Col>
                        </Row> : null 
                }
                {
                  this.state.switch && (this.props.inst.cfg.type == "heatchart") ? 
                        <Row type="flex" align="middle">
                            <Col span={6}>标记大小</Col>
                            <Col span={18}>
                                <Slider
                                    value={this.state.markerSize}
                                    min={10}
                                    max={120}
                                    onChange={e => this.handleChange('markerSize', e)}
                                />
                            </Col>
                        </Row> : null 
                }
                { 
                  this.state.switch ? <Row type="flex" align="middle">
                            <Col span={6}>预警色彩</Col>
                            <Col span={18}>
                                <ColorPicker
                                    type="normal"
                                    position={["br", "tl"]}
                                    color={this.state.color}
                                    onChange={e =>
                                        this.handleChange("color", e)
                                    }
                                />
                            </Col>
                        </Row> : null
                }

            </div>
        );
    }
}

export default XWarn;
