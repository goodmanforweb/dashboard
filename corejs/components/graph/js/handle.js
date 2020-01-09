import WidgetBase from "corejs/components/base";

import Immutable from "immutable";

export default class handle extends WidgetBase {
    constructor(htmlObj, cfg) {
        super(htmlObj, cfg);
    }
    _bindClickEvent() {
        this.echartsDom.on("click", e => {
            const chartDefinition = this.cfg.chartDefinition;
            const params = chartDefinition.option.clickParmas;
            switch (chartDefinition.option.clickEvent) {
                case "interact":
                    var _params = Immutable.fromJS(params).toJS();
                    _params.category.value = e.name;
                    _params.value.value = e.value;
                    var thisparam = Object.values(_params).filter(el =>
                        /param/.test(el.id)
                    );
                    // Immutable
                    const globalParam = window.Dashboard.globalParam;
                    globalParam.updateParams(thisparam);
                    break;
                default:
                    break;
            }
        });
        /* //鼠标移入移除事件
    this.rawhtmlObj.addEventListener("mouseenter", e => {
        this._option.toolbox.show = true;
        this._option.legend.selected = this.echartsDom._model.option.legend[0].selected;
        this.echartsDom.setOption(this._option, true);
    });
    //鼠标移出移除事件
    this.rawhtmlObj.addEventListener("mouseleave", e => {
        this._option.toolbox.show = false;
        this._option.legend.selected = this.echartsDom._model.option.legend[0].selected;
        this.echartsDom.setOption(this._option, true);
    });
    //图例点击存储状态
    this.echartsDom.on("legendselectchanged", e => {
        this._option.legend.selected = e.selected;
    });
    //刷新图例状态清空存储状态
    this.echartsDom.on("restore", e => {
        this._option.legend.selected = {};
        this.echartsDom.setOption(this._option, true);
    }); */
    }
    /* _bindCsv(){
    function exportCsv(obj){//csv导出
            //title ["","",""]
            if(!obj || !Object.keys(obj).length) return;
            var title = Object.values(obj.metadata).map(v => v.colName);
            //titleForKey ["","",""]
            // var titleForKey = obj.titleForKey;
            var data = obj.resultset;
            var str = [];
            str.push(title.join(",")+"\n");
            for(var i=0;i<data.length;i++){
                var temp = [];
                for(var j=0;j<title.length;j++){
                    temp.push(data[i][j]);
             }
             str.push(temp.join(",")+"\n");
         }
         var uri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(str.join(""));  
         var downloadLink = document.createElement("a");
         downloadLink.href = uri;
         downloadLink.download = "export.csv"; 
         document.body.appendChild(downloadLink);
         downloadLink.click();
         document.body.removeChild(downloadLink); 
      }
    const chartDefinition = this.cfg.chartDefinition;
    this._option.toolbox.feature.myTool2.onclick = ()=> exportCsv(chartDefinition.data);
  } */
    /**
     *
     * @param {*} tempOption  大模板
     * @param {*} enumOption  枚举属性
     * @param {*} htmlObj
     */
    _handleEnumOption(tempOption, enumOption, htmlObj) {
        for (let item in enumOption) {
            this._handlePerOption(
                item,
                enumOption[item],
                tempOption,
                htmlObj,
                enumOption
            );
        }
        return tempOption;
    }
    _handlePerOption(item, value, option, htmlObj, enumOption) {
        let tempArr;
        switch (item) {
            case "title":
                //用rich 是因为 要给标题设置背景颜色
                option.title.z = -2;
                option.title.padding = [0, 0, 0, 5];
                option.title.text = `{a|${value}}`;
                option.title.textStyle.rich.a = {
                    lineHeight: 40,
                    fontSize: 16,
                    width: 10000
                };
                //调整坐标系位置
                // option.series.top = 40 + 5;
                break;
            case "titleBackgroundColor":
                option.title.backgroundColor = value || "transparent";
                if (this.cfg.chartDefinition.option.title === "") {
                    option.title.backgroundColor = "transparent";
                }
                break;
            case "titlePosition":
                option.title.left = value;
                break;
            case "isExportData":
                document.querySelector(
                  "#" + this.cfg.id + " .chartCsv"
              ).style.display = value ? "block" : "none";
              break;
            case "color":
                if (value.length > 0) {
                    option.color = value;
                }
                break;
            case "backgroundColor":
                value && (htmlObj.style[item] = value);
                if (this.cfg.parentId) {
                    htmlObj.style[item] = "rgba(0, 0, 0, 0)";
                }
                break;
            case "textColor":
                if (value.length > 0) {
                    //设置主要颜色
                    option.title.textStyle.color = value[0];
                    //设置次要颜色
                    // 刻度文字、坐标名字
                    value[1] && (option.series[0].label.color = value[1]);
                }
                break;
            case "lineColor":
                if (value.length > 0) {
                    option.series[0].lineStyle.color = value[0];
                }
                break;

            case "example":
                this.handleExample(item, value, option, htmlObj, enumOption);
                break;
            case { showData: "showData", nodeText: "nodeText" }[item]:
                this.handleTextShow(option, enumOption);
                break;
            case "curveness":
                option.series[0].lineStyle.curveness = value;
                break;
            case "nodeType":
                option.series[0].symbol = value;
                break;
            case "nodeSize":
                // option.series[0].symbolSize = value;
                break;
            case "nodeDrag":
                option.series[0].draggable = value;
                break;
            case "nodeRepulsion":
                option.series[0].force.repulsion = value;
                break;
            case { mouseScale: "mouseScale", move: "move" }[item]:
                //scale move true false
                if (enumOption.mouseScale) {
                    if (enumOption.move) {
                        option.series[0].roam = true;
                    } else {
                        option.series[0].roam = "scale";
                    }
                } else {
                    if (enumOption.move) {
                        option.series[0].roam = "move";
                    } else {
                        option.series[0].roam = false;
                    }
                }
                break;
            default:
                break;
        }
    }
    /**
     * 处理 数据显示  和 文字 显示
     * @param {*} option
     * @param {*} enumOption
     */
    handleTextShow(option, enumOption) {
        let func = function(e) {};
        if (enumOption.nodeText) {
            if (enumOption.showData) {
                func = e => '{a|'+e.name+'}\n{b|'+e.value+'}';
            } else {
                func = e => e.name;
            }
        } else {
            if (enumOption.showData) {
                func = e => e.value;
            } else {
                option.series[0].label.show = false;
                return option;
            }
        }
        option.series[0].label.show = true;
        option.series[0].label.formatter = func;
        return option;
    }
    handleExample(item, value, option, htmlObj, enumOption) {
        option.legend.show = true;
        switch (value) {
            case "top":
                option.legend.orient = "horizontal";
                option.legend.top = enumOption.title.length ? 40 : 0;
                option.legend.left = "center";
                break;
            case "bottom":
                option.legend.orient = "horizontal";
                option.legend.top = "bottom";
                option.legend.left = "center";
                break;
            case "left":
                option.legend.orient = "vertical";
                option.legend.top = "middle";
                option.legend.left = "left";
                break;
            case "right":
                option.legend.orient = "vertical";
                option.legend.top = "middle";
                option.legend.left = "right";
                break;
            case "null":
                option.legend.show = false;
                break;
            default:
        }
        return option;
    }
    /**
     * 使用canvas 测量字符所占长度
     * @param {*} text
     * @param {*} fontSize
     */
    measureTextWidth(text, fontSize = 12) {
        let ctx = document.createElement("canvas").getContext("2d");
        ctx.font = `${fontSize}px Arial`;
        return ctx.measureText(text).width;
    }
    /**
     * 找出字符最长的一个
     * @param {*} arr
     */
    getLabelMaxLength(arr = []) {
        let maxLength = 0,
            maxIndex = 0;
        let tempArr = arr.map(el => {
            let str = el + "".trim(),
                strLen = 0;
            for (let i = 0, len = str.length; i < len; i++) {
                if (str[i].charCodeAt(i) > 256) {
                    strLen += 3;
                } else {
                    strLen++;
                }
            }
            return strLen;
        });
        //找到最大值 和 对应索引
        maxLength = Math.max.apply(Array, tempArr);
        if (maxLength) {
            maxIndex = tempArr.indexOf(maxLength);
        }
        return {
            maxLength,
            maxIndex,
            maxValue: arr[maxIndex]
        };
    }
   
