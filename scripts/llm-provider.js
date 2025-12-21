/**
 * LLM Provider for Ollama
 * Handles communication with local Ollama instance
 */

const http = require('http');
const { config } = require('./config');

// Make HTTP request to Ollama
function makeRequest(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          resolve({
            statusCode: res.statusCode,
            data: responseData,
            headers: res.headers
          });
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Translate text using Ollama
async function translateText(text, targetLanguage) {
  const languageMap = {
    'English': 'English',
    'Japanese': '日本語 (Japanese)',
    '中文': 'Traditional Chinese'
  };

  const targetLangName = languageMap[targetLanguage] || targetLanguage;

  const prompt = `You are a professional translator. Translate the following markdown content to ${targetLangName}.

Important rules:
1. Preserve all markdown formatting (headers, lists, code blocks, HTML elements, etc.)
2. Keep all URLs, code snippets, and HTML tags exactly as they are
3. Do not translate names, proper nouns, or brand names unless necessary
4. Maintain the same structure and line breaks
5. Translate ONLY the human-readable text content
6. Keep the tone and style consistent with the original

Content to translate:
${text}

Provide ONLY the translated content without any explanations or preamble.`;

  const options = {
    hostname: config.ollama.host,
    port: config.ollama.port,
    path: '/api/generate',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const data = {
    model: config.ollama.model,
    prompt: prompt,
    stream: false,
    temperature: config.ollama.temperature,
    num_ctx: config.ollama.numCtx,
    num_predict: -1 // unlimited response length
  };

  try {
    console.log(`📡 Connecting to Ollama at ${config.ollama.host}:${config.ollama.port}`);
    console.log(`🤖 Using model: ${config.ollama.model}`);

    const response = await makeRequest(options, data);

    if (response.statusCode !== 200) {
      throw new Error(`Ollama API error: ${response.statusCode} - ${response.data}`);
    }

    const result = JSON.parse(response.data);

    if (!result.response) {
      throw new Error('No response from Ollama');
    }

    return result.response.trim();

  } catch (error) {
    console.error('Translation error:', error.message);
    throw error;
  }
}

module.exports = {
  translateText
};
