import { FrontSide } from 'three'

export const pointsConfig = {
  transparent: true,
  color: 0xc0c0ee,
  opacity: 0.5,
  size: 3
}

export const surfaceConfig = {
  side: FrontSide,
  transparent: true,
  metalness: 0.98,
  roughness: 0.08,
  envMapIntensity: 1.24
}

export const wireframeConfig = {
  side: FrontSide,
  transparent: true,
  wireframe: true,
  color: 0xc0c0ee,
  opacity: 0.8
}
