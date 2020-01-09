/**
 * 表格组件
 * author：twy
 * create time:2018/5/10
 */
import WidgetBase from "corejs/components/base";
import _ from "underscore";
import util from "./js/util";
import $ from "jquery";
import "./css/style.css";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Button, Popover, Message } from "antd";
import ComTable from "./components/com_table.jsx";
import ColumnConfigBtn from "./components/column_config_btn";

import CirclePoint from "./components/data_show/circle_point";
import DataBar from "./components/data_show/data_bar";
import Pictograph from "./components/data_show/pictograph";
import TrendArrow from "./components/data_show/trend_arrow";

window.$ = $;
window._ = _;

//组件DOM结构模板
const TEMPLATE =
  '<div class="widget-table">\
        <div class="widget-table-top">\
            <span class="widget-table-caption"></span>\
            <div class="widget-table-tool"></div>\
        </div>\
        <div class="widget-table-main"></div>\
    </div>';

//默认组件配置对象
const DEFAULT_CONFIG = {
  //table
  tableBgColor: "transparent", //表格背景颜色
  tableFontColor: "", //表格字体颜色
  tableBorderColor: "", //表格边框颜色
  tableSplitColor: "", //变革分割线颜色
  //top
  //=============================================
  caption: "标题", //标题
  captionTextAlgin: "left", //标题对齐方式
  exportable: false, //导出数据按钮
  //=============================================
  //表头
  theadFontColor: "", //表头字体颜色
  theadBgColor: "", //表头背景颜色
  theadFontSize: 14, //表头字体颜色
  theadFontWeight: false, //表头字体是否加粗
  theadGroup: {
    //表格表头分组信息
    open: false, //是否开启表格分组
    config: [] //分组信息配置 [{start:XX,end:XX,title:'XXX'},...]
  },
  //表头分组
  //=============================================
  //数据区
  dataFontColor: "", //数据区字体颜色
  oddRowBgColor: "", //奇数行背景颜色
  evenRowBgColor: "", //偶数行背景颜色
  dataFontSize: 14, //数据区字体大小
  dataSortable: false, //是否允许排序
  //=============================================
  //分页
  pageable: false, //是否分页
  pageRows: 10, //如果分页开启，每页行数
  pageInfo: false, //分页统计信息
  //=============================================
  //统计
  calcable: false, //是否开启统计
  calcMode: "", //统计模式
  calcFontColor: "", //字体颜色
  calcBgColor: "", //背景颜色
  //=============================================
  //单列配置
  columnConfig: {} //单列属性配置信息 key为列的index
};

//默认分页配置对象
const DEFAULT_PAGINATION_CONFIG = {
  pageSizeOptions: ["10", "20", "30", "40"],
  showQuickJumper: true,
  showSizeChanger: false
};

/**
 * 属性和样式对应关系，将通过此配置生成对应样式表
 * selector 将作为生成样式表的选择器，生成的规则为 #id selector{}
 * mapping 将遍历里面的内容生成对应样式选择器的内容申明 key为申明项的key，value为对应options[value],如果为函数取返回值
 */
const STYLE_CONFIG = [
  //表格
  {
    selector: ".component_container",
    mapping: {
      tableBgColor: "background-color"
    }
  },
  //表格字体
  {
    selector: ".component_container,.ant-pagination,.ant-pagination-item a",
    mapping: {
      tableFontColor: "color"
    }
  },
  //线条颜色
  {
    selector: [
      ".ant-table-bordered .ant-table-body > table",
      ".widget-table,.ant-table-small",
      ".ant-table-bordered .ant-table-thead > tr > th",
      ".ant-table-bordered .ant-table-tbody > tr > td",
      ".widget-table-calc td"
    ].join(","),
    mapping: {
      tableSplitColor: "border-color"
    }
  },
  //标题
  {
    selector: ".widget-table-top",
    mapping: {
      captionTextAlgin: "text-align"
    }
  },
  //表头
  {
    selector: ".ant-table-thead > tr > th",
    mapping: {
      theadFontColor: "color",
      theadBgColor: "background-color",
      theadFontSize: function(value) {
        return "font-size:" + value + "px";
      },
      theadFontWeight: function(value) {
        return "font-weight:" + (value ? "bold" : "normal");
      }
    }
  },
  //数据区
  {
    selector: ".ant-table-tbody > tr > td ",
    mapping: {
      dataFontColor: "color",
      dataFontSize: function(value) {
        return "font-size:" + value + "px";
      }
    }
  },
  //奇数行
  {
    selector: ".ant-table-tbody > tr:nth-child(2n+1) > td",
    mapping: {
      oddRowBgColor: "background-color"
    }
  },
  //偶数行
  {
    selector: ".ant-table-tbody > tr:nth-child(2n) > td",
    mapping: {
      evenRowBgColor: "background-color"
    }
  },
  //统计行
  {
    selector: ".widget-table-calc",
    mapping: {
      calcFontColor: "color",
      calcBgColor: "background-color",
      calcFontSize: function(value) {
        return "font-size:" + value + "px";
      },
      calcFontWeight: function(value) {
        return "font-weight:" + (value ? "bold" : "normal");
      }
    }
  }
];

