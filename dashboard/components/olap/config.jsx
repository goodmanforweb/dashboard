import panelcfg from "./panelWidgetsConfig";
export default {
    //组件基本信息
    base: {
        type: "olap",
        name: "多维"
    },
    //面板配置
    panel: {
        fileSource: {
            name: "文件来源"
        },
        style: {
            name: "样式",
            //提供两种面板生成方式： 配置式（优先）、组件式。
            //面板组件配置
            panelcfg,
            //面板组件
            panelcmp: null
        }
        // handle: {
        //   name: '事件'
        // }
    },
    //组件配置
    cfg: theme => ({
        type: "olap",
        name: "多维",
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
                type: "",
                param: {},
                statement: "",
                query: "",
                jndi: ""
            },
            data: [],
            option: {
                color: theme.chart.color,
                backgroundColor: theme.chart.backgroundColor,
                borderRadius: theme.chart.borderRadius,
                lineColor: theme.chart.lineColor,
                textColor: theme.chart.textColor,
                titleBackgroundColor: theme.chart.titleBackgroundColor,
                // file: "/public/保存多维分析20180224.saiku",
                file: "",
                mode: "chart",
                render: "bar",
                zoom: "true",
                formatter: "flattened",
                // title: '多维大法好',
                // titlePosition:'left',
                // isExportData:false,
                hideParent: false,
                olapParameters: []
            },
            inject: {
                // widgetWillCreated: "function() {console.log('run', this)}",
                postUpdate: "function(){console.log('postUpdate')}"
            }
        }
    })
};
