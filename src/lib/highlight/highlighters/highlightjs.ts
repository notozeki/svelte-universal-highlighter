import hljs from 'highlight.js';
import type { Highlighter, LanguageList, ThemeList } from '..';

function getSupportedLanguages(): LanguageList {
	return hljs.listLanguages().map((lang) => ({ name: lang, language: lang }));
}

function getThemes(): ThemeList {
	return [];
}

async function highlight(code: string, language: string): Promise<string> {
	return hljs.highlight(code, { language }).value;
}

async function getStylesheet(theme?: string): Promise<string> {
	const res = await fetch(
		'https://unpkg.com/@highlightjs/cdn-assets@11.7.0/styles/default.min.css'
	);
	if (res.ok) {
		return await res.text();
	} else {
		console.error(`Faild to load Prism theme with ${res.status}`);
		return '';
	}
}

export function createHighlightjsHighlighter(): Highlighter {
	return { name: 'Highlight.js', getSupportedLanguages, getThemes, highlight, getStylesheet };
}
