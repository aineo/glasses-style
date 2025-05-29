export const retroFragment = `
precision highp float;

varying vec2 texCoords;
uniform sampler2D textureSampler;

const float rotate = 1.0;
const vec3 offset = vec3(0.0, 0.2, 0.5);
const vec3 fuzz = vec3(0.98, 0.8, 0.44);
void main () {
  vec3 c = texture2D(textureSampler, texCoords).rgb;
  c.r = texture2D(textureSampler, vec2(texCoords.x + 0.0034, texCoords.y)).r;
  c = min(c * fuzz * 1.38, fuzz);
  c += offset * (1.0 - c);

  gl_FragColor = vec4(c, 1.0);
}
`
