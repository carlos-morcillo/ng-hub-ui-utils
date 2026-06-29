import { HubTooltipController } from './tooltip-controller';
import { HubTooltipAdapter, HubTooltipHandle, HubTooltipOptions } from './tooltip.types';

/**
 * Ready-made {@link HubTooltipAdapter} backed by {@link HubTooltipController}.
 *
 * Wire it into any ng-hub-ui primitive that exposes an optional tooltip token,
 * e.g. `provideHubBadgeTooltip(hubTooltipAdapter)`.
 */
export const hubTooltipAdapter: HubTooltipAdapter = {
	attach(host: HTMLElement, text: string, options?: HubTooltipOptions): HubTooltipHandle {
		const controller = new HubTooltipController(host, options);
		controller.setText(text);

		return {
			update: (next: string) => controller.setText(next),
			destroy: () => controller.destroy()
		};
	}
};
