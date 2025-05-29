export const sketchThickFragment = `
precision highp float;

varying vec2 texCoords;
uniform sampler2D textureSampler;

const float width = 1280.0;
const float height = 720.0;

float luma(vec4 color) {
  return dot(color.rgb, vec3(0.299, 0.587, 0.114));
}

void main() {
  vec2 center = vec2(width / 2.0, height / 2.0);
  vec2 uv = texCoords.xy;
    
  float scale = 1.0;
  float radius = 0.5;
  vec2 d = uv - center;
  float r = length(d) / 1000.0;
  float a = atan(d.y, d.x) + scale * (radius - r) / radius;
  
  vec2 uvt = center + r * vec2(cos(a), sin(a));
  vec2 uv2 = vec2(texCoords.x / width, texCoords.y / height);
  
  float c = (0.75 + 0.25 * sin(uvt.x * 1000.0));
  vec4 color = texture2D(textureSampler, texCoords);
  float l = luma(color);
  float f = smoothstep(0.5 * c, c, l);
	f = smoothstep(0., 0.5, f);
    
	gl_FragColor = vec4(vec3(f), 0.5);
}
`
