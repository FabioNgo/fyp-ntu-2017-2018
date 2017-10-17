// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

import {JavaObject} from './JavaObject';
// import {isAsciiLetter, isDigit} from '@angular/compiler/src/chars';
import {isNumber, isString} from 'util';
import {isAsciiLetter, isDigit} from 'codelyzer/angular/styles/chars';

export class JavaCharacter extends String implements JavaObject {
  
  value: string;
  code: number;
  hash = 0;
  
  constructor (input: string | number) {
    super();
    if (isString(input)) {
      const string = <string>input;
      this.value = string.charAt(0);
      this.code = string.charCodeAt(0);
      return;
    }
    if (isNumber(input)) {
      const string = <number>input;
      this.value = String.fromCharCode(string.valueOf());
      this.code = string.valueOf();
    }
    
  }
  
  static toLowerCase (c: number): JavaCharacter {
    const value = String.fromCharCode(c);
    return new JavaCharacter(value.toLowerCase());
  }
  
  static toUpperCase (c: number): JavaCharacter {
    const value = String.fromCharCode(c);
    return new JavaCharacter(value.toUpperCase());
  }
  
  static toTitleCase (c: number): JavaCharacter {
    return JavaCharacter.toUpperCase(c);
  }
  
  static toCode (c: string) {
    return c.charCodeAt(0);
  }
  
  static toChar (c: number) {
    return String.fromCharCode(c);
  }
  
  static isJavaIdentifierStart (c: string) {
    if (JavaCharacter.isLetter(c)) {
      return true;
    }
    
    if (c.charAt(0) === '_' || c.charAt(0) === '$') {
      return true;
    }
    return false;
  }
  
  static isJavaIdentifierPart (c: string) {
    return (JavaCharacter.isDigit(c) || JavaCharacter.isJavaIdentifierStart(c));
    
  }
  
  static isLetter (c: string) {
    const code = c.charCodeAt(0);
    return isAsciiLetter(code);
    
  }
  
  static isDigit (c: string) {
    const code = c.charCodeAt(0);
    return isDigit(code);
  }
  
  
  public hashCode () {
    let h = this.hash;
    if (h === 0 && this.length > 0) {
      for (let i = 0; i < this.length; i++) {
        h = 31 * h + this.charCodeAt(i);
      }
      this.hash = h;
    }
    return h;
  }
  
  public fromCharCode (code: number) {
    this.value = String.fromCharCode(code);
    this.code = code;
  }
  
  equals (object: JavaObject) {
    if (object === null) {
      return false;
    }
    if (object instanceof JavaCharacter) {
      return object.value === this.value;
    } else {
      return false;
    }
  }
  
  getClass () {
    return 'Character';
  }
  
  toString () {
    return this.getClass() + ':=' + this.value;
  }
  
}
