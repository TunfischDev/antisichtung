/**
 * Any function that can be called with `new` to create an object of Type T.
 */
export type Constructable<T> = new (...args: unknown[]) => T;

/**
 * Like a {@link Constructable}, but can not be instantiated, because the class is abstract.
 */
export interface AbstractClass<T> extends Function {
  prototype: T;
}

/**
 * Matches a {@link Constructable} or a {@link AbstractClass}.
 */
export type Class<T> = Constructable<T> | AbstractClass<T>;
