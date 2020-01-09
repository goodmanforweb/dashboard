import panelcfg from "./js/panelWidgetsConfig";

export default {
    //组件基本信息
    base: {
        type: "chartGauge",
        name: "油量图"
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
            name: "事件",
            handleCfg: {
                clickEvent: "null"
            }
        }
    },

    cfg: theme => ({
        type: "chartGauge",
        name: "油量图",
        priority: 5,
        parameter: "",
        chartBtns: true,
        bigandsmall: true,
        executeAtStart: true,
        listeners: ["a1"],
        layout: {
            i: "",
            x: 0,
            y: 0,
            w: 13,
            h: 10,
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
                title: "油量图",
                min: 0,
                max: 360,

                gaugeColorSeries: {
                    switch: true,
                    optionArr: [
                        [0, 120, theme.chart.color[0]],
                        [120, 180, theme.chart.color[1]],
                        [180, 360, theme.chart.color[2]]
                    ],
                    selectedRowKeys: [],
                    startColor: theme.chart.color[0],
                    endColor: theme.chart.color[1],
                    circleMin: 0,
                    circleMax: 360
                },
                color: theme.chart.color,
                gaugeWidth: 10,
                sliderNumber: 10,
                smallSplitNumber: 5,
                titlePosition: "left",
                isExportData: false,
                example: "top",
                orientation: "vertical",
                showData: true,
                gridLine: true,
                baseLine: "auto",
                gaugeAngle: "360",
                gaugeInOut: "inside",
                axisLabel: false,
                xaxis: true,
                yaxis: true,
                detail: true,
                detailName: "close",
                showRadio: false,
                xaxisTick: false,
                yaxisTick: false,
                axisTitle: "",
                stack: false,
                barBg: false,
                itemStyle: 0,
                markLine: "null",
                //主题部分

                opacity: 80,
                backgroundColor: theme.chart.backgroundColor,
                borderRadius: theme.chart.borderRadius,
                lineColor: theme.chart.lineColor,
                textColor: theme.chart.textColor,
                titleBackgroundColor: theme.chart.titleBackgroundColor,

                clickEvent: "null",
                saveToParams: "",
                toolboxShow: false,
                clickParmas: {
                    value: { name: "", id: "" }
                },
                sqlParmas: []
            },

            _option: {},
            query: {
                type: "sql",
                param: {},
                statement: "",
                query:
                    /*`SELECT '食品经营' 食品大类, 1000012 金额,'349212,13423,129843,22541' 数据 UNION ALL
                SELECT '餐饮服务',1000012,'349212,13423,129843,22541'  UNION ALL
                SELECT '食品流通',2000012,'349212,13423,129843,22541' UNION ALL
                SELECT '食品生产',3000012,'349212,13423,129843,22541'`*/ "",
                jndi: /*'dw_market'*/ ""
            },
            data: {},
            inject: {
                // widgetWillCreated: "function() {console.log('run', this)}",
                postUpdate: "function(){console.log('postUpdate')}"
            }
        }
    })
};
