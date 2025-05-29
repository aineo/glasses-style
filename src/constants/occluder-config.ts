import { isMobileDevice } from '../utils/helpers/is-mobile-device'
import { mobileScale } from './mobile-scale'

export const occluderConfig = {
  radius: 65,
  length: 65,
  capSegments: 4,
  redialSegments: 8
}

export const occluderZBias = isMobileDevice() ? 285 * mobileScale : 285
