import { drawerFragment } from '../shaders/drawer.webgl'
import { grayscaleFragment } from '../shaders/grayscale.webgl'
import { darkPopartFragment } from '../shaders/dark-popart.webgl'
import { magazineFragment } from '../shaders/magazine.webgl'
import { mozaicFragment } from '../shaders/mozaic.webgl'
import { noiseFragment } from '../shaders/noise.webgl'
import { retroFragment } from '../shaders/retro.webgl'
import { sepiaFragment } from '../shaders/sepia.webgl'
import { sketchThickFragment } from '../shaders/sketch-thick.webgl'
import { sketchTinyFragment } from '../shaders/sketch-tiny.webgl'
import { xproFragment } from '../shaders/xpro.webgl'

import { vertexShader } from '../shaders/vertex-shader.webgl'

export interface IVideoFilter {
  name: string
  shader: { vertex: string; fragment: string }
}

export const videoFilters = [
  {
    name: 'Normal',
    shader: {
      vertex: vertexShader,
      fragment: drawerFragment
    }
  },
  {
    name: 'Grayscale',
    shader: {
      vertex: vertexShader,
      fragment: grayscaleFragment
    }
  },
  {
    name: 'Sepia',
    shader: {
      vertex: vertexShader,
      fragment: sepiaFragment
    }
  },
  {
    name: 'Retro',
    shader: {
      vertex: vertexShader,
      fragment: retroFragment
    }
  },
  {
    name: 'XPro',
    shader: {
      vertex: vertexShader,
      fragment: xproFragment
    }
  },
  {
    name: 'Mozaic',
    shader: {
      vertex: vertexShader,
      fragment: mozaicFragment
    }
  },
  {
    name: 'Sketch tiny',
    shader: {
      vertex: vertexShader,
      fragment: sketchTinyFragment
    }
  },
  {
    name: 'Sketch thick',
    shader: {
      vertex: vertexShader,
      fragment: sketchThickFragment
    }
  },
  {
    name: 'Magazine',
    shader: {
      vertex: vertexShader,
      fragment: magazineFragment
    }
  },
  {
    name: 'Noise',
    shader: {
      vertex: vertexShader,
      fragment: noiseFragment
    }
  },

  {
    name: 'Dark popart',
    shader: {
      vertex: vertexShader,
      fragment: darkPopartFragment
    }
  }
]
