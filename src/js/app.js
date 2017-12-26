import SketchPane from './sketch-pane/sketch-pane.js'

const sketchPane = new SketchPane()

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
  sketchPane.brush = sketchPane.brushes.brushes.pen
})

document.getElementById('b-2').addEventListener("click", function(e) {
  sketchPane.brush = sketchPane.brushes.brushes.pencil
})

document.getElementById('c-1').addEventListener("click", function(e) {
  sketchPane.color = {r: 0,g: 0,b: 0}
})

document.getElementById('c-2').addEventListener("click", function(e) {
  sketchPane.color = {r: 1,g: 0,b: 0}
})

document.getElementById('c-3').addEventListener("click", function(e) {
  sketchPane.color = {r: 0,g: 0,b: 1}
})

document.getElementById('c-4').addEventListener("click", function(e) {
  sketchPane.color = {r: 0,g: 1,b: 0}
})

document.getElementById('s-1').addEventListener("click", function(e) {
  sketchPane.size = 5
})

document.getElementById('s-2').addEventListener("click", function(e) {
  sketchPane.size = 15
})

document.getElementById('s-3').addEventListener("click", function(e) {
  sketchPane.size = 105
})

document.getElementById('s-4').addEventListener("click", function(e) {
  sketchPane.size = 515
})

document.getElementById('o-1').addEventListener("click", function(e) {
  sketchPane.opacity = 0.1
})

document.getElementById('o-2').addEventListener("click", function(e) {
  sketchPane.opacity = .3
})

document.getElementById('o-3').addEventListener("click", function(e) {
  sketchPane.opacity = .5
})

document.getElementById('o-4').addEventListener("click", function(e) {
  sketchPane.opacity = .8
})

document.getElementById('o-5').addEventListener("click", function(e) {
  sketchPane.opacity = 1
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