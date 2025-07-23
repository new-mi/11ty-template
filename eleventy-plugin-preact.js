import { h } from 'preact';
import renderToString from 'preact-render-to-string';
import * as esbuild from 'esbuild';
import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

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

export default function eleventyPreactPlugin(eleventyConfig, options = {}) {
  const {
    minify = false,
    postProcess = (html, data) => html,
    jsxImportSource = 'preact'
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
        let tempFile = null;

        try {
          // Читаем содержимое файла вручную, так как inputContent может быть пустым
          const fileContent = fs.readFileSync(inputPath, 'utf8');

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
            // Оптимизации для больших проектов
            treeShaking: true,
            metafile: false,
            sourcemap: false
          });

          // Добавляем export default <ИмяКомпонента> если нужно
          const code = forceDefaultExport(result.outputFiles[0].text);

          // Создаем временный .mjs файл с уникальным именем
          const uniqueId = randomUUID();
          tempFile = path.join(process.cwd(), `.temp-component-${uniqueId}.mjs`);
          fs.writeFileSync(tempFile, code);

          const componentModule = await import(`file://${tempFile}`);
          const Component = componentModule.default;
          if (!Component) {
            throw new Error(`No default export found in ${inputPath}`);
          }

          // SSR через preact-render-to-string
          const html = renderToString(h(Component, data));
          return postProcess({ html, data });
        } catch (error) {
          console.error(`Error processing ${inputPath}:`, error);
          throw error;
        } finally {
          // Очищаем временный файл
          if (tempFile && fs.existsSync(tempFile)) {
            try {
              fs.unlinkSync(tempFile);
            } catch (cleanupError) {
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
