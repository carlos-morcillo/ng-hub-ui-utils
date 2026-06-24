/**
 * Configuration for a Pointer Events drag session — the touch/pen fallback for native
 * HTML5 drag-and-drop, used where native dragging is unavailable (mobile/tablet).
 */
export interface PointerDragSessionConfig {
	/** The `pointerdown` event that initiated the gesture. */
	startEvent: PointerEvent;
	/** The element being dragged. */
	sourceEl: HTMLElement;
	/** Builds the floating ghost content (custom preview render or a clone). */
	ghostFactory: () => HTMLElement;
	/** Distance in pixels the pointer must travel before a drag begins (default 8). */
	threshold?: number;
	/** Called once the gesture passes the threshold and becomes a drag. */
	onStart: () => void;
	/** Called on every move while dragging, with viewport coordinates. */
	onMove: (clientX: number, clientY: number) => void;
	/** Called on drop (pointer up after a real drag), with viewport coordinates. */
	onDrop: (clientX: number, clientY: number) => void;
	/** Called when the gesture is cancelled (e.g. `pointercancel`). */
	onCancel: () => void;
	/** Always called last for cleanup, regardless of outcome. */
	onEnd: () => void;
}

/**
 * Handle to an in-progress Pointer Events drag session.
 */
export interface PointerDragSession {
	/** Aborts the session and runs cleanup. */
	destroy(): void;
}

const EDGE_MARGIN = 48;
const MAX_SCROLL_SPEED = 16;

/**
 * Creates a Pointer Events drag session that mirrors native drag-and-drop on touch devices.
 *
 * The session waits for the pointer to pass a movement threshold (so taps still behave as
 * taps), then renders a floating ghost that follows the finger, reports hover positions via
 * `onMove`, autoscrolls when near a scroll container's edges, and commits on pointer up.
 *
 * @param config Session configuration.
 * @returns A handle whose `destroy()` aborts the session.
 */
