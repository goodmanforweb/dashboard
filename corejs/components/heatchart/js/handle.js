import WidgetBase from "corejs/components/base";

import Immutable from "immutable";

export default class handle extends WidgetBase {
    constructor(htmlObj, cfg) {
        super(htmlObj, cfg);
    }
    _bindClickEvent() {
        //事件绑定
        this.echartsDom.on("click", e => {
            const chartDefinition = this.cfg.chartDefinition;
            const params = chartDefinition.option.clickParmas;

            switch (chartDefinition.option.clickEvent) {
                case "drill":
                    this.handleDefinition(chartDefinition, e.name);
                    this.draw();
                    break;
                case "interact":
                    var _params = Immutable.fromJS(params).toJS();
                    _params.category.value = e.name; //x轴
                    _params.series.value = this.echartsDom.getOption().yAxis[0].data[
                        e.value[1]
                    ]; //y轴
                    _params.value.value = e.value[2];
                    var thisparam = Object.values(_params).filter(el =>
                        /param/.test(el.id)
                    );
                    // Immutable
                    const globalParam = window.Dashboard.globalParam;
                    globalParam.updateParams(thisparam);
                    break;
                default:
                    break;
            }
        });
    }
    _bindHoverEvent() {
        this.echartsDom.on("mouseover", e => {
            if (e.componentType != "markPoint") {
                this.markPointIndex == null;
                return null;
            }
            if (e.data.itemStyle.opacity == 0.3) {
                this.markPointIndex = [e.data.coord, 1];
                this.update({});
            }
        });
        this.echartsDom.on("mouseout", e => {
            if (e.componentType != "markPoint") {
                this.markPointIndex == null;
                return null;
            }
            if (e.data.itemStyle.opacity == 1) {
                this.markPointIndex = [e.data.coord, 0.3];
                this.update({});
            }
        });
    }

