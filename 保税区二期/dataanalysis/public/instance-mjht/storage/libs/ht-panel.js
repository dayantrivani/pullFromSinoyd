!function(U,I,a){"use strict";var Q="ht",V=U[Q],k=V.Default,M=k.isTouchable,F=V.Color,w="px",z="0",o="innerHTML",p="className",x="position",B="absolute",f="width",l="height",E="left",P="top",X="right",y="bottom",m="max-width",t="max-height",_=null,J="none",C="",L=U.parseInt,d=U.setTimeout,S=k.getInternal(),v=k.animate,T=F.titleIconBackground,O=function(){return document},u=function(d){return O().createElement(d)},n=function(){return u("div")},A=function(){return u("canvas")},s=function(x,U,C){x.style.setProperty(U,C,_)},Z=function(t,m){return t.style.getPropertyValue(m)},W=function(T,m){T.appendChild(m)},b=function(E,d){E.removeChild(d)},h=function(I){var C=I.scrollWidth,J=I.scrollHeight;return I===O().body&&(C=Math.max(C,O().documentElement.scrollWidth),J=Math.max(J,O().documentElement.scrollHeight)),{width:C,height:J}},D=function(j){var E=j.touches[0];return E?E:j.changedTouches[0]};S.addMethod(k,{panelExpandIcon:{width:16,height:16,comps:[{type:"triangle",rect:[4,4,10,8],background:T,rotation:3.14}]},panelCollapseIcon:{width:16,height:16,comps:[{type:"triangle",rect:[4,4,10,8],background:T}]},panelLockIcon:{width:100,height:100,comps:[{type:"roundRect",rect:[10,50,80,40],borderWidth:10,borderColor:T},{type:"shape",points:[37,45,37,20,37,13,43,13,63,13,69,13,70,19,70,44],segments:[1,2,3,2,3,2],borderWidth:10,borderColor:T}]},panelUnLockIcon:{width:100,height:100,comps:[{type:"roundRect",rect:[10,50,80,40],borderWidth:10,borderColor:T},{type:"shape",points:[37,45,37,20,37,13,43,13,63,13,69,13,70,19,70,26],segments:[1,2,3,2,3,2],borderWidth:10,borderColor:T}]},panelMinimizeIcon:{width:100,height:100,comps:[{type:"shape",points:[10,35,35,35,35,10],segments:[1,2,2],borderWidth:8,borderColor:T},{type:"shape",points:[90,35,65,35,65,10],segments:[1,2,2],borderWidth:8,borderColor:T},{type:"shape",points:[10,65,35,65,35,90],segments:[1,2,2],borderWidth:8,borderColor:T},{type:"shape",points:[65,90,65,65,90,65],segments:[1,2,2],borderWidth:8,borderColor:T}]},panelRestoreIcon:{width:300,height:300,comps:[{type:"rect",rect:[10,24,268,56],background:T},{type:"rect",rect:[10,118,268,56],background:T},{type:"rect",rect:[10,213,268,56],background:T}]},panelTitleLabelColor:k.labelSelectColor,panelTitleLabelFont:k.labelFont,panelContentLabelFont:k.labelFont,panelTitleBackground:F.titleBackground,panelSeparatorWidth:1,panelSeparatorColor:a},!0);var $=V.widget.Panel=function(l){var U=this,k=U._view=S.createView(null,U);U.$1i=0,U.$18i=new V.Notifier,U.$2i="leftTop",s(k,P,z),s(k,E,z),s(k,x,B),s(k,"overflow","hidden"),U._interactor=new g(U),U.setConfig(l),U.addEventListener(function(x){var N=U.getPanelConfig(x.id),g=N.content;("beginRestore"===x.kind||"betweenResize"===x.kind||"endToggle"===x.kind)&&(g&&g.invalidate&&g.invalidate(),N.items&&N.items.forEach(function(Q){Q&&Q.content&&Q.content.invalidate&&Q.content.invalidate()}))})};k.def($,I,{ms_v:1,_dragContainment:"parent",setConfig:function(t){function J(u){u.expanded=!u.expanded,M.togglePanel(u.id,!0,!0)}if(t){var M=this,I=M._view.parentNode;M._view[o]=C,M._config=t,M.$35i=[],t.expanded==_&&(t.expanded=t.expand!=_?t.expand:!0);var H=M._view,$=M.$24i(t,H,!0),G=$[2],P=t.width;M.$35i.push($[1]),t.items&&t.items.forEach(function(D){D.expanded==_&&(D.expanded=D.expand!=_?D.expand:!0);var I=M.$24i(D,G.children[0]);M.$35i.push(I[1])});var L=n();s(L,f,10+w),s(L,l,10+w),s(L,x,B),s(L,y,z),s(L,X,z),L[p]="resize-area",W(H,L),M.$10i(),t.flowLayout&&s(H,x,"relative"),s(H,"opacity",z),W(O().body,H),P==_&&(P=H.offsetWidth),s(H,f,P+w),s(H,m,P+w);var d=t.content;d&&d.isSelfViewEvent&&(d.setX(0),d.setY(0),d.setWidth(P-2*(t.borderWidth||0)),d.setHeight(t.contentHeight)),t.items&&t.items.forEach(function(L){J(L)}),t.buttons&&t.buttons.indexOf("toggle")<0||J(t),t.minimized==_&&t.minimize!=_&&(t.minimized=t.minimize),t.minimized&&t.minimizable!==!1&&M.minimize(!0),b(O().body,H),s(H,"opacity",C),I&&W(I,H),M.iv()}},getPanelConfig:function(C){var l=this,V=l._config,d=V.items;if(V.id===C)return V;if(d)for(var s=0;s<d.length;s++){var M=d[s];if(M.id===C)return M}},getPanelView:function(D){for(var F=this,h=F.$35i,P=0;P<h.length;P++){var E=h[P],g=E.parentNode;if(g.$15i===D)return g}},setDragContainment:function(E){this._dragContainment=E},getDragContainment:function(){return this._dragContainment},$20i:function(){var h=this._config,Q=h.restoreIconSize||24;return Q},$5i:function(b){var Y=b.titleIconSize||16;return M&&(Y*=1.2),Y},$4i:function(D){var w=D.titleHeight||k.widgetTitleHeight;return w},setTitle:function(k,m){if(m==_&&(m=this._config.id),m!=_){var N=this.getPanelConfig(m),x=this.getPanelView(m);N.title=k,x.querySelector(".panel-title span").innerHTML=k}},setInnerPanel:function(C){var p,z,F=this,G=C.id,K=F.$35i,J=!1;if(C.expanded==_&&(C.expanded=!0),G!=_){var l=F.getPanelConfig(G);if(l){J=!0;var k,q=F.getPanelView(G),$=q.parentNode,x=q.children[0];if(q!==F._view){F.$11i();for(k in l)delete l.key;for(k in C)l[k]=C[k];p=F.$24i(C,$,!1,q),z=p[1],$.removeChild(q);for(var P=0;P<K.length;P++)if(K[P]===x){K.splice(P,1,z);break}F.$12i(),l.expanded=!l.expanded,F.togglePanel(l.id,!0,!0),F.iv()}}}if(!J){F.$11i(),p=F.$24i(C,F._view.children[1]),z=p[1],K.push(z),F._config.items||(F._config.items=[]);var y=F._config.items;if(y.push(C),F.$12i(),y.length>1){var H=y[y.length-2],h=F.getPanelView(H.id).children[0];s(h,"border-bottom",F.$55i(H))}C.expanded=!C.expanded,F.togglePanel(C.id,!0,!0),F.iv()}},removeInnerPanel:function(G){var d,L=this,F=-1,y=L._config.items;if(y)for(d=0;d<y.length;d++){var c=y[d];if(c.id===G){F=d;break}}if(L.$11i(),F>=0){var Q=L.$35i,E=L.getPanelView(G),V=E.children[0];for(d=0;d<Q.length;d++)if(Q[d]===V){Q.splice(d,1);break}y.splice(F,1),E.parentNode.removeChild(E)}if(L.$12i(),y.length>0){var $=y[y.length-1],n=L.getPanelView($.id).children[0];s(n,"border-bottom",L.$55i($))}},$6i:function(f){s(f,"cursor","pointer"),s(f,"display","inline-block"),s(f,"margin-right",(M?8:4)+w),s(f,"vertical-align",P)},$24i:function(E,y,V,q){var b=this,P=b._config.flowLayout,l=V?y:n(),z=b.$50i(E),J=b.$3i(E,V);l[p]="ht-widget-panel"+(V?" outer-panel":" inner-panel"),E.borderWidth==_&&(E.borderWidth=V?2:0);var I=E.borderWidth;if(I="0 "+I+w+" "+I+w+" "+I+w+" ",s(l,"padding",I),W(l,J),W(l,z),V||(q?y.insertBefore(l,q):W(y,l)),!P&&V&&E.minimizable!==!1){var Z=A(),H=b.$20i(),Y=E.restoreToolTip;S.setCanvas(Z,H,H),Z[p]="control-button button-minimize button-minimize-restore",b.$6i(Z),s(Z,"display","none"),W(y,Z),Z.title=Y||""}var T=E.titleBackground||k.panelTitleBackground;if(s(l,"background-color",T),E.id==_){for(var t=b.$1i++;b.getPanelConfig(t);)t=b.$1i++;E.id=t}return l.$15i=E.id,E.width&&(l.style.width=E.width+w),[l,J,z]},$9i:function(v){var u=A();u[p]="control-button button-toggle button-toggle-expand",u.title=v.toggleToolTip||"";var I=this.$4i(v),Z=this.$5i(v);return this.$6i(u),S.setCanvas(u,Z,I),u},$8i:function(v){var E=A(),X="control-button button-independent-switch";E[p]=v.independent===!0?X+" button-independent-switch-on":X+" button-independent-switch-off",E.title=v.independentSwitchToolTip||"";var W=this.$4i(v),w=this.$5i(v);return this.$6i(E),S.setCanvas(E,w,W),E},$7i:function(V){var j=A();j[p]="control-button button-minimize button-minimize-minimize",j.title=V.minimizeToolTip||"";var U=this.$4i(V),G=this.$5i(V);return this.$6i(j),S.setCanvas(j,G,U),j},$55i:function(m){var S=this._config,A=S.items,f=m.separatorWidth||k.panelSeparatorWidth,P=m.titleBackground||k.panelTitleBackground,b=m.expanded!==!1?P:m.separatorColor||k.panelSeparatorColor||k.brighter(P);return(S===m||A&&A.indexOf(m)===A.length-1)&&(f=0),f+w+" solid "+b},$3i:function(K,M){var q=this,h=q._config.flowLayout,a=n(),D=n(),j=q.$4i(K),U=K.titleBackground,$=K.titleColor,r=K.titleIcon,I=K.buttons;if(a[p]="panel-title",s(a,x,"relative"),s(a,"background",U||k.panelTitleBackground),s(a,"color",$||k.panelTitleLabelColor),s(a,P,z),s(a,"box-sizing","border-box"),s(a,"-moz-box-sizing","border-box"),s(a,"padding","0 5px 0 0"),s(a,f,"100%"),s(a,"cursor","default"),s(a,"white-space","nowrap"),s(a,"font",k.panelTitleLabelFont),r){var L=A();L[p]="control-button panel-title-icon";var G=q.$4i(K),g=q.$5i(K);q.$6i(L),S.setCanvas(L,g,G),W(a,L)}var J=u("span");s(J,"display","inline-block"),s(J,"margin-left","5px"),J[o]="<span>"+K.title+"</span>",W(a,J),s(a,"line-height",j+w),D[p]="panel-title-controls",s(D,x,B),s(D,E,z),s(D,X,5+w),s(D,P,z),s(D,y,z),s(D,"text-align",X);var v=function(){var R=q.$9i(K);W(D,R)},m=function(){if(!h&&M&&K.minimizable!==!1){var Q=q.$7i(K);W(D,Q)}},V=function(){if(!M){var L=q.$8i(K);W(D,L)}},C=function(L){var O=A();O[p]="control-button custombutton-"+L.name,O.title=L.toolTip||"",O._action=L.action;var G=q.$4i(K),d=q.$5i(K);q.$6i(O),S.setCanvas(O,d,G),W(D,O)};if(I)for(var i=0;i<I.length;i++){var Y=I[i];"string"==typeof Y?"minimize"===Y?m():"independentSwitch"===Y?V():"toggle"===Y&&v():"object"==typeof Y&&C(Y)}else m(),v();return W(a,D),a},$50i:function(c){var H=n(),y=c.contentHeight,M=n();if(s(M,x,"relative"),H[p]="panel-body",s(H,"overflow","hidden"),s(H,"background","white"),s(H,"font",k.panelContentLabelFont),W(H,M),c.content){var Q,v=c.content;v.getView?(W(M,v.getView()),Q=M.children[0]):v instanceof Element?(W(M,v),Q=M.children[0]):M[o]=v,v.isSelfViewEvent||Q&&(s(Q,f,"100%"),s(Q,l,"100%")),y&&s(M,l,y+w)}return H},$10i:function(){var E=this,C=E._config,q=E._view,h=q.querySelector(".resize-area").style;h.display=C.flowLayout||C.minimized===!0||C.expanded===!1?J:"block"},$11i:function(){var F=this._view,k=F.children[1];this.$13i>=0?this.$13i++:this.$13i=1,s(k,t,C),s(F,m,C)},$12i:function(){var A=--this.$13i;if(0===A){var T=this._view,d=T.children[1];s(d,t,d.scrollHeight+w),s(T,m,T.offsetWidth+w)}},$14i:function(){var z=this._view,u=z.children[0],H=u.children[1].children,Y=this._config,s=0;z.$26i=z.offsetWidth,s+=u.children[0].offsetWidth,Y.titleIcon&&(s+=u.children[1].offsetWidth,H=u.children[2].children);for(var F=0;F<H.length;F++){var $=H[F];s+=$.offsetWidth+5}z.$51i=s+15},togglePanel:function(F,q,n){function $(a){var n=a.target,R=n.parentNode,T=h.getPanelConfig(R.$15i);delete R.$19i,n!==O&&h.$12i(),h.$18i.fire({kind:"endToggle",target:h,id:T.id})}for(var h=this,V=h._view,O=V.children[1],Z=_,H=h.$35i,X=H.length,Q=h._config.exclusive,M=h.$2i,u=[],r=h._config.narrowWhenCollapse,g=0;X>g;g++){var c=H[g],T=c.parentNode,K=T.$15i,x=h.getPanelConfig(K);K===F&&(Z=T),!q&&Q&&x.expanded&&T!==V&&K!==F&&x.independent!==!0&&u.push(T)}if(Z&&!Z.$19i){Z.$19i=!0;var L=Z.children[1],G=Z.querySelector(".button-toggle"),d=h.getPanelConfig(Z.$15i);if(!G)return;Z===V||d.expanded||d.independent===!0||u.forEach(function(I){h.togglePanel(I.$15i,!0)}),Z!==V&&h.$11i();var P=200;if(n&&(P=0),h.$18i.fire({kind:"beginToggle",target:h,id:Z.$15i}),d.expanded){var b=function(){G[p]="control-button button-toggle",G[p]+=M.indexOf("Bottom")>=0?" button-toggle-expand":" button-toggle-collapse",s(L,f,L.clientWidth+w),d.expanded=!1,s(Z.children[0],"border-bottom",h.$55i(d)),v(L).duration(P).set("opacity",z).set(t,z).end($),r&&Z===V&&v(Z).duration(P).set(m,Z.$51i+w).end(),Z[p]+=" panel-collapse",v(Z).duration(P).set("padding-bottom",z).end(),h.$28i(d,!0),h.$10i()};r&&Z===V&&h.$14i(),b()}else G[p]="control-button button-toggle",G[p]+=M.indexOf("Bottom")>=0?" button-toggle-collapse":" button-toggle-expand",s(L,f,C),d.expanded=!0,s(Z.children[0],"border-bottom",h.$55i(d)),v(L).duration(P).set("opacity","1").set(t,L.scrollHeight+w).end($),r&&Z===V&&v(Z).duration(P).set(m,(Z.$26i||Z.offsetWidth)+w).end(),Z[p]=Z[p].replace(" panel-collapse",C),v(Z).duration(P).set("padding-bottom",d.borderWidth+w).end(),h.$28i(d,!0),h.$10i()}},$16i:function(){var $=this._view,i=$.$22i,d=$.$23i,x=this.$2i;return i==_&&(x.indexOf(E)>=0?i=$.$22i=0:x.indexOf(X)>=0&&(i=$.$22i=100)),d==_&&(x.indexOf("Top")>=0?d=$.$23i=0:x.indexOf("Bottom")>=0&&(d=$.$23i=100)),[i,d]},$25i:function(){var K=this,k=K._view,x=k.$21i,N=K.$20i(),r=K.$16i(),f=r[0],a=r[1],u=K.$2i;k.children[0].style.display=J,k.children[1].style.display=J,k.children[2].style.display=C,s(k,"padding",z),s(k,m,N+w),"leftTop"===u?(s(k,E,L(Z(k,E))+(x.width-N)*f/100+w),s(k,P,L(Z(k,P))+(x.height-N)*a/100+w)):"leftBottom"===u?(s(k,E,L(Z(k,E))+(x.width-N)*f/100+w),s(k,y,L(Z(k,y))+(x.height-N)*(1-a/100)+w)):"rightTop"===u?(s(k,X,L(Z(k,X))+(x.width-N)*(1-f/100)+w),s(k,P,L(Z(k,P))+(x.height-N)*a/100+w)):"rightBottom"===u&&(s(k,X,L(Z(k,X))+(x.width-N)*(1-f/100)+w),s(k,y,L(Z(k,y))+(x.height-N)*(1-a/100)+w)),k[p]+=" panel-minimized",K.$18i.fire({kind:"endMinimize",target:K,id:k.$15i})},$17i:function(){var Z=this,Q=Z._config,t=Z._view;s(t,"-webkit-transform",C),s(t,"-ms-transform",C),s(t,"transform",C),Q.minimized?Z.$25i():(Z.$18i.fire({kind:"endRestore",target:Z,id:Q.id}),t[p]=t[p].replace(" panel-minimized",C)),delete t.$19i},minimize:function(u){var q=this,R=q._view;if(!R.$19i&&R.children[0].style.display!==J){var N=q._config,z=R.getBoundingClientRect(),f=q.$20i(),P=z.width,n=z.height,e=f/P,x=f/n,T=q.$16i(),B=T[0],Z=T[1];R.$52i=e,R.$53i=x,R.$21i=z,q.$18i.fire({kind:"beginMinimize",target:q,id:R.$15i});var t=200;u&&(t=0),N.minimized=!0,R.$19i=!0,N.expanded&&(R.$26i=R.offsetWidth);var k=B+"% "+Z+"%";s(R,"-webkit-transform-origin",k),s(R,"-ms-transform-origin",k),s(R,"transform-origin",k),v(R).duration(t).scale(e,x).end(function(){q.$17i()}),q.$10i()}},restore:function(){var M,W,o,g,b,H,S,$,U,B,c,F,j=this,l=j._view,u=l.parentNode,q=j._config;if(!l.$19i&&q.minimized){var K=l.$21i,V=l.$52i,f=l.$53i,_=q.borderWidth+w,k=_,R=_,i=0,O=j.$20i(),T=h(u),C=j.$2i;"leftTop"===C?(M=L(Z(l,E)),o=L(Z(l,P)),b=M,S=o,U=M+K.width-T.width,B=o+K.height-T.height,U>0&&(U>=M?M=0:M-=U),B>0&&(B>=o?o=0:o-=B),c=100*((b-M)/(K.width-O)),F=100*((S-o)/(K.height-O)),s(l,E,M+w),s(l,P,o+w)):"leftBottom"===C?(M=L(Z(l,E)),g=L(Z(l,y)),b=M,$=g,U=M+K.width-T.width,B=g+K.height-T.height,U>0&&(U>=M?M=0:M-=U),B>0&&(B>=g?g=0:g-=B),c=100*((b-M)/(K.width-O)),F=100*(1-($-g)/(K.height-O)),s(l,E,M+w),s(l,y,g+w)):"rightTop"===C?(W=L(Z(l,X)),o=L(Z(l,P)),H=W,S=o,U=W+K.width-T.width,B=o+K.height-T.height,U>0&&(U>=W?W=0:W-=U),B>0&&(B>=o?o=0:o-=B),c=100*(1-(H-W)/(K.width-O)),F=100*((S-o)/(K.height-O)),s(l,X,W+w),s(l,P,o+w)):"rightBottom"===C&&(W=L(Z(l,X)),g=L(Z(l,y)),H=W,$=g,U=W+K.width-T.width,B=g+K.height-T.height,U>0&&(U>=W?W=0:W-=U),B>0&&(B>=g?g=0:g-=B),c=100*(1-(H-W)/(K.width-O)),F=100*(1-($-g)/(K.height-O)),s(l,X,W+w),s(l,y,g+w)),l.children[0].style.display="block",l.children[1].style.display="block",l.children[2].style.display=J,s(l,"padding",i+" "+k+" "+R+" "+_),s(l,"-webkit-transform","scale("+V+", "+f+")"),s(l,"-ms-transform","scale("+V+", "+f+")"),s(l,"transform","scale("+V+", "+f+")"),l.$22i=c,l.$23i=F,s(l,"-webkit-transform-origin",c+"% "+F+"%"),s(l,"-ms-transform-origin",c+"% "+F+"%"),s(l,"transform-origin",c+"% "+F+"%"),q.narrowWhenCollapse&&!q.expanded?s(l,m,l.$51i+w):s(l,m,l.$26i+w),j.$18i.fire({kind:"beginRestore",target:j,id:l.$15i}),l.$19i=!0,q.minimized=!1,d(function(){v(l).scale(1,1).end(function(){j.$17i()})},30),j.$10i()}},addEventListener:function(Z,v,n){this.$18i.add(Z,v,n)},removeEventListener:function(n,C){this.$18i.remove(n,C)},setPosition:function(q,S){var O=this._view,I=this.$2i;"leftTop"===I?(s(O,E,q+w),s(O,P,S+w),s(O,X,C),s(O,y,C)):"leftBottom"===I?(s(O,E,q+w),s(O,y,S+w),s(O,X,C),s(O,P,C)):"rightTop"===I?(s(O,X,q+w),s(O,P,S+w),s(O,E,C),s(O,y,C)):"rightBottom"===I&&(s(O,X,q+w),s(O,y,S+w),s(O,E,C),s(O,P,C)),delete O.$22i,delete O.$23i},getPosition:function(){var V=this._view,g=this.$2i;return"leftTop"===g?{x:L(Z(V,E)),y:L(Z(V,P))}:"leftBottom"===g?{x:L(Z(V,E)),y:L(Z(V,y))}:"rightTop"===g?{x:L(Z(V,X)),y:L(Z(V,P))}:"rightBottom"===g?{x:L(Z(V,X)),y:L(Z(V,y))}:void 0},setPositionRelativeTo:function(t){var C=this,g=C._view.querySelectorAll(".button-toggle"),D="control-button button-toggle",x=C.getPosition();C.$2i=t,C.setPosition(x.x,x.y);for(var u=0;u<g.length;u++){var o=g[u],V=C.getPanelConfig(o.parentNode.parentNode.parentNode.$15i);o[p]=V.expanded?t.indexOf("Bottom")>=0?D+" button-toggle-collapse":D+" button-toggle-expand":t.indexOf("Bottom")>=0?D+" button-toggle-expand":D+" button-toggle-collapse"}C.iv()},getPositionRelativeTo:function(){return this.$2i},invalidate:function(M){var s=this;s._68I||(s._68I=1,k.callLater(s.validate,s,_,M),s.onInvalidated&&s.onInvalidated(),s.fireViewEvent("invalidate"));var Z=this._config,f=Z.content;f&&f.invalidate&&f.invalidate(),Z.items&&Z.items.forEach(function(U){U&&U.content&&U.content.invalidate&&U.content.invalidate()})},getIconStretch:function(){var L=this._config.iconStretch||"fill";return L},$27i:function(u,F,g,r,t){var L=S.initContext(u);S.translateAndScale(L,0,0,1),L.clearRect(0,0,g,g);var U=(g-r)/2;k.drawStretchImage(L,k.getImage(F),this.getIconStretch(t),0,U,r,r),L.restore()},$28i:function(Z){var q,z,G,D=this,L=Z.id,x=D.getPanelView(L),J=x.querySelector(".button-toggle"),S=D.$2i.indexOf("Bottom")>=0;if(z=S?k.panelCollapseIcon:k.panelExpandIcon,G=S?k.panelExpandIcon:k.panelCollapseIcon,J){q=Z.expanded?k.getImage(G):k.getImage(z);var E=D.$4i(Z),Y=D.$5i(Z);D.$27i(J,q,E,Y,"toggle")}},$29i:function(S){var p,I=this,F=S.id,V=I.getPanelView(F),N=V.querySelector(".button-independent-switch"),f=k.panelUnLockIcon,t=k.panelLockIcon;if(N){p=S.independent!==!0?k.getImage(t):k.getImage(f);var l=I.$4i(S),W=I.$5i(S);I.$27i(N,p,l,W,"switch")}},$30i:function(e){var o=this,Y=e.id,r=o.getPanelView(Y),Z=r.querySelector(".button-minimize-minimize"),M=k.panelMinimizeIcon;if(Z){var l=o.$4i(e),t=o.$5i(e);o.$27i(Z,k.getImage(M),l,t,"miminize")}},$31i:function(G){var p=this,D=G.id,F=p.getPanelView(D),L=F.querySelector(".button-minimize-restore"),h=G.titleIcon||k.panelRestoreIcon;if(L){var R=p.$20i();p.$27i(L,k.getImage(h),R,R,"restore")}},$32i:function(m){var s=this,c=m.id,N=s.getPanelView(c);if(m.buttons){var u=m.buttons;u.forEach(function(V){var S=V.name,h=V.icon;if(S&&h){var u=N.querySelector(".custombutton-"+S);if(u){var M=s.$4i(m),g=s.$5i(m)-1;s.$27i(u,k.getImage(h),M,g,"custom")}}})}},$33i:function(s){var D=this,r=s.id,t=D.getPanelView(r),h=t.querySelector(".panel-title-icon"),w=s.titleIcon;if(h&&w){var L=D.$4i(s),M=D.$5i(s);D.$27i(h,k.getImage(w),L,M,"title")}},validateImpl:function(){var H=this,P=H._config;H.$28i(P),H.$30i(P),H.$31i(P),H.$32i(P),H.$33i(P),P.items&&P.items.forEach(function(w){H.$28i(w),H.$29i(w),H.$32i(w)})}});var g=function(C){var s=this,P=C.getView();s.$34i=C,s.addListeners(),P.addEventListener("dblclick",s.$42i.bind(s))};k.def(g,I,{ms_listener:1,getView:function(){return this.$34i.getView()},clear:function(){delete this.$37i,delete this.$38i,delete this.$36i,delete this.$39i},$42i:function(u){for(var U=this.$34i,q=u.target,l=U.$35i,O=l.length,c=0;O>c;c++){var M=l[c];M.contains(q)&&(u.preventDefault(),U.togglePanel(M.parentNode.$15i))}},handle_touchstart:function(L){var d=this,N=d.$34i,f=N._config,z=f.flowLayout,C=L;if(k.preventDefault(L),k.isLeftButton(L)){var q=L.target,t=N.getView().children[0],$=N.getView().querySelector(".button-minimize-restore");M&&(C=D(L));var v=d.$40i={x:C.pageX,y:C.pageY};d.$41i={x:v.x,y:v.y},(!z&&t.contains(q)||$&&$.contains(q))&&(d.$38i=!0,k.startDragging(d,L)),!z&&d.handle_mousemove(L)&&(d.$37i=!0,k.startDragging(d,L),N.$11i())}},handle_mousedown:function(b){this.handle_touchstart(b)},handle_touchend:function(D){var Z=this,Q=Z.$34i,o=D.target,d=Q.$35i,g=d.length,s=0,c=Q.getView(),A=c.querySelector(".button-minimize"),P=c.querySelector(".button-minimize-restore");if(!Z.$39i&&!Z.$36i){if(A&&A.contains(o)||P&&P.contains(o))D.preventDefault(),Q._config.minimized?Q.restore():Q.minimize();else for(;g>s;s++){var j=d[s],n=j.parentNode,h=n.$15i,z=Q.getPanelConfig(h),F=j.querySelector(".button-toggle"),L=j.querySelector(".button-independent-switch");if(F===o)D.preventDefault(),Q.togglePanel(h);else if(L===o){D.preventDefault();var T="button-independent-switch-off",C="button-independent-switch-on";z.independent=z.independent==_?!0:!z.independent,L[p]=z.independent?L[p].replace(T,C):L[p].replace(C,T),Q.$29i(z)}else o[p]&&o[p].indexOf("control-button custombutton-")>=0&&j.contains(o)&&o._action.call(Q,z,Q.getPanelView(h),D)}delete Z.$40i,delete Z.$41i}},handle_mouseup:function(s){this.handle_touchend(s)},handleWindowTouchEnd:function(){var P=this,l=P.$34i;P.$37i&&P.$36i?(l.$18i.fire({kind:"endResize",target:l,id:l.getView().$15i}),l.$12i()):P.$38i&&P.$39i&&l.$18i.fire({kind:"endMove",target:l,id:l.getView().$15i}),this.clear()},handleWindowMouseUp:function(p){this.handleWindowTouchEnd(p)},handle_mousemove:function(Z){var X=this,v=X.getView(),E=v.querySelector(".resize-area"),Q=E.getBoundingClientRect(),S={x:Q.left,y:Q.top,width:Q.width,height:Q.height};Z=M?D(Z):Z;var i=Z.clientX,w=Z.clientY,s=X.$34i._config;return s.expanded&&s.minimized!==!0&&k.containsPoint(S,{x:i,y:w})?(v.style.cursor="nwse-resize",!0):(v.style.cursor=C,void 0)},handleWindowTouchMove:function(J){J.preventDefault();var O=J;M&&(O=D(J));var p=this,v=p.$40i,t=p.$41i;if(!(t.x==v.x&&t.y==v.y&&k.getDistance(t,{x:O.pageX,y:O.pageY})<=1)){var b=p.$34i,u=p.getView(),r=u.parentNode,F=b._config,V=F.resizeMode||"wh",T=O.pageX-v.x,m=O.pageY-v.y,o=b.$2i;if(p.$37i){var g=u.children[1].children[0],C=u.clientWidth,x=g.clientHeight,H=C+T,n=x+m;H=Math.max(H,100),n=Math.max(n,100),"w"===V?(s(u,f,H+w),F.width=H,v.x+=H-C,o.indexOf(X)>=0&&s(u,X,L(Z(u,X))-(H-C)+w)):"h"===V?(s(g,l,n+w),F.contentHeight=n,v.y+=n-x,o.indexOf("Bottom")>=0&&s(u,y,L(Z(u,y))-(n-x)+w)):"wh"===V&&(s(u,f,H+w),s(g,l,n+w),F.width=H,F.contentHeight=n,v.x+=H-C,v.y+=n-x,o.indexOf("right")>=0&&s(u,X,L(Z(u,X))-(H-C)+w),o.indexOf("Bottom")>=0&&s(u,y,L(Z(u,y))-(n-x)+w));var z=F.content;z&&z.isSelfViewEvent&&(z.setX(0),z.setY(0),z.setWidth(F.width-2*(F.borderWidth||0)),z.setHeight(F.contentHeight)),p.$36i?b.$18i.fire({kind:"betweenResize",target:b,id:b.getView().$15i}):(p.$36i=!0,b.$18i.fire({kind:"beginResize",target:b,id:b.getView().$15i}))}else if(p.$38i){var G,q,K,N,R,Y,I,a,j,_,d=u.getBoundingClientRect(),A=d.width,S=d.height,c=h(r),B=c.width,i=c.height,U=b._dragContainment;"leftTop"===o?(G=L(Z(u,E))||0,K=L(Z(u,P))||0,R=G+T,I=K+m,"parent"===U&&(R+A>B&&(R=B-A),I+S>i&&(I=i-S),0>R&&(R=0),0>I&&(I=0)),j=R-G,_=I-K,b.setPosition(R,I),v.x+=j,v.y+=_):"rightBottom"===o?(q=L(Z(u,X))||0,N=L(Z(u,y))||0,Y=q-T,a=N-m,"parent"===U&&(0>Y&&(Y=0),0>a&&(a=0),Y+A>B&&(Y=B-A),a+S>i&&(a=i-S)),j=Y-q,_=a-N,b.setPosition(Y,a),v.x-=j,v.y-=_):"rightTop"===o?(q=L(Z(u,X))||0,K=L(Z(u,P))||0,Y=q-T,I=K+m,"parent"===U&&(0>Y&&(Y=0),0>I&&(I=0),Y+A>B&&(Y=B-A),I+S>i&&(I=i-S)),j=Y-q,_=I-K,b.setPosition(Y,I),v.x-=j,v.y+=_):"leftBottom"===o&&(G=L(Z(u,E))||0,N=L(Z(u,y))||0,R=G+T,a=N-m,"parent"===U&&(0>R&&(R=0),0>a&&(a=0),R+A>B&&(R=B-A),a+S>i&&(a=i-S)),j=R-G,_=a-N,b.setPosition(R,a),v.x+=j,v.y-=_),p.$39i?b.$18i.fire({kind:"betweenMove",target:b,id:b.getView().$15i}):(p.$39i=!0,b.$18i.fire({kind:"beginMove",target:b,id:b.getView().$15i}))}}},handleWindowMouseMove:function(e){this.handleWindowTouchMove(e)}});var q=V.widget.PanelGroup=function(z){var U=this,x=U._view=S.createView(null,U);x.style.border="1px dashed black",x.style.position="absolute",x.style.background="rgba(120, 120, 120, 0.4)",U.$48i=new V.List,U._tolerance=100,U._config=z||{hGap:0,vGap:0},U.bindHandlePanelMove=U.handlePanelMove.bind(U),U.bindHandlePanelEvent=U.handlePanelEvent.bind(U),U.invalidate()};k.def(q,I,{invalidate:function(){var T=this;T._68I||(T._68I=1,d(function(){T.validate()},50))},validate:function(){if(this._68I){delete this._68I;var r=this.$48i.get(0);if(r){var N=r.getView().parentNode;N&&(this.layoutPanels(N,"leftTop"),this.layoutPanels(N,"rightTop"),this.layoutPanels(N,"leftBottom"),this.layoutPanels(N,"rightBottom"))}}},setLeftTopPanels:function(){var w=this,U=w.$43i,e=w.$48i;U==_&&(U=w.$43i=new V.List);for(var p=0;p<arguments.length;p++){var Z=arguments[p];if("string"==typeof Z)U.$49i=Z;else{if(Z._config.flowLayout)continue;Z.setPositionRelativeTo("leftTop"),U.contains(Z)||U.add(Z),e.contains(Z)||w.add(Z)}}},setRightTopPanels:function(){var L=this,v=L.$44i,C=L.$48i;v==_&&(v=L.$44i=new V.List);for(var R=0;R<arguments.length;R++){var e=arguments[R];if("string"==typeof e)v.$49i=e;else{if(e._config.flowLayout)continue;e.setPositionRelativeTo("rightTop"),v.contains(e)||v.add(e),C.contains(e)||L.add(e)}}},setLeftBottomPanels:function(){var T=this,q=T.$45i,c=T.$48i;q==_&&(q=T.$45i=new V.List);for(var R=0;R<arguments.length;R++){var l=arguments[R];if("string"==typeof l)q.$49i=l;else{if(l._config.flowLayout)continue;l.setPositionRelativeTo("leftBottom"),q.contains(l)||q.add(l),c.contains(l)||T.add(l)}}},setRightBottomPanels:function(){var A=this,I=A.$46i,i=A.$48i;I==_&&(I=A.$46i=new V.List);for(var n=0;n<arguments.length;n++){var M=arguments[n];if("string"==typeof M)I.$49i=M;else{if(M._config.flowLayout)continue;M.setPositionRelativeTo("rightBottom"),I.contains(M)||I.add(M),i.contains(M)||A.add(M)}}},add:function(e){if(!e._config.flowLayout){var z=this,a=z.$48i;a.contains(e)||(e.addEventListener(z.bindHandlePanelMove),e.addEventListener(z.bindHandlePanelEvent),a.add(e))}},remove:function(Q){var w=this,y=w.$48i;y.contains(Q)&&(Q.removeEventListener(w.bindHandlePanelMove),Q.removeEventListener(w.bindHandlePanelEvent),y.remove(Q),w.$43i.contains(Q)&&w.$43i.remove(Q),w.$44i.contains(Q)&&w.$44i.remove(Q),w.$45i.contains(Q)&&w.$45i.remove(Q),w.$46i.contains(Q)&&w.$46i.remove(Q))},layoutPanels:function(x,F,V){var U=this,g=U._config,E=g.hGap||0,l=g.vGap||0;if(x){var W=U.$43i;if("leftBottom"===F?W=U.$45i:"rightTop"===F?W=U.$44i:"rightBottom"===F&&(W=U.$46i),!W)return;var k=W.$49i,y=E,v=l;if(x.contains(U._view)&&x.removeChild(U._view),W&&W.size()>0)for(var j=0;j<W.size();j++){var K=W.get(j),P=K.getView();x=x||P.parentNode,V!==j?K.setPosition(y,v):("leftTop"===F?(U._view.style.right="",U._view.style.bottom="",U._view.style.left=y+w,U._view.style.top=v+w):"leftBottom"===F?(U._view.style.right="",U._view.style.top="",U._view.style.left=y+w,U._view.style.bottom=v+w):"rightTop"===F?(U._view.style.left="",U._view.style.bottom="",U._view.style.right=y+w,U._view.style.top=v+w):"rightBottom"===F&&(U._view.style.left="",U._view.style.top="",U._view.style.right=y+w,U._view.style.bottom=v+w),U._view.style.width=P.offsetWidth+w,U._view.style.height=P.offsetHeight+w,x.insertBefore(U._view,P)),"h"===k?y+=P.offsetWidth+E:"v"===k&&(v+=P.offsetHeight+l)}}},handlePanelEvent:function(h){if("beginToggle"===h.kind||"endToggle"===h.kind||"beginRestore"===h.kind||"endMinimize"===h.kind||"endResize"===h.kind){var D=this,V=h.target,m=V.getView(),O=m.parentNode,e=D.$43i,B=D.$44i,Z=D.$45i,A=D.$46i,l=D._config,T=_,X=_,M=V.$47i;if(M==_&&(M=V.$47i=0),"beginToggle"===h.kind?M=V.$47i=M+1:"endToggle"===h.kind&&(M=V.$47i=M-1),e&&e.contains(V)?(T="leftTop",X=e):Z&&Z.contains(V)?(T="leftBottom",X=Z):B&&B.contains(V)?(T="rightTop",X=B):A&&A.contains(V)&&(T="rightBottom",X=A),"beginToggle"===h.kind&&T&&1===M){var s=n(),i=s.style,k=X.$49i,F="each";i.fontSize="0",i.position="absolute",i.width="100%","leftTop"===T?(i.left=0,i.top=0):"leftBottom"===T?(i.left=0,i.bottom=0,"v"===k&&(F="reverseEach")):"rightTop"===T?(i.right=0,i.top=0,i.textAlign="right","h"===k&&(F="reverseEach")):"rightBottom"===T&&(i.right=0,i.bottom=0,i.textAlign="right",F="reverseEach"),X[F](function(e){var N=e.getView(),P=N.style,$=n();P.position="static",$.style.textAlign="left",$.style.position="relative",$.style.display="inline-block","leftTop"===T?($.style.marginLeft=l.hGap+w,$.style.marginTop=l.vGap+w):"leftBottom"===T?($.style.marginLeft=l.hGap+w,$.style.marginBottom=l.vGap+w):"rightTop"===T?($.style.marginRight=l.hGap+w,$.style.marginTop=l.vGap+w):"rightBottom"===T&&($.style.marginRight=l.hGap+w,$.style.marginBottom=l.vGap+w),$.appendChild(N),s.appendChild($),"h"===k?$.style.verticalAlign="leftTop"===T||"rightTop"===T?"top":"bottom":s.appendChild(u("br"))}),D.$54i=s,O.appendChild(s)}else"endToggle"===h.kind&&T&&0===M?d(function(){O=O.parentNode.parentNode,O.removeChild(D.$54i),delete D.$54i,X.each(function(B){var Q=B.getView(),u=Q.style;u.position="absolute",O.appendChild(Q)}),D.layoutPanels(O,T)},30):("beginRestore"===h.kind||"endMinimize"===h.kind||"endResize"===h.kind)&&T&&D.layoutPanels(O,T)}},handlePanelMove:function(Z){if(!(Z.kind.indexOf("Move")<0)){var v=this,H=v._config,j=H.hGap||0,C=H.vGap||0,r=Z.target,b=r._view,P=b.getBoundingClientRect(),J=P.width,W=P.height,t=J/2,M=W/2,Y=b.parentNode,T=v.$43i,D=v.$44i,E=v.$45i,g=v.$46i,w=Y.getBoundingClientRect(),o=v._tolerance;if("endMove"===Z.kind){var S=v._corner;S&&(r.setPositionRelativeTo(S),v.layoutPanels(Y,S)),delete v._corner}if("betweenMove"===Z.kind){var d=w.left,h=w.top,O=w.width,A=w.height,K=P.left+J/2,s=P.top+W/2;T==_&&(T=v.$43i=new V.List),E==_&&(E=v.$45i=new V.List),D==_&&(D=v.$44i=new V.List),g==_&&(g=v.$46i=new V.List),delete v._corner,T.contains(r)?(T.remove(r),v.layoutPanels(Y,"leftTop")):E.contains(r)?(E.remove(r),v.layoutPanels(Y,"leftBottom")):D.contains(r)?(D.remove(r),v.layoutPanels(Y,"rightTop")):g.contains(r)&&(g.remove(r),v.layoutPanels(Y,"rightBottom"));var F=function(c,z){var w=d+j,n=h+C;if(0===z.size()){var U=w+t,i=n+M;"leftBottom"===c?i=h+A-C-M:"rightTop"===c?U=d+O-j-t:"rightBottom"===c&&(U=d+O-j-t,i=h+A-C-M);var Z=K-U,p=s-i,V=Math.sqrt(Z*Z+p*p);if(o>V)return v._corner=c,z.add(r),v.layoutPanels(Y,c,0),!0}else if(1===z.size()){var S=z.get(0),k=S.getView().getBoundingClientRect(),q=k.left+t,W=k.top+M,P=k.left+k.width+j+t,e=n+M,D=w+t,$=k.top+k.height+C+M;"leftBottom"===c?(W=k.top+k.height-M,e=h+A-C-M,$=k.top-C-M):"rightTop"===c?(q=k.left+k.width-t,P=k.left-j-t,D=d+O-j-t):"rightBottom"===c&&(q=k.left+k.width-t,W=k.top+k.height-M,P=k.left-j-t,e=h+A-C-M,D=d+O-j-t,$=k.top-C-M);var B=K-q,f=s-W,G=K-P,Q=s-e,g=K-D,E=s-$,x=L(Math.sqrt(B*B+f*f)),J=L(Math.sqrt(G*G+Q*Q)),R=L(Math.sqrt(g*g+E*E)),F=[x,J,R];F.sort(function(r,l){return r-l});var l=F[0];if(o>l){if(v._corner=c,l===x)return z.add(r,0),v.layoutPanels(Y,c,0),!0;if(l===J)return z.add(r),z.$49i="h",v.layoutPanels(Y,c,1),!0;if(l===R)return z.add(r),z.$49i="v",v.layoutPanels(Y,c,1),!0}}else if(z.size()>1){for(var H=_,y={},N=[],b=z.$49i,T=0;T<z.size();T++){var m=z.get(T),I=m.getView(),a=I.getBoundingClientRect(),u=a.left+t,X=a.top+M;"leftBottom"===c?X=a.top+a.height-M:"rightTop"===c?u=a.left+a.width-t:"rightBottom"===c&&(u=a.left+a.width-t,X=a.top+a.height-M),T===z.size()-1&&(H=a);var Z=K-u,p=s-X,V=L(Math.sqrt(Z*Z+p*p));y[V]=T,N.push(V)}"leftTop"===c&&"h"===b?(U=H.left+H.width+j+t,i=n+M):"leftTop"===c&&"v"===b?(U=w+t,i=H.top+H.height+C+M):"leftBottom"===c&&"h"===b?(U=H.left+H.width+j+t,i=h+A-C-M):"leftBottom"===c&&"v"===b?(U=w+t,i=H.top-C-M):"rightTop"===c&&"h"===b?(U=H.left-j-t,i=n+M):"rightTop"===c&&"v"===b?(U=d+O-j-t,i=H.top+H.height+C+M):"rightBottom"===c&&"h"===b?(U=H.left-j-t,i=h+A-C-M):"rightBottom"===c&&"v"===b&&(U=d+O-j-t,i=H.top-C-M),Z=K-U,p=s-i,V=L(Math.sqrt(Z*Z+p*p)),y[V]=T,N.push(V),N.sort(function(F,r){return F-r});var l=N[0];if(o>l)return v._corner=c,z.add(r,y[l]),v.layoutPanels(Y,c,y[l]),!0}};F("leftTop",T)||F("leftBottom",E)||F("rightTop",D)||F("rightBottom",g)}}}})}("undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:(0,eval)("this"),Object);