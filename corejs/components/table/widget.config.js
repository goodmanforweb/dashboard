import panelcfg from "./js/panelWidgetsConfig";
export default {
    //组件基本信息
    base: {
        type: "table",
        name: "表格"
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
    //组件配置
    cfg: theme => {
        let bgColor = theme.chart.backgroundColor;
        let fontColor = theme.chart.textColor[0];
        let borderColor = theme.chart.lineColor[0];
        return {
            type: "table",
            name: "表格",
            priority: 5,
            parameter: "",
            bigandsmall: true,
            executeAtStart: true,
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
                    query: "",
                    jndi: ""
                },
                data: {
                    queryInfo: { totalRows: "20" },
                    resultset: [
                        ["食品经营1", -1000012, "349212,13423,129843,22541"],
                        ["餐饮服务2", 1000012, "349212,13423,129843,22541"],
                        ["食品流通3", -2000012, "349212,13423,129843,22541"],
                        ["食品生产4", 0, "349212,13423,129843,22541"],
                        ["食品经营5", 1000012, "349212,13423,129843,22541"],
                        ["餐饮服务6", 1000012, "349212,13423,129843,22541"],
                        ["食品流通7", 2000012, "349212,13423,129843,22541"],
                        ["食品生产8", 3000012, "349212,13423,129843,22541"],
                        ["食品经营9", 1000012, "349212,13423,129843,22541"],
                        ["餐饮服务10", 1000012, "349212,13423,129843,22541"],
                        ["食品流通11", 2000012, "349212,13423,129843,22541"],
                        ["食品生产12", 3000012, "349212,13423,129843,22541"],
                        ["食品经营13", 1000012, "349212,13423,129843,22541"],
                        ["餐饮服务14", 1000012, "349212,13423,129843,22541"],
                        ["食品流通15", 2000012, "349212,13423,129843,22541"],
                        ["食品生产16", 3000012, "349212,13423,129843,22541"],
                        ["食品经营17", 1000012, "349212,13423,129843,22541"],
                        ["餐饮服务18", 1000012, "349212,13423,129843,22541"],
                        ["食品流通19", 2000012, "349212,13423,129843,22541"],
                        ["食品生产20", 3000012, "349212,13423,129843,22541"]
                    ],
                    metadata: [
                        { colIndex: 0, colType: "String", colName: "食品大类" },
                        { colIndex: 1, colType: "Numeric", colName: "金额" },
                        { colIndex: 2, colType: "String", colName: "数据" }
                    ]
                },
                option: {
                    //表格
                    tableBgColor: bgColor,
                    tableFontColor: fontColor,
                    tableBorderColor: borderColor,
                    tableSplitColor: borderColor,

                    //标题
                    caption: "表格", //标题
                    captionTextAlgin: "left", //标题对齐方式
                    exportable: false, //导出数据按钮

                    //表头
                    theadFontColor: fontColor,
                    theadBgColor: "transparent",
                    theadFontSize: 14,
                    theadFontWeight: true,
                    theadGroup: {
                        open: false,
                        config: []
                    },

                    //数据
                    dataFontColor: fontColor,
                    oddRowBgColor: "transparent",
                    evenRowBgColor: "transparent",
                    dataFontSize: 14,
                    dataSortable: false,

                    //分页
                    pageable: true,
                    pageRows: 10,
                    pageInfo: true,

                    //统计
                    calcable: false,
                    calcMode: "",
                    calcFontColor: fontColor,
                    calcBgColor: "transparent",
                    calcFontSize: 14,
                    calcFontWeight: true,

                    //预警
                    warning: {
                        open: false,
                        config: []
                    }
                },
                inject: {
                    // widgetWillCreated: "function() {console.log('run', this)}",
                    postUpdate: "function(){console.log('postUpdate')}"
                }
            }
        };
    }
};
