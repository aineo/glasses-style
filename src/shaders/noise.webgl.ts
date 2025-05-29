export const noiseFragment = `
precision highp float;
  
varying vec2 texCoords;
uniform sampler2D textureSampler;

float randomize(vec2 r) {
  return clamp(fract(sin(dot(r, vec2(13.29, 79.11))) * 435.1), 0.0, 1.0);
}

const float radius = 1280.0 * 0.75;
const vec2 texSize = vec2(1280.0, 760.0);
const vec2 center = vec2(640.0, 380.0);

void main() {
  vec2 p = texCoords;

  vec3 c = (texture2D(textureSampler, p).rgb - 0.5) * 3.0 + 1.5;
  c = vec3(c.r * 0.3 + c.g * 0.3 + c.b * 0.4);
  c -= 0.75 * randomize(vec2(texture2D(textureSampler, p).g, atan(p.x, p.y)));

  gl_FragColor = vec4(clamp((1.0 - distance(p * texSize, center) / radius) * c, 0.0, 1.0), 1.0);
}
`
