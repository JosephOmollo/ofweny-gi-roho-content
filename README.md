# Ofweny Gi Roho - Content Repository

This repository contains the song data for the Ofweny Gi Roho app.

## 🎵 Adding or Editing Songs
Do **not** edit the JSON files directly on GitHub. Use the admin panel:
1. Go to [Pages CMS](https://app.pagescms.org/)
2. Log in with GitHub.
3. Select this repository and make your edits.

## ⚙️ Automation
When you save a song in Pages CMS, a GitHub Action automatically runs to:
1. Validate the JSON against `schemas/song.schema.json`.
2. Check that the ChordPro lyrics are syntactically correct.
3. Check for duplicate song numbers.
4. Rebuild the `manifest.json` file used by the mobile app.

If the validation fails, the GitHub Action will fail, and your app will not receive the broken update.
