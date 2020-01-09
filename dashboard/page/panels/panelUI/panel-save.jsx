import React, { Component } from "react";
import axios from "axios";
import submit from "submit/index";
import {
    Col,
    Row,
    Radio,
    Slider,
    Table,
    Input,
    Popover,
    Button,
    Icon,
    Popconfirm,
    Tree,
    message,
    Spin
} from "antd";
const TreeNode = Tree.TreeNode;

class PanelSave extends Component {
    constructor(props) {
        super(props);
        this.init();
        this.state = {
            treeData: [],
            savePath: this.saveInfo().path,
            iconLoading: false,
            spin: true
        };
        this.folderTree = {};
        this.fileName = this.saveInfo().name;
        this.isAllowSubmit = true;
    }
    init() {
        this.saveInfo = this.getSaveInfo();
    }
    componentWillMount() {
        this.setState({
            spin: true
        });
        this.fetchData();
    }
    componentWillUpdate() {}
    componentDidUpdate() {
        console.log(this.folderTree);
    }
    getSaveInfo() {
        let info = window.Dashboard.globalParam.globalParam.saveInfo;
        return function() {
            return info;
        };
    }
    setSaveInfo(newInfo) {
        return Object.assign(
            window.Dashboard.globalParam.globalParam.saveInfo,
            newInfo
        );
    }
    fetchData() {
        let ifhide = false;
        if (
            JSON.parse(localStorage.getItem("userSetting")) &&
            JSON.parse(localStorage.getItem("userSetting")).ifhide
        ) {
            ifhide = JSON.parse(localStorage.getItem("userSetting")).ifhide;
        }
        axios({
            method: "get",
            url:
                "/filename/api/repo/files/tree?showHidden=" +
                ifhide +
                "&filter=*|FILES&_=1389042244670",
            responseType: "json",
            headers: {
                "content-type":
                    "application/x-www-form-urlencoded; charset=UTF-8",
                Accept: "application/json"
            }
        }).then(response => {
            if (response.status == 200) {
                this.handleData(response.data);
            }
        });
    }
    handleData(data) {
        this.setState({
            treeData: data.children,
            spin: false
        });
    }
    loopTree(tree, ii) {
        // 递归创建tree的同时，将文件夹做key，文件做value，进行平行化
        return tree.map((el, i) => {
            //文件夹
            if (el.file.folder == "true") {
                !this.folderTree[el.file.path] &&
                    (this.folderTree[el.file.path] = []);
            }
            //文件
            if (el.file.folder == "false") {
                let key = el.file.path.substring(
                    0,
                    el.file.path.indexOf(el.file.name) - 1
                );
                if (key) {
                    //保存文件名，不要后缀
                    this.folderTree[key].push(el.file.name.split(".")[0]);
                    //数组去重
                    this.folderTree[key] = [...new Set(this.folderTree[key])];
                }
            }
            // return <TreeNode key={el.file.path}>2332</TreeNode>

            return el.file.folder == "true" ? (
                <TreeNode title={el.file.title} key={el.file.path}>
                    {el.children
                        ? this.loopTree(el.children, ii + "-" + i)
                        : null}
                </TreeNode>
            ) : null;
        });
    }
    onSelect(key, e) {
        this.setState({
            savePath: key[0]
        });
        this.isAllowSubmit = this.checkNameGood(this.fileName, key[0]);
    }
    checkNameGood(name, path) {
        if (!name || !path) return null;
        //检查名字是否重复
        if (this.folderTree[path]) {
            if (this.folderTree[path].indexOf(name) > -1) {
                message.warning("文件名重复, 提交将覆盖");
                // return false;
            }
        }
        if (
            /* name.indexOf("/") > -1 || name.indexOf("\\") > -1 */ [
                "/",
                "\\",
                "%"
            ].find(e => name.indexOf(e) > -1)
        ) {
            message.warning("文件名不能含有'/'、'\\','%'");
            return false;
        }
        return true;
    }
    fileNameChange(e) {
        this.fileName = e.target.value;
        this.isAllowSubmit = this.checkNameGood(
            this.fileName,
            this.state.savePath
        );
    }
    backtoActiveBeforeSubmit() {
        const { state, dispatch } = this.props;
        const panelCacheID = state.panelCache;

        dispatch({
            type: "updataComponentActive",
            value: {
                id: panelCacheID ? panelCacheID : "canvas",
                data: { base: { state: "active" } }
            }
        });
    }

