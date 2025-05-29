export const grayscaleFragment = `
precision highp float;
  
varying vec2 texCoords;
uniform sampler2D textureSampler;

uniform int filterID;

void main() {
  vec4 color = texture2D(textureSampler, texCoords);

  vec3 greyScale = vec3(.299, .587, .114);
  gl_FragColor = vec4( vec3(dot( color.rgb, greyScale)), color.a);
}
`
