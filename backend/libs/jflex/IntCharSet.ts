import {JavaObject} from '../JavaObject';
import {Interval} from './Interval';
import {JavaCharacter} from '../JavaCharacter';
import {JavaVector} from '../JavaVector';

export class IntCharSet {
  DEBUG = false;
  intervals: JavaVector<Interval>;
  pos: number;
  
  constructor (input?: JavaVector<Interval> | JavaCharacter | Interval) {
    if (input) {
      this.intervals = new JavaVector<Interval>();
      return;
    }
    if (input instanceof JavaCharacter) {
      this.constructor(new Interval(input, input));
      return;
    }
    if (input instanceof Interval) {
      this.constructor();
      this.intervals.addElement(input);
      return;
    }
    if (input instanceof JavaVector) {
      const chars = input;
      const size = input.length;
      this.intervals = new JavaVector<Interval>(size);
      for (let i = 0; i < size; ++i) {
        this.add(<Interval>chars.elementAt(i));
      }
    }
  }
  
  public hashCode () {
    return 0;
  }
  
  public add (input): IntCharSet {
    if (input instanceof IntCharSet) {
      const size = this.intervals.size();
      for (let i = 0; i < size; ++i) {
        {
          this.add(<Interval>input.intervals.elementAt(i));
        }
        return this;
      }
      if (input instanceof Interval) {
        let length = this.intervals.size();
        const interval = input;
        for (let i = 0; i < length; i++) {
          const elem = <Interval>this.intervals.elementAt(i);
          if (elem.end.code + 1 >= interval.start.code) {
            if (elem.contains(interval)) {
              return;
            }
            
            if (elem.start.code > interval.end.code + 1) {
              this.intervals.insertElementAt(new Interval(interval.start, interval.end), i);
              return;
            }
            
            if (interval.start.code < elem.start.code) {
              elem.start = interval.start;
            }
            
            if (interval.end.code <= elem.end.code) {
              return;
            }
            
            elem.end = interval.end;
            ++i;
            
            while (i < length) {
              const x = <Interval> this.intervals.elementAt(i);
              if (x.start.code > elem.end.code + 1) {
                return;
              }
              
              elem.end = x.end;
              this.intervals.removeElementAt(i);
              --length;
            }
            
            return;
          }
        }
        this.intervals.addElement(new Interval(interval.start, interval.end));
      }
      if (input instanceof JavaCharacter) {
        const length = this.intervals.size();
        const c = input;
        for (let i = 0; i < length; ++i) {
          const elem = <Interval>this.intervals.elementAt(i);
          if (elem.end.code + 1 >= c.code) {
            if (elem.contains(c)) {
              return;
            }
            
            if (elem.start.code > c.code + 1) {
              this.intervals.insertElementAt(new Interval(c, c), i);
              return;
            }
            
            if (c.code + 1 === elem.start.code) {
              elem.start = c;
              return;
            }
            
            elem.end = c;
            if (i >= size) {
              return;
            }
            
            const x = <Interval>this.intervals.elementAt(i + 1);
            if (x.start.code <= c.code + 1) {
              elem.end = x.end;
              this.intervals.removeElementAt(i + 1);
            }
            return;
          }
        }
        
        this.intervals.addElement(new Interval(c, c));
      }
    }
  }
  
  public contains (input): boolean {
    if (input instanceof JavaCharacter) {
      const singleChar = input;
      return this.indexOf(singleChar) >= 0;
    }
    if (input instanceof Interval) {
      const interval = input;
      const index = this.indexOf(interval.start);
      return index < 0 ? false : (<Interval>this.intervals.elementAt(index)).contains(interval);
    }
    if (input instanceof IntCharSet) {
      const set = input;
      let i = 0;
      let j = 0;
      
      while (j < set.intervals.length) {
        const x = <Interval>this.intervals.elementAt(i);
        const y = <Interval>this.intervals.elementAt(j);
        if (x.contains(y)) {
          ++j;
        }
        
        if (x.start.code > y.end.code) {
          return false;
        }
        
        if (x.end.code < y.start.code) {
          ++i;
        }
      }
      
      return true;
    }
    
  }
  
