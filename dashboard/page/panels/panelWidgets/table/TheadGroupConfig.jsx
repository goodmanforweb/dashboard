/**
 *  表格表头分组配置
 * author:twy
 * 2018/5/15
 */
import React, { Component } from "react";
import { Row, Col, Switch, Table, Input, Select, Button } from "antd";
import $ from "jquery";

const Option = Select.Option;

// name, icons, defaultValue, value, onChange
export default class TheadGroupConfig extends Component {
    constructor(props) {
        super(props);
        let state = Object.assign(
            {
                open: false,
                config: [
                    // {
                    //     key: 0,
                    //     title: "",
                    //     start: null,
                    //     end: null,
                    //     startOptions:[],
                    //     endOptions:[]
                    // }
                ]
            },
            props.value || {}
        );

        this.props = props;
        this.state = state;
        this.tableIns = props.inst;
        this.columns = this.getColumns();

        this.refreshOptions(state.config);

        this.deleteRow = this.deleteRow.bind(this);
        this.addRow = this.addRow.bind(this);
        this.handelOpenChange = this.handelOpenChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        let config = nextProps.value.config;
        this.refreshOptions(config);
        this.setState({
            open: nextProps.value.open,
            config: config
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (
            _.isEqual(nextState, this.state) &&
            nextProps.value == this.state.value &&
            nextProps.name == this.props.name
        ) {
            return false;
        }
        return true;
    }

    getColumns() {
        let metadata = this.tableIns.cfg.chartDefinition.data.metadata || [];

        return metadata.map(item => {
            return {
                name: item.colIndex + " " + item.colName,
                value: item.colIndex
            };
        });
    }

    handelOpenChange(e) {
        this.setState({
            open: e
        });
        this.triggerOnchange({
            open: e,
            config: this.state.config
        });
    }

    deleteRow(index) {
        let config = $.extend(true, [], this.state.config);
        config.splice(index, 1);

        this.refreshOptions(config);

        this.setState({
            config: config
        });
        this.triggerOnchange({
            open: this.state.open,
            config: config
        });
    }

    addRow() {
        let config = $.extend(true, [], this.state.config);
        let options = config.length === 0 ? this.columns : [];

        config.push({
            title: "",
            start: null,
            end: null,
            options: options
        });

        this.refreshOptions(config);

        config.forEach((v, i) => {
            v.key = i;
        });

        this.setState({
            config: config
        });
    }

    handleChange(index, key, value) {
        let config = $.extend(true, [], this.state.config);

        config[index][key] = value;

        this.refreshOptions(config);

        this.setState({
            config: config
        });

        this.triggerOnchange({
            open: this.state.open,
            config: config
        });
    }

    triggerOnchange(theadGroup) {
        theadGroup.config = theadGroup.config.map(v => {
            return {
                title: v.title,
                start: v.start,
                end: v.end
            };
        });
        this.props.onChange && this.props.onChange(theadGroup);
    }

    //刷新options
    refreshOptions(config) {
        let columns = this.columns;
        let len = config.length;

        config = config || this.state.config;

        function setStartOptions(idx, item, preItem) {
            let options = [];
            let columnIds;
            if (idx === 0) {
                options = columns;
            }
            if (preItem) {
                let preEnd = preItem.end;
                preEnd !== null && (options = columns.slice(preEnd + 1));
            }
            columnIds = options.map(v => v.value);
            if (columnIds.indexOf(item.start) === -1) {
                item.start = null;
            }
            item.startOptions = options;
        }

        function setEndOptions(idx, item, preItem) {
            let options = [];
            let start = item.start;
            let columnIds;

            start !== null && (options = columns.slice(start));
            columnIds = options.map(v => v.value);
            if (columnIds.indexOf(item.end) === -1) {
                item.end = null;
            }
            item.endOptions = options;
        }

        for (let i = 0; i < len; i++) {
            let item = config[i];
            let preItem = i > 0 ? config[i - 1] : null;
            setStartOptions(i, item, preItem);
            setEndOptions(i, item, preItem);
        }
    }

    render() {
        const that = this;
        const selectStyle = { width: 75 };
        const columns = [
            {
                title: "组名",
                dataIndex: "title",
                key: "title",
                width: 100,
                render: function(text, record, index) {
                    return (
                        <Input
                            size="small"
                            value={text}
                            onChange={e => {
                                that.handleChange(
                                    index,
                                    "title",
                                    e.target.value
                                );
                            }}
                        />
                    );
                }
            },
            {
                title: "起始列",
                dataIndex: "start",
                key: "start",
                width: 90,
                render: function(text, record, index) {
                    return (
                        <Select
                            size="small"
                            style={selectStyle}
                            value={text}
                            onChange={e => {
                                that.handleChange(index, "start", e);
                            }}
                        >
                            {record.startOptions.map((v, i) => (
                                <Option key={i} value={v.value}>
                                    {v.name}
                                </Option>
                            ))}
                        </Select>
                    );
                }
            },
            {
                title: "终止列",
                dataIndex: "end",
                key: "end",
                width: 90,
                render: function(text, record, index) {
                    return (
                        <Select
                            size="small"
                            style={selectStyle}
                            value={text}
                            onChange={e => {
                                that.handleChange(index, "end", e);
                            }}
                        >
                            {record.endOptions.map((v, i) => (
                                <Option key={i} value={v.value}>
                                    {v.name}
                                </Option>
                            ))}
                        </Select>
                    );
                }
            },
            {
                title: "",
                dataIndex: "",
                key: "",
                width: 20,
                render: function(text, record, index) {
                    return (
                        <Button
                            size="small"
                            icon="minus"
                            onClick={() => {
                                that.deleteRow(index);
                            }}
                        />
                    );
                }
            }
        ];

        return (
            <Row type="flex" align="middle">
                <Col span={6}>表头分组</Col>
                <Col span={18}>
                    <Switch
                        checked={this.state.open}
                        onChange={e => this.handelOpenChange(e)}
                    />
                </Col>
                {this.state.open && (
                    <div>
                        <Table
                            locale={{ emptyText: "未添加分组" }}
                            rowKey="key"
                            pagination={false}
                            width={300}
                            columns={columns}
                            dataSource={this.state.config}
                        />
                        <Button
                            size="small"
                            icon="plus"
                            onClick={this.addRow}
                        />
                    </div>
                )}
            </Row>
        );
    }
}
