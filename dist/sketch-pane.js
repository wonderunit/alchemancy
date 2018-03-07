var SketchPane=function(e){var t={};function i(s){if(t[s])return t[s].exports;var r=t[s]={i:s,l:!1,exports:{}};return e[s].call(r.exports,r,r.exports,i),r.l=!0,r.exports}return i.m=e,i.c=t,i.d=function(e,t,s){i.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:s})},i.r=function(e){Object.defineProperty(e,"__esModule",{value:!0})},i.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="/dist",i(i.s=5)}([function(e,t){e.exports=class{constructor(){const e=new PIXI.loaders.Loader;e.add("brushnode.frag","./src/js/sketch-pane/brush/brushnode.frag"),e.load((e,t)=>{this.shader=new PIXI.Filter(null,t["brushnode.frag"].data,{uRed:{type:"1f",value:.5},uGreen:{type:"1f",value:.5},uBlue:{type:"1f",value:.5},uOpacity:{type:"1f",value:1},uRotation:{type:"1f",value:0},uBleed:{type:"1f",value:0},uGrainRotation:{type:"1f",value:0},uGrainScale:{type:"1f",value:1},u_size:{type:"1f",value:100},u_texture_size:{type:"1f",value:100},u_x_offset:{type:"1f",value:0},u_y_offset:{type:"1f",value:0},u_grain_zoom:{type:"1f",value:1},u_brushTex:{type:"sampler2D",value:""},u_grainTex:{type:"sampler2D",value:""}}),this.shader.padding=0,this.shader.blendMode=PIXI.BLEND_MODES.NORMAL})}}},function(e,t){const i={name:"default",blendMode:"normal",sizeLimitMax:1,sizeLimitMin:0,opacityMax:1,opacityMin:0,spacing:0,brushImage:"brushcharcoal",brushRotation:0,brushImageInvert:!1,grainImage:"graingrid",grainRotation:0,grainImageInvert:!1,movement:1,scale:1,zoom:0,rotation:0,randomOffset:!0,azimuth:!0,pressureOpacity:1,pressureSize:1,pressureBleed:0,tiltAngle:0,tiltOpacity:1,tiltGradiation:0,tiltSize:1,orientToScreen:!0};e.exports=class{constructor(e){this.settings=Object.assign({},i,e)}}},function(e,t,i){const s=i(1),r=new PIXI.loaders.Loader;let n={};[{name:"default",descriptiveName:"Default Brush"},{name:"pencil",descriptiveName:"Pencil",brushImage:"brushmediumoval",grainImage:"grainpaper4",pressureOpacity:.7,pressureSize:.8,scale:.8,tiltOpacity:.3,tiltSize:1,movement:1,pressureBleed:1,spacing:.05},{name:"brushpen",descriptiveName:"Brush Pen Bobby",brushImage:"teardrop",grainImage:"hardwood",pressureOpacity:.3,scale:.5,movement:.7,sizecale:.6},{name:"pen",descriptiveName:"Pen",brushImage:"brushhard",grainImage:"grainpaper2",pressureOpacity:.5,pressureSize:.8,sizecale:.8,pressureBleed:2,tiltSize:3.8,tiltOpacity:1,movement:.9,spacing:.05},{name:"copic",descriptiveName:"Copic",brushImage:"brushmediumovalhallow",grainImage:"grainpaper2",pressureOpacity:.2,pressureSize:.9,tiltSize:1,tiltOpacity:1,movement:.5},{name:"charcoal",descriptiveName:"Charcoal",brushImage:"brushcharcoal",grainImage:"graincanvas",pressureOpacity:.4,pressureSize:.8,sizecale:1,tiltOpacity:.4,tiltSize:1,spacing:.05,pressureBleed:.5},{name:"watercolor",descriptiveName:"Watercolor",brushImage:"brushwatercolor",grainImage:"grainwatercolor1",pressureOpacity:1,pressureSize:1,sizecale:1,tiltOpacity:1,tiltSize:1,spacing:.05,pressureBleed:.5},{name:"clouds",descriptiveName:"Clouds",brushImage:"brushclouds",grainImage:"grainclouds",pressureOpacity:1,pressureSize:1,sizecale:1,tiltOpacity:1,tiltSize:1,spacing:.1,movement:1},{name:"slate",descriptiveName:"Clouds",brushImage:"flatbrush",grainImage:"grainslate",pressureOpacity:1,pressureSize:1,sizecale:1,tiltOpacity:1,tiltSize:1,movement:1,spacing:.05}].forEach(e=>{n[e.name]=new s(e),r.resources[n[e.name].settings.brushImage]||r.add(n[e.name].settings.brushImage,"src/img/brush/"+n[e.name].settings.brushImage+".png"),r.resources[n[e.name].settings.grainImage]||r.add(n[e.name].settings.grainImage,"src/img/brush/"+n[e.name].settings.grainImage+".png")}),r.load((e,t)=>{});let a={brushes:n,brushResources:r};e.exports=a},function(e,t){e.exports=class{static rotatePoint(e,t,i,s,r){return{x:Math.cos(r)*(e-i)-Math.sin(r)*(t-s)+i,y:Math.sin(r)*(e-i)+Math.cos(r)*(t-s)+s}}static nearestPow2(e){return e--,e|=e>>1,e|=e>>2,e|=e>>4,e|=e>>8,e|=e>>16,e++}static calcTiltAngle(e,t){return{angle:Math.atan2(e,t)*(180/Math.PI),tilt:Math.max(Math.abs(e),Math.abs(t))}}static lerp(e,t,i){return e+(t-e)*(i=(i=i<0?0:i)>1?1:i)}}},function(e,t,i){const s=i(3),r=i(2),n=i(0);e.exports=class{constructor(){this.setup(),this.setSize(1200,900),this.newLayer(),this.newLayer(),this.newLayer(),console.log("sup"),setTimeout(()=>{console.log("hi")},1e3)}saveLayer(){console.log("SAVE!")}setup(){paper.setup(),PIXI.settings.FILTER_RESOLUTION=1,PIXI.settings.PRECISION_FRAGMENT=PIXI.PRECISION.HIGH,PIXI.settings.MIPMAP_TEXTURES=!0,PIXI.settings.WRAP_MODE=PIXI.WRAP_MODES.REPEAT,PIXI.utils.skipHello(),this.app=new PIXI.Application({width:window.innerWidth,height:window.innerHeight,antialias:!1}),this.app.renderer.roundPixels=!1,document.body.appendChild(this.app.view),this.brushes=r,this.brush=this.brushes.brushes.default,this.brushColor={r:0,g:0,b:0},this.brushSize=49,this.brushOpacity=.41,this.brush=this.brushes.brushes.pen,this.brushSize=4,this.brushOpacity=.9,this.brushColor={r:0,g:0,b:0},this.brushNodeFilter=new n,this.sketchpaneContainer=new PIXI.Container,this.layerContainer=new PIXI.Container,this.sketchpaneContainer.addChild(this.layerContainer),this.strokeContainer=new PIXI.Container,this.layerContainer.addChild(this.strokeContainer),this.liveStrokeContainer=new PIXI.Container,this.sketchpaneContainer.addChild(this.liveStrokeContainer),this.app.stage.addChild(this.sketchpaneContainer),this.sketchpaneContainer.scale.set(1),this.counter=0,this.brushRotation=0,this.strokeInput=[],this.strokePath=void 0,this.app.ticker.add(e=>{this.spin?(this.sketchpaneContainer.rotation+=.01,this.sketchpaneContainer.scale.set(1*Math.sin(this.counter/30)+1.8)):(this.sketchpaneContainer.rotation=0,this.sketchpaneContainer.scale.set(1)),this.counter++})}setSize(e,t,i){this.width=e,this.height=t;let s=new PIXI.Graphics;s.beginFill(0,1),s.drawRect(0,0,this.width,this.height),s.endFill(),this.layerContainer.mask=s,this.sketchpaneContainer.addChild(s),i||(i="white");let r=tinycolor(i);r.toHex();let n=new PIXI.Graphics;n.beginFill("0x"+r.toHex()),n.drawRect(0,0,this.width,this.height),n.endFill(),this.layerContainer.addChild(n),this.centerContainer()}newLayer(){this.layerContainer.position.set(0,0);let e=PIXI.RenderTexture.create(this.width,this.height),t=new PIXI.Sprite(e);this.layerContainer.addChild(t),this.centerContainer(),this.layer=1,this.layerContainer.setChildIndex(this.strokeContainer,this.layer+1)}loadLayers(e){this.layers=e,e.forEach(e=>{PIXI.loader.add(e,"./src/img/layers/"+e+".png")}),PIXI.loader.load((e,t)=>{console.log(t),this.width=1e3,this.height=800;let i=new PIXI.Graphics;i.beginFill(0,1),i.drawRect(0,0,this.width,this.height),i.endFill(),this.layerContainer.mask=i,this.sketchpaneContainer.addChild(i),this.layers.forEach((e,i)=>{this.layerContainer.position.set(0,0);let s=PIXI.RenderTexture.create(this.width,this.height),r=new PIXI.Sprite(s);this.app.renderer.render(new PIXI.Sprite(t[e].texture),s),this.layerContainer.addChild(r)}),this.centerContainer(),this.layer=1,this.layerContainer.setChildIndex(this.strokeContainer,this.layer+1)})}centerContainer(){this.sketchpaneContainer.pivot.set(this.width/2,this.height/2),this.sketchpaneContainer.position.set(this.app.renderer.width/2,this.app.renderer.height/2)}stampStroke(e,t){this.app.renderer.render(e,t,!1)}addStrokeNode(e,t,i,n,a,h,o,l,u,d,p,c,g,m){let I=new PIXI.Sprite(PIXI.Texture.WHITE),y=n-(1-l)*n*p.settings.pressureSize;y*=Math.pow(d/90,2)*p.settings.tiltSize*3+1;let b,f=1-(1-l)*p.settings.pressureOpacity;f*=(1-d/90*p.settings.tiltOpacity)*a,b=p.settings.azimuth?u*Math.PI/180-this.sketchpaneContainer.rotation:0-this.sketchpaneContainer.rotation,I.width=y,I.height=y,I.position=new PIXI.Point(0,0),this.brushNodeFilter.shader.uniforms.uRed=e,this.brushNodeFilter.shader.uniforms.uGreen=t,this.brushNodeFilter.shader.uniforms.uBlue=i,this.brushNodeFilter.shader.uniforms.uOpacity=f,this.brushNodeFilter.shader.uniforms.uRotation=-b,this.brushNodeFilter.shader.uniforms.uBleed=Math.pow(1-l,1.6)*p.settings.pressureBleed,this.brushNodeFilter.shader.uniforms.uGrainRotation=p.settings.rotation,this.brushNodeFilter.shader.uniforms.uGrainScale=p.settings.scale,this.brushNodeFilter.shader.uniforms.u_texture_size=s.nearestPow2(y),this.brushNodeFilter.shader.uniforms.u_size=y,this.brushNodeFilter.shader.uniforms.u_x_offset=(h+c)*p.settings.movement,this.brushNodeFilter.shader.uniforms.u_y_offset=(o+g)*p.settings.movement,this.brushNodeFilter.shader.uniforms.u_brushTex=r.brushResources.resources[p.settings.brushImage].texture,this.brushNodeFilter.shader.uniforms.u_grainTex=r.brushResources.resources[p.settings.grainImage].texture,I.filters=[this.brushNodeFilter.shader];let C=PIXI.RenderTexture.create(y,y);this.app.renderer.render(I,C),I.filters=null;let w=new PIXI.Sprite(C);w.position=new PIXI.Point(h,o),w.rotation=b,w.anchor.set(.5),m.addChild(w)}resize(){this.app.renderer.resize(window.innerWidth,window.innerHeight),this.sketchpaneContainer.position.set(this.app.renderer.width/2,this.app.renderer.height/2)}pointerdown(e){this.pointerDown=!0,this.strokeInput=[],this.strokePath=new paper.Path,this.lastStaticIndex=0,e.target===this.app.view&&(this.addMouseEventAsPoint(e),this.renderLive())}pointerup(e){if(e.target===this.app.view&&this.pointerDown){this.addMouseEventAsPoint(e),this.renderLive(!0),this.stampStroke(this.strokeContainer,this.layerContainer.children[this.layer].texture);for(let e of this.strokeContainer.children)e.destroy({children:!0,texture:!0,baseTexture:!0});this.strokeContainer.removeChildren();for(let e of this.liveStrokeContainer.children)e.destroy({children:!0,texture:!0,baseTexture:!0});this.liveStrokeContainer.removeChildren();for(let e of this.strokeContainer.children)e.destroy({children:!0,texture:!0,baseTexture:!0});this.strokeContainer.removeChildren()}this.pointerDown=!1}getInterpolatedStrokeInput(e,t){let i=[],r=[];for(let e=0;e<t.segments.length;e++)t.segments[e].location&&r.push(t.segments[e].location.offset);let n=0,a=Math.max(1,this.brushSize*this.brush.settings.spacing),h={x:0,y:0};this.brush.settings.randomOffset&&(h.x=Math.floor(100*Math.random()),h.y=Math.floor(100*Math.random()));for(let l=0;l<t.length;l+=a){let a=t.getPointAt(l);for(var o=n;o<r.length;o++)r[o]<l&&(n=o);let u=(l-r[n])/(r[n+1]-r[n]),d=s.lerp(e[n].pressure,e[n+1].pressure,u),p=s.lerp(e[n].tiltAngle,e[n+1].tiltAngle,u),c=s.lerp(e[n].tilt,e[n+1].tilt,u);i.push([this.brushColor.r,this.brushColor.g,this.brushColor.b,this.brushSize,this.brushOpacity,a.x,a.y,d,p,c,this.brush,h.x,h.y])}return i}renderStroke(e,t,i){let s=this.getInterpolatedStrokeInput(e,t);for(let e of s)this.addStrokeNode(...e,i)}addMouseEventAsPoint(e){let t=e.pressure,i=(e.x-this.sketchpaneContainer.x)/this.sketchpaneContainer.scale.x+this.width/2,r=(e.y-this.sketchpaneContainer.y)/this.sketchpaneContainer.scale.y+this.height/2,n=s.rotatePoint(i,r,this.width/2,this.height/2,-this.sketchpaneContainer.rotation),a=s.calcTiltAngle(e.tiltX,e.tiltY);this.strokeInput.push({x:n.x,y:n.y,pressure:t,tiltAngle:a.angle,tilt:a.tilt}),this.strokePath.add([i,r]),this.strokePath.smooth({type:"catmull-rom",factor:.5})}pointermove(e){this.pointerDown&&(this.addMouseEventAsPoint(e),this.renderLive())}renderLive(e=!1){let t=this.lastStaticIndex,i=this.strokeInput.length-1;for(let e of this.liveStrokeContainer.children)e.destroy({children:!0,texture:!0,baseTexture:!0});if(this.liveStrokeContainer.removeChildren(),console.log("   add @",this.strokeInput.length-1),e)return i+1-t<=3&&console.warn("fewer than 4, not drawn"),this.renderStroke(this.strokeInput.slice(t,i),new paper.Path(this.strokePath.segments.slice(t,i)),this.strokeContainer),void(this.lastStaticIndex=i);if(i+1-t>=8){let e=i-4;this.renderStroke(this.strokeInput.slice(t,e+1),new paper.Path(this.strokePath.segments.slice(t,e+1)),this.strokeContainer),console.log("static @","[",t,"...",e,"]","len:",this.strokeInput.slice(t,e+1).length),this.lastStaticIndex=e,t=e}i+1-t>=4&&(console.log("  live @","[",t,"...",i,"]","len:",this.strokeInput.slice(t,i+1).length),this.renderStroke(this.strokeInput.slice(t,i+1),new paper.Path(this.strokePath.segments.slice(t,i+1)),this.liveStrokeContainer))}setLayer(e){this.layer=e,this.layerContainer.setChildIndex(this.strokeContainer,this.layer+1)}clearLayer(e){e||(e=this.layer),this.app.renderer.render(this.strokeContainer,this.layerContainer.children[e].texture,!0)}}},function(e,t,i){const s=i(4);e.exports=s}]);