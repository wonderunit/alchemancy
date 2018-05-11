export default class Util {
  static rotatePoint (pointX: number, pointY: number, originX: number, originY: number, angle: number) {
    return {
      x:
            Math.cos(angle) * (pointX - originX) -
            Math.sin(angle) * (pointY - originY) +
            originX,
      y:
            Math.sin(angle) * (pointX - originX) +
            Math.cos(angle) * (pointY - originY) +
            originY
    }
  }

  static calcTiltAngle (tiltX: number, tiltY: number) {
    let angle = Math.atan2(tiltY, tiltX) * (180 / Math.PI)
    let tilt = Math.max(Math.abs(tiltX), Math.abs(tiltY))
    return { angle: angle, tilt: tilt }
  }

  static lerp (value1: number, value2: number, amount: number) {
    amount = amount < 0 ? 0 : amount
    amount = amount > 1 ? 1 : amount
    return value1 + (value2 - value1) * amount
  }

  // via https://github.com/pixijs/pixi.js/pull/4632/files#diff-e38c1de4b0f48ed1293bccc38b07e6c1R123
  // AKA un-premultiply
  static arrayPostDivide (pixels: any): any {
    for (let i = 0; i < pixels.length; i += 4) {
      const alpha = pixels[i + 3]
      if (alpha) {
        pixels[i] = Math.round(Math.min(pixels[i] * 255.0 / alpha, 255.0))
        pixels[i + 1] = Math.round(Math.min(pixels[i + 1] * 255.0 / alpha, 255.0))
        pixels[i + 2] = Math.round(Math.min(pixels[i + 2] * 255.0 / alpha, 255.0))
      }
    }
  }

  static pixelsToCanvas (pixels: any, width: number, height: number): HTMLCanvasElement {
    let canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    let context = canvas.getContext('2d')
    let canvasData = context.createImageData(width, height)
    canvasData.data.set(pixels)
    context.putImageData(canvasData, 0, 0)
    return canvas
  }

  static dataURLToFileContents (dataURL: string) {
    return dataURL.replace(/^data:image\/\w+;base64,/, '')
  }
}
