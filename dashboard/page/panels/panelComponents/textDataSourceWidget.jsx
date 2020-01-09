





import React ,{ Component } from 'react';

import {Select , Row, Col, Switch,Icon} from 'antd';
const Option = Select.Option;


class TxtSourceWidget extends Component {
  constructor(props) {
    super(props);
  }
  handleChange(type, e) {
    const props = this.props;
    const config = {
      isUsed: e => ({dataSourceInfo: {isUsed: e}}),
      value:  e => ({dataSourceInfo: {value: e.split("-")[1],valueKey: e.split("-")[0]}})
    };

    props.dispatch({
      type:'updateComponent',
      value: {
        id: props.activePanel.base.id,
        data: config[type](e)
      }  
    });
  }
  render() {
    const {globalParam, activePanel, dispatch} = this.props;
    const dataSourceInfo = activePanel.dataSourceInfo;
    return (<div><Row type="flex" align="middle" >
        <Col span={6}>启用查询</Col>
        <Col span={18}>
          <Switch defaultChecked={dataSourceInfo.isUsed}  onChange={e => this.handleChange('isUsed', e)} checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="cross" />}/>
        </Col>
      </Row>
      {dataSourceInfo.isUsed ? <Row type="flex" align="middle" >
        <Col span={6}>保存结果到</Col>
        <Col span={18}>
          <Select  value={dataSourceInfo.value}  style={{ width: '100%' }} onChange={e => this.handleChange('value', e)} placeholder="请选择数据方式">
            {
              globalParam.map((el, i) => {
                return <Option value={el.key +"-"+ el.name} key={i} >{el.name}</Option>;
              })
            }
          </Select>
        </Col>
      </Row> : ''}
      </div>);
  }
}      


export default TxtSourceWidget;