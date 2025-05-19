export type LoadingState<T> = { state: 'loading' } | { state: 'loaded'; data: T } | { state: 'error'; error: any };
