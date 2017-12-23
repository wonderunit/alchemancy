precision mediump float;

uniform float uRed;
uniform float uGreen;
uniform float uBlue;

uniform float u_size;
uniform float u_texture_size;
uniform float u_x_offset;
uniform float u_y_offset;
uniform float u_grain_zoom;
uniform float u_alpha;
varying vec2 vTextureCoord;
uniform sampler2D u_brushTex;
uniform sampler2D u_grainTex;
varying vec2 vFilterCoord; 

vec2 rotate(in vec2 coord, in float angle) {
  float sin_factor = sin(angle);
  float cos_factor = cos(angle);
  coord = (coord - 0.5) * mat2(cos_factor, sin_factor, -sin_factor, cos_factor);
  coord += 0.5;
  return (coord);
}

void main(){
  vec3 color = vec3(uRed, uGreen, uBlue);
  //float alphaMask = texture2D(uSampler, vTextureCoord ).a;

  vec4 c = texture2D(u_brushTex, vTextureCoord/(u_size/u_texture_size));
  //vec4 g = texture2D(u_grainTex, (vTextureCoord*(u_texture_size/(u_size*2.0)))+(vec2(u_x_offset, u_y_offset)/64.0*(u_size/70.0)));
  
  float grain_scale = 1024.00/u_size*4.0;
  float scale = 1.0/u_size;

  //vec4 g = texture2D(u_grainTex, (vTextureCoord/grain_scale)+(vec2(u_x_offset, u_y_offset)/u_texture_size/grain_scale)+vec2(scale,scale));

  float rotation = -(3.14159265358/4.0/4.0*1.0);
  float node_rotation_offset = -(3.14159265358/4.0/4.0*1.0);


//          vec4 g = texture2D(u_grainTex, (vTextureCoord*(u_texture_size/512.0*u_grain_zoom)) - (vec2(u_size, u_size)/1024.0*u_grain_zoom) +  (vec2(u_x_offset, u_y_offset) / 512.0*u_grain_zoom ) );
 // vec4 g = texture2D(u_grainTex, (rotate(vTextureCoord, -(3.14159265358/4.0/4.0*0.0))*(u_texture_size/512.0*u_grain_zoom)) - (vec2(u_size, u_size)/1024.0*u_grain_zoom) +  (rotate(vec2(u_x_offset, u_y_offset), (3.14159265358/4.0/4.0)) / 512.0*u_grain_zoom ) );
 // vec4 g = texture2D(u_grainTex, (rotate(vTextureCoord, -(3.14159265358/4.0/4.0*0.0))*(u_texture_size/512.0*u_grain_zoom)) - (vec2(u_size, u_size)/1024.0*u_grain_zoom) +  (rotate(vec2(u_x_offset, u_y_offset), (3.14159265358/4.0/4.0)) / 512.0*u_grain_zoom ) );
  

 vec2 texture_coord = vTextureCoord*(u_texture_size/512.0*u_grain_zoom);
 vec2 texture_offset = ( vec2(u_size, u_size) / 1024.0 * u_grain_zoom) + (vec2(u_x_offset, u_y_offset) /512.0*u_grain_zoom);


  vec4 g = texture2D(u_grainTex, rotate(texture_coord,rotation+node_rotation_offset) + rotate(texture_offset,rotation));
 




  //gl_FragColor = texture2D(uSampler, vTextureCoord );
  //gl_FragColor = vec4(1.0,1.0,0.0,1.0);
   gl_FragColor = vec4(color,1);
   gl_FragColor *= c.r * g.r * 1.0 * 0.6 + 0.0;
  //gl_FragColor = c;
}