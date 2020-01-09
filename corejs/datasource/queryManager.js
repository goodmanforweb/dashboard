import Util from "../util/util";
import sql from "./sql";
import WebsocketManager from "./websocketManager";
import $ from 'jquery';

export default class QueryManager {
    constructor(dashboard) {
        this.dashboard = dashboard;
        this.dataSource = new dashboard.store(false);
        this.sql = sql;
    }
    add(cfg, data = {}) {
        let df = cfg.chartDefinition;
        let queryObj = this.get(df.queryid);
        //初始化查询对象
        queryObj = queryObj || new this[df.query.type](df.query);

        queryObj.name = df.queryName;
        queryObj.queryid = df.queryid;
        queryObj.freshQuery = !!df.freshQuery;
        queryObj.data = Util._.cloneDeep(data);

        this.dataSource.add(
            df.queryid /*{
            name: df.queryName, 
            queryid: df.queryid, 
            freshQuery: !!df.freshQuery, 
            query: Util._.cloneDeep(df.query), 
            data: Util._.cloneDeep(data)}*/,
            queryObj
        );
        return queryObj;
    }
    remove(id) {
        this.dataSource.remove(id);
    }
    get(id) {
        return this.dataSource.get(id);
    }

    /**
     * sql类型数据查询
     * @param {Object} cfg 组件config对象
     * @param {Function} callback 获取查询数据后回调函数
     */
    doQueryBySql(cfg,callback){
        //默认sql查询
        if (!cfg.chartDefinition.query.query) {
            callback({});
        }
        /**
         * 如果是由 参数值改变 触发的 doQuery, 就检测查询语句中是否含有该参数，没有 就 抑制 doQuery;
         * 如果有，就重新赋值
         */
        let queryParam = cfg.chartDefinition.query.param,sameKeys = [];
        if (!cfg.chartDefinition.queryid) {
            cfg.chartDefinition.queryid = Util.generateGUID();
        } else {
            if (!cfg.chartDefinition.freshQuery) {
                let oldData = this.get(cfg.chartDefinition.queryid);
                /**保证第二次数据处理 */
                if (oldData && !Util._.isEmpty(oldData.query)) {
                /**在不刷新数据源情况下，判断查询语句是否变化，变化就移除，重新发请求 */
                    if (Util._.isEqual(oldData.query, cfg.chartDefinition.query)) {
                        return callback && callback(this.dashboard.dataHandle(cfg, oldData.data));
                    } else {
                        this.remove(cfg.chartDefinition.queryid);
                    }
                }
            } else {
                this.remove(cfg.chartDefinition.queryid);
            }
        }

        if (Util._.isEmpty(cfg.chartDefinition.query)) {
            //走示例数据
            //从示例数据管理哪里获得数据
            let demodata;
            this.add(cfg, demodata);
            callback && callback(this.dashboard.dataHandle(cfg, demodata));
        } else {
            //添加查询管理
            let queryObj = this.add.call(this, cfg);
            this.dashboard.queryAction.fetch(queryObj, data => {
                // this.add.call(this, cfg, data);
                this.get(cfg.chartDefinition.queryid).data = data;
                callback && callback(this.dashboard.dataHandle(cfg, data));
            });
        }
    }

    /**
     * http类型数据查询
     * @param {object} httpSetting http配置对象
     * @param {Function} callback 获取查询数据后回调函数
     */
    doQueryByHttp(httpSetting = {},callback){
        let {params,headers,type,url} = httpSetting;
        let httpOptions = {
            url: url,
            type: type,
            data: {},
            beforeSend:(xhr)=>{}
        };

        //构建查询参数
        params.forEach(v=>{
            httpOptions.data[v.name] = v.value;
        });

        //发送请求
        $.ajax(httpOptions)
        .done(data=>{
            callback(data);
        })
        .fail(e=>{
            callback({});
        });
    }

    /**
     * websoket类型数据查询
     * @param {object} websocketSetting websoket配置对象
     * websocketSetting                  {Object}     websoket数据源配置对象
     * websocketSetting.url              {String}     URL地址：websocket地址
     * websocketSetting.streamConnect    {Boolean}    保持连接：如果关闭，客户端在接收一次消息后主动关闭websocket连接
     * websocketSetting.timeout          {Number}     空闲超时：如果设置时间大于0，在建立连接后达到设置时间，客户端主动关闭websocket连接，单位：秒
     * websocketSetting.retainNumber     {Number}     历史数据保留：最多保留的消息数量次数
     * websocketSetting.sendContent      {String}     请求数据：如果设置请求数据，在建立连接后，向服务器发送该数据
     * 
     * @param {Function} callback 获取查询数据后回调函数
     */
    doQueryByWebsocket(id,websocketSetting,callback){
        let {url,timeout,streamConnect,sendContent,retainNumber} = websocketSetting;
        let ws;
        let msgCount = 0;
        let data = [];

        if(!url){
            callback(data);
            return;
        }

        let wsManager = new WebsocketManager();

        try{
            ws = wsManager.create(id,url);
        }catch(e){
            console.log(e);
            callback(data);
        }
        

        // 建立 web socket 连接成功触发事件
        ws.onopen = function () {
            if(sendContent){
                ws.send(sendContent);
            }

            if(timeout && timeout>0){
                setTimeout(()=>{
                    ws.close();
                },timeout*1000);
            }
        };

        // 接收服务端数据时触发事件
        ws.onmessage = function (evt) {
            let _data;
            msgCount++;
            if(!streamConnect && msgCount === 1){
                ws.close();
            }
            try{
                _data = $.parseJSON(evt.data);
            }catch(e){
                _data = evt.data;
            }
            data.push(_data);
            if(retainNumber && data.length > retainNumber){
                data.splice(0,data.length - retainNumber);
            }
            callback(data);
        };

        // 断开 web socket 连接成功触发事件
        ws.onclose = function () {
            callback(data);
        };

        //产生异常
        websocket.onerror = function (evt) {
            callback(data);
        }; 
        
    }

    /**
     * 数据查询 
     * @param {object} cfg 组件config对象
     * @param {Function} callback 获取查询数据后回调函数
     */
    doQuery(cfg, callback) {
        let chartDefinition = cfg.chartDefinition;
        let query = chartDefinition.query || {};
        let querytype = query.type;

        if(querytype === 'sql'){
            this.doQueryBySql(cfg,callback);
        }else if(querytype === 'http'){
            this.doQueryByHttp(query.httpSetting,callback);
        }else if(querytype === 'websocket'){
            this.doQueryByWebsocket(cfg.id,query.websocketSetting,callback);
        }
    }
}
