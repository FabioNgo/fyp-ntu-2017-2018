// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

import {JavaObject} from './JavaObject';
import {isUndefined} from 'util';

export class ObjectKeyMap<K extends JavaObject, V> implements Map<K, V> {
  _keys: K[];
  _values: V[];
  [Symbol.toStringTag];
  size: number;
  
  constructor () {
    this._keys = [];
    this._values = [];
    this.size = 0;
  }
  
  forEach (callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any): void {
    for (let i = 0; i < this.size; i++) {
      callbackfn(this._values[i], this._keys[i], this);
    }
  }
  
  [Symbol.iterator] (): IterableIterator<[K, V]> {
    return undefined;
  }
  
  entries (): IterableIterator<[K, V]> {
    return undefined;
  }
  
  keys (): IterableIterator<K> {
    
    return this._keys.values();
  }
  
  values (): IterableIterator<V> {
    return this._values.values();
  }
  
  clear (): void {
    this._keys = [];
    this._values = [];
  }
  
  delete (key: K): boolean {
    for (let i = 0; i < this._keys.length; i++) {
      if (this._keys[i].equals(key)) {
        this._keys.splice(i, 0);
        this._values.splice(i, 0);
        this.size--;
        return true;
      }
    }
    return false;
  }
  
  
  get (key: K): any | V {
    let result;
    for (let i = 0; i < this._keys.length; i++) {
      if (this._keys[i].equals(key)) {
        result = this._values[i];
        
      }
    }
    return result;
  }
  
  has (key: K): boolean {
    return isUndefined(this.get(key));
  }
  
  set (key: K, value: V): this {
    for (let i = 0; i < this._keys.length; i++) {
      if (this._keys[i].equals(key)) {
        this._values[i] = value;
        return this;
      }
    }
    this._values[this._values.length] = value;
    this._keys[this._keys.length] = key;
    this.size++;
    return this;
  }
  
  
}
