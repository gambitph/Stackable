# Site Kit schema fixtures

`valid/consultant/` is the canonical version 1 export fixture.
It contains pages, FSE data, templates, template parts, navigation, Stackable settings, plugin data, and package-local media.

`invalid-cases.json` applies small mutations to the canonical fixture.
Each case names the exact validator error code it must produce.
This keeps the valid package as the single source of fixture data while covering unknown versions, invalid paths, directory-slug mismatches, missing files, and external media URLs.

Validate the canonical package with:

```bash
npm run validate:site-kit -- e2e/config/fixtures/site-kits/valid/consultant
```
