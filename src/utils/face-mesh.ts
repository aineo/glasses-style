import {
  BufferGeometry,
  Float32BufferAttribute,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Points,
  PointsMaterial,
  Texture,
  Vector3
} from 'three'

import { pointsConfig, surfaceConfig, wireframeConfig } from '../constants/facemesh-configs'
import { Coordinates } from './helpers/coordinates'

export interface IFacemesh {
  points: Points
  surface: Mesh
  wireframe: Mesh
}

export class FaceMesh {
  private bufferGeometry: BufferGeometry

  private pointsMaterial: PointsMaterial
  private surfaceMaterial: MeshStandardMaterial
  private wireframeMaterial: MeshBasicMaterial

  public points!: Points<BufferGeometry, PointsMaterial>
  public surface!: Mesh<BufferGeometry, MeshStandardMaterial>
  public wireframe!: Mesh<BufferGeometry, MeshBasicMaterial>

  constructor() {
    this.bufferGeometry = new BufferGeometry()

    this.pointsMaterial = new PointsMaterial(pointsConfig)
    this.surfaceMaterial = new MeshStandardMaterial(surfaceConfig)
    this.wireframeMaterial = new MeshBasicMaterial(wireframeConfig)
  }

  public init(cubeMapTexture: Texture): IFacemesh {
    const points = new Points(this.bufferGeometry, this.pointsMaterial)
    const surface = new Mesh(this.bufferGeometry, this.surfaceMaterial)
    const wireframe = new Mesh(this.bufferGeometry, this.wireframeMaterial)

    this.surfaceMaterial.envMap = cubeMapTexture
    this.surfaceMaterial.needsUpdate = true

    return { points, surface, wireframe }
  }

  public setIndices(indices: number[]) {
    this.bufferGeometry.setIndex(indices)
  }

  public update(worldPoints: Vector3[][]) {
    const indices = Coordinates.getIndicesFromTriangles(worldPoints.length)
    const vertices = Coordinates.getVertices(worldPoints)
    const uvs = Coordinates.getUVs(worldPoints)
    const normales = Coordinates.calculateSurfaceNormales(vertices)

    this.setIndices(indices)
    this.updateAttribute('position', vertices, 3)
    this.updateAttribute('uv', uvs, 2)
    this.updateAttribute('normal', normales, 3)
  }

  private updateAttribute(type: string, data: number[], dimension: number) {
    const bufferData = new Float32BufferAttribute(data, dimension)

    this.bufferGeometry.setAttribute(type, bufferData)
    this.bufferGeometry.attributes[type].needsUpdate = true
  }
}
