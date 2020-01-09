import WidgetBase from "corejs/components/base";
import echarts from "echarts";
import handleChart from "./js/handleChart";
import defaultOption from "./js/defaultCfg";

class ThemeRiver extends handleChart {
    static cname = "河流图";
    constructor(htmlObj, cfg) {
        super(htmlObj, cfg);
    }

    widgetWillCreated(cfg) {
        super.widgetWillCreated(cfg);
        //生成一个新的模板配置
        this._option = defaultOption();

        this.drawCount = 0;

        this.handleDefinition(cfg.chartDefinition);

        this.echartsDom = echarts.init(this.htmlObj);
        // 事件绑定
        this.echartsDom.on("click", e => {
            const chartDefinition = this.cfg.chartDefinition;
            const params = chartDefinition.option.clickParmas;
            console.log(e);
            switch (chartDefinition.option.clickEvent) {
                case "drill":
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
        /* // 鼠标移入移除事件
    this.rawhtmlObj.addEventListener('mouseenter',(e)=>{
      this._option.toolbox.show = true;
      this.echartsDom.setOption(this._option,true);
    });
    this.rawhtmlObj.addEventListener('mouseleave',(e)=>{
      this._option.toolbox.show = false;
      this.echartsDom.setOption(this._option,true);
    }); */
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
        //单纯做数据刷新保存
        for (let cname in nextCfg) {
            this.dispatchDefinition(cname, nextCfg[cname], drillName);
        }

        const chartDefinition = this.cfg.chartDefinition;
        if (Object.keys(chartDefinition.data).length > 0) {
            this._option = this.handleData(
                chartDefinition.data,
                this._option,
                chartDefinition.option,
                drillName
            );
        }
        //处理样式操作的和代码注入合成option
        this._option = this.handleEnumOption(
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
    }
    widgetDidCreated(cfg) {
        super.widgetDidCreated(cfg);
    }
    /**数据入口 */
    preUpdate(nextCfg) {
        super.preUpdate(nextCfg);
        this.handleDefinition(nextCfg);
    }
    postUpdate(nextCfg) {
        super.postUpdate(nextCfg);
    }
    draw() {
        // this.drawCount++;
        // console.log(this.cfg);
        // if(window.Dashboard.util.urlParse('type') == '1' && this.cfg.chartDefinition.query.query && this.drawCount == 1){
        //   return false;
        // }
        // this._bindCsv();
        this.echartsDom.setOption(this._option, true);
    }
    destroy() {
        this.echartsDom.dispose();
    }

}
export default ThemeRiver;
