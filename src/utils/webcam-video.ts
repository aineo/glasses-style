import { displayError } from './helpers/display-error'
import { videoSize } from '../constants/video-size'

export class WebcamVideo {
  private video: HTMLVideoElement

  constructor() {
    this.video = document.createElement('video')
  }

  async start() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Browser API navigator.mediaDevices.getUserMedia not available')
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          width: videoSize.width,
          height: videoSize.height,
          facingMode: 'user'
        }
      })
      this.video.srcObject = stream

      this.video.setAttribute('autoplay', 'true')
      this.video.setAttribute('playsinline', 'true')
    } catch (error) {
      let message = ''
      if ((error as Error).name === 'OverconstrainedError') {
        message =
          'OverconstrainedError: The constraints could not be satisfied by the available devices'
      } else {
        message = 'NotAllowedError: Permissions have not been granted to use your camera'
      }

      displayError(message)
    }

    return new Promise<HTMLVideoElement>((resolve) => {
      this.video.onloadedmetadata = () => {
        this.video.play()
        resolve(this.video)
      }
    })
  }

  async stop() {
    this.video.pause()
    this.video.srcObject = null
  }
}
