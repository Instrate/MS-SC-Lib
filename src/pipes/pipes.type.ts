export type TypeProperty = unknown | object | number | string;

export type TypeValue<T> = string | T;

export type TypeOptionalValue<T> = TypeValue<T> | undefined | null;
