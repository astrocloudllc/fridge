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
    getItem: async <T extends Key<Keys>>(key: T) => {
      const data = await AsyncStorage.getItem(key);
      if (data === null) {
        throw null;
      } else {
        return JSON.parse(data) as Keys[T];
      }
    },
    getNullableItem: async <T extends Key<Keys>>(key: T) => {
      const data = await AsyncStorage.getItem(key);
      if (data === null) {
        return null;
      } else {
        return JSON.parse(data) as Keys[T];
      }
    },
    getKey: async (key: string) => AsyncStorage.getItem(key),
    setItem: <T extends Key<Keys>>(key: T, data: Keys[T]) =>
      AsyncStorage.setItem(key, JSON.stringify(data)),
    setKey: (key: string, data: string) => AsyncStorage.setItem(key, data),
    mergeItem: <T extends Key<Keys>>(key: T, data: DeepPartial<Keys[T]>) => {
      return AsyncStorage.mergeItem(key, JSON.stringify(data));
    },
    multiSet: async (data: Partial<Keys>) => {
      const keyValues: [string, string][] = [];
      Object.keys(data).forEach((e) => {
        keyValues.push([e, JSON.stringify(data[e as Key<Keys>])]);
      });
      return AsyncStorage.multiSet(keyValues);
    },
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
    removeItem: (key: Key<Keys>) => AsyncStorage.removeItem(key),
    removeKey: (key: string) => AsyncStorage.removeItem(key),
    getAllKeys: async () => {
      const keys = await AsyncStorage.getAllKeys();
      return keys as Key<Keys>[];
    },
    clear: () => AsyncStorage.clear(),
    multiRemove: (keys: Key<Keys>[]) => AsyncStorage.multiRemove(keys),
  };
};
export * from "./types";
