import panelcfg from "./js/panelWidgetsConfig";
export default {
    //组件基本信息
    base: {
        type: "custom",
        name: "自定义图表"
    },
    //面板配置
    panel: {
        dataSource: {
            name: "数据源",
            typeList: ["sql", "http", "websocket", "service", "olap"]
        },
        style: {
            name: "样式",
            //提供两种面板生成方式： 配置式（优先）、组件式。
            //面板组件配置
            panelcfg,
            //面板组件
            panelcmp: null
        } /* ,
        handle: {
            name: "事件"
        } */
    },
    //组件配置
    cfg: theme => ({
        type: "custom",
        name: "自定义图表",
        priority: 5,
        parameter: "",
        chartBtns: true,
        nochartData: true,
        bigandsmall: true,
        executeAtStart: true,
        listeners: [],
        layout: {
            i: "",
            x: 0,
            y: 0,
            w: 12,
            h: 10,
            minW: 1,
            minH: 1,
            maxW: 12,
            moved: true
        },
        chartDefinition: {
            queryid: "",
            queryname: "",
            query: {
                type: "sql",
                param: {},
                statement: "",
                query: `SELECT '食品经营' 食品大类, 1000012 金额,'349212,13423,129843,22541' 数据 UNION ALL
                SELECT '餐饮服务',1000012,'349212,13423,129843,22541'  UNION ALL
                SELECT '食品流通',2000012,'349212,13423,129843,22541' UNION ALL
                SELECT '食品生产',3000012,'349212,13423,129843,22541'`,
                jndi: "dw_market"
            },
            data: [],
            // option: {code: 'console.log(this)'},
            option: {
                backgroundColor: theme.chart.backgroundColor,
                code: `
        //data 是 获取的数据
        var data = this.cfg.chartDefinition.data;
        //dashboard 内置echarts ，用按如下方式使用；
        var echarts = arguments[0];
        //如需使用d3 请先加载，然后再回调中写逻辑
        //注意： 绘图引擎切换  请先手动清除之前的数据，否则造成多个引擎渲染的图表存在
        //清除方式，可以根据引擎的方式清除，如echart，可以调用echartsInstance,dipose()
        Dashboard.queryAction.getScriptOnce({
          name: 'd3',
          src: 'https://d3js.org/d3.v5.min.js'
        }).then(function(){
          console.log('succ');
        }).catch(function(e){console.log(e)});
        var option ={xAxis:{type:'category',data:['Mon','Tue','Wed','Thu','Fri','Sat','Sun']},yAxis:{type:'value'},series:[{data:[820,932,901,934,1290,1330,1320],type:'line'}]};
        var echartsInstance;
        if(this.echartsInstance) {
          echartsInstance = this.echartsInstance;
        }
        else {
          echartsInstance = echarts.init(this.htmlObj);
        };
        echartsInstance.setOption(option);
        echartsInstance.resize();
        //刷新方法  在函数里面写自己的刷新逻辑  也就是重新渲染
        this.resize = function(){
            echartsInstance.resize();
            echartsInstance.setOption(option,true);
        };
        `
            },
            inject: {
                // widgetWillCreated: "function() {console.log('run', this)}",
                postUpdate: "function(){console.log('postUpdate')}"
            }
        }
    })
};
