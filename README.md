# World Wide Webcam

World Wide Webcam is a prototype for a browser-based camera app. It's designed with mobile web in mind, but should work fine in your desktop browser of choice as well. The goal of this app is to explore multimedia limitations in the browser, and as expected, it's a far cry from your native camera. Maybe we'll get there someday!

The biggest limitations I've encountered so far are file handling (can't save to iOS Camera Roll directly), and camera lens access. Maybe someday we'll be able to easily leverage all of the amazing camera technology in our phones from the mobile web, but it seems like we're not quite there yet.

A parallel goal for this project is to create a publishing surface for video processing effects, like those (e.g. [Wobbly](https://editor.isf.video/shaders/624d2c75fa14610014854058)) I've created via ISF. If/when I return to this, I plan to add in a collection of effects I've already built, and use this as a publishing platform for further work (similar to how I use [Sketchbook](https://sketchbook.flatpickles.com/) for generative visual art). For now, the demo features a simple luminance filter that you can turn on/off, but I've designed it so that other shaders can be easily swapped into my frame processing setup.

### Next steps

- Add more video filters (shaders), and make them accessible from a scroll view and URL routes (e.g. wwweb.cam/bw).
- App UI is prototype fidelity; make it prettier!
- Captured image files save to "Files" on iOS; maybe use the web share API to enable an easier Camera Roll option.
- Testing and potential fixes on Android and less common browsers.
- Unit tests, etc.

### Known issues

- "Uncaught Error: (regl) invalid texture shape" while camera is flipping. No adverse side effects, but it's ugly.
- Potentially related to the above: canvasElement is occasionally undefined in draw calls.
- Some unusual canvas resize events (e.g. show dev tools) can warp the canvas aspect ratio.
