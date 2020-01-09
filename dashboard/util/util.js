class util{
	//初始化
	constructor(){
		
	}
	//初始化需要运行的
	
	//挂载主题监听
	themeListener(){
		//监听是否开始渲染中间组件，那么就可以设置画布背景了
		window.Dashboard.event.subscribe('themeChange', () => {
		  let body = window.Dashboard.globalParam.globalParam.theme.body;
		  //之所以操作dom,是因为state 会导致全局刷新
		  let bkc = document.getElementById('background-container');
		  let colorOrImage = '';
		  //清空之前所有的背景设置
		  bkc.style.background = '';

		  let background = {};
		  
		  if(body.backgroundColor) {
		    colorOrImage = 'Color';
		    if(body.backgroundColor.indexOf('linear-gradient') > -1) {
		      colorOrImage = 'Image';
		    }
		    background = {
		      [`background${colorOrImage}`]: body.backgroundColor
		    };
		  }
		  //图表权重高
		  if(body.backgroundImage) {
		    colorOrImage = 'Image';
		    background = {
		      backgroundSize:'cover',
		      backgroundRepeat:'no-repeat',
		      backgroundPosition:'center',
		      [`background${colorOrImage}`]: `url(${body.backgroundImage})`
		    };
		  }
		  if(!colorOrImage)return null;
		  //遍历设置样式
		  //不通过cssText 设置，是因为 cssText 会覆盖 已经有的属性
		  for(let key in background) {
		    bkc.style[key] = background[key];
		  }
		})
	}
}
export default (new util)