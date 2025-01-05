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
  /**
   * Read an item from local storage
   *
   * @param {string} key The key where the data is stored
   * @returns Resolves object type `T` if found, throws `null` otherwise
   */
  getItem: <K extends Key<T>>(key: K) => Promise<T[K]>;
  /**
   * Read an item, but returns `null` instead of throwing an error
   *
   * @param key The key where the data is stored
   * @returns Object type `T` if found, `null` otherwise
   */
  getNullableItem: <K extends Key<T>>(key: K) => Promise<T[K] | null>;
  /**
   * Read an arbitray key for one-offs that aren't in the `StorageKeys` type. Behaves identically to `AsyncStorage.getItem()`
   *
   * @param key The key where the data is stored
   * @returns String if found, `null` otherwise
   */
  getKey: (key: string) => Promise<string | null>;
  /**
   * Set an item to local storage
   *
   * @param {string} key The key of where to store the data
   * @param {T} data The object to store in local storage
   *
   */
  setItem: <K extends Key<T>>(key: K, data: T[K]) => Promise<void>;
  /**
   * Set an arbitrary key. Behaves identically to `AsyncStorage.setItem()`
   *
   * @param key The key of where to store the data
   * @param data The string to be stored
   *
   */
  setKey: (key: string, data: string) => Promise<void>;
  /**
   * Merges an existing `key` value with an input value, assuming both values are stringified JSON.
   *
   * @param {string} key The key where the data is being stored.
   * @param {T} data Data to be merged with current data
   */
  mergeItem: <K extends Key<T>>(
    key: K,
    data: DeepPartial<T[K]>
  ) => Promise<void>;
  /**
   * Removes an item from local storage
   *
   * @param {string} key The key to remove
   */
  removeItem: <K extends Key<T>>(key: K) => Promise<void>;
  /**
   * Removes an arbitrary key from storage
   * @param key The key to remove
   *
   */
  removeKey: (key: string) => Promise<void>;
  /**
   * Set data for multiple keys
   * @param data The data to be stored, passed in the form
   * ```ts
   *  {
   *    [key: Key]: data
   *  }
   * ```
   */
  multiSet: (data: Partial<T>) => Promise<void>;
  /**
   * Read multiple keys and return them as an object
   *
   * @param {string[]} keys The keys to read
   * @returns An object of the form
   * ```ts
   *  {
   *    [key: Key]: data
   *  }
   * ```
   */
  multiGet: <K extends Key<T>>(keys: K[]) => Promise<MultiGetObject<T, K>>;
  /** Remove multiple keys */
  multiRemove: <K extends Key<T>>(keys: K[]) => Promise<void>;
  /** Get all keys known to local storage returned as an array of strings */
  getAllKeys: () => Promise<Key<T>[]>;
  /** Clear local storage */
  clear: () => Promise<void>;
}
