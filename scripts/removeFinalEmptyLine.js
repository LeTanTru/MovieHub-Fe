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
  const originalLength = lines.length;

  // Đếm số dòng trắng ở cuối
  let i = lines.length - 1;
  while (i >= 0 && lines[i].trim() === '') i--;

  const emptyLineCount = lines.length - 1 - i;

  if (emptyLineCount > 0) {
    console.log(`⚠️  ${filePath} has ${emptyLineCount} empty line(s) at end`);
    // Xoá dòng trắng cuối
    const cleaned = lines.slice(0, i + 1);
    fs.writeFileSync(filePath, cleaned.join('\n'));
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
