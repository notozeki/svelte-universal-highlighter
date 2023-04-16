import * as Prism from 'prismjs';
import type { HighlightResult, Highlighter, LanguageList, ThemeList } from '..';

const stylesheetCache = new Map<string, string>();

function getSupportedLanguages(): LanguageList {
	const excludeKeys = ['extend', 'insertBefore', 'DFS', 'plain', 'text', 'txt', 'js'];
	return Object.keys(Prism.languages)
		.filter((key) => !excludeKeys.includes(key))
		.map((key) => ({ name: key, language: key }));
}

function getThemes(): ThemeList {
	return [
		{ name: 'Default', theme: 'prism' },
		{ name: 'Dark', theme: 'prism-dark' },
		{ name: 'Funky', theme: 'prism-funky' },
		{ name: 'Okaidia', theme: 'prism-okaidia' },
		{ name: 'Twilight', theme: 'prism-twilight' },
		{ name: 'Coy', theme: 'prism-coy' },
		{ name: 'Solarized Light', theme: 'prism-solarizedlight' },
		{ name: 'Tomorrow Night', theme: 'prism-tomorrow' }
	];
}

async function highlight(code: string, language: string, theme?: string): Promise<HighlightResult> {
	const grammer = Prism.languages[language];
	if (!grammer) {
		throw new Error(`Unsupported language: ${language}`);
	}
	const highlighted = Prism.highlight(code, grammer, language);
	const html = `<pre class="language-${language}"><code class="language-language">${highlighted}</code></pre>`;
	const stylesheet = await getStylesheet(theme);
	return { html, stylesheet };
}

async function getStylesheet(theme: string = 'default'): Promise<string> {
	const cached = stylesheetCache.get(theme);
	if (cached !== undefined) {
		return cached;
	}

	const res = await fetch(`https://unpkg.com/prismjs@v1.x/themes/${theme}.css`);
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
