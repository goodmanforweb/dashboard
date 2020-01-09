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
                name: "sort",
                widget: "XRadio",
                disable: false,
                visible: true,
                belongTo: "chart",
                option: [
                    { name: "正向", value: "descending" },
                    { name: "反向", value: "ascending" }
                ],
                defaultValue: "descending"
            }
        ]
    },
    assist: {
        name: "辅助项",
        value: [
            {
                type: "bolean",
                cname: "标签",
                name: "showLabel",
                widget: "XRadio",
                disable: false,
                visible: true,
                belongTo: "assist",
                option: [
                    { name: "左", value: "left" },
                    { name: "中", value: "inside" },
                    { name: "右", value: "right" },
                    { name: "关", value: "0" }
                ],
                defaultValue: "descending"
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
                defaultValue: null
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
}) /*{
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
                cname: "色彩",
                name: "color",
                widget: "XColorPicker",
                disable: false,
                visible: true,
                belongTo: "draw",
                option: [{ type: "listColor" }],
                // option: redux_data.globalParam.map(param => ({name: param.name, value: param.name})),
                defaultValue: "rgb(16, 142, 233)"
            }
        ]
    },
    funnelPng: {
        name: "漏斗图",
        value: [
            {
                type: "string",
                cname: "方向",
                name: "sort",
                widget: "XRadio",
                disable: false,
                visible: true,
                belongTo: "funnelPng",
                option: [
                    { name: "正向", value: "descending" },
                    { name: "反向", value: "ascending" }
                ],
                defaultValue: "descending"
            },
            {
                type: "bolean",
                cname: "标签",
                name: "showLabel",
                widget: "XRadio",
                disable: false,
                visible: true,
                belongTo: "funnelPng",
                option: [
                    { name: "左", value: "left" },
                    { name: "中", value: "inside" },
                    { name: "右", value: "right" },
                    { name: "关", value: "0" }
                ],
                defaultValue: "descending"
            },
            {
                type: "bolean",
                cname: "显示数据",
                name: "showData",
                widget: "XSwitch",
                disable: false,
                visible: true,
                belongTo: "funnelPng",
                option: null,
                defaultValue: null
            },
            {
                type: "object",
                cname: null,
                name: "warns",
                widget: "XWarns",
                disable: false,
                visible: true,
                belongTo: "funnelPng",
                option: [""],
                defaultValue: {}
            }
        ]
    }
}*/;
