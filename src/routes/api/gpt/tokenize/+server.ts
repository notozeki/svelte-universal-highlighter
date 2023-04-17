import { tokenize } from '$lib/gpt/index.server';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const { apiKey, code } = await request.json();
	const result = await tokenize(apiKey, code);
	return json(result);
};
