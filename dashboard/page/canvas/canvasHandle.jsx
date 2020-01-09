import React, { Component } from "react";
import Immutable from "immutable";
import { dispatch } from "xdux";
import widgetComponent from 'componentsUi/widgetComponent'

class CanvasHandle extends Component {
    //组件构造方法
    constructor(props) {
        super(props);

        this.init();
        this.hasListenered = false;
        this.reEditerArr = [];
    }
    //添加组件的删除监听事件，重新编辑事件
    init() {
        this.removeListener();
        this.addReEditeListener();
    }
    //重新编辑  按需加载
    reEditerPromise(components) {
        let promise = components.map(cmp => {
            window.dashboardType = cmp.type;
            return this.promiseComponent(null, cmp);
        });
        return Promise.all(promise);
    }
    //添加重新编辑事件监听
    addReEditeListener() {
        if (!this.hasListenered) {
            window.Dashboard.event.subscribe(
                "reEditeComponents",
                components => {
                    //清除component里面的children
                    components.forEach(item => {
                        /^container\_/.test(item.id) && (item.children = []);
                    });
                    //处理components   划分类别
                    if (components && components.length > 0) {
                        let selefComponents = this.handleReEditerComponents(
                            components
                        );
                        this.reEditerPromise(components).then(() => {
                            this.setState({
                                components: selefComponents
                            });
                        });
                    }
                }
            );
            this.hasListenered = true;
        }
    }
    //处理重新编辑的实例数据   进行归类处理
    handleReEditerComponents(components) {
        let selfComponents = Immutable.fromJS(components).toJS();
        let ComponentNoParent = [],
            ComponentHasParent = [];

        ComponentNoParent = selfComponents.filter(e => !e.parentId);
        ComponentHasParent = selfComponents.filter(e => e.parentId);
        ComponentHasParent.forEach(e => {
            let component = ComponentNoParent.find(
                item => item.id === e.parentId
            );
            component.children.push(e);
        });

        return ComponentNoParent;
    }
    //移除组件 重新渲染
    removeListener() {
        window.Dashboard.event.subscribe("removeComponent", id => {
            var ind;
            this.state.components.find((e, i) => e.id === id && (ind = i));

            let components = Immutable.fromJS(this.state.components).toJS();
            if (ind !== undefined) {
                components.splice(ind, 1);
                this.setState({
                    components
                });
            }
        });
    }
    //组件的放置
    menuDroper(e, isIncontainer) {
        e && e.preventDefault();
        this.promiseComponent().then(type =>
            this.setDroper(type, isIncontainer)
        );
    }
    //按需加载组件配置和实例   缓存进window中
    promiseComponent() {
        const type = window.dashboardType;
        window.dashboardType = false;
        window.cfgComponent = window.cfgComponent || {};
        window.reactComponent = window.reactComponent || {};

        if(window.reactComponent[type]){
            return Promise.resolve(type);
        }else{
            return this.load(type, type).then(Item => {
                window.reactComponent[type] = Item;
                return Promise.resolve(type);
            },e=>{
                window.reactComponent[type] = widgetComponent;
                return Promise.resolve(type);
            });
        }
    }
    //面板切换  根据id和name
    recordActiveGridItem(id, name) {
        this.activeGridItemId = id;
        this.setPanel(name, {
            id
        });
    }
    //面板切换事件触发
    setPanel(name, data) {
        return window.Dashboard.event.dispatch("panelChange", {
            name,
            data
        });
    }
    //拖拽放置新组件  并计算其y值
    setDroper(type, isIncontainer) {
        let component, components;
        components = Immutable.fromJS(this.state.components).toJS();
        //生成配置同时，设置主题数据到里面
        let theme = window.Dashboard.globalParam.globalParam.theme;
        //如果组件在容器中，将其背景颜色设置为透明
        if (isIncontainer === "widgetIncontainer") {
            theme = window.Dashboard.util.copyReference(theme);
            theme.chart.backgroundColor = "transparent";
        }

        component = window.cfgComponent[type].cfg(theme);
        //在容器中重新计算layout
        if (isIncontainer === "widgetIncontainer") {
            component.layout.h =
                3 * component.layout.h + component.layout.h - 1;
        }
        let id = type + "_" + +new Date();
        component.id = id;
        component.layout.i = id;
        component.layout.y = this.layoutYCount(components);
        // component.
        components.push(component);
        // console.log(components);
        this.setState(
            {
                components
            },
            () => {
                this.recordActiveGridItem(component.id, component.type);
            }
        );
    }
    //y值计算
    layoutYCount(components = []) {
        let count = 0,
            layout;
        if (components.length > 0) {
            layout = components.sort((a, b) => b.layout.y - a.layout.y)[0];
            count = layout.layout.y + layout.layout.h;
        }

        return count;
    }
    /*setActionState(id,data, e){
	    let components = Immutable.fromJS(this.state.components).toJS();
	    components.find(e => e.id === id).layout = data;
	    dispatch
	    this.setState({
	      components
	    },()=>{
	    	dispatch({
	    		type: 'updateLayout',
	    		value: {
	    			ids : id,
	    			data
	    		}
	    	})
	    });
	}*/
    //设置新的layout
    setActionState(layouts) {
        let components = Immutable.fromJS(this.state.components).toJS();
        let layout = Immutable.fromJS(layouts).toJS();
        components.forEach(e => {
            e.layout = layout.find(item => item.i === e.id);
        });
        this.setState(
            {
                components
            },
            () => {
                layouts.forEach(e => {
                    dispatch({
                        type: "updateLayout",
                        value: {
                            ids: e.i,
                            data: e
                        }
                    });
                });
            }
        );
    }
    //type类型
    //str配置或者组件
    load(type, str) {
        return import("componentsUi/" + type + "/" + str).then(e => e.default);
    }
}

export default CanvasHandle;
