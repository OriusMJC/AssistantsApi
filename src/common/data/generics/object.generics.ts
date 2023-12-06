export type PurgeKeys<T extends object, ExcludedTypes> = {
  [X in keyof T]: T[X] extends ExcludedTypes ? never : X;
}[keyof T];

export type RequiredKeys<T extends object> = {
  [P in keyof T]: Pick<T, P> extends Required<Pick<T, P>> ? P : never;
}[keyof T];

export type OptionalKeys<T extends object> = {
  [P in keyof T]: Pick<T, P> extends Required<Pick<T, P>> ? never : P;
}[keyof T];

export type OnlyRequired<T extends object> = {
  [P in RequiredKeys<T>]: T[P];
};

export type OnlyOptional<T extends object> = {
  [P in OptionalKeys<T>]?: T[P];
};

export type Purge<T extends object, ExcludedTypes> = Pick<T, PurgeKeys<T, ExcludedTypes>>;

export type OnlyProps<T extends object> = Purge<T, Function | symbol>;

export type PropOf<T extends object> = keyof OnlyProps<T>;

/* 
export type Diff<A, B> = { [P in Exclude<keyof A, keyof B>]?: never };
export type XOR<A, B> = A | B extends object ? (Diff<A, B> & B) | (Diff<B, A> & A) : A | B;
*/
