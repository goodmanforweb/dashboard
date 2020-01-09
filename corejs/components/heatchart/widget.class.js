import Handle from "./js/handle";
import echarts from "echarts";
import defaultOption from "./js/defaultCfg";

class HeatChart extends Handle {
    static cname = "热力图";
    constructor(htmlObj, cfg) {
        super(htmlObj, cfg);
    }

    widgetWillCreated(cfg) {
        super.widgetWillCreated(cfg);
        this._option = defaultOption();
        this.drawCount = 0;
        this.markPointIndex == null;
        this.handleDefinition(cfg.chartDefinition);
        this.echartsDom = echarts.init(this.htmlObj);
        this.htmlObj.style.overflow = "hidden";
        this._bindClickEvent();
        this._bindHoverEvent();
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
    handleDefinition(nextCfg) {
        //处理返回data和样式等  制作赋值操作
        for (let cname in nextCfg) {
            this.dispatchDefinition(cname, nextCfg[cname]);
        }
        const chartDefinition = this.cfg.chartDefinition;

        if (Object.keys(chartDefinition.data).length > 0) {
            this._handleData(
                chartDefinition.data,
                this._option,
                chartDefinition.option
            );
        }

        //处理样式操作的和代码注入合成option
        this._option = this._handleEnumOption(
            this._option,
            chartDefinition.option,
            this.htmlObj
        );
        return this._option;
    }

    dispatchDefinition(type, value, drillName) {
        const chartDefinition = this.cfg.chartDefinition;
        switch (type) {
            case "data":
                chartDefinition.data = value;
                break;
            case "option":
                for (let cname in value) {
                    chartDefinition.option[cname] = value[cname];
                }
                break;
            default:
                break;
        }
    }
    resize() {
        this.echartsDom.resize();
        this.echartsDom.setOption(this._option, true);
    }
    widgetDidCreated(cfg) {
        super.widgetDidCreated(cfg);
    }
    preUpdate(nextCfg) {
        super.preUpdate(nextCfg);
        this.handleDefinition(nextCfg);
    }
    postUpdate(nextCfg) {
        super.postUpdate(nextCfg);
    }
    draw() {
        this.drawCount++;
        if (
            window.Dashboard.util.urlParse("type") == "1" &&
            this.cfg.chartDefinition.query.query &&
            this.drawCount == 1
        ) {
            return false;
        }
        this.echartsDom.setOption(this._option, true);
    }
    destroy() {
        this.echartsDom.dispose();
    }
}
export default HeatChart;
