import React, { Component } from "react";
import { Input, Select, Row, Col } from "antd";
const Option = Select.Option;

let NameType = props => (
    <div style={{ borderBottom: "1px solid #d9d9d9" }}>
        <Row type="flex" align="middle">
            <Col span={6}>名称</Col>
            <Col span={18}>
                <Input
                    defaultValue={props.name}
                    value={props.name}
                    onChange={e => e}
                />
            </Col>
        </Row>
        <Row type="flex" align="middle">
            <Col span={6}>类型</Col>
            <Col span={18}>
                <Select
                    value={props.type}
                    style={{ width: "100%" }}
                    disabled={true}
                >
                    <Option value={props.type}>{props.type}</Option>
                </Select>
            </Col>
        </Row>
    </div>
);

export default NameType;
