import { UcfirstPipe } from './ucfirst.pipe';

/**
 * Test suite for UcfirstPipe
 * Tests the uppercase first character transformation functionality
 */
describe('UcfirstPipe', () => {
	let pipe: UcfirstPipe;

	beforeEach(() => {
		pipe = new UcfirstPipe();
	});

	it('should create an instance', () => {
		expect(pipe).toBeTruthy();
	});

	describe('transform', () => {
		it('should capitalize the first letter of a lowercase string', () => {
			const result = pipe.transform('hello');
			expect(result).toBe('Hello');
		});

		it('should keep the first letter uppercase if already capitalized', () => {
			const result = pipe.transform('Hello');
			expect(result).toBe('Hello');
		});

		it('should capitalize first letter and preserve rest of the string', () => {
			const result = pipe.transform('hello world');
			expect(result).toBe('Hello world');
		});

		it('should handle all uppercase strings', () => {
			const result = pipe.transform('HELLO');
			expect(result).toBe('HELLO');
		});

		it('should handle single character strings', () => {
			expect(pipe.transform('a')).toBe('A');
			expect(pipe.transform('A')).toBe('A');
		});

		it('should return empty string for empty input', () => {
			const result = pipe.transform('');
			expect(result).toBe('');
		});

		it('should use empty string as default when no value provided', () => {
			const result = pipe.transform();
			expect(result).toBe('');
		});

		it('should handle strings with numbers', () => {
			const result = pipe.transform('123abc');
			expect(result).toBe('123abc');
		});

		it('should handle strings starting with special characters', () => {
			const result = pipe.transform('!hello');
			expect(result).toBe('!hello');
		});

		it('should handle strings with only whitespace', () => {
			const result = pipe.transform('   ');
			expect(result).toBe('   ');
		});

		it('should capitalize strings starting with whitespace', () => {
			const result = pipe.transform(' hello');
			expect(result).toBe(' hello');
		});

		it('should handle mixed case strings', () => {
			const result = pipe.transform('hELLO wORLD');
			expect(result).toBe('HELLO wORLD');
		});

		it('should handle unicode characters', () => {
			const result = pipe.transform('über');
			expect(result).toBe('Über');
		});

		it('should handle emoji at start', () => {
			const result = pipe.transform('😀hello');
			expect(result).toBe('😀hello');
		});
	});
});
