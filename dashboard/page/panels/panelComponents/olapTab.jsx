
import React ,{ Component } from 'react';
import axios from 'axios';
import OlapRow from './olapRow';
import Popup from './popUp';
import RowFilter from './rowFilter';
import { Input ,Select , Row, Col, Icon, Radio, Switch, Slider , TreeSelect, Table, Button, Menu , Popover, Collapse } from 'antd';
const { Option, OptGroup } = Select;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const TreeNode = TreeSelect.TreeNode;
const { TextArea } = Input;
const SubMenu = Menu.SubMenu;
const Panel = Collapse.Panel;

const checkDirty = (source) => {
  let filterValue = {
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
        matchMethod: '',
				matchValue: ''
      },
      hasFilter: false
    };
  return JSON.stringify(filterValue) != JSON.stringify(source);
}
class Olaptab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: undefined,
      catalogs: [],
      catalogView: [],
      cubeStructure: {
        measures: []
      },
      cataRow: [],
      seriesRow: [],
      // 每行数据存放处
      cata: [],
      series: [],
      measure: [],
      dirtyItems: []
    };

    //所欲cubestructure的信息
    this.catNames = {};
    //选中的cubestructure的信息
    this.catNameSelected = {};

    this.olapValue = {};
    // 对 每项的过滤 和 行的 过滤 的保存

    this.olapValueWithFilters = {
      cata: {
        demension: [
          {
            name: '',
            qualifiedName: '',
            filter: {}
          }
        ],
        rowFilter: {}
      },
      series: [],
      measure: []
    };
    this.itemFilterStore = {};
    this.rowFilterStore = {};
  }
  componentWillMount() {
    this.fetchCube();
  }
  fetchCube() {
    axios({
      method: 'get',
      url: '/filename/plugin/pentaho-cdf-dd/api/olap/getCubes',
      responseType: 'json'
    })
    .then(response => {
      if(response.status == 200) {
        this.handleCube(response.data);
      }
    });
  }
  handleCube(data) {
    const catalogs = data.result.catalogs;
    let catalogView;
    //name 相关信息保留池
    this.catNames = {};
    catalogView = catalogs.map((el ,i) => {
      return (<OptGroup label={el.name} key={i}>
                {el.cubes.map((ell, ii) => {
                  //遍历组件的同时，把name 的相关信息 保留起来，便于 根据名字 直接查找其信息
                  this.catNames[ell.id] = {
                    jndi: el.jndi,
                    schema: el.schema,
                    cname: el.name,
                    id: ell.id,
                    name: ell.name
                  }
                  return <Option key={ii} value={ell.id}>{ell.name}</Option>
                })}
              </OptGroup>)
    });
    this.setState({
      catalogs: catalogs,
      catalogView: catalogView
    });
  }
  fetchCubeStructure(data) {
    let params = new URLSearchParams();
    params.append('catalog', data.cname);
    params.append('cube', data.id);

    axios({
      method: 'get',
      url: '/filename/plugin/pentaho-cdf-dd/api/olap/getCubeStructure',
      responseType: 'json',
      params: params
    })
    .then(response => {
      if(response.status == 200) {
        this.handleCubeStructure(response.data.result);
      }
    });
  }
  handleCubeStructure(data) {
    console.log(data);
    let cubeStructure = {
      measures: data.measures.map((el, i) => ({
        label: el.name,
        value: el.qualifiedName,
        key: i
      })),
      dimensions: data.dimensions.map((el, i) => ({
          label: el.name,
          value: '',
          key: i,
          disabled: true,
          children: el.hierarchies[0].levels.map((ell, ii) => ({
            label: ell.name,
            value: ell.qualifiedName,
            key: i +"-"+ ii
          }))
      }))
    };


    this.setState({
      cubeStructure: cubeStructure
    })
  }
  cubeChange(e) {
    this.fetchCubeStructure(this.catNames[e]);
    this.catNameSelected = this.catNames[e];
    // cube change 每次改变 都要 把下面这些重置
    this.rowReset();
  }
  rowReset() {
    const olapValue = {
      cata: [],
      series: [],
      measure: []
    };
    this.setState(olapValue);
    this.olapValue = olapValue;
  }
  onChange(type, value) {
    // this.setState({
    //   value
    // })
    this.setState({
      [type]: value
    });
    this.olapValue[type] = value;
    console.log(this.olapValue);
  }
  // 对 selecttree中的每一个item popup 内容函数，singleValue 为 item 当前的值
  itemFilterContent(type, singleValue) {
    console.log(singleValue);//       ---------------------当前值---------- cube 相关信息-------------
    return <div className="bg-select-tree-wrap"><Popup onChange={e => this.popUpChange(type, singleValue, e)} item={singleValue}  cube={this.catNameSelected}/></div>;
  }
  popUpChange(type, singleValue, e) {
    console.log(type, singleValue, e);
    const value = {
      type: type,
      cube: singleValue,
      filter: e,
      dirty: checkDirty(e)
    };
    this.itemFilterStore[`${type}·${singleValue.label}`] = value;

    //做 同步到 filer 行
    this.synItemFilterToFilterRow(this.itemFilterStore);

    console.log(this.itemFilterStore);
    console.log(this.rowFilterStore)
  }
  // 对 行的过滤
  rowFilterChange(type, e) {
    console.log(type, e);
    this.rowFilterStore[type] = {
      type: type,
      filter: e
    }
    console.log(this.itemFilterStore);
    console.log(this.rowFilterStore)
  }
  rowFilterContent(type) {

    return <RowFilter onChange={e => this.rowFilterChange(type, e)}  measures={this.state.cubeStructure.measures} />;
  }
  synItemFilterToFilterRow(itemFilterStore) {
    
    this.setState({
      dirtyItems: Object.values(itemFilterStore).filter(el => el.dirty == true).map(el => el.cube.value)
    });
    
  }
  render() {
    let state = this.state;
    return <div className="select-tab-content">
      <Row type="flex" align="middle" >
        <Col span={6}>多维数据集</Col>
        <Col span={18}>
          <Select defaultValue="" style={{ width: '100%' }} onChange={e => this.cubeChange(e)}>
           { this.state.catalogView }
          </Select>
        </Col>
      </Row>
      <div className="olap-param-handle param-handle" >
        <OlapRow
          name='类别' 
          treeData={state.cubeStructure.dimensions}
          value={state.cata} 
          onChange={e => this.onChange('cata', e)}
          treeDefaultExpandAll={true}
          showItemHoverPopup={true}
          itemFilterContent={e => this.itemFilterContent('cata', e)}
          hasGlobalFilter={true}
          globalFilterContent={this.rowFilterContent.bind(this, 'cata')}
          >
        </OlapRow>
        <OlapRow
          name='系列' 
          treeData={state.cubeStructure.dimensions}
          value={state.series}
          onChange={e => this.onChange('series', e)}
          treeDefaultExpandAll={true}
          showItemHoverPopup={true}
          itemFilterContent={e => this.itemFilterContent('series', e)}

          hasGlobalFilter={true}
          globalFilterContent={this.rowFilterContent.bind(this, 'series')}
          >
        </OlapRow>
        <OlapRow
          name='指标' 
          treeData={state.cubeStructure.measures}
          value={state.measure}
          onChange={e => this.onChange('measure', e)}
          showItemHoverPopup={false}
          hasGlobalFilter={false}
          >
        </OlapRow>
        <Row type="flex" align="middle" >
            <Col span={6}>过滤</Col>
            <Col span={18}>
              <TreeSelect
                style={{ width: '100%' }}
                value={state.dirtyItems}
                treeData={state.cubeStructure.dimensions}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                placeholder="Please select"
                allowClear
                multiple
                treeDefaultExpandAll
                onChange={e => this.onChange('filter', e)}
              >
              </TreeSelect>
            </Col>
        </Row>
        
      </div>
    </div>
  }
}


export default Olaptab;