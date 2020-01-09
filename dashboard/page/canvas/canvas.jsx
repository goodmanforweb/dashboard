import React, { Component } from "react";
import { Layout, Menu, Breadcrumb, Icon, Button, Tabs } from "antd";
const { Header, Content, Footer, Sider } = Layout;
import BigSmallChart from "./bigsmallchart";
import canvasHandle from "./canvasHandle";
import $ from 'jquery';

// import ReactGridLayout from 'react-grid-layout';
import ReactGridLayout from "util/react-grid-layout/index";

import "util/react-grid-layout/layout.css";
import "util/react-grid-layout/resizable.css";
import Immutable from "immutable";

import "resource/style/app.css";
import dot from "resource/images/dot.png";

import widgetComponent from 'componentsUi/widgetComponent'

const gridBack = `url(${dot})  0 0/13px 13px repeat`;


class Canvas extends canvasHandle {
    constructor(props) {
        super(props);
        this.state = {
            width: "",
            components: [],
            cols: 12, //栅格  十份
            rowHeight: 30 //栅格  每份高度
        };
        this.activeGridItemId = null;
        this.resizeChildren = [];

        window.Dashboard && window.Dashboard.event.subscribe('windowResize',()=>{
            this.onResizeStop();
        });
    }

    menuDrop(e) {
        this.menuDroper(e);
    }

    onDragStop() {
        //layout, l, b, aa, e, node
        /*let argument = arguments;
  	arguments[4].stopPropagation();
  	let id = arguments[5].id;
    this.setActionState(id, arguments[2], arguments[4]);*/
        // this.state.components.find(e => e.id === id).layout = arguments[2];
    }
    onResizeStop() {
        /*arguments[4].stopPropagation();
        let id = arguments[5].parentElement.id;
        this.setActionState(id, arguments[2], arguments[4]);*/
        /*let selfCompoment = this.state.components.find(e => e.id === id);
            selfCompoment && (selfCompoment.layout = arguments[2]);*/
        //resize组件
        setTimeout(()=>{
            this.resizeChildren.forEach(child=>{
                child && child.resize();
            }); 
        },200)
    }
    componentDidMount() {
        let domWid = this.rootDom.clientWidth - 183 - 362 - 48;
        this.setState({
            width: domWid
        });
    }
    onLayoutChange() {
        // console.log('布局改变');
        var layouts = arguments[0];
        // this.setState({aaa: +new Date()});
        this.setActionState(layouts);
        /*setTimeout(()=>{
     this.setState({
      aa: +new Date()
     })
    },100)*/
    }
    handleChick(e) {
        e.stopPropagation();
        [...document.querySelectorAll(".com-btns")].forEach(
            e => (e.style.display = "none")
        );
        [...document.querySelectorAll(".component_container")].forEach(
            e => (e.style.borderColor = "transparent")
        );
        window.Dashboard.event.dispatch("panelChange", {
            name: "canvas",
            data: {}
        });
    }
    outDivStype() {
        let width = this.props.canvasWidth;
        const editerStyle = {
                padding: "0px 0px 60px 0px",
                minHeight: "100%",
                margin: "auto",
                width: width
            },
            previewStyle = {
                minHeight: "100%",
                margin: "auto",
                width
            };
        return Object.assign(
            this.props.editeMode ? previewStyle : editerStyle,
            { backgroundColor: "#e6eef2", position: "relative" }
        );
    }
    //高度变化重新计算宽高
    render() {
        this.resizeChildren = [];
        return (
            <div
                className="canvas"
                ref={e => (this.rootDom = e)}
                onDrop={e => this.menuDrop(e)}
                onDragOver={e => e.preventDefault()}
                onClick={e => this.handleChick(e)}
                id="background-container"
                style={this.outDivStype()}
            >
                <BigSmallChart />
                {this.state.width && this.state.components.length ? (
                    <ReactGridLayout
                        width={this.props.canvasWidth}
                        cols={this.state.cols}
                        rowHeight={this.state.rowHeight}
                        onDragStop={this.onDragStop.bind(this)}
                        onResizeStop={this.onResizeStop.bind(this)}
                        onLayoutChange={this.onLayoutChange.bind(this)}
                        layout={this.state.components.map(item => item.layout)}
                    >
                        {this.state.components.map((item, key) => {
                            let Item = window.reactComponent[item.type];
                            return (
                                <div key={item.id} id={item.id}>
                                    <Item
                                        editeMode={this.props.editeMode}
                                        data={item}
                                        myWidth={
                                            (this.props.canvasWidth *
                                                item.layout.w) /
                                            12
                                        }
                                        ref={e => (this.resizeChildren.push(e))}
                                    />
                                </div>
                            );
                        })}
                    </ReactGridLayout>
                ) : null}
            </div>
        );
    }
}

export default Canvas;
