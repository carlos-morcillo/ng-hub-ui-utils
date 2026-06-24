/**
 * Clamps a value into the `[0, max]` range.
 *
 * @param value Value to clamp.
 * @param max Maximum allowed value.
 * @returns The clamped value.
 */
export function clamp(value: number, max: number): number {
	return Math.max(0, Math.min(max, value));
}

/**
 * Moves an item within an array in place (mirrors `@angular/cdk`'s `moveItemInArray`).
 *
 * @param array Array to mutate.
 * @param fromIndex Current index of the item.
 * @param toIndex Target index of the item.
 */
export function moveItemInArray<T>(array: T[], fromIndex: number, toIndex: number): void {
	const from = clamp(fromIndex, array.length - 1);
	const to = clamp(toIndex, array.length - 1);
	if (from === to) {
		return;
	}
	const target = array[from];
	const delta = to < from ? -1 : 1;
	for (let i = from; i !== to; i += delta) {
		array[i] = array[i + delta];
	}
	array[to] = target;
}

/**
 * Transfers an item from one array to another in place (mirrors `transferArrayItem`).
 *
 * @param source Source array.
 * @param target Target array.
 * @param fromIndex Index of the item in the source array.
 * @param toIndex Insertion index in the target array.
 */
export function transferArrayItem<T>(source: T[], target: T[], fromIndex: number, toIndex: number): void {
	const from = clamp(fromIndex, source.length - 1);
	const to = clamp(toIndex, target.length);
	if (source.length) {
		target.splice(to, 0, source.splice(from, 1)[0]);
	}
}

/**
 * Copies an item from one array into another in place, leaving the source untouched.
 *
 * @param source Source array.
 * @param target Target array.
 * @param fromIndex Index of the item in the source array.
 * @param toIndex Insertion index in the target array.
 */
export function copyArrayItem<T>(source: ReadonlyArray<T>, target: T[], fromIndex: number, toIndex: number): void {
	if (!source.length) {
		return;
	}
	const from = clamp(fromIndex, source.length - 1);
	const to = clamp(toIndex, target.length);
	target.splice(to, 0, source[from]);
}

/**
 * Computes the destination index in the underlying collection from the hovered target index
 * and the drop side. When reordering within the same container, the index is adjusted to
 * account for the gap left by removing the dragged item.
 *
 * @param targetIndex Absolute index of the hovered target item.
 * @param after Whether the item is dropped after (vs before) the target.
 * @param sameContainer Whether source and target collections are the same.
 * @param fromIndex Absolute index the dragged item occupied in the source collection.
 * @returns The resolved destination index.
 */
export function computeTargetIndex(targetIndex: number, after: boolean, sameContainer: boolean, fromIndex: number): number {
	let index = after ? targetIndex + 1 : targetIndex;
	if (sameContainer && fromIndex < index) {
		index -= 1;
	}
	return Math.max(0, index);
}

/**
 * Maps a paginated visible index to its absolute index in the underlying collection.
 *
 * @param visibleIndex Index within the currently rendered slice.
 * @param sliceStart Absolute index of the first item in the slice.
 * @returns The absolute index.
 */
export function toAbsoluteIndex(visibleIndex: number, sliceStart: number): number {
	return sliceStart + visibleIndex;
}

/**
 * Determines whether `target` is `node` or any of its descendants in a tree, where children
 * are stored under the `childrenKey` property. Used to forbid dropping a node into its own
 * subtree (which would create a cycle).
 *
 * @param node Root node of the subtree to search.
 * @param target Item to look for (e.g. the parent of a candidate drop container).
 * @param childrenKey Property name holding the children collection.
 * @returns `true` when `target` is `node` or one of its descendants.
 */
export function containsNode(node: any, target: any, childrenKey: string): boolean {
	if (target == null) {
		return false;
	}
	if (node === target) {
		return true;
	}
	const children = node?.[childrenKey];
	if (!Array.isArray(children)) {
		return false;
	}
	return children.some((child) => containsNode(child, target, childrenKey));
}
