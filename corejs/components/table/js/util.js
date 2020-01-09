/**
 * 工具
 * author：twy
 */
import _ from "underscore";
import csv from "./export-csv";

class Util {
  constructor() {
    return this;
  }

  /**
   * 将数据对象转换为伪数组对象
   * @param {Array} arr 要转换的数组对象
   */
  map(arr) {
    let obj = {};
    arr.forEach((value, index) => {
      obj[index] = value;
    });
    return obj;
  }

  /**
   * 两个数值求和函数
   * @param {Number} x
   * @param {Number} y
   */
  add(x, y) {
    return x + y;
  }

  /**
   * 计算数值平方
   * @param {Number} 数值
   */
  square(x) {
    return x * x;
  }

  /**
   * 求和
   * @param {Array} numbers 数字集合
   * @param {Object} options 参数对象
   */
  sum(numbers, options = {}) {
    return numbers.reduce(this.add.bind(this));
  }

  /**
   * 平均值
   * @param {Array} numbers 数字集合
   * @param {Object} options 参数对象
   */
  average(numbers, options = {}) {
    let numbersLen = numbers.length;
    if (numbersLen === 0) {
      return 0;
    } else {
      return this.sum(numbers) / numbersLen;
    }
  }

  /**
   * 最大值
   * @param {Array} numbers 数字集合
   * @param {Object} options 参数对象
   */
  max(numbers, options = {}) {
    return Math.max(...numbers);
  }

  /**
   * 最小值
   * @param {Array} numbers 数字集合
   * @param {Object} options 参数对象
   */
  min(numbers, options = {}) {
    return Math.min(...numbers);
  }

  /**
   * 计数
   * @param {Array} numbers 数字集合
   * @param {Object} options 参数对象
   */
  count(numbers, options = {}) {
    return numbers.length;
  }

  /**
   * 计数(去重)
   * @param {Array} numbers 数字集合
   * @param {Object} options 参数对象
   */
  norepeatCount(numbers, options = {}) {
    return _.uniq(numbers).length;
  }

  /**
   * 方差
   * @param {Array} numbers 数字集合
   * @param {Object} options 参数对象
   */
  variance(numbers, options = {}) {
    let mean = 0;
    let sum = 0;
    sum = this.sum(numbers);
    mean = sum / numbers.length;
    sum = 0;
    for (let i = 0; i < numbers.length; i++) {
      sum += Math.pow(numbers[i] - mean, 2);
    }
    return sum / numbers.length;
  }

  /**
   * 偏差
   * @param {Array} numbers 数字集合
   * @param {Object} options 参数对象
   * @return {Array}
   */
  deviations(numbers, options = {}) {
    let average = this.average(numbers);
    return numbers.map(function(x) {
      return x - average;
    });
  }

  /**
   * 标准差
   * @param {Array} numbers 数字集合
   * @param {Object} options 参数对象
   */
  standardDeviation(numbers, options = {}) {
    let deviations = this.deviations(numbers);
    return Math.sqrt(
      deviations.map(this.square.bind(this)).reduce(this.add.bind(this)) /
        (numbers.length - 1)
    );
  }

  /**
   * 中位数
   * @param {Array} numbers 数字集合
   * @param {Object} options 参数对象
   */
  median(numbers, options = {}) {
    let len = numbers.length;
    let orderNumbers;
    let idx;
    if (len === 0) {
      return 0;
    }
    orderNumbers = numbers.sort((x, y) => {
      return x - y > 0 ? 1 : x - y < 0 ? -1 : 0;
    });
    idx = Math.round(len / 2);
    if (len % 2 === 0) {
      return orderNumbers[idx - 1];
    } else {
      return orderNumbers[idx - 1] + orderNumbers[idx];
    }
  }

  /**
   * 导出csv文件
   * @param {Array} data 二维表数据 [[XX,XX...],[XX,XX...],[XX,XX...]]
   */
  exportCsv(data) {
    let strArr = [];
    let uri;
    let downloadLink;

    for (let i = 0, len = data.length; i < len; i++) {
      let row = data[i];
      strArr.push(row.join(",") + "\n");
    }

    // uri =
    //     "data:text/csv;charset=utf-8," +
    //     encodeURIComponent(strArr.join(""));
    // downloadLink = document.createElement("a");
    // downloadLink.href = uri;
    // downloadLink.download = "export.csv";
    // document.body.appendChild(downloadLink);
    // downloadLink.click();
    // document.body.removeChild(downloadLink);

    csv.download("export.csv", strArr.join(""));
  }

