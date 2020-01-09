const defaultOption = {
    baseOption: {
        timeline: {
            data: [
                "10:00",
                "11:00",
                "12:00",
                "13:00",
                "14:00",
                "15:00",
                "16:00",
                "17:00",
                "18:00",
                "19:00"
            ],
            playInterval: "1000",
            loop: true,
            axisType: "category",
            autoPlay: false,
            rewind: false,
            symbolSize: 10,
            symbol: "emptyCircle",
            itemStyle: {
                normal: {
                    color: "#fff"
                },
                emphasis: {
                    color: "green"
                }
            },
            lineStyle: {
                color: "#46ba7c",
                width: 5
            },
            label: { position: "auto" },
            checkpointStyle: {
                color: "#fa5b5a",
                symbolSize: 18,
                borderWidth: 0,
                animationDuration: "1000",
                symbol: "circle"
            },
            controlStyle: {
                normal: {
                    position: "left",
                    color: "red",
                    borderColor: "red",
                    itemSize: 12
                }
            }
        },
        tooltip: {}
    }
};
export default defaultOption;
