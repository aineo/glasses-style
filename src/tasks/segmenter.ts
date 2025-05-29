import { ImageSegmenter, ImageSegmenterResult } from '@mediapipe/tasks-vision'

import { emptyBackground } from '../constants/empty-background'
import { loadMediapipeModel } from '../utils/helpers/load-mediapipe'
import { Mode } from '../store/main'
import { useVtoStore } from '../store/main'
import { WebGLDrawer } from '../utils/webgl-drawer'

export class Segmenter {
  model!: ImageSegmenter

  private mode: Mode

  private everyNthRun: number
  private frameNumber: number
  private lastVideoTime: number

  private _bgContext!: CanvasRenderingContext2D

  constructor() {
    this.mode = useVtoStore.getState().mode

    this.everyNthRun = this.mode === Mode.All ? 2 : 1
    this.frameNumber = -1
    this.lastVideoTime = -1
  }

  async load(vision: any) {
    this.model = (await loadMediapipeModel(vision, Mode.Selfie)) as ImageSegmenter
  }

  async detect(
    video: HTMLVideoElement,
    drawer: WebGLDrawer,
    drawerBg?: WebGLDrawer,
    bgContext?: CanvasRenderingContext2D
  ) {
    this.frameNumber += 1
    const timestamp = performance.now()

    if (!this.shouldSegment(timestamp)) return

    const image = await createImageBitmap(video)
    if (this.mode !== Mode.All) drawer.draw(image)

    const result = this.model.segmentForVideo(drawer.element, timestamp)

    if (drawerBg) this.drawSegmentationMask(drawerBg, result, bgContext)

    this.lastVideoTime = timestamp

    image.close()
    result.close()
  }

  initBgCanvas(width: number, height: number) {
    const canvas = <HTMLCanvasElement>document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    canvas.style.transform = 'scaleX(-1)'

    const context = canvas.getContext('2d')
    if (!context) throw new Error('Cannot create background')

    this._bgContext = context
  }

  private drawSegmentationMask(
    drawer: WebGLDrawer,
    result: ImageSegmenterResult,
    bgContext?: CanvasRenderingContext2D
  ) {
    const context = drawer.context

    const width = context.drawingBufferWidth
    const height = context.drawingBufferHeight
    const pixels = new Uint8ClampedArray(width * height * 4)

    const bgImage = bgContext?.getImageData(0, 0, width, height).data

    const mask = result.categoryMask?.getAsFloat32Array()
    if (!mask) return

    const hairColor = useVtoStore.getState().hairColor
    const hairOpacity = useVtoStore.getState().hairOpacity
    const hairStyle = [...hairColor, hairOpacity].map((channel: number) => channel * 255)

    const clothesColor = useVtoStore.getState().clothesColor
    const clothesOpacity = useVtoStore.getState().clothesOpacity
    const clothesStyle = [...clothesColor, clothesOpacity].map((channel: number) => channel * 255)

    let j = 0
    for (let i = 0; i < mask.length; i++) {
      const maskValue = Math.round(mask[i] * 255.0)
      const emptyBg = emptyBackground

      switch (maskValue) {
        case 0: {
          // Background
          pixels[j] = bgImage ? bgImage[j] : emptyBg[0]
          pixels[j + 1] = bgImage ? bgImage[j + 1] : emptyBg[1]
          pixels[j + 2] = bgImage ? bgImage[j + 2] : emptyBg[2]
          pixels[j + 3] = bgImage ? bgImage[j + 3] : emptyBg[3]
          break
        }

        case 1: {
          // Hair
          pixels[j] = hairStyle[0]
          pixels[j + 1] = hairStyle[1]
          pixels[j + 2] = hairStyle[2]
          pixels[j + 3] = hairStyle[3]
          break
        }

        case 4: {
          // Clothes
          pixels[j] = clothesStyle[0]
          pixels[j + 1] = clothesStyle[1]
          pixels[j + 2] = clothesStyle[2]
          pixels[j + 3] = clothesStyle[3]
          break
        }

        default:
          break
      }

      j += 4
    }

    const uint8Array = new Uint8ClampedArray(pixels.buffer)
    const imageData = new ImageData(uint8Array, width, height)

    drawer.draw(imageData)
  }

  private shouldSegment(timestamp: number) {
    return (
      this.model && timestamp !== this.lastVideoTime && this.frameNumber % this.everyNthRun === 0
    )
  }

  get bgContext() {
    return this._bgContext
  }

  stop() {
    this.model.close()
  }
}
