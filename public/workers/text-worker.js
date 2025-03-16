import { pipeline } from '@xenova/transformers';

let textModel = null;

// Initialize the model
async function initializeModel() {
  try {
    textModel = await pipeline('text-generation', 'meta-llama/Llama-2-7b-chat-hf', {
      quantized: true
    });
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
      await initializeModel();
      break;

    case 'generate':
      try {
        if (!textModel) {
          throw new Error('Model not initialized');
        }
        const response = await textModel(data.prompt, data.options);
        self.postMessage({
          type: 'result',
          id: data.id,
          result: response[0].generated_text
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