export default class WebCam {
    target: HTMLVideoElement;

    constructor(target: HTMLVideoElement) {
        this.target = target;
        if (!navigator.mediaDevices.getUserMedia) {
            throw new Error('Media devices unavailable.')
        }
    }

    async start(facingMode = 'user') {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: { facingMode: facingMode }
        });
        this.target.srcObject = stream;
        return await new Promise((resolve, reject) => {
            this.target.onloadeddata = resolve;
            this.target.onerror = reject;
        });
    }
}