/**
 * 表格类
 */
export default class TableWidget extends WidgetBase {
  static cname = "表格";
  constructor(htmlObj, cfg, parentId, isEditMode) {
    super(htmlObj, cfg, parentId, isEditMode);

    //组件参数对象合并
    this.options = $.extend(
      true,
      {},
      DEFAULT_CONFIG,
      cfg.chartDefinition.option || {}
    );
  }

  widgetWillCreated(cfg) {
    return super.widgetWillCreated(cfg);
  }

  widgetDidCreated(cfg) {
    super.widgetDidCreated(cfg);

    this.$el = $(TEMPLATE);

    //创建和组件对应style,并追加至head中
    this.$style = _createStyle();
    this.$style.attr("id", this.id + "_style").appendTo("head");

    //添加组件ID属性
    $(this.$el).attr("id", this.id);

    //将DOM追加至页面
    $(this.htmlObj).replaceWith(this.$el);

    //缓存$DOM
    this.$top = this.$el.find(".widget-table-top");
    this.$main = this.$el.find(".widget-table-main");

    this.handleTheme();

    //绘制
    this._draw();

    //时间绑定
    this._bindEvent();
  }

  /**
   * 处理主题
   * @param {String} key 主题属性，目前包含有backgroundColor-背景色 textColor-字体色 lineColor-线条色
   * @param {Any} value 主题属性对应的值
   */
  handleTheme(key, value) {
    if (!key) {
      ["backgroundColor", "textColor", "lineColor"].forEach(v => {
        this.options[v] && this.handleTheme(v, this.options[v]);
      });
      return;
    }

    //处理主题属性背景色、字体颜色、边框颜色
    if (key === "backgroundColor") {
      key = {
        tableBgColor: value,
        theadBgColor: "transparent",
        oddRowBgColor: "transparent",
        evenRowBgColor: "transparent",
        calcBgColor: "transparent"
      };
    } else if (key === "textColor") {
      value = value[0];
      key = {
        theadFontColor: value,
        calcFontColor: value,
        dataFontColor: value,
        tableFontColor: value
      };
    } else if (key === "lineColor") {
      value = value[0];
      key = {
        tableBorderColor: value,
        tableSplitColor: value
      };
    }
    this.option(key, value);
  }

  preUpdate(nextCfg) {
    super.preUpdate(nextCfg);

    if (nextCfg.option) {
      for (let key in nextCfg.option) {
        let value = nextCfg.option[key];

        this.handleTheme(key, value);
      }
    }

    if (nextCfg.data) {
      this.cfg.chartDefinition.data = nextCfg.data;
      this.drawTable();
    }
  }

  postUpdate(nextCfg) {
    super.postUpdate(nextCfg);
  }

  draw() {}

  resize() {
    this.drawTable();
  }
  /**
   * 销毁
   */
  destroy() {
    this.$style.remove();
  }

  //==================
  /**
   * 表格自适应高度
   */
  adjustLayout() {
    let totalH = this.$el.height();
    let $calc = this.$el.find(".widget-table-calc");
    let $header = this.$el.find(".ant-table-header");
    let $bodyT = this.$el.find(".ant-table-body table");
    let $pagination = this.$el.find(".ant-pagination");
    let bodyTableH = $bodyT.height();
    let dataH =
      totalH -
      (this.$top.outerHeight() || 0) -
      ($calc.outerHeight() || 0) -
      ($header.outerHeight() || 0) -
      ($pagination.outerHeight() + 12 || 0) -
      3;

    if (bodyTableH <= dataH) {
      let isScrollX = $bodyT.width() > this.$el.width();
      let mT = dataH - bodyTableH - 5 - (isScrollX ? 17 : 0);
      this.$main.addClass("table-content-height-ubeyond");
      $pagination.css("marginTop", mT > 5 ? mT : 5);
    } else {
      this.$main.removeClass("table-content-height-ubeyond");
      $pagination.css("marginTop", 5);
    }
    if (!isNaN(dataH)) {
      this.$el.find(".ant-table-body").css({
        "max-height": dataH + "px"
      });
    }
  }

