const exportIcon = require("resource/images/downCsv.png");
const defaultOption = {
    title: {
        text: "title",
        left: "left",
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
    grid: {
        left: 20,
        right: 40,
        top: 20,
        bottom: 20
    },
    orientation: "vertical",
    color: ["#279df5", "#ffd401", "#72c4b8", "#3373b3", "#3f557e", "#f0b498"],
    tooltip: {
        trigger: "item"
    },
    legend: {
        // orient: 'vertical',
        orient: "horizontal",
        right: "0",
        top: "0",
        left: "auto",
        bottom: "auto",
        data: ["直接访问", "间接访问"],
        color: ["#3398DB", "#f42f42"],
        textStyle: {
            color: "#919499"
        }
    },
    xAxis: [
        {
            // show: true,
            name: "",
            // nameRotate: '0',
            nameLocation: "middle",
            nameGap: 35,
            type: "category",
            data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            splitLine: {
                show: false,
                lineStyle: {
                    color: "#ccc" //网络线样色
                }
            }, //网络线
            splitArea: { show: false },
            axisTick: { show: false },
            axisLine: {
                show: true,
                nameTextStyle: {
                    color: "#919499"
                },
                lineStyle: {
                    color: "#BFBFBF"
                }
            },
            axisLabel: {
                interval: 0,
                rotate: 0,
                color: ""
            }
        },
        {
            name: "",
            nameLocation: "middle",
            type: "category",
            tag: true,
            data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            show: false,
            // axisTick: {show: true},
            splitLine: {
                show: false,
                lineStyle: {
                    color: "#ccc" //网络线样色
                }
            },
            axisLine: {
                show: true,
                nameTextStyle: {
                    color: "#919499"
                },
                lineStyle: {
                    color: "#BFBFBF"
                }
            },
            splitArea: { show: false },
            axisTick: { show: false },
            axisLabel: {
                interval: 0,
                rotate: 0,
                color: ""
            }
        }
    ],
    yAxis: [
        {
            // show: true,
            name: "",
            // nameRotate: '90',
            nameLocation: "middle",
            nameGap: 35,
            type: "value",
            splitLine: {
                show: false,
                lineStyle: {
                    color: "#ccc" //网络线样色
                }
            },
            splitArea: { show: false },
            axisTick: { show: false },
            axisLabel: {
                interval: 0,
                rotate: 0
            },
            axisLine: {
                show: true,
                nameTextStyle: {
                    color: "#919499"
                },
                lineStyle: {
                    color: "#BFBFBF"
                }
            }
        },
        {
            show: false,
            name: "",
            // nameRotate: '90',
            nameLocation: "middle",
            nameGap: 26,
            type: "value",
            splitLine: {
                show: false,
                lineStyle: {
                    color: "#ccc" //网络线样色
                }
            },
            axisLine: {
                show: true,
                nameTextStyle: {
                    color: "#919499"
                },
                lineStyle: {
                    color: "#BFBFBF"
                }
            },
            splitArea: { show: false },
            axisTick: { show: false },
            axisLabel: {
                interval: 0,
                rotate: 0
            }
        }
    ],
    series: [
        {
            name: "背景",
            tag: true,
            type: "bar",
            data: [],
            // barGap: '-100%',
            xAxisIndex: 1,
            yAxisIndex: 0,
            zlevel: 0,
            silent: true,
            label: {
                normal: {
                    show: false
                }
            },
            tooltip: {
                show: false
            },
            itemStyle: {
                normal: { color: "rgba(200, 200, 200,0.8)", opacity: 1 }
            }
        },
        {
            name: "直接访问",
            type: "bar",
            data: [10, 52, 200, 334, 390, 330, 220],
            label: {
                normal: {
                    show: false
                }
            },
            stack: "",
            markLine: {},
            itemStyle: {
                normal: {
                    // barBorderRadius: 0
                }
            },
            tooltip: {
                formatter: "{a0}: <br />{b0}: {c0}"
            }
        },
        {
            name: "间接访问",
            type: "line",
            data: [55, 33, 66, 222, 333, 111, 100],
            label: {
                normal: {
                    show: false
                }
            },
            stack: "",
            markLine: {},
            itemStyle: {
                normal: {
                    // barBorderRadius: 0
                }
            },
            tooltip: {
                formatter: "{a0}: <br />{b0}: {c0}"
            },
            areaStyle: {
                normal: {
                    opacity: 0
                }
            }
        }
    ],
    animation: true
};
export default defaultOption;
