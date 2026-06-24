/**
 * Native HTML5 drag-and-drop core shared across ng-hub-ui libraries.
 *
 * Provides the engine-agnostic, reusable pieces of a native drag-and-drop implementation:
 * pure array helpers, drop-position geometry, drag-image rendering, a Pointer Events touch
 * fallback, a singleton coordinator service (cross-instance transfers) and shared types.
 * UI primitives (handle/placeholder/preview directives) stay per-library, since their
 * selectors and data models differ.
 */
export * from './array-utils';
export * from './drop-position';
export * from './drag-image';
export * from './pointer-drag';
export * from './drag-drop.service';
export * from './types';
