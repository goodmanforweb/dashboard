/**
 * 数据展示方式组件-数据条
 */
import React, { Component } from "react";
import { Form, Button, Select, Radio, Switch, Input, Row, Col } from "antd";
import $ from "jquery";
import util from "../../js/util";

function getZeroLeft(range, total) {
    if (range[0] >= 0) {
        return 0;
    } else if (range[1] <= 0) {
        return 100;
    } else {
        return Math.abs(range[0]) / total;
    }
}

const DEFAULT_OPTION = {
    //数值
    data: 0,
    //数值展示配置
    width: 0,
    value: {
        //是否展示数值
        show: true,
        //数据条和数值是否分离
        separate: false
    },
    //左位置
    left: 0,
    //[负值颜色，正值颜色]
    color: null,
    title: "",
    //0刻度线
    zero: {
        //是否展示0刻度线
        show: true,
        //左位置
        left: 0
    },
    //目标线
    reference: {
        //是否展示目标线
        show: false,
        //目标值
        value: null,
        //目标线颜色
        color: "#33ccff",
        //左位置
        left: 0
    }
};

export default class DataBar extends Component {
    constructor(props) {
        super(props);
    }

    //获取左位置
    getLeft(value, range, isLine) {
        if (!isLine && value > 0) {
            return this.getLeft(0, range);
        }
        let barRange = range;
        barRange[0] = Math.min(0, range[0]);
        return (value - barRange[0]) * 100 / (barRange[1] - barRange[0]) + "%";
    }

    //获取数据条宽度
    getWidth(value, range) {
        let barRange = range;
        barRange[0] = Math.min(0, range[0]);
        return Math.abs(value) * 100 / (barRange[1] - barRange[0]) + "%";
    }

    //生成options
    getOptionsByProps() {
        let props = this.props;
        let {
            range, //数据区间
            value, //数值
            negativeColor, //负值颜色
            positiveColor, //正值颜色

            referenceColor, //目标线颜色
            referenceLine, //目标线开关
            referenceValue, //目标值

            separateLabel, //分离标签
            showNumber //展示数值
        } = props;
        let options = $.extend(true, {}, DEFAULT_OPTION, {
            data: value,
            title: "当前值:" + value,
            value: {
                show: showNumber,
                separate: separateLabel
            }
        });

        referenceValue = String(referenceValue);
        if (/^[-0-9\.]+$/.test(referenceValue)) {
            referenceValue = Number(referenceValue);
        } else {
            referenceValue = null;
        }

        if (referenceLine && typeof referenceValue === "number") {
            referenceValue > range[1] && (range[1] = referenceValue);
            referenceValue < range[0] && (range[0] = referenceValue);

            options.reference.show = true;
            options.reference.value = referenceValue;
            options.reference.color = referenceColor;
            options.reference.left = this.getLeft(referenceValue, range, true);
            options.title += " 目标值:" + referenceValue;
        } else {
            options.reference.show = false;
        }

        options.left = this.getLeft(value, range);
        options.width = this.getWidth(value, range);

        if (value > 0) {
            options.color = positiveColor;
        } else if (value < 0) {
            options.color = negativeColor;
        } else {
            options.color = "";
        }

        options.zero.left = this.getLeft(0, range, true);

        return options;
    }
    render() {
        let options = this.getOptionsByProps();
        let style = {};
        if (options.data < 0) {
            style.right = "4px";
        } else {
            style.left = "4px";
        }
        return (
            <div
                className={
                    "data-bar " +
                    (options.value.show && options.value.separate
                        ? "separate"
                        : "")
                }
                title={options.title}
            >
                {options.value.show &&
                    options.value.separate && (
                        <span
                            style={{
                                right: 0,
                                position: "absolute",
                                zIndex: 1
                            }}
                        >
                            {util.formatNumber(options.data, "#,###.##")}
                        </span>
                    )}
                <div className="data-bar__line">
                    <div
                        className="data-bar__bg"
                        style={{
                            backgroundColor: options.color,
                            width: options.width,
                            left: options.left
                        }}
                    >
                        {options.value.show &&
                            !options.value.separate && (
                                <span style={style}>
                                    {util.formatNumber(
                                        options.data,
                                        "#,###.##"
                                    )}
                                </span>
                            )}
                    </div>
                    {options.zero.show && (
                        <div
                            className="data-bar__zero"
                            style={{ left: options.zero.left }}
                        />
                    )}
                    {options.reference.show && (
                        <div
                            className="data-bar__reference"
                            style={{
                                left: options.reference.left,
                                borderColor: options.reference.color
                            }}
                        />
                    )}
                </div>
            </div>
        );
    }
}
