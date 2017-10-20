import {JavaCharacter} from '../JavaCharacter';

export class CharClassInterval {
  start: JavaCharacter;
  end: JavaCharacter;
  charClass: number;
  
  constructor (start: JavaCharacter, end: JavaCharacter, charClass: number) {
    this.start = start;
    this.end = end;
    this.charClass = charClass;
  }
  
  public toString (): string {
    return '[' + this.start + '-' + this.end + '=' + this.charClass + ']';
  }
}
