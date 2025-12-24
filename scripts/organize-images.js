#!/usr/bin/env node
// scripts/organize-images.js
// Scans markdown files, finds all image references (relative or absolute),
// moves images to static/img/, and updates markdown paths.
// Usage: node scripts/organize-images.js --dir docs,blog --mode dry-run

const fs = require('fs');
const path = require('path');

function parseArgs() {
  const args = process.argv.slice(2);
  const out = {};
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--dir' && args[i+1]) { out.dir = args[++i]; }
    else if (a === '--mode' && args[i+1]) { out.mode = args[++i]; }
    else if (a === '--help') { out.help = true; }
  }
  return out;
}

const argv = parseArgs();
const targetDirArg = argv.dir || 'docs,blog';
const targetDirs = targetDirArg.split(',').map(s => s.trim()).filter(Boolean);
const mode = argv.mode || 'dry-run';
const projectRoot = process.cwd();
const staticImgDir = path.join(projectRoot, 'static', 'img');

function walk(dir, files=[]) {
  if (!fs.existsSync(dir)) return files;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, files);
    else if (e.name.endsWith('.md') || e.name.endsWith('.mdx')) {
      files.push(full);
    }
  }
  return files;
}

// Match markdown image syntax: ![alt](path)
const imgRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;

const imageExts = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.bmp'];

function isImagePath(p) {
  const ext = path.extname(p).toLowerCase();
  return imageExts.includes(ext);
}

function resolveImagePath(mdFilePath, imgPath) {
  // If absolute path starting with /Users or file://
  if (imgPath.startsWith('/Users') || imgPath.startsWith('file://')) {
    let cleaned = imgPath.replace(/^file:\/\//, '');
    return cleaned;
  }
  // If relative path (starts with ./ or ../)
  if (imgPath.startsWith('./') || imgPath.startsWith('../')) {
    const mdDir = path.dirname(mdFilePath);
    return path.resolve(mdDir, imgPath);
  }
  // If web path (starts with /)
  if (imgPath.startsWith('/')) {
    return null; // already a web path
  }
  // Otherwise treat as relative
  const mdDir = path.dirname(mdFilePath);
  return path.resolve(mdDir, imgPath);
}

function computeTargetPath(sourcePath, mdFilePath) {
  // Determine where in static/img/ this should go
  // Strategy: mirror the structure from docs/ or place based on markdown location

  const relativeToProject = path.relative(projectRoot, sourcePath);

  // If image is under docs/portfolio/tools/foo.png
  // Target: static/img/portfolio/tools/foo.png
  if (relativeToProject.startsWith('docs/')) {
    const afterDocs = relativeToProject.substring('docs/'.length);
    return path.join(staticImgDir, afterDocs);
  }

  // If image is already under static/img/, keep it there
  if (relativeToProject.startsWith('static/img/')) {
    return path.join(projectRoot, relativeToProject);
  }

  // Otherwise, place it relative to the markdown file's location
  const mdRelative = path.relative(projectRoot, mdFilePath);
  const mdParts = mdRelative.split(path.sep);
  // Remove filename and potentially mirror directory structure
  mdParts.pop();
  const imgName = path.basename(sourcePath);
  return path.join(staticImgDir, ...mdParts, imgName);
}

function getWebPath(targetPath) {
  const rel = path.relative(staticImgDir, targetPath);
  return '/img/' + rel.split(path.sep).join('/');
}

let files = [];
for (const dir of targetDirs) {
  if (!fs.existsSync(dir)) {
    console.warn(`Warning: Directory "${dir}" not found, skipping...`);
    continue;
  }
  files = files.concat(walk(dir));
}

const changes = [];

for (const mdFile of files) {
  const content = fs.readFileSync(mdFile, 'utf8');
  let newContent = content;
  const fileChanges = [];

  let match;
  imgRegex.lastIndex = 0;
  while ((match = imgRegex.exec(content)) !== null) {
    const alt = match[1];
    const imgPath = match[2];

    if (!isImagePath(imgPath)) continue;

    const resolvedPath = resolveImagePath(mdFile, imgPath);

    // Skip if already a web path
    if (resolvedPath === null) continue;

    // Check if image file exists
    if (!fs.existsSync(resolvedPath)) {
      console.warn(`Warning: Image not found: ${resolvedPath} (referenced in ${mdFile})`);
      continue;
    }

    const targetPath = computeTargetPath(resolvedPath, mdFile);
    const webPath = getWebPath(targetPath);

    // Skip if image is already in correct location and path is correct
    if (resolvedPath === targetPath && imgPath === webPath) {
      continue;
    }

    fileChanges.push({
      original: match[0],
      imgPath,
      resolvedPath,
      targetPath,
      webPath,
      newMarkdown: `![${alt}](${webPath})`
    });

    // Replace in content
    newContent = newContent.replace(match[0], `![${alt}](${webPath})`);
  }

  if (fileChanges.length > 0) {
    changes.push({
      mdFile,
      fileChanges,
      newContent
    });
  }
}

if (mode === 'dry-run') {
  console.log(`\n=== DRY RUN ===`);
  console.log(`Found ${changes.length} file(s) with images to organize:\n`);

  for (const change of changes) {
    console.log(`File: ${path.relative(projectRoot, change.mdFile)}`);
    for (const fc of change.fileChanges) {
      console.log(`  Image: ${path.basename(fc.resolvedPath)}`);
      console.log(`    From: ${path.relative(projectRoot, fc.resolvedPath)}`);
      console.log(`    To:   ${path.relative(projectRoot, fc.targetPath)}`);
      console.log(`    Markdown: ${fc.imgPath} → ${fc.webPath}`);
    }
    console.log('');
  }

  console.log('Run with --mode apply to execute changes.');
} else if (mode === 'apply') {
  console.log(`\n=== APPLYING CHANGES ===\n`);

  const movedImages = new Set();

  for (const change of changes) {
    // Move images
    for (const fc of change.fileChanges) {
      if (!movedImages.has(fc.resolvedPath)) {
        const targetDir = path.dirname(fc.targetPath);
        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true });
        }

        if (fc.resolvedPath !== fc.targetPath) {
          fs.copyFileSync(fc.resolvedPath, fc.targetPath);
          console.log(`Moved: ${path.relative(projectRoot, fc.resolvedPath)} → ${path.relative(projectRoot, fc.targetPath)}`);

          // Optionally delete original if it's not in static/
          if (!fc.resolvedPath.includes('/static/')) {
            fs.unlinkSync(fc.resolvedPath);
            console.log(`Deleted original: ${path.relative(projectRoot, fc.resolvedPath)}`);
          }
        }
        movedImages.add(fc.resolvedPath);
      }
    }

    // Update markdown
    fs.writeFileSync(change.mdFile, change.newContent, 'utf8');
    console.log(`Updated: ${path.relative(projectRoot, change.mdFile)}`);
  }

  console.log(`\n✅ Organized ${movedImages.size} image(s) and updated ${changes.length} markdown file(s).`);
  console.log('Run `git status` to review changes.');
}
