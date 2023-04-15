import hljs from 'highlight.js';
import type { HighlightResult, Highlighter, LanguageList, ThemeList } from '..';

const stylesheetCache = new Map<string, string>();

function getSupportedLanguages(): LanguageList {
	return hljs.listLanguages().map((lang) => ({ name: lang, language: lang }));
}

function getThemes(): ThemeList {
	return [];
}

async function highlight(code: string, language: string, theme?: string): Promise<HighlightResult> {
	const html = hljs.highlight(code, { language }).value;
	const stylesheet = await getStylesheet(theme);
	return { html, stylesheet };
}

async function getStylesheet(theme: string = 'default'): Promise<string> {
	const cached = stylesheetCache.get(theme);
	if (cached !== undefined) {
		return cached;
	}

	const res = await fetch(
		'https://unpkg.com/@highlightjs/cdn-assets@11.7.0/styles/default.min.css'
	);
	if (res.ok) {
		const stylesheet = await res.text();
		stylesheetCache.set(theme, stylesheet);
		return stylesheet;
	} else {
		console.error(`Faild to load Prism theme with ${res.status}`);
		return '';
	}
}

export function createHighlightjsHighlighter(): Highlighter {
	return { name: 'Highlight.js', getSupportedLanguages, getThemes, highlight };
}
