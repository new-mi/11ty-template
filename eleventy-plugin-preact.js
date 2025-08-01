import { h } from 'preact';
import renderToString from 'preact-render-to-string';
import * as esbuild from 'esbuild';
import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

// Кэш для скомпилированных компонентов
const componentCache = new Map();
// Кэш для временных файлов
const tempFileCleanup = new Set();
// Кэш для отслеживания зависимостей файлов
const dependencyCache = new Map();

// Функция для получения максимального времени модификации файла и его зависимостей
function getMaxModificationTime(filePath, visited = new Set()) {
  if (visited.has(filePath)) {
    return 0; // Избегаем циклических зависимостей
  }
  visited.add(filePath);

  try {
    if (!fs.existsSync(filePath)) {
      return 0;
    }

    let maxTime = fs.statSync(filePath).mtime.getTime();

    // Получаем зависимости из кэша
    const dependencies = dependencyCache.get(filePath) || [];

    for (const depPath of dependencies) {
      const depTime = getMaxModificationTime(depPath, visited);
      maxTime = Math.max(maxTime, depTime);
    }

    return maxTime;
  } catch {
    return 0;
  }
}

function forceDefaultExport(code) {
  // 1. Если уже есть export { ... as default }, ничего не добавляем
  const exportAsDefault = code.match(/export\s*\{\s*(\w+)\s+as\s+default\s*\}/ms);
  if (exportAsDefault) {
    return code; // Уже есть export default, ничего не добавляем
  }
  // 2. function Имя(...)
  const funcMatch = code.match(/function (\w+)\s*\(/);
  if (funcMatch) {
    const name = funcMatch[1];
    return code + `\nexport default ${name};`;
  }
  // 3. const Имя = ...
  const constMatch = code.match(/const (\w+)\s*=\s*/);
  if (constMatch) {
    const name = constMatch[1];
    return code + `\nexport default ${name};`;
  }
  // 4. let Имя = ...
  const letMatch = code.match(/let (\w+)\s*=\s*/);
  if (letMatch) {
    const name = letMatch[1];
    return code + `\nexport default ${name};`;
  }
  // 5. var Имя = ...
  const varMatch = code.match(/var (\w+)\s*=\s*/);
  if (varMatch) {
    const name = varMatch[1];
    return code + `\nexport default ${name};`;
  }
  throw new Error('No recognizable component found');
}

// Функция для очистки всех временных файлов
function cleanupTempFiles() {
  for (const tempFile of tempFileCleanup) {
    try {
      if (fs.existsSync(tempFile)) {
        fs.unlinkSync(tempFile);
      }
    } catch {
      // Игнорируем ошибки очистки
    }
  }
  tempFileCleanup.clear();
}

// Функция для очистки устаревших кэшей
function cleanupStaleCache({ logger }) {
  const staleCacheKeys = [];

  for (const [cacheKey] of componentCache) {
    const [filePath] = cacheKey.split(':');
    const currentMaxMtime = getMaxModificationTime(filePath);
    const cachedMtime = parseInt(cacheKey.split(':')[1]);

    if (currentMaxMtime > cachedMtime) {
      staleCacheKeys.push(cacheKey);
    }
  }

  for (const staleKey of staleCacheKeys) {
    componentCache.delete(staleKey);
  }

  if (staleCacheKeys.length > 0) {
    logger.stats(`🧹 Cleaned ${staleCacheKeys.length} stale cache entries`);
  }
}

// Очистка при завершении процесса
process.on('exit', cleanupTempFiles);
process.on('SIGINT', () => {
  cleanupTempFiles();
  process.exit(0);
});
process.on('SIGTERM', () => {
  cleanupTempFiles();
  process.exit(0);
});

// Оптимизированная очистка кэша - работает с умным кэшированием
function optimizedCacheCleanup({ logger }) {
  // Используем существующую логику cleanupStaleCache для умной очистки
  cleanupStaleCache({ logger });
}

export default function eleventyPreactPlugin(eleventyConfig, options = {}) {
  const {
    minify = false,
    postProcess = ({ html }) => html,
    jsxImportSource = 'preact',
    enableCache = true,
    cacheSize = 100,
    logger = {
      enabled: false,
      info: (...args) => {},
      error: (...args) => {},
      stats: (...args) => {}
    }
  } = options;

  eleventyConfig.addTemplateFormats('jsx');

  eleventyConfig.addExtension('jsx', {
    read: true, // Читаем файл как обычный шаблон
    getData: true,
    getInstanceFromInputPath: (inputPath) => ({
        inputPath,
        getData: async () => {
          const content = fs.readFileSync(inputPath, 'utf8');
          return { content };
        }
      }),
    compile: async (_, inputPath) => async (data) => {
        const startTime = Date.now();
        let tempFile = null;

                        try {
          // Умная очистка устаревших кэшей
          if (enableCache) {
            optimizedCacheCleanup({ logger });
          }

          // Читаем содержимое файла и проверяем кэш
          const fileContent = fs.readFileSync(inputPath, 'utf8');

          // Получаем максимальное время модификации с учетом зависимостей
          const maxMtime = getMaxModificationTime(inputPath);
          const cacheKey = `${inputPath}:${maxMtime}`;

          let Component;

          if (enableCache && componentCache.has(cacheKey)) {
            Component = componentCache.get(cacheKey);
            logger.stats(`📦 Cache hit for ${path.basename(inputPath)} (${Date.now() - startTime}ms)`);
          } else {
            // Компилируем JSX в ESM с bundle: true для объединения импортов
            const result = await esbuild.build({
              stdin: {
                contents: fileContent,
                loader: 'jsx',
                resolveDir: path.dirname(inputPath)
              },
              jsx: 'automatic',
              jsxImportSource: jsxImportSource,
              format: 'esm',
              minify: minify,
              target: 'es2020',
              platform: 'node',
              bundle: true,
              write: false,
              // Включаем metafile для отслеживания зависимостей
              metafile: true,
              sourcemap: false,
              treeShaking: true,
            });

            // Обновляем кэш зависимостей
            if (result.metafile?.inputs) {
              const dependencies = Object.keys(result.metafile.inputs)
                .filter(dep => dep !== '<stdin>' && fs.existsSync(dep))
                .map(dep => path.resolve(dep));

              dependencyCache.set(inputPath, dependencies);

              logger.stats(`📋 Dependencies for ${path.basename(inputPath)}: ${dependencies.map(d => path.basename(d)).join(', ')}`);
            }

            // Добавляем export default <ИмяКомпонента> если нужно
            const code = forceDefaultExport(result.outputFiles[0].text);

            // Создаем временный .mjs файл с уникальным именем
            const uniqueId = randomUUID();
            tempFile = path.join(process.cwd(), `.temp-component-${uniqueId}.mjs`);
            fs.writeFileSync(tempFile, code);
            tempFileCleanup.add(tempFile);

            const componentModule = await import(`file://${tempFile}`);
            Component = componentModule.default;
            if (!Component) {
              throw new Error(`No default export found in ${inputPath}`);
            }

            // Кэшируем компонент
            if (enableCache) {
              // Ограничиваем размер кэша
              if (componentCache.size >= cacheSize) {
                const firstKey = componentCache.keys().next().value;
                componentCache.delete(firstKey);
              }
              componentCache.set(cacheKey, Component);
            }

            logger.stats(`🔨 Compiled ${path.basename(inputPath)} (${Date.now() - startTime}ms)`);
          }

          // SSR через preact-render-to-string
          const html = renderToString(h(Component, data));
          return postProcess({ html, data });
        } catch (error) {
          logger.error(`❌ Error processing ${inputPath}:`, error.message);
          throw error;
        } finally {
          // Очищаем временный файл сразу после использования
          if (tempFile && fs.existsSync(tempFile)) {
            try {
              fs.unlinkSync(tempFile);
              tempFileCleanup.delete(tempFile);
            } catch {
              // Игнорируем ошибки очистки
            }
          }
        }
      }
  });

  eleventyConfig.addLayoutAlias('jsx', 'jsx');

  return {
    name: 'eleventy-plugin-preact'
  };
}
