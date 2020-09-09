/**
 * base on clientHight, then tranform to rem, default 1080px == 10rem
 */
export function autoSetRem (doc, win) {
    const docEl = doc.documentElement;
    const resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
    const reCaculate = function () {
        const clientHeight = docEl.clientHeight;
        if (!clientHeight) return false;
        docEl.style.fontSize = 108 * (clientHeight / 1080) + 'px';
    }
    if (!doc.addEventListener) return false;
    win.addEventListener(resizeEvt, reCaculate, false);
    doc.addEventListener('DOMContentLoaded', reCaculate, false);
}
