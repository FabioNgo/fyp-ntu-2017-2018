import {StateSetEnumerator} from './StateSetEnumerator';
import {isNullOrUndefined, isNumber, isUndefined} from 'util';
import {JavaLong} from '../JavaLong';

export class StateSet {
  public static readonly EMPTY = new StateSet();
  static readonly BITS = 6;
  static readonly MASK = 63;
  bits: JavaLong[];
  
  public constructor (sizeOrStateSet?: number | StateSet, state?) {
    if (isUndefined(sizeOrStateSet)) {
      this.constructor(256);
      return;
    }
    if (isNumber(sizeOrStateSet)) {
      const size = <number> sizeOrStateSet;
      this.bits = new Array(this.size2nbits(size));
      for (let i = 0; i < this.bits.length; ++i) {
        this.bits[i] = JavaLong.getZero();
      }
      if (!isUndefined(state)) {
        state = <number>state;
        this.addState(state);
      }
      return;
    }
    if (sizeOrStateSet instanceof StateSet) {
      
      const set = <StateSet>sizeOrStateSet;
      this.bits = new Array(set.bits.length);
      this.bits = set.bits.copyWithin(0, 0);
    }
  }
  
  public resize (size: number) {
    const needed = this.size2nbits(size);
    let newbits = new Array<JavaLong>(Math.max(this.bits.length * 4, needed));
    newbits = this.bits.copyWithin(0, 0);
    this.bits = newbits;
  }
  
  public addState (state: number) {
    const index = state >> 6;
    if (index >= this.bits.length) {
      this.resize(state);
    }
    // this.bits[index] |= 1 << (state & 63);
    // if(state == 32){
    //   let a = 0;
    // }
    const _1 = JavaLong.getOne();
    const rhs = _1.shiftLeft(state & 63);
    if (isUndefined(this.bits[index])) {
      this.bits[index] = JavaLong.getZero();
    }
    this.bits[index] = JavaLong.bitOr(this.bits[index], rhs);
    
  }
  
  
  public clear () {
    const l = this.bits.length;
    
    for (let i = 0; i < l; ++i) {
      this.bits[i] = JavaLong.getZero();
    }
    
  }
  
  public isElement (state): boolean {
    const index = state >> 6;
    if (index >= this.bits.length) {
      return false;
    } else {
      // return (this.bits[index] & 1 << (state & 63)) !== 0;
      const _1 = JavaLong.getOne();
      const rhs = _1.shiftLeft(state & 63);
      return JavaLong.bitOr(this.bits[index], rhs).toNumber() !== 0;
    }
  }
  
  public getAndRemoveElement () {
    let i = 0;
    let o = 0;
    
    let m;
    for (m = 1; this.bits[i].toNumber() === 0; ++i) {
    }
    m = JavaLong.fromNumber(m);
    while ((JavaLong.bitAnd(this.bits[i], m)).toNumber() === 0) {
      // m <<= 1;
      m = m.shiftLeft(1);
      ++o;
    }
  
    this.bits[i] = JavaLong.bitAnd(this.bits[i], m.bitNot());
    return (i << 6) + o;
  }
  
  public remove (state) {
    const index = state >> 6;
    if (index < this.bits.length) {
      // this.bits[index] &= ~(1L << (state & 63));
      const _1 = JavaLong.getOne();
      const rhs = _1.shiftLeft(state & 63).bitNot();
      this.bits[index] = JavaLong.bitAnd(this.bits[index], rhs);
    }
  }
  
  public complement (set) {
    if (isNullOrUndefined(set)) {
      return null;
    } else {
      const result = new StateSet();
      result.bits = [];
      const m = Math.min(this.bits.length, set.bits.length);
      
      for (let i = 0; i < m; ++i) {
        //  result.bits[i] = ~this.bits[i] & set.bits[i];
        result.bits[i] = JavaLong.bitAnd(this.bits[i].bitNot(), set.bits[i]);
      }
      
      if (this.bits.length < set.bits.length) {
        result.bits = set.bits.copyWithin(m, result.bits.length - m);
        // System.arraycopy(set.bits, m, result.bits, m, result.bits.length - m);
      }
      
      return result;
    }
  }
  
  public add (set: StateSet) {
    if (!isNullOrUndefined(set)) {
      const sbits = set.bits;
      const sbitsl = sbits.length;
      let tbits;
      if (this.bits.length < sbitsl) {
        tbits = this.bits.copyWithin(0, 0);
      } else {
        tbits = this.bits;
      }
      
      for (let i = 0; i < sbitsl; ++i) {
        // tbits[i] |= sbits[i];
        tbits[i] = JavaLong.bitOr(tbits[i], sbits[i]);
      }
      
      this.bits = tbits;
    }
  }
  
  public containsSet (set: StateSet) {
    const min = Math.min(this.bits.length, set.bits.length);
    
    let i;
    for (i = 0; i < min; ++i) {
      // if ((this.bits[i] & set.bits[i]) != set.bits[i]) {
      if (JavaLong.bitAnd(this.bits[i], set.bits[i]).toNumber() !== set.bits[i].toNumber()) {
        return false;
      }
    }
    
    for (i = min; i < set.bits.length; ++i) {
      if (set.bits[i].toNumber() !== 0) {
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
        if (this.bits[i].toNumber() !== set.bits[i].toNumber()) {
          return false;
        }
        
        ++i;
      }
      
      do {
        if (i >= l2) {
          return true;
        }
      } while (set.bits[i++].toNumber() === 0);
      
      return false;
    } else {
      while (i < l2) {
        if (this.bits[i].toNumber() !== set.bits[i].toNumber()) {
          return false;
        }
        
        ++i;
      }
      
      while (i < l1) {
        if (this.bits[i++].toNumber() !== 0) {
          return false;
        }
      }
      
      return true;
    }
  }
  
  public hashCode () {
    // let h = 1234;
    // const _bits = this.bits;
    //
    // let i;
    // for (i = this.bits.length - 1; i >= 0 && _bits[i].getValue() === 0; --i) {
    //
    // }
    //
    // while (i >= 0) {
    //   h ^= _bits[i--] * i;
    // }
    //
    // return (h >> 32 ^ h);
  }
  
  public states (): StateSetEnumerator {
    return new StateSetEnumerator(this);
  }
  
  public containsElements () {
    for (let i = 0; i < this.bits.length; ++i) {
      if (this.bits[i].toNumber() !== 0) {
        return true;
      }
    }
    
    return false;
  }
  
  public copy () {
    const set = new StateSet();
    if (this.bits.length < set.bits.length) {
      this.bits = new Array(set.bits.length);
    } else {
      for (let i = set.bits.length; i < this.bits.length; ++i) {
        this.bits[i] = JavaLong.getZero();
      }
    }
    this.bits = set.bits.copyWithin(0, 0);
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
  
  private size2nbits (size: number) {
    return (size >> 6) + 1;
  }
}
