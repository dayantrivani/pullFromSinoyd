!function(b,G){"use strict";var J="ht",W=J+".graph.",X=b[J],Y=X.graph,u=X.Default,Q=X.Color,y=null,U="px",F=u.getInternal(),z=F.getPinchDist,$=u.preventDefault,o=u.getTouchCount,V=u.startDragging;F.addMethod(u,{overviewBackground:Q.widgetBackground,overviewMaskBackground:Q.transparent,overviewContentBorderColor:Q.widgetBorder,overviewContentBackground:Q.background},!0),Y.Overview=function(C){var j=this,Q=j._view=F.createView(1,j);j._canvas=F.createCanvas(Q),Q.style.background=u.overviewBackground,Q.appendChild(j._mask=F.createDiv()),j.setGraphView(C),j.addListeners()},u.def(W+"Overview",G,{ms_v:1,ms_fire:1,ms_listener:1,ms_ac:["maskBackground","contentBorderColor","contentBackground","autoUpdate"],_autoUpdate:!0,_rate:1,_scrollRect:{x:0,y:0,width:0,height:0},_maskBackground:u.overviewMaskBackground,_contentBorderColor:u.overviewContentBorderColor,_contentBackground:u.overviewContentBackground,getGraphView:function(){return this.gv},setGraphView:function(k){var j=this;if(j.gv!==k){var q=j.gv;j.gv=k,q&&(q.removeViewListener(j.handleGraphViewChanged,j),q.ump(j.handleGraphViewPropertyChanged,j)),k&&(k.addViewListener(j.handleGraphViewChanged,j),k.mp(j.handleGraphViewPropertyChanged,j)),j.fp("graphView",q,k),j.redraw()}},getCanvas:function(){return this._canvas},getMask:function(){return this._mask},dispose:function(){this.setGraphView(null)},onPropertyChanged:function(){this.redraw()},handleGraphViewChanged:function(A){this._autoUpdate&&"validate"===A.kind&&this.redraw()},handleGraphViewPropertyChanged:function(g){"canvasBackground"===g.property&&this.redraw()},redraw:function(){var V=this;V._redraw||(V._redraw=1,V.iv(50))},validateImpl:function(){var l=this,R=l.gv,K=l._canvas,Z=l.getWidth(),q=l.getHeight(),N=l._redraw;if(R){var H=l._mask,w=H.style,$=R.getViewRect(),k=R.getScrollRect(),i=k.x,I=k.y,T=k.width,j=k.height,e=l._rate=Math.max(T/Z,j/q),h=l._x=(Z-T/e)/2,c=l._y=(q-j/e)/2;if(0!==$.width&&0!==$.height||l.hasRetry||(u.callLater(l.iv,l,y),l.hasRetry=!0),(Z!==K.clientWidth||q!==K.clientHeight)&&(F.setCanvas(K,Z,q),N=1),F.isSameRect(k,l._scrollRect)||(l._scrollRect=k,N=1),N){var d=F.initContext(K),D=R.getDataModel().getBackground()||l._contentBackground,o=l._contentBorderColor,A=u.devicePixelRatio;d.clearRect(0,0,Z*A,q*A),D&&F.fillRect(d,h*A,c*A,T/e*A,j/e*A,D),F.translateAndScale(d,-i/e+h,-I/e+c,1/e),R._42(d),d.restore(),o&&F.drawBorder(d,o,h*A,c*A,T/e*A,j/e*A)}w.background=l._maskBackground,w.left=h+($.x-i)/e+U,w.top=c+($.y-I)/e+U,w.width=$.width/e+U,w.height=$.height/e+U,l._redraw=null}else if(N){var d=F.initContext(K);d.clearRect(0,0,Z,q),d.restore(),l._redraw=null}},center:function(Z){var b=this,V=b.gv;if(V){var K=V._zoom,j=V._29I,t=b._rate,I=b._scrollRect,S=u.getLogicalPoint(Z,b._canvas),E=I.x+(S.x-b._x)*t,$=I.y+(S.y-b._y)*t;V.setTranslate((j.width/2-E)*K,(j.height/2-$)*K)}},handle_mousedown:function(G){this.handle_touchstart(G)},handleWindowMouseUp:function(L){this.handleWindowTouchEnd(L)},handleWindowMouseMove:function(h){this.handleWindowTouchMove(h)},handle_mousewheel:function(F){this.handleScroll(F,F.wheelDelta)},handle_DOMMouseScroll:function(q){2===q.axis&&this.handleScroll(q,-q.detail)},handleScroll:function(z,i){if($(z),this.gv){var x=this.gv;i>0?x.scrollZoomIn():0>i&&x.scrollZoomOut()}},handle_touchstart:function(n){if($(n),this.gv&&u.isLeftButton(n)){var S=this,R=S.gv,j=o(n);1===j?u.isDoubleClick(n)&&R.isResettable()?R.reset():(S.center(n),V(S,n)):2===j&&(S._dist=z(n),V(S,n))}},handleWindowTouchEnd:function(){delete this._dist},handleWindowTouchMove:function(L){if(this.gv){var C=this,K=C._dist,k=o(L);1===k?C.center(L):2===k&&K!=y&&C.gv.handlePinch(y,z(L),K)}}})}("undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:(0,eval)("this"),Object);