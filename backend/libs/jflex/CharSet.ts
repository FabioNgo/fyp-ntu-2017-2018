import {CharSetEnumerator} from './CharSetEnumerator';
import {JavaCharacter} from '../JavaCharacter';

export class CharSet {
  readonly BITS = 6;
  readonly MOD = 63;
  bits: number[];
  numElements: number;
  
  constructor (initialSize?: number, character?: JavaCharacter) {
    if (!initialSize) {
      this.bits = [];
    } else {
      this.bits = [];
      this.add(character);
    }
    
  }
  
  public add (character: JavaCharacter) {
    // this.resize(character);
    if ((this.bits[(character.code >> 6)] & 1 << (character.code & 63)) === 0) {
      ++this.numElements;
    }
    const pos = character.code >> 6;
    this.bits[pos] = this.bits[pos] | (1 << (character.code & 63));
  }
  
  public isElement (character: JavaCharacter): boolean {
    const index = character.code >> 6;
    if (index >= this.bits.length) {
      return false;
    } else {
      return (this.bits[index] & 1 << (character.code & 63)) !== 0;
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
      const newbits = this.bits.copyWithin(0, 0);
      this.bits = newbits;
    }
  }
}
