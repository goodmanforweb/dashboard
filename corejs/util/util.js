import _ from "lodash";
import "corejs/resource/style/font-awesome.css";
import canvg from "corejs/resource/js/canvg";
// import domtoimage from "dom-to-image";
// import html2canvas from "html2canvas";
import $ from "jquery";

const html2canvas = require("corejs/resource/js/html2canvas");
const domtoimage = require("corejs/resource/js/domtoimage");
class Util {
    constructor() {
        this._ = _;
    }
    //拷贝函数  复制的JQ
    copy() {
        var options,
            name,
            src,
            copy,
            copyIsArray,
            clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;
        if (typeof target === "boolean") {
            deep = target;
            target = arguments[1] || {};
            i = 2;
        }
        if (
            typeof target !== "object" &&
            this.getObjtype(target) != "Function"
        ) {
            target = {};
        }
        if (length === i) {
            target = this;
            --i;
        }
        for (; i < length; i++) {
            if ((options = arguments[i]) != null) {
                for (name in options) {
                    src = target[name];
                    copy = options[name];
                    if (target === copy) {
                        continue;
                    }
                    if (
                        deep &&
                        copy &&
                        (this.getObjtype(copy) === "Object" ||
                            (copyIsArray = this.getObjtype(copy) === "Array"))
                    ) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone =
                                src && this.getObjtype(copy) === "Array"
                                    ? src
                                    : [];
                        } else {
                            clone =
                                src && this.getObjtype(copy) === "Object"
                                    ? src
                                    : {};
                        }
                        target[name] = this.copy(deep, clone, copy);
                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }
        return target;
    }
    copyReference(source) {
        let temp = Array.isArray(source) ? new Array() : {},
            util = window.Dashboard.util;
        for (let i in source) {
            // if(i.toLowerCase().indexOf('data') > -1)
            if (source.hasOwnProperty(i) && util.type(source[i]) == "Object") {
                temp[i] = util.copyReference(source[i]);
                //arguments.callee(source[i])
            } else if (source.hasOwnProperty(i) && Array.isArray(source[i])) {
                temp[i] = new Array();
                source[i].forEach(el => {
                    typeof el != "object"
                        ? temp[i].push(el)
                        : temp[i].push(util.copyReference(el));
                });
            } else {
                temp[i] = source[i];
            }
        }
        return temp;
    }
    deepAssign(ld, nw) {
        for (let i in nw) {
            if (
                this.type(ld[i]) == "Undefined" ||
                ld[i] == "" ||
                ld[i] == null ||
                this.type(ld[i]) != this.type(nw[i])
            ) {
                ld[i] = nw[i];
            } else {
                if (this.type(nw[i]) == "Object") {
                    this.deepAssign(ld[i], nw[i]);
                } else {
                    ld[i] = nw[i];
                }
            }
        }
        return ld;
    }
    type(t) {
        var p = {}.toString.call(t);
        var typeObj = {
            "[object Object]": "Object",
            "[object Array]": "Array",
            "[object Number]": "Number",
            "[object String]": "String",
            "[object Function]": "Function",
            "[object Boolean]": "Boolean",
            "[object Null]": "Null",
            "[object Undefined]": "Undefined"
        };
        return typeObj[p] ? typeObj[p] : false;
    }
    //获取对象类型
    getObjtype(obj) {
        return Object.prototype.toString.call(obj).slice(8, -1);
    }
    //获取集合下标
    getInd(arr, type, target) {
        let ind = -1;
        arr.forEach((e, i) => {
            if (e[type] === target) {
                ind = i;
            }
        });
        return ind;
    }
    //代码注入
    execRun(code) {
        if (!code) return false;
        try {
            return new Function(code);
        } catch (error) {
            console.warn("something wrong:( here: %s", code);
        }
    }
    //生成数字+字母的长度为4的字符串
    S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    //保存成图片 下载  node为膜表dom
    downToPngPromise(node, name) {
        return new Promise((resolve, reject) => {
            this.downToPng(node, name, resolve);
        });
    }
    //url 转化为 blob
    dataURLtoBlob(dataurl) {
        var arr = dataurl.split(","),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    }

    //压缩图片
    compressImg(node, blob, callback) {
        let _canvas = document.createElement("canvas");
        var width = node.offsetWidth;
        var height = node.offsetHeight;
        _canvas.width = 300;
        _canvas.height = (300 / width) * height;
        let _ctx = _canvas.getContext("2d");
        let _image = new Image();
        _image.onload = () => {
            _ctx.drawImage(
                _image,
                0,
                0,
                width,
                height,
                0,
                0,
                300,
                (300 / width) * height
            );
            _ctx.scale(1, 1);
            var url = _canvas.toDataURL();
            let _blob = window.Dashboard.util.dataURLtoBlob(url);
            callback(_blob);
        };
        _image.src = window.URL.createObjectURL(blob);
    }
    /**
     * 下载图片
     * @param {*} node 需要的dom
     * @param {*} name 图片名字
     * @param {*} resolve 非必要参数  promise的resolve
     */
    downToPng(node, name, resolve) {
        //兼容IE
        // node = document.querySelector("#background-container");
        var _this = this;
        if (window.navigator.msSaveOrOpenBlob) {
            var shareContent = node;
            var width = shareContent.offsetWidth;
            var height = shareContent.offsetHeight;
            var canvas = document.createElement("canvas");
            var scale = 1;

            canvas.width = width * scale;
            canvas.height = height * scale;
            canvas.getContext("2d").scale(scale, scale);

            var opts = {
                scale: scale,
                canvas: canvas,
                logging: true,
                width: width,
                height: height,
                useCORS: true,
                foreignObjectRendering: true,
                allowTaint: false
            };
            if (typeof html2canvas !== "undefined") {
                Object.defineProperty(SVGElement.prototype, "outerHTML", {
                    get: function() {
                        var $node, $temp;
                        $temp = document.createElement("div");
                        $node = this.cloneNode(true);
                        $temp.appendChild($node);
                        return $temp.innerHTML;
                    },
                    enumerable: false,
                    configurable: true
                });
                //以下是对svg的处理
                var nodesToRecover = [];
                var nodesToRemove = [];
                var svgElem = [...node.querySelectorAll("svg")]; //divReport为需要截取成图片的dom的id
                svgElem.forEach(function(node, index) {
                    console.log(node.outerHTML, "node");
                    var parentNode = node.parentNode;
                    var svg = node.outerHTML.trim();
                    var canvas = document.createElement("canvas");
                    canvg(canvas, svg);
                    if (node.style.position) {
                        canvas.style.position += node.style.position;
                        canvas.style.left += node.style.left;
                        canvas.style.top += node.style.top;
                    }

                    nodesToRecover.push({
                        parent: parentNode,
                        child: node
                    });
                    parentNode.removeChild(node);

                    nodesToRemove.push({
                        parent: parentNode,
                        child: canvas
                    });

                    parentNode.appendChild(canvas);
                });
            }

            html2canvas(shareContent, opts).then(function(canvas) {
                var url = canvas.toDataURL();
                var blob = _this.dataURLtoBlob(url);
                if (resolve) {
                    resolve(blob);
                } else {
                    window.navigator.msSaveOrOpenBlob(blob, name + ".png");
                }
            });
        } else {
            domtoimage
                .toBlob(node)
                .then(function(blob) {
                    if (resolve) {
                        resolve(blob);
                    } else {
                        var link = document.createElement("a");
                        link.href = window.URL.createObjectURL(blob);
                        link.download = name + ".png";
                        document.querySelector("body").appendChild(link);
                        link.click();
                        link.remove();
                    }
                    //window.URL.revokeObjectURL(link.href);
                })
                .catch(function(error) {
                    console.error("oops, something went wrong!", error);
                });
        }
    }

    generateGUID() {
        return (
            this.S4() +
            this.S4() +
            "-" +
            this.S4() +
            "-" +
            this.S4() +
            "-" +
            this.S4() +
            "-" +
            this.S4() +
            this.S4() +
            this.S4()
        );
    }
    /**
     * 找到数组中相同的元素
     * @param {*} arr
     */
    findSame(arr) {
        if (arr.length == 0 || !arr) return fasle;
        let same = [],
            temp = {};
        arr.forEach(el => {
            if (!temp[el]) {
                temp[el] = true;
            } else {
                same.push(el);
            }
        });
        return same;
    }
    /**
     * 查看两个数组中相同的元素
     * @param {array} arr1
     * @param {array} arr2
     */
    findSameFromArrs(arr1, arr2) {
        return arr1.filter(el => {
            if (arr2.indexOf(el) > -1) {
                return true;
            }
            return false;
        });
    }
    urlParse(name, search) {
        search = search || "hash";
        let reg = new RegExp("(^|\\?|&)" + name + "=([^&]*)(\\s|&|$)", "i");
        let r = window.location[search].substr(1).match(reg);
        if (r != null) return decodeURIComponent(r[2]);
        return null;
    }
    single(fn) {
        let ret;
        return function() {
            return ret || (ret = fn.apply(this, arguments));
        };
    }

    //延时触发   函数防抖
    delayChange(callback, delay, self = {}) {
        let time = null;
        return (...param) => {
            console.log(param);
            clearTimeout(time);
            time = setTimeout(() => {
                callback.apply(self, param);
            }, delay);
        };
    }
    /**
     * 颜色转换
     * @param {*} hex 16进制字符串
     * @param {*} opacity 透明度
     */
    hexToRgba(hex, opacity = 1) {
        return (
            "rgba(" +
            parseInt("0x" + hex.slice(1, 3)) +
            "," +
            parseInt("0x" + hex.slice(3, 5)) +
            "," +
            parseInt("0x" + hex.slice(5, 7)) +
            "," +
            opacity +
            ")"
        );
    }
    /**
     * 错误提示
     * @param {*} type 类型
     * @param {*} info 信息
     */
    popTips(type, info) {
        const typeArr = {
            INFO: "fa fa-info-circle",
            SUCCESS: "fa fa-check-circle",
            WARING: "fa fa-dot-circle-o",
            ERROR: "fa fa-times-circle"
        };
        if (popTips) {
            myTips.remove();
            clearTimeout(timer);
            document.getElementsByClassName("myTips").innerHTML =
                "<span class='" +
                typeArr[type] +
                "'></span><span>" +
                info +
                "</span>";
            popTips = true;
            timer = timer;
        } else {
            var myTips = document.createElement("div");
            myTips.setAttribute("class", "myTips");
            myTips.innerHTML =
                "<span class='" +
                typeArr[type] +
                "'></span><span>" +
                info +
                "</span>";
            document.body.append(myTips);
            var popTips = true;
            var timer = setTimeout(function() {
                myTips.remove();
                clearTimeout(timer);
                popTips = false;
            }, 2000);
        }
    }
}

export default new Util();
