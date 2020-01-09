import React, { Component } from "react";
import { Map, is } from "immutable";
import { Scrollbars } from "react-custom-scrollbars";
import $ from 'jquery';

/**
 * UI组件基类
 * 挂载组件UI层的基本操作方法，提供组件的最外层边框
 */
class Widget extends Component {
    constructor(props) {
        super(props);
    }
    //组件加载完成时把数据加载进入corejs渲染生成组件
    componentDidMount() {
        const { data, parentId } = this.props;
        parentId && (data.parentId = parentId);
        this._btnBorderShow();
        this.cmpIntance = window.Dashboard.add([
            {
                isEditMode: !this.props.editeMode,
                htmlObj: this.doom,
                cfg: data
            }
        ])[0];
    }
    //组件更新完成时调用resize方法  重新渲染
    componentDidUpdate() {
        this.resize();
    }
    //隐藏拉动按钮
    hideBtn() {
        this.rootDom.nextSibling.style.display = "none";
    }
    //显示拉动按钮
    showBtn() {
        this.rootDom.nextSibling.style.display = "block";
    }
    //重新渲染
    resize() {
        this.cmpIntance.resize();
    }
    //导出csv
    chartCsv(e) {
        this.cmpIntance._bindCsv && this.cmpIntance._bindCsv();
    }
    //导出图片
    chartDownPng(e) {
        this.cmpIntance._chartDownPng && this.cmpIntance._chartDownPng();
    }
    //组件边框和操作按钮显示隐藏
    _btnBorderShow() {
        if (!this.props.editeMode) {
            [...document.querySelectorAll(".com-btns")].forEach(
                e => (e.style.display = "none")
            );
            this.btns.style.display = "block";
            [...document.querySelectorAll(".component_container")].forEach(
                e => (e.style.borderColor = "transparent")
            );
            this.rootDom.style.border = "1px solid #1890ff";
        } else {
            this.hideBtn();
        }
    }
    //组件的点击事件  可切换面板和显示操作按钮
    componentClick(e) {
        e.stopPropagation();
        let { data } = this.props;
        let name = data.type,
            id = data.id;
        //清楚点击按钮
        this._btnBorderShow();
        // this.isClick = true;
        !this.props.editeMode &&
            window.Dashboard.event.dispatch("panelChange", {
                name,
                data: {
                    id
                }
            });
    }
    //处理多维编辑事件
    handleEdit(e) {
      let file = this.cmpIntance.cfg.chartDefinition.option.file;
      if(!file) return ;
      //获取它的名字
      let sl = file.substring(0, file.lastIndexOf('.')).split("/");
      let name = sl[sl.length -1];
      if(name) {
        name = name[1];
      }
      else {
        return ;
      }
      let data = {
        path: file,
        file: {
          name:  name,
          path: file
        }
      };
      window.parent.postMessage(JSON.stringify(data), "*");
    }
    //移除当前组件
    remove(e) {
        e.stopPropagation();
        let { data } = this.props;
        window.Dashboard.event.dispatch("removeComponent", data.id);
    }
    //组件卸载时  清楚实例 同时面板切换回canvas
    componentWillUnmount() {
        const { data } = this.props;
        window.Dashboard.event.dispatch("panelChange", {
            name: "canvas",
            data: {}
        });
        window.Dashboard.compManager.deleteComponent(data.id);
    }
    //显示echarts按钮
    showChartBtns(e) {
        /*  if (!this.props.data.chartBtns) {
            return false;
        } */
        this.chartBtns.style.display = "block";
    }
    //隐藏echarts按钮
    hideChartBtns(e) {
        /* if (!this.props.data.chartBtns) {
            return false;
        } */
        this.chartBtns.style.display = "none";
    }
    //放大
    chartsBigAndSmall(e) {
        window.Dashboard.event.dispatch("showbigchart", {
            show: true,
            data: this.cmpIntance.cfg
        });
    }
    //render函数   提供相关外框dom
    render() {
        let chartBtns = this.props.data.chartBtns;
        let nochartData = this.props.data.nochartData;
        return (
            <div
                ref={e => (this.rootDom = e)}
                className="component_container"
                style={{
                    width: "100%",
                    height: "100%",
                    position: "relative",
                    border: "1px solid transparent"
                }}
                onMouseEnter={this.showChartBtns.bind(this)}
                onMouseLeave={this.hideChartBtns.bind(this)}
                onClick={this.componentClick.bind(this)}
            >
                {this.props.editeMode ? null : (
                    this.props.data.type === 'olap' ? 
                    <div
                        ref={e => (this.btns = e)}
                        className="com-btns"
                        style={{ display: "block" }}
                    >
                        <i className="btn-edite" onClick={e => this.handleEdit(e)}/>
                        <i className="btn-border" />
                        <i
                            className="btn-delete"
                            onClick={this.remove.bind(this)}
                        />
                    </div> 
                    :
                    <div
                        ref={e => (this.btns = e)}
                        className="com-btns"
                        style={{ display: "block" }}
                    >
                        <i className="btn-border" />
                        <i
                            className="btn-delete"
                            onClick={this.remove.bind(this)}
                        />
                    </div>
                )}
                <ul
                    ref={e => (this.chartBtns = e)}
                    className="chartBtns"
                    style={{ display: "none" }}
                >
                    {chartBtns ? (
                        <li
                            className="chartResize"
                            title="刷新"
                            onClick={e => this.resize(e)}
                        />
                    ) : null}
                    {chartBtns && !nochartData ? (
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
                    {this.props.editeMode && this.props.data.bigandsmall ? (
                        <li
                            className="chartsBigAndSmall"
                            title="放大"
                            onClick={e => this.chartsBigAndSmall(e)}
                        />
                    ) : null}
                </ul>
                    <div
                        style={{
                            width: "100%",
                            height: "100%",
                            overflow: "auto",
                            position: "relative"
                        }}
                    >
                        <Scrollbars autoHide ref={e => {
                            if(!e){
                                return;
                            }
                            this.doom = $('>div',e.container).get(0);
                        }}>
                            {this.props.children}
                        </Scrollbars>
                    </div>
            </div>
        );
    }
}

export default Widget;