  /**
   * 格式化数字显示方式
   * 用法：
   * formatNumber(12345.999,'#,##0.00');
   * formatNumber(12345.999,'#,##0.##');
   * formatNumber(123,'000000');
   * @param {Number} num 要格式化的数字
   * @param {String} pattern 格式表达式
   */
  formatNumber(num, pattern) {
    let reg = /[-\.#0,]+/;
    let prefix, suffix;

    if (typeof num !== "number" || !reg.test(pattern)) {
      return num;
    }

    //百分数
    if (/^.+%+$/.test(pattern)) {
      return this.formatNumber(num * 100, pattern.replace(/%+$/, "")) + "%";
    }

    let match = pattern.split(reg);
    prefix = match[0] || "";
    suffix = match[1] || "";

    let strarr = num ? num.toString().split(".") : ["0"];
    let fmtarr = pattern ? pattern.split(".") : [""];
    let retstr = "";

    // 整数部分
    let str = strarr[0];
    let fmt = fmtarr[0];
    let i = str.length - 1;
    let comma = false;

    for (let f = fmt.length - 1; f >= 0; f--) {
      let ruleChar = fmt.substr(f, 1);
      switch (ruleChar) {
        case "#":
          if (i >= 0) {
            retstr = str.substr(i--, 1) + retstr;
          }
          break;
        case "0":
          if (i >= 0) {
            retstr = str.substr(i--, 1) + retstr;
          } else {
            retstr = "0" + retstr;
          }
          break;
        case ",":
          comma = true;
          retstr = "," + retstr;
          break;
      }
    }

    if (i >= 0) {
      if (comma) {
        let l = str.length;
        let lastNumIdx = str.indexOf("-") > -1 ? 1 : 0;
        for (; i >= 0; i--) {
          retstr = str.substr(i, 1) + retstr;
          if (i > lastNumIdx && (l - i) % 3 == 0) {
            retstr = "," + retstr;
          }
        }
      } else {
        retstr = str.substr(0, i + 1) + retstr;
      }
    }

    retstr = retstr + ".";

    // 处理小数部分
    str = strarr.length > 1 ? strarr[1] : "";
    fmt = fmtarr.length > 1 ? fmtarr[1] : "";
    i = 0;

    for (let f = 0; f < fmt.length; f++) {
      let ruleChar = fmt.substr(f, 1);
      switch (ruleChar) {
        case "#":
          if (i < str.length) {
            retstr += str.substr(i++, 1);
          }
          break;
        case "0":
          if (i < str.length) {
            retstr += str.substr(i++, 1);
          } else {
            retstr += "0";
          }
          break;
      }
    }

    return prefix + retstr.replace(/^,+/, "").replace(/\.$/, "") + suffix;
  }

  /**
   * rgb转换为16进制颜色值
   * @param {Number} r r色值
   * @param {Number} g g色值
   * @param {Number} b b色值
   */
  rgbToHex(r, g, b) {
    let aColor = [r, g, b];
    let strHex = "#";
    for (let i = 0; i < aColor.length; i++) {
      let hex = Number(aColor[i]).toString(16);
      if (hex.length < 2) {
        hex = "0" + hex;
      }
      strHex += hex;
    }
    return strHex;
  }

  /**
   * 16进制颜色值转换为rgb
   * @param {String} str 16进制颜色值字符串
   */
  hexToRgb(str) {
    let sColor = str.toLowerCase();
    //十六进制颜色值的正则表达式
    let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;

    // 如果是16进制颜色
    if (sColor && reg.test(sColor)) {
      if (sColor.length === 4) {
        var sColorNew = "#";
        for (var i = 1; i < 4; i += 1) {
          sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
        }
        sColor = sColorNew;
      }
      //处理六位的颜色值
      let sColorChange = [];
      for (let i = 1; i < 7; i += 2) {
        sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
      }
      return {
        r: sColorChange[0],
        g: sColorChange[1],
        b: sColorChange[2]
      };
    }
  }

  /**
   * 获取浏览器滚动条宽度
   */
  getScrollbarWidth() {
    // Create the measurement node
    let scrollDiv = document.createElement("div");
    scrollDiv.style.overflow = "scroll";
    document.body.appendChild(scrollDiv);

    // Get the scrollbar width
    let scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;

    // Delete the DIV
    document.body.removeChild(scrollDiv);
    return scrollbarWidth;
  }

  /**
   * 根据数据生成对应过渡色列表
   * @param {Array} data 数据集合
   * @param {Object|String} minColor 数据最小值对应色值
   * @param {Object|String} maxColor 数据最大值对应色值
   * @return {Object} 数据对应色值对象 {number:{r,g,b},...}
   */
  colorGradate(
    data = [],
    minColor = { r: 255, g: 255, b: 255 },
    maxColor = { r: 255, g: 0, b: 0 }
  ) {
    let dataLen = data.length;
    let colorMap = {};
    let valueMinus;

    if (typeof minColor === "string") {
      minColor = this.hexToRgb(minColor);
    }

    if (typeof maxColor === "string") {
      maxColor = this.hexToRgb(maxColor);
    }

    if (!minColor || !maxColor) {
      throw new Error("传人颜色值错误，请检查");
      return;
    }

    if (dataLen === 0) {
      return colorMap;
    }

    let colorMinus = {
      r: maxColor.r - minColor.r,
      g: maxColor.g - minColor.g,
      b: maxColor.b - minColor.b
    };
    let getColor = function(value, valueMinus) {
      let r, g, b;

      if (valueMinus === 0) {
        return maxColor;
      }

      r = minColor.r + Math.round((value * colorMinus.r) / valueMinus);
      g = minColor.g + Math.round((value * colorMinus.g) / valueMinus);
      b = minColor.b + Math.round((value * colorMinus.b) / valueMinus);

      return {
        r: r,
        g: g,
        b: b
      };
    };

    valueMinus = Math.max(...data) - Math.min(...data) + 1;

    for (let i = 0; i < dataLen; i++) {
      let value = data[i];
      if (typeof value !== "number") {
        continue;
      }
      if (!colorMap[value]) {
        colorMap[value] = getColor(value, valueMinus);
      }
    }

    return colorMap;
  }
}

const util = new Util();

export default util;
