import Stats from 'stats-js'

export class StatsVTO {
  private stats: any

  constructor() {
    this.stats = Stats()

    this.setup()
  }

  onStats(callback: () => void) {
    this.stats.begin()
    callback()
    this.stats.end()
  }

  private setup() {
    this.stats.domElement.style.top = '0px'
    this.stats.domElement.style.right = '0px'
    this.stats.domElement.style.zIndex = '15'
    document.body.appendChild(this.stats.domElement)
  }
}
