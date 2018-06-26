var SketchLib=function(t){function e(e){for(var i,s,a=e[0],h=e[1],u=e[2],c=0,p=[];c<a.length;c++)s=a[c],n[s]&&p.push(n[s][0]),n[s]=0;for(i in h)Object.prototype.hasOwnProperty.call(h,i)&&(t[i]=h[i]);for(l&&l(e);p.length;)p.shift()();return o.push.apply(o,u||[]),r()}function r(){for(var t,e=0;e<o.length;e++){for(var r=o[e],i=!0,a=1;a<r.length;a++){var h=r[a];0!==n[h]&&(i=!1)}i&&(o.splice(e--,1),t=s(s.s=r[0]))}return t}var i={},n={1:0},o=[];function s(e){if(i[e])return i[e].exports;var r=i[e]={i:e,l:!1,exports:{}};return t[e].call(r.exports,r,r.exports,s),r.l=!0,r.exports}s.m=t,s.c=i,s.d=function(t,e,r){s.o(t,e)||Object.defineProperty(t,e,{configurable:!1,enumerable:!0,get:r})},s.r=function(t){Object.defineProperty(t,"__esModule",{value:!0})},s.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return s.d(e,"a",e),e},s.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},s.p="/dist";var a=window.webpackJsonpSketchLib=window.webpackJsonpSketchLib||[],h=a.push.bind(a);a.push=e,a=a.slice();for(var u=0;u<a.length;u++)e(a[u]);var l=h;return o.push([90,0]),r()}({194:function(t,e){},196:function(t,e){},90:function(t,e,r){"use strict";r.r(e);var i=r(8),n=r(0),o=function(){function t(){}return t.rotatePoint=function(t,e,r,i,n){return{x:Math.cos(n)*(t-r)-Math.sin(n)*(e-i)+r,y:Math.sin(n)*(t-r)+Math.cos(n)*(e-i)+i}},t.calcTiltAngle=function(t,e){return{angle:Math.atan2(e,t)*(180/Math.PI),tilt:Math.max(Math.abs(t),Math.abs(e))}},t.lerp=function(t,e,r){return t+(e-t)*(r=(r=r<0?0:r)>1?1:r)},t.arrayPostDivide=function(t){for(var e=0;e<t.length;e+=4){var r=t[e+3];r&&(t[e]=Math.round(Math.min(255*t[e]/r,255)),t[e+1]=Math.round(Math.min(255*t[e+1]/r,255)),t[e+2]=Math.round(Math.min(255*t[e+2]/r,255)))}},t.pixelsToCanvas=function(t,e,r){var i=document.createElement("canvas");i.width=e,i.height=r;var n=i.getContext("2d"),o=n.createImageData(e,r);return o.data.set(t),n.putImageData(o,0,0),i},t.dataURLToFileContents=function(t){return t.replace(/^data:image\/\w+;base64,/,"")},t}(),s=function(){return function(t){this.name="default",this.blendMode="normal",this.sizeLimitMax=1,this.sizeLimitMin=0,this.opacityMax=1,this.opacityMin=0,this.spacing=0,this.brushImage="brushcharcoal",this.brushRotation=0,this.brushImageInvert=!1,this.grainImage="graingrid",this.grainRotation=0,this.grainImageInvert=!1,this.movement=1,this.scale=1,this.zoom=0,this.rotation=0,this.randomOffset=!0,this.azimuth=!0,this.pressureOpacity=1,this.pressureSize=1,this.pressureBleed=0,this.tiltAngle=0,this.tiltOpacity=1,this.tiltGradiation=0,this.tiltSize=1,this.orientToScreen=!0,t&&Object.assign(this,t)}}(),a=function(){return function(t){this.settings=new s(t)}}(),h=function(){var t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r])};return function(e,r){function i(){this.constructor=e}t(e,r),e.prototype=null===r?Object.create(r):(i.prototype=r.prototype,new i)}}(),u=r(91),l=function(t){function e(e){var r=t.call(this,null,u,{uRed:{type:"1f",value:.5},uGreen:{type:"1f",value:.5},uBlue:{type:"1f",value:.5},uOpacity:{type:"1f",value:1},uRotation:{type:"1f",value:0},uBleed:{type:"1f",value:0},uGrainRotation:{type:"1f",value:0},uGrainScale:{type:"1f",value:1},u_x_offset:{type:"1f",value:0},u_y_offset:{type:"1f",value:0},u_offset_px:{type:"vec2"},u_node_scale:{type:"vec2",value:[0,0]},u_grainTex:{type:"sampler2D",value:""},dimensions:{type:"vec2",value:[0,0]},filterMatrix:{type:"mat3"}})||this;r.padding=0,r.blendMode=n.BLEND_MODES.NORMAL,r.autoFit=!1;var i=new n.Matrix;return e.renderable=!1,r.grainSprite=e,r.grainMatrix=i,r.uniforms.u_grainTex=e.texture,r.uniforms.filterMatrix=i,r}return h(e,t),e.prototype.apply=function(t,e,r,i){this.uniforms.dimensions[0]=e.sourceFrame.width,this.uniforms.dimensions[1]=e.sourceFrame.height,this.uniforms.filterMatrix=t.calculateSpriteMatrix(this.grainMatrix,this.grainSprite),t.applyFilter(this,e,r,i)},e}(n.Filter),c=function(){var t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r])};return function(e,r){function i(){this.constructor=e}t(e,r),e.prototype=null===r?Object.create(r):(i.prototype=r.prototype,new i)}}(),p=function(t){function e(e){var r=t.call(this)||this;return r.container=e,r.name="cursorSprite",r.gfx=new n.Graphics,r.addChild(r.gfx),r._enabled=!0,r.visible=!1,r.updateSize(),r}return c(e,t),e.prototype.renderCursor=function(t){var e=this.container.localizePoint(t);this.position.set(e.x,e.y),this.anchor.set(.5),this._enabled&&(this.visible=!0)},e.prototype.updateSize=function(){var t=.7*this.container.brushSize,e=Math.ceil(1*t/2),r=Math.ceil(1*t/2);this.gfx.clear().lineStyle(2,16777215,.001).drawCircle(e,r,Math.ceil(1*t)+2).closePath().lineStyle(1,16777215).drawCircle(e,r,Math.ceil(1*t)-1).closePath().lineStyle(1,0).drawCircle(e,r,Math.ceil(1*t)).closePath(),this.texture.destroy(!0),this.texture=this.gfx.generateCanvasTexture(),this.getLocalBounds(),this.gfx.clear()},e.prototype.setEnabled=function(t){this._enabled=t,this._enabled||(this.visible=!1)},e.prototype.getEnabled=function(){return this._enabled},e}(n.Sprite),d=function(){function t(t){this.renderer=t.renderer,this.width=t.width,this.height=t.height,this.name=t.name,this.sprite=new n.Sprite(n.RenderTexture.create(this.width,this.height)),this.sprite.name=t.name,this.dirty=!1}return t.prototype.getOpacity=function(){return this.sprite.alpha},t.prototype.setOpacity=function(t){this.sprite.alpha=t},t.prototype.pixels=function(t){void 0===t&&(t=!1);var e=this.renderer.plugins.extract.pixels(this.sprite.texture);return t&&o.arrayPostDivide(e),e},t.prototype.toCanvas=function(t){void 0===t&&(t=!0);var e=this.pixels(t);return o.pixelsToCanvas(e,this.width,this.height)},t.prototype.toDataURL=function(t){return void 0===t&&(t=!0),this.toCanvas(t).toDataURL()},t.prototype.export=function(t){return o.dataURLToFileContents(this.toDataURL())},t.prototype.draw=function(t,e){void 0===e&&(e=!1),this.renderer.render(t,this.sprite.texture,e)},t.prototype.clear=function(){this.draw(new n.Sprite(n.Texture.EMPTY),!0)},t.prototype.replace=function(t,e){void 0===e&&(e=!0),this.draw(n.Sprite.from(t),e)},t.prototype.replaceTextureFromCanvas=function(t){n.utils.clearTextureCache(),this.replace(n.Texture.from(t))},t.prototype.rewrite=function(){var t=this.sprite.alpha;this.sprite.alpha=1,this.replaceTexture(this.sprite),this.sprite.alpha=t},t.prototype.replaceTexture=function(t){var e=n.RenderTexture.create(this.width,this.height);this.renderer.render(t,e,!0),this.sprite.texture=e},t.prototype.isEmpty=function(){for(var t=0,e=this.renderer.plugins.extract.pixels(this.sprite.texture);t<e.length;t++){if(0!==e[t])return!1}return!0},t.prototype.getDirty=function(){return this.dirty},t.prototype.setDirty=function(t){this.dirty=t},t.prototype.setVisible=function(t){this.sprite.visible=t},t.prototype.getVisible=function(){return this.sprite.visible},t.prototype.flip=function(t){void 0===t&&(t=!1);var e=new n.Sprite(this.sprite.texture);e.anchor.set(.5,.5),t?(e.pivot.set(-e.width/2,e.height/2),e.scale.y*=-1):(e.pivot.set(e.width/2,-e.height/2),e.scale.x*=-1),this.replaceTexture(e)},t}(),f=function(){var t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r])};return function(e,r){function i(){this.constructor=e}t(e,r),e.prototype=null===r?Object.create(r):(i.prototype=r.prototype,new i)}}(),y=Object.assign||function(t){for(var e,r=1,i=arguments.length;r<i;r++)for(var n in e=arguments[r])Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t},g=function(t){function e(){return t.call(this)||this}return f(e,t),e.create=function(t){var r=Object.create(e.prototype);return r.renderer=t.renderer,r.width=t.width,r.height=t.height,r.onAdd=t.onAdd,r.onSelect=t.onSelect,r},e.prototype.create=function(t){var e=new d(y({renderer:this.renderer,width:this.width,height:this.height},t));return this.add(e),e},e.prototype.add=function(t){var e=this.length;return this.push(t),t.index=e,this.onAdd&&this.onAdd(t.index),t},e.prototype.markDirty=function(t){for(var e=0,r=t;e<r.length;e++){this[r[e]].setDirty(!0)}},e.prototype.getCurrentIndex=function(){return this.currentIndex},e.prototype.setCurrentIndex=function(t){this.currentIndex=t,this.onSelect&&this.onSelect(t)},e.prototype.getCurrentLayer=function(){return this[this.currentIndex]},e.prototype.flip=function(t){void 0===t&&(t=!1);for(var e=0;e<this.length;e++){this[e].flip(t)}},e.prototype.extractThumbnailPixels=function(t,e,r){void 0===r&&(r=[]);var i=PIXI.RenderTexture.create(t,e);return this.renderer.plugins.extract.pixels(this.generateCompositeTexture(t,e,r,i))},e.prototype.generateCompositeTexture=function(t,e,r,i){void 0===r&&(r=[]);for(var n=0;n<this.length;n++){var o=this[n];if(r.length&&r.includes(o.index)){var s=new PIXI.Sprite(o.sprite.texture);s.alpha=o.sprite.alpha,s.scale.set(t/this.width,e/this.height),this.renderer.render(s,i,!1)}}return i},e.prototype.findByName=function(t){return this.find(function(e){return e.name===t})},e.prototype.merge=function(t,e){var r=PIXI.RenderTexture.create(this.width,this.height);r=this.generateCompositeTexture(this.width,this.height,t,r),this[e].clear(),this[e].replace(r);for(var i=0,n=t;i<n.length;i++){var o=n[i];o!==e&&this[o].clear()}},e}(Array),v=function(t,e,r,i){return new(r||(r=Promise))(function(n,o){function s(t){try{h(i.next(t))}catch(t){o(t)}}function a(t){try{h(i.throw(t))}catch(t){o(t)}}function h(t){t.done?n(t.value):new r(function(e){e(t.value)}).then(s,a)}h((i=i.apply(t,e||[])).next())})},m=function(t,e){var r,i,n,o,s={label:0,sent:function(){if(1&n[0])throw n[1];return n[1]},trys:[],ops:[]};return o={next:a(0),throw:a(1),return:a(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function a(o){return function(a){return function(o){if(r)throw new TypeError("Generator is already executing.");for(;s;)try{if(r=1,i&&(n=2&o[0]?i.return:o[0]?i.throw||((n=i.return)&&n.call(i),0):i.next)&&!(n=n.call(i,o[1])).done)return n;switch(i=0,n&&(o=[2&o[0],n.value]),o[0]){case 0:case 1:n=o;break;case 4:return s.label++,{value:o[1],done:!1};case 5:s.label++,i=o[1],o=[0];continue;case 7:o=s.ops.pop(),s.trys.pop();continue;default:if(!(n=(n=s.trys).length>0&&n[n.length-1])&&(6===o[0]||2===o[0])){s=0;continue}if(3===o[0]&&(!n||o[1]>n[0]&&o[1]<n[3])){s.label=o[1];break}if(6===o[0]&&s.label<n[1]){s.label=n[1],n=o;break}if(n&&s.label<n[2]){s.label=n[2],s.ops.push(o);break}n[2]&&s.ops.pop(),s.trys.pop();continue}o=e.call(t,s)}catch(t){o=[6,t],i=0}finally{r=n=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,a])}}},C=function(){function t(t){void 0===t&&(t={backgroundColor:16777215}),this.images={brush:{},grain:{}},this.efficiencyMode=!1,this.pointerDown=!1,this.layerMask=void 0,this.layerBackground=void 0,this.viewClientRect=void 0,this.containerPadding=50,this.onStrokeBefore=t.onStrokeBefore,this.onStrokeAfter=t.onStrokeAfter,this.setup(t),this.setImageSize(t.imageWidth,t.imageHeight),this.app.view.style.cursor="none"}return t.canInitialize=function(){return n.utils.isWebGLSupported()},t.prototype.setup=function(t){i.setup(void 0),i.view.setAutoUpdate(!1),new i.Path,n.settings.FILTER_RESOLUTION=1,n.settings.PRECISION_FRAGMENT=n.PRECISION.HIGH,n.settings.MIPMAP_TEXTURES=!0,n.settings.WRAP_MODE=n.WRAP_MODES.REPEAT,n.utils.skipHello(),this.app=new n.Application({backgroundColor:t.backgroundColor,antialias:!!this.efficiencyMode}),this.app.renderer.roundPixels=!1,this.sketchPaneContainer=new n.Container,this.sketchPaneContainer.name="sketchPaneContainer",this.layerContainer=new n.Container,this.layerContainer.name="layerContainer",this.sketchPaneContainer.addChild(this.layerContainer),this.strokeContainer=new n.Container,this.strokeContainer.name="static",this.liveStrokeContainer=new n.Container,this.liveStrokeContainer.name="live",this.layerContainer.addChild(this.liveStrokeContainer),this.offscreenContainer=new n.Container,this.offscreenContainer.name="offscreen",this.offscreenContainer.renderable=!1,this.layerContainer.addChild(this.offscreenContainer),this.eraseMask=new n.Sprite,this.eraseMask.name="eraseMask",this.cursor=new p(this),this.sketchPaneContainer.addChild(this.cursor),this.app.stage.addChild(this.sketchPaneContainer),this.sketchPaneContainer.scale.set(1),this.viewClientRect=this.app.view.getBoundingClientRect()},t.prototype.setImageSize=function(t,e){this.width=t,this.height=e,this.layerMask=(new n.Graphics).beginFill(0,1).drawRect(0,0,this.width,this.height).endFill(),this.layerMask.name="layerMask",this.layerContainer.mask=this.layerMask,this.sketchPaneContainer.addChild(this.layerMask),this.layerBackground=(new n.Graphics).beginFill(16777215).drawRect(0,0,this.width,this.height).endFill(),this.layerBackground.name="background",this.layerContainer.addChild(this.layerBackground),this.eraseMask.texture=n.RenderTexture.create(this.width,this.height),this.centerContainer(),this.layers=g.create({renderer:this.app.renderer,width:this.width,height:this.height,onAdd:this.onLayersCollectionAdd.bind(this),onSelect:this.onLayersCollectionSelect.bind(this)})},t.prototype.onLayersCollectionAdd=function(t){var e=this.layers[t];this.layerContainer.position.set(0,0),this.layerContainer.addChild(e.sprite),this.centerContainer()},t.prototype.onLayersCollectionSelect=function(t){this.updateLayerDepths()},t.prototype.updateLayerDepths=function(){var t=this.layers.getCurrentIndex(),e=this.layers[t];this.layerContainer.setChildIndex(this.layerBackground,0);for(var r=1,i=0,n=this.layers;i<n.length;i++){var o=n[i];this.layerContainer.setChildIndex(o.sprite,r),o.sprite===e.sprite&&(this.layerContainer.setChildIndex(this.offscreenContainer,++r),this.layerContainer.setChildIndex(this.liveStrokeContainer,++r)),r++}},t.prototype.newLayer=function(t){return this.layers.create(t)},t.prototype.centerContainer=function(){this.sketchPaneContainer.pivot.set(this.width/2,this.height/2),this.sketchPaneContainer.position.set(Math.floor(this.app.renderer.width/2),Math.floor(this.app.renderer.height/2))},t.prototype.resize=function(t,e){this.app.renderer.resize(t,e);var r={width:Math.max(0,t-2*this.containerPadding),height:Math.max(0,e-2*this.containerPadding)},i={width:this.width,height:this.height},n=r.width/r.height>i.width/i.height?i.width*r.height/i.height:r.width;this.sketchPaneContainer.scale.set(Math.floor(n)/Math.floor(i.width)),this.centerContainer(),this.viewClientRect=this.app.view.getBoundingClientRect()},t.prototype.loadBrushes=function(t){return v(this,void 0,void 0,function(){var e,r,i,o,s,h,u,l,c,p,d,f,y,g;return m(this,function(v){switch(v.label){case 0:for(e=t.brushes,r=t.brushImagePath,this.brushes=e.reduce(function(t,e){return t[e.name]=new a(e),t},{}),i=Array.from(new Set([].concat.apply([],Object.values(this.brushes).map(function(t){return[t.settings.brushImage,t.settings.efficiencyBrushImage]})).filter(Boolean))),o=Array.from(new Set(Object.values(this.brushes).map(function(t){return t.settings.grainImage}))),s=[],h=0,u=[[i,this.images.brush],[o,this.images.grain]];h<u.length;h++)for(l=u[h],c=l[0],p=l[1],d=function(t){var e=n.Sprite.fromImage(r+"/"+t+".png");e.renderable=!1,p[t]=e;var i=e.texture.baseTexture;i.hasLoaded?s.push(Promise.resolve(e)):i.isLoading?s.push(new Promise(function(e,r){i.on("loaded",function(t){e(i)}),i.on("error",function(e){r(new Error("Could not load brush from file: "+t+".png"))})})):s.push(Promise.reject(new Error("Failed to load brush from file: "+t+".png")))},f=0,y=c;f<y.length;f++)g=y[f],d(g);return[4,Promise.all(s)];case 1:return v.sent(),this.cursor.updateSize(),[2]}})})},t.prototype.stampStroke=function(t,e){e.draw(t,!1)},t.prototype.disposeContainer=function(t){for(var e=0,r=t.children;e<r.length;e++){r[e].destroy({children:!0,texture:!1,baseTexture:!1})}t.removeChildren()},t.prototype.addStrokeNode=function(t,e,r,i,o,s,a,h,u,c,p,d,f,y){var g=i-(1-h)*i*p.settings.pressureSize;g*=c/90*p.settings.tiltSize*3+1;var v,m=1-(1-h)*p.settings.pressureOpacity;m*=(1-c/90*p.settings.tiltOpacity)*o,v=p.settings.azimuth?u*Math.PI/180-this.sketchPaneContainer.rotation:0-this.sketchPaneContainer.rotation;var C=Math.pow(1-h,1.6)*p.settings.pressureBleed;if(this.efficiencyMode){(k=new n.Sprite(this.images.brush[p.settings.efficiencyBrushImage].texture)).position.set(s,a),k.anchor.set(.5),k.tint=n.utils.rgb2hex([t,e,r]),k.alpha=m,k.scale.set(g/k.width),y.addChild(k)}else{var k=new n.Sprite(this.images.brush[p.settings.brushImage].texture),S=45*Math.PI/180,x=Math.abs(g*Math.sin(S))+Math.abs(g*Math.cos(S)),w=Math.ceil(x);s-=w/2,a-=w/2,k.x=Math.floor(s),k.y=Math.floor(a),k.width=w,k.height=w;var b=s-k.x,M=a-k.y,_=g/k.width,P=[b,M],I=[_,_],O=this.images.grain[p.settings.grainImage];this.offscreenContainer.addChild(O),this.offscreenContainer.getLocalBounds();var L=new l(O);L.uniforms.uRed=t,L.uniforms.uGreen=e,L.uniforms.uBlue=r,L.uniforms.uOpacity=m,L.uniforms.uRotation=v,L.uniforms.uBleed=C,L.uniforms.uGrainScale=p.settings.scale,L.uniforms.uGrainRotation=p.settings.rotation,L.uniforms.u_x_offset=d*p.settings.movement,L.uniforms.u_y_offset=f*p.settings.movement,L.uniforms.u_offset_px=P,L.uniforms.u_node_scale=I,L.padding=1,k.filters=[L],y.addChild(k)}},t.prototype.down=function(t,e){void 0===e&&(e={}),this.pointerDown=!0,this.strokeBegin(t,e),this.app.view.style.cursor="none",this.cursor.renderCursor(t)},t.prototype.move=function(t){this.pointerDown&&this.strokeContinue(t),this.app.view.style.cursor="none",this.cursor.renderCursor(t)},t.prototype.up=function(t){this.pointerDown&&this.strokeEnd(t),this.app.view.style.cursor="none",this.cursor.renderCursor(t)},t.prototype.strokeBegin=function(t,e){this.strokeState={isErasing:!!e.erase,layerIndices:e.erase?e.erase:[this.layers.currentIndex],points:[],path:new i.Path,lastStaticIndex:0,lastSpacing:void 0,grainOffset:this.brush.settings.randomOffset?{x:Math.floor(100*Math.random()),y:Math.floor(100*Math.random())}:{x:0,y:0},size:this.brushSize,color:this.brushColor,opacity:this.brushOpacity},this.onStrokeBefore&&this.onStrokeBefore(this.strokeState),this.addPointerEventAsPoint(t),this.strokeState.isErasing?this.liveStrokeContainer.parent&&this.liveStrokeContainer.parent.removeChild(this.liveStrokeContainer):(this.liveStrokeContainer.alpha=this.getLayerOpacity(this.layers.currentIndex),this.layerContainer.addChild(this.liveStrokeContainer),this.updateLayerDepths()),this.drawStroke()},t.prototype.strokeContinue=function(t){this.addPointerEventAsPoint(t),this.drawStroke()},t.prototype.strokeEnd=function(t){this.addPointerEventAsPoint(t),this.stopDrawing()},t.prototype.stopDrawing=function(){this.drawStroke(!0),this.disposeContainer(this.liveStrokeContainer),this.offscreenContainer.removeChildren(),this.layers.markDirty(this.strokeState.layerIndices),this.strokeState.isErasing&&(this.layerContainer.addChild(this.liveStrokeContainer),this.updateLayerDepths()),this.pointerDown=!1,this.onStrokeAfter&&this.onStrokeAfter(this.strokeState)},t.prototype.getInterpolatedStrokeInput=function(t,e){for(var r=[],i=[],n=0;n<e.segments.length;n++)e.segments[n].location&&i.push(e.segments[n].location.offset);var s=0,a=Math.max(1,this.strokeState.size*(this.efficiencyMode?this.brush.settings.spacing:this.brush.settings.efficiencySpacing));null==this.strokeState.lastSpacing&&(this.strokeState.lastSpacing=a);var h=a-this.strokeState.lastSpacing,u=e.length,l=0,c=u+-(this.strokeState.lastSpacing+u),p=!1;for(0===u&&(h=0,u=a,p=!0),l=h;l<u;l+=a){for(var d=e.getPointAt(l),f=s;f<i.length;f++)i[f]<l&&(s=f);var y=void 0,g=void 0,v=void 0;if(p)y=t[s].pressure,g=t[s].tiltAngle,v=t[s].tilt;else{var m=(l-i[s])/(i[s+1]-i[s]);y=o.lerp(t[s].pressure,t[s+1].pressure,m),g=o.lerp(t[s].tiltAngle,t[s+1].tiltAngle,m),v=o.lerp(t[s].tilt,t[s+1].tilt,m)}r.push([this.strokeState.isErasing?0:(this.strokeState.color>>16&255)/255,this.strokeState.isErasing?0:(this.strokeState.color>>8&255)/255,this.strokeState.isErasing?0:(255&this.strokeState.color)/255,this.strokeState.size,this.strokeState.opacity,d.x,d.y,y,g,v,this.brush,this.strokeState.grainOffset.x,this.strokeState.grainOffset.y]),c=l}return this.strokeState.lastSpacing=u-c,r},t.prototype.addStrokeNodes=function(t,e,r){for(var i=0,n=this.getInterpolatedStrokeInput(t,e);i<n.length;i++){var o=n[i];this.addStrokeNode.apply(this,o.concat([r]))}},t.prototype.localizePoint=function(t){return this.sketchPaneContainer.toLocal(new n.Point(t.x-this.viewClientRect.left,t.y-this.viewClientRect.top),this.app.stage)},t.prototype.addPointerEventAsPoint=function(t){var e=this.localizePoint(t),r="mouse"===t.pointerType?t.pressure>0?.5:0:t.pressure,n="mouse"===t.pointerType?{angle:-90,tilt:37}:o.calcTiltAngle(t.tiltY,t.tiltX);this.strokeState.points.push({x:e.x,y:e.y,pressure:r,tiltAngle:n.angle,tilt:n.tilt}),this.strokeState.lastStaticIndex=Math.max(0,this.strokeState.lastStaticIndex-1),this.strokeState.points=this.strokeState.points.slice(Math.max(0,this.strokeState.lastStaticIndex-1),this.strokeState.points.length),this.strokeState.path=new i.Path(this.strokeState.points),this.strokeState.points.length>1&&this.strokeState.path.smooth({type:"catmull-rom",factor:.5})},t.prototype.drawStroke=function(t){void 0===t&&(t=!1);var e=this.strokeState.points.length;if(t){var r=this.strokeState.lastStaticIndex,n=this.strokeState.points.length-1;return this.addStrokeNodes(this.strokeState.points.slice(r,n+1),new i.Path(this.strokeState.path.segments.slice(r,n+1)),this.strokeContainer),this.strokeState.isErasing?this.updateMask(this.strokeContainer,!0):this.stampStroke(this.strokeContainer,this.layers.getCurrentLayer()),this.disposeContainer(this.strokeContainer),void this.offscreenContainer.removeChildren()}if(e>=3){r=(o=this.strokeState.points.length-1)-2,n=o-1;this.addStrokeNodes(this.strokeState.points.slice(r,n+1),new i.Path(this.strokeState.path.segments.slice(r,n+1)),this.strokeContainer),this.strokeState.isErasing?this.updateMask(this.strokeContainer):this.stampStroke(this.strokeContainer,this.layers.getCurrentLayer()),this.disposeContainer(this.strokeContainer),this.offscreenContainer.removeChildren(),this.strokeState.lastStaticIndex=n}if(e>=2){this.disposeContainer(this.liveStrokeContainer);var o;r=(o=this.strokeState.points.length-1)-1,n=o;if(this.strokeState.isErasing);else{var s=this.strokeState.lastSpacing;this.addStrokeNodes(this.strokeState.points.slice(r,n+1),new i.Path(this.strokeState.path.segments.slice(r,n+1)),this.liveStrokeContainer),this.strokeState.lastSpacing=s}}},t.prototype.updateMask=function(t,e){var r=this;void 0===e&&(e=!1);if(!this.strokeState.layerIndices.map(function(t){return r.layers[t]}).sort(function(t,e){return function(t,e){return e-t}(t.sprite.parent.getChildIndex(t.sprite),e.sprite.parent.getChildIndex(e.sprite))})[0].sprite.mask){this.layerContainer.addChild(this.eraseMask);var i=(new n.Graphics).beginFill(16711680,1).drawRect(0,0,this.width,this.height).endFill();this.app.renderer.render(i,this.eraseMask.texture,!0);for(var o=0,s=this.strokeState.layerIndices;o<s.length;o++){var a=s[o];this.layers[a].sprite.mask=this.eraseMask}}if(this.app.renderer.render(t,this.eraseMask.texture,!1),e)for(var h=0,u=this.strokeState.layerIndices;h<u.length;h++){a=u[h];var l=this.layers[a];l.sprite.addChild(this.eraseMask),l.sprite.mask=this.eraseMask,this.layers[a].rewrite(),l.sprite.mask=null,l.sprite.removeChild(this.eraseMask)}},t.prototype.replaceLayer=function(t,e,r){void 0===r&&(r=!0),t=null==t?this.layers.getCurrentIndex():t,this.layers[t].replace(e,r)},t.prototype.getLayerCanvas=function(t){return console.warn("SketchPane#getLayerCanvas is deprecated. Please fix the caller to use a different method."),console.trace(),t=null==t?this.layers.getCurrentIndex():t,this.app.renderer.plugins.extract.canvas(this.layers[t].sprite.texture)},t.prototype.exportLayer=function(t,e){return void 0===e&&(e="base64"),t=null==t?this.layers.getCurrentIndex():t,this.layers[t].export(e)},t.prototype.extractThumbnailPixels=function(t,e,r){return void 0===r&&(r=[]),this.layers.extractThumbnailPixels(t,e,r)},t.prototype.clearLayer=function(t){t=null==t?this.layers.getCurrentIndex():t,this.layers[t].clear()},t.prototype.getNumLayers=function(){return this.layers.length-1},t.prototype.getCurrentLayerIndex=function(t){return this.layers.getCurrentIndex()},t.prototype.setCurrentLayerIndex=function(t){this.pointerDown||this.layers.setCurrentIndex(t)},Object.defineProperty(t.prototype,"brushSize",{get:function(){return this._brushSize},set:function(t){this._brushSize=t,this.cursor.updateSize()},enumerable:!0,configurable:!0}),t.prototype.isDrawing=function(){return this.pointerDown},t.prototype.getLayerOpacity=function(t){return this.layers[t].getOpacity()},t.prototype.setLayerOpacity=function(t,e){this.layers[t].setOpacity(e)},t.prototype.markLayersDirty=function(t){return this.layers.markDirty(t)},t.prototype.clearLayerDirty=function(t){this.layers[t].setDirty(!1)},t.prototype.getLayerDirty=function(t){return this.layers[t].getDirty()},t.prototype.isLayerEmpty=function(t){return this.layers[t].isEmpty()},t.prototype.getDOMElement=function(){return this.app.view},t.prototype.flipLayers=function(t){void 0===t&&(t=!1),this.layers.flip(t)},t}();r.d(e,"SketchPane",function(){return C}),r.d(e,"util",function(){return o})},91:function(t,e){t.exports="precision highp float;\n\n// brush texture\nuniform sampler2D uSampler;\n// grain texture\nuniform sampler2D u_grainTex;\n\n// color\nuniform float uRed;\nuniform float uGreen;\nuniform float uBlue;\n\n// node\nuniform float uOpacity;\nuniform float uRotation;\n\n// grain\nuniform float uBleed;\nuniform float uGrainRotation;\nuniform float uGrainScale;\nuniform float u_x_offset;\nuniform float u_y_offset;\n\n// brush\nuniform vec2 u_offset_px;\nuniform vec2 u_node_scale;\n\n// from vert shader\nvarying vec2 vTextureCoord;\nvarying vec2 vFilterCoord;\n\n// from PIXI\nuniform vec4 filterArea;\nuniform vec2 dimensions;\nuniform vec4 filterClamp;\nuniform mat3 filterMatrix;\n\nvec2 rotate (vec2 v, float a) {\n\tfloat s = sin(a);\n\tfloat c = cos(a);\n\tmat2 m = mat2(c, -s, s, c);\n\treturn m * v;\n}\n\nvec2 scale (vec2 v, vec2 _scale) {\n\tmat2 m = mat2(_scale.x, 0.0, 0.0, _scale.y);\n\treturn m * v;\n}\n\nvec2 mapCoord (vec2 coord) {\n  coord *= filterArea.xy;\n  return coord;\n}\n\nvec2 unmapCoord (vec2 coord) {\n  coord /= filterArea.xy;\n  return coord;\n}\n\nvoid main(void) {\n  // user's intended brush color\n  vec3 color = vec3(uRed, uGreen, uBlue);\n\n\t//\n\t//\n\t// brush\n\t//\n  vec2 coord = mapCoord(vTextureCoord) / dimensions;\n\n\t// translate by the subpixel\n\tcoord -= u_offset_px / dimensions;\n\n  // move space from the center to the vec2(0.0)\n  coord -= vec2(0.5);\n\n  // rotate the space\n  coord = rotate(coord, uRotation);\n\n  // move it back to the original place\n  coord += vec2(0.5);\n\n\t// scale\n\tcoord -= 0.5;\n  coord *= 1.0 / u_node_scale;\n\tcoord += 0.5;\n\n\tcoord = unmapCoord(coord * dimensions);\n\n\t//\n\t//\n\t// grain\n\t//\n\tvec2 fcoord = vFilterCoord;\n\tfcoord -= vec2(u_x_offset, u_y_offset);\n\tfcoord /= uGrainScale;\n\tvec4 grainSample = texture2D(u_grainTex, fract(fcoord));\n\n\t//\n\t//\n\t// set gl_FragColor\n\t//\n\t// clamp (via https://github.com/pixijs/pixi.js/wiki/v4-Creating-Filters#bleeding-problem)\n\tif (coord == clamp(coord, filterClamp.xy, filterClamp.zw)) {\n\t\t// read a sample from the texture\n\t  vec4 brushSample = texture2D(uSampler, coord);\n\t  // tint\n\t  gl_FragColor = vec4(color, 1.);\n\t\tgl_FragColor *= ((brushSample.r * grainSample.r * (1.0+uBleed))- uBleed ) * (1.0+ uBleed) * uOpacity;\n\n\t\t// gl_FragColor = grain;\n\t} else {\n\t\t// don't draw\n\t\tgl_FragColor = vec4(0.);\n\t}\n}\n"}});