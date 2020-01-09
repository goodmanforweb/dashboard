import React ,{ Component } from 'react';

import { Input, Row, Col, Icon, Radio, Popconfirm, Table} from 'antd';


class ParamTable extends Component {
  constructor(props) {
    super(props);
    this.message = [
      '请选择一行，然后删除',
      '确定要删除该行?'
    ];
    this.state = {
      message:this.message[1]
    };
    this.selectedRowKeys = [];
  }
  componentWillUnmount() {
    console.log('组件摧毁',this)
  }
  handleParam(className) {
    if(className == 'param-add') {
      this.props.addParam();
    }
    else if(className == 'param-delete') {
      this.setState({
          message: this.selectedRowKeys.length == 0   ? this.message[0] : this.message[1]
      });
    }
  }
  confirm(e) {
    if(this.selectedRowKeys.length == 0)return false;
    this.props.deleteParam(this.selectedRowKeys);
  }
  cancel(e) {

  }
  handleSelectRow(selectedRowKeys, selectedRows) {
    this.selectedRowKeys = selectedRows.slice(0).map(el => el.key)
  }
  render() {
    return <div>
          <Row type="flex" justify="space-between" style={{marginBottom:'15px'}}>
              <Col span={5}><h4>高级属性</h4></Col>
              <Col span={3}>
                <span className="param-add"><Icon type="plus" onClick={e => this.handleParam('param-add')} /></span>
                <Popconfirm placement="bottomRight" title={this.state.message} onConfirm={e => this.confirm(e)} onCancel={e => this.cancel(e)} okText="确定" cancelText="取消">
                  <span className="param-delete"><Icon type="close" onClick={e => this.handleParam('param-delete')} /></span>
                </Popconfirm>
              </Col>
          </Row>
          <Table 
            columns={this.props.columns} 
            rowSelection={{
              type:'checkbox',
              onChange: (selectedRowKeys, selectedRows) => this.handleSelectRow(selectedRowKeys, selectedRows)
            }}
            dataSource={this.props.data} 
            bordered
            pagination={false}
          />
    </div>
  }
}

export default ParamTable;
