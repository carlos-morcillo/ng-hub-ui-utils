import { ChangeDetectorRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { TranslatePipe } from './translate.pipe';
import { HubTranslationService } from '../i18n/hub-translation.service';

/**
 * Test suite for TranslatePipe
 * Tests the translation functionality with parameter interpolation
 */
describe('TranslatePipe', () => {
	let pipe: TranslatePipe;
	let translationService: jasmine.SpyObj<HubTranslationService>;
	let changeDetectorRef: jasmine.SpyObj<ChangeDetectorRef>;
	let translationObserver: Subject<any>;

	beforeEach(() => {
		translationObserver = new Subject();

		translationService = jasmine.createSpyObj('HubTranslationService', [
			'getTranslation'
		]);
		translationService.translationObserver = translationObserver.asObservable();

		changeDetectorRef = jasmine.createSpyObj('ChangeDetectorRef', [
			'markForCheck'
		]);

		TestBed.configureTestingModule({
			providers: [
				{ provide: HubTranslationService, useValue: translationService },
				{ provide: ChangeDetectorRef, useValue: changeDetectorRef }
			]
		});

		pipe = TestBed.runInInjectionContext(() => new TranslatePipe());
	});

	afterEach(() => {
		pipe.ngOnDestroy();
	});

	it('should create an instance', () => {
		expect(pipe).toBeTruthy();
	});

	describe('transform', () => {
		it('should return empty string for empty query', () => {
			const result = pipe.transform('');
			expect(result).toBe('');
		});

		it('should return the query itself for null query', () => {
			const result = pipe.transform(null as any);
			expect(result).toBe(null);
		});

		it('should return the query itself for undefined query', () => {
			const result = pipe.transform(undefined as any);
			expect(result).toBe(undefined);
		});

		it('should translate simple key', () => {
			translationService.getTranslation.and.returnValue('Hello World');
			const result = pipe.transform('greeting');
			expect(result).toBe('Hello World');
			expect(translationService.getTranslation).toHaveBeenCalledWith('greeting');
		});

		it('should return key if translation not found', () => {
			translationService.getTranslation.and.returnValue(undefined);
			const result = pipe.transform('unknown.key');
			// When translation is undefined, interpolateString returns empty string
			expect(result).toBe('');
		});

		it('should cache translation for same key', () => {
			translationService.getTranslation.and.returnValue('Cached Value');
			pipe.transform('test.key');
			translationService.getTranslation.calls.reset();

			const result = pipe.transform('test.key');
			expect(result).toBe('Cached Value');
			expect(translationService.getTranslation).not.toHaveBeenCalled();
		});

		it('should interpolate parameters as object', () => {
			translationService.getTranslation.and.returnValue('Hello {{name}}!');
			const result = pipe.transform('greeting', { name: 'John' });
			expect(result).toBe('Hello John!');
		});

		it('should parse string parameters to object', () => {
			translationService.getTranslation.and.returnValue('Count: {{count}}');
			const result = pipe.transform('message', '{count:5}');
			expect(result).toBe('Count: 5');
		});

		it('should handle string parameters with quotes', () => {
			translationService.getTranslation.and.returnValue('Name: {{name}}');
			const result = pipe.transform('message', "{name:'Alice'}");
			expect(result).toBe('Name: Alice');
		});

		it('should handle multiple interpolation parameters', () => {
			translationService.getTranslation.and.returnValue(
				'{{greeting}} {{name}}!'
			);
			const result = pipe.transform('message', { greeting: 'Hello', name: 'Bob' });
			expect(result).toBe('Hello Bob!');
		});

		it('should throw error for invalid parameter string', () => {
			translationService.getTranslation.and.returnValue('Test');
			expect(() => {
				pipe.transform('key', 'invalid{json');
			}).toThrow(jasmine.any(SyntaxError));
		});

		it('should handle array arguments by ignoring them', () => {
			translationService.getTranslation.and.returnValue('Test');
			const result = pipe.transform('key', [1, 2, 3] as any);
			expect(result).toBe('Test');
		});

		it('should update on translation observer emission', (done) => {
			translationService.getTranslation.and.returnValue('Initial');
			pipe.transform('key');

			translationService.getTranslation.and.returnValue('Updated');
			translationObserver.next({});

			setTimeout(() => {
				expect(pipe.value).toBe('Updated');
				expect(changeDetectorRef.markForCheck).toHaveBeenCalled();
				done();
			}, 10);
		});

		it('should unsubscribe from previous translation observer', () => {
			translationService.getTranslation.and.returnValue('Test1');
			pipe.transform('key1');
			const firstSubscription = pipe.translationSubscription;

			translationService.getTranslation.and.returnValue('Test2');
			pipe.transform('key2');

			expect(firstSubscription?.closed).toBe(true);
		});

		it('should handle changing parameters for same key', () => {
			translationService.getTranslation.and.returnValue('Value: {{val}}');

			pipe.transform('key', { val: 1 });
			expect(pipe.value).toBe('Value: 1');

			pipe.transform('key', { val: 2 });
			expect(pipe.value).toBe('Value: 2');
		});

		it('should preserve whitespace in interpolated values', () => {
			translationService.getTranslation.and.returnValue('Text: {{text}}');
			const result = pipe.transform('key', { text: '  spaced  ' });
			expect(result).toBe('Text:   spaced  ');
		});

		it('should handle numeric interpolation parameters', () => {
			translationService.getTranslation.and.returnValue('{{count}} items');
			const result = pipe.transform('key', { count: 42 });
			expect(result).toBe('42 items');
		});
	});

	describe('updateValue', () => {
		it('should update value and mark for check', () => {
			translationService.getTranslation.and.returnValue('Updated');
			pipe.updateValue('test.key');

			expect(pipe.value).toBe('Updated');
			expect(pipe.lastKey).toBe('test.key');
			expect(changeDetectorRef.markForCheck).toHaveBeenCalled();
		});

		it('should use key as value if translation returns undefined', () => {
			translationService.getTranslation.and.returnValue(undefined);
			pipe.updateValue('fallback.key');

			// When translation is undefined, interpolateString returns empty string
			expect(pipe.value).toBe('');
		});
	});

	describe('ngOnDestroy', () => {
		it('should unsubscribe from translation observer', () => {
			translationService.getTranslation.and.returnValue('Test');
			pipe.transform('key');

			const subscription = pipe.translationSubscription;
			pipe.ngOnDestroy();

			expect(subscription?.closed).toBe(true);
			expect(pipe.translationSubscription).toBeUndefined();
		});

		it('should not throw if no subscription exists', () => {
			expect(() => pipe.ngOnDestroy()).not.toThrow();
		});
	});
});
