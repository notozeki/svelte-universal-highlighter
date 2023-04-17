import { generateColorMapping } from '$lib/gpt/index.server';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const { apiKey, tokenTypes } = await request.json();
	const result = await generateColorMapping(apiKey, tokenTypes);
	return json(result);
};
