import REGL from 'regl';
import createQuad from 'primitive-quad';

interface Uniforms {
    renderSize: REGL.Vec2,
    inputSize: REGL.Vec2,
    inputImage: REGL.Texture,
    flipX: boolean,
}

interface Attributes {
    position: number[],
}

interface Props {
    renderSize: REGL.Vec2,
    inputSize: REGL.Vec2,
    inputImage: REGL.Texture,
    flipX: boolean,
}

const defaultFragShader = `
    precision mediump float;
    uniform sampler2D inputImage;
    varying vec2 uv;
    varying vec2 lookup;

    void main () {
        gl_FragColor = texture2D(inputImage, lookup);
    }`;

export default class EffectProcessor {
    flipX = true;

    private source: HTMLVideoElement;
    private target: HTMLCanvasElement;
    private regl: REGL.Regl;
    private draw: REGL.DrawCommand | undefined;
    private tick: REGL.Cancellable | undefined;
    private nextSaveName: string | null = null;
    private fragShader = defaultFragShader;
    
    constructor(source: HTMLVideoElement, target: HTMLCanvasElement) {
        this.source = source;
        this.target = target;
        this.regl = REGL(target);
    }

    start(fragShader = defaultFragShader) {
        if (this.tick) this.tick.cancel();
        if (!this.draw || fragShader != this.fragShader) this.init(fragShader);

        const cameraTexture = this.regl.texture(); // construct texture
        this.tick = this.regl.frame(() => {
            // Clear the canvas
            this.regl.clear({
                color: [0, 0, 0, 1]
            });

            // Draw the next frame
            if (!this.draw) throw new Error('Draw function not yet defined.');
            this.draw({
                // todo: canvasElement is null sometimes?
                renderSize: [this.target.width, this.target.height],
                inputSize: [this.source.videoWidth, this.source.videoHeight],
                inputImage: cameraTexture({ // todo: invalid texture shape when flipping
                    data: this.source,
                    mag: 'linear',
                    min: 'linear'
                }), // update and use texture
                flipX: this.flipX
            });

            // Save the next frame (if needed)
            if (this.nextSaveName) {
                this.saveFrame(this.nextSaveName);
                this.nextSaveName = null;
            }
        });
    }

    saveNextFrame(filename: string) {
        // saveFrame can only be called immediately after drawing a frame; called within update loop
        // https://webglfundamentals.org/webgl/lessons/webgl-tips.html
        this.nextSaveName = filename;
    }

    private init(fragShader = defaultFragShader) {
        this.fragShader = fragShader;
        const quad = createQuad();
        this.draw = this.regl<Uniforms, Attributes, Props>({
            frag: fragShader,

            vert: `
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
            }`,

            attributes: {
                position: quad.positions
            },
            elements: quad.cells,

            uniforms: {
                renderSize: this.regl.prop<Uniforms, 'renderSize'>('renderSize'),
                inputSize: this.regl.prop<Uniforms, 'inputSize'>('inputSize'),
                inputImage: this.regl.prop<Uniforms, 'inputImage'>('inputImage'),
                flipX: this.regl.prop<Uniforms, 'flipX'>('flipX'),
            }
        });
    }

    private saveFrame(filename: string) {
        this.target.toBlob((blob) => {
            if (!blob) throw new Error('Image could not be exported.');
    
            // Configure a link to download the blob
            const link = document.createElement('a');
            link.style.visibility = 'hidden';
            link.target = '_blank';
            link.download = filename;
            link.href = window.URL.createObjectURL(blob);
            document.body.appendChild(link);

            // Remove link when clicked
            link.onclick = () => {
                link.onclick = null;
                setTimeout(() => {
                    window.URL.revokeObjectURL(link.href);
                    if (link.parentElement) link.parentElement.removeChild(link);
                    link.removeAttribute('href');
                });
            };

            // Click the link to force the download
            link.click();
        });
    }
}
