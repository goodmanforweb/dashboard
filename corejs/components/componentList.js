/**
 * 配置文件 添加UI组件
 */
export default  [
    {
        id:'100',
        name:'图表文件',
        icon: "layout-export",
        children: [
            {
                cname: "多维分析",
                type: "olap",
                icon: "layout-olap"
            },
            {
                cname: "视频",
                type: "video",
                icon: "layout-video"
            }
        ]
    },
    {
        id:'101',
        name:'图表',
        icon: "layout-chart",
        children:[
            {
                cname: "表格",
                type: "table",
                icon: "layout-table"
            },
            {
                cname: "饼图",
                type: "chartPie",
                icon: "layout-pie"
            },
            {
                cname: "折线图",
                type: "chartLine",
                icon: "layout-line"
            },
            {
                cname: "柱状图",
                type: "chartBar",
                icon: "layout-bar"
            },
            {
                cname: "折柱混合图",
                type: "chartMix",
                icon: "layout-linebar"
            },
            {
                cname: "河流图",
                type: "themeriver",
                icon: "layout-themeriver"
            },
            {
                cname: "桑基图",
                type: "sankey",
                icon: "layout-sankey"
            },
            {
                cname: "词云图",
                type: "chartWordCloud",
                icon: "layout-wordCloud"
            },
            {
                cname: "南丁格尔玫瑰图",
                type: "chartRose",
                icon: "layout-rose"
            },
            {
                cname: "热力图",
                type: "heatchart",
                icon: "layout-heatchart"
            },
            {
                cname: "关系关联图",
                type: "graph",
                icon: "layout-graph"
            },

            {
                cname: "嵌套环形图",
                type: "chartNestpie",
                icon: "layout-nestpie"
            },
            {
                cname: "指标点阵图",
                type: "chartDot",
                icon: "layout-chartdot"
            },
            {
                cname: "漏斗图",
                type: "chartFunnel",
                icon: "layout-chartFunnel"
            },
            {
                cname: "油量图",
                type: "chartGauge",
                icon: "layout-chartgauge"
            },
            {
                cname: "热力图地图",
                type: "heatMap",
                icon: "layout-heat"
            },
            {
                cname: "标记地图",
                type: "markerMap",
                icon: "layout-marker"
            },
            {
                cname: "路线地图",
                type: "routeMap",
                icon: "layout-route"
            },
            {
                cname: "迁徙地图",
                type: "migrateMap",
                icon: "layout-migrate"
            },
            {
                cname: "自定义",
                type: "custom",
                icon: "layout-custom"
            }
        ]
    },
    {
        id:'102',
        name:'组件',
        icon: "layout-layout",
        children:[
            {
                cname: "下拉选择器",
                type: "select",
                icon: "layout-select"
            },
            {
                cname: "复选按钮",
                type: "checkbox",
                icon: "layout-checkbox"
            },
            {
                cname: "单选按钮",
                type: "radio",
                icon: "layout-radio"
            },
            {
                cname: "多选下拉",
                type: "multiselect",
                icon: "layout-multiselect"
            },
            {
                cname: "日期选择器",
                type: "date",
                icon: "layout-date"
            },
            {
                cname: "图片",
                type: "pictcomponent",
                icon: "layout-pictcomponent"
            },
            {
                cname: "文本",
                type: "text",
                icon: "layout-text"
            },
            {
                cname: "容器",
                type: "container",
                icon: "layout-container"
            },
            {
                cname: "动态数轴",
                type: "timeline",
                icon: "layout-timeline"
            }
        ]
    }
];

