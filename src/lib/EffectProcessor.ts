import REGL from 'regl';
import createQuad from 'primitive-quad';

interface Uniforms {
    renderSize: REGL.Vec2,
    inputSize: REGL.Vec2,
    inputImage: REGL.Texture;
}

interface Attributes {
    position: number[];
}

interface Props {
    renderSize: REGL.Vec2,
    inputSize: REGL.Vec2,
    inputImage: REGL.Texture;
}

const defaultPixelShader = `
    precision mediump float;
    uniform sampler2D inputImage;
    varying vec2 uv;
    varying vec2 lookup;

    void main () {
        gl_FragColor = texture2D(inputImage, lookup);
    }`;

export default class EffectProcessor {
    private regl: REGL.Regl;
    private draw: REGL.DrawCommand;
    private source: HTMLVideoElement;
    private target: HTMLCanvasElement;

    constructor(source: HTMLVideoElement, target: HTMLCanvasElement) {
        this.source = source;
        this.target = target;

        const quad = createQuad();
        this.regl = REGL(target);
        this.draw = this.regl<Uniforms, Attributes, Props>({
            frag: defaultPixelShader,

            vert: `
            precision mediump float;
            attribute vec3 position;
            uniform vec2 renderSize;
            uniform vec2 inputSize;
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
                lookup.x = (1.0 - uv.x) * relativeWidth + (1.0 - relativeWidth) / 2.0;
                lookup.y = (1.0 - uv.y) * relativeHeight + (1.0 - relativeHeight) / 2.0;
            }`,

            attributes: {
                position: quad.positions
            },
            elements: quad.cells,

            uniforms: {
                renderSize: this.regl.prop<Uniforms, 'renderSize'>('renderSize'),
                inputSize: this.regl.prop<Uniforms, 'inputSize'>('inputSize'),
                inputImage: this.regl.prop<Uniforms, 'inputImage'>('inputImage')
            }
        });
    }

    private tick: REGL.Cancellable | undefined;
    start() {
        if (this.tick) this.tick.cancel;

        const cameraTexture = this.regl.texture(); // construct texture
        this.tick = this.regl.frame(() => {
            this.regl.clear({
                color: [0, 0, 0, 1]
            });
            this.draw({
                // todo: canvasElement is null sometimes?
                renderSize: [this.target.width, this.target.height],
                inputSize: [this.source.videoWidth, this.source.videoHeight],
                inputImage: cameraTexture({
                    data: this.source,
                    mag: 'linear',
                    min: 'linear'
                }) // update and use texture
            });
        });
    }
}