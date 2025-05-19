import { Observable, of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { LoadingState } from '../types/LoadingState';

export function withLoadingState<T>() {
	return (source$: Observable<T>): Observable<LoadingState<T>> => {
		return source$.pipe(
			map(data => ({ state: 'loaded', data } as const)),
			startWith({ state: 'loading' } as const),
			catchError(error => of({ state: 'error', error } as const)),
		);
	};
}

