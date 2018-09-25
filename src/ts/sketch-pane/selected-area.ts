import * as paper from 'paper'

export default class SelectedArea {
	cutSprite: any;
	target: any;
	outlineSprite: any;
  sketchPane: any
  areaPath?: paper.Path | paper.CompoundPath

  constructor (options: any) {
    this.sketchPane = options.sketchPane
  }

  set (areaPath : paper.Path) {
    this.areaPath = areaPath
  }

  unset () {
    this.areaPath = null
  }

	children () : Array<paper.Path> {
		return this.areaPath.children
			? this.areaPath.children as Array<paper.Path>
			: [this.areaPath] as Array<paper.Path>
	}

  asPolygons (translate : boolean = true) : Array<PIXI.Polygon> {
    let offset = translate
			? [-this.areaPath.bounds.x, -this.areaPath.bounds.y]
			: [0, 0]

		let result = []
		for (let child of this.children()) {
			result.push(
				new PIXI.Polygon(
		      child.segments.map(
		        segment => new PIXI.Point(
		          segment.point.x + offset[0],
		          segment.point.y + offset[1]
		        )
		      )
		    )
			)
		}
		return result
  }

  asMaskSprite (invert : boolean = false) {
    // delete ALL cached canvas textures to ensure canvas is re-rendered
    PIXI.utils.clearTextureCache()

    let polygons

    let canvas: HTMLCanvasElement = document.createElement('canvas')

    let ctx = canvas.getContext('2d')
    ctx.globalAlpha = 1.0

    if (invert) {
      canvas.width = this.sketchPane.width
      canvas.height = this.sketchPane.height

      // white on red
      ctx.fillStyle = '#f00'
      ctx.rect(0, 0, canvas.width, canvas.height)
      ctx.fill()

      ctx.globalCompositeOperation = 'destination-out'
      ctx.fillStyle = '#fff'

      polygons = this.asPolygons(false)
    } else {
      canvas.width = this.areaPath.bounds.width
      canvas.height = this.areaPath.bounds.height

      // red on transparent
      ctx.fillStyle = '#f00'

      polygons = this.asPolygons(true)
    }

		for (let polygon of polygons) {
	    ctx.beginPath()
	    ctx.moveTo(polygon.points[0], polygon.points[1])
	    for (let i = 2; i < polygon.points.length; i += 2) {
	      ctx.lineTo(polygon.points[i], polygon.points[i + 1])
	    }
	    ctx.closePath()
	    ctx.fill()
		}

    return new PIXI.Sprite(PIXI.Texture.fromCanvas(canvas))
  }

  asOutlineSprite () : PIXI.Sprite {
    PIXI.utils.clearTextureCache()

    return new PIXI.Sprite(
      PIXI.Texture.fromCanvas(
        this.asOutlineCanvas()
      )
    )
  }

  // extract transparent sprite from layers
  asSprite (layerIndices? : Array<number>) : PIXI.Sprite {
    let rect = new PIXI.Rectangle(
      this.areaPath.bounds.x,
      this.areaPath.bounds.y,
      this.areaPath.bounds.width,
      this.areaPath.bounds.height
    )

    // create a sprite to hold the artwork with dimensions matching the bounds of the area path
    let sprite = new PIXI.Sprite(
      PIXI.RenderTexture.create(
        this.areaPath.bounds.width,
        this.areaPath.bounds.height
      )
    )

    let mask = this.asMaskSprite()

    for (let i of layerIndices) {
      let layer = this.sketchPane.layers[i]

      let clip = new PIXI.Sprite(new PIXI.Texture(layer.sprite.texture, rect))
      // clip.alpha = layer.getOpacity()

      clip.addChild(mask)
      clip.mask = mask

      this.sketchPane.app.renderer.render(
        clip,
        sprite.texture as PIXI.RenderTexture,
        false
      )

      clip.mask = null
      clip.removeChild(mask)
    }

    return sprite
  }

  asOutlineCanvas () : HTMLCanvasElement {
    let polygons = this.asPolygons(true)

    let canvas: HTMLCanvasElement = document.createElement('canvas')

    let ctx = canvas.getContext('2d')
    ctx.globalAlpha = 1.0

    canvas.width = this.areaPath.bounds.width
    canvas.height = this.areaPath.bounds.height

		for (let polygon of polygons) {
			ctx.save()
	    ctx.lineWidth = 9
	    ctx.strokeStyle = '#fff'
	    ctx.setLineDash([])
	    ctx.beginPath()
	    ctx.moveTo(polygon.points[0], polygon.points[1])
	    for (let i = 2; i < polygon.points.length; i += 2) {
	      ctx.lineTo(polygon.points[i], polygon.points[i + 1])
	    }
	    ctx.closePath()
	    ctx.stroke()

	    ctx.lineWidth = 3
	    ctx.strokeStyle = '#6A4DE7'
	    ctx.setLineDash([5, 15])
	    ctx.beginPath()
	    ctx.moveTo(polygon.points[0], polygon.points[1])
	    for (let i = 2; i < polygon.points.length; i += 2) {
	      ctx.lineTo(polygon.points[i], polygon.points[i + 1])
	    }
	    ctx.closePath()
	    ctx.stroke()
			ctx.restore()
		}

    return canvas
  }

	copy (indices : Array<number>) : Array<PIXI.Sprite> {
		let result = []
		for (let i of indices) {
			let sprite = this.asSprite([i])
			sprite.x = this.target.x
			sprite.y = this.target.y
			result[i] = sprite
		}
		return result
	}

	erase (indices : Array<number>) {
		let inverseMask = this.asMaskSprite(true)

		for (let i of indices) {
      let layer = this.sketchPane.layers[i]
      layer.applyMask(inverseMask)
    }
	}

	paste (indices : Array<number>, sprites : Array<PIXI.Sprite>) {
    let inverseMask = this.asMaskSprite(true)

    for (let i of indices) {
      let layer = this.sketchPane.layers[i]

      layer.sprite.addChild(sprites[i])
      layer.rewrite()
      layer.sprite.removeChild(sprites[i])
    }
	}

	fill (indices : Array<number>, color : number) {
	  let mask = this.asMaskSprite(false)

	  let colorGraphics = new PIXI.Graphics()
	  colorGraphics.beginFill(color)
	  colorGraphics.drawRect(0, 0, mask.width, mask.height)
	  colorGraphics.addChild(mask)
	  colorGraphics.mask = mask

	  for (let i of indices) {
	    let layer = this.sketchPane.layers[i]
	    layer.sprite.addChild(colorGraphics)

	    colorGraphics.x = this.areaPath.bounds.x
	    colorGraphics.y = this.areaPath.bounds.y

	    layer.rewrite()
	    layer.sprite.removeChild(colorGraphics)
	  }
	}
}
