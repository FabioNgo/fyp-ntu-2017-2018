import {JavaLong} from '../JavaLong';

export class StateSetEnumerator {
  private index;
  private offset;
  private mask: JavaLong;
  private current;
  private bits;
  
  public constructor (states?) {
    if (states) {
      this.reset(states);
    }
  }
  
  public reset (states) {
    this.bits = states.bits;
    this.index = 0;
    this.offset = 0;
    this.mask = JavaLong.getOne();
    
    for (this.current = 0; this.index < this.bits.length && this.bits[this.index].toNumber() === 0; ++this.index) {
    
    }
    
    if (this.index < this.bits.length) {
      while (this.offset <= 63 && (JavaLong.bitAnd(this.bits[this.index], this.mask).toNumber()) === 0) {
        this.mask = this.mask.shiftLeft(1);
        ++this.offset;
      }
      
    }
  }
  
  public hasMoreElements () {
    return this.index < this.bits.length;
  }
  
  public nextElement () {
    const x = (this.index << 6) + this.offset;
    this.advance();
    return x;
  }
  
  private advance () {
    let _index = this.index;
    let _offset = this.offset;
    let _mask = this.mask;
    const _bits = this.bits;
    let bi = _bits[_index];
    
    do {
      ++_offset;
      _mask = _mask.shiftLeft(1);
    } while (_offset <= 63 && (JavaLong.bitAnd(bi, _mask)).toNumber() === 0);
    
    if (_offset > 63) {
      const length = _bits.length;
      
      do {
        ++_index;
      } while (_index < length && _bits[_index].toNumber() === 0);
      
      if (_index >= length) {
        this.index = length;
        return;
      }
      
      _offset = 0;
      _mask = JavaLong.getOne();
      
      for (bi = _bits[_index]; JavaLong.bitAnd(bi, _mask).toNumber() === 0; ++_offset) {
        _mask = _mask.shiftLeft(1);
      }
    }
    
    this.index = _index;
    this.mask = _mask;
    this.offset = _offset;
  }
}
