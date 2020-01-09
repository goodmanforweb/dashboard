/**
 * 表格组件
 */
import React, { Component } from "react";
import {
  Form,
  Button,
  Select,
  Radio,
  Switch,
  Input,
  Row,
  Col,
  Icon,
  Slider
} from "antd";
import ColorPicker from "./colorPicker";
import $ from "jquery";
import ReactSVG from "react-svg";
const _batterySvg = require("corejs/resource/svg/battery.svg");
const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 10 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 }
  }
};

//汇总方式
const calcMode = {
  string: [
    { name: "全局", value: "" },
    { name: "计数", value: "count" },
    { name: "计数(去重)", value: "norepeatCount" }
  ],
  number: [
    { name: "全局", value: "" },
    { name: "求和", value: "sum" },
    { name: "平均值", value: "average" },
    { name: "最大值", value: "max" },
    { name: "最小值", value: "min" },
    { name: "计数", value: "count" },
    { name: "计数(去重)", value: "norepeatCount" },
    { name: "方差", value: "variance" },
    { name: "标准差", value: "standardDeviation" },
    { name: "中位数", value: "median" }
  ]
};

//列可设置的展示类型
const dataShowTypes = [
  {
    name: "字符",
    value: "char",
    com: DataShowByChar,
    defalut: {
      wrap: true
    }
  },
  {
    name: "数字",
    value: "number",
    com: DataShowByNumber,
    defalut: {
      format: ""
    }
  },
  {
    name: "数据条",
    value: "dataBar",
    com: DataShowByBar,
    defalut: {
      showNumber: true,
      separateLabel: false,
      positiveColor: "#78d37a",
      negativeColor: "#ef3438",
      referenceLine: false,
      referenceValue: "",
      referenceColor: "#33ccff"
    }
  },
  {
    name: "趋势箭头",
    value: "trendArrow",
    com: DataShowByArrow,
    defalut: {
      showNumber: true,
      downThreshold: 0,
      upThreshold: 0,
      shape: ""
    }
  },
  {
    name: "圆点",
    value: "circlePoint",
    com: DataShowByPoint,
    defalut: {
      size: 100,
      showNumber: true,
      threshold1: {
        value: 0,
        color: "#4de67e"
      },
      threshold2: {
        value: 0,
        color: "#ffff66"
      },
      threshold3: {
        value: 0,
        color: "#3399cc"
      },
      lowThanAll: "#ff0000"
    }
  },
  {
    name: "字体色阶",
    value: "colorOrder",
    com: DataShowByColorOrder,
    defalut: {
      lowColor: "#78d37a",
      highColor: "#ef3438"
    }
  },
  {
    name: "背景色阶",
    value: "bgOrder",
    com: DataShowByBgOrder,
    defalut: {
      lowColor: "#78d37a",
      highColor: "#ef3438"
    }
  },
  {
    name: "百分比象形图",
    value: "pictograph",
    com: DataShowByPictograph,
    defalut: {
      type: "",
      showNumber: true,
      fillColor: "#00cb38"
    }
  }
];

//数字展示类型时，格式化下拉选项
const formatOptions = [
  { value: "#,###", name: "#,###(整数)" },
  { value: "#,##0.0#", name: "#,##0.0#(小数)" },
  { value: "￥#,##0.00", name: "￥#,##0.00(货币)" },
  { value: "##%", name: "##%(百分数)" },
  { value: "0.##%", name: "0.##%(百分小数)" }
];

function callOnChange(key, value, props) {
  let detailConfig = Object.assign({}, props);
  let tmp = detailConfig;
  key = key.split(".");
  for (let i = 0, len = key.length; i < len; i++) {
    if (i === len - 1) {
      tmp[key[i]] = value;
      delete detailConfig.onChage;
      props.onChage && props.onChage(detailConfig);
    } else {
      tmp = tmp[key[i]];
    }
  }
}

