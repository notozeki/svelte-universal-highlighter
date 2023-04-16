<script lang="ts">
	import Highlight from '$lib/highlight/Highlight.svelte';
	import { getHighlighters } from '$lib/highlight';

	const highlighter = getHighlighters()[0];
	const languages = highlighter.getSupportedLanguages();

	let language = languages[0].language;
	let code = '';
</script>

<div class="p-3 flex justify-around sm:flex-row flex-col items-center h-32 sm:h-auto">
	<label class="w-full flex justify-around">
		highlighter
		<select class="w-40 pl-2 border-l-2 border-b-2 border-x-cyan-200 border-y-red">code</select>
	</label>
	<label class="w-full flex justify-around">
		language
		<select
			bind:value={language}
			class="w-40 pl-2 border-l-2 border-b-2 border-x-cyan-200 border-y-red"
		>
			{#each languages as item}
				<option value={item.language}>{item.name}</option>
			{/each}
		</select>
	</label>
</div>
<div class={`flex w-full h-[calc(100vh_-_54px)] overflow-hidden box-border`}>
	<div class="w-full border-r-2 h-full border-x-black">
		<div class={'w-full h-full '}>
			<textarea
				bind:value={code}
				class="outline-none box-border p-3 bg-slate-200 resize-none w-full h-full"
			/>
		</div>
	</div>
	<div class="w-full border-r-2 h-full border-x-black">
		<div class={'w-full h-full p-2'}>
			<Highlight {highlighter} {language} {code} />
		</div>
	</div>
</div>
