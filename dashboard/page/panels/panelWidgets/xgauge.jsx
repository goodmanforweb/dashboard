import React ,{ Component } from 'react';
import _ from 'lodash';
import { Input,Row, Col,Radio,Select,Table,Icon,Popconfirm, Menu, Dropdown, Button,message ,InputNumber } from 'antd';
import { ColorPicker } from "../panelComponents/index";
const RadioGroup = Radio.Group;
const Option = Select.Option;
const RButton = Radio.Button;

const columns = [ {
    title: '下限',
    dataIndex: 'start',
},{
    title: '上限',
    dataIndex: 'end',
}, {
    title: '色系',
    dataIndex: 'color',
}];

var changing = null;
var inputNumberBeforeChange = null;
var minOrMaxBeforChange = null;
let data = [];
for (let i = 0; i < 3; i++) {
    data.push({
        key: i,
        name: `Edward King ${i}`,
        age: 32,
        start: <Row span={4}>
                    <Col>
                        <InputNumber defaultValue={3} />
                    </Col>
                </Row>,
        end:<Row span={4}>
                <Col>
                    <InputNumber defaultValue={3} />
                </Col>
            </Row>,
         color: <Row>
             <Col>
             <ColorPicker
             type="normal"
             color={["#f00","#234","#345"]}
              />
             </Col>
         </Row>
    });
}

// props  name options value onchange
class XGauge extends Component {
    constructor(props) {
        super(props);
        var enumColor = props.inst.cfg.chartDefinition.option.color;
        let themeColor = window.Dashboard.globalParam.globalParam.theme.chart.color;
        this.state = {
            switch: props.value.switch,
            optionArr : props.value.optionArr.map((single, i) => {
                single[2]= (i + 1) > enumColor.length ? themeColor[(i + 1) % enumColor.length] : enumColor[i];
                return single;
            }),
            selectedRowKeys: props.value.selectedRowKeys,
            startColor:this.hexToRgba(themeColor[0],1),
            endColor:this.hexToRgba(themeColor[1],1),
            circleColor: this.props.inst.cfg.chartDefinition.option.color.slice(0, 2),
            circleMax:props.value.circleMax,
            circleMin:props.value.circleMin
        };
        // this.init();
    }

    hexToRgba(hex, opacity) {
        return "rgba(" + parseInt("0x" + hex.slice(1, 3)) + "," + parseInt("0x" + hex.slice(3, 5)) + "," + parseInt("0x" + hex.slice(5, 7)) + "," + opacity + ")";
    }
    // init() {
    //     this.initThemeListener();
    // }
    // initThemeListener() {
    //     window.Dashboard.subscribe();
    // }
    //存储选中行列
    SelectedKey = [];

    componentWillReceiveProps(nextProps) {
        let value = nextProps.value;
        var enumColor = nextProps.inst.cfg.chartDefinition.option.color;
        let themeColor = window.Dashboard.globalParam.globalParam.theme.chart.color;
        value.optionArr = value.optionArr.map((single, i) => {
            single[2]= (i + 1) > enumColor.length ? themeColor[(i + 1) % enumColor.length] : enumColor[i];
            return single;
        })
        // value.startColor = this.hexToRgba(themeColor[0],1);
        // value.endColor = this.hexToRgba(themeColor[1],1);
        this.setState({
            ...value,
            circleColor: nextProps.inst.cfg.chartDefinition.option.color.slice(0, 2)
        })
    }

    onChange(e) {
        this.setState({
            switch: e.target.value
        },() => {
            this.outChange();
        })
    }
    outChange() {
        this.props.onChange && this.props.onChange(this.state);
    }
    //验证指针环
    verifyPinCircle(option){
        let flag = [true,""];
        //重合检验
        for(let i=0;i<option.length-1;i++){
            if(option[i][1]>option[i+1][0]){
                flag[0] = false;
                flag[1] = "区间重合";
            }
        }
        //每小组最大最小值检验
        option.forEach(v => {
            if(v[0]>=v[1]){
                flag[0] = false;
                flag[1] = "上限应当大于下限"
            }
        })

        return flag;
    }

