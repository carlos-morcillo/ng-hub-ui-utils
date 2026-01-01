import { ChangeDetectorRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of, Subject, BehaviorSubject, delay } from 'rxjs';
import { UnwrapAsyncPipe } from './unwrap-async.pipe';

/**
 * Test suite for UnwrapAsyncPipe
 * Tests the unwrapping functionality for Observable and non-Observable values
 */
describe('UnwrapAsyncPipe', () => {
	let pipe: UnwrapAsyncPipe;
	let changeDetectorRef: jasmine.SpyObj<ChangeDetectorRef>;

	beforeEach(() => {
		changeDetectorRef = jasmine.createSpyObj('ChangeDetectorRef', [
			'markForCheck'
		]);

		TestBed.configureTestingModule({
			providers: [
				{ provide: ChangeDetectorRef, useValue: changeDetectorRef }
			]
		});
		pipe = TestBed.runInInjectionContext(() => new UnwrapAsyncPipe());
	});

	afterEach(() => {
		pipe.ngOnDestroy();
	});

	it('should create an instance', () => {
		expect(pipe).toBeTruthy();
	});

	describe('transform', () => {
		it('should return the value directly if not an Observable', () => {
			const value = 'test value';
			const result = pipe.transform(value);
			expect(result).toBe(value);
			expect(pipe.value).toBe(value);
		});

		it('should handle number values', () => {
			const value = 42;
			const result = pipe.transform(value);
			expect(result).toBe(value);
		});

		it('should handle object values', () => {
			const value = { key: 'value' };
			const result = pipe.transform(value);
			expect(result).toBe(value);
		});

		it('should handle null values', () => {
			const result = pipe.transform(null);
			expect(result).toBe(null);
		});

		it('should unwrap Observable values', (done) => {
			const observableValue = of('observable value');
			pipe.transform(observableValue);

			setTimeout(() => {
				expect(pipe.value).toBe('observable value');
				done();
			}, 10);
		});

		it('should handle Subject emissions', (done) => {
			const subject = new Subject<string>();
			pipe.transform(subject);

			subject.next('subject value');

			setTimeout(() => {
				expect(pipe.value).toBe('subject value');
				done();
			}, 10);
		});

		it('should handle BehaviorSubject with initial value', (done) => {
			const behaviorSubject = new BehaviorSubject('initial');
			pipe.transform(behaviorSubject);

			setTimeout(() => {
				expect(pipe.value).toBe('initial');
				done();
			}, 10);
		});

		it('should update value when BehaviorSubject emits new value', (done) => {
			const behaviorSubject = new BehaviorSubject('initial');
			pipe.transform(behaviorSubject);

			setTimeout(() => {
				expect(pipe.value).toBe('initial');
				behaviorSubject.next('updated');

				setTimeout(() => {
					expect(pipe.value).toBe('updated');
					done();
				}, 10);
			}, 10);
		});

		it('should unsubscribe from previous Observable when new Observable is provided', (done) => {
			const subject1 = new Subject<string>();
			const subject2 = new Subject<string>();

			pipe.transform(subject1);
			const firstSubscription = pipe.subscription;

			pipe.transform(subject2);

			expect(firstSubscription).not.toBe(pipe.subscription);
			expect(firstSubscription?.closed).toBe(true);

			subject1.next('should not update');
			subject2.next('should update');

			setTimeout(() => {
				expect(pipe.value).toBe('should update');
				done();
			}, 10);
		});

		it('should handle multiple Observable emissions', (done) => {
			const subject = new Subject<number>();
			pipe.transform(subject);

			subject.next(1);
			setTimeout(() => {
				expect(pipe.value).toBe(1);

				subject.next(2);
				setTimeout(() => {
					expect(pipe.value).toBe(2);

					subject.next(3);
					setTimeout(() => {
						expect(pipe.value).toBe(3);
						done();
					}, 10);
				}, 10);
			}, 10);
		});

		it('should handle Observable with delayed emission', (done) => {
			const delayedObservable = of('delayed').pipe(delay(50));
			pipe.transform(delayedObservable);

			expect(pipe.value).toBe(null);

			setTimeout(() => {
				expect(pipe.value).toBe('delayed');
				done();
			}, 100);
		});

		it('should return null initially for Observable that has not emitted', () => {
			const subject = new Subject<string>();
			const result = pipe.transform(subject);
			expect(result).toBe(null);
		});

		it('should handle switching from Observable to non-Observable value', (done) => {
			const subject = new Subject<string>();
			pipe.transform(subject);

			subject.next('observable value');

			setTimeout(() => {
				expect(pipe.value).toBe('observable value');
				const oldSubscription = pipe.subscription;

				pipe.transform('direct value');

				expect(pipe.value).toBe('direct value');
				expect(oldSubscription?.closed).toBe(true);
				expect(pipe.subscription).toBe(null);
				done();
			}, 10);
		});
	});

	describe('ngOnDestroy', () => {
		it('should unsubscribe from Observable on destroy', (done) => {
			const subject = new Subject<string>();
			pipe.transform(subject);

			setTimeout(() => {
				const subscription = pipe.subscription;
				expect(subscription).not.toBe(null);

				pipe.ngOnDestroy();

				expect(subscription?.closed).toBe(true);
				expect(pipe.subscription).toBe(null);
				done();
			}, 10);
		});

		it('should not throw error when destroying without subscription', () => {
			expect(() => pipe.ngOnDestroy()).not.toThrow();
		});

		it('should handle multiple destroy calls', (done) => {
			const subject = new Subject<string>();
			pipe.transform(subject);

			setTimeout(() => {
				pipe.ngOnDestroy();
				expect(() => pipe.ngOnDestroy()).not.toThrow();
				done();
			}, 10);
		});
	});
});