  /**
   * 组件绘制
   */
  _draw() {
    //写入样式
    this.setStyleContent();

    //标题
    this.drawCaption();

    //工具栏
    this.drawTool();

    //主体表格
    this.drawTable();
  }

  /**
   * 事件绑定
   */
  _bindEvent() {
    let options = this.options;
    //数据导出
    this.$el.on("click", ".widget-table-icon-export", e => {
      let cfgData = this.cfg.chartDefinition.data;
      let data = [];

      //表头
      if (cfgData.metadata) {
        data.push(cfgData.metadata.map(v => v.colName));
      }

      //数据
      if (cfgData.resultset) {
        data = data.concat(cfgData.resultset);
      }

      //执行导出
      util.exportCsv(data);
    });
  }

  /**
   * 设置表头标题
   * @param {String} caption 标题名称
   */
  drawCaption(caption) {
    if (arguments.length === 0) {
      caption = this.options.caption;
    }
    this.$top.find(".widget-table-caption").text(caption);
  }

  /**
   * 绘制工具栏
   */
  drawTool() {
    let toolStr = "";
    let options = this.options;
    let $tool = this.$top.find(".widget-table-tool");

    //清空工具栏容器
    ReactDOM.unmountComponentAtNode($tool[0]);

    if (options.exportable === true) {
      ReactDOM.render(
        <i className="widget-table-icon-export"></i>,
        $tool[0]
      );
    }
  }

  /**
   * 表格body发生滚动时调用
   * @param {Number} scrollLeft 横向滚动位置
   * @param {Number} scrollTop 纵向滚动位置
   */
  onBodyScroll(scrollLeft, scrollTop) {
    let $calc = this.$el.find(".widget-table-calc");
    if ($calc.length) {
      $calc[0].scrollLeft = scrollLeft;
    }
  }

  /**
   * 赋予计算出的列宽至表格
   */
  _endueColumnWidth() {
    let $headerCols = this.$el.find(".ant-table-header colgroup col");
    let $bodyCols = this.$el.find(".ant-table-body colgroup col");
    let columnWidth = this.options.columnConfig.__columnWidth;
    for (let i in columnWidth) {
      let w = columnWidth[i];
      if (/\d+/.test(i)) {
        i = Number(i);
        $headerCols.eq(i).css("width", w);
        $bodyCols.eq(i).css("width", w);
      }
    }
  }

  /**
   * 绘制主体表格
   */
  drawTable() {
    let that = this;

    //构建props属性
    this.props = _buildProps(this.cfg, this.options, this);

    if (that.$$table) {
      this.setTableState(this.props);
      that._endueColumnWidth();
    } else {
      //渲染表格主体
      ReactDOM.render(
        <ComTable options={this.props} />,
        this.$main[0],
        function() {
          //缓存组件实例
          that.$$table = this;
          //内容高度自适应
          that.adjustLayout();
          //内容滚动时调用onBodyScroll
          that.$el
            .find(".ant-table-body")
            .off("scroll.tbody")
            .on("scroll.tbody", e => {
              that.onBodyScroll(e.target.scrollLeft, e.target.scrollTop, e);
            });
          that._endueColumnWidth();
        }
      );
    }
  }

  /**
   * 属性设置
   * @param {String} key 属性名
   * @param {Any} value 属性值
   */
  option(key, value) {
    let options = {};

    //参数个数为0时，返回options对象
    if (arguments.length === 0 || value === null) {
      return _.extend({}, this.options);
    }

    if (_.isString(key)) {
      //参数个数为1时，返回对应的属性值
      if (_.isUndefined(value)) {
        return this.options[key] === undefined ? null : this.options[key];
      }
      //参数个数为2时，更新options中对应的属性值；
      options[key] = value;
    } else if (_.isObject(key)) {
      options = key;
    } else {
      return;
    }

    this._setOptions(options);
  }

  /**
   * 批量属性设置
   * @param {Object} options 组件参数对象
   */
  _setOptions(options) {
    for (let key in options) {
      this._setOption(key, options[key]);
    }
    return this;
  }

