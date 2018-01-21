export default class Util {
  
  static rotatePoint(pointX, pointY, originX, originY, angle) {
    return {
      x: Math.cos(angle) * (pointX-originX) - Math.sin(angle) * (pointY-originY) + originX,
      y: Math.sin(angle) * (pointX-originX) + Math.cos(angle) * (pointY-originY) + originY
    }
  }

  static nearestPow2(v) {
    v--
    v|=v>>1
    v|=v>>2
    v|=v>>4
    v|=v>>8
    v|=v>>16
    return v++
  }

  static calcTiltAngle(tiltX, tiltY) {
    let angle = Math.atan2(tiltX,tiltY) * (180/Math.PI)
    let tilt = Math.max(Math.abs(tiltX), Math.abs(tiltY))
    return ({angle: angle, tilt: tilt})
  }

  static lerp(value1, value2, amount) {
    amount = amount < 0 ? 0 : amount
    amount = amount > 1 ? 1 : amount
    return value1 + (value2 - value1) * amount
  }

}