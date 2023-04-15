<script lang="ts">
	import { onMount } from 'svelte';
	import type { Highlighter } from '.';

	export let highlighter: Highlighter;
	export let code: string;
	export let language: string;
	export let theme: string | undefined = undefined;

	let container: HTMLDivElement;
	let template: HTMLTemplateElement;

	$: {
		highlighter.highlight(code, language, theme).then(({ html, stylesheet }) => {
			const codeElement = container.shadowRoot?.querySelector('code');
			if (codeElement) {
				codeElement.innerHTML = html;
			}
			const styleElement = container.shadowRoot?.querySelector('style');
			if (styleElement) {
				styleElement.textContent = stylesheet;
			}
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
		<pre><code /></pre>
	</template>
</div>
