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
                    // this._option.legend.selected = {}; //点击下转  重置图例状态
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
        let selfoption = chartDefinition.option;
        //处理样式操作数据
        this._option = this._handleEnumOption(
            selfoption,
            this._option,
            this.htmlObj
        );
        this._customizeBar(option, this.htmlObj, selfoption); //xy轴间距调整
        //处理预警
        this._handlewarn(
            selfoption.warns,
            option,
            chartDefinition.data,
            selfoption.orientation,
            selfoption.linestack
        );
        //处理代码注入数据
        // this._option = handleChart.handleInjectOption(chartDefinition.injectOption,this._option);
        return this._option;
    }
    _handleEnumOption(store, option, htmlObj) {
        for (let item in store) {
            this._handlePerStore(item, store[item], option, htmlObj, store);
        }
        //处理图例
        const chartDefinition = this.cfg.chartDefinition;
        this._handleExample(
            chartDefinition.option.example,
            this._option,
            // document.getElementById(this.cfg.id),
            this.htmlObj,
            chartDefinition.option
        );
        return option;
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
            /* case "example":
                this._handleExample(value, option, htmlObj, ownOption);
                break; */
            case "orientation":
                if (option[item] === value) return;
                option[item] = value;
                if (option.series[0].xAxisIndex) {
                    option.series[0].xAxisIndex =
                        (option.series[0].xAxisIndex + 1) % 2;
                    option.series[0].yAxisIndex =
                        (option.series[0].yAxisIndex + 1) % 2;
                }
                [option.xAxis, option.yAxis] = [option.yAxis, option.xAxis];
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
                    option.color = value;
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
            case "showDot":
                let size = ownOption[item] ? 4 : 1;
                for (let i of option.series) {
                    i.symbolSize = size;
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
            case "linestack":
                let arrNum1 = [];
                let barstackMax;
                let lineNum1 = [];
                if (ownOption[item]) {
                    for (let i of option.series) {
                        if (i.tag || i.type !== "line") continue;
                        i.stack = i._name != "noNull" ? i.type : "resize";
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
                        let data = {
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
            // chartOption.xAxis[0].max = Math.ceil(getMaxNum(chartOption.series));
            chartOption.xAxis[0].minInterval =
                chartOption.series[0].data[0] / 4;
            offsetY = this.getMaxLength(chartOption.yAxis[0].data);
            offsetYHeight = chartOption.yAxis[0].data.length;
            offsetX = (chartOption.series[0].data[0] + "").length * 4;
            offsetXLenght = chartOption.series[0].data.length;
            offsetMaxLenght = this.getMaxLength(chartOption.series[0].data);
            xNameLength =
                chartOption.xAxis[0].name &&
                chartOption.xAxis[0].name.length > 0
                    ? 10
                    : 0;
            yNameLength = 0;
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
     * @param {*} orientation 横纵向
     * @param {*} stack 是否堆叠
     */
    _handlewarn(warn, option, data, orientation, stack) {
        if (!data.metadata || !this._legendSerise || !warn.switch) {
            return false;
        }
        //拷贝series
        let selfOption = Immutable.fromJS(option).toJS();
        //分类
        let selfOption1 = selfOption.series.filter(e => e._name === "noNull");
        let selfOption2 = selfOption.series.filter(e => e._name !== "noNull");
        //是否是堆叠处理
        if (stack) {
            [selfOption1, selfOption2].forEach(ee => {
                ee.forEach((e, i) => {
                    e.data.forEach((item, ind) => {
                        if (i > 0) {
                            e.data[ind] += ee[i - 1].data[ind];
                        }
                    });
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
                        let _item = selfOption.series[ind].data[i];
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
                                        ? [i, _item]
                                        : [_item, i]
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
    maxLength(arr) {
        let maxLength = 0;
        for (let i = 0, len = arr.length; i < len; i++) {
            if (arr[i].length > maxLength) maxLength = arr[i].length;
        }
        return maxLength;
    }
    addArr(temp, arr) {
        if (!temp) return arr;
        for (let i = 0; i < arr.length; i++) {
            arr[i] = arr[i] + temp[i];
        }
        return arr;
    }
    setChartData(chartOption, axisData = [], zipData = [], lengend) {
        const { defaultOption } = this.cfg.chartDefinition;
        var templateData = Immutable.fromJS(defaultOption.series[0]).toJS();
        // var arr = [];
        // for (let i = 0; i < lengend.length; i++) {
        //   arr.push(`{b${i}}<br/>{a${i}}: {c${i}}`)
        // }
        // var tooltipData = arr.join('</br>');
        // chartOption.tooltip.formatter = tooltipData;
        //设置图例数据
        chartOption.legend.data = lengend;
        for (let item of chartOption.xAxis) {
            item.data = axisData;
        }

        //删除模板中的示例数据
        chartOption.series = [];
        if (zipData.length) {
            for (let i = 0; i < zipData.length; i++) {
                templateData.name = lengend[i];
                templateData.data = zipData[i];
                var obj = Immutable.fromJS(templateData).toJS();
                chartOption.series.push(obj);
            }
        } else {
            var obj = Immutable.fromJS(templateData).toJS();
            chartOption.series.push(obj);
        }
        return chartOption;
    }
}
