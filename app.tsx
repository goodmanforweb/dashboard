import corejs from 'corejs/index'

import React,{ Component } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import submit from 'submit/index';

import Canvas from 'page/canvas/canvas';
import Menus from 'page/menus/menus';
import Panel from 'page/panels/panels';

import allMenuConfig from 'componentsUi/index';
import AppHandle  from 'util/AppHandle'

import Reedite from 'reedite/index';
import { Layout, Menu, Breadcrumb, Icon ,Button, Tabs, Dropdown, message} from 'antd';
const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;
const TabPane = Tabs.TabPane;

import 'resource/style/app.css';
import 'resource/font/unicode.css';
import 'rc-trigger/assets/index.css';
import 'babel-polyfill';


class App extends AppHandle {
  
  constructor(props) {
    super(props);
    this._init();//初始化挂载监听
  }
  //收起或展开组件菜单栏
  onCollapse(collapsed){
    this.setState({
      collapsed
    });
  }
  _init() {
    this.state = {
      editeMode: this.checkMode(), //判断是会否是编辑状态
      collapsed: false, //判断是否是否可收起 
      canvasHeight: () => this.checkMode() ? document.body.clientHeight : document.body.clientHeight - 76,//画布高度
      canvasWidth: () => this.state.editeMode ? document.body.clientWidth : document.body.clientWidth - 183 - 362 - 48 - 12, //画布宽度
      width: 'auto',
      iconLoading: false,
      previewLoading: false,//预览
      allMenuConfig,//菜单配置   可通过外部注入更改
      panelRouter: {//操作面板的切换  默认为canvas
        name: 'canvas',
        data: {}
      }
    }
  }
  //收起或展开组件菜单栏
  onCollapse(collapsed){
    this.setState({collapsed})
  }
  //预览
  preview() {
    //取出数据存进localStorage里面
    let dsh = new submit();
    dsh.init();
    let newWindowPath = 'dashboard_' + +new Date();
    sessionStorage.setItem(newWindowPath,JSON.stringify(dsh));
    // let newWindow = window.open(`../#path=${newWindowPath}&type=1`);//本地使用
    let newWindow = window.open(`../dashboard-v3/index.html#path=${newWindowPath}&type=1`);//打包提交
  }
  //添加面板切换
  setRouter(router) {
    let routerConfig = {
      0: 'theme',
      1: 'param',
      2: 'save',
      3: 'extends'
    }[router.key];
    
    window.Dashboard.event.dispatch('panelChange',{name: routerConfig, data: {}})
  }
  componentDidMount(){
    setTimeout(()=>{
      this.setState({
        canvasWidth: () => {
          let width = '',
              clientWidth = document.body.clientWidth,
              stateWidth = parseFloat(this.state.width),
              isAuto = this.state.width === 'auto' || !this.state.width;
          if(this.state.editeMode){
            return isAuto ? clientWidth : stateWidth
          }else{
            if(this.state.collapsed){
              return isAuto ? clientWidth - 183 - 362 - 48 - 12 + 103 : stateWidth
            }
            return isAuto ? clientWidth - 183 - 362 - 48 - 12 : stateWidth
          }
          
        }
      });
    },100);
    
  }
  render() {
    const menu = (
      <Menu onClick={e => this.setRouter(e)}>
        <Menu.Item key="3">页面扩展</Menu.Item>
        <Menu.Item key="0">主题设置</Menu.Item>
        <Menu.Item key="1">管理参数</Menu.Item>
      </Menu>
    );
    return (
        <Layout>
          {
            !this.state.editeMode ? <Sider 
                                      collapsible
                                      collapsed = {this.state.collapsed}
                                      onCollapse = {this.onCollapse.bind(this)}
                                      width={183}
                                      className = 'side-left'>
                                      <Menus allMenuConfig={allMenuConfig}/>
                                  </Sider> : null
          }

          <Layout>
            <Content ref={ct => this.ct = ct} style={{height: this.state.canvasHeight(),backgroundColor:'#DBE5EA'}}>
              <div style={{ 
                margin: this.state.editeMode ? 0 : '6px' ,
                minHeight: '100%',
                height:'100%', 
                overflowY: 'auto', 
                overflowX: (this.state.width === 'auto' || !this.state.width) ? 'hidden' : 'auto',
                width:this.state.editeMode ? '100%' : 'calc(100% - 12px)'}} >
                  <Canvas ref={ct => this.ctt = ct} canvasWidth={this.state.canvasWidth()} editeMode={this.state.editeMode}/>
              </div>
              
            </Content>
            {
              !this.state.editeMode ? <Footer style={{ textAlign: 'right' ,height: 76}} className="layout-footer-btns">
                                        <Dropdown overlay={menu} placement="topCenter">
                                          <Button icon='setting' >设置</Button>
                                        </Dropdown>
                                        
                                        <Button icon='eye-o' loading={this.state.previewLoading} onClick={e => this.preview(e)}>预览</Button>
                                        <Button icon="save" type="primary"  onClick={e => this.setRouter({key: 2})}>保存</Button>
                                      </Footer> : null
            }
          </Layout>
          {
            !this.state.editeMode ? <Sider 
                                        reverseArrow={true}
                                        collapsed={false}
                                        width={362}
                                        style={{backgroundColor:"#E9EFF2"}}>
                                          <Panel router={this.state.panelRouter}/>
                                    </Sider> : null
          }
        </Layout>
    );
  }
}

ReactDOM.render(
    <App />,
  document.getElementById('app')
);
//重新编辑，预览
Reedite();