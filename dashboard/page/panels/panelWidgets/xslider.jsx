import React, { Component } from "react";
import { Row, Col, Slider } from "antd";
import _ from "lodash";

// name, icons, defaultValue, value, onChange
class XSlider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.value
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            value: nextProps.value
        });
    }
    shouldComponentUpdate(nextProps, nextState) {
        if (
            _.isEqual(nextState, this.state) &&
            nextProps.value == this.state.value &&
            nextProps.name == this.props.name &&
            _.isEqual(nextProps.options, this.props.options)
        ) {
            return false;
        }
        return true;
    }

    onChange(e) {
        this.setState(
            {
                value: e
            },
            () => {
                this.props.onChange && this.props.onChange(e);
            }
        );
    }
    render() {
        let _option = this.props.options[0];
        this._range = _option.range ? { range: true } : null;
        this.tipformatter = _option.tipFormatter
            ? {
                  tipFormatter: value => value + _option.tipFormatter
              }
            : null;
        return (
            <Row type="flex" align="middle">
                <Col span={6}>{this.props.name}</Col>
                <Col span={18}>
                    {
                        /* !this.props.options[0].range ? ( */
                        <Slider
                            {...this._range}
                            {...this.tipformatter}
                            value={this.state.value}
                            min={this.props.options[0].minRange || 0}
                            max={this.props.options[0].maxRange}
                            disabled={false}
                            onChange={e => this.onChange(e)}
                        />
                        /* ) : (
                        <Slider
                            range
                            min={this.props.options[0].minRange || 0}
                            value={this.state.value}
                            max={this.props.options[0].maxRange}
                            disabled={false}
                            onChange={e => this.onChange(e)}
                        />
                    ) */
                    }
                </Col>
            </Row>
        );
    }
}

export default XSlider;
