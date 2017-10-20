export class PrintWriter {
  content: string[];
  length: number;
  
  constructor () {
    this.length = 0;
    this.content = [];
  }
  
  public println (line) {
    this.content[this.length] = line;
    this.length++;
  }
  
  public print (line) {
    this.content[this.length - 1] += line;
  }
}
