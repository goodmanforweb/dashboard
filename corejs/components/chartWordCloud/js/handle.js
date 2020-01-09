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
                    this.handleDefinition(chartDefinition, e.name);
                    this.draw();
                    break;
                case "interact":
                    var _params = Immutable.fromJS(params).toJS();
                    _params.category.value = e.name;
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
        return this._option;
    }
    //处理可枚举属性
    _handleEnumOption(store, option, htmlObj) {
        for (let item in store) {
            this._handlePerStore(item, store[item], option, htmlObj, store);
        }
        return option;
    }
    //处理属性
    _handlePerStore(item, value, option, htmlObj, ownOption) {
        // console.log(item,'4564564564');
        switch (item) {
            //标题
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
            //是否导出数据
            case "isExportData":
                /* document.querySelector(
                    "#" + this.cfg.id + " .chartCsv"
                ).style.display = value ? "block" : "none"; */
                Dashboard.lib
                    .$("#" + this.cfg.id + " .chartCsv")
                    .css({ display: value ? "block" : "none" });
                break;

            //图表颜色
            case "color":
                if (value.length > 0) {
                    option.series[0].textStyle = {
                        normal: {
                            color: function() {
                                return value[
                                    Math.floor(Math.random() * value.length)
                                ];
                            }
                        }
                    };
                }
                break;
            case "textColor":
                if (value.length > 0) {
                    //设置主要颜色
                    option.title.textStyle.color = value[0];
                }
                break;
            //形状
            case "worldType":
                option.series[0].shape = value;
            //文字大小
            case "fontSize":
                option.series[0].sizeRange = value;
                break;
            //文字间距
            case "fontSpace":
                option.series[0].gridSize = parseInt(value);
                break;
            //文字角度
            case "fontAngle":
                option.series[0].rotationRange = [
                    0,
                    value === "auto" ? 90 : parseInt(value)
                ];
                break;
            //背景颜色
            case "backgroundColor":
                value && (htmlObj.style[item] = value);
                if (this.cfg.parentId) {
                    htmlObj.style[item] = "rgba(0, 0, 0, 0)";
                }
                break;
            case "showValue":
                value && (htmlObj.style[item] = value);
                break;
            default:
                break;
        }
    }
    //设置formatter
    _setFormatter(option, formatterData) {
        option.tooltip.formatter = function(param) {
            return (
                param.name +
                "</br>" +
                (formatterData.colName || "词频") +
                ":" +
                param.value
            );
            // console.log(param.name, formatterData.colName);
            // return ;
        };
    }
    //处理请求返回的data
    _handleData(data, option, ownOption, drillName) {
        let ownData = Immutable.fromJS(data).toJS();
        if (is(Map(ownData), Map({}))) return option;

        let _result = ownData.resultset;
        //第一列作为展示的数据
        const { util } = window.Dashboard;
        if (
            !ownData.metadata ||
            !ownData.metadata[0] ||
            (ownData.metadata[1] &&
                ["Integer", "Numeric"].indexOf(ownData.metadata[1].colType) ===
                    -1)
        ) {
            util.popTips("WARING", "数据格式错误");
            option.series[0].data = [];
            return option;
        }
        option.series[0].data = this.setSeriesData(
            _result,
            ownData.metadata.length
        );
        this._setFormatter(option, data.metadata[1] || {});
        return option;
    }
    setSeriesData(result = [], len) {
        var data = {},
            data1 = [];
        result.forEach(e => {
            data[e[0]] = data[e[0]] || [];
            e[1] = len === 1 ? 1 : e[1];
            data[e[0]].push(e);
        });
        data1 = Object.values(data).map(e => {
            return {
                name: e[0][0],
                value:
                    e.length > 1
                        ? e.reduce(
                              (a, b) =>
                                  (typeof a === "number" ? a : a[1]) + b[1]
                          )
                        : e[0][1]
            };
        });
        return data1;
    }
}
