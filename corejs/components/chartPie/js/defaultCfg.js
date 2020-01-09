const exportIcon = require("resource/images/downCsv.png");
const defaultOption = {
    title: {
        text: "饼图",
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
        type: "plain",
        left: "auto",
        bottom: "auto",
        orient: "horizontal",
        data: ["直接访问", "邮件营销", "联盟广告", "视频广告", "搜索引擎"],
        textStyle: {
            color: "#919499"
        }
    },
    series: [
        {
            name: "",
            type: "pie",
            center: ["50%", "60%"],
            data: [
                { value: 335, name: "直接访问" },
                { value: 310, name: "邮件营销" },
                { value: 234, name: "联盟广告" },
                { value: 135, name: "视频广告" },
                { value: 1548, name: "搜索引擎" }
            ],
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: "rgba(0, 0, 0, 0.5)"
                }
            },
            label: {
                normal: {
                    show: true,
                    position: "inside",
                    formatter:
                        /*function(data) {
            var num = data.value.toString();
            var num1 = num.split('.')[0];
            var num2 = num.split('.')[1].toString();
            var result = [ ], counter = 0;
            num1 = (num1 || 0).toString().split('');
            for (var i = num1.length - 1; i >= 0; i--) {
                counter++;
                result.unshift(num1[i]);
                if (!(counter % 3) && i != 0) { result.unshift(','); }
            }
            return result.join('') + '.' + num2;
          }*/ "{b}({c})"
                }
            },
            radius: [0, "75%"]
        }
    ]
};
export default defaultOption;
