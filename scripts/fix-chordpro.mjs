import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const songsDir = './songs';
const files = readdirSync(songsDir).filter(f => f.endsWith('.json'));

let fixedCount = 0;

for (const file of files) {
  const filePath = join(songsDir, file);
  const song = JSON.parse(readFileSync(filePath, 'utf-8'));

  // Replace {verse 1} with {comment: Verse 1}, etc.
  let newContent = song.content
    .replace(/\{verse (\d+)\}/gi, '{comment: Verse $1}')
    .replace(/\{chorus\}/gi, '{comment: Chorus}')
    .replace(/\{bridge\}/gi, '{comment: Bridge}')
    .replace(/\{verse\}/gi, '{comment: Verse}');

  if (newContent !== song.content) {
    song.content = newContent;
    writeFileSync(filePath, JSON.stringify(song, null, 2) + '\n');
    fixedCount++;
    console.log(`✅ Fixed ChordPro syntax in: ${file}`);
  }
}

console.log(`\nFinished! Fixed ${fixedCount} files.`);