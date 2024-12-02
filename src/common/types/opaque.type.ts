declare const typeID: unique symbol;

export type Opaque<T, Identifier extends string> = T & {
  [typeID]: Identifier;
};
