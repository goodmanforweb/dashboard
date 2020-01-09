import React, { Component } from "react";
import { SketchPicker } from "react-color";
import Trigger from "rc-trigger";
import $ from "jquery";
import _ from "lodash";

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
// props: limitColors color onChange position type pickerContent disableDelete
class ColorPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      colorpicker: "", //色彩选择器 当前颜色
      ...this.handleProps(props)
    };

    if(props.type == "normal"){
      this.state.colorpicker = props.color;
    }
  }
  handleProps(props) {
    let plusShow = false,
      pathColorArr = [];
    this.colorNum = props.limitColors || 9;
    if (props.type == "listColor") {
      if (props.color.length >= this.colorNum) {
        plusShow = false;
        pathColorArr = props.color.slice(0, this.colorNum);
      } else {
        plusShow = true;
        pathColorArr = props.color;
      }
    }
    //normal
    else if (props.type == "normal") {
      plusShow = false;
      pathColorArr = [props.color];
    }

    return {
      plusShow,
      pathColorArr,
      type: props.type
    };
  }
  onChange(e) {
    const colorpicker = `rgba(${e.rgb.r}, ${e.rgb.g}, ${e.rgb.b}, ${e.rgb.a})`;
    let pathColorArr = this.state.pathColorArr.slice(0);

    if (this.status == "add") {
      this.status = "update";
      this.itemKey = pathColorArr.push(colorpicker) - 1;
      // 对 颜色数量做限制
      if (pathColorArr.length >= this.colorNum) {
        this.setState({
          plusShow: false
        });
      }
    } else if (this.status == "update") {
      pathColorArr.splice(this.itemKey, 1, colorpicker);
    }
    this.setState(
      {
        colorpicker,
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
    this.setState({
      colorpicker :e.target.style.backgroundColor || "",
      pathColorArr: this.state.pathColorArr
    });
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
  componentWillReceiveProps(nextProps) {
    //内部  外部  都会  控制 状态机
    //所以首先检测 外部是否发生变化；外部 没有发生变化，就检查内部状态，以内部为准；
    //外部变化因子有  type, color => pathColorArr,limitColors => plusShow
    //内部变化的因子有 colorpicker, pathColorArr , type, plusShow

    //不等于 说明外部因子变化

    if (!_.isEqual(nextProps, this.props)) {
      this.setState(this.handleProps(nextProps));
    }
  }
  // shouldComponentUpdate(nextProps, nextState) {
  //   let nextColor = Array.isArray(nextProps.color) ? nextProps.color: [nextProps.color];
  //   if( !_.isEqual(nextProps.type, nextState.type) ||
  //       !_.isEqual(nextColor, nextState.pathColorArr) ||
  //       !_.isEqual(nextProps.limitColors, nextState.plusShow)
  //       ) {
  //         return true;
  //   }

  // }
  addColor(e) {
    this.status = "add";
  }
  prevent(e) {
    e.preventDefault();
    e.stopPropagation();
  }
  render() {
    const colorpicker = this.state.colorpicker;
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
            color={colorpicker}
            onChangeComplete={e => this.onChange(e)}
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
            style={{ backgroundColor: this.state.pathColorArr[0] }}
          >
            {props.pickerContent ? props.pickerContent : ""}
          </span>
        ) : (
          <span className="pathColor-wrap flex" onClick={e => this.prevent(e)}>
            <span className="pathColor" onClick={e => this.handleColor(e)}>
              {this.state.pathColorArr.map((el, i) => {
                return (
                  <span
                    className="path-color-item"
                    data-key={i}
                    key={i}
                    style={{ backgroundColor: el }}
                  >
                    {" "}
                    {
                      !this.props.disableDelete ? <i data-key={i} className="delete-btn">-</i> : ''
                    }
                  </span>
                );
              })}
            </span>
            <span
              className="rc-color-picker-wrap"
              onClick={e => this.addColor(e)}
              style={{
                display: this.state.plusShow ? "inline-block" : "none"
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
