import { computed, Injectable, signal } from '@angular/core';
import { ActiveDrag, DragRegistration, DragTarget } from './types';

/**
 * Singleton coordinator that backs native HTML5 drag-and-drop reordering and cross-instance
 * transfers (e.g. between two lists, or any two owners that share a drag group).
 *
 * A drag spans two component instances (source and target) and the native `dataTransfer`
 * payload is unreadable during `dragover`, so a shared, root-provided service is the only
 * reliable channel to know what is being dragged and from where while hovering. The service
 * only coordinates state; it never mutates the underlying collections.
 */
@Injectable({ providedIn: 'root' })
export class HubDragDropService {
	readonly #registrations = new Map<string, DragRegistration>();
	readonly #active = signal<ActiveDrag | null>(null);
	readonly #target = signal<DragTarget | null>(null);

	/** The drag currently in progress, or `null`. */
	readonly active = this.#active.asReadonly();
	/** The current drop target, or `null`. */
	readonly target = this.#target.asReadonly();
	/** Whether a drag is in progress. */
	readonly isDragging = computed(() => this.#active() !== null);

	/**
	 * Registers an owner so it can participate in (and be a target of) cross-owner transfers.
	 *
	 * @param registration The owner registration.
	 */
	register(registration: DragRegistration): void {
		this.#registrations.set(registration.ownerId, registration);
	}

	/**
	 * Removes an owner registration (call on destroy).
	 *
	 * @param ownerId Identifier of the owner to remove.
	 */
	unregister(ownerId: string): void {
		this.#registrations.delete(ownerId);
	}

	/**
	 * Starts a drag, recording the active item and clearing any previous target.
	 *
	 * @param drag The active drag snapshot.
	 */
	begin(drag: ActiveDrag): void {
		this.#active.set(drag);
		this.#target.set(null);
	}

	/**
	 * Updates the transient drop target while hovering.
	 *
	 * @param target The hovered target, or `null` to clear it.
	 */
	setTarget(target: DragTarget | null): void {
		this.#target.set(target);
	}

	/**
	 * Ends the current drag and clears all transient state.
	 */
	end(): void {
		this.#active.set(null);
		this.#target.set(null);
	}

	/**
	 * Determines whether the active drag may be dropped on the given owner. An owner always
	 * accepts its own items (in-owner reorder); a different owner accepts only when both
	 * share the same non-null drag group.
	 *
	 * @param targetOwnerId Identifier of the candidate target owner.
	 * @returns `true` when the drop is allowed.
	 */
	canDrop(targetOwnerId: string): boolean {
		const active = this.#active();
		if (!active) {
			return false;
		}
		if (targetOwnerId === active.sourceId) {
			return true;
		}
		const registration = this.#registrations.get(targetOwnerId);
		if (!registration) {
			return false;
		}
		const targetGroup = registration.group();
		return active.sourceGroup != null && targetGroup != null && active.sourceGroup === targetGroup;
	}

	/**
	 * Re-renders an owner on demand (used by the destination owner to refresh the source owner
	 * after a cross-owner transfer).
	 *
	 * @param ownerId Identifier of the owner to refresh.
	 */
	refreshSource(ownerId: string): void {
		this.#registrations.get(ownerId)?.refresh?.();
	}

	/**
	 * Asks an owner to commit the pending drop as the destination (Pointer Events fallback,
	 * where the source component drives the gesture but the destination must commit/emit).
	 *
	 * @param ownerId Identifier of the destination owner.
	 */
	requestCommit(ownerId: string): void {
		this.#registrations.get(ownerId)?.commit?.();
	}

	/**
	 * Resolves the drop target under a viewport point by hit-testing the DOM and delegating to
	 * the owning component (which knows its own collections). Used by the Pointer Events
	 * fallback, including cross-owner hovers where the target is a different component.
	 *
	 * @param clientX Viewport X coordinate.
	 * @param clientY Viewport Y coordinate.
	 * @returns The resolved target, or `null` when the point is not over a droppable owner.
	 */
	resolveTargetAt(clientX: number, clientY: number): DragTarget | null {
		if (typeof document === 'undefined') {
			return null;
		}
		const element = document.elementFromPoint(clientX, clientY) as HTMLElement | null;
		const hostEl = element?.closest('[data-hub-drag-owner]') as HTMLElement | null;
		const ownerId = hostEl?.getAttribute('data-hub-drag-owner');
		if (!element || !ownerId || !this.canDrop(ownerId)) {
			return null;
		}
		return this.#registrations.get(ownerId)?.resolveTarget?.(element, clientX, clientY) ?? null;
	}
}