    dashboardSubmit(type, e) {
        //util工具
        const _util = window.Dashboard.util;

        if (type == "cancel") {
            // this.backtoActiveBeforeSubmit();
        } else {
            //reduce数据转换处理
            if (this.isAllowSubmit) {
                this.setState({
                    iconLoading: true
                });
                this.setSaveInfo({
                    path: this.state.savePath,
                    name: this.fileName
                });
                let dform = new FormData();

                dform.append(
                    "file",
                    `${this.state.savePath}/${this.fileName}.xdf`
                );
                dform.append("operation", "saveas");
                let dsh = new submit();
                dsh.init();
                dform.append("cdfstructure", JSON.stringify(dsh, "", 1));

                let node = document.querySelector("#background-container");
                let name = "娃哈哈";
                _util.downToPngPromise(node, name).then(blob => {
                    var callback = _blob => {
                        console.log(_blob);
                        dform.append("thumbnail", _blob);
                        this.submit(dform).then(() => {
                            message.success("提交成功 :)");
                        });
                    };
                    _util.compressImg(node, blob, callback);
                });
                /* this.submit(dform).then(() => {
                    message.success("提交成功 :)");

                    this.setSaveInfo({
                        path: this.state.savePath,
                        name: this.fileName
                    });
                }); */
            }
        }
    }
    submit(dform) {
        return new Promise((resolve, reject) => {
            axios({
                method: "post",
                url: "/filename/plugin/xdf/api/dashboard/saveDashboard",
                data: dform,
                responseType: "json",
                headers: {
                    "content-type":
                        "application/x-www-form-urlencoded; charset=UTF-8",
                    Accept: "application/json"
                }
            })
                .then(response => {
                    console.log(response);
                    // if(response.status == 200) {
                    //   this.handleData(response.data);
                    // }
                    this.setState({
                        iconLoading: false
                    });
                    resolve();
                })
                .catch(error => {
                    this.setState({
                        iconLoading: false
                    });
                    reject();
                });
        });
    }
    render() {
        let treeNode = this.loopTree(this.state.treeData, 0).filter(el => {
            if (el) {
                return true;
            }
        });
        return (
            <div
                className="panel-row"
                style={{
                    overflowX: "hidden",
                    overflowY: "auto",
                    height: window.innerHeight - 75 + "px"
                }}
            >
                <Row
                    type="flex"
                    style={{ marginBottom: "15px" }}
                    align="middle"
                >
                    <Col span={6}>文件名</Col>
                    <Col span={18}>
                        <Input
                            defaultValue={this.fileName}
                            onChange={e => this.fileNameChange(e)}
                        />
                    </Col>
                </Row>
                <Row type="flex" style={{ marginBottom: "15px" }}>
                    <Col span={6}>保存位置</Col>
                    <Col span={18}>{this.state.savePath}</Col>
                </Row>
                <Spin tip="Loading" spinning={this.state.spin}>
                    <div
                        style={{
                            border: "1px solid #d9d9d9",
                            padding: "8px",
                            height: "250px",
                            overflow: "auto",
                            borderRadius: "4px",
                            backgroundColor: "white"
                        }}
                    >
                        <Tree onSelect={(key, e) => this.onSelect(key, e)}>
                            {treeNode}
                        </Tree>
                    </div>
                </Spin>

                <div>
                    <Row type="flex" style={{ margin: "80px 0 15px" }}>
                        <Col span={12} style={{ textAlign: "right" }}>
                            <Button
                                icon="close"
                                onClick={e => this.dashboardSubmit("cancel", e)}
                            >
                                取消
                            </Button>
                        </Col>
                        <Col span={12} style={{ textAlign: "right" }}>
                            <Button
                                icon="check"
                                type="primary"
                                loading={this.state.iconLoading}
                                onClick={e => this.dashboardSubmit("submit", e)}
                            >
                                提交
                            </Button>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

export default PanelSave;
