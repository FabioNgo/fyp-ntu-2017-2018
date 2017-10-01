import {CharSet} from './CharSet';

export class CharSetEnumerator {
  index: number;
  offset: number;
  mask = 1;
  private set: CharSet;
  
  public constructor (characters: CharSet) {
    for (this.set = characters; this.index < this.set.bits.length && this.set.bits[this.index] === 0; ++this.index) {
    }
    
    if (this.index < this.set.bits.length) {
      while (this.offset <= 63 && (this.set.bits[this.index].valueOf() & this.mask) === 0) {
        this.mask <<= 1;
        ++this.offset;
      }
      
    }
  }
  
  public hasMoreElements (): boolean {
    return this.index < this.set.bits.length;
  }
  
  public nextElement (): number {
    const x = (this.index << 6) + this.offset;
    this.advance();
    return x;
  }
  
  private advance () {
    do {
      ++this.offset;
      this.mask <<= 1;
    } while (this.offset <= 63 && (this.set.bits[this.index].valueOf() & this.mask) === 0);
    
    if (this.offset > 63) {
      do {
        ++this.index;
      } while (this.index < this.set.bits.length && this.set.bits[this.index] === 0);
      
      if (this.index >= this.set.bits.length) {
        return;
      }
      
      this.offset = 0;
      
      for (this.mask = 1; this.offset <= 63 && (this.set.bits[this.index].valueOf() & this.mask) === 0; ++this.offset) {
        this.mask <<= 1;
      }
    }
    
  }
}
