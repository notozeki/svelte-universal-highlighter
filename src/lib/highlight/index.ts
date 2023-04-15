import { createGptHighlighter } from './highlighters/gpt';
import { createHighlightjsHighlighter } from './highlighters/highlightjs';
import { createPrismHighlighter } from './highlighters/prism';

export type LanguageList = { name: string; language: string }[];

export type ThemeList = { name: string; theme: string }[];

export type HighlightResult = { html: string; stylesheet: string };

export interface Highlighter {
	name: string;
	getSupportedLanguages(): LanguageList;
	getThemes(): ThemeList;
	highlight(code: string, language: string, theme?: string): Promise<HighlightResult>;
}

export function getHighlighters(): Highlighter[] {
	return [createPrismHighlighter(), createHighlightjsHighlighter(), createGptHighlighter()];
}
