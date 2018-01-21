import SketchPane from './sketch-pane/sketch-pane.js'

const sketchPane = new SketchPane()

window.sketchPane = sketchPane

let stats = new Stats()
stats.showPanel(0)
document.body.appendChild(stats.dom)

window.addEventListener("resize", function(e) {
  sketchPane.resize()
})

window.addEventListener("pointerdown", function(e) {
  sketchPane.pointerdown(e)
})

window.addEventListener("pointerup", function(e) {
  sketchPane.pointerup(e)
})

window.addEventListener("pointermove", function(e) {
  sketchPane.pointermove(e)
})

window.addEventListener("keydown", function(e) {
  // console.log(e)
  switch (e.key) {
    case "1":
      sketchPane.color = {r: Math.random(),g: Math.random(),b: Math.random()}
      break
    case "2":
      sketchPane.size = 10
      break
    case "3":
      sketchPane.size = Math.random()*300
      break
    case "4":
      sketchPane.opacity = Math.random()*0.8+0.2
      break
    case "5":
      sketchPane.opacity = Math.random()*0.8+0.2
      break
    case "6":
      sketchPane.brush = sketchPane.brushes.brushes.pen
      break
    case "7":
      sketchPane.brush = sketchPane.brushes.brushes.pencil
      break
  }
})

document.getElementById('l-1').addEventListener("click", function(e) {
  sketchPane.setLayer(1)
})

document.getElementById('l-2').addEventListener("click", function(e) {
  sketchPane.setLayer(2)
})

document.getElementById('l-3').addEventListener("click", function(e) {
  sketchPane.setLayer(3)
})

document.getElementById('b-1').addEventListener("click", function(e) {
  sketchPane.brush = sketchPane.brushes.brushes.pencil
})

document.getElementById('b-2').addEventListener("click", function(e) {
  sketchPane.brush = sketchPane.brushes.brushes.pen
})

document.getElementById('b-3').addEventListener("click", function(e) {
  sketchPane.brush = sketchPane.brushes.brushes.charcoal
})

document.getElementById('b-4').addEventListener("click", function(e) {
  sketchPane.brush = sketchPane.brushes.brushes.watercolor
})

document.getElementById('b-5').addEventListener("click", function(e) {
  sketchPane.brush = sketchPane.brushes.brushes.clouds
})

document.getElementById('b-6').addEventListener("click", function(e) {
  sketchPane.brush = sketchPane.brushes.brushes.slate
})

document.getElementById('c-1').addEventListener("click", function(e) {
  let val = Math.random()*0.1
  sketchPane.brushColor = {r: val,g: val,b: val}
})

document.getElementById('c-2').addEventListener("click", function(e) {
  let val = Math.random()*.4+.9
  let val2 = Math.random()*.2+.4

  sketchPane.brushColor = {r: val,g: val2,b: val2}
})

document.getElementById('c-3').addEventListener("click", function(e) {
  let val = Math.random()*.4+.4
  let val2 = Math.random()*.4+.2

  sketchPane.brushColor = {r: val2,g: val2,b: val}
})

document.getElementById('c-4').addEventListener("click", function(e) {
  let val = Math.random()*.4+.4
  let val2 = Math.random()*.4+.2
  sketchPane.brushColor = {r: val2,g: val,b: val2}
})

document.getElementById('c-5').addEventListener("click", function(e) {
  let val = Math.random()*.4+.9
  let val2 = Math.random()*.2+.2
  sketchPane.brushColor = {r: val,g: val,b: val2}
})

document.getElementById('c-6').addEventListener("click", function(e) {
  let val = Math.random()*.4+.6
  let val2 = Math.random()*.4+.2
  sketchPane.brushColor = {r: val,g: val/2,b: val2/4}
})

document.getElementById('c-7').addEventListener("click", function(e) {
  let val = Math.random()*.4+.6
  let val2 = Math.random()*.4+.2
  sketchPane.brushColor = {r: 1,g: 1,b: 1}
})

document.getElementById('s-1').addEventListener("click", function(e) {
  sketchPane.brushSize = 6
})

document.getElementById('s-2').addEventListener("click", function(e) {
  sketchPane.brushSize = 20
})

document.getElementById('s-3').addEventListener("click", function(e) {
  sketchPane.brushSize = 40
})

document.getElementById('s-4').addEventListener("click", function(e) {
  sketchPane.brushSize = 100
})

document.getElementById('o-1').addEventListener("click", function(e) {
  sketchPane.brushOpacity = 0.1
})

document.getElementById('o-2').addEventListener("click", function(e) {
  sketchPane.brushOpacity = .3
})

document.getElementById('o-3').addEventListener("click", function(e) {
  sketchPane.brushOpacity = .5
})

document.getElementById('o-4').addEventListener("click", function(e) {
  sketchPane.brushOpacity = .8
})

document.getElementById('o-5').addEventListener("click", function(e) {
  sketchPane.brushOpacity = 1
})

document.getElementById('clear').addEventListener("click", function(e) {
  sketchPane.clearLayer()
})

document.getElementById('spin').addEventListener("click", function(e) {
  sketchPane.spin = !sketchPane.spin
})


function animate() {
  stats.begin()
  stats.end()
  requestAnimationFrame(animate)
}

requestAnimationFrame(animate)