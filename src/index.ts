import AsyncStorage from "@react-native-async-storage/async-storage";
import { DeepPartial, TypedStorage, Key, MultiGetObject } from "./types";

/** A typed wrapper around the `AsyncStorage` library.
 * Usage is nearly identical to the library, however this provides better handling with types.
 * All objects should be passed as objects and are returned as objects, the JSON stringify and parse methods
 * are called within the object to simplify code. */
export const createStorage = <
  Keys extends Record<string, any>
>(): TypedStorage<Keys> => {
  return {
    /**
     * Read an item from local storage
     *
     * @param {string} key The key where the data is stored
     * @returns Resolves object type `T` if found, throws `null` otherwise
     */
    getItem: async <T extends Key<Keys>>(key: T) => {
      const data = await AsyncStorage.getItem(key);
      if (data === null) {
        throw null;
      } else {
        return JSON.parse(data) as Keys[T];
      }
    },
    /**
     * Read an item, but returns `null` instead of throwing an error
     *
     * @param key The key where the data is stored
     * @returns Object type `T` if found, `null` otherwise
     */
    getNullableItem: async <T extends Key<Keys>>(key: T) => {
      const data = await AsyncStorage.getItem(key);
      if (data === null) {
        return null;
      } else {
        return JSON.parse(data) as Keys[T];
      }
    },
    /**
     * Read an arbitray key for one-offs that aren't in the `StorageKeys` type. Behaves identically to `AsyncStorage.getItem()`
     *
     * @param key The key where the data is stored
     * @returns String if found, `null` otherwise
     */

    getKey: async (key: string) => AsyncStorage.getItem(key),
    /**
     * Set an item to local storage
     *
     * @param {string} key The key of where to store the data
     * @param {T} data The object to store in local storage
     *
     */
    setItem: <T extends Key<Keys>>(key: T, data: Keys[T]) =>
      AsyncStorage.setItem(key, JSON.stringify(data)),
    /**
     * Set an arbitrary key. Behaves identically to `AsyncStorage.setItem()`
     *
     * @param key The key of where to store the data
     * @param data The string to be stored
     *
     */
    setKey: (key: string, data: string) => AsyncStorage.setItem(key, data),
    /**
     * Merges an existing `key` value with an input value, assuming both values are stringified JSON.
     *
     * @param {string} key The key where the data is being stored.
     * @param {T} data Data to be merged with current data
     */
    mergeItem: <T extends Key<Keys>>(key: T, data: DeepPartial<Keys[T]>) => {
      // const cur = await this.getItem<T>(key);
      // if (Array.isArray(cur) && Array.isArray(data)) {
      //   console.log("both arrays");
      //   const newArray = Array.from(new Set([...cur, ...data]));
      //   console.log(newArray);
      //   return AsyncStorage.setItem(key, JSON.stringify(newArray));
      // } else if (
      //   Object.entries(cur as object).length !== 0 &&
      //   Object.entries(data as object).length !== 0
      // ) {
      //   return AsyncStorage.setItem(key, JSON.stringify({ ...cur, ...data }));
      // } else {
      //   throw new Error("incompatable type(s)");
      // }
      return AsyncStorage.mergeItem(key, JSON.stringify(data));
    },
    /**
     * Set data for multiple keys
     * @param data The data to be stored, passed in the form
     * ```ts
     *  {
     *    [key: Key]: data
     *  }
     * ```
     */
    multiSet: async (data: Partial<Keys>) => {
      const keyValues: [string, string][] = [];
      Object.keys(data).forEach((e) => {
        keyValues.push([e, JSON.stringify(data[e as Key<Keys>])]);
      });
      return AsyncStorage.multiSet(keyValues);
    },
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
    multiGet: async <T extends keyof Keys>(keys: T[]) => {
      const data = await AsyncStorage.multiGet(keys as string[]);
      let values = {} as MultiGetObject<Keys, T>;
      data.forEach(([key, value]) => {
        if (keys.includes(key as T)) {
          values[key as T] = value ? JSON.parse(value) : null;
        }
      });
      return values;
    },
    /**
     * Removes an item from local storage
     *
     * @param {string} key The key to remove
     */
    removeItem: (key: Key<Keys>) => AsyncStorage.removeItem(key),

    /**
     * Removes an arbitrary key from storage
     * @param key The key to remove
     *
     */
    removeKey: (key: string) => AsyncStorage.removeItem(key),
    /** Get all keys known to local storage returned as an array of strings */
    getAllKeys: async () => {
      const keys = await AsyncStorage.getAllKeys();
      return keys as Key<Keys>[];
    },
    /** Clear local storage */
    clear: () => AsyncStorage.clear(),
    /** Remove multiple keys */
    multiRemove: (keys: Key<Keys>[]) => AsyncStorage.multiRemove(keys),
  };
};
export * from "./types";
