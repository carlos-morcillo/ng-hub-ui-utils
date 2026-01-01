import { IsObjectPipe } from './is-object.pipe';

/**
 * Test suite for IsObjectPipe
 * Tests the type checking functionality for object values
 */
describe('IsObjectPipe', () => {
	let pipe: IsObjectPipe;

	beforeEach(() => {
		pipe = new IsObjectPipe();
	});

	it('should create an instance', () => {
		expect(pipe).toBeTruthy();
	});

	describe('transform', () => {
		it('should return true for plain objects', () => {
			const result = pipe.transform({ key: 'value' });
			expect(result).toBe(true);
		});

		it('should return true for empty objects', () => {
			const result = pipe.transform({});
			expect(result).toBe(true);
		});

		it('should return true for arrays (arrays are objects in JavaScript)', () => {
			const result = pipe.transform([1, 2, 3]);
			expect(result).toBe(true);
		});

		it('should return true for null (null is typeof object in JavaScript)', () => {
			const result = pipe.transform(null);
			expect(result).toBe(true);
		});

		it('should return true for Date objects', () => {
			const result = pipe.transform(new Date());
			expect(result).toBe(true);
		});

		it('should return true for RegExp objects', () => {
			const result = pipe.transform(/test/);
			expect(result).toBe(true);
		});

		it('should return false for strings', () => {
			const result = pipe.transform('test');
			expect(result).toBe(false);
		});

		it('should return false for numbers', () => {
			const result = pipe.transform(42);
			expect(result).toBe(false);
		});

		it('should return false for booleans', () => {
			expect(pipe.transform(true)).toBe(false);
			expect(pipe.transform(false)).toBe(false);
		});

		it('should return false for undefined', () => {
			const result = pipe.transform(undefined);
			expect(result).toBe(false);
		});

		it('should return false for functions', () => {
			const result = pipe.transform(() => {});
			expect(result).toBe(false);
		});

		it('should return false for symbols', () => {
			const result = pipe.transform(Symbol('test'));
			expect(result).toBe(false);
		});
	});
});
