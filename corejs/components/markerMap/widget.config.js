import panelcfg from "./js/panelWidgetsConfig";
export default {
    //组件基本信息
    base: {
        type: "markerMap",
        name: "标记地图"
    },
    //面板配置
    panel: {
        dataSource: {
            name: "数据源",
            typeList: ["sql", "service", "olap"]
        },
        style: {
            name: "样式",
            //提供两种面板生成方式： 配置式（优先）、组件式。
            //面板组件配置
            panelcfg,
            //面板组件
            panelcmp: null
        },
        handle: {
            name: "事件"
        }
    },
    //组件配置
    cfg: () => ({
        type: "markerMap",
        name: "标记地图",
        priority: 5,
        parameter: "",
        executeAtStart: true,
        bigandsmall: true,
        listeners: [],
        layout: {
            i: "",
            x: 0,
            y: 0,
            w: 12,
            h: 10,
            minW: 1,
            minH: 1,
            maxW: 12,
            moved: true
        },
        chartDefinition: {
            queryid: "",
            queryname: "",
            query: {
                type: "sql",
                param: {},
                statement: "",
                query: `select * from markerdata`,
                jndi: "map"
            },
            data: [["北京市", "116.405285,39.904989", 10, "province"]],
            option: {
                markerColor: "rgb(16, 142, 233)",
                markerImg: "fa fa-map-marker",
                markerSize: 14,
                mapCenter: "全国",
                zoomLevel: 0,
                mapStyle: "Normal",
                minZoom: 3,
                maxZoom: 18
            },
            inject: {
                // widgetWillCreated: "function() {console.log('run', this)}",
                postUpdate: "function(){console.log('postUpdate')}"
            }
        }
    })
};
