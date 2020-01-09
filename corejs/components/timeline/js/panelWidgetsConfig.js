export default dataForPanel => ({
    draw: {
        name: "样式",
        value: [
            {
                type: "string",
                cname: "色彩",
                name: "color",
                widget: "XColorPicker",
                disable: false,
                visible: true,
                belongTo: "draw",
                option: [
                    { type: "listColor", limitColors: 3, disableDelete: true }
                ],
                defaultValue: "rgb(16, 142, 233)"
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
                type: "string",
                cname: "文字位置",
                name: "example",
                widget: "XRadio",
                disable: false,
                visible: true,
                belongTo: "draw",
                option: [
                    { name: "下/左", value: "bottomAndleft" },
                    { name: "上/右", value: "topAndright" }
                ],
                defaultValue: "top"
            },
            {
                type: "number",
                cname: "数轴粗细",
                name: "axisWidth",
                widget: "XSlider",
                disable: false,
                visible: true,
                belongTo: "draw",
                option: [{ maxRange: 20, minRange: 0 }],
                defaultValue: 0
            },
            {
                type: "string",
                cname: "节点形状",
                name: "solidType",
                widget: "XRadio",
                disable: false,
                visible: true,
                belongTo: "draw",
                option: [
                    { name: "圆圈", value: "emptyCircle" },
                    { name: "圆点", value: "circle" },
                    { name: "方形", value: "rect" },
                    { name: "圆形方框", value: "roundRect" },
                    { name: "三角形", value: "triangle" },
                    { name: "菱形", value: "diamond" }
                ],
                defaultValue: "square"
            },
            {
                type: "number",
                cname: "节点尺寸",
                name: "solidWidth",
                widget: "XSlider",
                disable: false,
                visible: true,
                belongTo: "draw",
                option: [{ maxRange: 20, minRange: 0 }],
                defaultValue: 0
            },
            {
                type: "number",
                cname: "滑块尺寸",
                name: "blockWidth",
                widget: "XSlider",
                disable: false,
                visible: true,
                belongTo: "draw",
                option: [{ maxRange: 20, minRange: 0 }],
                defaultValue: 0
            }
        ]
    },
    axis: {
        name: "控制",
        value: [
            {
                type: "bolean",
                cname: "自动播放",
                name: "autoPlay",
                widget: "XSwitch",
                disable: false,
                visible: true,
                belongTo: "axis",
                option: null,
                defaultValue: true
            },
            {
                type: "string",
                cname: "播放顺序",
                name: "rewind",
                widget: "XRadio",
                disable: false,
                visible: true,
                belongTo: "axis",
                option: [
                    { name: "正向", value: "false" },
                    { name: "反向", value: "true" }
                ],
                defaultValue: "square"
            },
            {
                type: "number",
                cname: "播放间隔",
                name: "playSleep",
                widget: "XSlider",
                disable: false,
                visible: true,
                belongTo: "axis",
                option: [{ maxRange: 10000, minRange: 500 }],
                defaultValue: 0
            },
            {
                type: "string",
                cname: "播放按钮位置",
                name: "playBtnPos",
                widget: "XRadio",
                disable: false,
                visible: true,
                belongTo: "axis",
                option: [
                    { name: "左/下", value: "leftAndbottom" },
                    { name: "右/上", value: "rightAndtop" },
                    { name: "无", value: "null" }
                ],
                defaultValue: "left"
            },
            {
                type: "number",
                cname: "控制按钮尺寸",
                name: "playbtnsize",
                widget: "XSlider",
                disable: false,
                visible: true,
                belongTo: "axis",
                option: [{ maxRange: 30, minRange: 0 }],
                defaultValue: 0
            },
            {
                type: "string",
                cname: "保存选择到",
                name: "value",
                widget: "XSelect",
                disable: false,
                visible: true,
                belongTo: "axis",
                option: dataForPanel.map(param => ({
                    name: param.name,
                    value: param.id
                })),
                // option: redux_data.globalParam.map(param => ({name: param.name, value: param.name})),
                defaultValue: ""
            }
        ]
    }
});
