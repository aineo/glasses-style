import GUI from 'lil-gui'
import { DirectionalLightHelper, Color, MeshStandardMaterial } from 'three'

import { animateVisibility, ITweenVisibility } from './helpers/animate-visibility'
import { backgroundImages } from '../constants/background-images'
import { convertToGuiOptions } from './helpers/convert-to-gui-options'
import { glassesModels } from '../constants/glasses-models'
import { glassesName } from '../constants/glasses-name'
import { IBackgroundImage } from '../constants/background-images'
import { IGlassesModel } from '../constants/glasses-models'
import { ISceneAR } from './three-ar'
import { IVideoFilter, videoFilters } from '../constants/video-filters'
import { lightConfig } from '../constants/light-config'
import { loadBackground } from './helpers/load-background'
import { loadGlasses } from './helpers/load-glasses'
import { Mode, useVtoStore } from '../store/main'
import { WebGLDrawer } from './webgl-drawer'

export interface IGUIParams {
  sceneAR?: ISceneAR
  bgContext?: CanvasRenderingContext2D
  glDrawer?: WebGLDrawer
}

interface IMaskStyle {
  color: Array<number>
  opacity: number
}

interface IGUIOptions {
  videoFilter: string
  glassesVisible: boolean
  glasses: string
  enableMask: boolean
  mask: {
    roughness: number
    metalness: number
    intensity: number
  }
  light: {
    showHelper: boolean
    color: number
    intensity: number
    position: {
      x: number
      y: number
      z: number
    }
  }
  background: string
  hair: IMaskStyle
  clothes: IMaskStyle
  stylize: () => void
}

export interface IGuiTween {
  [key: string]: ITweenVisibility | null
}

const backgroundOptions = convertToGuiOptions(backgroundImages)
const glassesOptions = convertToGuiOptions(glassesModels)
const videoFilterOptions = convertToGuiOptions(videoFilters)

export class LilGUI {
  private mode: Mode

  private gui: GUI
  private sceneAR: ISceneAR | undefined
  private bgContext: CanvasRenderingContext2D | undefined
  private options: IGUIOptions
  private glDrawer: WebGLDrawer | undefined

  private lightHelper!: DirectionalLightHelper
  private tween!: IGuiTween

  constructor(params?: IGUIParams) {
    this.mode = useVtoStore.getState().mode

    this.gui = new GUI()

    if (this.mode === Mode.Selfie || this.mode === Mode.All) {
      this.bgContext = params?.bgContext
    }

    if (this.mode === Mode.Glasses || this.mode === Mode.All) {
      this.sceneAR = params?.sceneAR
    }

    this.options = {
      videoFilter: Object.keys(videoFilterOptions)[0],
      glassesVisible: true,
      glasses: Object.keys(glassesOptions)[0],
      enableMask: false,
      mask: {
        roughness: 0.08,
        metalness: 0.98,
        intensity: 1.24
      },
      light: lightConfig,
      background: Object.keys(backgroundOptions)[0],
      hair: {
        color: useVtoStore.getState().hairColor,
        opacity: useVtoStore.getState().hairOpacity
      },
      clothes: {
        color: useVtoStore.getState().clothesColor,
        opacity: useVtoStore.getState().clothesOpacity
      },
      stylize: () => useVtoStore.setState({ pause: true })
    }

    if (this.sceneAR?.light) this.lightHelper = new DirectionalLightHelper(this.sceneAR.light, 20)

    this.tween = {
      glassesIn: null,
      glassesOut: null,
      maskIn: null,
      maskOut: null
    }

    this.setup()
  }

  tweenUpdate() {
    for (const key of Object.keys(this.tween)) {
      if (this.tween[key]) this.tween[key].update()
    }
  }

  private setup() {
    this.gui.domElement.style.right = '0px'

    if (this.mode === Mode.Glasses && useVtoStore.getState().videoFiltering) {
      this.gui
        .add(this.options, 'videoFilter', videoFilterOptions)
        .name('Video filter')
        .onChange((value: IVideoFilter) => {
          this.glDrawer?.switchFilter(value.shader)

          useVtoStore.setState({ videoFilter: value })
        })
    }

    if (this.mode === Mode.Selfie || this.mode === Mode.All) {
      this.setupForSegmenter()
    }

    if (this.mode === Mode.Glasses || this.mode === Mode.All) {
      this.setupForLandmarker(this.sceneAR)
    }

    if (useVtoStore.getState().stylization) {
      this.gui.add(this.options, 'stylize').name('Stylize')
    }
  }

