import { ApplicationRef, inject, Injectable } from '@angular/core';
import { OverlayPosition } from './overlay-position';
import { OverlayRef } from './overlay-ref';
import type { OverlayConfig } from './overlay-config';

/**
 * Service for creating and managing overlay instances.
 */
@Injectable({
	providedIn: 'root'
})
export class OverlayService {
	private readonly _appRef = inject(ApplicationRef);

	/**
	 * Creates a new overlay with the specified configuration.
	 *
	 * @param config Configuration options for the overlay.
	 * @returns A reference to the created overlay.
	 */
	create(config: OverlayConfig = {}): OverlayRef {
		return new OverlayRef(config, this._appRef);
	}

	/**
	 * Creates a position strategy builder for connected overlays.
	 *
	 * @returns A new {@link OverlayPosition} instance.
	 */
	position(): OverlayPosition {
		return new OverlayPosition();
	}
}
