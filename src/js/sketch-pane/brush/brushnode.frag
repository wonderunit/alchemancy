precision highp float;

// brush texture
uniform sampler2D uSampler;
// grain texture
uniform sampler2D u_grainTex;

// color
uniform float uRed;
uniform float uGreen;
uniform float uBlue;

// node
uniform float uOpacity;
uniform float uRotation;

// grain
uniform float uBleed;
uniform float uGrainRotation;
uniform float uGrainScale;
uniform float u_x_offset;
uniform float u_y_offset;

// brush
uniform vec2 u_offset_px;
uniform vec2 u_node_scale;

// from vert shader
varying vec2 vTextureCoord;
varying vec2 vFilterCoord;

// from PIXI
uniform vec4 filterArea;
uniform vec2 dimensions;
uniform vec4 filterClamp;
uniform mat3 filterMatrix;

vec2 rotate (vec2 v, float a) {
	float s = sin(a);
	float c = cos(a);
	mat2 m = mat2(c, -s, s, c);
	return m * v;
}

vec2 scale (vec2 v, vec2 _scale) {
	mat2 m = mat2(_scale.x, 0.0, 0.0, _scale.y);
	return m * v;
}

vec2 mapCoord (vec2 coord) {
  coord *= filterArea.xy;
  return coord;
}

vec2 unmapCoord (vec2 coord) {
  coord /= filterArea.xy;
  return coord;
}

void main(void) {
  // user's intended brush color
  vec3 color = vec3(uRed, uGreen, uBlue);

	//
	//
	// brush
	//
  vec2 coord = mapCoord(vTextureCoord) / dimensions;

	// translate by the subpixel
	coord -= u_offset_px / dimensions;

  // move space from the center to the vec2(0.0)
  coord -= vec2(0.5);

  // rotate the space
  coord = rotate(coord, uRotation);

  // move it back to the original place
  coord += vec2(0.5);

	// scale
	coord -= 0.5;
  coord *= 1.0 / u_node_scale;
	coord += 0.5;

	coord = unmapCoord(coord * dimensions);

	//
	//
	// grain
	//
	float grain_scale = 1024.00 * uGrainScale;

	vec2 fcoord = vFilterCoord;
	fcoord -= (vec2(u_x_offset, u_y_offset) / grain_scale);
	vec4 grainSample = texture2D(u_grainTex, fract(fcoord));

	//
	//
	// set gl_FragColor
	//
	// clamp (via https://github.com/pixijs/pixi.js/wiki/v4-Creating-Filters#bleeding-problem)
	if (coord == clamp(coord, filterClamp.xy, filterClamp.zw)) {
		// read a sample from the texture
	  vec4 brushSample = texture2D(uSampler, coord);
	  // tint
	  gl_FragColor = vec4(color, 1.);
		gl_FragColor *= ((brushSample.r * grainSample.r * (1.0+uBleed))- uBleed ) * (1.0+ uBleed) * uOpacity;

		// gl_FragColor = grain;
	} else {
		// don't draw
		gl_FragColor = vec4(0.);
	}
}
