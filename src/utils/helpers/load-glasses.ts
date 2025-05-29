import { Box3, Mesh, MeshStandardMaterial, Object3D, Texture, Vector3, Group } from 'three'
import { glassesName } from '../../constants/glasses-name'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { useVtoStore } from '../../store/main'

export async function loadGlasses(
  loader: GLTFLoader,
  modelUrl: string,
  sceneArGroup: Group,
  cubeMap: Texture
) {
  useVtoStore.setState({ loadingGlasses: true })

  const canvas = document.getElementById('out_canvas')

  if (canvas) canvas.style.filter = 'brightness(50%)'

  const glassesObject = sceneArGroup.getObjectByName(glassesName)
  if (glassesObject) sceneArGroup.remove(glassesObject)

  loader.load(
    modelUrl,
    (gltf: GLTF) => {
      const object = gltf.scene

      const bbox = new Box3().setFromObject(object)
      const size = bbox.getSize(new Vector3())
      useVtoStore.setState({ glassesScale: size.x })

      const glasses = object
      glasses.name = glassesName
      glasses.traverse((child: Object3D) => {
        if ((<Mesh>child).isMesh) {
          const meshMaterial = (child as Mesh).material as MeshStandardMaterial
          meshMaterial.transparent = true
          meshMaterial.envMap = cubeMap
          meshMaterial.needsUpdate = true
        }
      })

      sceneArGroup.add(glasses)
    },
    () => {
      // xhr: ProgressEvent
      useVtoStore.setState({ loadingGlasses: false })

      if (canvas) canvas.style.filter = 'brightness(100%)'
    },
    (error) => {
      throw new Error(`Error when glasses loading: ${error}`)
    }
  )
}
