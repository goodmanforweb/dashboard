const exportIcon = require('resource/images/downCsv.png');
const defaultOption = {
    title : {
        text: '油量图',
        left: 'left',
        textStyle: {
            color: '#393c41',//标题颜色
            fontSize:16,
            rich:{}
        }
    },
    grid: {
        left: 20,
        right: 20,
        top: 50,
        bottom: 20
    },
    center: ['50%','50%'],
    tooltip : {
        formatter: "{a} <br/>{b} : {c}"
    },
    series: [
        {
            startAngle:225,
            endAngle:-45,
            name: '业务指标',
            clockwise:true,
            min:0,
            max:360,
            splitNumber:10,
            type: 'gauge',
            detail: {formatter:'{value}'},
            axisLine:{
                show:true,
                lineStyle:{
                    color:[[0.2,'red'],[0.8,'green'],[1,'blue']],
                    width:20
                }
            },
            splitLine:{
                show:true,
                length:40,
                lineStyle:{
                    color:'#fff',
                    width:2
                }
            },
            axisTick:{
                show:true,
                splitNumber:8,
                lineStyle:{
                    color:'auto',
                    width:1
                }
            },
            axisLabel:{
                show:true,
                distance:1,
                formatter:(value) => {
                    return value;
                },
                fontStyle:'italic',
                fontWeight:'bold',
                fontFamily:'sans-serif',
                background:'transparent',
                padding:0,
                textBorderColor:'white',
                textBorderWidth:2
            },
            pointer:{
                show:true,
                length:'100%',
                width:2
            },
            emphasis:{
                itemStyle:{
                    color:'red'
                }
            },
            title:{
                show:true,
                offsetCenter:[0,'20%']
            },
            detail:{
                show:true,
                offsetCenter:[0,'-20%']
            },
            markPoint:{
                symbol:'triangle'
            },
            tooltip:{

            },
            data: [{value: 50, oringinValue:50, name: '完成率'}]
        }

    ]
}


export default defaultOption