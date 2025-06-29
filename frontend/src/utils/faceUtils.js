import * as faceapi from 'face-api.js';
export async function loadModels() {
  const MODEL_URL = '/models';
    await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      ]);
}

export async function getFullFaceDescription(image) {
  const detections = await faceapi.detectSingleFace(image, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();
  return detections?.descriptor;
}