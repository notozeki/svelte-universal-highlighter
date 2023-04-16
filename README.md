# Svelte Universal Highligher 💅

⚡️ Working demo: https://svelte-universal-highlighter.vercel.app/

## ✍️ Description

A syntax highlighter built with Svelte😘 It's "universal" because you can switch between highlighter implementations according to supported languages or preferred themes etc. Furthermore, you can even highlight codes in _unknown languages_, thanks to GPT!

### ✅ Supported highlighters

* [Prism](https://prismjs.com/) (12 languages[^1])
* [highlight.js](https://highlightjs.org/) (192 languages)
* GPT (∞ languages!)
  * OpenAI's API key required.

[^1]: Prism itself supports more languages, but we only support languages that are initially available due to [technical reason](https://github.com/PrismJS/prism/issues/1789).

## 🏋️ Usage

1. Go to [demo page](https://svelte-universal-highlighter.vercel.app/).
1. Copy and paste the code you want to highlight in [**code**].
1. Select implementation from [**highlighter**].
  1. If you select [GPT], fill your key in [**OpenAI API key**].
1. Select language of the code from [**langage**].
1. Select preferred theme from [**theme**].
1. You will get a beautiful output in [**preview**] :)

Enjoy! 😆

## 🧑‍💻 Developers

* @tnzk
* @notozeki
* @kei-nishikawa48
