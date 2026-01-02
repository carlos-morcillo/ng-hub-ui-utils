import {
	ChangeDetectorRef,
	OnDestroy,
	Pipe,
	PipeTransform,
	inject
} from '@angular/core';
import { Subscription } from 'rxjs';
import { equals, interpolateString, isDefined } from '../util';
import { HubTranslationService } from '../i18n/hub-translation.service';

@Pipe({
	name: 'translate',
	standalone: true,
	pure: false
})
export class TranslatePipe implements PipeTransform, OnDestroy {
	private _ref = inject(ChangeDetectorRef);
	private _translationSvc = inject(HubTranslationService);

	value: string = '';
	lastKey: string | null = null;
	lastParams: any[] = [];

	translationSubscription: Subscription | undefined;

	/**
	 * Updates the value of a key by interpolating the translation and marking for change detection.
	 */
	updateValue(key: string, interpolateParams?: Object): void {
		const value = interpolateString(
			this._translationSvc.getTranslation(key),
			interpolateParams
		);
		this.value = value !== undefined ? value : key;
		this.lastKey = key;
		this._ref.markForCheck();
	}

	/**
	 * Transforms a translation key with optional interpolation params.
	 */
	transform(query: string, ...args: any[]): any {
		if (!query || !query.length) {
			return query;
		}

		// If we ask another time for the same key, return the last value.
		if (equals(query, this.lastKey) && equals(args, this.lastParams)) {
			return this.value;
		}

		let interpolateParams: Object | undefined = undefined;
		if (isDefined(args[0]) && args.length) {
			if (typeof args[0] === 'string' && args[0].length) {
				// We accept objects written in the template such as {n:1}, {'n':1}, {n:'v'}.
				// This converts them to valid JSON.
				let validArgs: string = args[0]
					.replace(/(\')?([a-zA-Z0-9_]+)(\')?(\s)?:/g, '"$2":')
					.replace(/:(\s)?(\')(.*?)(\')/g, ':"$3"');
				try {
					interpolateParams = JSON.parse(validArgs);
				} catch (e) {
					throw new SyntaxError(
						`Wrong parameter in TranslatePipe. Expected a valid Object, received: ${args[0]}`
					);
				}
			} else if (typeof args[0] === 'object' && !Array.isArray(args[0])) {
				interpolateParams = args[0];
			}
		}

		// Store the query, in case it changes.
		this.lastKey = query;

		// Store the params, in case they change.
		this.lastParams = args;

		// Set the value.
		this.updateValue(query, interpolateParams);

		// Clean any existing subscription.
		this._dispose();

		if (!this.translationSubscription) {
			this.translationSubscription =
				this._translationSvc.translationObserver.subscribe(() => {
					if (this.lastKey) {
						this.lastKey = null;
						this.updateValue(query, interpolateParams);
					}
				});
		}
		return this.value;
	}

	/**
	 * Clean any existing subscription to change events.
	 */
	private _dispose(): void {
		if (typeof this.translationSubscription !== 'undefined') {
			this.translationSubscription.unsubscribe();
			this.translationSubscription = undefined;
		}
	}

	ngOnDestroy(): void {
		this._dispose();
	}
}
