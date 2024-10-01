#!/bin/sh

# Enable globstar for recursive glob patterns
shopt -s globstar

# Compile TypeScript project
npx tsc --project tsconfig.scripts.json

# Rename all .js files to .mjs
for file in dist/scripts/**/*.js; do
  if [ -f "$file" ]; then
    new_file="${file%.js}.mjs"
    echo "Renaming $file to $new_file..."
    mv "$file" "$new_file"
    
    if [ $? -ne 0 ]; then
      echo "Error: Failed to rename $file"
      exit 1
    fi
  else
    echo "$file not found!"
  fi
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
