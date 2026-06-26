# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [22.3.2] - 2026-06-26

### Fixed

- Corrected the Angular peer dependency range to `>=18.0.0`. The library uses APIs introduced in Angular 17 (signal `input()`/`output()`, the `@if` control flow and/or signal queries), whose real minimum is Angular 17.3, so the previous `>=16.0.0` range was too low and let it install on incompatible versions.

## [22.3.1] - 2026-06-25

### Added

- `--hub-overlay-*` component tokens for the overlay surface (`-bg`, `-border-radius`, `-shadow`, `-z-index`, `-backdrop-z-index`), each resolving through the system surface / shadow / z-index tokens so the overlay is themeable.

### Fixed

- Design-token consistency pass: aligned inline fallback defaults with the canonical `ng-hub-ui-ds` values and routed hardcoded literals (z-index, font-weight, line-height, radii and theme-aware colours) through their `--hub-sys-*` / `--hub-ref-*` tokens, so they follow the active theme. No visual change when the ds tokens are loaded.

## [22.3.0] - 2026-06-24

### Added

- **Native drag-and-drop core** (`drag-drop/`), the engine-agnostic, reusable pieces of a native HTML5 drag-and-drop implementation, shared across ng-hub-ui libraries:
    - Pure array helpers `moveItemInArray`, `transferArrayItem`, `copyArrayItem`, plus `computeTargetIndex`, `toAbsoluteIndex`, `containsNode` and `clamp`.
    - `resolveDropPosition` drop-side geometry (`vertical` / `horizontal` / `grid` axes, RTL-aware).
    - `createNativeDragImage` to render a template off-screen as a native drag image.
    - `createPointerDragSession` — the Pointer Events touch/pen fallback (floating ghost + edge autoscroll).
    - `HubDragDropService` — a singleton coordinator for the active drag, drop target, owner registry, `canDrop` (group-based cross-instance transfers) and DOM hit-testing.
    - Shared types `DragContainerRef`, `ActiveDrag`, `DragTarget`, `DragRegistration`, `DropPosition`, `DragPointerMode`, `DragAxis`, `DropRect`.

## [22.2.0] - 2026-06-24

### Added

- `TooltipDirective` (`[tooltip]`) — lightweight, dependency-free tooltip moved here from `ng-hub-ui-paginable` so any library can reuse it. Now SSR-safe (injected `DOCUMENT`), with a default `top` placement and `focus`/`blur` support.
- Tooltip theming through `--hub-tooltip-*` CSS variables (`-bg`, `-color`, `-opacity`, `-padding-x`, `-padding-y`, `-border-radius`, `-font-size`, `-max-width`, `-z-index`, `-transition-duration`, `-shadow`, `-font-family`). The injected base class is now `.hub-tooltip` (was `.ng-tooltip`).

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