    inputNumberChanging(type,index, e){   
        if(type == "start"){
            var changed =  JSON.parse(JSON.stringify(this.state.optionArr));
            inputNumberBeforeChange = changed[index][0];
            this.state.optionArr[index][0] = e;
        }else if(type == "end"){
            var changed =  JSON.parse(JSON.stringify(this.state.optionArr));
            inputNumberBeforeChange = changed[index][1]; 
            this.state.optionArr[index][1] = e;
        }

        if(event && event.type === "react-mousedown"){
            this.inputNumberBlur(type,index);
        }
    
    }

    inputNumberBlur(type,index){
        if(type == "start"){
            var changed =  JSON.parse(JSON.stringify(this.state.optionArr));
            //验证是否符合规则
            let tempmessage = this.verifyPinCircle(changed);
            if(tempmessage[0] != true){
                this.state.optionArr[index][0] = inputNumberBeforeChange;
                message.info(tempmessage[1]);
            }else{
                this.setState({
                    optionArr:this.state.optionArr
                },() => {
                    this.outChange();
                })
            }
        }else if(type == "end"){
            var changed =  JSON.parse(JSON.stringify(this.state.optionArr));
            let tempmessage1 = this.verifyPinCircle(changed);
            if(tempmessage1[0] != true){
                this.state.optionArr[index][1] = inputNumberBeforeChange;
                message.info(tempmessage1[1]);
            }else{
                this.setState({
                    optionArr:this.state.optionArr
                },() => {
                    this.outChange();
                })
            }
        }

    }

    switchChartType(e){
        this.onChange(e);
        let color = e.target.value ? this.state.optionArr.map(cl=> cl[2]) : this.state.circleColor;
        this.props.inst.update({option: {color}});
        // console.log(this.state.value.switch);
    }

    switchColor(index,e){
        this.state.optionArr[index][2] = e.hex;
        this.props.inst.update({option: {color: this.state.optionArr.map(cl=> cl[2])}});
        this.freshState();
    }
    freshState(){
        this.setState({
            optionArr:this.state.optionArr
        }, () => {
            this.outChange()
        })
    }

    getNewData(optArr){
        var dataCopy = [];
        for (let i = 0; i < optArr.length; i++) {
            dataCopy.push({
                key: i,
                name: `Edward King ${i}`,
                age: 32,
                start: <Row span={4}>
                    <Col>
                        <InputNumber defaultValue={3} min = {0} value={optArr[i][0]} onChange = {e=>this.inputNumberChanging("start",i, e)} onBlur= {e=>this.inputNumberBlur("start",i, e)}/>
                    </Col>
                </Row>,
                end:<Row span={4}>
                    <Col>
                        <InputNumber defaultValue={3} min = {0} value={optArr[i][1]} onChange = {e=>this.inputNumberChanging("end",i, e)}  onBlur= {e=>this.inputNumberBlur("end",i, e)} />
                    </Col>
                </Row>,
                color: <Row>
                    <Col>
                        <ColorPicker
                            type="normal"
                            color={optArr[i][2]}
                            onChange={e => this.switchColor(i,e)}
                        />
                    </Col>
                </Row>
            });
        }
        return dataCopy;
    }


    handleParam(tag){
        if(tag == "param-add"){
            //获取最大数组的数值
            var length = this.state.optionArr.length;
            let themeColor = window.Dashboard.globalParam.globalParam.theme.chart.color;
            if(length>0){
                var max = this.state.optionArr[length-1][1];

                this.state.optionArr.push([max,max+1,themeColor[length%themeColor.length]]);
                this.freshState();
            }else{
                this.state.optionArr.push([0,1,themeColor[0]]);
                this.freshState();
            }

            this.props.inst.update({option: {color: this.state.optionArr.map(cl=> cl[2])}});

        }else{
        }

    }

    deleteConfirm(e){
        const { util } = window.Dashboard;
        if(this.state.optionArr.length - this.SelectedKey.length < 2) {
            message.info("请至少保留2种颜色");
            return false;
        }
        this.setState({
            optionArr: this.state.optionArr.filter((option, index) => {
                if(!this.SelectedKey.includes(index)) {
                    return true
                }
                return false;
            }),
            selectedRowKeys: []
        },() => {
            this.outChange();

            this.props.inst.update({option: {color: this.state.optionArr.map(cl=> cl[2])}});
        })
    }

    /*处理选中状态*/
    handleSelectRow(key,row){
        this.SelectedKey = key;
        this.setState({
            selectedRowKeys: key
        },() => {
            this.outChange();
        });
    }

