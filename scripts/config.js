/**
 * Configuration for automated translation
 */

const path = require('path');

const config = {
  // Source and output directories
  sourceDir: path.join(__dirname, '../docs'),
  i18nDir: path.join(__dirname, '../i18n'),

  // Ollama configuration
  ollama: {
    host: 'localhost',
    port: 11434,
    model: 'gpt-oss:20b', // Using GPT-OSS 20B for better translation quality
    temperature: 0.3, // Lower temperature for more consistent translations
    numCtx: 4096 // Context window size
  },

  // Target languages for translation
  // Each entry should have 'language' (display name) and 'locale' (i18n locale code)
  targetLanguages: [
    {
      language: 'English',
      locale: 'en'
    },
    {
      language: 'Japanese',
      locale: 'ja'
    }
  ],

  // Delay between requests to avoid overwhelming Ollama (in milliseconds)
  delayBetweenRequests: 1000,

  // Skip files matching these patterns
  skipPatterns: [
    'node_modules',
    '.git',
    'i18n'
  ]
};

module.exports = { config };
