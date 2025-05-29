export const darkPopartFragment = `
precision highp float;

varying vec2 texCoords;
uniform sampler2D textureSampler;

void main () {
  gl_FragColor = vec4((texture2D(textureSampler, texCoords).rgb - 0.45) * 43.0 + 0.1, 1.0);
}
`
