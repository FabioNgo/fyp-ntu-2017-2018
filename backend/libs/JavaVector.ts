// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

import {JavaObject} from './JavaObject';

export class JavaVector<T extends any> implements JavaObject {
  
  data: T[];
  length: number;
  
  constructor (input?) {
    if (input) {
      this.data = new Array<T>(input);
      return;
    } else {
      if (input instanceof Array) {
        this.data = input.copyWithin(0, 0);
      }
      this.data = new Array<T>(10);
    }
    
  }
  
  public size (): number {
    return this.data.length;
  }
  
  public isEmpty (): boolean {
    return this.data.length === 0;
  }
  
  public elementAt (index: number): T {
    if (index >= this.data.length) {
      throw new Error(index + ' >= ' + this.data.length);
    }
    
    return this.data[index];
  }
  
  public insertElementAt (obj: T, index: number) {
    for (let i = this.data.length; i > index; i--) {
      this.data[i] = this.data[i - 1];
    }
    this.data[index] = obj;
  }
  
  public removeElementAt (index: number) {
    this.data.splice(index, 1);
  }
  
  public addElement (obj: T) {
    this.data.push(obj);
  }
  
  public hashCode () {
    return 0;
  }
  
  equals (object: JavaObject) {
    return false;
  }
  
  getClass () {
    return 'Vector';
  }
}
