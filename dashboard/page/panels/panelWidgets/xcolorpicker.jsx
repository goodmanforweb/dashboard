import React, { Component } from "react";
import { Row, Col, Slider } from "antd";
import { ColorPicker } from "../panelComponents/index";
import _ from "lodash";

// name,  value, onChange
//type : normal listColor limitColors
class XColorPicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: "normal",
            value: props.value
        };
        if (this.props.options[0]) {
            this.state.type = this.props.options[0].type;
            this.state.limitColors = this.props.options[0].limitColors
            this.state.disableDelete = this.props.options[0].disableDelete
        }
    }

    componentWillReceiveProps(nextProps) {
      let option = nextProps.options[0];
        this.setState({
            value: nextProps.value,
            limitColors: option.limitColors,
            type: option.type,
            disableDelete: option.disableDelete
        });
    }
    // shouldComponentUpdate(nextProps, nextState) {
    //     if (
    //         _.isEqual(nextState, this.state) &&
    //         _.isEqual(nextProps.value, this.state.value) &&
    //         nextProps.name == this.props.name &&
    //         nextProps.type == this.props.type
    //     ) {
    //         return false;
    //     }
    //     return true;
    // }

    onChange(e) {
        const value = { normal: e.rgba, listColor: e }[this.state.type];
        this.setState(
            {
                value
            },
            () => {
                this.props.onChange && this.props.onChange(value);
            }
        );
    }
    render() {
        return (
            <Row type="flex" align="middle">
                <Col span={6}>{this.props.name}</Col>
                <Col span={18}>
                    <ColorPicker
                        limitColors={this.state.limitColors}
                        type={this.state.type}
                        color={this.state.value}
                        disableDelete={this.state.disableDelete}
                        onChange={e => this.onChange(e)}
                    />
                </Col>
            </Row>
        );
    }
}

export default XColorPicker;
