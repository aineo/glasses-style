export function loadBackground(
  url: string,
  width: number,
  height: number,
  context?: CanvasRenderingContext2D
) {
  if (!context) throw new Error('Background context is not initialized')

  if (url.length === 0) {
    context.clearRect(0, 0, width, height)
    return
  }

  const image = new Image(width, height)
  image.src = url

  image.onload = () => {
    // Scaling and centering background image
    const dWidth = Math.abs(image.naturalWidth - width)
    const dHeight = Math.abs(image.naturalHeight - height)
    const ratio = dHeight > dWidth ? dHeight / height : dWidth / width
    context.drawImage(image, -ratio / 2, 0, width * (ratio + 1), height * (ratio + 1))
  }
}
