import Handle from "./js/handle";
import echarts from "echarts";
import Immutable, { Map, is } from "immutable";
import defaultOption from "./js/defaultCfg";

class ChartBar extends Handle {
    static cname = "折柱混合图";
    constructor(htmlObj, cfg) {
        super(htmlObj, cfg);
    }

    widgetWillCreated(cfg) {
        super.widgetWillCreated(cfg);
        /*this._option = {};
    this._initOption();//初始化option*/
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
        //每次执行都初始化option  避免造成覆盖不能复原
        this._option = {};
        this._initOption();
        //处理返回data和样式等  制作赋值操作
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

        /*if(nextCfg.option && Object.keys(nextCfg.option).length === 1 && nextCfg.option.clickEvent){
          this.handleDefinition(chartDefinition);
        }*/

        //处理样式操作的和代码注入合成option
        this._option = this._handleOption(this._option);
        // this.__option = this.__option || Immutable.fromJS(this._option).toJS();
        return this._option;
    }

    dispatchDefinition(type, value, drillName) {
        const chartDefinition = this.cfg.chartDefinition;
        switch (type) {
            case "data":
                // this._option.legend.selected = {}; //重置图例选择
                this._drilName = false;
                chartDefinition.data = value;
                // this._option = this._handleData(value, this._option,chartDefinition.option,drillName);
                break;
            case "option":
                for (let cname in value) {
                    chartDefinition.option[cname] = value[cname];
                }
                break;
            /*case 'injectOption': 
            for(let cname in value) {
              chartDefinition.injectOption[cname] = value[cname];
            }
        break;*/
            /*case 'css':
              for(let cname in value) {
                this.dom.style[cname] = value[cname];
                if((cname === 'width' || cname === 'height') && isUseSet){
                  this.echartsDom.resize();
                }
              }
              chartDefinition.css = value;
      break;  */
            default:
                break;
        }
    }
    resize() {
        const { option } = this.cfg.chartDefinition;
        this._roothtmlObj =
            this._roothtmlObj || document.getElementById(this.cfg.id);
        this.echartsDom.resize();
        this._handleExample(
            option.example,
            this._option,
            this._roothtmlObj,
            option
        );
        this._customizeBar(this._option, this._roothtmlObj, option);
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
export default ChartBar;
