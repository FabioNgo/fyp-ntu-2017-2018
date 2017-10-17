import {IntCharSet} from './IntCharSet';
import {Interval} from './Interval';
import {JavaCharacter} from '../JavaCharacter';
import {JavaVector} from '../JavaVector';
import {CharClassInterval} from './CharClassInterval';

export class CharClasses {
  readonly DEBUG = false;
  maxChar = '\uffff';
  classes: JavaVector<IntCharSet>;
  maxCharUsed: JavaCharacter;
  
  public constructor (maxCharCode: number) {
    if (maxCharCode >= 0 && maxCharCode <= 65535) {
      this.maxCharUsed = new JavaCharacter(maxCharCode);
      this.classes = new JavaVector<IntCharSet>();
      this.classes.addElement(new IntCharSet(new Interval(new JavaCharacter('\u0000'), new JavaCharacter('\uffff'))));
    } else {
      throw new Error('IllegalArgumentException');
    }
  }
  
  public getMaxCharCode () {
    return this.maxCharUsed.code;
  }
  
  public setMaxCharCode (charCode: number) {
    if (charCode >= 0 && charCode <= 65535) {
      this.maxCharUsed = new JavaCharacter(charCode);
    } else {
      throw Error('IllegalArgumentException');
    }
  }
  
  public getNumClasses (): number {
    return this.classes.size();
  }
  
  
  public getClassCode (letter: JavaCharacter): number {
    let i = -1;
  
    let x: IntCharSet;
    do {
      ++i;
      x = <IntCharSet>this.classes.elementAt(i);
    } while (!x.contains(letter));
    
    return i;
  }
  
  public toString (theClass?: number): string {
    if (theClass) {
      return this.classes.elementAt(theClass).toString();
    } else {
      let result = 'CharClasses:';
      
      for (let i = 0; i < this.classes.size(); ++i) {
        result = result + ('class ' + i + ':' + this.classes.elementAt(i));
      }
      
      return result.toString();
    }
    
  }
  
  public makeClass (input, caseless: boolean) {
    if (input instanceof JavaCharacter) {
      this.makeClass(new IntCharSet(input), caseless);
      return;
    }
    if (input instanceof String) {
      for (let i = 0; i < input.length; ++i) {
        this.makeClass(input.charAt(i), caseless);
      }
      return;
    }
    if (input instanceof JavaVector) {
      this.makeClass(new IntCharSet(input), caseless);
      return;
    }
    if (input instanceof IntCharSet) {
      let set = <IntCharSet>input;
      if (caseless) {
        set = set.getCaseless();
      }
      
      const oldSize = this.classes.size();
      
      for (let i = 0; i < oldSize; ++i) {
        const x = <IntCharSet>this.classes.elementAt(i);
        if (x.equals(set)) {
          return;
        }
        
        const and = x.and(set);
        if (and.containsElements()) {
          if (x.equals(and)) {
            set.sub(and);
          } else {
            if (set.equals(and)) {
              x.sub(and);
              this.classes.addElement(and);
              return;
            }
            
            set.sub(and);
            x.sub(and);
            this.classes.addElement(and);
          }
        }
      }
    }
    
  }
  
  public makeClassNot (v: JavaVector<Interval>, caseless: boolean) {
    this.makeClass(new IntCharSet(v), caseless);
  }
  
  public getNotClassCodes (intervalVec: JavaVector<Interval>): Array<Number> {
    return this.getClassCodes(new IntCharSet(intervalVec), true);
  }

// public getClassCodes(intervalVec: JavaVector<Interval>): Array<Number> {
//   return this.getClassCodes(new IntCharSet(intervalVec), false);
// }
  
  public check () {
    for (let i = 0; i < this.classes.size(); ++i) {
      for (let j = i + 1; j < this.classes.size(); ++j) {
        const x = <IntCharSet> this.classes.elementAt(i);
        const y = <IntCharSet> this.classes.elementAt(j);
        if (x.and(y).containsElements()) {
          console.log('Error: non disjoint char classes ' + i + ' and ' + j);
          console.log('class ' + i + ': ' + x);
          console.log('class ' + j + ': ' + y);
        }
      }
    }
    
    for (let c = 0; c < '\uffff'.charCodeAt(0); ++c) {
      this.getClassCode(new JavaCharacter(c));
      if (c % 100 === 0) {
        console.log('.');
      }
    }
    
    this.getClassCode(new JavaCharacter('\uffff'));
  }
  
  public getIntervals (): Array<CharClassInterval> {
    const size = this.classes.size();
    let numIntervals = 0;
    
    let i;
    for (i = 0; i < size; ++i) {
      numIntervals += (<IntCharSet>this.classes.elementAt(i)).numIntervals();
    }
    
    const result = [];
    i = 0;
    
    let iv;
    for (let c = 0; i < numIntervals; c = iv.end.code + 1) {
      const code = this.getClassCode(new JavaCharacter(c));
      const set = <IntCharSet>this.classes.elementAt(code);
      iv = set.getNext();
      result[i++] = new CharClassInterval(iv.start, iv.end, code);
    }
    
    return result;
  }
  
  public getClassCodes (set, negate?: boolean): Array<Number> {
    const size = this.classes.size();
    const temp = new Array<Number>(size);
    let length = 0;
    
    for (let i = 0; i < size; ++i) {
      const x = <IntCharSet>this.classes.elementAt(i);
      if (negate) {
        if (!set.and(x).containsElements()) {
          temp[length++] = i;
        }
      } else if (set.and(x).containsElements()) {
        temp[length++] = i;
      }
    }
    
    let result = new Array<Number>(length);
    
    result = result.copyWithin(0, 0, length);
    return result;
  }
}
