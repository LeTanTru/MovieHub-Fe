import fs from 'fs';
import path from 'path';

const TARGET_DIR = 'src/app';
const FILE_EXTENSIONS = [
  '.js',
  '.ts',
  '.jsx',
  '.tsx',
  '.css',
  '.scss',
  '.md',
  '.html'
];

function shouldProcess(file) {
  return FILE_EXTENSIONS.includes(path.extname(file));
}

function removeFinalEmptyLine(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  let changed = false;

  while (lines.length > 0 && lines[lines.length - 1].trim() === '') {
    lines.pop();
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, lines.join('\n'));
    console.log(`🧹 Cleaned: ${filePath}`);
  }
}

function scanDirectory(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      scanDirectory(fullPath);
    } else if (entry.isFile() && shouldProcess(entry.name)) {
      removeFinalEmptyLine(fullPath);
    }
  }
}

try {
  scanDirectory(TARGET_DIR);
} catch (err) {
  console.error('❌ Error while scanning:', err.message);
}
