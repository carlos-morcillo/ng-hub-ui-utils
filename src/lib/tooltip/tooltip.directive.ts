import { DOCUMENT } from '@angular/common';
import { Directive, ElementRef, HostListener, inject, input, OnDestroy, Renderer2, RendererStyleFlags2 } from '@angular/core';

/** Supported tooltip placements relative to the host element. */
export type HubTooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

/** Id of the singleton stylesheet injected into the document head. */
const TOOLTIP_STYLE_ID = 'hub-tooltip-styles';

/**
 * Themeable custom properties forwarded from the host to the tooltip element.
 *
 * The tooltip is appended to `<body>`, so it cannot inherit scoped variables set
 * on an ancestor of the host. We resolve them on the host (which *does* inherit
 * from its scope) and copy any defined value onto the tooltip inline style, so
 * both `:root`-level and scoped theming work.
 */
const TOOLTIP_THEME_VARS = [
	'--hub-tooltip-bg',
	'--hub-tooltip-color',
	'--hub-tooltip-opacity',
	'--hub-tooltip-padding-x',
	'--hub-tooltip-padding-y',
	'--hub-tooltip-border-radius',
	'--hub-tooltip-font-size',
	'--hub-tooltip-font-weight',
	'--hub-tooltip-line-height',
	'--hub-tooltip-max-width',
	'--hub-tooltip-z-index',
	'--hub-tooltip-transition-duration',
	'--hub-tooltip-shadow',
	'--hub-tooltip-font-family'
];

/**
 * Base tooltip styles, injected once per document.
 *
 * Every visual property is driven by a `--hub-tooltip-*` custom property with a
 * sensible fallback, so consuming apps can theme tooltips from any scope without
 * touching this directive.
 */
const TOOLTIP_STYLES = `
.hub-tooltip {
  position: absolute;
  z-index: var(--hub-tooltip-z-index, 1070);
  display: block;
  margin: 0;
  max-width: var(--hub-tooltip-max-width, 200px);
  padding: var(--hub-tooltip-padding-y, 0.25rem) var(--hub-tooltip-padding-x, 0.5rem);
  font-family: var(--hub-tooltip-font-family, var(--hub-ref-font-family, inherit));
  font-size: var(--hub-tooltip-font-size, 0.875rem);
  font-weight: var(--hub-tooltip-font-weight, 400);
  line-height: var(--hub-tooltip-line-height, 1.5);
  text-align: center;
  word-wrap: break-word;
  white-space: normal;
  color: var(--hub-tooltip-color, #fff);
  background-color: var(--hub-tooltip-bg, #000);
  border-radius: var(--hub-tooltip-border-radius, 0.375rem);
  box-shadow: var(--hub-tooltip-shadow, none);
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--hub-tooltip-transition-duration, 0.15s) ease-in-out;
}
.hub-tooltip--show { opacity: var(--hub-tooltip-opacity, 0.9); }
`;

/**
 * Lightweight, dependency-free tooltip directive.
 *
 * Apply `[tooltip]` to any element to show a positioned label on hover/focus.
 * The tooltip element is appended to `<body>` so it is never clipped by an
 * overflow container, and every visual aspect is themeable through
 * `--hub-tooltip-*` CSS variables.
 */
@Directive({
	selector: '[tooltip]'
})
export class TooltipDirective implements OnDestroy {
	/** Tooltip text content. */
	readonly tooltipTitle = input.required<string>({ alias: 'tooltip' });

	/** Placement of the tooltip relative to the host. */
	readonly placement = input<HubTooltipPlacement>('top');

	/** Fade duration in milliseconds, also used as the removal delay on hide. */
	readonly delay = input<number>(150);

	/** Gap in pixels between the host and the tooltip. */
	readonly offset = input<number>(8);

	private tooltipEl: HTMLElement | null = null;
	private hideTimeout: ReturnType<typeof setTimeout> | null = null;

	private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
	private readonly renderer = inject(Renderer2);
	private readonly document = inject(DOCUMENT);

	constructor() {
		this.ensureStyles();
	}

	ngOnDestroy(): void {
		this.destroyTooltip();
	}

