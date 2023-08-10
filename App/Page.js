import { EventEmitter } from "events";

export default class Page extends EventEmitter {
  constructor() {
    super()
    
    this.page = document.querySelector("#app");

    this.playBtn = document.getElementById('play');

    this.audioStatus = 'pause';

    this.addEventListeners()
  }

  /**
   * Get the scroll position percent
   */
  getScrollPercent() {
    let h = document.documentElement, 
        b = document.body,
        st = 'scrollTop',
        sh = 'scrollHeight';
    return (h[st]||b[st]) / ((h[sh]||b[sh]) - h.clientHeight) * 100;
  }

 
  
  // Events
  onResize() {
   
  }

  // Loop

  update() {
   
  }

  // Listeners
  onClick() {

    if(this.audioStatus == "pause") {
      this.audioStatus = "play"
      this.emit("play");
    }else {
      this.emit("pause");
      this.audioStatus = "pause"
    } 
    
  }

  addEventListeners() {
    this.playBtn.addEventListener('click',this.onClick.bind(this))

  }

  removeEventListeners() {}

  // Destroy

  destroy() {
  }
}
