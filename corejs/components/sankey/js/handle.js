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
                option.series.top = 40 + 5;
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
                /*  document.querySelector(
            "#" + this.cfg.id + " .chartCsv"
        ).style.display = value ? "block" : "none"; */
                Dashboard.lib
                    .$("#" + this.cfg.id + " .chartCsv")
                    .css({ display: value ? "block" : "none" });
                break;
            case "color":
                if (value.length > 0) {
                    option.color = value;
                }
                break;
            case "curveness":
                option.series.lineStyle.curveness = value;
                break;
            case "labelShow":
                option.series.label.show = value;
                // this.handleTextShow(option, enumOption);
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
                    value[1] && (option.series.label.color = value[1]);
                }
                break;
            case "lineColor":
                if (value.length > 0) {
                }
                break;
            default:
                break;
        }
    }
    /**
     * 处理 数据显示  和 文字 显示
     * @param {*} option
     * @param {*} enumOption
     */
    handleTextShow(option, enumOption) {
        let func = function(e) {};
        let value = option.series.links[e.dataIndex].value;
        if (enumOption.labelShow) {
            if (enumOption.showData) {
                func = e => `{a|${e.name}a}\n{b|${value}b}`;
            } else {
                func = e => e.name;
            }
        } else {
            if (enumOption.showData) {
                func = e => value;
            } else {
                option.series.label.show = false;
                return option;
            }
        }
        option.series.label.show = true;
        option.series.label.formatter = func;
        return option;
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
        let tempArr = [],
            tempObj = {};
        tempObj = {
            links: data.resultset.map(el => {
                tempArr.push(el[0], el[1]);
                return {
                    source: el[0],
                    target: el[1],
                    value: el[2]
                };
            }),
            data: [...new Set(tempArr)].map(el => ({ name: el }))
        };
        Object.assign(tempOption.series, tempObj);
        return tempOption;
    }
}
45454;
