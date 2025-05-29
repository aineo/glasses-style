import { WebGLDrawer } from '../webgl-drawer'

export async function drawMultipleCanvas(
  drawer: WebGLDrawer,
  video: HTMLVideoElement,
  canvasAR: HTMLCanvasElement
) {
  const imageVideo = await createImageBitmap(video)
  drawer.draw(imageVideo)
  imageVideo.close()

  const imageAR = await createImageBitmap(canvasAR)
  drawer.draw(imageAR)
  imageAR.close()
}
