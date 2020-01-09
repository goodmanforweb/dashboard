import axios from "axios";
import { Modal, Button, message } from "antd";
const confirm = Modal.confirm;

/**
  模式           type   path   控制面板
  直接编辑模式   无      无      有
  再编辑模式    2       有       有
  临时预览模式  1       有       无
  单纯浏览模式   0      有       无
  */

class reEdite {
    static listenHashChange = false;
    constructor() {
        this.path = "";
    }
    getPath() {
        let urlParse = window.Dashboard.util.urlParse;
        let path = urlParse("path"),
            type = urlParse("type");
        //设置默认值
        window.dashboardMode = {
            name: "edite",
            type
        };
        if (!path) return null;
        if (type === null) {
            type = 0;
        }

        this.path = path;
        this.type = type;
        //同时保存模式到window下，方便其他地方使用
        window.dashboardMode = {
            name: ["preview", "preview", "edite"][type],
            type
        };
        return this;
    }
    getRedux() {
        if (this.type == 1) {
            //是临时预览模式
            let storage = sessionStorage.getItem(this.path);
            if (storage) {
                return Promise.resolve(JSON.parse(storage));
            } else {
                Promise.reject("localstorage has no such data:(");
            }
        } else if (this.type == 0 || this.type == 2) {
            //单纯浏览模式 或者  再编辑模式   这两种模式 都需要 重新获取数据
            return new Promise((resolve, reject) => {
                axios({
                    method: "get",
                    url: `/filename/api/repos/${this.path.replace(
                        /\//g,
                        ":"
                    )}.xdf/structure`,
                    responseType: "json",
                    headers: {
                        "content-type":
                            "application/x-www-form-urlencoded; charset=UTF-8",
                        Accept: "application/json"
                    }
                })
                    .then(response => {
                        if (response.status == 200) {
                            resolve(response.data);
                        }
                    })
                    .catch(error => {
                        console.log(error);
                        this.removePath();
                        reject(error);
                    });
            });
        } else {
            console.log("path is null");
            return Promise.resolve(null);
        }
    }
    setRedux(store, data) {
        let { components, datasources, globalParam, filename } = data;
        let dash = window.Dashboard;
        //恢复全局参数数据
        dash.globalParam.addParams(globalParam.params);
        dash.globalParam.globalParam.theme = globalParam.theme;
        //触发主题更新
        window.Dashboard.event.dispatch("themeChange", globalParam.theme);
        //重新编辑的保存地址 以浏览器打开的为准
        let s = this.path.split('/');
        let saveInfo = {
          name:s.pop(),
          path: s.join('/')
        };
        dash.globalParam.globalParam.saveInfo = Object.assign(globalParam.saveInfo, saveInfo);
        dash.globalParam.globalParam.cssAndJs = globalParam.cssAndJs;
        dash.globalParam.globalParam.globelProps = globalParam.globelProps;
        dash.globalParam.globalParam.freshPeriod = globalParam.freshPeriod;
        //抛出参数变化 事件
        window.Dashboard.event.dispatch("globalParam", globalParam);

        //如果是预览模式,打开，注入全局css js 代码
        if (this.type == 1 || this.type == 0) {
            //注入css
            let style = document.createElement("style");
            style.setAttribute("name", "custom");
            style.innerHTML = globalParam.cssAndJs.cssCode;
            document.head.appendChild(style);
            //注入js
            let script = document.createElement("script");
            script.setAttribute("name", "custom");
            script.innerHTML = globalParam.cssAndJs.jsCode;
            document.body.appendChild(script);
        }
        //恢复组件展示
        window.Dashboard.event.dispatch("reEditeComponents", components);

        //
    }
    removePath() {
        // window.location.hash = '';
        return this;
    }
    //只监听 path=sdfsadfa 这种类型
    addHashChange(callback) {
        window.onhashchange = e => {
            reEdite.listenHashChange = true;
            callback &&
                /^#path=(.+?)$/gi.test(window.location.hash) &&
                callback();
        };
    }
}
const modalError = () => {
    Modal.error({
        title: "错误",
        content: "无法打开此文件，该文件可能被其它工具修改",
        okText: "确定"
    });
};
const restore = (reEditeObj, store) => {
    if (reEditeObj.path) {
        reEditeObj
            .getRedux()
            .then(redux_data => {
                try {
                    if (!redux_data) {
                        modalError();
                    } else {
                        reEditeObj.setRedux(store, redux_data);
                    }
                } catch (error) {
                    modalError();
                    // message.warn('数据格式错误，编辑失败:(');
                }
            })
            .catch(() => {
                modalError();
            });
    } else {
        reEditeObj.removePath();
    }
};

const reEditeInstance = store => {
    const reEditeObj = new reEdite();
    reEditeObj.getPath();
    restore(reEditeObj, store);
    reEditeObj.addHashChange(() => {
        reEditeObj.getPath();
        restore(reEditeObj, store);
    });
};

export default reEditeInstance;
