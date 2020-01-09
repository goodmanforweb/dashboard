import React ,{ Component } from 'react';
import FolderWrap from './folderWrap';
import CssAndJsPopup from './cssAndJsPopup';
import { Col, Row , Radio, Slider, Table,Input, Popover, Button ,Icon, Popconfirm, message} from 'antd';
const { TextArea } = Input;


class SeniorProperty extends Component {

  constructor(props) {
    super(props);
    
    this.message = [
      '请选择一行，然后删除',
      '确实要删除吗?'
    ];
    this.selectedRowKeys = [];
    this.state = {
      editeValue:'',
      editeShow: false,
      message:this.message[1]
    };
    
  }

  coloumnChange(e, record,type) {
    
    
    if(type == 'exec') {
      this.props.dispatch({
        type:'updateComponent',
        value:{
          id: this.props.base.id,
          data: {senior: {value: {[record]: {value: e.target.value}}}}
        }
      })
    }
    else {
      let temp = {
        key:record.key
      };
      const value = e.target.value+''.trim();
      if(type == 'name') {
        if(!/^\s*[\w\d\._\[\]]*\s*?$/ig.test(value)) {
          message.warn('参数名只能为字母、数字、下划线、点、中括号类型的字符',3,() => {});
          // temp[type]="";
          // this.props.dispatch({
          //   type:'updateSenior',
          //   value:{
          //     id: this.props.base.id,
          //     type:'update',
          //     data: temp
          //   }
          // })
          return false;
        }
      }
      temp[type] = value;
      this.props.dispatch({
        type:'updateSenior',
        value: {
          id: this.props.base.id,
          type:'update',
          data: temp
        }
      })
    }
    
  }

  handleParam(className) {
    if(className == 'param-add') {
      this.props.dispatch({
        type:'updateSenior',
        value: {
          id: this.props.base.id,
          type: 'add'
        }
      })

    }
    else if(className == 'param-delete') {
      this.setState({
          message: this.selectedRowKeys.length == 0   ? this.message[0] : this.message[1]
      });
    }
  }
  confirm(e) {
    if(this.selectedRowKeys.length == 0)return false;
    this.props.dispatch({
      type:'updateSenior',
      value:{
        id: this.props.base.id,
        type:'delete',
        data: {
          keys:this.selectedRowKeys
        }
      }
    })
  }
  cancel(e) {

  }
  handleSelectRow(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRows.slice(0).map(el => el.key)
  }
  objToarrAndsort(obj) {
    let arr = [];
    for(let b in obj) {
      arr.push({
        key: b,
        ...obj[b]
      })
    }
    //把property放最后

    return arr;
  }
  saveEditeToRedux(val) {
    this.coloumnChange({target:{value: val}}, this.currentRecord, this.currentType);
  }
  bindEditeToValue(record, type) {
    this.currentRecord = record;
    this.currentType = type;
  }
  showEdite(record, type,currentValue) {
    console.log(record, type, currentValue);
    this.bindEditeToValue(record, type);
    this.setState({
      editeShow: true,
      editeValue: currentValue
    })
  }
  hideEdite() {
    this.setState({
      editeShow: false
    })
  }
  render() {
    console.log(this);
    let columns = [
      {
        title: '属性名',
        dataIndex: 'name',
        key: 'name',
        width:'40%',
        render: (v, record, index) => (
            <Input placeholder="属性名" defaultValue={v}  value={v} onChange={ e => this.coloumnChange(e,record,'name')}/>
        )
      }, {
        title: '值',
        dataIndex: 'value',
        key: 'value',
        render: (v, record, index) => (
          <span className="flex center" >
            <TextArea placeholder="参数值" className="resizeTextarea" value={v}  style={{width: '86%'}} onChange={ e => this.coloumnChange(e,record,'value')} autosize/>
            <Icon type="arrows-alt" title="宽口放大" className="senior-code-btn" onClick={this.showEdite.bind(this, record, 'value', v)}/>
          </span>
        )
      }
    ];

    let codeEdite = {
      title:'高级属性-编辑器',
      type:'javascript',
      onOK:(val)=> {this.saveEditeToRedux(val); this.hideEdite.call(this)},
      onCancel: this.hideEdite.bind(this),
      show: this.state.editeShow,
      value: this.state.editeValue,
      onChange: (e)=> console.log(e),
      hasSelect: false,
    };
    return <FolderWrap name={this.props.senior.name}>
                {
                  this.objToarrAndsort(this.props.senior.value).map((pp, i) => {
                    return pp.key != 'property' ? (<Row type="flex" align="middle" key={i}>
                                                      <Col span={6}>{pp.name}</Col>
                                                      <Col span={16}><TextArea  className="resizeTextarea" value={pp.value} onChange={ e => this.coloumnChange(e,pp.key,'exec')} autosize /></Col>
                                                      <Col span={2}><Icon type="arrows-alt" title="宽口放大" className="senior-code-btn" onClick={this.showEdite.bind(this, pp.key,'exec',pp.value)}/></Col>
                                                  </Row>) 
                                                  : 
                                                  (<div className="senior-prop" key={i}>
                                                      <Row type="flex" justify="space-between" style={{marginBottom:'15px'}}>
                                                        <Col span={5}>高级属性</Col>
                                                        <Col span={6}>
                                                          <Popconfirm placement="bottomRight" title={this.state.message} onConfirm={e => this.confirm(e)} onCancel={e => this.cancel(e)} okText="确定" cancelText="取消">
                                                            <span className="param-delete"><Icon type="close" onClick={e => this.handleParam('param-delete')} /></span>
                                                          </Popconfirm>
                                                          <span className="param-add" ><Icon type="plus" onClick={e => this.handleParam('param-add')} /></span>
                                                        </Col>
                                                      </Row>
                                                        <Table 
                                                          columns={columns} 
                                                          rowSelection={{
                                                            type:'checkbox',
                                                            onChange: (selectedRowKeys, selectedRows) => this.handleSelectRow(selectedRowKeys, selectedRows)
                                                          }}
                                                          dataSource={this.props.senior.value.property.value} 
                                                          bordered
                                                          pagination={false}
                                                        />
                                                  </div>);
                  })
                }
                {
                  this.state.editeShow ? <CssAndJsPopup    {...codeEdite} /> : null
                }
            </FolderWrap>
  }
}


export default SeniorProperty;