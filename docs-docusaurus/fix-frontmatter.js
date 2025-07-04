const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');

async function fixFrontmatter() {
  console.log('🔧 Fixing frontmatter in all markdown files...');
  
  const files = glob.sync('docs/**/*.md', { cwd: '.' });
  
  for (const file of files) {
    try {
      const content = await fs.readFile(file, 'utf8');
      
      // Проверяем есть ли frontmatter
      if (content.startsWith('---')) {
        const lines = content.split('\n');
        let frontmatterEnd = -1;
        
        // Находим конец frontmatter
        for (let i = 1; i < lines.length; i++) {
          if (lines[i] === '---') {
            frontmatterEnd = i;
            break;
          }
        }
        
        if (frontmatterEnd > 0) {
          // Извлекаем frontmatter и контент
          const frontmatterLines = lines.slice(1, frontmatterEnd);
          const contentLines = lines.slice(frontmatterEnd + 1);
          
          // Исправляем title
          let fixedFrontmatter = [];
          for (const line of frontmatterLines) {
            if (line.startsWith('title:')) {
              const title = line.substring(6).trim();
              // Если title не в кавычках и содержит специальные символы, заключаем в кавычки
              if (!title.startsWith('"') && !title.startsWith("'")) {
                fixedFrontmatter.push(`title: "${title}"`);
              } else {
                fixedFrontmatter.push(line);
              }
            } else {
              fixedFrontmatter.push(line);
            }
          }
          
          // Собираем обратно
          const fixedContent = [
            '---',
            ...fixedFrontmatter,
            '---',
            ...contentLines
          ].join('\n');
          
          await fs.writeFile(file, fixedContent);
          console.log(`✅ Fixed: ${file}`);
        }
      }
    } catch (error) {
      console.error(`❌ Error fixing ${file}:`, error.message);
    }
  }
  
  console.log('🎉 Frontmatter fix completed!');
}

fixFrontmatter().catch(console.error);