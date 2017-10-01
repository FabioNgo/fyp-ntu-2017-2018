import {JavaObject} from '../JavaObject';
import {JavaCharacter} from '../JavaCharacter';

export class Interval {
  start: JavaCharacter; // character
  end: JavaCharacter;
  
  constructor (start: JavaCharacter, end: JavaCharacter) {
    this.start = start;
    this.end = end;
  }
  
  public contains (other): boolean {
    if (other instanceof Interval) {
      return this.start <= other.start && this.end >= other.end;
    }
    if (other instanceof JavaCharacter) {
      return this.start <= other && this.end >= other;
    }
    
  }
  
  public getClass () {
    return 'Interval';
  }
  
  public hashCode (): number {
    return Number.parseInt(this.start.value + this.end.value);
  }
  
  public equals (o: JavaObject): boolean {
    if (!(o instanceof Interval)) {
      return false;
    } else {
      
      return o.start === this.start && o.end === this.end;
    }
  }
  
  public setEnd (end: JavaCharacter) {
    this.end = end;
  }
  
  public setStart (start: JavaCharacter) {
    this.start = start;
  }
  
  public toString (): string {
    let result = '[';
    if (this.isPrintable(this.start)) {
      result = result + ('\'' + this.start + '\'');
    } else {
      result += this.start;
    }
    if (this.start !== this.end) {
      result += '-';
      if (this.isPrintable(this.end)) {
        result = result + ('\'' + this.end + '\'');
      } else {
        result += this.end;
      }
    }
    
    result += ']';
    return result.toString();
  }
  
  public copy (): Interval {
    return new Interval(this.start, this.end);
  }
  
  private isPrintable (c: JavaCharacter): boolean {
    return c.code > 31 && c.code < 127;
  }
}
