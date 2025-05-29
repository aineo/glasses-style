export const sepiaFragment = `
precision highp float;
  
varying vec2 texCoords;
uniform sampler2D textureSampler;

void main() {
  vec4 color = texture2D(textureSampler, texCoords);

  vec4 outputColor;
  outputColor.rgb = color.rgb * mat3(0.393, 0.769, 0.189,
                                     0.349, 0.686, 0.168,    
                                     0.272, 0.534, 0.131);

  gl_FragColor = vec4(outputColor.rgb, color.a);
}
`
