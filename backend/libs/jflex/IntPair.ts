export class IntPair {
  start;
  end;
  
  constructor (start, end) {
    this.start = start;
    this.end = end;
  }
  
  public hashCode () {
    return this.end + (this.start << 8);
  }
  
  public equals (o) {
    if (!(o instanceof IntPair)) {
      return false;
    } else {
      const p = <IntPair>o;
      return this.start === p.start && this.end === p.end;
    }
  }
  
  public toString () {
    return '(' + this.start + ',' + this.end + ')';
  }
}
