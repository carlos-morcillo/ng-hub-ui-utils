# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [22.1.0] - 2026-06-23

### Added

- `isObject(item)` — checks whether a value is a plain object (not an array or primitive).
- `mergeDeep(target, source)` — recursive deep-merge producing a new object; arrays are replaced, not merged.
- `generateUniqueId(length)` — random alphanumeric string for transient DOM ids and keys.
- `debouncedSignal(sourceSignal, delay)` — Angular Signal wrapper that delays propagation by a configurable millisecond window; uses `effect` cleanup to avoid timer leaks.

## [22.0.0] - 2026-06-17

### Changed

- Aligned with Angular 22.
- README documentation standardized.


## [1.2.1] - 2026-03-19

### Changed
- Renamed internal i18n files: `hub-translation.service.ts` → `translation.service.ts`, `hub-translation.provider.ts` → `translation.provider.ts`
- Updated `TranslatePipe` imports to use renamed i18n files
- Code formatting improvements in `translate.pipe.ts`

### Fixed
- Added comprehensive test suite for `HubTranslationService`

## [1.2.0] - 2026-01-02

### Added
- New `equals()` utility function for deep object comparison
- New `interpolateString()` function for template string interpolation
- New `getValue()` function for nested property access with dot notation
- Internationalization (i18n) system with `HubTranslationService`
- `TranslatePipe` for template-based translations
- Translation tokens for dependency injection configuration

## [1.1.0] - Previous release

Initial tracked version.
