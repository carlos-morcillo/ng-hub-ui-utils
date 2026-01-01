import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'ucfirst',
	standalone: true
})
export class UcfirstPipe implements PipeTransform {
	transform(value: string = ''): string {
		return value.charAt(0).toUpperCase() + value.slice(1);
	}
}
