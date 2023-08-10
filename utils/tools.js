/**
 * Split Text into span
 * @param {HTMLElement} element 
 */
export const splitText = (element) => {
    Array.prototype.forEach.call(element, function(el, i) {
        let elText = el.innerText;
        el.setAttribute('data-word', elText);

        const  chars = elText.split('');

        let res = chars.map((el, i) => {
            return `<span style="--i:${i}">${el}</span>`;
        }).join('');
    
        el.innerHTML = res;

    })
}

/**
 * Get the scroll position percent
 */
export const getScrollPercent = () => {
    let h = document.documentElement, 
        b = document.body,
        st = 'scrollTop',
        sh = 'scrollHeight';
    return (h[st]||b[st]) / ((h[sh]||b[sh]) - h.clientHeight) * 100;
  }