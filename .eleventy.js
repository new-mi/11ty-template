import eleventyPreact from "./eleventy-plugin-preact.js";
import * as sass from "sass";
import * as esbuild from "esbuild";
import fs from "fs";
import path from "path";
import * as prettier from "prettier";
import {deleteSync} from "del";

const config = {
	quiet: true,
	dir: {
		input: "src/pages",
		output: "dist",
		includes: "../components",
		layouts: "../layouts",
	},
}

const dirToClean = path.join(config.dir.output, "*")
deleteSync(dirToClean, { dot: true })
console.log("Cleaned dist directory")

export default async function(eleventyConfig) {
	eleventyConfig.setServerOptions({
		port: 3000,
	})


  eleventyConfig.addGlobalData("permalink", () => {
		return (data) =>
			`${data.page.filePathStem}.${data.page.outputFileExtension}`;
	});

  eleventyConfig.addPlugin(eleventyPreact, {
		minify: false,
    enableCache: true,
    cacheSize: 100,
    enableStats: true, // Включаем статистику для мониторинга производительности
    postProcess: ({ html, data }) => {
			const resultHtml = `<!DOCTYPE html>${html}`
			const formattedHtml = prettier.format(resultHtml, {
				parser: "html",
				singleAttributePerLine: false,
				useTabs: true,
				tabWidth: 2,
				bracketSameLine: true,
			});
      return formattedHtml;
    }
  });

	const watchTargets = [
		"./src/assets/css",
		"./src/assets/js",
		"./src/templates",
		"./src/shared",
		"./src/scripts",
		"./src/styles",
	]
	watchTargets.forEach(target => {
		eleventyConfig.addWatchTarget(target);
	});

	eleventyConfig.addPassthroughCopy({
		"src/assets/images": "assets/images",
		"src/assets/fonts": "assets/fonts",
	});

  eleventyConfig.addPassthroughCopy({
    "src/assets/images": "assets/images",
    "src/assets/fonts": "assets/fonts",
  });

  eleventyConfig.on("beforeBuild", async () => {
    await buildSass();
    await buildJS();
  });

  return config;
};

async function buildSass() {
  const sassDir = path.resolve(import.meta.dirname, "src/assets/css");
  const outDir = path.resolve(import.meta.dirname, "dist/assets/css");

  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const files = fs.readdirSync(sassDir).filter(f => f.endsWith(".sass") || f.endsWith(".scss"));
  files.forEach(filename => {
		const isMinify = filename.endsWith(".min.scss") || filename.endsWith(".min.sass");
    const result = sass.compile(path.join(sassDir, filename), {
      sourceMap: false,
      style: isMinify ? 'compressed' : 'expanded',
    });
    fs.writeFileSync(path.join(outDir, filename.replace(/\.(sass|scss)$/, ".css")), result.css);
  });
}

async function buildJS() {
  const jsDir = path.resolve(import.meta.dirname, "src/assets/js");
  const outDir = path.resolve(import.meta.dirname, "dist/assets/js");

  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const files = fs.readdirSync(jsDir).filter(f => f.endsWith(".js"));

  await Promise.all(files.map(filename => {
    return esbuild.build({
      entryPoints: [path.join(jsDir, filename)],
      bundle: true,
      minify: filename.endsWith(".min.js"),
      sourcemap: false,
      outfile: path.join(outDir, filename),
      platform: "browser",
    });
  }));
}
