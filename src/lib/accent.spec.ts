import { resolveHubAccent } from './accent';

describe('resolveHubAccent', () => {
	it('returns null for empty / nullish values', () => {
		expect(resolveHubAccent('')).toBeNull();
		expect(resolveHubAccent('   ')).toBeNull();
		expect(resolveHubAccent(null)).toBeNull();
		expect(resolveHubAccent(undefined)).toBeNull();
	});

	it('resolves a semantic/bareword name to its ds token with a raw fallback', () => {
		expect(resolveHubAccent('primary')).toBe('var(--hub-sys-color-primary, primary)');
		expect(resolveHubAccent('brand')).toBe('var(--hub-sys-color-brand, brand)');
		expect(resolveHubAccent('rebeccapurple')).toBe('var(--hub-sys-color-rebeccapurple, rebeccapurple)');
	});

	it('passes a literal colour through unchanged', () => {
		expect(resolveHubAccent('#ff0000')).toBe('#ff0000');
		expect(resolveHubAccent('rgb(1, 2, 3)')).toBe('rgb(1, 2, 3)');
		expect(resolveHubAccent('oklch(0.7 0.15 160)')).toBe('oklch(0.7 0.15 160)');
		expect(resolveHubAccent('var(--x)')).toBe('var(--x)');
	});

	it('trims surrounding whitespace before resolving', () => {
		expect(resolveHubAccent('  success  ')).toBe('var(--hub-sys-color-success, success)');
		expect(resolveHubAccent('  #abc  ')).toBe('#abc');
	});
});
