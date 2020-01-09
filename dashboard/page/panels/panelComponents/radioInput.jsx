import React ,{ Component } from 'react';

import { Input ,Select , Row, Col, Icon, Radio, Switch, Slider , Popconfirm, Table} from 'antd';
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;



class RadioInput extends Component {
  constructor(props) {
    super(props);
  }
  
  convertConfig(props, direction=true) {
    let unitToValue = {};
    props.config.forEach(cfg => {
      direction ? (unitToValue[cfg.unit ? cfg.unit : cfg.value] = cfg.value) 
                : (unitToValue[cfg.value] = cfg.unit ? cfg.unit : cfg.value)
    });
    return unitToValue;
  }
  initDefaultValue(props) {
    let result = {}, unitToValue = null;

    //  ["auto", undefined, "auto", index: 0, input: "auto"]
    let value = props.value, config = props.config, reg = value.match(/(\d+)?(auto|px|%)$/);;
    if(reg) {
      let unit = reg[2], inputValue = reg[1] ? reg[1] : '';
      unitToValue = this.convertConfig(props);
      result = {
        defaultValue: unitToValue[unit],
        inputValue
      }
    }
    else {
      result = {
        defaultValue: this.activeInput || this.props.config[0].value,
        inputValue:''
      }
    }
    return result;
  }
  componentWillReceiveProps(nextProps) {
  }
  
  inputChange(e, type) {
    if(type != this.activeInput) return false;

    this.props.onChange(e.target.value + (this.convertConfig(this.props, false)[this.activeInput] || 'px'));//+unit 单位

  }
  handleChange(e) {
    const radioValue = e.target.value;
    const config = this.props.config;
    
    let defaultValue = config.filter(cfg => cfg.value == radioValue)[0].defaultValue;
    //获得焦点
    this[radioValue] && this[radioValue].focus();
    //记录当前
    this.activeInput = radioValue;
    //设置默认值
    //如果存在相应input,那么就有defaultValue
    if(this[radioValue]) {
      
      // this.setState({
      //   defaultValue: radioValue,
      //   inputValue: defaultValue
      // });
    }
    //触发onchange
    console.log(this[radioValue] ? (defaultValue + this.convertConfig(this.props, false)[this.activeInput] || 'px') : radioValue);
    console.log();
    this.props.onChange(this[radioValue] ? (defaultValue + this.convertConfig(this.props, false)[this.activeInput] || 'px') : radioValue);

  }
  render() {
    // {[{name:'自适应',value:'auto'},{name:'固定',value:'custom', unit:'px', defaultValue:1200, },{name:'', value:'ratio', unit:'%', defaultValue:'50%'}}]}
    let config = this.props.config;
    let {defaultValue, inputValue} = this.initDefaultValue(this.props);
    console.log(defaultValue);
    let handleInputValue = cfg => {
      if(defaultValue == cfg.value) {
        return inputValue
      }
      return '';
    }
    
           return <RadioGroup value={defaultValue} onChange={e => this.handleChange(e)} >
              {
                config.map((cfg,i) => (
                    <Radio value={cfg.value} key={i}>
                      {cfg.name ? cfg.name : ''} 
                        {
                          cfg.defaultValue != undefined ? <input 
                                                            onChange={e => this.inputChange(e, cfg.value)} 
                                                            value={handleInputValue(cfg)}
                                                            ref={dom => this[cfg.value] = dom} 
                                                            type="number" 
                                                            style={{width: cfg.width ? cfg.width : 50, border: '1px solid #d9d9d9'}}
                                                            /> : ''
                        }
                      {cfg.unit ? cfg.unit : ''}
                     </Radio>
                ))
              }
           </RadioGroup>
  }
}

export default RadioInput;