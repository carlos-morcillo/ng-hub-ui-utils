# Hub UI - Angular Utilities Library

[![NPM Version](https://img.shields.io/npm/v/ng-hub-ui-utils.svg)](https://www.npmjs.com/package/ng-hub-ui-utils)
[![License](https://img.shields.io/npm/l/ng-hub-ui-utils.svg)](LICENSE)
[![Build Status](https://img.shields.io/github/workflow/status/carlos-morcillo/ng-hub-ui-utils/CI)](https://github.com/carlos-morcillo/ng-hub-ui-utils/actions)

> Common utilities library for Angular, fundamental support for the Hub UI ecosystem.

[Español](./README.es.md) | **English**

## 🏡 Part of the Hub UI Family

This library is part of the **Hub UI** ecosystem, which includes:

-   🎨 [**ng-hub-ui-accordion**](https://github.com/carlos-morcillo/ng-hub-ui-accordion) - Accordion components
-   📱 **ng-hub-ui-action-sheet** - Mobile action sheets
-   👤 [**ng-hub-ui-avatar**](https://github.com/carlos-morcillo/ng-hub-ui-avatar) - Avatar components
-   📋 [**ng-hub-ui-board**](https://github.com/carlos-morcillo/ng-hub-ui-board) - Kanban-style boards
-   🧭 [**ng-hub-ui-breadcrumbs**](https://github.com/carlos-morcillo/ng-hub-ui-breadcrumbs) - Navigation breadcrumbs
-   📜 **ng-hub-ui-dropdown** - Dropdown components
-   📝 **ng-hub-ui-list** - List components
-   🪟 [**ng-hub-ui-modal**](https://github.com/carlos-morcillo/ng-hub-ui-modal) - Modal components
-   🌀 [**ng-hub-ui-portal**](https://github.com/carlos-morcillo/ng-hub-ui-portal) - Portal system
-   🔀 [**ng-hub-ui-sortable**](https://github.com/carlos-morcillo/ng-hub-ui-sortable) - Sortable components
-   📊 [**ng-hub-ui-stepper**](https://github.com/carlos-morcillo/ng-hub-ui-stepper) - Step-by-step components
-   🛠️ [**ng-hub-ui-utils**](https://github.com/carlos-morcillo/ng-hub-ui-utils) ← you are here - Common utilities

## 💡 Inspiration

This utilities library emerged from the need to provide common, reusable, and optimized support functions for the entire Hub UI ecosystem. Inspired by best practices in Angular development and internal utilities from libraries like Angular Bootstrap and Material Design, it provides essential tools for developing modern UI components.

## ✨ Features

### 🔧 Focus Management and Accessibility

Advanced utilities for focus handling, focus trapping, and keyboard navigation.

```typescript
import { getFocusableBoundaryElements, FOCUSABLE_ELEMENTS_SELECTOR } from 'ng-hub-ui-utils';

// Get focusable elements in a container
const [firstElement, lastElement] = getFocusableBoundaryElements(containerElement);

// Create a focus trap in a modal
const focusTrap = hubFocusTrap(ngZone, modalElement, stopFocusTrap$);
```

### 🪟 Overlay Service

Advanced system for creating overlays and floating components with flexible positioning.

```typescript
import { OverlayService, OverlayConfig } from 'ng-hub-ui-utils';

@Component({
  selector: 'app-example'
})
export class ExampleComponent {
  constructor(private overlayService: OverlayService) {}

  openOverlay(elementRef: ElementRef) {
    // Create overlay with configuration
    const overlayRef = this.overlayService.create({
      hasBackdrop: true,
      backdropClass: 'custom-backdrop'
    });

    // Configure position strategy
    const positionStrategy = this.overlayService.position()
      .flexibleConnectedTo(elementRef)
      .withPositions([{
        originX: 'start',
        originY: 'bottom',
        overlayX: 'start',
        overlayY: 'top'
      }]);

    // Attach component to overlay
    const componentRef = overlayRef.attach(MyComponent);
  }
}
```

### 🎯 Popup Service (Base Class)

Base service for creating custom popup implementations.

```typescript
import { PopupService } from 'ng-hub-ui-utils';

@Injectable()
export class MyPopupService extends PopupService<MyPopupComponent> {
  constructor() {
    super(MyPopupComponent);
  }

  openPopup(content?: string | TemplateRef<any>) {
    const { windowRef, transition$ } = super.open(content, {}, true);
    return { windowRef, transition$ };
  }
}
```

### 📜 Scrollbar Management

Intelligent scrollbar control with layout compensation.

```typescript
import { ScrollBar } from 'ng-hub-ui-utils';

constructor(private scrollBar: ScrollBar) {}

openModal() {
  // Hide scrollbar and compensate for space
  const reverter = this.scrollBar.hide();

  // On modal close, restore scrollbar
  modalClose.subscribe(() => reverter());
}
```

### ⚡ Transition System

Utilities for smooth animations and transitions with automatic detection.

```typescript
import { hubRunTransition } from 'ng-hub-ui-utils';

// Execute transition with callback
hubRunTransition(
	this.ngZone,
	element,
	(element, animation, context) => {
		// Transition start logic
		element.classList.add('transitioning');

		return () => {
			// Cleanup at transition end
			element.classList.remove('transitioning');
		};
	},
	{
		animation: true,
		runningTransition: 'continue',
		context: { customData: 'value' }
	}
).subscribe(() => {
	console.log('Transition completed');
});
```

### 🧰 Standalone Angular Pipes

Complete set of utility pipes for validation, transformation, and data manipulation.

```typescript
import { GetPipe, IsStringPipe, IsObjectPipe, IsObservablePipe, UcfirstPipe, UnwrapAsyncPipe } from 'ng-hub-ui-utils';

@Component({
	standalone: true,
	imports: [GetPipe, IsStringPipe, UcfirstPipe, UnwrapAsyncPipe],
	template: `
		<!-- Safe nested property access -->
		<p>{{ user | get : 'address.city' : 'Unknown' }}</p>

		<!-- Capitalize first letter -->
		<h1>{{ title | ucfirst }}</h1>

		<!-- Type checking in templates -->
		@if (value | isString) {
		<span>It's a string: {{ value }}</span>
		}

		<!-- Unwrap Observable or direct value -->
		<div>{{ observableOrValue | unwrapAsync }}</div>
	`
})
export class ExampleComponent {
	user = { address: { city: 'New York' } };
	title = 'hello world';
	value: any = 'test';
	observableOrValue = of('Observable value');
}
```

**Available Pipes:**

-   **GetPipe** (`get`): Safe nested property access with default values
-   **IsStringPipe** (`isString`): Check if value is a string
-   **IsObjectPipe** (`isObject`): Check if value is an object
-   **IsObservablePipe** (`isObservable`): Check if value is an Observable
-   **UcfirstPipe** (`ucfirst`): Capitalize first letter of a string
-   **UnwrapAsyncPipe** (`unwrapAsync`): Unwrap Observable or return direct value

### 🛠️ General Utility Functions

Complete set of helpers for validation, transformation, and data manipulation.

```typescript
import {
	toInteger,
	toString,
	getValueInRange,
	isString,
	isNumber,
	isInteger,
	isDefined,
	isPromise,
	padNumber,
	regExpEscape,
	closest,
	reflow,
	removeAccents,
	getActiveElement
} from 'ng-hub-ui-utils';

// Safe conversions
const numValue = toInteger('42'); // 42
const strValue = toString(null); // ''

// Type validations
if (isString(value)) {
	/* ... */
}
if (isPromise(result)) {
	/* ... */
}

// DOM manipulation
const parent = closest(element, '.container');
reflow(element); // Force browser reflow

// String utilities
const clean = removeAccents('niño'); // "nino"
const escaped = regExpEscape('hello?'); // "hello\\?"

// Focus management
const activeEl = getActiveElement(); // Includes shadow DOM
```

### 🎯 Full TypeScript Support

Strict typing throughout the library with well-defined interfaces and types.

```typescript
// Transition types
type TransitionStartFn<T> = (element: HTMLElement, animation: boolean, context: T) => TransitionEndFn | void;

interface TransitionOptions<T> {
	animation: boolean;
	runningTransition: 'continue' | 'stop';
	context?: T;
}

// Scrollbar reverter type
type ScrollbarReverter = () => void;
```

### ⚡ Optimized Tree-shaking

Import only the utilities you need to optimize your bundle.

```typescript
// Specific imports
import { toInteger, isString } from 'ng-hub-ui-utils';
import { ScrollBar } from 'ng-hub-ui-utils';
import { hubRunTransition } from 'ng-hub-ui-utils';
import { GetPipe, UcfirstPipe } from 'ng-hub-ui-utils';
```

## 🚀 Installation

```bash
npm install ng-hub-ui-utils
# or
yarn add ng-hub-ui-utils
```

## 📖 Quick Start

```typescript
// Import specific utilities
import { toInteger, isString, ScrollBar, getFocusableBoundaryElements, GetPipe, UcfirstPipe } from 'ng-hub-ui-utils';

@Component({
	selector: 'app-example',
	standalone: true,
	imports: [GetPipe, UcfirstPipe],
	template: `
		<div #container>
			<h1>{{ title | ucfirst }}</h1>
			<p>{{ user | get : 'name' : 'Anonymous' }}</p>
		</div>
	`
})
export class ExampleComponent {
	constructor(private scrollBar: ScrollBar) {}

	@ViewChild('container') containerElement!: ElementRef<HTMLElement>;

	title = 'welcome';
	user = { name: 'John Doe' };

	ngAfterViewInit() {
		// Get focusable elements
		const [first, last] = getFocusableBoundaryElements(this.containerElement.nativeElement);

		// Safe conversion
		const value = toInteger('42');

		if (isString(this.title)) {
			console.log("It's a string");
		}
	}

	openOverlay() {
		// Hide scrollbar during overlay
		const reverter = this.scrollBar.hide();

		// Restore on close
		this.overlayRef.onClose(() => reverter());
	}
}
```

## 📊 Utilities API

### Conversion Functions

-   `toInteger(value: any): number` - Safely converts to integer
-   `toString(value: any): string` - Converts to string handling null/undefined
-   `getValueInRange(value: number, max: number, min?: number): number` - Limits value to range
-   `padNumber(value: number): string` - Adds leading zero to numbers

### Validation Functions

-   `isString(value: any): value is string` - Checks if value is a string
-   `isNumber(value: any): value is number` - Checks if value is a valid number
-   `isInteger(value: any): value is number` - Checks if value is an integer
-   `isDefined(value: any): boolean` - Checks if not null/undefined
-   `isPromise<T>(v: any): v is Promise<T>` - Checks if value is a Promise

### String Functions

-   `regExpEscape(text: string): string` - Escapes special characters for RegExp
-   `removeAccents(str: string): string` - Removes accents from text

### DOM Functions

-   `closest(element: HTMLElement, selector?: string): HTMLElement | null` - Finds parent element by selector
-   `reflow(element: HTMLElement): DOMRect` - Forces browser reflow
-   `getActiveElement(root?: Document | ShadowRoot): Element | null` - Gets active element including Shadow DOM

### Focus Functions

-   `getFocusableBoundaryElements(element: HTMLElement): HTMLElement[]` - Gets first and last focusable elements
-   `hubFocusTrap(zone, element, stopFocusTrap$, refocusOnClick?)` - Creates focus trap for modals/overlays
-   `FOCUSABLE_ELEMENTS_SELECTOR: string` - CSS selector for focusable elements

### Pipes

#### GetPipe

```typescript
// Safe nested property access
{{ object | get:'path.to.property':'defaultValue' }}
```

#### IsStringPipe

```typescript
// Type checking
@if (value | isString) { <span>String value</span> }
```

#### IsObjectPipe

```typescript
// Object checking
@if (value | isObject) { <span>Object value</span> }
```

#### IsObservablePipe

```typescript
// Observable checking
@if (stream | isObservable) { <span>Observable stream</span> }
```

#### UcfirstPipe

```typescript
// Capitalize first letter
{{ 'hello world' | ucfirst }}  <!-- Hello world -->
```

#### UnwrapAsyncPipe

```typescript
// Unwrap Observable or return direct value
{
	{
		observableOrValue | unwrapAsync;
	}
}
```

### Services

#### OverlayService

```typescript
@Injectable({ providedIn: 'root' })
class OverlayService {
  create(config?: OverlayConfig): OverlayRef;
  position(): OverlayPosition;
}

class OverlayRef {
  attach<T>(component: ComponentType<T>): ComponentRef<T>;
  detach(): void;
  dispose(): void;
  updatePosition(): void;
}

class OverlayPosition {
  flexibleConnectedTo(element: ElementRef | HTMLElement): this;
  withPositions(positions: ConnectionPosition[]): this;
}
```

#### ScrollBar Service

```typescript
@Injectable({ providedIn: 'root' })
class ScrollBar {
  hide(): ScrollbarReverter; // Hides scrollbar with compensation
}
```

#### PopupService<T> (Base Class)

```typescript
abstract class PopupService<T> {
  // Base system for creating dynamic popups
  // Extend this class to create specific popup services
  open(content?, templateContext?, animation?): { windowRef: ComponentRef<T>; transition$: Observable<void> };
  close(animation?): Observable<void>;
}
```

### Transition Utilities

-   `hubRunTransition<T>(zone, element, startFn, options)` - Advanced transition system with Observable
-   `hubCompleteTransition(element)` - Completes a running transition on an element
-   `getTransitionDurationMs(element)` - Gets CSS transition duration in milliseconds
-   `runInZone<T>(zone)` - RxJS operator to execute observables inside NgZone

## 🎨 Support Components

This library doesn't include visual components, but support utilities used by other components in the Hub UI ecosystem:

| Utility         | Description                         | Used by                                |
| --------------- | ----------------------------------- | -------------------------------------- |
| Overlay Service | Flexible overlay positioning system | ng-hub-ui-dropdown, ng-hub-ui-modal    |
| Focus Trap      | Focus management in modals/overlays | ng-hub-ui-modal, ng-hub-ui-dropdown    |
| Scrollbar       | Scrollbar compensation              | ng-hub-ui-modal, ng-hub-ui-portal      |
| Popup Service   | Base class for popup components     | ng-hub-ui-modal, ng-hub-ui-portal      |
| Transitions     | Smooth animations                   | ng-hub-ui-accordion, ng-hub-ui-modal   |
| Type Guards     | Type validation functions           | ng-hub-ui-stepper                      |
| Pipes           | Template utilities                  | All Hub UI components                  |

## 🤝 Compatibility

-   Angular 15+
-   TypeScript 4.8+
-   Node.js 16+
-   Browsers: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

## 🛠️ Development

```bash
git clone https://github.com/carlos-morcillo/ng-hub-ui-utils
cd ng-hub-ui-utils
npm install
npm run build
npm run test
```

### Available Scripts

```bash
npm run build:lib        # Build library
npm run test:unit        # Unit tests
npm run test:e2e         # End-to-end tests
npm run lint             # Linting
npm run format           # Format code
```

## 🧪 Testing

```typescript
import { TestBed } from '@angular/core/testing';
import { ScrollBar, toInteger, isString, GetPipe } from 'ng-hub-ui-utils';

describe('ng-hub-ui-utils', () => {
	it('should convert values safely', () => {
		expect(toInteger('42')).toBe(42);
		expect(toInteger('invalid')).toBe(NaN);
		expect(isString('hello')).toBe(true);
		expect(isString(42)).toBe(false);
	});

	it('should manage scrollbar', () => {
		const scrollBar = TestBed.inject(ScrollBar);
		const reverter = scrollBar.hide();

		expect(typeof reverter).toBe('function');
		reverter(); // Cleanup
	});

	it('should get nested properties safely', () => {
		const pipe = new GetPipe();
		const obj = { user: { name: 'John' } };

		expect(pipe.transform(obj, 'user.name')).toBe('John');
		expect(pipe.transform(obj, 'user.age', 0)).toBe(0);
	});
});
```

## 🐛 Issues and Support

-   [Report a bug](https://github.com/carlos-morcillo/ng-hub-ui-utils/issues)
-   [Request a feature](https://github.com/carlos-morcillo/ng-hub-ui-utils/issues/new?template=feature_request.md)
-   [Discussions](https://github.com/carlos-morcillo/ng-hub-ui-utils/discussions)

## ☕ Support the Project

If Hub UI has been useful to you, consider supporting its development:

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-support-yellow.svg?style=flat-square&logo=buy-me-a-coffee)](https://buymeacoffee.com/carlosmorcillo)
[![Sponsor](https://img.shields.io/badge/Sponsor-GitHub-red.svg?style=flat-square&logo=github)](https://github.com/sponsors/carlos-morcillo)

Your support helps to:

-   🚀 Keep the project active
-   🐛 Fix bugs faster
-   ✨ Develop new features
-   📚 Improve documentation

## 🤝 Contributions

Contributions are welcome! Please:

1. 🍴 Fork the repository
2. 🌿 Create a branch for your feature (`git checkout -b feature/new-utility`)
3. ✍️ Commit your changes (`git commit -am 'feat: add new utility'`)
4. 📤 Push to the branch (`git push origin feature/new-utility`)
5. 🔄 Open a Pull Request

Check our [contribution guidelines](CONTRIBUTING.md) for more details.

## 📄 License

MIT © [Hub UI Team](https://github.com/carlos-morcillo)

```
MIT License

Copyright (c) 2025 Hub UI Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

⭐ **If you like this project, don't forget to give it a star on GitHub!**

[![GitHub stars](https://img.shields.io/github/stars/carlos-morcillo/ng-hub-ui-utils.svg?style=social&label=Star)](https://github.com/carlos-morcillo/ng-hub-ui-utils)
