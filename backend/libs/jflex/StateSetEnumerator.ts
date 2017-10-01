export class StateSetEnumerator {
  private index;
  private offset;
  private mask;
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
    this.mask = 1;
    
    for (this.current = 0; this.index < this.bits.length && this.bits[this.index] === 0; ++this.index) {
      
    }
    
    if (this.index < this.bits.length) {
      while (this.offset <= 63 && (this.bits[this.index] & this.mask) === 0) {
        this.mask <<= 1;
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
      _mask <<= 1;
    } while (_offset <= 63 && (bi & _mask) === 0);
    
    if (_offset > 63) {
      const length = _bits.length;
      
      do {
        ++_index;
      } while (_index < length && _bits[_index] === 0);
      
      if (_index >= length) {
        this.index = length;
        return;
      }
      
      _offset = 0;
      _mask = 1;
      
      for (bi = _bits[_index]; (bi & _mask) === 0; ++_offset) {
        _mask <<= 1;
      }
    }
    
    this.index = _index;
    this.mask = _mask;
    this.offset = _offset;
  }
}
