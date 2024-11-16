export function skipFirst<T>(iterable: Iterable<T>): Iterable<T> {
    const iterator = iterable[Symbol.iterator]();
    iterator.next(); // Skip the first element

    return {
        [Symbol.iterator]() {
            return iterator;
        }
    };
}

export function* mapIterable<T, U>(iterable: Iterable<T>, mapper: (value: T) => U): Iterable<U> {
    for (const item of iterable) {
        yield mapper(item);
    }
}