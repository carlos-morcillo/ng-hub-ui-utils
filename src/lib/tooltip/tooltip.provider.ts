import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { HUB_TOOLTIP_ADAPTER } from './tooltip.token';
import { HubTooltipAdapter } from './tooltip.types';

/**
 * Overrides the tooltip adapter used by `[hubOverflowTooltip]` (and other
 * token-driven tooltip consumers), so the hub-ui tooltip can be swapped for any
 * implementation without touching the components that show it.
 *
 * ```ts
 * // app.config.ts — use a custom tooltip everywhere instead of the built-in one.
 * providers: [provideHubTooltip(myTooltipAdapter)];
 * ```
 *
 * Omit it and the built-in `hubTooltipAdapter` is used by default.
 *
 * @param adapter Tooltip adapter implementation.
 * @returns Environment providers to add to the application config (or a route).
 */
export function provideHubTooltip(adapter: HubTooltipAdapter): EnvironmentProviders {
	return makeEnvironmentProviders([
		{
			provide: HUB_TOOLTIP_ADAPTER,
			useValue: adapter
		}
	]);
}
