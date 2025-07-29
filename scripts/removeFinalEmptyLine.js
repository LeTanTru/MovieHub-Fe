import fs from 'fs';

const filePath = process.argv[2];
if (!filePath) process.exit(1);

try {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  while (lines.length > 0 && lines[lines.length - 1].trim() === '') {
    lines.pop(); // remove empty lines at EOF
  }

  fs.writeFileSync(filePath, lines.join('\n'));
} catch (err) {
  console.error(`Error cleaning file ${filePath}:`, err.message);
}
