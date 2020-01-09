import WidgetBase from "corejs/components/base";
import Util from "corejs/util/util";

import "corejs/resource/style/leaflet.css";
import "corejs/resource/style/font-awesome.css";

import "corejs/resource/js/leaflet.js";
import "corejs/resource/js/leaflet.ChineseTmsProviders.js";
import "corejs/resource/js/leaflet-heat.js";

const mapCenterMapping = {
    全国: [103.82664, 36.060476],
    北京市: [116.39737, 39.939502],
    天津市: [117.133262, 39.256321],
    上海市: [121.36464, 31.303465],
    重庆市: [106.32485, 29.895013],
    河北省: [114.336873, 38.21885],
    山西省: [112.349964, 38.044464],
    辽宁省: [123.241164, 41.948112],
    吉林省: [125.228072, 43.894927],
    黑龙江省: [126.479088, 45.985284],
    江苏省: [118.715429, 32.246466],
    浙江省: [120.040035, 30.350837],
    安徽省: [117.170056, 31.99595],
    福建省: [119.156964, 26.182279],
    江西省: [115.808656, 28.774611],
    山东省: [116.912494, 36.812038],
    河南省: [113.453802, 34.895028],
    湖北省: [114.116105, 30.764814],
    湖南省: [112.800698, 28.474291],
    广东省: [113.233035, 23.224606],
    海南省: [110.179083, 19.921006],
    四川省: [103.924003, 30.796585],
    贵州省: [106.499624, 26.844365],
    云南省: [102.599397, 25.248948],
    陕西省: [108.780889, 34.408508],
    甘肃省: [103.66644, 36.218003],
    青海省: [101.605943, 36.752842],
    西藏自治区: [90.972306, 29.838888],
    广西壮族自治区: [108.265765, 23.020403],
    内蒙古自治区: [111.614073, 40.951504],
    宁夏回族自治区: [106.094884, 38.624116],
    新疆维吾尔自治区: [87.476819, 43.894927],
    香港特别行政区: [114.1529, 22.542716],
    澳门地区: [113.417008, 22.337477],
    台湾省: [121.36464, 25.248948]
};

const tilelayerArr = {
    Normal: "Geoq.Normal.Map",
    PurplishBlue: "Geoq.Normal.PurplishBlue",
    Gray: "Geoq.Normal.Gray",
    Warm: "Geoq.Normal.Warm",
    Light: "GaoDe.Normal.Map",
    Satellite: "GaoDe.Satellite.Map"
};

export default class handle extends WidgetBase {
    constructor(htmlObj, cfg) {
        super(htmlObj, cfg);
    }

    _initHeatMap(cfg) {
        var mapId = "map" + +new Date();
        var myMap = document.createElement("div");
        myMap.setAttribute("id", mapId);
        myMap.setAttribute("class", "myMap");
        this.htmlObj.appendChild(myMap);
        myMap.parentElement.setAttribute("class", "myMapCon");
        //实例化地图

        this.currentTileLayer = new L.tileLayer.chinaProvider(
            tilelayerArr[cfg.chartDefinition.option.mapStyle],
            {}
        );

        this.myMap = new L.map(mapId, {
            center: [
                mapCenterMapping[cfg.chartDefinition.option.mapCenter][1],
                mapCenterMapping[cfg.chartDefinition.option.mapCenter][0]
            ],
            zoom:
                cfg.chartDefinition.option.zoomLevel +
                cfg.chartDefinition.option.minZoom,
            minZoom: cfg.chartDefinition.option.minZoom,
            maxZoom: cfg.chartDefinition.option.maxZoom,
            layers: [this.currentTileLayer],
            zoomControl: false,
            attributionControl: false
        });

        return (this.rootDom = this.htmlObj);
    }

    _renderHeatLayer() {
        if (Util.getObjtype(this.cfg.chartDefinition.data) === "Object") {
            return false;
        }
        try {
            var pointArr = this.cfg.chartDefinition.data.map(function(p) {
                let cood = p[0].split(",");
                return [cood[1], cood[0]];
            });

            this.heatLayer = new L.heatLayer(pointArr, {
                minOpacity: 0.5,
                radius: this.cfg.chartDefinition.option.heatRadius,
                blur: 20,
                gradient: {
                    "0": "green",
                    "0.5": "yellow",
                    "1": "red"
                }
            }).addTo(this.myMap);
        } catch (error) {
            Util.popTips("ERROR", "数据格式与预期不符");
        }
    }

    _clearHeatLayer() {
        if (Util.getObjtype(this.cfg.chartDefinition.data) === "Object") {
            return false;
        }
        this.myMap.removeLayer(this.heatLayer);
    }

    _refresh(value) {
        switch (Object.keys(value)[0]) {
            case "heatRadius":
                this.cfg.chartDefinition.option.heatRadius =
                    value["heatRadius"];
                this._clearHeatLayer();
                this._renderHeatLayer();
                break;
            case "mapCenter":
                this.cfg.chartDefinition.option.mapCenter = value["mapCenter"];
                let coordinate = mapCenterMapping[value["mapCenter"]];
                this.myMap.setView([coordinate[1], coordinate[0]]);
                break;
            case "zoomLevel":
                this.cfg.chartDefinition.option.zoomLevel = value["zoomLevel"];
                this.myMap.setZoom(
                    this.cfg.chartDefinition.option.minZoom + value["zoomLevel"]
                );
                break;
            case "mapStyle":
                this.cfg.chartDefinition.option.mapStyle = value["mapStyle"];
                this.myMap.removeLayer(this.currentTileLayer);
                this.currentTileLayer = new L.tileLayer.chinaProvider(
                    tilelayerArr[this.cfg.chartDefinition.option.mapStyle],
                    {}
                );
                this.myMap.addLayer(this.currentTileLayer);
                break;
            default:
                break;
        }
    }

    _resize() {
        this.myMap._onResize();
    }
}
