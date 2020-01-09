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
                cname: "词云形状",
                name: "worldType",
                widget: "XRadio",
                disable: false,
                visible: true,
                belongTo: "chart",
                option: [
                    { name: "圆型", value: "circle" },
                    { name: "菱形", value: "diamond" },
                    { name: "三角形", value: "triangle" },
                    { name: "五角星", value: "star" }
                ],
                defaultValue: "square"
            },
            {
                type: "number",
                cname: "文字大小",
                name: "fontSize",
                widget: "XSlider",
                disable: false,
                visible: true,
                belongTo: "chart",
                option: [{ maxRange: 100, range: true, minRange: 12 }],
                defaultValue: 0
            },
            {
                type: "number",
                cname: "字符间距",
                name: "fontSpace",
                widget: "XSlider",
                disable: false,
                visible: true,
                belongTo: "chart",
                option: [{ maxRange: 100 }],
                defaultValue: 0
            },
            {
                type: "string",
                cname: "文字角度",
                name: "fontAngle",
                widget: "XRadio",
                disable: false,
                visible: true,
                belongTo: "chart",
                option: [
                    { name: "自动", value: "auto" },
                    { name: "水平", value: 0 }
                ],
                defaultValue: 0
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
    piePng: {
        name: "绘制",
        value: [
            {
                type: "string",
                cname: "色彩",
                name: "color",
                widget: "XColorPicker",
                disable: false,
                visible: true,
                belongTo: "piePng",
                option: [{ type: "listColor" }],
                // option: redux_data.globalParam.map(param => ({name: param.name, value: param.name})),
                defaultValue: "rgb(16, 142, 233)"
            },
            {
                type: "string",
                cname: "词云形状",
                name: "worldType",
                widget: "XRadio",
                disable: false,
                visible: true,
                belongTo: "piePng",
                option: [
                    { name: "圆形", value: "circle" },
                    { name: "菱形", value: "diamond" },
                    { name: "三角形", value: "triangle" },
                    { name: "五角星", value: "star" }
                ],
                defaultValue: "square"
            },
            {
                type: "number",
                cname: "文字大小",
                name: "fontSize",
                widget: "XSlider",
                disable: false,
                visible: true,
                belongTo: "map",
                option: [{ maxRange: 100, range: true, minRange: 12 }],
                defaultValue: 0
            },
            {
                type: "number",
                cname: "字符间距",
                name: "fontSpace",
                widget: "XSlider",
                disable: false,
                visible: true,
                belongTo: "map",
                option: [{ maxRange: 100 }],
                defaultValue: 0
            },
            {
                type: "string",
                cname: "文字角度",
                name: "fontAngle",
                widget: "XRadio",
                disable: false,
                visible: true,
                belongTo: "linePng",
                option: [
                    { name: "自动", value: "auto" },
                    { name: "水平", value: 0 }
                ],
                defaultValue: 0
            }
        ]
    }
}*/;
