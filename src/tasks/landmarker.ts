import { FaceLandmarker } from '@mediapipe/tasks-vision'

import { loadMediapipeModel } from '../utils/helpers/load-mediapipe'
import { Mode } from '../store/main'
import { WebGLDrawer } from '../utils/webgl-drawer'

export class Landmarker {
  model!: FaceLandmarker
  private lastVideoTime: number

  constructor() {
    this.lastVideoTime = -1
  }

  async load(vision: any) {
    this.model = (await loadMediapipeModel(vision, Mode.Glasses)) as FaceLandmarker
  }

  async detect(video: HTMLVideoElement, drawer: WebGLDrawer) {
    const timestamp = performance.now()
    if (!this.shouldSegment(timestamp)) return

    const image = await createImageBitmap(video)

    drawer.draw(image)

    const detections = this.model.detectForVideo(image, timestamp)

    this.lastVideoTime = timestamp

    image.close()

    return detections.faceLandmarks
  }

  private shouldSegment(timestamp: number) {
    return this.model && timestamp !== this.lastVideoTime
  }

  stop() {
    this.model.close()
  }
}
