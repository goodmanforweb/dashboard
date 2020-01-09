import WidgetBase from "corejs/components/base";
import Util from "corejs/util/util";

import "corejs/resource/style/leaflet.css";
import "corejs/resource/style/font-awesome.css";

import "corejs/resource/js/leaflet.js";
import "corejs/resource/js/leaflet.ChineseTmsProviders.js";
import "corejs/resource/js/leaflet.textpath.js";
import "corejs/resource/js/MovingMarker.js";

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

    _initRouteMap(cfg) {
        var mapId = "map" + +new Date();
        var myMap = document.createElement("div");
        myMap.setAttribute("id", mapId);
        myMap.setAttribute("class", "myMap");
        this.htmlObj.appendChild(myMap);
        myMap.parentElement.setAttribute("class", "myMapCon");

        this.currentTileLayer = new L.tileLayer.chinaProvider(
            tilelayerArr[cfg.chartDefinition.option.mapStyle],
            {}
        );
        this.myMap = L.map(mapId, {
            center: [
                mapCenterMapping[cfg.chartDefinition.option.mapCenter][1],
                mapCenterMapping[cfg.chartDefinition.option.mapCenter][0]
            ],
            zoom:
                cfg.chartDefinition.option.minZoom +
                cfg.chartDefinition.option.zoomLevel,
            minZoom: cfg.chartDefinition.option.minZoom,
            maxZoom: cfg.chartDefinition.option.maxZoom,
            layers: [this.currentTileLayer],
            zoomControl: false,
            attributionControl: false
        });

        return (this.rootDom = this.htmlObj);
    }

    _renderRoute() {
        if (Util.getObjtype(this.cfg.chartDefinition.data) === "Object") {
            return false;
        }
        this.pathGroup = L.layerGroup();
        this.startGroup = L.layerGroup();

        try {
            for (var results of this.cfg.chartDefinition.data) {
                //准备点
                var pointList = JSON.parse(results[1]).map(function(p) {
                    return [p[1], p[0]];
                });
                //折线
                var polyline = new L.Polyline(pointList, {
                    color: this.cfg.chartDefinition.option.routeColor,
                    weight: this.cfg.chartDefinition.option.routeSize,
                    opacity: 0.5,
                    smoothFactor: 1
                });
                var popup = new L.popup({ closeButton: false })
                    .setLatLng(pointList[pointList.length - 1])
                    .setContent(
                        "<p>" +
                            results[0] +
                            ", 点数量" +
                            pointList.length +
                            "</p>"
                    );
                polyline.bindPopup(popup);
                polyline.on("mouseover", function(e) {
                    this.openPopup();
                });
                //起始点
                let startIcon = L.divIcon({
                    html:
                        "<span class='fa fa-dot-circle-o myIcon' style='color: #68BC00;font-size:" +
                        this.cfg.chartDefinition.option.routeSize +
                        "px'></span>"
                });
                var startMarker = L.marker(pointList[0], { icon: startIcon });
                let endIcon = L.divIcon({
                    html:
                        "<span class='fa fa-dot-circle-o myIcon' style='color: #D33115;font-size:" +
                        this.cfg.chartDefinition.option.routeSize +
                        "px'></span>"
                });
                var endMarker = L.marker(pointList[pointList.length - 1], {
                    icon: endIcon
                });
                //画箭头
                if (this.cfg.chartDefinition.option.arrowShow) {
                    polyline.setText("  ►   ", {
                        repeat: true,
                        offset:
                            (this.cfg.chartDefinition.option.routeSize * 2) / 5,
                        attributes: {
                            fill: "#fff",
                            "font-weight": "bolder",
                            "font-size":
                                this.cfg.chartDefinition.option.routeSize / 3 +
                                this.cfg.chartDefinition.option.routeSize +
                                "px"
                        }
                    });
                }
                //画关键点
                if (this.cfg.chartDefinition.option.pointShow) {
                    //this.showKeyPoint();
                }
                //画动态点
                this._renderMovingMarker();

                this.pathGroup.addLayer(polyline);
                this.startGroup.addLayer(startMarker);
                this.startGroup.addLayer(endMarker);
            }
        } catch (error) {
            Util.popTips("ERROR", "数据格式与预期不符");
        }
        this.pathGroup.addTo(this.myMap);
        this.startGroup.addTo(this.myMap);
    }

    _removeRoute() {
        if (Util.getObjtype(this.cfg.chartDefinition.data) === "Object") {
            return false;
        }
        if (this.pathGroup) this.pathGroup.clearLayers();
        if (this.startGroup) this.startGroup.clearLayers();
        if (this.keyPointGroup) this.keyPointGroup.clearLayers();
        if (this.movingMarkerGroup) this.movingMarkerGroup.clearLayers();
    }

    _showKeyPoint() {
        var myIcon = L.divIcon({
            html:
                "<span class='fa fa-dot-circle-o myIcon' style='color: " +
                this.cfg.chartDefinition.option.routeColor +
                ";font-size:" +
                this.cfg.chartDefinition.option.routeSize +
                "px'></span>"
        });
        this.keyPointGroup = L.layerGroup();
        for (var results of this.cfg.chartDefinition.data) {
            var pointList = JSON.parse(results[1]).map(function(p) {
                return [p[1], p[0]];
            });
            for (var i = 1; i < pointList.length - 1; i++) {
                this.keyPointGroup.addLayer(
                    L.marker(pointList[i], { icon: myIcon })
                );
            }
            this.keyPointGroup.addTo(this.myMap);
        }
    }

    _renderMovingMarker() {
        if (this.movingMarkerGroup) {
            this.movingMarkerGroup.clearLayers();
        }
        this.movingMarkerGroup = L.layerGroup();
        var myIcon = new L.divIcon({
            html:
                "<div class='markerButton'><span class= '" +
                this.cfg.chartDefinition.option.arrowStyle +
                " markerTop'></span></div>"
        });
        for (var results of this.cfg.chartDefinition.data) {
            //准备点
            var timeList = [];
            var time = 10000 / JSON.parse(results[1]).length;
            var pointList = JSON.parse(results[1]).map(function(p) {
                timeList.push(time);
                return [p[1], p[0]];
            });
            var movingMarker = L.Marker.movingMarker(pointList, timeList, {
                icon: myIcon,
                autostart: false
            });
            this.movingMarkerGroup.addLayer(movingMarker);
        }
        this.movingMarkerGroup.addTo(this.myMap);

        if (this.cfg.chartDefinition.option.arrowAnimation === "single") {
            for (var movingMarker of this.movingMarkerGroup.getLayers()) {
                movingMarker.start();
                movingMarker.on("end", function() {
                    this.stop();
                });
                movingMarker.getElement().style.setProperty("display", "block");
            }
        } else if (this.cfg.chartDefinition.option.arrowAnimation === "multi") {
            for (var movingMarker of this.movingMarkerGroup.getLayers()) {
                movingMarker.start();
                movingMarker.on("end", function() {
                    this.start();
                });
                movingMarker.getElement().style.setProperty("display", "block");
            }
        } else {
            for (var movingMarker of this.movingMarkerGroup.getLayers()) {
                movingMarker.stop();
                movingMarker.getElement().style.setProperty("display", "none");
            }
        }
    }

    _refresh(value) {
        switch (Object.keys(value)[0]) {
            case "routeColor":
                this.cfg.chartDefinition.option.routeColor =
                    value["routeColor"];
                for (var path of this.pathGroup.getLayers()) {
                    path.setStyle({
                        color: value["routeColor"]
                    });
                }
                break;
            case "routeSize":
                this.cfg.chartDefinition.option.routeSize =
                    value["routeSize"] || 1;
                for (var path of this.pathGroup.getLayers()) {
                    path.setStyle({
                        weight: value["routeSize"]
                    });
                }
                break;
            case "arrowShow":
                this.cfg.chartDefinition.option.arrowShow = value["arrowShow"];
                if (value["arrowShow"]) {
                    for (var path of this.pathGroup.getLayers()) {
                        path.setText("  ►  ", {
                            repeat: true,
                            attributes: { fill: "#fff" }
                        });
                    }
                } else {
                    for (var path of this.pathGroup.getLayers()) {
                        path._textNode.remove();
                    }
                }
                break;
            case "pointShow":
                this.cfg.chartDefinition.option.pointShow = value["pointShow"];
                if (value["pointShow"]) {
                    //this.showKeyPoint();
                } else {
                    //this.keyPointGroup.clearLayers();
                }
                break;
            case "arrowAnimation":
                this.cfg.chartDefinition.option.arrowAnimation =
                    value["arrowAnimation"];
                this._renderMovingMarker();
                break;
            case "arrowStyle":
                this.cfg.chartDefinition.option.arrowStyle =
                    value["arrowStyle"];
                var myIcon = new L.divIcon({
                    html:
                        "<div class='markerButton'><span class='" +
                        this.cfg.chartDefinition.option.arrowStyle +
                        " markerTop'></span></div>"
                });
                for (var movingMarker of this.movingMarkerGroup.getLayers()) {
                    movingMarker.setIcon(myIcon);
                }
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