  /**
   * 单个属性设置
   * @param {String} key 属性名
   * @param {Any} value 属性值
   */
  _setOption(key, value) {
    if (_.isFunction(value)) {
      this.options[key] = value;
    } else if (value instanceof $) {
      //增加如果是jquery对象，不做深拷贝
      this.options[key] = value;
    } else if (_.isArray(value)) {
      this.options[key] = $.extend(true, [], value);
    } else if (_.isObject(value)) {
      this.options[key] = $.extend(true, {}, value);
    } else {
      this.options[key] = value;
    }

    //表格组件样式集合
    let stylePropList = [
      "tableBgColor",
      "tableFontColor",
      "tableBorderColor",
      "tableSplitColor",
      "captionTextAlgin",
      "theadFontColor",
      "theadBgColor",
      "theadFontSize",
      "theadFontWeight",
      "oddRowBgColor",
      "dataFontSize",
      "dataFontColor",
      "evenRowBgColor",
      "calcFontColor",
      "calcBgColor",
      "calcFontSize",
      "calcFontWeight"
    ];

    //如果是样式属性设置，重新生成样式内容
    if (stylePropList.indexOf(key) > -1) {
      this.setStyleContent();
    }

    switch (key) {
      case "caption":
        this.drawCaption();
        break;
      case "exportable":
        this.drawTool();
        break;
      case "pageable":
        this.setPagination();
        break;
      case "pageRows":
        this.setPagination();
        break;
      case "pageInfo":
        this.setPagination();
        break;
      case "calcable":
        this.setTableState(
          "footer",
          _buildFooterConfig(this.cfg, this.options)
        );
        break;
      case "calcMode":
        this.setTableState(
          "footer",
          _buildFooterConfig(this.cfg, this.options)
        );
        break;
      case "dataSortable":
        this.setTableState(
          "columns",
          _buildColumnsConfig(this.cfg.chartDefinition.data, this.options, this)
        );
        break;
      case "theadGroup":
        this.setTableState(
          "columns",
          _buildColumnsConfig(this.cfg.chartDefinition.data, this.options, this)
        );
        break;
      case "warning":
        this.setTableState(
          "columns",
          _buildColumnsConfig(this.cfg.chartDefinition.data, this.options, this)
        );
        break;
      case "columnConfig":
        this.drawTable();
        break;
      default:
        break;
    }
    return this;
  }

  /**
   * 调用comTable组件setState
   * @param {String|Object} key 键值
   * @param {Any} value 要设置的值
   */
  setTableState(key, value) {
    let prop;
    if (!this.$$table) {
      return;
    }

    if (typeof key === "object") {
      prop = key;
      for (let i in prop) {
        this.props[i] = prop[i];
      }
    } else {
      prop = {};
      prop[key] = value;
      this.props[key] = value;
    }
    this.$$table.setState(prop);
    setTimeout(() => {
      this.adjustLayout();
    }, 50);
  }

  /**
   * 设置分页配置信息
   */
  setPagination() {
    let pagination = _buildPaginationConfig(this.options);
    this.setTableState("pagination", pagination);
  }

  /**
   * 设置单列配置信息
   * @param {Number} idx 列index
   * @param {Object} config 列详细配置
   */
  setColumnConfig(idx, config) {
    let options = this.options;
    options.columnConfig[idx] = config;
    this.update({
      option: {
        columnConfig: options.columnConfig
      }
    });
  }

  /**
   * 构建表格样式
   */
  setStyleContent() {
    let str;
    let id = this.id;
    let options = this.options;

    str = STYLE_CONFIG.map(item => {
      let selector =
        "#" + id + " " + item.selector.split(",").join(",#" + id + " ");
      let statement = item.mapping;
      let itemStrArr = [];
      for (let key in item.mapping) {
        let value = options[key];
        if (value === "" || _.isUndefined(value)) {
          continue;
        }
        if (typeof item.mapping[key] === "function") {
          itemStrArr.push(item.mapping[key](value));
        } else {
          itemStrArr.push(item.mapping[key] + ":" + value);
        }
      }
      return itemStrArr.length
        ? selector + "{" + itemStrArr.join(";") + ";}"
        : "";
    }).join("");

    //追加
    this.$style.html(str);
  }
}

/**
 * 创建style
 */
function _createStyle() {
  return $("<style>").attr({
    type: "text/css"
  });
}

/**
 * 构建分页配置对象
 * @param {Object} options 组件参数对象
 */
