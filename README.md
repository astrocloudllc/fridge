# fridge
A TypeScript wrapper around [@react-native-async-storage/async-storage](https://github.com/react-native-async-storage/async-storage) that can be used to simplify working with local storage.

## Install

```
npm install @react-native-async-storage/async-storage @astrocloudllc/fridge
```
or 
```
yarn add @react-native-async-storage/async-storage @astrocloud/fridge
```

## Setup
The easiest way to use this package is to create a file that handles your storage types and exports the types and storage object. For example, create a file called `storage.ts` and add the following:
```ts
import { createStorage } from "@astrocloudllc/fridge"

export interface StorageTypes {
  /* Your types go here */
}

export const storage = createStorage<StorageTypes>()
```
Then import the storage object in any file where you need to interact with AsyncStorage.

## Functions
Fridge includes several function, most of which directly run the relevant AsyncStorage function. Most of these function handle parsing and stringifying objects to simplify code used in other places.

### Getting Items

**`getItem`**

Retrieves an item from AsyncStorage and returns it as a parsed object. If the key is null the promise rejects
```ts
storage.getItem("key").then((data) => {
  //do stuff
}).catch((e) => {
  // key is null
})
```

**`getNullableItem`**

Similar to `getItem`, but instead of rejecting on `null` the promise resolves, similar to AsyncStorage's implementation.

```ts
storage.getNullableItem("key").then((data) => {
  // data is an object or null
})
```
**`getKey`**

Behaves identically to `AsyncStorage.getItem()` with no type checking or parsing.

```ts
storage.getKey("key").then((data) => {
  // data is a string or null
})
```

**`multiGet`**

Retrives multiple keys at once. The return type is different from `AsyncStorage.multiGet()`. Instead of two arrays this function returns an object where each key's value is the data found at that key.

```ts
interface StorageKeys {
  thing1: string[];
  thing2: number[];
}

storage.multiGet(["thing1", "thing2"]).then((data) => {
  data.thing1 // string[]
  data.thing2 // number[]
})
```

**`getAllKeys`**

Get an array of all keys in storage

```ts
storage.getAllKeys().then((data) => {
  //do stuff
})
```



### Setting Items

**`setItem`**

Sets an item to storage.
```ts
storage.setItem("key", data).then(() => {
  // do stuff
})
```

**`setKey`**

Behaves identically to `AsyncStorage.setItem()` with no type checking or parsing.

**`multiSet`**

Set multiple keys at once. Accpets an object that is similar to what is returned from `multiGet`

```ts
storage.multiSet({
  thing1: ["a", "b", "c"],
  thing2: [1, 2, 3]
}).then(() => {
  // do stuff
})
```

### Removing Items

**`removeItem`**

Remove an item from storage

```ts
storage.removeItem("key")
```

**removeKey**
Remove any key from storage, avoiding type checking on all defined keys.

**`multiRemove`**

Remove multiple items from storage.

```ts
storage.multiRemove([
  "thing1",
  "thing2"
])
```

**`clear`**

Clear all keys from storage.

```ts
storage.clear()
```

## FAQ
**Does this work with Expo?**

Yes! No extra setup is required, just install the package and use it as normal.

**Why is it called `fridge`?**

In theory it's cause refrigerators store things in a fairly organized manner. In reality it's cause naming stuff is hard so I just picked a thing.

## Contributing

Pull requests are welcome if there are any changes you think would be beneficial or if there is a bug.




