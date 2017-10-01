import {CharSetEnumerator} from './CharSetEnumerator';

export class CharSet {
  readonly BITS = 6;
  readonly MOD = 63;
  bits: Array<Number>;
  numElements: number;
  
  constructor (initialSize?: number, character?: number) {
    if (!initialSize) {
      this.bits = new Array<Number>(1);
    } else {
      this.bits = new Array<Number>((initialSize >> 6) + 1);
      this.add(character);
    }
    
  }
  
  public add (character: number) {
    this.resize(character);
    if ((this.bits[(character >> 6)].valueOf() & 1 << (character & 63)) === 0) {
      ++this.numElements;
    }
    const pos = character >> 6;
    this.bits[pos] = this.bits[pos].valueOf() | (1 << (character & 63));
  }
  
  public isElement (character: number): boolean {
    const index = character >> 6;
    if (index >= this.bits.length) {
      return false;
    } else {
      return (this.bits[index].valueOf() & 1 << (character & 63)) !== 0;
    }
  }
  
  public characters (): CharSetEnumerator {
    return new CharSetEnumerator(this);
  }
  
  public containsElements (): boolean {
    return this.numElements > 0;
  }
  
  public size (): number {
    return this.numElements;
  }
  
  public toString (): string {
    const _enum = this.characters();
    let result = '{';
    if (_enum.hasMoreElements()) {
      result = result + ('' + _enum.nextElement());
    }
    
    while (_enum.hasMoreElements()) {
      const i = _enum.nextElement();
      result += (', ' + i);
    }
    
    result += ('}');
    return result;
  }
  
  private nbits2size (nbits: number): number {
    return (nbits >> 6) + 1;
  }
  
  private resize (nbits: number) {
    const needed = this.nbits2size(nbits);
    if (needed >= this.bits.length) {
      let newbits = new Array<Number>(Math.max(this.bits.length * 2, needed));
      newbits = this.bits.copyWithin(0, 0);
      this.bits = newbits;
    }
  }
}
