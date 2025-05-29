import { FaceStylizer, MPImage } from '@mediapipe/tasks-vision'

import { isMobileDevice } from '../utils/helpers/is-mobile-device'
import { loadMediapipeModel } from '../utils/helpers/load-mediapipe'
import { Mode, useVtoStore } from '../store/main'
import { WebGLDrawer } from '../utils/webgl-drawer'

export class Stylizer {
  inputCanvas: HTMLCanvasElement
  model!: FaceStylizer

  private inProcess: boolean

  constructor() {
    this.inputCanvas = <HTMLCanvasElement>document.createElement('canvas')
    this.inProcess = false
  }

  async load(vision: any) {
    this.model = (await loadMediapipeModel(vision, 'style')) as FaceStylizer
  }

  async detect() {
    if (this.inProcess) return
    this.inProcess = true

    const videoSize = useVtoStore.getState().videoSize
    const width = videoSize.width
    const height = videoSize.height

    this.inputCanvas.width = width
    this.inputCanvas.height = height
    const context = this.inputCanvas.getContext('2d')
    if (!context) throw new Error('Cant get rendering context from canvas')

    const mode = useVtoStore.getState().mode
    const canvasOut = <HTMLCanvasElement>document.getElementById('out_canvas')
    context.save()
    context.drawImage(canvasOut, 0, 0, width, height)
    context.restore()

    if (mode === Mode.All || mode === Mode.Selfie) {
      const canvasBg = <HTMLCanvasElement>document.getElementById('bg_canvas')
      context.save()
      context.drawImage(canvasBg, 0, 0, width, height)
      context.restore()
    }

    if (mode === Mode.All || mode === Mode.Glasses) {
      const canvasAr = <HTMLCanvasElement>document.getElementById('ar_canvas')
      context.save()
      context.drawImage(canvasAr, 0, 0, width, height)
      context.restore()
    }

    const image = await createImageBitmap(this.inputCanvas)

    const result = this.model.stylize(image)

    if (result) this.drawPicture(result, width, height)

    image.close()
    result?.close()

    this.inProcess = false
  }

  private drawPicture(result: MPImage, width: number, height: number) {
    const newTab = window.open('', '_blank')
    if (!newTab) return

    const canvasId = 'art_result'
    const canvasStyle =
      'position: absolute; left: 0px; right: 0px; margin: auto; transform: scaleX(-1);'
    newTab.document.write(`<canvas id=${canvasId} style=${canvasStyle} />`)

    const canvas = isMobileDevice()
      ? new OffscreenCanvas(width, height)
      : <HTMLCanvasElement>newTab.document.getElementById(canvasId)

    const context = canvas.getContext('webgl2')
    if (!context) throw new Error('Cannot create canvas webgl2 context')

    const drawer = new WebGLDrawer(canvasId, width, height, newTab)
    drawer.draw(result.getAsImageBitmap())

    newTab.focus()

    // TODO: pause false only after switching on main tab (by tabs event listener)
    useVtoStore.setState({ pause: false })
  }

  stop() {
    this.model.close()
  }
}
