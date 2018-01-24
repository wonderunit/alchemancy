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
uniform float u_x_offset;
uniform float u_y_offset;
uniform float u_grain_zoom;
uniform float u_alpha;
varying vec2 vTextureCoord;
varying vec2 vFilterCoord; 

vec2 rotate(in vec2 coord, in float angle) {
  float sin_factor = sin(angle);
  float cos_factor = cos(angle);
  coord = (coord - 0.0) * mat2(cos_factor, sin_factor, -sin_factor, cos_factor);
  coord += 0.0;
  return (coord);
}

void main(){
  vec3 color = vec3(uRed, uGreen, uBlue);
  vec4 brushSample = texture2D(u_brushTex, vTextureCoord/(u_size/u_texture_size));
  float grain_scale = 1024.00 * uGrainScale;
  vec2 texture_coord = (vTextureCoord * u_texture_size / grain_scale) - (vec2(u_size, u_size) / grain_scale / 2.0)  ;
  vec2 texture_offset = -(vec2(u_x_offset, u_y_offset)/grain_scale);
  vec4 grainSample = texture2D(u_grainTex, rotate((texture_coord)- rotate(texture_offset,-uRotation),uRotation+uGrainRotation) );
  gl_FragColor = vec4(color,1);
  gl_FragColor *= ((brushSample.r * grainSample.r * (1.0+uBleed))- uBleed ) * (1.0+ uBleed) * uOpacity;
  //gl_FragColor *= brushSample.r * ((grainSample.r * (1.0+uBleed))- uBleed ) * (1.0+ uBleed) * uOpacity;

}