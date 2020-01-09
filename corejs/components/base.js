import Util from "../util/util";
import Observe from "../paramListener/observe";
import csv from "./table/js/export-csv";
import Immutable from "immutable";
window.requestAnimationFrame =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;
export default class WidgetBase extends Observe {
    constructor(htmlObj, cfg, parentId, isEditMode) {
        super();
        this.rawhtmlObj = htmlObj;
        this.cfg = cfg;
        this.id = cfg.id;
        //是否编辑模式
        this.isEditMode = isEditMode;
        // this.init();
        //子类 在widgetWillCreated 设置
        this.rootDom = "";
        this.htmlObj = "";
        // 记录数据源获取次数
        this.isFirstQuery = 0;
        // 记录是否停止刷新
        this.tickIsStop = false;
        this.oldTime = 0;
        // 记录数据源错误次数
        this.queryErrorCount = 0;
        // 允许数据源刷新最大错误次数
        this.allowQueryErrorCount = 3;
        //数据源刷新最小时间 单位秒
        this.minFreshPeriod = 3;
        // 记录数据源获取状态 fetching fethed
        this.queryState = "";
    }
    init() {
        //对非容器组件设置 加载图,因为容器组件不需要加载图
        if (this.cfg.type != "container") {
            //创建组件容器dom
            this.setContainerDom();
            //创建并显示加载图
            this.loader = this.createLoader();
            //设置加载图默认隐藏
            this.loader.hide();
        } else {
            this.htmlObj = this.rawhtmlObj;
        }
        //注入id
        this.cfg.id = this.id = this.cfg.chartDefinition.id =
            this.cfg.id ||
            /* Util.generateGUID() */ this.cfg.type + "_" + Util.generateGUID();
        ["doQuery", "widgetWillCreated", "widgetDidCreated", "draw"].forEach(
            fun => this[fun].call(this, this.cfg)
        );
    }

    //在htmlObj下设置一个新的div 作为组件容器，主要是因为 echarts 回清空htmlObj下的所用东西
    setContainerDom() {
        let htmlObj = document.createElement("div");
        htmlObj.style.cssText = "width: 100%;min-height: 100%";
        htmlObj.setAttribute("class", "widgetContainer");
        this.rawhtmlObj.appendChild(htmlObj);
        return (this.htmlObj = htmlObj);
    }
    //创建加载图，并返回对它状态控制的对象
    createLoader() {
        let loaderDom = document.createElement("div");
        loaderDom.setAttribute("class", "loaderLayer");
        loaderDom.style.cssText = `position:absolute;left:0;right:0;top:0;bottom:0;z-index:2000; background: url(${
            location.origin
        }/filename/xdt/images/05789b61.moduleLoader.gif) no-repeat center center`;
        this.rawhtmlObj.appendChild(loaderDom);
        return {
            hide: () => (loaderDom.style.display = "none"),
            show: () => (loaderDom.style.display = "block")
        };
    }
    /**
     * 具有paramter属性的组件，当值变化时，就触发，改变 globalParam 中的值
     * @param {*} name
     * @param {*} value
     */
    setParameter(value) {
        return (
            this.cfg.parameter &&
            window.Dashboard.globalParam.setParamValueById(
                this.cfg.parameter,
                value
            )
        );
    }
    getParameter(parameterid) {
        return parameterid
            ? window.Dashboard.globalParam.getParam(parameterid)
            : null;
    }
    /**
     * 该组件具有paramter属性，一旦值改变，就通知 globalParam
     */

    /**
     * 组件参数 通知 接口
     * @param {Object} obj1 listeners 中 监听 有 改变的参数
     * @param {Object} obj2 所有改变的参数
     */
    paramListenedChange(obj1, obj2) {
        if (!Util._.isEmpty(obj1)) {
            //说明listener中参数有变动
            /**参数改变钩子，如文本组件插入参数，需要用到新的参数值进行渲染 */
            this.paramChanged(obj1);
        }
        if (!Util._.isEmpty(obj2)) {
            //说明数据源查询参数有变动
            /**检查数据源中是否有用参数，有 就发 数据源请求，无则抑制 */
            //有变动就要重新对query.param赋值,然后发起新的doQuery
            let queryParam = this.cfg.chartDefinition.query.param;
            obj2.forEach(pm => {
                queryParam[`param${pm.name}`] = pm.value;
                queryParam[`type${pm.name}`] = pm.type;
            });
            this.doQuery("parametersChange");
        }
        this.cfg.parameters = obj2;
    }
    /**
     * @description 设置数据源刷新时间
     * @param {number} time
     * @return
     */
    setFreshPeriod(time) {
        if (time) {
            if (time < this.minFreshPeriod) {
                console.warn("刷新频率过快，最小为3s");
                return null;
            }
            //清除之前的刷新队列，开始一个新的队列
            this.setTickState(true);
            this.cfg.chartDefinition.freshPeriod = time;
            this.freshTick();
        }
    }
    setTickState(state) {
        return (this.tickIsStop = state);
    }
    /**
     *
     */
    freshTick() {
        let cfg = this.cfg.chartDefinition;
        //组件刷新优先， 组件没有 则 全局的刷新
        let freshPeriod =
            cfg.freshPeriod ||
            Dashboard.globalParam.globalParam.freshPeriod.period;
        //抑制无效刷新
        if (!freshPeriod || !(cfg.query && cfg.query.type)) return false;
        if (this.oldTime + freshPeriod * 1000 <= new Date().getTime()) {
            this.oldTime = new Date().getTime();
            //如果数据源还在获取中，就 等待下一个刷新周期
            if (this.queryState === "fetching") return false;
            try {
                this.doQuery(function() {}, "freshQuery");
            } catch (error) {
                this.queryErrorCount++;
                //如果错误次数超过允许最大次数，就终止数据源刷新
                if (this.queryErrorCount >= this.allowQueryErrorCount) {
                    this.setTickState(true);
                }
            }
        }
        if (!this.tickIsStop) {
            requestAnimationFrame(this.freshTick.bind(this));
        }
    }