function DataShowByChar(props) {
  return (
    <div className="widget-table-column-config__dataTypeDetail">
      <FormItem {...formItemLayout} label="自动换行">
        <Switch
          checked={props.wrap}
          size="small"
          onChange={value => {
            callOnChange("wrap", value, props);
          }}
        />
      </FormItem>
    </div>
  );
}

function DataShowByNumber(props) {
  return (
    <div className="widget-table-column-config__dataTypeDetail">
      <FormItem {...formItemLayout} label="格式">
        <Select
          getPopupContainer={triggerNode => triggerNode.parentNode}
          mode="combobox"
          value={props.format}
          size="small"
          onChange={value => {
            callOnChange("format", value, props);
          }}
        >
          {formatOptions.map(v => <Option value={v.value}>{v.name}</Option>)}
        </Select>
      </FormItem>
    </div>
  );
}

function DataShowByBar(props) {
  return (
    <div className="widget-table-column-config__dataTypeDetail">
      <FormItem {...formItemLayout} label="显示数值">
        <Switch
          checked={props.showNumber}
          size="small"
          onChange={value => {
            callOnChange("showNumber", value, props);
          }}
        />
      </FormItem>
      {props.showNumber && (
        <FormItem {...formItemLayout} label="分离标签">
          <Switch
            checked={props.separateLabel}
            size="small"
            onChange={value => {
              callOnChange("separateLabel", value, props);
            }}
          />
        </FormItem>
      )}
      <FormItem {...formItemLayout} label="正值条颜色">
        <ColorPicker
          type="normal"
          color={props.positiveColor || ""}
          onChange={e => {
            callOnChange("positiveColor", e.hex, props);
          }}
        />
      </FormItem>
      <FormItem {...formItemLayout} label="负值条颜色">
        <ColorPicker
          type="normal"
          color={props.negativeColor || ""}
          onChange={e => {
            callOnChange("negativeColor", e.hex, props);
          }}
        />
      </FormItem>
      <FormItem {...formItemLayout} label="目标线">
        <Switch
          checked={props.referenceLine}
          size="small"
          onChange={value => {
            callOnChange("referenceLine", value, props);
          }}
        />
      </FormItem>
      {props.referenceLine && (
        <FormItem {...formItemLayout} label="目标值">
          <Input
            value={props.referenceValue}
            size="small"
            onChange={e => {
              callOnChange("referenceValue", e.target.value, props);
            }}
          />
        </FormItem>
      )}
      {props.referenceLine && (
        <FormItem {...formItemLayout} label="目标线颜色">
          <ColorPicker
            type="normal"
            color={props.referenceColor || ""}
            onChange={e => {
              callOnChange("referenceColor", e.hex, props);
            }}
          />
        </FormItem>
      )}
    </div>
  );
}

function DataShowByArrow(props) {
  return (
    <div className="widget-table-column-config__dataTypeDetail">
      <FormItem {...formItemLayout} label="显示数值">
        <Switch
          checked={props.showNumber}
          size="small"
          onChange={value => {
            callOnChange("showNumber", value, props);
          }}
        />
      </FormItem>
      <FormItem {...formItemLayout} label="低阈值">
        <Input
          value={props.downThreshold}
          size="small"
          onChange={e => {
            callOnChange("downThreshold", e.target.value, props);
          }}
        />
      </FormItem>
      <FormItem {...formItemLayout} label="高阈值">
        <Input
          value={props.upThreshold}
          size="small"
          onChange={e => {
            callOnChange("upThreshold", e.target.value, props);
          }}
        />
      </FormItem>
      <FormItem {...formItemLayout} label="箭头样式">
        <Select
          getPopupContainer={triggerNode => triggerNode.parentNode}
          value={props.shape}
          size="small"
          onChange={value => {
            callOnChange("shape", value, props);
          }}
        >
          <Option value="">
            <Icon className="trend-arrow-i" type="arrow-down" />
            <Icon className="trend-arrow-i" type="arrow-right" />
            <Icon className="trend-arrow-i" type="arrow-up" />
          </Option>
          <Option value="circle">
            <Icon className="trend-arrow-i circle" type="arrow-down" />
            <Icon className="trend-arrow-i circle" type="arrow-right" />
            <Icon className="trend-arrow-i circle" type="arrow-up" />
          </Option>
        </Select>
      </FormItem>
    </div>
  );
}

