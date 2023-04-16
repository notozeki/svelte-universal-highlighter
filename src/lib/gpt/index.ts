import { Configuration, OpenAIApi } from 'openai';

export type Token = { type: string; value: string };
const OPENAI_KEY = import.meta.env.VITE_OPENAI_KEY;

async function textCompletion(prompt:string) {
  const configuration = new Configuration({ apiKey: OPENAI_KEY });
  const openai = new OpenAIApi(configuration);
  const request = {
    model: "text-davinci-003",
    prompt,
    temperature: 0.7,
    max_tokens: 3000,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  };
  // Usually takes 10-20 sec to resolve.
  return openai.createCompletion(request);
}

const PROMPT_TEMPLATE_TOKENIZE = `
Tokenize this program entirely for syntax highlighting.
and provide me with the result as CSV that consists two column of type and value.
The response shouldn't contain code block notation around the CSV.

\`\`\`
<<code>>
\`\`\`
`;
async function completeToken(prompt: string): Promise<Token[]> {
  return textCompletion(prompt).then((res) => {
    const csv = res.data.choices[0].text;
    if (!csv) return [];
    return csv.split("\n")
      .map((line) => {
        const idx = line.indexOf(",");
        return [line.slice(0,idx), line.slice(idx + 1)];
      })
      .map((pair) => ({ type: pair[0], value: pair[1] }) as Token);
  });
}
export async function tokenize(code: string): Promise<Token[]> {
  const prompt = PROMPT_TEMPLATE_TOKENIZE.replace('<<code>>', code);
  const tokens = await completeToken(prompt);
  return tokens;
}

const PROMPT_TEMPLATE_COLOR = `
Suppose you tokenized this program, provided me with tokens e.g. [{ type: "keyword", value: "function"}, ...].
Now, provide me with colors to syntax highlight to make it legible and easy to read for most of people.
I will provide token types for you to color below. Your response should be a list of hex color codes, in the same order as the token types I provide.
The response should be just lines of color codes and shouldn't contain code block notation around the list.

<<code>>
`;
async function completeColor(tokenTypes: string[]): Promise<Record<string, string>> {
  const prompt = PROMPT_TEMPLATE_COLOR.replace('<<code>>', tokenTypes.join(","));
  return textCompletion(prompt).then((res) => {
    const colorsString = res.data.choices[0].text;
    if (!colorsString) return {};
    return Object.fromEntries(
        colorsString.split(",")
          .map((color, idx) => [tokenTypes[idx], color])
    );
  });
}

export async function generateColorMapping(tokenTypes: string[]): Promise<Record<string, string>> {
  const colors = await completeColor(tokenTypes);
  return colors;
}
