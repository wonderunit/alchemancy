precision mediump float;

uniform sampler2D u_brushTex;
uniform sampler2D u_grainTex;

uniform float uRed;
uniform float uGreen;
uniform float uBlue;

uniform float uOpacity;

uniform float uRotation;

uniform float uBleed;

uniform float uGrainRotation;
uniform float uGrainScale;

uniform float u_size;
uniform float u_texture_size;
uniform float u_x_offset; // TODO could we use filterArea.zw ?
uniform float u_y_offset;
uniform float u_grain_zoom;
uniform float u_alpha;
uniform vec2 u_offset_px;

varying vec2 vTextureCoord;
varying vec2 vFilterCoord;  // ??

// from PIXI
uniform vec4 filterArea;
uniform vec2 dimensions;

uniform sampler2D uSampler; // the actual brush texture
uniform sampler2D filterSampler; // ???

// via https://thebookofshaders.com/08/
mat2 rotate2d (float _angle) {
    return mat2(cos(_angle), -sin(_angle),
                sin(_angle), cos(_angle));
}

void main(void) {
  // user's intended brush color
  vec3 color = vec3(uRed, uGreen, uBlue);

  // actual pixel coordinates (in pixels) for secondary textures
  // vec2 pixel = vTextureCoord * filterArea.xy;

  // actual pixel coordinates (in pixels) for primary texture
  vec2 pixel = vTextureCoord * dimensions;

  vec2 uv = pixel - u_offset_px; // subtract (read from higher in the texture) to shift down

  vec2 st = uv / dimensions;

  // move space from the center to the vec2(0.0)
  st -= vec2(0.5);
  // rotate the space
  st = rotate2d( uRotation ) * st;
  // move it back to the original place
  st += vec2(0.5);

  // read a sample from the texture
  vec4 brushSample = texture2D(uSampler, st);

  // tint
  gl_FragColor = vec4(color, 1.) * brushSample.r * uOpacity;
}
