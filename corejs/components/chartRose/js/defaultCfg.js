const exportIcon = require("resource/images/downCsv.png");
const defaultOption = {
    title: {
        text: "chartRose",
        textStyle: {
            color: "#393c41",
            rich: {}
        }
    },
    toolbox: {
        show: false,
        right: 15,
        feature: {
            restore: { show: true, title: "刷新" },
            myTool2: {
                show: false,
                title: "导出数据",
                icon: "image://" + exportIcon
            },
            saveAsImage: { show: true, title: "导出图片" }
        }
    },
    tooltip: {
        trigger: "item",
        formatter: "{b} : {c} ({d}%)"
    },
    color: ["#279df5", "#ffd401", "#72c4b8", "#3373b3", "#3f557e", "#f0b498"],
    legend: {
        // orient: 'vertical',
        right: "0",
        top: "0",
        left: "auto",
        bottom: "auto",
        orient: "horizontal",
        type: "plain",
        data: [
            "rose1",
            "rose2",
            "rose3",
            "rose4",
            "rose5",
            "rose6",
            "rose7",
            "rose8"
        ],
        textStyle: {
            color: "#919499"
        }
    },
    series: [
        {
            name: "半径模式",
            type: "pie",
            radius: ["5%", "60%"],
            center: ["25%", "50%"],
            roseType: "radius",
            label: {
                normal: {
                    show: true
                }
            },
            lableLine: {
                normal: {
                    show: true
                }
            },
            data: [
                { value: 10, name: "rose1" },
                { value: 5, name: "rose2" },
                { value: 15, name: "rose3" },
                { value: 25, name: "rose4" },
                { value: 20, name: "rose5" },
                { value: 35, name: "rose6" },
                { value: 30, name: "rose7" },
                { value: 40, name: "rose8" }
            ]
        }
    ]
};
export default defaultOption;