    /**
     *
     * @param {*} tempOption  大模板
     * @param {*} enumOption  枚举属性
     * @param {*} htmlObj
     */
    _handleEnumOption(tempOption, enumOption, htmlObj) {
        for (let item in enumOption) {
            this._handlePerOption(
                item,
                enumOption[item],
                tempOption,
                htmlObj,
                enumOption
            );
        }
        return tempOption;
    }
    _handlePerOption(item, value, option, htmlObj, enumOption) {
        switch (item) {
            case "title":
                //用rich 是因为 要给标题设置背景颜色
                option.title.z = -2;
                option.title.padding = [0, 0, 0, 5];
                option.title.text = `{a|${value}}`;
                option.title.textStyle.rich.a = {
                    lineHeight: 40,
                    fontSize: 16,
                    width: 10000
                };
                //调整坐标系位置
                // option.series.top = 40 + 5;
                break;
            case "titleBackgroundColor":
                option.title.backgroundColor = value || "transparent";
                if (this.cfg.chartDefinition.option.title === "") {
                    option.title.backgroundColor = "transparent";
                }
                break;
            case "titlePosition":
                option.title.left = value;
                break;
            case "isExportData":
                /* document.querySelector(
                    "#" + this.cfg.id + " .chartCsv"
                ).style.display = value ? "block" : "none"; */
                Dashboard.lib
                    .$("#" + this.cfg.id + " .chartCsv")
                    .css({ display: value ? "block" : "none" });
                break;
            case "color":
                if (value.length > 0) {
                    //如果 visualMap 为 continuous，那么 就不设置颜色
                    if (enumOption.visualMap == "piecewise") {
                        option.color = value;
                        //同时修改视觉管道的颜色
                        option.visualMap.inRange.color = value.slice(0, 5);
                    } else {
                        delete option.color;
                    }
                }
                break;
            case "backgroundColor":
                value && (htmlObj.style[item] = value);
                if (this.cfg.parentId) {
                    htmlObj.style[item] = "rgba(0, 0, 0, 0)";
                }
                break;
            case "textColor":
                if (value.length > 0) {
                    //设置主要颜色
                    option.title.textStyle.color = value[0];
                    //设置次要颜色
                    // 刻度文字、坐标名字
                    value[1] &&
                        (function(axises, option, value) {
                            axises.forEach(axis => {
                                //坐标名字颜色
                                option[axis].nameTextStyle.color = value;
                                //坐标刻度文字颜色
                                option[axis].axisLabel.color = value;
                            });
                        })(["xAxis", "yAxis"], option, value[1]);
                }
                break;
            case "lineColor":
                if (value.length > 0) {
                    (function(axises, option, value) {
                        axises.forEach(axis => {
                            value[0] &&
                                (option[axis].axisLine.lineStyle.color =
                                    value[0]);
                        });
                    })(["xAxis", "yAxis"], option, value);
                }
                break;
            case "visualMap":
                option.visualMap.type = value;
                //处理视觉管道逻辑
                // option.visualMap.inRange.color = value === 'continuous' ? ['#bf444c', '#d88273', '#f6efa6'].reverse() : enumOption.color;
                option.visualMap.inRange.color =
                    value === "continuous"
                        ? enumOption.color.slice(0, 2)
                        : enumOption.color.slice(0, 5);

                break;
            case "exampleMin":
                option.visualMap.min = value;
                break;
            case "exampleMax":
                option.visualMap.max = value;
                break;
            case "example":
                this.handleExample(item, value, option, htmlObj, enumOption);
                //调整坐标系位置
                this.adjustGrid(item, value, option, htmlObj, enumOption);
                break;
            case "xAixsName":
                option.xAxis.name = value;
                option.xAxis.nameGap = 30;
                break;
            case "xAixsPosition":
                option.xAxis.show = true;
                option.xAxis.position = value;
                value === "null" && (option.xAxis.show = false);
                break;
            case "yAixsName":
                option.yAxis.name = value;
                option.yAxis.nameGap =
                    this.measureTextWidth(
                        this.getLabelMaxLength(option.yAxis.data).maxValue
                    ) + 15;
                break;
            case "yAixsPosition":
                option.yAxis.show = true;
                option.yAxis.position = value;
                if (value === "null") {
                    option.yAxis.show = false;
                }
                //调整坐标系位置
                this.adjustGrid(item, value, option, htmlObj, enumOption);
                break;
            case "axisTick":
                option.xAxis.axisTick.show = value;
                option.yAxis.axisTick.show = value;
                break;
            case "showData":
                option.series[0].label.show = value;
                break;
            case "dataFormater":
                //调整图例 单位
                let func =
                    value === 0
                        ? e => e
                        : e =>
                              e / Math.pow(10, value).toFixed(3) +
                              {
                                  0: "无",
                                  3: "千",
                                  4: "万",
                                  6: "百万",
                                  8: "亿"
                              }[value];
                option.visualMap.formatter = function(e) {
                    return func(e);
                };
                option.series[0].label.formatter = e =>
                    e.value[2]
                        ? (e.value[2] / Math.pow(10, value)).toFixed(3)
                        : 0;
                break;
            default:
                break;
        }
    }

