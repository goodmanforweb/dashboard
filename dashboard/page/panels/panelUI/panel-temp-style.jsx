import React, { Component } from "react";
// import Mapcenter from 'util/mapCenter';
// import {isEmpty} from 'util/util';
import { NameType, FolderWrap } from "../panelComponents/index";

import panelWidgets from "../panelWidgets/index";
import { Scrollbars } from "react-custom-scrollbars";

import _ from "lodash";

class TempStyle extends Component {
    constructor(props) {
        super(props);
        this.init(props);
        this.state = {
            panelcfg: null
        };
    }
    init(props) {
        this.inst = this.getInstFromSDK(props.router.data.id);
    }
    componentWillReceiveProps(nextProps) {
        this.init(nextProps);
    }
    preWidgetHandle(sourceValue, sourceWidget, prevPanelcfg) {
        //具有controls 字段
        let widgetControlResult = {};

        if (sourceWidget.controls && sourceWidget.controls.length) {
            prevPanelcfg = prevPanelcfg.map((blk, i) => {
                blk.value = blk.value.filter((widget, ii) => {
                    if (sourceWidget.controls.includes(widget.name)) {
                        widgetControlResult = widget.controlHandle(sourceValue);
                        if (widgetControlResult.show) {
                            widget.option = widgetControlResult.option;
                            return true;
                        }
                        return false;
                    }
                    return true;
                });

                return blk;
            });
        } else {
            prevPanelcfg = null;
        }
        return prevPanelcfg;
    }
    widgetChange(type, e, widget) {
        let dataForPanel = window.Dashboard.globalParam.params.getAll();
        let prevPanelcfg = this.props.panelcfg;
        let pcfg =
            typeof prevPanelcfg == "function"
                ? prevPanelcfg(dataForPanel)
                : prevPanelcfg;
        pcfg = Object.values(pcfg);

        let panelcfg = this.preWidgetHandle(e, widget, pcfg);
        panelcfg && this.setState({ panelcfg });
        this.inst.update({ option: { [type]: e } });
    }
    getInstFromSDK(id) {
        return window.Dashboard.compManager.getComponent(id);
    }
    createValueForPanel(inst) {
        let cfg = {};
        if (inst) {
            cfg = inst.getCfg().chartDefinition.option;
        }
        return cfg;
    }
    preWidgetsHandle() {
        //如果是 组件值变化，导致 另外一个组件变，将走这一步
        if (this.state.panelcfg) {
            return this.state.panelcfg;
        }
        //面板初次渲染, 首先找到里面具有controls 字段的 组件 ，然后做他控制其他组件的逻辑
        else {
            let dataForPanel = window.Dashboard.globalParam.params.getAll();
            let prevPanelcfg = this.props.panelcfg;
            prevPanelcfg =
                typeof prevPanelcfg == "function"
                    ? prevPanelcfg(dataForPanel)
                    : prevPanelcfg;
            prevPanelcfg = Object.values(prevPanelcfg);
            let optionValue = this.createValueForPanel(this.inst);

            prevPanelcfg.forEach(blk => {
                blk.value.forEach(widget => {
                    if (widget.controls && widget.controls.length) {
                        prevPanelcfg = this.preWidgetHandle(
                            optionValue[widget.name],
                            widget,
                            prevPanelcfg
                        );
                    }
                });
            });
            return prevPanelcfg;
        }
    }
    widgetCreater(props) {
        let valuePool = {};
        valuePool = this.createValueForPanel(this.inst);
        return this.preWidgetsHandle().map((blk, i) => {
            return (
                <FolderWrap name={blk.name} key={i}>
                    {blk.value.map((widget, ii) => {
                        return panelWidgets[widget.widget]({
                            key: `${i}_${ii}`,
                            value: valuePool[widget.name],
                            defaultValue: widget.defaultValue,
                            options: widget.option,
                            name: widget.cname,
                            inst: this.inst,
                            onChange: e =>
                                this.widgetChange(widget.name, e, widget)
                        });
                    })}
                </FolderWrap>
            );
        });
    }
    render() {
        let props = this.props;
        return (
            <Scrollbars autoHide style={{ height: "100%" }}>
                <div className="panel-row style">
                    <NameType
                        name={
                            /* props.widgetNum.type + props.widgetNum.positionNum */ this
                                .inst.id
                        }
                        type={this.inst.cfg.name}
                    />
                    {this.widgetCreater(props)}
                </div>
            </Scrollbars>
        );
    }
}
export default TempStyle;
