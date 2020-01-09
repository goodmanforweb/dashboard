import React ,{ Component } from 'react';
import {Row, Col, Select} from 'antd';
const Option = Select.Option;
import _ from 'lodash';


// name,value, onChange, options
class XSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value
    };
  }
  
  componentWillReceiveProps(nextProps) {
    this.setState({
      value: nextProps.value
    })
  }
  shouldComponentUpdate(nextProps,nextState) {
    if( _.isEqual(nextState, this.state) &&
                        (nextProps.value == this.state.value) && 
                        (nextProps.name == this.props.name) && 
                        (_.isEqual(nextProps.options, this.props.options)
                        )) {
      return false;
    }
    return true;
  }

  onChange(e) {
    this.setState({
      value: e
    },() => {
        this.props.onChange && this.props.onChange(e);
    })
  }
  render() {
    return <Row type="flex" align="middle" >
            <Col span={6}>{this.props.name}</Col>
            <Col span={18}>
              <Select value={this.state.value} onChange={e => this.onChange(e)} style={{width: '100%'}}>
                {
                  this.props.options.map((option,i) => <Option key={i} value={option.value}>{option.name}</Option>)
                }
              </Select>
            </Col>
          </Row>
  }
}


export default XSelect;