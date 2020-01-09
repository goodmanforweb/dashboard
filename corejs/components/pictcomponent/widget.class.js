import WidgetBase from "corejs/components/base";
import $ from "jquery";

export default class Pictcomponent extends WidgetBase {
    static cname = "图片";
    constructor(htmlObj, cfg) {
        super(htmlObj, cfg);
    }
    widgetWillCreated(cfg) {
        super.widgetWillCreated(cfg);
        this.div = document.createElement("div");

        this.$div = $(this.div);
        this.$div.css({
            // backgroundColor: "inherit",
            width: "100%",
            height: this.rawhtmlObj.clientHeight,
            position: "relative"
        });
        this.handleDefinition(cfg.chartDefinition);

        return (this.rootDom = this.div);
    }
    handleDefinition(nextCfg) {
        for (let cname in nextCfg) {
            this.dispatchDefinition(cname, nextCfg[cname]);
        }
    }
    dispatchDefinition(type, value) {
        switch (type) {
            case "option":
                this.handleDefinition(value);
                break;
            case "backgroundColor":
                this.htmlObj.style.backgroundColor = value;
                if(this.cfg.parentId){
                    this.htmlObj.style.backgroundColor = "rgba(0, 0, 0, 0)";
                    this.cfg.chartDefinition.option[type] = "rgba(0, 0, 0, 0)";
                }
                break;
            case "fileSrc":
                // $(this.img).attr("src", value);
                this._image = new Image();
                this._image.src = value;
                this.$div.css({
                    backgroundImage: "url(" + value + ")",
                    backgroundRepeat: "no-repeat"
                });
                break;
            /* case "imgPosition":
                this._handlePos(value);
                break; */
            default:
                break;
        }
    }
    /*
        { name: "居中", value: "center" },
        { name: "拉伸", value: "caver" },
        { name: "填充", value: "scale" },
        { name: "平铺", value: "flat" }
    */
    _handlePos(value) {
        switch (value) {
            case "center":
                this.$div.css({
                    backgroundPosition: "center center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "auto"
                });
                break;
            case "caver":
                this.$div.css({
                    backgroundPosition: "center center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "100% 100%"
                });
                break;
            case "scale":
                var h = this.rawhtmlObj.clientHeight,
                    w = this.rawhtmlObj.clientWidth,
                    imgH = this._image.height,
                    imgW = this._image.width,
                    _size = 0,
                    size = "";
                if (h > w) {
                    _size = h / imgH;
                    size = imgW * _size / w * 100 + "% 100%";
                } else {
                    _size = w / imgW;
                    size = "100% " + imgH * _size / h * 100 + "%";
                }
                this.$div.css({
                    backgroundPosition: "top left",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: size
                });
                break;
            case "flat":
                this.$div.css({
                    backgroundPosition: "top left",
                    backgroundRepeat: "repeat",
                    backgroundSize: "auto"
                });
                break;
            default:
                break;
        }
    }
    widgetDidCreated(cfg) {
        super.widgetDidCreated(cfg);
        console.log("widgetDidCreated");
        this.htmlObj.appendChild(this.div);
    }
    preUpdate(nextCfg) {
        super.preUpdate(nextCfg);
        console.log("preUpdate", nextCfg);
        this.handleDefinition(nextCfg);
    }
    postUpdate(nextCfg) {
        super.postUpdate(nextCfg);
        console.log("postUpdate");
    }
    draw() {
        this.$div.css({
            height: this.rawhtmlObj.clientHeight
        });
        let { imgPosition } = this.cfg.chartDefinition.option;
        this._handlePos(imgPosition);
    }
    destroy() {}
}
