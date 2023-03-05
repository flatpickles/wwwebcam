precision mediump float;
attribute vec3 position;
uniform vec2 renderSize;
uniform vec2 inputSize;
uniform bool flipX;
varying vec2 uv;
varying vec2 lookup;

void main () {
    // Set render positions
    gl_Position = vec4(position.xyz, 1.0);
    uv = gl_Position.xy * 0.5 + 0.5;

    // Calculate aspect-corrected texture lookup position
    float renderRatio = renderSize.x / renderSize.y;
    float videoRatio = inputSize.x / inputSize.y;
    float relativeWidth = min(1.0, renderRatio / videoRatio);
    float relativeHeight = min(1.0, videoRatio / renderRatio);
    lookup.x = (flipX ? (1.0 - uv.x) : uv.x) * relativeWidth + (1.0 - relativeWidth) / 2.0;
    lookup.y = (1.0 - uv.y) * relativeHeight + (1.0 - relativeHeight) / 2.0;
}
