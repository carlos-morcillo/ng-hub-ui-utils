/**
 * Resolves a component `color` / `variant` input to a paintable CSS value for a
 * `--hub-*-accent` slot, accepting ANY colour with a single rule:
 *
 * - a **bareword** — a built-in or registered semantic accent name (`primary`, `brand`…) or a CSS
 *   named colour (`rebeccapurple`) — resolves to its design-system token
 *   `var(--hub-sys-color-<name>, <name>)`: the token when it exists, with the raw word as fallback
 *   so unregistered names / CSS named colours still paint;
 * - a **literal** colour (`#ff0000`, `rgb(...)`, `oklch(...)`, `var(...)`) is returned unchanged;
 * - an empty / nullish value returns `null`, so the component's default accent stays in effect.
 *
 * Bind the result to the component's single accent slot via the `host` metadata, e.g.
 * `host: { '[style.--hub-btn-accent]': 'accent()' }` with `accent = computed(() => resolveHubAccent(this.color()))`.
 *
 * @param value the raw `color` / `variant` input value
 * @returns the value for `[style.--hub-*-accent]`, or `null`
 */
export function resolveHubAccent(value: string | null | undefined): string | null {
	const color = value?.trim();
	if (!color) {
		return null;
	}
	return /^[a-zA-Z][\w-]*$/.test(color) ? `var(--hub-sys-color-${color}, ${color})` : color;
}
