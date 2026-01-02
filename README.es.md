# Hub UI - Angular Utilities Library

[![NPM Version](https://img.shields.io/npm/v/ng-hub-ui-utils.svg)](https://www.npmjs.com/package/ng-hub-ui-utils)
[![License](https://img.shields.io/npm/l/ng-hub-ui-utils.svg)](LICENSE)
[![Build Status](https://img.shields.io/github/workflow/status/carlos-morcillo/ng-hub-ui-utils/CI)](https://github.com/carlos-morcillo/ng-hub-ui-utils/actions)

> Biblioteca de utilidades común para Angular, soporte fundamental del ecosistema Hub UI.

**Español** | [English](./README.md)

## 🏡 Forma parte de la familia Hub UI

Esta biblioteca es parte del ecosistema **Hub UI**, que incluye:
- 🎨 [**ng-hub-ui-accordion**](https://github.com/carlos-morcillo/ng-hub-ui-accordion) - Componentes de acordeón
- 📱 **ng-hub-ui-action-sheet** - Hojas de acción móviles
- 👤 [**ng-hub-ui-avatar**](https://github.com/carlos-morcillo/ng-hub-ui-avatar) - Componentes de avatar
- 📋 [**ng-hub-ui-board**](https://github.com/carlos-morcillo/ng-hub-ui-board) - Tableros tipo Kanban
- 🧭 [**ng-hub-ui-breadcrumbs**](https://github.com/carlos-morcillo/ng-hub-ui-breadcrumbs) - Migas de pan de navegación
- 📜 **ng-hub-ui-dropdown** - Componentes dropdown
- 📝 **ng-hub-ui-list** - Componentes de lista
- 🪟 [**ng-hub-ui-modal**](https://github.com/carlos-morcillo/ng-hub-ui-modal) - Componentes de modal
- 🌀 [**ng-hub-ui-portal**](https://github.com/carlos-morcillo/ng-hub-ui-portal) - Sistema de portales
- 🔀 [**ng-hub-ui-sortable**](https://github.com/carlos-morcillo/ng-hub-ui-sortable) - Componentes sortable
- 📊 [**ng-hub-ui-stepper**](https://github.com/carlos-morcillo/ng-hub-ui-stepper) - Componentes step-by-step
- 🛠️ [**ng-hub-ui-utils**](https://github.com/carlos-morcillo/ng-hub-ui-utils) ← estás aquí - Utilidades comunes

## 💡 Inspiración

Esta biblioteca de utilidades surge de la necesidad de proporcionar funciones de apoyo comunes, reutilizables y optimizadas para todo el ecosistema Hub UI. Inspirada en las mejores prácticas de desarrollo Angular y en las utilidades internas de bibliotecas como Angular Bootstrap y Material Design, proporciona herramientas esenciales para el desarrollo de componentes UI modernos.

## ✨ Características

### 🔧 Gestión de Focus y Accesibilidad
Utilidades para manejo avanzado del foco, trap de foco y navegación por teclado.

```typescript
import { getFocusableBoundaryElements, FOCUSABLE_ELEMENTS_SELECTOR } from 'ng-hub-ui-utils';

// Obtener elementos focusables en un contenedor
const [firstElement, lastElement] = getFocusableBoundaryElements(containerElement);

// Crear un trap de foco en un modal
const focusTrap = hubFocusTrap(ngZone, modalElement, stopFocusTrap$);
```

### 🪟 Servicio de Overlay

Sistema avanzado para crear overlays y componentes flotantes con posicionamiento flexible.

```typescript
import { OverlayService, OverlayConfig } from 'ng-hub-ui-utils';

@Component({
  selector: 'app-example'
})
export class ExampleComponent {
  constructor(private overlayService: OverlayService) {}

  openOverlay(elementRef: ElementRef) {
    // Crear overlay con configuración
    const overlayRef = this.overlayService.create({
      hasBackdrop: true,
      backdropClass: 'custom-backdrop'
    });

    // Configurar estrategia de posición
    const positionStrategy = this.overlayService.position()
      .flexibleConnectedTo(elementRef)
      .withPositions([{
        originX: 'start',
        originY: 'bottom',
        overlayX: 'start',
        overlayY: 'top'
      }]);

    // Adjuntar componente al overlay
    const componentRef = overlayRef.attach(MyComponent);
  }
}
```

### 🎯 Servicio Popup (Clase Base)

Servicio base para crear implementaciones de popup personalizadas.

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

### 📜 Gestión de Scrollbar
Control inteligente de scrollbars con compensación de layout.

```typescript
import { ScrollBar } from 'ng-hub-ui-utils';

constructor(private scrollBar: ScrollBar) {}

openModal() {
  // Oculta scrollbar y compensa el espacio
  const reverter = this.scrollBar.hide();
  
  // Al cerrar el modal, restaura el scrollbar
  modalClose.subscribe(() => reverter());
}
```

### ⚡ Sistema de Transiciones
Utilidades para animaciones y transiciones fluidas con detección automática.

```typescript
import { hubRunTransition } from 'ng-hub-ui-utils';

// Ejecutar transición con callback
hubRunTransition(
  this.ngZone,
  element,
  (element, animation, context) => {
    // Lógica de inicio de transición
    element.classList.add('transitioning');
    
    return () => {
      // Cleanup al final de la transición
      element.classList.remove('transitioning');
    };
  },
  {
    animation: true,
    runningTransition: 'continue',
    context: { customData: 'value' }
  }
).subscribe(() => {
  console.log('Transición completada');
});
```

### 🧰 Pipes Standalone de Angular

Conjunto completo de pipes de utilidad para validación, transformación y manipulación de datos.

```typescript
import {
  GetPipe,
  IsStringPipe,
  IsObjectPipe,
  IsObservablePipe,
  UcfirstPipe,
  UnwrapAsyncPipe
} from 'ng-hub-ui-utils';

@Component({
  standalone: true,
  imports: [GetPipe, IsStringPipe, UcfirstPipe, UnwrapAsyncPipe],
  template: `
    <!-- Acceso seguro a propiedades anidadas -->
    <p>{{ user | get:'address.city':'Desconocido' }}</p>

    <!-- Capitalizar primera letra -->
    <h1>{{ title | ucfirst }}</h1>

    <!-- Verificación de tipos en templates -->
    @if (value | isString) {
      <span>Es un string: {{ value }}</span>
    }

    <!-- Desempaquetar Observable o valor directo -->
    <div>{{ observableOrValue | unwrapAsync }}</div>
  `
})
export class ExampleComponent {
  user = { address: { city: 'Madrid' } };
  title = 'hola mundo';
  value: any = 'prueba';
  observableOrValue = of('Valor Observable');
}
```

**Pipes Disponibles:**
- **GetPipe** (`get`): Acceso seguro a propiedades anidadas con valores por defecto
- **IsStringPipe** (`isString`): Verifica si el valor es un string
- **IsObjectPipe** (`isObject`): Verifica si el valor es un objeto
- **IsObservablePipe** (`isObservable`): Verifica si el valor es un Observable
- **UcfirstPipe** (`ucfirst`): Capitaliza la primera letra de un string
- **UnwrapAsyncPipe** (`unwrapAsync`): Desempaqueta Observable o retorna valor directo

### 🛠️ Funciones de Utilidad General

Conjunto completo de helpers para validación, transformación y manipulación de datos.

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

// Conversiones seguras
const numValue = toInteger('42');        // 42
const strValue = toString(null);         // ''

// Validaciones de tipo
if (isString(value)) { /* ... */ }
if (isPromise(result)) { /* ... */ }

// Manipulación de DOM
const parent = closest(element, '.container');
reflow(element); // Fuerza reflow del navegador

// Utilidades de string
const clean = removeAccents('niño'); // "nino"
const escaped = regExpEscape('hello?'); // "hello\\?"

// Gestión de foco
const activeEl = getActiveElement(); // Incluye shadow DOM
```

### 🎯 TypeScript completo
Tipado estricto en toda la biblioteca con interfaces y tipos bien definidos.

```typescript
// Tipos de transición
type TransitionStartFn<T> = (
  element: HTMLElement,
  animation: boolean,
  context: T
) => TransitionEndFn | void;

interface TransitionOptions<T> {
  animation: boolean;
  runningTransition: 'continue' | 'stop';
  context?: T;
}

// Tipo para el reversor de scrollbar
type ScrollbarReverter = () => void;
```

### ⚡ Tree-shaking optimizado
Importa solo las utilidades que necesitas para optimizar el bundle.

```typescript
// Importaciones específicas
import { toInteger, isString } from 'ng-hub-ui-utils';
import { ScrollBar } from 'ng-hub-ui-utils';
import { hubRunTransition } from 'ng-hub-ui-utils';
import { GetPipe, UcfirstPipe } from 'ng-hub-ui-utils';
```

## 🚀 Instalación

```bash
npm install ng-hub-ui-utils
# o
yarn add ng-hub-ui-utils
```

## 📖 Uso Rápido

```typescript
// Importar utilidades específicas
import {
  toInteger,
  isString,
  ScrollBar,
  getFocusableBoundaryElements,
  GetPipe,
  UcfirstPipe
} from 'ng-hub-ui-utils';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [GetPipe, UcfirstPipe],
  template: `
    <div #container>
      <h1>{{ title | ucfirst }}</h1>
      <p>{{ user | get:'name':'Anónimo' }}</p>
    </div>
  `
})
export class ExampleComponent {
  constructor(private scrollBar: ScrollBar) {}

  @ViewChild('container') containerElement!: ElementRef<HTMLElement>;

  title = 'bienvenido';
  user = { name: 'Juan Pérez' };

  ngAfterViewInit() {
    // Obtener elementos focusables
    const [first, last] = getFocusableBoundaryElements(this.containerElement.nativeElement);

    // Conversión segura
    const value = toInteger('42');

    if (isString(this.title)) {
      console.log('Es un string');
    }
  }

  openOverlay() {
    // Ocultar scrollbar durante overlay
    const reverter = this.scrollBar.hide();

    // Restaurar al cerrar
    this.overlayRef.onClose(() => reverter());
  }
}
```

## 📊 API de Utilidades

### Funciones de Conversión
- `toInteger(value: any): number` - Convierte a entero de forma segura
- `toString(value: any): string` - Convierte a string manejando null/undefined
- `getValueInRange(value: number, max: number, min?: number): number` - Limita valor a rango
- `padNumber(value: number): string` - Añade cero inicial a números

### Funciones de Validación
- `isString(value: any): value is string` - Verifica si es string
- `isNumber(value: any): value is number` - Verifica si es número válido
- `isInteger(value: any): value is number` - Verifica si es entero
- `isDefined(value: any): boolean` - Verifica si no es null/undefined
- `isPromise<T>(v: any): v is Promise<T>` - Verifica si es Promise

### Funciones de String
- `regExpEscape(text: string): string` - Escapa caracteres especiales para RegExp
- `removeAccents(str: string): string` - Remueve acentos de texto

### Funciones de DOM
- `closest(element: HTMLElement, selector?: string): HTMLElement | null` - Busca elemento padre por selector
- `reflow(element: HTMLElement): DOMRect` - Fuerza reflow del navegador
- `getActiveElement(root?: Document | ShadowRoot): Element | null` - Obtiene elemento activo incluyendo Shadow DOM

### Funciones de Focus
- `getFocusableBoundaryElements(element: HTMLElement): HTMLElement[]` - Obtiene primer y último elemento focusable
- `hubFocusTrap(zone, element, stopFocusTrap$, refocusOnClick?)` - Crea trampa de foco para modales/overlays
- `FOCUSABLE_ELEMENTS_SELECTOR: string` - Selector CSS para elementos focusables

### Pipes

#### GetPipe
```typescript
// Acceso seguro a propiedades anidadas
{{ object | get:'path.to.property':'valorPorDefecto' }}
```

#### IsStringPipe
```typescript
// Verificación de tipos
@if (value | isString) { <span>Valor string</span> }
```

#### IsObjectPipe
```typescript
// Verificación de objetos
@if (value | isObject) { <span>Valor objeto</span> }
```

#### IsObservablePipe
```typescript
// Verificación de Observables
@if (stream | isObservable) { <span>Stream Observable</span> }
```

#### UcfirstPipe
```typescript
// Capitalizar primera letra
{{ 'hola mundo' | ucfirst }}  <!-- Hola mundo -->
```

#### UnwrapAsyncPipe
```typescript
// Desempaquetar Observable o retornar valor directo
{{ observableOrValue | unwrapAsync }}
```

### Servicios

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
  hide(): ScrollbarReverter; // Oculta scrollbar con compensación
}
```

#### PopupService<T> (Clase Base)
```typescript
abstract class PopupService<T> {
  // Sistema base para crear popups dinámicos
  // Extender esta clase para crear servicios de popup específicos
  open(content?, templateContext?, animation?): { windowRef: ComponentRef<T>; transition$: Observable<void> };
  close(animation?): Observable<void>;
}
```

### Utilidades de Transición
- `hubRunTransition<T>(zone, element, startFn, options)` - Sistema avanzado de transiciones con Observable
- `hubCompleteTransition(element)` - Completa una transición en ejecución en un elemento
- `getTransitionDurationMs(element)` - Obtiene duración de transición CSS en milisegundos
- `runInZone<T>(zone)` - Operador RxJS para ejecutar observables dentro de NgZone

## 🎨 Componentes de Apoyo

Esta biblioteca no incluye componentes visuales, sino utilidades de soporte que son utilizadas por otros componentes del ecosistema Hub UI:

| Utilidad | Descripción | Usado por |
|----------|-------------|-----------|
| Overlay Service | Sistema de posicionamiento flexible de overlays | ng-hub-ui-dropdown, ng-hub-ui-modal |
| Focus Trap | Manejo de foco en modales/overlays | ng-hub-ui-modal, ng-hub-ui-dropdown |
| Scrollbar | Compensación de scrollbar | ng-hub-ui-modal, ng-hub-ui-portal |
| Popup Service | Clase base para componentes popup | ng-hub-ui-modal, ng-hub-ui-portal |
| Transitions | Animaciones fluidas | ng-hub-ui-accordion, ng-hub-ui-modal |
| Type Guards | Funciones de validación de tipos | ng-hub-ui-stepper                      |
| Pipes | Utilidades de template | Todos los componentes Hub UI |

## 🤝 Compatibilidad

- Angular 15+ 
- TypeScript 4.8+
- Node.js 16+
- Browsers: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

## 🛠️ Desarrollo

```bash
git clone https://github.com/carlos-morcillo/ng-hub-ui-utils
cd ng-hub-ui-utils
npm install
npm run build
npm run test
```

### Scripts disponibles

```bash
npm run build:lib        # Construir biblioteca
npm run test:unit        # Tests unitarios
npm run test:e2e         # Tests end-to-end
npm run lint             # Linting
npm run format           # Formatear código
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
    const obj = { user: { name: 'Juan' } };

    expect(pipe.transform(obj, 'user.name')).toBe('Juan');
    expect(pipe.transform(obj, 'user.age', 0)).toBe(0);
  });
});
```

## 🐛 Issues y Soporte

- [Reportar bug](https://github.com/carlos-morcillo/ng-hub-ui-utils/issues)
- [Solicitar feature](https://github.com/carlos-morcillo/ng-hub-ui-utils/issues/new?template=feature_request.md)
- [Discusiones](https://github.com/carlos-morcillo/ng-hub-ui-utils/discussions)

## ☕ Apoya el proyecto

Si Hub UI te ha sido útil, considera apoyar su desarrollo:

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-support-yellow.svg?style=flat-square&logo=buy-me-a-coffee)](https://buymeacoffee.com/carlosmorcillo)
[![Sponsor](https://img.shields.io/badge/Sponsor-GitHub-red.svg?style=flat-square&logo=github)](https://github.com/sponsors/carlos-morcillo)

Tu apoyo ayuda a:
- 🚀 Mantener el proyecto activo
- 🐛 Resolver bugs más rápido  
- ✨ Desarrollar nuevas características
- 📚 Mejorar la documentación

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Por favor:

1. 🍴 Fork el repositorio
2. 🌿 Crea una rama para tu feature (`git checkout -b feature/nueva-utilidad`)
3. ✍️ Commit tus cambios (`git commit -am 'feat: añade nueva utilidad'`)
4. 📤 Push a la rama (`git push origin feature/nueva-utilidad`)
5. 🔄 Abre un Pull Request

Consulta nuestras [guías de contribución](CONTRIBUTING.md) para más detalles.

## 📄 Licencia

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

⭐ **Si te gusta este proyecto, ¡no olvides darle una estrella en GitHub!**

[![GitHub stars](https://img.shields.io/github/stars/carlos-morcillo/ng-hub-ui-utils.svg?style=social&label=Star)](https://github.com/carlos-morcillo/ng-hub-ui-utils)
