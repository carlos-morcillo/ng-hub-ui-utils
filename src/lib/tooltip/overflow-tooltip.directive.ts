import { afterNextRender, Directive, effect, ElementRef, inject, input, OnDestroy, signal } from '@angular/core';
import { HUB_TOOLTIP_ADAPTER } from './tooltip.token';
import { HubTooltipHandle, HubTooltipPlacement } from './tooltip.types';

/**
 * Shows a tooltip with the given text **only while the host element is truncated**
 * (its content is wider than its box).
 *
 * Unlike `[tooltip]`, which always shows on hover, this directive is meant for
 * ellipsised labels: the tooltip appears solely when the text doesn't fit, so it
 * never duplicates already-visible content. Truncation is tracked live with a
 * `ResizeObserver` (host/container resizes) and a `MutationObserver` (text
 * changes).
 *
 * The tooltip implementation is **agnostic**: it resolves through the injectable
 * {@link HUB_TOOLTIP_ADAPTER} token, which defaults to the built-in hub-ui
 * tooltip. Swap it app-wide (or per subtree) with `provideHubTooltip(...)`.
 *
 * Requires the tooltip styles once in your app:
 * `@use 'ng-hub-ui-utils/styles/tooltip';`.
 *
 * @example
 * ```html
 * <span class="label" [hubOverflowTooltip]="item.label">{{ item.label }}</span>
 * ```
 */
@Directive({
	selector: '[hubOverflowTooltip]'
})
export class HubOverflowTooltipDirective implements OnDestroy {
	/** Tooltip text; shown only while the host overflows. */
	readonly text = input<string>('', { alias: 'hubOverflowTooltip' });

	/** Placement of the tooltip relative to the host. */
	readonly placement = input<HubTooltipPlacement>('top');

	private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
	private readonly adapter = inject(HUB_TOOLTIP_ADAPTER);

	private handle: HubTooltipHandle | null = null;
	private resizeObserver: ResizeObserver | null = null;
	private mutationObserver: MutationObserver | null = null;

	private readonly overflowing = signal(false);
	private readonly ready = signal(false);

	constructor() {
		afterNextRender(() => this.init());

		effect(() => {
			if (!this.ready() || !this.handle) {
				return;
			}
			this.handle.update(this.overflowing() ? this.text() : '');
		});
	}

	ngOnDestroy(): void {
		this.resizeObserver?.disconnect();
		this.mutationObserver?.disconnect();
		this.handle?.destroy();
		this.handle = null;
	}

	/** Wires the tooltip handle and the browser-only truncation observers. */
	private init(): void {
		const el = this.host.nativeElement;
		// Attach with no text; the effect feeds the label only while truncated.
		this.handle = this.adapter.attach(el, '', { placement: this.placement() });
		this.measure(el);

		if (typeof ResizeObserver !== 'undefined') {
			this.resizeObserver = new ResizeObserver(() => this.measure(el));
			this.resizeObserver.observe(el);
		}

		if (typeof MutationObserver !== 'undefined') {
			this.mutationObserver = new MutationObserver(() => this.measure(el));
			this.mutationObserver.observe(el, { childList: true, characterData: true, subtree: true });
		}

		this.ready.set(true);
	}

	/** Updates the truncation state from the host's layout. */
	private measure(el: HTMLElement): void {
		this.overflowing.set(el.scrollWidth > el.clientWidth + 1);
	}
}
