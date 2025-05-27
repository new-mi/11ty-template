# 11ty + JSX SSG

Статический генератор сайтов на базе Eleventy (11ty) с поддержкой JSX для создания статических сайтов.

## 🚀 Особенности

- **JSX компоненты** - Используйте JSX для создания UI компонентов
- **Eleventy SSG** - Мощный статический генератор
- **Sass поддержка** - Автоматическая компиляция SCSS/Sass
- **JavaScript сборка** - Минификация JS с помощью esbuild
- **Hot reload** - Автоматическая перезагрузка при разработке

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

## 🚀 Запуск

### Режим разработки
```bash
npm start
```

### Сборка для продакшена
```bash
npm run build
```

## 📁 Структура проекта

```
src/
├── pages/           # Страницы сайта (JSX компоненты)
├── components/      # Переиспользуемые JSX компоненты
├── layouts/         # Макеты страниц
├── assets/          # Статические ресурсы
└── shared/          # Общие данные и утилиты
└── scripts/         # Общие скрипты
└── styles/          # Общие стили
└── templates/       # Шаблоны html
```

## 🔧 Конфигурация

### Eleventy (.eleventy.js)

Основная конфигурация включает:
- Плагин для React компонентов - только для jsx синтаксиса
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

- `react` - Библиотека для создания пользовательских интерфейсов
- `eleventy` - Статический генератор сайтов
- `esbuild` - Быстрый сборщик JavaScript
- `sass` - CSS препроцессор

## 📄 Лицензия

Этот проект распространяется под лицензией ISC.

## 🔗 Полезные ссылки

- [Документация Eleventy](https://www.11ty.dev/docs/)
- [Документация React](https://react.dev/)
