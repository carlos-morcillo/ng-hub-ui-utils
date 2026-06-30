import { InjectionToken } from '@angular/core';
import { hubTooltipAdapter } from './tooltip-adapter';
import { HubTooltipAdapter } from './tooltip.types';

/**
 * Injection token resolving the tooltip adapter used by `[hubOverflowTooltip]`
 * (and any other utils consumer that wants a swappable tooltip).
 *
 * It defaults — via a root factory — to the built-in {@link hubTooltipAdapter},
 * so the hub-ui tooltip works out of the box with no wiring. Override it with
 * {@link provideHubTooltip} to plug in **any** tooltip implementation (a custom
 * one, a Material tooltip wrapper, etc.) app-wide or per subtree, keeping the
 * tooltip **agnostic** even for libraries that already depend on utils.
 */
export const HUB_TOOLTIP_ADAPTER = new InjectionToken<HubTooltipAdapter>('HUB_TOOLTIP_ADAPTER', {
	providedIn: 'root',
	factory: () => hubTooltipAdapter
});