export function createPointerDragSession(config: PointerDragSessionConfig): PointerDragSession {
	const threshold = config.threshold ?? 8;
	const pointerId = config.startEvent.pointerId;
	const startX = config.startEvent.clientX;
	const startY = config.startEvent.clientY;

	const rect = config.sourceEl.getBoundingClientRect();
	const grabOffsetX = startX - rect.left;
	const grabOffsetY = startY - rect.top;

	let started = false;
	let ghost: HTMLElement | null = null;
	let scrollContainer: HTMLElement | Window = window;
	let rafId: number | null = null;
	let scrollVelocity = 0;

	/**
	 * Positions the ghost under the pointer.
	 *
	 * @param x Pointer X.
	 * @param y Pointer Y.
	 */
	const positionGhost = (x: number, y: number): void => {
		if (ghost) {
			ghost.style.transform = `translate(${x - grabOffsetX}px, ${y - grabOffsetY}px)`;
		}
	};

	/**
	 * Runs the autoscroll animation loop while the pointer sits in an edge zone.
	 */
	const scrollStep = (): void => {
		if (scrollVelocity !== 0) {
			if (scrollContainer === window) {
				window.scrollBy(0, scrollVelocity);
			} else {
				(scrollContainer as HTMLElement).scrollTop += scrollVelocity;
			}
			rafId = requestAnimationFrame(scrollStep);
		} else {
			rafId = null;
		}
	};

	/**
	 * Updates the autoscroll velocity from the pointer's proximity to the container edges.
	 *
	 * @param y Pointer Y.
	 */
	const updateAutoscroll = (y: number): void => {
		const bounds =
			scrollContainer === window
				? { top: 0, bottom: window.innerHeight }
				: (scrollContainer as HTMLElement).getBoundingClientRect();
		if (y < bounds.top + EDGE_MARGIN) {
			scrollVelocity = -Math.ceil((MAX_SCROLL_SPEED * (bounds.top + EDGE_MARGIN - y)) / EDGE_MARGIN);
		} else if (y > bounds.bottom - EDGE_MARGIN) {
			scrollVelocity = Math.ceil((MAX_SCROLL_SPEED * (y - (bounds.bottom - EDGE_MARGIN))) / EDGE_MARGIN);
		} else {
			scrollVelocity = 0;
		}
		if (scrollVelocity !== 0 && rafId === null) {
			rafId = requestAnimationFrame(scrollStep);
		}
	};

	/**
	 * Begins the actual drag once the threshold is exceeded.
	 *
	 * @param x Pointer X.
	 * @param y Pointer Y.
	 */
	const beginDrag = (x: number, y: number): void => {
		started = true;
		scrollContainer = findScrollContainer(config.sourceEl);
		ghost = config.ghostFactory();
		ghost.classList.add('hub-drag-ghost');
		ghost.style.position = 'fixed';
		ghost.style.top = '0';
		ghost.style.left = '0';
		ghost.style.width = `${rect.width}px`;
		ghost.style.pointerEvents = 'none';
		ghost.style.zIndex = '2147483647';
		ghost.style.margin = '0';
		positionGhost(x, y);
		document.body.appendChild(ghost);
		config.onStart();
	};

	/**
	 * Handles pointer movement: starts the drag past threshold, then tracks and autoscrolls.
	 *
	 * @param event Pointer move event.
	 */
	const onPointerMove = (event: PointerEvent): void => {
		if (event.pointerId !== pointerId) {
			return;
		}
		const { clientX, clientY } = event;
		if (!started) {
			if (Math.abs(clientX - startX) < threshold && Math.abs(clientY - startY) < threshold) {
				return;
			}
			beginDrag(clientX, clientY);
		}
		event.preventDefault();
		positionGhost(clientX, clientY);
		config.onMove(clientX, clientY);
		updateAutoscroll(clientY);
	};

	/**
	 * Handles pointer up: commits the drop when a drag actually happened.
	 *
	 * @param event Pointer up event.
	 */
	const onPointerUp = (event: PointerEvent): void => {
		if (event.pointerId !== pointerId) {
			return;
		}
		if (started) {
			config.onDrop(event.clientX, event.clientY);
		}
		cleanup();
	};

	/**
	 * Handles pointer cancellation.
	 *
	 * @param event Pointer cancel event.
	 */
	const onPointerCancel = (event: PointerEvent): void => {
		if (event.pointerId !== pointerId) {
			return;
		}
		if (started) {
			config.onCancel();
		}
		cleanup();
	};

	/**
	 * Removes listeners, the ghost and any pending animation frame, then notifies the owner.
	 */
	const cleanup = (): void => {
		window.removeEventListener('pointermove', onPointerMove);
		window.removeEventListener('pointerup', onPointerUp);
		window.removeEventListener('pointercancel', onPointerCancel);
		if (rafId !== null) {
			cancelAnimationFrame(rafId);
			rafId = null;
		}
		scrollVelocity = 0;
		ghost?.remove();
		ghost = null;
		try {
			config.sourceEl.releasePointerCapture(pointerId);
		} catch {
			// Pointer capture may not be held; ignore.
		}
		config.onEnd();
	};

	try {
		config.sourceEl.setPointerCapture(pointerId);
	} catch {
		// Environments without pointer capture (e.g. tests) can still proceed.
	}
	window.addEventListener('pointermove', onPointerMove, { passive: false });
	window.addEventListener('pointerup', onPointerUp);
	window.addEventListener('pointercancel', onPointerCancel);

	return { destroy: cleanup };
}

/**
 * Finds the nearest vertically scrollable ancestor of an element, falling back to `window`.
 *
 * @param el Starting element.
 * @returns The scroll container (an element) or `window`.
 */
function findScrollContainer(el: HTMLElement | null): HTMLElement | Window {
	let node = el?.parentElement ?? null;
	while (node && node !== document.body && node !== document.documentElement) {
		const style = getComputedStyle(node);
		const overflowY = style.overflowY;
		if ((overflowY === 'auto' || overflowY === 'scroll') && node.scrollHeight > node.clientHeight) {
			return node;
		}
		node = node.parentElement;
	}
	return window;
}
