// https://www.shadertoy.com/view/XdjSRw
// Hashed blur
// David Hoskins.
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.

#ifndef TAU
  #define TAU 6.28318530718
#endif


#pragma glslify: random = require('glsl-random')

// Use last part of hash function to generate new random radius and angle...
vec2 mult(inout vec2 r) {
  r = fract(r * vec2(12.9898,78.233));
  return sqrt(r.x + .001) * vec2(sin(r.y * TAU), cos(r.y * TAU));
}

vec3 blur(vec2 uv, float radius, float aspect, float offset) {
  vec2 circle = vec2(radius);
  circle.x *= aspect;
  vec2 rnd = vec2(random(vec2(uv + offset)));

  vec3 acc = vec3(0.0);
  for (int i = 0; i < iterations; i++) {
    acc += sample(uv + circle * mult(rnd)).xyz;
  }
  return acc / float(iterations);
}

// vec3 blur(vec2 uv, vec2 resolution, float radius) {
//   return blur(uv, resolution, radius, 0.0);
// }

#pragma glslify: export(blur)