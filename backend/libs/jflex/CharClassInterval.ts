export class CharClassInterval {
  start: number;
  end: number;
  charClass: number;
  
  constructor (start: number, end: number, charClass: number) {
    this.start = start;
    this.end = end;
    this.charClass = charClass;
  }
  
  public toString (): string {
    return '[' + this.start + '-' + this.end + '=' + this.charClass + ']';
  }
}
