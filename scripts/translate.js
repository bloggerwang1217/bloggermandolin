#!/usr/bin/env node

/**
 * Automated translation script for Docusaurus
 * Uses Ollama to translate markdown files to English and Japanese
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readline = require('readline');

// Import local modules
const { translateText } = require('./llm-provider');
const { config } = require('./config');

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

// Parse frontmatter from markdown
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    return { frontmatter: null, content };
  }
  return {
    frontmatter: match[1],
    content: match[2]
  };
}

// Rebuild markdown with frontmatter
function rebuildMarkdown(frontmatter, content) {
  if (!frontmatter) return content;
  return `---\n${frontmatter}\n---\n${content}`;
}

// Get all markdown files recursively
async function getMarkdownFiles(dir) {
  const files = [];

  async function walk(currentPath) {
    const entries = await readdir(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);

      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        files.push(fullPath);
      }
    }
  }

  await walk(dir);
  return files;
}

// Create output directory structure
async function ensureDirectoryExists(filePath) {
  const dir = path.dirname(filePath);
  await mkdir(dir, { recursive: true });
}

// Process a single file for translation
async function processFile(filePath, targetLanguage, targetLocale) {
  try {
    console.log(`\n📄 Processing: ${filePath}`);
    console.log(`🌐 Target: ${targetLanguage}`);

    const content = await readFile(filePath, 'utf-8');
    const { frontmatter, content: markdownContent } = parseFrontmatter(content);

    // Translate content
    console.log(`⏳ Translating content...`);
    const translatedContent = await translateText(markdownContent, targetLanguage);

    // Update sidebar_label in frontmatter if it exists
    let updatedFrontmatter = frontmatter;
    if (frontmatter && targetLanguage === 'English') {
      // For English, keep the label as is or translate it
      updatedFrontmatter = frontmatter.replace(
        /sidebar_label:\s*(.+)/,
        (match, label) => {
          // If label contains Chinese characters, we'll keep it for now
          return match;
        }
      );
    }

    const translatedMarkdown = rebuildMarkdown(updatedFrontmatter, translatedContent);

    // Determine output path
    const relativePath = path.relative(config.sourceDir, filePath);
    const outputPath = path.join(
      config.i18nDir,
      targetLocale,
      'docusaurus-plugin-content-docs',
      'current',
      relativePath
    );

    // Create directory and write file
    await ensureDirectoryExists(outputPath);
    await writeFile(outputPath, translatedMarkdown, 'utf-8');

    console.log(`✅ Saved to: ${outputPath}`);

  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

// Main function
async function main() {
  try {
    console.log('🚀 Starting automated translation...\n');
    console.log(`📁 Source directory: ${config.sourceDir}`);
    console.log(`🌍 Target languages: ${config.targetLanguages.join(', ')}\n`);

    // Get all markdown files
    const files = await getMarkdownFiles(config.sourceDir);
    console.log(`Found ${files.length} markdown files\n`);

    if (files.length === 0) {
      console.log('No markdown files found.');
      return;
    }

    // Process each file for each target language
    for (const file of files) {
      for (const langConfig of config.targetLanguages) {
        const { language, locale } = langConfig;

        // Simple rate limiting to avoid overwhelming Ollama
        await new Promise(resolve => setTimeout(resolve, config.delayBetweenRequests));

        await processFile(file, language, locale);
      }
    }

    console.log('\n✨ Translation complete!');

  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

// Run
main();
