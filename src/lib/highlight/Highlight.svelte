<script lang="ts">
	import type { Highlighter } from '.';

	export let highlighter: Highlighter;
	export let code: string;
	export let language: string;
	export let theme: string | undefined = undefined;

	let container: HTMLDivElement;
	let template: HTMLTemplateElement;

	$: if (container && template) {
		// ref. https://developer.chrome.com/articles/declarative-shadow-dom/#polyfill
		const shadowRoot = container.attachShadow({ mode: 'open' });
		shadowRoot.appendChild(template.content);
		template.remove();
	}
	$: {
		highlighter.highlight(code, language).then((codeHtml) => {
			const codeElement = container.shadowRoot?.querySelector('code');
			if (codeElement) {
				codeElement.innerHTML = codeHtml;
			}
		});
	}
	$: {
		highlighter.getStylesheet(theme).then((stylesheet) => {
			const styleElement = container.shadowRoot?.querySelector('style');
			if (styleElement) {
				styleElement.textContent = stylesheet;
			}
		});
	}
</script>

<div bind:this={container}>
	<template bind:this={template}>
		<style></style>
		<pre><code /></pre>
	</template>
</div>
