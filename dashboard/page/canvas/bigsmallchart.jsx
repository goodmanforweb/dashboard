import React, { Component } from "react";
import Immutable, { Map, is } from "immutable";
class BigSmallChart extends Component {
    constructor(props) {
        super(props);
        this.initListener();
        this.state = {
            show: false
        };
    }
    initListener() {
        window.Dashboard.event.subscribe("showbigchart", data => {
            this.contain =
                this.contain || document.querySelector("#background-container");
            this.div.style.display = data.show ? "block" : "none";

            if (data.show) {
                let _data = Immutable.fromJS(data.data).toJS();
                _data.chartDefinition.id = _data.id = _data.id + "_2";
                this.setState(
                    {
                        show: data.show,
                        chartins: _data
                    },
                    () => {
                        this.div.setAttribute("id", _data.id);
                    }
                );
                this.div.style.width = document.body.clientWidth + "px";
                this.div.style.height = document.body.clientHeight + "px";
            } else {
                this.setState({
                    show: data.show,
                    chartins: ""
                });
            }
        });
        window.Dashboard.event.subscribe("bigsmollresize", () => {
            this.setState({ aa: +new Date() });
        });
    }
    render() {
        return (
            <div
                className="big-chart-container"
                ref={e => (this.div = e)}
                style={{
                    position: "fixed",
                    left: 0,
                    top: 0,
                    right: 0,
                    margin: "auto",
                    zIndex: 10000
                }}
            >
                {this.state.show ? (
                    <LittleCom data={this.state.chartins} />
                ) : null}
            </div>
        );
    }
}
class LittleCom extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        let _data = Immutable.fromJS(this.props.data).toJS();
        let backColor =
            Dashboard.globalParam.globalParam.theme.body.backgroundColor;
        // _data.chartDefinition.option.backgroundColor = backColor; tableBgColor
        let dataColor = _data.chartDefinition.option.backgroundColor || "#fff";
        _data.parentId && (dataColor = "transparent");
        let flag = false;
        setTimeout(() => {
            this.cmpIntance = window.Dashboard.add([
                {
                    isEditMode: false,
                    htmlObj: this.doom,
                    cfg: _data
                }
            ])[0];
            [
                "transparent",
                "rgba(0,0,0,0.25)",
                "rgba(255,255,255,0.09)"
            ].forEach(e => {
                dataColor.replace(/\s/g, "") === e && (flag = true);
            });
            if (flag) {
                this.doom.style[
                    /gradient/g.test(backColor)
                        ? "background-image"
                        : "background-color"
                ] = backColor;
            }
        });
        this.ddiv = document.querySelector(".big-chart-container");
    }
    componentWillUnmount() {
        window.Dashboard.compManager.deleteComponent(this.props.data.id);
    }
    resize() {
        this.cmpIntance.resize();
    }
    chartCsv() {
        this.cmpIntance._bindCsv && this.cmpIntance._bindCsv();
    }
    chartDownPng() {
        this.cmpIntance._chartDownPng && this.cmpIntance._chartDownPng();
    }
    chartsBigAndSmall() {
        window.Dashboard.event.dispatch("showbigchart", {
            show: false,
            data: {}
        });
    }
    componentDidUpdate() {
        this.ddiv.style.width = document.body.clientWidth + "px";
        this.ddiv.style.height = document.body.clientHeight + "px";
        this.resize();
    }
    render() {
        let chartBtns = this.props.data.chartBtns;
        return (
            <div
                className="component_container"
                style={{ width: "100%", height: "100%", position: "relative" }}
            >
                <ul ref={e => (this.chartBtns = e)} className="chartBtns">
                    {chartBtns ? (
                        <li
                            className="chartResize"
                            title="刷新"
                            onClick={e => this.resize(e)}
                        />
                    ) : null}
                    {chartBtns ? (
                        <li
                            className="chartCsv"
                            title="导出数据"
                            style={{ display: "none" }}
                            onClick={e => this.chartCsv(e)}
                        />
                    ) : null}
                    {chartBtns ? (
                        <li
                            className="chartDownPng"
                            title="导出图片"
                            onClick={e => this.chartDownPng(e)}
                        />
                    ) : null}
                    <li
                        className="chartsBigAndSmall2"
                        title="取消放大"
                        onClick={e => this.chartsBigAndSmall(e)}
                    />
                </ul>
                <div
                    ref={e => (this.doom = e)}
                    style={{ width: "100%", height: "100%" }}
                />
            </div>
        );
    }
}

export default BigSmallChart;
