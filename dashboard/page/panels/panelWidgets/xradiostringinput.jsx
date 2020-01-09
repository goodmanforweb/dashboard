import React ,{ Component } from 'react';
import _ from 'lodash';
import { Input,Row, Col,Radio} from 'antd';
const RadioGroup = Radio.Group;


// props  name options value onchange
class XRadioStringInput extends Component {
  constructor(props) {
    super(props);
    this.state = this.initDefaultValue(this.props)
  }
  initDefaultValue(props) {
    let result = {}, unitToValue = null;

    result = {
      radioValue: /^\d+$/.test(props.value + '') ? 0 : props.value,
      inputValue: props.value + '',
      inputShow: /^\d+$/.test(props.value + '')
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
        //添加选择显示隐藏
    console.log('qazassd',radioValue,inputValue,unit);
    this.setState({
      radioValue,
      inputValue,
      inputShow: radioValue == ""
    }, () => {
      this.props.onChange && this.props.onChange(inputValue);
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
    let layoutRatia = /*this.props.options.length >= 3 ? [4, 20] : */[6, 18]
    return <Row type="flex" align="middle" >
            <Col span={layoutRatia[0]}>{this.props.name}</Col>
            <Col span={layoutRatia[1]}>
              <RadioGroup value={this.state.radioValue} onChange={e => this.handleChange(e)} >
              {
                this.props.options.map((option, i) => {
                  return <Radio key={i} value={option.value}>
                        {option.name ? option.name : ''}
                        {
                           (option.defaultValue != 'auto' && option.defaultValue != 'close' &&/* typeof option.defaultValue === 'number' &&*/ this.state.inputShow) ?
                           <input 
                            onChange={e => this.inputChange(e, option)} 
                            value={this.state.radioValue == option.value ? this.state.inputValue : ''}
                            ref={dom => this[option.value] = dom}
                            type="string"
                            style={{width: option.width ? option.width : 50, border: '1px solid #d9d9d9'}}
                            /> : ''
                        }
                        {(option.name2 && this.state.inputShow) ? option.name2 : ''}
                        </Radio>
                })
              }
              </RadioGroup>
            </Col>
          </Row>
  }
}

export default XRadioStringInput;