  equals (o: JavaObject) {
    if (o instanceof IntCharSet) {
      const set = <IntCharSet>o;
      if (this.intervals.length !== set.intervals.length) {
        return false;
      } else {
        for (let i = 0; i < this.intervals.length; ++i) {
          if (!this.intervals.elementAt(i).equals(set.intervals.elementAt(i))) {
            return false;
          }
        }
        
        return true;
      }
    } else {
      return false;
    }
    
  }
  
  min (a: JavaCharacter, b: JavaCharacter): JavaCharacter {
    return a.code <= b.code ? a : b;
  }
  
  max (a: JavaCharacter, b: JavaCharacter): JavaCharacter {
    return a.code >= b.code ? a : b;
  }
  
  and (set: IntCharSet): IntCharSet {
    const result = new IntCharSet();
    let i = 0;
    let j = 0;
    const size = this.intervals.length;
    const setSize = set.intervals.length;
    
    while (i < size && j < setSize) {
      const x = <Interval>this.intervals.elementAt(i);
      const y = <Interval>set.intervals.elementAt(j);
      if (x.end.code < y.start.code) {
        ++i;
      } else if (y.end.code < x.start.code) {
        ++j;
      } else {
        result.intervals.addElement(new Interval(this.max(x.start, y.start), this.min(x.end, y.end)));
        if (x.end.code >= y.end.code) {
          ++j;
        }
        
        if (y.end.code >= x.end.code) {
          ++i;
        }
      }
    }
    
    return result;
  }
  
  sub (set: IntCharSet) {
    let i = 0;
    let j = 0;
    const setSize = set.intervals.length;
    
    while (i < this.intervals.length && j < setSize) {
      const x = <Interval>this.intervals.elementAt(i);
      const y = <Interval>set.intervals.elementAt(j);
      if (x.end.code < y.start.code) {
        ++i;
      } else if (y.end.code < x.start.code) {
        ++j;
      } else if (x.start.code === y.start.code && x.end.code === y.end.code) {
        this.intervals.removeElementAt(i);
        ++j;
      } else if (x.start.code === y.start.code) {
        x.start.fromCharCode(y.end.code + 1);
        ++j;
      } else if (x.end === y.end) {
        x.end.fromCharCode(y.start.code - 1);
        ++i;
        ++j;
      } else {
        const temp = new JavaCharacter('0');
        temp.fromCharCode(y.start.code - 1);
        this.intervals.insertElementAt(new Interval(x.start, temp), i);
        x.start.fromCharCode(y.end.code + 1);
        ++i;
        ++j;
      }
    }
    
  }
  
  containsElements (): boolean {
    return this.intervals.size() > 0;
  }
  
  numIntervals (): number {
    return this.intervals.size();
  }
  
  getNext (): Interval {
    if (this.pos === this.intervals.size()) {
      this.pos = 0;
    }
    
    return <Interval>this.intervals.elementAt(this.pos++);
  }
  
  getCaseless (): IntCharSet {
    const n = this.copy();
    const size = this.intervals.size();
    
    for (let i = 0; i < size; ++i) {
      const elem = <Interval>this.intervals.elementAt(i);
      
      for (let c = elem.start.code; c <= elem.end.code; ++c) {
        n.add(JavaCharacter.toLowerCase(c));
        n.add(JavaCharacter.toUpperCase(c));
        n.add(JavaCharacter.toTitleCase(c));
      }
    }
    
    return n;
  }
  
  toString (): string {
    let result = '{ ';
    
    for (let i = 0; i < this.intervals.size(); ++i) {
      result = result + (this.intervals.elementAt(i).toString());
    }
    
    result += ' }';
    return result.toString();
  }
  
  copy (): IntCharSet {
    const result = new IntCharSet();
    const size = this.intervals.size();
    
    for (let i = 0; i < size; ++i) {
      const iv = (<Interval>this.intervals.elementAt(i)).copy();
      result.intervals.addElement(iv);
    }
    
    return result;
  }
  
  getClass (): string {
    return 'IntCharSet';
  }
  
  private indexOf (c: JavaCharacter): number {
    let start = 0;
    let end = this.intervals.size() - 1;
    while (start <= end) {
      const check = (start + end) / 2;
      const i = <Interval>this.intervals.elementAt(check);
      if (start === end) {
        return i.contains(c) ? start : -1;
      }
      
      if (c.code < i.start.code) {
        end = check - 1;
      } else {
        if (c.code <= i.end.code) {
          return check;
        }
        
        start = check + 1;
      }
    }
    
    return -1;
  }
  
}
