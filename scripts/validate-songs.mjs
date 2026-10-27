import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import ChordSheetJS from 'chordsheetjs';

const { ChordProParser } = ChordSheetJS;

const ajv = new Ajv({ allErrors: true });
addFormats(ajv); // <--- THIS LINE IS CRUCIAL

const schema = JSON.parse(readFileSync('./schemas/song.schema.json', 'utf-8'));
const validate = ajv.compile(schema);

const songsDir = './songs';
const files = readdirSync(songsDir).filter(f => f.endsWith('.json'));

let hasErrors = false;
const seenNumbers = new Map();

for (const file of files) {
  const filePath = join(songsDir, file);
  const raw = readFileSync(filePath, 'utf-8');
  let song;

  try {
    song = JSON.parse(raw);
  } catch (e) {
    console.error(`❌ ${file}: Invalid JSON — ${e.message}`);
    hasErrors = true;
    continue;
  }

  const valid = validate(song);
  if (!valid) {
    console.error(`❌ ${file}: Schema validation failed`);
    console.error(validate.errors);
    hasErrors = true;
    continue;
  }

  // Validate ChordPro syntax
  try {
    const parser = new ChordProParser();
    parser.parse(song.content);
  } catch (e) {
    console.error(`❌ ${file}: ChordPro parse error — ${e.message}`);
    hasErrors = true;
    continue;
  }

  // Check for duplicate song numbers
  if (song.number !== undefined) {
    if (seenNumbers.has(song.number)) {
      console.error(`❌ ${file}: duplicate number ${song.number} — already used by ${seenNumbers.get(song.number)}`);
      hasErrors = true;
      continue;
    }
    seenNumbers.set(song.number, file);
  }

  console.log(`✅ ${file}: OK`);
}

if (hasErrors) {
  process.exit(1);
} else {
  console.log(`\nAll ${files.length} songs are valid.`);
}