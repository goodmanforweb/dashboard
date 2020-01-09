import WidgetBase from "corejs/components/base";
import Immutable, { Map, is } from "immutable";
import _ from "lodash";

export default class handle extends WidgetBase {
    constructor(htmlObj, cfg) {
        super(htmlObj, cfg);
    }
    //事件绑定
    _bindClickEvent() {
        this.echartsDom.on("timelinechanged", e => {
            // console.log(e, "e");
            var _data = this._option.baseOption.timeline.data;
            var _dataobj = this._selfdata || {};
            const ind = e.currentIndex;
            this.setParameter(
                _dataobj[_data[ind]] === null
                    ? _data[ind]
                    : _dataobj[_data[ind]]
            );
        });
    }
    //初始化图表的数据
    _initOption() {
        const { util } = window.Dashboard;
        const { defaultOption } = this.cfg.chartDefinition;
        let thisOption = util.copy(true, {}, defaultOption, this._option);
        util.copy(true, this._option, thisOption);
    }
    /**
     * @discripte 处理样式操作的option
     * @param     {[type]}  option [description]
     * @return    {[type]}         [description]
     */
    _handleOption(option) {
        //处理option
        const chartDefinition = this.cfg.chartDefinition;
        //处理样式操作数据
        this._option = this._handleEnumOption(
            chartDefinition.option,
            this._option,
            this.htmlObj
        );
        //处理代码注入数据
        // this._option = handleChart.handleInjectOption(chartDefinition.injectOption,this._option);
        return this._option;
    }
    /**
     * @discripte 处理可枚举属性
     * @param     {[type]}  store   [枚举属性对象]
     * @param     {[type]}  option  [图标的option]
     * @param     {[type]}  htmlObj [图表的dom对象]
     * @return    {[type]}          [处理后的option]
     */
    _handleEnumOption(store, option, htmlObj) {
        for (let item in store) {
            this._handlePerStore(item, store[item], option, htmlObj, store);
        }

        return option;
    }