    /*处理最大值与最小值*/
    settingMinOrMax(e,type){
        //正在设置最大值或最小值，不进行验证
        if(type == "circleMin"){
            minOrMaxBeforChange = this.state.circleMin;
            this.state.circleMin = parseFloat(e);
        }else{
            minOrMaxBeforChange = this.state.circleMax;
            this.state.circleMax = parseFloat(e);
        }

        if(event && event.type === "react-mousedown"){
            this.setMinOrMax(type);
        }
    }

    setMinOrMax(type){
        //blur事件，输入完毕，进行验证
        let flag = this.state.circleMax > this.state.circleMin ? true : false;
        if(flag == true){
            console.log("setState");
            this.setState({
                [type]:this.state[type]
            },() => {
                this.outChange();
            })
        }else{
            this.state[type] = minOrMaxBeforChange
            message.info("最大值应当大于最小值");
        }
    }

    //选择起始与终止颜色
    handleDurationColor(type,e){
        // if(type == "startColor"){
        //     this.setState({
        //         startColor:e.rgba
        //     },() => {
        //         this.outChange();
        //     })
        // }else if(type == "endColor"){
        //     this.setState({
        //         endColor:e.rgba
        //     },() => {
        //         this.outChange();
        //     })
        // }

        if(type === 'circleColor') {
            this.setState({
                [type]: e
            }, () => {
                this.props.inst.update({option: {color: e }});
            })
        }
    }
    render() {
        if(this.state.optionArr){
            data = this.getNewData(this.state.optionArr);
        }
        return <div style = {{marginBottom:'16px'}}>
            <Row >
                <Col span={6} style={{lineHeight:'32px'}}>
                   仪表类型
                </Col>
                <Col span={18}>
                    <Radio.Group value = {this.state.switch} onChange= {e => this.switchChartType(e)}>
                        <RButton key={1} value={true}>指针</RButton>
                        <RButton key={2} value={false}>圆环</RButton>
                    </Radio.Group>
                </Col>
            </Row>
            <br/>
            {this.state.switch ?
                <div><Row type="flex" justify="space-between" style={{marginBottom:'15px'}}>
                    <Col span={5}><h4>数据分组</h4></Col>
                    <Col span={6}>
                        <Popconfirm placement="bottomRight" title={this.state.message} onConfirm={e => this.deleteConfirm(e)} onCancel={e => this.cancel(e)} >
                            <span className="param-delete"><Icon type="close" onClick={e => this.handleParam('param-delete')} /></span>
                        </Popconfirm>
                        <span className="param-add" ><Icon type="plus" onClick={e => this.handleParam('param-add')} /></span>
                    </Col>
                </Row>
                    <Table  rowSelection={{
                        type:'checkbox',
                        onChange: (selectedRowKeys, selectedRows) => this.handleSelectRow(selectedRowKeys, selectedRows),
                        selectedRowKeys: this.state.selectedRowKeys
                    }}
                    columns={columns}
                    dataSource={data}
                    pagination={false}/>



                </div>

                :

                <div>
                    <div>

                        <Row>
                            <Col span={6}>起止色彩</Col>
                            <Col span={18}>
                                <ColorPicker
                                    type="listColor"
                                    limitColors={2}
                                    disableDelete = {true}
                                    color={this.state.circleColor}
                                    onChange={e => this.handleDurationColor("circleColor",e)}
                                />
                            </Col>
                        </Row>
                        </div>
                    <Row type="flex" align="middle" style={{marginTop:'10px'}}>
                        <Col span={6}>最小值</Col>
                        <Col span={8}>
                            <InputNumber value={this.state.circleMin}
                                        min = {0}
                                        onChange={e => this.settingMinOrMax(e,"circleMin")} 
                                        onBlur={e => this.setMinOrMax("circleMin")} /></Col>
                    </Row>
                    <Row type="flex" align="middle" style={{marginTop:'10px'}}>
                        <Col span={6}>最大值</Col>
                        <Col span={8}><InputNumber placeholder="请输入数值"
                                            value={this.state.circleMax}
                                            onChange={e => this.settingMinOrMax(e,"circleMax")} 
                                            onBlur={e => this.setMinOrMax("circleMin")}/></Col>
                    </Row>
                </div>

            }
             </div>

    }
}

export default XGauge;