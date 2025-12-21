#!/usr/bin/env node

/**
 * Setup i18n structure for Docusaurus
 * Copies all markdown files from docs/ to i18n/[locale]/docusaurus-plugin-content-docs/current/docs/
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);
const readdir = promisify(fs.readdir);
const copyFile = promisify(fs.copyFile);

const config = {
  sourceDir: path.join(__dirname, '../docs'),
  i18nDir: path.join(__dirname, '../i18n'),
  locales: ['en', 'ja']
};

// Recursively copy directory structure
async function copyDirStructure(src, dest) {
  await mkdir(dest, { recursive: true });

  const entries = await readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDirStructure(srcPath, destPath);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      await copyFile(srcPath, destPath);
      console.log(`✓ Copied: ${path.relative(src, srcPath)}`);
    }
  }
}

// Main function
async function main() {
  try {
    console.log('🚀 Setting up i18n directory structure...\n');

    for (const locale of config.locales) {
      const i18nDocsPath = path.join(
        config.i18nDir,
        locale,
        'docusaurus-plugin-content-docs',
        'current',
        'docs'
      );

      console.log(`📁 Setting up ${locale.toUpperCase()} (${i18nDocsPath})`);

      try {
        await copyDirStructure(config.sourceDir, i18nDocsPath);
        console.log(`✅ Completed ${locale.toUpperCase()}\n`);
      } catch (error) {
        console.error(`❌ Error setting up ${locale}:`, error.message);
      }
    }

    console.log('✨ i18n directory structure setup complete!');
    console.log('\nNext steps:');
    console.log('1. Run: npm run write-translations -- --locale en');
    console.log('2. Run: npm run write-translations -- --locale ja');
    console.log('3. Edit the generated JSON files in i18n/[locale]/docusaurus-theme-classic/ and i18n/[locale]/');
    console.log('4. Run: npm start to test');

  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

main();
