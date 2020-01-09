import React ,{ Component } from 'react';
import axios from 'axios';
// import Servicetab from './panel-marker-datasource';
import Sqltab from '../panelComponents/sqlTab';
import HttpTab from '../panelComponents/HttpTab';
import WebsocketTab from '../panelComponents/WebsocketTab';
// import Olaptab from '../../panelComponents/olapTab';

import { Input ,Select , Row, Col, Icon, Radio, Switch, Slider , TreeSelect, Table, Button, Menu , Popover, Collapse, message} from 'antd';
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const TreeNode = TreeSelect.TreeNode;
const { TextArea } = Input;
const SubMenu = Menu.SubMenu;
const Panel = Collapse.Panel;

const sourceConfig = {
  sql: {
    name: '自定义SQL查询',
    component: e => <Sqltab {...e}/>
  },
  http:{
      name:'Http',
      component:e => <HttpTab {...e}></HttpTab>
  },
  websocket:{
      name:'Websocket',
      component:e => <WebsocketTab {...e}></WebsocketTab>
  }
  // service: {
  //   name: '业务员数据',
  //   // component:  e => <Servicetab {...e}/>,
  //   component:  e => <div style={{textAlign: 'center', color: 'red',fontSize: '20px'}}>敬请期待</div>
  // },
  // olap: {
  //   name: '多维数据集',
  //   // component: e => <Olaptab {...e}/>,
  //   component: e => <div style={{textAlign: 'center', color: 'red',fontSize: '20px'}}>敬请期待</div>
  // }
};
class PanelDatasource extends Component {
  constructor(props) {
    super(props);
    this.sourceSelected = '';
    this.sourceChoice = [];
    this.cmpInstId = this.props.router.data.id;
    this.init(props);

    this.handleSelectChange.bind(this);
    this.tabDispatcher.bind(this);

    this.state = {
      sourceSelected: this.sourceSelected,
      iconLoading: false
    };

    this.value = {};
    
  }
  init(props) {
    // console.log(props,'props');
    this.cmpInstId = props.router.data.id;
    let cfg = this.restoreOldSource(props);
    this.sourceChoice = this.buildSourceChoice(cfg.currentSourceCfg);
    this.sourceSelected= cfg.currentInstanceCfg.chartDefinition.query.type;
  }
  restoreOldSource(props) {
    let id = props.router.data.id, type = props.router.name;
    let currentInstanceCfg = this.getCurrentInstance().getCfg();
    let currentSourceCfg = window.cfgComponent[type].panel.dataSource.typeList;
    return {
      currentInstanceCfg,
      currentSourceCfg
    }
  }
  
  buildSourceChoice(currentSourceCfg) {
    return currentSourceCfg.map(src => {
      if(sourceConfig[src]) {
        return {
                  name: sourceConfig[src].name,
                  value: src
              }
      }
    }).filter(sourceChoice => sourceChoice);
  }
  
