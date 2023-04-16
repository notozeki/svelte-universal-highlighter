<script lang="ts">
	import Highlight, { type HighlightState } from '$lib/highlight/Highlight.svelte';
	import {
		getHighlighters,
		type Highlighter,
		type LanguageList,
		type ThemeList
	} from '$lib/highlight';

	const highlighters = getHighlighters();
	let textArea: HTMLTextAreaElement;
	let apiKeyInput: HTMLInputElement;
	let highlighter = highlighters[0];
	let languages: LanguageList;
	let themes: ThemeList;
	let language: string;
	let theme: string;
	let state: HighlightState = 'done';
	let code = '';
	let timerId: number;
	let APIKey = '';
	let typingValue = '';
	$: {
		initHighlighter(highlighter);
	}

	const initHighlighter = (highlighter: Highlighter) => {
		languages = highlighter.getSupportedLanguages();
		themes = highlighter.getThemes();
		language = languages[0].language;
		theme = themes[0].theme;
	};
	const onTabKey = (
		e: KeyboardEvent & {
			currentTarget: EventTarget & HTMLTextAreaElement;
		}
	) => {
		if (e.key !== 'Tab') return;
		e.preventDefault();
		const cursorPosition = textArea.selectionStart;
		const cursorLeft = textArea.value.substring(0, cursorPosition);
		const cursorRight = textArea.value.substring(cursorPosition, textArea.value.length);
		textArea.value = cursorLeft + '\t' + cursorRight;
		textArea.selectionEnd = cursorPosition + 1;
	};
</script>

<div class={`w-full h-full ${state === 'loading' ? 'opacity-50' : 'opacity-100'}`}>
	<div class="p-3 border-b-[1px] border-slate-300">
		<div class="grid grid-cols-3 gap-5 w-full">
			<div>
				<label class="block w-full mb-2 text-sm font-medium text-gray-900"
					>highlighter
					<select
						on:select={() => (code = '')}
						bind:value={highlighter}
						class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
					>
						{#each highlighters as item}
							<option value={item}>{item.name}</option>
						{/each}
					</select>
				</label>
				{#if highlighter.name === 'GPT'}
					{#if !APIKey || state === 'error'}
						<label for="highlighter" class="block mb-2 text-sm font-medium text-gray-900"
							>apiKey
						</label>
						<div class="flex gap-2">
							<input
								type="password"
								bind:value={typingValue}
								id="highlighter"
								bind:this={apiKeyInput}
								class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
							/>
							<button
								class="bg-transparent hover:bg-blue-300 text-blue-500 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
								on:click={() => {
									APIKey = typingValue;
								}}>Set</button
							>
						</div>
					{/if}
					{#if state === 'error'}
						<p class="text-sm text-red-500">Invalid APIKey</p>
					{/if}
				{/if}
			</div>
			<label class="block mb-2 text-sm font-medium text-gray-900"
				>language
				<select
					bind:value={language}
					class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
				>
					{#each languages as item}
						<option value={item.language}>{item.name}</option>
					{/each}
				</select>
			</label>

			<label class="block mb-2 text-sm font-medium text-gray-900"
				>theme
				<select
					bind:value={theme}
					class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
				>
					{#each themes as item}
						<option value={item.theme}>{item.name}</option>
					{/each}
				</select>
			</label>
		</div>
	</div>
	<div class="flex justify-between w-full overflow-hidden box-border h-[calc(100vh_-_90px)]">
		<div class="w-1/2 border-r-[1px] h-full border-x-black">
			<div class="p-2 border-slate-300 border-b-[1px]">code</div>
			<div class="h-full">
				<textarea
					readonly={state === 'loading'}
					bind:this={textArea}
					on:focus={() => {
						if (highlighter.name === 'GPT') {
							if (!APIKey || state === 'error') {
								apiKeyInput.focus();
							}
						}
					}}
					on:keydown={(e) => {
						onTabKey(e);
						if (highlighter.name === 'GPT') {
							clearInterval(timerId);
							timerId = setTimeout(() => {
								code = textArea.value;
							}, 2000);
							return;
						}
						code = textArea.value;
					}}
					class="text-base outline-none box-border p-3 pt-4 bg-[#F6FAFD] resize-none w-full h-full"
				/>
			</div>
		</div>
		<div class="w-1/2 border-r-[1px] h-full border-x-black">
			<div class="p-2 border-slate-300 border-b-[1px]">Preview</div>
			<div class="w-full h-full px-2 text-base break-all">
				<Highlight
					extra={highlighter.name === 'GPT' ? { openaiKey: APIKey } : undefined}
					{theme}
					{highlighter}
					{language}
					{code}
					on:changeState={(event) => (state = event.detail)}
				/>
			</div>
		</div>
	</div>
</div>
