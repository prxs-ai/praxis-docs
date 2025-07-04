const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');

class GitBookToDocusaurus {
  constructor(inputDir, outputDir) {
    this.inputDir = inputDir;
    this.outputDir = outputDir;
    this.sidebar = [];
    this.fileMapping = new Map();
    this.warnings = [];
    this.errors = [];
  }

  async migrate() {
    console.log('🚀 Starting GitBook to Docusaurus migration...');
    
    try {
      // 1. Парсим SUMMARY.md
      await this.parseSummary();
      
      // 2. Копируем и конвертируем файлы
      await this.processMarkdownFiles();
      
      // 3. Обрабатываем медиа файлы
      await this.processMediaFiles();
      
      // 4. Генерируем sidebars.js
      await this.generateSidebar();
      
      // 5. Создаём отчёт о миграции
      await this.generateReport();
      
      console.log('✅ Migration completed successfully!');
      return true;
    } catch (error) {
      console.error('❌ Migration failed:', error);
      this.errors.push(error.message);
      return false;
    }
  }

  async parseSummary() {
    const summaryPath = path.join(this.inputDir, 'SUMMARY.md');
    if (!fs.existsSync(summaryPath)) {
      this.warnings.push('SUMMARY.md not found, will use directory structure');
      return;
    }

    const content = await fs.readFile(summaryPath, 'utf8');
    const lines = content.split('\n');
    
    console.log('📋 Parsing SUMMARY.md...');
    
    lines.forEach((line, index) => {
      const match = line.match(/^(\s*)\*\s+\[(.+?)\]\((.+?)\)/);
      if (match) {
        const [_, spaces, title, filePath] = match;
        const level = spaces.length / 2;
        
        // Очищаем путь и создаём новый для Docusaurus
        const cleanPath = this.cleanPath(filePath);
        const newPath = this.generateNewPath(cleanPath, title, level);
        
        this.fileMapping.set(filePath, newPath);
        console.log(`📄 Mapped: ${filePath} -> ${newPath}`);
      }
    });
  }

  cleanPath(filePath) {
    return filePath
      .replace(/\.md$/, '')
      .replace(/\s+/g, '-')
      .replace(/[^\w\-\/]/g, '')
      .toLowerCase();
  }

  generateNewPath(cleanPath, title, level) {
    // Генерируем путь основываясь на структуре директорий
    const segments = cleanPath.split('/');
    const fileName = segments[segments.length - 1];
    
    // Создаём slug из заголовка
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    // Если это не корневой файл, сохраняем структуру директорий
    if (segments.length > 1) {
      return segments.slice(0, -1).join('/') + '/' + (slug || fileName);
    }
    
    return slug || fileName;
  }

  async processMarkdownFiles() {
    console.log('🔄 Processing markdown files...');
    
    const files = glob.sync('**/*.md', { 
      cwd: this.inputDir,
      ignore: ['SUMMARY.md', 'migration/**']
    });

    for (const file of files) {
      try {
        await this.convertFile(file);
      } catch (error) {
        console.error(`❌ Failed to process ${file}:`, error);
        this.errors.push(`Failed to process ${file}: ${error.message}`);
      }
    }
  }

  async convertFile(filePath) {
    const inputPath = path.join(this.inputDir, filePath);
    const content = await fs.readFile(inputPath, 'utf8');
    
    console.log(`📝 Converting: ${filePath}`);
    
    // Конвертируем контент
    let converted = content;
    
    // 1. Конвертируем GitBook hints в Docusaurus admonitions
    converted = this.convertHints(converted);
    
    // 2. Конвертируем tabs
    converted = this.convertTabs(converted);
    
    // 3. Конвертируем embeds
    converted = this.convertEmbeds(converted);
    
    // 4. Исправляем внутренние ссылки
    converted = this.fixInternalLinks(converted);
    
    // 5. Исправляем пути к изображениям
    converted = this.fixImagePaths(converted);
    
    // 6. Добавляем frontmatter
    converted = this.addFrontmatter(converted, filePath);
    
    // Сохраняем файл
    const outputPath = this.fileMapping.get(filePath) || this.cleanPath(filePath);
    const fullOutputPath = path.join(this.outputDir, outputPath + '.md');
    
    await fs.ensureDir(path.dirname(fullOutputPath));
    await fs.writeFile(fullOutputPath, converted);
    
    console.log(`✅ Converted: ${filePath} -> ${outputPath}.md`);
  }

