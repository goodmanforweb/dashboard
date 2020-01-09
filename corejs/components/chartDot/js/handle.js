import WidgetBase from "corejs/components/base";
import Immutable, { Map, is } from "immutable";
import ecStat from "echarts-stat";
import _ from "lodash";

export default class handle extends WidgetBase {
    constructor(htmlObj, cfg) {
        super(htmlObj, cfg);
    }
    //事件绑定
    _bindClickEvent() {
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
                    _params.category.value = e.data[0];
                    _params.series.value = e.seriesName;
                    _params.value.value = e.data[1];
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
    //初始化图表的数据
    _initOption() {
        this.Ydata = [100];
        const { util } = window.Dashboard;
        const { defaultOption } = this.cfg.chartDefinition;
        let thisOption = util.copy(true, {}, defaultOption, this._option);
        util.copy(true, this._option, thisOption);
    }
    /**
     * 处理预警
     * @param {*} warn 预警字段
     * @param {*} option 图表配置项
     * @param {*} data 图表数据
     */
    _handlewarn(warn, option, data, orientation) {
        if (!data.metadata || !warn.seriesList || !warn.switch) {
            return false;
        }
        let tempList = [];

        option.series.forEach(e => {
            if (!e.tag) {
                tempList.push("x->" + e.name);
                tempList.push("y->" + e.name);
            }
        });

        warn.seriesList = tempList;
        this.dispatch("seriesListChange", warn.seriesList);
        let _warn = {};
        warn.value.forEach(e => {
            e.series.length && (_warn[e.series] = e);
        });
        let _series = Object.values(_warn);
        /*let _orientation = orientation === "vertical" ? 0 : 1;*/
        if (_series.length) {
            var axisType = 0;
            option.series.forEach(e => {
                let selfSeries = _series.find(ee => {
                    if (e.name == ee.series.split("->")[1]) {
                        if (ee.series.split("->")[0] == "x") {
                            axisType = 0;
                            return true;
                        } else if (ee.series.split("->")[0] == "y") {
                            axisType = 1;
                            return true;
                        }
                    } else {
                        return false;
                    }
                });
                selfSeries &&
                    e.data.forEach((item, i) => {
                        if (
                            /* eval(item[axisType] + selfSeries.filter + selfSeries.value) */
                            /*typeof item === "number" &&
                       */
                            new Function(
                                "",
                                "return " +
                                    item[axisType] +
                                    selfSeries.filter +
                                    selfSeries.value
                            )()
                        ) {
                            if (selfSeries.markType) {
                                e.markPoint = e.markPoint || {
                                    symbol: "pin",
                                    data: [],
                                    itemStyle: {}
                                };
                                e.markPoint.itemStyle.color = selfSeries.color;

                                e.markPoint.data.push({
                                    name: "某个坐标",
                                    /*valueIndex: _orientation,*/
                                    coord: [item[0], item[1]]
                                });
                            }
                            e.data[i] = {
                                value: item,
                                itemStyle: {
                                    normal: { color: selfSeries.color }
                                }
                            };
                        }
                    });
            });
        }
    }
    //处理样式操作的option
    _handleOption(option) {
        //处理option
        const chartDefinition = this.cfg.chartDefinition;
        //处理样式操作数据
        this._option = this._handleEnumOption(
            chartDefinition.option,
            this._option,
            this.htmlObj
        );
        this._customizeBar(option, this.htmlObj, chartDefinition.option); //xy轴间距调整
        //处理代码注入数据
        // this._option = handleChart.handleInjectOption(chartDefinition.injectOption,this._option);
        this._handlewarn(
            chartDefinition.option.warns,
            option,
            chartDefinition.data,
            chartDefinition.option.orientation
        );
        return this._option;
    }
    //处理可枚举属性
    _handleEnumOption(store, option, htmlObj) {
        for (let item in store) {
            this._handlePerStore(item, store[item], option, htmlObj, store);
        }
        this._handleExample(store.example, option, htmlObj, store);
        return option;
    }
    //处理属性
    _handlePerStore(item, value, option, htmlObj, ownOption) {
        switch (item) {
            case "title":
                //用rich 是因为 要给标题设置背景颜色
                option.title.z = -2;
                option.title.padding = [0, 0, 0, 5];
                option.title.text = `{a|${value}}`;

                if (value > 0) {
                    option.title.option.height = 40;
                } else {
                    option.title.option.height = 10;
                }
                option.title.textStyle.rich.a = {
                    lineHeight: 40,
                    fontSize: 16,
                    width: 10000
                };
                //调整坐标系位置
                // option.grid.top = 40 + 5;
                break;
            //标题位置
            case "titlePosition":
                option.title.left = value;
                option.title.height = 100;
                break;
            //标题颜色
            case "titleBackgroundColor":
                option.title.backgroundColor = value || "transparent";
                if (this.cfg.chartDefinition.option.title === "") {
                    option.title.backgroundColor = "transparent";
                }
                break;
            //图例位置
            /*case 'example':
            this._handleExample(value, option, htmlObj,ownOption);
            break;*/
            //是否导出数据
            case "isExportData":
                // option.toolbox.feature.myTool2.show = value;
                /* document.querySelector(
                    "#" + this.cfg.id + " .chartCsv"
                ).style.display = value ? "block" : "none"; */
                Dashboard.lib
                    .$("#" + this.cfg.id + " .chartCsv")
                    .css({ display: value ? "block" : "none" });
                break;
            //是否显示网格线
            case "gridLine":
                for (let i of option.yAxis) {
                    if (i.tag) continue;
                    i.splitLine.show = value;
                }

                for (let i of option.xAxis) {
                    if (i.tag) continue;
                    i.splitLine.show = value;
                }

                break;
            //图表颜色
            case "color":
                if (value.length > 0) {
                    option.color = value;
                }
                break;
            //统一透明度
            case "opacity":
                option.color = option.color.map(cl => {
                    return this.colorRgb(cl, value);
                });
                break;
            //x轴
            case "xaxis":
                for (let i of option.xAxis) {
                    i.show = ownOption[item];
                }
                break;
            //y轴
            case "yaxis":
                for (let i of option.yAxis) {
                    i.show = ownOption[item];
                }
                break;
            //x轴刻度线
            case "xaxisTick":
                for (let i of option.xAxis) {
                    i.axisTick.show = ownOption[item];
                }
                break;
            //y轴刻度线
            case "yaxisTick":
                for (let i of option.yAxis) {
                    i.axisTick.show = ownOption[item];
                }
                break;
            //x轴基线
            case "xBaseLine":
                let obj;

                if (ownOption[item] === "average") {
                    obj = { type: "average", name: "平均值", valueIndex: 0 };
                } else if (ownOption[item] === "auto") {
                    obj = { xAxis: "auto" };
                } else {
                    obj = { xAxis: ownOption[item] };
                }
                for (let i of option.series) {
                    if (i.tag) continue;
                    obj && i.markLine.data.push(obj);
                }
                break;
            // y轴基线
            case "yBaseLine":
                let objY;
                if (ownOption[item] === "average") {
                    objY = { type: "average", name: "平均值", valueIndex: 1 };
                } else if (ownOption[item] === "auto") {
                    objY = { yAxis: "auto" };
                } else {
                    objY = { yAxis: ownOption[item] };
                }
                for (let i of option.series) {
                    if (i.tag) continue;
                    objY && i.markLine.data.push(objY);
                }
                break;
            //值轴标题
            case "xaxisTitle":
                for (let i of option.xAxis) {
                    i.name = ownOption[item];

                    if (ownOption[item].length > 0) {
                        i.option.height = 18;
                    } else {
                        i.option.height = 0;
                    }
                }
                break;
            //值轴标题
            case "yaxisTitle":
                for (let i of option.yAxis) {
                    i.name = value;
                    i.nameGap = this.countYMaxLen(ownOption);
                    if (ownOption[item].length > 0) {
                        i.option.width = 18;
                    } else {
                        i.option.width = 0;
                    }
                }
                break;
            //x轴数据单位
            case "xunit":
                for (let i of option.xAxis) {
                    if (ownOption[item] === "none") {
                        i.axisLabel.formatter = v => v;
                    } else if (ownOption[item] === 1000) {
                        i.axisLabel.formatter = function(v, index) {
                            // 格式化成月/日，只在第一个刻度显示年份
                            v = v / 1000;
                            return v + "千";
                        };
                    } else if (ownOption[item] === 10000) {
                        i.axisLabel.formatter = function(v, index) {
                            // 格式化成月/日，只在第一个刻度显示年份
                            v = v / 10000;
                            return v + "万";
                        };
                    } else if (ownOption[item] === 1000000) {
                        i.axisLabel.formatter = function(v, index) {
                            // 格式化成月/日，只在第一个刻度显示年份
                            v = v / 1000000;
                            return v + "百万";
                        };
                    } else if (ownOption[item] === 100000000) {
                        i.axisLabel.formatter = function(v, index) {
                            // 格式化成月/日，只在第一个刻度显示年份
                            v = v / 100000000;
                            return v + "亿";
                        };
                    }
                }
                break;
            //y轴数据单位
            case "yunit":
                for (let i of option.yAxis) {
                    if (ownOption[item] === "none") {
                        i.axisLabel.formatter = v => v;
                    } else if (ownOption[item] === 1000) {
                        i.axisLabel.formatter = function(v, index) {
                            // 格式化成月/日，只在第一个刻度显示年份
                            v = (v / 1000).toFixed(3);
                            return v + "千";
                        };
                    } else if (ownOption[item] === 10000) {
                        i.axisLabel.formatter = function(v, index) {
                            // 格式化成月/日，只在第一个刻度显示年份
                            v = (v / 10000).toFixed(3);
                            return v + "万";
                        };
                    } else if (ownOption[item] === 1000000) {
                        i.axisLabel.formatter = function(v, index) {
                            // 格式化成月/日，只在第一个刻度显示年份
                            v = (v / 1000000).toFixed(3);
                            return v + "百万";
                        };
                    } else if (ownOption[item] === 100000000) {
                        i.axisLabel.formatter = function(v, index) {
                            // 格式化成月/日，只在第一个刻度显示年份
                            v = (v / 100000000).toFixed(3);
                            return v + "亿";
                        };
                    }
                }
                break;
            //背景颜色
            case "backgroundColor":
                value && (htmlObj.style[item] = value);
                if (this.cfg.parentId) {
                    htmlObj.style[item] = "rgba(0, 0, 0, 0)";
                }
                break;
            //文字颜色
            case "textColor":
                if (value.length > 0) {
                    //设置主要颜色
                    option.title.textStyle.color = value[0];
                    //设置次要颜色
                    //图例颜色
                    value[1] && (option.legend.textStyle.color = value[1]);
                    // 刻度文字、坐标名字
                    value[1] &&
                        (function(axises, option, value) {
                            axises.forEach(axise => {
                                option[axise].forEach(axis => {
                                    //坐标名字颜色
                                    axis.axisLine.nameTextStyle.color = value;
                                    //坐标刻度文字颜色
                                    axis.axisLabel.color = value;
                                });
                            });
                        })(["xAxis", "yAxis"], option, value[1]);
                }
                break;
            //线条颜色
            case "lineColor":
                if (value.length > 0) {
                    (function(axises, option, value) {
                        axises.forEach(axise => {
                            option[axise].forEach(axis => {
                                value[0] &&
                                    (axis.axisLine.lineStyle.color = value[0]);
                                value[1] &&
                                    (axis.splitLine.lineStyle.color = value[1]);
                            });
                        });
                    })(["xAxis", "yAxis"], option, value);
                }
                break;
            //是否显示数据
            case "showData":
                for (let i of option.series) {
                    if (i.tag) continue;
                    i.label.normal.show = value;
                }
                break;
            //标记图形
            case "symbol":
                for (let i of option.series) {
                    i.symbol = value;
                }
                break;
            //图像标记大小
            case "symbolSize":
                for (let i of option.series) {
                    if (i.tag) continue;
                    i.symbolSize = value;
                    i.label.normal.offset[1] =
                        i.label.normal.offset[1] + value / 2;
                }
                break;
            //标线
            case "markLine":
                let data = option.series.filter(function(item) {
                    return item.tag == undefined;
                });
                let fn;
                if (ownOption[item] === "exponential") {
                    fn = this.exponential;
                } else if (ownOption[item] === "logarithmic") {
                    fn = this.logarithmic;
                } else if (ownOption[item] === "line") {
                    fn = this.lineFn;
                } else if (ownOption[item] === "auto") {
                    break;
                } else if (typeof ownOption[item] === "number") {
                    fn = this.polynomial;
                } else if (
                    typeof ownOption[item] === "string" &&
                    (ownOption[item] != "auto" ||
                        ownOption[item] != "number" ||
                        ownOption[item] != "line" ||
                        ownOption[item] != "logarithmic" ||
                        ownOption[item] != "exponential" ||
                        ownOption[item] != "null")
                ) {
                    fn = this.polynomial;
                } else {
                    fn = null;
                }
                option.legend.data = option.legend.data.filter(
                    e => typeof e !== "object"
                );
                option.series = option.series.filter(
                    e => !/-趋势线/.test(e.name)
                );
                if (fn) {
                    for (let i of data) {
                        if (i.data[0].length == 3) {
                            var list = {
                                name: i.name + "-趋势线",
                                tag: true,
                                type: "line",
                                smooth: true,
                                symbolSize: 1,
                                data: fn(i.originData, ownOption[item])
                            };
                        } else {
                            var list = {
                                name: i.name + "-趋势线",
                                tag: true,
                                type: "line",
                                smooth: true,
                                symbolSize: 1,
                                data: fn(i.data, ownOption[item])
                            };
                        }
                        option.legend.data.push({ name: list.name, iii: "11" });
                        option.series.push(list);
                        console.log(option.series);
                    }
                }
                break;
            default:
                break;
        }
    }

    countYMaxLen(ownOption) {
        // 正负号 所占 宽度
        const countWidth = 14;
        // y轴 最长 字符
        let maxYLen = "",
            maxYPx = 0,
            temp = [];
        let unit = {
            1000: "千",
            10000: "万",
            1000000: "百万",
            100000000: "亿"
        }[ownOption.yunit];
        if (ownOption.yunit === "none") {
            maxYLen = Math.max.apply(Array, this.Ydata.map(dd => Math.abs(dd)));
            maxYPx = this.measureTextWidth(Math.round(maxYLen)) + countWidth;
        } else {
            temp = this.Ydata.map(dd => Math.abs(dd)).map(dd => {
                return (dd / ownOption.yunit).toFixed(3);
            });
            maxYLen = Math.max.apply(Array, temp).toFixed(3) + unit;
            maxYPx = this.measureTextWidth(maxYLen) + countWidth;
        }
        // 计算px
        return maxYPx;
    }

    //设置grid

    // option.grid.bottom = 50;
    //  option.grid.left = 50;
    //  option.grid.right = 50;
    //  option.grid.top = 50;
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

    /*找出貌似最长的一个字符串*/
    getLabelMax(arr = []) {
        console.log("caonima");
        console.log(arr);
        //判断有无趋势线
        let length = arr.length;
        let max = 0;

        if (
            typeof arr[length / 2] === "object" &&
            arr[length / 2].hasOwnProperty("name")
        ) {
            //如果有趋势线的话，找出最长的字符串
            for (let i = 0; i < length / 2; i++) {
                if (arr[i].length > max) {
                    max = arr[i].length;
                }
            }
            return max + 4;
        } else {
            for (let i = 0; i < length; i++) {
                if (arr[i].length > max) {
                    max = arr[i].length;
                }
            }
            return max;
        }
    }

    _customizeBar(option, htmlObj, enumOption) {
        //如果坐标轴 和  图例 在同一个位置，就需要计算坐标系位置
        // const chartMargin = 10;//图表边距
        // const titleHeight = 40;//标题高度
        // // const bottomGap = enumOption.axisTitle.length  ? 55 : 45;
        // let maxStrObj = this.getLabelMaxLength(option.legend.data);
        // // let lengthWidth = 10 + + 30 + this.measureTextWidth(maxStrObj.maxValue) + 10;
        // console.log("max");
        // console.log(maxStrObj);

        return option;
    }

    //处理图例位置
    _handleExample(value, chartOption, htmlObj, ownOption) {
        const legendHeight = 28;
        const chartMargin = 10; //图表边距
        const titleHeight = 30; //标题高度
        /*chartOption.legend.top = 'auto';
    chartOption.legend.right = 'auto';
    chartOption.legend.left = 'auto';
    chartOption.legend.bottom = 'auto';*/
        chartOption.legend.orient = "horizontal";
        chartOption.legend.show = true;
        chartOption._grid =
            chartOption._grid || Object.assign({}, chartOption.grid);
        var option = {
            chartOption: chartOption,
            height: parseInt(htmlObj.clientHeight, 10),
            width: parseInt(htmlObj.clientWidth, 10),
            type: "line"
        };
        //计算图例的最长长度
        let exampleTitleLength = this.getLabelMax(chartOption.legend.data);
        chartOption.legend.option.width = exampleTitleLength * 16 + 30 + 10;
        console.log("yingadie");
        console.log(chartOption.legend.option.width);
        let titleTop = ownOption.title.length > 0 ? 35 : 10;

        switch (value) {
            case "null":
                chartOption.legend.show = false;
                chartOption.grid.top = titleTop;
                break;
            case "top":
                chartOption.legend.show = true;
                chartOption.legend.left = "center";
                chartOption.legend.top = titleTop;
                chartOption.grid.top = titleTop + legendHeight;
                chartOption.grid.bottom +=
                    ownOption.xaxisTitle.length > 0 ? 20 : 0;
                break;
            case "left":
                chartOption.legend.show = true;
                chartOption.legend.left = 15;
                chartOption.legend.top = "center";
                chartOption.legend.orient = "vertical";
                chartOption.grid.top = titleTop;
                chartOption.grid.right = 20;
                chartOption.grid.left =
                    chartOption.legend.option.width +
                    (ownOption.yaxisTitle.length > 0 ? 20 : 5);
                chartOption.legend.width = chartOption.legend.option.width;
                break;
            case "right":
                chartOption.legend.show = true;
                chartOption.legend.right = 15;
                chartOption.legend.top = "center";
                chartOption.legend.orient = "vertical";
                chartOption.grid.top = titleTop;
                chartOption.grid.right =
                    chartOption.legend.option.width +
                    (ownOption.yaxisTitle.length > 0 ? 20 : 5);
                chartOption.legend.width = chartOption.legend.option.width;
                break;
            case "bottom":
                chartOption.legend.show = true;
                chartOption.legend.left = "center";
                chartOption.legend.orient = "horizontal";
                chartOption.legend.top = "auto";
                chartOption.legend.bottom = 10;
                chartOption.grid.top = titleTop;
                chartOption.grid.bottom +=
                    (ownOption.xaxisTitle.length > 0 ? 10 : 0) + legendHeight;
                break;
            default:
                break;
        }
    }
    //处理请求返回的data
    _handleData(data, option, ownOption, drillName) {
        let ownData = Immutable.fromJS(data).toJS();
        if (is(Map(ownData), Map({}))) return option;
        //第一步找到lengend的类型和数量
        //包含详细信息的数组
        var dataset = {};
        if (data.resultset) {
            var set = data.resultset;
            if (set[0].length == 4) {
                //第一种情况  可以包含多个类别的情况
                for (let i = 0; i < set.length; i++) {
                    if (dataset.hasOwnProperty(set[i][1])) {
                        dataset[set[i][1]].push([
                            set[i][2],
                            set[i][3],
                            set[i][0]
                        ]);
                    } else {
                        dataset[set[i][1]] = [];
                        dataset[set[i][1]].push([
                            set[i][2],
                            set[i][3],
                            set[i][0]
                        ]);
                    }
                }
            } else if (set[0].length == 3) {
                for (let i = 0; i < set.length; i++) {
                    if (dataset.hasOwnProperty("未指定类别")) {
                        dataset["未指定类别"].push([
                            set[i][1],
                            set[i][2],
                            set[i][0]
                        ]);
                    } else {
                        dataset["未指定类别"] = [];
                        dataset["未指定类别"].push([
                            set[i][1],
                            set[i][2],
                            set[i][0]
                        ]);
                    }
                }
            }

            this.Ydata = Object.values(dataset)
                .reduce((prev, next) => {
                    return prev.concat(next);
                }, [])
                .map(dd => dd[1]);

            //第二种情况   没有类别这个字段的情况
        }
        //不包含详细信息的数组
        var originset = {};
        if (data.resultset) {
            var set = data.resultset;
            if (set[0].length == 4) {
                for (let i = 0; i < set.length; i++) {
                    if (originset.hasOwnProperty(set[i][1])) {
                        originset[set[i][1]].push([set[i][2], set[i][3]]);
                    } else {
                        originset[set[i][1]] = [];
                        originset[set[i][1]].push([set[i][2], set[i][3]]);
                    }
                }
            } else if (set[0].length == 3) {
                for (let i = 0; i < set.length; i++) {
                    if (originset.hasOwnProperty("未指定类别")) {
                        originset["未指定类别"].push([set[i][1], set[i][2]]);
                    } else {
                        originset["未指定类别"] = [];
                        originset["未指定类别"].push([set[i][1], set[i][2]]);
                    }
                }
            }
        }

        this.setChartData(option, dataset, originset);
        return option;
    }
    zip(arr = []) {
        let array = [];
        let length = this.maxLength(arr);
        for (let i = 0; i < length; i++) {
            let tempArr = [];
            arr.forEach(function(item) {
                tempArr.push(item[i]);
            });
            array.push(tempArr);
        }
        return array;
    }
    //线性方程
    // lineFn(data) {
    //   /**
    //    * <p>
    //    * 函数功能：最小二乘法曲线拟合
    //    * </p>
    //    * <p>
    //    * 方程:Y = a(0) + a(1) * (X - X1)+ a(2) * (X - X1)^2 + ..... .+ a(m) * (X -
    //    * X1)^m X1为X的平均数
    //    * </p>
    //    *
    //    * @param x
    //    *            实型一维数组,长度为 n. 存放给定 n 个数据点的 X 坐标
    //    * @param y
    //    *            实型一维数组,长度为 n.存放给定 n 个数据点的 Y 坐标
    //    * @param n
    //    *            变量。给定数据点的个数
    //    * @param a
    //    *            实型一维数组，长度为 m.返回 m-1 次拟合多项式的 m 个系数
    //    * @param m
    //    *            拟合多项式的项数，即拟合多项式的最高次数为 m-1. 要求 m<=n 且m<=20。若 m>n 或 m>20
    //    *            ，则本函数自动按 m=min{n,20} 处理.
    //    *            <p>
    //    *            Date:2007-12-25 16:21 PM
    //    *            </p>
    //    * @author qingbao-gao
    //    * @return 多项式系数存储数组
    //    */
    //   function PolyFitForcast() {
    //
    //     function PolyFit(x, y, n, a, m) {
    //         var i, j, k;
    //         var z, p, c, g, q = 0,
    //             d1, d2;
    //         var s = new Array(20);
    //         var t = new Array(20);
    //         var b = new Array(20);
    //         var dt = new Array(3);
    //         for (i = 0; i <= m - 1; i++) {
    //             a[i] = 0.0;
    //         }
    //         if (m > n) {
    //             m = n;
    //         }
    //         if (m > 20) {
    //             m = 20;
    //         }
    //         z = 0.0;
    //         for (i = 0; i <= n - 1; i++) {
    //             z = z + x[i] / (1.0 * n);
    //         }
    //         b[0] = 1.0;
    //         d1 = 1.0 * n;
    //         p = 0.0;
    //         c = 0.0;
    //         for (i = 0; i <= n - 1; i++) {
    //             p = p + (x[i] - z);
    //             c = c + y[i];
    //         }
    //         c = c / d1;
    //         p = p / d1;
    //         a[0] = c * b[0];
    //         if (m > 1) {
    //             t[1] = 1.0;
    //             t[0] = -p;
    //             d2 = 0.0;
    //             c = 0.0;
    //             g = 0.0;
    //             for (i = 0; i <= n - 1; i++) {
    //                 q = x[i] - z - p;
    //                 d2 = d2 + q * q;
    //                 c = c + y[i] * q;
    //                 g = g + (x[i] - z) * q * q;
    //             }
    //             c = c / d2;
    //             p = g / d2;
    //             q = d2 / d1;
    //             d1 = d2;
    //             a[1] = c * t[1];
    //             a[0] = c * t[0] + a[0];
    //         }
    //         for (j = 2; j <= m - 1; j++) {
    //             s[j] = t[j - 1];
    //             s[j - 1] = -p * t[j - 1] + t[j - 2];
    //             if (j >= 3)
    //                 for (k = j - 2; k >= 1; k--) {
    //                     s[k] = -p * t[k] + t[k - 1] - q * b[k];
    //                 }
    //             s[0] = -p * t[0] - q * b[0];
    //             d2 = 0.0;
    //             c = 0.0;
    //             g = 0.0;
    //             for (i = 0; i <= n - 1; i++) {
    //                 q = s[j];
    //                 for (k = j - 1; k >= 0; k--) {
    //                     q = q * (x[i] - z) + s[k];
    //                 }
    //                 d2 = d2 + q * q;
    //                 c = c + y[i] * q;
    //                 g = g + (x[i] - z) * q * q;
    //             }
    //             c = c / d2;
    //             p = g / d2;
    //             q = d2 / d1;
    //             d1 = d2;
    //             a[j] = c * s[j];
    //             t[j] = s[j];
    //             for (k = j - 1; k >= 0; k--) {
    //                 a[k] = c * s[k] + a[k];
    //                 b[k] = t[k];
    //                 t[k] = s[k];
    //             }
    //         }
    //         dt[0] = 0.0;
    //         dt[1] = 0.0;
    //         dt[2] = 0.0;
    //         for (i = 0; i <= n - 1; i++) {
    //             q = a[m - 1];
    //             for (k = m - 2; k >= 0; k--) {
    //                 q = a[k] + q * (x[i] - z);
    //             }
    //             p = q - y[i];
    //             if (Math.abs(p) > dt[2]) {
    //                 dt[2] = Math.abs(p);
    //             }
    //             dt[0] = dt[0] + p * p;
    //             dt[1] = dt[1] + Math.abs(p);
    //         }
    //         return a;
    //     } // end
    //
    //     /**
    //      * <p>
    //      * 对X轴数据节点球平均值
    //      * </p>
    //      *
    //      * @param x
    //      *            存储X轴节点的数组
    //      *            <p>
    //      *            Date:2007-12-25 20:21 PM
    //      *            </p>
    //      * @author qingbao-gao
    //      * @return 平均值
    //      */
    //     function average(x) {
    //         var ave = 0;
    //         var sum = 0;
    //         if (x !== null) {
    //             for (var i = 0; i < x.length; i++) {
    //                 sum += x[i];
    //             }
    //             ave = sum / x.length;
    //         }
    //         return ave;
    //     }
    //
    //     /**
    //      * <p>
    //      * 由X值获得Y值
    //      * </p>
    //      * @param x
    //      *            当前X轴输入值,即为预测的月份
    //      * @param xx
    //      *            当前X轴输入值的前X数据点
    //      * @param a
    //      *            存储多项式系数的数组
    //      * @param m
    //      *            存储多项式的最高次数的数组
    //      *            <p>
    //      *            Date:2007-12-25 PM 20:07
    //      *            </p>
    //      * @return 对应X轴节点值的Y轴值
    //      */
    //     function getY(x, xx, a, m) {
    //         var y = 0;
    //         var ave = average(xx);
    //         var m = 2;
    //         var l = 0;
    //         for (var i = 0; i < m; i++) {
    //             l = a[0];
    //             if (i > 0) {
    //                 y += a[i] * Math.pow((x - ave), i);
    //             }
    //         }
    //         return (y + l);
    //     }
    //
    //     /**
    //      * 返回拟合后的点坐标数组
    //      * @param  {Array} arr 点坐标数组
    //      * @return {Array}     拟合后的点坐标数组
    //      */
    //     this.get = function(arr) {
    //         var arrX = [],
    //             arrY = [];
    //
    //         for (var i = 0; i < arr.length; i++) {
    //             arrX.push(arr[i].x);
    //             arrY.push(arr[i].y);
    //         }
    //
    //         var len = arrY.length;
    //         var m = 3;
    //         var a = new Array(arrX.length);
    //         var aa = PolyFit(arrX, arrY, len, a, m);
    //         var arrRes = [];
    //         for (var i = 0; i < len; i++) {
    //             arrRes.push({
    //                 x: arrX[i],
    //                 y: getY(arrX[i], arrX, aa, m)
    //             });
    //         }
    //
    //         return arrRes;
    //     };
    //   }
    //   var xq = [];
    //   var xy = [];
    //   // for (let i = 0; i < data.length; i++) {
    //   //   arr.push([i + 1, data[i]]);
    //   // }
    //   for (let i = 0; i < data.length; i++) {
    //     xq.push({
    //         x: data[i][0],
    //         y: data[i][1]
    //     })
    //   }
    //   var xe = new PolyFitForcast().get(xq);
    //   for (let i = 0; i < xe.length; i++) {
    //     xy.push([xe[i].x,xe[i].y])
    //   }
    //   return xy;
    // }
    //
    lineFn(data) {
        var myRegression = ecStat.regression("linear", data);
        myRegression.points.sort(function(a, b) {
            return a[0] - b[0];
        });
        return myRegression.points;
    }
    exponential(data) {
        var myRegression1 = ecStat.regression("exponential", data);
        myRegression1.points.sort(function(a, b) {
            return a[0] - b[0];
        });
        return myRegression1.points;
    }
    logarithmic(data) {
        var myRegression2 = ecStat.regression("logarithmic", data);
        myRegression2.points.sort(function(a, b) {
            return a[0] - b[0];
        });
        return myRegression2.points;
    }
    polynomial(data, tag) {
        var myRegression3 = ecStat.regression("polynomial", data, tag);
        myRegression3.points.sort(function(a, b) {
            return a[0] - b[0];
        });
        return myRegression3.points;
    }
    colorRgb(sColor, opacityValue) {
        var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
        var sColor = sColor.toLowerCase();
        if (sColor && reg.test(sColor)) {
            if (sColor.length === 4) {
                var sColorNew = "#";
                for (var i = 1; i < 4; i += 1) {
                    sColorNew += sColor
                        .slice(i, i + 1)
                        .concat(sColor.slice(i, i + 1));
                }
                sColor = sColorNew;
            }
            //处理六位的颜色值
            var sColorChange = [];
            for (var i = 1; i < 7; i += 2) {
                sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
            }
            return (
                "rgba(" +
                sColorChange.join(",") +
                "," +
                opacityValue / 100 +
                ")"
            );
        } else {
            let sColorArray = sColor.split("(");
            let step1 = sColorArray[1].split(",");
            let r = step1[0];
            let g = step1[1];
            let b = step1[2];
            let returnColor =
                "rgba(" +
                r +
                "," +
                g +
                "," +
                b +
                "," +
                opacityValue / 100 +
                ")";
            return returnColor;
        }
    }
    maxLength(arr) {
        let maxLength = 0;
        for (let i = 0, len = arr.length; i < len; i++) {
            if (arr[i].length > maxLength) maxLength = arr[i].length;
        }
        return maxLength;
    }
    setChartData(chartOption, lengend, originLengend) {
        var series = [];
        var keyArray = Object.keys(lengend);
        console.log("keyArray");
        console.log(keyArray);
        for (var i = 0; i < keyArray.length; i++) {
            var seriesTemplate = Immutable.fromJS(chartOption.series[0]).toJS();
            seriesTemplate.name = keyArray[i];
            seriesTemplate.data = lengend[keyArray[i]];
            seriesTemplate.originData = originLengend[keyArray[i]];
            series.push(seriesTemplate);
        }
        chartOption.legend.data = keyArray;
        chartOption.series = series;
        console.log("myChartOption");
        console.log(chartOption);
        return chartOption;
    }
}
