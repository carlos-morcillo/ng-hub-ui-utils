import { IsStringPipe } from './is-string.pipe';

/**
 * Test suite for IsStringPipe
 * Tests the type checking functionality for string values
 */
describe('IsStringPipe', () => {
	let pipe: IsStringPipe;

	beforeEach(() => {
		pipe = new IsStringPipe();
	});

	it('should create an instance', () => {
		expect(pipe).toBeTruthy();
	});

	describe('transform', () => {
		it('should return true for regular strings', () => {
			const result = pipe.transform('hello world');
			expect(result).toBe(true);
		});

		it('should return true for empty strings', () => {
			const result = pipe.transform('');
			expect(result).toBe(true);
		});

		it('should return true for string with whitespace', () => {
			const result = pipe.transform('   ');
			expect(result).toBe(true);
		});

		it('should return true for string numbers', () => {
			const result = pipe.transform('123');
			expect(result).toBe(true);
		});

		it('should return true for template literals', () => {
			const name = 'test';
			const result = pipe.transform(`Hello ${name}`);
			expect(result).toBe(true);
		});

		it('should return false for numbers', () => {
			const result = pipe.transform(42);
			expect(result).toBe(false);
		});

		it('should return false for booleans', () => {
			expect(pipe.transform(true)).toBe(false);
			expect(pipe.transform(false)).toBe(false);
		});

		it('should return false for objects', () => {
			const result = pipe.transform({ key: 'value' });
			expect(result).toBe(false);
		});

		it('should return false for arrays', () => {
			const result = pipe.transform([1, 2, 3]);
			expect(result).toBe(false);
		});

		it('should return false for null', () => {
			const result = pipe.transform(null);
			expect(result).toBe(false);
		});

		it('should return false for undefined', () => {
			const result = pipe.transform(undefined);
			expect(result).toBe(false);
		});

		it('should return false for functions', () => {
			const result = pipe.transform(() => {});
			expect(result).toBe(false);
		});

		it('should return false for Date objects', () => {
			const result = pipe.transform(new Date());
			expect(result).toBe(false);
		});
	});
});
