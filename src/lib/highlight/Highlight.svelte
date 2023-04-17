<script context="module" lang="ts">
	export type HighlightState = 'done' | 'loading' | 'error';
</script>

<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import type { Highlighter } from '.';

	const dispatch = createEventDispatcher<{ changeState: HighlightState }>();

	export let highlighter: Highlighter;
	export let code: string;
	export let language: string;
	export let theme: string;
	export let extra: Record<string, string> | undefined = undefined;

	let container: HTMLDivElement;
	let template: HTMLTemplateElement;

	$: if (!(highlighter.name === 'GPT' && !extra)) {
		dispatch('changeState', 'loading');
		highlighter
			.highlight(code, language, theme, extra)
			.then(({ html, stylesheet }) => {
				const divElement = container.shadowRoot?.querySelector('div');
				if (divElement) {
					divElement.innerHTML = html;
				}
				const styleElement = container.shadowRoot?.querySelector('style');
				if (styleElement) {
					styleElement.textContent = stylesheet;
				}
				dispatch('changeState', 'done');
			})
			.catch((err) => {
				console.error(err);
				dispatch('changeState', 'error');
			});
	}

	onMount(() => {
		// ref. https://developer.chrome.com/articles/declarative-shadow-dom/#polyfill
		const shadowRoot = container.attachShadow({ mode: 'open' });
		shadowRoot.appendChild(template.content);
		template.remove();
	});
</script>

<div bind:this={container}>
	<template bind:this={template}>
		<style></style>
		<div />
	</template>
</div>
