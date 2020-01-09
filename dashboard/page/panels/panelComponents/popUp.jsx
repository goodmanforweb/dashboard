import React ,{ Component } from 'react';

import axios from 'axios';
import { Input ,Select , Row, Col, Icon, Radio, Checkbox, Switch, Slider , TreeSelect, Table, Button, Menu , Popover, Collapse, Spin } from 'antd';
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const TreeNode = TreeSelect.TreeNode;
const { TextArea } = Input;
const SubMenu = Menu.SubMenu;
const Panel = Collapse.Panel;


class FilterList extends Component {
  constructor(props) {
    super(props);
    this.initValue(props);
    this.state = {
      spin: true,
      filterList: [],
      checkedList: [],
      indeterminate: true,
      checkAll: this.value.checkbox,
    };
    this.cacheInitValuetoString = {};
    
  }
  initValue(props) {
    const defaultValue = props.defaultValue;
    this.value = defaultValue ? {
      members: defaultValue.members,
      type: defaultValue.type,
      checkbox: defaultValue.checkbox,
      indeterminate: defaultValue.indeterminate,
      dirty: defaultValue.dirty
    } : {
      members: [],
      type: 'INCLUSION',
      checkbox: false,
      indeterminate: true,
      dirty: false
    };

    this.cacheInitValuetoString = JSON.stringify(this.value);
  }
  componentWillMount() {
    this.fetchFilterList();
  }
  fetchFilterList() {
    const props = this.props;
    let params = new URLSearchParams();
    params.append('catalog', props.cube.cname);
    params.append('cube', props.cube.id);
    params.append('level', props.item.value);
    axios({
      method: 'get',
      url: '/filename/plugin/pentaho-cdf-dd/api/olap/getPaginatedLevelMembers?pageSize=30&pageStart=1&searchTerm=&context=',
      responseType: 'json',
      params: params
    })
    .then(response => {
      if(response.status == 200) {
        this.setState({
          spin: false
        });
        this.handleFilterList(response.data.result.members);
      }
    })
    .catch(e => {
      this.setState({
          spin: false
        });
    });
  }
  handleFilterList(data) {
    console.log(data);
    this.setState({
      filterList: data.map(el => ({label: el.name, value: el.qualifiedName}))
    });
  }
  filterTabChange(type, e) {
    if(type == 'checkbox') {
      this.value.members = e.target.checked ? this.state.filterList.map(el => el.value) : [];
      this.value.checkbox = e.target.checked;
      this.value.indeterminate = false;

      this.setState({
        checkedList: this.value.members,
        indeterminate: this.value.indeterminate,
        checkAll: this.value.checkbox,
      });
    }
    else if(type == 'members') {
      const plainOptions = this.state.filterList;
      this.value.members = e;
      this.value.indeterminate = !!e.length && (e.length < plainOptions.length);
      this.value.checkbox = e.length === plainOptions.length;
      this.setState({
        checkedList: e,
        indeterminate: this.value.indeterminat,
        checkAll: this.value.checkbox,
      });
    }
    //=================以上是处理 全选 不全选的逻辑====================
    else if(type == 'type') {
      this.value[type] = e.target.value;
    }
    
    this.outPutValueChange();
  }
  outPutValueChange() {
    if(JSON.stringify(this.value) != this.cacheInitValuetoString) {
      this.value.dirty = true;
    } else {
      this.value.dirty = false;
    }
    this.props.onChange &&　this.props.onChange(this.value);
  }
  render() {
    const props = this.props;
    const value = this.value;
    return (
        <Spin tip='Loading' spinning={this.state.spin}>
        <Row type="flex" align="top" className="filterList" >
          <Col span={8}>选择成员</Col>
          <Col span={16}>
            <Checkbox
              indeterminate={this.state.indeterminate}
              onChange={e => this.filterTabChange('checkbox', e)}
              checked={this.state.checkAll}
            >
              Check all
            </Checkbox>
            <div style={{minHeight:90, maxHeight: 200, overflow: 'auto'}}>
              <CheckboxGroup options={ this.state.filterList }  defaultValue={value.members} value={this.state.checkedList} onChange={e => this.filterTabChange('members', e)} />
            </div>
          </Col>
        </Row>
        <Row type="flex" align="middle">
          <Col span={8}>匹配方式</Col>
          <Col span={16}>
            <RadioGroup  defaultValue={value.type} onChange={e => this.filterTabChange('type', e)}  defaultValue="INCLUSION">
               <Radio  key='1' value='INCLUSION'>包含</Radio>
               <Radio  key='2' value='EXCLUSION'>排除</Radio> 
            </RadioGroup>
          </Col>
        </Row>
      </Spin>
      )
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
});

