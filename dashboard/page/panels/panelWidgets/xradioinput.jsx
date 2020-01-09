import React ,{ Component } from 'react';
import _ from 'lodash';
import { Input,Row, Col,Radio} from 'antd';
const RadioGroup = Radio.Group;


// props  name options value onchange
class XRadioInput extends Component {
  constructor(props) {
    super(props);
    this.state = this.initDefaultValue(this.props)
  }
  convertConfig(props, direction=true) {
    let unitToValue = {};
    props.options.forEach(cfg => {
      direction ? (unitToValue[cfg.unit ? cfg.unit : cfg.value] = cfg.value) 
                : (unitToValue[cfg.value] = cfg.unit ? cfg.unit : cfg.value)
    });
    return unitToValue;
  }
  initDefaultValue(props) {
    let result = {}, unitToValue = null;

    //  ["auto", undefined, "auto", index: 0, input: "auto"]
    let value = props.value + '', reg = value.match(/(\d+)?(auto|px|%)$/);;
    if(reg) {
      let unit = reg[2], inputValue = reg[1] ? reg[1] : '';
      unitToValue = this.convertConfig(props);
      result = {
        radioValue: unitToValue[unit],
        inputValue
      }
    }
    else {
      result = {
        radioValue: this.activeInput || this.props.options[0].value,
        inputValue: ''
      }
    }
    this.activeInput = result.radioValue;
    return result;
  }
  componentWillReceiveProps(nextProps) {
    this.setState(this.initDefaultValue(nextProps))
  }
  shouldComponentUpdate(nextProps, nextState) {
    if(_.isEqual(nextProps, this.props) && _.isEqual(this.state, nextState)) {
      return false;
    }
    return true;
  }
  inputChange(e, option) {
    console.log(option.value,this.activeInput);
    if(option.value != this.activeInput) return false;
    this.output(this.activeInput, e.target.value, option.unit);
  }
  output(radioValue, inputValue, unit) {
    this.setState({
      radioValue,
      inputValue
    }, () => {
      this.props.onChange && this.props.onChange(unit ? `${inputValue}${unit}` : inputValue);
    })
  }
  handleChange(e) {
    const radioValue = e.target.value;
    const config = this.props.options;
    //给第一个添加默认值
    // config[0].defaultValue = config[0].value;
    let {defaultValue, unit, value} =  config.filter(cfg => cfg.value == radioValue)[0];
    let outputValue = '';
    //获得焦点
    this[radioValue] && this[radioValue].focus();
    //记录当前
    this.activeInput = radioValue;
    //设置默认值
    //如果存在相应input,那么就有defaultValue
    if(this[radioValue]) {
      this[radioValue].value = defaultValue;
    }
    outputValue = defaultValue;
    //触发onchange
    // this.props.onChange(this[radioValue] ? (defaultValue + this.convertConfig(this.props, false)[this.activeInput] || 'px') : radioValue);
    this.output(this.activeInput, outputValue, unit);
  }
  render() {
    // {[{name:'自适应',value:'auto'},{name:'固定',value:'custom', unit:'px', defaultValue:1200, },{name:'', value:'ratio', unit:'%', defaultValue:'50%'}}]}
    let layoutRatia = this.props.options.length >= 3 ? [4, 20] : [6, 18]
    return <Row type="flex" align="middle" >
            <Col span={layoutRatia[0]}>{this.props.name}</Col>
            <Col span={layoutRatia[1]}>
              <RadioGroup value={this.state.radioValue} onChange={e => this.handleChange(e)} >
              {
                this.props.options.map((option, i) => {
                  return <Radio key={i} value={option.value}>
                        {option.name ? option.name : ''}
                        {
                           option.defaultValue != 'auto' ? 
                           <input 
                            onChange={e => this.inputChange(e, option)} 
                            value={this.state.radioValue == option.value ? this.state.inputValue : ''}
                            ref={dom => this[option.value] = dom} 
                            type="number" 
                            style={{width: option.width ? option.width : 50, border: '1px solid #d9d9d9'}}
                            /> : ''
                        }
                        {option.unit ? option.unit : ''}
                        </Radio>
                })
              }
              </RadioGroup>
            </Col>
          </Row>
  }
}

export default XRadioInput;