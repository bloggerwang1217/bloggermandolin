#!/usr/bin/env node

/**
 * Single language translation script
 * Usage: node scripts/translate-single.js [en|ja]
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

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

// Process a single file
async function processFile(filePath, language, locale) {
  try {
    console.log(`\n📄 Processing: ${path.relative(config.sourceDir, filePath)}`);

    const content = await readFile(filePath, 'utf-8');
    const { frontmatter, content: markdownContent } = parseFrontmatter(content);

    console.log(`⏳ Translating to ${language}...`);
    const translatedContent = await translateText(markdownContent, language);

    const translatedMarkdown = rebuildMarkdown(frontmatter, translatedContent);

    // Determine output path
    const relativePath = path.relative(config.sourceDir, filePath);
    const outputPath = path.join(
      config.i18nDir,
      locale,
      'docusaurus-plugin-content-docs',
      'current',
      relativePath
    );

    // Create directory and write file
    await ensureDirectoryExists(outputPath);
    await writeFile(outputPath, translatedMarkdown, 'utf-8');

    console.log(`✅ Saved to: ${path.relative(process.cwd(), outputPath)}`);

  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

// Main function
async function main() {
  const localeArg = process.argv[2];

  if (!localeArg || !['en', 'ja'].includes(localeArg)) {
    console.error('Usage: node scripts/translate-single.js [en|ja]');
    process.exit(1);
  }

  try {
    const langConfig = config.targetLanguages.find(lang => lang.locale === localeArg);

    if (!langConfig) {
      console.error(`Language ${localeArg} not configured in config.js`);
      process.exit(1);
    }

    console.log(`🚀 Starting translation to ${langConfig.language}...\n`);

    const files = await getMarkdownFiles(config.sourceDir);
    console.log(`Found ${files.length} markdown files\n`);

    if (files.length === 0) {
      console.log('No markdown files found.');
      return;
    }

    let successCount = 0;
    let failCount = 0;

    for (const file of files) {
      try {
        await new Promise(resolve => setTimeout(resolve, config.delayBetweenRequests));
        await processFile(file, langConfig.language, langConfig.locale);
        successCount++;
      } catch (error) {
        failCount++;
      }
    }

    console.log(`\n✨ Translation complete! (${successCount} successful, ${failCount} failed)`);

  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

main();
