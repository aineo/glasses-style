import { NormalizedLandmark } from '@mediapipe/tasks-vision'
import {
  ACESFilmicToneMapping,
  CapsuleGeometry,
  DefaultLoadingManager,
  DirectionalLight,
  EquirectangularReflectionMapping,
  Group,
  Mesh,
  MeshBasicMaterial,
  OrthographicCamera,
  PMREMGenerator,
  Scene,
  SRGBColorSpace,
  Texture,
  TextureLoader,
  Vector3,
  WebGLRenderer
} from 'three'

import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

import { angleZBias } from '../constants/glasses-models'
import { Coordinates } from './helpers/coordinates'
import { FaceMesh, IFacemesh } from './face-mesh'
import { ITweenVisibility } from './helpers/animate-visibility'
import { keypoints } from '../constants/keypoints'
import { lightConfig } from '../constants/light-config'
import { loadGlasses } from './helpers/load-glasses'
import { occluderConfig, occluderZBias } from '../constants/occluder-config'
import { useVtoStore } from '../store/main'

import equireRectTexture from '../textures/equirectangular-min.png'

export interface ISceneAR {
  scene: Scene
  light: DirectionalLight
  facemesh: IFacemesh
  loader: GLTFLoader
  group: Group
  cubeMap: Texture
}

export class ThreeAR {
  private width: number
  private height: number

  private scene: Scene
  private camera: OrthographicCamera
  private renderer: WebGLRenderer
  private _sceneAR!: ISceneAR

  private loader: GLTFLoader
  private glasses!: any
  private occluder!: any

  private facemesh!: FaceMesh

  private tween!: ITweenVisibility

  constructor(width: number, height: number) {
    this.width = width
    this.height = height

    this.scene = new Scene()
    this.camera = new OrthographicCamera(
      -this.width / 2,
      this.width / 2,
      this.height / 2,
      -this.height / 2,
      -2000,
      2000
    )

    const canvas = <HTMLCanvasElement>document.getElementById('ar_canvas')
    canvas.style.visibility = 'visible'
    this.renderer = new WebGLRenderer({
      alpha: true,
      antialias: true,
      canvas
    })

    this.facemesh = new FaceMesh()

    this.loader = this.initLoader()

    this.setup()
  }

  draw(landmarks: NormalizedLandmark[][]) {
    if (!this.glasses) return

    const worldPoints: Vector3[][] = []
    for (const face of landmarks) {
      worldPoints.push(
        face.map((point) => Coordinates.transformToWorld(this.camera, point.x, point.y, point.z))
      )
    }

    if (useVtoStore.getState().enableMask) this.facemesh.update(worldPoints)

    for (const face of worldPoints) {
      this.attachGlasses(face)
    }
  }

  render() {
    if (this.tween) this.tween.update()
    this.renderer.render(this.scene, this.camera)
  }

  private setup() {
    this.setupCamera()

    this.setupRenderer()

    const light = this.setupLight()

    const pmremGenerator = this.setupPmremGenerator()
    const cubeMap = this.setupReflection(pmremGenerator)

    const facemesh = this.facemesh.init(cubeMap)

    this.initOccluder()

    this.glasses = new Group()
    this.scene.add(this.glasses)

    const initialModel = useVtoStore.getState().selectedGlasses
    loadGlasses(this.loader, initialModel.url, this.glasses, cubeMap)

    this._sceneAR = {
      scene: this.scene,
      light,
      facemesh,
      loader: this.loader,
      group: this.glasses,
      cubeMap
    }
  }

  private setupCamera() {
    this.camera.updateProjectionMatrix()
    this.camera.position.z = 1
    this.scene.add(this.camera)
  }

  private setupRenderer() {
    this.renderer.setSize(this.width, this.height)
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setClearColor(0x000000, 0)
    this.renderer.toneMapping = ACESFilmicToneMapping
  }

