import WidgetBase from "corejs/components/base";
import echarts from "echarts";
import Util from "corejs/util/util";
export default class Custom extends WidgetBase {
    constructor(htmlObj, cfg) {
        super(htmlObj, cfg);
    }
    widgetWillCreated(cfg) {
        super.widgetWillCreated(cfg);
        this.handleDefinition(cfg.chartDefinition);
        return (this.rootDom = this.htmlObj);
    }
    handleDefinition(nextCfg) {
        for (let cname in nextCfg) {
            this.dispatchDefinition(cname, nextCfg[cname]);
        }
    }

    dispatchDefinition(type, value) {
        switch (type) {
            case "option":
                this.handleDefinition(value);
                break;
            case "data":
                this.cfg.chartDefinition.data = value;
                break;
            case "backgroundColor":
                this.htmlObj.style.backgroundColor = value;
                this.cfg.chartDefinition.option[type] = value;
                if (this.cfg.parentId) {
                    this.htmlObj.style.backgroundColor = "rgba(0, 0, 0, 0)";
                    this.cfg.chartDefinition.option[type] = "rgba(0, 0, 0, 0)";
                }
                break;
            case "code":
                this.cfg.chartDefinition.option.code = value;
                break;

            default:
        }
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
        /*let execFun = this.execFun = Util.execRun(this.cfg.chartDefinition.option.code);
    execFun && execFun.apply(this, [window.Dashboard, echarts]);*/
    }
    draw() {
        let execFun = (this.execFun = Util.execRun(
            this.cfg.chartDefinition.option.code
        ));
        execFun && execFun.apply(this, [echarts]);
    }
    destroy() {
        this.execFun = null;
    }
}
