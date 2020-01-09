/**
 * 
 */
import compManager from "./compManager/compManager";
import widgetBase from "./components/base";
import dataHandle from "./datahandle/index";
import queryAction from "./datasource/queryAction";
import queryLogic from "./datasource/queryLogic";
import queryManager from "./datasource/queryManager";
import globalParam from "./globalParam/globalParam";
import params from "./globalParam/params";
import observe from "./paramListener/observe";
import store from "./util/store";
import util from "./util/util";
import axios from "axios";

import $ from 'jquery'
import _ from 'underscore'
import echarts from 'echarts'

import componentList from './components/componentList'

//组件添加文件
import * as components from "./components/index";


if(!window.cfgComponent){
    window.cfgComponent = {};
}

if(!window.reactComponent){
    window.reactComponent = {};
}

/**
 * 加载css
 * @param {String} url css url
 * @param {Function} cb callback
 */
function loadCss(url,cb){
    let head = document.getElementsByTagName('head')[0];
    let link = document.createElement('link');
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = url;
    head.appendChild(link);
    cb && setTimeout(function () {
        cb();
    }, 50);
}

/**
 * 加载js
 * @param {String} url js url
 * @param {Function} cb callback
 */
function loadJs(url,cb){
    let head = document.getElementsByTagName('head')[0];
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    script.onload = (e)=>{
        cb && cb(e);
    }

    script.onerror = (e)=>{
        cb && cb(e);
    }

    head.appendChild(script);
}

/**
 * 加载自定义组件
 * @param {names} Array 自定义组件列表
 */
function loadCustomCom(names = [],cb){
    let len = names.length;
    let count = 0;
    if(len === 0){
        cb();
    }
    names.forEach(name=>{
        loadCss('/filename/api/repos/:public:cde:components:'+ name +':style.css/content');
        loadJs('/filename/api/repos/:public:cde:components:'+ name +':'+ name +'.js/content',()=>{
            count++;
            if(count === len){
                cb();
            }
        });
    });
}

class dashboard {
    constructor() {
        this.init();
    }

    init() {
        //版本号
        this.version = "1.0.9";
        this.store = store;
        this.event = new observe();

        this.componentList = componentList;

        //组件基类
        this.widgetBase = widgetBase;

        //组件类集合
        this.widgetLists = {};

        //工具函数集合
        this.util = util;

        //组件管理
        this.compManager = new compManager(this);
        
        this.dataHandle = new dataHandle().handle;
        this.queryAction = new queryAction(this);
        this.queryLogic = new queryLogic(this);
        this.queryManager = new queryManager(this);

        this.params = params;

        this.globalParam = new globalParam(this);

        //平台提供的类库
        this.lib = { $, _ , echarts };
    }

    /**
     * 注册系统组件
     */
    _registerSysCom(){
        for(let key in components){
            let {widgetClass,widgetConfig} = components[key];
            this.register(key,{ widgetClass,widgetConfig });
        }
    }

    /**
     * 注册自定义组件
     */
    _registerCustomCom(){
        let def = $.Deferred();
        //查询文件系统自定义组件列表
        $.ajax({
            url:'/filename/api/repo/files/:public:cde:components/tree?showHidden=true&filter=*|FOLDERS',
            dataType:'json'
        }).done(data=>{
            let children = data.children || [];
            let comNames;
            comNames = children.map(item=>item.file.name);
            //加载自定义组件
            loadCustomCom(comNames,()=>{
                def.resolve();
            });
        }).fail(e=>{
            def.reject(e);
        });
        return def.promise();
    }

    bootstrap(cb){
        this._registerSysCom();
        return $.when(this._registerCustomCom()).then(e=>{
            cb && cb();
        },e=>{
            cb && cb();
        });
    }

    /**
     * 添加组件
     * @param {Object|Array} options 参数对象
     * @return {Object|Array} 组件实例对象
     */
    add(options){

        if(_.isArray(options)){
            return options.map(item=>this.add(item));
        }

        let {htmlObj,parentId,isEditMode,cfg} = options;
        let type = cfg.type
        let instance = null;
        let instanceWidget;

        if(type){
            try{
                let theme = this.globalParam.globalParam.theme;
                cfg = $.extend(true,{},window.cfgComponent[type].cfg(theme),cfg);
                instanceWidget = this.widgetLists[type] || this.widgetBase;
                instance = new instanceWidget(htmlObj,cfg, parentId,isEditMode);
                instance.init();
            }catch(err){
                console.log('组件添加失败：' + err);
            }
        }

        instance && this.compManager.addComponent(instance);

        return instance;
    }

