import React ,{ Component } from 'react';
import axios from 'axios';
import { dispatch , xuduListener} from 'xdux/index';
import { Input ,Select , Row, Col, Icon, Radio, Switch, Slider , TreeSelect, Table, Button, Menu , Popover, Collapse ,message} from 'antd';
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const TreeNode = TreeSelect.TreeNode;
const { TextArea } = Input;
const SubMenu = Menu.SubMenu;
const Panel = Collapse.Panel;





class Sqltab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textAreaValue: props.activePanel.cfg.chartDefinition.query.query,
      select:props.activePanel.cfg.chartDefinition.query.jndi,
      sqlOptions: [],
      params: this.buildParams(props.globalParam.params.container)
    };
    this.init(props,0);
    // this.initParamChangeListener();
  }
  init(props,time) {
    this.id = props.activePanel.cfg.id;
    this.value = {
      textArea: props.activePanel.cfg.chartDefinition.query.query,
      select: props.activePanel.cfg.chartDefinition.query.jndi
    };
    time && (this.setState({textAreaValue: this.value.textArea, select: this.value.select}));
    this.createProps(this.value, this.props.onChange);
    //数据重新 植入 视图，最开始需要通过事件机制把数据发回父组件
    this.props.onChange(this.value);
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.activePanel.cfg.id != this.id) {
      //同类型面板切换重新初始化
      this.init(nextProps, 1);
    }
    if(nextProps.paramChange) {
      this.setState({
        params: this.buildParams(nextProps.paramChange)
      })
    }
  }
  // shouldComponentUpdate(nextProps, nextState) {
  //   if(nextProps.activePanel.dataSource.query != this.value.textArea) {
  //     return true
  //   }
  //   return false;
  // }
  createProps(obj, callback) {
    let defineProp = function(initvalue, obj, prop, callback) {
      let gvalue = initvalue;
      Object.defineProperty(obj, prop, {
        set: function (value){
          gvalue = value;
          callback && callback(this);
        },
        get: function() {
          return gvalue;
        },
        configurable: true,
        enumerable: true
      });
    }

    for(let i in obj) {
      defineProp(obj[i], obj, i, callback)
    }
  }
  componentWillMount() {
    if(!this.state.sqlOptions.length) {
      this.fetchData();
    }
  }
  fetchData() {
    axios({
      method: 'get',
      url: '/filename/plugin/xdf/api/connection/list',
      responseType: 'json'
    })
    .then(response => {
      if(response.status == 200) {
        this.handleData(response.data.databaseConnections);
      }
    });
  }
  handleData(data) {
    this.setState({
      sqlOptions: data.map((el, i) => el.name )
    })
  }
  //输入触发事件
  coloumnChange(e, record, type) {
    dispatch({
      type:'updateParam',
      value: {
        id: record.key,
        value: e.target.value
      }
    })
  }
  addParamToSQL(record, event) {
    let str = this.state.textAreaValue;
    let newstr = str.substring(0, this.selectPosition) + '${' + record.name + '}' + str.substring(this.selectPosition||str.length)
    this.setState({
        textAreaValue: newstr
    },() => {
      this.value.textArea = newstr;
    });
    
  }
  handleTextArea(e,type) {
    let target = e.target;
    if(type == 'blur') {
      if((target.selectionDirection == 'forward') &&　(target.selectionStart == target.selectionEnd)) {
        this.selectPosition = target.selectionStart;
      }
      else {
        this.selectPosition = this.state.textAreaValue.length;
      }
    }
    else {
      const value = e.target.value;
      this.setState({
        textAreaValue: value
      },() => {
        this.value.textArea = value;
      });
      
    }
  }
  handleOption(e) {
    
    this.setState({
      select: e
    },() => {
      this.value.select = e;
    });
  }
  buildParams(params) {
    return params.map(paramInstance => ({
      key: paramInstance.id,
      name: paramInstance.name,
      value: paramInstance.value,
      type: paramInstance.type
    })).filter(paramInstance => paramInstance.name);
  }
  initParamChangeListener() {
    window.Dashboard.event.subscribe('paramChange', data => {
      this.setState({
        params: this.buildParams(data)
      })
    });
  }
  
  render() {
    let columns = [
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        width:'25%',
        onCellClick: (record, event) => this.addParamToSQL(record, event)
      }, {
        title: '值',
        dataIndex: 'value',
        key: 'value',
        render: (v, record, index) => (
          <Input placeholder="参数值" value={v} onChange={ e => this.coloumnChange(e,record,'value')} disabled={true}/>
        )
      }
    ];
    let props = this.props;
    let dataSource = props.activePanel.cfg.chartDefinition.query;
    // console.log(props);
    return <div className="select-tab-content">
      <Row type="flex" align="middle" >
        <Col span={6}>数据库连接</Col>
        <Col span={18}>
          <Select  defaultValue={dataSource.jndi} value={this.state.select} style={{ width: '100%' }} onChange={e => this.handleOption(e)}>
            {
              this.state.sqlOptions.map((el, i) => (
                <Option value={el} key={i}>{el}</Option>
              ))
            }
          </Select>
        </Col>
      </Row>
      <div className="sql-param-handle param-handle" >
        <div className="param-row">
          <div className="param-row-tit">
            SQL查询
          </div>
          <TextArea 
          placeholder="请输入sql语句" 
          autosize={{ minRows: 6, maxRows: 10 }}
          value={this.state.textAreaValue}
          onChange={e => this.handleTextArea(e, 'change')}
          onBlur={e => this.handleTextArea(e, 'blur')}
          />
        </div>
        {
              this.state.params.length ? <div className="param-row">
              <div className="param-row-tit">
                参数查询
              </div>
              <div className="param-row-bd">
                <Table 
                  columns={columns} 
                  dataSource={this.state.params} 
                  bordered
                  pagination={false}
                />
              </div>
            </div> : null
        }
      </div>
    </div>
  }
}

export default xuduListener(['paramChange'])(Sqltab);