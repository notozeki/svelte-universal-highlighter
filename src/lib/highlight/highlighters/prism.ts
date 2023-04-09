import * as Prism from 'prismjs';
import type { Highlighter, LanguageList, ThemeList } from '..';

function getSupportedLanguages(): LanguageList {
	const metaKeys = ['extend', 'insertBefore'];
	return Object.keys(Prism.languages)
		.filter((key) => !metaKeys.includes(key))
		.map((key) => ({ name: key, language: key }));
}

function getThemes(): ThemeList {
	return [];
}

async function highlight(code: string, language: string): Promise<string> {
	const grammer = Prism.languages[language];
	if (!grammer) {
		throw new Error(`Unsupported language: ${language}`);
	}
	return Prism.highlight(code, grammer, language);
}

async function getStylesheet(theme?: string): Promise<string> {
	const res = await fetch('https://unpkg.com/prismjs@v1.x/themes/prism.css');
	if (res.ok) {
		return await res.text();
	} else {
		console.error(`Faild to load Prism theme with ${res.status}`);
		return '';
	}
}

export function createPrismHighlighter(): Highlighter {
	return { name: 'Prism', getSupportedLanguages, getThemes, highlight, getStylesheet };
}
