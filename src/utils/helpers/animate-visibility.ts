import { Group, Mesh, Object3D, Scene } from 'three'
import * as TWEEN from '@tweenjs/tween.js'

const animationDuration = 350

export type ITweenVisibility = TWEEN.Tween<{ opacity: number }>
interface IAnimationCallbacks {
  start?: () => Group | Scene
  complete?: () => Group | Scene
}

export function animateVisibility(
  model: Object3D,
  toVisible: boolean,
  callbacks?: IAnimationCallbacks
): ITweenVisibility {
  const current = { opacity: toVisible ? 0 : 1 }
  const target = { opacity: toVisible ? 1 : 0 }

  function setValueToMeshes(
    property: 'visible' | 'opacity' | 'transparent',
    value: boolean | number
  ) {
    model.traverse((child: Object3D) => {
      const mesh = child as Mesh
      if (mesh.isMesh) {
        ;(mesh.material as { [key: string]: any })[property] = value
      }
    })
  }

  const tween = new TWEEN.Tween(current)
    .easing(TWEEN.Easing.Sinusoidal.In)
    .to(target, animationDuration)
    .onStart(() => {
      toVisible ? setValueToMeshes('visible', true) : setValueToMeshes('transparent', true)
      callbacks?.start?.()
    })
    .onUpdate((option: { opacity: number }) => {
      setValueToMeshes('opacity', option.opacity)
    })
    .onComplete(() => {
      toVisible ? setValueToMeshes('transparent', false) : setValueToMeshes('visible', false)
      callbacks?.complete?.()
    })
    .start()

  return tween
}
