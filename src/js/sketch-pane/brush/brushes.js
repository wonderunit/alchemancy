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
    brushImage: "brushpencil", // Name alias of brush alpha
    grainImage: "grain1", // Name alias of brush grain texture
    pressureOpacity: 1, // % Pressure affects opacity
    scale: 1, // Scale of the grain texture. 0 super tiny, 100 super large

  },
  
  {
    name: "pen", // Name of the brush preset
    descriptiveName: "Pen", // Name of the brush preset
    brushImage: "brushmedium", // Name alias of brush alpha
    grainImage: "grainpaper2", // Name alias of brush grain texture
    pressureOpacity: 0, // % Pressure affects opacity
    pressureSize: .5, // % Pressure affects size
    sizecale: 0.8, // Scale of the grain texture. 0 super tiny, 100 super large

  },

  {
    name: "charcoal", // Name of the brush preset
    descriptiveName: "Charcoal", // Name of the brush preset
    brushImage: "brushcharcoal", // Name alias of brush alpha
    grainImage: "graincanvas", // Name alias of brush grain texture
    pressureOpacity: 0, // % Pressure affects opacity
    pressureSize: .2, // % Pressure affects size
    sizecale: 1, // Scale of the grain texture. 0 super tiny, 100 super large
    tiltOpacity: 0.4, // % opacity altered by the tilt
    tiltSize: 1, // % size altered by the tilt
  },

  {
    name: "watercolor", // Name of the brush preset
    descriptiveName: "Watercolor", // Name of the brush preset
    brushImage: "brushwatercolor", // Name alias of brush alpha
    grainImage: "grainwatercolor1", // Name alias of brush grain texture
    pressureOpacity: 1, // % Pressure affects opacity
    pressureSize: 1, // % Pressure affects size
    sizecale: 1, // Scale of the grain texture. 0 super tiny, 100 super large
    tiltOpacity: 1, // % opacity altered by the tilt
    tiltSize: 1, // % size altered by the tilt
  },

  {
    name: "clouds", // Name of the brush preset
    descriptiveName: "Clouds", // Name of the brush preset
    brushImage: "brushclouds", // Name alias of brush alpha
    grainImage: "grainclouds", // Name alias of brush grain texture
    pressureOpacity: 1, // % Pressure affects opacity
    pressureSize: 1, // % Pressure affects size
    sizecale: 1, // Scale of the grain texture. 0 super tiny, 100 super large
    tiltOpacity: 1, // % opacity altered by the tilt
    tiltSize: 1, // % size altered by the tilt
  },

  {
    name: "slate", // Name of the brush preset
    descriptiveName: "Clouds", // Name of the brush preset
    brushImage: "flatbrush", // Name alias of brush alpha
    grainImage: "grainslate", // Name alias of brush grain texture
    pressureOpacity: 1, // % Pressure affects opacity
    pressureSize: 1, // % Pressure affects size
    sizecale: 1, // Scale of the grain texture. 0 super tiny, 100 super large
    tiltOpacity: 1, // % opacity altered by the tilt
    tiltSize: 1, // % size altered by the tilt
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