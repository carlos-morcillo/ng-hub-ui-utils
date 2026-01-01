import type { HorizontalConnectionPos } from './horizontal-connection-pos';
import type { VerticalConnectionPos } from './vertical-connection-pos';

/**
 * Configuration for a single overlay connection position.
 */
export interface ConnectionPosition {
	/**
	 * Horizontal position of the origin element.
	 */
	originX: HorizontalConnectionPos;
	/**
	 * Vertical position of the origin element.
	 */
	originY: VerticalConnectionPos;
	/**
	 * Horizontal position of the overlay element.
	 */
	overlayX: HorizontalConnectionPos;
	/**
	 * Vertical position of the overlay element.
	 */
	overlayY: VerticalConnectionPos;
	/**
	 * Offset in pixels along the X axis.
	 */
	offsetX?: number;
	/**
	 * Offset in pixels along the Y axis.
	 */
	offsetY?: number;
}
