/**
 * 数据展示方式组件-趋势箭头
 */
import React, { Component } from "react";
import { Icon } from "antd";
import $ from "jquery";
import util from "../../js/util";

const DEFAULT_OPTIONS = {
    //circle
    shape: "circle",
    arrow: "",
    showNumber: true,
    value: 0
};

export default class TrendArrow extends Component {
    constructor(props) {
        super(props);
    }

    getOptionsByProps() {
        let props = this.props;
        let { downThreshold, upThreshold, value, showNumber, shape } = props;
        let options = $.extend(true, {}, DEFAULT_OPTIONS, {
            value: value,
            showNumber: showNumber,
            shape: shape
        });

        if (downThreshold > upThreshold) {
            options.arrow = "";
        } else if (value > upThreshold) {
            options.arrow = "arrow-up";
        } else if (value < downThreshold) {
            options.arrow = "arrow-down";
        } else if (value <= upThreshold && value >= downThreshold) {
            options.arrow = "arrow-right";
        }

        return options;
    }

    render() {
        let options = this.getOptionsByProps();

        return (
            <div className="trend-arrow">
                <Icon
                    className={"trend-arrow-i " + options.shape}
                    type={options.arrow}
                />
                {options.showNumber
                    ? util.formatNumber(options.value, "#,###.##")
                    : ""}
            </div>
        );
    }
}
