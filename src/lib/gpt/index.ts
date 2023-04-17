export type Token = { type: string; value: string };

async function requestJSON(method: string, url: string, data?: any): Promise<any> {
	const res = await fetch(url, {
		method,
		headers: data ? { 'content-type': 'application/json' } : undefined,
		body: data ? JSON.stringify(data) : undefined
	});
	if (res.ok) {
		return await res.json();
	} else {
		throw new Error(`Request failed with ${res.status}`);
	}
}

export async function tokenize(apiKey: string, code: string): Promise<Token[]> {
	return await requestJSON('POST', '/api/gpt/tokenize', { apiKey, code });
}

export async function generateColorMapping(
	apiKey: string,
	tokenTypes: string[]
): Promise<Record<string, string>> {
	return await requestJSON('POST', '/api/gpt/generateColorMapping', { apiKey, tokenTypes });
}
