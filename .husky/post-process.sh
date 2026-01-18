#!/bin/sh

npx tsc --project tsconfig.scripts.json

for file in dist/scripts/**/*.js; do
  mv "$file" "${file%.js}.mjs"
done

for file in dist/scripts/scripts/content.mjs dist/scripts/lib/pageroutes.mjs; do
  if [ -f "$file" ]; then
    sed -i 's|from "@/settings"|from "../settings/index.mjs"|g' "$file"
    sed -i 's|from "@/settings/documents[^"]*"|from "../settings/documents.mjs"|g' "$file"
    sed -i 's|from "@/|from ../|g' "$file"
  fi
done

node dist/scripts/scripts/content.mjs || exit 1
