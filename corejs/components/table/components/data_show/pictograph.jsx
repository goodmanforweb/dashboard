/**
 * 数据展示方式组件-象形图
 */
import React, { Component } from "react";
import { Form, Button, Select, Radio, Switch, Input, Row, Col } from "antd";
import $ from "jquery";
import ReactSVG from "react-svg";
import util from "../../js/util";

export default class Pictograph extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let props = this.props;
    let path;
    let { type, range, value, fillColor, showNumber } = props;
    let total = range[1] - range[0];
    let per = value > 0 && total > 0 ? (value * 100) / total : 0;
    let width = (per * 745) / 100;

    switch (type) {
      case "battery":
        path = require("corejs/resource/svg/battery.svg");
        break;
      default:
        path = "";
        break;
    }

    return (
      <div className="pictograph">
        {path && (
          <ReactSVG
            path={path}
            onInjected={svg => {
              let $svg = $(svg);
              $svg.attr("fill", fillColor);
              $svg.find("rect").attr("width", width);
              $svg.find("text").text(per.toFixed(2).replace(/\.0{1,2}$/, ""));
            }}
            svgClassName="svg-battery"
            className="svg-battery-wrapper"
            onClick={() => {}}
          />
        )}
        {showNumber && util.formatNumber(value, "#,###.##")}
      </div>
    );
  }
}
