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
                type: "number",
                cname: "间隔",
                name: "space",
                widget: "XSlider",
                disable: false,
                visible: true,
                belongTo: "chart",
                option: [{ maxRange: 50, minRange: 1, tipFormatter: "%" }],
                defaultValue: 0
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
                widget: "XSwitch",
                disable: false,
                visible: true,
                belongTo: "assist",
                option: null,
                defaultValue: true
            },
            {
                type: "string",
                cname: "标签文字",
                name: "formatter",
                widget: "XRadio",
                disable: false,
                visible: true,
                belongTo: "assist",
                option: [
                    { name: "类别+指标", value: "0" },
                    { name: "类别+占比", value: "1" },
                    { name: "指标+占比", value: "2" },
                    { name: "所有信息", value: "3" }
                ],
                defaultValue: "0"
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
                name: "warn",
                widget: "XWarn",
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
    piePng: {
        name: "嵌套饼图",
        value: [
            {
                type: "bolean",
                cname: "标签",
                name: "showLabel",
                widget: "XSwitch",
                disable: false,
                visible: true,
                belongTo: "piePng",
                option: null,
                defaultValue: true
            },
            {
                type: "number",
                cname: "间隔",
                name: "space",
                widget: "XSlider",
                disable: false,
                visible: true,
                belongTo: "piePng",
                option: [{ maxRange: 50, minRange: 1, tipFormatter: "%" }],
                defaultValue: 0
            },
            {
                type: "string",
                cname: "标签文字",
                name: "formatter",
                widget: "XRadio",
                disable: false,
                visible: true,
                belongTo: "piePng",
                option: [
                    { name: "类别+指标", value: "0" },
                    { name: "类别+占比", value: "1" },
                    { name: "指标+占比", value: "2" },
                    { name: "所有信息", value: "3" }
                ],
                defaultValue: "0"
            },
            {
                type: "object",
                cname: null,
                name: "warn",
                widget: "XWarn",
                disable: false,
                visible: true,
                belongTo: "piePng",
                option: [""],
                defaultValue: {}
            }
        ]
    }
}*/;
