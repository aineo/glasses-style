import { OrthographicCamera, Vector3 } from 'three'

import { adjTriangles } from '../data/adj-triangles'
import { faceTriangles } from '../data/face-triangles'

export class Coordinates {
  public static getIndicesFromTriangles(numFaces: number) {
    const indices: number[] = []

    for (let i = 0; i < numFaces; i++) {
      for (const triangle of faceTriangles) {
        indices.push(...triangle)
      }
    }

    return indices
  }

  public static getVertices(points: Vector3[][]) {
    const vertices: number[] = []

    for (const face of points) {
      for (const point of face) {
        vertices.push(point.x, point.y, point.z)
      }
    }

    return vertices
  }

  public static getUVs(points: Vector3[][]) {
    const uvs: number[] = []

    for (const face of points) {
      for (const point of face) {
        uvs.push(point.x, 1 - point.y)
      }
    }

    return uvs
  }

  // TODO: move calculation normales from buffer geometry to WASM
  public static calculateSurfaceNormales(vertices: number[]) {
    // Two steps:

    // Calculate normales to triangles by vertices from buffer geometry
    const normales: number[][] = []

    for (let i = 0; i < faceTriangles.length; i++) {
      const idx0 = faceTriangles[i][0]
      const idx1 = faceTriangles[i][1]
      const idx2 = faceTriangles[i][2]

      const a = [vertices[idx0 * 3], vertices[idx0 * 3 + 1], vertices[idx0 * 3 + 2]]
      const b = [vertices[idx1 * 3], vertices[idx1 * 3 + 1], vertices[idx1 * 3 + 2]]
      const c = [vertices[idx2 * 3], vertices[idx2 * 3 + 1], vertices[idx2 * 3 + 2]]

      const n = [
        (b[1] - a[1]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[1] - a[1]),
        -(b[0] - a[0]) * (c[2] - a[2]) + (b[2] - a[2]) * (c[0] - a[0]),
        (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
      ]

      let norma = Math.sqrt(n[0] * n[0] + n[1] * n[1] + n[2] * n[2])

      const epsilon = 0.00001
      if (norma === 0) {
        norma = epsilon
      }

      normales.push([n[0] / norma, n[1] / norma, n[2] / norma])
    }

    // Calculate normales to triangles with common vertice
    const normalesToVertices: number[] = []
    const adjTrianglesLength = adjTriangles.length
    for (let i = 0; i < adjTrianglesLength; i++) {
      const adjTrianglesVertex = adjTriangles[i]

      let n0adj = 0
      let n1adj = 0
      let n2adj = 0
      for (let j = 0; j < adjTrianglesVertex.length; j++) {
        n0adj += normales[adjTrianglesVertex[j] as number][0]
        n1adj += normales[adjTrianglesVertex[j] as number][1]
        n2adj += normales[adjTrianglesVertex[j] as number][2]
      }

      normalesToVertices.push(
        n0adj / adjTrianglesLength,
        n1adj / adjTrianglesLength,
        n2adj / adjTrianglesLength
      )
    }

    return normalesToVertices
  }

  public static transformToWorld(camera: OrthographicCamera, x: number, y: number, z: number) {
    return new Vector3((x * 2 - 1) * camera.right, (1 - y * 2) * camera.top, -z * 2 * camera.right)
  }
}
