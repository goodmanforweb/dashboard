import React from 'react';
import { Col, Row , Radio, Slider, Table,Input, Popover, Button ,Icon, Popconfirm, message, Select} from 'antd';
const Option = Select.Option;
import Immutable,{Map,is} from 'immutable';



class MyParamsTable extends React.Component {
	constructor(props) {
    super(props);
    const { option } = props.Instance.cfg.chartDefinition;
    const globelParams = window.Dashboard.globalParam.params.container;
    console.log(props,'adasdasd');
    this.state={
      columns: [
        {
          title: '对象',
          dataIndex: 'name',
          key: 'name',
          width:'50%'
        }, {
          title: '参数',
          dataIndex: 'value',
          key: 'value',
          render: (text, record, index) => {
            return <Select value={text} style={{ width: '100%' }} onChange={ e => this.coloumnChange(e, record)} >
                   {
                     this.assignOption().map((el,i )=> {
                       return <Option value={el.id} key={i} style={{height:32}}>{el.name}</Option>;
                     })
                   }
              </Select>
          }
        }
      ],
      data: Object.keys(option.clickParmas).map((e,i) => ({
        key: option.clickParmas[e].id || i + '_' + i,
        name: e,
        value: option.clickParmas[e].name || ' '
      }))
    }
	}
  assignOption(){
    return [{id:'__haha',name:' ',type:'string',value:' '},...window.Dashboard.globalParam.params.container];
  }
  coloumnChange(e,record){
    // console.log(e,record,'asdasd');
    var data = Immutable.fromJS(this.state.data).toJS();
    let params = window.Dashboard.globalParam.params.container;
    let thisParam = params.find(item => item.id === e) || {id: '',name: ''};
    data.forEach(el =>{
      el.name === record.name && (el.value = thisParam.name);
    })
    this.setState({
      data: data
    },() => {
      let { option } = this.props.Instance.cfg.chartDefinition;
      
      option.clickParmas[record.name] = thisParam;
    });
  }
	componentWillReceiveProps(nextProps) {
		// console.log(1345,nextProps);
    const { option } = nextProps.Instance.cfg.chartDefinition; 
    this.setState({
      data: Object.keys(option.clickParmas).map((e,i) => ({
        key: option.clickParmas[e].id || i + '_' + i,
        name: e,
        value: option.clickParmas[e].name || ' '
      }))
    });
  }
	changeType(value,item) {
	  
	}
  render() {
    return <Row type="flex" align="top">
        <Col span={6}>保存到参数</Col>
        <Col span={16}>
          <Table 
            columns={this.state.columns} 
            dataSource={this.state.data} 
            bordered
            pagination={false}
          />
        </Col>
      </Row>
  }
}
export default MyParamsTable

