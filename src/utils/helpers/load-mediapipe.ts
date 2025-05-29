import { FaceLandmarker, ImageSegmenter, FaceStylizer } from '@mediapipe/tasks-vision'

export async function loadMediapipeModel(vision: any, mode: string | null) {
  const storageTask = 'https://storage.googleapis.com/mediapipe-models'

  const maxNumFaces = 1

  let model: FaceLandmarker | ImageSegmenter | FaceStylizer
  switch (mode) {
    case 'selfie': {
      model = await ImageSegmenter.createFromOptions(vision, {
        baseOptions: {
          delegate: 'GPU',
          // TODO: Try without mediapipe, but need tflite install
          // Hair segmenter
          // modelAssetPath: `${storageTask}/image_segmenter/hair_segmenter/float32/latest/hair_segmenter.tflite`
          // Multilabel
          modelAssetPath: `${storageTask}/image_segmenter/selfie_multiclass_256x256/float32/latest/selfie_multiclass_256x256.tflite`
          // Only selfie
          // modelAssetPath: `${storageTask}/image_segmenter/selfie_segmenter/float16/latest/selfie_segmenter.tflite`
          // Deeplab
          // modelAssetPath: `${storageTask}/deeplabv3.tflite?generation=1661875711618421`
        },
        runningMode: 'VIDEO',
        outputCategoryMask: true,
        outputConfidenceMasks: false
      })

      break
    }

    case 'style': {
      // experimental
      model = await FaceStylizer.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: `${storageTask}/face_stylizer/blaze_face_stylizer/float32/latest/face_stylizer_color_sketch.task`
        }
      })

      break
    }

    default: // 'glasses'
      model = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          delegate: 'GPU',
          modelAssetPath: `${storageTask}/face_landmarker/face_landmarker/float16/1/face_landmarker.task`
        },
        runningMode: 'VIDEO',
        numFaces: maxNumFaces
      })

      break
  }

  return model
}
