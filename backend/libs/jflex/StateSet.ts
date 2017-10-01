import {StateSetEnumerator} from './StateSetEnumerator';

export class StateSet {
  public static readonly EMPTY = new StateSet();
  static readonly BITS = 6;
  static readonly MASK = 63;
  bits;
  
  public constructor (state?) {
    this.bits = [];
    if (state instanceof Number) {
      this.addState(state.valueOf());
    }
    if (state instanceof StateSet) {
      state.bits.copyWithin(this.bits, 0);
    }
  }
  
  
  public addState (state: number) {
    const index = state >> 6;
    this.bits[index] |= 1 << (state & 63);
  }
  
  
  public clear () {
    const l = this.bits.length;
    
    for (let i = 0; i < l; ++i) {
      this.bits[i] = 0;
    }
    
  }
  
  public isElement (state) {
    const index = state >> 6;
    if (index >= this.bits.length) {
      return false;
    } else {
      return (this.bits[index] & 1 << (state & 63)) !== 0;
    }
  }
  
  public getAndRemoveElement () {
    let i = 0;
    let o = 0;
    
    let m;
    for (m = 1; this.bits[i] === 0; ++i) {
    }
    
    while ((this.bits[i] & m) === 0) {
      m <<= 1;
      ++o;
    }
    
    this.bits[i] &= ~m;
    return (i << 6) + o;
  }
  
  public remove (state) {
    const index = state >> 6;
    if (index < this.bits.length) {
      this.bits[index] &= ~(1 << (state & 63));
    }
  }
  
  public complement (set) {
    if (set == null) {
      return null;
    } else {
      const result = new StateSet();
      result.bits = [];
      const m = Math.min(this.bits.length, set.bits.length);
      
      for (let i = 0; i < m; ++i) {
        result.bits[i] = ~this.bits[i] & set.bits[i];
      }
      
      if (this.bits.length < set.bits.length) {
        set.bits.copyWithin(result.bits, m, result.bits.length - m);
        // System.arraycopy(set.bits, m, result.bits, m, result.bits.length - m);
      }
      
      return result;
    }
  }
  
  public add (set: StateSet) {
    if (set != null) {
      const sbits = set.bits;
      const sbitsl = sbits.length;
      let tbits;
      if (this.bits.length < sbitsl) {
        this.bits.copyWithin(tbits, 0);
      } else {
        tbits = this.bits;
      }
      
      for (let i = 0; i < sbitsl; ++i) {
        tbits[i] |= sbits[i];
      }
      
      this.bits = tbits;
    }
  }
  
  public containsSet (set: StateSet) {
    const min = Math.min(this.bits.length, set.bits.length);
    
    let i;
    for (i = 0; i < min; ++i) {
      if ((this.bits[i] & set.bits[i]) !== set.bits[i]) {
        return false;
      }
    }
    
    for (i = min; i < set.bits.length; ++i) {
      if (set.bits[i] !== 0) {
        return false;
      }
    }
    
    return true;
  }
  
  public equals (b) {
    let i = 0;
    const set = <StateSet>b;
    const l1 = this.bits.length;
    const l2 = set.bits.length;
    if (l1 <= l2) {
      while (i < l1) {
        if (this.bits[i] !== set.bits[i]) {
          return false;
        }
        
        ++i;
      }
      
      do {
        if (i >= l2) {
          return true;
        }
      } while (set.bits[i++] === 0);
      
      return false;
    } else {
      while (i < l2) {
        if (this.bits[i] !== set.bits[i]) {
          return false;
        }
        
        ++i;
      }
      
      while (i < l1) {
        if (this.bits[i++] !== 0) {
          return false;
        }
      }
      
      return true;
    }
  }
  
  public hashCode () {
    let h = 1234;
    const _bits = this.bits;
    
    let i;
    for (i = this.bits.length - 1; i >= 0 && _bits[i] === 0; --i) {
    
    }
    
    while (i >= 0) {
      h ^= _bits[i--] * i;
    }
    
    return (h >> 32 ^ h);
  }
  
  public states (): StateSetEnumerator {
    return new StateSetEnumerator(this);
  }
  
  public containsElements () {
    for (let i = 0; i < this.bits.length; ++i) {
      if (this.bits[i] !== 0) {
        return true;
      }
    }
    
    return false;
  }
  
  public copy () {
    const set = new StateSet();
    set.bits = [];
    this.bits.copyWithin(set.bits, 0);
    return set;
  }
  
  public toString () {
    const _enum = this.states();
    let result = '{';
    if (_enum.hasMoreElements()) {
      result += ('' + _enum.nextElement());
    }
    
    while (_enum.hasMoreElements()) {
      const i = _enum.nextElement();
      result += (', ' + i);
    }
    
    result += ('}');
    return result.toString();
  }
}