function _buildPaginationConfig(options) {
  let pagination = false;
  let { pageRows, pageInfo } = options;
  if (pageRows === "0" || !pageRows) {
    return pagination;
  }
  if (options.pageable === true) {
    pagination = $.extend(true, {}, DEFAULT_PAGINATION_CONFIG);
    if (pageRows) {
      let pageSizeOptions = pagination.pageSizeOptions;

      //数字转字符串
      pageRows = String(pageRows);

      //如果每页条数不在pageSizeOptions列表中，插入到列表里面
      if (pageSizeOptions.indexOf(pageRows) === -1) {
        pageSizeOptions.splice(0, 0, pageRows);
      }

      pagination.pageSize = Number(pageRows);
    }
    if (pageInfo === true) {
      pagination.showTotal = function(total, range) {
        return (
          `共${total}条 第${range[0]}-${range[1]}条 ` + pageRows + "条/每页"
        );
      };
    } else {
      pagination.showTotal = null;
    }
  }
  return pagination;
}

/**
 * 列分组
 *  @param {Object} columns 列信息
 *  @param {Object} config 分组配置
 */
function _buildColumnGroup(columns, config) {
  let columnsMap = util.map(columns);
  let columnsLen = columns.length;
  let group = {};
  let positon;
  let relColumns = [];

  //解析列分组配置
  config.forEach(function(v) {
    let start, end;
    if (v.start === null || v.end === null) {
      return;
    }
    start = Number(v.start);
    end = Number(v.end);
    if (isNaN(start) || isNaN(end) || end < start) {
      return;
    }
    if (typeof positon === "number" && start <= positon) {
      return;
    }
    positon = end;
    group[start] = [];
    group[start]._title = v.title || "";
    for (let i = start; i <= end; i++) {
      group[start].push(columnsMap[i]);
      delete columnsMap[i];
    }
  });

  //根据配置更新columns属性层级关系
  for (let i = 0; i < columnsLen; i++) {
    if (group[i]) {
      relColumns.push({
        title: group[i]._title,
        children: group[i]
      });
    } else if (columnsMap[i]) {
      relColumns.push(columnsMap[i]);
    }
  }
  return relColumns;
}

/**
 * 处理预警
 * @param {Any} text 列单元格值
 * @param {Number} colIndex 列index
 * @param {Object} myWarning 单列预警配置对象
 * @param {Object} props 传递给主体表格的props
 * @param {Object} options 组件参数对象
 */
function _handleColumnWarning(text, colIndex, myWarning, props, options) {
  myWarning.forEach(v => {
    try {
      //预警条件拼接
      let exp = [text, v.value].join(v.cond);
      //执行条件
      let result = eval(exp);
      //如果满足条件，对单元格内容执行背景着色
      if (result && v.color) {
        props.className.push("widget-table-warning");
        props.style.backgroundColor = v.color;
      }
    } catch (e) {
      console.log(e);
    }
  });
  return props;
}

/**
 * 处理单列上数据类型配置
 * @param {Any} text 列单元格值
 * @param {Number} colIndex 列index
 * @param {Object} myWarning 单列预警配置对象
 * @param {Object} props 传递给主体表格的props
 * @param {Object} options 组件参数对象
 */
function _handleColumnConfig(text, colIndex, myColumnConfig, props, options) {
  let dataShowType = myColumnConfig.dataShowType;
  let dataShowDetail = myColumnConfig.dataShowDetail;
  switch (dataShowType) {
    //字符
    case "char":
      let wrap = dataShowDetail.wrap;
      props.className.push(wrap ? "wrap" : "no-wrap");
      props.title = wrap ? "" : text;
      break;
    //数字
    case "number":
      let format = dataShowDetail.format;
      if (format) {
        props.text = util.formatNumber(text, format);
      }
      break;
    case "dataBar":
      //数据条
      let dataRange = myColumnConfig.__dataRange;
      if (dataRange && typeof text === "number") {
        props.text = (
          <DataBar {...dataShowDetail} range={dataRange} value={text} />
        );
      }
      break;
    //趋势箭头
    case "trendArrow":
      if (typeof text === "number") {
        props.text = <TrendArrow {...dataShowDetail} value={text} />;
      }
      break;
    //圆点
    case "circlePoint":
      if (typeof text === "number") {
        props.text = <CirclePoint {...dataShowDetail} value={text} />;
      }
      break;
    //字体色阶
    case "colorOrder":
      let fColor = myColumnConfig.__dataColorOrder[text];
      if (fColor) {
        props.style.color =
          "rgb(" + [fColor.r, fColor.g, fColor.b].join(",") + ")";
      }
      break;
    //背景色阶
    case "bgOrder":
      let bgColor = myColumnConfig.__dataColorOrder[text];
      if (bgColor) {
        props.style.backgroundColor =
          "rgb(" + [bgColor.r, bgColor.g, bgColor.b].join(",") + ")";
      }
      break;
    //百分比象形图
    case "pictograph":
      let pDataRange = myColumnConfig.__dataRange;
      if (pDataRange && typeof text === "number") {
        props.text = (
          <Pictograph {...dataShowDetail} range={pDataRange} value={text} />
        );
      }
      break;
    default:
      break;
  }
  return props;
}

