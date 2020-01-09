import React ,{ Component } from 'react';
import { Layout, Menu, Breadcrumb, Icon ,Button, Tabs,Row, Col } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;
const TabPane = Tabs.TabPane;




class Menus extends Component {
  
  constructor(props) {
    super(props)
    this.allConfig = props.allMenuConfig;
  }
  //兼容写法  拖拽事件
  menuDrag(e) {
    let type = e.target.dataset['type'];
    window.dashboardType = type;
    if(navigator.userAgent.indexOf("Firefox") > -1 ){
      e.dataTransfer.setData("type",type);
    }
  }

  render() {
    return <Menu  
              className="menus"
              theme="light"
              defaultSelectedKeys={['1']}
              onOpenChange={this.props.onOpenChange}
              mode="inline"
              style={{backgroundColor:"#E9EFF2"}}
              defaultOpenKeys={Object.keys(this.allConfig).map((e,i)=>'sub'+i)}
              >
              {
                this.allConfig.map( (item, ind)=> {
                  return <SubMenu
                            key={'sub' + ind}
                            title={
                                <span>
                                    <i className={"anticon layout-icon " + item.icon}></i>
                                    <span style={{fontWeight: 800}}>{item.name}</span>
                                </span>
                            }
                            className="menu-row">
                            {
                              new Array(Math.ceil(item.children.length / 3)).fill(1).map( (v,k) => {
                                return <Menu.Item key={`sub${ind}-${k}`}>
                                        <Row type="flex">
                                          {
                                            item.children.slice(3*k, 3*( k +1 )).map((col, ixxx) => {
                                              return <Col span={8} 
                                                        key={ixxx} >
                                                        {
                                                            col.$$custom ?
                                                            <i title={col.cname} 
                                                                data-type={col.type}  
                                                                draggable="true" 
                                                                onDragStart={e => this.menuDrag(e)}  
                                                                style={{
                                                                    backgroundImage:`url( ${col.icon} )`,
                                                                    backgroundSize:'100%'
                                                                }}
                                                              className="side-icon">
                                                            </i>
                                                          :<i title={col.cname} 
                                                                data-type={col.type}  
                                                                draggable="true" 
                                                                onDragStart={e => this.menuDrag(e)}  
                                                                className={`side-icon ${col.icon}`}>
                                                            </i>
                                                        }
                                                      </Col>
                                            })
                                          }
                                        </Row>
                                </Menu.Item>
                              })
                            }
                           </SubMenu>
                })
              }
    </Menu>
  }
}

export default Menus;