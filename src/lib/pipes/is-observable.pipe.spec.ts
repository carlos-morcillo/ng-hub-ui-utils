import { of, Subject, BehaviorSubject, ReplaySubject } from 'rxjs';
import { IsObservablePipe } from './is-observable.pipe';

/**
 * Test suite for IsObservablePipe
 * Tests the type checking functionality for Observable values
 */
describe('IsObservablePipe', () => {
	let pipe: IsObservablePipe;

	beforeEach(() => {
		pipe = new IsObservablePipe();
	});

	it('should create an instance', () => {
		expect(pipe).toBeTruthy();
	});

	describe('transform', () => {
		it('should return true for Observables created with of()', () => {
			const observable = of(1, 2, 3);
			const result = pipe.transform(observable);
			expect(result).toBe(true);
		});

		it('should return true for Subject instances', () => {
			const subject = new Subject();
			const result = pipe.transform(subject);
			expect(result).toBe(true);
		});

		it('should return true for BehaviorSubject instances', () => {
			const behaviorSubject = new BehaviorSubject('initial');
			const result = pipe.transform(behaviorSubject);
			expect(result).toBe(true);
		});

		it('should return true for ReplaySubject instances', () => {
			const replaySubject = new ReplaySubject();
			const result = pipe.transform(replaySubject);
			expect(result).toBe(true);
		});

		it('should return false for regular values', () => {
			const result = pipe.transform(42);
			expect(result).toBe(false);
		});

		it('should return false for strings', () => {
			const result = pipe.transform('test');
			expect(result).toBe(false);
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

		it('should return false for Promises', () => {
			const promise = Promise.resolve(42);
			const result = pipe.transform(promise as any);
			expect(result).toBe(false);
		});

		it('should return false for functions', () => {
			const fn = () => {};
			const result = pipe.transform(fn as any);
			expect(result).toBe(false);
		});

		it('should return false for objects that look like observables but are not', () => {
			const fakeObservable = {
				subscribe: () => {}
			};
			const result = pipe.transform(fakeObservable as any);
			expect(result).toBe(false);
		});
	});
});
