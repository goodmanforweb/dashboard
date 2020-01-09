import Handle from "./js/handle";
import echarts from "echarts";
import Immutable, { Map, is } from "immutable";
import defaultOption from "./js/defaultCfg";

export default class ChartFunnel extends Handle {
    static cname = "漏斗图";
    constructor(htmlObj, cfg) {
        super(htmlObj, cfg);
    }

    widgetWillCreated(cfg) {
        super.widgetWillCreated(cfg);
        // this._option = {};
        // this.initOption(); //初始化option
        this.drawCount = 0;

        //默认option赋值
        cfg.chartDefinition.defaultOption = defaultOption;

        this.handleDefinition(cfg.chartDefinition);

        this.echartsDom = echarts.init(this.htmlObj);
        this.htmlObj.style.overflow = "hidden";
        this._bindClickEvent();
        return (this.rootDom = this.htmlObj);
    }
    /**
     * @Author    Liwei
     * @DateTime  2018-03-15
     * @discripte [处理数据，样式，和属性]
     * @param     {[type]}    nextCfg  [{css:{},data:{}}]
     * @param     {Boolean}   isUseSet [是否是用户调用设置宽高]
     * @return    {[type]}             [description]
     */
    handleDefinition(nextCfg, drillName) {
        this._option = {};
        this._initOption();
        //处理返回data和样式等
        for (let cname in nextCfg) {
            this.dispatchDefinition(cname, nextCfg[cname], drillName);
        }
        const chartDefinition = this.cfg.chartDefinition;
        if (Object.keys(chartDefinition.data).length > 0) {
            this._handleData(
                chartDefinition.data,
                this._option,
                chartDefinition.option,
                drillName || this._drilName
            );
        }
        //处理样式操作的和代码注入合成option
        this._option = this._handleOption(this._option);
        return this._option;
    }

    dispatchDefinition(type, value, drillName) {
        const chartDefinition = this.cfg.chartDefinition;
        switch (type) {
            case "data":
                this._drilName = false;
                chartDefinition.data = value;
                break;
            default:
                break;
        }
    }
    resize() {
        const { option } = this.cfg.chartDefinition;
        this.handleExample(option.example, this._option, this.htmlObj, option);
        this.echartsDom.resize();
        this.echartsDom.setOption(this._option, true);
    }
    widgetDidCreated(cfg) {
        super.widgetDidCreated(cfg);
        console.log("widgetDidCreated");
    }
    //设置图例提示
    _setlegendTooltip() {
        this._option.legend.formatter = function(name) {
            return echarts.format.truncateText(
                name,
                80,
                "14px Microsoft Yahei",
                "…"
            );
        };
        this._option.legend.width = 90;
        this._option.legend.tooltip = {
            show: true
        };
    }
    /**数据入口 */
    preUpdate(nextCfg) {
        super.preUpdate(nextCfg);
        console.log("preUpdate", nextCfg);
        this.handleDefinition(nextCfg);
    }
    postUpdate(nextCfg) {
        super.postUpdate(nextCfg);
        console.log("postUpdate");
    }
    draw() {
        this.drawCount++;
        // console.log(this.cfg);
        if (
            window.Dashboard.util.urlParse("type") == "1" &&
            this.cfg.chartDefinition.query.query &&
            this.drawCount == 1
        ) {
            return false;
        }
        // this._bindCsv();
        this.echartsDom.setOption(this._option, true);
        // this.echartsDom.resize();
    }
    destroy() {
        this.echartsDom.dispose();
        // this.dom.removeEventListener('change',() => {});
        // this.cfg.htmlObj.removeChild(this.dom)
    }
}
