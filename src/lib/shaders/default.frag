precision mediump float;
uniform sampler2D inputImage;
varying vec2 uv;
varying vec2 lookup;

void main () {
    gl_FragColor = texture2D(inputImage, lookup);
}