function DataShowByPoint(props) {
  return (
    <div className="widget-table-column-config__dataTypeDetail">
      <FormItem {...formItemLayout} label="圆形大小">
        <Slider
          value={props.size}
          min={30}
          max={200}
          onChange={value => {
            callOnChange("size", value, props);
          }}
        />
      </FormItem>
      <FormItem {...formItemLayout} label="显示值">
        <Switch
          checked={props.showNumber}
          size="small"
          onChange={value => {
            callOnChange("showNumber", value, props);
          }}
        />
      </FormItem>
      <FormItem {...formItemLayout} label="阈值1">
        <Col span={14}>
          <Input
            value={props.threshold1.value}
            size="small"
            onChange={e => {
              callOnChange("threshold1.value", e.target.value, props);
            }}
          />
        </Col>
        <div
          className="column-config-radius-colorpicker"
          style={{
            transform: "scale(" + props.size / 100 + ")"
          }}
        >
          <ColorPicker
            type="normal"
            color={props.threshold1.color || ""}
            onChange={e => {
              callOnChange("threshold1.color", e.hex, props);
            }}
          />
        </div>
      </FormItem>
      <FormItem {...formItemLayout} label="阈值2">
        <Col span={14}>
          <Input
            value={props.threshold2.value}
            size="small"
            onChange={e => {
              callOnChange("threshold2.value", e.target.value, props);
            }}
          />
        </Col>
        <div
          className="column-config-radius-colorpicker"
          style={{
            transform: "scale(" + props.size / 100 + ")"
          }}
        >
          <ColorPicker
            type="normal"
            color={props.threshold2.color || ""}
            onChange={e => {
              callOnChange("threshold2.color", e.hex, props);
            }}
          />
        </div>
      </FormItem>
      <FormItem {...formItemLayout} label="阈值3">
        <Col span={14}>
          <Input
            value={props.threshold3.value}
            size="small"
            onChange={e => {
              callOnChange("threshold3.value", e.target.value, props);
            }}
          />
        </Col>
        <div
          className="column-config-radius-colorpicker"
          style={{
            transform: "scale(" + props.size / 100 + ")"
          }}
        >
          <ColorPicker
            type="normal"
            color={props.threshold3.color || ""}
            onChange={e => {
              callOnChange("threshold3.color", e.hex, props);
            }}
          />
        </div>
      </FormItem>
      <FormItem {...formItemLayout} label="低于所有阈值">
        <div
          className="column-config-radius-colorpicker"
          style={{
            transform: "scale(" + props.size / 100 + ")"
          }}
        >
          <ColorPicker
            type="normal"
            color={props.lowThanAll || ""}
            onChange={e => {
              callOnChange("lowThanAll", e.hex, props);
            }}
          />
        </div>
      </FormItem>
    </div>
  );
}

function DataShowByColorOrder(props) {
  return (
    <div className="widget-table-column-config__dataTypeDetail">
      <FormItem {...formItemLayout} label="最低值颜色">
        <ColorPicker
          type="normal"
          color={props.lowColor || ""}
          onChange={e => {
            callOnChange("lowColor", e.hex, props);
          }}
        />
      </FormItem>
      <FormItem {...formItemLayout} label="最高值颜色">
        <ColorPicker
          type="normal"
          color={props.highColor || ""}
          onChange={e => {
            callOnChange("highColor", e.hex, props);
          }}
        />
      </FormItem>
    </div>
  );
}

