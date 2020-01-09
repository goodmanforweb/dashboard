import React ,{ Component } from 'react';
import {Row, Col, Radio} from 'antd';
import _ from 'lodash';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

// name,value, onChange, options
class XRadio extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value
    };
  }
  
  componentWillReceiveProps(nextProps) {
    console.log(23)
    this.setState({
      value: nextProps.value
    })
  }
  shouldComponentUpdate(nextProps,nextState) {
    console.log(24)
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
    console.log(25)
    return <Row type="flex" align="middle" >
            <Col span={6}>{this.props.name}</Col>
            <Col span={18}>
               <RadioGroup  value={this.state.value} onChange={e => this.onChange(e.target.value)}>
                {
                  this.props.options.map((option,i) => {
                    return <RadioButton key={i} value={option.value}>{option.name}</RadioButton>
                  })
                }
              </RadioGroup>            
            </Col>
          </Row>
  }
}


export default XRadio;