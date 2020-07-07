

/* eslint-disable */

let scrollMoveObj = null;
let scrollPageY = 0;
let scrollY = 0;
const scrollDivList = [];
/* idName       需要添加滚动条的对象的id名称
   w            滚动条宽度
   className    滚动条样式名称
*/

/* 条件： obj元素必须指定高度, 并设置overflow: hidden;
如果要兼容IE6 必须给obj元素 指定overflow: hidden
*/

function jsScroll(obj, w, className) {
	if (typeof obj === 'string') obj = document.getElementById(obj);
	/* 1. 当内容未超过元素高度时，不添加滚动条
     clientHeight  可以用公式  CSS height + CSS padding - 水平滚动条的高度 (如果存在)  来计算。
	 scorllHeight  当不限制父元素高度，父元素内容撑开的高度就是 scrollHeight
	 两者区别： 当设置overflow: hidden; 后，此时 clientHeight 会判定不存在滚动条高度，
	 从而忽略隐藏的高度，而clientHeight则会加上隐藏起来的高度 
	-----------------------------*/
	if (!obj || obj.scrollHeight <= obj.clientHeight || obj.clientHeight === 0) return;

	obj.scrollBarWidth = w || 6;  //  设置js实现的滚动条宽度,默认为6
	obj.style.overflow = 'hidden'; // 滚动条隐藏


	/* 2. 创建元素，插入元素阶段
	-----------------------------*/
	obj.scrollBar = document.createElement('div'); // 创建一个div元素命名为scrollBar, 滑块可移动空间
	document.body.appendChild(obj.scrollBar);      // 添加到body下 ？？？
	obj.scrollBarIndex = document.createElement('div');  // 滑块
	obj.scrollBar.appendChild(obj.scrollBarIndex);       // 将滑块div放置在可移动空间中


	/* 3. 设置滚动条的样式以及定位方式
	-----------------------------*/
	obj.scrollBar.style.position = 'absolute';
	obj.scrollBarIndex.style.position = 'absolute';
	obj.scrollBar.className = className || '';


	/* 4. 如果未设置滚动条样式的情况下
	-----------------------------*/
	if (!className) {
		obj.scrollBar.style.backgroundColor = '#ddd';
		obj.scrollBarIndex.style.backgroundColor = '#aaa';
	}
	
	/* 5 计算滚动条位置和滑块位置
	-----------------------------*/
	scrollDivList.push(obj);  // 存储元素
	scrollResetSize(obj);     // 计算滚动条（即滑块可移动空间）位置
	
	/* 6. 使用鼠标滚轮滚动
	-----------------------------*/
	obj.scrollBar.scrollDiv = obj;        // 创建的scrollBar的scrollDiv属性指向 obj
	obj.scrollBarIndex.scrollDiv = obj;   // 创建的scrollBarIndex的scrollDiv属性指向 obj
	// 在元素下鼠标滚动触发事件
	obj.onmousewheel = scrollMove;
	obj.scrollBar.onmousewheel = scrollMove;
	obj.scrollBarIndex.onmousewheel = scrollMove;
	
	
	/* 6.拖动滚动条滚动
	-----------------------------*/
	obj.scrollBarIndex.onmousedown = function(evt) {  // 鼠标在滑块上按下时触发
	// obj.scrollBarIndex.addEventListener('mousedown', function(evt) {
		const ev = evt || event;                      // 滑块的event事件记录对象
		scrollPageY = ev.clientY;                     // 鼠标位于浏览器（客户区）顶部距离
		scrollY = this.scrollDiv.scrollTop;           // 元素的内容超过顶部部分高度
		// isScrollMove = true;
		document.body.onselectstart = function() { return false; };
		scrollMoveObj = this.scrollDiv;               // scrollMoveObj用来记录obj元素
		// 如果未给滚动条定义样式, 鼠标按下时滑块颜色默认变为 '#888'
		if (this.scrollDiv.scrollBar.className === '') {
			this.scrollDiv.scrollBarIndex.style.backgroundColor = '#888';
		}
		return false;
	// }, false);
	};

	/* 自定义代码 -- 鼠标移入后触发事件 */
	// obj.scrollBar.onmouse
}



// 当页面大小发生变化时，重新计算滚动条位置
// window.onresize = function() {
window.addEventListener('resize', function() {
	for(let i = 0; i < scrollDivList.length; i += 1) {
		scrollResetSize(scrollDivList[i]);
	}
}, false);
// };

