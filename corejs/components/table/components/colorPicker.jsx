import React, { Component } from "react";
import { SketchPicker } from "react-color";
import Trigger from "rc-trigger";
import $ from "jquery";

const presetColors = [
    "#000000",
    "#4D4D4D",
    "#333333",
    "#666666",
    "#808080",
    "#999999",
    "#B3B3B3",
    "#cccccc",
    "#FFFFFF",
    "#9F0500",
    "#D33115",
    "#F44E3B",
    "#C45100",
    "#E27300",
    "#FE9200",
    "#FB9E00",
    "#FCC400",
    "#FCDC00",
    "#808900",
    "#B0BC00",
    "#DBDF00",
    "#194D33",
    "#68BC00",
    "#A4DD00",
    "#0C797D",
    "#16A5A5",
    "#68CCCA",
    "#0062B1",
    "#009CE0",
    "#73D8FF",
    "#653294",
    "#7B64FF",
    "#AEA1FF",
    "#AB149E",
    "#FA28FF",
    "#FDA1FF"
];
class ColorPicker extends Component {
    constructor(props) {
        super(props);
        this.colorNum = props.limitColors || 9;
        this.state = {
            plusShow: props.color.length < this.colorNum,
            color: props.color,
            pathColorArr: Array.isArray(props.color)
                ? props.color
                : [props.color]
        };
    }
    checkMaxColor() {}
    onChange(e) {
        const color = `rgba(${e.rgb.r}, ${e.rgb.g}, ${e.rgb.b}, ${e.rgb.a})`;
        let pathColorArr = this.state.pathColorArr.slice(0);

        if (this.status == "add") {
            this.status = "update";
            this.itemKey = pathColorArr.push(color) - 1;
            // 对 颜色数量做限制
            if (pathColorArr.length >= this.colorNum) {
                this.setState({
                    plusShow: false
                });
            }
        } else if (this.status == "update") {
            pathColorArr.splice(this.itemKey, 1, color);
        }
        this.setState(
            {
                color: color,
                pathColorArr: pathColorArr
            },
            () => {
                this.props.onChange(this.handleValue(e));
            }
        );
    }
    handleValue(e) {
        return this.props.type == "normal"
            ? {
                  hex: e.hex,
                  rgba: `rgba(${e.rgb.r}, ${e.rgb.g}, ${e.rgb.b}, ${e.rgb.a})`
              }
            : this.state.pathColorArr.slice(0);
    }
    handleColor(e) {
        const className = e.target.className;
        if (className == "delete-btn") {
            e.preventDefault();
            e.stopPropagation();
            this.status = "delete";
            let pathColorArr = this.state.pathColorArr.slice(0);
            pathColorArr.splice(e.target.dataset["key"], 1);

            this.setState(
                {
                    pathColorArr: pathColorArr,
                    plusShow: pathColorArr.length < this.colorNum
                },
                () => {
                    this.props.onChange(pathColorArr);
                }
            );
        } else if (className == "path-color-item") {
            this.status = "update";
            this.itemKey = e.target.dataset["key"];
        }
    }

    addColor(e) {
        this.status = "add";
    }
    prevent(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    render() {
        const color = this.state.color;
        const props = this.props;
        return (
            <Trigger
                popupAlign={{
                    points: props.position ? props.position : ["tr", "bl"]
                }}
                action={["click"]}
                popup={
                    <SketchPicker
                        // disableAlpha={true}
                        color={color}
                        onChangeComplete={e => {
                            this.onChange(e);
                        }}
                        presetColors={presetColors}
                        width={225}
                    />
                }
                popupAlign={{
                    points: ["br", "bl"],
                    offset: [0, 3]
                }}
                onPopupAlign={(popupDomNode, align) => {
                    let offset = $(popupDomNode).offset();
                    if (offset.top <= 0) {
                        $(popupDomNode).css("top", 0);
                    }
                }}
            >
                {props.type == "normal" ? (
                    <span
                        className="color-picker-trigger"
                        style={{ backgroundColor: color }}
                    >
                        {props.pickerContent ? props.pickerContent : ""}
                    </span>
                ) : (
                    <span
                        className="pathColor-wrap flex"
                        onClick={e => this.prevent(e)}
                    >
                        <span
                            className="pathColor"
                            onClick={e => this.handleColor(e)}
                        >
                            {this.state.pathColorArr.map((el, i) => {
                                return (
                                    <span
                                        className="path-color-item"
                                        data-key={i}
                                        key={i}
                                        style={{ backgroundColor: el }}
                                    >
                                        {" "}
                                        <i data-key={i} className="delete-btn">
                                            -
                                        </i>
                                    </span>
                                );
                            })}
                        </span>
                        <span
                            className="rc-color-picker-wrap"
                            onClick={e => this.addColor(e)}
                            style={{
                                display: this.state.plusShow
                                    ? "inline-block"
                                    : "none"
                            }}
                        >
                            <span
                                className="color-picker-plus"
                                style={{
                                    backgroundColor: "rgb(255, 255, 255)"
                                }}
                            >
                                +
                            </span>
                        </span>
                    </span>
                )}
            </Trigger>
        );
    }
}

export default ColorPicker;