    _handleData(data, tempOption, enumOption) {
        //检测是否符合类型
        // if(data.metadata[0].colType != 'String' || data.metadata[1].colType != 'String' ||
        // data.metadata[2].colType != 'Numeric' && data.metadata[2].colType != 'Integer') {
        //   console.warn('数据格式错误');
        //   return false;
        // }

        //分离出类目
        //构造item
        //构造links
        let categories = [],
            links = [],
            items = [],
            itemsObj = [],
            len = 0,
            valueArr = [];
        let bindMax, bindMin, max, min, limitFunc;
        
        data.resultset.forEach(el => {
            categories.push(el[1], el[4]);
            valueArr.push(el[2], el[5]);
            //分离出 唯一item,和它的id
            let link = {
                source: "",
                target: "",
                label: el[6]
                    ? { show: true, formatter: el[6], color: "#919499" }
                    : null
            };
            if (!items.includes(`${el[0]}+${el[1]}`)) {
                len = items.push(`${el[0]}+${el[1]}`) - 1;
                itemsObj.push({
                    id: len,
                    name: el[0],
                    value: el[2],
                    category: el[1],
                    symbolSize: el[2]
                });
            } else {
                len = items.indexOf(`${el[0]}+${el[1]}`);
            }

            link.source = len;

            if (!items.includes(`${el[3]}+${el[4]}`)) {
                len = items.push(`${el[3]}+${el[4]}`) - 1;
                itemsObj.push({
                    id: len,
                    name: el[3],
                    value: el[5],
                    category: el[4],
                    symbolSize: el[5]
                });
            } else {
                len = items.indexOf(`${el[3]}+${el[4]}`);
            }
            link.target = len;

            //构造links
            links.push(link);
        });
        //确定节点大小， 限制在10 => 100 中;
        max = Math.max.apply(Array, valueArr);
        min = Math.min.apply(Array, valueArr);
        bindMin = 10, bindMax = 100;
        limitFunc = param => (Number(param) - min) / (max - min) * (bindMax - bindMin) + bindMin;
        //item  的category 还没有确定，需要 对应到 categories  里面的index
        categories = [...new Set(categories)];
        itemsObj.forEach(item => {
          item.category = categories.indexOf(item.category);
          item.symbolSize = limitFunc(item.symbolSize) * enumOption.nodeSize
        });

        tempOption.series[0].links = links;
        tempOption.series[0].categories = categories.map(cat => ({
            name: cat
        }));
        tempOption.series[0].data = itemsObj;
        tempOption.legend.data = categories;
        return tempOption;
    }
}
