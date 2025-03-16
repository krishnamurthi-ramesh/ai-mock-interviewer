import { pipeline } from '@xenova/transformers';

let speechModel = null;
let voiceModel = null;

// Initialize the models
async function initializeModels() {
  try {
    speechModel = await pipeline('automatic-speech-recognition', 'openai/whisper-small', {
      chunk_length_s: 30,
      stride_length_s: 5
    });

    voiceModel = await pipeline('audio-classification', 'facebook/wav2vec2-base');
    
    self.postMessage({ type: 'initialized' });
  } catch (error) {
    self.postMessage({ type: 'error', error: error.message });
  }
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
        if (!speechModel || !voiceModel) {
          throw new Error('Models not initialized');
        }

        const [transcription, voiceAnalysis] = await Promise.all([
          speechModel(data.audio),
          voiceModel(data.audio)
        ]);

        self.postMessage({
          type: 'result',
          id: data.id,
          result: {
            text: transcription.text,
            confidence: transcription.confidence,
            voiceMetrics: {
              clarity: voiceAnalysis.scores[0],
              pace: voiceAnalysis.scores[1],
              tone: voiceAnalysis.scores[2]
            }
          }
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