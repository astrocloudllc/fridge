export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export type MultiGetObject<T, K extends keyof T> = {
  [key in K]: T[key] | null;
};
export type Key<T> = keyof T & string;

export interface TypedStorage<T extends Record<string, any>> {
  getItem: <K extends Key<T>>(key: K) => Promise<T[K]>;
  getNullableItem: <K extends Key<T>>(key: K) => Promise<T[K] | null>;
  getKey: (key: string) => Promise<string | null>;
  setItem: <K extends Key<T>>(key: K, data: T[K]) => Promise<void>;
  setKey: (key: string, data: string) => Promise<void>;
  mergeItem: <K extends Key<T>>(
    key: K,
    data: DeepPartial<T[K]>
  ) => Promise<void>;
  removeItem: <K extends Key<T>>(key: K) => Promise<void>;
  removeKey: (key: string) => Promise<void>;
  multiSet: (data: Partial<T>) => Promise<void>;
  multiGet: <K extends Key<T>>(keys: K[]) => Promise<MultiGetObject<T, K>>;
  multiRemove: <K extends Key<T>>(keys: K[]) => Promise<void>;
  getAllKeys: () => Promise<Key<T>[]>;
  clear: () => Promise<void>;
}