    handleExample(item, value, option, htmlObj, enumOption) {
        option.visualMap.show = true;
        switch (value) {
            case "top":
                option.visualMap.orient = "horizontal";
                option.visualMap.top = 0;
                option.visualMap.left = "center";
                break;
            case "bottom":
                option.visualMap.orient = "horizontal";
                option.visualMap.top = "bottom";
                option.visualMap.left = "center";
                break;
            case "left":
                option.visualMap.orient = "vertical";
                option.visualMap.top = "middle";
                option.visualMap.left = "left";
                break;
            case "right":
                option.visualMap.orient = "vertical";
                option.visualMap.top = "middle";
                option.visualMap.left = "right";
                break;
            case "null":
                option.visualMap.show = false;
                break;
            default:
        }
        return option;
    }
    /**
     * 使用canvas 测量字符所占长度
     * @param {*} text
     * @param {*} fontSize
     */
    measureTextWidth(text, fontSize = 12) {
        let ctx = document.createElement("canvas").getContext("2d");
        ctx.font = `${fontSize}px Arial`;
        return ctx.measureText(text).width;
    }
    /**
     * 找出字符最长的一个
     * @param {*} arr
     */
    getLabelMaxLength(arr = []) {
        let maxLength = 0,
            maxIndex = 0;
        let tempArr = arr.map(el => {
            let str = el + "".trim(),
                strLen = 0;
            for (let i = 0, len = str.length; i < len; i++) {
                if (str[i].charCodeAt(i) > 256) {
                    strLen += 3;
                } else {
                    strLen++;
                }
            }
            return strLen;
        });
        //找到最大值 和 对应索引
        maxLength = Math.max.apply(Array, tempArr);
        if (maxLength) {
            maxIndex = tempArr.indexOf(maxLength);
        }
        return {
            maxLength,
            maxIndex,
            maxValue: arr[maxIndex]
        };
    }
    /**
     * 主要处理 两类  图例变化引起 坐标系的调整； 隐藏Y轴引起坐标系的调整
     *
     * @param {*} item
     * @param {*} value
     * @param {*} option
     * @param {*} htmlObj
     * @param {*} enumOption
     */
    adjustGrid(item, value, option, htmlObj, enumOption) {
        //如果坐标轴 和  图例 在同一个位置，就需要计算坐标系位置
        const chartMargin = 10; //图表边距
        const titleHeight = 40; //标题高度
        const xAixsTextHeight = 30;
        let max = option.visualMap.max;
        let lengendMaxWidth =
            enumOption.visualMap === "continuous"
                ? 50 + this.measureTextWidth(max + "")
                : 40 + this.measureTextWidth(`${max - max / 5} - ${max}`) + 10;
        let lengendHeight = enumOption.visualMap === "continuous" ? 40 : 20;
        //找出y轴中字符最长的一个做为基准
        let maxStrObj = this.getLabelMaxLength(option.yAxis.data);
        let YLabelMaxLength =
            10 + this.measureTextWidth(maxStrObj.maxValue) + 10;
        //这里采用独立思想  ，我只关心 最后组合的结果
        let yAixsObj = handleGridByYAixs(
            item,
            value,
            option,
            htmlObj,
            enumOption,
            YLabelMaxLength
        );
        let xAixsObj = handleGridByXAixs(
            item,
            value,
            option,
            htmlObj,
            enumOption
        );
        let exmpleObj = handleGridByExmaple(
            item,
            value,
            option,
            htmlObj,
            enumOption,
            lengendMaxWidth
        );

        option.grid.left = yAixsObj.left + exmpleObj.left + 20;
        option.grid.right = yAixsObj.right + exmpleObj.right + 20;

        let gridTop =
            (enumOption.title.length ? titleHeight : 0) +
            xAixsObj.top +
            exmpleObj.top;
        option.grid.top = gridTop == 0 && this.isWarnWorking ? 20 : gridTop;

        if (enumOption.example === "top") {
            option.visualMap.top = enumOption.title.length ? titleHeight : 0;
        }
        option.grid.bottom = xAixsObj.bottom + exmpleObj.bottom + 20;

        function handleGridByYAixs(
            item,
            value,
            option,
            htmlObj,
            enumOption,
            YLabelMaxLength
        ) {
            let tempObj = {
                left: 0,
                right: 0
            };
            if (enumOption.yAixsPosition === "null") {
            } else if (enumOption.yAixsPosition === "left") {
                tempObj = {
                    left: YLabelMaxLength,
                    right: 0
                };
            } else if (enumOption.yAixsPosition === "right") {
                tempObj = {
                    right: YLabelMaxLength,
                    left: 0
                };
            }
            return tempObj;
        }
        function handleGridByXAixs(item, value, option, htmlObj, enumOption) {
            let tempObj = {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            };
            switch (enumOption.xAixsPosition) {
                case "null":
                    tempObj.top = 0;
                    tempObj.bottom = 0;
                    break;
                case "top":
                    tempObj.top = xAixsTextHeight;
                    tempObj.bottom = 0;
                    break;
                case "bottom":
                    tempObj.top = 0;
                    tempObj.bottom = xAixsTextHeight;
                    break;
                default:
            }
            return tempObj;
        }
        function handleGridByExmaple(
            item,
            value,
            option,
            htmlObj,
            enumOption,
            lengendMaxWidth
        ) {
            let tempObj = {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            };
            switch (enumOption.example) {
                case "null":
                    tempObj = {
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0
                    };
                    break;
                case "left":
                    tempObj.left = lengendMaxWidth;
                    tempObj.right = 0;
                    break;
                case "right":
                    tempObj.right = lengendMaxWidth;
                    tempObj.left = 0;
                    break;
                case "top":
                    tempObj = {
                        left: 0,
                        right: 0,
                        top: lengendHeight,
                        bottom: 0
                    };
                    break;
                case "bottom":
                    tempObj = {
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: lengendHeight
                    };
                    break;
                default:
            }

            return tempObj;
        }
        return option;
    }
    /**
     *
     * @param {Array} warnSeries 预警指标
     * @param {Obj} metadata  ajax 返回的元数据
     * @param {Obj} warn  option中预警字段
     * @return {function} warnFunc el数组中的一条数据  temObj： data
     */
    handleWarn(warnSeries = [], metadata = {}, warn = {}) {
        //抛出指标事件
        this.dispatch("seriesListChange", warnSeries);

        let colIndex = 0,
            tempObj2 = { visualMap: false, itemStyle: { color: warn.color } };
        tempObj2 = (el, xAxis, yAxis) => {
            let coord = [xAxis.indexOf(el[0]), yAxis.indexOf(el[1])];
            let opacity = 0.3;
            if (Array.isArray(this.markPointIndex)) {
                if (coord.join("") == this.markPointIndex[0].join("")) {
                    opacity = this.markPointIndex[1];
                }
            }
            return {
                coord,
                itemStyle: { color: warn.color, opacity },
                symbolOffset: [0, 5],
                symbolSize: warn.markerSize
            };
        };
        if (warnSeries.includes(warn.series)) {
            //找到对应的列
            colIndex = metadata.find(el => el.colName === warn.series).colIndex;
        }
        //series  和 switch  同时存在  才执行 warn逻辑
        let warnFunc =
            warn.switch && warn.series && warn.filter && warn.value != ""
                ? function(el, tempObj, xAxis, yAxis) {
                      if (
                          //   eval(`${el[colIndex]} ${warn.filter} ${warn.value}`)
                          new Function(
                              "",
                              "return " +
                                  el[colIndex] +
                                  warn.filter +
                                  warn.value
                          )()
                      ) {
                          return tempObj2(el, xAxis, yAxis);
                          // Object.assign(tempObj, tempObj2)
                      }
                  }
                : null;

        return warnFunc;
    }
    _handleData(data, tempOption, enumOption) {
        //检测是否符合类型
        if (
            data.metadata[0].colType != "String" ||
            data.metadata[1].colType != "String" ||
            (data.metadata[2].colType != "Numeric" &&
                data.metadata[2].colType != "Integer")
        ) {
            console.warn("数据格式错误");
            return false;
        }
        // 找出预警指标,根据业务自定义
        let warnSeries = [data.metadata[2].colName];
        this.cfg.chartDefinition.option.warn.seriesList = warnSeries;

        let tempArr = [],
            xAxis = [],
            yAxis = [],
            maxValueArr = [];
        //第一次循环分离出  x y;
        data.resultset.forEach(el => {
            xAxis.push(el[0]);
            yAxis.push(el[1]);
            maxValueArr.push(el[2]);
        });
        //计算图例最值
        tempOption.visualMap.max = Math.ceil(
            Math.max.apply(Array, maxValueArr)
        );
        tempOption.visualMap.min = Math.floor(
            Math.min.apply(Array, maxValueArr)
        );

        xAxis = [...new Set(xAxis)];
        yAxis = [...new Set(yAxis)];
        tempOption.xAxis.data = xAxis;
        tempOption.yAxis.data = yAxis;
        //第二次循环 构造 data

        let warnFunc = this.handleWarn(
            warnSeries,
            data.metadata,
            enumOption.warn
        );
        let warnData = [];
        tempOption.series[0].data = data.resultset.map(el => {
            let tempObj = {};
            tempObj.value = [
                xAxis.indexOf(el[0]),
                yAxis.indexOf(el[1]),
                el[2] || "-"
            ];
            if (warnFunc) {
                warnFunc(el, tempObj, xAxis, yAxis) &&
                    warnData.push(warnFunc(el, tempObj, xAxis, yAxis));
            }
            // warnFunc && warnFunc(el, tempObj);
            return tempObj;
        });
        //添加预警标记
        this.isWarnWorking = false;
        if (warnData.length) {
            this.isWarnWorking = true;
            tempOption.series[0].markPoint.data = warnData;
        } else {
            tempOption.series[0].markPoint.data = [];
        }
        // 处理tooltip逻辑
        tempOption.tooltip.formatter = e => {
            if (e.componentType == "markPoint") return "";
            return `${xAxis[e.value[0]]},${yAxis[e.value[1]]} : ${e.value[2]}`;
        };

        return tempOption;
    }
}
