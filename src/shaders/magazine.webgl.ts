export const magazineFragment = `
precision highp float;

varying vec2 texCoords;
uniform sampler2D textureSampler;

#define PI 3.1415
#define PI_4 PI / 4.0

const float sin_phi = sin(PI_4);
const float cos_phi = cos(PI_4);
const float fade = 1150.0;
const float width = 1280.0;
const float height = 720.0;
const float scale = min(0.8, 400.0 / height);

const vec2 textureSize = vec2(width, height);
const vec2 center = vec2(width / 2.0, height / 2.0);

void main() {
  vec3 canvas = (texture2D(textureSampler, texCoords).rgb - 0.5) * 1.3 + 0.6;
  float grayscale = (canvas.r * 0.3 + canvas.g * 0.59 + canvas.b * 0.11) * 16.0 - 8.0;

  vec2 point = texCoords * textureSize - center;
  point = vec2(
      point.x * cos_phi - point.y * sin_phi,
      point.x * sin_phi + point.y * cos_phi
    ) * scale;

  gl_FragColor = vec4(clamp(vec3(grayscale + sin(point.x) * sin(point.y) * 3.0), 0.0, 1.0), 1.0);
}
`
