import {JavaCharacter} from '../JavaCharacter';

export abstract class PackEmitter {
  private static readonly maxEntries = 16;
  private static readonly maxSize = 65529;
  private static indent = '    ';
  out = '';
  protected name = '';
  protected chunks = 0;
  private _UTF8Length = 0;
  private linepos = 0;
  
  constructor (name: string) {
    this.name = name;
  }
  
  public toString (): string {
    return this.out.toString();
  }
  
  public emitInit () {
    this.out += ('  private static final int [] ');
    this.out += (this.constName());
    this.out += (' = zzUnpack');
    this.out += (this.name);
    this.out += ('();');
    this.nl();
    this.nextChunk();
  }
  
  public emitUC (i: number): string {
    let result = '';
    if (i >= 0 && i <= 65535) {
      const c = new JavaCharacter(i);
      result += this.printUC(c);
      this._UTF8Length += this.UTF8Length(c);
      ++this.linepos;
    } else {
      throw new Error('character value expected');
    }
    return result;
  }
  
  public breaks () {
    if (this._UTF8Length >= 65529) {
      this.out += ('";');
      this.nl();
      this.nextChunk();
    } else if (this.linepos >= 16) {
      this.out += ('"+');
      this.nl();
      this.out += ('    ');
      this.out += ('"');
      this.linepos = 0;
    }
    
  }
  
  public abstract emitUnpack ();
  
  protected constName (): string {
    return 'ZZ_' + this.name.toUpperCase();
  }
  
  protected nl () {
    this.out += '';
  }
  
  protected println (s: string) {
    this.out += (s);
    this.nl();
  }
  
  private nextChunk () {
    this.nl();
    this.out += ('  private static final String ');
    this.out += (this.constName());
    this.out += ('_PACKED_');
    this.out += (this.chunks);
    this.out += (' =');
    this.nl();
    this.out += ('    ');
    this.out += ('"');
    this._UTF8Length = 0;
    this.linepos = 0;
    ++this.chunks;
  }
  
  private printUC (c: JavaCharacter): string {
    let result = '';
    if (c.code > 255) {
      result += ('\\u');
      // this.out += ('\\u');
      if (c.code < 4096) {
        result += ('0');
        this.out += ('0');
      }
  
      result += (c.code.toString(16));
      this.out += (c.code.toString(16));
    } else {
      result += ('\\');
      this.out += ('\\');
      result += (c.code.toString(8));
      this.out += (c.code.toString(8));
    }
    this.out += result;
    return result;
    
  }
  
  private UTF8Length (input: JavaCharacter): number {
    const value = input.code;
    if (value === 0) {
      return 2;
    } else if (value <= 127) {
      return 1;
    } else if (value < 1024) {
      return 2;
    } else {
      return value <= 2047 ? 3 : 3;
    }
  }
}
