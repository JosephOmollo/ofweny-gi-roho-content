import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const songsDir = './songs';
const files = readdirSync(songsDir).filter(f => f.endsWith('.json'));

let fixedCount = 0;

for (const file of files) {
  const filePath = join(songsDir, file);
  const song = JSON.parse(readFileSync(filePath, 'utf-8'));

  let changed = false;

  // Convert titleAlt array to comma-separated string
  if (Array.isArray(song.titleAlt)) {
    song.titleAlt = song.titleAlt.join(', ');
    changed = true;
  }

  // Convert tags array to comma-separated string
  if (Array.isArray(song.tags)) {
    song.tags = song.tags.join(', ');
    changed = true;
  }

  if (changed) {
    writeFileSync(filePath, JSON.stringify(song, null, 2) + '\n');
    fixedCount++;
    console.log(`✅ Converted arrays to strings in: ${file}`);
  }
}

console.log(`\nFinished! Fixed ${fixedCount} files.`);