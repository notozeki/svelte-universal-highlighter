import type { HighlightResult, Highlighter, LanguageList, ThemeList } from '..';

// TEMP
type Token = { type: string; value: string };

function getSupportedLanguages(): LanguageList {
	return [{ name: '(Automatic)', language: '__auto__' }];
}

function getThemes(): ThemeList {
	return [
		{ name: 'Random', theme: 'random' },
		{ name: 'GPT', theme: 'gpt' }
	];
}

async function highlight(code: string, language: string, theme?: string): Promise<HighlightResult> {
	// TODO
	const tokens: Token[] = [{ type: 'none', value: code }];
	const html = renderTokens(tokens);
	const stylesheet = await getStylesheet(
		tokens.map(({ type }) => type),
		theme
	);
	return { html, stylesheet };
}

async function getStylesheet(tokenTypes: string[], theme: string = 'random'): Promise<string> {
	if (theme === 'random') {
		return tokenTypes
			.map((type) => {
				const hue = Math.random();
				const saturation = Math.random();
				return `.${type} { color: hsl(${hue}turn, ${saturation * 100}%, 50%); }`;
			})
			.join('');
	} else if (theme === 'gpt') {
		// TODO
		return '';
	} else {
		return '';
	}
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
