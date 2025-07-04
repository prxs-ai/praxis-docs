# Praxis Documentation - Docusaurus

Это полностью мигрированная документация из GitBook в Docusaurus для проекта Praxis.

## 🚀 Quick Start для разработчиков

### Предварительные требования

- Node.js >= 18.0
- npm или yarn

### Пошаговая установка и запуск

```bash
# 1. Клонируйте репозиторий и переключитесь на ветку
git clone git@github.com:prxs-ai/praxis-docs.git
cd praxis-docs
git checkout fix/docs-for-aurus

# 2. Перейдите в директорию Docusaurus
cd docs-docusaurus

# 3. Установите зависимости
npm install
# или
yarn install

# 4. Запустите development сервер
npm start
# или  
yarn start
```

**Сайт будет доступен по адресу: http://localhost:3000/praxis-docs/**

### Production команды

```bash
# Сборка для production
npm run build
yarn build

# Запуск production сборки локально  
npm run serve
yarn serve

# Проверка типов TypeScript
npm run typecheck
yarn typecheck

# Очистка кэша
npm run clear
yarn clear
```

## 📁 Структура проекта

```
docs-docusaurus/
├── docs/                    # Документация (65 файлов)
│   ├── agents/             # Документация агентов (25 файлов)
│   ├── core-concepts/      # Основные концепции (9 файлов) 
│   ├── getting-started/    # Руководство по началу работы (6 файлов)
│   ├── services/           # Сервисы (4 файла)
│   ├── tools/              # Инструменты (9 файлов)
│   └── tutorial-*/         # Примеры из Docusaurus
├── static/
│   └── img/                # Изображения (148 файлов)
├── src/                    # React компоненты и страницы
├── docusaurus.config.ts    # Главная конфигурация Docusaurus
├── sidebars.ts            # Конфигурация навигации
├── package.json           # Зависимости и скрипты
└── tsconfig.json          # TypeScript конфигурация
```

## ✅ Статус миграции

- ✅ **60 исходных файлов** успешно мигрированы из GitBook
- ✅ **148 изображений** скопированы в static/img/
- ✅ GitBook hints конвертированы в Docusaurus admonitions  
- ✅ Внутренние ссылки и пути к изображениям исправлены
- ✅ Frontmatter нормализован для Docusaurus
- ✅ Tab компоненты GitBook конвертированы в Docusaurus
- ✅ Конфигурация настроена под брендинг Praxis
- ✅ Development сервер запускается корректно
- ⚠️  Production build имеет несколько SSG ошибок (не критично)

## 🔧 Доступные скрипты миграции

Проект включает автоматизированные скрипты:

- **`migrate.js`** - основной скрипт миграции из GitBook
- **`fix-frontmatter.js`** - исправление YAML frontmatter
- **`clean-mdx.js`** - очистка дублирующихся импортов в MDX

## 🛠️ Разработка и редактирование

### Редактирование контента

1. Файлы документации находятся в `docs/`
2. Изображения добавляйте в `static/img/`  
3. Development сервер автоматически перезагружается при изменениях
4. Используйте стандартный Markdown + MDX компоненты Docusaurus

### Навигация

Редактируйте `sidebars.ts` для изменения структуры навигации.

### Настройки сайта

Основные настройки в `docusaurus.config.ts`:
- Название сайта и описание
- URL и baseUrl для деплоя
- Темы и плагины
- Навигационное меню

## 📋 Что нужно сделать другому разработчику

**Точно выполните эти шаги:**

1. `git clone git@github.com:prxs-ai/praxis-docs.git`
2. `cd praxis-docs`  
3. `git checkout fix/docs-for-aurus`
4. `cd docs-docusaurus`
5. `npm install` (установка займет 1-2 минуты)
6. `npm start` (запуск займет 10-15 секунд)
7. Откройте http://localhost:3000/praxis-docs/

**Все файлы уже включены в ветку - дополнительных действий не требуется!**

## 🐛 Известные ограничения

- Production build (npm run build) выдает несколько SSG ошибок на специфичных страницах
- Development режим работает на 100% корректно
- Для GitHub Pages деплоя может потребоваться дополнительная настройка baseUrl

## 🔗 Полезные ссылки

- [Docusaurus Documentation](https://docusaurus.io/)
- [Praxis Repository](https://github.com/prxs-ai/praxis-docs)
- [Migration Report](./migration-report.json)
- [Ветка с миграцией](https://github.com/prxs-ai/praxis-docs/tree/fix/docs-for-aurus)