const mapStateToProps = (state, ownProps) => ({
    globalParam: state.param
})

class FilterParam extends Component {
  constructor(props) {
    super(props);
    this.state={
      selectValue: ''
    };
    this.currentSelectObj = {};
    this.value = props.defaultValue ? {
        paramName: props.defaultValue.paramName ,
        paramValue: props.defaultValue.paramName ,
        dirty: props.defaultValue.dirty
      } : {
        paramName: '',
        paramValue: '',
        dirty: false
      }
    this.cacheInitValuetoString = JSON.stringify(this.value);
  }
  selectChange(e) {
    const target = e.nativeEvent.target
    console.log(target.value);
    const globalParam = this.props.globalParam;

    this.currentSelectObj = target.value ? globalParam.filter(el => el.key == target.value)[0] : {value: ''};

    this.setState({
      selectValue: this.currentSelectObj.value
    });

    this.value = {
      paramName: this.currentSelectObj.name,
      paramValue: this.currentSelectObj.value
    };
    this.outPutValueChange();
  }
  paramChange(e) {
    const value = e.nativeEvent.target.value;
    if(this.currentSelectObj.key != undefined) {
      this.props.dispatch({
        type:'updateParam',
        value:{
          key: this.currentSelectObj.key,
          value: value
        }
      });
      this.setState({
        selectValue: value
      });

      this.value.paramValue = value;
      this.outPutValueChange();
    }
  }
  outPutValueChange() {
    if(JSON.stringify(this.value) != this.cacheInitValuetoString) {
      this.value.dirty = true;
    } else {
      this.value.dirty = false;
    }
    this.props.onChange &&　this.props.onChange(this.value);
  }
  componentDidMount() {
    console.log(this)
  }
  render() {
    const {globalParam, dispatch} = this.props;
    const value = this.value;
    return (
      <div>
        <Row type="flex" align="middle" style={{marginBottom: 8}}>
          <Col span={8}>选择参数</Col>
          <Col span={16}>
            <select defaultValue={value.paramName} onChange={e => this.selectChange(e)} style={{height:25, width: '100%',  borderRadius: 4}} >
              <option value=''>选择参数</option>
              {globalParam.map((el, i) => <option key={i} value={el.key}>{el.name}</option>)}
            </select>
          </Col>
        </Row>
        <Row type="flex" align="middle" >
          <Col span={8}>默认值</Col>
          <Col span={16}>
            <input 
            placeholder="默认值" 
            type="text"
            value={value.paramValue}  
            style={{height:25, width: '100%', border: '1px solid rgb(169, 169, 169)', borderRadius: 4, paddingLeft: 3}} 
            onChange={e => this.paramChange(e)}
            />
          </Col>
        </Row>
      </div>)
  }
}

FilterParam = connect(
  mapStateToProps,
  mapDispatchToProps
)(FilterParam);

