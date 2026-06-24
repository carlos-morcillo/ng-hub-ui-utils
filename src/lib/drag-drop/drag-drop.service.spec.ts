import { ActiveDrag, DragContainerRef } from './types';
import { HubDragDropService } from './drag-drop.service';

/**
 * Builds a minimal container reference for testing.
 */
function container(ownerId: string, group: string | null): DragContainerRef {
	return { key: `${ownerId}:root`, ownerId, group, items: [], parentItem: null, depth: 0 };
}

/**
 * Builds a minimal active-drag snapshot for testing.
 */
function activeDrag(ownerId: string, group: string | null): ActiveDrag {
	return {
		sourceId: ownerId,
		sourceGroup: group,
		item: { id: 1 },
		sourceContainer: container(ownerId, group),
		sourceIndex: 0,
		pointerMode: 'native'
	};
}

describe('HubDragDropService', () => {
	let service: HubDragDropService;

	beforeEach(() => {
		service = new HubDragDropService();
	});

	it('should start with no active drag', () => {
		expect(service.isDragging()).toBe(false);
		expect(service.active()).toBeNull();
	});

	it('should track begin/end of a drag', () => {
		service.begin(activeDrag('a', null));
		expect(service.isDragging()).toBe(true);
		service.end();
		expect(service.isDragging()).toBe(false);
		expect(service.target()).toBeNull();
	});

	it('should always allow dropping on the source owner', () => {
		service.register({ ownerId: 'a', group: () => null });
		service.begin(activeDrag('a', null));
		expect(service.canDrop('a')).toBe(true);
	});

	it('should forbid cross-owner drops without a shared group', () => {
		service.register({ ownerId: 'a', group: () => null });
		service.register({ ownerId: 'b', group: () => null });
		service.begin(activeDrag('a', null));
		expect(service.canDrop('b')).toBe(false);
	});

	it('should allow cross-owner drops when groups match', () => {
		service.register({ ownerId: 'a', group: () => 'g1' });
		service.register({ ownerId: 'b', group: () => 'g1' });
		service.begin(activeDrag('a', 'g1'));
		expect(service.canDrop('b')).toBe(true);
	});

	it('should forbid cross-owner drops when groups differ', () => {
		service.register({ ownerId: 'a', group: () => 'g1' });
		service.register({ ownerId: 'b', group: () => 'g2' });
		service.begin(activeDrag('a', 'g1'));
		expect(service.canDrop('b')).toBe(false);
	});

	it('should return false from canDrop without an active drag', () => {
		expect(service.canDrop('a')).toBe(false);
	});

	it('should delegate refresh and commit to the registered owner', () => {
		const refresh = vi.fn();
		const commit = vi.fn();
		service.register({ ownerId: 'a', group: () => null, refresh, commit });
		service.refreshSource('a');
		service.requestCommit('a');
		expect(refresh).toHaveBeenCalledTimes(1);
		expect(commit).toHaveBeenCalledTimes(1);
	});
});
