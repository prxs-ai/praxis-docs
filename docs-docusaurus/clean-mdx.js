const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');

async function cleanMDXFiles() {
  console.log('🧹 Cleaning MDX files to remove duplicate imports...');
  
  const files = glob.sync('docs/**/*.md', { cwd: '.' });
  
  for (const file of files) {
    try {
      const content = await fs.readFile(file, 'utf8');
      
      // Удаляем дублирующиеся импорты
      const lines = content.split('\n');
      const cleanedLines = [];
      const seenImports = new Set();
      let inFrontmatter = false;
      let frontmatterEnded = false;
      
      for (const line of lines) {
        // Отслеживаем frontmatter
        if (line === '---') {
          if (!frontmatterEnded) {
            inFrontmatter = !inFrontmatter;
            if (!inFrontmatter) frontmatterEnded = true;
          }
          cleanedLines.push(line);
          continue;
        }
        
        if (inFrontmatter) {
          cleanedLines.push(line);
          continue;
        }
        
        // Проверяем на импорты
        if (line.startsWith('import ')) {
          if (!seenImports.has(line)) {
            seenImports.add(line);
            cleanedLines.push(line);
          }
        } else {
          cleanedLines.push(line);
        }
      }
      
      const cleanedContent = cleanedLines.join('\n');
      
      if (cleanedContent !== content) {
        await fs.writeFile(file, cleanedContent);
        console.log(`✅ Cleaned: ${file}`);
      }
    } catch (error) {
      console.error(`❌ Error cleaning ${file}:`, error.message);
    }
  }
  
  console.log('🎉 MDX cleaning completed!');
}

cleanMDXFiles().catch(console.error);