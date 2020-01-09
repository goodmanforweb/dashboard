/**
 * author：twy
 * 2018/7/11
 * 数据源-http-配置页面
 */
import $ from 'jquery';
import React ,{ Component } from 'react';
import { Input ,Select , Row, Col, Icon, Radio, Switch, Slider , TreeSelect, Table, Button, Menu , Popover, Collapse ,message} from 'antd';

const Option = Select.Option;

export default class TttpTab extends Component{
    constructor(props){
        super(props);
        let httpSetting = props.activePanel.cfg.chartDefinition.query.httpSetting;

        this.state = {
            url:'',
            type:'get',
            params:[],
            headers:[],
            paramsSelected:[],
            headersSelected:[]
        };

        if(httpSetting){
            this.state = Object.assign(this.state,httpSetting);
        }else{
            this.emit();
        }

        this.updateState = this.updateState.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleSelectRow = this.handleSelectRow.bind(this);
        this.handleRowItem = this.handleRowItem.bind(this);

    }

    emit(){
        let onChange = this.props.onChange;
        let httpSettings = {};

        ['url','type','params','headers'].forEach(v=>{
            httpSettings[v] = this.state[v];
        });

        if(onChange){
            onChange(httpSettings);
        }
    }

    updateState(key,value){
        let obj = {};
        obj[key] = value;
        this.setState(obj,()=>{
            this.emit();
        });
    }

    /**
     * 处理添加行
     * @param {String} type 
     */
    handleAdd(type){
        let list = this.state[type];
        let newRowData = {name:'',value:''};
        if(!type || !list){
            return;
        }
        list = list.concat(newRowData);
        this.updateState(type,list);
    }

    /**
     * 处理删除行
     * @param {String} type 
     */
    handleDelete(type){
        let list = this.state[type];
        let newList = [];
        let selected = this.state[`${type}Selected`];

        if(!type || !this.state[type] || !selected){
            return;
        }

        newList = list.filter((v,i)=>selected.indexOf(i) === -1);

        this.updateState(type,newList);
        this.updateState(`${type}Selected`,[]);
    } 

    /**
     * 设置选中状态
     * @param {String} type 类型 params headers
     * @param {Array} selectedRowKeys 选中行index集合
     * @param {Object} selectedRows 行数据
     */
    handleSelectRow(type,selectedRowKeys, selectedRows){
        let list = this.state[`${type}Selected`]
        if(!type || !list){
            return;
        }
        this.updateState(`${type}Selected`,selectedRowKeys);
    }

    /**
     * 处理行每一列值更新
     * @param {String} type 类别
     * @param {Number} index index
     * @param {String} key 键
     * @param {Any} value 值
     */
    handleRowItem(type,index,key,value){
        if(type!=='params' && type!=='headers'){
            return;
        }
        this.state[type][index][key] = value;
        this.setState({},()=>{
            this.emit();
        });
    }

    render(){
        const httpTypes = [
            {
                name:'POST',
                value:'post'
            },
            {
                name:'GET',
                value:'get'
            }
        ];
        const paramsColumns = [
            {
                title: '名称',
                dataIndex: 'name',
                key: 'name',
                width:'50%',
                render: (v, record, index) => (
                    <Input placeholder="名称" value={v} onChange={e=>{
                        this.handleRowItem('params',index,'name',e.target.value);
                    }}/>
                )
            },
            {
                title: '值',
                dataIndex: 'value',
                key: 'value',
                render: (v, record, index) => (
                    <Input placeholder="值" value={v} onChange={e=>{
                        this.handleRowItem('params',index,'value',e.target.value);
                    }}/>
                )
            }
        ];
        const headersColumns = [
            {
                title: '名称',
                dataIndex: 'name',
                key: 'name',
                width:'50%',
                render: (v, record, index) => (
                    <Input placeholder="名称" value={v} onChange={e=>{
                        this.handleRowItem('headers',index,'name',e.target.value);
                    }}/>
                )
            },
            {
                title: '值',
                dataIndex: 'value',
                key: 'value',
                render: (v, record, index) => (
                    <Input placeholder="值" value={v} onChange={e=>{
                        this.handleRowItem('headers',index,'value',e.target.value);
                    }}/>
                )
            }
        ];
        return (
        <div className="select-tab-content">
            <Row type="flex" align="middle" >
                <Col span={6}>URL地址</Col>
                <Col span={18}>
                    <Input value={this.state.url} onChange={e=>{
                        this.updateState('url',e.target.value);
                    }}></Input>
                </Col>
            </Row>
            <Row type="flex" align="middle" >
                <Col span={6}>方法</Col>
                <Col span={18}>
                    <Select style={{width:'100%'}} value={this.state.type} onChange={value=>{
                        this.updateState('type',value);
                    }}>
                        {httpTypes.map(v=>(
                            <Option key={v.value} value={v.value}>{v.name}</Option>
                        ))}
                    </Select>
                </Col>
            </Row>
            <div  className="panel-row style" style={{marginBottom:'10px'}}>
                <Row type="flex" justify="space-between" style={{marginBottom:'0',marginTop:'15px'}}>
                    <Col span={5}>
                        <h4>请求参数</h4>
                    </Col>
                    <Col span={6}>
                    <span className="param-delete">
                        <Icon type="close" onClick={e => this.handleDelete('params')} />
                    </span>
                    <span className="param-add" >
                        <Icon type="plus"  onClick={e => this.handleAdd('params')}/>
                    </span>
                    </Col>
                </Row>
                <Table 
                    columns={paramsColumns} 
                    rowSelection={{
                        type:'checkbox',
                        selectedRowKeys:this.state.paramsSelected,
                        onChange: (selectedRowKeys, selectedRows) => this.handleSelectRow('params',selectedRowKeys, selectedRows)
                    }}
                    dataSource={this.state.params} 
                    bordered
                    pagination={false}
                />
            </div>
            {/* <div  className="panel-row style" style={{marginBottom:'10px'}}>
                <Row type="flex" justify="space-between" style={{marginBottom:'0',marginTop:'15px'}}>
                    <Col span={5}>
                        <h4>请求头</h4>
                    </Col>
                    <Col span={6}>
                    <span className="param-delete">
                        <Icon type="close" onClick={e => this.handleDelete('headers')}/>
                    </span>
                    <span className="param-add" >
                        <Icon type="plus" onClick={e => this.handleAdd('headers')}/>
                    </span>
                    </Col>
                </Row>
                <Table 
                    columns={headersColumns} 
                    rowSelection={{
                        type:'checkbox',
                        selectedRowKeys:this.state.headersSelected,
                        onChange: (selectedRowKeys, selectedRows) => this.handleSelectRow('headers',selectedRowKeys, selectedRows)
                    }}
                    dataSource={this.state.headers} 
                    bordered
                    pagination={false}
                />
            </div> */}
        </div>
        )
    }
}