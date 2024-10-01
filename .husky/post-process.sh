#!/bin/sh

echo "Starting TypeScript compilation..."
npx tsc --project tsconfig.scripts.json
echo "TypeScript compilation complete."

echo "Renaming .js files to .mjs..."
find dist/scripts -name "*.js" | while read file; do
  mv -f "$file" "${file%.js}.mjs"
  if [ $? -ne 0 ]; then
    echo "Error renaming $file"
    exit 1
  fi
  echo "Renamed $file to ${file%.js}.mjs"
done

for file in dist/scripts/scripts/content.mjs dist/scripts/lib/pageroutes.mjs; do
  if [ -f "$file" ]; then
    echo "Processing $file..."

    sed -i 's|import { Documents } from '\''@/settings/documents'\''|import { Documents } from '\''../settings/documents.mjs'\''|g' "$file"

    if [ $? -ne 0 ]; then
      echo "Error: Failed to update $file"
      exit 1
    fi
    
    echo "$file updated successfully."
  else
    echo "$file not found!"
  fi
done

node dist/scripts/scripts/content.mjs || exit 1