/* 计算自定义滚动条（滑块可滑动空间）位置，后在计算滑块位于滚动条的位置
*/
function scrollResetSize(o) {
	// 如果内容高度 小于等于 元素高度，隐藏滑块位置并将
	if (o.scrollHeight <= o.clientHeight) {
		o.scrollTop = 0;
		o.scrollBar.style.display = 'none';
	} else {
		o.scrollBar.style.display = 'block';
	}
	// 此处x,y是获取元素到body的距离
	let x = 0; 
	let y = 0;
	let p = o;
	while(p) {
		x += p.offsetLeft;
		y += p.offsetTop;
		p = p.offsetParent;
	}
	let borderTop = parseInt(o.style.borderTopWidth || 0);                // 获取元素上边框高厚多少px
	let borderBottom = parseInt(o.style.borderBottomWidth || 0);          // 获取元素下边框厚多少px
	o.scrollBar.style.width = o.scrollBarWidth + 'px';                    // 设置 
	o.scrollBar.style.height = o.clientHeight + 'px';                     // 元素高度不包括上下边框
	o.scrollBar.style.top = y + borderTop + 'px';                          
	o.scrollBar.style.left = x + o.offsetWidth - o.scrollBarWidth + 'px';
	o.scrollBarIndex.style.width = o.scrollBarWidth + 'px';
	let h = o.clientHeight - (o.scrollHeight - o.clientHeight);          // 元素高度 - 内容超出元素的高度 即为滚动条高度
	// 当滚动条滑块最小20px
	if (h < 20) h = 20;
	o.scrollBarHeight = h;                             // 设置一个变量 scrollBarHeight 来存储滑块高度
	o.scrollBarIndex.style.height = h + 'px';          // 给滑块赋值高度
	o.scrollBarIndex.style.left = '0px';               // 滑块左定位为0
	setScrollPosition(o);                              // 计算滑块位置
}


/*  o => obj
滑块在滚动条内位移距离
*/
function setScrollPosition(o) {
	/* scrollTop  内部超出父元素顶部的距离
		如果一个元素不能被滚动，它的scrollTop将设置为 0。
		设置为scrollTop的值小于0，scrollTop 被设置为 0.
		如果设置了超出容器可滚动的值，scrollTop将会被设置为最大值
		判定元素是否滚动到底
		element.scrollHeight - element.scrollTop === element.clientHeight
	*/
	// 滑块移动距离
	// (元素高度 - 滑块高度) / (内容高度 - 元素高度)
	// 滑动空间可滑动距离 * 元素已滑动距离/元素可滑动距离 = 滑块在可滑动空间的已滑动高度
	o.scrollBarIndex.style.top = (o.clientHeight - o.scrollBarHeight) * o.scrollTop / (o.scrollHeight - o.clientHeight) + 'px' 
};


document.documentElement.onmousemove = function(evt) {
// document.documentElement.addEventListener('mousemove', function() {
	if (!scrollMoveObj) return;   // => scrollMoveObj => obj 滑块上按下鼠标才会赋值
	const ev = evt || event;
	// （内容高度 - 元素高度）/ （元素高度 - 滚动条高度） => 可滑动内容高度 / 滑块可滑动距离 => 每份滑块可滑动距离对应的可滑动内容高度
	const per = (scrollMoveObj.scrollHeight - scrollMoveObj.clientHeight) / (scrollMoveObj.clientHeight - scrollMoveObj.scrollBarHeight)
	// 内容超出元素顶部部分 - （鼠标在滑块上按下时对于浏览器（客户区）的垂直坐标 - 现在鼠标坐标） *  每份滑块可滑动距离对应的可滑动内容高度
	// => 内容超出元素顶部部分 - 已滑动的内容高度
	scrollMoveObj.scrollTop = scrollY - (scrollPageY - ev.clientY) * per;
	setScrollPosition(scrollMoveObj);

	/* MJ自定义编写 -- 当鼠标移动区域不在 scrollBarIndex区域时, 触发 */
	// if (scrollMoveObj.scrollBarIndex !== evt && scrollMoveObj.scrollBar !== evt) {
	// 	scrollMoveObj.scrollBar.style.opacity = 1;
	// }
// }, false);
};


document.documentElement.onmouseup = function(evt){
// document.documentElement.addEventListener('mouseup', function() {
	if (!scrollMoveObj) return;
	if(scrollMoveObj.scrollBar.className == '') {
		scrollMoveObj.scrollBarIndex.style.backgroundColor = '#aaa';
	}

	/* MJ自定义编写 -- 当鼠标移动区域不在 scrollBarIndex区域时, 触发 */
	// if (scrollMoveObj.scrollBarIndex !== evt && scrollMoveObj.scrollBar !== evt) {
	// 	scrollMoveObj.scrollBar.style.opacity = 0;
	// } else {
	// 	scrollMoveObj.scrollBar.style.opacity = 1;
	// }

	scrollMoveObj = null;
	document.body.onselectstart = function() { return true }; // 禁止选择网页中的文字
// }, false);
};



/*  鼠标滚轮滚动
上面将两者的scrollDiv属性指向obj就是为了这个方法获取 obj元素
*/
function scrollMove(evt) {
	const div = this.scrollDiv || this;    // div => obj元素
	if (div.scrollHeight <= div.clientHeight) return true;
	
	const ev = evt || event;
	const step = 20;
	/* ev.wheelDelta < 0 鼠标向下滚动，
	    如果元素滚动条移动距离 + 元素高度 大于等于 内容高度，向下无效
	   ev.wheelDelta > 0 鼠标向上滚动
	     如果元素滚动条移动距离 为 0， 向上无效
	*/
	if (ev.wheelDelta < 0) {
		if (div.scrollTop >= (div.scrollHeight - div.clientHeight)) return true;
		div.scrollTop += step;
	} else {
		if (div.scrollTop === 0) return true;
		div.scrollTop -= step;
	}
	
	/* 滑块在滚动条内位移距离 */
  setScrollPosition(div);
  
  return false;  // 取消默认事件
}

export default jsScroll;
