export class Symbol {
  public sym = 0;
  public parse_state = 0;
  used_by_parser = false;
  public left = 0;
  public right = 0;
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
