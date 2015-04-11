precision mediump float;

uniform vec3 iResolution;
uniform sampler2D iChannel0;
uniform float iGlobalTime;

vec3 sample(vec2 uv);

//can go down to 10 and still look pretty good
#define ITERATIONS 2
#pragma glslify: blur = require('./', sample=sample, iterations=ITERATIONS)

vec3 sample(vec2 uv) {
  return texture2D(iChannel0, uv).rgb;
}

void main() {
  vec2 uv = vec2(gl_FragCoord.xy / iResolution.xy);
  uv.y = 1.0 - uv.y;

  //animate strength
  float anim = sin(iGlobalTime)/2.0+0.5;
  float strength = 3.0 * anim;

  //vignette blur
  float radius = 1.0 - length(uv - 0.5);
  radius = smoothstep(0.7, 0.0, radius) * strength;
  
  //jitter the noise but not every frame
  float tick = floor(fract(iGlobalTime)*20.0);
  float jitter = mod(tick * 382.0231, 21.321);
  float aspect = iResolution.x / iResolution.y;

  radius = radius / 50.0;
  
  //sample with blur
  // vec3 color = blur(uv, iResolution.xy, radius);
  vec3 color = blur(uv, radius, aspect, jitter);
  gl_FragColor = vec4(color, 1.0);
}