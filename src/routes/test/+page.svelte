<script lang="ts">
	import Highlight, { type HighlightState } from '$lib/highlight/Highlight.svelte';
	import {
		getHighlighters,
		type Highlighter,
		type LanguageList,
		type ThemeList
	} from '$lib/highlight';

	const highlighters = getHighlighters();

	let highlighter = highlighters[0];
	let languages: LanguageList;
	let themes: ThemeList;
	let language: string;
	let theme: string;
	let extra: Record<string, string> | undefined;
	let state: HighlightState = 'done';
	let openaiKey = '';

	$: {
		initHighlighter(highlighter);
	}

	const initHighlighter = (highlighter: Highlighter) => {
		languages = highlighter.getSupportedLanguages();
		themes = highlighter.getThemes();
		language = languages[0].language;
		theme = themes[0].theme;
		extra = undefined;
	};

	const handleOpenaiKeySubmit = () => {
		extra = { openaiKey: `${openaiKey}` };
	};

	// Sample code from https://github.com/mdn/web-components-examples/blob/main/popup-info-box-web-component/main.js
	const code = `// Create a class for the element
class PopUpInfo extends HTMLElement {
  constructor() {
    // Always call super first in constructor
    super();

    // Create a shadow root
    const shadow = this.attachShadow({mode: 'open'});

    // Create spans
    const wrapper = document.createElement('span');
    wrapper.setAttribute('class', 'wrapper');

    const icon = document.createElement('span');
    icon.setAttribute('class', 'icon');
    icon.setAttribute('tabindex', 0);

    const info = document.createElement('span');
    info.setAttribute('class', 'info');

    // Take attribute content and put it inside the info span
    const text = this.getAttribute('data-text');
    info.textContent = text;

    // Insert icon
    let imgUrl;
    if(this.hasAttribute('img')) {
      imgUrl = this.getAttribute('img');
    } else {
      imgUrl = 'img/default.png';
    }

    const img = document.createElement('img');
    img.src = imgUrl;
    icon.appendChild(img);

    // Create some CSS to apply to the shadow dom
    const style = document.createElement('style');
    console.log(style.isConnected);

    style.textContent = \`
      .wrapper {
        position: relative;
      }
      .info {
        font-size: 0.8rem;
        width: 200px;
        display: inline-block;
        border: 1px solid black;
        padding: 10px;
        background: white;
        border-radius: 10px;
        opacity: 0;
        transition: 0.6s all;
        position: absolute;
        bottom: 20px;
        left: 10px;
        z-index: 3;
      }
      img {
        width: 1.2rem;
      }
      .icon:hover + .info, .icon:focus + .info {
        opacity: 1;
      }
    \`;

    // Attach the created elements to the shadow dom
    shadow.appendChild(style);
    console.log(style.isConnected);
    shadow.appendChild(wrapper);
    wrapper.appendChild(icon);
    wrapper.appendChild(info);
  }
}

// Define the new element
customElements.define('popup-info', PopUpInfo);`;
</script>

<div style:opacity={state === 'loading' ? 0.5 : 1}>
	<select bind:value={highlighter}>
		{#each highlighters as item}
			<option value={item}>{item.name}</option>
		{/each}
	</select>

	<select bind:value={language}>
		{#each languages as item}
			<option value={item.language}>{item.name}</option>
		{/each}
	</select>

	<select bind:value={theme}>
		{#each themes as item}
			<option value={item.theme}>{item.name}</option>
		{/each}
	</select>

	{#if highlighter.name === 'GPT'}
		<form on:submit|preventDefault={handleOpenaiKeySubmit}>
			<input type="password" placeholder="OpenAI API key" bind:value={openaiKey} />
			<button type="submit" disabled={openaiKey === extra?.openaiKey}>
				use this key
			</button>
		</form>
	{/if}

	{#if state === 'error'}
		<div style="color: red">Error while highlighting.</div>
	{/if}

	<Highlight
		{highlighter}
		{language}
		{theme}
		{code}
		{extra}
		on:changeState={(event) => (state = event.detail)}
	/>
</div>
