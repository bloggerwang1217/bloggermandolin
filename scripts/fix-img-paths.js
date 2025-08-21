#!/usr/bin/env node
// scripts/fix-img-paths.js
// Scans markdown files under a target directory and replaces absolute local image
// paths like "/Users/.../static/img/..." or "/Users/.../img/..." with web paths
// starting at "/img/...".
// Usage: node scripts/fix-img-paths.js --dir blog --ext md,mdx --mode dry-run
// mode: dry-run (default) | apply

const fs = require('fs');
const path = require('path');

function parseArgs() {
  const args = process.argv.slice(2);
  const out = {};
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--dir' && args[i+1]) { out.dir = args[++i]; }
    else if (a === '--ext' && args[i+1]) { out.ext = args[++i]; }
    else if (a === '--mode' && args[i+1]) { out.mode = args[++i]; }
    else if (a === '--backupDir' && args[i+1]) { out.backupDir = args[++i]; }
    else if (a === '--help') { out.help = true; }
  }
  return out;
}

const argv = parseArgs();
const targetDirArg = argv.dir || 'blog';
const targetDirs = targetDirArg.split(',').map(s => s.trim()).filter(Boolean);
const exts = (argv.ext || 'md').split(',').map(s => s.trim()).filter(Boolean);
const mode = argv.mode || 'dry-run';
const backupDir = argv.backupDir || '.imgpath_backup';

function walk(dir, files=[]) {
  if (!fs.existsSync(dir)) return files;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, files);
    else {
      const ext = path.extname(e.name).slice(1).toLowerCase();
      if (exts.includes(ext)) files.push(full);
    }
  }
  return files;
}

// Regex: optional file:/// prefix, then /Users/.../(optional static/)img/<capture>
const re = /(?:file:\/\/)??\/?\/Users\/[^"'()\s]+\/(?:static\/)?img\/([^"'()\s>]+)/g;

for (const d of targetDirs) {
  if (!fs.existsSync(d)) {
    console.error(`Warning: Target dir "${d}" not found from ${process.cwd()}`);
    // continue to next dir
  }
}

if (mode === 'apply' && !fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });

let files = [];
for (const d of targetDirs) {
  files = files.concat(walk(d));
}
let totalChanged = 0;
const changedFiles = [];

for (const f of files) {
  const text = fs.readFileSync(f, 'utf8');
  let m;
  let newText = text;
  let fileChanged = false;
  const examples = [];
  // Reset lastIndex in case of previous runs
  re.lastIndex = 0;
  while ((m = re.exec(text)) !== null) {
    const afterImg = m[1];
    const oldMatch = m[0];
    const replacement = '/img/' + afterImg;
    if (oldMatch !== replacement) {
      // Replace all occurrences of this exact oldMatch in newText
      newText = newText.split(oldMatch).join(replacement);
      fileChanged = true;
      examples.push({ before: oldMatch, after: replacement });
    }
  }
  if (fileChanged) {
    totalChanged++;
    changedFiles.push({ file: f, examples });
    if (mode === 'apply') {
      const rel = path.relative(process.cwd(), f);
      const backupPath = path.join(backupDir, rel + '.bak');
      const backupDirPath = path.dirname(backupPath);
      fs.mkdirSync(backupDirPath, { recursive: true });
      fs.writeFileSync(backupPath, text, 'utf8');
      fs.writeFileSync(f, newText, 'utf8');
    }
  }
}

if (mode === 'dry-run') {
  console.log(`Dry run: found ${totalChanged} file(s) with matches.`);
  for (const c of changedFiles) {
    console.log(`\nFile: ${c.file}`);
    for (const ex of c.examples.slice(0,5)) {
      console.log(`  - ${ex.before}  =>  ${ex.after}`);
    }
    if (c.examples.length > 5) console.log(`  ... + ${c.examples.length - 5} more`);
  }
  console.log('\nRun with --mode apply to write changes. Backups will be created under:', backupDir);
} else {
  console.log(`Applied changes to ${totalChanged} file(s). Backups in: ${backupDir}`);
  for (const c of changedFiles) console.log(' -', c.file);
  console.log('Consider running `git status` / `git diff` to review changes.');
}
