export default dataForPanel => ({
    title: {
        name: "标题",
        value: [
            {
                type: "string",
                cname: "标题内容",
                name: "caption",
                widget: "XInput",
                disable: false,
                visible: true,
                belongTo: "title",
                option: null
            },
            {
                type: "string",
                cname: "对齐方式",
                name: "captionTextAlgin",
                widget: "XRadio",
                disable: false,
                visible: true,
                belongTo: "title",
                option: [
                    { name: "左", value: "left" },
                    { name: "中", value: "center" },
                    { name: "右", value: "right" }
                ]
            },
            {
                type: "boolean",
                cname: "导出数据",
                name: "exportable",
                widget: "XSwitch",
                disable: false,
                visible: true,
                belongTo: "title",
                option: null
            }
        ]
    },
    thead: {
        name: "表头",
        value: [
            {
                type: "string",
                cname: "文本颜色",
                name: "theadFontColor",
                widget: "XColorPicker",
                disable: false,
                visible: true,
                option: [{ type: "normal" }]
            },
            {
                type: "string",
                cname: "背景颜色",
                name: "theadBgColor",
                widget: "XColorPicker",
                disable: false,
                visible: true,
                option: [{ type: "normal" }]
            },
            {
                type: "number",
                cname: "字号",
                name: "theadFontSize",
                widget: "XInput",
                disable: false,
                visible: true,
                option: null
            },
            {
                type: "boolean",
                cname: "文字加粗",
                name: "theadFontWeight",
                widget: "XSwitch",
                disable: false,
                visible: true,
                option: null
            },
            {
                type: "object",
                cname: "表格分组",
                name: "theadGroup",
                widget: "TheadGroupConfig",
                disable: false,
                visible: true,
                option: null
            }
        ]
    },
    data: {
        name: "数据",
        value: [
            {
                type: "string",
                cname: "文本颜色",
                name: "dataFontColor",
                widget: "XColorPicker",
                disable: false,
                visible: true,
                option: [{ type: "normal" }]
            },
            {
                type: "string",
                cname: "奇数行背景色",
                name: "oddRowBgColor",
                widget: "XColorPicker",
                disable: false,
                visible: true,
                option: [{ type: "normal" }]
            },
            {
                type: "string",
                cname: "偶数行背景色",
                name: "evenRowBgColor",
                widget: "XColorPicker",
                disable: false,
                visible: true,
                option: [{ type: "normal" }]
            },
            {
                type: "number",
                cname: "字号",
                name: "dataFontSize",
                widget: "XInput",
                disable: false,
                visible: true,
                option: null
            },
            {
                type: "boolean",
                cname: "排序",
                name: "dataSortable",
                widget: "XSwitch",
                disable: false,
                visible: true,
                option: null
            }
        ]
    },
    page: {
        name: "分页",
        value: [
            {
                type: "string",
                cname: "分页",
                name: "pageable",
                widget: "XSwitch",
                disable: false,
                visible: true,
                option: null
            },
            {
                type: "number",
                cname: "页长",
                name: "pageRows",
                widget: "XInput",
                disable: false,
                visible: true,
                option: null
            },
            {
                type: "boolean",
                cname: "统计信息",
                name: "pageInfo",
                widget: "XSwitch",
                disable: false,
                visible: true,
                option: null
            }
        ]
    },
    calc: {
        name: "总计",
        value: [
            {
                type: "boolean",
                cname: "总计",
                name: "calcable",
                widget: "XSwitch",
                disable: false,
                visible: true,
                option: null
            },
            {
                type: "string",
                cname: "汇总方法",
                name: "calcMode",
                widget: "XSelect",
                disable: false,
                visible: true,
                option: [
                    { name: "求和", value: "sum" },
                    { name: "平均值", value: "average" },
                    { name: "最大值", value: "max" },
                    { name: "最小值", value: "min" },
                    { name: "计数", value: "count" },
                    { name: "计数(去重)", value: "norepeatCount" },
                    { name: "方差", value: "variance" },
                    { name: "标准差", value: "standardDeviation" },
                    { name: "中位数", value: "median" }
                ]
            },
            {
                type: "string",
                cname: "文本颜色",
                name: "calcFontColor",
                widget: "XColorPicker",
                disable: false,
                visible: true,
                option: [{ type: "normal" }]
            },
            {
                type: "string",
                cname: "背景颜色",
                name: "calcBgColor",
                widget: "XColorPicker",
                disable: false,
                visible: true,
                option: [{ type: "normal" }]
            },
            {
                type: "number",
                cname: "字号",
                name: "calcFontSize",
                widget: "XInput",
                disable: false,
                visible: true,
                option: null
            },
            {
                type: "boolean",
                cname: "文字加粗",
                name: "calcFontWeight",
                widget: "XSwitch",
                disable: false,
                visible: true,
                option: null
            }
        ]
    },
    warning: {
        name: "预警",
        value: [
            {
                type: "object",
                cname: "",
                name: "warning",
                widget: "Warning",
                disable: false,
                visible: true,
                option: null
            }
        ]
    }
});
