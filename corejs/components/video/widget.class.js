import WidgetBase from 'corejs/components/base';
import 'video.js/dist/video-js.min.css';
import videojs from 'video.js/dist/video.js';
import { resolve } from 'path';
const poster = require("../../../dashboard/resource/images/videoz.png");
export default class VideoWidget extends WidgetBase {
  static cname='视频';
  constructor(htmlObj, cfg) {
    super(htmlObj, cfg);
  }
  widgetWillCreated(cfg) {
    super.widgetWillCreated(cfg);
    this.video = document.createElement('video');
    this.htmlObj.style.height = '100%';
    this.video.className = 'video-js';
    this.htmlObj.appendChild(this.video);
    this.player = this.createVideoInstance();
    this.handleDefinition(cfg.chartDefinition);
    return this.rootDom = this.div;
  }
  widgetDidCreated(cfg) {
    super.widgetDidCreated(cfg);
  }
  preUpdate(nextCfg) {
    super.preUpdate(nextCfg);
    this.handleDefinition(nextCfg);
  }
  postUpdate(nextCfg) {
    super.postUpdate(nextCfg);
  
  }
  draw() {
    
  }
  destroy() {
    this.player.dispose();
  }
  
  createVideoInstance() {
    let options = {
      techOrder: ["html5", "flash"],
      controls: true,
      autoplay: false,
      preload: 'auto',
      width: '100%',
      height: '100%',
      poster: poster
    };
    let widget = this;
    return videojs(this.video, options, function onPlayerReady() {
              // let posterDom = self.posterDom = document.querySelector(".vjs-poster");
              console.log(this.posterImage);
              widget.posterDom = this.posterImage.el_;
              let player = this;
              this.on('ended', function() {
                videojs.log('Awww...over so soon?!');
              });
              this.on("error", function() {
                widget.videoerror = true;
                player.posterImage.show();
                // posterDom.style.display = "block";
                console.log("error");
              });
              this.on("loadstart", function() {
                player.posterImage.show();
                // posterDom.style.display = "block";
              });
              this.on("canplay", function() {
                player.posterImage.hide()
                // posterDom.style.display = "none";
              });
            });
  }
  handleDefinition(nextCfg) {
    for(let cname in nextCfg) {
      this.dispatchDefinition(cname, nextCfg[cname])
    }
  }
  
  setStyle(div, key,value) {
    div.style[key] = value;
  }
  loadPoster(src) {
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.src = src;
      img.onload = resolve;
      img.onerror = reject;
    });
  }
  mapKey(key) {
    return {
      // src :'src',
      // poster: 'poster',
      loop: 'loop',
      autoplay: 'autoplay'
    }[key];
  }
  dispatchDefinition(type, value) {
    switch(type) {
      case 'data':
            // this.cfg.chartDefinition.option.content = value;
      break;
      case 'option': 
              this.handleDefinition(value);
      break;
      case {height: 'height',width:'width',/*borderColor:'borderColor'*/}[type]:
              this.setStyle(this.video, type, value);
              this.cfg.chartDefinition.option[type] = value;
      break;
      case 'poster':
        if(!value) {
          this.postererror = true;
          this.player.poster(poster);
        }
        else {
          this.loadPoster(value).then(() => {
            this.player.poster(value);
            this.postererror = false;
            this.posterDom.style.backgroundSize = "100% 100%";
          }).catch(() => {
            this.player.poster(poster);
            this.postererror = true;
            this.posterDom.style.backgroundSize = "auto auto";
          });
        }
        this.cfg.chartDefinition.option[type] = value;
      break;

      case 'src':
        if(!value) {
          this.srcerror = true;
        }
        else {
          this.player.src(value);
        }
        this.cfg.chartDefinition.option[type] = value;
      break;
      case this.mapKey(type):
              this.player[type](value);
              this.cfg.chartDefinition.option[type] = value;
      break;
      default: 
      
    }
  }
  
}