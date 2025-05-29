export const drawerFragment = `
precision highp float;
  
varying vec2 texCoords;
uniform sampler2D textureSampler;

uniform int filterID;

void main() {
  vec4 color = texture2D(textureSampler, texCoords);    
  gl_FragColor = color;
}
`
