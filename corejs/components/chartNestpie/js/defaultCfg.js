const exportIcon = require("resource/images/downCsv.png");
const defaultOption = {
    title: {
        text: "",
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
        data: [
            "直达",
            "营销广告",
            "搜索引擎",
            "邮件营销",
            "联盟广告",
            "视频广告",
            "百度",
            "谷歌",
            "必应",
            "其他"
        ],
        textStyle: {
            color: "#919499"
        }
    },
    series: [
        {
            name: "访问来源",
            type: "pie",
            radius: [0, "30%"],
            center: ["50%", "50%"],
            label: {
                normal: {
                    position: "inner"
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data: [
                { value: 335, name: "直达" },
                { value: 679, name: "营销广告" },
                { value: 1548, name: "搜索引擎" }
            ]
        },
        {
            name: "访问来源",
            type: "pie",
            radius: ["40%", "55%"],
            center: ["50%", "50%"],
            label: {
                normal: {
                    formatter: "{a}\n {b}{c}{d}"
                }
            },
            labelLine: {
                normal: {
                    show: true
                }
            },
            data: [
                { value: 335, name: "直达" },
                { value: 310, name: "邮件营销" },
                { value: 234, name: "联盟广告" },
                { value: 135, name: "视频广告" },
                { value: 1048, name: "百度" },
                { value: 251, name: "谷歌" },
                { value: 147, name: "必应" },
                { value: 102, name: "其他" }
            ]
        }
    ]
};
export default defaultOption;
