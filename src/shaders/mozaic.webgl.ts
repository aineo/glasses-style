export const mozaicFragment = `
precision highp float;

varying vec2 texCoords;
uniform sampler2D textureSampler;
  
const float pixelSize = 26.0;
const float width = 1280.0;
const float height = 720.0;

const vec2 textureSize = vec2(width, height);
const vec2 center = vec2(width / 2.0, height / 2.0);

void main() {
  vec4 canvas = texture2D(textureSampler, texCoords);

  vec4 pixels = texture2D(textureSampler, (vec2(ivec2(textureSize * texCoords / pixelSize)) + 0.5 + 1.0 / pixelSize) / textureSize * pixelSize);
  float attention = clamp(distance(textureSize * texCoords, center) / width, 0.0, 1.0);

  canvas = ((1.0 - attention) * canvas + attention * pixels);

  gl_FragColor = vec4((canvas.rgb - 0.5) * 2.0 + 0.75, 1.0);
}
`
