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
  const detections = await faceapi
    .detectSingleFace(image, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceDescriptor();
  return detections?.descriptor;
}

export function createFaceMatcher(users) {
  const labeledDescriptors = users.map(user => {
    const descriptors = user.descriptors.map(d => new Float32Array(d));
    return new faceapi.LabeledFaceDescriptors(user.name, descriptors);
  });
  return new faceapi.FaceMatcher(labeledDescriptors, 0.5);
}

