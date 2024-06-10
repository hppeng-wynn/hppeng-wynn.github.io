function add_katex() {
    head_elem = document.getElementsByTagName("head")[0];

    link = document.createElement('link')
    link.setAttribute('rel', 'stylesheet')
    link.setAttribute('href', "https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/katex.min.css")
    link.setAttribute('integrity', "sha384-wcIxkf4k558AjM3Yz3BBFQUbk/zgIYC2R0QpeeYb+TwlBVMrlgLqwRjRtGZiK7ww")
    link.setAttribute('crossorigin', "anonymous")
    scr_1 = document.createElement('script')
    scr_1.setAttribute('src', "https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/katex.min.js")
    scr_1.setAttribute('integrity', "sha384-hIoBPJpTUs74ddyc4bFZSM1TVlQDA60VBbJS0oA934VSz82sBx1X7kSx2ATBDIyd")
    scr_1.setAttribute('crossorigin', "anonymous")
    scr_1.setAttribute('defer', '')
    scr_2 = document.createElement('script')
    scr_2.setAttribute('src',"https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/contrib/auto-render.min.js")
    scr_2.setAttribute('integrity', "sha384-43gviWU0YVjaDtb/GhzOouOXtZMP/7XUzwPTstBeZFe/+rCMvRwr4yROQP43s0Xk")
    scr_2.setAttribute('crossorigin', "anonymous")
    scr_2.setAttribute('defer', '')
    scr_2.setAttribute('onload', "renderMathInElement(document.body, {delimiters: [{left: '$$', right: '$$', display: true},{left: '$', right: '$', display: false}]});")

    head_elem.append(link, scr_1, scr_2);
}      


add_katex();

    