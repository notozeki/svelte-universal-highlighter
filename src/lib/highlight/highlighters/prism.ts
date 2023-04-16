import * as Prism from 'prismjs';
import type { HighlightResult, Highlighter, LanguageList, ThemeList } from '..';

const stylesheetCache = new Map<string, string>();

function getSupportedLanguages(): LanguageList {
	const metaKeys = ['extend', 'insertBefore'];
	return Object.keys(Prism.languages)
		.filter((key) => !metaKeys.includes(key))
		.map((key) => ({ name: key, language: key }));
}

function getThemes(): ThemeList {
	return [{ name: 'Default', theme: 'default' }];
}

async function highlight(code: string, language: string, theme?: string): Promise<HighlightResult> {
	const grammer = Prism.languages[language];
	if (!grammer) {
		throw new Error(`Unsupported language: ${language}`);
	}
	const html = Prism.highlight(code, grammer, language);
	const stylesheet = await getStylesheet(theme);
	return { html, stylesheet };
}

async function getStylesheet(theme: string = 'default'): Promise<string> {
	const cached = stylesheetCache.get(theme);
	if (cached !== undefined) {
		return cached;
	}

	const res = await fetch('https://unpkg.com/prismjs@v1.x/themes/prism.css');
	if (res.ok) {
		const stylesheet = await res.text();
		stylesheetCache.set(theme, stylesheet);
		return stylesheet;
	} else {
		console.error(`Faild to load Prism theme with ${res.status}`);
		return '';
	}
}

export function createPrismHighlighter(): Highlighter {
	return { name: 'Prism', getSupportedLanguages, getThemes, highlight };
}
