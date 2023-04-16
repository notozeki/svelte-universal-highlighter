import { generateColorMapping, tokenize, type Token } from '$lib/gpt';
import type { HighlightResult, Highlighter, LanguageList, ThemeList } from '..';

const tokenCache = new Map<string, Token[]>();

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
	const cacheKey = await sha1(code);
	const cached = tokenCache.get(cacheKey);
	let tokens;
	if (cached) {
		tokens = cached;
	} else {
		tokens = await tokenize(code);
		tokenCache.set(cacheKey, tokens);
	}

	// // for test
	// const tokens = [
	// 	{ type: 'keyword', value: 'class' },
	// 	{ type: 'identifier', value: 'PopUpInfo' },
	// 	{ type: 'keyword', value: 'extends' },
	// 	{ type: 'identifier', value: 'HTMLElement' },
	// 	{ type: 'punctuation', value: '{' },
	// 	{ type: 'function', value: 'constructor' },
	// 	{ type: 'punctuation', value: '(' },
	// 	{ type: 'punctuation', value: ')' },
	// 	{ type: 'punctuation', value: '{' }
	// ];

	const html = renderTokens(code, tokens);

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

function renderTokens(code: string, tokens: Token[]): string {
	let buf = '';
	let pos = 0;
	for (const token of tokens) {
		const index = code.indexOf(token.value, pos);
		if (index === pos) {
			buf += renderSpan(code.slice(index, index + token.value.length), token.type);
			pos = index + token.value.length;
		} else if (index > pos) {
			buf += renderText(code.slice(pos, index));
			buf += renderSpan(code.slice(index, index + token.value.length), token.type);
			pos = index + token.value.length;
		} else {
			console.warn('Unmatched token', token);
		}
	}
	if (pos !== code.length) {
		buf += renderText(code.slice(pos, code.length));
	}
	return buf;
}

function renderSpan(text: string, type: string): string {
	return `<span class="${escape(type)}">${renderText(text)}</span>`;
}

function renderText(text: string): string {
	return escape(text).replaceAll('\n', '<br>');
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

async function sha1(str: string): Promise<string> {
	const data = new TextEncoder().encode(str);
	const arrayBuffer = await crypto.subtle.digest('SHA-1', data);
	return Array.from(new Uint8Array(arrayBuffer))
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');
}
