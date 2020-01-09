import React ,{ Component } from 'react';
import { dispatch ,xuduListener} from 'xdux/index';
import { Col, Row , Radio, Slider, Table,Input, Popover, Button ,Icon, Popconfirm, message, Select} from 'antd';
import { Scrollbars } from "react-custom-scrollbars";
const Option = Select.Option;


class PanelParam extends React.Component {
  
  constructor(props) {
    super(props);
    this.message = [
      '请选择要删除的参数',
      '使用了该参数的其它图表或控件将无法正常工作！确实要删除吗?'
    ];
    this.selectedRowKeys = [];
    this.state = {
      message: this.message[1],
      params: this.buildParams(this.getAllParams())
    };
    this.init();
  }
  init() {
    // this.initParamChangeListener();
  }
  getAllParams() {
    return window.Dashboard.globalParam.params.container
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.paramChange) {
      this.setState({
        params: this.buildParams(nextProps.paramChange)
      })
    }
  }
  buildParams(params) {
    return params.map(paramInstance => ({
      key: paramInstance.id,
      name: paramInstance.name,
      defaultValue: paramInstance.defaultValue,
      type: paramInstance.type
    }))
  }
  initParamChangeListener() {
    window.Dashboard.event.subscribe('paramChange', data => {
      this.setState({
        params: this.buildParams(data)
      })
    });
  }
  coloumnChange(value, record, type) {
    // console.log(3)
    let temp = {
      key:record.key
    };
    value = value+''.trim();
    if(type == 'name') {
      if(!/^\s*[\w\d\._]*\s*?$/ig.test(value)) {
        message.warn('参数名只能为字母、数字、下划线和点四种类型的字符',3,() => {});       
        return false;
      }
    }
    temp[type] = value;
    if(type === 'type') {
      //改变参数类型 就立即保存到core ，然后通过receiveProps更新
      //把key 装换成id
        temp.id = temp.key;
        delete temp.key;
        dispatch({
          type:'updateParam',
          value:temp
        })
    }
    else {
      this.setState({
      params: this.state.params.map(param => param.key === record.key ? Object.assign(param, {[type]: value}) : param)
      }, () => {
        
      });
    }
  }
  //失去焦点 才 把值保存到corejs 中，同时检验参数名称是否相同
  saveToCore(value, record, type) {
    let temp = {
      id:record.key
    };
    //检验参数名是否相同
    if(type === 'name') {
      if(!value) {
        message.warn('参数名不能为空',2,() => {
          //恢复之前的数据，如果有的话
          //找到之前的 数据
          let oldParam = this.getAllParams().find(param2 => param2.id == record.key);
          if(oldParam && oldParam.name) {
            this.setState({
              params: this.state.params.map(param => param.key === record.key ? Object.assign(param, {name: oldParam.name}) : param)
            });   
          }
        });
        return false;
      }
      if(this.getAllParams().filter(param => param.id != record.key).map(param => param.name).includes(value)) {
        message.warn('参数名已被使用，请重新输入',3,() => {});   
        //清空当前参数名
        this.setState({
          params: this.state.params.map(param => param.key === record.key ? Object.assign(param, {'name': ''}) : param)
        });   
        return false;
      }
    }
    temp[type] = value;
    dispatch({
      type:'updateParam',
      value:temp
    })
    
  }
  handleParam(className) {
    if(className == 'param-add') {
      dispatch({
        type:'addParam'
      })
    }
    else if(className == 'param-delete') {
      this.setState({
          message: this.selectedRowKeys.length == 0 ? this.message[0] : this.message[1]
      });
    }
  }
  confirm(e) {
    if(this.selectedRowKeys.length == 0)return false;
    dispatch({
      type:'deleteParam',
      value:{
        ids:this.selectedRowKeys
      }
    });
    this.selectedRowKeys = [];
  }
  cancel(e) {
    // this.selectedRowKeys = [];
  }
  handleSelectRow(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRows.map(el => el.key)
  }

  render() {
    
    let columns = [
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        width:'25%',
        render: (v, record, index) => (
          <Input placeholder="参数名" defaultValue={v}  value={v} onBlur={e => this.saveToCore(e.target.value,record,'name')} onChange={ e => this.coloumnChange(e.target.value,record,'name')}/>
        )
      }, {
        title: '初始值',
        dataIndex: 'defaultValue',
        key: 'defaultValue',
        render: (v, record, index) => (
          <Input placeholder="参数值" defaultValue={v}  onBlur={e => this.saveToCore(e.target.value,record,'defaultValue')} onChange={ e => this.coloumnChange(e.target.value,record,'defaultValue')}/>
        )
      }, {
        title:'类型',
        dataIndex:'type',
        key:'type',
        width:'25%',
        render: (v, record, index) => {
          return <Select value={v} style={{ width: '100%' }} onChange={ e => this.coloumnChange(e,record,'type')} >
               {
                 ['Numeric','Integer','String'].map((el, i) => {
                   return <Option value={el} key={i} >{el}</Option>;
                 })
               }
              </Select>
        }
      }
    ];
    return <Scrollbars autoHide style={{ height: "100%" }}>
            <div className="panel-row style">
            <Row type="flex" justify="space-between" style={{ marginBottom: "15px" }}>
                <Col span={5}>
                <h4>参数列表</h4>
                </Col>
                <Col span={6}>
                <Popconfirm placement="bottomRight" title={this.state.message} onConfirm={e => this.confirm(e)} onCancel={e => this.cancel(e)}>
                    <span className="param-delete">
                    <Icon type="close" onClick={e => this.handleParam("param-delete")} />
                    </span>
                </Popconfirm>
                <span className="param-add">
                    <Icon type="plus" onClick={e => this.handleParam("param-add")} />
                </span>
                </Col>
            </Row>
            <Table columns={columns} rowSelection={{ type: "checkbox", onChange: (selectedRowKeys, selectedRows) => this.handleSelectRow(selectedRowKeys, selectedRows) }} dataSource={this.state.params} bordered pagination={false} />
            </div>
        </Scrollbars>;
  }
}

export default xuduListener(['paramChange'])(PanelParam);
// export default PanelParam;