  private setupPmremGenerator() {
    const pmremGenerator = new PMREMGenerator(this.renderer)
    pmremGenerator.compileEquirectangularShader()
    DefaultLoadingManager.onLoad = function () {
      pmremGenerator.dispose()
    }

    return pmremGenerator
  }

  private setupReflection(pmremGenerator: PMREMGenerator) {
    return new TextureLoader().load(equireRectTexture, (texture: Texture) => {
      texture.mapping = EquirectangularReflectionMapping
      texture.colorSpace = SRGBColorSpace

      const cubeMap = pmremGenerator.fromEquirectangular(texture).texture

      return cubeMap
    })
  }

  private setupLight() {
    const light = new DirectionalLight(lightConfig.color, lightConfig.intensity)
    light.position.set(lightConfig.position.x, lightConfig.position.y, lightConfig.position.z)
    this.scene.add(light)

    return light
  }

  private initLoader() {
    const gltf = new GLTFLoader()
    const draco = new DRACOLoader().setDecoderPath(
      'https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/loaders/'
    )
    gltf.setDRACOLoader(draco)

    return gltf
  }

  private attachGlasses(face: Vector3[]) {
    const nose = keypoints.nose
    const topNose = face[nose[0]]
    const bottomNose = face[nose[1]]

    const eye = keypoints.eye
    const leftEye = face[eye[0]]
    const rightEye = face[eye[1]]

    const upEye = keypoints.upEye
    const upLeftEye = face[upEye[0]]
    const upRightEye = face[upEye[1]]

    const settings = useVtoStore.getState().selectedGlasses.settings

    // Position
    const position = new Vector3(topNose.x, topNose.y, topNose.z)

    const settingsPosition = settings?.position
    if (settingsPosition)
      position.add(new Vector3(settingsPosition.x, settingsPosition.y, settingsPosition.z))

    this.glasses.position.set(position.x, position.y, position.z)

    // Scaling
    let scaleFactor = useVtoStore.getState().glassesScale

    const settingsScale = settings?.scale
    if (settingsScale) scaleFactor *= settingsScale

    const scale = upLeftEye.distanceTo(upRightEye) / scaleFactor
    this.glasses.scale.set(scale, scale, scale)

    // Rotation
    const vX = new Vector3(1, 0, 0)
    const vZ = new Vector3(0, 0, 1)
    const upVector = topNose.clone().sub(bottomNose).normalize()
    const horVector = leftEye.clone().sub(rightEye).normalize()

    const xEuler = Math.PI / 2 - (vZ.angleTo(upVector.clone().projectOnPlane(vX)) - angleZBias)

    const yEuler = new Vector3(horVector.x, 0, horVector.z).angleTo(vZ) - Math.PI / 2

    const zEuler = vX.angleTo(upVector.clone().projectOnPlane(vZ)) - Math.PI / 2

    const rotation = new Vector3(xEuler, yEuler, zEuler)
    this.glasses.rotation.set(rotation.x, rotation.y, rotation.z)

    const occRadius = keypoints.occRadius
    const scaleOccluder = face[occRadius[0]].distanceTo(face[occRadius[1]]) / occluderConfig.radius
    this.updateOcluder(position, scaleOccluder, rotation)
  }

  private initOccluder() {
    const config = Object.values(occluderConfig)
    const geometry = new CapsuleGeometry(...config)
    const material = new MeshBasicMaterial({ colorWrite: false })
    const occluder = new Mesh(geometry, material)

    this.scene.add(occluder)

    this.occluder = occluder
  }

  private updateOcluder(position: Vector3, scale: number, rotation: Vector3) {
    this.occluder.position.set(position.x, position.y, position.z - occluderZBias)
    this.occluder.scale.set(scale, scale, scale)
    this.occluder.rotation.set(rotation.x, rotation.y, rotation.z)
  }

  get sceneAR() {
    return this._sceneAR
  }
}