class FilterCustom extends Component {
  constructor(props) {
    super(props);
    this.selectConfig = [
      {
        name: 'accurate',
        value: '精确匹配'
      },
      {
        name: 'contain',
        value: '包含'
      },
      {
        name: 'startWith',
        value: '开头为'
      },
      {
        name: 'endWidth',
        value: '结尾为'
      },
      {
        name: 'null',
        value: '为空'
      },
    ];

    this.value = props.defaultValue ? {
      matchValue: props.defaultValue.matchValue,
      matchMethod: props.defaultValue.matchMethod,
      dirt: props.defaultValue.dirty
    } : {
      matchValue: '',
      matchMethod: '',
      dirty: false
    };
    this.cacheInitValuetoString = JSON.stringify(this.value);
  }

  customChange(type, e) {
    this.value[type] = e.nativeEvent.target.value;
    this.outPutValueChange();
  }
  outPutValueChange() {
    if(JSON.stringify(this.value) != this.cacheInitValuetoString) {
      this.value.dirty = true;
    } else {
      this.value.dirty = false;
    }
    this.props.onChange &&　this.props.onChange(this.value);
  }
  render() {
    const props = this.props;
    const value = this.value;
    return (
      <div>
        <Row type="flex" align="middle" style={{marginBottom: 8}}>
          <Col span={8}>匹配值</Col>
          <Col span={16}>
            <input 
              style={{height:25, width: '100%', border: '1px solid rgb(169, 169, 169)', borderRadius: 4, paddingLeft: 3}}
              placeholder="输入匹配内容" 
              defaultValue={value.matchValue} 
              onChange={e => this.customChange('matchValue', e)}
            />
          </Col>
        </Row>
        <Row type="flex" align="middle" >
          <Col span={8}>匹配方式</Col>
          <Col span={16}>
           <select defaultValue={value.matchMethod} onChange={e => this.customChange('matchMethod', e)} style={{height:25, width: '100%',  borderRadius: 4}}>
              {
                this.selectConfig.map((el, i) => <option key={i} value={el.name}>{el.value}</option>)
              }
           </select>
          </Col>
        </Row>
      </div>)
  }
}

class  PopupContent extends Component {
  constructor(props) {
    super(props);
    this.radioConfig = ['无定义', '从列表中选择', '匹配参数', '自定义'];
    this.state={
      radioIndex: 0
    };
    this.filterValue = {
      selection: {
        members: [],
        type: 'INCLUSION',
        checkbox: false,
        indeterminate: true
      },
      matchParam: {
        paramName: '',
				paramValue: ''
      },
      custom: {
        matchMethod: '',//[{name:"accurate",value:"精确匹配"},{name:"contain",value:"包含"},{name:"startWith",value:"开头为"},{name:"endWidth",value:"结尾为"},{name:"null",value:"为空"}];
				matchValue: ''
      },
      hasFilter: false
    };
  }
  filterTabChange(e) {
    this.setState({
      radioIndex: e.target.value
    });
    this.popupChange('hasFilter', e.target.value != 0);
    console.log(e.target.value)
  }
  filterTabDispather() {
    const {item, cube} = this.props;
    return [
      '', 
    <FilterList onChange={e => this.popupChange('selection', e)}  item={item} cube={cube} />, 
    <FilterParam onChange={e => this.popupChange('matchParam', e)}  item={item} cube={cube} />, 
    <FilterCustom onChange={e => this.popupChange('custom', e)}  item={item} cube={cube} />
    ][this.state.radioIndex];
  }

  popupChange(which, e) {
    this.filterValue[which] = e;
    this.props.onChange && this.props.onChange(this.filterValue);
  }
  render() {
     const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };
    return (<div className="popupWrap">
            <div className="popup-hd" style={{padding: 6}}>
              <RadioGroup onChange={e => this.filterTabChange(e)}  defaultValue="0">
                {
                  this.radioConfig.map((el, i) =>  <Radio style={radioStyle} key={i+''} value={i}>{el}</Radio>)
                }
              </RadioGroup>
            </div>
            <div className="popup-bd" style={{padding: 6}}>
              {this.filterTabDispather()}
            </div>
          </div>);
  }
} 



export default PopupContent;