import { createPointerDragSession, PointerDragSessionConfig } from './pointer-drag';

/**
 * Builds a pointer-like event the session can consume in a DOM testing environment.
 */
function pointerEvent(type: string, clientX: number, clientY: number, pointerId = 1): Event {
	const event = new Event(type, { bubbles: true, cancelable: true });
	Object.assign(event, { clientX, clientY, pointerId });
	return event;
}

/**
 * Builds a session config with spies and sensible defaults.
 */
function buildConfig(overrides: Partial<PointerDragSessionConfig> = {}): PointerDragSessionConfig {
	const sourceEl = document.createElement('div');
	document.body.appendChild(sourceEl);
	return {
		startEvent: pointerEvent('pointerdown', 10, 10) as PointerEvent,
		sourceEl,
		ghostFactory: () => document.createElement('div'),
		onStart: vi.fn(),
		onMove: vi.fn(),
		onDrop: vi.fn(),
		onCancel: vi.fn(),
		onEnd: vi.fn(),
		...overrides
	};
}

describe('createPointerDragSession', () => {
	it('should not drop on a tap (no movement past threshold)', () => {
		const config = buildConfig();
		createPointerDragSession(config);
		window.dispatchEvent(pointerEvent('pointerup', 11, 11));
		expect(config.onStart).not.toHaveBeenCalled();
		expect(config.onDrop).not.toHaveBeenCalled();
		expect(config.onEnd).toHaveBeenCalledTimes(1);
	});

	it('should start dragging and drop after moving past the threshold', () => {
		const config = buildConfig();
		createPointerDragSession(config);
		window.dispatchEvent(pointerEvent('pointermove', 100, 100));
		expect(config.onStart).toHaveBeenCalledTimes(1);
		expect(config.onMove).toHaveBeenCalledWith(100, 100);
		expect(document.querySelector('.hub-drag-ghost')).toBeTruthy();
		window.dispatchEvent(pointerEvent('pointerup', 120, 120));
		expect(config.onDrop).toHaveBeenCalledWith(120, 120);
		expect(config.onEnd).toHaveBeenCalledTimes(1);
		expect(document.querySelector('.hub-drag-ghost')).toBeNull();
	});

	it('should clean up on destroy', () => {
		const config = buildConfig();
		const session = createPointerDragSession(config);
		session.destroy();
		expect(config.onEnd).toHaveBeenCalledTimes(1);
	});
});
