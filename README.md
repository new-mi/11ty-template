# 11ty + React SSG

Статический генератор сайтов на базе Eleventy (11ty) с поддержкой React компонентов. Проект позволяет создавать статические сайты, используя React для компонентов и Eleventy для генерации HTML.

## 🚀 Особенности

- **React компоненты** - Используйте React для создания переиспользуемых UI компонентов
- **Eleventy SSG** - Мощный статический генератор с гибкой конфигурацией
- **Sass поддержка** - Автоматическая компиляция SCSS/Sass файлов
- **JavaScript сборка** - Сборка и минификация JS с помощью esbuild
- **Hot reload** - Автоматическая перезагрузка при разработке
- **Форматирование кода** - Автоматическое форматирование HTML с Prettier

## 📋 Требования

- Node.js v23.9.0 (рекомендуется использовать nvm)
- npm или yarn

## 🛠 Установка

1. Клонируйте репозиторий:
```bash
git clone <repository-url>
cd 11ty-react
```

2. Установите зависимости:
```bash
npm install
```

3. (Опционально) Используйте правильную версию Node.js:
```bash
nvm use
```

## 🚀 Запуск

### Режим разработки
```bash
npm start
```
Запускает сервер разработки с hot reload на `http://localhost:8080`

### Сборка для продакшена
```bash
npm run build
```
Создает оптимизированную сборку в папке `dist/`

## 📁 Структура проекта

```
src/
├── pages/           # Страницы сайта (React компоненты)
│   ├── index.jsx    # Главная страница
│   ├── about.jsx    # Страница "О нас"
│   └── contacts.jsx # Страница контактов
├── components/      # Переиспользуемые React компоненты
│   ├── Button/      # Компонент кнопки
│   └── Header/      # Компонент шапки
├── layouts/         # Макеты страниц
│   └── DefaultLayout.jsx
├── templates/       # HTML шаблоны
│   └── BaseHtml.jsx # Базовый HTML документ
├── assets/          # Статические ресурсы
│   ├── css/         # SCSS/Sass файлы
│   ├── js/          # JavaScript файлы
│   ├── images/      # Изображения
│   └── fonts/       # Шрифты
├── shared/          # Общие данные и утилиты
├── styles/          # Дополнительные стили
└── scripts/         # Дополнительные скрипты
```

## 🔧 Конфигурация

### Eleventy (.eleventy.js)

Основная конфигурация включает:
- Плагин для React компонентов
- Автоматическая сборка Sass и JavaScript
- Копирование статических ресурсов
- Форматирование HTML с Prettier
- Настройка путей для входных и выходных файлов

### Сборка стилей

Все `.scss` и `.sass` файлы из `src/assets/css/` автоматически компилируются в CSS и помещаются в `dist/assets/css/`.

### Сборка JavaScript

JavaScript файлы из `src/assets/js/` собираются с помощью esbuild и помещаются в `dist/assets/js/`.

## 📝 Создание страниц

Создайте новый файл `.jsx` в папке `src/pages/`:

```jsx
import React from "react";
import DefaultLayout from "../layouts/DefaultLayout";
import { metaPages } from "../shared/meta-pages";

export default function MyPage() {
  return (
    <DefaultLayout meta={metaPages.myPage}>
      <h1>Моя новая страница</h1>
      <p>Содержимое страницы...</p>
    </DefaultLayout>
  );
}
```

## 🎨 Создание компонентов

Создайте папку для компонента в `src/components/`:

```jsx
// src/components/MyComponent/MyComponent.jsx
import React from "react";

export function MyComponent({ children, ...props }) {
  return (
    <div className="my-component" {...props}>
      {children}
    </div>
  );
}
```

## 📦 Зависимости

### Основные зависимости
- `react` - Библиотека для создания пользовательских интерфейсов
- `react-dom` - DOM-специфичные методы для React

### Зависимости разработки
- `eleventy` - Статический генератор сайтов
- `eleventy-plugin-react` - Плагин для поддержки React в Eleventy
- `esbuild` - Быстрый сборщик JavaScript
- `sass` - CSS препроцессор
- `prettier` - Форматировщик кода
- `clsx` - Утилита для работы с CSS классами

## 📄 Лицензия

Этот проект распространяется под лицензией ISC.

## 🔗 Полезные ссылки

- [Документация Eleventy](https://www.11ty.dev/docs/)
- [Документация React](https://react.dev/)
- [esbuild](https://esbuild.github.io/)
- [Sass](https://sass-lang.com/)