function DataShowByBgOrder(props) {
  return (
    <div className="widget-table-column-config__dataTypeDetail">
      <FormItem {...formItemLayout} label="最低值颜色">
        <ColorPicker
          type="normal"
          color={props.lowColor || ""}
          onChange={e => {
            callOnChange("lowColor", e.hex, props);
          }}
        />
      </FormItem>
      <FormItem {...formItemLayout} label="最高值颜色">
        <ColorPicker
          type="normal"
          color={props.highColor || ""}
          onChange={e => {
            callOnChange("highColor", e.hex, props);
          }}
        />
      </FormItem>
    </div>
  );
}

function DataShowByPictograph(props) {
  return (
    <div className="widget-table-column-config__dataTypeDetail">
      <FormItem {...formItemLayout} label="选择图形">
        <Select
          getPopupContainer={triggerNode => triggerNode.parentNode}
          value={props.type}
          size="small"
          onChange={value => {
            callOnChange("type", value, props);
          }}
        >
          <Option value="battery">
            <ReactSVG
              path={_batterySvg}
              onInjected={svg => {
                let $svg = $(svg);
                $svg.attr("fill", props.fillColor);
                $svg.find("rect").attr("width", "400");
              }}
              svgClassName="svg-battery"
              className="option-svg-battery-wrapper"
              onClick={() => {}}
            />
          </Option>
        </Select>
      </FormItem>
      <FormItem {...formItemLayout} label="显示数值">
        <Switch
          checked={props.showNumber}
          size="small"
          onChange={value => {
            callOnChange("showNumber", value, props);
          }}
        />
      </FormItem>
      <FormItem {...formItemLayout} label="填充颜色">
        <ColorPicker
          type="normal"
          color={props.fillColor || ""}
          onChange={e => {
            callOnChange("fillColor", e.hex, props);
          }}
        />
      </FormItem>
    </div>
  );
}

const DEFALUT_STATE = {
  dataType: "number",
  colIndex: null,
  config: {
    width: "",
    textAlgin: "left",
    calcMode: "",
    dataShowType: "",
    dataShowDetail: {}
  }
};

export default class ColumnConfig extends Component {
  constructor(props) {
    super(props);
    let dataType = props.options.dataType;
    this.state = $.extend(
      true,
      {},
      DEFALUT_STATE,
      {
        config: {
          textAlgin: dataType === "number" ? "right" : "left"
        }
      },
      props.options || {}
    );
    //缓存数据类型配置，切换时候需要还原上一次的配置
    this.cacheDataShowConfig = {};

    this.calcModeOptions = calcMode[this.state.dataType] || [];
    this.save = this.save.bind(this);
    this.setConfig = this.setConfig.bind(this);
  }

  componentDidMount() {}

  /**
   * 切换时候缓存数据类型配置
   * @param {String} dataShowType 类型
   * @param {Object} dataShowDetail 详细配置
   */
  cacheDataShow(dataShowType, dataShowDetail) {
    if (!dataShowType) {
      return;
    }
    if (!dataShowDetail) {
      dataShowDetail = this.state.config.dataShowDetail;
    }
    this.cacheDataShowConfig[dataShowType] = dataShowDetail;
  }

  /**
   * 获取缓存的数据类型配置
   * @param {String} dataShowType 类型
   */
  getCacheDataShow(dataShowType) {
    return dataShowType
      ? this.cacheDataShowConfig[dataShowType]
      : this.cacheDataShowConfig;
  }

