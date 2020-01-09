import WidgetBase from "corejs/components/base";
import Immutable, { Map, is } from "immutable";
import ecStat from "echarts-stat";
import { message } from "antd";
import _ from "lodash";
import dashboard from "corejs";

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

                    _params.value.value = e.value;
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
        const { util } = window.Dashboard;
        const { defaultOption } = this.cfg.chartDefinition;
        let thisOption = util.copy(true, {}, defaultOption, this._option);
        util.copy(true, this._option, thisOption);
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
        return this._option;
    }
    //处理可枚举属性
    _handleEnumOption(store, option, htmlObj) {
        //xy轴互相转换  需要在最初执行
        let orientationVal = store["orientation"];
        if (orientationVal && option["orientation"] != orientationVal) {
            option["orientation"] = orientationVal;
            // if (option.series[0].xAxisIndex) {
            option.series[0].xAxisIndex = (option.series[0].xAxisIndex + 1) % 2;
            option.series[0].yAxisIndex = (option.series[0].yAxisIndex + 1) % 2;
            // }
            [option.xAxis, option.yAxis] = [option.yAxis, option.xAxis];
        }

        for (let item in store) {
            this._handlePerStore(item, store[item], option, htmlObj, store);
        }
        console.log("myOption");
        return option;
    }
    //处理属性
    _handlePerStore(item, value, option, htmlObj, ownOption) {
        const { util } = window.Dashboard;
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
                option.grid.top = 40 + 5;
                break;
            //标题位置
            case "titlePosition":
                option.title.left = value;
                break;
            //标题颜色
            case "titleBackgroundColor":
                option.title.backgroundColor = value || "transparent";
                if (this.cfg.chartDefinition.option.title === "") {
                    option.title.backgroundColor = "transparent";
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
                }
                break;
            //线条颜色
            case "lineColor":
                break;
            //仪表角度
            case "gaugeAngle":
                let width = Dashboard.lib.$("#" + this.cfg.id)[0].clientWidth;
                let height = Dashboard.lib.$("#" + this.cfg.id)[0].clientHeight;
                let topTitleHeight = 40;
                let defaultMargin = 10;
                for (let i of option.series) {
                    switch (ownOption[item]) {
                        case "360":
                            i.startAngle = 270;
                            i.endAngle = -89;
                            if (width > height - topTitleHeight) {
                                i.radius =
                                    (height - topTitleHeight - defaultMargin) /
                                    2;
                                i.center = ["50%", i.radius + topTitleHeight];
                            } else if (width < height - topTitleHeight) {
                                i.radius = (width - defaultMargin * 2) / 2;
                                i.center = [
                                    "50%",
                                    (height - topTitleHeight - 2 * i.radius) /
                                        2 +
                                        topTitleHeight +
                                        i.radius
                                ];
                            }
                            i.title.offsetCenter = [0, "40%"];
                            break;
                        case "270":
                            i.startAngle = 225;
                            i.endAngle = -45;
                            if (width > height - topTitleHeight) {
                                i.radius =
                                    (height - topTitleHeight - defaultMargin) /
                                    2;
                                i.center = ["50%", i.radius + topTitleHeight];
                            } else if (width < height - topTitleHeight) {
                                i.radius = (width - defaultMargin * 2) / 2;
                                i.center = [
                                    "50%",
                                    (height - topTitleHeight - 2 * i.radius) /
                                        2 +
                                        topTitleHeight +
                                        i.radius
                                ];
                            }
                            i.title.offsetCenter = [0, "40%"];
                            break;
                        case "180":
                            i.startAngle = 180;
                            i.endAngle = 0;
                            if (width > (height - topTitleHeight) * 2) {
                                i.radius =
                                    height - topTitleHeight - defaultMargin;
                                i.center = ["50%", height - 10];
                            } else if (width < height - topTitleHeight) {
                                i.radius = (width - 2 * defaultMargin) / 2;
                                i.center = [
                                    "50%",
                                    (height - topTitleHeight - i.radius) / 2 +
                                        topTitleHeight +
                                        i.radius
                                ];
                            } else if ((height - topTitleHeight) * 2 > width) {
                                i.radius = (width - 2 * defaultMargin) / 2;
                                i.center = [
                                    "50%",
                                    (height - topTitleHeight - i.radius) / 2 +
                                        topTitleHeight +
                                        i.radius
                                ];
                            }
                            i.title.offsetCenter = [0, "-50%"];
                            break;
                    }
                }
                break;
            //仪表轴线宽度
            case "gaugeWidth":
                for (let i of option.series) {
                    i.axisLine.lineStyle.width = ownOption[item];
                }
                break;
            //仪表分割线数量
            case "sliderNumber":
                console.log(ownOption[item]);
                if (ownOption[item] == "auto") {
                    for (let i of option.series) {
                        i.splitLine.show = false;
                    }
                } else {
                    for (let i of option.series) {
                        i.splitLine.show = true;
                        i.splitNumber = ownOption[item];
                    }
                }
                break;
            //刻度线数量
            case "smallSplitNumber":
                if (ownOption[item] == "auto") {
                    for (let i of option.series) {
                        i.axisTick.show = false;
                    }
                } else {
                    for (let i of option.series) {
                        i.axisTick.show = true;
                        i.axisTick.splitNumber = ownOption[item];
                    }
                }
                break;
            //刻度线内外
            case "gaugeInOut":
                if (ownOption[item] == "inside") {
                    for (let i of option.series) {
                        console.log(i.axisLine.lineStyle.width);
                        i.splitLine.length = i.axisLine.lineStyle.width;
                        i.axisTick.length = i.axisLine.lineStyle.width / 2;
                        i.axisTick.lineStyle.color = "#fff";
                        i.splitLine.lineStyle.color = "#fff";
                    }
                } else if (ownOption[item] == "outside") {
                    for (let i in option.series) {
                        if (option.series[i].yhnIfSwitch) {
                            option.series[i].splitLine.length =
                                option.series[i].axisLine.lineStyle.width + 10;
                            option.series[i].axisTick.length =
                                option.series[i].axisLine.lineStyle.width + 5;
                            option.series[i].splitLine.lineStyle.color = "auto";
                            option.series[i].axisTick.lineStyle.color = "auto";
                        } else {
                            option.series[i].splitLine.length = 10;
                            option.series[i].axisTick.length = 5;
                            option.series[i].splitLine.lineStyle.color = "auto";
                            option.series[i].axisTick.lineStyle.color = "auto";
                            option.series[i].axisLine.lineStyle.width = -option
                                .series[i].axisLine.lineStyle.width;
                            option.series[i].radius =
                                option.series[i].radius +
                                option.series[i].axisLine.lineStyle.width;
                        }
                    }
                }
                break;
            //是否导出数据
            case "isExportData":
                /* document.querySelector(
                "#" + this.cfg.id + " .chartCsv"
            ).style.display = value ? "block" : "none"; */
                Dashboard.lib
                    .$("#" + this.cfg.id + " .chartCsv")
                    .css({ display: value ? "block" : "none" });
                break;
            //数据标签
            case "axisLabel":
                for (let i of option.series) {
                    i.axisLabel.show = ownOption[item];
                }
                break;
            //显示数据
            case "detail":
                for (let i of option.series) {
                    i.detail.show = ownOption[item];
                }
                break;
            //数据标题
            case "detailName":
                if (ownOption[item] == "close") {
                    for (let i of option.series) {
                        i.title.show = false;
                    }
                } else if (ownOption[item] == "auto") {
                } else {
                    for (let i of option.series) {
                        i.data[0].name = ownOption[item];
                    }
                }
                break;
            //显示比例
            case "showRadio":
                for (let i of option.series) {
                    if (i.detail.show == false && ownOption[item] == false) {
                        i.detail.show = false;
                    } else if (
                        i.detail.show == false &&
                        ownOption[item] == true
                    ) {
                        i.detail.show = true;
                        i.detail.formatter = function(e) {
                            return (
                                (
                                    (i.data[0].oringinValue / (i.max - i.min)) *
                                    100
                                ).toFixed(2) + "%"
                            );
                        };
                    } else if (
                        i.detail.show == true &&
                        ownOption[item] == false
                    ) {
                        i.detail.show = true;
                        i.detail.formatter = function(e) {
                            return i.data[0].oringinValue;
                        };
                    } else if (
                        i.detail.show == true &&
                        ownOption[item] == true
                    ) {
                        i.detail.show = true;
                        i.detail.formatter = function(e) {
                            return (
                                i.data[0].oringinValue +
                                "(" +
                                (
                                    (i.data[0].oringinValue / (i.max - i.min)) *
                                    100
                                ).toFixed(2) +
                                "%" +
                                ")"
                            );
                        };
                    }
                }
                break;
            case "color":
                option.color = value;
                // let optionArr = ownOption.gaugeColorSeries.optionArr;
                // optionArr.forEach((single, i) => {
                //     single[2] = i > value.length ? value[i % value.length] : value[i]
                // });
                break;

            //最小值
            case "min":
                for (let i of option.series) {
                    i.min = parseFloat(ownOption[item]);
                }
                break;
            //最大值
            case "max":
                for (let i of option.series) {
                    if (parseFloat(ownOption[item]) > i.min) {
                        i.max = parseFloat(ownOption[item]);
                    }
                }
                break;

            //xgauge
            case "gaugeColorSeries":
                //先区分gauge类型
                if (ownOption[item].switch) {
                    for (let i in option.series) {
                        //switch私有标签
                        option.series[i].yhnIfSwitch = true;
                        option.series[i].min = parseFloat(
                            ownOption[item].optionArr[0][0]
                        );
                        option.series[i].max = parseFloat(
                            ownOption[item].optionArr.slice().pop()[1]
                        );
                        //控制指标显示
                        option.series[i].pointer.show = true;
                        //控制刻度线和分割线显示
                        option.series[i].splitLine.show = true;
                        option.series[i].axisTick.show = true;
                        //处理指针型颜色数组
                        option.series[
                            i
                        ].axisLine.lineStyle.color = this.dealWithPinColor(
                            ownOption[item].optionArr,
                            option.series[i].min,
                            option.series[i].max,
                            ownOption.color
                        );
                    }
                } else {
                    for (let i in option.series) {
                        //switch私有标签
                        option.series[i].yhnIfSwitch = false;
                        option.series[i].min = parseFloat(
                            ownOption[item].circleMin
                        );
                        option.series[i].max = parseFloat(
                            ownOption[item].circleMax
                        );
                        //控制指标显示
                        option.series[i].pointer.show = false;
                        //控制刻度线和分割线显示
                        option.series[i].splitLine.show = false;
                        option.series[i].axisTick.show = false;
                        //处理颜色
                        ownOption[item].startColor = ownOption.color[0];
                        ownOption[item].endColor = ownOption.color[1];
                        option.series[
                            i
                        ].axisLine.lineStyle.color = this.dealWithCircleColor(
                            option.series[i].data[0].value,
                            option.series[i].min,
                            option.series[i].max,
                            ownOption[item]
                        );
                    }
                }
                break;
        }
    }

    //生成颜色数组
    generateColorArray(option) {
        let returnArr = [];
        for (let i = 0; i < option.length; i++) {
            returnArr.push(option[i][2]);
        }
        return returnArr;
    }


    //设置grid
    _customizeBar(option, htmlObj, store) {
        // option.grid.bottom = 50;
        //  option.grid.left = 50;
        //  option.grid.right = 50;
        //  option.grid.top = 50;
    }
    //处理请求返回的data
    _handleData(data, option, ownOption, drillName) {
        let ownData = Immutable.fromJS(data).toJS();
        if (is(Map(ownData), Map({}))) return option;
        //第一步找到lengend的类型和数量
        //包含详细信息的数组
        var dataset = {};
        if (data.resultset) {
            var set = data.resultset[0][0];
            var setName = data.metadata[0]["colName"];
        }
        //不包含详细信息的数组
        this.setChartData(option, set, setName);
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
    maxLength(arr) {
        let maxLength = 0;
        for (let i = 0, len = arr.length; i < len; i++) {
            if (arr[i].length > maxLength) maxLength = arr[i].length;
        }
        return maxLength;
    }
    setChartData(chartOption, data, name) {
        chartOption.series[0].data[0].value = data;
        chartOption.series[0].data[0].oringinValue = data;
        chartOption.series[0].data[0].name = name;
        return chartOption;
    }
    dealWithPinColor(color, min, max, enumColor) {
        var returnColor = [];
        for (let i = 0; i < color.length; i++) {
            returnColor.push([
                (color[i][1] - color[0][0]) / (max - min),
                enumColor[i]
            ]);
        }
        return returnColor;
    }

    hexToRgba(hex, opacity) {
        return (
            "rgba(" +
            parseInt("0x" + hex.slice(1, 3)) +
            "," +
            parseInt("0x" + hex.slice(3, 5)) +
            "," +
            parseInt("0x" + hex.slice(5, 7)) +
            "," +
            opacity +
            ")"
        );
    }

    dealWithCircleColor(option, min, max, colorChoose) {
        //进行色彩判断
        if (colorChoose.startColor.indexOf("#") > -1) {
            colorChoose.startColor = this.hexToRgba(colorChoose.startColor);
        }

        if (colorChoose.endColor.indexOf("#") > -1) {
            colorChoose.endColor = this.hexToRgba(colorChoose.endColor);
        }

        let returnColor = [];
        let total = parseFloat(max - min);
        let rgba = colorChoose.startColor
            .split("(")[1]
            .split(")")[0]
            .split(",");
        let rgba2 = colorChoose.endColor
            .split("(")[1]
            .split(")")[0]
            .split(",");
        let r = parseInt(rgba[0]);
        let g = parseInt(rgba[1]);
        let b = parseInt(rgba[2]);
        let r2 = parseInt(rgba2[0]);
        let g2 = parseInt(rgba2[1]);
        let b2 = parseInt(rgba2[2]);
        let a = 0.2;
        let radio = parseFloat(option - min) / parseFloat(max - min);
        let firstR = parseInt(r + (r2 - r) * radio);
        let firstG = parseInt(g + (g2 - g) * radio);
        let firstB = parseInt(b + (b2 - b) * radio);
        let color1 =
            "rgba(" + firstR + "," + firstG + "," + firstB + "," + 1 + ")";
        returnColor.push([
            parseFloat(((option - min) / total).toFixed(2)),
            color1
        ]);
        let newColor =
            "rgba(" + firstR + "," + firstG + "," + firstB + "," + a + ")";
        returnColor.push([1, newColor]);
        console.log("newColor");
        return returnColor;
    }
}
