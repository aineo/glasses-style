import { GlassesArtVTO } from './GlassesArtVTO'
import { Mode, useVtoStore } from './store/main'

window.addEventListener('DOMContentLoaded', () => {
  const url = new URL(window.location.href)

  const mode = url.searchParams.get('mode') as Mode
  const videoFiltering = url.searchParams.has('video-filtering')
  const stylization = url.searchParams.has('stylization')

  useVtoStore.setState({ mode: mode ?? Mode.Glasses })
  useVtoStore.setState({ videoFiltering })
  useVtoStore.setState({ stylization })

  new GlassesArtVTO()
})
