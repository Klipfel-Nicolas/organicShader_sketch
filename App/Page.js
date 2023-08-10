
export default class Page {
  constructor() {
    this.page = document.querySelector("#app");
 

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

  addEventListeners() {

  }

  removeEventListeners() {}

  // Destroy

  destroy() {
  }
}
