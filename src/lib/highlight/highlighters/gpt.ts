import { generateColorMapping, tokenize, type Token } from '$lib/gpt';
import type { HighlightResult, Highlighter, LanguageList, ThemeList } from '..';

function getSupportedLanguages(): LanguageList {
	return [{ name: '(Automatic)', language: '__auto__' }];
}

function getThemes(): ThemeList {
	return [
		{ name: 'Random', theme: 'random' },
		{ name: 'GPT', theme: 'gpt' }
	];
}

async function highlight(
	code: string,
	_language: string,
	theme?: string
): Promise<HighlightResult> {
	const tokens = await tokenize(code);
	const html = renderTokens(tokens);
	const stylesheet = await getStylesheet(
		tokens.map(({ type }) => type),
		theme
	);
	return { html, stylesheet };
}

async function getStylesheet(tokenTypes: string[], theme: string = 'random'): Promise<string> {
	let mapping: Record<string, string> = {};
	if (theme === 'random') {
		for (const type of tokenTypes) {
			const hue = Math.random();
			const saturation = Math.random();
			mapping[type] = `hsl(${hue}turn, ${saturation * 100}%, 50%)`;
		}
	} else if (theme === 'gpt') {
		mapping = await generateColorMapping(tokenTypes);
	}

	return Object.keys(mapping)
		.map((type) => `.${type} { color: ${mapping[type]}; }`)
		.join('\n');
}

function renderTokens(tokens: Token[]): string {
	return tokens
		.map(
			({ type, value }) =>
				`<span class="${escape(type)}">${escape(value).replaceAll('\n', '<br>')}</span>`
		)
		.join('');
}

function escape(str: string): string {
	return str
		.replaceAll('&', '&amp;')
		.replaceAll("'", '&#39;')
		.replaceAll('"', '&quot;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;');
}

export function createGptHighlighter(): Highlighter {
	return { name: 'GPT', getSupportedLanguages, getThemes, highlight };
}
