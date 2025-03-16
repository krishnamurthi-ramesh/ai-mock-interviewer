import { pipeline } from '@xenova/transformers';
import * as tf from '@tensorflow/tfjs';
import * as faceDetection from '@tensorflow-models/face-detection';

let expressionModel = null;
let faceDetector = null;

// Initialize the models
async function initializeModels() {
  try {
    // Initialize face detection model
    await tf.setBackend('webgl');
    faceDetector = await faceDetection.createDetector(
      faceDetection.SupportedModels.MediaPipeFaceDetector,
      { runtime: 'tfjs' }
    );

    // Initialize expression recognition model
    expressionModel = await pipeline('image-classification', 'justinshenk/fer');
    
    self.postMessage({ type: 'initialized' });
  } catch (error) {
    self.postMessage({ type: 'error', error: error.message });
  }
}

// Process face detection and expression analysis
async function processFrame(imageData) {
  const faces = await faceDetector.estimateFaces(imageData);
  if (faces.length === 0) {
    return null;
  }

  // Get the main face (assuming the interviewee is the most prominent face)
  const mainFace = faces[0];
  const faceImage = tf.tidy(() => {
    const image = tf.browser.fromPixels(imageData);
    const box = mainFace.box;
    return tf.image.cropAndResize(
      image.expandDims(),
      [[box.yMin, box.xMin, box.yMax, box.xMax]],
      [0],
      [224, 224]
    ).squeeze();
  });

  const analysis = await expressionModel(faceImage);
  faceImage.dispose();

  return {
    expression: analysis[0].label,
    confidence: analysis[0].score,
    emotions: analysis.map(result => ({
      emotion: result.label,
      score: result.score
    })),
    faceBox: mainFace.box
  };
}

// Handle messages from main thread
self.onmessage = async (event) => {
  const { type, data } = event.data;

  switch (type) {
    case 'initialize':
      await initializeModels();
      break;

    case 'analyze':
      try {
        if (!expressionModel || !faceDetector) {
          throw new Error('Models not initialized');
        }

        const result = await processFrame(data.frame);
        self.postMessage({
          type: 'result',
          id: data.id,
          result
        });
      } catch (error) {
        self.postMessage({
          type: 'error',
          id: data.id,
          error: error.message
        });
      }
      break;

    default:
      self.postMessage({
        type: 'error',
        error: `Unknown message type: ${type}`
      });
  }
}; 