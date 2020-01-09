import React, { Component } from "react";
import { Button, Popover, Message, Icon } from "antd";
import ColumnConfig from "./column_config";
import $ from "jquery";

let uid = 0;
let instances = [];
let isBindScroll = false;

let hideAllPop = () => {
    instances.forEach(v => {
        v.ins.hidePop();
    });
};

$(document).on("click.column_config_pop", e => {
    let $tg = $(e.target);
    if (
        $tg.closest(".anticon.anticon-setting").length < 1 &&
        $tg.closest(".widget-table-column-overlay").length < 1 &&
        $tg.closest(".rc-trigger-popup").length < 1
    ) {
        hideAllPop();
    }
});

export default class ColumnConfigBtn extends Component {
    constructor(props) {
        super(props);
        this.uid = uid++;
        this.props = props;
        this.state = {
            options: props.options,
            visible: false
        };
        instances.push({
            uid: this.uid,
            ins: this
        });
    }

    componentDidMount() {
        if (!isBindScroll) {
            $(".ant-layout-content>div").scroll(e => {
                hideAllPop();
            });
            isBindScroll = true;
        }
    }

    showPop() {
        this.setState({ visible: true });
    }

    hidePop() {
        this.setState({ visible: false });
    }

    render() {
        return (
            <Popover
                mouseLeaveDelay={0}
                overlayClassName="widget-table-column-overlay"
                placement="bottomLeft"
                visible={this.state.visible}
                content={
                    this.state.visible ? (
                        <ColumnConfig
                            options={this.state.options}
                            onSave={(idx, config) => {
                                let onSave = this.props.onSave;
                                onSave && onSave(idx, config);
                                this.hidePop();
                            }}
                        />
                    ) : (
                        ""
                    )
                }
                trigger="click"
            >
                <Icon
                    size="small"
                    type="setting"
                    style={{
                        cursor: "pointer"
                    }}
                    onClick={e => {
                        instances.filter(v => v.uid !== this.uid).forEach(v => {
                            v.ins.hidePop();
                        });
                        this.setState({
                            visible: !this.state.visible,
                            options: this.props.options
                        });
                    }}
                />
            </Popover>
        );
    }
}
