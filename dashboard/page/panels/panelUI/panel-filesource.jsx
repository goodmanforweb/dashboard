import React, { Component } from "react";
import axios from "axios";
import {
    Col,
    Row,
    Input,
    Select,
    Popover,
    Button,
    Icon,
    Popconfirm,
    Tree,
    message,
    Spin,
    Table
} from "antd";
const TreeNode = Tree.TreeNode;
const Option = Select.Option;
export default class PanelFileSource extends Component {
    constructor(props) {
        super(props);
        this.cmpInstId = this.props.router.data.id;
        this.init();
        this.state = {
            treeData: [],
            savePath: this.getFile(),
            iconLoading: false,
            spin: true,
            parameters: this.getCurrentInstance().cfg.chartDefinition.option
                .olapParameters
        };
        this.folderTree = {};
        this.fileName = "";
        this.isAllowSubmit = true;
    }
    init() {
        this.initListener();
    }
    initListener() {
        if (!this.getCurrentInstance().hasListener("olapParameters")) {
            this.getCurrentInstance().subscribe(
                "olapParameters",
                this.processOlapParameters.bind(this)
            );
        }
    }
    //销毁组件 是 先 组件实例，在销毁组件ui
    componentWillUnmount() {
      this.getCurrentInstance() && this.getCurrentInstance().unsubscribe("olapParameters");
    }
    processOlapParameters(parameters) {
        this.setState({
            parameters: parameters
        });
    }
    getFile() {
        return this.getCurrentInstance().cfg.chartDefinition.option.file;
    }
    componentWillReceiveProps(nextProps) {
        this.cmpInstId = nextProps.router.data.id;
        this.setState({
            savePath: this.getFile(),
            parameters: this.getCurrentInstance().cfg.chartDefinition.option.olapParameters
        });
        this.initListener();
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

    fetchData() {
        axios({
            method: "get",
            url:
                "/filename/api/repo/files/tree?showHidden=true&filter=*.saiku|FILES&_=1389042244670",
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
        if (data.children) {
            this.setState({
                treeData: data.children || [],
                spin: false
            });
        }
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
                if (/.+\.saiku$/.test(el.file.name)) {
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

                // return <TreeNode title={el.file.title} key={el.file.path} >{el.children ? this.loopTree(el.children, ii+'-'+i) : null}</TreeNode>
            } // return <TreeNode key={el.file.path}>2332</TreeNode>
            // return el.file.folder == 'true' ? <TreeNode title={el.file.title} key={el.file.path} >{el.children ? this.loopTree(el.children, ii+'-'+i) : null}</TreeNode> : null;
            // return  el.file.folder === 'true' && el.children ? this.loopTree(el.children, ii+'-'+i) : el.file.title ;
            return (
                <TreeNode title={el.file.title} key={el.file.path}>
                    {el.file.folder === "true" && el.children
                        ? this.loopTree(el.children, ii + "-" + i)
                        : null}
                </TreeNode>
            );
        });
    }
    getCurrentInstance() {
        return window.Dashboard.compManager.getComponent(this.cmpInstId);
    }
    getGlobalParams() {
        return window.Dashboard.globalParam.params.container;
    }
    onSelect(key, e) {
        if (!key[0]) return false;
        this.setState(
            {
                savePath: key[0]
            },
            () => {
                // 每次切换数据源 ，需要 对 下面这两个 进行重置，只能在这里重置
                this.getCurrentInstance().update({
                    file: key[0],
                    olapParameters: [],
                    listeners: [],
                    currentOlapStatus: 'filesouceChange'
                });
            }
        );
    }
    onOlapParametersChange(id, record, index) {
        let newParameters = this.state.parameters.slice(0);
        newParameters[record.key].value = id;

        this.setState(
            {
                parameters: newParameters
            },
            () => {
                this.getCurrentInstance().update({
                    olapParameters: newParameters,
                    currentOlapStatus: 'parametersChange'
                });
            }
        );
    }
    render() {
        let haha = this.loopTree(this.state.treeData, 0);
        let treeNode = haha.filter(el => {
            if (el) {
                return true;
            }
        });
        let columns = [
            {
                title: "名称",
                dataIndex: "name",
                key: "name",
                width: "25%"
            },
            {
                title: "值",
                dataIndex: "value",
                key: "value",
                render: (v, record, index) => (
                    <Select
                        value={v}
                        onChange={e =>
                            this.onOlapParametersChange(e, record, index)
                        }
                        style={{ width: "100%" }}
                    >
                        {this.getGlobalParams().map((param, i) => (
                            <Option key={i} value={param.id}>
                                {param.name}
                            </Option>
                        ))}
                    </Select>
                )
            }
        ];
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
                        <Input value={this.state.savePath} readOnly />
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
                {this.state.parameters.length ? (
                    <div className="param-row">
                        <Row
                            type="flex"
                            style={{ margin: "15px 0" }}
                            align="middle"
                        >
                            <Col span={24}>参数查询</Col>
                        </Row>
                        <Row
                            type="flex"
                            style={{ marginBottom: "15px" }}
                            align="middle"
                        >
                            <Col span={24}>
                                <Table
                                    columns={columns}
                                    dataSource={this.state.parameters}
                                    bordered
                                    pagination={false}
                                />
                            </Col>
                        </Row>
                    </div>
                ) : null}
            </div>
        );
    }
}
