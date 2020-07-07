// 边界拖拽 - 在 el-row 上添加 v-resize 属性即可

export default {
  inserted(el) {
    el.setAttribute('style', 'position: fixed; z-index: 9999');
  },
  bind(el) {
    el.setAttribute('draggable', true);
    let left;
    let top;
    let width;
    let height;
    el._dragstart = (event) => {
      event.stopPropagation();
      left = event.clientX - el.offsetLeft;
      top = event.clientY - el.offsetTop;
      width = el.offsetWidth;
      height = el.offsetHeight;
    };
    el._checkPosition = () => { // 防止被拖出边界
      const width = el.offsetWidth;
      const height = el.offsetHeight;
      let left = Math.min(el.offsetLeft, document.body.clientWidth - width);
      left = Math.max(0, left);
      let top = Math.min(el.offsetTop, document.body.clientHeight - height);
      top = Math.max(0, top);
      el.style.left = `${left}px`;
      el.style.top = `${top}px`;
      el.style.width = `${width}px`;
      el.style.height = `${height}px`;
    };
    el._dragEnd = (event) => {
      event.stopPropagation();
      left = event.clientX - left;
      top = event.clientY - top;
      el.style.left = `${left}px`;
      el.style.top = `${top}px`;
      el.style.width = `${width}px`;
      el.style.height = `${height}px`;
      el._checkPosition();
    };
    el._documentAllowDraop = (event) => {
      event.preventDefault();
    };
    document.body.addEventListener('dragover', el._documentAllowDraop);
    el.addEventListener('dragstart', el._dragstart);
    el.addEventListener('dragend', el._dragEnd);
    window.addEventListener('resize', el._checkPosition);
  },
  unbind(el) {
    document.body.removeEventListener('dragover', el._documentAllowDraop);
    el.removeEventListener('dragstart', el._dragstart);
    el.removeEventListener('dragend', el._dragEnd);
    window.removeEventListener('resize', el._checkPosition);
    delete el._documentAllowDraop;
    delete el._dragstart;
    delete el._dragEnd;
    delete el._checkPosition;
  },
};
