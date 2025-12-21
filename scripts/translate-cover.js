#!/usr/bin/env node

/**
 * Cover-specific translation script
 * Translates only the "影片介紹" (Video Introduction) section
 * Preserves Japanese lyrics and other content
 * Usage: node scripts/translate-cover.js [en|ja] <file_path>
 * Example: node scripts/translate-cover.js en docs/cover/DANDADAN/otonoke.md
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const { translateText } = require('./llm-provider');
const { config } = require('./config');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

// Extract sections from markdown
function extractSections(content) {
  const sections = {};
  let currentSection = null;
  let currentContent = '';
  const lines = content.split('\n');

  for (const line of lines) {
    // Check for frontmatter
    if (line.startsWith('---')) {
      if (!sections.frontmatter) {
        sections.frontmatter = '';
        currentSection = 'frontmatter';
      } else {
        currentSection = null;
        continue;
      }
    }
    // Check for section headers (##)
    else if (line.startsWith('## ')) {
      if (currentSection && currentContent.trim()) {
        sections[currentSection] = currentContent.trim();
      }
      currentSection = line.replace(/^## /, '').trim();
      currentContent = '';
    }
    // Check for subsection headers (###)
    else if (line.startsWith('### ')) {
      const subsection = line.replace(/^### /, '').trim();
      if (currentSection && !sections[`${currentSection}/${subsection}`]) {
        sections[`${currentSection}/${subsection}`] = '';
      }
      currentSection = `${currentSection}/${subsection}`;
      currentContent = '';
    } else {
      if (currentSection !== null) {
        currentContent += (currentContent ? '\n' : '') + line;
      }
    }
  }

  // Save last section
  if (currentSection && currentContent.trim()) {
    sections[currentSection] = currentContent.trim();
  }

  return sections;
}

// Translate specific section
async function translateSection(content, sectionKey, language) {
  const lines = content.split('\n');
  let inTargetSection = false;
  let translatedLines = [];
  let skipUntilNextSection = false;
  const [mainSection, subSection] = sectionKey.split('/');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect section headers
    if (line.startsWith('## ')) {
      const headerName = line.replace(/^## /, '').trim();
      inTargetSection = headerName === mainSection;
      skipUntilNextSection = false;
      translatedLines.push(line);
    }
    // Detect subsection headers
    else if (line.startsWith('### ') && inTargetSection) {
      const headerName = line.replace(/^### /, '').trim();
      skipUntilNextSection = headerName !== subSection;
      translatedLines.push(line);
    }
    // Skip if we hit another main section
    else if (line.startsWith('## ') && inTargetSection) {
      inTargetSection = false;
      translatedLines.push(line);
    }
    // Process content in target section
    else if (inTargetSection && !skipUntilNextSection && line.trim() && !line.startsWith('##')) {
      translatedLines.push(line);
    } else {
      translatedLines.push(line);
    }
  }

  return translatedLines.join('\n');
}

// Main function
async function main() {
  const localeArg = process.argv[2];
  const fileArg = process.argv[3];

  if (!localeArg || !fileArg || !['en', 'ja'].includes(localeArg)) {
    console.error('Usage: node scripts/translate-cover.js [en|ja] <file_path>');
    console.error('Example: node scripts/translate-cover.js en docs/cover/DANDADAN/otonoke.md');
    process.exit(1);
  }

  try {
    const langConfig = config.targetLanguages.find(lang => lang.locale === localeArg);
    if (!langConfig) {
      console.error(`Language ${localeArg} not configured`);
      process.exit(1);
    }

    // Determine source file path
    let sourceFilePath;
    if (path.isAbsolute(fileArg)) {
      sourceFilePath = fileArg;
    } else {
      sourceFilePath = path.join(process.cwd(), fileArg);
    }

    // Check file exists
    if (!fs.existsSync(sourceFilePath)) {
      console.error(`File not found: ${sourceFilePath}`);
      process.exit(1);
    }

    console.log(`🚀 Translating to ${langConfig.language}...\n`);
    console.log(`📄 Source file: ${path.relative(process.cwd(), sourceFilePath)}`);

    const content = await readFile(sourceFilePath, 'utf-8');
    const { frontmatter, content: markdownContent } = parseFrontmatter(content);

    // Extract sections
    const sections = extractSections(markdownContent);

    // Find the video introduction section key
    const videoIntroKey = Object.keys(sections).find(
      key => key.includes('影片介紹') || key.includes('動画紹介') || key.includes('Video Introduction')
    );

    if (!videoIntroKey) {
      console.warn('⚠️  No video introduction section found. Skipping translation.');
      process.exit(0);
    }

    console.log(`\n📝 Found section: ${videoIntroKey}`);
    console.log(`⏳ Translating...`);

    // Get the introduction text
    const introText = sections[videoIntroKey];

    // Translate
    const translatedIntro = await translateText(introText, langConfig.language);

    // Reconstruct the file with translated introduction
    let translatedContent = markdownContent;
    translatedContent = translatedContent.replace(introText, translatedIntro);

    const translatedMarkdown = rebuildMarkdown(frontmatter, translatedContent);

    // Determine output path
    const relativePath = path.relative(config.sourceDir, sourceFilePath);
    const outputPath = path.join(
      config.i18nDir,
      localeArg,
      'docusaurus-plugin-content-docs',
      'current',
      relativePath
    );

    // Create directory and write file
    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, translatedMarkdown, 'utf-8');

    console.log(`\n✅ Translation complete!`);
    console.log(`📤 Output: ${path.relative(process.cwd(), outputPath)}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

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

main();
