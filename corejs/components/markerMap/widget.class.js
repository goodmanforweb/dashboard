import Handle from "./js/handle";

class MarkerMap extends Handle {
    constructor(htmlObj, cfg) {
        super(htmlObj, cfg);
    }
    widgetWillCreated(cfg) {
        super.widgetWillCreated(cfg);
        this._initMarkerMap(cfg);
        this._renderMarkers();
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
                this._removeMarkers();
                this.cfg.chartDefinition.data = value.resultset;
                //   this._removeMarkers();
                this._renderMarkers();
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

export default MarkerMap;
