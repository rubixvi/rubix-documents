#!/bin/sh

npx tsc --project tsconfig.scripts.json || exit 1

find dist/scripts -name "*.js" -type f | while read file; do
  mv "$file" "${file%.js}.mjs"
done

if [ -f "dist/scripts/scripts/content.mjs" ]; then
  sed -i.bak 's|from '"'"'@/lib/pageroutes'"'"'|from '"'"'../../lib/pageroutes.mjs'"'"'|g' dist/scripts/scripts/content.mjs
  sed -i.bak 's|from '"'"'@/settings/documents'"'"'|from '"'"'../settings/documents.mjs'"'"'|g' dist/scripts/scripts/content.mjs
  sed -i.bak 's|from '"'"'@/\([^'"'"']*\)'"'"'|from '"'"'../../\1.mjs'"'"'|g' dist/scripts/scripts/content.mjs
  rm -f dist/scripts/scripts/content.mjs.bak
fi

if [ -f "dist/scripts/lib/pageroutes.mjs" ]; then
  echo "Processing pageroutes.mjs..."
  sed -i.bak 's|from '"'"'@/settings'"'"'|from '"'"'../settings/index.mjs'"'"'|g' dist/scripts/lib/pageroutes.mjs
  sed -i.bak 's|from '"'"'@/settings/documents'"'"'|from '"'"'../settings/documents.mjs'"'"'|g' dist/scripts/lib/pageroutes.mjs
  sed -i.bak 's|from '"'"'@/\([^'"'"']*\)'"'"'|from '"'"'../\1.mjs'"'"'|g' dist/scripts/lib/pageroutes.mjs
  rm -f dist/scripts/lib/pageroutes.mjs.bak
fi

node dist/scripts/scripts/content.mjs || exit 1