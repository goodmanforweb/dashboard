import React ,{ Component } from 'react';
import { Input ,Select , Row, Col, Icon, Radio, Switch, Slider , TreeSelect, Table, Button, Menu , Popover, Collapse } from 'antd';
const { Option, OptGroup } = Select;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const SubMenu = Menu.SubMenu;
const Panel = Collapse.Panel;

const desConfig = ['>','>=','<','<=','=','!=','非空'];

class RowFilter extends Component {
  constructor(props) {
    super(props);
    const defautValue = props.measures[0].value;
    this.value = props.defaultValue ? props.defaultValue : {
      valueFilter: {
        valueBy: defautValue,
        operator: '>',
        count: ''
      },
      sortFilter: {
        sortWhere: 'topCount',
        limitNum: '',
        sortBy: defautValue
      },
      order: {
        orderBy: defautValue,
        orderWhere: 'groupOrder',
        orderWay: 'ascend'
      }
    };
    this.init();
  }
  init() {
    this.props.onChange && this.props.onChange(this.value);
  }
  
  rowFilterChange(type, e) {
    type = type.split('_');
    const value = e.nativeEvent.target.value;

    this.value[type[0]][type[1]] = value;
    this.props.onChange && this.props.onChange(this.value);
  }

  render() {
    const props = this.props;
    const value = this.value;
    return <div ref="rowFilterDom" className="rowFilter-wrap"><Collapse  style={{width: 200}}>
      <Panel header="按值筛选" key="1">
        <div className="flex" style={{flexWrap: 'wrap'}}>
            <select defaultValue={value.valueFilter.valueBy} id="valueFilter_valueBy"  name="valueBy" onChange={e => this.rowFilterChange('valueFilter_valueBy', e)} style={{flex: 2, height:25, lineHeight: '25px', marginBottom: 6}}>
              {props.measures.map((el, i) => <option key={i} value={el.value}> {el.label} </option>)}
            </select>
            <select defaultValue={value.valueFilter.operator} id="valueFilter_operator" name="operator" onChange={e => this.rowFilterChange('valueFilter_operator', e)} style={{flex: 1, height:25, lineHeight: '25px', marginBottom: 6}}>
              {desConfig.map((el, i) => <option key={i} value={el}> {el} </option>)}
            </select>
            <input defaultValue={value.valueFilter.count} id="valueFilter_count" name="count" onChange={e => this.rowFilterChange('valueFilter_count', e)} style={{flex: 1, height:25, marginBottom: 6}} type="text" />
        </div>
      </Panel>
      <Panel header="按序筛选" key="2">
          <div style={{marginBottom: 6, lineHeight: '25px'}}>
            <select defaultValue={value.sortFilter.sortWhere} id="sortFilter_sortWhere" style={{width: 70, height: 25, marginRight: 6}} onChange={e => this.rowFilterChange('sortFilter_sortWhere', e)}>
              <option value="topCount"> 前 </option>
              <option value="BottomCount"> 末尾 </option>
            </select>
            <input defaultValue={value.sortFilter.limitNum} id="sortFilter_limitNum" type="number" onChange={e => this.rowFilterChange('sortFilter_limitNum', e)} style={{width: 70, height: 25}}/> 行 <br/>
          </div>
          <div  style={{lineHeight: '25px'}}>
              按&nbsp;<select defaultValue={value.sortFilter.sortBy} id="sortFilter_sortBy" name="sortBy" onChange={e => this.rowFilterChange('sortFilter_sortBy', e)} style={{height: 25, width: '70%'}}>
                {props.measures.map((el, i) => <option key={i} value={el.value}> {el.label} </option>)}
              </select>&nbsp; 排序
          </div>
      </Panel>
      <Panel header="排序" key="3">
        <div  style={{lineHeight: '25px', marginBottom: 6}}>
            按&nbsp;<select defaultValue={value.order.orderBy} id="order_orderBy" name="orderBy" onChange={e => this.rowFilterChange('order_orderBy', e)} style={{height: 25, width: '70%'}}>
              {props.measures.map((el, i) => <option key={i} value={el.value}> {el.label} </option>)}
            </select>&nbsp; 排序
        </div>
        <div className="flex" >
            <select defaultValue={value.order.orderWhere} id="order_orderWhere" onChange={e => this.rowFilterChange('order_orderWhere', e)} style={{flex: 1, height:25, marginRight: 6, lineHeight: '25px'}}>
              <option value="groupOrder"> 组内排序 </option>
              <option value="overallOrder"> 总排序 </option>
            </select>
            <select defaultValue={value.order.orderWay} id="order_orderWay" onChange={e => this.rowFilterChange('order_orderWay', e)} style={{flex: 1, height:25, lineHeight: '25px'}}>
              <option value="ascend"> 升序 </option>
              <option value="decend"> 降序 </option>
            </select>
        </div>
      </Panel>
    </Collapse></div>
  }
}

export default RowFilter;