	@HostListener('mouseenter')
	@HostListener('focus')
	protected onShow(): void {
		this.show();
	}

	@HostListener('mouseleave')
	@HostListener('blur')
	@HostListener('click')
	protected onHide(): void {
		this.hide();
	}

	/** Injects the shared stylesheet into `<head>` once per document. */
	private ensureStyles(): void {
		if (this.document.getElementById(TOOLTIP_STYLE_ID)) {
			return;
		}
		const style = this.renderer.createElement('style') as HTMLStyleElement;
		style.id = TOOLTIP_STYLE_ID;
		style.textContent = TOOLTIP_STYLES;
		this.renderer.appendChild(this.document.head, style);
	}

	/** Creates, positions and reveals the tooltip element. */
	private show(): void {
		if (this.tooltipEl || !this.tooltipTitle()) {
			return;
		}
		this.clearHideTimeout();

		const el = this.renderer.createElement('span') as HTMLElement;
		this.renderer.appendChild(el, this.renderer.createText(this.tooltipTitle()));
		this.renderer.addClass(el, 'hub-tooltip');
		this.renderer.addClass(el, `hub-tooltip--${this.placement()}`);
		this.renderer.setStyle(el, 'transition-duration', `${this.delay()}ms`);
		this.forwardThemeVars(el);
		this.renderer.appendChild(this.document.body, el);
		this.tooltipEl = el;

		this.position();
		this.renderer.addClass(el, 'hub-tooltip--show');
	}

	/** Fades the tooltip out and removes it after the fade completes. */
	private hide(): void {
		if (!this.tooltipEl) {
			return;
		}
		this.renderer.removeClass(this.tooltipEl, 'hub-tooltip--show');
		this.clearHideTimeout();
		this.hideTimeout = setTimeout(() => this.destroyTooltip(), this.delay());
	}

	/** Removes the tooltip element immediately. */
	private destroyTooltip(): void {
		this.clearHideTimeout();
		if (this.tooltipEl) {
			this.renderer.removeChild(this.document.body, this.tooltipEl);
			this.tooltipEl = null;
		}
	}

	/**
	 * Copies any `--hub-tooltip-*` value defined on the host (or its scope) onto
	 * the body-portaled tooltip, so scoped theming applies despite the portal.
	 */
	private forwardThemeVars(el: HTMLElement): void {
		const view = this.document.defaultView;
		if (!view) {
			return;
		}
		const hostStyles = view.getComputedStyle(this.host.nativeElement);
		for (const name of TOOLTIP_THEME_VARS) {
			const value = hostStyles.getPropertyValue(name).trim();
			if (value) {
				this.renderer.setStyle(el, name, value, RendererStyleFlags2.DashCase);
			}
		}
	}

	private clearHideTimeout(): void {
		if (this.hideTimeout !== null) {
			clearTimeout(this.hideTimeout);
			this.hideTimeout = null;
		}
	}

	/** Positions the tooltip around the host according to `placement`. */
	private position(): void {
		if (!this.tooltipEl) {
			return;
		}
		const hostRect = this.host.nativeElement.getBoundingClientRect();
		const tipRect = this.tooltipEl.getBoundingClientRect();
		const scrollY = this.document.defaultView?.scrollY ?? 0;
		const scrollX = this.document.defaultView?.scrollX ?? 0;
		const offset = this.offset();

		let top = 0;
		let left = 0;

		switch (this.placement()) {
			case 'bottom':
				top = hostRect.bottom + offset;
				left = hostRect.left + (hostRect.width - tipRect.width) / 2;
				break;
			case 'left':
				top = hostRect.top + (hostRect.height - tipRect.height) / 2;
				left = hostRect.left - tipRect.width - offset;
				break;
			case 'right':
				top = hostRect.top + (hostRect.height - tipRect.height) / 2;
				left = hostRect.right + offset;
				break;
			case 'top':
			default:
				top = hostRect.top - tipRect.height - offset;
				left = hostRect.left + (hostRect.width - tipRect.width) / 2;
				break;
		}

		this.renderer.setStyle(this.tooltipEl, 'top', `${top + scrollY}px`);
		this.renderer.setStyle(this.tooltipEl, 'left', `${left + scrollX}px`);
	}
}
