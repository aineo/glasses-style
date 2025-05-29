export const xproFragment = `
precision highp float;

varying vec2 texCoords;
uniform sampler2D textureSampler;

#define TWO_PI 6.28319
#define X_PRO 0.15

void main () {
  vec3 c = texture2D(textureSampler, texCoords).rgb;
  c.r -= cos(c.r * TWO_PI) * X_PRO;
  c.g -= sin(c.g * TWO_PI) * X_PRO * 2.;
  c.b += cos(c.b * TWO_PI) * X_PRO;
  gl_FragColor = vec4(c * 1.15, 1.0);
}
`
