/**
 * 数据展示方式组件-圆点
 */
import React, { Component } from "react";
import { Form, Button, Select, Radio, Switch, Input, Row, Col } from "antd";
import $ from "jquery";
import util from "../../js/util";

const DEFAULT_OPTION = {
    size: 100,
    value: 0,
    color: ""
};
export default class CirclePoint extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    getOptionsByProps() {
        let props = this.props;
        let {
            lowThanAll,
            showNumber,
            threshold1,
            threshold2,
            threshold3,
            size,
            value
        } = props;
        let color = lowThanAll;
        let options = $.extend(true, {}, DEFAULT_OPTION, {
            value,
            size,
            showNumber
        });
        let thresholds = [];
        [threshold1, threshold2, threshold3].forEach(item => {
            let itemValue = Number(item.value);
            if (!isNaN(itemValue)) {
                thresholds.push({
                    value: itemValue,
                    color: item.color
                });
            }
        });

        thresholds.sort(
            (a, b) => (a.value > b.value ? 1 : a.value < b.value ? -1 : 0)
        );

        thresholds.forEach(item => {
            let thresholdValue = item.value;
            if (value >= thresholdValue) {
                color = item.color;
            }
        });

        options.color = color;
        return options;
    }
    render() {
        let options = this.getOptionsByProps();
        let { color, size, showNumber, value } = options;

        return (
            <div className="circle-point">
                <i
                    style={{
                        backgroundColor: color,
                        marginRight: 20 * (size / 100 - 1) / 2 + 5 + "px",
                        transform: "scale(" + size / 100 + ")"
                    }}
                />
                {showNumber ? util.formatNumber(value, "#,###.##") : ""}
            </div>
        );
    }
}
