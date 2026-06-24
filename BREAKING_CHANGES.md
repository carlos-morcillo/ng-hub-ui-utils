# Breaking Changes

This file documents breaking changes and migration steps for `ng-hub-ui-utils`.

## [22.2.0]

No breaking changes. Adds the `TooltipDirective` (`[tooltip]`) moved in from
`ng-hub-ui-paginable`. If you previously imported `TooltipDirective` from
`ng-hub-ui-paginable`, it still works (re-exported there), but prefer importing it
from `ng-hub-ui-utils`. The injected tooltip base class is `.hub-tooltip` (it was
`.ng-tooltip` while the directive lived in paginable); restyle any custom rules
targeting `.ng-tooltip` or use the new `--hub-tooltip-*` CSS variables.