  convertHints(content) {
    // {% hint style="info" %} ... {% endhint %}
    return content.replace(
      /{% hint style="(\w+)" %}([\s\S]*?){% endhint %}/g,
      (match, style, text) => {
        const docusaurusStyle = {
          'info': 'info',
          'warning': 'warning',
          'danger': 'danger',
          'success': 'tip',
          'note': 'note'
        }[style] || 'note';
        
        return `:::${docusaurusStyle}\n${text.trim()}\n:::`;
      }
    );
  }

  convertTabs(content) {
    // {% tabs %} {% tab title="Title" %} ... {% endtab %} {% endtabs %}
    return content.replace(
      /{% tabs %}([\s\S]*?){% endtabs %}/g,
      (match, tabsContent) => {
        const tabs = [];
        const tabRegex = /{% tab title="([^"]+)" %}([\s\S]*?){% endtab %}/g;
        let tabMatch;
        
        while ((tabMatch = tabRegex.exec(tabsContent)) !== null) {
          tabs.push({
            label: tabMatch[1],
            value: tabMatch[1].toLowerCase().replace(/\s+/g, '-'),
            content: tabMatch[2].trim()
          });
        }
        
        if (tabs.length === 0) return match;
        
        let result = 'import Tabs from \'@theme/Tabs\';\nimport TabItem from \'@theme/TabItem\';\n\n';
        result += '<Tabs>\n';
        tabs.forEach(tab => {
          result += `  <TabItem value="${tab.value}" label="${tab.label}">\n\n`;
          result += tab.content.split('\n').map(line => '    ' + line).join('\n');
          result += '\n\n  </TabItem>\n';
        });
        result += '</Tabs>';
        
        return result;
      }
    );
  }

  convertEmbeds(content) {
    // {% embed url="https://..." %} или {% embed url="https://..." caption="..." %}
    return content.replace(
      /{% embed url="([^"]+)"(?:\s+caption="([^"]+)")? %}/g,
      (match, url, caption) => {
        // Определяем тип embed
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
          const videoId = this.extractYouTubeId(url);
          return `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameBorder="0" allowFullScreen></iframe>`;
        } else if (url.includes('codepen.io')) {
          return `<iframe src="${url}" style={{width:'100%', height:'500px', border:'0', borderRadius: '4px', overflow:'hidden'}} sandbox="allow-scripts allow-same-origin"></iframe>`;
        } else {
          // Общий iframe
          return `<iframe src="${url}" style={{width:'100%', height:'500px', border:'0'}}></iframe>`;
        }
      }
    );
  }

  extractYouTubeId(url) {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : '';
  }

  fixInternalLinks(content) {
    // Заменяем внутренние ссылки на .md файлы
    return content.replace(
      /\[([^\]]+)\]\(([^)]+\.md)\)/g,
      (match, text, link) => {
        const mappedLink = this.fileMapping.get(link);
        if (mappedLink) {
          return `[${text}](${mappedLink})`;
        }
        
        // Если маппинг не найден, пытаемся очистить ссылку
        const cleanLink = this.cleanPath(link);
        return `[${text}](${cleanLink})`;
      }
    );
  }

  fixImagePaths(content) {
    // Исправляем пути к изображениям для Docusaurus
    return content.replace(
      /!\[([^\]]*)\]\(([^)]+)\)/g,
      (match, alt, src) => {
        // Если это относительный путь к изображению
        if (!src.startsWith('http') && !src.startsWith('/')) {
          // Переносим в static/img
          const fileName = path.basename(src);
          return `![${alt}](/img/${fileName})`;
        }
        return match;
      }
    );
  }

  addFrontmatter(content, filePath) {
    // Проверяем, есть ли уже frontmatter
    if (content.startsWith('---')) {
      return content;
    }
    
    // Генерируем title из имени файла или первого заголовка
    let title = path.basename(filePath, '.md')
      .replace(/-/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
    
    // Пытаемся найти первый заголовок
    const h1Match = content.match(/^#\s+(.+)$/m);
    if (h1Match) {
      title = h1Match[1];
    }
    
    const frontmatter = `---
title: ${title}
---

`;
    
    return frontmatter + content;
  }

  async processMediaFiles() {
    console.log('🖼️ Processing media files...');
    
    const mediaExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'];
    const mediaFiles = glob.sync('**/*', { 
      cwd: this.inputDir,
      nodir: true,
      ignore: ['migration/**']
    }).filter(file => 
      mediaExtensions.includes(path.extname(file).toLowerCase())
    );

    const staticImgDir = path.join(this.outputDir, '../static/img');
    await fs.ensureDir(staticImgDir);

    for (const file of mediaFiles) {
      try {
        const inputPath = path.join(this.inputDir, file);
        const fileName = path.basename(file);
        const outputPath = path.join(staticImgDir, fileName);
        
        await fs.copy(inputPath, outputPath);
        console.log(`📷 Copied media: ${file} -> static/img/${fileName}`);
      } catch (error) {
        console.error(`❌ Failed to copy ${file}:`, error);
        this.errors.push(`Failed to copy ${file}: ${error.message}`);
      }
    }
  }

  async generateSidebar() {
    console.log('📑 Generating sidebar configuration...');
    
    const sidebarConfig = {
      tutorialSidebar: [
        {
          type: 'autogenerated',
          dirName: '.'
        }
      ]
    };
    
    const sidebarPath = path.join(this.outputDir, '../sidebars.js');
    const sidebarContent = `module.exports = ${JSON.stringify(sidebarConfig, null, 2)};`;
    
    await fs.writeFile(sidebarPath, sidebarContent);
    console.log('✅ Sidebar generated');
  }

  async generateReport() {
    console.log('📊 Generating migration report...');
    
    const report = {
      timestamp: new Date().toISOString(),
      filesProcessed: this.fileMapping.size,
      mappings: Array.from(this.fileMapping.entries()),
      warnings: this.warnings,
      errors: this.errors,
      summary: {
        totalFiles: this.fileMapping.size,
        successfullyProcessed: this.fileMapping.size - this.errors.length,
        errors: this.errors.length,
        warnings: this.warnings.length
      }
    };
    
    const reportPath = path.join(this.outputDir, '../migration-report.json');
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    
    console.log('📊 Migration report generated at:', reportPath);
    console.log(`📈 Summary: ${report.summary.successfullyProcessed}/${report.summary.totalFiles} files processed successfully`);
    
    if (this.warnings.length > 0) {
      console.log(`⚠️  Warnings: ${this.warnings.length}`);
      this.warnings.forEach(warning => console.log(`   - ${warning}`));
    }
    
    if (this.errors.length > 0) {
      console.log(`❌ Errors: ${this.errors.length}`);
      this.errors.forEach(error => console.log(`   - ${error}`));
    }
  }
}

// Основная функция для запуска миграции
async function main() {
  const args = process.argv.slice(2);
  const inputDir = args[0] || './';
  const outputDir = args[1] || './docs';
  
  console.log(`🎯 Input directory: ${inputDir}`);
  console.log(`🎯 Output directory: ${outputDir}`);
  
  const migrator = new GitBookToDocusaurus(inputDir, outputDir);
  const success = await migrator.migrate();
  
  process.exit(success ? 0 : 1);
}

// Запуск только если файл выполняется напрямую
if (require.main === module) {
  main().catch(console.error);
}

module.exports = GitBookToDocusaurus;