import xuduListener from './xuduWrapListener';

let dash = window.Dashboard || {};
const {compManager} = dash;
let global = dash.globalParam, params = dash.params;
 /**action
   * {type, data}
   */
function dataCenter(state = {}, action) {
  switch (action.type) {
    case 'updateParam':
        global.updateParams([action.value]);
        break;
    case 'addParam':
        global.addParam();
        break;
    case 'deleteParam':
        global.removeParams(action.value.ids);
        break;
    case 'updateLayout':
        compManager.getComponent(action.value.ids).cfg.layout = action.value.data;
        break;
    case 'updateGlobelProps':
        global.updateGlobelProps(action.value.type, action.value.value);
        break;
    default:
    break;
  }
  /*let obj = {
    updateParam(){
      global.updateParams([action.value]);
    },
    addParam(){
      global.addParam();
    },
    deleteParam(){
      global.removeParams(action.value.ids);
    },
    updateLayout(){
      compManager.getComponent(action.value.ids).cfg.layout = action.value.data;
    }
    default(){

    }
  }
  obj[action.type] ? obj[action.type]() : obj['default']();*/
}



function dispatch(action) {

  dataCenter(dash, action);
  
}


export {
  dispatch,
  xuduListener
}



