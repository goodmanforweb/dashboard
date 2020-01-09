import React ,{ Component } from 'react';
import {Row, Col} from 'antd';
import _ from 'lodash';

// name, options, defaultValue, value, onChange
class XIconPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value
    };
  }
  
  componentWillReceiveProps(nextProps) {
    console.log(44)
    this.setState({
      value: nextProps.value
    })
  }
  shouldComponentUpdate(nextProps,nextState) {
    console.log(45);
    
    if( _.isEqual(nextState, this.state) &&
                        (nextProps.value == this.state.value) && 
                        (nextProps.name == this.props.name) && 
                        (_.isEqual(nextProps.options, this.props.options)
                        )) {
      return false;
    }
    

    return true;
  }

  iconSelect(e) {
    let index = e.target.dataset['key'];
    if(index == undefined ) return ;
    const value = this.props.options[index].value;
    this.setState({
      value
    }, () => {
      this.props.onChange && this.props.onChange(value);
    });
  }
  render() {
    console.log(46)
    const props = this.props;
    return <Row type="flex" align="middle" >
            <Col span={6}>{props.name}</Col>
            <Col span={18}>
              <div className="iconSelect" onClick={e => this.iconSelect(e)}>
              {
                this.props.options.map((el, i) => {
                   return <span className="icon" key={i}  data-key={i} style={{border:el.value == this.state.value ? "1px solid #108ee9":"1px solid transparent"}}><img data-key={i} width="24" src={el.icon} title={el.name}/></span>
                })
              }
              </div>
            </Col>
          </Row>
  }
}


export default XIconPicker;