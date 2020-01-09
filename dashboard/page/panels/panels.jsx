import React, { Component } from "react";

import PanelStyle from "./panelUI/panel-style";
import PanelDatasource from "./panelUI/panel-datasource";
import PanelFilesource from "./panelUI/panel-filesource";
import PanelHandle from "./panelUI/panel-handle";
import PanelCanvas from "./panelUI/panel-canvas";
import AsyncComponent from "util/asyncLoadComponent";
import { xuduListener } from "xdux/index";

import { Tabs, Icon } from "antd";
const TabPane = Tabs.TabPane;

//这是按照右侧面板 种类 分类的，不是按照组件
const panelConfig = {
    theme: {
        name: "主题设置",
        icon: "skin",
        value: () => (
            <AsyncComponent
                file={() => import("./panelUI/panel-theme")}
                data={{}}
                id={18}
            />
        )
    },
    param: {
        name: "参数管理",
        icon: "database",
        value: () => (
            <AsyncComponent
                file={() => import("./panelUI/panel-param")}
                data={{}}
                id={19}
            />
        )
    },
    extends: {
        name: "页面扩展",
        icon: "skin",
        value: () => (
            <AsyncComponent
                file={() => import("./panelUI/panel-extends")}
                data={{}}
                id={21}
            />
        )
    },
    canvas: { name: "画布", icon: "skin", value: () => <PanelCanvas /> },
    save: {
        name: "保存",
        icon: "save",
        value: () => (
            <AsyncComponent
                file={() => import("./panelUI/panel-save")}
                data={{}}
                id={20}
            />
        )
    },
    // //以上为内置组件默认配置，以下是动态的
    style: {
        name: "样式",
        icon: "skin",
        value: props => <PanelStyle {...props} />
    },
    dataSource: {
        name: "数据源",
        icon: "database",
        value: props => <PanelDatasource {...props} />
    },
    fileSource: {
        name: "文件来源",
        icon: "database",
        value: props => <PanelFilesource {...props} />
    },
    handle: {
        name: "动作",
        icon: "bulb",
        value: props => <PanelHandle {...props} />
    }
};
/**根据组件配置panelTabs，如需渲染*/
let createTabs = props => {
    let name = props.router.name,
        tabsArr = [],
        tabs = null;
    //如果是 非组件面板  就直接切换
    if (panelConfig[name]) {
        tabsArr.push(panelConfig[name]);
    }
    // 如果是组件面板， 就去看有哪些tabs
    else if (window.cfgComponent && window.cfgComponent[name]) {
        tabs = Object.keys(window.cfgComponent[name].panel);
        tabs.forEach(tabName => {
            if (panelConfig[tabName]) {
                tabsArr.push(panelConfig[tabName]);
            }
        });
    }
    return tabsArr;
};

//props: {name:'', data: {id:''}}
class Panel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            router: {
                name: "canvas",
                data: {}
            }
        };
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.panelChange) {
            this.setState({
                router: nextProps.panelChange
            });
        }
    }
    render() {
        let props = this.state;
        return (
            <Tabs defaultActiveKey="0" className="panel">
                {props.router &&
                    createTabs(props).map((el, i) => (
                        <TabPane
                            tab={
                                <span>
                                    <Icon type={el.icon} />
                                    {el.name}
                                </span>
                            }
                            key={i}
                        >
                            {el.value(props)}
                        </TabPane>
                    ))}
            </Tabs>
        );
    }
}
/* let Panel = props => (
    <Tabs defaultActiveKey="0" className="panel">
        {props.router &&
            createTabs(props).map((el, i) => (
                <TabPane
                    tab={
                        <span>
                            <Icon type={el.icon} />
                            {el.name}
                        </span>
                    }
                    key={i}
                >
                    {el.value(props)}
                </TabPane>
            ))}
    </Tabs>
); */

export default xuduListener(["panelChange"])(Panel);
