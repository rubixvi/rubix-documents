#!/bin/sh

# Compile TypeScript files
npx tsc --project tsconfig.scripts.json

# Rename .js files to .mjs in the dist/scripts directory
for file in dist/scripts/**/*.js; do
  mv "$file" "${file%.js}.mjs"
done

# Adjust the specific import in the target files
for file in dist/scripts/scripts/content.mjs dist/scripts/pageroutes.mjs; do
  # Replace the specific import
  sed -i '' 's|import { Documents } from .*/settings/documents|import { Documents } from "../settings/documents.mjs"|g' "$file"
done

# Optional: Run the renamed .mjs file
node dist/scripts/content.mjs