import React ,{ Component } from 'react';
import {Row, Col, Switch} from 'antd';
import _ from 'lodash';

// name, icons, defaultValue, value, onChange
class XSwitch extends Component {
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
                        (nextProps.name == this.props.name)
                        ) {
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
               <Switch checked={this.state.value} onChange={e => this.onChange(e)}/>
            </Col>
          </Row>
  }
}


export default XSwitch;