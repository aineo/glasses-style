import { drawerFragment } from '../shaders/drawer.webgl'
import { vertexShader } from '../shaders/vertex-shader.webgl'

export class WebGLDrawer {
  private canvas: HTMLCanvasElement
  private gl: WebGL2RenderingContext
  private prevShader!: { vertex?: WebGLShader; fragment: WebGLShader }
  private program!: WebGLProgram | null

  constructor(canvasId: string, width: number, height: number, newTab?: Window | null) {
    const canvas = <HTMLCanvasElement>(newTab ? newTab.document : document).getElementById(canvasId)
    if (!canvas) throw new Error(`Canvas with ${canvasId} not found`)

    canvas.width = width
    canvas.height = height
    canvas.style.visibility = 'visible'
    this.canvas = canvas

    const gl = this.canvas.getContext('webgl2', { alpha: true, preserveDrawingBuffer: true })
    if (!gl) throw new Error('Cant get canvas rendering context')

    this.gl = gl

    this.setup()
  }

  draw(image: ImageBitmap | ImageData) {
    if (!this.program) throw new Error('Shader program not created')

    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.RGBA,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      image
    )

    // Draw 6 vertices as triangles
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6)
  }

  private setup() {
    // Get canvas
    this.gl.viewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight)

    // Create shaders
    const fragmentShader = drawerFragment

    const vertex = this.createShader('vertex', vertexShader)
    const fragment = this.createShader('fragment', fragmentShader)

    this.prevShader = { vertex, fragment }

    // Create and enable program
    const program = this.gl.createProgram()
    if (!program) throw new Error('Failed to create shader program')

    this.gl.attachShader(program, vertex)
    this.gl.attachShader(program, fragment)

    this.gl.linkProgram(program)
    this.gl.useProgram(program)

    this.program = program

    const VERTICES = new Float32Array([-1, -1, -1, 1, 1, 1, -1, -1, 1, 1, 1, -1])
    // Bind VERTICES as the active array buffer.
    const vertexBuffer = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, VERTICES, this.gl.STATIC_DRAW)

    // Set and enable array buffer as the program's position attribute
    const positionLocation = this.gl.getAttribLocation(program, 'position')
    this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0)
    this.gl.enableVertexAttribArray(positionLocation)

    // Create texture
    const texture = this.gl.createTexture()
    this.gl.activeTexture(this.gl.TEXTURE0)
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture)

    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE)
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE)
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR)
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR)

    this.gl.clearColor(0, 0, 0, 0.5)
  }

  switchFilter(shaderSource: { vertex: string; fragment: string }) {
    if (!this.program) throw new Error('Program not found, switching impossible')

    this.gl.detachShader(this.program, this.prevShader.fragment)

    const shader = {
      fragment: this.createShader('fragment', shaderSource.fragment)
    }

    this.gl.attachShader(this.program, shader.fragment)

    this.gl.linkProgram(this.program)
    this.gl.useProgram(this.program)

    this.prevShader = shader
  }

  private createShader(type: string, shaderCode: string) {
    const shader = this.gl.createShader(
      type === 'vertex' ? this.gl.VERTEX_SHADER : this.gl.FRAGMENT_SHADER
    )
    if (!shader) throw new Error(`Failed to create ${type} shader`)

    this.gl.shaderSource(shader, shaderCode)
    this.gl.compileShader(shader)

    return shader
  }

  get context() {
    return this.gl
  }

  get element() {
    return this.canvas
  }
}