    /**
     *
     * @param {*} initor  指 doQuery 是因为什么触发的，传入parametersChange ,说明是由参数值改变触发的
     * @return {Promise}
     */
    doQuery(callback, initor) {
        //数据源存在
        let query = this.cfg.chartDefinition.query || {};
        let queryType = query.type;

        if (!queryType) {
            return Promise.resolve([]);
        }

        //数据源刷新 ，不需要加载图
        !initor && this.loader.show();

        this.queryState = "fetching";
        return new Promise((resolve, reject) => {
            window.Dashboard.queryManager.doQuery(this.cfg, data => {
                resolve(data);
                this.queryState = "fetched";
                ++this.isFirstQuery;
                this.loader.hide();
                this.queryFetched(data);
            });
        });
    }

    /**数据获取回来的钩子 */
    queryFetched(data) {
        this.update({ data });
        //如果是第一次成功获取数据且是预览模式,就可以开始刷新数据了
        if (
            this.isFirstQuery === 1 &&
            window.dashboardMode.name === "preview" &&
            Dashboard.globalParam.globalParam.freshPeriod.state
        ) {
            this.oldTime = new Date().getTime();
            this.freshTick();
        }
    }
    /**参数改变后的钩子，子类继承这个钩子 */
    paramChanged(obj1) {}
    widgetWillCreated(cfg) {
        this._runHook("widgetWillCreated", cfg);
    }
    widgetDidCreated(cfg) {
        //把id绑定到根节点
        let dom = this.rootDom || this.htmlObj;
        dom.setAttribute("widgetId", this.cfg.id);
        this._runHook("widgetDidCreated", cfg);
    }
    //运行代码注入
    _runHook(hk, cfg) {
        cfg = Object.assign({}, this.cfg.chartDefinition, cfg);
        cfg.inject &&
            cfg.inject[hk] &&
            Util.execRun(`return ${cfg.inject[hk]}`)().call(this);
    }
    /**
     * @param     {[对象]}    nextCfg [description]{data,htmlObj,}
     */
    preUpdate(nextCfg) {
        this._runHook("preUpdate", nextCfg);
    }
    update(nextCfg) {
        //先option赋值
        let { option } = this.cfg.chartDefinition;
        if (nextCfg.option) {
            for (let cname in nextCfg.option) {
                option[cname] = Immutable.fromJS(nextCfg.option).toJS()[cname];
            }
        }
        ["preUpdate", "draw", "postUpdate"].forEach(fun =>
            this[fun].call(this, nextCfg)
        );
    }
    postUpdate(nextCfg) {
        this._runHook("postUpdate", nextCfg);
    }
    //重新渲染   计算不同时组件可自由覆盖
    resize() {
        this.draw();
    }
    draw() {
        // this.cfg.chartDefinition.draw && Util.execRun(`return ${this.cfg.chartDefinition.draw}`)().call(this);
    }
    //导出图片
    _chartDownPng() {
        const { util } = window.Dashboard;
        const { option } = this.cfg.chartDefinition;
        util.downToPng(this.rootDom, option.title || this.cfg.name);
    }
    //导出csv数据
    _bindCsv() {
        function exportCsv(obj) {
            //csv导出
            //title ["","",""]
            if (!obj || !Object.keys(obj).length) return;
            var title = Object.values(obj.metadata).map(v => v.colName);
            //titleForKey ["","",""]
            // var titleForKey = obj.titleForKey;
            var data = obj.resultset;
            var str = [];
            str.push(title.join(",") + "\n");
            for (var i = 0; i < data.length; i++) {
                var temp = [];
                for (var j = 0; j < title.length; j++) {
                    temp.push(data[i][j]);
                }
                str.push(temp.join(",") + "\n");
            }
            csv.download("export.csv", str.join(""));
        }
        const chartDefinition = this.cfg.chartDefinition;
        exportCsv(chartDefinition.data);
    }
    handleData() {}
    destroy() {}
    getCfg() {
        return this.cfg;
    }
}
