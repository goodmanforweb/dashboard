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
        formatter: function(data) {
            let num = data.value.toString();
            let num1 = num.split(".")[0];
            let num2 = num.split(".")[1]
                ? "." + num.split(".")[1].toString()
                : "";
            let result = [],
                counter = 0;
            num1 = (num1 || 0).toString().split("");
            for (let i = num1.length - 1; i >= 0; i--) {
                counter++;
                result.unshift(num1[i]);
                if (!(counter % 3) && i != 0) {
                    result.unshift(",");
                }
            }
            return data.name + "(" + result.join("") + num2 + ")";
        }
    },
    color: ["#279df5", "#ffd401", "#72c4b8", "#3373b3", "#3f557e", "#f0b498"],
    legend: {
        // orient: 'vertical',
        right: "0",
        top: "0",
        left: "auto",
        bottom: "auto",
        orient: "horizontal",
        data: ["展现", "点击", "访问", "咨询", "订单"],
        textStyle: {
            color: "#919499"
        }
    },
    series: [
        {
            name: "漏斗图",
            type: "funnel",
            left: "10%",
            top: 60,
            bottom: 60,
            width: "80%",
            min: 1,
            max: 100,
            minSize: 1,
            maxSize: "100%",
            sort: "descending",
            gap: 0,
            label: {
                normal: {
                    show: true,
                    position: "inside"
                }
            },
            labelLine: {
                normal: {
                    length: 10,
                    lineStyle: {
                        width: 1,
                        type: "solid"
                    }
                }
            },
            itemStyle: {
                normal: {
                    borderColor: "#fff",
                    borderWidth: 1
                }
            },
            data: [
                { value: 60, name: "访问" },
                { value: 40, name: "咨询" },
                { value: 20, name: "订单" },
                { value: 80, name: "点击" },
                { value: 100, name: "展现" }
            ]
        }
    ]
};
export default defaultOption;
