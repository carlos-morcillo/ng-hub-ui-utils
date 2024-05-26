import { NgZone } from '@angular/core';
import { Observable, OperatorFunction } from 'rxjs';

/**
 * Converts a value to an integer using parseInt.
 *
 * @param {any} value - The `value` parameter in the `toInteger` function is the input value that needs to be converted to an
 * integer.
 *
 * @returns Is returning the parsed integer value of the input `value`.
 */
export function toInteger(value: any): number {
	return parseInt(`${value}`, 10);
}

export function toString(value: any): string {
	return value !== undefined && value !== null ? `${value}` : '';
}

export function getValueInRange(value: number, max: number, min = 0): number {
	return Math.max(Math.min(value, max), min);
}

export function isString(value: any): value is string {
	return typeof value === 'string';
}

export function isNumber(value: any): value is number {
	return !isNaN(toInteger(value));
}

export function isInteger(value: any): value is number {
	return (
		typeof value === 'number' &&
		isFinite(value) &&
		Math.floor(value) === value
	);
}

export function isDefined(value: any): boolean {
	return value !== undefined && value !== null;
}

/**
 * Checks if a value is a Promise.
 *
 * @param {any} v - The parameter `v` in the `isPromise` function represents any value that is being checked to determine if it is
 * a Promise.
 *
 * @returns A boolean value indicating whether the input `v` is a Promise or not. If `v` has a `then` property, it is considered
 * a Promise and the function returns `true`. Otherwise, it returns `false`.
 */
export function isPromise<T>(v: any): v is Promise<T> {
	return v && v.then;
}

/**
 * Pads a number with a leading zero if it is a valid number.
 *
 * @param {number} value - The `padNumber` function takes a number as input and pads it with a leading zero if it is a valid
 * number. If the input is not a number, it returns an empty string.
 *
 * @returns Takes a number as input and pads it with a leading zero if it is a valid number. If the input is a number, the function
 * returns the input value padded with a leading zero and sliced to keep only the last two characters. If the input is not a number,
 * an empty string is returned.
 */
export function padNumber(value: number) {
	if (isNumber(value)) {
		return `0${value}`.slice(-2);
	} else {
		return '';
	}
}

/**
 * Escapes special characters in a given text to be used in a regular expression.
 *
 * @param text - The `regExpEscape` function takes a `text` parameter as input. This function is designed to escape special
 * characters in a given text so that it can be safely used within a regular expression pattern.
 *
 * @returns A new string with any special characters in the input `text` escaped with a backslash.
 */
export function regExpEscape(text) {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

export function closest(
	element: HTMLElement,
	selector?: string
): HTMLElement | null {
	if (!selector) {
		return null;
	}

	/*
	 * In certain browsers (e.g. Edge 44.18362.449.0) HTMLDocument does
	 * not support `Element.prototype.closest`. To emulate the correct behaviour
	 * we return null when the method is missing.
	 *
	 * Note that in evergreen browsers `closest(document.documentElement, 'html')`
	 * will return the document element whilst in Edge null will be returned. This
	 * compromise was deemed good enough.
	 */
	if (typeof element.closest === 'undefined') {
		return null;
	}

	return element.closest(selector);
}

/**
 * Force a browser reflow
 *
 * @param element element where to apply the reflow
 */
export function reflow(element: HTMLElement) {
	return (element || document.body).getBoundingClientRect();
}

/**
 * Creates an observable where all callbacks are executed inside a given zone
 *
 * @param zone
 */
export function runInZone<T>(zone: NgZone): OperatorFunction<T, T> {
	return (source) => {
		return new Observable((observer) => {
			const next = (value: T) => zone.run(() => observer.next(value));
			const error = (e: any) => zone.run(() => observer.error(e));
			const complete = () => zone.run(() => observer.complete());
			return source.subscribe({ next, error, complete });
		});
	};
}

export function removeAccents(str: string): string {
	return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Returns the active element in the given root.
 *
 * If the active element is inside a shadow root, it is searched recursively.
 */
export function getActiveElement(
	root: Document | ShadowRoot = document
): Element | null {
	const activeEl = root?.activeElement;

	if (!activeEl) {
		return null;
	}

	return activeEl.shadowRoot
		? getActiveElement(activeEl.shadowRoot)
		: activeEl;
}
