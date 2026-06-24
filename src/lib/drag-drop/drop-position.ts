import { DropPosition } from './types';

/**
 * Minimal rectangle shape (a subset of `DOMRect`) used for drop-position math.
 */
export interface DropRect {
	top: number;
	bottom: number;
	left: number;
	right: number;
	width: number;
	height: number;
}

/**
 * Layout axis of a draggable collection, used to decide the drop side.
 *
 * - `vertical`: rows stacked top-to-bottom (default lists, board cards).
 * - `horizontal`: items laid left-to-right (board columns).
 * - `grid`: wrapping grid (list `cards` layout) — vertical band first, then horizontal.
 */
export type DragAxis = 'vertical' | 'horizontal' | 'grid';

/**
 * Resolves whether a dragged item should drop before or after the hovered target, based on
 * the pointer position relative to the target's bounding rectangle and the layout axis.
 *
 * For `vertical` the Y axis decides; for `horizontal` the X axis decides (mirrored in RTL);
 * for `grid` the vertical band decides across rows and the horizontal axis decides within
 * the same row (mirrored in RTL).
 *
 * @param pointerX Pointer X in viewport coordinates.
 * @param pointerY Pointer Y in viewport coordinates.
 * @param rect Bounding rectangle of the target item.
 * @param axis Layout axis of the collection.
 * @param isRtl Whether the collection is in right-to-left mode.
 * @returns `'before'` or `'after'`.
 */
export function resolveDropPosition(
	pointerX: number,
	pointerY: number,
	rect: DropRect,
	axis: DragAxis,
	isRtl: boolean
): DropPosition {
	if (axis === 'horizontal') {
		const midX = rect.left + rect.width / 2;
		const before = isRtl ? pointerX > midX : pointerX < midX;
		return before ? 'before' : 'after';
	}

	const midY = rect.top + rect.height / 2;
	if (axis === 'vertical') {
		return pointerY < midY ? 'before' : 'after';
	}

	// grid
	if (pointerY < rect.top) {
		return 'before';
	}
	if (pointerY > rect.bottom) {
		return 'after';
	}
	const midX = rect.left + rect.width / 2;
	const before = isRtl ? pointerX > midX : pointerX < midX;
	return before ? 'before' : 'after';
}
