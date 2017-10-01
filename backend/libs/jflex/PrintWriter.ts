export class PrintWriter {
  out: string;
  
  constructor () {
    this.out = '';
  }
  
  public println (line) {
    this.out += (line + '\n');
  }
  
  public print (line) {
    this.out += line;
  }
}
