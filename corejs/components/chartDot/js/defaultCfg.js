const exportIcon = require('resource/images/downCsv.png');
const defaultOption = {
    title : {
        text: '指标点阵图',
        left: 'center',
        textStyle: {
            color: '#393c41',//标题颜色
            fontSize:16,
            rich:{}
        },
        option:{
            top:0,
            bottom:0,
            left:0,
            right:0,
            height:0,
            width:0
        }
    },
    grid: {
        left: 20,
        right: 20,
        top: 70,
        bottom: 20,
        containLabel: true
    },
    orientation: 'vertical',
    color: ['#279df5', '#ffd401', '#72c4b8', '#3373b3', '#3f557e', '#f0b498'],
    tooltip : {
        // trigger: 'axis',
        showDelay : 0,
        formatter : function (params) {
            if (params.value.length > 1) {
                return params.seriesName + ' : '+(params.value[2]?params.value[2]:'') +' <br/>'
                    + params.value[0]+" , "
                    + params.value[1];
            }
            else {
                return params.seriesName + ' :<br/>'
                    + params.name + ' : '
                    + params.value + 'kg ';
            }
        },
        axisPointer:{
            show: true,
            type : 'cross',
            lineStyle: {
                type : 'dashed',
                width : 1
            }
        }
    },
    legend: {
        data: ['女性','男性'],
        left: 'auto',
        orient: 'horizontal',
        right: 0,
        top: 40,
        bottom: 'auto',
        textStyle: {
            color: '#919499'//图例文字颜色
        },
        icon:'roundRect',
        option:{
            top:0,
            bottom:0,
            left:0,
            right:0,
            height:0,
            width:0
        }
    },
    xAxis : [
        {
            name:"",
            option:{
                top:0,
                bottom:0,
                left:0,
                right:0,
                height:0,
                width:0
            },
            nameLocation:"center",
            nameGap:26,
            show:true,
            type : 'value',
            scale:true,
            axisLabel: {
                interval: 0,
                rotate: 0,
                color:'',//坐标刻度文字样色 ，默认与坐标轴颜色相同
                formatter:'{value}'
            },
            splitLine: {
                show: false ,
                lineStyle: {
                    color:['#000']//网络线样色
                }
            },
            axisLine: {
                show: true,
                nameTextStyle: {
                    color: '#919499'//坐标名字颜色
                },
                lineStyle: {
                    color: '#BFBFBF'//坐标轴样色
                }
            },
            axisTick: { show: false }
        }
    ],
    yAxis : [
        {
            name:"",
            option:{
                top:0,
                bottom:0,
                left:0,
                right:0,
                height:0,
                width:0
            },
            nameLocation:"center",
            nameGap:26,
            show:true,
            type : 'value',
            scale:true,
            axisLabel: {
                interval: 0,
                rotate: 0,
                color:''//坐标刻度文字样色 ，默认与坐标轴颜色相同
            },
            splitLine: {
                show: false ,
                lineStyle: {
                    color:['#000']//网络线样色
                }
            },
            axisLine: {
                show: true,
                nameTextStyle: {
                    color: '#919499'//坐标名字颜色
                },
                lineStyle: {
                    color: '#BFBFBF'//坐标轴样色
                }
            },
            axisTick: { show: false }
        }
    ],
    series : [
        {
            name:'女性',
            type:'scatter',
            symbol:'circle',
            data: [
                [152.4, 67.3], [168.9, 63.0], [170.2, 73.6], [175.2, 62.3], [175.2, 57.7],
                [160.0, 55.4],  [157.5, 54.5], [165.1, 53.6], [160.0, 60.0],
                [174.0, 73.6], [162.6, 61.4], [174.0, 55.5], [162.6, 63.6], [161.3, 60.9],
                [156.2, 60.0], [149.9, 46.8], [169.5, 57.3], [160.0, 64.1], [175.3, 63.6],
                [169.5, 67.3], [160.0, 75.5], [172.7, 68.2], [162.6, 61.4], [157.5, 76.8],
                [176.5, 71.8], [164.4, 55.5], [160.7, 48.6], [174.0, 66.4], [163.8, 67.3]
            ],
            label: {
                normal: {
                    show: true,
                    offset:[0,14]
                }
            },
            markLine : {
                lineStyle: {
                    normal: {
                        type: 'solid'
                    }
                },
                data : [

                ]
            }

        },
        {
            name:'男性',
            type:'scatter',
            symbol:'circle',
            data: [
                [170.2, 62.3], [177.8, 82.7], [179.1, 79.1], [190.5, 98.2], [177.8, 84.1],
                [180.3, 83.2], [180.3, 83.2]
            ],
            label: {
                normal: {
                    show: false,
                    offset:[0,14]
                }
            },
            markLine : {
                lineStyle: {
                    normal: {
                        type: 'solid'
                    }
                },
                data : [

                ]
            }
        }
    ],
    animation:true
};
export default defaultOption