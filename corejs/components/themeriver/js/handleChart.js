import WidgetBase from "corejs/components/base";

class HandleChart extends WidgetBase {
    /**
     *
     * @param {*} data 数据
     * @param {*} tempOption 大模板
     * @param {*} enumOption 枚举属性
     */
    handleData(data, tempOption, enumOption) {
        if (!data.metadata || !data.metadata.length) return {};

        //metadata 第一个元素放x轴，根据其数据类型确定是 category or time or value
        //确定singleAxis 类型
        //string 类型 为legend, Numberic 类型为 指标

        //删除该字段
        tempOption.singleAxis.data && delete tempOption.singleAxis.data;
        let colType = data.metadata[0].colType.toLowerCase();
        if (colType === "date") {
            tempOption.singleAxis.type = "time";
            this.sortFull(data, tempOption);
        } else if (colType === "string") {
            tempOption.singleAxis.type = "category";
            let { mainTime } = this.sortFull(data, tempOption);
            //mainTime 是类目 category
            tempOption.singleAxis.data = mainTime;

            tempOption.series[0].data.forEach(el => {
                el[0] = mainTime.indexOf(el[0]);
            });
        } else if (colType === "numeric" || colType === "integer") {
            tempOption.singleAxis.type = "value";
            this.sortFull(data, tempOption);
        }

        return tempOption;
    }
    /**
     *
     * @param {*} tempOption 大模板
     * @param {*} enumOption 枚举属性
     * @param {*} htmlObj
     */
    handleEnumOption(tempOption, enumOption, htmlObj) {
        for (let everyOption in enumOption) {
            this.handleEveryOption(
                everyOption,
                enumOption[everyOption],
                tempOption,
                enumOption,
                htmlObj
            );
        }
        return tempOption;
    }
    /**
     *
     * @param {*} key  枚举属性键
     * @param {*} value 枚举属性值
     * @param {*} option 大模板
     * @param {*} htmlObj
     * @param {*} enumOption
     */
    handleEveryOption(item, value, option, enumOption, htmlObj) {
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
                /*  document.querySelector(
                  "#" + this.cfg.id + " .chartCsv"
              ).style.display = value ? "block" : "none"; */
                Dashboard.lib
                    .$("#" + this.cfg.id + " .chartCsv")
                    .css({ display: value ? "block" : "none" });
                break;
            case "example":
                this.handleExample(value, option, htmlObj, enumOption);
                this.adjustGrid(item, value, option, htmlObj, enumOption);
                break;
            case "showLabel":
                option.series.map(i => {
                    i.label.normal.show = value;
                });
                break;
            case "labelPos":
                option.series.map(i => {
                    i.label.normal.position = value;
                });
                break;
            case "axisTick":
                option.singleAxis.axisTick.show = value;
                break;
            case "splitLine":
                option.singleAxis.splitLine.show = value;
                break;
            case "axisTitle":
                option.singleAxis.name = value;
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
                    //图例颜色
                    value[1] && (option.legend.textStyle.color = value[1]);
                    // 刻度文字、坐标名字
                    value[1] &&
                        ((option.singleAxis.axisLabel.color = value[1]),
                        (option.singleAxis.nameTextStyle.color = value[1]));
                }
                break;
            case "lineColor":
                if (value.length > 0) {
                    value[0] &&
                        (option.singleAxis.axisLine.lineStyle.color = value[0]);
                    value[1] &&
                        (option.singleAxis.splitLine.lineStyle.color =
                            value[1]);
                }
                break;
            default:
                break;
        }
    }
    handleExample(value, option, htmlObj, enumOption) {
        option.legend.top = "auto";
        option.legend.right = "auto";
        option.legend.left = "auto";
        option.legend.bottom = "auto";
        option.legend.orient = "horizontal";
        option.legend.show = true;
        option.legend.type = "scroll";
        switch (value) {
            case "null":
                option.legend.show = false;
                break;
            case "top":
                option.legend.top = enumOption.title.length > 0 ? 40 : "0";
                option.legend.left = "center";
                break;
            case "left":
                option.legend.left = 0;
                option.legend.top = "middle";
                option.legend.orient = "vertical";
                break;
            case "right":
                option.legend.right = 0;
                option.legend.top = "middle";
                option.legend.orient = "vertical";
                break;
            case "bottom":
                option.legend.left = "center";
                option.legend.bottom = "0";
                break;
            default:
                break;
        }
    }
    adjustGrid(item, value, option, htmlObj, enumOption) {
        //如果坐标轴 和  图例 在同一个位置，就需要计算坐标系位置
        const chartMargin = 10; //图表边距
        const titleHeight = 40; //标题高度
        const bottomGap = enumOption.axisTitle.length ? 55 : 45;
        let maxStrObj = this.getLabelMaxLength(option.legend.data);
        let lengthWidth =
            10 + +30 + this.measureTextWidth(maxStrObj.maxValue) + 10;
        if (enumOption.example === "left") {
            option.singleAxis.left = lengthWidth;
            option.singleAxis.right = 20;
            option.singleAxis.top = enumOption.title.length ? titleHeight : 20;
            option.singleAxis.bottom = bottomGap;
        } else if (enumOption.example === "right") {
            option.singleAxis.right = lengthWidth;
            option.singleAxis.left = 20;
            option.singleAxis.top = enumOption.title.length ? titleHeight : 20;
            option.singleAxis.bottom = bottomGap;
        } else if (enumOption.example === "top") {
            option.singleAxis.left = 20;
            option.singleAxis.right = 20;
            option.singleAxis.top = enumOption.title.length
                ? titleHeight + 25
                : 20;
            option.singleAxis.bottom = bottomGap;
        } else if (enumOption.example === "bottom") {
            option.singleAxis.left = 20;
            option.singleAxis.right = 20;
            option.singleAxis.top = enumOption.title.length ? titleHeight : 20;
            option.singleAxis.bottom = 45 + 20;
        } else if (enumOption.example === "null") {
            option.singleAxis.left = 20;
            option.singleAxis.right = 20;
            option.singleAxis.top = enumOption.title.length ? titleHeight : 20;
            option.singleAxis.bottom = bottomGap;
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
    /**
     * 对data 按图例分类
     * 然后对主干河流做信息补全
     * @param {*} data
     * @param {*} tempOption
     */
    sortFull(data, tempOption) {
        let metadata = data.metadata,
            lengendMeta,
            valueMeta,
            formaterData = [],
            legend = [],
            category = [],
            temp = {},
            legendKey = {},
            tempArr = [];
        lengendMeta = metadata
            .slice(1)
            .find(el => el.colType.toLowerCase() === "string");
        valueMeta = metadata
            .slice(1)
            .find(
                el =>
                    el.colType.toLowerCase() === "numeric" ||
                    el.colType.toLowerCase() === "integer"
            );
        //这里处理的主要逻辑是
        //先按图例分类
        //然后最图例数最多的做日期补全
        data.resultset.forEach(el => {
            //按图例分类
            if (!legendKey[el[lengendMeta.colIndex]]) {
                legendKey[el[lengendMeta.colIndex]] = [];
            }
            legendKey[el[lengendMeta.colIndex]].push([
                el[0],
                el[valueMeta.colIndex],
                el[lengendMeta.colIndex]
            ]);
            //保存时间主干
            tempArr.push(el[0]);
        });

        let sameLengend = Object.values(legendKey);
        //获得时间主干
        let mainTime = [...new Set(tempArr)];
        //按图例数量 从小到大排列，找出图例数最多的一个
        let maxLengend = sameLengend
            .map(len => ({
                els: len,
                length: len.length,
                name: len[0][2]
            }))
            .sort((prev, next) => {
                return prev.length - next.length;
            });
        maxLengend = maxLengend[maxLengend.length - 1];
        //按时间主干 对 图例数最多的 进行不全
        let maxLengendTimes = maxLengend.els.map(el => el[0]);
        let newMainTime = mainTime.map(time => {
            let idx = maxLengendTimes.indexOf(time);
            return [
                time,
                idx > -1 ? maxLengend.els[idx][1] : 0,
                maxLengend.name
            ];
        });
        // maxLengend.forEach(lengend => {
        //   let maxLengendTimes = lengend.els.map(el => el[0]);
        //   let newMainTime = mainTime.map(time => {
        //     let idx = maxLengendTimes.indexOf(time);
        //     return [time, idx > -1 ? lengend.els[idx][1] : 0, lengend.name]
        //   });
        //    //重新 放到legendKey中
        //   legendKey[lengend.name] = newMainTime;
        // });

        //重新 放到legendKey中
        legendKey[maxLengend.name] = newMainTime;
        //设置图例
        tempOption.legend.data = [...new Set(Object.keys(legendKey))];
        //先平级话legendkey，然后设置data
        tempOption.series[0].data = Object.values(legendKey).reduce(
            (prev, next) => prev.concat(next),
            []
        );
        return {
            tempOption,
            mainTime
        };
    }
}

export default HandleChart;
