precision mediump float;
uniform sampler2D inputImage;
varying vec2 uv;
varying vec2 lookup;

void main () {
    vec3 W = vec3(0.2125, 0.7154, 0.0721);
    vec4 inputColor = texture2D(inputImage, lookup);
    float luminance = dot(inputColor.rgb, W);
    gl_FragColor = vec4(vec3(luminance), 1.0);
}
