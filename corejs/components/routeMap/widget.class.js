import Handle from "./js/handle";

class RouteMap extends Handle {
    constructor(htmlObj, cfg) {
        super(htmlObj, cfg);
    }

    widgetWillCreated(cfg) {
        super.widgetWillCreated(cfg);
        this._initRouteMap(cfg);
        this._renderRoute();
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
                this._refresh(value);
                break;
            case "data":
                this._removeRoute();
                this.cfg.chartDefinition.data = value.resultset;

                this._renderRoute();
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
    }

    draw() {
        this._resize();
    }

    destroy() {
        this.execFun = null;
    }
}

export default RouteMap;
