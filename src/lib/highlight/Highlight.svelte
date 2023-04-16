<script context="module" lang="ts">
	export type HighlightState = 'done' | 'loading';
</script>

<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import type { Highlighter } from '.';

	const dispatch = createEventDispatcher<{ changeState: HighlightState }>();

	export let highlighter: Highlighter;
	export let code: string;
	export let language: string;
	export let theme: string | undefined = undefined;

	let container: HTMLDivElement;
	let template: HTMLTemplateElement;

	$: {
		dispatch('changeState', 'loading');
		highlighter.highlight(code, language, theme).then(({ html, stylesheet }) => {
			const codeElement = container.shadowRoot?.querySelector('code');
			if (codeElement) {
				codeElement.innerHTML = html;
			}
			const styleElement = container.shadowRoot?.querySelector('style');
			if (styleElement) {
				styleElement.textContent = stylesheet;
			}
			dispatch('changeState', 'done');
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
		<pre
			style="white-space: -moz-pre-wrap; 
			white-space: -pre-wrap; 
			white-space: -o-pre-wrap; 
			white-space: pre-wrap;"><code /></pre>
	</template>
</div>
