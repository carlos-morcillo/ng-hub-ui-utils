# Functionalities of Utils Library

This table details the functionalities of the `ng-hub-ui-utils` library and indicates which ones are covered by interactive examples.

## Focus Management

| Category | Functionality | Example Covered |
| :--- | :--- | :---: |
| **Focus Trap** | `hubFocusTrap()` function | ✅ |
| | `getFocusableBoundaryElements()` | ✅ |
| | `FOCUSABLE_ELEMENTS_SELECTOR` constant | ✅ |

---

## Internationalization (i18n)

| Category | Functionality | Example Covered |
| :--- | :--- | :---: |
| **Translation Service** | `HubTranslationService` | ✅ |
| | `provideHubTranslation()` provider | ✅ |
| | `HUB_TRANSLATION_CONFIG` injection token | ✅ |
| **Pipes** | `TranslatePipe` | ✅ |

---

## Overlay System

| Category | Functionality | Example Covered |
| :--- | :--- | :---: |
| **Overlay Service** | `OverlayService` | ✅ |
| | `OverlayRef` management | ✅ |
| **Positioning** | `ConnectionPosition` types | ✅ |
| | Horizontal/Vertical connection positions | ✅ |
| **Configuration** | `OverlayConfig` interface | ✅ |

---

## Popup Service

| Category | Functionality | Example Covered |
| :--- | :--- | :---: |
| **Popup** | `HubPopupService` | ❌ |
| | Programmatic popup creation | ❌ |

---

## Scrollbar Utilities

| Category | Functionality | Example Covered |
| :--- | :--- | :---: |
| **Scrollbar** | `ScrollBar` service | ✅ |
| | `hide()` method | ✅ |
| | Scrollbar compensation utilities | ✅ |

---

## Transitions

| Category | Functionality | Example Covered |
| :--- | :--- | :---: |
| **Animation** | `hubRunTransition()` function | ❌ |
| | Transition utilities | ❌ |
| | CSS transition helpers | ❌ |

---

## Pipes

| Category | Functionality | Example Covered |
| :--- | :--- | :---: |
| **Type Checking** | `IsStringPipe` | ✅ |
| | `IsObjectPipe` | ✅ |
| | `IsObservablePipe` | ✅ |
| **Data Access** | `GetPipe` (dot notation access) | ✅ |
| **Transformation** | `UcfirstPipe` (capitalize first letter) | ✅ |
| **Async** | `UnwrapAsyncPipe` | ❌ |
| **i18n** | `TranslatePipe` | ✅ |

---

## Utility Functions

| Category | Functionality | Example Covered |
| :--- | :--- | :---: |
| **Type Guards** | `isString()`, `isNumber()`, `isInteger()` | ✅ |
| | `isDefined()`, `isPromise()` | ✅ |
| **Value Conversion** | `toInteger()`, `toString()` | ✅ |
| | `getValueInRange()` | ✅ |
| **String Utilities** | `padNumber()` | ✅ |
| | `regExpEscape()` | ✅ |
| | `removeAccents()` | ✅ |
| | `interpolateString()` | ✅ |
| **Object Utilities** | `equals()` (deep equality) | ✅ |
| | `getValue()` (dot notation access) | ✅ |
| **DOM Utilities** | `closest()` | ❌ |
| | `reflow()` (force browser reflow) | ❌ |
| | `getActiveElement()` | ❌ |
| **RxJS Utilities** | `runInZone()` operator | ❌ |

---
*Note: ❌ indicates an example is not yet available. ✅ indicates an active interactive example.*
