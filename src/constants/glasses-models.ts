export interface IGlassesModel {
  name: string
  url: string
  settings?: {
    position?: { x: number; y: number; z: number }
    scale?: number
    rotation?: { x: number; y: number; z: number }
  }
}

export const angleZBias = Math.PI / 18

export const glassesModels: Array<IGlassesModel> = [
  {
    name: 'Like a boss',
    url: '/glasses-style/assets/models/like-a-boss/scene.gltf',
    settings: {
      scale: 0.98
    }
  },
  {
    name: 'Sport',
    url: '/glasses-style/assets/models/sport/scene.glb',
    settings: {
      position: { x: 0, y: -30, z: -40 },
      scale: 0.89
    }
  },
  {
    name: 'White yellow',
    url: '/glasses-style/assets/models/white-yellow/scene.gltf',
    settings: {
      position: { x: 0, y: 20, z: 20 },
      scale: 0.88
    }
  },
  {
    name: 'Rounded optic',
    url: '/glasses-style/assets/models/rounded-optic/scene.gltf',
    settings: {
      scale: 0.95,
      position: { x: 0, y: -10, z: 0 }
    }
  },
  {
    name: 'Ray Ban',
    url: '/glasses-style/assets/models/ray-ban/scene.gltf',
    settings: {
      scale: 0.95,
      position: { x: 0, y: 10, z: 0 }
    }
  },
  {
    name: 'Oval optic',
    url: '/glasses-style/assets/models/oval-optic/scene.gltf',
    settings: {
      position: { x: -8, y: -15, z: 0 },
      scale: 0.97
    }
  },
  {
    name: 'Flowered',
    url: '/glasses-style/assets/models/flowered/scene.gltf',
    settings: {
      scale: 0.91
    }
  }
]
