import WidgetBase from "corejs/components/base";
import Immutable, { Map, is } from "immutable";
import _ from "lodash";

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
                    // this._option.legend.selected = {};
                    this.handleDefinition(chartDefinition, e.name);
                    this.draw();
                    break;
                case "interact":
                    var _params = Immutable.fromJS(params).toJS();
                    _params.category.value = e.name;
                    _params.series.value = e.seriesName;
                    _params.value.value = e.data;
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
        //处理预警
        this._handlewarn(
            chartDefinition.option.warns,
            option,
            chartDefinition.data,
            chartDefinition.option.orientation,
            chartDefinition.option.stack
        );
        //处理代码注入数据
        // this._option = handleChart.handleInjectOption(chartDefinition.injectOption,this._option);
        return this._option;
    }
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
        this._handleDot('showDot',store,option)
        //处理图例
        const chartDefinition = this.cfg.chartDefinition;
        this._handleExample(
            chartDefinition.option.example,
            this._option,
            // document.getElementById(this.cfg.id),
            this.htmlObj,
            chartDefinition.option
        );
        //更改颜色
        option.series.forEach((e, i) => {
            e.itemStyle = e.itemStyle || { normal: {} };
            if (i) {
                e.itemStyle.normal.color = e._name
                    ? option.series.find(
                          ee => ee.name === e.name && ee.type === e.type
                      ).itemStyle.normal.color
                    : store.color[i - 1];
            }
        });
        return option;
    }
    _handleDot(item,ownOption,option){
        let size = ownOption[item] ? 4 : 1;
                for (let i of option.series) {
                    i.symbolSize = size;
                }
    }
    _handlePerStore(item, value, option, htmlObj, ownOption) {
        // console.log(item,'4564564564');
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
            case "showData":
                for (let i of option.series) {
                    if (i.tag) continue;
                    i.label.normal.show = value;
                }
                break;
            case "gridLine":
                if (
                    option["orientation"] === "vertical" ||
                    !option["orientation"]
                ) {
                    for (let i of option.yAxis) {
                        if (i.tag) continue;
                        i.splitLine.show = value;
                    }
                } else {
                    for (let i of option.xAxis) {
                        if (i.tag) continue;
                        i.splitLine.show = value;
                    }
                }
                break;
            case "color":
                if (value.length > 0) {
                    option.color = value.slice(0);
                }
                break;
            case "baseLine":
                let obj = null;
                if (ownOption[item] === "average") {
                    obj = {
                        data: [{ type: "average" }]
                    };
                    if (ownOption["orientation"] === "vertical") {
                        option.grid.right += 30;
                    } else {
                        option.grid.top += 8;
                    }
                }
                if (/^\d+$/.test(ownOption[item] + "")) {
                    if (ownOption["orientation"] === "vertical") {
                        obj = {
                            data: [{ yAxis: ownOption[item] }]
                        };
                    } else {
                        obj = {
                            data: [{ xAxis: ownOption[item] }]
                        };
                    }
                    let s1 = ownOption[item].toString().split(".")[0];
                    let s2 = ownOption[item].toString().split(".")[1];
                    let l = s1.length + (s2 ? s2.slice(0, 2).length : 0);
                    if (ownOption["orientation"] === "vertical") {
                        option.grid.right += l * 8;
                    } else {
                        option.grid.top += 8;
                    }
                }
                for (let i of option.series) {
                    if (i.tag) continue;
                    i.markLine = obj;
                }
                break;
            case "axisTick":
                for (let i of option.xAxis) {
                    i.axisTick.show = ownOption[item];
                }
                for (let i of option.yAxis) {
                    i.axisTick.show = ownOption[item];
                }
                break;
            case "axisTitle":
                if (ownOption["orientation"] === "vertical") {
                    for (let i of option.yAxis) {
                        i.name = ownOption[item];
                    }
                } else {
                    for (let i of option.xAxis) {
                        i.name = ownOption[item];
                    }
                }
                break;
            case "secondY":
                if (ownOption["orientation"] === "vertical") {
                    if (ownOption[item]) {
                        let data = option.series[option.series.length - 1].data;
                        let min = Math.ceil(Math.min.apply(null, data));
                        let max = Math.floor(Math.max.apply(null, data)) + 50;
                        option.yAxis[1].min = min > 0 ? 0 : min;
                        option.yAxis[1].max = max;
                        option.yAxis[1].splitLine.show = false;
                        option.yAxis[1].nameGap = (max + "").length * 8 + 10;
                        option.series[option.series.length - 1].yAxisIndex = 1;
                        option.grid.right += (max + "").length * 8;
                    }
                    option.yAxis[1].show = ownOption[item];
                } else {
                    if (ownOption[item]) {
                        let data = option.series[option.series.length - 1].data;
                        let min = Math.ceil(Math.min.apply(null, data));
                        let max = Math.floor(Math.max.apply(null, data)) + 50;
                        option.xAxis[1].min = min > 0 ? 0 : min;
                        option.xAxis[1].max = max;
                        option.xAxis[1].splitLine.show = false;
                        // option.xAxis[1].nameGap = (max + '').length*8 +10;
                        option.series[option.series.length - 1].xAxisIndex = 1;
                        option.grid.top += (max + "").length * 8;
                    }
                    option.xAxis[1].show = ownOption[item];
                }
                break;
            case "secondYTitle":
                option._grid = option._grid || Object.assign({}, option.grid);
                if (ownOption["orientation"] === "vertical") {
                    option.yAxis[1].name = ownOption[item];
                    if (ownOption[item].length > 0 && ownOption["secondY"])
                        option.grid.right = option._grid.right + 40;
                } else {
                    option.xAxis[1].name = ownOption[item];
                    if (ownOption[item].length > 0 && ownOption["secondY"])
                        option.grid.top = option._grid.top + 40;
                }
                break;
            case "barBg":
                option.series[0].itemStyle.normal.opacity = ownOption[item]
                    ? 1
                    : 0;
                let arr = [],
                    stackArr = option.series[1]
                        ? new Array(option.series[1].data.length).fill(0)
                        : [0],
                    num = 0,
                    maxNum,
                    stackMaxNum;
                option.series.map(i => {
                    if (i.tag || i.type !== "bar") return;
                    for (let j = 0; j < i.data.length; j++) {
                        stackArr[j] = stackArr[j] + i.data[j];
                    }
                    num = Math.max.apply(this, i.data);
                    arr.push(num);
                });
                /*for (let i of option.series) {
          if (i.tag || i.type !== 'bar') continue
          for (let j = 0; j < i.data.length; j++) {
            stackArr[j] = stackArr[j] + i.data[j]
          }
          num = Math.max.apply(this, i.data);
          arr.push(num);
        }*/
                stackMaxNum = Math.ceil(Math.max.apply(this, stackArr)) + 20;
                maxNum = Math.ceil(Math.max.apply(this, arr)) + 20;
                option.series[0].data = option.series[1]
                    ? new Array(option.series[1].data.length).fill(
                          ownOption["stack"] ? stackMaxNum : maxNum
                      )
                    : [];
                break;
            case "stack":
                var arrNum = [];
                var stackMax;
                var lineNum = [];
                if (ownOption[item]) {
                    for (let i of option.series) {
                        if (i.tag || i.type !== "bar") continue;
                        // i.stack = i.type;
                        i.stack = i._name != "noNull" ? i.type : "resize";
                        for (let j = 0; j < i.data.length; j++) {
                            arrNum[j] = (arrNum[j] ? arrNum[j] : 0) + i.data[j];
                        }
                    }
                    stackMax = Math.max.apply(null, arrNum);
                    if (ownOption["linestack"]) {
                        for (let i of option.series) {
                            if (i.tag || i.type !== "line") continue;
                            for (let j = 0; j < i.data.length; j++) {
                                lineNum[j] =
                                    (lineNum[j] ? lineNum[j] : 0) + i.data[j];
                            }
                        }
                    } else {
                        for (let i of option.series) {
                            if (i.tag || i.type !== "line") continue;
                            lineNum.push(Math.max.apply(null, i.data));
                        }
                    }
                    stackMax =
                        stackMax > Math.max.apply(null, lineNum)
                            ? stackMax
                            : Math.max.apply(null, lineNum);
                    if (ownOption["orientation"] === "vertical") {
                        option.yAxis[0].max = parseInt(stackMax + 20, 10);
                    } else {
                        option.xAxis[0].max = parseInt(stackMax + 20, 10);
                    }
                }
                break;
            case "linestack":
                /* let arrNum1 = [];
                let barstackMax;
                let lineNum1 = [];
                if (ownOption[item]) {
                    for (let i of option.series) {
                        if (i.tag || i.type !== "line") continue;
                        i.stack = i.type;
                        for (let j = 0; j < i.data.length; j++) {
                            arrNum1[j] =
                                (arrNum1[j] ? arrNum1[j] : 0) + i.data[j];
                        }
                    }
                    barstackMax = Math.max.apply(null, arrNum1);
                    if (ownOption["stack"]) {
                        for (let i of option.series) {
                            if (i.tag || i.type !== "bar") continue;
                            for (let j = 0; j < i.data.length; j++) {
                                lineNum1[j] =
                                    (lineNum1[j] ? lineNum1[j] : 0) + i.data[j];
                            }
                        }
                    } else {
                        for (let i of option.series) {
                            if (i.tag || i.type !== "bar") continue;
                            lineNum1.push(Math.max.apply(null, i.data));
                        }
                    }
                    barstackMax =
                        barstackMax > Math.max.apply(null, lineNum1)
                            ? stackMax
                            : Math.max.apply(null, lineNum1);
                    if (ownOption["orientation"] === "vertical") {
                        option.yAxis[0].max = barstackMax;
                    } else {
                        option.xAxis[0].max = barstackMax;
                    }
                } */
                break;
            case "itemStyle":
                let radius = parseInt(ownOption[item], 10),
                    r;
                if (ownOption["orientation"] === "vertical")
                    r = [radius, radius, 0, 0.01];
                else r = [0, radius, radius, 0.01];
                if (ownOption["stack"]) {
                    for (let i of option.series) {
                        if (i.tag) continue;
                        i.itemStyle &&
                            (i.itemStyle.normal.barBorderRadius = [
                                0,
                                0,
                                0,
                                0.01
                            ]);
                    }
                    for (let j = option.series.length - 1; j >= 0; j--) {
                        if (option.series[j].type !== "bar") continue;
                        option.series[j].itemStyle.normal.barBorderRadius = r;
                        break;
                    }
                } else {
                    for (let i of option.series) {
                        if (i.tag) continue;
                        i.itemStyle && (i.itemStyle.normal.barBorderRadius = r);
                    }
                }
                break;
            case "markLine":
                let data = option.series.filter(function(item) {
                    return item.tag == undefined;
                });
                let fn;
                if (ownOption[item] === "mAverage") {
                    fn = this.mAverage;
                } else if (ownOption[item] === "wmAverage") {
                    fn = this.wmAverage;
                } else if (ownOption[item] === "line") {
                    fn = this.lineFn;
                }
                option.legend.data = option.legend.data.filter(
                    e => typeof e !== "object"
                );
                option.series = option.series.filter(
                    e => !/-趋势线/.test(e.name)
                );
                if (fn) {
                    for (let i of data) {
                        var list = {
                            name: i.name + "-趋势线",
                            tag: true,
                            type: "line",
                            smooth: true,
                            symbolSize: 1,
                            data: fn(i.data)
                        };
                        i.type === "line" &&
                            i.yAxisIndex &&
                            (list.yAxisIndex = i.yAxisIndex);
                        option.legend.data.push({ name: list.name, iii: "11" });
                        option.series.push(list);
                    }
                }
                break;
            case "showArea":
                let b = ownOption[item] ? 0.6 : 0;
                for (let i of option.series) {
                    if (i.tag || i.type !== "line" || i._name === "noNull")
                        continue;
                    i.areaStyle.normal.opacity = b;
                }
                break;
            case "stack":
                let arrNum = [];
                let stackMax;
                let lineNum = [];
                if (ownOption[item]) {
                    for (let i of option.series) {
                        if (i.tag || i.type !== "bar") continue;
                        i.stack = i.type;
                        for (let j = 0; j < i.data.length; j++) {
                            arrNum[j] = (arrNum[j] ? arrNum[j] : 0) + i.data[j];
                        }
                    }
                    stackMax = Math.max.apply(null, arrNum);
                    if (ownOption["linestack"]) {
                        for (let i of option.series) {
                            if (i.tag || i.type !== "line") continue;
                            for (let j = 0; j < i.data.length; j++) {
                                lineNum[j] =
                                    (lineNum[j] ? lineNum[j] : 0) + i.data[j];
                            }
                        }
                    } else {
                        for (let i of option.series) {
                            if (i.tag || i.type !== "line") continue;
                            lineNum.push(Math.max.apply(null, i.data));
                        }
                    }
                    stackMax =
                        stackMax > Math.max.apply(null, lineNum)
                            ? stackMax
                            : Math.max.apply(null, lineNum);
                    if (ownOption["orientation"] === "vertical") {
                        option.yAxis[0].max = parseInt(stackMax, 10);
                    } else {
                        option.xAxis[0].max = parseInt(stackMax, 10);
                    }
                }
                break;
            case "loseData":
                var b = ownOption[item] === "null" ? false : true;
                for (let i of option.series) {
                    i.connectNulls = b;
                }
                break;
            case "lineStyle":
                let smooth = ownOption[item] === "smooth";
                for (let i of option.series) {
                    i.smooth = smooth;
                }
                break;
            case "predictionLine":
                //数据过滤与还原
                var _nameSeriesArr = option.series.filter(e => e._name);
                option.series = option.series.filter(e => !e._name);
                _nameSeriesArr.map(e => {
                    let selfSeries = option.series.find(
                        item => item.name === e.name
                    );
                    selfSeries.data = selfSeries.data
                        .filter(ee => ee !== null)
                        .concat(
                            e.data
                                .filter(ee => ee !== null)
                                .filter((ee, ii) => ii)
                        );
                });

                if (ownOption[item] !== "auto") {
                    var num = ownOption[item];
                    var lineSeries = option.series.find(
                        e => e.type === "line"
                    ) || { data: [] };
                    if (num <= 0 || num > lineSeries.data.length - 1) return;
                    let tempAll = [];
                    var series = JSON.parse(
                        JSON.stringify(
                            option.series.filter(function(item) {
                                return (
                                    item.type === "line" && item.tag !== true
                                );
                            })
                        )
                    );

                    var series1 = JSON.parse(
                        JSON.stringify(
                            option.series.filter(function(item) {
                                return (
                                    item.type === "line" && item.tag !== true
                                );
                            })
                        )
                    );
                    if (ownOption["linestack"]) {
                        for (let i = 0; i < series1.length; i++) {
                            let temp = null;
                            for (let j = 0; j < i + 1; j++) {
                                temp = this.addArr(temp, series1[j].data);
                            }
                            tempAll[i] = temp;
                        }
                    }
                    for (let i = 0; i < series.length; i++) {
                        var data = {
                            name: "3的指数",
                            type: "line",
                            _name: "noNull",
                            data: [1, 3, 9, 27, 81, 247, 741, 2223, 6669],
                            label: {
                                normal: {
                                    formatter: this.numFormatter
                                }
                            },
                            lineStyle: {
                                normal: {
                                    type: "dashed"
                                }
                            },
                            areaStyle: {
                                normal: {
                                    opacity: 0
                                }
                            }
                        };
                        var itemData = series[i].data;
                        series[i].yAxisIndex &&
                            (data.yAxisIndex = series[i].yAxisIndex);
                        var itemData1;
                        /* if (ownOption["linestack"]) {
                            itemData1 = tempAll[i];
                        } else { */
                        itemData1 = series[i].data;
                        // }
                        data.data = Array(itemData1.length - num - 1)
                            .fill(null)
                            .concat(
                                itemData1.slice(
                                    itemData1.length - num - 1,
                                    itemData1.length
                                )
                            );
                        data.name = series[i].name;
                        for (let j = 0; j < option.series.length; j++) {
                            if (option.series[j].name === series[i].name) {
                                option.series[j].data = itemData
                                    .slice(0, itemData.length - num)
                                    .concat(Array(num).fill(null));
                            }
                        }
                        option.series.push(data);
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
            default:
                break;
        }
    }
    numFormatter(data) {
        var num = data.value.toString();
        var num1 = num.split(".")[0];
        var num2 = num.split(".")[1] ? "." + num.split(".")[1].toString() : "";
        var result = [],
            counter = 0;
        num1 = (num1 || 0).toString().split("");
        for (var i = num1.length - 1; i >= 0; i--) {
            counter++;
            result.unshift(num1[i]);
            if (!(counter % 3) && i != 0) {
                result.unshift(",");
            }
        }
        return result.join("") + num2;
    }
    _customizeBar(option, htmlObj, store) {
        let width = parseInt(htmlObj.clientWidth, 10),
            height = parseInt(htmlObj.clientHeight, 10);
        let offsetY,
            offsetYHeight,
            offsetX,
            offsetXLenght,
            offsetMaxLenght,
            xNameLength,
            yNameLength;
        let chartOption = option;
        // chartOption._grid = chartOption._grid || Object.assign({}, chartOption.grid);
        if (store.orientation === "vertical") {
            chartOption.yAxis[0].minInterval =
                chartOption.series[0].data[0] / 4;
            offsetY = this.getMaxLength(chartOption.series[0].data);
            offsetYHeight = 5;
            offsetX = this.getSumLength(chartOption.xAxis[0].data);
            offsetXLenght = chartOption.xAxis[0].data.length;
            offsetMaxLenght = this.getMaxLength(chartOption.xAxis[0].data);
            yNameLength =
                chartOption.yAxis[0].name &&
                chartOption.yAxis[0].name.length > 0
                    ? 10
                    : 0;
            xNameLength = 0;
            chartOption.yAxis[0].nameGap = offsetY + 20;
        } else {
            // chartOption.xAxis[0].max = chartOption.series[0].data[0];
            chartOption.xAxis[0].minInterval =
                chartOption.series[0].data[0] / 4;
            offsetY = this.getMaxLength(chartOption.yAxis[0].data);
            offsetYHeight = chartOption.yAxis[0].data.length;
            offsetX = chartOption.series[0].data[0].length * 4;
            offsetXLenght = chartOption.series[0].data.length;
            offsetMaxLenght = this.getMaxLength(chartOption.series[0].data);
            xNameLength =
                chartOption.xAxis[0].name &&
                chartOption.xAxis[0].name.length > 0
                    ? 10
                    : 0;
            yNameLength = 0;
            if (store.secondY) {
                chartOption.grid.top += store.secondYTitle.length ? 40 : 25;
            }
        }
        chartOption.grid.left += offsetY + yNameLength + 10;
        chartOption.grid.bottom += xNameLength;
        /* //x轴
        if (offsetX >= width) {
            chartOption.xAxis[0].axisLabel.rotate = "45";
            let o =
                (width - chartOption.grid.left - chartOption.grid.right) /
                offsetXLenght;
            chartOption.xAxis[0].axisLabel.interval = Math.floor(12 / o);
            chartOption.grid.bottom += Math.ceil(offsetMaxLenght / 1.5);
        } else {
            chartOption.xAxis[0].axisLabel.interval = 0;
            chartOption.xAxis[0].axisLabel.rotate = "0";
            // chartOption.grid.bottom += 20;
        } */
        if (offsetMaxLenght >= (width - offsetY - 100) / offsetXLenght) {
            chartOption.xAxis[0].axisLabel.rotate = "45";
            let o =
                (width - chartOption.grid.left - chartOption.grid.right) /
                offsetXLenght;
            chartOption.xAxis[0].axisLabel.interval = Math.floor(12 / o);
            chartOption.grid.bottom += Math.ceil(offsetMaxLenght / 1.5);
        } else {
            chartOption.xAxis[0].axisLabel.interval = 0;
            chartOption.xAxis[0].axisLabel.rotate = "0";
        }
        if (store.orientation !== "vertical") {
            chartOption.xAxis[0].nameGap = Math.ceil(offsetMaxLenght / 1.8);
        }
        chartOption.yAxis[0].axisLabel.interval = "auto";
        chartOption.yAxis[0].axisLabel.rotate = "0";
    }
    //处理图例位置
    _handleExample(value, chartOption, htmlObj, ownOption) {
        chartOption.legend.top = "auto";
        chartOption.legend.right = "auto";
        chartOption.legend.left = "auto";
        chartOption.legend.bottom = "auto";
        chartOption.legend.orient = "horizontal";
        chartOption.legend.show = true;
        chartOption._grid =
            chartOption._grid || Object.assign({}, chartOption.grid);
        chartOption.grid = Object.assign({}, chartOption._grid);
        var option = {
            chartOption: chartOption,
            height: parseInt(htmlObj.clientHeight, 10),
            width: parseInt(htmlObj.clientWidth, 10),
            type: "line"
        };
        option.chartOption.legend.type = "scroll";
        chartOption.grid.top = ownOption.title.length ? 45 : 5;
        switch (value) {
            case "null":
                chartOption.legend.show = false;
                chartOption.grid.bottom += 24;
                break;
            case "top":
                chartOption.legend.top = ownOption.title.length > 0 ? 40 : 10;
                chartOption.legend.left = "center";
                chartOption.grid.top += 24;
                chartOption.grid.bottom += 24;
                break;
            case "left":
                chartOption.legend.left = 20;
                chartOption.legend.orient = "vertical";
                chartOption.legend.top = chartOption.grid.top;
                chartOption.grid.bottom += 24;
                break;
            case "right":
                chartOption.legend.right = 20;
                chartOption.legend.orient = "vertical";
                chartOption.legend.top = chartOption.grid.top;
                chartOption.grid.bottom += 24;
                break;
            case "bottom":
                chartOption.legend.bottom = 10;
                chartOption.legend.left = "center";
                chartOption.grid.bottom += 44;
                break;
            default:
                break;
        }
        this._lengendFn(option, value);
    }
    _lengendFn(option, type) {
        var datas = option.chartOption.legend.data;
        var yh = option.height;
        var xh = option.width;
        var selflen = {};
        var aa;
        switch (type) {
            case "left":
                selflen.maxLeg = this.getLabelMaxLength(datas);
                aa =
                    /* this.measureTextWidth(selflen.maxLeg.maxValue) */ 90 +
                    10;
                option.chartOption.grid.left += aa;
                this._setlegendTooltip();
                break;
            case "right":
                selflen.maxLeg = this.getLabelMaxLength(datas);
                aa =
                    /* this.measureTextWidth(selflen.maxLeg.maxValue) */ 90 +
                    10;
                option.chartOption.grid.right += aa;
                this._setlegendTooltip();
                break;
            case "top":
                selflen._length = datas.reduce((a, b) => {
                    return (
                        (typeof a != "number" ? this.measureTextWidth(a) : a) +
                        80 +
                        this.measureTextWidth(b)
                    );
                });
                /* if (selflen._length > xh - 50) {
                    option.chartOption.legend.left = 30;
                    option.chartOption.legend.right = 30;
                } */ option.chartOption.legend.width =
                    xh - 60;
                break;
            case "bottom":
                selflen._length = datas.reduce((a, b) => {
                    return (
                        (typeof a != "number" ? this.measureTextWidth(a) : a) +
                        80 +
                        this.measureTextWidth(b)
                    );
                });
                /* if (selflen._length > xh - 50) {
                    option.chartOption.legend.left = 30;
                    option.chartOption.legend.right = 30;
                } */ option.chartOption.legend.width =
                    xh - 60;
                break;
            default:
                break;
        }
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
    tArr(arr = []) {
        return arr.filter(function(item) {
            return typeof item == "number" || typeof item == "string";
        });
    }
    getMaxLength(arr = []) {
        arr = this.tArr(arr);
        let array = arr.map(function(item) {
            if (typeof item == "number") {
                return Math.ceil(item) + "";
            } else if (typeof item == "string") {
                return item + "";
            }
        });
        var len = {},
            aa = 0;
        if (array.length) {
            len.maxLeg = this.getLabelMaxLength(arr);
            aa = this.measureTextWidth(len.maxLeg.maxValue);
        }
        return aa;
    }
    getSumLength(arr = []) {
        arr = this.tArr(arr);
        let array = arr.map(function(item) {
            return (item + "").length;
        });
        return (
            array.reduce(function(pre, next) {
                return pre + next;
            }, 0) * 8
        );
    }
    /**
     * 处理预警
     * @param {*} warn 预警字段
     * @param {*} option 图表配置项
     * @param {*} data 图表数据
     */
    _handlewarn(warn, option, data, orientation, stack) {
        if (!data.metadata || !this._legendSerise || !warn.switch) {
            return false;
        }
        //拷贝series
        let selfOption = Immutable.fromJS(option).toJS();
        //是否是堆叠处理
        if (stack) {
            selfOption.series.filter(e => e.type === "bar").forEach((e, i) => {
                e.data.forEach((item, ind) => {
                    if (i > 1) {
                        e.data[ind] += selfOption.series[i - 1].data[ind];
                    }
                });
            });
        }
        warn.seriesList = this._legendSerise;
        this.dispatch("seriesListChange", this._legendSerise);
        let _warn = {};
        warn.value.forEach(e => {
            e.series.length && (_warn[e.series] = e);
        });
        let _series = Object.values(_warn);
        let _orientation = orientation === "vertical" ? 0 : 1;
        if (_series.length) {
            option.series.forEach((e, ind) => {
                let selfSeries = _series.find(ee => e.name === ee.series);
                selfSeries &&
                    e.data.forEach((item, i) => {
                        let _item =
                            selfOption.series[ind] &&
                            selfOption.series[ind].data[i];
                        if (
                            typeof item === "number" &&
                            // eval(item + selfSeries.filter + selfSeries.value)
                            new Function(
                                "",
                                "return " +
                                    item +
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
                                    valueIndex: _orientation,
                                    coord: !_orientation
                                        ? [i, _item || item]
                                        : [_item || item, i]
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
    //处理请求返回的data
    //处理请求返回的data
    _handleData(data, option, ownOption, drillName) {
        let ownData = Immutable.fromJS(data).toJS();
        if (is(Map(ownData), Map({}))) return option;
        var lengendMetaData = ownData.metadata.slice(1); //第一列展示为类目轴
        //获取图例名称
        var lengend = this.getLengendNumeric(lengendMetaData);
        this._legendSerise = lengend;
        //获取图例下标
        var lengendIndex = this.getLengendNumericIndex(lengendMetaData);
        //获取图例数据
        var changeData = this.getChangeData(
            ownData.resultset,
            lengendIndex,
            ownOption
        );
        this._drilName = drillName;
        var axisData = changeData.axisData; //获取横坐标 lebal
        var zipData = changeData.zipData;
        var axisDataFilter = [],
            zipDataFilter = [];
        if (ownOption.clickEvent === "drill") {
            var indexes = [];
            if (!drillName) {
                for (let i = 0; i < axisData.length; i++) {
                    if (!axisData[i].includes("~")) {
                        indexes.push(i);
                    }
                }
            } else {
                for (let i = 0; i < axisData.length; i++) {
                    if (!axisData[i].includes(drillName)) continue;
                    var str = axisData[i].split(drillName)[1];
                    var regex = new RegExp("~", "g");
                    var result = str.match(regex);
                    var count = !result ? 0 : result.length;
                    if (count === 1) indexes.push(i);
                }
            }
            if (indexes.length === 0) {
                let indArr = [];
                axisDataFilter = axisData.filter((el, ind) => {
                    if (el.split("~").length === 1) {
                        indArr.push(ind);
                        return true;
                    }
                });
                zipDataFilter = zipData.filter((el, ind) =>
                    indArr.includes(ind)
                );
            } else {
                axisDataFilter = axisData.filter(function(item, i) {
                    return indexes.includes(i);
                });
                zipDataFilter = zipData.filter(function(item, i) {
                    return indexes.includes(i);
                });
            }
        } else {
            this._drilName = false;
            axisDataFilter = axisData;
            zipDataFilter = zipData;
        }
        // var seriesData = filterNumeric(ownData.resultset);

        zipDataFilter = this.zip(zipDataFilter);
        this.setChartData(option, axisDataFilter, zipDataFilter, lengend);
        return option;
    }
    getLengendNumeric(metadata) {
        var typeArr = ["Numeric", "Integer"];
        return metadata
            .filter(function(item) {
                return typeArr.includes(item.colType);
            })
            .map(function(item) {
                return item.colName;
            });
    }
    getLengendNumericIndex(metadata) {
        var typeArr = ["Numeric", "Integer"];
        return metadata
            .filter(function(item) {
                return typeArr.includes(item.colType);
            })
            .map(function(item) {
                return item.colIndex;
            });
    }
    getType(resultset, length) {
        let array = [];
        resultset.map(item => {
            array.push(
                item
                    .slice(0, length)
                    .filter(e => e !== null)
                    .join("~")
            );
        });
        return array;
    }
    getType1(resultset, length) {
        let array = [];
        for (let j = 0; j < resultset.length; j++) {
            for (let i = 0; i < length; i++) {
                if (!resultset[j][i]) continue;
                let arr = resultset[j].slice(0, i + 1).join("~");
                if (!array.includes(arr)) {
                    array.push(arr);
                }
            }
        }
        return array;
    }
    getChangeData(resultset, lengendArr, ownOption) {
        var array = [];
        var type;
        var length = Math.min.apply(null, lengendArr);
        !lengendArr.length && (length = 0);
        var tempRes = resultset.map(function(item) {
            return item.join("~");
        });
        //判断是否开启下转功能
        var getIfNull = ownOption.clickEvent !== "drill";
        var min = lengendArr[0],
            max = lengendArr[lengendArr.length - 1];
        //未开启下转
        if (getIfNull) {
            type = this.getType(resultset, length);
            resultset.map(el => {
                array.push(el.slice(min, max + 1));
            });
        } else {
            type = this.getType1(resultset, length);
            //处理数据为连接数据
            let selfResultset = [];
            for (let i = 0; i < resultset.length; i++) {
                selfResultset[i] = [
                    resultset[i]
                        .slice(0, min)
                        .filter(e => e !== null)
                        .join("~"),
                    resultset[i].slice(min, max + 1)
                ];
            }
            let selfArrObj = {};
            //遍历生成的type,合成对应的数据
            for (let j = min; j > 0; j--) {
                var selfLenArr = type.filter(el => {
                    var itemArr = el.split("~");
                    return itemArr.length === j;
                });
                selfLenArr.map(el => {
                    var itemArr = el.split("~");
                    var itemArrLen = el.split("~").length;
                    selfResultset.filter((e, ind) => {
                        var itemArr1 = e[0].split("~");
                        var itemArr1Len = e[0].split("~").length;
                        if (itemArrLen === itemArr1Len && el === e[0]) {
                            selfArrObj[el] = e[1];
                        }
                        //如果原数组里面无此项数据  救进行求和处理
                        else if (
                            e[0].includes(el) &&
                            itemArrLen !== itemArr1Len
                        ) {
                            let arrObj = {
                                arr: [],
                                ArrSum: []
                            };
                            Object.keys(selfArrObj).filter((eli, indd) => {
                                var itemArr2 = eli.split("~");
                                var itemArr2Len = eli.split("~").length;
                                if (
                                    itemArr2Len - itemArrLen === 1 &&
                                    itemArr2.splice(0, itemArrLen).join("~") ===
                                        el
                                ) {
                                    arrObj.arr.push(selfArrObj[eli]);
                                    return true;
                                }
                            });
                            arrObj.arr.map(el => {
                                el.map((e, i) => {
                                    arrObj.ArrSum[i] =
                                        (arrObj.ArrSum[i] || 0) + e;
                                });
                            });
                            selfArrObj[el] = arrObj.ArrSum;
                        }
                    });
                });
            }
            type.map(el => {
                array.push(selfArrObj[el]);
            });
        }
        return {
            axisData: type,
            zipData: array
        };
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
    lineFn(data) {
        /**
         * <p>
         * 函数功能：最小二乘法曲线拟合
         * </p>
         * <p>
         * 方程:Y = a(0) + a(1) * (X - X1)+ a(2) * (X - X1)^2 + ..... .+ a(m) * (X -
         * X1)^m X1为X的平均数
         * </p>
         *
         * @param x
         *            实型一维数组,长度为 n. 存放给定 n 个数据点的 X 坐标
         * @param y
         *            实型一维数组,长度为 n.存放给定 n 个数据点的 Y 坐标
         * @param n
         *            变量。给定数据点的个数
         * @param a
         *            实型一维数组，长度为 m.返回 m-1 次拟合多项式的 m 个系数
         * @param m
         *            拟合多项式的项数，即拟合多项式的最高次数为 m-1. 要求 m<=n 且m<=20。若 m>n 或 m>20
         *            ，则本函数自动按 m=min{n,20} 处理.
         *            <p>
         *            Date:2007-12-25 16:21 PM
         *            </p>
         * @author qingbao-gao
         * @return 多项式系数存储数组
         */
        function PolyFitForcast() {
            function PolyFit(x, y, n, a, m) {
                var i, j, k;
                var z,
                    p,
                    c,
                    g,
                    q = 0,
                    d1,
                    d2;
                var s = new Array(20);
                var t = new Array(20);
                var b = new Array(20);
                var dt = new Array(3);
                for (i = 0; i <= m - 1; i++) {
                    a[i] = 0.0;
                }
                if (m > n) {
                    m = n;
                }
                if (m > 20) {
                    m = 20;
                }
                z = 0.0;
                for (i = 0; i <= n - 1; i++) {
                    z = z + x[i] / (1.0 * n);
                }
                b[0] = 1.0;
                d1 = 1.0 * n;
                p = 0.0;
                c = 0.0;
                for (i = 0; i <= n - 1; i++) {
                    p = p + (x[i] - z);
                    c = c + y[i];
                }
                c = c / d1;
                p = p / d1;
                a[0] = c * b[0];
                if (m > 1) {
                    t[1] = 1.0;
                    t[0] = -p;
                    d2 = 0.0;
                    c = 0.0;
                    g = 0.0;
                    for (i = 0; i <= n - 1; i++) {
                        q = x[i] - z - p;
                        d2 = d2 + q * q;
                        c = c + y[i] * q;
                        g = g + (x[i] - z) * q * q;
                    }
                    c = c / d2;
                    p = g / d2;
                    q = d2 / d1;
                    d1 = d2;
                    a[1] = c * t[1];
                    a[0] = c * t[0] + a[0];
                }
                for (j = 2; j <= m - 1; j++) {
                    s[j] = t[j - 1];
                    s[j - 1] = -p * t[j - 1] + t[j - 2];
                    if (j >= 3)
                        for (k = j - 2; k >= 1; k--) {
                            s[k] = -p * t[k] + t[k - 1] - q * b[k];
                        }
                    s[0] = -p * t[0] - q * b[0];
                    d2 = 0.0;
                    c = 0.0;
                    g = 0.0;
                    for (i = 0; i <= n - 1; i++) {
                        q = s[j];
                        for (k = j - 1; k >= 0; k--) {
                            q = q * (x[i] - z) + s[k];
                        }
                        d2 = d2 + q * q;
                        c = c + y[i] * q;
                        g = g + (x[i] - z) * q * q;
                    }
                    c = c / d2;
                    p = g / d2;
                    q = d2 / d1;
                    d1 = d2;
                    a[j] = c * s[j];
                    t[j] = s[j];
                    for (k = j - 1; k >= 0; k--) {
                        a[k] = c * s[k] + a[k];
                        b[k] = t[k];
                        t[k] = s[k];
                    }
                }
                dt[0] = 0.0;
                dt[1] = 0.0;
                dt[2] = 0.0;
                for (i = 0; i <= n - 1; i++) {
                    q = a[m - 1];
                    for (k = m - 2; k >= 0; k--) {
                        q = a[k] + q * (x[i] - z);
                    }
                    p = q - y[i];
                    if (Math.abs(p) > dt[2]) {
                        dt[2] = Math.abs(p);
                    }
                    dt[0] = dt[0] + p * p;
                    dt[1] = dt[1] + Math.abs(p);
                }
                return a;
            } // end

            /**
             * <p>
             * 对X轴数据节点球平均值
             * </p>
             *
             * @param x
             *            存储X轴节点的数组
             *            <p>
             *            Date:2007-12-25 20:21 PM
             *            </p>
             * @author qingbao-gao
             * @return 平均值
             */
            function average(x) {
                var ave = 0;
                var sum = 0;
                if (x !== null) {
                    for (var i = 0; i < x.length; i++) {
                        sum += x[i];
                    }
                    ave = sum / x.length;
                }
                return ave;
            }

            /**
             * <p>
             * 由X值获得Y值
             * </p>
             * @param x
             *            当前X轴输入值,即为预测的月份
             * @param xx
             *            当前X轴输入值的前X数据点
             * @param a
             *            存储多项式系数的数组
             * @param m
             *            存储多项式的最高次数的数组
             *            <p>
             *            Date:2007-12-25 PM 20:07
             *            </p>
             * @return 对应X轴节点值的Y轴值
             */
            function getY(x, xx, a, m) {
                var y = 0;
                var ave = average(xx);
                var m = 2;
                var l = 0;
                for (var i = 0; i < m; i++) {
                    l = a[0];
                    if (i > 0) {
                        y += a[i] * Math.pow(x - ave, i);
                    }
                }
                return y + l;
            }

            /**
             * 返回拟合后的点坐标数组
             * @param  {Array} arr 点坐标数组
             * @return {Array}     拟合后的点坐标数组
             */
            this.get = function(arr) {
                var arrX = [],
                    arrY = [];

                for (var i = 0; i < arr.length; i++) {
                    arrX.push(arr[i].x);
                    arrY.push(arr[i].y);
                }

                var len = arrY.length;
                var m = 3;
                var a = new Array(arrX.length);
                var aa = PolyFit(arrX, arrY, len, a, m);
                var arrRes = [];
                for (var i = 0; i < len; i++) {
                    arrRes.push({
                        x: arrX[i],
                        y: getY(arrX[i], arrX, aa, m)
                    });
                }

                return arrRes;
            };
        }
        var xq = [];
        var xy = [];
        // for (let i = 0; i < data.length; i++) {
        //   arr.push([i + 1, data[i]]);
        // }
        for (let i = 0; i < data.length; i++) {
            xq.push({
                x: i + 1,
                y: data[i]
            });
        }
        var xe = new PolyFitForcast().get(xq);

        for (let i = 0; i < xe.length; i++) {
            xy.push(xe[i].y);
        }

        return xy;
    }

    mAverage(data) {
        var markLineData = [];
        var m = data[0];
        markLineData.push(m);
        for (var i = 1; i < data.length; i++) {
            if (i < 2) {
                m = (m + data[i]) / (i + 1);
            } else {
                m = (data[i] + data[i - 1] + data[i - 2]) / 3;
            }
            markLineData.push(m);
        }
        return markLineData;
    }
    addArr(temp, arr) {
        if (!temp) return arr;
        for (let i = 0; i < arr.length; i++) {
            arr[i] = arr[i] + temp[i];
        }
        return arr;
    }
    wmAverage(data) {
        var markLineData = [];
        var m = data[0];
        markLineData.push(m);
        for (var i = 1; i < data.length; i++) {
            if (i < 2) {
                m = (m + data[i] * (i + 1)) / (i + i + 1);
            } else {
                m = (data[i] * 3 + data[i - 1] * 2 + data[i - 2]) / 6;
            }
            markLineData.push(m);
        }
        return markLineData;
    }
    maxLength(arr) {
        let maxLength = 0;
        for (let i = 0, len = arr.length; i < len; i++) {
            if (arr[i].length > maxLength) maxLength = arr[i].length;
        }
        return maxLength;
    }
    setChartData(chartOption, axisData = [], zipData = [], lengend) {
        const { defaultOption } = this.cfg.chartDefinition;
        var templateData1 = Immutable.fromJS(defaultOption.series[0]).toJS();
        var templateData = Immutable.fromJS(defaultOption.series[1]).toJS();
        // var arr = [];
        // for (let i = 0; i < lengend.length; i++) {
        //   arr.push(`{b${i}}<br/>{a${i}}: {c${i}}`)
        // }
        // var tooltipData = arr.join('</br>');
        // chartOption.tooltip.formatter = tooltipData;
        var lineTemp = {
            name: "",
            type: "bar",
            data: [],
            label: {
                normal: {
                    show: false
                }
            },
            // stack: "",
            markLine: {},
            itemStyle: {
                normal: {
                    barBorderRadius: [0, 0, 0, 0.01]
                }
            },
            areaStyle: {
                normal: {
                    opacity: 0
                }
            }
        };
        //设置图例数据
        chartOption.legend.data = lengend;
        for (let item of chartOption.xAxis) {
            item.data = axisData;
        }

        //删除模板中的示例数据
        chartOption.series = [templateData1];
        if (zipData.length) {
            for (let i = 0; i < zipData.length; i++) {
                lineTemp.name = lengend[i];
                lineTemp.data = zipData[i];
                var obj = Immutable.fromJS(lineTemp).toJS();
                chartOption.series.push(obj);
            }
        } else {
            var obj = Immutable.fromJS(lineTemp).toJS();
            chartOption.series.push(obj);
        }
        if (chartOption.series.length > 2) {
            chartOption.series[chartOption.series.length - 1].type = "line";
        }
        return chartOption;
    }
}
