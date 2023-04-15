export type Token = { type: string; value: string };

export async function tokenize(code: string): Promise<Token[]> {
  // TODO
  await new Promise((resolve) => setTimeout(resolve, 3000)); // emulate delay
  return [{ type: 'none', value: code }];
}

export async function generateColorMapping(tokenTypes: string[]): Promise<Record<string, string>> {
  // TODO
  return { none: '#000' };
}
