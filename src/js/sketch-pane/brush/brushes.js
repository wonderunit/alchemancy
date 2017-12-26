import Brush from './brush.js'
const loader = new PIXI.loaders.Loader()


const standardBrushes = [

  {
    name: "default", // Name of the brush preset
    descriptiveName: "Default Brush", // Name of the brush preset
  },

  {
    name: "pencil", // Name of the brush preset
    descriptiveName: "Pencil", // Name of the brush preset
    brushImage: "brush2", // Name alias of brush alpha
    grainImage: "grain1", // Name alias of brush grain texture
    pressureOpacity: 1, // % Pressure affects opacity

  },
  
  {
    name: "pen", // Name of the brush preset
    descriptiveName: "Pen", // Name of the brush preset
    brushImage: "brush3", // Name alias of brush alpha
    grainImage: "grain2", // Name alias of brush grain texture
  },

]


let brushes = {}
//let brushResources = new BrushResources()

standardBrushes.forEach((brush)=> {
  brushes[brush.name] = new Brush(brush)
 // brushResources.load(brushes[brush.name])

  if (!loader.resources[brushes[brush.name].settings.brushImage]){
    loader.add(brushes[brush.name].settings.brushImage, 'src/img/brush/' + brushes[brush.name].settings.brushImage + '.png')
  }
  if (!loader.resources[brushes[brush.name].settings.grainImage]){
    loader.add(brushes[brush.name].settings.grainImage, 'src/img/brush/' + brushes[brush.name].settings.grainImage + '.png')
  }
})

loader.load((loader, resources) => {
})

let value = {brushes: brushes, brushResources: loader}

export default value