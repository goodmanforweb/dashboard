
//组件管理类
//传进来的数据格式
//[{
//	props: {
//		id: ,
//	},
//	update(),
//	resize(),
//	draw(),
//	...
//}]
class compManager {
	constructor(props){
		this.dashboard = props;
		//挂载组件管理数组
		this.components = props.components || [];
	}
	//获取组件
	getComponent(id){
		return this.components[this.getComponentInd(id)];
	}
	//获取组件位置
	getComponentInd(id){
		var index = -1;
		this.components.forEach((e, i) => {
			if(e.id === id){
				index = i;
			}
		});
		return index; 
	}
	//添加组件 param组件相关配置
	addComponent(instance){
		let component = this.getComponent(instance.id),
			selfComponent;
		if(!component && instance.id){
			//创建实例  并进行添加进组件管理数组
			this.components.push(instance);
		}else{
			console.log('此组件已经存在')
		}
	}
	//删除组件
	deleteComponent(id){
		var thisComponentInd = this.getComponentInd(id);
		if(thisComponentInd > -1){
			let selfcom = this.components.splice(thisComponentInd, 1)[0];
			selfcom.destroy();
		}else{
			console.log('此组件不存在')
		}
	}
}
export default compManager