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
  
  public toString () {
    let out = '';
    for (let i = 0; i < this.length; i++) {
      out = out + this.content[i] + '\n';
    }
  }
}
