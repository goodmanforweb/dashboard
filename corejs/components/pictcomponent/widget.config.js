import panelcfg from "./js/panelWidgetsConfig";
const imgComponent = require("resource/images/imgz.png");
export default {
    //组件基本信息
    base: {
        type: "pictcomponent",
        name: "图片"
    },
    //面板配置
    panel: {
        /* dataSource: {
            name: "数据源",
            typeList: ["sql", "service", "olap"]
        }, */
        style: {
            name: "样式",
            //提供两种面板生成方式： 配置式（优先）、组件式。
            //面板组件配置
            panelcfg,
            //面板组件
            panelcmp: null
        }
        /* handle: {
            name: "事件"
        } */
    },
    //组件配置
    cfg: theme => ({
        type: "pictcomponent",
        name: "图片",
        priority: 5,
        parameter: "",
        executeAtStart: true,
        listeners: [],
        layout: {
            i: "",
            x: 0,
            y: 0,
            w: 3,
            h: 8,
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
                query: ``,
                jndi: ""
            },
            data: [],
            option: {
                fileSrc: imgComponent,
                imgPosition: "center",
                backgroundColor: theme.chart.backgroundColor
            },
            inject: {}
        }
    })
};
