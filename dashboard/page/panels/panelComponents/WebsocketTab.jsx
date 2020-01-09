/**
 * author：twy
 * 2018/7/11
 * 数据源-websocket-配置页面
 * 
 * 配置项：
 * ===============================================================================
 * URL地址：websocket地址
 * 保持连接：如果关闭，客户端在接收一次消息后主动关闭websocket连接
 * 空闲超时：如果设置时间大于0，在建立连接后达到设置时间，客户端主动关闭websocket连接
 * 历史数据保留：最多保留的消息数量
 * 请求数据：如果设置请求数据，在建立连接后，向服务器发送该数据
 * ===============================================================================
 */

import React ,{ Component } from 'react';
import { Input , Select , Row, Col, Icon, Switch, InputNumber ,Table } from 'antd';

const { TextArea } = Input;

export default class WebsocketTab extends Component{
    constructor(props){
        super(props);
        let websocketSetting = props.activePanel.cfg.chartDefinition.query.websocketSetting;

        this.state = {
            url:'',
            streamConnect:true,
            timeout:300,
            retainNumber:100,
            sendContent:''
        };

        if(websocketSetting){
            this.state = Object.assign(this.state,websocketSetting);
        }else{
            this.emit();
        }

        this.updateState = this.updateState.bind(this);

    }

    emit(){
        let onChange = this.props.onChange;
        let websocketSetting = {};

        ['url','streamConnect','timeout','retainNumber','sendContent'].forEach(v=>{
            websocketSetting[v] = this.state[v];
        });

        if(onChange){
            onChange(websocketSetting);
        }
    }

    /**
     * 更新state
     * @param {String} key 
     * @param {Any} value 
     */
    updateState(key,value){
        let obj = {};
        obj[key] = value;
        this.setState(obj,()=>{
            this.emit();
        });
    }

    render(){
        return <div  className="select-tab-content">
            <Row type="flex" align="middle" >
                <Col span={6}>URL地址</Col>
                <Col span={18}>
                    <Input value={this.state.url} onChange={e=>{
                        this.updateState('url',e.target.value);
                    }}></Input>
                </Col>
            </Row>
            <Row type="flex" align="middle" >
                <Col span={6}>保持连接</Col>
                <Col span={18}>
                    <Switch checked={this.state.streamConnect} onChange={checked=>{
                        this.updateState('streamConnect',checked);
                    }} />
                </Col>
            </Row>
            <Row type="flex" align="middle" >
                <Col span={6}>空闲超时</Col>
                <Col span={18}>
                    <InputNumber value={this.state.timeout} min={0} step={1}  onChange={value=>{
                        if(typeof value === 'number'){
                            this.updateState('timeout',value);
                        }
                    }} /> 秒
                </Col>
            </Row>
            <Row type="flex" align="middle" >
                <Col span={6}>历史数据保留</Col>
                <Col span={18}>
                    <InputNumber value={this.state.retainNumber} min={0} step={1}  onChange={value=>{
                        if(typeof value === 'number'){
                            this.updateState('retainNumber',value);
                        }
                    }} /> 批次
                </Col>
            </Row>
            <Row type="flex" align="middle" >
                <Col span={6}>请求数据</Col>
                <Col span={18}>
                    <TextArea value={this.state.sendContent} rows={5} style={{resize:'none'}}  onChange={e=>{
                        this.updateState('sendContent',e.target.value);
                    }}/>
                </Col>
            </Row>
        </div>
    }
}