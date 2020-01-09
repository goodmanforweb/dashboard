import React, { Component } from "react";
import UIutil from "./util";

class AppHandle extends Component {
    constructor(props) {
        super(props);
        this.init();
    }
    init() {
        this.initPanelListener();
        UIutil.themeListener();
    }
    /**
  模式           type   path   控制面板
  直接编辑模式   无      无      有
  再编辑模式    2       有       有
  临时预览模式  1       有       无
  单纯浏览模式   0      有       无
  */
    // 这里只关心 有没有面板
    checkMode() {
        let urlParse = window.Dashboard.util.urlParse;
        if (!urlParse("path") && !urlParse("type")) {
            // 是直接编辑模式
            return false;
        } else if (urlParse("path") && urlParse("type") == 2) {
            //是再编辑模式
            return false;
        }
        return true;
    }
    //事件监听
    initPanelListener() {
        //挂载window的resize事件  延时触发500ms, 并抛出resize 自定义事件，方便其他地方订阅
        window.addEventListener(
            "resize",
            window.Dashboard.util.delayChange(
                () => {
                    if (this.state.width === "auto" || !this.state.width) {
                        this.setState({ resize: +new Date() });

                        //并抛出resize 自定义事件，方便其他地方订阅
                        window.Dashboard.event.dispatch("windowResize", {});
                        window.Dashboard.compManager.components.forEach(
                            cmpInstance =>
                                (cmpInstance.resizeState = "resizing")
                        );
                    } else {
                        if (this.state.editeMode) {
                            document.querySelector(
                                ".layout-Contentbb"
                            ).style.height =
                                document.body.clientHeight + "px";
                            window.Dashboard.event.dispatch(
                                "bigsmollresize",
                                {}
                            );
                        }
                    }
                },
                300,
                this
            )
        );
        //挂载宽度监听
        window.Dashboard.event.subscribe("globalParam", globalParam =>
            this.setState({ width: globalParam.globelProps.width })
        );
    }
    //设置宽度
    setWidth(value) {}
    //设置高度
}
export default AppHandle;