    /**
     * @discripte 处理属性
     * @param     {[type]}  item      [枚举字段]
     * @param     {[type]}  value     [枚举值]
     * @param     {[type]}  option    [图表option]
     * @param     {[type]}  htmlObj   [图表外层dom]
     * @param     {[type]}  ownOption [枚举对象]
     * @return    {[type]}            [description]
     */
    _handlePerStore(item, value, option, htmlObj, ownOption) {
        // console.log(item,'4564564564');
        var _option = option.baseOption.timeline;
        switch (item) {
            //图表颜色
            case "color":
                if (value.length > 0 && typeof value === "object") {
                    // option.color = value;controlStyle
                    _option.controlStyle.normal.color = value[0];
                    _option.controlStyle.normal.borderColor = value[0];
                    _option.lineStyle.color = value[0];
                    _option.itemStyle.normal.color = value[1];
                    _option.checkpointStyle.color = value[2];
                    _option.itemStyle.emphasis.color = value[2];
                }
                break;
            //方向
            case "orientation":
                _option.orient = value;
                this.setOrientation(_option, value, ownOption, htmlObj);
                /* if (value === "vertical") {
                    _option.top = 20;
                    _option.bottom = 20;
                    _option.left = "center";
                } else {
                    _option.top = "center";
                    _option.left = 20;
                    _option.right = 20;
                } */
                break;
            //保存参数
            case "value":
                this.cfg.parameter = value;
                break;
            //文字位置
            case "example":
                /* _option.label.position = value.split("And")[
                    ownOption.orientation === "vertical" ? 1 : 0
                ]; */
                var _exampleValue = value.split("And")[
                    ownOption.orientation === "vertical" ? 1 : 0
                ];
                _exampleValue = {
                    left: -20,
                    right: 20,
                    top: _exampleValue,
                    buttom: _exampleValue
                }[_exampleValue];
                _option.label.position = _exampleValue;
                break;
            //数轴粗细
            case "axisWidth":
                _option.lineStyle.width = value;
                break;
            //节点形状
            case "solidType":
                _option.symbol = value;
                _option.checkpointStyle.symbol =
                    value === "emptyCircle" ? "circle" : value;
                break;
            //节点尺寸
            case "solidWidth":
                _option.symbolSize = value;
                break;
            //滑块尺寸
            case "blockWidth":
                _option.checkpointStyle.symbolSize = value;
                break;
            //自动播放
            case "autoPlay":
                _option.autoPlay = value;
                break;
            //顺序播放
            case "rewind":
                _option.rewind = value === "true" ? true : false;
                break;
            //播放间隔
            case "playSleep":
                _option.playInterval = value;
                break;
            //播放按钮位置
            case "playBtnPos":
                _option.controlStyle.normal.position = value.split("And")[
                    value === "vertical" ? 1 : 0
                ];
                value === "null" && (_option.controlStyle.normal.show = false);
                break;
            //控制按钮尺寸
            case "playbtnsize":
                _option.controlStyle.normal.itemSize = value;
                break;
            //背景颜色
            case "backgroundColor":
                value && (htmlObj.style[item] = value);
                if (this.cfg.parentId) {
                    htmlObj.style[item] = "rgba(0, 0, 0, 0)";
                }
                break;
            //文字颜色
            case "textColor":
                _option.label.color = value[1];
                break;
            default:
                break;
        }
    }
    setOrientation(_option, value, ownOption, htmlObj) {
        var _length;
        if (value === "vertical") {
            _option.top = 20;
            _option.bottom = 20;
            _length = this.countBoundry(htmlObj, _option);
            _option[
                { left: "right", right: "left" }[
                    ownOption.example.split("And")[1]
                ]
            ] = _length;
        } else {
            _option.top = "center";
            _option.left = 20;
            _option.right = 20;
        }
    }
    /**
     * 计算文字最大长度
     * @param {*} htmlObj
     * @param {*} _option
     */
    countBoundry(htmlObj, _option) {
        let maxLengthObj = this.getLabelMaxLength(_option.data);
        let length = this.measureTextWidth(maxLengthObj.maxValue);
        let width = parseInt(htmlObj.clientWidth);
        length = width - 30 - length;
        return (length > 10 ? length : 10) / 2;
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
    //处理请求返回的data
    _handleData(data, option, ownOption, drillName) {
        this._selfdata = {};
        let ownData = Immutable.fromJS(data).toJS();
        if (is(Map(ownData), Map({}))) return option;

        var lengendMetaData = ownData.metadata.slice(1); //第一列展示为类目轴
        //获取图例名称
        var lengend = this.getLengendNumeric(lengendMetaData);
        //获取图例下标
        var lengendIndex = this.getLengendNumericIndex(lengendMetaData);
        if (lengendIndex.length && lengendIndex[0] === 1) {
            ownData.resultset.forEach(e => {
                this._selfdata[e[0]] =
                    this._selfdata[e[0]] === undefined
                        ? e[1] || null
                        : this._selfdata[e[0]] + (e[1] || null);
            });
        } else if (!lengendIndex.length) {
            ownData.resultset.forEach(e => {
                this._selfdata[e[0]] = null;
            });
        }
        option.baseOption.timeline.data = Object.keys(this._selfdata);
        return option;
    }
    getLengendNumeric(metadata) {
        var typeArr = ["Numeric", "Integer"];
        return metadata
            .filter(function(item) {
                return typeArr.includes(item.colType);
            })
            .map(function(item) {
                return item.colName;
            });
    }
    getLengendNumericIndex(metadata) {
        var typeArr = ["Numeric", "Integer"];
        return metadata
            .filter(function(item) {
                return typeArr.includes(item.colType);
            })
            .map(function(item) {
                return item.colIndex;
            });
    }
    maxLength(arr) {
        let maxLength = 0;
        for (let i = 0, len = arr.length; i < len; i++) {
            if (arr[i].length > maxLength) maxLength = arr[i].length;
        }
        return maxLength;
    }
}
