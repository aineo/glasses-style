export const sketchTinyFragment = `
precision highp float;
  
varying vec2 texCoords;
uniform sampler2D textureSampler;

#define S0 40.0
#define S1 15.1
#define S2 42.0
#define S3 2.0
#define S4 4.0

const vec2 textureSize = vec2(1280.0, 760.0);

void main() {
  vec2 scale = (textureSize.x / 750.0) / textureSize;

  vec4 p0 = texture2D(textureSampler, texCoords);

  vec4 p1 = texture2D(textureSampler, texCoords + vec2(-S3, -S3) * scale);
  vec4 p2 = texture2D(textureSampler, texCoords + vec2(S3, -S3) * scale);
  vec4 p3 = texture2D(textureSampler, texCoords + vec2(S3, S3) * scale);
  vec4 p4 = texture2D(textureSampler, texCoords + vec2(-S3, S3) * scale);

  vec4 p5 = texture2D(textureSampler, texCoords + vec2(-S4, -S4) * scale);
  vec4 p6 = texture2D(textureSampler, texCoords + vec2(S4, -S4) * scale);
  vec4 p7 = texture2D(textureSampler, texCoords + vec2(S4, S4) * scale);
  vec4 p8 = texture2D(textureSampler, texCoords + vec2(-S4, S4) * scale);

  vec4 m = (
      p0 * S2 +
      (p1 + p2 + p3 + p4) * S0 +
      (p5 + p6 + p7 + p8) * S1
    ) / ((S0 + S1) * 4.0 + S2);

  p0 /= m;

  float chColor = p0.r * 0.3 + p0.g * 0.59 + p0.b * 0.11;
  gl_FragColor = vec4(chColor, chColor, chColor, 1.0);
}
`