  /**清空数据类型缓存配置
   *
   */
  chearCacheDataShow() {
    this.cacheDataShowConfig = {};
  }
  /**
   * 修改配置
   * @param {*} key
   * @param {*} value
   */
  setConfig(key, value) {
    let config = this.state.config;
    if (key.indexOf(".") > -1) {
      let tmp = key.split(".");
      try {
        for (let i = 0, len = tmp.length; i > len; i++) {
          let subKey = tmp[i];
          if (i === 0) {
            tag = config[subKey];
          } else if (i === len - 1) {
            tag[subKey] = value;
          } else {
            tag = tag[subKey];
          }
        }
      } catch (e) {
        console.log(e);
      }
    } else {
      config[key] = value;
    }
    this.setState({
      config: config
    });
  }

  /**
   * 根据类型找到匹配的数据格式展示对应默认配置
   * @param {*} type
   */
  getDefalutDetail(type) {
    let defalutDetail = {};
    let matchType = dataShowTypes.filter(v => v.value === type)[0];
    if (matchType) {
      defalutDetail = matchType.defalut;
    }
    return defalutDetail;
  }

  /**
   * 保存
   */
  save() {
    let onSave = this.props.onSave;
    let columnIdx = this.state.colIndex;
    let config = this.state.config;
    onSave && onSave(columnIdx, config);
    this.chearCacheDataShow();
  }

  render() {
    let config = this.state.config;
    let hasChoiceDataShow = dataShowTypes.filter(
      v => v.value === config.dataShowType
    )[0];
    let DataShowDetailCom;
    let dataShowDetailProps;

    if (hasChoiceDataShow) {
      DataShowDetailCom = hasChoiceDataShow.com;
      dataShowDetailProps = $.extend(
        true,
        {},
        hasChoiceDataShow.defalut,
        config.dataShowDetail
      );
    } else {
      DataShowDetailCom = () => "";
      dataShowDetailProps = {};
    }
    return (
      <div className="widget-table-column-config">
        <Form size="small" className="widget-table-column-config__form">
          <FormItem {...formItemLayout} label="列宽">
            <Input
              value={config.width}
              size="small"
              onChange={e => {
                this.setConfig("width", e.target.value);
              }}
            />
          </FormItem>
          <FormItem {...formItemLayout} label="对齐方式">
            <RadioGroup
              value={config.textAlgin}
              defaultValue="left"
              onChange={e => {
                this.setConfig("textAlgin", e.target.value);
              }}
              size="small"
            >
              <RadioButton value="left">左</RadioButton>
              <RadioButton value="center">中</RadioButton>
              <RadioButton value="right">右</RadioButton>
            </RadioGroup>
          </FormItem>
          <FormItem {...formItemLayout} label="汇总方式">
            <Select
              getPopupContainer={triggerNode => triggerNode.parentNode}
              value={config.calcMode}
              onChange={value => {
                this.setConfig("calcMode", value);
              }}
              size="small"
            >
              {this.calcModeOptions.map(v => (
                <Option value={v.value} key={v.value}>
                  {v.name}
                </Option>
              ))}
            </Select>
          </FormItem>
          <FormItem {...formItemLayout} label="数据类型">
            <Select
              getPopupContainer={triggerNode => triggerNode.parentNode}
              value={config.dataShowType}
              onChange={value => {
                let defalutDetail =
                  this.getCacheDataShow(value) || this.getDefalutDetail(value);
                this.cacheDataShow(
                  this.state.config.dataShowType,
                  this.state.config.dataShowDetail
                );
                this.setConfig("dataShowDetail", defalutDetail);
                this.setConfig("dataShowType", value);
              }}
              size="small"
            >
              {dataShowTypes.map(v => (
                <Option value={v.value} key={v.value}>
                  {v.name}
                </Option>
              ))}
            </Select>
          </FormItem>
          <DataShowDetailCom
            {...dataShowDetailProps}
            onChage={data => {
              this.setConfig("dataShowDetail", data);
            }}
          />
        </Form>
        <div className="widget-table-column-config__btns">
          <Button
            type="primary"
            onClick={e => {
              this.save();
            }}
            size="small"
          >
            确定
          </Button>
        </div>
      </div>
    );
  }
}
