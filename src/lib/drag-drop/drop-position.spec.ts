import { resolveDropPosition } from './drop-position';

describe('resolveDropPosition', () => {
	const rect = { top: 100, bottom: 140, left: 0, right: 200, width: 200, height: 40 };

	it('should use the Y axis in vertical mode', () => {
		expect(resolveDropPosition(10, 110, rect, 'vertical', false)).toBe('before');
		expect(resolveDropPosition(10, 135, rect, 'vertical', false)).toBe('after');
	});

	it('should use the X axis in horizontal mode (mirrored in RTL)', () => {
		expect(resolveDropPosition(50, 120, rect, 'horizontal', false)).toBe('before');
		expect(resolveDropPosition(150, 120, rect, 'horizontal', false)).toBe('after');
		expect(resolveDropPosition(50, 120, rect, 'horizontal', true)).toBe('after');
		expect(resolveDropPosition(150, 120, rect, 'horizontal', true)).toBe('before');
	});

	it('should use the horizontal axis within a row in grid mode', () => {
		expect(resolveDropPosition(50, 120, rect, 'grid', false)).toBe('before');
		expect(resolveDropPosition(150, 120, rect, 'grid', false)).toBe('after');
	});

	it('should mirror the horizontal axis in RTL grid mode', () => {
		expect(resolveDropPosition(50, 120, rect, 'grid', true)).toBe('after');
		expect(resolveDropPosition(150, 120, rect, 'grid', true)).toBe('before');
	});
});
