import _ from "lodash";
let dash = window.Dashboard;

export default class Submit {
    constructor() {
        this.components = [];
        this.datasources = [];
        this.globalParam = {
            params: [],
            theme: {},
            saveInfo: {},
            globelProps: {},
            freshPeriod: {}
        };
        this.filename = "";
    }
    init() {
        try {
            this.getCfgFromCmpManager();
        } catch (error) {
            console.warn("收集组件配置信息发生错误");
        }
        try {
            this.getQueryFromManager();
        } catch (error) {
            console.warn("收集数据源信息发生错误");
        }
        try {
            this.getGlobalParam();
        } catch (error) {
            console.warn("收集全局信息发生错误");
        }
    }
    getCfgFromCmpManager() {
        dash.compManager.components.forEach(instance => {
            let cfg = _.cloneDeep(instance.getCfg());
            //擦除htmlObj
            cfg.htmlObj = null;
            //擦除里面data
            cfg.chartDefinition.data = {};
            this.components.push(cfg);
        });
    }

    getQueryFromManager() {
        Object.values(dash.queryManager.dataSource.container).forEach(
            queryInstance => {
                this.datasources.push(_.cloneDeep(queryInstance.getAllCfg()));
            }
        );
    }

    getGlobalParam() {
        // debugger;
        dash.globalParam.params.container.forEach(paramInstance => {
            this.globalParam.params.push(paramInstance.getAllCfg());
        });
        this.globalParam.theme = _.cloneDeep(
            dash.globalParam.globalParam.theme
        );
        this.globalParam.cssAndJs = _.cloneDeep(
            dash.globalParam.globalParam.cssAndJs
        );
        this.globalParam.saveInfo = _.cloneDeep(
            dash.globalParam.globalParam.saveInfo
        );
        this.globalParam.globelProps = _.cloneDeep(
            dash.globalParam.globalParam.globelProps
        );
        this.globalParam.freshPeriod = _.cloneDeep(
            dash.globalParam.globalParam.freshPeriod
        );
    }

    getCfg() {
        return {
            components: this.components,
            datasources: this.datasources,
            globalParam: this.globalParam,
            filename: this.filename
        };
    }
}