    /**
     * 注册组件
     * @param {String} name 组件类型名称 
     * @param {Class} options 参数对象 {widgetClass,widgetConfig}
     * @param {Boolean} isCustom 是否自定义组件
     */
    register(name,options,isCustom) {
        let { widgetClass,widgetConfig } = options;

        this.widgetLists[name] = widgetClass;

        window.cfgComponent[name] = widgetConfig;

        if(isCustom === true){
            let groupId = widgetConfig.base.group;
            let group = this.componentList.filter(item=>item.id===groupId)[0];
            if(group && group.children){
                group.children.push({
                    type: widgetConfig.base.type,
                    cname: widgetConfig.base.name,
                    $$custom: true,
                    icon:'/filename/api/repos/:public:cde:components:'+ widgetConfig.base.type +':icon.png/content'
                });
                window.Dashboard.event.dispatch('COM_LIST_CHANGED',widgetConfig);
            }
        }
    }

    /**
     * 移除组件
     * @param {String} id 组件ID 
     */
    remove(id) {
        return this.compManager.deleteComponent(id);
    }

    /**
     * 销毁
     */
    destroy() {}

    submit() {}
}

export default dashboard;

//实例化corejs
window.Dashboard = new dashboard();

/*let defaultOption = {
    backgroundColor: '#2c343c',

    title: {
        text: 'Customized Pie',
        left: 'center',
        top: 20,
        textStyle: {
            color: '#ccc'
        }
    },

    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    series : [
        {
            name:'访问来源',
            type:'pie',
            radius : '55%',
            center: ['50%', '50%'],
            data:[
                {value:335, name:'直接访问'},
                {value:310, name:'邮件营销'},
                {value:274, name:'联盟广告'},
                {value:235, name:'视频广告'},
                {value:400, name:'搜索引擎'}
            ]
        }
    ]
};*/
/*Dashboard.add([{
    type: "select",
    name: "render_select",
    id: '',
    priority: 5,
    parameter: 'a1',
    executeAtStart: true,
    listeners: [],
    chartDefinition:  {
      htmlObj: document.getElementById('appaa'),
      queryid: '',
      queryname:'',
      freshQuery: false,
      query: {
        type:'sql',
        param: {},
        statement: '',
        query: `SELECT '食品经营' 食品大类, 1000012 金额,'349212,13423,129843,22541' 数据 UNION ALL
                SELECT '餐饮服务',1000012,'349212,13423,129843,22541'  UNION ALL
                SELECT '食品流�?,2000012,'349212,13423,129843,22541' UNION ALL
                SELECT '食品生产',3000012,'349212,13423,129843,22541'`,
        jndi: 'dw_market',

      },
      data: [],
      css: {
        height: '40px',
        width: '250px',
        borderColor: 'orange',
      },
      inject: {
        // widgetWillCreated: "function() {console.log('run', this)}",
        postUpdate: "function(){console.log('postUpdate')}"
      }
    }
  },{
    type: "chartPie",
    name: "",
    priority: 5,
    parameter: '',
    executeAtStart: true,
    listeners: ['a1'],
    chartDefinition:  {
      htmlObj: document.getElementById('appPie'),
      queryid: '',
      queryname:'',
      freshQuery: false,
      defaultOption: defaultOption,//图表默认配置

      option: {},

      enumOption:{
        color:'',
        seriesColor:'',
      },
      injectOption:{

      },
      query: {
        type:'sql',
        param: {'a1': 123},
        statement: ''
      },
      data: [],
      css: {
        height: '400px',
        width: '500px',
        borderColor: 'orange',
      },
      inject: {
        // widgetWillCreated: "function() {console.log('run', this)}",
        postUpdate: "function(){console.log('postUpdate')}"
      }
    }
  }])*/

/*window.Dashboard.register({
  wahaha: Dashboard.extendsComponent
});

Dashboard.add([{
    type: "wahaha",
    name: "render_select",
    id: '',
    priority: 5,
    parameter: '',
    executeAtStart: true,
    listeners: ['a1'],
    chartDefinition:  {
      htmlObj: document.getElementById('appaa'),
      queryid: '',
      queryname:'',
      freshQuery: false,
      query: {
        type:'sql',
        param: {'a1': 123},
        statement: ''
      },
      data: [],
      css: {
        height: '40px',
        width: '250px',
        borderColor: 'orange',
      },
      inject: {
        // widgetWillCreated: "function() {console.log('run', this)}",
        postUpdate: "function(){console.log('postUpdate')}"
      },
      draw: 'function(){console.log(this)}'
    }
  }])*/
