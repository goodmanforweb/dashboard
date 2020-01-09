/**
 * websocket管理
 * 
 */


let instance = null;
let websockets = {};

export default class WebsocketManager{
    constructor(){
        if(!instance){
            instance = this;
        }
        return instance;
    }

    create(id,url){
        let ws;
        if(websockets[id]){
            websockets[id].close();
        }
        ws = new WebSocket(url);
        websockets[id] = ws;
        return ws;
    }


 }
