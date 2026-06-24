/**
 * Side a dragged item is dropped relative to a hovered target item.
 */
export type DropPosition = 'before' | 'after';

/**
 * Transport driving a drag gesture: native HTML5 drag-and-drop or the Pointer Events
 * touch/pen fallback.
 */
export type DragPointerMode = 'native' | 'pointer';

/**
 * Opaque reference to the collection an item belongs to during a drag operation.
 *
 * A draggable surface can be a tree of collections (e.g. a list root plus nested children,
 * or a board's columns each holding cards). A `DragContainerRef` pins the exact collection
 * (its data array) so reorder/transfer operate on the right place — including cross-instance
 * transfers where source and target live in different component instances.
 *
 * Consumers backed by reactive forms can extend this interface to also carry the mirroring
 * `FormArray`; the coordinator treats the reference opaquely and never reads extra fields.
 *
 * @template T Item type held by the collection.
 */
export interface DragContainerRef<T = any> {
	/** Stable key identifying this collection within its owner (used for DOM hit-testing). */
	key: string;
	/** Identifier of the owning component instance. */
	ownerId: string;
	/** Drag group shared across owners, or `null` when the owner has no group. */
	group: string | null;
	/** The data array backing this collection. */
	items: T[];
	/** Parent item owning this collection in a nested structure, or `null` for the root. */
	parentItem: T | null;
	/** Nesting depth (0 for the root collection). */
	depth: number;
	/** Optional discriminator when an owner manages more than one kind of collection. */
	kind?: string;
}

/**
 * Snapshot of the item currently being dragged and where it came from.
 *
 * @template T Item type.
 */
export interface ActiveDrag<T = any> {
	/** Identifier of the source owner. */
	sourceId: string;
	/** Drag group of the source owner (`null` when ungrouped). */
	sourceGroup: string | null;
	/** The item being dragged. */
	item: T;
	/** The collection the item was picked from. */
	sourceContainer: DragContainerRef<T>;
	/** Absolute index of the item in its source collection. */
	sourceIndex: number;
	/** Transport driving the gesture. */
	pointerMode: DragPointerMode;
	/** Optional discriminator (e.g. `'card'` vs `'column'`). */
	kind?: string;
}

/**
 * Transient drop target updated while hovering during a drag.
 *
 * @template T Item type.
 */
export interface DragTarget<T = any> {
	/** Identifier of the hovered owner. */
	ownerId: string;
	/** The collection being hovered. */
	container: DragContainerRef<T>;
	/** Absolute index of the hovered item (ignored when `atEnd` is `true`). */
	index: number;
	/** Drop side relative to the hovered item. */
	position: DropPosition;
	/** Whether the drop lands at the end of the collection. */
	atEnd: boolean;
}

/**
 * Registration entry an owner publishes so the coordinator can resolve its group lazily,
 * refresh/commit on its behalf, and resolve a drop target from a DOM point during the
 * Pointer Events fallback (where hit-testing crosses component instances).
 */
export interface DragRegistration {
	/** Identifier of the owner. */
	ownerId: string;
	/** Lazily reads the owner's current drag group. */
	group: () => string | null;
	/** Re-renders the owner (used after a cross-owner transfer mutates it). */
	refresh?: () => void;
	/** Commits the pending drop as the destination owner. */
	commit?: () => void;
	/** Resolves a drop target inside this owner from a DOM element and pointer coordinates. */
	resolveTarget?: (element: HTMLElement, clientX: number, clientY: number) => DragTarget | null;
}
