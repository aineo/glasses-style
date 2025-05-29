import { FilesetResolver } from '@mediapipe/tasks-vision'

export async function getWasmFileset() {
  const cdnWasm = 'https://cdn.jsdelivr.net/npm'

  const wasmFileset = await FilesetResolver.forVisionTasks(
    `${cdnWasm}/@mediapipe/tasks-vision@latest/wasm`
  )

  return wasmFileset
}
