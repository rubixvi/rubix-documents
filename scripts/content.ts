const path = require('path');
const fs = require('fs/promises');
const { Documents } = require('../settings/documents');
const { getDocument } = require('../lib/markdown');

const outputDir = path.join(process.cwd(), 'public', 'search-data');

async function generateJsonFile(slug: string, content: string, frontmatter: any) {
  const jsonFilePath = path.join(outputDir, `${slug}.json`);

  const data = {
    slug,
    title: frontmatter.title || '',
    description: frontmatter.description || '',
    content,
  };

  await fs.writeFile(jsonFilePath, JSON.stringify(data, null, 2));
  console.log(`Generated JSON for: ${slug}`);
}

async function processDocument(doc: any) {
  if ('href' in doc && typeof doc.href === 'string') {
    const slug = doc.href.replace('/', '');
    const docContent = await getDocument(slug);
    if (docContent) {
      const { frontmatter, content } = docContent;
      await generateJsonFile(slug, content, frontmatter);
    }
  }

  if ('items' in doc && Array.isArray(doc.items)) {
    for (const item of doc.items) {
      await processDocument(item);
    }
  }
}

async function processDocuments() {
  await fs.mkdir(outputDir, { recursive: true });

  for (const doc of Documents) {
    await processDocument(doc);
  }
}

processDocuments()
  .then(() => {
    console.log('Search JSON files generated successfully.');
  })
  .catch((err) => {
    console.error('Error generating search JSON files:', err);
  });
