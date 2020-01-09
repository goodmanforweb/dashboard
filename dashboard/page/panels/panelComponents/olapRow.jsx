import React ,{ Component } from 'react';
import { Input ,Select , Row, Col, Icon, Radio, Checkbox, Switch, Slider , TreeSelect, Table, Button, Menu , Popover, Collapse, Spin } from 'antd';
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const TreeNode = TreeSelect.TreeNode;
const { TextArea } = Input;
const SubMenu = Menu.SubMenu;
const Panel = Collapse.Panel;

    
const OlapRow  =  props => {
    const treeSelectDom  = <TreeSelect
                              showSearch
                              style={{ width: '100%' }}
                              // value={this.state.value}
                              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                              placeholder="Please select"
                              allowClear
                              multiple
                              treeDefaultExpandAll={props.treeDefaultExpandAll}
                              treeData={props.treeData}
                              onChange={e => props.onChange(e)}
                              value={props.value}
                              showItemHoverPopup={props.showItemHoverPopup ? true : false}
                              selectTreeItemHoverPopup={props.showItemHoverPopup ? props.itemFilterContent : () => {}} 
                            >
                            </TreeSelect>;

    return <Row type="flex" align="middle" >
          <Col span={6}>{props.name}</Col>
          <Col span={18}>
            {
              props.hasGlobalFilter ? 
              (<Row type="flex" align="middle" style={{marginBottom:0}}>
                  <Col  span={20} >{treeSelectDom}</Col>
                  <Col  span={4} style={{textAlign:'right',position:'relative'}}>
                      <Popover placement="bottomLeft" content={ props.globalFilterContent() } trigger="click">
                        <Button shape="circle" icon="menu-fold"  />
                      </Popover>
                  </Col>
              </Row>) : treeSelectDom
            }
          </Col>
        </Row>
}


export default OlapRow;