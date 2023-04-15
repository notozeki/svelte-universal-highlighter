import { createHighlightjsHighlighter } from './highlighters/highlightjs';
import { createPrismHighlighter } from './highlighters/prism';

export type LanguageList = { name: string; language: string }[];

export type ThemeList = { name: string; theme: string }[];

export interface Highlighter {
	name: string;
	getSupportedLanguages(): LanguageList;
	getThemes(): ThemeList;
	highlight(code: string, language: string): Promise<string>;
	getStylesheet(theme?: string): Promise<string>;
}

export function getHighlighters(): Highlighter[] {
	return [createPrismHighlighter(), createHighlightjsHighlighter()];
}
