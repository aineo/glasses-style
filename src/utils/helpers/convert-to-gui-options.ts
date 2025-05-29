import { IBackgroundImage } from '../../constants/background-images'
import { IGlassesModel } from '../../constants/glasses-models'
import { IVideoFilter } from '../../constants/video-filters'

export function convertToGuiOptions(
  artifacts: Array<IBackgroundImage | IGlassesModel | IVideoFilter>
) {
  return artifacts.reduce((object, item) => Object.assign(object, { [item.name]: item }), {})
}
