const defaultBrushSettings = {
  
  // GENERAL
  name: "default", // Name of the brush preset
  blendMode: "normal", // Blend mode of the stroke (not node) on the layer
  sizeLimitMax: 1, // UI limit for size
  sizeLimitMin: 0,
  opacityMax: 1, // UI limit for opacity
  opacityMin: 0,

  // TEXTURES
  brushImage: "brushcharcoal", // Name alias of brush alpha
  brushRotation: 0, // rotation of texture (0,90,180,270)
  brushImageInvert: false, // invert texture
  grainImage: "graingrid", // Name alias of brush grain texture
  grainRotation: 0,
  grainImageInvert: false,

  // GRAIN
  movement: 1, // % the grain is offset as the brush moves. 0 static. 100 rolling. 100 is like paper
  scale: 1, // Scale of the grain texture. 0 super tiny, 100 super large
  zoom: 0, // % Scale of the grain texture by the brush size.
  rotation: 0, // % Rotation grain rotation is multiplied by rotation

  // STYLUS
  azimuth: true, 
  pressureOpacity: 1, // % Pressure affects opacity
  pressureSize: 1, // % Pressure affects size
  tiltAngle: 0, // % the title angle affects the below params 
  tiltOpacity: 1, // % opacity altered by the tilt
  tiltGradiation: 0, // % opacity is gradiated by the tilt
  tiltSize: 1, // % size altered by the tilt

  orientToScreen: true, // orient the brush shape to the rotation of the screen

}

export default class Brush {

  constructor (settings) {
    this.settings = Object.assign({}, defaultBrushSettings, settings)
  }

}