  private setupForLandmarker(sceneAR?: ISceneAR) {
    if (!sceneAR) return

    this.gui
      .add(this.options, 'glassesVisible')
      .name('Glasses visible')
      .onChange((value: boolean) => {
        const glasses = sceneAR.group.getObjectByName(glassesName)
        if (glasses) {
          const tween = animateVisibility(glasses, value)
          this.tween[value ? 'glassesIn' : 'glassesOut'] = tween
        }

        useVtoStore.setState({ glassesVisible: value })
      })
    this.gui
      .add(this.options, 'glasses', glassesOptions)
      .name('Selected glasses')
      .onChange((value: IGlassesModel) => {
        loadGlasses(sceneAR.loader, value.url, sceneAR.group, sceneAR.cubeMap)

        useVtoStore.setState({ selectedGlasses: value })
      })

    this.gui
      .add(this.options, 'enableMask')
      .name('Mask')
      .onChange((value: boolean) => {
        const mask = sceneAR.facemesh.surface
        if (mask) {
          const action = value
            ? { start: () => sceneAR.scene.add(mask) }
            : { complete: () => sceneAR.scene.remove(mask) }

          this.tween[value ? 'maskIn' : 'maskOut'] = animateVisibility(mask, value, action)
        }

        useVtoStore.setState({ enableMask: value })
      })

    const maskSettingsFolder = this.gui.addFolder('Mask settings').close()
    maskSettingsFolder
      .add(this.options.mask, 'roughness', 0, 1, 0.01)
      .name('Roughness')
      .onChange((value: number) => {
        const material = sceneAR.facemesh.surface.material
        ;(material as MeshStandardMaterial).roughness = value
      })
    maskSettingsFolder
      .add(this.options.mask, 'metalness', 0, 1.3, 0.01)
      .name('Metalness')
      .onChange((value: number) => {
        const material = sceneAR.facemesh.surface.material
        ;(material as MeshStandardMaterial).metalness = value
      })
    maskSettingsFolder
      .add(this.options.mask, 'intensity', 0, 3, 0.02)
      .name('Intensity')
      .onChange((value: number) => {
        const material = sceneAR.facemesh.surface.material
        ;(material as MeshStandardMaterial).envMapIntensity = value
      })

    const lightFolder = this.gui.addFolder('Light').close()
    lightFolder
      .add(this.options.light, 'showHelper')
      .name('Show helper')
      .onChange((value: number) => {
        value ? sceneAR.scene.add(this.lightHelper) : sceneAR.scene.remove(this.lightHelper)
      })

    lightFolder
      .addColor(this.options.light, 'color')
      .name('Color')
      .onChange((value: number) => {
        const light = sceneAR.light
        if (light) light.color = new Color(value)
      })

    lightFolder
      .add(this.options.light, 'intensity', 0, 10, 0.1)
      .name('Intensity')
      .onChange((value: number) => {
        const light = sceneAR.light
        if (light) light.intensity = value
      })
    lightFolder
      .add(this.options.light.position, 'x', -1000, 1000, 1)
      .name('x')
      .onChange((value: number) => {
        const light = sceneAR.light
        if (light) light.position.x = value
      })
    lightFolder
      .add(this.options.light.position, 'y', -1000, 1000, 1)
      .name('y')
      .onChange((value: number) => {
        const light = sceneAR.light
        if (light) light.position.y = value
      })
    lightFolder
      .add(this.options.light.position, 'z', -1000, 1000, 1)
      .name('z')
      .onChange((value: number) => {
        const light = sceneAR.light
        if (light) light.position.z = value
      })
  }

  private setupForSegmenter() {
    this.gui
      .add(this.options, 'background', backgroundOptions)
      .name('Background')
      .onChange((value: IBackgroundImage) => {
        const videoSize = useVtoStore.getState().videoSize
        loadBackground(value.url, videoSize.width, videoSize.height, this.bgContext)

        useVtoStore.setState({ selectedBackground: value })
      })

    const hairFolder = this.gui.addFolder('Hair').open()
    hairFolder
      .addColor(this.options.hair, 'color')
      .name('Color')
      .onFinishChange((value: Array<number>) => {
        useVtoStore.setState({ hairColor: value })
      })
    hairFolder
      .add(this.options.hair, 'opacity', 0, 1, 0.01)
      .name('Opacity')
      .onFinishChange((value: number) => {
        useVtoStore.setState({ hairOpacity: value })
      })

    const clothesFolder = this.gui.addFolder('Clothes').open()
    clothesFolder
      .addColor(this.options.clothes, 'color')
      .name('Color')
      .onFinishChange((value: Array<number>) => {
        useVtoStore.setState({ clothesColor: value })
      })
    clothesFolder
      .add(this.options.clothes, 'opacity', 0, 1, 0.01)
      .name('Opacity')
      .onFinishChange((value: number) => {
        useVtoStore.setState({ clothesOpacity: value })
      })
  }

  set mulGlDrawer(value: WebGLDrawer) {
    this.glDrawer = value
  }
}
