import { getWasmFileset } from './utils/helpers/get-wasm-fileset'
import { IGUIParams, LilGUI } from './utils/lil-gui'
import { isMobileDevice } from './utils/helpers/is-mobile-device'
import { Landmarker } from './tasks/landmarker'
import { loadBackground } from './utils/helpers/load-background'
import { mobileScale } from './constants/mobile-scale'
import { Mode } from './store/main'
import { Segmenter } from './tasks/segmenter'
import { StatsVTO } from './utils/stats-vto'
import { Stylizer } from './tasks/stylizer'
import { switchToVto } from './utils/helpers/switch-to-vto'
import { ThreeAR } from './utils/three-ar'
import { videoSize } from './constants/video-size'
import { useVtoStore } from './store/main'
import { WebcamVideo } from './utils/webcam-video'
import { WebGLDrawer } from './utils/webgl-drawer'

type Task = Landmarker | Segmenter | Stylizer

export class GlassesArtVTO {
  mode: Mode

  private video!: HTMLVideoElement
  private videoDrawer!: WebGLDrawer
  private bgDrawer!: WebGLDrawer

  private divContainer: HTMLDivElement
  private divLoading: HTMLDivElement

  private tasks: Array<Task>
  private stylization: boolean

  private stats!: StatsVTO
  private threeAR!: ThreeAR
  private gui!: LilGUI

  constructor() {
    this.mode = useVtoStore.getState().mode

    this.divLoading = <HTMLDivElement>document.getElementById('loading')
    this.divContainer = <HTMLDivElement>document.getElementById('container')

    switch (this.mode) {
      case Mode.All: {
        this.tasks = [new Landmarker(), new Segmenter()]
        break
      }
      case Mode.Selfie: {
        this.tasks = [new Segmenter()]
        break
      }
      // Mode.Glasses by default
      default: {
        this.tasks = [new Landmarker()]
        break
      }
    }

    this.stylization = useVtoStore.getState().stylization
    if (this.stylization) this.tasks.push(new Stylizer())

    this.init()
  }

  async init() {
    this.divLoading.style.visibility = 'visible'
    this.divContainer.style.visibility = 'hidden'

    this.video = await new WebcamVideo().start()

    const wasmFileset = await getWasmFileset()

    if (this.modeAllOnMobile()) {
      this.tasks.map((task: Task) => task.load(wasmFileset))
    } else {
      for (const task of this.tasks) await task.load(wasmFileset)
    }

    await this.start()
  }

  private async start() {
    this.stats = new StatsVTO()

    const scale = isMobileDevice() && window.innerWidth / videoSize.width < 1 ? mobileScale : 1
    const width = this.video.videoWidth * scale
    const height = this.video.videoHeight * scale
    useVtoStore.setState({ videoSize: { width, height } })

    this.videoDrawer = new WebGLDrawer('out_canvas', width, height)

    const guiParams: IGUIParams = { sceneAR: undefined, bgContext: undefined }
    for (const task of this.tasks) {
      if (task instanceof Segmenter) {
        task.initBgCanvas(width, height)
        this.bgDrawer = new WebGLDrawer('bg_canvas', width, height)

        loadBackground(useVtoStore.getState().selectedBackground.url, width, height, task.bgContext)

        guiParams.bgContext = task.bgContext
      } else if (task instanceof Landmarker) {
        this.threeAR = new ThreeAR(width, height)

        guiParams.sceneAR = this.threeAR.sceneAR
      }
    }

    this.gui = new LilGUI(guiParams)

    this.onFrame()
  }

  private onFrame() {
    this.stats.onStats(() => {
      if (this.stylization) {
        useVtoStore.getState().pause ? this.onPause() : this.onResult()
      } else {
        this.onResult()
      }
    })

    window.requestAnimationFrame(() => this.onFrame())
  }

  private async onResult() {
    if (this.video.paused) this.video.play()

    for (const task of this.tasks) {
      if (task instanceof Segmenter) {
        void (await task.detect(this.video, this.videoDrawer, this.bgDrawer, task.bgContext))
      } else if (task instanceof Landmarker) {
        const keypoints = await task.detect(this.video, this.videoDrawer)
        if (keypoints) {
          this.threeAR.draw(keypoints)
          this.threeAR.render()
          this.gui.tweenUpdate()
        }
      }
    }

    if (useVtoStore.getState().videoFiltering) {
      this.gui.mulGlDrawer = this.videoDrawer
    }

    if (this.allTasksLoaded()) switchToVto(this.divLoading, this.divContainer)
  }

  private async onPause() {
    this.video.pause()
    for (const task of this.tasks) {
      if (task instanceof Stylizer) {
        void (await task.detect())
      }
    }
  }

  private modeAllOnMobile() {
    return this.mode === Mode.All && isMobileDevice()
  }

  private allTasksLoaded() {
    return this.tasks.every((task: Task) => task.model !== undefined)
  }
}
