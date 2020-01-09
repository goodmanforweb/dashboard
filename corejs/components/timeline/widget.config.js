import panelcfg from "./js/panelWidgetsConfig";

export default {
    //组件基本信息
    base: {
        type: "timeline",
        name: "动态数轴"
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
        }
    },

    cfg: theme => ({
        type: "timeline",
        name: "动态数轴",
        priority: 5,
        parameter: "",
        executeAtStart: true,
        listeners: ["a1"],
        layout: {
            i: "",
            x: 0,
            y: 0,
            w: 8,
            h: 3,
            minW: 1,
            minH: 1,
            maxW: 12,
            moved: true
        },
        chartDefinition: {
            queryid: "",
            queryname: "",
            freshQuery: false,
            // defaultOption: defaultOption,//图表默认配置
            option: {
                orientation: "horizontal",
                example: "bottomAndleft",
                axisWidth: 5,
                solidType: "emptyCircle",
                solidWidth: 11,
                blockWidth: 16,
                autoPlay: false,
                rewind: "false",
                playSleep: 2000,
                playBtnPos: "leftAndbottom",
                playbtnsize: 15,
                value: "",

                //主题部分
                color: theme.chart.color,
                backgroundColor: theme.chart.backgroundColor,
                borderRadius: theme.chart.borderRadius,
                lineColor: theme.chart.lineColor,
                textColor: theme.chart.textColor,
                titleBackgroundColor: theme.chart.titleBackgroundColor,

                clickEvent: "null",
                saveToParams: "",
                toolboxShow: false,
                clickParmas: {
                    category: { name: "", id: "" },
                    series: { name: "", id: "" },
                    value: { name: "", id: "" }
                },
                sqlParmas: []
            },

            _option: {},
            query: {
                type: "sql",
                param: {},
                statement: "",
                query: "",
                jndi: ""
            },
            data: {},
            inject: {
                // widgetWillCreated: "function() {console.log('run', this)}",
                postUpdate: "function(){console.log('postUpdate')}"
            }
        }
    })
};
