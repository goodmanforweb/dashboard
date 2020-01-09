import WidgetBase from "corejs/components/base";
import Immutable, { Map, is } from "immutable";
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
                    // this._option.legend.selected = {}; //点击下转  重置图例状态
                    this.handleDefinition(chartDefinition, e.name);
                    this.draw();
                    break;
                case "interact":
                    var _params = Immutable.fromJS(params).toJS();
                    _params.category.value = e.data.name;
                    // _params.series.value = e.seriesName;
                    _params.value.value = e.data.value;
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
        //处理预警
        this._handlewarn(
            chartDefinition.option.warn,
            option,
            chartDefinition.data
        );
        //处理代码注入数据
        // this._option = handleChart.handleInjectOption(chartDefinition.injectOption,this._option);
        return this._option;
    }
    //处理可枚举属性
    _handleEnumOption(store, option, htmlObj) {
        for (let item in store) {
            this._handlePerStore(item, store[item], option, htmlObj, store);
        }
        return option;
    }
    //初始化图表的数据
    _initOption() {
        const { util } = window.Dashboard;
        const { defaultOption } = this.cfg.chartDefinition;
        let thisOption = util.copy(true, {}, defaultOption, this._option);
        util.copy(true, this._option, thisOption);
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
            case "example":
                this.handleExample(value, option, htmlObj, ownOption);
                break;
            case "showLabel":
                option.series.map(i => {
                    i.label.normal.show = value;
                });
                break;
            case "formatter":
                this.handleFormatter(value, option);
                break;
            case "color":
                if (value.length > 0) {
                    option.color = value;
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
                }
                break;
            default:
                break;
        }
    }
    handleExample(value, chartOption, htmlObj, ownOption) {
        chartOption.legend.top = "auto";
        chartOption.legend.right = "auto";
        chartOption.legend.left = "auto";
        chartOption.legend.bottom = "auto";
        chartOption.legend.orient = "horizontal";
        chartOption.legend.show = true;
        var option = {
            chartOption: chartOption,
            height: parseInt(htmlObj.clientHeight, 10),
            width: parseInt(htmlObj.clientWidth, 10),
            type: "pie"
        };
        option.chartOption.legend.type = "scroll";
        switch (value) {
            case "null":
                chartOption.legend.show = false;
                break;
            case "top":
                chartOption.legend.top = ownOption.title.length > 0 ? 40 : "10";
                chartOption.legend.left = "center";
                break;
            case "left":
                chartOption.legend.left = "0";
                chartOption.legend.orient = "vertical";
                chartOption.legend.top = ownOption.title.length > 0 ? 40 : 20;
                option.chartOption.legend.bottom = 20;
                this._setlegendTooltip();
                break;
            case "right":
                chartOption.legend.right = "0";
                chartOption.legend.orient = "vertical";
                option.chartOption.legend.bottom = 20;
                chartOption.legend.top = ownOption.title.length > 0 ? 40 : 20;
                this._setlegendTooltip();
                break;
            case "bottom":
                chartOption.legend.left = "center";
                chartOption.legend.bottom = "20";
                break;
            default:
                null;
        }
        this.lengendFn(option, value, ownOption);
    }
    lengendFn(option, type, ownOption) {
        var datas = option.chartOption.legend.data;
        var series = option.chartOption.series;
        var yh = option.height;
        var xh = option.width;
        //先计算center与第一条数据的radius
        var CR = this._countCR(option, type, datas, ownOption);
        var len = {
            len: series.length,
            min: Math.min(xh, yh),
            huan: 50,
            gezi:
                (((ownOption.space / 100) * parseFloat(CR.radiusArr[1])) /
                    100) *
                Math.min(xh, yh)
        };
        if (len.len === 1) {
            series[0].label.normal.position = "outside";
            series[0].labelLine.normal.show = true;
            series[0].center = CR.center;
            series[0].radius = CR.radiusArr;
        } else if (len.len === 2) {
            series[1].label.normal.position = "outside";
            series[1].labelLine.normal.show = true;
            series.forEach(e => {
                e.center = CR.center;
                e.radius = [...CR.radiusArr];
            });
            series[1].radius[0] =
                (((parseFloat(series[1].radius[1]) / 100) * len.min -
                    len.huan) /
                    len.min) *
                    100 +
                "%";
            series[0].radius[1] =
                (((parseFloat(series[1].radius[0]) / 100) * len.min -
                    len.gezi) /
                    len.min) *
                    100 +
                "%";
        } else {
            series.forEach(e => {
                e.center = CR.center;
                e.radius = [...CR.radiusArr];
            });
            series[2].radius[0] =
                (((parseFloat(CR.radiusArr[1]) / 100) * len.min - len.huan) /
                    len.min) *
                    100 +
                "%";
            series[1].radius[1] =
                (((parseFloat(series[2].radius[0]) / 100) * len.min -
                    len.gezi) /
                    len.min) *
                    100 +
                "%";
            series[1].radius[0] =
                (((parseFloat(series[1].radius[1]) / 100) * len.min -
                    len.huan) /
                    len.min) *
                    100 +
                "%";
            series[0].radius[1] =
                (((parseFloat(series[1].radius[0]) / 100) * len.min -
                    len.gezi) /
                    len.min) *
                    100 +
                "%";
        }
    }
    /**
     * 先计算center与第一条数据的radius
     * @param {*} option
     * @param {*} type
     */
    _countCR(option, type, datas, ownOption) {
        var series = option.chartOption.series;
        var yh = option.height;
        var xh = option.width;
        var len = {};
        let pieTop = 0;
        var aa;
        //判断标签位置  重置标准半径showLabel
        var R = ownOption.showLabel ? 0.7 : 0.8,
            outerR;
        var innerR = 0;
        len.len = series.length;
        let center = [],
            radiusArr = [];
        switch (type) {
            case "top":
                aa = parseInt(ownOption.title.length > 0 ? 40 : "0");
                pieTop = ((aa + 24 + (yh - aa - 24) / 2) / yh) * 100;
                center = ["50%", pieTop + "%"];
                outerR =
                    xh >= yh - aa - 24
                        ? (((yh - aa - 24) * R) / yh) * 100 + "%"
                        : R * 100 + "%";

                radiusArr = [parseFloat(outerR) * innerR + "%", outerR];
                len._length = datas.reduce((a, b) => {
                    return (
                        (typeof a != "number" ? this.measureTextWidth(a) : a) +
                        80 +
                        this.measureTextWidth(b)
                    );
                });
                /* if (len._length > xh - 50) {
                    option.chartOption.legend.left = 30;
                    option.chartOption.legend.right = 30;
                } */ option.chartOption.legend.width =
                    xh - 60;
                break;
            case "bottom":
                aa = parseInt(ownOption.title.length > 0 ? 40 : "0");
                pieTop = ((aa + (yh - aa) / 2) / yh) * 100;
                center = ["50%", pieTop + "%"];
                outerR =
                    xh >= yh - aa - 24
                        ? (((yh - aa - 24) * R) / yh) * 100 + "%"
                        : R * 100 + "%";
                radiusArr = [parseFloat(outerR) * innerR + "%", outerR];
                len._length = datas.reduce((a, b) => {
                    return (
                        (typeof a != "number" ? this.measureTextWidth(a) : a) +
                        80 +
                        this.measureTextWidth(b)
                    );
                });
                /*  if (len._length > xh - 50) {
                    option.chartOption.legend.left = 30;
                    option.chartOption.legend.right = 30;
                } */ option.chartOption.legend.width =
                    xh - 60;
                break;
            case "null":
                center = ["50%", "50%"];
                outerR = R * 100 + "%";
                radiusArr = [parseFloat(outerR) * innerR + "%", outerR];
                break;
            case "left":
                len.maxLeg = this.getLabelMaxLength(datas);
                aa = /* this.measureTextWidth(len.maxLeg.maxValue) */ 90 + 30;
                len.titH = parseInt(ownOption.title.length > 0 ? 20 : "0");
                pieTop = ((aa + (xh - aa) / 2) / xh) * 100;
                center[0] = pieTop + "%";
                center[1] =
                    xh - aa >= yh - len.titH
                        ? (((yh - len.titH) * 0.52) / yh) * 100 + "%"
                        : "60%";
                outerR =
                    xh - aa >= yh - len.titH
                        ? (((yh - len.titH) * R) / yh) * 100 + "%"
                        : (((xh - aa) * R) / yh) * 100 + "%";
                radiusArr = [parseFloat(outerR) * innerR + "%", outerR];
                option.chartOption.legend.left = 20;
                break;
            case "right":
                len.maxLeg = this.getLabelMaxLength(datas);
                aa = /* this.measureTextWidth(len.maxLeg.maxValue) */ 90 + 30;
                len.titH = parseInt(ownOption.title.length > 0 ? 20 : "0");
                pieTop = ((0 + (xh - aa) / 2) / xh) * 100;
                center[0] = pieTop + "%";
                center[1] =
                    xh - aa >= yh - len.titH
                        ? (((yh - len.titH) * 0.52) / yh) * 100 + "%"
                        : "60%";
                outerR =
                    xh - aa >= yh - len.titH
                        ? (((yh - len.titH) * R) / yh) * 100 + "%"
                        : (((xh - aa) * R) / yh) * 100 + "%";
                radiusArr = [parseFloat(outerR) * innerR + "%", outerR];
                option.chartOption.legend.right = 20;
                break;
            default:
                break;
        }
        return {
            center,
            radiusArr
        };
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
    handleFormatter(value, option) {
        let key;
        let formatterFn;
        switch (value) {
            case "0":
                key = "{b}({c})";
                formatterFn = function(data) {
                    var num = data.value.toString();
                    var num1 = num.split(".")[0];
                    var num2 = num.split(".")[1]
                        ? "." + num.split(".")[1].toString()
                        : "";
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
                    return data.name + "(" + result.join("") + num2 + ")";
                };
                break;
            case "1":
                key = "{b}({d}%)";
                formatterFn = function(data) {
                    return data.name + `(${data.percent}%)`;
                };
                break;
            case "2":
                key = "{c}({d}%)";
                formatterFn = function(data) {
                    var num = data.value.toString();
                    var num1 = num.split(".")[0];
                    var num2 = num.split(".")[1]
                        ? "." + num.split(".")[1].toString()
                        : "";
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
                    return result.join("") + num2 + `(${data.percent}%)`;
                };
                break;
            case "3":
                key = "{b} : {c}({d}%)";
                formatterFn = function(data) {
                    var num = data.value.toString();
                    var num1 = num.split(".")[0];
                    var num2 = num.split(".")[1]
                        ? "." + num.split(".")[1].toString()
                        : "";
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
                    return (
                        data.name +
                        ":" +
                        result.join("") +
                        num2 +
                        `(${data.percent}%)`
                    );
                };
                break;
            default:
                key = "{b} : {c}";
                break;
        }
        option.series.map(function(i) {
            i.label.normal.formatter = formatterFn;
        });
    }
    //处理枚举属性  生成option
    handleEnumOption(store, option, htmlObj) {
        for (let item in store) {
            this.handlePerStore(item, store[item], option, htmlObj, store);
        }
        return option;
    }
    //处理代码注入 反编译
    handleInjectOption(intocode, option) {
        for (let item in intocode) {
            this.handlePercode(item, option);
        }
        return option;
    }
    handleInject(item, option) {}
    /**
     * 处理预警
     * @param {*} warn 预警字段
     * @param {*} option 图表配置项
     * @param {*} data 图表数据
     */
    _handlewarn(warn, option, data) {
        if (!data.metadata || !this._legendSerise || !warn.switch) {
            return false;
        }
        warn.seriesList = this._legendSerise;
        this.dispatch("seriesListChange", this._legendSerise);
        if (warn.series.length && warn.series.indexOf(warn.seriesList) !== -1) {
            option.series.forEach(e => {
                e.data.forEach(item => {
                    item = typeof item === "object" ? item : { value: item };
                    item.itemStyle = item.itemStyle ? item.itemStyle : {};
                    if (
                        /* eval(item.value + warn.filter + warn.value) */
                        new Function(
                            "",
                            "return " + item.value + warn.filter + warn.value
                        )()
                    ) {
                        item.itemStyle.color = warn.color;
                        item.selected = true;
                    }
                });
            });
        }
    }
    //处理数据
    _handleData(data, option, ownOption, drillName) {
        let ownData = Immutable.fromJS(data).toJS();
        if (is(Map(ownData), Map({}))) return option;
        var _legendData = {};
        var lengendMetaData = ownData.metadata.slice(1); //第一列展示为类目轴
        var lengendIndex = this.getLengendNumericIndex(lengendMetaData);
        this._legendSerise = [
            lengendMetaData.find(e => e.colIndex === lengendIndex[0]).colName
        ];
        var changeData = this.getChangeData(
            ownData.resultset,
            lengendIndex,
            ownOption
        );
        //第一列作为展示的数据
        const { util } = window.Dashboard;
        if (!lengendIndex.length || lengendIndex[0] > 4) {
            option.series.forEach(e => (e.data = []));
            option.legend.data = [];
            util.popTips("WARING", "数据格式错误");
            return option;
        }
        //获取图例列
        var lengendArr = this.getLengendNumeric(lengendMetaData);
        lengendArr.push(ownData.metadata[0]);
        lengendArr.sort((a, b) => a.colIndex - b.colIndex);
        //处理图例和数据
        // _legendData.legendAndData = this.getLengend(lengendArr, data.resultset);
        _legendData.legendAndData = this._getLengend(changeData);
        //获取图例
        _legendData.legend =
            /* _legendData.legendAndData.map(e => e.name) */ changeData.axisData;

        //处理数据列
        _legendData.data = this.getSeriesData(
            _legendData.legendAndData,
            lengendArr.length
        );
        this.setChartData(option, _legendData.legend, _legendData.data);
        return option;
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
        var min = lengendArr[0],
            max = lengendArr[lengendArr.length - 1];
        //未开启下转
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
                    else if (e[0].includes(el) && itemArrLen !== itemArr1Len) {
                        let arrObj = {
                            arr: [],
                            ArrSum: []
                        };
                        Object.keys(selfArrObj).filter((eli, indd) => {
                            var itemArr2 = eli.split("~");
                            var itemArr2Len = eli.split("~").length;
                            if (
                                itemArr2Len - itemArrLen === 1 &&
                                itemArr2.splice(0, itemArrLen).join("~") === el
                            ) {
                                arrObj.arr.push(selfArrObj[eli]);
                                return true;
                            }
                        });
                        arrObj.arr.map(el => {
                            el.map((e, i) => {
                                arrObj.ArrSum[i] = (arrObj.ArrSum[i] || 0) + e;
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

        return {
            axisData: type,
            zipData: array
        };
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
    //处理数据
    getSeriesData(data, len) {
        var _data = {};
        for (var i = 0; i < len; i++) {
            _data[i] = data.filter(e => {
                var ismatch = e.name.match(/~/g);
                if (!ismatch && i == 0) {
                    return true;
                } else if (ismatch) {
                    return ismatch.length == i;
                }
            });
        }
        return _data;
    }
    _getLengend(changeData) {
        var legend;
        legend = changeData.axisData.map((e, i) => {
            return {
                name: e,
                value: changeData.zipData[i][0]
            };
        });
        return legend;
    }
    //图例分组
    getLengendNumeric(metadata) {
        var typeArr = ["Numeric", "Integer"];
        var isStr = true;
        return metadata.filter(item => {
            typeArr.includes(item.colType) && (isStr = false);
            return isStr && !typeArr.includes(item.colType);
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
    setChartData(chartOption, axisData, zipData) {
        chartOption.legend.data = axisData;
        var series = Object.keys(zipData);
        var seriesin = Immutable.fromJS(chartOption.series[0]).toJS(),
            seriesout = Immutable.fromJS(chartOption.series[1]).toJS();
        chartOption.series = [];
        series.map(e => {
            var item = Immutable.fromJS(seriesin).toJS();
            if (e == 0) {
                item.data = zipData[e];
                chartOption.series.push(item);
            } else {
                if (e == series.length - 1) {
                    seriesout.data = zipData[e];
                    chartOption.series.push(seriesout);
                } else {
                    item.data = zipData[e];
                    chartOption.series.push(item);
                }
            }
        });
    }
    getValueForName(value = [], name) {
        let arr = [];
        for (let i = 0; i < value.length; i++) {
            let item = {
                value: value[i],
                name: name[i]
            };
            arr.push(item);
        }
        return arr;
    }
}
