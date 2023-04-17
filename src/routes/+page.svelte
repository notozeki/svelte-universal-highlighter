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
	let tab: string = 'code';
	let openaiKey: string | undefined = undefined;
	let extra: Record<string, string> | undefined;
	const handleOpenaiKeySubmit = () => {
		extra = { openaiKey: openaiKey ? openaiKey : '' };
	};
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
	const handleWriteCode = () => {
		if (highlighter.name === 'GPT') {
			clearInterval(timerId);
			timerId = setTimeout(() => {
				code = textArea.value;
			}, 2000);
			return;
		}
		code = textArea.value;
	};
</script>

<div class={`w-full h-full ${state === 'loading' ? 'opacity-50' : 'opacity-100'}`}>
	<div class="p-3 border-b-[1px] border-slate-300">
		<div class="grid grid-cols-3 gap-x-5 w-full">
			<label class="block w-full mb-2 text-sm font-medium text-gray-900"
				>highlighter
				<select
					bind:value={highlighter}
					class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
				>
					{#each highlighters as item}
						<option value={item}>{item.name}</option>
					{/each}
				</select>
			</label>

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
			<div class="col-span-3 lg:col-span-1 sm:col-span-2">
				{#if highlighter.name === 'GPT'}
					{#if extra === undefined || state === 'error'}
						<label for="highlighter" class="block mb-2 text-sm font-medium text-gray-900"
							>OpenAI API key
						</label>
						<form on:submit={handleOpenaiKeySubmit} class="flex gap-2 w-full sm:w-auto">
							<input
								placeholder="OpenAI API key"
								type="password"
								bind:value={openaiKey}
								id="highlighter"
								bind:this={apiKeyInput}
								class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
							/>
							<button
								class="bg-transparent hover:bg-blue-300 text-blue-500 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
								type="submit">Set</button
							>
						</form>
					{/if}
					{#if extra === undefined || extra?.openaiKey === ''}
						<p class="w-full px-1 box-border col-span-3 md:whitespace-nowrap break-all">
							Leave blank to try it with my API key. Keep in mind it will cost me, feel free to
							donate if you find this fun :)
							<br />
							ETH 0xCAfdD9997a724687EbDB0AC7F15d8c8e6bc192F4
						</p>
					{/if}
					{#if state === 'error'}
						<p class="text-sm text-red-500">Invalid APIKey</p>
					{/if}
				{/if}
			</div>
		</div>
	</div>
	<div class="w-full overflow-hidden h-full box-border">
		<nav class="flex">
			<button
				on:click={() => {
					tab = 'code';
				}}
				class={`sm:w-full sm:border-r-[1px] sm:border-b-[1px] sm:border-slate-300 sm:pointer-events-none hover:text-blue-500 ${
					tab === 'code' && 'border-b-[2px] border-b-green-400'
				}`}
			>
				<div class="p-2 border-slate-300 sm:border-b-[1px]">code</div>
			</button>
			<button
				on:click={() => {
					tab = 'preview';
				}}
				class={`sm:w-full sm:border-r-[1px] sm:border-b-[1px] sm:border-slate-300 sm:pointer-events-none hover:text-blue-500 ${
					tab === 'preview' && 'border-b-[2px] border-b-green-400'
				}`}
			>
				<div class="p-2 border-slate-300 sm:border-b-[1px] bg-white">Preview</div>
			</button>
		</nav>
		<div
			class="w-full flex flex-col sm:flex-row border-t-[1px] border-slate h-[calc(100vh_-_132px)]"
		>
			<div
				class={`h-full w-full sm:w-1/2 border-r-[1px] border-x-black sm:inline-block  ${
					tab === 'preview' && 'hidden'
				}`}
			>
				<textarea
					readonly={state === 'loading'}
					bind:this={textArea}
					on:focus={() => {
						if (highlighter.name === 'GPT') {
							if (openaiKey === undefined || state === 'error') {
								apiKeyInput.focus();
							}
						}
					}}
					on:keydown={(e) => {
						onTabKey(e);
					}}
					on:paste={() => handleWriteCode()}
					on:keyup={(e) => {
						handleWriteCode();
					}}
					class="text-base outline-none box-border p-3 pt-4 bg-[#F6FAFD] resize-none w-full h-full"
				/>
			</div>

			<div
				class={`h-full px-2 w-full sm:w-1/2 text-base break-all sm:inline-block ${
					tab === 'code' && 'hidden'
				}`}
			>
				<Highlight
					{extra}
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
