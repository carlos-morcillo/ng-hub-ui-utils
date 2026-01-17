import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { HubTranslationService } from './hub-translation.service';
import { HUB_TRANSLATION_CONFIG, HubTranslationConfig } from './translation.tokens';

/**
 * Helper function to provide HubTranslationService and its configuration.
 * @param config Optional configuration for translations.
 * @returns EnvironmentProviders
 */
export function provideHubTranslation(config: HubTranslationConfig = {}): EnvironmentProviders {
	return makeEnvironmentProviders([
		HubTranslationService,
		{
			provide: HUB_TRANSLATION_CONFIG,
			useValue: config
		}
	]);
}