  componentWillReceiveProps(nextProps) {
    this.init(nextProps);
  }
  handleSelectChange(e) {
    this.setState({
      sourceSelected: e
    }, () => {
      this.getCurrentInstance().cfg.chartDefinition.query.type = e;
    });
    this.sourceSelected = e;
  }
  getGlobalParam() {
    return window.Dashboard.globalParam;
  }
  getCurrentInstance() {
    return window.Dashboard.compManager.getComponent(this.cmpInstId)
  }
  tabDispatcher(type) {
    if(type) {
      return sourceConfig[type].component({
        globalParam: this.getGlobalParam(),
        activePanel: this.getCurrentInstance(),
        onChange : this.onChange.bind(this)
      })
    }
    return null;
  }
  onChange(info) {
    let sourceSelected = this.sourceSelected;

    if(sourceSelected === 'sql'){
        this.value = info;
        //即时保存设置的值 到 实例中
        this.setQueryToInstance({
            jndi: this.value.select,
            query: this.value.textArea,
        });
    }else{
        let setting = {};
        setting[`${sourceSelected}Setting`] = info;
        this.setQueryToInstance(setting);
    }
  }
  createURLParams(globalParam, textArea) {
    let params = {}, rawParamsIds = [];
    globalParam.params.container.forEach(el => {
      if(textArea.indexOf('${' + el.name + '}') > -1) {
        params[`param${el.name}`] = el.getValue();
        params[`type${el.name}`] = el.type || 'String';

        //做记录用
        rawParamsIds.push(el.id);
      }
    });
    return {params, rawParamsIds};
  }
  /**
  query Object
  jndi: this.value.select,
  query: this.value.textArea,
  type: this.sourceSelected,
  param: this.queryParam.params,
  rawParamsIds: this.queryParam.rawParamsIds
  */
  setQueryToInstance(query) {
    let instance = this.getCurrentInstance();
    return  Object.assign(instance.cfg.chartDefinition.query, query);
  }
  buildQuery() {
    let instance = this.getCurrentInstance();
    this.setQueryToInstance({
      jndi: this.value.select,
      query: this.value.textArea,
      type: this.sourceSelected,
      param: this.queryParam.params,
      rawParamsIds: this.queryParam.rawParamsIds
    });
    instance.cfg.chartDefinition.queryname = `query_${this.cmpInstId}`;
    return instance.doQuery();
  }
  fetchData() {
    let sourceSelected = this.sourceSelected;
    // if(!this.value.select || !this.value.textArea) {
    //   message.info('请填写完整，再尝试:)');
    //   return false;
    // }
    this.setState({
      iconLoading: true
    });
    this.queryParam = this.createURLParams(this.getGlobalParam(), this.value.textArea);
    this.buildQuery().then(() => {
      this.setState({
          iconLoading: false
        });
    }).catch(error => {
    	this.setState({
          iconLoading: false
        })
    })
}
  //文本组件处理
  handleChange(type, value) {
    // this.getCurrentInstance().cfg.parameter = value;
    this.getCurrentInstance().update({option: {value: value}});
    this.setState({
      change: true
    });
  }
  render() {
    let props = this.props;
    let globalParam = this.getGlobalParam().globalParam.params.container, parameterId = this.getCurrentInstance().cfg.parameter;
    //数据源是 一个通用模块， 不涉及组件具体逻辑。
    // 但是文本组件 数据源 有一个保存值的 选择， 加到这里了
    return <div className="panel-row datasource">
              <Row type="flex" align="middle" >
                <Col span={6}>来自于</Col>
                <Col span={18}>
                  <Select  value={this.sourceSelected}  style={{ width: '100%' }} onChange={e => this.handleSelectChange(e)} placeholder="请选择数据方式">
                  <Option value="" key="@" style={{height: 32}}> </Option>
                    {
                      this.sourceChoice.map((el, i) => <Option key={i} value={el.value}>{el.name}</Option>)
                    }
                  </Select>
                </Col>
              </Row>
              
              {
                !!this.sourceSelected ? <div>
                  <div className="datasource-tabs">
                  {this.tabDispatcher(this.sourceSelected)}
                  </div>
                  <div className="panel-get">
                    <Button type="primary" style={{marginLeft:'25%'}} icon="cloud-download" loading={this.state.iconLoading} onClick={e => this.fetchData(e)}>获取数据</Button>
                  </div>
                </div>: null
              }
              {
                !!this.sourceSelected && (this.getCurrentInstance().cfg.type == 'text') ? <Row type="flex" align="middle" style={{marginTop: 16}}>
                  <Col span={6}>保存结果到</Col>
                  <Col span={18}>
                    <Select  value={parameterId}  style={{ width: '100%' }} onChange={e => this.handleChange('parameter', e)} placeholder="请选择参数">
                      {
                        globalParam.map((el, i) => {
                          return <Option value={el.id} key={i} >{el.name}</Option>;
                        })
                      }
                    </Select>
                  </Col>
              </Row> : null
              }
            </div>
  }
}


export default PanelDatasource;