/**
 * 构建单元格内容
 * @param {Any} text 列单元格值
 * @param {Object} rowData 行数据
 * @param {Number} colIndex 列index
 * @param {Object} options 组件参数对象
 */
function _buildColumnTdCotent(text, rowData, colIndex, options) {
  let props = {
    className: ["widget-table-td-div"],
    style: {},
    text: text
  };

  //处理预警
  let myWarning = options.colWarning[colIndex];
  //如果该列存在预警信息配置，判断如果满足预警条件对背景按照配置着色
  if (myWarning && myWarning.length && typeof text === "number") {
    props = _handleColumnWarning(text, colIndex, myWarning, props, options);
  }

  //处理列属性配置
  let myColumnConfig = options.columnConfig[colIndex];
  if (myColumnConfig && !_.isEmpty(myColumnConfig)) {
    props = _handleColumnConfig(text, colIndex, myColumnConfig, props, options);
  }

  props.className = props.className.join(" ");

  return (
    <div key={colIndex} {...props}>
      {props.text}
    </div>
  );
}

/**
 * 获取一组值值区间
 * @param {Array} data 组数据
 */
function _getDataRange(data) {
  let range = [Math.min(...data), Math.max(...data)];
  return range;
}

/**
 * 根据配置计算列宽
 * 1、数字（像素宽度） 2、百分比（该列占整个组件宽度的百分比）
 * 每列宽度＝（列宽设置为组件整体宽度 – 指定了宽度的列的宽度总和）/ 未指定宽度的列的数量
 * 自动列宽最窄为70px，如果计算出来的宽度小于70px，则以70px为其宽度。
 * @param {Array} metadata 原始列信息
 * @param {Object} columnConfig 列配置对象
 * @param {Number} totalW 总宽度
 */
function _calcColumnWidth(metadata, columnConfig, totalW) {
  let columnWidth = {};
  let autoLen = 0;
  let occupyW = 0;
  let autoW;
  //滚动条
  totalW -= 20;
  for (let i = 0, len = metadata.length; i < len; i++) {
    try {
      let configW = columnConfig[i].width;
      let w;
      if (/%$/.test(configW)) {
        w = (Number(configW.replace(/%$/, "")) * totalW) / 100;
      } else if (configW) {
        w = Number(configW);
      }
      if (w && !isNaN(w) && w > 0) {
        w = Math.max(w, 70);
        columnWidth[i] = w;
        occupyW += w;
      } else {
        columnWidth[i] = "auto";
        autoLen++;
      }
    } catch (e) {
      columnWidth[i] = "auto";
      autoLen++;
    }
  }
  if (autoLen) {
    autoW = totalW > occupyW ? (totalW - occupyW) / autoLen : 70;
    autoW = Math.max(autoW, 70);
    for (let i in columnWidth) {
      columnWidth[i] === "auto" && (columnWidth[i] = autoW);
    }
  }

  return columnWidth;
}

/**
 * 列属性预处理
 * @param {Object} columnConfig 列配置对象
 * @param {Object} data 原始数据对象
 * @param {Object} inst 组件实例对象
 */
