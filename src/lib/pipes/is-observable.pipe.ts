import { Pipe, PipeTransform } from '@angular/core';
import { isObservable, Observable } from 'rxjs';

@Pipe({
	name: 'isObservable',
	standalone: true
})
export class IsObservablePipe<T = any> implements PipeTransform {
	transform(value: T | Observable<T>): boolean {
		return isObservable(value);
	}
}
