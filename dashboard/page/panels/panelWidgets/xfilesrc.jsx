import React, { Component } from "react";
import axios from "axios";
import {
    Col,
    Row,
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

export default class PanelFileSource extends Component {
    constructor(props) {
        super(props);
        this.state = {
            treeData: [],
            iconLoading: false,
            spin: true,
            savePath: props.value || ""
        };
        this.folderTree = {};
        this.fileName = "";
        this.isAllowSubmit = true;
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            savePath: nextProps.value || ""
        });
    }
    componentWillMount() {
        this.setState({
            spin: true
        });
        this.fetchData();
    }

    fetchData() {
        axios({
            method: "get",
            url: this.props.options.src,
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
    loopTree(tree = [], ii) {
        // 递归创建tree的同时，将文件夹做key，文件做value，进行平行化
        return tree.map((el, i) => {
            //检查,去掉杂乱的数据
            if (el.file.folder == "false") {
                if (/^(?:\.cdfde|\.wcdf|\w+)$/.test(el.file.name)) {
                    return false;
                }
            }
            //文件夹
            if (el.file.folder == "true") {
                !this.folderTree[el.file.path] &&
                    (this.folderTree[el.file.path] = []);
            }
            //文件
            if (el.file.folder == "false") {
                //只记录.saiku的文件
                if (/.+\.(jpg|png|gif|bmp)$/.test(el.file.name)) {
                    let key = el.file.path.substring(
                        0,
                        el.file.path.indexOf(el.file.name) - 1
                    );
                    if (key) {
                        //保存文件名，不要后缀
                        this.folderTree[key].push(el.file.name);
                        //数组去重
                        this.folderTree[key] = [
                            ...new Set(this.folderTree[key])
                        ];
                    }
                }
            }
            return (
                <TreeNode title={el.file.title} key={el.file.path}>
                    {el.file.folder === "true" && el.children
                        ? this.loopTree(el.children, ii + "-" + i)
                        : null}
                </TreeNode>
            );
        });
    }
    onSelect(key, e) {
        if (!key[0]) return false;
        if (this.props.options.type === "image") {
            key[0] =
                "/filename/api/repos/" +
                key[0].replace(/\//g, ":") +
                "/content";
        }
        this.setState(
            {
                savePath: key[0]
            },
            () => {
                this.props.onChange(key[0]);
            }
        );
    }
    _onSelect(key) {
        this.setState(
            {
                savePath: key
            },
            () => {
                this.props.onChange(key);
            }
        );
    }
    render() {
        let haha = this.loopTree(this.state.treeData, 0);
        console.log(haha);
        let treeNode = haha.filter(el => {
            if (el) {
                return true;
            }
        });
        console.log(this.folderTree);
        return (
            <div
                className="panel-row"
                style={{
                    overflowX: "hidden",
                    overflowY: "auto",
                    height: "310px"
                }}
            >
                <Row
                    type="flex"
                    style={{ marginBottom: "15px" }}
                    align="middle"
                >
                    <Col span={6}>{this.props.name}</Col>
                    <Col span={18}>
                        <Input
                            value={this.state.savePath}
                            onChange={e => this._onSelect(e.target.value, e)}
                        />
                    </Col>
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
            </div>
        );
    }
}
