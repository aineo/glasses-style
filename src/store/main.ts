import { createStore } from 'zustand/vanilla'

import { backgroundImages, IBackgroundImage } from '../constants/background-images'
import { clothesConfig } from '../constants/clothes-config'
import { glassesModels } from '../constants/glasses-models'
import { hairConfig } from '../constants/hair-config'
import { IGlassesModel } from '../constants/glasses-models'
import { IVideoFilter, videoFilters } from '../constants/video-filters'
import { videoSize } from '../constants/video-size'

export enum Mode {
  All = 'all',
  Glasses = 'glasses',
  Selfie = 'selfie'
}

type State = {
  clothesColor: Array<number>
  clothesOpacity: number
  glassesScale: number
  glassesVisible: boolean
  enableMask: boolean
  hairColor: Array<number>
  hairOpacity: number
  loadingGlasses: boolean
  mode: Mode
  pause: boolean
  selectedBackground: IBackgroundImage
  selectedGlasses: IGlassesModel
  stylization: boolean
  videoSize: { width: number; height: number }
  videoFilter: IVideoFilter
  videoFiltering: boolean
}

type Action = {
  setClothesColor: (debug: State['clothesColor']) => void
  setClothesOpacity: (debug: State['clothesOpacity']) => void
  setGlassesScale: (glassesScale: State['glassesScale']) => void
  setGlassesVisible: (glassesVisible: State['glassesVisible']) => void
  setEnableMask: (enableMask: State['enableMask']) => void
  setHairColor: (hairColor: State['hairColor']) => void
  setHairOpacity: (hairOpacity: State['hairOpacity']) => void
  setLoadingGlasses: (loadingGlasses: State['loadingGlasses']) => void
  setMode: (mode: State['mode']) => void
  setPause: (pause: State['pause']) => void
  setSelectedBackground: (selectedBackground: State['selectedBackground']) => void
  setSelectedGlasses: (selectedGlasses: State['selectedGlasses']) => void
  setStylization: (stylization: State['stylization']) => void
  setVideoSize: (videoSize: State['videoSize']) => void
  setVideoFilter: (videoFilter: State['videoFilter']) => void
  setVideoFiltering: (videoFiltering: State['videoFiltering']) => void
}

export const useVtoStore = createStore<State & Action>((set) => ({
  clothesColor: clothesConfig.color,
  clothesOpacity: clothesConfig.opacity,
  glassesVisible: true,
  glassesScale: 1,
  enableMask: false,
  hairColor: hairConfig.color,
  hairOpacity: hairConfig.opacity,
  loadingGlasses: false,
  mode: Mode.Glasses,
  pause: false,
  selectedBackground: backgroundImages[0],
  selectedGlasses: glassesModels[0],
  stylization: false,
  videoSize,
  videoFilter: videoFilters[0],
  videoFiltering: false,

  setClothesColor: (clothesColor) => set(() => ({ clothesColor })),
  setClothesOpacity: (clothesOpacity) => set(() => ({ clothesOpacity })),
  setGlassesVisible: (glassesVisible) => set(() => ({ glassesVisible })),
  setGlassesScale: (glassesScale) => set(() => ({ glassesScale })),
  setEnableMask: (enableMask) => set(() => ({ enableMask })),
  setHairColor: (hairColor) => set(() => ({ hairColor })),
  setHairOpacity: (hairOpacity) => set(() => ({ hairOpacity })),
  setLoadingGlasses: (loadingGlasses) => set(() => ({ loadingGlasses })),
  setMode: (mode) => set(() => ({ mode })),
  setPause: (pause) => set(() => ({ pause })),
  setSelectedBackground: (selectedBackground) => set(() => ({ selectedBackground })),
  setSelectedGlasses: (selectedGlasses) => set(() => ({ selectedGlasses })),
  setStylization: (stylization) => set(() => ({ stylization })),
  setVideoSize: (videoSize) => set(() => ({ videoSize })),
  setVideoFilter: (videoFilter) => set(() => ({ videoFilter })),
  setVideoFiltering: (videoFiltering) => set(() => ({ videoFiltering }))
}))
