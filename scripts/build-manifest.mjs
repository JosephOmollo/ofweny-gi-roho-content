// scripts/build-manifest.mjs
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

const songsDir = './songs';
const files = readdirSync(songsDir).filter(f => f.endsWith('.json'));

const fileEntries = {};

for (const file of files) {
  const filePath = join(songsDir, file);
  const bytes = readFileSync(filePath);
  const hash = createHash('sha256').update(bytes).digest('hex');
  fileEntries[`songs/${file}`] = {
    sha256: hash,
    size: bytes.length
  };
}

const now = new Date();
const version = `${now.getUTCFullYear()}.${String(now.getUTCMonth() + 1).padStart(2, '0')}.${String(now.getUTCDate()).padStart(2, '0')}.1`;

const manifest = {
  contentVersion: version,
  songCount: files.length,
  generatedAt: now.toISOString(),
  files: fileEntries
};

writeFileSync('./manifest.json', JSON.stringify(manifest, null, 2));
console.log(`Manifest generated: contentVersion=${version}, songs=${files.length}`);