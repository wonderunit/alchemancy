module.exports = class Util {
  static rotatePoint (pointX, pointY, originX, originY, angle) {
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

  static calcTiltAngle (tiltX, tiltY) {
    let angle = Math.atan2(tiltX, tiltY) * (180 / Math.PI)
    let tilt = Math.max(Math.abs(tiltX), Math.abs(tiltY))
    return { angle: angle, tilt: tilt }
  }

  static lerp (value1, value2, amount) {
    amount = amount < 0 ? 0 : amount
    amount = amount > 1 ? 1 : amount
    return value1 + (value2 - value1) * amount
  }

  // via https://github.com/pixijs/pixi.js/pull/4632/files#diff-e38c1de4b0f48ed1293bccc38b07e6c1R123
  // AKA un-premultiply
  static arrayPostDivide (pixels) {
    for (let i = 0; i < pixels.length; i += 4) {
      const alpha = pixels[i + 3]
      if (alpha) {
        pixels[i] = Math.round(Math.min(pixels[i] * 255.0 / alpha, 255.0))
        pixels[i + 1] = Math.round(Math.min(pixels[i + 1] * 255.0 / alpha, 255.0))
        pixels[i + 2] = Math.round(Math.min(pixels[i + 2] * 255.0 / alpha, 255.0))
      }
    }
  }
}
