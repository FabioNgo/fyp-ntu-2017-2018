export class Symbol {
  public sym;
  public parse_state;
  used_by_parser;
  public left;
  public right;
  public value;
  
  public constructor (id, l?, r?, o?, state?) {
    this.sym = id;
    this.left = l;
    this.right = r;
    this.value = o;
    if (state) {
      this.used_by_parser = false;
      this.parse_state = state;
    }
  }
  
  
  public toString () {
    return '#' + this.sym;
  }
  
}