function _columnConfigPreprocessing(columnConfig, data, inst) {
  let metadata = data.metadata;
  let totalW = inst.$el.width();
  let columnWidth = _calcColumnWidth(metadata, columnConfig, totalW);
  for (let colIndex in columnConfig) {
    if (!metadata[colIndex]) {
      continue;
    }
    let dataType = metadata[colIndex].colType;
    let myColumnConfig = columnConfig[colIndex] || {};
    let dataShowType = myColumnConfig.dataShowType;
    let columnData;
    let dataRange;
    let dataColorOrder;

    if (!dataShowType) {
      continue;
    }

    columnData = data.resultset.map(v => v[colIndex]);

    //数据条需要数值区间
    if (dataShowType === "dataBar" || dataShowType === "pictograph") {
      myColumnConfig.__dataRange =
        dataRange || (dataRange = _getDataRange(columnData));
    }
    //字体色阶和背景色阶需要数据色阶
    else if (dataShowType === "colorOrder" || dataShowType === "bgOrder") {
      let { lowColor, highColor } = myColumnConfig.dataShowDetail;
      myColumnConfig.__dataColorOrder =
        dataColorOrder ||
        (dataColorOrder = util.colorGradate(columnData, lowColor, highColor));
    }
  }
  columnConfig.__columnWidth = columnWidth;
}

/**
 * 获取列类型
 * @param {String} type 原始类型
 */
function _getColumnType(type) {
  type = type.toUpperCase();
  if (type === "STRING") {
    return "string";
  } else if (type === "DATE") {
    return "date";
  } else {
    return "number";
  }
}

/**
 * 构建列信息
 * @param {Object} data 数据
 * @param {Object} options 表格组件参数属性对象
 * @param {Object} inst 表格组件实例对象
 */
function _buildColumnsConfig(data, options, inst) {
  let metadata = data.metadata;
  let { dataSortable, warning } = options;
  let columns;
  let colWarning = {};

  //提取列预警设置
  if (warning.open === true && warning.config.length) {
    warning.config.forEach(item => {
      let { measure, cond, value, color } = item;
      if (measure === "" || cond === "" || value === "") {
        return;
      }
      if (!colWarning[measure]) {
        colWarning[measure] = [];
      }
      colWarning[measure].push(item);
    });
  }

  //将提取的预警配置信息挂载在options上
  options.colWarning = colWarning;

  //列属性预处理
  _columnConfigPreprocessing(options.columnConfig, data, inst);

  columns = metadata.map((item, colIndex) => {
    let dataType = _getColumnType(item.colType);

    let columnConfig = options.columnConfig[colIndex] || {};
    let textAlign =
      columnConfig.textAlgin || (dataType === "number" ? "right" : "left");
    let colW = options.columnConfig.__columnWidth[colIndex];

    return {
      sorter: dataSortable
        ? (a, b) => {
            return a[colIndex] > b[colIndex]
              ? 1
              : a[colIndex] < b[colIndex]
                ? -1
                : 0;
          }
        : false,
      title: item.colName,
      dataIndex: item.colIndex,
      key: item.colIndex,
      width: 100,
      align: textAlign,
      onHeaderCell: column => {
        return {
          style: {
            textAlign: textAlign
          },
          children: [
            <div className="widget-table-th-div" key={colIndex}>
              {column.title}
              {inst.isEditMode && (
                <ColumnConfigBtn
                  options={{
                    dataType: dataType,
                    colIndex: colIndex,
                    config: columnConfig
                  }}
                  onSave={(idx, config) => {
                    inst.setColumnConfig(idx, config);
                    Message.success("列配置保存成功", 1);
                  }}
                />
              )}
            </div>
          ]
        };
      },
      render: (text, rowData, rowIdx) => {
        // _buildColumnTdCotent(text, rowData, colIndex, options);
        return {
          props: {},
          children: [_buildColumnTdCotent(text, rowData, colIndex, options)]
        };
      }
    };
  });

  if (options.theadGroup.open === true && options.theadGroup.config.length) {
    columns = _buildColumnGroup(columns, options.theadGroup.config);
  }
  return columns;
}

/**
 * 构建数据对象,将二维数组 [[],[],[]...] 更改为表格组件能识别的数据格式 [{},{},{}...]
 * @param {Object} data 原始数据对象
 * @param {Object} options 组件参数对象
 */
function _buildDatasourceConfig(data, options) {
  let resultset = data.resultset;
  return resultset.map((item, index) => {
    let rowData = util.map(item);
    rowData.key = index;
    return rowData;
  });
}

//数据统计方式
const CALC_FN_MAP = {
  sum: {
    text: "合计",
    method: util.sum.bind(util)
  },
  average: {
    text: "平均值",
    method: util.average.bind(util)
  },
  max: {
    text: "最大值",
    method: util.max.bind(util)
  },
  min: {
    text: "最小值",
    method: util.min.bind(util)
  },
  count: {
    text: "计数",
    method: util.count.bind(util)
  },
  norepeatCount: {
    text: "计数(去重)",
    method: util.norepeatCount.bind(util)
  },
  variance: {
    text: "方差",
    method: util.variance.bind(util)
  },
  standardDeviation: {
    text: "标准差",
    method: util.standardDeviation.bind(util)
  },
  median: {
    text: "中位数",
    method: util.median.bind(util)
  }
};

