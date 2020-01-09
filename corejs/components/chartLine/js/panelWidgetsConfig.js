export default dataForPanel => ({
    title: {
        name: "标题",
        value: [
            {
                type: "string",
                name: "title",
                cname: "标题",
                widget: "XInput",
                disable: false,
                visible: true,
                belongTo: "title",
                option: null,
                defaultValue: null
            },
            {
                type: "string",
                cname: "标题位置",
                name: "titlePosition",
                widget: "XRadio",
                disable: false,
                visible: true,
                belongTo: "title",
                option: [
                    { name: "左", value: "left" },
                    { name: "中", value: "center" },
                    { name: "右", value: "right" }
                ],
                defaultValue: "left"
            }
        ]
    },
    chart: {
        name: "图表",
        value: [
            {
                type: "string",
                cname: "色彩",
                name: "color",
                widget: "XColorPicker",
                disable: false,
                visible: true,
                belongTo: "chart",
                option: [{ type: "listColor" }],
                defaultValue: "rgb(16, 142, 233)"
            },
            {
                type: "string",
                cname: "图例",
                name: "example",
                widget: "XRadio",
                disable: false,
                visible: true,
                belongTo: "chart",
                option: [
                    { name: "上", value: "top" },
                    { name: "下", value: "bottom" },
                    { name: "左", value: "left" },
                    { name: "右", value: "right" },
                    { name: "无", value: "null" }
                ],
                defaultValue: "top"
            },
            {
                type: "string",
                cname: "方向",
                name: "orientation",
                widget: "XRadio",
                disable: false,
                visible: true,
                belongTo: "chart",
                option: [
                    { name: "纵向", value: "vertical" },
                    { name: "横向", value: "horizontal" }
                ],
                defaultValue: "vertical"
            },
            {
                type: "string",
                cname: "折线风格",
                name: "lineStyle",
                widget: "XRadio",
                disable: false,
                visible: true,
                belongTo: "chart",
                option: [
                    { name: "折线", value: "broken" },
                    { name: "平滑", value: "smooth" }
                ],
                defaultValue: "smooth"
            },
            {
                type: "bolean",
                cname: "显示圆点",
                name: "showDot",
                widget: "XSwitch",
                disable: false,
                visible: true,
                belongTo: "chart",
                option: null,
                defaultValue: true
            },
            {
                type: "bolean",
                cname: "显示面积",
                name: "showArea",
                widget: "XSwitch",
                disable: false,
                visible: true,
                belongTo: "chart",
                option: null,
                defaultValue: true
            },
            {
                type: "bolean",
                cname: "堆叠显示",
                name: "linestack",
                widget: "XSwitch",
                disable: false,
                visible: true,
                belongTo: "chart",
                option: null,
                defaultValue: true
            },
            {
                type: "string",
                cname: "基准线",
                name: "baseLine",
                widget: "XRadioGroupInput",
                disable: false,
                visible: true,
                belongTo: "chart",
                option: [
                    { name: "无", value: "auto", defaultValue: "auto" },
                    {
                        name: "平均",
                        value: "average",
                        defaultValue: "average"
                    },
                    { name: "定值", name2: "", value: 0, defaultValue: 0 }
                ],
                defaultValue: "auto"
            },
            {
                type: "string",
                cname: "预测线",
                name: "predictionLine",
                widget: "XRadioGroupInput",
                disable: false,
                visible: true,
                belongTo: "chart",
                option: [
                    { name: "无", value: "auto", defaultValue: "auto" },
                    {
                        name: "预测最后",
                        name2: "个节点",
                        value: 0,
                        defaultValue: 0
                    }
                ],
                defaultValue: 0
            }
        ]
    },
    axis: {
        name: "坐标",
        value: [
            {
                type: "bolean",
                cname: "刻度",
                name: "axisTick",
                widget: "XSwitch",
                disable: false,
                visible: true,
                belongTo: "axis",
                option: null,
                defaultValue: true
            },
            {
                type: "string",
                name: "axisTitle",
                cname: "值轴标题",
                widget: "XInput",
                disable: false,
                visible: true,
                belongTo: "axis",
                option: null,
                defaultValue: null
            }
        ]
    },
    assist: {
        name: "辅助项",
        value: [
            {
                type: "string",
                cname: "数据缺失",
                name: "loseData",
                widget: "XRadio",
                disable: false,
                visible: true,
                belongTo: "assist",
                option: [
                    { name: "不处理", value: "null" },
                    { name: "连接", value: "connect" }
                ],
                defaultValue: "null"
            },
            {
                type: "bolean",
                cname: "显示数据",
                name: "showData",
                widget: "XSwitch",
                disable: false,
                visible: true,
                belongTo: "assist",
                option: null,
                defaultValue: false
            },
            {
                type: "bolean",
                cname: "网格线",
                name: "gridLine",
                widget: "XSwitch",
                disable: false,
                visible: true,
                belongTo: "assist",
                option: null,
                defaultValue: true
            },
            {
                type: "bolean",
                cname: "导出数据",
                name: "isExportData",
                widget: "XSwitch",
                disable: false,
                visible: true,
                belongTo: "assist",
                option: null,
                defaultValue: null
            }
        ]
    },
    warn: {
        name: "预警",
        value: [
            {
                type: "object",
                cname: null,
                name: "warns",
                widget: "XWarns",
                disable: false,
                visible: true,
                belongTo: "warn",
                option: [""],
                defaultValue: {}
            }
        ]
    }
});
/*{
        title: {
            name: "标题",
            value: [
                {
                    type: "string",
                    name: "title",
                    cname: "标题",
                    widget: "XInput",
                    disable: false,
                    visible: true,
                    belongTo: "title",
                    option: null,
                    defaultValue: null
                },
                {
                    type: "string",
                    cname: "标题位置",
                    name: "titlePosition",
                    widget: "XRadio",
                    disable: false,
                    visible: true,
                    belongTo: "title",
                    option: [
                        { name: "左", value: "left" },
                        { name: "中", value: "center" },
                        { name: "右", value: "right" }
                    ],
                    defaultValue: "left"
                },
                {
                    type: "bolean",
                    cname: "导出数据",
                    name: "isExportData",
                    widget: "XSwitch",
                    disable: false,
                    visible: true,
                    belongTo: "title",
                    option: null,
                    defaultValue: null
                }
            ]
        },
        draw: {
            name: "绘制",
            value: [
                {
                    type: "string",
                    cname: "图例",
                    name: "example",
                    widget: "XRadio",
                    disable: false,
                    visible: true,
                    belongTo: "draw",
                    option: [
                        { name: "上", value: "top" },
                        { name: "下", value: "bottom" },
                        { name: "左", value: "left" },
                        { name: "右", value: "right" },
                        { name: "无", value: "null" }
                    ],
                    defaultValue: "top"
                },
                {
                    type: "string",
                    cname: "方向",
                    name: "orientation",
                    widget: "XRadio",
                    disable: false,
                    visible: true,
                    belongTo: "draw",
                    option: [
                        { name: "纵向", value: "vertical" },
                        { name: "横向", value: "horizontal" }
                    ],
                    defaultValue: "vertical"
                },
                {
                    type: "bolean",
                    cname: "显示数据",
                    name: "showData",
                    widget: "XSwitch",
                    disable: false,
                    visible: true,
                    belongTo: "draw",
                    option: null,
                    // option: redux_data.globalParam.map(param => ({name: param.name, value: param.name})),
                    defaultValue: false
                },
                {
                    type: "bolean",
                    cname: "网格线",
                    name: "gridLine",
                    widget: "XSwitch",
                    disable: false,
                    visible: true,
                    belongTo: "draw",
                    option: null,
                    // option: redux_data.globalParam.map(param => ({name: param.name, value: param.name})),
                    defaultValue: true
                },
                {
                    type: "string",
                    cname: "色彩",
                    name: "color",
                    widget: "XColorPicker",
                    disable: false,
                    visible: true,
                    belongTo: "draw",
                    option: [{ type: "listColor" }],
                    // option: redux_data.globalParam.map(param => ({name: param.name, value: param.name})),
                    defaultValue: "rgb(16, 142, 233)"
                },
                {
                    type: "string",
                    cname: "基准线",
                    name: "baseLine",
                    widget: "XRadioGroupInput",
                    disable: false,
                    visible: true,
                    belongTo: "draw",
                    option: [
                        { name: "无", value: "auto", defaultValue: "auto" },
                        {
                            name: "平均",
                            value: "average",
                            defaultValue: "average"
                        },
                        { name: "定值", name2: "", value: 0, defaultValue: 0 }
                    ],
                    // option: redux_data.globalParam.map(param => ({name: param.name, value: param.name})),
                    defaultValue: "auto"
                }
            ]
        },
        axis: {
            name: "坐标",
            value: [
                {
                    type: "bolean",
                    cname: "刻度",
                    name: "axisTick",
                    widget: "XSwitch",
                    disable: false,
                    visible: true,
                    belongTo: "axis",
                    option: null,
                    defaultValue: true
                },
                {
                    type: "string",
                    name: "axisTitle",
                    cname: "值轴标题",
                    widget: "XInput",
                    disable: false,
                    visible: true,
                    belongTo: "axis",
                    option: null,
                    defaultValue: null
                }
            ]
        },
        linePng: {
            name: "折线图",
            value: [
                {
                    type: "bolean",
                    cname: "显示圆点",
                    name: "showDot",
                    widget: "XSwitch",
                    disable: false,
                    visible: true,
                    belongTo: "linePng",
                    option: null,
                    defaultValue: true
                },
                {
                    type: "bolean",
                    cname: "显示面积",
                    name: "showArea",
                    widget: "XSwitch",
                    disable: false,
                    visible: true,
                    belongTo: "linePng",
                    option: null,
                    defaultValue: true
                },
                {
                    type: "bolean",
                    cname: "堆叠显示",
                    name: "linestack",
                    widget: "XSwitch",
                    disable: false,
                    visible: true,
                    belongTo: "linePng",
                    option: null,
                    defaultValue: true
                },
                {
                    type: "string",
                    cname: "数据缺失",
                    name: "loseData",
                    widget: "XRadio",
                    disable: false,
                    visible: true,
                    belongTo: "linePng",
                    option: [
                        { name: "不处理", value: "null" },
                        { name: "连接", value: "connect" }
                    ],
                    defaultValue: "null"
                },
                {
                    type: "string",
                    cname: "折线风格",
                    name: "lineStyle",
                    widget: "XRadio",
                    disable: false,
                    visible: true,
                    belongTo: "linePng",
                    option: [
                        { name: "折线", value: "broken" },
                        { name: "平滑", value: "smooth" }
                    ],
                    defaultValue: "smooth"
                },
                {
                    type: "string",
                    cname: "预测线",
                    name: "predictionLine",
                    widget: "XRadioGroupInput",
                    disable: false,
                    visible: true,
                    belongTo: "linePng",
                    option: [
                        { name: "无", value: "auto", defaultValue: "auto" },
                        {
                            name: "预测最后",
                            name2: "个节点",
                            value: 0,
                            defaultValue: 0
                        }
                    ],
                    defaultValue: 0
                },
                {
                    type: "object",
                    cname: null,
                    name: "warns",
                    widget: "XWarns",
                    disable: false,
                    visible: true,
                    belongTo: "linePng",
                    option: [""],
                    defaultValue: {}
                }
            ]
        }
    }*/
