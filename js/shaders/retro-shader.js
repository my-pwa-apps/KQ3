AFRAME.registerShader('retro', {
  schema: {
    src: {type: 'map'},
    color: {type: 'color', default: '#FFF'},
    colorCycles: {default: 1.0}
  },

  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,

  fragmentShader: `
    varying vec2 vUv;
    uniform sampler2D src;
    uniform vec3 color;
    
    vec3 kq3_palette[16] = vec3[](
      vec3(0.0, 0.0, 0.0),      // Black
      vec3(0.0, 0.0, 0.67),     // Blue
      vec3(0.0, 0.67, 0.0),     // Green
      vec3(0.0, 0.67, 0.67),    // Cyan
      vec3(0.67, 0.0, 0.0),     // Red
      vec3(0.67, 0.0, 0.67),    // Magenta
      vec3(0.67, 0.33, 0.0),    // Brown
      vec3(0.67, 0.67, 0.67),   // Light Gray
      vec3(0.33, 0.33, 0.33),   // Dark Gray
      vec3(0.33, 0.33, 1.0),    // Light Blue
      vec3(0.33, 1.0, 0.33),    // Light Green
      vec3(0.33, 1.0, 1.0),     // Light Cyan
      vec3(1.0, 0.33, 0.33),    // Light Red
      vec3(1.0, 0.33, 1.0),     // Light Magenta
      vec3(1.0, 1.0, 0.33),     // Yellow
      vec3(1.0, 1.0, 1.0)       // White
    );

    vec3 findClosestEGAColor(vec3 color) {
      vec3 closest = kq3_palette[0];
      float minDist = distance(color, kq3_palette[0]);
      
      for(int i = 1; i < 16; i++) {
        float dist = distance(color, kq3_palette[i]);
        if(dist < minDist) {
          minDist = dist;
          closest = kq3_palette[i];
        }
      }
      return closest;
    }

    void main() {
      vec2 pixelatedUV = floor(vUv * 64.0) / 64.0;
      vec4 texel = texture2D(src, pixelatedUV);
      vec3 egaColor = findClosestEGAColor(texel.rgb);
      gl_FragColor = vec4(egaColor, texel.a);
    }
  `
});