/**
 * 执行统计
 * @param {Array} data 表格数据
 * @param {Number} colIndex 要统计的列idx
 * @param {String} calcMode 统计方式
 */
function _doCalc(data, colIndex, calcMode) {
  let result;
  let columnData = data.map(v => v[colIndex]);
  try {
    let method = CALC_FN_MAP[calcMode].method;
    result = method(columnData)
      .toFixed(2)
      .replace(/\.0{1,2}$/, "");
  } catch (e) {
    console.log(e);
    result = "--";
  }
  return result;
}

/**
 * 统计
 * @param {Array} columns 列信息
 * @param {Object} data 原始数据对象
 * @param {String} calcMode 统计方式
 * @param {Object} options 组件参数对象
 */
function _calcData(columns = [], data = [], calcMode, options) {
  let result = new Array(columns.length);
  let columnLen = columns.length;

  for (let i = 0; i < columnLen; i++) {
    let { colIndex, colType, colName } = columns[i];
    let columnType = _getColumnType(colType);
    let columnConfig = options.columnConfig[colIndex] || {};
    let relCalcMode;
    let align =
      columnConfig.textAlgin || (columnType === "number" ? "right" : "left");

    //如果列属性上配置有统计方式，优先级高于表格上配置的统计方式
    if (columnConfig && columnConfig.calcMode) {
      relCalcMode = columnConfig.calcMode;
    } else {
      relCalcMode = calcMode;
    }

    result[i] = {};

    //数字支持所有统计方式，日期、字符串支持计数统计方式
    if (
      (columnType === "string" || columnType === "date") &&
      ["count", "norepeatCount"].indexOf(relCalcMode) === -1
    ) {
      result[i].value = null;
    } else {
      result[i].mode = relCalcMode;
      result[i].value = _doCalc(data, colIndex, relCalcMode);
    }

    result[i].align = align;
  }
  return result;
}

/**
 * 设置表格footer
 * @param {Object} cfg 组件cfg
 * @param {Object} options 组件参数对象
 * @param {Object} inst 组件实例对象
 */
function _buildFooterConfig(cfg, options, inst) {
  let data = cfg.chartDefinition.data;
  let footer = null;
  let { calcable, calcMode, columnConfig } = options;

  //开启了汇总
  if (calcable === true && calcMode) {
    let calcResult = _calcData(
      data.metadata,
      data.resultset,
      calcMode,
      options
    );
    if (!calcResult.length) {
      return footer;
    }
    if (calcResult[0].value === null) {
      calcResult[0].value = CALC_FN_MAP[calcMode].text;
    }
    footer = () => (
      <div className="widget-table-calc">
        <table>
          <colgroup>
            {calcResult.map((v, idx) => (
              <col
                key={idx}
                style={{ width: columnConfig.__columnWidth[idx] }}
              />
            ))}
          </colgroup>
          <tbody>
            <tr>
              {calcResult.map((v, idx) => (
                <td
                  style={{
                    textAlign: v.align
                  }}
                  key={idx}
                >
                  <div className="widget-table-calc-td-div">
                    {v.mode && (
                      <i className={"widget-table-calc-icon__" + v.mode} />
                    )}
                    {v.value}
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    );
  } else {
    footer = null;
  }
  return footer;
}

/**
 * 表格参数构建
 * @param {Object} cfg 组件cfg
 * @param {Object} options 组件参数对象
 * @param {Object} inst 组件实例对象
 */
function _buildProps(cfg, options, inst) {
  let props = {};

  if (_.isEmpty(cfg.chartDefinition.data)) {
    cfg.chartDefinition.data = {
      metadata: [],
      queryInfo: {
        totalRows: "0"
      },
      resultset: []
    };
  }

  //分页
  props.pagination = _buildPaginationConfig(options);

  //构建列
  props.columns = _buildColumnsConfig(
    cfg.chartDefinition.data || {},
    options,
    inst
  );

  //构建数据
  props.dataSource = _buildDatasourceConfig(
    cfg.chartDefinition.data || {},
    options
  );

  //footer
  props.footer = _buildFooterConfig(cfg, options, inst);

  return props;
}
